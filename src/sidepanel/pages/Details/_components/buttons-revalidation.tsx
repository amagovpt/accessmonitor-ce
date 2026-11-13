/* eslint-disable jsx-a11y/anchor-is-valid */

import { useTranslation } from 'react-i18next';

import { Button, Icon } from 'ama-design-system';

export interface ButtonsActionsProps {
  handleGoBack: () => void;
  themeClass: string;
  theme: string;
}

export function ButtonsActions({
  handleGoBack,
  themeClass,
  theme,
}: ButtonsActionsProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={`d-flex justify-content-between ${themeClass}`}>
        <div className="d-flex flex-row gap-3 other">
          <Button
            darkTheme={theme}
            size="md"
            variant="secondary"
            text={t('RESULTS.actions.back')}
            iconLeft={<Icon name="AMA-SetacurtaoficialEsq-Line" />}
            onClick={handleGoBack}
          />
        </div>
      </div>
    </>
  );
}

export interface ButtonsHighlightProps {
  handleHighlight: () => void;
  themeClass: string;
  theme: string;
  txt: string;
}

export function ButtonsHighlight({
  handleHighlight,
  themeClass,
  theme,
  txt,
}: ButtonsHighlightProps) {
  return (
    <>
      <div className={`d-flex justify-content-between ${themeClass}`}>
        <div className="d-flex flex-row gap-3 other">
          <Button
            darkTheme={theme}
            size="md"
            variant="primary"
            text={txt}
            onClick={handleHighlight}
          />
        </div>
      </div>
    </>
  );
}
