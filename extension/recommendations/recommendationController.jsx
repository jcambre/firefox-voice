/* globals React, ReactDOM, util, settings, log, buildSettings, browserUtil, catcher, recommender */

this.popupController = (function() {
  const exports = {};

  const { useState, useEffect } = React;
  const recommendationContainer = document.getElementById("recommendation-container");
  let isInitialized = false;

  exports.RecommendationController = function() {
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

      const showMoreOnHover = function () {
          console.log("I AM HOVERING");
            isHovering = true;
      }

    return (
        <div id="recommendation-popup" onMouseEnter={showMoreOnHover}>
            <div id="initial-recommendation">
                <div id="recommendation-dismiss">X</div>
                <div id='recommendation-text'>Try asking Firefox Voice...<br/><b>"{examples[0]}"</b></div>
            </div>
            { isHovering &&
                <div id="recommendation-extras">
                    <div id="extra-recs">
                        <div>Or you can say...</div>                    
                        <div><b>{examples[1]}</b></div>
                        <div><b>{examples[2]}</b></div>
                    </div>
                </div>
            }

        </div>
    );
  };

  ReactDOM.render(<exports.RecommendationController />, recommendationContainer);

  return exports;
})();
