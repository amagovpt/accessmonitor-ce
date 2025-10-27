import { locale_en } from '../locales/en';
import { addValuesToSummary } from '../utils/evaluationHelpers';
import { Summary } from '../utils/types';
import { getTestRslts, parseEvaluation, processData } from './evaluation/middleware';
import { updateCSVProcData } from './evaluation/csv';
import { highlightAllElmnts, highlightElmnt, unhighlightAllElmnts } from './interact/highlight';
import { executeCounter } from "@qualweb/counter";

let summary: Summary = { passed: 0, failed: 0, warning: 0, inapplicable: 0, title: document.title };

// Main message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "startEvaluation":
      summary = { passed: 0, failed: 0, warning: 0, inapplicable: 0, title: document.title };
      sendResponse(summary);
      break;
    case "getHTML":
      const htmlResult = getHTML();
      sendResponse(htmlResult);
      break;
    case "evaluateACT":
      const actResult = evaluateACT();
      sendResponse(actResult);
      break;
    case "evaluateWCAG":
      const wcagResult = evaluateWCAG();
      sendResponse(wcagResult);
      break;
    case "evaluateBP":
      const bpResult = evaluateBP();
      sendResponse(bpResult);
      break;
    case "evaluateCounter":
      const counterResult = evaluateCounter();
      sendResponse(counterResult);
      break;
    case "endingEvaluation":
      sendResponse(summary);
      break;
    case "parseEvaluationReport":
      const report = parseEvaluation(request.message);
      sendResponse(report);
      break;
    case "processReportData":
      const { tot, url } = request.message;
      const data = processData(tot, url);
      sendResponse(data);
      break;
    case "getTestResults":
      const { test, nodes, tt } = request.message;
      const testResults = getTestRslts(test, nodes, tt);
      sendResponse(testResults);
      break;
    case "highlightElement":
      const state = highlightElmnt(request.message);
      sendResponse(state);
      break;    
    case "highlightAllElements":
      const highlighted = highlightAllElmnts(request.message);
      sendResponse(highlighted);
      break;
    case "unhighlightAllElements":
      const unhighlighted = unhighlightAllElmnts(request.message);
      sendResponse(unhighlighted);
      break;
    case "updateCSVDataProcess":
      const { newData, oldData } = request.message;
      const updatedData = updateCSVProcData(newData, oldData);
      sendResponse(updatedData);
      break;
    default:
      console.error("Unknown action:", request.action);
  }
});

function getHTML() {
  let sourceHtml = document.documentElement.outerHTML;
  return sourceHtml;
}

function evaluateACT() {
  let actResult;
  let sourceHtml = document.documentElement.outerHTML;

  console.log("Testing ACT");

  window.act = new ACTRulesRunner({ translate: locale_en, fallback: locale_en });

  window.act.test({ sourceHtml });
  actResult = window.act.getReport();

  console.log(actResult);

  addValuesToSummary(summary, actResult);

  return actResult;
}

function evaluateWCAG() {
  let wcagResult;

  console.log("Testing WCAG");
  
  window.wcag = new WCAGTechniquesRunner({ translate: locale_en, fallback: locale_en });
  let sourceHtml = document.documentElement.outerHTML;

  wcagResult = window.wcag.test({sourceHtml}).getReport();

  console.log(wcagResult);
  
  addValuesToSummary(summary, wcagResult);
  
  return wcagResult;
}

function evaluateBP() {
  let bpResult;

  console.log("Testing BP");
  
  window.bp = new BestPracticesRunner({ translate: locale_en, fallback: locale_en });
  let sourceHtml = document.documentElement.outerHTML;

  bpResult = window.bp.test({sourceHtml}).getReport();

  console.log(bpResult);
  
  addValuesToSummary(summary, bpResult);
  
  return bpResult;
}

function countElements(tags) {
  let totalElems = 0;

  for (const val of tags) {
    totalElems += val;
  }

  return totalElems;
}

function evaluateCounter() {
  let counterResult;

  console.log("Running Counter");

  let sourceHtml = document.documentElement.outerHTML;
  counterResult = executeCounter({sourceHtml});

  counterResult.elementCount = countElements(Object.values(counterResult?.data?.tags));

  console.log(counterResult);
  
  return counterResult;
}
