/* globals React, ReactDOM, log, buildSettings */

// import * as recommender from "./recommender.js";
// eslint isn't catching the JSX that uses recommendationView:
// eslint-disable-next-line no-unused-vars
import * as recommendationView from './recommendationView.js';

const { useState, useEffect } = React; 
const recommendationContainer = document.getElementById("recommendation-container");
let isInitialized = false;

export const RecommendationController = function () {
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

ReactDOM.render(<RecommendationController />, recommendationContainer);
