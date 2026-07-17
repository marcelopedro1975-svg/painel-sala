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
       Notícias e mercados usam o mesmo tempo:
       15000 = 15 segundos
    */

    intervaloPainel: 15000,

    /*
       Verifica a cada 10 segundos se o painel
       deve estar visível ou oculto.
    */

    intervaloControlePainel: 10000,

    /*
       Recarrega a página a cada hora.
    */

    intervaloAtualizacaoPagina: 3600000,

    /* ==========================
       CICLO DO PAINEL
    ========================== */

    painelSempreVisivel: false,

    /*
       O painel aparece do minuto 00 até 19.
       No minuto 20 ele desaparece.
    */

    minutoFimPainel: 20,

    /*
       Depois de 10 notícias, mostra um mercado.
    */

    noticiasAntesMercado: 10,

    /* ==========================
       MODO NOTURNO
    ========================== */

    modoNoturno: true,
    horaInicioModoNoturno: 22,
    horaFimModoNoturno: 6
};