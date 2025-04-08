import { Summary, Report } from "./types";

function addValuesToSummary(summary: Summary, report: Report) {
  summary.passed += report.metadata.passed;
  summary.failed += report.metadata.failed;
  summary.warning += report.metadata.warning;
  summary.inapplicable += report.metadata.inapplicable;
}

export { addValuesToSummary };
