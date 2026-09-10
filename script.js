document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // CONFIGURAÇÕES
  // =========================

  const SENHA = "Hg99";

  const CHAVE_NOTAS = "espaco_anotacoes";
  const CHAVE_LIXEIRA = "espaco_lixeira";
  const CHAVE_TEMA = "espaco_tema";
  const CHAVE_ACESSO = "espaco_acesso";
  const CHAVE_MODO_VISUAL = "espaco_modo_visual";

  let notas = carregarDados(CHAVE_NOTAS);
  let lixeira = carregarDados(CHAVE_LIXEIRA);

  let notaAtual = null;
  let filtroAtual = "todas";
  let timerBloqueio = null;


  // =========================
  // FUNÇÕES DE DADOS
  // =========================

  function carregarDados(chave) {
    try {
      const dados = localStorage.getItem(chave);

      if (!dados) {
        return [];
      }

      const resultado = JSON.parse(dados);

      return Array.isArray(resultado) ? resultado : [];

    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
      return [];
    }
  }


  function salvarNotas() {
    localStorage.setItem(
      CHAVE_NOTAS,
      JSON.stringify(notas)
    );
  }


  function salvarLixeira() {
    localStorage.setItem(
      CHAVE_LIXEIRA,
      JSON.stringify(lixeira)
    );
  }


  // =========================
  // ELEMENTOS DA PÁGINA
  // =========================

  const telaSenha = document.getElementById("telaSenha");
  const conteudo = document.getElementById("conteudo");

  const senhaInput = document.getElementById("senha");
  const entrar = document.getElementById("entrar");
  const erroSenha = document.getElementById("erroSenha");

  const telaPrincipal = document.getElementById("telaPrincipal");
  const telaAnotacao = document.getElementById("telaAnotacao");

  const editorNova = document.getElementById("editorNova");
  const editorEdicao = document.getElementById("editorEdicao");

  const telaLixeira = document.getElementById("telaLixeira");

  const lista = document.getElementById("lista");
  const listaVazia = document.getElementById("listaVazia");

  const listaLixeira = document.getElementById("listaLixeira");
  const lixeiraVazia = document.getElementById("lixeiraVazia");

  const pesquisa = document.getElementById("pesquisa");

  const contador = document.getElementById("contador");
  const contadorLixeira = document.getElementById("contadorLixeira");

  const tituloAberto = document.getElementById("tituloAberto");
  const dataAberto = document.getElementById("dataAberto");
  const conteudoAberto = document.getElementById("conteudoAberto");

  const novoTitulo = document.getElementById("novoTitulo");
  const novoConteudo = document.getElementById("novoConteudo");

  const tituloEdicao = document.getElementById("tituloEdicao");
  const conteudoEdicao = document.getElementById("conteudoEdicao");

  const botaoModoVisualizacao =
    document.getElementById("modoVisualizacao");


  // =========================
  // TEMA
  // =========================

  function carregarTema() {

    const tema = localStorage.getItem(CHAVE_TEMA);

    if (tema === "claro") {
      document.body.classList.add("tema-claro");
    } else {
      document.body.classList.remove("tema-claro");
    }
  }


  function alternarTema() {

    document.body.classList.toggle("tema-claro");

    const temaAtual =
      document.body.classList.contains("tema-claro")
        ? "claro"
        : "escuro";

    localStorage.setItem(
      CHAVE_TEMA,
      temaAtual
    );
  }


  const botaoTema = document.getElementById("tema");

  if (botaoTema) {
    botaoTema.addEventListener(
      "click",
      alternarTema
    );
  }


  // =========================
  // MODO VISUALIZAÇÃO
  // =========================

  function carregarModoVisualizacao() {

    const modo =
      localStorage.getItem(CHAVE_MODO_VISUAL);

    if (modo === "ativo") {

      document.body.classList.add(
        "modo-visualizacao"
      );

    } else {

      document.body.classList.remove(
        "modo-visualizacao"
      );
    }

    atualizarBotaoModoVisualizacao();
  }


  function alternarModoVisualizacao() {

    const ativo =
      document.body.classList.contains(
        "modo-visualizacao"
      );

    if (ativo) {

      document.body.classList.remove(
        "modo-visualizacao"
      );

      localStorage.setItem(
        CHAVE_MODO_VISUAL,
        "desativado"
      );

    } else {

      document.body.classList.add(
        "modo-visualizacao"
      );

      localStorage.setItem(
        CHAVE_MODO_VISUAL,
        "ativo"
      );
    }

    atualizarBotaoModoVisualizacao();
    renderizarLista();
  }


  function atualizarBotaoModoVisualizacao() {

    if (!botaoModoVisualizacao) {
      return;
    }

    const ativo =
      document.body.classList.contains(
        "modo-visualizacao"
      );

    if (ativo) {

      botaoModoVisualizacao.textContent =
        "👁️ Sair do modo visualização";

    } else {

      botaoModoVisualizacao.textContent =
        "👁️ Modo Visualização";
    }
  }


  if (botaoModoVisualizacao) {

    botaoModoVisualizacao.addEventListener(
      "click",
      alternarModoVisualizacao
    );
  }


  // =========================
  // SENHA / ACESSO
  // =========================

  function verificarAcesso() {

    const ultimoAcesso =
      localStorage.getItem(CHAVE_ACESSO);

    if (!ultimoAcesso) {

      bloquearTela();
      return;
    }

    const agora = Date.now();

    const tempoPassado =
      agora - Number(ultimoAcesso);

    const cincoMinutos =
      5 * 60 * 1000;

    if (tempoPassado < cincoMinutos) {

      mostrarTelaPrincipal();
      iniciarTimerBloqueio();

    } else {

      bloquearTela();
    }
  }


  function registrarAcesso() {

    localStorage.setItem(
      CHAVE_ACESSO,
      String(Date.now())
    );
  }


  function entrarNoSistema() {

    registrarAcesso();

    erroSenha.textContent = "";

    mostrarTelaPrincipal();

    iniciarTimerBloqueio();

    if (senhaInput) {
      senhaInput.value = "";
    }
  }


  function bloquearTela() {

    localStorage.removeItem(
      CHAVE_ACESSO
    );

    if (timerBloqueio) {
      clearTimeout(timerBloqueio);
    }

    esconderTodasAsTelas();

    telaSenha.classList.remove(
      "oculto"
    );

    if (conteudo) {
      conteudo.classList.add(
        "oculto"
      );
    }

    if (senhaInput) {
      senhaInput.value = "";
      senhaInput.focus();
    }
  }


  function tentarEntrar() {

    if (!senhaInput) {
      return;
    }

    const senhaDigitada =
      senhaInput.value;

    if (senhaDigitada === SENHA) {

      entrarNoSistema();

    } else {

      erroSenha.textContent =
        "Senha incorreta.";

      senhaInput.value = "";

      senhaInput.focus();
    }
  }


  if (entrar) {

    entrar.addEventListener(
      "click",
      tentarEntrar
    );
  }


  if (senhaInput) {

    senhaInput.addEventListener(
      "keydown",
      function (evento) {

        if (evento.key === "Enter") {
          tentarEntrar();
        }

      }
    );
  }


  // =========================
  // BLOQUEIO POR INATIVIDADE
  // =========================

  function iniciarTimerBloqueio() {

    if (timerBloqueio) {
      clearTimeout(timerBloqueio);
    }

    timerBloqueio = setTimeout(
      function () {

        bloquearTela();

      },
      5 * 60 * 1000
    );
  }


  function atividadeUsuario() {

    const senhaVisivel =
      !telaSenha.classList.contains(
        "oculto"
      );

    if (senhaVisivel) {
      return;
    }

    registrarAcesso();
    iniciarTimerBloqueio();
  }


  document.addEventListener(
    "click",
    atividadeUsuario
  );

  document.addEventListener(
    "touchstart",
    atividadeUsuario
  );

  document.addEventListener(
    "keydown",
    atividadeUsuario
  );


  // =========================
  // BOTÃO BLOQUEAR
  // =========================

  const botaoBloquear =
    document.getElementById("bloquear");

  if (botaoBloquear) {

    botaoBloquear.addEventListener(
      "click",
      bloquearTela
    );
  }


  // =========================
  // TELAS
  // =========================

  function esconderTodasAsTelas() {

    telaPrincipal.classList.add(
      "oculto"
    );

    telaAnotacao.classList.add(
      "oculto"
    );

    editorNova.classList.add(
      "oculto"
    );

    editorEdicao.classList.add(
      "oculto"
    );

    telaLixeira.classList.add(
      "oculto"
    );
  }


  function mostrarTelaPrincipal() {

    esconderTodasAsTelas();

    if (conteudo) {
      conteudo.classList.remove(
        "oculto"
      );
    }

    telaSenha.classList.add(
      "oculto"
    );

    telaPrincipal.classList.remove(
      "oculto"
    );

    renderizarLista();
  }


  function mostrarTelaAnotacao(nota) {

    if (!nota) {
      return;
    }

    notaAtual = nota;

    esconderTodasAsTelas();

    telaAnotacao.classList.remove(
      "oculto"
    );

    tituloAberto.textContent =
      nota.titulo || "Sem título";

    conteudoAberto.textContent =
      nota.conteudo || "";

    dataAberto.textContent =
      formatarData(nota.criadaEm);

    atualizarBotaoFixar();
    atualizarBotaoConcluir();
  }


  function mostrarEditorNova() {

    if (
      document.body.classList.contains(
        "modo-visualizacao"
      )
    ) {
      return;
    }

    esconderTodasAsTelas();

    editorNova.classList.remove(
      "oculto"
    );

    novoTitulo.value = "";
    novoConteudo.value = "";

    novoTitulo.focus();
  }


  function mostrarEditorEdicao() {

    if (
      document.body.classList.contains(
        "modo-visualizacao"
      )
    ) {
      return;
    }

    if (!notaAtual) {
      return;
    }

    esconderTodasAsTelas();

    editorEdicao.classList.remove(
      "oculto"
    );

    tituloEdicao.value =
      notaAtual.titulo || "";

    conteudoEdicao.value =
      notaAtual.conteudo || "";

    tituloEdicao.focus();
  }


  function mostrarLixeira() {

    if (
      document.body.classList.contains(
        "modo-visualizacao"
      )
    ) {
      return;
    }

    esconderTodasAsTelas();

    telaLixeira.classList.remove(
      "oculto"
    );

    renderizarLixeira();
  }


  // =========================
  // NOVA ANOTAÇÃO
  // =========================

  const botaoAdicionar =
    document.getElementById("adicionar");

  if (botaoAdicionar) {

    botaoAdicionar.addEventListener(
      "click",
      mostrarEditorNova
    );
  }


  function salvarNovaAnotacao() {

    if (
      document.body.classList.contains(
        "modo-visualizacao"
      )
    ) {
      return;
    }

    const titulo =
      novoTitulo.value.trim();

    const conteudoTexto =
      novoConteudo.value.trim();

    if (!titulo) {

      alert(
        "Digite um título para a anotação."
      );

      novoTitulo.focus();

      return;
    }

    const novaNota = {

      id:
        Date.now().toString(),

      titulo:
        titulo,

      conteudo:
        conteudoTexto,

      criadaEm:
        new Date().toISOString(),

      fixada:
        false,

      concluida:
        false
    };

    notas.unshift(novaNota);

    salvarNotas();

    mostrarTelaPrincipal();
  }


  const botaoSalvarNova =
    document.getElementById("salvarNova");

  if (botaoSalvarNova) {

    botaoSalvarNova.addEventListener(
      "click",
      salvarNovaAnotacao
    );
  }


  const botaoCancelarNova =
    document.getElementById("cancelarNova");

  if (botaoCancelarNova) {

    botaoCancelarNova.addEventListener(
      "click",
      mostrarTelaPrincipal
    );
  }


  const botaoCancelarNova2 =
    document.getElementById("cancelarNova2");

  if (botaoCancelarNova2) {

    botaoCancelarNova2.addEventListener(
      "click",
      mostrarTelaPrincipal
    );
  }


  // =========================
  // EDITAR ANOTAÇÃO
  // =========================

  const botaoEditar =
    document.getElementById("editar");

  if (botaoEditar) {

    botaoEditar.addEventListener(
      "click",
      mostrarEditorEdicao
    );
  }


  function salvarEdicao() {

    if (
      document.body.classList.contains(
        "modo-visualizacao"
      )
    ) {
      return;
    }

    if (!notaAtual) {
      return;
    }

    const novoTituloTexto =
      tituloEdicao.value.trim();

    const novoConteudoTexto =
      conteudoEdicao.value.trim();

    if (!novoTituloTexto) {

      alert(
        "Digite um título para a anotação."
      );

      tituloEdicao.focus();

      return;
    }

    const indice =
      notas.findIndex(
        function (nota) {

          return String(nota.id) ===
            String(notaAtual.id);

        }
      );

    if (indice === -1) {
      return;
    }

    notas[indice].titulo =
      novoTituloTexto;

    notas[indice].conteudo =
      novoConteudoTexto;

    notaAtual =
      notas[indice];

    salvarNotas();

    mostrarTelaAnotacao(
      notaAtual
    );
  }


  const botaoSalvarEdicao =
    document.getElementById("salvarEdicao");

  if (botaoSalvarEdicao) {

    botaoSalvarEdicao.addEventListener(
      "click",
      salvarEdicao
    );
  }


  const botaoCancelarEdicao =
    document.getElementById(
      "cancelarEdicao"
    );

  if (botaoCancelarEdicao) {

    botaoCancelarEdicao.addEventListener(
      "click",
      function () {

        mostrarTelaAnotacao(
          notaAtual
        );

      }
    );
  }


  const botaoCancelarEdicao2 =
    document.getElementById(
      "cancelarEdicao2"
    );

  if (botaoCancelarEdicao2) {

    botaoCancelarEdicao2.addEventListener(
      "click",
      function () {

        mostrarTelaAnotacao(
          notaAtual
        );

      }
    );
  }


  // =========================
  // VOLTAR
  // =========================

  const botaoVoltar =
    document.getElementById("voltar");

  if (botaoVoltar) {

    botaoVoltar.addEventListener(
      "click",
      function () {

        notaAtual = null;

        mostrarTelaPrincipal();

      }
    );
  }


  // =========================
  // FIXAR
  // =========================

  const botaoFixar =
    document.getElementById("fixar");

  if (botaoFixar) {

    botaoFixar.addEventListener(
      "click",
      function () {

        if (
          document.body.classList.contains(
            "modo-visualizacao"
          )
        ) {
          return;
        }

        if (!notaAtual) {
          return;
        }

        const indice =
          notas.findIndex(
            function (nota) {

              return String(nota.id) ===
                String(notaAtual.id);

            }
          );

        if (indice === -1) {
          return;
        }

        notas[indice].fixada =
          !notas[indice].fixada;

        notaAtual =
          notas[indice];

        salvarNotas();

        atualizarBotaoFixar();
      }
    );
  }


  function atualizarBotaoFixar() {

    if (!botaoFixar || !notaAtual) {
      return;
    }

    if (notaAtual.fixada) {

      botaoFixar.textContent =
        "📌 Desfixar";

    } else {

      botaoFixar.textContent =
        "📌 Fixar";
    }
  }


  // =========================
  // CONCLUIR
  // =========================

  const botaoConcluir =
    document.getElementById("concluir");

  if (botaoConcluir) {

    botaoConcluir.addEventListener(
      "click",
      function () {

        if (
          document.body.classList.contains(
            "modo-visualizacao"
          )
        ) {
          return;
        }

        if (!notaAtual) {
          return;
        }

        const indice =
          notas.findIndex(
            function (nota) {

              return String(nota.id) ===
                String(notaAtual.id);

            }
          );

        if (indice === -1) {
          return;
        }

        notas[indice].concluida =
          !notas[indice].concluida;

        notaAtual =
          notas[indice];

        salvarNotas();

        atualizarBotaoConcluir();
      }
    );
  }


  function atualizarBotaoConcluir() {

    if (!botaoConcluir || !notaAtual) {
      return;
    }

    if (notaAtual.concluida) {

      botaoConcluir.textContent =
        "↩️ Marcar como pendente";

    } else {

      botaoConcluir.textContent =
        "✅ Concluir";
    }
  }


  // =========================
  // EXCLUIR
  // =========================

  const botaoExcluir =
    document.getElementById("excluir");

  if (botaoExcluir) {

    botaoExcluir.addEventListener(
      "click",
      function () {

        if (
          document.body.classList.contains(
            "modo-visualizacao"
          )
        ) {
          return;
        }

        if (!notaAtual) {
          return;
        }

        moverParaLixeira(
          notaAtual.id
        );

      }
    );
  }


  function moverParaLixeira(id) {

    const indice =
      notas.findIndex(
        function (nota) {

          return String(nota.id) ===
            String(id);

        }
      );

    if (indice === -1) {
      return;
    }

    const notaRemovida =
      notas[indice];

    notas.splice(
      indice,
      1
    );

    lixeira.unshift(
      notaRemovida
    );

    salvarNotas();
    salvarLixeira();

    notaAtual = null;

    mostrarTelaPrincipal();
  }


  // =========================
  // PESQUISA
  // =========================

  if (pesquisa) {

    pesquisa.addEventListener(
      "input",
      function () {

        renderizarLista();

      }
    );
  }


  // =========================
  // FILTROS
  // =========================

  const botaoFiltroTodas =
    document.getElementById(
      "filtroTodas"
    );

  const botaoFiltroPendentes =
    document.getElementById(
      "filtroPendentes"
    );

  const botaoFiltroConcluidas =
    document.getElementById(
      "filtroConcluidas"
    );

  const botaoFiltroFixadas =
    document.getElementById(
      "filtroFixadas"
    );


  if (botaoFiltroTodas) {

    botaoFiltroTodas.addEventListener(
      "click",
      function () {

        alterarFiltro("todas");

      }
    );
  }


  if (botaoFiltroPendentes) {

    botaoFiltroPendentes.addEventListener(
      "click",
      function () {

        alterarFiltro("pendentes");

      }
    );
  }


  if (botaoFiltroConcluidas) {

    botaoFiltroConcluidas.addEventListener(
      "click",
      function () {

        alterarFiltro("concluidas");

      }
    );
  }


  if (botaoFiltroFixadas) {

    botaoFiltroFixadas.addEventListener(
      "click",
      function () {

        alterarFiltro("fixadas");

      }
    );
  }


  function alterarFiltro(novoFiltro) {

    filtroAtual =
      novoFiltro;

    document
      .querySelectorAll(".filtro")
      .forEach(
        function (botao) {

          botao.classList.remove(
            "ativo"
          );

        }
      );

    let botaoAtivo = null;

    if (novoFiltro === "todas") {
      botaoAtivo = botaoFiltroTodas;
    }

    if (novoFiltro === "pendentes") {
      botaoAtivo = botaoFiltroPendentes;
    }

    if (novoFiltro === "concluidas") {
      botaoAtivo = botaoFiltroConcluidas;
    }

    if (novoFiltro === "fixadas") {
      botaoAtivo = botaoFiltroFixadas;
    }

    if (botaoAtivo) {

      botaoAtivo.classList.add(
        "ativo"
      );
    }

    renderizarLista();
  }


  // =========================
  // RENDERIZAR LISTA
  // =========================

  function renderizarLista() {

    if (!lista) {
      return;
    }

    lista.innerHTML = "";

    const termo =
      pesquisa
        ? pesquisa.value
            .trim()
            .toLowerCase()
        : "";


    let filtradas =
      notas.filter(
        function (nota) {

          const titulo =
            String(
              nota.titulo || ""
            ).toLowerCase();

          if (
            !titulo.includes(termo)
          ) {
            return false;
          }

          if (
            filtroAtual === "pendentes" &&
            nota.concluida
          ) {
            return false;
          }

          if (
            filtroAtual ==
            "pendentes" &&
            nota.concluida
          ) {
            return false;
          }

          if (
            filtroAtual === "concluidas" &&
            !nota.concluida
          ) {
            return false;
          }

          if (
            filtroAtual === "fixadas" &&
            !nota.fixada
          ) {
            return false;
          }

          return true;
        }
      );


    // Fixadas aparecem primeiro
    filtradas.sort(
      function (a, b) {

        if (
          Boolean(a.fixada) !==
          Boolean(b.fixada)
        ) {

          return a.fixada ? -1 : 1;
        }

        return (
          new Date(
            b.criadaEm || 0
          ) -
          new Date(
            a.criadaEm || 0
          )
        );
      }
    );


    if (contador) {

      contador.textContent =
        notas.length +
        (
          notas.length === 1
            ? " anotação"
            : " anotações"
        );
    }


    if (
      filtradas.length === 0
    ) {

      if (listaVazia) {

        listaVazia.classList.remove(
          "oculto"
        );
      }

      return;

    } else {

      if (listaVazia) {

        listaVazia.classList.add(
          "oculto"
        );
      }
    }


    filtradas.forEach(
      function (nota) {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "item-anotacao";


        if (nota.concluida) {

          item.classList.add(
            "concluida"
          );
        }


        const titulo =
          document.createElement(
            "div"
          );

        titulo.className =
          "titulo-item";

        titulo.textContent =
          nota.titulo ||
          "Sem título";


        const informacao =
          document.createElement(
            "div"
          );

        informacao.className =
          "item-anotacao-info";


        const data =
          document.createElement(
            "span"
          );

        data.textContent =
          formatarData(
            nota.criadaEm
          );


        const icones =
          document.createElement(
            "span"
          );


        if (nota.fixada) {

          const fixado =
            document.createElement(
              "span"
            );

          fixado.textContent =
            "📌 ";

          icones.appendChild(
            fixado
          );
        }


        if (nota.concluida) {

          const concluida =
            document.createElement(
              "span"
            );

          concluida.textContent =
            "✅";

          icones.appendChild(
            concluida
          );
        }


        informacao.appendChild(
          data
        );

        informacao.appendChild(
          icones
        );


        item.appendChild(
          titulo
        );

        item.appendChild(
          informacao
        );


        item.addEventListener(
          "click",
          function () {

            mostrarTelaAnotacao(
              nota
            );

          }
        );


        lista.appendChild(
          item
        );

      }
    );
  }


  // =========================
  // LIXEIRA
  // =========================

                          const botaoAbrirLixeira =
    document.getElementById(
      "abrirLixeira"
    );

  if (botaoAbrirLixeira) {

    botaoAbrirLixeira.addEventListener(
      "click",
      mostrarLixeira
    );
  }


  const botaoVoltarLixeira =
    document.getElementById(
      "voltarLixeira"
    );

  if (botaoVoltarLixeira) {

    botaoVoltarLixeira.addEventListener(
      "click",
      mostrarTelaPrincipal
    );
  }


  function renderizarLixeira() {

    if (!listaLixeira) {
      return;
    }

    listaLixeira.innerHTML = "";


    if (contadorLixeira) {

      contadorLixeira.textContent =
        lixeira.length +
        (
          lixeira.length === 1
            ? " item"
            : " itens"
        );
    }


    if (
      lixeira.length === 0
    ) {

      if (lixeiraVazia) {

        lixeiraVazia.classList.remove(
          "oculto"
        );
      }

      return;

    } else {

      if (lixeiraVazia) {

        lixeiraVazia.classList.add(
          "oculto"
        );
      }
    }


    lixeira.forEach(
      function (nota) {

        const item =
          document.createElement(
            "div"
          );

        item.className =
          "item-lixeira";


        const titulo =
          document.createElement(
            "div"
          );

        titulo.textContent =
          nota.titulo ||
          "Sem título";


        const botoes =
          document.createElement(
            "div"
          );

        botoes.className =
          "botoes-lixeira";


        const restaurar =
          document.createElement(
            "button"
          );

        restaurar.textContent =
          "↩️ Restaurar";


        restaurar.addEventListener(
          "click",
          function () {

            restaurarNota(
              nota.id
            );

          }
        );


        const excluir =
          document.createElement(
            "button"
          );

        excluir.textContent =
          "🗑️ Excluir";

        excluir.addEventListener(
          "click",
          function () {

            excluirPermanentemente(
              nota.id
            );

          }
        );


        botoes.appendChild(
          restaurar
        );

        botoes.appendChild(
          excluir
        );


        item.appendChild(
          titulo
        );

        item.appendChild(
          botoes
        );


        listaLixeira.appendChild(
          item
        );

      }
    );
  }


  function restaurarNota(id) {

    const indice =
      lixeira.findIndex(
        function (nota) {

          return String(nota.id) ===
            String(id);

        }
      );

    if (indice === -1) {
      return;
    }

    const nota =
      lixeira[indice];

    lixeira.splice(
      indice,
      1
    );

    notas.unshift(
      nota
    );

    salvarNotas();
    salvarLixeira();

    renderizarLixeira();
  }


  function excluirPermanentemente(id) {

    const indice =
      lixeira.findIndex(
        function (nota) {

          return String(nota.id) ===
            String(id);

        }
      );

    if (indice === -1) {
      return;
    }

    const confirmar =
      confirm(
        "Excluir esta anotação permanentemente?"
      );

    if (!confirmar) {
      return;
    }

    lixeira.splice(
      indice,
      1
    );

    salvarLixeira();

    renderizarLixeira();
  }


  // =========================
  // LIMPAR TODAS AS ANOTAÇÕES
  // =========================

    const botaoLimparTudo =
    document.getElementById(
      "limparTudo"
    );

  if (botaoLimparTudo) {

    botaoLimparTudo.addEventListener(
      "click",
      function () {

        if (
          document.body.classList.contains(
            "modo-visualizacao"
          )
        ) {
          return;
        }

        if (notas.length === 0) {

          alert(
            "Não há anotações para enviar para a lixeira."
          );

          return;
        }


        const confirmar =
          confirm(
            "Enviar todas as anotações para a lixeira?"
          );

        if (!confirmar) {
          return;
        }


        lixeira =
          lixeira.concat(
            notas
          );

        notas = [];


        salvarNotas();
        salvarLixeira();


        renderizarLista();

      }
    );
  }


  // =========================
  // DATA
  // =========================

        function formatarData(data) {

    if (!data) {
      return "";
    }

    const dataObj =
      new Date(data);

    if (
      Number.isNaN(
        dataObj.getTime()
      )
    ) {
      return "";
    }

    return dataObj.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );
  }


  // =========================
  // INICIALIZAÇÃO
  // =========================

  carregarTema();

  carregarModoVisualizacao();

  verificarAcesso();

});                  
