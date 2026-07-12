# SalaPad

Painel de sala / porta-retratos digital inteligente feito para rodar em um iPad 4 antigo.

## Objetivo

Transformar o iPad 4 em um painel visual para exibir:

- fotos;
- hora;
- data;
- clima;
- futuramente mercado financeiro e notícias.

## Regra principal

O hardware manda.

O alvo principal é:

- iPad 4 MD5513BR/A
- 16 GB
- iOS 10.3.4
- Safari/WebKit antigo

Por isso, o código deve ser simples e compatível.

## Regras técnicas

Usar:

- `var`
- funções tradicionais
- `XMLHttpRequest`
- HTML simples
- CSS simples

Evitar:

- `const`
- `let`
- `fetch`
- `async/await`
- arrow functions
- módulos ES6
- bibliotecas pesadas

## Estrutura atual

```text
painel-sala/
│
├── index.html
├── style.css
├── script.js
├── config.js
├── fotos.js
├── README.md
│
├── fotos/
│   └── imagens do painel
│
└── ferramentas/
    └── gerar-fotos.js
    Fluxo de atualização das fotos
Baixar as fotos desejadas do Google Fotos.
Copiar as fotos para a pasta:
fotos/
Abrir o CMD na pasta do projeto.
Executar:
node ferramentas\gerar-fotos.js
O arquivo fotos.js será gerado automaticamente.
Testar no PC com Live Server.
Fazer commit no GitHub Desktop.
Fazer Push Origin.
Testar no iPad pelo Safari.
Regra importante

Nunca editar fotos.js manualmente.

Ele é gerado automaticamente pela ferramenta:

ferramentas/gerar-fotos.js
Fluxo de trabalho
VS Code
↓
Ctrl + S
↓
Teste no PC com Live Server
↓
GitHub Desktop
↓
Commit
↓
Push Origin
↓
GitHub Pages
↓
Teste no iPad
Regra de commit

Uma funcionalidade = um commit.

Status atual
Recurso	Status
GitHub Pages	✅
Painel no PC	✅
Painel no iPad	✅
Fotos em cover	✅
Fade entre fotos	✅
Ken Burns	✅
Relógio	✅
Clima	✅
config.js	✅
Gerador automático de fotos	✅
Shuffle	✅
Modo noturno	Em preparação
Tela cheia no iPad	Pendente
Mercado financeiro	Pendente
Notícias	Pendente
Comandos úteis

Entrar na pasta do projeto:

cd %USERPROFILE%\Documents\GitHub\painel-sala

Gerar lista de fotos:

node ferramentas\gerar-fotos.js
Filosofia do projeto

O iPad é somente para exibição.

Todo trabalho pesado deve ser feito no PC:

gerar lista de fotos;
preparar arquivos;
validar configurações;
futuramente otimizar imagens.

O iPad deve apenas abrir a página pelo Safari e exibir o painel.


Depois salve.

Commit sugerido:

```text
Adiciona documentação inicial do projeto

# SalaPad

Transformar um iPad 4 (MD5513BR/A – iOS 10.3.4) em um painel digital inteligente utilizando apenas HTML, CSS, JavaScript ES5 e GitHub Pages.

## Objetivo

Criar um painel elegante, leve e totalmente compatível com hardware antigo, inspirado na filosofia de design da Apple, onde a fotografia permanece como elemento principal e as informações aparecem de forma discreta.

**Regra principal do projeto:**

> O hardware manda.

Todo desenvolvimento deve priorizar compatibilidade com Safari/WebKit do iOS 10.

---

# Hardware alvo

- iPad 4 (MD5513BR/A)
- iOS 10.3.4
- Safari (WebKit antigo)

---

# Tecnologias

- HTML
- CSS
- JavaScript ES5
- GitHub Pages
- GitHub Desktop
- VS Code
- Node.js
- GitHub Actions (em desenvolvimento)

---

# Compatibilidade

Utilizar apenas recursos compatíveis com iOS 10.

### Utilizar

- var
- funções tradicionais
- XMLHttpRequest
- CSS simples
- HTML simples

### Evitar

- let
- const
- fetch()
- async/await
- Arrow Functions
- Módulos ES6
- Bibliotecas pesadas

---

# Fluxo de desenvolvimento

VS Code

↓

Ctrl + S

↓

Live Server

↓

GitHub Desktop

↓

Commit

↓

Push Origin

↓

GitHub Pages

↓

Teste no iPad

---

# Estrutura atual

```
PainelSala

config.js
fotos.js
noticias.js
script.js
style.css
index.html

/fotos

/ferramentas
    gerar-fotos.js
    gerar-noticias.js
```

---

# Funcionalidades concluídas

## Fotos

- Fundo em tela cheia
- Fade entre imagens
- Pré-carregamento
- Embaralhamento automático
- Ken Burns
- Gerador automático de fotos

---

## Relógio

- Horas e minutos
- Sem segundos
- Posicionado no canto inferior esquerdo

---

## Data

- Atualização automática
- Formato brasileiro

---

## Clima

- Open-Meteo
- Temperatura
- Ícones
- Cidade

---

## Painel Informativo

Arquitetura pronta.

Atualmente suporta:

- Notícias

Arquitetura preparada para:

- Notícias
- Mercado
- Frase do Dia

---

## Notícias

- Arquivo separado (`noticias.js`)
- Rotação automática
- Fade apenas na manchete
- Fonte da notícia exibida
- Gerador automático (`gerar-noticias.js`)
- Preparado para múltiplos feeds RSS da Agência Brasil

---

# Próximas etapas

## Prioridade 1

- Finalizar gerador com múltiplos feeds RSS
- GitHub Actions atualizando notícias automaticamente

---

## Prioridade 2

Implementar módulo Mercado.

### Brasil

- Bitcoin
- Dólar
- IFIX
- Ibovespa

### EUA

- S&P 500
- Nasdaq
- Dow Jones

---

## Prioridade 3

Frase do Dia

Banco próprio de frases.

Sem APIs externas.

---

# Funcionamento futuro

```
00–20 min
NOTÍCIAS

20–22 min
MERCADO BRASIL

22–24 min
MERCADO EUA

24–60 min
Somente fotografias
```

Posteriormente:

```
00–18 min
NOTÍCIAS

18–20 min
FRASE DO DIA

20–22 min
MERCADO BRASIL

22–24 min
MERCADO EUA

24–60 min
Painel oculto
```

---

# Filosofia visual

A fotografia é sempre o elemento principal.

As informações apenas complementam a experiência.

Nada deve competir com a imagem.

---

# Objetivo final

Transformar um iPad antigo em um painel inteligente capaz de funcionar 24 horas por dia, totalmente automático, utilizando apenas GitHub Pages e serviços gratuitos, sem necessidade de computador ligado.