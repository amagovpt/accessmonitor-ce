async function parseEvaluationReport(report) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "parseEvaluationReport", message: report },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}

async function processReportData(tot, url) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "processReportData", message: { tot, url } },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}

async function getTestResults(test, nodes, tot) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { 
          action: "getTestResults",
          message: { test: test, nodes: nodes, tt: tot } 
        },
        (response) => {
          resolve(response);
        }
      );
    });
  });
}
