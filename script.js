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
// CORREÇÃO: Mudar o botão "Voltar" da tela Sobre para voltar para a tela inicial
if (btnSobre) btnSobre.addEventListener("click", () => mostrarTela("tela-sobre"));
if (btnVoltarInicio1) btnVoltarInicio1.addEventListener("click", () => mostrarTela("tela-inicial"));
if (btnVoltarInicio2) btnVoltarInicio2.addEventListener("click", () => mostrarTela("tela-inicial"));
// CORREÇÃO: O botão voltar da tela-sobre deve voltar para o menu PÓS-LOGIN se estiver logado, ou inicial.
// Por enquanto, manteremos inicial, mas é bom testar a lógica do menu.
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
        resetQuizForm(); // Adicionado: Reseta o formulário
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

const listaTermos = document.getElementById("lista-termos");
const listaDefinicoes = document.getElementById("lista-definicoes");
const pontuacaoSpan = document.getElementById("pontuacao");
const rodadaNum = document.getElementById("rodada-num");
const rodadasTotal = document.getElementById("rodadas-total");
const progressBar = document.getElementById("progress-bar");
const feedbackDiv = document.getElementById("feedback");
const pontuacaoFinal = document.getElementById("pontuacao-final");

// Botões da tela final
const btnFimRefazer = document.getElementById("btn-fim-refazer"); // Novo ID do HTML
const btnFimMenu = document.getElementById("btn-fim-menu"); // Novo ID do HTML

//Adicionar listener para o botão de refazer (Quiz Padrão) na tela final
if (btnFimRefazer) {
    btnFimRefazer.addEventListener("click", () => {
        mostrarTela("tela-jogo");
        iniciarQuizPadrao();
    });
}

//Adicionar listener para o botão de Menu Principal na tela final
if (btnFimMenu) {
    btnFimMenu.addEventListener("click", () => {
        mostrarTela("tela-menu");
    });
}

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
        { termo: "Element", definicao: "Objeto do DOM que representa um componente HTML na página" }, // Mantive Element em vez de CSS para não repetir a definição
        { termo: "Loop", definicao: "Estrutura de programação que repete um bloco de código até que uma condição seja satisfeita" }
    ],
    [
        { termo: "Variável", definicao: "Local de armazenamento nomeado para um valor de dados" },
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
    if (progressBar) progressBar.style.width = '0%';
    loadQuestion();
    atualizarUI();
}

// Inicia o quiz customizado
function iniciarQuizCustomizado(customRounds) {
    rounds = customRounds;
    totalRounds = rounds.length;
    currentRound = 1;
    score = 0;
    if (progressBar) progressBar.style.width = '0%';
    loadQuestion();
    atualizarUI();
}

