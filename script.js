// -------------------- LOGIN / CADASTRO --------------------

// Função para alternar telas
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

// Referências principais
const btnLogin = document.getElementById("btn-login");
const btnCadastro = document.getElementById("btn-cadastro");
const btnSobre = document.getElementById("btn-sobre");
const btnVoltarInicio1 = document.getElementById("btn-voltar-inicio1");
const btnVoltarInicio2 = document.getElementById("btn-voltar-inicio2");
const btnVoltarSobre = document.getElementById("btn-voltar-sobre");
const btnSalvarCadastro = document.getElementById("btn-salvar-cadastro");
const btnEntrar = document.getElementById("btn-entrar");
const linkEsqueci = document.getElementById("link-esqueci");

// Navegação entre telas
btnLogin.addEventListener("click", () => mostrarTela("tela-login"));
btnCadastro.addEventListener("click", () => mostrarTela("tela-cadastro"));
btnSobre.addEventListener("click", () => mostrarTela("tela-sobre"));
btnVoltarInicio1.addEventListener("click", () => mostrarTela("tela-inicial"));
btnVoltarInicio2.addEventListener("click", () => mostrarTela("tela-inicial"));
btnVoltarSobre.addEventListener("click", () => mostrarTela("tela-inicial"));

// Cadastro
btnSalvarCadastro.addEventListener("click", () => {
  const nome = document.getElementById("cad-nome").value.trim();
  const email = document.getElementById("cad-email").value.trim();
  const senha = document.getElementById("cad-senha").value.trim();

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  const user = { nome, email, senha };
  localStorage.setItem("quizUser", JSON.stringify(user));
  alert("Cadastro realizado com sucesso!");
  mostrarTela("tela-login");
});

// Login
btnEntrar.addEventListener("click", () => {
  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-senha").value.trim();
  const user = JSON.parse(localStorage.getItem("quizUser"));

  if (!user) {
    alert("Nenhum usuário cadastrado!");
    return;
  }

  if (user.email === email && user.senha === senha) {
    alert(`Bem-vindo, ${user.nome}!`);
    mostrarTela("tela-menu");
  } else {
    alert("E-mail ou senha incorretos!");
  }
});

// Esqueci minha senha
linkEsqueci.addEventListener("click", (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("quizUser"));
  if (user) {
    alert(`Sua senha é: ${user.senha}`);
  } else {
    alert("Nenhum usuário cadastrado ainda!");
  }
});

// -------------------- MENU PÓS-LOGIN --------------------
const btnIniciarQuiz = document.getElementById("btn-iniciar");
const btnCriarQuizMenu = document.getElementById("btn-criar-quiz");
const btnSair = document.getElementById("btn-sair");

if (btnIniciarQuiz) {
  btnIniciarQuiz.addEventListener("click", () => {
    mostrarTela("tela-jogo");
    iniciarQuizPadrao();
  });
}

if (btnCriarQuizMenu) {
  btnCriarQuizMenu.addEventListener("click", () => {
    mostrarTela("tela-criar-quiz");
    resetQuizForm();
    updateRoundDisplay();
  });
}

if (btnSair) {
  btnSair.addEventListener("click", () => {
    if (confirm("Deseja sair?")) {
      mostrarTela("tela-inicial");
    }
  });
}

// -------------------- LÓGICA DO QUIZ --------------------
let currentRound = 1;
let totalRounds = 5;
let score = 0;
let rounds = [];
let questions = [];

