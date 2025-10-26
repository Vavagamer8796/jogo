// -------------------- LOGIN / CADASTRO --------------------

// Função para alternar telas
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  const el = document.getElementById(id);
  if (el) el.classList.add("ativa");
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

// Navegação entre telas (proteções se elementos existirem)
if (btnLogin) btnLogin.addEventListener("click", () => mostrarTela("tela-login"));
if (btnCadastro) btnCadastro.addEventListener("click", () => mostrarTela("tela-cadastro"));
if (btnSobre) btnSobre.addEventListener("click", () => mostrarTela("tela-sobre"));
if (btnVoltarInicio1) btnVoltarInicio1.addEventListener("click", () => mostrarTela("tela-inicial"));
if (btnVoltarInicio2) btnVoltarInicio2.addEventListener("click", () => mostrarTela("tela-inicial"));
if (btnVoltarSobre) btnVoltarSobre.addEventListener("click", () => mostrarTela("tela-inicial"));

// Cadastro
if (btnSalvarCadastro) {
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
}

// Login
if (btnEntrar) {
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
}

// Esqueci minha senha
if (linkEsqueci) {
  linkEsqueci.addEventListener("click", (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("quizUser"));
    if (user) {
      alert(`Sua senha é: ${user.senha}`);
    } else {
      alert("Nenhum usuário cadastrado ainda!");
    }
  });
}

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
    updateButtonsForCreate();
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
  if (!rounds || !rounds[currentRound - 1]) return;
  const rodadaAtual = rounds[currentRound - 1];
  if (listaTermos) listaTermos.innerHTML = "";
  if (listaDefinicoes) listaDefinicoes.innerHTML = "";
  if (feedbackDiv) {
    feedbackDiv.textContent = "";
    feedbackDiv.className = "feedback hidden"; 
  }

  if (rodadaNum) rodadaNum.textContent = currentRound;
  if (rodadasTotal) rodadasTotal.textContent = totalRounds;

  rodadaAtual.forEach(item => {
    const termoEl = document.createElement("li");
    termoEl.classList.add("termo");
    termoEl.textContent = item.termo;
    termoEl.dataset.termo = item.termo;
    if (listaTermos) listaTermos.appendChild(termoEl);
  });

  const definicoesEmbaralhadas = rodadaAtual
    .map(item => item.definicao)
    .sort(() => Math.random() - 0.5);

  definicoesEmbaralhadas.forEach(def => {
    const defEl = document.createElement("li");
    defEl.classList.add("definicao");
    defEl.textContent = def;
    defEl.draggable = true;
    if (listaDefinicoes) listaDefinicoes.appendChild(defEl);
  });

  addDragAndDrop();
  atualizarUI();
}

function atualizarUI() {
  if (pontuacaoSpan) pontuacaoSpan.textContent = score;
  if (typeof animatePontuacao === "function") animatePontuacao();
  if (progressBar) progressBar.style.width = `${(currentRound / totalRounds) * 100}%`;
}

// === resto do seu código igual (Drag & Drop, validarDrop, feedback, criar quiz, etc) ===

// --- ANIMAÇÃO DE PONTUAÇÃO (NOVO BLOCO) ---
(function setupScoreAnimation() {
  const pont = document.getElementById("pontuacao");
  if (!pont) return;
  window.animatePontuacao = function() {
    pont.classList.add("animate");
    clearTimeout(pont._animTimeout);
    pont._animTimeout = setTimeout(() => pont.classList.remove("animate"), 300);
  };
})();
