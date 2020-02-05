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
            await browser.tabs.sendMessage(tabId, {type: "onRecommendablePage"});            
        }
    }
}

browser.tabs.onUpdated.addListener(
  handleUpdated,
  filter
);