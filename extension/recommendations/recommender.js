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
let recommendableIntents;

// Pruned, prioritized with scorecard on events
// why  do we need prioritization? -- think of examples for le paper
// adaptivity in learning science
// These are mostly proactive, based on their current state and what they COULD do next
const recommendationCriteria = {
  "aboutPage.changeComments": ["onCommentEnabledPage"],
  "aboutPage.comments": ["onCommentEnabledPage"],
  "bookmarks.create": ["onAddBookmark"],
  "bookmarks.open": ["onAddBookmark"],
  "find.find": ["onSwitchTab"],
  "music.focus": ["isAudible", "!onMusic"],
  "music.move": ["onMusic", "isAudible"],
  "music.pause": ["onMusic", "isAudible"],
  "music.play": ["onMusic", "isNotAudible"],
  "music.unpause": ["onMusic", "isNotAudible"],
  "muting.mute": ["isAudible"],
  "muting.unmute": ["onMusic", "isNotAudible"],
  "navigation.bangSearch": ["onAnyBangService"],
  "navigation.clearQueryDatabase": [],
  "navigation.goBack": [],
  "navigation.goForward": [],
  "navigation.navigate": [],
  "navigation.translate": [],
  "navigation.translateSelection": [],
  "nicknames.combined": [],
  "nicknames.name": [],
  "nicknames.nameLast": [],
  "nicknames.remove": [],
  "notes.add": [],
  "notes.addLink": [],
  "notes.setPlace": [],
  "notes.show": [],
  "print.print": [],
  "read.read": ["isArticle", "isNotAudible"],
  "read.stopRead": ["isArticle", "isAudible"],
  "saving.save": [],
  "saving.showLastDownload": [],
  "scroll.bottom": [],
  "scroll.down": [],
  "scroll.top": [],
  "scroll.up": [],
  "search.next": [],
  "search.previous": [],
  "search.search": ["onSearch"],
  "search.searchPage": [],
  "search.show": [],
  "self.cancelIntent": [],
  "self.openIntentViewer": [],
  "self.openLexicon": [],
  "self.openOptions": [],
  "self.tellJoke": [],
  "speech.readTitle": [],
  "tabs.close": [],
  "tabs.duplicate": [],
  "tabs.fullScreen": [],
  "tabs.moveToWindow": [],
  "tabs.open": [],
  "tabs.openHomePage": [],
  "tabs.openPrivateWindow": [],
  "tabs.openWindow": [],
  "tabs.pin": ["onPinTab"],
  "tabs.reload": [],
  "tabs.saveAsPdf": [],
  "tabs.unpin": [],
  "tabs.zoomIn": ["onZoomOut"],
  "tabs.zoomOut": ["onZoomIn"],
  "tabs.zoomReset": []
};

// Random interval popup -- every 20, show the uncategorizable intents and say which of these would you use
// The Y is "which of these would you pick" -- only log on the Xs for which we have Ys (i.e. ) -- and only do this for proactive ones. for reactive, you can just listen to see if they did the action
// Collect reactive data by human: Which of these intents would be useful now? Try saying "volume up" next time. -- ask them to pick which one

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

async function displayNotification() {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.runtime.getURL("assets/images/favicons/icon-64.png"),
    "title": "Try asking Firefox Voice",
    "message": "Search for Bialetti"
  });
}

export async function recommendIfApplicable(tabId, tabState) {
  const timeSinceLastInvoked = Date.now() - lastRecommendationTime.all;
  if (timeSinceLastInvoked < RECOMMENDATION_INTERVAL) {
    return;
  }
  const latestRecTime = Date.now();
  lastRecommendationTime.all = latestRecTime;

  recommendableIntents = [];
  // Determine which intents apply to the current state. We should isolate the ones which have no state criteria (i.e. wildcard "recommend whenever" intents) from those that actually do match the current situation
  for (const [intent, criteria] of Object.entries(recommendationCriteria)) {
    let match = true;
    for (const criterion of criteria) {
      if (tabState[criterion] == false) {
        match = false;
      }
    }
    if (match) {
      console.log(`Intent ${intent} is a match for the current state!`);
    }
    recommendableIntents.push(intent);
  }

  await browser.pageAction.show(tabId);
  
  if (tabState.onSearch) {
    // await callAttentionToRecommendations(tabId);
    // await displayNotification();
  }
  getRecommendations();
  await browser.tabs.insertCSS(tabId, {file: "recommendations/recommendation-wrapper.css"})
  await browser.tabs.sendMessage(tabId, {type: "onRecommendablePage"});
}

export function getRecommendations() {
  console.log("CURRENT STATE", currentState.tabState);
  const randomIntent = recommendableIntents[Math.floor(Math.random() * recommendableIntents.length)];
  recommendations = intentExamples.getExamplesForIntent("search.search", {query: "coffee time"});  //currentState.tabState.params
  return recommendations;
}