# RAJ Transportes — landing page (React)

Site de apresentação e orçamento da RAJ Transportes, com sede em Juiz de Fora — MG e atendimento
em todo o Brasil. Formulário em 5 etapas com CEP automático, que monta a mensagem e abre o WhatsApp da empresa.

## Como executar

Requisitos: Node.js 18 ou superior.

```bash
npm install          # instala as dependências
npm run dev          # servidor de desenvolvimento em http://localhost:5173 (recompila ao salvar)
npm run build        # build de produção na pasta dist/
npm run preview      # serve a pasta dist/ em http://localhost:5173
npm run build:single # build + dist-single/index.html autônomo (tudo embutido em um arquivo)
npm run typecheck    # verificação de tipos do TypeScript
```

## Stack

- **React 19** com **TypeScript**.
- **esbuild** para desenvolvimento e build (`build.mjs`). É o mesmo compilador que o Vite usa internamente;
  aqui ele é chamado diretamente por um script curto, sem configuração extra.
- **react-icons** (conjunto Lucide e o ícone oficial do WhatsApp).
- **CSS com tokens** (`src/styles/tokens.css`), um arquivo de estilo por seção. Sem framework de CSS.
- Animações em CSS acionadas pelo estado do React (`useInView`, classes de estado). Nenhuma biblioteca
  de animação foi adicionada: o que a página precisa (entrada ao rolar, transições do formulário,
  galeria, menu, acordeão) é resolvido com transições CSS, o que mantém o pacote menor.
  A preferência `prefers-reduced-motion` é respeitada.
- Fonte Archivo, carregada do Google Fonts no `index.html`.

## Estrutura

```
index.html               ponto de entrada (o build troca ./src/main.tsx pelos arquivos compilados)
build.mjs                scripts de dev, build, preview e versão autônoma
public/                  favicon e robots.txt, copiados para dist/
src/
  main.tsx, App.tsx
  config/company.ts      dados oficiais da empresa, serviços, fotos, FAQ e links (edite aqui)
  context/               estado do orçamento (com a consulta de CEP), toast, política de privacidade
  hooks/                 rolagem, seção ativa, entrada ao rolar, movimento reduzido
  lib/                   telefone, CEP (ViaCEP), validação, mensagem do WhatsApp, rolagem
  components/            header, logo, galeria (lightbox), campos, formulário de orçamento, botão do WhatsApp
  sections/              hero, empresa, serviços, como funciona, frota, por que escolher,
                         sede, orçamento, FAQ, contato, rodapé (cada uma com seu CSS)
  styles/                tokens, base e componentes compartilhados
  assets/hero/           imagem exclusiva do hero (anexo 1)
  assets/brand/          logomarca oficial (anexo 3): PNG com fundo transparente + arquivo original
  assets/fleet/          fotografias da frota (anexos 4 em diante)
  assets/reference/      imagem de referência da seção de sede (anexo 2); não é usada na página
```

Ordem das seções: header sobreposto, hero em tela cheia, por que escolher a RAJ Transportes,
a empresa, serviços, como funciona, frota, nossa sede, orçamento, perguntas frequentes, contato e rodapé.

### Hero

- **Uma única fotografia** (`src/assets/hero/hero-raj-transportes-frota.jpg`, 1561×1008, proporção 1,549:1),
  sem cópia desfocada, sem segunda imagem e sem imagem de fundo em CSS.
- **O hero se adapta à foto:** a área da imagem (`.hero__media`) tem a largura toda da tela e
  `aspect-ratio: 1561 / 1008`. A foto preenche 100% dessa área, inteira, sem corte, sem deformação e
  sem espaços vazios. O hero não tem altura fixa de 100vh: a altura é a do header + largura ÷ 1,549.
- A área da imagem começa logo abaixo do header, para o menu não ficar sobre a logomarca do céu da foto.
- **Texto:** título "Fretes e mudanças para todo o Brasil.", frase "Experiência e compromisso em cada
  trajeto." e os botões "Solicitar orçamento" e "Conheça a RAJ". A linha "RAJ Transportes · Sede em
  Juiz de Fora — MG" foi retirada do hero (o nome e a sede continuam no header, nas seções e no rodapé).
  - Telas a partir de 1200 px: o texto fica sobre a faixa de cascalho na base da foto. Os veículos
    terminam a 78% da altura da foto; o texto fica nos 21% inferiores, com uma camada escura só nessa
    faixa. Os tamanhos do texto acompanham a largura da tela (a faixa também acompanha).
  - Telas menores: a faixa de cascalho é baixa demais para o texto, que fica logo abaixo da foto.
