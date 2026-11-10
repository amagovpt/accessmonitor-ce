import type { CounterResult } from '@qualweb/counter';
import type { processEvaluation } from '@a12e/accessmonitor-rulesets';

import type { Report } from '../utils/types';

// TODO(types): o pacote não exporta o QualwebReport; derivado do processEvaluation. Confirmar com o buildReport do sidepanel.
export type QualwebReport = Parameters<typeof processEvaluation>[0];

/**Contract for the evaluation input sent by the sidepanel to the content script
 *
 */
export interface EvaluationInput {
  system: {
    page: {
      dom: {
        html: string | undefined;
        title: string | undefined;
        elementCount: number | undefined;
      };
    };
    url: { completeUrl: string | null };
  };
  metadata: {
    passed: number | undefined;
    warning: number | undefined;
    failed: number | undefined;
    inapplicable: number | undefined;
  };
  modules: {
    counter: CounterResult | null;
    'act-rules': Report | null;
    'wcag-techniques': Report | null;
    'best-practices': Report | null;
  };
}

export interface EvaluationMetadata {
  title: string;
  url: string;
  evaluatedAt: string;
}

export interface PageSnapshot {
  html: string;
  sizeInBytes: number;
  hash: string;
}

export interface DomTelemetry {
  totalHtmlTags: number;
  tagCounter: Record<string, number>;
  elementCounters: Record<string, number>;
  roles: Record<string, number>;
}

/** Token representing the conformance level counts for a test, formatted as "A@AA@AAA" */
export type ConformanceToken = `${number}@${number}@${number}`;
/**
 * Token representing the contribution of a test to the score, formatted as `${rule.score}@${contribution.toFixed(2)}`,
 * with `rule.score` from 1 to 10 (e.g., "3@1.00"). '' for `warning` tests, which are not scored.
 */

export type ConformanceResultToken = `${number}@${number}` | '';

/** Evidence of an element in `assertionEvidence` (subset of the TestResult from the QualWeb ruleset) */
export interface EvidenceItem {
  htmlCode?: string;
  pointer?: string;
  attributes?: string | Record<string, unknown>;
  /** QualWeb results often include nested elements here */
  elements?: EvidenceItem[];
}

export interface EvaluationDetail {
  conform: ConformanceToken;
  totalTests: number;
  score: string;
  rulesOccurrences: Record<string, number>;
  assertionEvidence: Record<string, EvidenceItem[]>;
  conformanceResults: Record<string, ConformanceResultToken>;
}

export interface AuditReport {
  metadata: EvaluationMetadata;
  snapshot: PageSnapshot;
  telemetry: DomTelemetry;
  scoring: EvaluationDetail;
}

/** AuditReport exported, with the integrity hash (see `shared/integrity.ts`) */
export interface SignedAuditReport extends AuditReport {
  hash: string;
}

// ---------- Processed data for the UI (processAuditReport) ----------

export type Level = 'A' | 'AA' | 'AAA';
export type ResultColor = 'err' | 'war' | 'ok';

export interface RelatedSuccessCriterion {
  sc: string;
  lvl: string;
  link: string;
}

/** Item returned by `testView` */
export interface TechItem {
  txt: string;
  tot: string | number;
  ele?: string;
  html_validator?: boolean;
}

export interface ProcessedResult {
  ico: string;
  color: ResultColor;
  lvl: Level;
  msg: string;
  ref: string;
  ref_website: string;
  relation: 'relationACT' | 'relationT';
  ref_related_sc: RelatedSuccessCriterion[];
  value: string | number | undefined;
  prio: number;
  tech_list: TechItem;
}

export type InfoAk = Record<Level, Record<'ok' | 'war' | 'err', number>>;

export interface ProcessedMetadata {
  url: string;
  title: string;
  n_elements: number;
  score: string;
  size: string;
  last_update: string;
  count_results: number;
  validator: boolean;
}

export interface ProcessedReport {
  metadata: ProcessedMetadata;
  results: ProcessedResult[];
  infoak: InfoAk;
}

// ---------- Test detail (Details page) ----------

export interface ElementDetail {
  ele: string;
  code: string;
  showCode: string | undefined;
  pointer: string;
}

export interface TestDetails {
  result?: 'R' | 'Y' | 'G';
  size?: number;
  elements?: ElementDetail[];
}
