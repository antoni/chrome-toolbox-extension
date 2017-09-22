import * as $ from "jquery";
import * as html2canvas from "html2canvas";
import * as jspdf from "jspdf";

const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;
const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;

// Max time between 2 subsequent key presses to be qualified as double timem
const KEYPRESS_BETWEEN = 200

let escKeyPressed = false;

const goBackInTab = (tabId: number) => {
    chrome.tabs.executeScript(tabId, { code: "window.history.back()" });
};

document.addEventListener("DOMContentLoaded", () => {
    setupYoutubeControls();

    // const screenshot = document.getElementById("screenshot");
    // screenshot.addEventListener("click", () => {
        // html2canvas(document.body).then(function(canvas) {
        // document.body.appendChild(canvas);
        // });
        // html2canvas($("#canvas"), {
        //     onrendered: function(canvas) {         
        //         var imgData = canvas.toDataURL(
        //             'image/png');              
        //         var doc = new jsPDF('p', 'mm');
        //         doc.addImage(imgData, 'PNG', 10, 10);
        //         doc.save('sample-file.pdf');
        //     }
        // });
        // chrome.runtime.openOptionsPage();
    // });

    const link = document.getElementById("options");
    link.addEventListener("click", () => {
        chrome.runtime.openOptionsPage();
    });

    function updateBatteryStatus(battery) {
        document.querySelector("#level").textContent = (battery.level * 100).toFixed(2) + "%";
        document.querySelector("#charging").textContent =
            battery.charging ? (battery.level === 1 ? "" : "(charging)") : "(discharging)";

        let dischargingTime = 0.0;

        if (!battery.charging) {
            dischargingTime = (battery.dischargingTime / 60);
        }

        document.querySelector("#dischargingTime").textContent = "";

        if (!(battery.charging || dischargingTime === Infinity)) {
            const getTime = (minTime: number) => {
                const hours = minTime / 60;
                const minutes = minTime % 60;
                if (minutes > 0) { return `${hours.toFixed(0)}:${minutes.toFixed(0)}`; }
                return `${minutes.toFixed(0)}min`;
            };
            document.querySelector("#dischargingTime").textContent = getTime(dischargingTime);
        }
    }

    navigator.getBattery().then((battery) => {
        // Update the battery status initially when the promise resolves ...
        updateBatteryStatus(battery);

        battery.onchargingchange = () => { updateBatteryStatus(battery); };
        battery.onlevelchange = () => { updateBatteryStatus(battery); };
        battery.ondischargingtimechange = () => { updateBatteryStatus(battery); };
    });

    // Search

    const websiteSearch = (searchURL, query) => {
        chrome.tabs.create({ url: searchURL + query });
    };

    // YouTube Search
    $("#yt_search_query").keypress((e) => {
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            const searchURL = "https://www.youtube.com/results?search_query=";
            websiteSearch(searchURL, $("#yt_search_query").val());

            return false;
        }
    });

    // LinkedIn Search
    $("#li_search_query").keypress((e) => {
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            const searchURL = "https://www.linkedin.com/search/results/index/?keywords=";
            websiteSearch(searchURL, $("#li_search_query").val());
            return false;
        }
    });

    // GMail compose
    $("#gmail_recipient").keypress((e) => {
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            const recipient = $("#gmail_recipient").val();
            const accountNo = localStorage.accountNo === undefined ? 0 : localStorage.accountNo;
            // https://mail.google.com/mail/?view=cm&fs=1&
            // to=${recipient}&su=SUBJECT&body=BODY&bcc=someone.else@example.com
            const composeURL = `https:\/\/mail.google.com/mail/u/${accountNo}/?view=cm&fs=1&to=${recipient}`;
            chrome.tabs.create({ url: composeURL });
            return false;
        }
    });

    // JIRA
    const jiraOpts = JSON.parse(localStorage.jiraOptions);

    const baseURL = jiraOpts.baseURL;
    const projectId = jiraOpts.pid;
    const issueType = jiraOpts.issueType;
    const priority = jiraOpts.priority;
    const ticketPrefix = jiraOpts.ticketPrefix;

    // Add JIRA bug
    $("#jira_bug_summary").keypress((e) => {
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            const bugSummary = $("#jira_bug_summary").val();
            const url = `https:\/\/${baseURL}\/secure\/CreateIssueDetails!`
                + `init.jspa?pid=${projectId}&summary=${bugSummary}&issuetype=`
                + `${issueType}&priority=${priority}`;
            chrome.tabs.create({ url });
            return false;
        }
    });

    // Open JIRA ticket
    $("#jira_ticket_id").keypress((e) => {
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            const searchURL = `https:\/\/${baseURL}/browse/${ticketPrefix}`;
            websiteSearch(searchURL, $("#jira_ticket_id").val());
            return false;
        }
    });
});

