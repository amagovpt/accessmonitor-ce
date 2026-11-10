import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Gauge, LoadingComponent, TableComponent } from 'ama-design-system';

import { StatsTable } from './_components/StatsTable';
import { ButtonsActions } from './_components/buttons-revalidation';
import { optionForAccordion, callbackImgT, normalizeScore } from './utils';

import { pathURL } from '../../App';
import {
  reset,
  resetCsv,
  setURL,
  setDom,
  setACT,
  setWCAG,
  setBP,
  setSummary,
  setEvaluated,
  setPageCode,
  setData,
  setProcessedData,
  setNEvals,
  setCsvData,
  setCsvProcessedData,
  setCounter,
} from '../../store/slice/evaluationSlice';

import { downloadCSV, downloadAuditReport } from '../../../utils/utils';
import { useTheme } from '../../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type {
  AuditReport,
  ProcessedReport,
  EvaluationInput,
} from '../../../shared/types';
import {
  getUrl,
  startEvaluation,
  getHTML,
  evaluateACT,
  evaluateWCAG,
  evaluateBP,
  evaluateCounter,
  endingEvaluation,
  parseEvaluationReport,
  processReportData,
  updateCSVDataProcess,
} from '../../messaging';

export interface ResumeProps {
  setAllData: (data: AuditReport['scoring']['assertionEvidence']) => void;
}

