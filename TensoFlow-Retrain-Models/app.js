// @ts-check
const tf = require('@tensorflow/tfjs-node');

const minimist = require("minimist");
const path = require('path');
const model = require("./model");
const data = require("./data");
const ui = require("./ui_mock");

const Model = new model();

let args = minimist(process.argv.slice(2), {
    string: ["images_dir", "model_dir"],
    boolean: true,
    default: {
        skip_training: false,
        batch_size_fraction: 0.2,
        dense_units: 200,
        epochs: 200,
        learning_rate: 0.0001
    }
});

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
        data.labelsAndImages.forEach(item => {
            let results = [];
            item.images.forEach(img_filename => {
                // @ts-ignore
                tf.tidy(() => {
                    let embeddings = data.dataset
                        ? data.getEmbeddingsForImage(imageIndex++)
                        : data.fileToTensor(img_filename);

                    let predictions = Model.getPrediction(embeddings);
                    results.push({
                        // @ts-ignore
                        filename: path.parse(img_filename).base,
                        class: predictions.map(prediction=>` ${prediction.label}-${prediction.confidence.toFixed(2)}%`).toString()
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
        //console.log(mislabeled);
        const totalImages = data.labelsAndImages
            .map(item => item.images.length)
            .reduce((p, c) => p + c);
        console.log(`Total Mislabeled: ${checkedImages} / ${totalImages}`);
    }
}

async function trainModel() {
    if (data.dataset.images) {
        const trainingParams = {
            batchSizeFraction: args.batch_size_fraction,
            denseUnits: args.dense_units,
            epochs: args.epochs,
            learningRate: args.learning_rate,
            trainStatus: ui.trainStatus
        };

        const labels = data.labelsAndImages.map(element => element.label);
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

        console.log(Model.model.summary());
    } else {
        new Error("Must load data before training the model.");
    }
}

init()
    .then(async () => {
        await data.loadTrainingData(Model.decapitatedMobilenet);
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