- Header fixo. Logo com 56 px de altura no computador e 42 px no celular (largura automática,
  `object-fit: contain`), numa placa branca.
- Para trocar a foto: substitua o arquivo e atualize `HERO_IMAGE` (caminho, largura e altura) em
  `src/config/company.ts`. Se a nova foto tiver outra composição, revise a faixa onde o texto pode ficar
  (`.hero__overlay` e o bloco `@media (min-width: 1200px)` em `hero.css`).

## Identidade visual

A paleta vem da nova logomarca: azul-marinho `#071A30` (letras "RAJ" e "Transportes") e azul royal
`#0B5CC5` (curva da estrada e sublinhado), sobre branco. Os neutros são tons frios derivados do marinho.
O verde `#25D366` (hover `#128C7E`) é usado somente nos elementos do WhatsApp.

- A arte oficial já contém o nome, então o header mostra só a logomarca (56 px de altura no computador,
  42 px no celular), sem repetir o texto ao lado.
- As cores da logo não foram alteradas. No rodapé azul-marinho, ela aparece sobre uma placa branca.
- Os títulos usam itálico pesado na linha de destaque, como o "Transportes" da logo.
- O nome é escrito sempre como **RAJ Transportes**.

## Formulário de orçamento

- Etapas: dados → serviço → trajeto (origem e destino) → carga → revisão.
- Etapa 1: nome e telefone com DDD válido obrigatórios; e-mail e empresa opcionais.
- Etapa 2: tipo de serviço obrigatório (e descrição se "Outro").
- Etapa 4: descrição da carga obrigatória; volume, caixas, data, ajuda e observações opcionais.
- Etapa 5: concordância com a política de privacidade.
- Erros aparecem em texto junto ao campo e num resumo acima do botão "Continuar" (cada item leva ao campo), e o foco vai para o primeiro erro.
- Um clique duplo em "Continuar" avança uma etapa só (trava de 0,4 s após avançar).
- "Continuar" é um botão comum (`type="button"`) que chama a validação diretamente, e Enter nos campos faz o mesmo.
  Assim o avanço não depende do envio nativo do formulário, que navegadores bloqueiam em iframes com sandbox
  (era a causa do botão que não avançava na pré-visualização publicada). Espaços em branco não
  contam como preenchimento. Os dados ficam guardados ao avançar e voltar.
- O botão final abre `https://wa.me/5532988150081` com a mensagem codificada. O pedido só chega
  à empresa quando o cliente toca em enviar no WhatsApp, e o site informa isso.
- Nenhum dado é enviado a servidor ou armazenado.

### Etapa 3: endereços de origem (coleta) e destino (entrega)

Os dois blocos têm os mesmos campos, nesta ordem:

| Campo | Regra |
| --- | --- |
| CEP | obrigatório, 8 números (máscara 00000-000) |
| Rua, avenida ou logradouro | obrigatório |
| Número | obrigatório ("S/N" quando não houver) |
| Complemento | obrigatório; a caixa "Não há complemento" grava "Não se aplica" |
| Tipo de imóvel | obrigatório: Casa, Apartamento ou Outro |
| Andar | só aparece e só é obrigatório para Apartamento |
| Nº do apartamento | opcional (único campo opcional do endereço); só aparece para Apartamento |
| Interfone | só aparece e só é obrigatório para Apartamento; a caixa "Não possui interfone" grava "Não possui" |
| Bairro | obrigatório |
| Cidade | obrigatória |
| Estado (UF) | obrigatório (lista com as 27 UFs) |

- Ao trocar o tipo de imóvel, os valores de apartamento já digitados são mantidos; eles só entram na
  revisão e na mensagem quando o tipo é Apartamento. O nº do apartamento só aparece se for informado.
- "Inverter origem e destino" troca o endereço completo.
- Revisão e mensagem do WhatsApp mostram, para cada lado: CEP, endereço (rua e número), complemento,
  tipo de imóvel, andar/apartamento/interfone quando for apartamento, bairro e cidade/UF.

### Preenchimento automático pelo CEP (ViaCEP)

Arquivos: `src/lib/cep.ts` (consulta), `src/context/QuoteContext.tsx` (estado, concorrência, preenchimento),
`src/components/quote/QuoteSteps.tsx` (campo, botão de busca e mensagens). Integrado à etapa 3 do
formulário (blocos "Endereço de origem — coleta" e "Endereço de destino — entrega"), no mesmo estado
usado pela revisão e pela mensagem do WhatsApp.