// Atualiza placar, rodada e barra de progresso
function atualizarUI() {
    if (pontuacaoSpan) pontuacaoSpan.textContent = score;
    if (rodadaNum) rodadaNum.textContent = currentRound;
    if (rodadasTotal) rodadasTotal.textContent = totalRounds;
    
    if (progressBar) {
        const percentage = (currentRound - 1) / totalRounds * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// Carrega rodada
function loadQuestion() {
    if (!rounds || !rounds[currentRound - 1]) {
        console.error("Erro: Rodada não encontrada.");
        finishQuiz(); // Finaliza se a rodada não existir
        return;
    }
    const rodadaAtual = rounds[currentRound - 1];
    
    // Limpeza e Feedback
    if (listaTermos) listaTermos.innerHTML = "";
    if (listaDefinicoes) listaDefinicoes.innerHTML = "";
    if (feedbackDiv) {
        feedbackDiv.textContent = "";
        feedbackDiv.className = "feedback hidden"; 
    }

    // Geração dos Termos (Arrastáveis)
    rodadaAtual.forEach(item => {
        const termoEl = document.createElement("li");
        termoEl.classList.add("termo");
        termoEl.textContent = item.termo;
        termoEl.dataset.termo = item.termo;
        termoEl.dataset.definicao = item.definicao; // Armazena a definição correta
        termoEl.draggable = true; 
        if (listaTermos) listaTermos.appendChild(termoEl);
    });

    // Geração das Definições (Drops) - Embaralhadas
    const definicoesEmbaralhadas = rodadaAtual
        .map(item => item.definicao)
        .sort(() => Math.random() - 0.5);

    definicoesEmbaralhadas.forEach(def => {
        const defEl = document.createElement("li");
        defEl.classList.add("definicao");
        defEl.textContent = def;
        defEl.dataset.targetDefinicao = def; // Armazena a definição esperada
        defEl.draggable = false; 
        if (listaDefinicoes) listaDefinicoes.appendChild(defEl);
    });

    addDragAndDrop(); 
    atualizarUI();
}

// Função para adicionar eventos de drag-and-drop aos itens (Mantida)
function addDragAndDrop() {
    const termos = document.querySelectorAll(".termo");
    const definicoes = document.querySelectorAll(".definicao");

    // Eventos para os TERMOS (Arrastáveis)
    termos.forEach(termo => {
        termo.removeEventListener("dragstart", handleDragStart);
        termo.addEventListener("dragstart", handleDragStart);
        termo.removeEventListener("dragend", handleDragEnd);
        termo.addEventListener("dragend", handleDragEnd);
    });

    // Eventos para as DEFINIÇÕES (Áreas de Drop)
    definicoes.forEach(def => {
        def.removeEventListener("dragover", handleDragOver); 
        def.addEventListener("dragover", handleDragOver);
        def.removeEventListener("dragenter", handleDragEnter);
        def.addEventListener("dragenter", handleDragEnter);
        def.removeEventListener("dragleave", handleDragLeave);
        def.addEventListener("dragleave", handleDragLeave);
        def.removeEventListener("drop", handleDrop);
        def.addEventListener("drop", handleDrop);
    });
    
    addTouchSupport();
}

let draggedItem = null;

// Funções de Drag-and-Drop
function handleDragStart(e) {
    draggedItem = e.target;
    draggedItem.classList.add("dragging"); 
    e.dataTransfer.setData("termo", draggedItem.dataset.termo);
    e.dataTransfer.setData("definicaoCorreta", draggedItem.dataset.definicao); 
}

function handleDragEnd(e) {
    e.target.classList.remove("dragging"); 
}

function handleDragOver(e) {
    e.preventDefault(); 
}

function handleDragEnter(e) {
    e.preventDefault();
    const definicao = e.target;
    if (definicao.classList.contains("definicao") && !definicao.classList.contains("matched")) {
        definicao.classList.add("drag-over");
    }
}

function handleDragLeave(e) {
    e.target.classList.remove("drag-over");
}

function handleDrop(e) {
    e.preventDefault();
    const definicao = e.target; 
    definicao.classList.remove("drag-over");

    const termoArrastado = e.dataTransfer.getData("termo");
    const definicaoCorretaDoTermo = e.dataTransfer.getData("definicaoCorreta");
    
    const termoEl = document.querySelector(`.termo[data-termo="${termoArrastado}"]`);

    if (!termoEl || !definicao.classList.contains("definicao") || definicao.classList.contains("matched")) {
        if(termoEl) termoEl.classList.remove("dragging"); 
        return; 
    }
    
    const definicaoAlvo = definicao.dataset.targetDefinicao;
    const acertou = definicaoCorretaDoTermo === definicaoAlvo;
    
    termoEl.remove();

    checkAnswer(acertou, definicao, termoArrastado);
    
    draggedItem = null;
}

function checkAnswer(acertou, definicaoEl, termo) {
    
    if (acertou) {
        score += 10;
        if (window.animatePontuacao) window.animatePontuacao();
        definicaoEl.classList.remove("incorrect");
        definicaoEl.classList.add("correct", "matched");
        
        // Exibe o termo associado e a definição original
        definicaoEl.innerHTML = `<strong>${termo}</strong><br>${definicaoEl.dataset.targetDefinicao}`;
        
        feedbackDiv.textContent = `Acerto! O termo "${termo}" corresponde.`;
        feedbackDiv.className = "feedback correct-text";

    } else {
        score = Math.max(0, score - 5); 
        definicaoEl.classList.remove("correct");
        definicaoEl.classList.add("incorrect", "matched");
        
        // Exibe o termo solto e a definição original + status de erro
        definicaoEl.innerHTML = `<strong>${termo}</strong><br><small>Não é: ${definicaoEl.dataset.targetDefinicao}</small>`; 
        
        feedbackDiv.textContent = `Erro! O termo "${termo}" não corresponde a esta definição.`;
        feedbackDiv.className = "feedback incorrect-text";
    }

    atualizarUI();
    
    // Verifica se todos os termos foram associados para avançar
    const termosRestantes = document.querySelectorAll(".termo").length;
    if (termosRestantes === 0) {
        setTimeout(nextRound, 1500); 
    }
}

// Função para avançar para a próxima rodada ou finalizar o quiz
function nextRound() {
    currentRound++;
    if (currentRound <= totalRounds) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

// Função para finalizar o quiz
function finishQuiz() {
    if (pontuacaoFinal) pontuacaoFinal.textContent = score;
    mostrarTela("tela-final"); // Corrigido para 'tela-final' conforme seu HTML
    if (progressBar) progressBar.style.width = '100%';
}

// -------------------- CRIAÇÃO DO QUIZ (NOVA LÓGICA) --------------------

const numRoundsInput = document.getElementById("num-rounds");
const pairsPerRoundInput = document.getElementById("pairs-per-round");
const termInput = document.getElementById("term-input");
const definitionInput = document.getElementById("definition-input");
const btnAddPair = document.getElementById("btn-add-pair");
const btnNextRound = document.getElementById("btn-next-round");
const btnSalvarQuiz = document.getElementById("btn-salvar-quiz");
const btnVoltarCriar = document.getElementById("btn-voltar-criar");
const roundIndicator = document.getElementById("round-indicator");
const currentPairsDiv = document.getElementById("current-pairs");

let customRounds = [];
let currentCustomRound = 1;
let pairsCount = 0;
let maxPairs = 3;
let maxRounds = 3;
let currentRoundPairs = [];


function resetQuizForm() {
    customRounds = [];
    currentCustomRound = 1;
    pairsCount = 0;
    
    // Configurações padrão
    maxRounds = parseInt(numRoundsInput.value) || 3;
    maxPairs = parseInt(pairsPerRoundInput.value) || 3;

    // Reseta inputs e display
    if (termInput) termInput.value = "";
    if (definitionInput) definitionInput.value = "";
    if (currentPairsDiv) currentPairsDiv.innerHTML = "";

    updateUIForCreation();
}

function updateUIForCreation() {
    maxRounds = parseInt(numRoundsInput.value) || 3;
    maxPairs = parseInt(pairsPerRoundInput.value) || 3;

    if (roundIndicator) roundIndicator.textContent = `Rodada ${currentCustomRound} de ${maxRounds}`;
    
    // Mostra/Esconde botões
    const isRoundComplete = pairsCount >= maxPairs;
    const isQuizComplete = currentCustomRound >= maxRounds;

    if (btnNextRound) btnNextRound.style.display = (isRoundComplete && !isQuizComplete) ? 'inline-block' : 'none';
    if (btnSalvarQuiz) btnSalvarQuiz.style.display = (isRoundComplete && isQuizComplete) ? 'inline-block' : 'none';
    if (btnAddPair) btnAddPair.style.display = isRoundComplete ? 'none' : 'inline-block';

    // Desabilita configuração após a primeira rodada
    const disableConfig = currentCustomRound > 1;
    if (numRoundsInput) numRoundsInput.disabled = disableConfig;
    if (pairsPerRoundInput) pairsPerRoundInput.disabled = disableConfig;
}

// Listener para Adicionar Par
if (btnAddPair) {
    btnAddPair.addEventListener("click", () => {
        const termo = termInput.value.trim();
        const definicao = definitionInput.value.trim();

        if (!termo || !definicao) {
            alert("Preencha o termo e a definição!");
            return;
        }

        currentRoundPairs.push({ termo, definicao });
        pairsCount++;

        // Atualiza display
        if (currentPairsDiv) {
            const p = document.createElement("p");
            p.innerHTML = `<strong>${termo}</strong>: ${definicao}`;
            currentPairsDiv.appendChild(p);
        }

        // Limpa inputs
        termInput.value = "";
        definitionInput.value = "";
        
        updateUIForCreation();
    });
}

// Listener para Próxima Rodada
if (btnNextRound) {
    btnNextRound.addEventListener("click", () => {
        if (currentRoundPairs.length > 0) {
            customRounds.push(currentRoundPairs);
        }
        
        currentCustomRound++;
        currentRoundPairs = [];
        pairsCount = 0;
        
        if (currentPairsDiv) currentPairsDiv.innerHTML = ""; // Limpa visualização
        
        updateUIForCreation();

        if (currentCustomRound > maxRounds) {
            // Se passou da última rodada, garante que aparece o botão Salvar
            updateUIForCreation();
        } else {
            alert(`Rodada ${currentCustomRound} iniciada. Adicione ${maxPairs} pares.`);
        }
    });
}

// Listener para Finalizar Quiz (e Iniciar Jogo)
if (btnSalvarQuiz) {
    btnSalvarQuiz.addEventListener("click", () => {
        // Garante que a última rodada seja adicionada
        if (currentRoundPairs.length > 0) {
            customRounds.push(currentRoundPairs);
            currentRoundPairs = [];
        }

        if (customRounds.length === 0) {
            alert("Você precisa criar pelo menos uma rodada para salvar o quiz!");
            return;
        }

        alert(`Quiz Customizado de ${customRounds.length} rodadas salvo e pronto para jogar!`);
        
        mostrarTela("tela-jogo");
        iniciarQuizCustomizado(customRounds);
    });
}

// Listener para Voltar do Formulário de Criação
if (btnVoltarCriar) {
    btnVoltarCriar.addEventListener("click", () => {
        mostrarTela("tela-menu");
    });
}

// --- ANIMAÇÃO DE PONTUAÇÃO (Mantida) ---
(function setupScoreAnimation() {
    const pont = document.getElementById("pontuacao");
    if (!pont) return;
    window.animatePontuacao = function() {
        pont.classList.add("animate");
        clearTimeout(pont._animTimeout);
        pont._animTimeout = setTimeout(() => pont.classList.remove("animate"), 300);
    };
})();

// --- SUPORTE A TOQUE (para celular) ---
function addTouchSupport() {
  const termos = document.querySelectorAll(".termo");
  const definicoes = document.querySelectorAll(".definicao");
  let touchedItem = null;

  termos.forEach(termo => {
    termo.addEventListener("touchstart", e => {
      touchedItem = termo;
      termo.classList.add("dragging");
    });

    termo.addEventListener("touchmove", e => {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      definicoes.forEach(def => def.classList.remove("drag-over"));
      if (target && target.classList.contains("definicao") && !target.classList.contains("matched")) {
        target.classList.add("drag-over");
      }
      e.preventDefault();
    });

    termo.addEventListener("touchend", e => {
      termo.classList.remove("dragging");
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      definicoes.forEach(def => def.classList.remove("drag-over"));

      if (target && target.classList.contains("definicao") && !target.classList.contains("matched")) {
        const definicaoAlvo = target.dataset.targetDefinicao;
        const acertou = touchedItem.dataset.definicao === definicaoAlvo;

        touchedItem.remove();
        checkAnswer(acertou, target, touchedItem.dataset.termo);
      }
      touchedItem = null;
    });
  });
}
