import * as entityTypes from '../background/entityTypes.js';
import * as recommender from './recommender.js';

export let tabState;

export function resetState() {
    tabState = {
        onCommentEnabledPage: false,
        onAnyPage: false,
        onAddBookmark: false,
        onSwitchTab: false,
        onMusic: false,
        isAudible: false,
        isNotAudible: false,
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
        params: {}
    }
}



export async function handleTabUpdate(tabId, changeInfo, tabInfo) {
    // Only report once
    console.log("helloooo?", changeInfo);
    if ((tabInfo.status == "complete" && changeInfo.status) || ('audible' in changeInfo || 'attention' in changeInfo)) {
        resetState(); // This might be a little bit too harsh / not catch the cases where audio continues to play in a different tab, etc.

        // Perhaps these checks should be mutually exclusive? If the current tab is music, it's very likely not an article / search page as well
        // Might want to make this all a switch statement
        const currentTabUrl = new URL(tabInfo.url);
        checkSearch(currentTabUrl, tabInfo);
        
        checkIsArticle(tabInfo);

        checkCommentEnabledPages(currentTabUrl, tabInfo);
        checkIsMusic(currentTabUrl, tabInfo);
        checkIsDdgService(currentTabUrl, tabInfo);
        checkSwitchTabs(tabInfo);
        checkTabPin(tabInfo);

        await recommender.recommendIfApplicable(tabId);
    }
}

function checkSearch(url, tabInfo) {
    // I don't believe we support other search engines yet?
    if (url.href.includes("https://www.google.com/search")) {
        tabState.onSearch = true;
        tabState.params = {query: url.searchParams.get('q')};
        return true;
    }
    return false;    
}

function checkIsArticle(tabInfo) {
    if (tabInfo.isArticle || tabInfo.isInReaderMode) {
        tabState.isArticle = true;
        if (tabInfo.audible) {
            tabState.isAudible = true;
        } else {
            tabState.isNotAudible = true;
        }
        return true;
    }
    return false;
}

function checkIsDdgService(url, tabInfo) {
    const ddgServices = entityTypes.allServiceNames.map(name => name.replace(/ /g,''));
    if (ddgServices.includes(url.hostname)) {
        tabState.onAnyBangService = true;
    }
}

function checkCommentEnabledPages(url, tabInfo) {
    if (url.hostname.includes("reddit") || url.hostname.includes("hackernews")) {
        tabState.onCommentEnabledPage = true;
        return true;
    }
    return false;
}

function checkIsMusic(url, tabInfo) {
    if (entityTypes.musicServiceNames.includes(url.hostname)) {
        tabState.onMusic = true;
        if (tabInfo.audible) {
            tabState.isAudible = true;
        } else {
            tabState.isNotAudible = true;
        }
        return true;
    }
    return false;
}

function checkTabPin(tabInfo) {
    if (tabInfo.pinned) {
        tabState.onPinTab = true;
        return true;
    }
    return false;
}

function checkSwitchTabs(tabInfo) {
    if (tabInfo.lastAccessed > (1000 * 10)) {
        // switched back to a tab they last accessed more than 10 seconds ago -- this is going to get hit alllll the time
        tabState.onSwitchTab = true;
        tabState.params = {lastAccess: tabInfo.lastAccessed};
        return true;
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

// browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
//     const tabInfo = await browser.tabs.get(tabId);
//     if (tabInfo.active) {
//         tabState.onCurrentTabClose = [true, {}];
//     }
// });