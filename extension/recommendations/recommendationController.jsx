/* globals React, ReactDOM, util, settings, log, buildSettings, browserUtil, catcher, recommender */

this.popupController = (function () {
    const exports = {};

    const { useState, useEffect } = React; 
    const recommendationContainer = document.getElementById("recommendation-container");
    let isInitialized = false;

    exports.recommendationController = function () {
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
            });
            // const recommendations = await recommender.getRecommendations();
            console.log(recommendations);
            setExamples(recommendations);
        }

        const onDismissRecommendationClick = async () => {
            // TODO: Log that the dismiss button was clicked
            window.close();
        };

        const onAcceptRecommendationClick = async () => {
            // TODO: Log that the dismiss button was clicked
            browser.runtime.sendMessage({type: "triggerPopupFromRecommendation"});
            window.close();
        };

        return (
            <recommendationView.recommendation
                examples={examples}
                onDismissRecommendationClick={onDismissRecommendationClick}
                onAcceptRecommendationClick={onAcceptRecommendationClick}
            />
        );
    };

    ReactDOM.render(<exports.recommendationController />, recommendationContainer);

    return exports;
})();