const setupYoutubeControls = () => {
    // Controls
    const PLAY_PAUSE_BUTTON = "ytp-play-button";
    const PREV_BUTTON = "ytp-prev-button";
    const ytControlsClassNames = [PREV_BUTTON, PLAY_PAUSE_BUTTON, "ytp-next-button"];
    const extControlsIds = ["skip_previous", "play_pause", "skip_next"];

    const capturedKeys = [KEY_LEFT_ARROW, KEY_SPACE, KEY_RIGHT_ARROW];

    const keyDispatch: { [keyCode: number]: (() => any) } = {};

    const setupPlayPauseIcon = () => {
        const iconName = localStorage.isYoutubePaused === "true" ?
            "play_arrow" :
            "pause";

        const controlLink = document.getElementById(extControlsIds[1] + "_link");
        controlLink.innerHTML =
            '<i id="play_pause" class="large material-icons cyan-text text-darken-3">'
            + iconName
            + "</i>";
    };

    chrome.tabs.query({ currentWindow: true, index: 0 }, (tabs) => {

        const getVideoTitle = (keyCode) => {
            // Execute '>>' and '<<' with delay (give YouTube time to reload the page)
            const timeout = (keyCode === undefined || keyCode === KEY_SPACE) ? 0 : 2000;
            setTimeout(() => {
                // Now playing
                chrome.tabs.executeScript(tabs[0].id,
                    { code: 'document.getElementsByTagName("title")[0].innerHTML' }, (result) => {
                        const getSongTitle = (title) => title.slice(0, title.length - 1).join("-");
                        document.getElementById("now_playing").innerText = getSongTitle(result[0].split("-"));

                    });
            }, timeout);
        };

        ytControlsClassNames.forEach((className, idx) => {
            const control = document.getElementById(extControlsIds[idx] + "_link");
            const keyCodeDispatcher = () => {

                let noSuchButtonHandler = () => { (0); };

                if (className === PLAY_PAUSE_BUTTON) {
                    localStorage.isYoutubePaused = (localStorage.isYoutubePaused === "true" ? "false" : "true");
                    setupPlayPauseIcon();
                } else if (className === PREV_BUTTON) {
                    noSuchButtonHandler = () => goBackInTab(tabs[0].id);
                }

                chrome.tabs.executeScript(tabs[0].id,
                    {
                        code: 'var d=document.getElementsByClassName("'
                        + className
                        + '")[0];d.click();"aria-disabled" in d.attributes \
                        && d.attributes["aria-disabled"].nodeValue === "true"',
                    },
                    (result) => { if (result[0]) { noSuchButtonHandler(); } },
                );

                getVideoTitle(capturedKeys[idx]);
            };
            control.addEventListener("click", keyCodeDispatcher);
            dispatchEvent[capturedKeys[idx]] = keyCodeDispatcher;

            getVideoTitle(undefined);
        });
    });

    const doublePressHandler = (event: Event): any => {

        const escKeypressHandler = (ev) => { (document.activeElement as HTMLElement).blur(); ev.preventDefault(); };

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
    setupPlayPauseIcon();
};
