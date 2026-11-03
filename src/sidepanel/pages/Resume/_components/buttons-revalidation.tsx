/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Icon } from 'ama-design-system';

export interface ButtonsActionsProps {
  reRequest: () => void | Promise<unknown>;
  downloadCSV: () => void;
  downloadAuditReport: () => void | Promise<void>;
  themeClass: string;
}

export function ButtonsActions({
  reRequest,
  downloadCSV,
  downloadAuditReport,
  themeClass,
}: ButtonsActionsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [seePage, setSeePage] = useState(false);

  const openPageLinks = () => {
    setSeePage(!seePage);
  };

  return (
    <>
      <div
        className={`d-flex flex-row justify-content-between deskGroupMobile ${themeClass}`}
      >
        <div className="d-flex flex-row gap-3 other">
          <Button
            size="md"
            variant="secondary"
            text={t('RESULTS.actions.re_evaluate')}
            iconRight={<Icon name="AMA-Reload-Line" />}
            onClick={() => reRequest()}
          />

          <div>
            <Button
              id="dropdownMenuButton"
              size="md"
              variant="secondary"
              text={t('RESULTS.actions.download')}
              iconRight={
                <Icon
                  name={seePage ? 'AMA-SetaCima3-Line' : 'AMA-SetaBaixo3-Line'}
                />
              }
              onClick={openPageLinks}
              aria-expanded={seePage}
            />
            {seePage && (
              <u
                className="dropdown-content show_dropdown"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <button onClick={downloadCSV}>
                    <span>{t('RESULTS.actions.download_simple')}</span>
                    <Icon name="AMA-DownloadSetacurta-Line" />
                  </button>
                </li>
                <li>
                  <button onClick={downloadAuditReport}>
                    <span>{t('RESULTS.actions.download_uploadable')}</span>
                    <Icon name="AMA-DownloadSetacurta-Line" />
                  </button>
                </li>
              </u>
            )}
          </div>
        </div>
      </div>

      <div className={`group_mobile ${themeClass}`}>
        <div className="firstGroupContainer">
          <Button
            size="md"
            variant="secondary"
            text={t('RESULTS.actions.re_evaluate')}
            iconRight={<Icon name="AMA-Reload-Line" />}
            onClick={() => reRequest()}
          />
        </div>

        <div className="secondGroupContainer">
          <div>
            <Button
              id="dropdownMenuButton"
              size="md"
              variant="secondary"
              text={t('RESULTS.actions.download')}
              iconRight={
                <Icon
                  name={seePage ? 'AMA-SetaCima3-Line' : 'AMA-SetaBaixo3-Line'}
                />
              }
              onClick={openPageLinks}
              aria-expanded={seePage}
            />
            {seePage && (
              <u
                className="dropdown-content show_dropdown"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <button onClick={downloadCSV}>
                    <span>{t('RESULTS.actions.download_simple')}</span>
                    <Icon name="AMA-DownloadSetacurta-Line" />
                  </button>
                </li>
                <li>
                  <button onClick={downloadAuditReport}>
                    <span>{t('RESULTS.actions.download_uploadable')}</span>
                    <Icon name="AMA-DownloadSetacurta-Line" />
                  </button>
                </li>
              </u>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
