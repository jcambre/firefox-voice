/* eslint-disable no-unused-vars */

/* globals React, speechCommands, log */
const {
  useState
} = React;
export const WakewordTraining = ({
  savedModels,
  onTrainExample,
  heyFirefoxExamples,
  nextSlidePleaseExamples,
  backgroundNoiseExamples,
  onDeleteExample,
  onStartTraining,
  onSaveTrainingData,
  onLoadTrainingExamples
}) => {
  const CLASSES_TO_TRAIN = [{
    name: "heyff",
    readableName: "Hey Firefox",
    examples: heyFirefoxExamples
  }, {
    name: "nextslideplease",
    readableName: "Next slide please",
    examples: nextSlidePleaseExamples
  }, {
    name: "_background_noise_",
    readableName: "Background noise",
    examples: backgroundNoiseExamples
  }];
  return /*#__PURE__*/React.createElement("div", {
    id: "wakeword-training-wrapper"
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(SelectModel, {
    savedModels: savedModels,
    onSaveTrainingData: onSaveTrainingData,
    onLoadTrainingExamples: onLoadTrainingExamples
  }), /*#__PURE__*/React.createElement(Trainer, {
    classesToTrain: CLASSES_TO_TRAIN,
    onTrainExample: onTrainExample,
    onDeleteExample: onDeleteExample,
    onStartTraining: onStartTraining
  }), /*#__PURE__*/React.createElement(Tester, null)));
};

const Header = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "settings-content"
  }, /*#__PURE__*/React.createElement("fieldset", {
    id: "header"
  }, /*#__PURE__*/React.createElement("legend", null, "Wakeword Training for Firefox Voice"), /*#__PURE__*/React.createElement("div", null, "Firefox Voice currently expects two wakewords: \"Hey Firefox\" and \"Next slide please.\" This interface allows you to train a custom model that will listen for those keywords through transfer learning from an underlying model trained on the Google Speech Commands dataset.")));
};

const SelectModel = ({
  savedModels,
  onSaveTrainingData,
  onLoadTrainingExamples
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "settings-content"
  }, /*#__PURE__*/React.createElement("fieldset", {
    id: "model-name"
  }, /*#__PURE__*/React.createElement("legend", null, "You currently have the following models saved:"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, savedModels.toString())), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SaveTrainingExamples, {
    onSaveTrainingData: onSaveTrainingData
  }), /*#__PURE__*/React.createElement(LoadTrainingExamples, {
    onLoadTrainingExamples: onLoadTrainingExamples
  }))));
};

const SaveTrainingExamples = ({
  onSaveTrainingData
}) => {
  const saveExamples = () => {
    const data = onSaveTrainingData(); // pattern for triggering download from speech-commands/demo/index.js

    const anchor = document.createElement("a");
    anchor.download = `training_examples_${Date.now().toString()}.bin`;
    anchor.href = window.URL.createObjectURL(new Blob([data], {
      type: "application/octet-stream"
    }));
    anchor.click();
  };

  return /*#__PURE__*/React.createElement("div", {
    class: "save-examples"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: saveExamples
  }, "Save training examples to file"));
};

const LoadTrainingExamples = ({
  onLoadTrainingExamples
}) => {
  const loadTrainingExamples = async e => {
    const files = document.querySelector("#dataset-file-input").files;

    if (files === null || files.length !== 1) {
      throw new Error("Must select exactly one file.");
    }

    const datasetFileReader = new FileReader();

    datasetFileReader.onload = event => {
      try {
        onLoadTrainingExamples(event.target.result);
      } catch (err) {
        log.error(err.message);
      }
    };

    datasetFileReader.onerror = () => log.error(`Failed to binary data from file '${files[0].name}'.`);

    datasetFileReader.readAsArrayBuffer(files[0]);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "file",
    id: "dataset-file-input"
  }), /*#__PURE__*/React.createElement("button", {
    id: "upload-dataset",
    onClick: loadTrainingExamples
  }, "\u2191 Upload dataset"));
};

