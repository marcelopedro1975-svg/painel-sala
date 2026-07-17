var CONFIG = {
    cidade: "São Paulo",

    latitude: -23.5505,
    longitude: -46.6333,

    /* ==========================
       INTERVALOS
    ========================== */

    intervaloFotos: 35000,
    intervaloClima: 1800000,

    /*
       Cada notícia ou mercado permanece
       durante 15 segundos.
    */

    intervaloPainel: 15000,

    /*
       Verifica a cada 10 segundos se chegou
       o momento de mostrar ou ocultar o painel.
    */

    intervaloControlePainel: 10000,

    /*
       Recarrega toda a página a cada hora
       para receber notícias e mercados novos.
    */

    intervaloAtualizacaoPagina: 3600000,

    /* ==========================
       CICLO DO PAINEL
    ========================== */

    /*
       false = funcionamento definitivo:
       painel visível somente nos primeiros
       20 minutos de cada hora.
    */

    painelSempreVisivel: false,

    /*
       O painel aparece entre os minutos
       00 e 19 e desaparece no minuto 20.
    */

    minutoFimPainel: 20,

    /*
       Depois de cada 10 notícias,
       exibe uma tela de mercado.
    */

    noticiasAntesMercado: 10,

    /* ==========================
       MODO NOTURNO
    ========================== */

    modoNoturno: true,
    horaInicioModoNoturno: 22,
    horaFimModoNoturno: 6
};