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

    let transferRecognizer = recognizer.createTransfer("todays-quicker-model");
    await transferRecognizer.load();


    // `listen()` takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields such a
    //    - includeSpectrogram
    //    - probabilityThreshold
    //    - includeEmbedding
    transferRecognizer.listen(result => {
        console.log(result);
        const words = transferRecognizer.wordLabels();
        console.log(words);
        // `result.scores` contains the scores for the new words, not the original
        // words.
        for (let i = 0; i < words.length; ++i) {
            console.log(`score for word '${words[i]}' = ${result.scores[i]}`);
        }
    // - result.scores contains the probability scores that correspond to
    //   recognizer.wordLabels().
    // - result.spectrogram contains the spectrogram of the recognized word.
    }, {
    includeSpectrogram: true,
    probabilityThreshold: 0.75
    });

    // // Stop the recognition in 10 seconds.
    // setTimeout(() => transferRecognizer.stopListening(), 10e3);
})();