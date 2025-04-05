// import "./styles.css";

import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Breadcrumb, Icon, LoadingComponent } from "ama-design-system";

import { TableDetails } from "./_components/TableDetails";

import { pathURL } from "../../App";

import { ThemeContext } from "../../../context/ThemeContext";

export default function Details({ allData, setAllData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { details } = useParams();
  const { theme } = useContext(ThemeContext);

  const evaluation = useSelector((state) => state.evaluation);
  const tot = evaluation.data.data.tot;

  const [loadingProgress, setLoadingProgress] = useState(true);
  const [error, setError] = useState(false);

  const themeClass = theme === "light" ? "" : "dark_mode-details";

  const url = allData?.data?.rawUrl;

  const handleGoBack = () => {
    navigate(`${pathURL}results`);
  };

  const textHeading = t(`ELEMS.${details}`);
  const [dataTable, setDataTable] = useState([]);

  const dataBreadCrumb = [
    {
      title: "Acessibilidade.gov.pt",
      href: "https://www.acessibilidade.gov.pt/",
    },
    { title: "Access Monitor" },
    { title: url },
    { title: textHeading }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const nodes = allData.data.nodes;
      const response = await getTestResults(details, nodes, tot);
      setDataTable(response);
      setLoadingProgress(false);
    };

    fetchData();
  }, []);

  let iconName;

  if (dataTable?.result === "R") {
    iconName = "AMA-Wrong-Line";
  } else if (dataTable?.result === "Y") {
    iconName = "AMA-Middle-Line";
  } else {
    iconName = "AMA-Check-Line";
  }

  let tdClassName;

  if (dataTable?.result === "R") {
    tdClassName = "error-cell";
  } else if (dataTable?.result === "Y") {
    tdClassName = "warning-cell";
  } else {
    tdClassName = "success-cell";
  }

  return (
    <>
      <div className={`container ${themeClass}`}>
        <div className="link_breadcrumb_container">
          <Breadcrumb data={dataBreadCrumb} onClick={handleGoBack} darkTheme={theme} tagHere={t("HEADER.DROPDOWN.youarehere")} />
        </div>

        <div className="report_container">
          <h1 className="report_container_title mb-5">
            {t("ELEMENT_RESULTS.subtitle")}
          </h1>
        </div>

        {loadingProgress ? (
          <section className={`loading_container bg-white`}>
            <LoadingComponent loadingText={t("MISC.loading")} darkTheme={theme} />
          </section>
        ) : 
        !error ? <>
            <div className="bg-white show_details">
              <div className="d-flex flex-row justify-content-between align-items-center show_details-container">
                <div className="d-flex flex-row align-items-center">
                  <div className={`d-flex align-items-center justify-content-center m-2 p-3 ${tdClassName}`}>
                    <Icon name={iconName} />
                  </div>

                  <span
                    className="textHeader ama-typography-body-large bold"
                    dangerouslySetInnerHTML={{ __html: textHeading }}
                  />
                </div>

                <div className="result_left_container">
                  <span className="ama-typography-display-6 bold p-2 ps-4">{dataTable?.size}</span>
                  <span className="ama-typography-body p-2">{t("ELEMENT_RESULTS.total_elements")}</span>
                </div>
              </div>
            </div>

            <div className="tabContent_container-details">
              <TableDetails data={dataTable?.elements} />
            </div>
          </> : <h3>{error}</h3>
        }
      </div>
    </>
  );
}
