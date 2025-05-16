// import "./styles.css";

import { useContext, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button, Icon } from "ama-design-system";

import { pathURL } from "../../App";
import { setACT, setBP, setDom, setEvaluated, setNEvals, setSummary, setURL, setWCAG } from '../../store/slice/evaluationSlice';

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
            dispatch(setNEvals());
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
    
    const { theme } = useContext(ThemeContext);

    return (
        <>
            <div className="container">
                <div className="evaluate_container">
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
        </>
    );
}