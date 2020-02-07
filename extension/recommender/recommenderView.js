browser.runtime.onMessage.addListener(message => {
    if (message.type === "onRecommendablePage") {        
        const tooltip = document.createElement("div");
        tooltip.innerHTML = `
                <div id="initial-recommendation">
                    <div id="recommendation-dismiss">X</div>
                    <div id='recommendation-text'>Try asking Firefox Voice...<br/><b>"${message.recommendations[0]}"</b></div>
                </div>
                <div id="recommendation-extras">
                    <div id="extra-recs">
                        <div>Or you can say...</div>                    
                        <div><b>${message.recommendations[1]}</b></div>
                        <div><b>${message.recommendations[2]}</b></div>
                    </div>
                </div>
            `;
        tooltip.id = "recommendation-popup"

        document.body.prepend(tooltip);
        document.getElementById('recommendation-dismiss').addEventListener('click', function (event) {
            document.getElementById('recommendation-popup').classList += "dismissed";
        });
        document.getElementById('recommendation-text').addEventListener('mouseenter', function (event) {
            document.getElementById('recommendation-extras').classList = "show";
        });

        document.getElementById('recommendation-text').addEventListener('click', function (event) {
            document.getElementById('recommendation-popup').style.display = "none";
            browser.runtime.sendMessage({type: "triggerPopupFromRecommendation"});
        });
    }
});
