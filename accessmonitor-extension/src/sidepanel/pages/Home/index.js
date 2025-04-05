// import "./styles.css";

import { useContext, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Breadcrumb, Button, Icon } from "ama-design-system";

import { accessMonitorURL, pathURL } from "../../App";
import { setACT, setBP, setDom, setEvaluated, setSummary, setURL, setWCAG } from '../../store/slice/evaluationSlice';

import { ThemeContext } from "../../../context/ThemeContext";

export default function Home() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [evltd, setEvltd] = useState(false);

    const results = () => {
        navigate(`${pathURL}results`);
    }

    const evaluate = async () => {
        let act, bp, html, summary, url, wcag;

        // get page's url
        url = await getUrl();
        dispatch(setURL(url));
        
        // start evaluation
        await startEvaluation();

        // get html
        html = await getHTML();
        dispatch(setDom({ html: html }));

        // evaluate act
        act = await evaluateACT();
        dispatch(setACT(act));

        // evaluate wcag
        wcag = await evaluateWCAG();
        dispatch(setWCAG(wcag));

        // evaluate bp
        bp = await evaluateBP();
        dispatch(setBP(bp));

        // finish evaluation
        summary = await endingEvaluation();
        dispatch(setSummary(summary));

        if (act && wcag && bp) {
            dispatch(setEvaluated());
            setEvltd(true);
        } else {
            setEvltd(false);
        }

        return true;
    };

    useEffect(() => {
        if (evltd) {
            results();
        }
    }, [evltd]);

    const breadcrumbs = [
        {
          title: "Acessibilidade.gov.pt",
          href: "https://www.acessibilidade.gov.pt/",
        },
        { title: "Access Monitor" }
      ];
    
      const { theme } = useContext(ThemeContext);
      const main_content_home = theme === "light" ? "" : "main_content_home";
      const imgUrl = theme === "light" ? `${accessMonitorURL}img/verify.svg` : `${accessMonitorURL}img/verify-dark.svg`;

    return (
        <>
            <div className="container">
                <div className="link_breadcrumb_container">
                    <Breadcrumb data={breadcrumbs} darkTheme={theme} tagHere={t("HEADER.DROPDOWN.youarehere")} />
                </div>

                <section className={`bg-white validator_container ${main_content_home}`}>
                    <div className="d-flex flex-column align-items-stretch left_container">
                        <div className="d-flex flex-column mb-4">
                            <p className="validator_container_description">
                                {t("HOME_PAGE.intro_text")}
                            </p>

                            <p className="validator_container_description">
                                {t("HOME_PAGE.intro_text_content")}
                            </p>
                        </div>

                        <div class="tabs-container">
                        <Button
                            darkTheme={theme}
                            text={t("HOME_PAGE.submit")}
                            size="lg"
                            id="btn-url"
                            iconRight={<Icon name="AMA-Setalongaoficial-Line" />}
                            type="submit"
                            onClick={evaluate}
                        />
                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-start right_container">
                        <img src={imgUrl} className="verify_img" alt="" />
                    </div>
                </section>
            </div>
        </>
    );
}