// import "./styles.css";

import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Icon, LoadingComponent } from "ama-design-system";

import { TableDetails } from "./_components/TableDetails";
import { ButtonsActions, ButtonsHighlight } from "./_components/buttons-revalidation";

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

  const getElementsLocations = () => {
    let codes = [];
    dataTable?.elements?.map((element) => codes.push(element?.pointer));
    return codes;
  }

  const handleHighlightAllElements = async () => {
    const highlighted = await highlightAllElements(getElementsLocations());

    if (highlighted) {
      let i = 1;
      while (i <= dataTable?.elements?.length) {
        // change button
        const hideButton = document.getElementById(`hideElement_${i}`);
        const showButton = document.getElementById(`showElement_${i}`);

        if (hideButton) {
          hideButton.style.display = "block";
        }
        if(showButton) {
          showButton.style.display = "none";
        }

        i++;
      }

      // change general button
      const hideButton = document.getElementById('hideAllElements');
      const showButton = document.getElementById('showAllElements');

      if (hideButton) {
        hideButton.style.display = "block";
      }
      if(showButton) {
        showButton.style.display = "none";
      }
    } else {
      console.error("Failed to highlight elements");
    }
  }

  const handleUnhighlightAllElements = async () => {
    const unhighlighted = await unhighlightAllElements(getElementsLocations());

    if (unhighlighted) {
      let i = 1;
      while (i <= dataTable?.elements?.length) {
        // change button
        const hideButton = document.getElementById(`hideElement_${i}`);
        const showButton = document.getElementById(`showElement_${i}`);

        if (hideButton) {
          hideButton.style.display = "none";
        }
        if(showButton) {
          showButton.style.display = "block";
        }

        i++;
      }

      // change general button
      const hideButton = document.getElementById('hideAllElements');
      const showButton = document.getElementById('showAllElements');

      if (hideButton) {
        hideButton.style.display = "none";
      }
      if(showButton) {
        showButton.style.display = "block";
      }
    } else {
      console.error("Failed to unhighlight elements: " + codes);
    }
  }

  const handleGoBack = async () => {
    await unhighlightAllElements(getElementsLocations());
    navigate(`${pathURL}results`);
  };

  const textHeading = t(`ELEMS.${details}`);
  const [dataTable, setDataTable] = useState([]);

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
          {/* <Breadcrumb data={dataBreadCrumb} onClick={handleGoBack} darkTheme={theme} tagHere={t("HEADER.DROPDOWN.youarehere")} /> */}
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
            <div className="go-back">
              <ButtonsActions
                handleGoBack={() => handleGoBack()}
                themeClass={themeClass}
                theme={theme}
              />
            </div>

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

                <div className="result_left_container">
                  <span className="ama-typography-body bold p-3 ps-4">{t("ELEMENT_RESULTS.highlight_elements")}</span>
                  <span className="ama-typography-body p-2">
                    <div style={{display: "block"}} id={'showAllElements'}> 
                      <ButtonsHighlight
                        handleHighlight={() => handleHighlightAllElements()}
                        themeClass={themeClass}
                        theme={theme}
                        txt={t("ELEMENT_RESULTS.result.actions.highlight")}
                      />
                    </div>
                    <div style={{display: "none"}} id={'hideAllElements'}> 
                      <ButtonsHighlight
                        handleHighlight={() => handleUnhighlightAllElements()}
                        themeClass={themeClass}
                        theme={theme}
                        txt={t("ELEMENT_RESULTS.result.actions.hide")}
                      />
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div className="tabContent_container-details">
              <TableDetails themeClass={themeClass} theme={theme} data={dataTable?.elements} />
            </div>
          </> : <h3>{error}</h3>
        }
      </div>
    </>
  );
}
