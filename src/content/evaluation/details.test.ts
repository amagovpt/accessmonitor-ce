import { describe, expect, it } from 'vitest';

import { makeAuditReport } from '../../test/fixtures';
import { getTestDetails } from './details';

describe('getTestDetails', () => {
  it('lê elementos aninhados e planos da evidência', () => {
    const report = makeAuditReport({
      assertionEvidence: {
        imgAltNo: [
          {
            elements: [
              { htmlCode: '<img src="a.png">', pointer: 'html > img' },
            ],
          },
          { htmlCode: '<img src="b.png">', pointer: 'p > img' },
        ],
      },
    });

    const details = getTestDetails('imgAltNo', report);

    expect(details.size).toBe(2);
    expect(details.elements?.map((e) => e.pointer)).toEqual([
      'html > img',
      'p > img',
    ]);
    expect(details.elements?.[0]).toMatchObject({ ele: 'img' });
  });

  it('usa a cor da regra aplicada (R para imgAltNo) e G sem regra', () => {
    expect(getTestDetails('imgAltNo', makeAuditReport()).result).toBe('R');
    expect(
      getTestDetails('imgAltNo', makeAuditReport({ conformanceResults: {} }))
        .result,
    ).toBe('G');
  });

  it('torna absoluto o src relativo das imagens', () => {
    const report = makeAuditReport({
      assertionEvidence: {
        imgAltNo: [
          { htmlCode: '<img src="/a.png" alt>', pointer: 'x' },
          { htmlCode: '<img src="rel/b.png">', pointer: 'y' },
          { htmlCode: '<img src="https://cdn.pt/c.png">', pointer: 'z' },
        ],
      },
    });

    const codes = getTestDetails('imgAltNo', report).elements?.map(
      (e) => e.showCode,
    );

    expect(codes).toEqual([
      '<img src="https://www.example.com/a.png" alt>',
      '<img src="https://www.example.com/rel/b.png">',
      '<img src="https://cdn.pt/c.png">',
    ]);
  });

  it('remove os atributos internos do QualWeb', () => {
    const report = makeAuditReport({
      assertionEvidence: {
        imgAltNo: [
          { htmlCode: '<img _selector="html > img" alt="x">', pointer: 'x' },
        ],
      },
    });

    expect(getTestDetails('imgAltNo', report).elements?.[0]?.code).toBe(
      '<img  alt="x">',
    );
  });

  it('trata style e title de forma especial', () => {
    const report = makeAuditReport({
      assertionEvidence: {
        x: [
          { htmlCode: '<style>', attributes: 'a{color:red}', pointer: 's' },
          { htmlCode: '<title>', pointer: 't' },
        ],
      },
    });

    const [style, title] = getTestDetails('x', report).elements ?? [];
    expect(style).toMatchObject({ code: 'a{color:red}', showCode: undefined });
    expect(title).toMatchObject({ code: 'Página de teste' });
  });

  it('mapeia o teste form para formSubmitNo', () => {
    const report = makeAuditReport({
      assertionEvidence: {
        formSubmitNo: [{ htmlCode: '<form>', pointer: 'f' }],
      },
    });

    expect(getTestDetails('form', report).size).toBe(1);
  });

  it('devolve lista vazia sem evidência', () => {
    expect(getTestDetails('nada', makeAuditReport())).toMatchObject({
      size: 0,
      elements: [],
    });
  });
});
