/* globals tf, speechCommands */

console.log('hello world');

(async function() {
    // When calling `create()`, you must provide the type of the audio input.
    // The two available options are `BROWSER_FFT` and `SOFT_FFT`.
    // - BROWSER_FFT uses the browser's native Fourier transform.
    // - SOFT_FFT uses JavaScript implementations of Fourier transform
    //   (not implemented yet).
    const recognizer = speechCommands.create('BROWSER_FFT');

    // Make sure that the underlying model and metadata are loaded via HTTPS
    // requests.
    await recognizer.ensureModelLoaded();

    // See the array of words that the recognizer is trained to recognize.
    console.log(recognizer.wordLabels());

    // let transferRecognizer = recognizer.createTransfer("yesterdays-model");
    // await transferRecognizer.load();

    const datasetFileInput = document.getElementById('dataset-file-input');
    const uploadFilesButton = document.getElementById('upload-dataset');
    uploadFilesButton.addEventListener('click', async () => {
        const files = datasetFileInput.files;
        if (files == null || files.length !== 1) {
          throw new Error('Must select exactly one file.');
        }
        const datasetFileReader = new FileReader();
        datasetFileReader.onload = async event => {
          try {
            await loadDatasetInTransferRecognizer(event.target.result);
          } catch (err) {
            console.log(err.message);
          }
        };
        datasetFileReader.onerror = () =>
            console.error(`Failed to binary data from file '${dataFile.name}'.`);
        datasetFileReader.readAsArrayBuffer(files[0]);
    });

    async function loadDatasetInTransferRecognizer(serialized) {
        transferRecognizer = recognizer.createTransfer("todays-quicker-model");
        transferRecognizer.loadExamples(serialized);
        console.log(transferRecognizer.countExamples());
        await theRest();
    }
    // await transferRecognizer.load();

    async function theRest() {
        await transferRecognizer.train({
            epochs: 25,
            validationSplit: 0.25,
            callback: {
            onEpochEnd: async (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
            }
            },
            fineTuningEpochs: 3
        });

        await transferRecognizer.save();
        
        // After the transfer learning completes, you can start online streaming
        // recognition using the new model.
        transferRecognizer.listen(result => {
        // - result.scores contains the scores for the new vocabulary, which
        //   can be checked with:
        const words = transferRecognizer.wordLabels();
        // `result.scores` contains the scores for the new words, not the original
        // words.
        for (let i = 0; i < words.length; ++i) {
            console.log(`score for word '${words[i]}' = ${result.scores[i]}`);
        }
        }, {probabilityThreshold: 0.75});
    }

    // `listen()` takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields such a
    //    - includeSpectrogram
    //    - probabilityThreshold
    //    - includeEmbedding
    // transferRecognizer.listen(result => {
    //     console.log(result);
    //     const words = transferRecognizer.wordLabels();
    //     console.log(words);
    //     // `result.scores` contains the scores for the new words, not the original
    //     // words.
    //     for (let i = 0; i < words.length; ++i) {
    //         console.log(`score for word '${words[i]}' = ${result.scores[i]}`);
    //     }
    // // - result.scores contains the probability scores that correspond to
    // //   recognizer.wordLabels().
    // // - result.spectrogram contains the spectrogram of the recognized word.
    // }, {
    // includeSpectrogram: true,
    // probabilityThreshold: 0.75
    // });

    // // Stop the recognition in 10 seconds.
    // setTimeout(() => transferRecognizer.stopListening(), 10e3);
})();