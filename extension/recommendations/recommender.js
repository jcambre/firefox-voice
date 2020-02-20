import * as intentExamples from "../background/intentExamples.js";
import * as currentState from './currentState.js';
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

export async function recommendIfApplicable(tabId) {
  const timeSinceLastInvoked = Date.now() - lastRecommendationTime.all;
  if (timeSinceLastInvoked < RECOMMENDATION_INTERVAL) {
    return;
  }
  const latestRecTime = Date.now();
  lastRecommendationTime.all = latestRecTime;
  // lastRecommendationTime.article = latestRecTime;


  await browser.pageAction.show(tabId);
  await callAttentionToRecommendations(tabId);
  getRecommendations();
}

export function getRecommendations() {
  console.log("CURRENT STATE", currentState.currentState);
  return recommendations;
}