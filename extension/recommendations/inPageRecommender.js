let recommendation;
browser.runtime.onMessage.addListener(message => {
    if (message.type === "onRecommendablePage") {  
        recommendation = document.createElement("iframe");
        recommendation.id = "fx-voice-recommendation-iframe"
        recommendation.src = browser.runtime.getURL("./recommendations/recommendation.html");
        document.body.prepend(recommendation);
    } else if (message.type === "dismissRecommendation") {
        console.log("huh")
        recommendation.style.display = "none";
    }
});