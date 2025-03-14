export function AddPopupRedirect() {
  chrome.action.onClicked.addListener(async () => {
    console.log("Popup clicked");
    await chrome.tabs.create({ url: chrome.runtime.getURL("dashboard/index.html") });
  });
}

