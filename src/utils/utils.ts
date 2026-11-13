import { ruleset } from '@a12e/accessmonitor-rulesets';
import { saveAs } from 'file-saver';
import type { TFunction } from 'i18next';

import { signReport } from '../shared/integrity';
import type { AuditReport, ProcessedReport } from '../shared/types';
/** Validates if a given URL is well-formed and uses the HTTP or HTTPS protocol */
export function validateURL(url: string): boolean {
  try {
    const newUrl = new URL(url);
    const hostname = newUrl.hostname;
    const wwwIndex = hostname.indexOf('www.');

    if (wwwIndex !== -1) {
      if (hostname.indexOf('.', wwwIndex + 4) === -1) {
        return false;
      }
    }

    const dotIndex = hostname.lastIndexOf('.');
    const lastChar = hostname.charAt(hostname.length - 1);
    if (
      dotIndex === -1 ||
      dotIndex === hostname.length - 1 ||
      !lastChar.match(/[a-zA-Z]/)
    ) {
      return false;
    }

    return (
      (newUrl.protocol === 'http:' || newUrl.protocol === 'https:') &&
      hostname.includes('.')
    );
  } catch (err) {
    return false;
  }
}
/** Downloads the processed report as a CSV file */
export function downloadCSV(
  nEvals: number,
  dataProcess: ProcessedReport,
  originalData: AuditReport,
  t: TFunction,
): void {
  type CsvCell = string | number | undefined;
  const data: CsvCell[][] = [];

  const descs = [
    'CSV.date',
    'CSV.errorType',
    'CSV.level',
    'CSV.criteria',
    'CSV.desc',
    'CSV.count',
    'CSV.value',
    'RESULTS.summary.score',
  ];

  for (const result of dataProcess['results'] ?? []) {
    if (result) {
      const rowData: CsvCell[] = [];
      const error =
        'CSV.' +
        (result['prio'] === 3
          ? 'scoreok'
          : result['prio'] === 2
            ? 'scorewar'
            : 'scorerror');
      const level = result['lvl'];
      const num = result['value'];
      const desc = 'TESTS_RESULTS.' + result['msg'] + (num === 1 ? '.s' : '.p');
      const scs = ruleset[result['msg'] as keyof typeof ruleset]['scs'];
      const sc = scs.map((s) => s.trim()).join(' ') || '';

      descs.push(desc, error);
      rowData.push(
        dataProcess?.metadata?.url,
        originalData.metadata.evaluatedAt,
        result['msg'],
        error,
        level,
        sc,
        desc,
        num === undefined ? 0 : isNaN(parseInt(String(num))) ? 1 : num,
        !isNaN(parseInt(String(num))) ? '' : num,
        dataProcess?.metadata?.score.replace('.', ','),
      );
      data.push(rowData);
    }
  }

  const labels: string[] = [];
  for (const row of data) {
    if (row) {
      row[6] = t(`${row[6]}`).replace(
        '{{value}}',
        String(row[8] ? row[8] : row[7]),
      );
      row[6] = String(row[6]).replace(new RegExp('<mark>', 'g'), '');
      row[6] = String(row[6]).replace(new RegExp('</mark>', 'g'), '');
      row[6] = String(row[6]).replace(new RegExp('<code>', 'g'), '');
      row[6] = String(row[6]).replace(new RegExp('</code>', 'g'), '');
      row[6] = String(row[6]).replace(new RegExp('&lt;', 'g'), '');
      row[6] = String(row[6]).replace(new RegExp('&gt;', 'g'), '');
      row[3] = t(`${row[3]}`);
    }
  }
  labels.push('URI');
  labels.push(t('CSV.date'));
  labels.push('ID');
  labels.push(t('CSV.errorType'));
  labels.push(t('CSV.level'));
  labels.push(t('CSV.criteria'));
  labels.push(t('CSV.desc'));
  labels.push(t('CSV.count'));
  labels.push(t('CSV.value'));
  labels.push(t('RESULTS.summary.score'));

  let csvContent = labels.join(';') + '\r\n';
  for (const row of data || []) {
    csvContent += row.join(';') + '\r\n';
  }
  csvContent += '\r\n';

  csvContent += 'Total page evaluations;\r\n';
  csvContent += nEvals + ';\r\n';

  const blob = new Blob([csvContent], { type: 'text/csv' });
  saveAs(blob, 'eval.csv');
}

/** Downloads the AuditReport as produced by the content script, including the integrity `hash`, for importing into MyMonitor */
export async function downloadAuditReport(report: AuditReport): Promise<void> {
  const signed = await signReport(report);
  const blob = new Blob([JSON.stringify(signed)], {
    type: 'application/json',
  });
  saveAs(blob, 'eval_mymonitor.json');
}
