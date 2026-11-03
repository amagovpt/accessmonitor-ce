import type { AuditReport } from '../shared/types';

/** Creates a sample AuditReport for testing purposes */
export function makeAuditReport(
  overrides: Partial<AuditReport['scoring']> = {},
): AuditReport {
  return {
    metadata: {
      title: 'Página de teste',
      url: 'https://www.example.com/pagina/x',
      evaluatedAt: '2025-01-01 10:00:00',
    },
    snapshot: {
      html: '<html lang="pt"></html>',
      sizeInBytes: 2048,
      hash: 'abc',
    },
    telemetry: {
      totalHtmlTags: 12,
      tagCounter: { a: 4, img: 2 },
      elementCounters: {},
      roles: {},
    },
    scoring: {
      conform: '1@0@0',
      totalTests: 2,
      score: '7.5',
      rulesOccurrences: {},
      assertionEvidence: {},
      conformanceResults: { a_01a: '', img_01b: '3@1.00' },
      ...overrides,
    },
  };
}
