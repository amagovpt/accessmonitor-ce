import { Icon } from "ama-design-system";
import React from "react";
export function WidgetBar({ description, logo, title, title2, changeTheme, changeLanguage, darkTheme, homePage, linkTo, lngTexts, obsSpecial }) {
  return (
    <div className="widgets-bar py-4">
      <div className="container">
        <div className="row ml-0 mr-0">
          <div className="col-12 col-lg-6 align-self-center">
            <div className="d-flex justify-content-between">
              {title && title2 ? 
                <>
                  {homePage ?
                    <>
                      {obsSpecial ?
                        <p className="logo d-flex flex-column">
                          <span className="title_h1 bold">{title}</span>
                          <span className="medium title_h1">{title2}</span>
                        </p>
                      :
                      <h1 className="logo d-flex flex-column">
                        <span className="title_h1">{title}</span>
                        <span className="medium title_h1">{title2}</span>
                      </h1>}
                    </>
                  : <p className="logo">
                      <a href={linkTo} className="title_h1 bold d-flex flex-column">
                        {title}
                        <span className="medium">{title2}</span>
                      </a>
                    </p>
                  }
                </>
              :
                <>
                  {homePage ? 
                    <h1 className="logo">
                      <img src={logo} alt="accessMonitor" lang="en" />
                    </h1>
                  : 
                    <p className="logo">
                      <a
                        href={linkTo}
                        title={title}
                      >
                        <img src={logo} alt="accessMonitor" lang="en" />
                      </a>
                    </p>
                  }
                </>
              }

              <div className="d-flex d-lg-none flex-column align-items-center"></div>
            </div>
          </div>

          {/* Menu */}

          <div className="d-flex flex-row gap-4 button-mobile">
            <button className="btn btn-link dark-mode p-1 d-flex align-items-center" onClick={changeTheme ? () => changeTheme() : null}>
              <span id="darkModeLabel-mobile" className="ama-typography-body">{darkTheme == "dark" ? lngTexts.light_mode : lngTexts.dark_mode}</span>
              <Icon name="AMA-EscuroClaro-Line icon-dark" aria-hidden="true" darkTheme={darkTheme} />
            </button>

            <button className="btn btn-link language-mode p-1  d-flex align-items-center" lang={lngTexts.language} onClick={changeLanguage ? () => changeLanguage() : null}>
              <span id="langModeLabel-mobile" className="ama-typography-body">{lngTexts.language_en}</span>
              <Icon name="AMA-Globo-Line icon-lang" aria-hidden="true" darkTheme={darkTheme} />
            </button>
          </div>

          <div className="col-12 col-lg-6 align-self-center ">
            <div className="site-description">
              <p className="ama-typography-body">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}  