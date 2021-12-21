import * as tf from "@tensorflow/tfjs-node";
import fg from "fast-glob";
import fse from "fs-extra";
import sharp from "sharp";
import path from "path";

async function fileToTensor(filename: string) {
    const { data, info } = await sharp(filename)
        .raw()
        .toBuffer({ resolveWithObject: true });

    return imageToTensor(data, info);
}

async function getDirectories(imagesDirectory: string) {
    return await fse.readdir(imagesDirectory);
}

async function getImagesInDirectory(directory: string) {
    return await fg([
        path.join(directory, "*.jpg"),
        path.join(directory, "*/*.jpg"),
        path.join(directory, "*.jpeg"),
        path.join(directory, "*/*.jpeg")
    ]);
}

const imageToTensor = (pixelData: Buffer, imageInfo: sharp.OutputInfo) => {
    const outShape = [1, imageInfo.height, imageInfo.width, imageInfo.channels] as [number, number, number, number];

    return tf.tidy(() =>
        tf
            .tensor4d(pixelData, outShape, "int32")
            .toFloat()
            .resizeBilinear([224, 224])
            .div(tf.scalar(127))
            .sub(tf.scalar(1))
    );
};

async function readImagesDirectory(imagesDirectory: string) {
    const directories = await getDirectories(imagesDirectory);
    const result = await Promise.all(
        directories.map(async directory => {
            const p = path.join(imagesDirectory, directory);
            return getImagesInDirectory(p).then(images => {
                return { label: directory, images };
            });
        })
    );

    return result;
}
class Data {
    public labelsAndImages: {
        label: string;
        images: string[];
    }[] | null;
    public dataset: {
        images: tf.Tensor4D,
        labels: tf.Tensor<tf.Rank>
    } | null;

    constructor() {
        this.dataset = null;
        this.labelsAndImages = null;
    }

    public getEmbeddingsForImage(index: number) {
        return this.dataset!.images.gather([index]);
    }

    public fileToTensor(filename: string) {
        return fileToTensor(filename);
    }

    public imageToTensor(image: Buffer, numChannels: sharp.OutputInfo) {
        return imageToTensor(image, numChannels);
    }

    public labelIndex(label: string) {
        return this.labelsAndImages ?
            this.labelsAndImages.findIndex(item => item.label === label)
            : -1;
    }

    async loadLabelsAndImages(imagesDirectory: string) {
        this.labelsAndImages = await readImagesDirectory(imagesDirectory);
    }

    async loadTrainingData(model: tf.LayersModel) {
        const numClasses = this.labelsAndImages ? this.labelsAndImages.length : 0;
        const numImages = this.labelsAndImages?.reduce(
            (acc, item) => acc + item.images.length,
            0
        ) || 0;

        const embeddingsShape = model.outputs[0].shape.slice(1) as number[];
        const embeddingsFlatSize = tf.util.sizeFromShape(embeddingsShape);
        embeddingsShape.unshift(numImages);
        const embeddings = new Float32Array(
            tf.util.sizeFromShape(embeddingsShape)
        );
        const labels = new Int32Array(numImages);

        // Loop through the files and populate the 'images' and 'labels' arrays
        let embeddingsOffset = 0;
        let labelsOffset = 0;
        console.log("Loading Training Data");
        console.time("Loading Training Data");
        for (const element of this.labelsAndImages!) {
            const labelIndex = this.labelIndex(element.label);
            for (const image of element.images) {
                const t = await fileToTensor(image);
                tf.tidy(() => {
                    const prediction = model.predict(t);
                    // @ts-ignore
                    embeddings.set(prediction.dataSync(), embeddingsOffset);
                    labels.set([labelIndex], labelsOffset);
                });
                t.dispose();

                embeddingsOffset += embeddingsFlatSize;
                labelsOffset += 1;
            }
            console.timeLog("Loading Training Data", {
                label: element.label,
                count: element.images.length
            });
        }

        this.dataset = {
            images: tf.tensor4d(embeddings, embeddingsShape as [number, number, number, number]),
            labels: tf.oneHot(tf.tensor1d(labels, "int32"), numClasses)
        };
    }
}

export default new Data();
