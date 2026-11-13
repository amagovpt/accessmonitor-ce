import { describe, expect, it } from 'vitest';

import { makeAuditReport } from '../../test/fixtures';
import { processAuditReport } from './preparer';

describe('processAuditReport', () => {
  it('devolve null sem relatório', () => {
    expect(processAuditReport(null)).toBeNull();
    expect(processAuditReport(undefined)).toBeNull();
  });

  it('preenche os metadados a partir do AuditReport', () => {
    const processed = processAuditReport(makeAuditReport());

    expect(processed?.metadata).toMatchObject({
      url: 'https://www.example.com/pagina/x',
      title: 'Página de teste',
      n_elements: 12,
      score: '7.5',
      size: '2 KB',
      last_update: '2025-01-01 10:00:00',
      count_results: 2,
    });
  });

  it('inclui os testes de aviso (token vazio) e os falhados', () => {
    const processed = processAuditReport(makeAuditReport());

    const find = (msg: string) => processed?.results.find((r) => r.msg === msg);

    expect(find('a_01a')).toMatchObject({ color: 'war', lvl: 'A', prio: 2 });
    expect(find('img_01b')).toMatchObject({ color: 'err', lvl: 'A', prio: 1 });
  });

  it('conta os resultados por nível e estado', () => {
    const processed = processAuditReport(makeAuditReport());

    expect(processed?.infoak.A).toEqual({ ok: 0, war: 1, err: 1 });
    expect(processed?.infoak.AA).toEqual({ ok: 0, war: 0, err: 0 });
    expect(processed?.infoak.AAA).toEqual({ ok: 0, war: 0, err: 0 });
  });

  it('ignora testes que não estão em conformanceResults', () => {
    const processed = processAuditReport(
      makeAuditReport({ conformanceResults: { img_01b: '3@1.00' } }),
    );

    expect(processed?.results.map((r) => r.msg)).toEqual(['img_01b']);
    expect(processed?.metadata.count_results).toBe(1);
  });

  it('o url dos metadados vem sempre do relatório', () => {
    const processed = processAuditReport(
      makeAuditReport(),
      'https://outro.pt/',
    );
    expect(processed?.metadata.url).toBe('https://www.example.com/pagina/x');
  });
});
