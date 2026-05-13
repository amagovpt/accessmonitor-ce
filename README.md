# Guia de Instalação da Extensão AccessMonitor para Chrome

A extensão **AccessMonitor** permite avaliar a acessibilidade de qualquer página Web diretamente no browser, com base nas diretrizes WCAG 2.1.

---

## Passo 1 — Aceder à página da extensão

1. Abra o browser **Google Chrome**.
2. Aceda ao site do AccessMonitor: [https://accessmonitor.acessibilidade.gov.pt](https://accessmonitor.acessibilidade.gov.pt)
3. No topo da página, clique no link **"Extensão para Chrome"**.

<!-- 📸 IMAGEM 1: Inserir aqui a captura "passo1-site-accessmonitor.png"
     (screenshot do site AccessMonitor com a seta a apontar para o link "Extensão para Chrome") -->
![Passo 1 – Site AccessMonitor com link para a extensão](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/Step01.png)

> Será redirecionado para a página da extensão na Chrome Web Store.

---

## Passo 2 — Instalar a extensão

1. Na página da **Chrome Web Store**, clique no botão **"Instalar"** (canto superior direito).

<!-- 📸 IMAGEM 2: Inserir aqui a captura "passo2-chrome-webstore-instalar.png"
     (screenshot da Chrome Web Store com a seta a apontar para o botão "Instalar") -->
![Passo 2 – Botão Instalar na Chrome Web Store](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/Step02.png)

2. Aparecerá uma janela de confirmação com o título **"Add AccessMonitor Extension?"**.
3. Clique em **"Add extension"** para confirmar a instalação.

<!-- 📸 IMAGEM 3: Inserir aqui a captura "passo3-confirmacao-adicionar.png"
     (screenshot da janela de confirmação com a seta a apontar para "Add extension") -->
![Passo 3 – Janela de confirmação de instalação](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/step03.png)

> A extensão ficará instalada automaticamente no seu Chrome.

---

## Passo 3 — Fixar (pin) a extensão para acesso rápido

Após a instalação, a extensão pode não estar visível na barra de ferramentas. Para a fixar:

1. Clique no ícone de **extensões** (ícone de peça de puzzle 🧩) no canto superior direito do Chrome.
2. Na lista de extensões, localize **"AccessMonitor Extension"**.
3. Clique no ícone de **pin** 📌 ao lado do nome da extensão para a fixar na barra de ferramentas.

<!-- 📸 IMAGEM 4: Inserir aqui a captura "passo4-pin-extensao.png"
     (screenshot do painel de extensões com a seta a apontar para o pin do AccessMonitor) -->
![Passo 4 – Fixar a extensão na barra de ferramentas](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/step04.png)

> O ícone do AccessMonitor (letra **A** azul) passará a aparecer sempre visível na barra do Chrome.

---

## Passo 4 — Utilizar a extensão numa página Web

1. Navegue até à página Web que pretende avaliar.
2. Clique no ícone do **AccessMonitor** na barra de ferramentas do Chrome.
3. Um painel lateral abrirá no lado direito do browser.
4. Clique no botão **"Avaliar página"** para iniciar a análise de acessibilidade.

<!-- 📸 IMAGEM 5: Inserir aqui a captura "passo5-avaliar-pagina.png"
     (screenshot com o painel do AccessMonitor aberto à direita e o botão "Avaliar página" visível) -->
![Passo 5 – Painel do AccessMonitor com botão "Avaliar página"](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/step05.png)

> O relatório será gerado automaticamente, mostrando a pontuação e os eventuais erros de acessibilidade encontrados na página.

---

## Resumo dos passos

| Passo | Ação |
|-------|------|
| 1 | Aceder a [accessmonitor.acessibilidade.gov.pt](https://accessmonitor.acessibilidade.gov.pt) e clicar em "Extensão para Chrome" |
| 2 | Clicar em "Instalar" na Chrome Web Store |
| 3 | Confirmar com "Add extension" na janela de diálogo |
| 4 | Fixar a extensão clicando no ícone 🧩 e depois no pin 📌 |
| 5 | Abrir a extensão e clicar em "Avaliar página" |

---

## Estrutura de ficheiros sugerida

Para que as imagens apareçam corretamente, guarde as capturas de ecrã numa pasta chamada `imagens/` na mesma localização do README:

```
📁 projeto/
├── README-AccessMonitor-Extension.md
└── 📁 imagens/
    ├── passo1-site-accessmonitor.png       ← Imagem 1 (site com link para extensão)
    ├── passo2-chrome-webstore-instalar.png ← Imagem 2 (botão "Instalar")
    ├── passo3-confirmacao-adicionar.png    ← Imagem 3 (janela "Add extension")
    ├── passo4-pin-extensao.png             ← Imagem 4 (fixar extensão)
    └── passo5-avaliar-pagina.png           ← Imagem 5 (painel "Avaliar página")
```

---

## Notas

- A extensão é gratuita e desenvolvida pela [ARTE](https://www.acessibilidade.gov.pt).
- Não é necessário criar conta para usar a extensão.

<!--

# accessmonitor-ce

**_AccessMonitor_ - Chrome Extension**<br>
(versão 1.0.4 de 20 abril 2026, disponível na _[Chrome Web Store da Google](https://chromewebstore.google.com/detail/accessmonitor-extension/knjdoonhhnjfmigigfgoehhihodndaii?hl=pt-PT&utm_source=ext_sidebar)_).

**Última atualização: 20 abril 2026** - A presente versão da extensão (versão 1.0.4) está publicada na _[Chrome Web Store da Google](https://chromewebstore.google.com/detail/accessmonitor-extension/knjdoonhhnjfmigigfgoehhihodndaii?hl=pt-PT&utm_source=ext_sidebar)_. mas já a pode usar instalando o código diretamente no seu _browser Chrome_ seguindo os seguintes passos:

1. Descarregue o código do presente repositório para a sua máquina.

Descarregue o ficheiro zip: [accessmonitor-ce-extension-v1.0.4.zip](https://github.com/amagovpt/accessmonitor-ce/releases/download/v1.0.4/accessmonitor-ce-extension-v1.0.4.zip).  

2. Na sua máquina descompacte o ficheiro .zip e ficará com a pasta `accessmonitor-ce-extension-v1.0.4/`

3. Abra o _Google Chrome_ e no campo de edição do URL escreva `chrome://extensions/`

Nesta página, verifique se no canto superior direito a opção "Modo de Programador" está ativa. Se não estiver, ative-a!

![ativar modo de programador](https://github.com/user-attachments/assets/8441df71-4977-4a8b-b4ed-58c3bebbc5c6)

A ativação desta opção fará surgir no canto superior esquerdo o botão "Carregar expandida". Se tem alguma versão da extensão do AccessMonitor já instalada, remova-a antes de instalar a nova. O cartão da extensão tem um botão "Remover" para esse efeito. Pressione nele e confirme a sua remoção, sem medos :-) .

![botão carregar expandida](https://github.com/user-attachments/assets/bd68cc92-1069-49e3-b18e-dd93daf0094f)

Pressione no botão "carregar expandida" e selecione a pasta `accessmonitor-ce-extension-v1.0.4/` que descompactou no passo 2. A seguir, pressione no botão "selecionar" para que o processo de carregamento da extensão se inicie.

<img width="967" height="509" alt="selecione a pasta accessmonitor-ce-extension-v1.0.4 e pressione o botão selecionar" src="https://github.com/user-attachments/assets/cab2304b-cabe-4243-be8b-8098ddd75e3b" />

4. Verifique se a extensão está ativa e fixe-a na barra de ferramentas

Isto fará surgir a extensão na página. No seu cartão, verifique que está ativa (ver botão no canto inferior direito do cartão).

![cartão da extensão AccessMonitor na página das extensões com estado ativo](https://github.com/user-attachments/assets/5966ca57-44cf-462b-83bc-37daecbea1fc)

Ative também em "Detalhe" a opção "Fixar na barra de ferramentas".

![ative a opção Fixar na Barra de Ferramentas](https://github.com/user-attachments/assets/d9c1fa53-9881-446f-a09e-aadb071450c4)

Isto fará com que no canto superior direito do seu _browser Chrome_ surja o botão "A" (AccessMonitor) que lhe permite usar a extensão em qualquer página web.

![botão de ativação da extensão AccessMonitor](https://github.com/user-attachments/assets/40ecc3f9-72bc-456e-8c56-5a757976bf6c)

Basta entrar na página da qual pretende fazer a sua avaliação, pressionar no botão "A" e no painel lateral que entretanto é aberto pressionar no botão "Validar".

![pressione no botão AccessMonitor para abrir a extensão](https://github.com/user-attachments/assets/c22e07c3-c463-4705-965b-e6bd46c02e16)

Boas avaliações!!

Qualquer problema que nos queira dar conta, [abra um issue e descreva o problema encontrado na extensão do AccessMonitor](https://github.com/amagovpt/accessmonitor-ce/issues). 
-->
