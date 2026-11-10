import { locale_en } from '../locales/en';
import { addValuesToSummary } from '../utils/evaluationHelpers';
import { Summary } from '../utils/types';
import {
  parseEvaluation,
  //parseEvaluation,
} from './evaluation/parser';
import { updateCSVProcData } from './evaluation/csv';
import {
  highlightAllElmnts,
  highlightElmnt,
  unhighlightAllElmnts,
} from './interact/highlight';
import { captureViewState, restoreViewState } from './interact/viewState';
import type { ViewState } from './interact/viewState';
import { executeCounter } from '@qualweb/counter';
import { processAuditReport } from './evaluation/preparer';
import { getTestDetails } from './evaluation/details';
import type { ExtensionRequest } from '../shared/messages';

// View state of the page before evaluation; restored in `endingEvaluation`
let viewState: ViewState | null = null;

let summary: Summary = {
  passed: 0,
  failed: 0,
  warning: 0,
  inapplicable: 0,
  title: document.title,
};

// Main message listener. With script reinjection (see sidepanel/messaging.ts) the
// file can run twice on the same page; only the first one registers the listener.
if (!window.__accessMonitorContentLoaded) {
  window.__accessMonitorContentLoaded = true;
  chrome.runtime.onMessage.addListener(
    (request: ExtensionRequest, sender, sendResponse) => {
      switch (request.action) {
        case 'startEvaluation':
          viewState = captureViewState();
          summary = {
            passed: 0,
            failed: 0,
            warning: 0,
            inapplicable: 0,
            title: document.title,
          };
          sendResponse(summary);
          break;
        case 'getHTML':
          const htmlResult = getHTML();
          sendResponse(htmlResult);
          break;
        case 'evaluateACT':
          const actResult = evaluateACT();
          sendResponse(actResult);
          break;
        case 'evaluateWCAG':
          const wcagResult = evaluateWCAG();
          sendResponse(wcagResult);
          break;
        case 'evaluateBP':
          const bpResult = evaluateBP();
          sendResponse(bpResult);
          break;
        case 'evaluateCounter':
          const counterResult = evaluateCounter();
          sendResponse(counterResult);
          break;
        case 'endingEvaluation':
          if (viewState) {
            restoreViewState(viewState);
            viewState = null;
          }
          sendResponse(summary);
          break;
        case 'parseEvaluationReport':
          const report = parseEvaluation(request.message);
          sendResponse(report);
          break;
        case 'processReportData':
          const { tot, url } = request.message;
          const data = processAuditReport(tot, url);
          sendResponse(data);
          break;
        case 'getTestResults':
          const { test, report: auditReport } = request.message;
          sendResponse(getTestDetails(test, auditReport));
          break;
        case 'highlightElement':
          const state = highlightElmnt(request.message);
          sendResponse(state);
          break;
        case 'highlightAllElements':
          const highlighted = highlightAllElmnts(request.message);
          sendResponse(highlighted);
          break;
        case 'unhighlightAllElements':
          const unhighlighted = unhighlightAllElmnts(request.message);
          sendResponse(unhighlighted);
          break;
        case 'updateCSVDataProcess':
          const { newData, oldData } = request.message;
          const updatedData = updateCSVProcData(newData, oldData);
          sendResponse(updatedData);
          break;
        default:
          console.error(
            'Unknown action:',
            (request as { action?: unknown }).action,
          );
      }
    },
  );
}

function getHTML() {
  let sourceHtml = document.documentElement.outerHTML;
  return sourceHtml;
}

function evaluateACT() {
  let actResult;
  let sourceHtml = document.documentElement.outerHTML;

  window.act = new ACTRulesRunner({
    translate: locale_en,
    fallback: locale_en,
  });

  window.act.test({ sourceHtml });
  actResult = window.act.getReport();

  addValuesToSummary(summary, actResult);

  return actResult;
}

function evaluateWCAG() {
  let wcagResult;

  window.wcag = new WCAGTechniquesRunner({
    translate: locale_en,
    fallback: locale_en,
  });
  let sourceHtml = document.documentElement.outerHTML;

  wcagResult = window.wcag.test({ sourceHtml }).getReport();

  addValuesToSummary(summary, wcagResult);

  return wcagResult;
}

function evaluateBP() {
  let bpResult;

  window.bp = new BestPracticesRunner({
    translate: locale_en,
    fallback: locale_en,
  });
  let sourceHtml = document.documentElement.outerHTML;

  bpResult = window.bp.test({ sourceHtml }).getReport();

  addValuesToSummary(summary, bpResult);

  return bpResult;
}

function countElements(tags: number[]) {
  let totalElems = 0;

  for (const val of tags) {
    totalElems += val;
  }

  return totalElems;
}

function evaluateCounter() {
  let counterResult;

  let sourceHtml = document.documentElement.outerHTML;
  counterResult = executeCounter({ sourceHtml });

  counterResult.elementCount = countElements(
    Object.values(counterResult?.data?.tags),
  );

  return counterResult;
}
