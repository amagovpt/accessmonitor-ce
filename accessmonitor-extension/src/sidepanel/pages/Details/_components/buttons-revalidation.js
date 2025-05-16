/* eslint-disable jsx-a11y/anchor-is-valid */
// import "./styles.css";

import { useTranslation } from "react-i18next";

import { Button, Icon } from 'ama-design-system';

export function ButtonsActions({ handleGoBack, themeClass, theme }) {
  const { t } = useTranslation();

  return (
    <>
      <div className={`d-flex justify-content-between ${themeClass}`}>
        <div className="d-flex flex-row gap-3 other">
          <Button
            darkTheme={theme}
            size="md"
            variant="secondary"
            text={t("RESULTS.actions.back")}
            iconLeft={<Icon name="AMA-SetacurtaoficialEsq-Line" />}
            onClick={handleGoBack}
          />
        </div>
      </div>
    </>
  );
}

export function ButtonsHighlight({ handleHighlight, themeClass, theme, txt }) {
  return (
    <>
      <div className={`d-flex justify-content-between ${themeClass}`}>
        <div className="d-flex flex-row gap-3 other">
          <Button
            darkTheme={theme}
            size="md"
            variant="secondary"
            text={txt}
            onClick={handleHighlight}
          />
        </div>
      </div>
    </>
  );
}