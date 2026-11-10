import type { TFunction } from 'i18next';
import type { ReactNode } from 'react';

import type { Level, ProcessedReport } from '../../../shared/types';

type Counts = Partial<Record<'ok' | 'war' | 'err', number>>;

export function sumValuesByKey(
  key: string,
  object: Record<string, Counts> | null | undefined,
): number {
  if (!object) {
    return 0;
  }

  let value = object[key];

  if (!value) {
    return 0;
  }

  let result = (value.ok || 0) + (value.err || 0) + (value.war || 0);
  return result;
}

export function sumAllValues(
  object: Record<string, Counts> | null | undefined,
): Record<'ok' | 'err' | 'war', number> {
  if (object === null) {
    return { ok: 0, err: 0, war: 0 };
  }

  let allsum = { ok: 0, err: 0, war: 0 };
  for (let key in object) {
    let value = object[key] as Counts;
    allsum.ok += value.ok || 0;
    allsum.err += value.err || 0;
    allsum.war += value.war || 0;
  }
  return allsum;
}

// Format Result second table

export interface AccordionOption {
  id: string;
  lvl: Level;
  cs: string[] | null;
  iconName: string;
  tdClassName: string;
  ele: string | undefined;
  title: ReactNode;
  ref_website: string;
  component: ReactNode;
}

export function optionForAccordion(
  t: TFunction,
  data: ProcessedReport,
): AccordionOption[] {
  const optionsArray = (data.results ?? [])
    .map((result): AccordionOption | null => {
      const testResultType = result.value === 1 ? 's' : 'p';
      const testResult = t(`TESTS_RESULTS.${result.msg}.${testResultType}`);

      if (!testResult) {
        return null;
      }

      const sc_text =
        result.ref_related_sc &&
        Array.isArray(result.ref_related_sc) &&
        result.ref_related_sc.length > 0
          ? result.ref_related_sc.map((item) => item.sc)
          : null;

      const linkcs =
        result.ref_related_sc &&
        Array.isArray(result.ref_related_sc) &&
        result.ref_related_sc.length > 0
          ? result.ref_related_sc.map((item) => item.link)
          : null;

      const sc_level =
        result.ref_related_sc &&
        Array.isArray(result.ref_related_sc) &&
        result.ref_related_sc.length > 0
          ? result.ref_related_sc.map((item) => item.lvl)
          : null;

      const additionalInfo = t(`TXT_TECHNIQUES.${result.ref}`) || '';
      const additionalInfoLink = t(`TECHS.${result.ref}`) || '';
      const additionalInfoWagError = t(`TECHFAIL.${result.relation}`) || '';

      let iconName: string;

      if (result.color === 'err') {
        iconName = 'AMA-Wrong-Line';
      } else if (result.color === 'war') {
        iconName = 'AMA-Middle-Line';
      } else {
        iconName = 'AMA-Check-Line';
      }

      let tdClassName: string;

      if (result.color === 'err') {
        tdClassName = 'error-cell';
      } else if (result.color === 'war') {
        tdClassName = 'warning-cell';
      } else {
        tdClassName = 'success-cell';
      }

      return {
        id: result.msg,
        lvl: result.lvl,
        cs: sc_text,
        iconName: iconName,
        tdClassName: tdClassName,
        ele: result?.tech_list?.ele,
        title: (
          <span
            className="custom-title"
            dangerouslySetInnerHTML={{
              __html: testResult.replace('{{value}}', String(result.value)),
            }}
          />
        ),

        ref_website: result.ref_website,
        component: (
          <div className="content_info">
            <div className="d-flex flex-column">
              <div dangerouslySetInnerHTML={{ __html: additionalInfo }} />
              <a
                href={result?.ref_website}
              >{`${result.ref}: ${additionalInfoLink}`}</a>
              <span>{additionalInfoWagError}</span>
            </div>

            <div className="criterio d-block">
              {sc_text && (
                <ul className="d-flex flex-column">
                  {sc_text.map((sc, index) => (
                    <li key={index}>
                      Critérios de sucesso: {sc}
                      <span>
                        <i>(Nível {sc_level?.[index]})</i>
                      </span>
                      <a href={linkcs?.[index]} className="fw-normal m-1">
                        Noções sobre o CS {sc}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ),
      };
    })
    .filter((option): option is AccordionOption => option !== null);

  return optionsArray;
}

export function normalizeScore(score: string | undefined): string | undefined {
  return score === '10.0' ? '10' : score;
}

export function callbackImgT(t: TFunction, img: string): string {
  return t(`RESULTS.results.image_title.${img}`);
}
