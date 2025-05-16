// import "./styles.css";

import { useTranslation } from "react-i18next";

import { ButtonsHighlight } from "./buttons-revalidation";

const renderHTML = (htmlString) => {
  return { __html: htmlString };
};

export function TableDetails({ themeClass, theme, data }) {
  const { t } = useTranslation();

  const handleHighlightElement = async (index, code) => {
    // highlight element
    const highlighted = await highlightElement(code);

    // change button
    const hideButton = document.getElementById(`hideElement_${index + 1}`);
    const showButton = document.getElementById(`showElement_${index + 1}`);

    if (hideButton) {
      hideButton.style.display = highlighted ? "block" : "none";
    }
    if(showButton) {
      showButton.style.display = highlighted ? "none" : "block";
    }
  };

  return (
    <table className="table1 table">
      <caption className="visually-hidden">
        {t("ELEMENT_RESULTS.result.caption")}
      </caption>
      <thead>
        <tr>
          <th scope="col" className="th_size">{t("ELEMENT_RESULTS.result.ocurrenceNumber")}</th>
          <th scope="col" >{t("ELEMENT_RESULTS.result.ocurrenceDetail")}</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((item, index) => (
            <>
              <tr key={index}>
                <td className="ama-typography-display-4 align-middle text-center">{index + 1}</td>
                <td>
                  <dl className="text-start">
                    <dt className="mb-2">{t("ELEMENT_RESULTS.result.element")}</dt>
                    <dd className="mb-4">{item?.ele}</dd>
                    <dt className="mb-2">{t("ELEMENT_RESULTS.result.code")}</dt>
                    <dd className="mb-4"><code>{item?.code}</code></dd>
                    <dt>{t("ELEMENT_RESULTS.result.content")}</dt>
                    <dd className="mb-4">
                      <div
                        className="img"
                        dangerouslySetInnerHTML={renderHTML(item.showCode)}
                      />
                    </dd>
                    <dt className="mb-2">{t("ELEMENT_RESULTS.result.location")}</dt>
                    <dd className="mb-4">{item?.pointer}</dd>
                    <dt className="mb-2">{t("ELEMENT_RESULTS.result.highlight_element")}</dt>
                    <dd className="mb-4">
                      <div>
                        <div style={{display: "block"}} id={`showElement_${index + 1}`}>
                          <ButtonsHighlight
                            handleHighlight={() => handleHighlightElement(index, item?.pointer)}
                            themeClass={themeClass}
                            theme={theme}
                            txt={t("ELEMENT_RESULTS.result.actions.highlight")}
                          />
                        </div>
                        <div style={{display: "none"}} id={`hideElement_${index + 1}`}>   
                          <ButtonsHighlight
                            handleHighlight={() => handleHighlightElement(index, item?.pointer)}
                            themeClass={themeClass}
                            theme={theme}
                            txt={t("ELEMENT_RESULTS.result.actions.hide")}
                          />
                        </div>
                      </div>
                    </dd>
                  </dl>
                </td>
              </tr>
            </>
          ))}
      </tbody>
    </table>
  );
}
