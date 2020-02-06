console.log("I AM HERE");
browser.runtime.onMessage.addListener(message => {
    if (message.type === "onRecommendablePage") {        
        const span = document.createElement("div");
        span.innerHTML = `Try asking Firefox Voice...<br/><b>"${message.recommendation}"</b>`;
        span.id = "recommendation-popup"

        document.body.prepend(span);
    }
});
