import React from "react";
import { WidgetBar } from "./components/widgets-bar";

import "./styles/styles.css";

const pt = {
  language: "en",
  skip_to_main: "Saltar para o conteúdo principal",
  dark_mode: "Modo escuro",
  light_mode: "Modo claro",
  language_en: "See in english",
  open_dropdown: "pressione para expandir a nossa lista de aplicações e sítios web",
  close_dropdown: "pressione para comprimir a nossa lista de aplicações e sítios web",
  tool: "Uma ferramenta do ecossistema do ",
  text: "Os sítios e as ferramentas de apoio à acessibilidade e à usabilidade, para garantir a promoção das boas práticas e melhorar a experiência de utilização dos serviços digitais.",
  accessibilityText: "Divulgação, partilha e promoção das melhores práticas de acessibilidade para conteúdos Web e aplicações móveis.",
  accessibilityLink1: "DL n.º 83/2018 – acessibilidade da Web e das aplicações móveis",
  accessibilityLink2: "Gerar a Declaração de acessibilidade",
  accessibilityLink3: "Validador AccessMonitor",
  usabilityText: "Recursos, ferramentas e boas práticas para melhorar a usabilidade e a experiência de utilização dos serviços digitais.",
  usabilityLink1: "Guia de usabilidade",
  usabilityLink2: "Lista de verificação",
  usabilityLink3: "Componentes",
  usabilityLink4: "Como realizar testes de usabilidade?",
  usabilityLink5: "Como desenvolver aplicações móveis?",
  badgeText: "Selo de excelência que premeia as boas práticas de acessibilidade e usabilidade nos sítios Web dos serviços públicos.",
  badgeLink1: "Candidatura",
  badgeLink2: "Requisitos do Selo",
  badgeLink3: "Kit de apoio",
  badgeLink4: "Como obter o selo",
  roleDescription: "painel de acordeão"
}

const en = {
  language: "pt-PT",
  skip_to_main: "Skip to main content",
  dark_mode: "Dark mode",
  light_mode: "Light mode",
  language_en: "Ver em português",
  open_dropdown: "press to expand our list of applications and websites",
  close_dropdown: "press to compress our list of applications and websites",
  tool: "A tool of the ecosystem from ",
  text: "Sites and tools to support accessibility and usability, to ensure promotion good practices and improve the experience of using digital services.",
  accessibilityText: "Dissemination, sharing and promotion of best accessibility practices for web content and mobile applications.",
  accessibilityLink1: "DL n.º 83/2018 - accessibility of the web and mobile applications",
  accessibilityLink2: "Generate the Accessibility Statement",
  accessibilityLink3: "AccessMonitor Validator",
  usabilityText: "Resources, tools and good practices to improve the usability and experience of using digital services.",
  usabilityLink1: "Usability Guide",
  usabilityLink2: "Verification list",
  usabilityLink3: "Components",
  usabilityLink4: "How to perform usability testing?",
  usabilityLink5: "How to develop mobile applications?",
  badgeText: "Seal of excellence that rewards good accessibility and usability practices on public service websites.",
  badgeLink1: "Candidacy",
  badgeLink2: "Badge requirements",
  badgeLink3: "Support kit",
  badgeLink4: "How to get the badge",
  roleDescription: "accordion panel"
}

export function Header({description, language, title, title2, logo, darkTheme, changeTheme, changeLanguage, homePage, linkTo, ariaLabel, obsSpecial}) {
  const theme = darkTheme === "dark" ? "dark" : ""

  const lngTexts = language === "en" ? en : pt

  return (
    <header id="wrapper-navbar" aria-label={ariaLabel} className={`${theme} ama`}>
      <div className="skip-to-content">
        <div className="container">
          <a className="skip-to-content-link d-flex align-items-center ama-typography-action-small py-2 px-3 my-3" href="#content">
            {lngTexts.skip_to_main}
          </a>
        </div>
      </div>

      <WidgetBar
        logo={logo}
        title={title}
        title2={title2}
        description={description}
        changeTheme={changeTheme ? () => changeTheme() : null}
        changeLanguage={changeLanguage ? () => changeLanguage() : changeTheme}
        darkTheme={darkTheme}
        homePage={homePage}
        linkTo={linkTo}
        lngTexts={lngTexts}
        obsSpecial={obsSpecial}
      />
    </header>
  );
}