- **Somente o ViaCEP:** `https://viacep.com.br/ws/CEP/json/`, por `fetch`. Se o `fetch` não conseguir chegar
  ao ViaCEP (rede, extensão ou navegador que bloqueia requisições entre sites), o mesmo endpoint é chamado
  no formato JSONP que o ViaCEP oferece (`…/json/?callback=…`). Nenhum outro serviço é usado.
- **Quando consulta:** com 8 números, após uma pausa de 0,45 s na digitação, ou na hora ao sair do campo.
  Também pelo botão de lupa dentro do campo ou por Enter no CEP (Enter no CEP nunca avança a etapa).
  Nunca consulta com menos de 8 números. O formulário não é bloqueado durante a consulta.
- **Máscara** 00000-000; aceita CEP digitado ou colado com ou sem hífen, pontos ou espaços.
- **Preenche:** rua (`logradouro`), complemento (`complemento`, só se o campo estiver vazio), bairro
  (`bairro`), cidade (`localidade`) e UF (`uf`; o seletor de estado mostra o nome por extenso).
  Número, tipo de imóvel, andar, nº do apartamento e interfone nunca são tocados.
- **Edição manual:** em um novo CEP, rua, complemento e bairro só são atualizados se estiverem vazios ou
  ainda com o valor do CEP anterior; o que o cliente editou é mantido. Cidade e UF seguem o CEP consultado.
  Campos que o ViaCEP devolve vazios ficam editáveis e não são inventados.
- **Erros:** `{"erro": true}` → "CEP não encontrado. Confira o número ou preencha o endereço manualmente.";
  rede, HTTP ou resposta inválida → "Não foi possível consultar o CEP agora. Tente novamente ou preencha o
  endereço manualmente." com o botão "Tentar novamente"; CEP incompleto → aviso junto ao campo. Nenhum dado
  já preenchido é apagado.
- **Concorrência:** cada lado tem sua consulta, carregamento e mensagens. Mudar o CEP cancela a consulta
  anterior (`AbortController`) e limpa o aviso; uma resposta antiga nunca sobrescreve um CEP mais recente.
  CEPs já consultados ficam em memória (sem requisição repetida).
- **Privacidade:** só o CEP vai para o ViaCEP; o console registra apenas o tipo de falha, sem CEP ou dados.
- **Pré-visualização do claude.ai:** a página roda isolada e não acessa sites externos; o formulário detecta
  e avisa. No site hospedado e no `dist-single/index.html` aberto no navegador, a consulta funciona.

### Instagram

- Perfil oficial `@rajtransportesjf` → `https://www.instagram.com/rajtransportesjf/` (configurado em
  `COMPANY.instagram` e `LINKS.instagram`, em `src/config/company.ts`).
- Aparece na seção Contato (ao lado de "Responsável") e no rodapé (abaixo da descrição da marca e na
  coluna Contato). Ícone e nome são um único link, que abre em nova aba (`target="_blank"`,
  `rel="noopener noreferrer"`). No celular, o sistema abre o app do Instagram quando instalado.

### WhatsApp

- Botão flutuante verde, que se esconde enquanto os botões do hero, o formulário ou a barra final do
  rodapé estão na tela, para não cobrir nada.
- "Tirar dúvidas pelo WhatsApp" (seção de orçamento), "Falar pelo WhatsApp" (FAQ), hero, contato e
  rodapé abrem a conversa com: "Olá! Conheci a RAJ Transportes pelo site e gostaria de tirar uma
  dúvida sobre os serviços de frete e mudança." O cliente decide se envia.

## Publicação

A pasta `dist/` é um site estático. Opções:

- **Netlify Drop** (mais rápido): arraste a pasta `dist/` em https://app.netlify.com/drop e receba um endereço público.
- **Vercel / Cloudflare Pages / GitHub Pages**: build `npm run build`, pasta de saída `dist`.
- **Hospedagem comum (Hostinger etc.)**: envie o conteúdo de `dist/` para a pasta pública (`public_html`).

Para mostrar ao cliente pelo WhatsApp, envie o **link** do site publicado. O arquivo
`dist/index.html` sozinho não funciona como anexo, porque depende da pasta `assets/`.
O arquivo `dist-single/index.html` (gerado por `npm run build:single`) tem tudo embutido e
abre direto no navegador; a fonte Archivo só carrega com internet.

Quando houver domínio próprio, adicione no `index.html`:

```html
<link rel="canonical" href="https://SEU-DOMINIO/" />
<meta property="og:image" content="https://SEU-DOMINIO/og.jpg" />
```

A consulta de CEP precisa de internet e funciona no site hospedado e no `dist-single/index.html`
aberto em um navegador conectado. Em ambientes que bloqueiam acesso a sites externos, o formulário
mostra o aviso de falha e o cliente preenche cidade e estado manualmente.
