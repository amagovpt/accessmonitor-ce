import type { TFunction } from 'i18next';
import { describe, expect, it } from 'vitest';

import type { ProcessedReport } from '../../../shared/types';
import {
  callbackImgT,
  normalizeScore,
  optionForAccordion,
  sumAllValues,
  sumValuesByKey,
} from './utils';

const t = ((key: string) => key) as unknown as TFunction;

function makeProcessed(results: ProcessedReport['results']): ProcessedReport {
  return {
    metadata: {
      url: 'https://x.pt',
      title: 't',
      n_elements: 1,
      score: '5.0',
      size: '1 KB',
      last_update: '',
      count_results: results.length,
      validator: false,
    },
    results,
    infoak: {
      A: { ok: 0, war: 0, err: 0 },
      AA: { ok: 0, war: 0, err: 0 },
      AAA: { ok: 0, war: 0, err: 0 },
    },
  };
}

const result = (
  color: 'err' | 'war' | 'ok',
): ProcessedReport['results'][number] => ({
  ico: '',
  color,
  lvl: 'A',
  msg: `msg_${color}`,
  ref: 'G1',
  ref_website: 'https://w3.org',
  relation: 'relationT',
  ref_related_sc: [{ sc: '2.4.1', lvl: 'A', link: 'https://l' }],
  value: 2,
  prio: 1,
  tech_list: { txt: 'x', tot: 2, ele: 'a' },
});

describe('optionForAccordion', () => {
  it('mapeia cor para ícone e classe da célula', () => {
    const options = optionForAccordion(
      t,
      makeProcessed([result('err'), result('war'), result('ok')]),
    );

    expect(options.map((o) => [o.id, o.iconName, o.tdClassName])).toEqual([
      ['msg_err', 'AMA-Wrong-Line', 'error-cell'],
      ['msg_war', 'AMA-Middle-Line', 'warning-cell'],
      ['msg_ok', 'AMA-Check-Line', 'success-cell'],
    ]);
  });

  it('expõe critérios de sucesso, elemento e site de referência', () => {
    const [option] = optionForAccordion(t, makeProcessed([result('err')]));

    expect(option).toMatchObject({
      lvl: 'A',
      cs: ['2.4.1'],
      ele: 'a',
      ref_website: 'https://w3.org',
    });
  });

  it('descarta resultados sem tradução', () => {
    const emptyT = (() => '') as unknown as TFunction;
    expect(optionForAccordion(emptyT, makeProcessed([result('err')]))).toEqual(
      [],
    );
  });

  it('não rebenta sem results', () => {
    const data = makeProcessed([]);
    (data as { results?: unknown }).results = undefined;

    expect(optionForAccordion(t, data)).toEqual([]);
  });
});

describe('helpers', () => {
  it('normalizeScore só converte "10.0"', () => {
    expect(normalizeScore('10.0')).toBe('10');
    expect(normalizeScore('7.5')).toBe('7.5');
    expect(normalizeScore(undefined)).toBeUndefined();
  });

  it('sumValuesByKey e sumAllValues toleram dados em falta', () => {
    const infoak = { A: { ok: 1, war: 2, err: 3 }, AA: { ok: 1 } };

    expect(sumValuesByKey('A', infoak)).toBe(6);
    expect(sumValuesByKey('AAA', infoak)).toBe(0);
    expect(sumValuesByKey('A', null)).toBe(0);
    expect(sumAllValues(infoak)).toEqual({ ok: 2, war: 2, err: 3 });
    expect(sumAllValues(null)).toEqual({ ok: 0, err: 0, war: 0 });
    expect(sumAllValues(undefined)).toEqual({ ok: 0, err: 0, war: 0 });
  });

  it('callbackImgT usa a chave de título das imagens', () => {
    expect(callbackImgT(t, 'ok')).toBe('RESULTS.results.image_title.ok');
  });
});
