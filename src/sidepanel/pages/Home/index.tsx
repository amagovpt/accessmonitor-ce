import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Icon } from 'ama-design-system';

import { pathURL } from '../../App';
import {
  setACT,
  setBP,
  setCounter,
  setDom,
  setEvaluated,
  setNEvals,
  setSummary,
  setURL,
  setWCAG,
} from '../../store/slice/evaluationSlice';

import {
  getUrl,
  startEvaluation,
  getHTML,
  evaluateACT,
  evaluateWCAG,
  evaluateBP,
  evaluateCounter,
  endingEvaluation,
} from '../../messaging';
import { useTheme } from '../../../context/ThemeContext';
import { useAppDispatch } from '../../store/hooks';

export default function Home() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [evltd, setEvltd] = useState(false);

  const results = () => {
    navigate(`${pathURL}results`);
  };

  const evaluate = async () => {
    const url = await getUrl();
    dispatch(setURL(url));

    await startEvaluation();

    const html = await getHTML();
    dispatch(setDom({ html: html }));

    const act = await evaluateACT();
    dispatch(setACT(act));

    const wcag = await evaluateWCAG();
    dispatch(setWCAG(wcag));

    const bp = await evaluateBP();
    dispatch(setBP(bp));

    const counter = await evaluateCounter();
    dispatch(setCounter(counter));

    const summary = await endingEvaluation();
    dispatch(setSummary(summary));

    if (act && wcag && bp && counter) {
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

  const { theme } = useTheme();

  return (
    <>
      <div className="container">
        <div className="evaluate_container">
          <Button
            darkTheme={theme}
            text={t('HOME_PAGE.submit')}
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
