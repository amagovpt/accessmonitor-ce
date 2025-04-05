import { locale_en } from '../locales/en';
import { addValuesToSummary } from '../utils/evaluationHelpers';
import { Summary } from '../utils/types';
import { getTestRslts, parseEvaluation, processData } from './evaluation/middleware';

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
  actResult =  window.act.getReport();

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
