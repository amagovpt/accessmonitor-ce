import type { AuditReport, SignedAuditReport } from './types';

/** Computes the canonical JSON string of a value. */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = canonicalize((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/** Computes the SHA-256 hash of the report, ignoring any existing `hash` field. */
export async function computeReportHash(
  report: AuditReport | SignedAuditReport,
): Promise<string> {
  const { hash: _ignored, ...content } = report as SignedAuditReport;
  return sha256Hex(canonicalStringify(content));
}

/** Adds the `hash` field to the report. */
export async function signReport(
  report: AuditReport,
): Promise<SignedAuditReport> {
  return { hash: await computeReportHash(report), ...report };
}

/** Verifies that the report has not been altered since it was signed. */
export async function verifyReport(
  report: SignedAuditReport,
): Promise<boolean> {
  return report.hash === (await computeReportHash(report));
}
