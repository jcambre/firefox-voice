/* globals browserUtil, React */
/* eslint-disable no-unused-vars */
// For some reason, eslint is not detecting that <Variable /> means that Variable is used

this.recommendationView = (function () {
    const exports = {};

    const { Component, useState, useEffect, PureComponent } = React;

    exports.recommendation = ({
        currentView,
        examples,
        onDismissRecommendationClick,
        onAcceptRecommendationClick
    }) => {
        const [inputValue, setInputValue] = useState(null);
        return (
            <div id="recommendation">
                <RecommendationHeader 
                    currentView={currentView} 
                />
                <RecommendationContent
                    currentView={currentView}
                    examples={examples}
                />
                <RecommendationActions
                    currentView={currentView}
                    onDismissRecommendationClick={onDismissRecommendationClick}
                    onAcceptRecommendationClick={onAcceptRecommendationClick}
                />
            </div>
        );
    };

    const RecommendationHeader = ({ currentView }) => {
        return (
            <h3>
                Firefox Voice can help you with that!
            </h3>
        );
    };

    const RecommendationContent = ({ currentView, examples }) => {
        return (
            <React.Fragment>
                <div>
                    Try asking Firefox Voice...
                </div>
                <div>
                    <b>"{examples[0]}"</b>
                </div>
            </React.Fragment>
        );
    };

    const RecommendationActions = ({ currentView, onDismissRecommendationClick, onAcceptRecommendationClick}) => {
        const onDismissClick = () => {
            onDismissRecommendationClick();
        }
        const onAcceptClick = () => {
            onAcceptRecommendationClick();
        }
        return (
            <div id="recommendation-actions">
                <div id="dismiss-recommendation" onClick={onDismissClick}>
                    Not Now
                </div>
                <div id="accept-recommendation" onClick={onAcceptClick}>
                    Try It Out
                </div>
            </div>
        );
    };

    return exports;
})();