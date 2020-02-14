/* globals browserUtil, React */

/* eslint-disable no-unused-vars */
// For some reason, eslint is not detecting that <Variable /> means that Variable is used
this.recommendationView = function () {
  const exports = {};
  const {
    Component,
    useState,
    useEffect,
    PureComponent
  } = React;

  exports.recommendation = ({
    currentView,
    examples,
    onDismissRecommendationClick,
    onAcceptRecommendationClick
  }) => {
    const [inputValue, setInputValue] = useState(null);
    return React.createElement("div", {
      id: "recommendation"
    }, React.createElement(RecommendationHeader, {
      currentView: currentView
    }), React.createElement(RecommendationContent, {
      currentView: currentView,
      examples: examples
    }), React.createElement(RecommendationActions, {
      currentView: currentView,
      onDismissRecommendationClick: onDismissRecommendationClick,
      onAcceptRecommendationClick: onAcceptRecommendationClick
    }));
  };

  const RecommendationHeader = ({
    currentView
  }) => {
    return React.createElement("h3", null, "Firefox Voice can help you with that!");
  };

  const RecommendationContent = ({
    currentView,
    examples
  }) => {
    return React.createElement(React.Fragment, null, React.createElement("div", null, "Try asking Firefox Voice..."), React.createElement("div", null, React.createElement("b", null, "\"", examples[0], "\"")));
  };

  const RecommendationActions = ({
    currentView,
    onDismissRecommendationClick,
    onAcceptRecommendationClick
  }) => {
    const onDismissClick = () => {
      onDismissRecommendationClick();
    };

    const onAcceptClick = () => {
      onAcceptRecommendationClick();
    };

    return React.createElement("div", {
      id: "recommendation-actions"
    }, React.createElement("div", {
      id: "dismiss-recommendation",
      onClick: onDismissClick
    }, "Not Now"), React.createElement("div", {
      id: "accept-recommendation",
      onClick: onAcceptClick
    }, "Try It Out"));
  };

  return exports;
}();