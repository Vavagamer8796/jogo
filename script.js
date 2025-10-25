// -------------------- LOGIN / CADASTRO --------------------

// Função para alternar telas
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  const el = document.getElementById(id);
  if (el) el.classList.add("ativa");
}

// Referências principais (só pega se existir)
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

// Aqui usei as chaves em português conforme seu código espera
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
  if (feedbackDiv) feedbackDiv.textContent = "";

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
  if (progressBar) progressBar.style.width = `${(currentRound / totalRounds) * 100}%`;
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

      if (!termoCorreto) return;

      if (dragged.textContent === termoCorreto.definicao) {
        termo.classList.add("correct");            // verde permanente
        score += 10;
        dragged.remove();
        feedback("Correto! 🎉", true);
        termo.classList.remove("drag-over");
      } else {
        termo.classList.add("incorrect");         // vermelho temporário
        feedback("Errado! 😢", false);
        termo.classList.remove("drag-over");
        setTimeout(() => termo.classList.remove("incorrect"), 1000);
      }

      atualizarUI();

      // se não há mais definições, próxima rodada ou fim
      if (!listaDefinicoes || listaDefinicoes.children.length === 0) {
        setTimeout(proximaRodada, 1200);
      }
    });
  });
}

function feedback(msg, correto) {
  if (!feedbackDiv) return;
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
  if (pontuacaoFinal) pontuacaoFinal.textContent = score;
}

if (btnReiniciar) {
  btnReiniciar.addEventListener("click", () => {
    mostrarTela("tela-menu");
  });
}

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

// função central que atualiza visibilidade dos botões do criador
function updateButtonsForCreate() {
  // segurança: se elementos faltarem, aborta
  if (!btnAddPair || !btnNextRound || !btnSalvarQuiz || !numRoundsInput || !pairsPerRoundInput) return;

  const totalRodadas = parseInt(numRoundsInput.value) || 1;
  const paresPorRodada = parseInt(pairsPerRoundInput.value) || 1;
  const rodadaAtual = customQuiz.length; // já salvas
  const paresAtuais = currentPairs.length;

  // Se já temos a rodada completa (paresAtuais >= paresPorRodada)
  if (paresAtuais >= paresPorRodada) {
    // Se ainda precisamos criar mais rodadas além da atual
    if (rodadaAtual + 1 < totalRodadas) {
      btnAddPair.style.display = "none";
      btnNextRound.style.display = "inline-block";
      btnSalvarQuiz.style.display = "none";
    } else {
      // estamos na ÚLTIMA rodada: mostrar salvar
      btnAddPair.style.display = "none";
      btnNextRound.style.display = "none";
      btnSalvarQuiz.style.display = "inline-block";
    }
  } else {
    // Ainda faltam pares para completar a rodada atual
    btnAddPair.style.display = "inline-block";
    btnNextRound.style.display = "none";
    btnSalvarQuiz.style.display = "none";
  }
}

// sincroniza display do indicador de rodada
function updateRoundDisplay() {
  if (!roundIndicator || !numRoundsInput) return;
  const totalRodadas = parseInt(numRoundsInput.value) || 1;
  const exib = Math.min(customQuiz.length + 1, totalRodadas);
  roundIndicator.textContent = `Rodada ${exib} de ${totalRodadas}`;
}

// Adicionar par
if (btnAddPair) {
  btnAddPair.addEventListener("click", () => {
    const termInput = document.querySelector(".term-input");
    const defInput = document.querySelector(".definition-input");
    if (!termInput || !defInput) return;

    const term = termInput.value.trim();
    const def = defInput.value.trim();

    if (!term || !def) {
      alert("Preencha os dois campos!");
      return;
    }

    const paresPorRodada = parseInt(pairsPerRoundInput.value) || 1;
    if (currentPairs.length >= paresPorRodada) {
      alert(`Máximo de ${paresPorRodada} pares por rodada atingido!`);
      return;
    }

    currentPairs.push({ termo: term, definicao: def });
    atualizarPares();
    termInput.value = "";
    defInput.value = "";

    // atualiza botões
    updateButtonsForCreate();
  });
}

// Clicar Próxima Rodada
if (btnNextRound) {
  btnNextRound.addEventListener("click", () => {
    // salva a rodada atual
    customQuiz.push([...currentPairs]);
    currentPairs = [];
    atualizarPares();

    updateRoundDisplay();
    updateButtonsForCreate();

    const totalRodadas = parseInt(numRoundsInput.value) || 1;
    if (customQuiz.length >= totalRodadas) {
      // caso já tenhamos atingido o total (defensivo)
      btnAddPair.style.display = "none";
      btnNextRound.style.display = "none";
      btnSalvarQuiz.style.display = "inline-block";
      alert("✅ Todas as rodadas foram criadas! Clique em 'Finalizar Quiz' para começar.");
    } else {
      // prepara para próxima rodada: permitir adicionar pares
      btnAddPair.style.display = "inline-block";
      btnNextRound.style.display = "none";
      btnSalvarQuiz.style.display = "none";
    }
  });
}

// Salvar/Finalizar quiz (última ação)
if (btnSalvarQuiz) {
  btnSalvarQuiz.addEventListener("click", () => {
    const paresPorRodada = parseInt(pairsPerRoundInput.value) || 1;
    // Se o usuário ainda não empurrou a última rodada para customQuiz, verifica currentPairs
    if (currentPairs.length !== paresPorRodada) {
      alert(`Por favor, adicione exatamente ${paresPorRodada} pares para esta rodada antes de finalizar!`);
      return;
    }

    // adiciona a última rodada
    customQuiz.push([...currentPairs]);

    // configura as variáveis globais
    rounds = customQuiz.map(r => r.map(p => ({ termo: p.termo, definicao: p.definicao })));
    totalRounds = rounds.length;
    score = 0;
    currentRound = 1;

    // limpa estado de criação
    customQuiz = [];
    currentPairs = [];
    atualizarPares();

    // mostra jogo
    mostrarTela("tela-jogo");
    loadQuestion();
    atualizarUI();
  });
}

// Voltar ao menu a partir do criador
if (btnVoltarCriar) btnVoltarCriar.addEventListener("click", () => mostrarTela("tela-menu"));

// Resetar formulário do criador
function resetQuizForm() {
  customQuiz = [];
  currentPairs = [];
  if (numRoundsInput) numRoundsInput.value = "3";
  if (pairsPerRoundInput) pairsPerRoundInput.value = "3";
  if (btnAddPair) btnAddPair.style.display = "inline-block";
  if (btnNextRound) btnNextRound.style.display = "none";
  if (btnSalvarQuiz) btnSalvarQuiz.style.display = "none";
  atualizarPares();
  updateRoundDisplay();
}

// Mostra os pares atuais na UI
function atualizarPares() {
  if (!currentPairsDiv) return;
  currentPairsDiv.innerHTML = currentPairs
    .map(p => `<div class="pair-item"><span class="pair-term">${p.termo}</span> → <span class="pair-def">${p.definicao}</span></div>`)
    .join("");
}

// Atualiza quando usuário ajusta valores nas inputs (se elas existirem)
if (numRoundsInput) numRoundsInput.addEventListener("change", () => {
  // adapta caso total de rodadas seja menor que já criadas
  updateRoundDisplay();
  updateButtonsForCreate();
});
if (pairsPerRoundInput) pairsPerRoundInput.addEventListener("change", () => {
  updateButtonsForCreate();
});

// Inicialização: chama reset para garantir estado consistente ao carregar a tela criar-quiz
resetQuizForm();
