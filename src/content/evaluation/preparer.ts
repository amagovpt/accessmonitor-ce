import type {
  AuditReport,
  InfoAk,
  Level,
  ProcessedReport,
  ProcessedResult,
  ResultColor as Color,
} from '../../shared/types';
import { convertBytes } from '../../shared/format';
import { refWebsite, testView } from '../../shared/references';
import {
  ruleset,
  successCriteria,
  testColors,
} from '@a12e/accessmonitor-rulesets';

const COLOR_BY_CODE: Record<string, Color> = { R: 'err', Y: 'war', G: 'ok' };
const PRIO: Record<Color, number> = { err: 1, war: 2, ok: 3 };

function extractLang(html: string | undefined): string {
  const match = /<html[^>]*\slang\s*=\s*["']?([^"'\s>]+)/i.exec(html ?? '');
  return match?.[1] ?? '';
}

// Converts an AuditReport into the `tot` format expected by the legacy process
function toTot(report: AuditReport) {
  const { metadata, snapshot, telemetry, scoring } = report;

  return {
    info: {
      url: metadata.url,
      title: metadata.title,
      date: metadata.evaluatedAt,
      htmlTags: telemetry.totalHtmlTags,
      size: snapshot.sizeInBytes,
      score: scoring.score,
      lang: extractLang(snapshot.html),
    },
    elems: {
      ...telemetry.tagCounter,
      ...telemetry.elementCounters,
      ...scoring.rulesOccurrences,
    },
    results: scoring.conformanceResults,
  };
}

export function processAuditReport(
  report: AuditReport | null | undefined,
  url?: string,
): ProcessedReport | null {
  if (!report) {
    return null;
  }

  const tot = toTot(report);
  const pageUrl = url ?? tot.info.url;

  const infoak: InfoAk = {
    A: { ok: 0, err: 0, war: 0 },
    AA: { ok: 0, err: 0, war: 0 },
    AAA: { ok: 0, err: 0, war: 0 },
  };

  const results: ProcessedResult[] = [];

  for (const test of Object.keys(ruleset) as Array<keyof typeof ruleset>) {
    if (!(test in tot.results)) continue;

    const rule = ruleset[test];
    if (!rule) continue;

    let tes: string = rule['test'];
    const level = String(rule['level']).toUpperCase() as Level;
    const ref: string = rule['ref'];
    const ele: string = rule['elem'];

    const testColor = testColors[test];
    if (!testColor) {
      console.warn(`Missing color for test: ${test}`);
      continue;
    }

    const color = COLOR_BY_CODE[testColor];
    if (!color) {
      console.warn(`Invalid color mapping for test ${test}: ${testColor}`);
      continue;
    }

    if (!infoak[level]) {
      console.warn(`Invalid level for test ${test}: ${level}`);
      continue;
    }

    infoak[level][color]++;

    // Determine the value associated with the test based on its type and presence in `tot.elems`
    let tnum: string | number | undefined;
    if (tot.elems[tes] !== undefined) {
      if (tes === 'titleOk') tnum = tot.info.title;
      else if (tes === 'lang') tnum = tot.info.lang;
      else if (tes === 'langNo') tnum = 'lang';
      else if (tes === 'titleLong') tnum = (tot.info.title ?? '').length;
      else tnum = tot.elems[tes];
    } else if (tes === 'imgAltNo') {
      tnum = tot.elems['img'];
      tes = 'img';
    } else if (tes === 'inputLabelNo') {
      tnum = tot.elems['label'];
    } else {
      tnum = tot.elems[ele];
    }

    // Related success criteria
    const refRelatedSc: { sc: string; lvl: string; link: string }[] = [];
    for (const raw of rule['scs'] ?? []) {
      const sc = String(raw).trim();
      const criterion = successCriteria[sc as keyof typeof successCriteria];
      if (sc === '' || !criterion) continue;

      refRelatedSc.push({
        sc,
        lvl: criterion.level,
        link: `https://www.w3.org/TR/UNDERSTANDING-WCAG20/${criterion.name}.html`,
      });
    }

    results.push({
      ico: `assets/images/ico${color}.png`,
      color,
      lvl: level,
      msg: test,
      ref,
      ref_website: refWebsite(ref),
      relation: ref.length > 3 ? 'relationACT' : 'relationT',
      ref_related_sc: refRelatedSc,
      value: tnum,
      prio: PRIO[color],
      tech_list: testView(tes, tes, tes, color, tnum, pageUrl),
    });
  }

  return {
    metadata: {
      url: tot.info.url,
      title: tot.info.title,
      n_elements: tot.info.htmlTags,
      score: tot.info.score,
      size: convertBytes(tot.info.size),
      last_update: tot.info.date,
      count_results: Object.keys(tot.results).length,
      validator: String(tot.elems['w3cValidator']) === 'true',
    },
    results,
    infoak,
  };
}
