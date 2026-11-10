import {
  EvaluationProcessingResult,
  processEvaluation,
} from '@a12e/accessmonitor-rulesets';
import { generateMd5Hash } from '../lib/security';
import type {
  AuditReport,
  ConformanceResultToken,
  ConformanceToken,
  EvaluationInput,
  QualwebReport,
} from '../../shared/types';

export function parseEvaluation(evaluation: EvaluationInput): AuditReport {
  const evaluationProcessed: EvaluationProcessingResult = processEvaluation(
    evaluation as unknown as QualwebReport,
  );

  const hash = generateMd5Hash(
    evaluationProcessed.metadata.metadata.evaluatedAt,
  );

  const evaluationReport: AuditReport = {
    metadata: evaluationProcessed.metadata.metadata,
    snapshot: {
      html: evaluationProcessed.html.html,
      sizeInBytes: evaluationProcessed.html.pageSize,
      hash,
    },
    telemetry: {
      elementCounters: evaluationProcessed.elementCounters,
      roles: evaluationProcessed.metadata.telemetry.roles,
      tagCounter: evaluationProcessed.metadata.telemetry.tagCounter,
      totalHtmlTags: evaluationProcessed.metadata.telemetry.totalHtmlTags,
    },
    scoring: {
      conform: evaluationProcessed.scoreDetails.conform as ConformanceToken,
      totalTests: evaluationProcessed.scoreDetails.totalTests,
      score: evaluationProcessed.scoreDetails.score,
      rulesOccurrences: evaluationProcessed.rulesOccurrences,
      assertionEvidence: evaluationProcessed.assertionEvidence,
      conformanceResults: evaluationProcessed.conformanceResults as Record<
        string,
        ConformanceResultToken
      >,
    },
  };
  return evaluationReport;
}