const Trainer = ({
  onTrainExample,
  classesToTrain,
  onDeleteExample,
  onStartTraining
}) => {
  return /*#__PURE__*/React.createElement("div", {
    class: "settings-content"
  }, /*#__PURE__*/React.createElement("fieldset", {
    id: "trainer"
  }, /*#__PURE__*/React.createElement("legend", null, "Record training examples for each wakeword"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "You should aim to record at least 40 examples per wakeword."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Settings (hard-coded): "), "Duration = 2x, including audio waveform, and mixing in noise for training.")), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    class: "training-class"
  }, "Class to train"), /*#__PURE__*/React.createElement("th", {
    class: "record"
  }, "Record"), /*#__PURE__*/React.createElement("th", null, "Existing recordings")), classesToTrain.map(function (cls) {
    return /*#__PURE__*/React.createElement(TrainingClass, {
      classItem: cls,
      key: cls.name,
      onTrainExample: onTrainExample,
      onDeleteExample: onDeleteExample
    });
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TrainingInitiator, {
    onStartTraining: onStartTraining
  }))));
};

const TrainingClass = ({
  classItem,
  onTrainExample,
  onDeleteExample
}) => {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(-1);

  const setIndex = index => {
    setCurrentExampleIndex(index);
  };

  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, classItem.readableName), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ExampleRecorder, {
    word: classItem.name,
    onTrainExample: onTrainExample,
    numExamples: classItem.examples.length,
    setIndex: setIndex
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(TrainingExamples, {
    examples: classItem.examples,
    currentExampleIndex: currentExampleIndex,
    setIndex: setIndex,
    onDeleteExample: onDeleteExample
  })));
};

const TrainingInitiator = ({
  onStartTraining
}) => {
  const [trainingEpochs, setTrainingEpochs] = useState(25);
  const [fineTuningEpochs, setFineTuningEpochs] = useState(5);
  const [augmentWithNoise, setAugmentWithNoise] = useState(true);

  const changeTrainingEpochs = num => {
    setTrainingEpochs(num);
  };

  const changeFineTuningEpochs = num => {
    setFineTuningEpochs(num);
  };

  const changeAugmentWithNoise = shouldAugment => {
    setAugmentWithNoise(shouldAugment);
  };

  const handleStartTraining = async e => {
    const eventTarget = e.target;
    const originalText = eventTarget.innerText;
    eventTarget.innerText = "Training...";
    eventTarget.disabled = true;
    const trainingOptions = {
      epochs: parseInt(trainingEpochs),
      fineTuningEpochs: parseInt(fineTuningEpochs),
      augmentByMixingNoiseRatio: augmentWithNoise * 0.5
    };
    await onStartTraining(trainingOptions);
    eventTarget.innerText = originalText;
    eventTarget.disabled = false;
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", null, "Training parameters"), /*#__PURE__*/React.createElement("p", null, "The example model that was demoed the week of June 8 was trained with 50 examples each for \"Hey Firefox\" and \"Next slide please,\" and 10 examples of background noise."), /*#__PURE__*/React.createElement("p", null, "The training parameters were set to 25 epochs, with 5 fine-tuning epochs and augmentation with noise enabled."), /*#__PURE__*/React.createElement("div", {
    class: "training-options"
  }, /*#__PURE__*/React.createElement(TrainingEpochs, {
    trainingEpochs: trainingEpochs,
    changeTrainingEpochs: changeTrainingEpochs
  }), /*#__PURE__*/React.createElement(FineTuningEpochs, {
    fineTuningEpochs: fineTuningEpochs,
    changeFineTuningEpochs: changeFineTuningEpochs
  }), /*#__PURE__*/React.createElement(NoiseAugmentation, {
    augmentWithNoise: augmentWithNoise,
    changeAugmentWithNoise: changeAugmentWithNoise
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleStartTraining,
    className: "styled-button wakeword"
  }, "Start Training"));
};

