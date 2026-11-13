import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Header } from './_components/Header';

import { accessMonitorURL, pathURL } from '../../App';

import { useTheme } from '../../../context/ThemeContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const mainDark = theme === 'light' ? '' : 'main_dark';

  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();

  const toggleLanguage = () => {
    if (language === 'en') {
      changeLanguage('pt');
      document.querySelector('html')?.setAttribute('lang', 'pt-PT');
    } else {
      changeLanguage('en');
      document.querySelector('html')?.setAttribute('lang', 'en');
    }
  };

  return (
    <>
      <Header
        darkTheme={theme}
        logo={
          theme === 'light'
            ? `${accessMonitorURL}img/logo.svg`
            : `${accessMonitorURL}img/logo-dark.svg`
        }
        homePage={location.pathname === `${pathURL}` ? true : false}
        language={language}
        changeLanguage={toggleLanguage}
        changeTheme={toggleTheme}
        ariaLabel={t('HEADER.header_arial_label')}
      />
      <main
        className={`main ${mainDark}`}
        id="content"
        aria-label={t('HOME_PAGE.main_aria')}
      >
        {children}
      </main>
    </>
  );
}
