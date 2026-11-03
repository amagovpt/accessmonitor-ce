import clone from 'lodash.clone';
import type { ProcessedReport } from '../../shared/types';

function updateCSVProcessedData(
  newData: ProcessedReport,
  oldData: ProcessedReport,
): ProcessedReport {
  let data = clone(newData);

  for (const oldRow of oldData.results ?? []) {
    if (!oldRow) continue;

    let exists = false;
    for (let r = 0; r < (data.results ?? []).length; r++) {
      const current = data.results[r];
      if (!current) continue;

      if (current.msg === oldRow.msg) {
        exists = true;
        if (parseInt(String(current.value)) > parseInt(String(oldRow.value))) {
          data.results[r] = clone(oldRow);
        }
        break;
      }
    }

    if (!exists) {
      data.results.push(oldRow);
    }
  }

  return data;
}

export function updateCSVProcData(
  newData: ProcessedReport,
  oldData: ProcessedReport,
): ProcessedReport {
  const csvData = updateCSVProcessedData(newData, oldData);

  return csvData;
}
