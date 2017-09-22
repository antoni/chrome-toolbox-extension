# Chrome Toolbox

Personal Chrome extension, which started as a battery status monitor and later
developed into a toolbox with some usable features.

### Current feature list:

 * Battery level information (Ctrl+Shift+X shortcut) using
   [Battery Status API](https://developer.mozilla.org/en/docs/Web/API/Battery_Status_API)
 * Notifications shown when batter level drops below specified level
 * Search shortcuts: YouTube, LinkedIn
 * Launching GMail compose window directly

### TODO

- [x] Add YouTube controls
- [ ] Popup when YouTube is not open as the first tab of the current window
- [ ] GMail compose - add recipients file: `~/.config/toolbox/gmail_recipients.json`
- [ ] Take whole-page screenshot: https://stackoverflow.com/a/6678156/963881
- [x] Add `history.back()` when YouTube `<` key is not present: `chrome.tabs.executeScript(null,{"code": "window.history.back()"});`
- [ ] Fix `3:7` battery rem. time
- [ ] Add extended description on Chrome Web Store

### Download

The extension is available to download (currently in a truncated form, stripped
to battery status) on
[Chrome Web Store](https://chrome.google.com/webstore/detail/battery-status/mkgjkmnombicipbhnmdgjfefkdncofdo).