export default function Resume({ setAllData }: ResumeProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const themeClass = theme === 'light' ? '' : 'dark_mode-resume';

  // Local state
  const [report, setReport] = useState<EvaluationInput>();
  const [originalData, setOriginalData] = useState<AuditReport | null>();
  const [dataProcess, setDataProcess] = useState<ProcessedReport | null>();

  // Local CSV state
  const [totalEvals, setTotalEvals] = useState(1);
  const [csvOriginalData, setCsvOriginalData] = useState<AuditReport | null>();
  const [csvDataProcess, setCsvDataProcess] =
    useState<ProcessedReport | null>();

  const [loadingProgress, setLoadingProgress] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reEvltd, setReEvltd] = useState(false);

  // Global state (redux)
  const evaluation = useAppSelector((state) => state.evaluation);
  const prevOriginalData = evaluation.data;
  const prevDataProcess = evaluation.processedData;
  const prevTotalEvals = evaluation.nEvals;
  const prevCsvOriginalData = evaluation.csvData;
  const prevCsvDataProcess = evaluation.csvProcessedData;

  const buildReport = () => {
    const { summary, counter } = evaluation;

    setReport({
      system: {
        page: {
          dom: {
            html: evaluation.dom?.html,
            title: summary?.title,
            elementCount: counter?.elementCount,
          },
        },
        url: { completeUrl: evaluation.url },
      },
      metadata: {
        passed: summary?.passed,
        warning: summary?.warning,
        failed: summary?.failed,
        inapplicable: summary?.inapplicable,
      },
      modules: {
        counter,
        'act-rules': evaluation.act,
        'wcag-techniques': evaluation.wcag,
        'best-practices': evaluation.bp,
      },
    });
  };

  // ---------- 1. Reuse store data or build report ----------
  useEffect(() => {
    const hasStoredData =
      prevOriginalData?.scoring &&
      (prevOriginalData?.snapshot?.html?.length ?? 0) > 0 &&
      prevDataProcess?.metadata;

    if (!reEvltd && hasStoredData) {
      setOriginalData(prevOriginalData);
      setDataProcess(prevDataProcess);

      if (
        prevCsvOriginalData &&
        prevCsvDataProcess?.metadata &&
        prevTotalEvals
      ) {
        setCsvOriginalData(prevCsvOriginalData);
        setCsvDataProcess(prevCsvDataProcess);
        setTotalEvals(prevTotalEvals);
      } else {
        setCsvOriginalData(prevOriginalData);
        setCsvDataProcess(prevDataProcess);
      }
      return;
    }

    if (reEvltd) setReEvltd(false);
    buildReport();
  }, [reEvltd]);

  // ---------- 2. report -> AuditReport -> processed data ----------
  useEffect(() => {
    if (!report || originalData) return;

    const parseResults = async () => {
      try {
        const parsed = await parseEvaluationReport(report);
        const processed = await processReportData(parsed); // results, infoak, metadata
        if (!processed) {
          throw new Error('processReportData returned no data');
        }

        dispatch(setData(parsed));
        dispatch(setPageCode(parsed.snapshot.html || 'html'));
        setOriginalData(parsed);

        dispatch(setProcessedData(processed));
        setDataProcess(processed);

        // CSV
        dispatch(setCsvData(parsed));
        setCsvOriginalData(parsed);

        if (csvDataProcess?.metadata && processed) {
          const updated = await updateCSVDataProcess(processed, csvDataProcess);
          dispatch(setCsvProcessedData(updated));
          setCsvDataProcess(updated);
        } else {
          dispatch(setCsvProcessedData(processed));
          setCsvDataProcess(processed);
        }
      } catch (err) {
        console.error('Failed to process the evaluation report', err);
        setError(t('MISC.unexpected_error'));
        setLoadingProgress(false);
      }
    };

    parseResults();
  }, [report]);

  // ---------- 3. End of loading ----------
  useEffect(() => {
    if (dataProcess) setLoadingProgress(false);
  }, [dataProcess]);

  const reRequest = async () => {
    const newUrl = await getUrl();
    const oldUrl = evaluation.url;
    const differentPage = newUrl !== oldUrl;

    dispatch(reset());
    if (differentPage) dispatch(resetCsv());

    dispatch(setNEvals());
    setTotalEvals(differentPage ? 1 : totalEvals + 1);

    dispatch(setURL(newUrl));

    await startEvaluation();

    const html = await getHTML();
    dispatch(setDom({ html }));

    const act = await evaluateACT();
    dispatch(setACT(act));

    const wcag = await evaluateWCAG();
    dispatch(setWCAG(wcag));

    const bp = await evaluateBP();
    dispatch(setBP(bp));

    const counter = await evaluateCounter();
    dispatch(setCounter(counter));

    const summary = await endingEvaluation();
    dispatch(setSummary(summary));

    if (act && wcag && bp && counter) {
      dispatch(setEvaluated());
    }

    // Reset of state local
    setError(null);
    setLoadingProgress(true);
    setReport(undefined);
    setOriginalData(undefined);
    setDataProcess(undefined);
    setReEvltd(true);

    return true;
  };

  const goToDetails = (ele: string) => {
    if (!originalData) return;
    setAllData(originalData.scoring.assertionEvidence);
    navigate(`${pathURL}results/${ele}`);
  };

  const scoreData = normalizeScore(originalData?.scoring?.score);

  return (
    <div className={`container ${themeClass}`}>
      <div className="link_breadcrumb_container" />

      <div className="report_container">
        <h1 className="report_container_subtitle">{t('RESULTS.title')}</h1>

        {loadingProgress ? (
          <section className="loading_container bg-white">
            <LoadingComponent
              loadingText={t('MISC.loading')}
              darkTheme={theme}
            />
          </section>
        ) : !error ? (
          <ButtonsActions
            reRequest={reRequest}
            downloadCSV={() => {
              if (!csvDataProcess || !csvOriginalData) return;
              downloadCSV(totalEvals, csvDataProcess, csvOriginalData, t);
            }}
            downloadAuditReport={() => {
              if (!csvOriginalData) return;
              downloadAuditReport(csvOriginalData);
            }}
            themeClass={themeClass}
          />
        ) : (
          <h3>{error}</h3>
        )}
      </div>

      {!loadingProgress && !error && (
        <>
          <section className="sumary_container bg-white">
            <h2>{t('RESULTS.summary.title')}</h2>

            <div className="d-flex flex-row mt-5 mb-5 justify-content-between container_uri_chart">
              <div className="chart_container">
                <Gauge
                  percentage={scoreData}
                  darkTheme={theme}
                  title={[t('RESULTS.summary.score')]}
                />
              </div>
              <div className="resume_info_about_uri d-flex flex-column gap-4">
                <div className="d-flex flex-column">
                  <span>{t('RESULTS.summary.metadata.title_label')}</span>
                  <span>{dataProcess?.metadata?.title}</span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-row justify-content-between size_and_table_container">
              <div className="size_container d-flex flex-column gap-4">
                <div className="d-flex flex-column">
                  <span>{dataProcess?.metadata?.n_elements}</span>
                  <span>{t('RESULTS.summary.metadata.n_elements_label')}</span>
                </div>
                <div className="d-flex flex-column">
                  <span>{dataProcess?.metadata?.size}</span>
                  <span>{t('RESULTS.summary.metadata.page_size_label')}</span>
                </div>
              </div>

              <div className="table_container_sumary">
                <StatsTable
                  data={dataProcess}
                  darkTheme={theme}
                  ok={t('RESULTS.summary.table.labels.ok')}
                  warning={t('RESULTS.summary.table.labels.warn')}
                  error={t('RESULTS.summary.table.labels.err')}
                  title={t('RESULTS.summary.table.title')}
                  caption={t('RESULTS.summary.metadata.caption')}
                  type={t('RESULTS.summary.table.typeLabel')}
                />
              </div>
            </div>
          </section>

          <section className="bg-white avaliation_container">
            <h2 className="avaliation_title mb-3">
              {t('RESULTS.results.title')}
            </h2>
            <TableComponent
              data={dataProcess ? optionForAccordion(t, dataProcess) : []}
              onClick={goToDetails}
              imageTitlesCallback={(img: string) => callbackImgT(t, img)}
              caption={t('RESULTS.results.caption')}
              col1={t('RESULTS.results.practice')}
              col2={t('RESULTS.results.lvl')}
              col3={t('RESULTS.results.details')}
              lvlTitle={`${t('RESULTS.results.lvl')}: `}
              ariaLabel={t('RESULTS.results.details')}
              darkTheme={theme}
              ariaLabels={{
                button: t('RESULTS.results.details'),
                A: t('RESULTS.results.ariaLabels.A'),
                AA: t('RESULTS.results.ariaLabels.AA'),
                AAA: t('RESULTS.results.ariaLabels.AAA'),
              }}
            />
          </section>
        </>
      )}
    </div>
  );
}
