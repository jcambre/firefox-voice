import * as entityTypes from '../background/entityTypes.js';
import * as recommender from './recommender.js';

const TAB_SWITCH_THRESHOLD = 5;

export let tabState;
export let tabSwitchCounter = {};

export function resetState() {
    tabState = {
        onCommentEnabledPage: false,
        onAddBookmark: false,
        onSwitchTab: false,
        onMusic: false,
        isAudible: false,
        isNotAudible: true,
        onAnyBangService: false,
        onComplexNavigation: false,
        justUsedFirefoxVoice: false,
        isArticle: false,
        onSearch: false,
        onCurrentTabClose: false,
        onNewTab: false,
        onPinTab: false,
        onZoomIn: false,
        onZoomOut: false,
        params: {},
        url: ''
    }
}


export async function handleTabUpdate(tabId, changeInfo, tabInfo) {
    // Only report once
    if ((tabInfo.status == "complete" && changeInfo.status) || 'audible' in changeInfo ) {
        resetState(); // This might be a little bit too harsh / not catch the cases where audio continues to play in a different tab, etc.
        const currentTabUrl = new URL(tabInfo.url);
        tabState.url = tabInfo.url;

        if (tabInfo.audible) {
            tabState.audible = true;
            tabState.isNotAudible = false;
        }
        if (tabInfo.pinned) {
            tabState.onPinTab = true;
        }

        if (tabInfo.isArticle || tabInfo.isInReaderMode) {
            tabState.isArticle = true;
        } else if (currentTabUrl.href.includes("https://www.google.com/search")) {
            tabState.onSearch = true;
            tabState.params = {query: currentTabUrl.searchParams.get('q')};
        } else if (isMusicService(currentTabUrl.hostname)) {
            tabState.onMusic = true;
            tabState.params = {service: currentTabUrl.hostname};
        } else if (entityTypes.allServiceNames.map(name => name.replace(/ /g,'')).includes(currentTabUrl.hostname)) {
            tabState.onAnyBangService = true;
            tabState.params = {service: currentTabUrl.hostname};
        } else if (currentTabUrl.hostname.includes("reddit") || currentTabUrl.hostname.includes("hackernews")) {
            tabState.onCommentEnabledPage = true;
        }

        await recommender.recommendIfApplicable(tabId, tabState);
        // await browser.storage.local.clear();
        await logCurrentState();
    }
}

browser.bookmarks.onCreated.addListener((id, bookmarkDetails) => {
    tabState.onAddBookmark = true;
    tabState.params = {title: bookmarkDetails.title};
});

browser.tabs.onZoomChange.addListener(zoomChangeInfo => {
    if (zoomChangeInfo.newZoomFactor > zoomChangeInfo.oldZoomFactor) {
        // User zoomed in
        tabState.onZoomIn = true;
    } else {
        tabState.onZoomOut = true;
    }
});

// Perhaps only listen to these events when 
browser.tabs.onActivated.addListener(async (activeInfo) => {
    const tabId = activeInfo.tabId;
    tabSwitchCounter[activeInfo.windowId] = tabSwitchCounter[activeInfo.windowId] || {}
    let numSwitchesToTab = tabSwitchCounter[activeInfo.windowId][tabId] || 0;
    
    console.log(numSwitchesToTab);
    tabSwitchCounter[activeInfo.windowId][tabId] = ++numSwitchesToTab;
    if (numSwitchesToTab > TAB_SWITCH_THRESHOLD) {
        // Should determine some sort of title / identifier for the tab to suggest. Can either take the page title and use everything before the first " - ", or try using the og:site_name
        await recommender.recommendIfApplicable(tabId, tabState);
    }
});

// browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
//     const tabInfo = await browser.tabs.get(tabId);
//     if (tabInfo.active) {
//         tabState.onCurrentTabClose = [true, {}];
//     }
// });

async function logCurrentState() {
    let log = (await browser.storage.local.get("activityRecommendationLog"))["activityRecommendationLog"];
    if (!log) {
        log = {}
    }
    const timestamp = Date.now().toString();
    log[timestamp] = tabState;
    await browser.storage.local.set({"activityRecommendationLog": log});
}

function isMusicService(url) {
    let musicServices = entityTypes.musicServiceNames;
    const doesHostContainEachService = musicServices.map(name => (url).includes(name));
    return doesHostContainEachService.some(service => service); // returns true if at least one of the service names is found within the host name
}