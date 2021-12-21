import * as tf from '@tensorflow/tfjs-node';

import path from 'path';
import model from './model';
import data from './data';
import ui from './ui_mock';

interface INeuralProps {
    skip_training?: boolean;
    images_dir?: string;
    model_dir?: string;
}

export interface ITrainingParams {
    batchSizeFraction: number;
    denseUnits: number;
    epochs: number;
    learningRate: number;
    trainStatus: (status: string) => void;
};

const Neural = ({
    images_dir = "../Photoes",
    model_dir = "./src/Neural/models",
    skip_training = false
}: INeuralProps) => {

    const Model = new model();

    const args =  {
        images_dir,
        model_dir,
        skip_training,
        batch_size_fraction: 0.2,
        dense_units: 200,
        epochs: 200,
        learning_rate: 0.0001
    };

    if (!args.images_dir) {
        throw new Error("--images_dir not specified.");
    }

    if (!args.model_dir) {
        throw new Error("--model_dir not specified.");
    }

    async function init() {
        await data.loadLabelsAndImages(args.images_dir);

        console.time("Loading Model");
        await Model.init();
        console.timeEnd("Loading Model");
    }

    async function testModel() {
        console.log("Testing Model");
        await Model.loadModel(args.model_dir);

        if (Model.model) {
            console.time("Testing Predictions");
            console.log(Model.model.summary());

            let checkedImages = 0;
            let imageIndex = 0;
            data.labelsAndImages!.forEach(item => {
                const results: { filename: string; class: any; }[] = [];
                item.images.forEach((imgFilename: string) => {
                    // @ts-ignore
                    tf.tidy(() => {
                        const embeddings = data.dataset
                            ? data.getEmbeddingsForImage(imageIndex++)
                            : data.fileToTensor(imgFilename);

                        const predictions = Model.getPrediction(embeddings);
                        results.push({
                            filename: path.parse(imgFilename).base,
                            class: predictions.map(prediction => ` ${prediction.label}-${prediction.confidence.toFixed(2)}%`).toString()
                        });
                        checkedImages++;
                    });
                });
                console.dir({
                    label: item.label,
                    predictions: results
                });
            });
            console.timeEnd("Testing Predictions");
            const totalImages = data.labelsAndImages!
                .map(item => item.images.length)
                .reduce((p, c) => p + c);
            console.log(`Total Predicted: ${checkedImages} / ${totalImages}`);
        }
    }

    async function trainModel() {
        if (data.dataset?.images) {
            const trainingParams = {
                batchSizeFraction: args.batch_size_fraction,
                denseUnits: args.dense_units,
                epochs: args.epochs,
                learningRate: args.learning_rate,
                trainStatus: ui.trainStatus
            };

            const labels = data.labelsAndImages!.map(element => element.label);
            const trainResult = await Model.train(
                data.dataset,
                labels,
                trainingParams
            );
            console.log("Training Complete!");
            const losses = trainResult.history.loss;
            console.log(
                `Final Loss: ${Number(losses[losses.length - 1]).toFixed(5)}`
            );

            console.log(Model.model!.summary());
        } else {
            throw new Error("Must load data before training the model.");
        }
    }

    init()
        .then(async () => {
            await data.loadTrainingData(Model.decapitatedMobilenet!);
            console.log("Loaded Training Data");

            if (args.skip_training) return;

            try {
                await trainModel();

                await Model.saveModel(args.model_dir);
            } catch (error) {
                console.error(error);
            }
        })
        .then(() => {
            testModel();
        });
}

export default Neural;