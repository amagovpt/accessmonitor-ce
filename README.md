# Guia de Instalação da Extensão AccessMonitor para Chrome

A extensão **AccessMonitor** permite avaliar a acessibilidade de qualquer página Web diretamente no browser, com base nas diretrizes WCAG 2.1.

---

## Passo 1 — Aceder à página da extensão

1. Abra o browser **Google Chrome**.
2. Aceda ao site do AccessMonitor: [https://accessmonitor.acessibilidade.gov.pt](https://accessmonitor.acessibilidade.gov.pt)
3. No topo da página, clique no link **"Extensão para Chrome"**.

<!-- 📸 IMAGEM 1: Inserir aqui a captura "passo1-site-accessmonitor.png"
     (screenshot do site AccessMonitor com a seta a apontar para o link "Extensão para Chrome") -->
![Passo 1 – Site AccessMonitor com link para a extensão]([imagens/passo1-site-accessmonitor.png](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/Step01.png))

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
![Passo 3 – Janela de confirmação de instalação](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/Step03.png)

> A extensão ficará instalada automaticamente no seu Chrome.

---

## Passo 3 — Fixar (pin) a extensão para acesso rápido

Após a instalação, a extensão pode não estar visível na barra de ferramentas. Para a fixar:

1. Clique no ícone de **extensões** (ícone de peça de puzzle 🧩) no canto superior direito do Chrome.
2. Na lista de extensões, localize **"AccessMonitor Extension"**.
3. Clique no ícone de **pin** 📌 ao lado do nome da extensão para a fixar na barra de ferramentas.

<!-- 📸 IMAGEM 4: Inserir aqui a captura "passo4-pin-extensao.png"
     (screenshot do painel de extensões com a seta a apontar para o pin do AccessMonitor) -->
![Passo 4 – Fixar a extensão na barra de ferramentas](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/Step04.png)

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

## Passo 5 — Interpretar o Sumário de resultados

Após a avaliação, o painel apresenta um **Sumário** com a pontuação e a distribuição dos resultados.

<!-- 📸 IMAGEM 6: Inserir aqui a captura "passo6-resultados-sumario.png"
     (screenshot do painel com o sumário — pontuação 9.1, tabela de práticas com Aceitáveis/Para ver manualmente/Não aceitáveis) -->
![Passo 6 – Sumário de resultados do AccessMonitor](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/step06.png)

### Pontuação global

A pontuação vai de **0 a 10**. Quanto mais alta, melhor a acessibilidade da página.

- **9.1** (como no exemplo acima) — muito boa acessibilidade, com alguns pontos a melhorar.
- Abaixo de **5.0** — página com problemas sérios de acessibilidade.

### Informações da página

| Campo | O que significa |
|-------|----------------|
| **Elementos (x)HTML** | Número total de elementos HTML analisados na página |
| **Tamanho da página** | Peso total da página em KB |
| **Práticas encontradas** | Total de critérios WCAG verificados |

### Tabela de práticas — Tipo e nível

Os resultados são classificados em três tipos e três níveis de conformidade WCAG:

**Tipos de prática:**

- 🟢 **Aceitáveis** — critérios que a página cumpre corretamente. Não requerem ação.
- 🟡 **Para ver manualmente** — critérios que a ferramenta não consegue verificar automaticamente (ex: adequação de textos alternativos). Devem ser revistos por uma pessoa.
- 🔴 **Não aceitáveis** — critérios que a página **falha**. São erros de acessibilidade que devem ser corrigidos com prioridade.

**Níveis de conformidade WCAG:**

| Nível | Significado |
|-------|-------------|
| **A** | Nível mínimo obrigatório — falhas aqui tornam a página inacessível para muitos utilizadores |
| **AA** | Nível recomendado e exigido por lei em muitos países (incluindo Portugal) |
| **AAA** | Nível máximo de acessibilidade — difícil de atingir na totalidade, mas desejável |

**Exemplo de leitura** (com os resultados da imagem acima):

| Tipo | A | AA | AAA |
|------|---|----|-----|
| Aceitáveis (27) | 16 | 11 | 0 |
| Para ver manualmente (7) | 4 | 1 | 2 |
| Não aceitáveis (3) | 3 | 0 | 0 |
| **Total (37)** | **23** | **12** | **2** |

> Neste exemplo, existem **3 erros "Não aceitáveis"**, todos de nível **A** (o mais grave). São os primeiros a dever ser corrigidos.

---

## Passo 6 — Explorar a lista de Avaliação

Ao fazer scroll no painel, ou clicando no separador **"Avaliação"**, aparece a lista detalhada de todas as práticas encontradas.

<!-- 📸 IMAGEM 7: Inserir aqui a captura "passo7-lista-avaliacao.png"
     (screenshot da lista "Avaliação" com as práticas listadas — ícones coloridos, nível A/AA e botão "Ver detalhe") -->
![Passo 7 – Lista de práticas na vista Avaliação](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/step07.png)

Cada linha da lista apresenta:

| Elemento | O que significa |
|----------|----------------|
| **Ícone colorido** | 🟢 Aceitável · 🟡 Para ver manualmente · 🔴 Não aceitável |
| **Descrição da prática** | O critério WCAG que foi verificado e o resultado encontrado |
| **Nível** | A, AA ou AAA — indica a gravidade e obrigatoriedade do critério |
| **Ver detalhe** (ícone ≡🔍) | Abre o relatório completo daquela prática específica |

> O botão **"Ver detalhe"** (seta na imagem acima) é o passo seguinte para perceber exatamente onde está o problema na página.

---

## Passo 7 — Ver o detalhe de uma prática

Ao clicar no botão **"Ver detalhe"** (ícone ≡🔍) de qualquer prática, abre-se a vista **"Detalhes do teste"**.

<!-- 📸 IMAGEM 8: Inserir aqui a captura "passo8-detalhes-teste.png"
     (screenshot da vista "Detalhes do teste" com o código HTML da ocorrência destacado, botão "Destacar" e informações de localização) -->
![Passo 8 – Detalhes do teste com código da ocorrência](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/step08.png)
![Passo 8 – Detalhes do teste com código da ocorrência](https://github.com/bentojulio/accessmonitor-ce/blob/main/accessmonitor-images/step09.png)

Esta vista mostra, para cada ocorrência encontrada:

| Campo | O que significa |
|-------|----------------|
| **Elemento** | O tipo de tag HTML em causa (ex: `a`, `button`, `img`) |
| **Código** | O trecho de código HTML exato onde o problema foi detetado |
| **Conteúdo/texto** | O texto visível ou acessível associado ao elemento |
| **Localização** | O caminho no DOM que indica onde o elemento está na página (ex: `html > body:nth-child(2) > a:nth-child(1)`) |
| **Destacar elemento** | Botão que realça visualmente o elemento diretamente na página Web |

### Como usar o botão "Destacar"

1. Clique em **"Destacar"** (no topo) para ver todos os elementos encontrados para aquela prática.
2. Clique em **"Destacar elemento"** (junto a cada ocorrência) para localizar visualmente esse elemento específico na página à esquerda.

> Este recurso é muito útil para developers e auditores, pois permite identificar **exatamente onde** está o erro sem ter de procurar manualmente no código.

### Como voltar à lista

Clique no botão **← Voltar** no topo do painel para regressar à lista de Avaliação.

---

## Resumo dos passos

| Passo | Ação |
|-------|------|
| 1 | Aceder a [accessmonitor.acessibilidade.gov.pt](https://accessmonitor.acessibilidade.gov.pt) e clicar em "Extensão para Chrome" |
| 2 | Clicar em "Instalar" na Chrome Web Store |
| 3 | Confirmar com "Add extension" na janela de diálogo |
| 4 | Fixar a extensão clicando no ícone 🧩 e depois no pin 📌 |
| 5 | Abrir a extensão e clicar em "Avaliar página" |
| 6 | Interpretar o Sumário: pontuação, práticas aceitáveis, manuais e erros por nível WCAG |
| 7 | Explorar a lista de Avaliação e identificar práticas problemáticas |
| 8 | Clicar em "Ver detalhe" para ver o código, localização e destacar o elemento na página |

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
