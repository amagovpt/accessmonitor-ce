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

async function highlightAllElements(codes) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "highlightAllElements", message: codes },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}

async function unhighlightAllElements(codes) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "unhighlightAllElements", message: codes },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}