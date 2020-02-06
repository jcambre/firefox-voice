browser.runtime.onMessage.addListener(message => {
    if (message.type === "onRecommendablePage") {        
        const span = document.createElement("div");
        span.innerHTML = `<div id="recommendation-dismiss">X</div><div id='recommendation-text'>Try asking Firefox Voice...<br/><b>"${message.recommendation}"</b></div>`;
        span.id = "recommendation-popup"

        document.body.prepend(span);
        document.getElementById('recommendation-dismiss').addEventListener('click', function (event) {
            document.getElementById('recommendation-popup').classList += "dismissed";
        });
    }
});