const listaTermos = document.getElementById("lista-termos");
const listaDefinicoes = document.getElementById("lista-definicoes");
const pontuacaoSpan = document.getElementById("pontuacao");
const rodadaNum = document.getElementById("rodada-num");
const rodadasTotal = document.getElementById("rodadas-total");
const progressBar = document.getElementById("progress-bar");
const feedbackDiv = document.getElementById("feedback");
const pontuacaoFinal = document.getElementById("pontuacao-final");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Quiz padrão (pré-carregado)
const defaultRounds = [
  [
    { termo: "HTML", definicao: "Linguagem de marcação utilizada para estruturar páginas web" },
    { termo: "CSS", definicao: "Linguagem utilizada para estilizar elementos escritos em HTML" },
    { termo: "JavaScript", definicao: "Linguagem de programação que permite implementar funcionalidades dinâmicas" }
  ],
  [
    { termo: "Front-end", definicao: "Parte do desenvolvimento responsável pela interface e interação com o usuário" },
    { termo: "Back-end", definicao: "Parte do sistema que lida com o servidor, banco de dados e regras de negócio" },
    { termo: "Responsividade", definicao: "Capacidade de um site se adaptar a diferentes tamanhos de tela e dispositivos" }
  ],
  [
    { termo: "classList", definicao: "Propriedade usada para adicionar, remover ou alternar classes CSS em um elemento" },
    { termo: "innerHTML", definicao: "Propriedade que permite acessar ou modificar o conteúdo HTML de um elemento" },
    { termo: "DOM", definicao: "Interface que representa a estrutura de um documento HTML como uma árvore de objetos" }
  ],
  [
    { termo: "Layout", definicao: "Organização visual dos elementos de uma página web" },
    { termo: "CSS", definicao: "Linguagem usada para estilizar e formatar elementos HTML" },
    { termo: "Element", definicao: "Objeto do DOM que representa um componente HTML na página" }
  ],
  [
    { termo: "JavaScript", definicao: "Linguagem de programação usada para criar interatividade e dinamismo nas páginas web" },
    { termo: "Evento", definicao: "Ação detectada pelo navegador, como um clique ou digitação" },
    { termo: "Função", definicao: "Bloco de código que executa uma tarefa específica quando chamado" }
  ]
];

// Iniciar quiz padrão
function iniciarQuizPadrao() {
  rounds = [...defaultRounds];
  totalRounds = rounds.length;
  currentRound = 1;
  score = 0;
  loadQuestion();
  atualizarUI();
}

// Carrega rodada
function loadQuestion() {
  const rodadaAtual = rounds[currentRound - 1];
  listaTermos.innerHTML = "";
  listaDefinicoes.innerHTML = "";
  feedbackDiv.textContent = "";

  rodadaNum.textContent = currentRound;
  rodadasTotal.textContent = totalRounds;

  rodadaAtual.forEach(item => {
    const termoEl = document.createElement("li");
    termoEl.classList.add("termo");
    termoEl.textContent = item.termo;
    termoEl.dataset.termo = item.termo;
    listaTermos.appendChild(termoEl);
  });

  const definicoesEmbaralhadas = rodadaAtual
    .map(item => item.definicao)
    .sort(() => Math.random() - 0.5);

  definicoesEmbaralhadas.forEach(def => {
    const defEl = document.createElement("li");
    defEl.classList.add("definicao");
    defEl.textContent = def;
    defEl.draggable = true;
    listaDefinicoes.appendChild(defEl);
  });

  addDragAndDrop();
  atualizarUI();
}

function atualizarUI() {
  pontuacaoSpan.textContent = score;
  progressBar.style.width = `${(currentRound / totalRounds) * 100}%`;
}

// Drag & Drop
function addDragAndDrop() {
  const definicoes = document.querySelectorAll(".definicao");
  const termos = document.querySelectorAll(".termo");

  definicoes.forEach(def => {
    def.addEventListener("dragstart", () => def.classList.add("dragging"));
    def.addEventListener("dragend", () => def.classList.remove("dragging"));
  });

  termos.forEach(termo => {
    termo.addEventListener("dragover", (e) => {
      e.preventDefault();
      termo.classList.add("drag-over");
    });

    termo.addEventListener("dragleave", () => termo.classList.remove("drag-over"));

    termo.addEventListener("drop", () => {
      const dragged = document.querySelector(".dragging");
      if (!dragged) return;

      const rodadaAtual = rounds[currentRound - 1];
      const termoCorreto = rodadaAtual.find(i => i.termo === termo.dataset.termo);

      if (dragged.textContent === termoCorreto.definicao) {
        // ✅ Mantém verde (acerto permanente)
        termo.classList.add("correct");
        score += 10;
        dragged.remove();
        feedback("Correto! ✅", true);
        termo.classList.remove("drag-over"); // garante que a borda azul desapareça
      } else {
        // ❌ Mostra vermelho por 1s e volta ao normal
        termo.classList.add("incorrect");
        feedback("Errado! ❌ Tente novamente!  ", false);
        setTimeout(() => termo.classList.remove("incorrect"), 1000);
        termo.classList.remove("drag-over");
      }


      atualizarUI();

      if (listaDefinicoes.children.length === 0) {
        setTimeout(proximaRodada, 1200);
      }
    });
  });
}

