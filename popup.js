KEY_ENTER = '13';

document.addEventListener('DOMContentLoaded', function() {

    var link           = document.getElementById(      'options');
    link.addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });

    function updateBatteryStatus(battery) {
        document.querySelector('#level').textContent =  (battery.level * 100).toFixed(2) + '%';
        document.querySelector('#charging').textContent = battery.charging ? (battery.level === 1 ? '' : '(charging)') : '(discharging)';

        var dischargingTime = 0.0;
        if(!battery.charging)
            dischargingTime = (battery.dischargingTime / 60).toFixed(0);

        document.querySelector('#dischargingTime').textContent = (battery.charging || dischargingTime == Infinity) ? '' : (dischargingTime + ' min');
    }

    navigator.getBattery().then(function(battery) {
        // Update the battery status initially when the promise resolves ...
        updateBatteryStatus(battery);

        // .. and for any subsequent updates.
        battery.onchargingchange = function () {
            updateBatteryStatus(battery);
        };

        battery.onlevelchange = function () {
            updateBatteryStatus(battery);
        };

        battery.ondischargingtimechange = function () {
            updateBatteryStatus(battery);
        };
    });

    // Search

    let websiteSearch = (searchURL, query) => {
        chrome.tabs.create({ url: searchURL + query });
    }

    // YouTube Search
    $('#yt_search_query').keypress(function(e) { 
        if (e.keyCode == KEY_ENTER) { 
            e.preventDefault();
            const searchURL = "https://www.youtube.com/results?search_query="; 
            websiteSearch(searchURL, $('#yt_search_query').val());

            return false;
        } 
    });

    // LinkedIn Search
    $('#li_search_query').keypress(function(e) { 
        if (e.keyCode == KEY_ENTER) { 
            e.preventDefault();
            const searchURL = "https://www.linkedin.com/search/results/index/?keywords=";
            websiteSearch(searchURL, $('#li_search_query').val());
            return false;
        } 
    });

    // GMail compose
    $('#gmail_recipient').keypress(function(e) { 
        if (e.keyCode == KEY_ENTER) { 
            e.preventDefault();
            const recipient = $('#gmail_recipient').val(),
                  accountNo = localStorage.accountNo == undefined ? 0 : localStorage.accountNo,
                  // "https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=SUBJECT&body=BODY&bcc=someone.else@example.com
                  composeURL = `https:\/\/mail.google.com/mail/u/${accountNo}/?view=cm&fs=1&to=${recipient}`;
            chrome.tabs.create({ url: composeURL});
            return false;
        }
    });
});

