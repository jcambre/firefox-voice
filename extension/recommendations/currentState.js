import * as recommender from './recommender.js';
import * as serviceList from '../serviceList.js';

export let tabState;

export function resetState() {
    tabState = {
        onCommentEnabledPage: [
            false,
            {}
        ],
        onAnyPage: [
            false,
            {}
        ],
        afterAddBookmark: [
            false,
            {}
        ],
        afterScreenshot: [
            false,
            {}
        ],
        afterCopy: [
            false,
            {}
        ],
        afterSwitchTab: [
            false,
            {}
        ],
        onMusic: [
            false,
            {}
        ],
        isAudible: [
            false,
            {}
        ],
        isNotAudible: [
            false,
            {}
        ],
        onAnyBangService: [ 
            false,
            {}
        ],
        onComplexNavigation: [
            false,
            {}
        ],
        justUsedFirefoxVoice: [
            false,
            {}
        ],
        onPrint: [
            false,
            {}
        ],
        isArticle: [
            false,
            {}
        ],
        didRecentSearchWithFirefoxVoice: [
            false,
            {}
        ],
        onDefaultSearchEngine: [
            false,
            {}
        ],
        onCurrentTabClose: [
            false,
            {}
        ],
        onFullScreenMode: [
            false,
            {}
        ],
        onNewTab: [
            false,
            {}
        ],
        onPinTab: [
            false,
            {}
        ],
        onReload: [
            false,
            {}
        ],
        onSaveAsPDF: [
            false,
            {}
        ],
        onZoomIn: [
            false,
            {}
        ],
        onZoomOut: [
            false,
            {}
        ]
    }
}



export async function handleTabUpdate(tabId, changeInfo, tabInfo) {
    // Only report once
    console.log("helloooo?");
    if (tabInfo.status == "complete" && changeInfo.status) {
        resetState(); // This might be a little bit too harsh / not catch the cases where audio continues to play in a different tab, etc.

        checkIsArticle();

        const currentTabUrl = new URL(tabInfo.url);
        checkCommentEnabledPages(currentTabUrl);
        checkIsMusic(currentTabUrl);
        checkIsDdgService(currentTabUrl);

        await recommender.recommendIfApplicable(tabId);
    }
}

function checkIsArticle(tabInfo) {
    if (tabInfo.isArticle) {
        tabState.isArticle = [true, {}];
        if (tabInfo.isAudible) {
            tabState.isAudible = [true, {}];
        } else {
            tabState.isNotAudible = [true, {}];
        }
        return true;
    }
    return false;
}

function checkIsDdgService(url, tabInfo) {
    const ddgServices = serviceList.allServiceNames().map(name => name.replace(/ /g,''));
    if (ddgServices.includes(url.hostname)) {
        tabState.onAnyBangService = [true, {}];
    }
}

function checkCommentEnabledPages(url, tabInfo) {
    if (url.hostname.includes("reddit") || url.hostname.includes("hackernews")) {
        tabState.onCommentEnabledPage = [true, {}];
        return true;
    }
    return false;
}

function checkIsMusic(url, tabInfo) {
    if (serviceList.musicServiceNames().includes(url.hostname)) {
        tabState.onMusic = [true, {}];
        if (tabInfo.isAudible) {
            tabState.isAudible = [true, {}];
        } else {
            tabState.isNotAudible = [true, {}];
        }
        return true;
    }
    return false;
}

browser.bookmarks.onCreated.addListener((id, bookmarkDetails) => {
    tabState.afterAddBookmark = [true, {title: bookmarkDetails.title}];
});

browser.tabs.onZoomChange.addListener(zoomChangeInfo => {
    if (zoomChangeInfo.newZoomFactor > zoomChangeInfo.oldZoomFactor) {
        // User zoomed in
        tabState.onZoomIn = [true, {}];
    } else {
        tabState.onZoomOut = [true, {}];
    }
});

browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    const tabInfo = await browser.tabs.get(tabId);
    if (tabInfo.active) {
        tabState.onCurrentTabClose = [true, {}];
    }
});