async function startEvaluation() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      }
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "startEvaluation" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          }
        );
      } else {
        reject(new Error("No active tab found"));
      }
    });
  });
}

async function getHTML() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getHTML" },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}

async function evaluateACT() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "evaluateACT" },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}

async function evaluateWCAG() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "evaluateWCAG" },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}

async function evaluateBP() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "evaluateBP" },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}

async function evaluateCounter() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "evaluateCounter" },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}

function endingEvaluation() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "endingEvaluation" },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}

async function getUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0].url);
    });
  });
}

async function updateCSVDataProcess(newData, oldData) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "updateCSVDataProcess", message: { newData: newData, oldData: oldData } },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}