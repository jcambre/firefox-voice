/* globals content */

const filter = {
  properties: ["isArticle", "status"]
}
 
async function handleUpdated(tabId, changeInfo, tabInfo) {
    // Only report once
    if (tabInfo.status == "complete" && changeInfo.status) {
        if (tabInfo.isArticle) {
            await browser.tabs.insertCSS(tabId, {file: "recommender/recommender.css"});
            await browser.tabs.sendMessage(tabId, {type: "onRecommendablePage", recommendation: "Read this page"});            
        }

        // look for spotify addresses
        const currentTabUrl = new URL(tabInfo.url);
        if (currentTabUrl.hostname.includes("spotify")) {
          await browser.tabs.insertCSS(tabId, {file: "recommender/recommender.css"});
          await browser.tabs.sendMessage(tabId, {type: "onRecommendablePage", recommendation: "Next song"});
        }
    }
}

browser.tabs.onUpdated.addListener(
  handleUpdated,
  filter
);