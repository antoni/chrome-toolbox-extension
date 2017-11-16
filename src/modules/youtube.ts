import { YoutubeTabCallback } from "../types";
import { goBackInTab } from "./utils"
import { KEY_LEFT_ARROW, KEY_SPACE, KEY_RIGHT_ARROW, KEY_ESCAPE, KEYPRESS_BETWEEN } from "../constants";

const getVideoTitle = (keyCode, youtubeTab) => {
    // Execute '>>' and '<<' with delay (give YouTube time to reload the page)
    const timeout = (keyCode === undefined || keyCode === KEY_SPACE) ? 0 : 2000;
    setTimeout(() => {
        // Now playing
        chrome.tabs.executeScript(youtubeTab.id,
            { code: 'document.getElementsByTagName("title")[0].innerHTML' }, (result) => {
                const getSongTitle = (title) => title.slice(0, title.length - 1).join("-");
                document.getElementById("now_playing").innerText = getSongTitle(result[0].split("-"));

            });
    }, timeout);
}

// chrome.tabs.Tab :
export const checkForYoutubeTab = (tabs : chrome.tabs.Tab[], tabCallback : YoutubeTabCallback = undefined) => {
    let youtubeTab = isYoutubeOpen(tabs, tabCallback);
    if (youtubeTab === undefined) {
        var $toastContent = $('<span>YouTube is not open in a first tab</span>').add($('<button id="toast-action" class="btn-flat toast-action">Open</button>'));
        Materialize.toast($toastContent, 3000);
        $("#toast-action").click(openYouTube);
    }
    return youtubeTab;
}

export const isYoutubeOpen = (tabs: chrome.tabs.Tab[], tabCallback : YoutubeTabCallback = undefined) => {
    for (let tab of tabs) {
        if (/^(https:\/\/.*youtube\.com.*)$/.test(tab.url)) {
            if(tabCallback !== undefined) {
                tabCallback(tab);
            }
            return tab;
        }
    }
    return undefined;
}

// Opens tab with YouTube as the first in the current window
export const openPlayerTab = () => {
    chrome.tabs.create({
        url: "https://youtube.com",
        index: 0,
        pinned: true,
        active: true
    }, undefined)
}

// TODO: Remove, move 'url' somewhere else
export const openYouTube = () => {
    chrome.tabs.create({
        index: 0,
        pinned: true,
        url: "https://www.youtube.com/playlist?list=FLsafKsgloNY1u4UW1AHYXnQ",
    }, undefined);
}

export const setupYoutubeControls = (escKeyPressed: boolean, youtubeTab: chrome.tabs.Tab, isYoutubePaused: string) => {
    // export const setupYoutubeControls = (storage : Storage, escKeyPressed: boolean, youtubeTab: chrome.tabs.Tab) => {
    // Controls
    const PLAY_PAUSE_BUTTON = "ytp-play-button";
    const PREV_BUTTON = "ytp-prev-button";
    const ytControlsClassNames = [PREV_BUTTON, PLAY_PAUSE_BUTTON, "ytp-next-button"];
    const extControlsIds = ["skip_previous", "play_pause", "skip_next"];

    const capturedKeys = [KEY_LEFT_ARROW, KEY_SPACE, KEY_RIGHT_ARROW];

    const keyDispatch: { [keyCode: number]: (() => any) } = {};

    let setupPlayPauseIcon = (isYoutubePaused) => {
        console.log("Paused: " + isYoutubePaused);
        const iconName = isYoutubePaused === "true" ?
            "play_arrow" :
            "pause";

        const controlLink = document.getElementById(extControlsIds[1] + "_link");
        controlLink.innerHTML =
            '<i id="play_pause" class="large material-icons cyan-text text-darken-3">'
            + iconName
            + "</i>";
    };

    ytControlsClassNames.forEach((className, idx) => {
        const control = document.getElementById(extControlsIds[idx] + "_link");
        const keyCodeDispatcher = () => {

            let noSuchButtonHandler = () => { (0); };

            if (className === PLAY_PAUSE_BUTTON) {
                isYoutubePaused = (isYoutubePaused === "true" ? "false" : "true");
                setupPlayPauseIcon(isYoutubePaused);
            } else if (className === PREV_BUTTON) {
                noSuchButtonHandler = () => goBackInTab(youtubeTab.id);
            }

            chrome.tabs.executeScript(youtubeTab.id,
                {
                    code: 'var d=document.getElementsByClassName("'
                    + className
                    + '")[0];d.click();"aria-disabled" in d.attributes \
                        && d.attributes["aria-disabled"].nodeValue === "true"',
                },
                result => { if (result[0]) { noSuchButtonHandler(); } },
            );

            getVideoTitle(capturedKeys[idx], youtubeTab);
        };
        control.addEventListener("click", keyCodeDispatcher);
        dispatchEvent[capturedKeys[idx]] = keyCodeDispatcher;

        getVideoTitle(undefined, youtubeTab);
    });

    const doublePressHandler = (event: Event): any => {

        const escKeypressHandler = ev => { (document.activeElement as HTMLElement).blur(); ev.preventDefault(); };

        // Handler detecting double Esc keypress
        if ((event as KeyboardEvent).keyCode === KEY_ESCAPE) {
            if (escKeyPressed) {             // Double click
                window.close();
            } else {                         // Single click
                escKeyPressed = true;

                escKeypressHandler(event);

                window.setTimeout(() => { escKeyPressed = false; }, KEYPRESS_BETWEEN);
            }
        } else {
            escKeyPressed = false;
            const source = event.target || event.srcElement;
            if ((event.target as Element).nodeName !== "INPUT") {
                const kc = (event as KeyboardEvent).keyCode;
                if (kc in dispatchEvent) {
                    dispatchEvent[kc]();
                    event.preventDefault();
                }
            }
        }
    };

    document.addEventListener("keydown", doublePressHandler);

    // Logo link
    document.getElementById("youtube_logo").addEventListener("click",
        () => chrome.tabs.create({ url: "https://youtube.com" }));

    // Correct play/pause icon on startup
    setupPlayPauseIcon(isYoutubePaused);
};