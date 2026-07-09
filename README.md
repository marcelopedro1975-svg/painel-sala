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