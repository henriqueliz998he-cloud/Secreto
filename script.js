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


/* =========================
   CARREGAR DADOS
   ========================= */

function carregarDados(chave) {
  try {
    const dados = localStorage.getItem(chave);

    if (!dados) {
      return [];
    }

    const convertido = JSON.parse(dados);

    return Array.isArray(convertido)
      ? convertido
      : [];

  } catch (erro) {
    console.error(erro);
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


/* =========================
   ELEMENTOS DA PÁGINA
   ========================= */

const telaSenha =
  document.getElementById("telaSenha");

const conteudo =
  document.getElementById("conteudo");

const senhaInput =
  document.getElementById("senha");

const entrar =
  document.getElementById("entrar");

const erroSenha =
  document.getElementById("erroSenha");

const telaPrincipal =
  document.getElementById("telaPrincipal");

const telaAnotacao =
  document.getElementById("telaAnotacao");

const editorNova =
  document.getElementById("editorNova");

const editorEdicao =
  document.getElementById("editorEdicao");

const telaLixeira =
  document.getElementById("telaLixeira");

const lista =
  document.getElementById("lista");

const listaVazia =
  document.getElementById("listaVazia");

const listaLixeira =
  document.getElementById("listaLixeira");

const lixeiraVazia =
  document.getElementById("lixeiraVazia");

const pesquisa =
  document.getElementById("pesquisa");

const contador =
  document.getElementById("contador");

const contadorLixeira =
  document.getElementById("contadorLixeira");

const tituloAberto =
  document.getElementById("tituloAberto");

const dataAberto =
  document.getElementById("dataAberto");

const conteudoAberto =
  document.getElementById("conteudoAberto");

const novoTitulo =
  document.getElementById("novoTitulo");

const novoConteudo =
  document.getElementById("novoConteudo");

const tituloEdicao =
  document.getElementById("tituloEdicao");

const conteudoEdicao =
  document.getElementById("conteudoEdicao");

const botaoModoVisualizacao =
  document.getElementById(
    "modoVisualizacao"
  );


/* =========================
   VERIFICAR MODO VISUALIZAÇÃO
   ========================= */

function estaEmModoVisualizacao() {
  return document.body.classList.contains(
    "modo-visualizacao"
  );
}


/* =========================
   TEMA
   ========================= */

function carregarTema() {
  const tema =
    localStorage.getItem(CHAVE_TEMA);

  if (tema === "claro") {
    document.body.classList.add(
      "tema-claro"
    );
  }
}


function alternarTema() {

  document.body.classList.toggle(
    "tema-claro"
  );

  if (
    document.body.classList.contains(
      "tema-claro"
    )
  ) {

    localStorage.setItem(
      CHAVE_TEMA,
      "claro"
    );

  } else {

    localStorage.setItem(
      CHAVE_TEMA,
      "escuro"
    );
  }
}


document
  .getElementById("tema")
  .addEventListener(
    "click",
    alternarTema
  );


/* =========================
   MODO VISUALIZAÇÃO
   ========================= */

function carregarModoVisualizacao() {

  const modoVisual =
    localStorage.getItem(
      CHAVE_MODO_VISUAL
    );

  if (modoVisual === "ativo") {

    document.body.classList.add(
      "modo-visualizacao"
    );
  }

  atualizarBotaoModoVisualizacao();
}


function alternarModoVisualizacao() {

  if (
    estaEmModoVisualizacao()
  ) {

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
}


function atualizarBotaoModoVisualizacao() {

  if (!botaoModoVisualizacao) {
    return;
  }

  if (
    estaEmModoVisualizacao()
  ) {

    botaoModoVisualizacao.textContent =
      "🔓";

    botaoModoVisualizacao.title =
      "Sair do modo visualização";

  } else {

    botaoModoVisualizacao.textContent =
      "👁️";

    botaoModoVisualizacao.title =
      "Ativar modo visualização";
  }
}


botaoModoVisualizacao.addEventListener(
  "click",
  alternarModoVisualizacao
);


/* =========================
   SISTEMA DE SENHA
   ========================= */

function verificarAcesso() {

  const ultimoAcesso =
    Number(
      localStorage.getItem(
        CHAVE_ACESSO
      ) || 0
    );

  const agora = Date.now();

  const cincoMinutos =
    5 * 60 * 1000;

  if (
    ultimoAcesso > 0 &&
    agora - ultimoAcesso <
      cincoMinutos
  ) {

    entrarNoSistema();

  } else {

    bloquearTela();
  }
}


function registrarAcesso() {

  localStorage.setItem(
    CHAVE_ACESSO,
    Date.now().toString()
  );
}


function entrarNoSistema() {

  telaSenha.classList.add(
    "oculto"
  );

  conteudo.classList.remove(
    "oculto"
  );

  registrarAcesso();

  iniciarTimerBloqueio();

  mostrarTelaPrincipal();
}


function bloquearTela() {

  clearTimeout(
    timerBloqueio
  );

  localStorage.removeItem(
    CHAVE_ACESSO
  );

  telaSenha.classList.remove(
    "oculto"
  );

  conteudo.classList.add(
    "oculto"
  );

  senhaInput.value = "";

  erroSenha.textContent = "";

  notaAtual = null;
}


function tentarEntrar() {

  const senhaDigitada =
    senhaInput.value.trim();

  if (senhaDigitada === SENHA) {

    erroSenha.textContent = "";

    entrarNoSistema();

  } else {

    erroSenha.textContent =
      "Senha incorreta.";

    senhaInput.value = "";

    senhaInput.focus();
  }
}


entrar.addEventListener(
  "click",
  tentarEntrar
);


senhaInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {
      tentarEntrar();
    }

  }
);


/* =========================
   BLOQUEIO AUTOMÁTICO
   ========================= */

function iniciarTimerBloqueio() {

  clearTimeout(
    timerBloqueio
  );

  timerBloqueio =
    setTimeout(
      function() {
        bloquearTela();
      },
      5 * 60 * 1000
    );
}


function atividadeUsuario() {

  if (
    conteudo.classList.contains(
      "oculto"
    )
  ) {
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


/* =========================
   BLOQUEAR MANUALMENTE
   ========================= */

document
  .getElementById("bloquear")
  .addEventListener(
    "click",
    function(event) {

      event.stopPropagation();

      bloquearTela();
    }
  );


/* =========================
   TELAS
   ========================= */

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

  telaPrincipal.classList.remove(
    "oculto"
  );

  renderizarLista();
}


function mostrarTelaAnotacao(id) {

  const nota =
    notas.find(
      function(item) {
        return item.id === id;
      }
    );

  if (!nota) {

    mostrarTelaPrincipal();

    return;
  }

  notaAtual = nota;

  esconderTodasAsTelas();

  telaAnotacao.classList.remove(
    "oculto"
  );

  tituloAberto.textContent =
    nota.titulo;

  dataAberto.textContent =
    "Criada em: " +
    formatarData(
      nota.criadaEm
    );

  conteudoAberto.textContent =
    nota.conteudo;

  atualizarBotaoFixar();

  atualizarBotaoConcluir();
}


function mostrarEditorNova() {

  if (
    estaEmModoVisualizacao()
  ) {
    return;
  }

  esconderTodasAsTelas();

  editorNova.classList.remove(
    "oculto"
  );

  novoTitulo.value = "";

  novoConteudo.value = "";

  setTimeout(
    function() {
      novoTitulo.focus();
    },
    100
  );
}


function mostrarEditorEdicao() {

  if (
    estaEmModoVisualizacao()
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
    notaAtual.titulo;

  conteudoEdicao.value =
    notaAtual.conteudo;

  setTimeout(
    function() {
      tituloEdicao.focus();
    },
    100
  );
}


function mostrarLixeira() {

  if (
    estaEmModoVisualizacao()
  ) {
    return;
  }

  esconderTodasAsTelas();

  telaLixeira.classList.remove(
    "oculto"
  );

  renderizarLixeira();
}


/* =========================
   NOVA ANOTAÇÃO
   ========================= */

document
  .getElementById("adicionar")
  .addEventListener(
    "click",
    mostrarEditorNova
  );


function salvarNovaAnotacao() {

  if (
    estaEmModoVisualizacao()
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


  if (!conteudoTexto) {

    alert(
      "Digite alguma informação na anotação."
    );

    novoConteudo.focus();

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

    atualizadaEm:
      new Date().toISOString(),

    fixada:
      false,

    concluida:
      false
  };


  notas.unshift(
    novaNota
  );

  salvarNotas();

  mostrarTelaPrincipal();
}


document
  .getElementById("salvarNova")
  .addEventListener(
    "click",
    salvarNovaAnotacao
  );


function cancelarNova() {

  novoTitulo.value = "";

  novoConteudo.value = "";

  mostrarTelaPrincipal();
}


document
  .getElementById("cancelarNova")
  .addEventListener(
    "click",
    cancelarNova
  );


document
  .getElementById("cancelarNova2")
  .addEventListener(
    "click",
    cancelarNova
  );


/* =========================
   EDITAR
   ========================= */

document
  .getElementById("editar")
  .addEventListener(
    "click",
    mostrarEditorEdicao
  );


function salvarEdicao() {

  if (
    estaEmModoVisualizacao()
  ) {
    return;
  }

  if (!notaAtual) {
    return;
  }


  const titulo =
    tituloEdicao.value.trim();

  const conteudoTexto =
    conteudoEdicao.value.trim();


  if (!titulo) {

    alert(
      "Digite um título."
    );

    tituloEdicao.focus();

    return;
  }


  if (!conteudoTexto) {

    alert(
      "Digite alguma informação."
    );

    conteudoEdicao.focus();

    return;
  }


  const indice =
    notas.findIndex(
      function(item) {
        return item.id === notaAtual.id;
      }
    );


  if (indice === -1) {

    mostrarTelaPrincipal();

    return;
  }


  notas[indice].titulo =
    titulo;

  notas[indice].conteudo =
    conteudoTexto;

  notas[indice].atualizadaEm =
    new Date().toISOString();


  notaAtual =
    notas[indice];

  salvarNotas();

  mostrarTelaAnotacao(
    notaAtual.id
  );
}


document
  .getElementById("salvarEdicao")
  .addEventListener(
    "click",
    salvarEdicao
  );


function cancelarEdicao() {

  if (notaAtual) {

    mostrarTelaAnotacao(
      notaAtual.id
    );

  } else {

    mostrarTelaPrincipal();
  }
}


document
  .getElementById("cancelarEdicao")
  .addEventListener(
    "click",
    cancelarEdicao
  );


document
  .getElementById("cancelarEdicao2")
  .addEventListener(
    "click",
    cancelarEdicao
  );


/* =========================
   VOLTAR
   ========================= */

document
  .getElementById("voltar")
  .addEventListener(
    "click",
    mostrarTelaPrincipal
  );


/* =========================
   FIXAR
   ========================= */

document
  .getElementById("fixar")
  .addEventListener(
    "click",
    function() {

      if (
        estaEmModoVisualizacao()
      ) {
        return;
      }

      if (!notaAtual) {
        return;
      }


      const indice =
        notas.findIndex(
          function(item) {
            return item.id ===
              notaAtual.id;
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

      renderizarLista();
    }
  );


function atualizarBotaoFixar() {

  const botao =
    document.getElementById(
      "fixar"
    );


  if (!notaAtual) {
    return;
  }


  botao.textContent = "📌";


  if (notaAtual.fixada) {

    botao.title =
      "Desafixar anotação";

  } else {

    botao.title =
      "Fixar anotação";
  }
}


/* =========================
   CONCLUIR
   ========================= */

document
  .getElementById("concluir")
  .addEventListener(
    "click",
    function() {

      if (
        estaEmModoVisualizacao()
      ) {
        return;
      }

      if (!notaAtual) {
        return;
      }


      const indice =
        notas.findIndex(
          function(item) {
            return item.id ===
              notaAtual.id;
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

      renderizarLista();
    }
  );


function atualizarBotaoConcluir() {

  const botao =
    document.getElementById(
      "concluir"
    );


  if (!notaAtual) {
    return;
  }


  if (notaAtual.concluida) {

    botao.textContent =
      "✓ Concluída";

    botao.classList.add(
      "concluida"
    );

  } else {

    botao.textContent =
      "Marcar como concluída";

    botao.classList.remove(
      "concluida"
    );
  }
}


/* =========================
   EXCLUIR
   ========================= */

document
  .getElementById("excluir")
  .addEventListener(
    "click",
    function() {

      if (
        estaEmModoVisualizacao()
      ) {
        return;
      }

      if (!notaAtual) {
        return;
      }


      const confirmar =
        confirm(
          "Mover esta anotação para a lixeira?"
        );


      if (!confirmar) {
        return;
      }


      moverParaLixeira(
        notaAtual.id
      );


      notaAtual = null;

      mostrarTelaPrincipal();
    }
  );


function moverParaLixeira(id) {

  const indice =
    notas.findIndex(
      function(item) {
        return item.id === id;
      }
    );


  if (indice === -1) {
    return;
  }


  const nota =
    notas[indice];


  nota.excluidaEm =
    new Date().toISOString();


  lixeira.unshift(
    nota
  );


  notas.splice(
    indice,
    1
  );


  salvarNotas();

  salvarLixeira();
}


/* =========================
   PESQUISA
   ========================= */

pesquisa.addEventListener(
  "input",
  renderizarLista
);


/* =========================
   FILTROS
   ========================= */

document
  .getElementById("filtroTodas")
  .addEventListener(
    "click",
    function() {
      alterarFiltro("todas");
    }
  );


document
  .getElementById("filtroPendentes")
  .addEventListener(
    "click",
    function() {
      alterarFiltro("pendentes");
    }
  );


document
  .getElementById("filtroConcluidas")
  .addEventListener(
    "click",
    function() {
      alterarFiltro("concluidas");
    }
  );


document
  .getElementById("filtroFixadas")
  .addEventListener(
    "click",
    function() {
      alterarFiltro("fixadas");
    }
  );


function alterarFiltro(filtro) {

  filtroAtual =
    filtro;


  document
    .querySelectorAll(".filtro")
    .forEach(
      function(botao) {

        botao.classList.remove(
          "ativo"
        );
      }
    );


  if (filtro === "todas") {

    document
      .getElementById(
        "filtroTodas"
      )
      .classList.add(
        "ativo"
      );
  }


  if (filtro === "pendentes") {

    document
      .getElementById(
        "filtroPendentes"
      )
      .classList.add(
        "ativo"
      );
  }


  if (filtro === "concluidas") {

    document
      .getElementById(
        "filtroConcluidas"
      )
      .classList.add(
        "ativo"
      );
  }


  if (filtro === "fixadas") {

    document
      .getElementById(
        "filtroFixadas"
      )
      .classList.add(
        "ativo"
      );
  }


  renderizarLista();
}


/* =========================
   RENDERIZAR LISTA
   ========================= */

function renderizarLista() {

  lista.innerHTML = "";

  const termo =
    pesquisa.value
      .trim()
      .toLowerCase();


  let filtradas =
    notas.filter(
      function(nota) {

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
          filtroAtual ===
            "pendentes" &&
          nota.concluida
        ) {
          return false;
        }


        if (
          filtroAtual ===
            "concluidas" &&
          !nota.concluida
        ) {
          return false;
        }


        if (
          filtroAtual ===
            "fixadas" &&
          !nota.fixada
        ) {
          return false;
        }


        return true;
      }
    );


  filtradas.sort(
    function(a, b) {

      if (
        a.fixada &&
        !b.fixada
      ) {
        return -1;
      }


      if (
        !a.fixada &&
        b.fixada
      ) {
        return 1;
      }


      return (
        new Date(b.criadaEm) -
        new Date(a.criadaEm)
      );
    }
  );


  filtradas.forEach(
    function(nota) {

      const item =
        document.createElement(
          "button"
        );


      item.type = "button";

      item.className =
        "item-nota";


      if (nota.concluida) {

        item.classList.add(
          "item-concluida"
        );
      }


      const conteudoItem =
        document.createElement(
          "div"
        );


      conteudoItem.className =
        "item-nota-conteudo";


      const ladoTexto =
        document.createElement(
          "div"
        );


      const titulo =
        document.createElement(
          "h3"
        );


      titulo.textContent =
        nota.titulo;


      const info =
        document.createElement(
          "p"
        );


      info.className =
        "item-nota-info";


      info.textContent =
        nota.concluida
          ? "✓ Concluída"
          : "Pendente";


      ladoTexto.appendChild(
        titulo
      );

      ladoTexto.appendChild(
        info
      );


      conteudoItem.appendChild(
        ladoTexto
      );


      if (nota.fixada) {

        const fixada =
          document.createElement(
            "span"
          );


        fixada.className =
          "item-nota-fixada";


        fixada.textContent =
          "📌";


        conteudoItem.appendChild(
          fixada
        );
      }


      item.appendChild(
        conteudoItem
      );


      item.addEventListener(
        "click",
        function() {

          mostrarTelaAnotacao(
            nota.id
          );
        }
      );


      lista.appendChild(
        item
      );
    }
  );


  contador.textContent =
    notas.length +
    (
      notas.length === 1
        ? " anotação"
        : " anotações"
    );


  if (
    filtradas.length === 0
  ) {

    listaVazia.classList.remove(
      "oc
