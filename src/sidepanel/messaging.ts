import type { MessageAction, PayloadOf, ResponseOf } from '../shared/messages';
import type { AuditReport, EvaluationInput } from '../shared/types';
import type { ProcessedReport } from '../shared/types';

type SendArgs<A extends MessageAction> =
  PayloadOf<A> extends undefined ? [] : [message: PayloadOf<A>];

async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    throw new Error('No active tab found');
  }
  return tab;
}

function isMissingReceiver(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('Receiving end does not exist') ||
    message.includes('Could not establish connection')
  );
}

/** Injects into the tab the same scripts that the manifest declares in `content_scripts` */
async function injectContentScripts(tabId: number): Promise<void> {
  const files = (chrome.runtime.getManifest().content_scripts ?? []).reduce<
    string[]
  >((all, entry) => all.concat(entry.js ?? []), []);

  try {
    await chrome.scripting.executeScript({ target: { tabId }, files });
  } catch (error) {
    throw new Error(
      `Cannot inject the content script in this page: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

/**
 * Sends an action to the content script of the active tab and returns the typed response.
 * If the tab does not yet have the content script (page opened before the extension was
 * installed or updated), it injects it and retries sending once.
 * Rejects if there is no active tab or if the message or injection fails.
 */
export async function sendToActiveTab<A extends MessageAction>(
  action: A,
  ...args: SendArgs<A>
): Promise<ResponseOf<A>> {
  const tab = await getActiveTab();
  if (tab.id === undefined) {
    throw new Error('Active tab has no id');
  }

  const tabId = tab.id;
  const [message] = args;
  const send = () =>
    chrome.tabs.sendMessage<unknown, ResponseOf<A>>(tabId, {
      action,
      message,
    });

  try {
    return await send();
  } catch (error) {
    // Page might not have the content script yet (opened before extension installation/update)
    // In this case, inject the content scripts
    if (!isMissingReceiver(error)) {
      throw error;
    }
    await injectContentScripts(tabId);
    return send();
  }
}

// ---------- Active tab ----------

export async function getUrl(): Promise<string | undefined> {
  const tab = await getActiveTab();
  return tab.url;
}

// ---------- evaluation ----------

export const startEvaluation = () => sendToActiveTab('startEvaluation');
export const getHTML = () => sendToActiveTab('getHTML');
export const evaluateACT = () => sendToActiveTab('evaluateACT');
export const evaluateWCAG = () => sendToActiveTab('evaluateWCAG');
export const evaluateBP = () => sendToActiveTab('evaluateBP');
export const evaluateCounter = () => sendToActiveTab('evaluateCounter');
export const endingEvaluation = () => sendToActiveTab('endingEvaluation');

// ---------- Report ----------

export const parseEvaluationReport = (
  report: EvaluationInput,
): Promise<AuditReport> => sendToActiveTab('parseEvaluationReport', report);

export const processReportData = (
  tot: AuditReport | null | undefined,
  url?: string,
): Promise<ProcessedReport | null> =>
  sendToActiveTab('processReportData', { tot, url });

export const getTestResults = (test: string, report: AuditReport) =>
  sendToActiveTab('getTestResults', { test, report });

export const updateCSVDataProcess = (
  newData: ProcessedReport,
  oldData: ProcessedReport,
) => sendToActiveTab('updateCSVDataProcess', { newData, oldData });

// ---------- Highlight ----------

export const highlightElement = (code: string) =>
  sendToActiveTab('highlightElement', code);
export const highlightAllElements = (codes: string[]) =>
  sendToActiveTab('highlightAllElements', codes);
export const unhighlightAllElements = (codes: string[]) =>
  sendToActiveTab('unhighlightAllElements', codes);
