import { BATTERY_CHECK_INTERVAL, THRESHOLD_DEFAULT } from "./constants"

// Fix for Battery APIs not supported by TypeScript
declare global {
    interface Navigator {
        getBattery(): Promise<any>;
    }
    interface Window {
        Notification: boolean;
    }
}

function show() {
    const now = new Date();
    const time = /(..)(:..)/.exec(now.toLocaleString()) as any;    // Prettyprinted time
    const hour = time[1] % 12 || 12;                               // Prettyprinted hour
    const period = now.getHours() < 12 ? "a.m." : "p.m.";          // Period of the day
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
        let threshold = localStorage.percentage === undefined ? THRESHOLD_DEFAULT : localStorage.percentage / 100.0;
        console.log(threshold);

        navigator.getBattery().then(battery => {
            if (!battery.charging && battery.level < threshold) {
                show();
            }
        });
    }, BATTERY_CHECK_INTERVAL);
}