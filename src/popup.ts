import * as $ from "jquery";
import * as html2canvas from "html2canvas";
import * as jspdf from "jspdf";
import { checkForYoutubeTab, isYoutubeOpen, openYouTube, openPlayerTab, setupYoutubeControls } from "./modules/youtube";
import { setupJiraControls } from "./modules/jira";
import { KEY_ENTER } from "./constants";
import { clearAllNotifications, websiteSearch } from "./modules/utils";

let escKeyPressed = false;

document.addEventListener("DOMContentLoaded", () => {

    // Workaround over Materialize's focus on first input field
    // (we want the focus on Play/Pause button)
    const FIRST_INPUT_FIELD_ID = "gmail_recipient"
    setTimeout(() => document.getElementById(FIRST_INPUT_FIELD_ID).blur(), 150);

    chrome.tabs.query({}, allTabs => {

        var isYoutubePaused: string;
        let youtubeTab = checkForYoutubeTab(allTabs, (tab: chrome.tabs.Tab) => {
            if (tab !== undefined) {
                chrome.tabs.executeScript(tab.id,
                    {
                        code: 'var d=document.getElementsByClassName("'
                        + 'ytp-play-button'
                        + '")[0];d.attributes["aria-label"].nodeValue === "Play";',
                    },
                    result => {
                        if (result[0]) { isYoutubePaused = "true"; }
                        setupYoutubeControls(escKeyPressed, youtubeTab, isYoutubePaused);
                    },
                );
            }
        });

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
                    if (minutes > 0) {
                        return (minutes < 10 ? '0' : '') + `${hours.toFixed(0)}:${minutes.toFixed(0)}`;
                    }
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

        setupJiraControls();
    });
})