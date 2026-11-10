import { describe, expect, it } from 'vitest';

import { makeAuditReport } from '../test/fixtures';
import {
  canonicalStringify,
  computeReportHash,
  signReport,
  verifyReport,
} from './integrity';

describe('integridade do AuditReport', () => {
  it('o JSON canónico não depende da ordem das chaves', () => {
    expect(canonicalStringify({ b: 1, a: { d: 2, c: [{ y: 1, x: 2 }] } })).toBe(
      '{"a":{"c":[{"x":2,"y":1}],"d":2},"b":1}',
    );
  });

  it('o hash é SHA-256 em hexadecimal e estável', async () => {
    const report = makeAuditReport();
    const hash = await computeReportHash(report);

    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(await computeReportHash(report)).toBe(hash);
  });

  it('signReport acrescenta o hash sem alterar o resto', async () => {
    const report = makeAuditReport();
    const signed = await signReport(report);

    const { hash, ...rest } = signed;
    expect(hash).toBe(await computeReportHash(report));
    expect(rest).toEqual(report);
  });

  it('o hash ignora um campo hash já presente', async () => {
    const signed = await signReport(makeAuditReport());
    expect(await computeReportHash(signed)).toBe(signed.hash);
  });

  it('verifica um relatório intacto e rejeita um alterado', async () => {
    const signed = await signReport(makeAuditReport());
    expect(await verifyReport(signed)).toBe(true);

    const tampered = {
      ...signed,
      scoring: { ...signed.scoring, score: '10.0' },
    };
    expect(await verifyReport(tampered)).toBe(false);

    const tamperedHtml = {
      ...signed,
      snapshot: { ...signed.snapshot, html: '<html>outro</html>' },
    };
    expect(await verifyReport(tamperedHtml)).toBe(false);
  });
});
