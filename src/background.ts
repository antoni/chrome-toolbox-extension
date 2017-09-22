// Battery check interval [ms]
const BATTERY_CHECK_INTERVAL = 25000;
const THRESHOLD_DEFAULT = 0.20;

// How often should Youtube window be queried in background
// to check if video is paused [ms]
const YOUTUBE_PAUSE_CHECK_INTERVAL = 500;

// Fix for Battery APIs not supported by TypeScript
interface Navigator {
    getBattery(): Promise<any>;
}

// TODO: Fixme
interface Window {
    Notification: boolean;
}

function show() {
    const time = /(..)(:..)/.exec(new Date().toLocaleString()) as any;    // Prettyprinted time
    const hour = time[1] % 12 || 12;                                    // Prettyprinted hour
    const period = time[1] < 12 ? "a.m." : "p.m.";                      // Period of the day
    new Notification(hour + time[2] + " " + period, {
        body: "Battery level low. Please connect the power supply.",
        icon: "img/48.png",
    });
}

// Conditionally initialize the options
if (!localStorage.isInitialized) {
    localStorage.isActivated = true;   // Display activation
    localStorage.frequency = 1;        // Display frequency, in minutes
    localStorage.isInitialized = true; // Option initialization
}

// Test for notification support
if (window.Notification) {
    let interval = 0; // Display interval, in minutes

    setInterval(() => {
        interval++;
        const threshold = localStorage.percentage === undefined ? THRESHOLD_DEFAULT : localStorage.percentage / 100.0;

        navigator.getBattery().then((battery) => {
            if (!battery.charging && battery.level < threshold) {
                show();
            }
        });
    }, BATTERY_CHECK_INTERVAL);
}

setInterval(() => {
    chrome.tabs.query({ currentWindow: true, index: 0 }, (tabs) => {
        if (tabs.length > 0) {
            chrome.tabs.executeScript(tabs[0].id, { code: 'document.getElementsByClassName("video-stream")[0].paused' },
                (isPaused) => localStorage.isYoutubePaused = isPaused[0] ? "true" : "false",
            );
        }
    });
}, YOUTUBE_PAUSE_CHECK_INTERVAL);
