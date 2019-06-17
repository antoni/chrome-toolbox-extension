// Executes history.back() in a given tab
export const goBackInTab = (tabId: number) =>
    chrome.tabs.executeScript(tabId, {code: 'window.history.back()'});

// Clears all notifications, including ones created by other extensions/apps
export const clearAllNotifications = () => {
  chrome.notifications.getAll(notificationIds => {
    if (notificationIds) {
      for (const notificationId in notificationIds) {
        if (notificationIds.hasOwnProperty(notificationId)) {
          console.log(notificationId);
        }
      }
    }
  });
};

// Search
export const websiteSearch = (searchURL: string, query: string) => {
  chrome.tabs.create({url: searchURL + query});
};

// Execute click() on an element in a given tab
export const executeClickInTab =
    (tabId: number, htmlElemId: string, errorCallback: () => void) => {
      chrome.tabs.executeScript(
          tabId,
          {
            code: 'var d=document.getElementById("' + htmlElemId +
                '");d.click();d !== undefined'
          },
          result => {
            if (!result[0]) {
              errorCallback();
            }
          },
      );
    };