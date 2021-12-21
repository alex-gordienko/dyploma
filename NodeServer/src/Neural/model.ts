import * as tf from "@tensorflow/tfjs-node";
import fse from 'fs-extra';
import path from "path";
import { ITrainingParams } from "./app";

// Loads mobilenet and returns a model that returns the internal activation
// we'll use as input to our classifier model.
async function loadDecapitatedMobilenet() {
    const mobilenet = await tf.loadLayersModel(
        "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json"
    );

    // Return a model that outputs an internal activation.
    const layer = mobilenet.getLayer("conv_pw_13_relu");
    return tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
}

class Model {
    public currentModelDirPath: string | null;
    public model: tf.Sequential | null;
    public decapitatedMobilenet: tf.LayersModel | null;
    public labels: string[] | null;

    constructor() {
        this.currentModelDirPath = null;
        this.decapitatedMobilenet = null;
        this.model = null;
        this.labels = null;
    }

    async init() {
        this.decapitatedMobilenet = await loadDecapitatedMobilenet();
    }

    // Creates a 2-layer fully connected model. By creating a separate model,
    // rather than adding layers to the mobilenet model, we "freeze" the weights
    // of the mobilenet model, and only train weights from the new model.
    buildRetrainingModel(denseUnits: number, numClasses: number, learningRate: number) {
        this.model = tf.sequential({
            layers: [
                // Flattens the input to a vector so we can use it in a dense layer. While
                // technically a layer, this only performs a reshape (and has no training
                // parameters).
                tf.layers.flatten({
                    inputShape: this.decapitatedMobilenet?.outputs[0].shape.slice(
                        1
                    )
                }),
                // Layer 1.
                tf.layers.dense({
                    units: denseUnits,
                    activation: 'softplus',
                    kernelInitializer: "varianceScaling",
                    useBias: true
                }),
                // Layer 2.
                tf.layers.dense({
                    units: denseUnits,
                    activation: 'hardSigmoid',
                    kernelInitializer: "varianceScaling",
                    useBias: true
                }),
                // Layer 3. The number of units of the last layer should correspond
                // to the number of classes we want to predict.
                tf.layers.dense({
                    units: numClasses,
                    kernelInitializer: "varianceScaling",
                    useBias: false,
                    activation: "softmax"
                })
            ]
        });

        // Creates the optimizers which drives training of the model.
        const optimizer = tf.train.adam(learningRate);
        // We use categoricalCrossentropy which is the loss function we use for
        // categorical classification which measures the error between our predicted
        // probability distribution over classes (probability that an input is of each
        // class), versus the label (100% probability in the true class)>
        this.model.compile({
            optimizer,
            loss: "categoricalCrossentropy"
        });
    }

    currentModelPath() {
        return this.currentModelDirPath;
    }

    getPrediction(x: any) {
        // Assume we are getting the embeddings from the decapitatedMobilenet
        let embeddings = x;
        // If the second dimension is 224, treat it as though it's an image tensor
        if (x.shape[1] === 224) {
            embeddings = this.decapitatedMobilenet ? this.decapitatedMobilenet.predict(x) : x;
        }
        // @ts-ignore
        const prediction = this.model?.predict(embeddings).dataSync();

        const top5 = Array.from(prediction)
                .map((p,i)=>{
                    return{
                        label: this.labels ? this.labels[i] : 'Labels not set',
                        confidence: (p as any).toFixed(3) * 100
                    }
                }).sort((a,b)=>{
                    return b.confidence - a.confidence
                }).splice(0,5);

        return top5
    }

    async loadModel(dirPath: string) {
        // @ts-ignore
        this.model = await tf.loadLayersModel(
            "file://" + dirPath + "/model.json"
        );
        this.labels = await fse
            .readJson(path.join(dirPath, "labels.json"))
            .then(obj => obj.Labels);

        this.currentModelDirPath = dirPath;
    }

    async saveModel(dirPath: string) {
        fse.ensureDirSync(dirPath);
        await this.model?.save("file://" + dirPath);
        await fse.writeJson(path.join(dirPath, "labels.json"), {
            Labels: this.labels
        });

        this.currentModelDirPath = dirPath;
    }

    /**
     * Sets up and trains the classifier.
     */
    async train(
        dataset: { images: tf.Tensor4D; labels: tf.Tensor<tf.Rank> },
        labels: string[],
        trainingParams: ITrainingParams
    ) {
        if (dataset === null || dataset.images === null) {
            throw new Error("Add some examples before training!");
        }

        this.labels = labels.slice(0);
        this.buildRetrainingModel(
            trainingParams.denseUnits,
            labels.length,
            trainingParams.learningRate
        );

        // We parameterize batch size as a fraction of the entire dataset because the
        // number of examples that are collected depends on how many examples the user
        // collects. This allows us to have a flexible batch size.
        const batchSize = Math.floor(
            dataset.images.shape[0] * trainingParams.batchSizeFraction
        );
        if (!(batchSize > 0)) {
            throw new Error(
                `Batch size is 0 or NaN. Please choose a non-zero fraction.`
            );
        }

        const shuffledIndices = new Int32Array(
            // @ts-ignore
            tf.util.createShuffledIndices(dataset.labels.shape[0])
        );

        // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
        console.time("Training Time");
        return this.model!.fit(
            dataset.images.gather(shuffledIndices),
            dataset.labels.gather(shuffledIndices),
            {
                batchSize,
                epochs: trainingParams.epochs,
                validationSplit: 0.15,
                callbacks: {
                    // @ts-ignore
                    onBatchEnd: async (batch, logs) => {
                        trainingParams.trainStatus(
                            "Loss: " + logs?.loss.toFixed(5)
                        );
                    },
                    // @ts-ignore
                    onTrainEnd: async logs => {
                        console.timeEnd("Training Time");
                    }
                }
            }
        );
    }
}

export default Model;
