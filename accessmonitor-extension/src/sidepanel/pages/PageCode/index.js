// import "./styles.css";

import { useContext, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Breadcrumb, LoadingComponent } from 'ama-design-system'

import { ButtonsActions } from "./_components/buttons-revalidation";

import { pathURL } from "../../App";

import { downloadCSV } from "../../../utils/utils";
import { ThemeContext } from "../../../context/ThemeContext";

export default function PageCode({ setAllData, setEle }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState(false);

  const [dataProcess, setDataProcess] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [pageCode, setPageCode] = useState();
  
  const { theme } = useContext(ThemeContext);
  const themeClass = theme === "light" ? "" : "dark_mode-code";

  const evaluation = useSelector((state) => state.evaluation);
  const dataProcessPrev = evaluation.processedData || null;
  const originalDataPrev = evaluation.originalData || null;

  const code = evaluation.pageCode || null;

  const handleGoBack = () => {
    navigate(`${pathURL}results`);
  };

  useEffect(() => {
    const fetchData = () => {
      setOriginalData(originalDataPrev);
      setDataProcess(dataProcessPrev);
      setPageCode(code);
      setLoadingProgress(false);
    };

    fetchData();
  }, []);

  const dataBreadCrumb = [
    {
      title: "Acessibilidade.gov.pt",
      href: "https://www.acessibilidade.gov.pt/",
    },
    { title: "Access Monitor" },
    { title: evaluation.url },
    { title: t("HEADER.NAV.code") }
  ];

  return (
    <div className={`container ${themeClass} `}>
      <div className="link_breadcrumb_container">
        <Breadcrumb data={dataBreadCrumb} onClick={handleGoBack} darkTheme={theme} />
      </div>
      <div className="report_container">
        <div className="acess_monitor" lang="en">
          AccessMonitor
        </div>
        <h1 className="report_container_title py-3">
          {dataProcess?.metadata?.url || "html"}
        </h1>
        <p className="report_container_subtitle">{t("HEADER.NAV.code")}</p>
        {loadingProgress ? (
          <section className={`loading_container bg-white`}>
            <LoadingComponent loadingText={t("MISC.loading")} darkTheme={theme} />
          </section>
        ) : (
          !error ? <ButtonsActions
              downloadCSV={() => downloadCSV(dataProcess, originalData.data, t)}
              handleGoBack={() => handleGoBack()}
              themeClass={themeClass}
            /> : <h3>{error}</h3>
        )}
      </div>
      {!loadingProgress && !error ? <section className="html_code">
        <pre tabIndex="0">{pageCode || `<></>`}</pre>
      </section> : null}
    </div>
  );
}
