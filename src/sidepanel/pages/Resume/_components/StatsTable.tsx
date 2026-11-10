import { Icon } from 'ama-design-system';

import type { Level, ProcessedReport } from '../../../../shared/types';
import { sumAllValues, sumValuesByKey } from '../utils';

type Status = 'ok' | 'war' | 'err';
type LabelKey = 'ok' | 'warning' | 'error';

const LEVELS: Level[] = ['A', 'AA', 'AAA'];

const ROWS: {
  key: Status;
  icon: string;
  overlay: string;
  label: LabelKey;
}[] = [
  {
    key: 'ok',
    icon: 'AMA-Check-Line',
    overlay: 'overlay_aceptable',
    label: 'ok',
  },
  {
    key: 'war',
    icon: 'AMA-Middle-Line',
    overlay: 'overlay_manual',
    label: 'warning',
  },
  {
    key: 'err',
    icon: 'AMA-Wrong-Line',
    overlay: 'overlay_no_aceptable',
    label: 'error',
  },
];

function MobileCells({ values }: { values: number[] }) {
  return (
    <div className="d-flex flex-row justify-content-end mobile_row-container">
      {LEVELS.map((level, i) => (
        <div key={level} className="d-flex flex-column mobile-row">
          <span>{level}</span>
          <span>{values[i]}</span>
        </div>
      ))}
    </div>
  );
}

function DesktopCells({ values }: { values: number[] }) {
  return (
    <>
      {values.map((value, i) => (
        <td key={LEVELS[i]} className="border_right body_text desk_row">
          {value}
        </td>
      ))}
    </>
  );
}

export interface StatsTableProps {
  darkTheme?: string;
  data: ProcessedReport | null | undefined;
  ok: string;
  warning: string;
  error: string;
  title: string;
  caption: string;
  type: string;
}

const StatsTable = ({
  darkTheme,
  data,
  ok,
  warning,
  error,
  title,
  caption,
  type,
}: StatsTableProps) => {
  const theme = darkTheme === 'dark' ? 'dark' : '';
  const labels = { ok, warning, error };

  const infoak = data?.infoak;
  const countResults = data?.metadata?.count_results;

  const totalsByStatus = sumAllValues(infoak);
  const percent = (n: number) => (countResults ? (n * 100) / countResults : 0);

  const totalsByLevel = LEVELS.map((level) => sumValuesByKey(level, infoak));

  return (
    <>
      <div className="mb-4 ama stats_table_title">
        <p className="practices_found_container">
          <span className="practices_found me-1">{countResults}</span>
          {title}
        </p>
      </div>

      <table className={`ama stats_table table table-bordereds ${theme}`}>
        <caption className="visually-hidden">{caption}</caption>

        <thead>
          <tr className="mobile_table">
            <th scope="col" className="text-left border_right">
              <p className="heading_totals">{type}</p>
            </th>
            {LEVELS.map((level) => (
              <th key={level} className="border_right heading_total total_top">
                {level}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {ROWS.map(({ key, icon, overlay, label }) => {
            const values = LEVELS.map((level) => infoak?.[level]?.[key] ?? 0);

            return (
              <tr key={key}>
                <th scope="row" className="border_right">
                  <div className="acceptable_container">
                    <div className="icon_and_text">
                      <Icon name={icon} />
                      <span className="title">
                        {labels[label]} ({totalsByStatus[key]})
                      </span>
                    </div>
                    <div
                      className={`overlay ${overlay}`}
                      style={{ width: `${percent(totalsByStatus[key])}%` }}
                    />
                  </div>
                  {/* MOBILE */}
                  <MobileCells values={values} />
                </th>
                {/* DESKTOP */}
                <DesktopCells values={values} />
              </tr>
            );
          })}

          <tr>
            <th scope="row" className="border_right">
              <div className="acceptable_container">
                <div className="icon_and_text">
                  <span className="heading_totals">Total ({countResults})</span>
                </div>
              </div>
              {/* MOBILE */}
              <MobileCells values={totalsByLevel} />
            </th>
            {/* DESKTOP */}
            <DesktopCells values={totalsByLevel} />
          </tr>
        </tbody>
      </table>
    </>
  );
};

export { StatsTable };