function feedback(msg, correto) {
  feedbackDiv.textContent = msg;
  feedbackDiv.className = correto ? "feedback correct" : "feedback incorrect";
}

function proximaRodada() {
  if (currentRound < totalRounds) {
    currentRound++;
    loadQuestion();
  } else {
    finalizarQuiz();
  }
}

function finalizarQuiz() {
  mostrarTela("tela-final");
  pontuacaoFinal.textContent = score;
}

btnReiniciar.addEventListener("click", () => {
  mostrarTela("tela-menu");
});

// -------------------- CRIAR QUIZ PERSONALIZADO --------------------
let customQuiz = [];
let currentPairs = [];
const numRoundsInput = document.getElementById("num-rounds");
const pairsPerRoundInput = document.getElementById("pairs-per-round");
const roundIndicator = document.getElementById("round-indicator");
const currentPairsDiv = document.getElementById("current-pairs");

const btnAddPair = document.getElementById("btn-add-pair");
const btnNextRound = document.getElementById("btn-next-round");
const btnSalvarQuiz = document.getElementById("btn-salvar-quiz");
const btnVoltarCriar = document.getElementById("btn-voltar");

btnAddPair.addEventListener("click", () => {
  const term = document.querySelector(".term-input").value.trim();
  const def = document.querySelector(".definition-input").value.trim();

  if (!term || !def) {
    alert("Preencha os dois campos!");
    return;
  }

  currentPairs.push({ termo: term, definicao: def });
  atualizarPares();
  document.querySelector(".term-input").value = "";
  document.querySelector(".definition-input").value = "";

  if (currentPairs.length >= parseInt(pairsPerRoundInput.value)) {
    btnAddPair.style.display = "none";
    btnNextRound.style.display = "inline-block";
  }
});

  btnNextRound.addEventListener("click", () => {
    // Salva a rodada atual
    customQuiz.push([...currentPairs]);
    currentPairs = [];
    atualizarPares();

    const totalRodadas = parseInt(numRoundsInput.value);
    const rodadaAtual = customQuiz.length;

    if (rodadaAtual < totalRodadas) {
      // Ainda há rodadas a criar
      updateRoundDisplay();
      btnAddPair.style.display = "inline-block";
      btnNextRound.style.display = "none";
    } else {
      // Todas as rodadas foram criadas
      btnAddPair.style.display = "none";
      btnNextRound.style.display = "none";
      btnSalvarQuiz.style.display = "inline-block";
      alert("✅ Todas as rodadas foram criadas! Clique em 'Finalizar Quiz' para começar.");
    }
});


btnSalvarQuiz.addEventListener("click", () => {
  rounds = [...customQuiz];
  totalRounds = rounds.length;
  score = 0;
  currentRound = 1;
  mostrarTela("tela-jogo");
  loadQuestion();
});

btnVoltarCriar.addEventListener("click", () => mostrarTela("tela-menu"));

function resetQuizForm() {
  customQuiz = [];
  currentPairs = [];
  btnAddPair.style.display = "inline-block";
  btnNextRound.style.display = "none";
  btnSalvarQuiz.style.display = "none";
  atualizarPares();
}

function atualizarPares() {
  currentPairsDiv.innerHTML = currentPairs
    .map(p => `<div class="pair-item"><span class="pair-term">${p.termo}</span> → <span class="pair-def">${p.definicao}</span></div>`)
    .join("");
}

function updateRoundDisplay() {
  roundIndicator.textContent = `Rodada ${customQuiz.length + 1}`;
}
