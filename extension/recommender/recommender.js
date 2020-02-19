import * as intentExamples from "../intentExamples.js";
import * as util from "../util.js";

const RECOMMENDATION_INTERVAL = 1000 * 10; // 10s for testing // 1000 * 60 * 60 * 6; // 6 hours
// TODO: Have a threshold for each recommendation types, and across all recommendations 
let lastRecommendationTime = {
  all: 0,
  articles: 0,
  music: 0,
  newTab: 0,
};

let recommendations;

export async function handleTabUpdate(tabId, changeInfo, tabInfo) {
    // Only report once
    console.log("WHAAAA");
    console.log(tabInfo);
    if (tabInfo.status == "complete" && changeInfo.status) {
        const timeSinceLastInvoked = Date.now() - lastRecommendationTime.all;
        if (timeSinceLastInvoked < RECOMMENDATION_INTERVAL) {
          return;
        }
        const latestRecTime = Date.now();
        lastRecommendationTime.all = latestRecTime;

        if (tabInfo.isArticle) {
            lastRecommendationTime.article = latestRecTime;
            recommendations = intentExamples.getExamplesForIntentCategory("read", 3);
        }

        // look for spotify addresses
        const currentTabUrl = new URL(tabInfo.url);
        if (currentTabUrl.hostname.includes("spotify")) {
          lastRecommendationTime.music = latestRecTime;
          recommendations = intentExamples.getExamplesForIntentCategory("music", 3);
        }

        if (currentTabUrl.hostname.includes("google") || currentTabUrl.hostname.includes("duckduckgo") ) {
          lastRecommendationTime.music = latestRecTime;
          recommendations = intentExamples.getExamplesForIntentCategory("search", 3);
        }

        // await browser.tabs.insertCSS(tabId, {file: "recommender/recommender.css"});
        // await browser.tabs.sendMessage(tabId, {type: "onRecommendablePage", recommendations});
        await browser.pageAction.show(tabId);
        await callAttentionToRecommendations(tabId);
    }
}

// This unfortunately won't work because content scripts can't modify privileged pages like about:newtab
// async function handleNewTab(tabInfo) {
//   lastRecommendationTime.all = 0;
//   // Only report once
//   console.log(tabInfo);
//   const example = intentExamples.getExamples(1)[0];
//   const allExamples = intentExamples.getExamplesForIntentCategory("music", 2);
//   console.log("MY EXAMPLE")
//   console.log(allExamples);
//   if (Date.now() - lastRecommendationTime.all < RECOMMENDATION_INTERVAL) {
//     return;
//   }

//   await browser.tabs.insertCSS(tabInfo.id, {file: "recommender/recommender.css"});
//   await browser.tabs.sendMessage(tabInfo.id, {type: "onRecommendablePage", recommendation: "Search for hiking in Denver"});            

// }


// browser.tabs.onUpdated.addListener(
//   handleRecommendations,
//   filter
// );

async function callAttentionToRecommendations(tabId) {
  // Flash the page action icon twice to call attention
  for (let i=0; i < 3; i++) {
    browser.pageAction.setIcon({
      tabId, path: "assets/images/favicons/page-icon-256-single-color-wiggle-left.png"
    });
    await util.sleep(80);
    browser.pageAction.setIcon({
      tabId, path: "assets/images/favicons/page-icon-256-single-color-wiggle-right.png"
    });
    await util.sleep(80);
  }
  browser.pageAction.setIcon({
    tabId, path: "assets/images/favicons/page-icon-256-single-color-center-active.png"
  });
} 
export function getRecommendations() {
  return recommendations;
}