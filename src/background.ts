// Battery check interval [ms]
const CHECK_INTERVAL = 15000
const THRESHOLD_DEFAULT = 0.20

// Fix for Battery APIs not supported by TypeScript
interface Navigator {
    getBattery(): Promise<any>
}

// TODO: Fixme
interface Window {
    Notification: boolean
}

function show() {
    var time = <any>/(..)(:..)/.exec(new Date().toLocaleString());    // Prettyprinted time
    var hour = time[1] % 12 || 12;                                    // Prettyprinted hour
    var period = time[1] < 12 ? 'a.m.' : 'p.m.';                      // Period of the day
    new Notification(hour + time[2] + ' ' + period, {
        icon: 'img/48.png',
        body: 'Battery level low. Please connect the power supply.'
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
    var interval = 0; // Display interval, in minutes

    setInterval(function () {
        interval++;
        let threshold = localStorage.percentage == undefined ? THRESHOLD_DEFAULT : localStorage.percentage / 100.0;

        navigator.getBattery().then(function (battery) {
            if (!battery.charging && battery.level < threshold) {
                show();
            }
        });
    }, CHECK_INTERVAL);
}
