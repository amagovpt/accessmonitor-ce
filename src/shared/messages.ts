import type { CounterResult } from '@qualweb/counter';
import type { Report, Summary } from '../utils/types';
import type {
  AuditReport,
  EvaluationInput,
  ProcessedReport,
  TestDetails,
} from './types';

/** Map action -> payload (`message`) and response (`sendResponse`). */
export interface MessageMap {
  startEvaluation: { payload: undefined; response: Summary };
  getHTML: { payload: undefined; response: string };
  evaluateACT: { payload: undefined; response: Report };
  evaluateWCAG: { payload: undefined; response: Report };
  evaluateBP: { payload: undefined; response: Report };
  evaluateCounter: { payload: undefined; response: CounterResult };
  endingEvaluation: { payload: undefined; response: Summary };
  parseEvaluationReport: { payload: EvaluationInput; response: AuditReport };
  processReportData: {
    payload: { tot: AuditReport | null | undefined; url?: string };
    response: ProcessedReport | null;
  };
  getTestResults: {
    payload: { test: string; report: AuditReport };
    response: TestDetails;
  };
  /** `code`: CSS selector */
  highlightElement: { payload: string; response: boolean };
  highlightAllElements: { payload: string[]; response: boolean };
  unhighlightAllElements: { payload: string[]; response: boolean };
  updateCSVDataProcess: {
    payload: { newData: ProcessedReport; oldData: ProcessedReport };
    response: ProcessedReport;
  };
}

export type MessageAction = keyof MessageMap;

/** Discriminated union of all possible requests. */
export type ExtensionRequest = {
  [A in MessageAction]: MessageMap[A]['payload'] extends undefined
    ? { action: A; message?: undefined }
    : { action: A; message: MessageMap[A]['payload'] };
}[MessageAction];

export type ResponseOf<A extends MessageAction> = MessageMap[A]['response'];
export type PayloadOf<A extends MessageAction> = MessageMap[A]['payload'];