const TrainingEpochs = ({
  trainingEpochs,
  changeTrainingEpochs
}) => {
  const handleChange = num => {
    changeTrainingEpochs(num);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "training-container"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "training",
    className: "label-training"
  }, "Number of training epochs:"), /*#__PURE__*/React.createElement("input", {
    id: "training",
    className: "styled-input wakeword",
    type: "text",
    placeholder: "25",
    onChange: event => handleChange(event.target.value),
    value: trainingEpochs
  }));
};

const FineTuningEpochs = ({
  fineTuningEpochs,
  changeFineTuningEpochs
}) => {
  const handleChange = num => {
    changeFineTuningEpochs(num);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "fine-tuning-container"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fine-tuning",
    className: "label-fine-tuning"
  }, "Number of fine-tuning epochs:"), /*#__PURE__*/React.createElement("input", {
    id: "fine-tuning",
    className: "styled-input wakeword",
    type: "text",
    placeholder: "5",
    onChange: event => handleChange(event.target.value),
    value: fineTuningEpochs
  }));
};

const NoiseAugmentation = ({
  augmentWithNoise,
  changeAugmentWithNoise
}) => {
  const handleChange = shouldAugment => {
    changeAugmentWithNoise(shouldAugment);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "augmentation-container"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "augmentation",
    className: "label-augmentation"
  }, "Augment with noise:"), /*#__PURE__*/React.createElement("input", {
    id: "augmentation",
    type: "checkbox",
    placeholder: "5",
    onChange: event => handleChange(event.target.value),
    checked: augmentWithNoise
  }));
};

const ExampleRecorder = ({
  word,
  onTrainExample,
  numExamples,
  setIndex
}) => {
  const recordExample = async e => {
    const eventTarget = e.target;
    eventTarget.classList.add("active");
    await onTrainExample(word);
    eventTarget.classList.remove("active");
    setIndex(numExamples);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    class: "collect-example-button",
    onClick: recordExample
  }, /*#__PURE__*/React.createElement("div", {
    class: "recording-inner-circle"
  })));
};

const TrainingExamples = ({
  examples,
  currentExampleIndex,
  setIndex,
  onDeleteExample
}) => {
  const handleExampleBack = () => {
    setIndex(currentExampleIndex - 1);
  };

  const handleExampleForward = () => {
    setIndex(currentExampleIndex + 1);
  };

  const handleDelete = () => {
    const example = examples[currentExampleIndex];
    handleExampleBack();
    onDeleteExample(example);
  };

  return /*#__PURE__*/React.createElement("div", {
    class: "loaded-examples"
  }, /*#__PURE__*/React.createElement("div", {
    class: "example-tally"
  }, currentExampleIndex >= 0 ? `${currentExampleIndex + 1} of ${examples.length}` : "No recordings"), currentExampleIndex >= 0 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ExampleView, {
    example: examples[currentExampleIndex]
  }), /*#__PURE__*/React.createElement("div", {
    class: "example-navigation"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleExampleBack,
    disabled: currentExampleIndex - 1 < 0
  }, "\u2190"), /*#__PURE__*/React.createElement("button", {
    onClick: handleExampleForward,
    disabled: currentExampleIndex + 1 === examples.length
  }, "\u2192"), /*#__PURE__*/React.createElement("button", {
    onClick: handleDelete
  }, "x"))) : null);
};

const ExampleView = ({
  example
}) => {
  log.info(example);

  const handleExamplePlay = e => {
    const eventTarget = e.target;
    eventTarget.disabled = true;
    speechCommands.utils.playRawAudio(example.example.rawAudio, () => eventTarget.disabled = false);
  };

  return /*#__PURE__*/React.createElement("button", {
    class: "play-example",
    onClick: handleExamplePlay
  }, /*#__PURE__*/React.createElement("span", {
    role: "img",
    "aria-label": "play button"
  }, "\u25B6\uFE0F"), " ", "Play");
};

const Tester = () => {
  return null;
};