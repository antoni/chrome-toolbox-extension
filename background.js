// Battery check interval [ms]
CHECK_INTERVAL=15000
THRESHOLD_DEFAUT=0.20

function show() {
    var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
    var hour = time[1] % 12 || 12;               // The prettyprinted hour.
    var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
    new Notification(hour + time[2] + ' ' + period, {
        icon: 'img/48.png',
        body: 'Battery level low. Please connect the power supply.'
    });
}

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
    localStorage.isActivated = true;   // The display activation.
    localStorage.frequency = 1;        // The display frequency, in minutes.
    localStorage.isInitialized = true; // The option initialization.
}

// Test for notification support.
if (window.Notification) {
    var interval = 0; // The display interval, in minutes.

    setInterval(function() {
        interval++;
        threshold = localStorage.percentage == undefined ? THRESHOLD_DEFAUT : localStorage.percentage/100.0;

        navigator.getBattery().then(function(battery) {
            if (!battery.charging && battery.level < threshold) {
                show();
            }
        });
    }, CHECK_INTERVAL);
}
