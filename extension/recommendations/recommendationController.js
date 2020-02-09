/* globals React, ReactDOM, util, settings, log, buildSettings, browserUtil, catcher, recommender */
this.popupController = function () {
  const exports = {};
  const {
    useState,
    useEffect
  } = React;
  const recommendationContainer = document.getElementById("recommendation-container");
  let isInitialized = false;

  exports.RecommendationController = function () {
    const [examples, setExamples] = useState([]);
    let isHovering = false;
    useEffect(() => {
      if (!isInitialized) {
        isInitialized = true;
        init();
      }
    });

    const init = async () => {
      const recommendations = await browser.runtime.sendMessage({
        type: "getRecommendations"
      }); // const recommendations = await recommender.getRecommendations();

      console.log(recommendations);
      setExamples(recommendations);
    };

    const showMoreOnHover = function () {
      console.log("I AM HOVERING");
      isHovering = true;
    };

    return React.createElement("div", {
      id: "recommendation-popup",
      onMouseEnter: showMoreOnHover
    }, React.createElement("div", {
      id: "initial-recommendation"
    }, React.createElement("div", {
      id: "recommendation-dismiss"
    }, "X"), React.createElement("div", {
      id: "recommendation-text"
    }, "Try asking Firefox Voice...", React.createElement("br", null), React.createElement("b", null, "\"", examples[0], "\""))), isHovering && React.createElement("div", {
      id: "recommendation-extras"
    }, React.createElement("div", {
      id: "extra-recs"
    }, React.createElement("div", null, "Or you can say..."), React.createElement("div", null, React.createElement("b", null, examples[1])), React.createElement("div", null, React.createElement("b", null, examples[2])))));
  };

  ReactDOM.render(React.createElement(exports.RecommendationController, null), recommendationContainer);
  return exports;
}();