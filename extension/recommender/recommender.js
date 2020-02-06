/* globals content */

const filter = {
  properties: ["isArticle", "status"]
}
 
async function handleUpdated(tabId, changeInfo, tabInfo) {
    // Only report once
    if (tabInfo.status == "complete" && changeInfo.status) {
        console.log("HEEERE");
        console.log(`Updated tab: ${tabId}`);
        console.log("Changed attributes: ", changeInfo);
        console.log("New tab Info: ", tabInfo);
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