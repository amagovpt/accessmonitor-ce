async function highlightElement(code) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "highlightElement", message: code },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}