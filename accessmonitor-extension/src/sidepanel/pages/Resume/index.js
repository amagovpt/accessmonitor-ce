// import "./styles.css";

import { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Breadcrumb, Gauge, LoadingComponent, StatsTable, TableComponent } from "ama-design-system";

import { ButtonsActions } from "./_components/buttons-revalidation";
import { optionForAccordion, callbackImgT } from "./utils";

import { pathURL } from "../../App";
import { reset, setURL, setDom, setACT, setWCAG, setBP, setSummary, setEvaluated, setPageCode, setData, setProcessedData } from "../../store/slice/evaluationSlice";

import { downloadCSV } from  "../../../utils/utils";
import { ThemeContext } from "../../../context/ThemeContext";


export default function Resume({ setAllData, setEle }) {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [report, setReport] = useState();
  const [originalData, setOriginalData] = useState();
  const [dataProcess, setDataProcess] = useState();

  const [loadingProgress, setLoadingProgress] = useState(true);
  const [error, setError] = useState(false);

  const [reEvltd, setReEvltd] = useState(false);

  const { theme } = useContext(ThemeContext);
  const themeClass = theme === "light" ? "" : "dark_mode-resume";

  const evaluation = useSelector((state) => state.evaluation);
  const prevOriginalData = evaluation.data;
  const prevDataProcess = evaluation.processedData;
  const code = evaluation.pageCode;

  const buildReport = () => {
    const report = {};

    report.system = {};
    report.system.page = {};
    report.system.page.dom = {};
    report.system.page.dom.html = evaluation.dom.html;
    report.system.page.dom.title = evaluation.summary.title;
    report.system.url = {};
    report.system.url.completeUrl = evaluation.url;
    report.metadata = {};
    report.metadata.passed = evaluation.summary.passed;
    report.metadata.warning = evaluation.summary.warning;
    report.metadata.failed = evaluation.summary.failed;
    report.metadata.inapplicable = evaluation.summary.inapplicable;
    // report.system.page.dom.elementCount = evaluation.dom.elementCount; !! TODO
    report.modules = {};
    // report.modules.counter = evaluation.counter; !! TODO
    report.modules["act-rules"] = evaluation.act;
    report.modules["wcag-techniques"] = evaluation.wcag;
    report.modules["best-practices"] = evaluation.bp;

    console.log('Built Report');
    setReport(report);
  };

  useEffect(() => {
    if (!reEvltd && prevOriginalData.data && prevDataProcess.metadata && (code.length != 0)) {
      setOriginalData(prevOriginalData);
      setDataProcess(prevDataProcess);
      return;
    }

    if (reEvltd) {
      setReEvltd(false);
    }

    buildReport();
  }, [reEvltd]);

  useEffect(() => {
    const parseResults = async () => {
      const parsedResults = await parseEvaluationReport(report);
      dispatch(setData(parsedResults));
      dispatch(setPageCode(parsedResults.pagecode || "html"));
      setOriginalData(parsedResults);
    }

    if (report && !originalData) {
      parseResults();
    }
  }, [report]);

  useEffect(() => {
    const processData = async () => {
      const processedData = await processReportData(originalData.data.tot, evaluation.url);
      dispatch(setProcessedData(processedData));
      setDataProcess(processedData);
    }

    if (originalData && !dataProcess) {
      processData();
    }
  }, [originalData]);

  useEffect(() => {
    if (dataProcess) {
      setLoadingProgress(false);
      console.log('Set Loading State Off');
    }
  }, [dataProcess]);

  const reRequest = async () => {
    // DELETE STORED VALUES
    dispatch(reset());

    // EVALUATE PAGE
    let act, bp, html, summary, url, wcag;

    // get page's url
    url = await getUrl();
    dispatch(setURL(url));
    
    // start evaluation
    await startEvaluation();

    // get html
    html = await getHTML();
    dispatch(setDom({ html: html }));

    // evaluate act
    act = await evaluateACT();
    dispatch(setACT(act));

    // evaluate wcag
    wcag = await evaluateWCAG();
    dispatch(setWCAG(wcag));

    // evaluate bp
    bp = await evaluateBP();
    dispatch(setBP(bp));

    // finish evaluation
    summary = await endingEvaluation();
    dispatch(setSummary(summary));

    if (act && wcag && bp) {
      dispatch(setEvaluated());
    }

    // RELOAD ALL VARIABLES
    setLoadingProgress(true);
    setReport();
    setOriginalData();
    setDataProcess();
    setReEvltd(true);
    
    return true;
  };

  const seeCode = () => {
    navigate(`${pathURL}results/code`);
  };

  function setAllDataResult(ele, allData) {
    setAllData(allData);
    // const type = allData.rawUrl;

    // if (type === "") {
    //   if(ele.startsWith('http://') || ele.startsWith('https://')) {
    //     console.log("é URL")
    //     window.open(ele, '_blank');
    //   } else {
    navigate(`${pathURL}results/${ele}`);
    //   }
    // } else {
    //   if(ele.startsWith('http://') || ele.startsWith('https://')) {
    //     console.log("é URL")
    //     window.open(ele, '_blank');
    //   } else {
    //     navigate(`${pathURL}results/${ele}`);
    //   }
    // }
  }

  const dataBreadCrumb = [
    {
      title: "Acessibilidade.gov.pt",
      href: "https://www.acessibilidade.gov.pt/",
    },
    { title: "Access Monitor" },
    { title: evaluation.url }
  ];

  let scoreData = originalData?.data?.tot?.info?.score;

  if (scoreData === "10.0") {
    scoreData = "10";
  }

  return (
    <div className={`container ${themeClass}`}>
      <div className="link_breadcrumb_container">
        <Breadcrumb data={dataBreadCrumb} darkTheme={theme} tagHere={t("HEADER.DROPDOWN.youarehere")} />
      </div>

      <div className="report_container">
        <h1 className="report_container_subtitle">{t("RESULTS.title")}</h1>
        {loadingProgress ? (
          <section className={`loading_container bg-white`}>
            <LoadingComponent loadingText={t("MISC.loading")} darkTheme={theme} />
          </section>
        ) : (
          !error ? <ButtonsActions
            reRequest={reRequest}
            seeCode={seeCode}
            downloadCSV={() => downloadCSV(dataProcess, originalData.data, t)}
            href={dataProcess?.metadata?.url}
            themeClass={themeClass}
          /> : <h3>{error}</h3>
        )}
      </div>
      {!loadingProgress && !error && (
        <>
          <section className="sumary_container bg-white">
            <h2>{t("RESULTS.summary.title")}</h2>
            <div className="d-flex flex-row mt-5 mb-5 justify-content-between container_uri_chart">
              <div className="chart_container">
                <Gauge percentage={scoreData} darkTheme={theme} title={[t("RESULTS.summary.score")]}  />
              </div>
              <div className="resume_info_about_uri d-flex flex-column gap-4">
                <div className="d-flex flex-column">
                  <span>URL</span>
                  <span className="break_url">{dataProcess?.metadata?.url}</span>
                </div>

                <div className="d-flex flex-column">
                  <span>{t("RESULTS.summary.metadata.title_label")}</span>
                  <span>{dataProcess?.metadata?.title}</span>
                </div>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-between size_and_table_container">
              <div className="size_container d-flex flex-column gap-4">
                <div className="d-flex flex-column">
                  <span>{dataProcess?.metadata?.n_elements}</span>
                  <span>{t("RESULTS.summary.metadata.n_elements_label")}</span>
                </div>

                <div className="d-flex flex-column">
                  <span>{dataProcess?.metadata?.size}</span>
                  <span>{t("RESULTS.summary.metadata.page_size_label")}</span>
                </div>
              </div>
              <div className="table_container_sumary">
                <StatsTable
                  data={{data: dataProcess}}
                  darkTheme={theme}
                  ok={t("RESULTS.summary.table.labels.ok")}
                  warning={t("RESULTS.summary.table.labels.warn")}
                  error={t("RESULTS.summary.table.labels.err")}
                  title={t("RESULTS.summary.table.title")}
                  caption={t("RESULTS.summary.metadata.caption")}
                  type={t("RESULTS.summary.table.typeLabel")}
                />
              </div>
            </div>
          </section>
          <section className="bg-white avaliation_container">
            <h2 className="avaliation_title mb-3">{t("RESULTS.results.title")}</h2>
            <TableComponent
              data={optionForAccordion(t, dataProcess)}
              onClick={(ele) => setAllDataResult(ele, originalData)}
              imageTitlesCallback={(img) => callbackImgT(t, img)}
              caption={t("RESULTS.results.caption")}
              col1={t("RESULTS.results.practice")}
              col2={t("RESULTS.results.lvl")}
              col3={t("RESULTS.results.details")}
              lvlTitle={t("RESULTS.results.lvl") + ": "}
              ariaLabel={t("RESULTS.results.details")}
              darkTheme={theme}
              ariaLabels={{
                button: t("RESULTS.results.details"),
                A: t("RESULTS.results.ariaLabels.A"),
                AA: t("RESULTS.results.ariaLabels.AA"),
                AAA: t("RESULTS.results.ariaLabels.AAA")
              }}
            />
          </section>
        </>
      )}
    </div>
  );
}
