import { saveAs } from 'file-saver';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { verifyReport } from '../shared/integrity';
import type { SignedAuditReport } from '../shared/types';
import { makeAuditReport } from '../test/fixtures';
import { downloadAuditReport } from './utils';

vi.mock('file-saver', () => ({ saveAs: vi.fn() }));

describe('downloadAuditReport', () => {
  beforeEach(() => {
    vi.mocked(saveAs).mockClear();
  });

  it('grava o AuditReport em JSON, sem conversão, com hash válido', async () => {
    const report = makeAuditReport();

    await downloadAuditReport(report);

    expect(saveAs).toHaveBeenCalledTimes(1);
    const [blob, filename] = vi.mocked(saveAs).mock.calls[0] as [Blob, string];
    expect(filename).toBe('eval_mymonitor.json');
    expect(blob.type).toBe('application/json');
    const saved = JSON.parse(await blob.text()) as SignedAuditReport;
    const { hash, ...content } = saved;
    expect(content).toEqual(report);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(await verifyReport(saved)).toBe(true);
  });
});
