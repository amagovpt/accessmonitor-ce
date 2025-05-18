chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: "./sidepanel/sidepanel.html",
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab.id });
  } else {
    console.error("Tab ID not found.");
  }
});