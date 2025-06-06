// import "./styles.css";

import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Header } from './_components/Header';

import { accessMonitorURL, pathURL } from '../../App';

import { ThemeContext } from '../../../context/ThemeContext';

export default function Layout({ children }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const mainDark = theme === "light" ? "" : "main_dark";

  const { t, i18n: {language, changeLanguage} } = useTranslation();

  const toggleLanguage = () => {
    if (language === "en") {
      changeLanguage("pt");
      document.querySelector("html")?.setAttribute("lang", "pt-PT");
    } else {
      changeLanguage("en");
      document.querySelector("html")?.setAttribute("lang", "en");
    }
  };

  return (
    <>
      <Header
        darkTheme={theme}
        logo={theme === "light" ? `${accessMonitorURL}img/logo.svg` : `${accessMonitorURL}img/logo-dark.svg`}
        homePage={location.pathname === `${pathURL}` ? true : false}
        language={language}
        changeLanguage={toggleLanguage}
        changeTheme={toggleTheme}
        ariaLabel={t("HEADER.header_arial_label")}
      />
      <main
        className={`main ${mainDark}`}
        id="content"
        aria-label={t("HOME_PAGE.main_aria")}
      >
        {children}
      </main>
    </>
  );
}
