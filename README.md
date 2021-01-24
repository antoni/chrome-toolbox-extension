# Chrome Toolbox

Personal Chrome extension, which started as a battery status monitor and later
developed into a toolbox with some usable features.

### Current feature list:

 * Battery level information (Ctrl+Shift+X shortcut) using
   [Battery Status API](https://developer.mozilla.org/en/docs/Web/API/Battery_Status_API)
 * Notifications shown when batter level drops below specified level
 * Search shortcuts: YouTube, LinkedIn
 * Launching GMail compose window directly
 * Sorting [Stackoverflow](https://stackoverflow.com/) answers by votes

### TODO

- [x] Add YouTube controls
- [x] Popup when YouTube is not open as the first tab of the current window
- [ ] Take whole-page screenshot: https://stackoverflow.com/a/6678156/963881
- [x] Add `history.back()` when YouTube `<` key is not present: `chrome.tabs.executeScript(null,{"code": "window.history.back()"});`
- [ ] Add extended description on Chrome Web Store
- [x] Add sorting [Stackoverflow](https://stackoverflow.com/) answers by votes
- [ ] Use https://github.com/google/ts-style
- [ ] Implement Zoom content script similar to: https://github.com/seanstar12/zoom-close
- [ ] Add Google Calendar link generation shortcut (see: gen_gcal_url.js)
- [ ] Save list of all installed extensions somewhere
- [ ] Chrome ext.: copy selection to new Google doc (https://support.google.com/a/users/answer/9308871?hl=en)
- [ ] Chrome extension: Open "Constants → Login" and (try to) autologin everywhere

### Download

The extension is available to download in a full form (all the features mentioned above) under [this link](https://chrome.google.com/webstore/detail/web-toolbox/hhfhbejhgcaopddclfdjoobophdjpdel).

It is also available in a truncated form (stripped to battery status) under [this link](https://chrome.google.com/webstore/detail/battery-status/mkgjkmnombicipbhnmdgjfefkdncofdo).
