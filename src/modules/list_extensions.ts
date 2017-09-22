// List all installed extensions
chrome.management.getAll(function (extInfos) {
    extInfos.forEach(function (ext) {
        console.log(JSON.stringify(ext));
    });
});
