
const defaultRounds = [
  [
    { term: "HTML", definition: "Linguagem de marcação utilizada para estruturar páginas web" },
    { term: "CSS", definition: "Linguagem utilizada para estilizar elementos escritos em HTML" },
    { term: "JavaScript", definition: "Linguagem de programação que permite implementar funcionalidades dinâmicas" }
  ],
  [
    { term: "Front-end", definition: "Parte do desenvolvimento responsável pela interface e interação com o usuário" },
    { term: "Back-end", definition: "Parte do sistema que lida com o servidor, banco de dados e regras de negócio" },
    { term: "Responsividade", definition: "Capacidade de um site se adaptar a diferentes tamanhos de tela e dispositivos" }
  ],
  [
    { term: "classList", definition: "Propriedade usada para adicionar, remover ou alternar classes CSS em um elemento" },
    { term: "innerHTML", definition: "Propriedade que permite acessar ou modificar o conteúdo HTML de um elemento" },
    { term: "DOM", definition: "Interface que representa a estrutura de um documento HTML como uma árvore de objetos" }
  ],
  [
    { term: "Layout", definition: "Organização visual dos elementos de uma página web" },
    { term: "CSS", definition: "Linguagem usada para estilizar e formatar elementos HTML" },
    { term: "Element", definition: "Objeto do DOM que representa um componente HTML na página" }
  ],
  [
    { term: "JavaScript", definition: "Linguagem de programação usada para criar interatividade e dinamismo nas páginas web" },
    { term: "Evento", definition: "Ação detectada pelo navegador, como um clique ou digitação" },
    { term: "Função", definition: "Bloco de código que executa uma tarefa específica quando chamado" }
  ]
];

let rounds = [...defaultRounds]; // Cópia do quiz padrão
let questions = [...rounds[0]]; // Inicializa com as questões da primeira rodada
let currentQuestion = 0;
let currentRound = 1;
window.totalRounds = 5; // Número total de rodadas padrão

const customQuizzes = [];

let score = 0;
const pontuacaoEl = document.getElementById('pontuacao');
const pontuacaoFinalEl = document.getElementById('pontuacao-final');
const rodadaNumEl = document.getElementById('rodada-num');
const rodadasTotalEl = document.getElementById('rodadas-total');
const progressBar = document.getElementById('progress-bar');

// Atualiza o display das rodadas
if (rodadaNumEl) rodadaNumEl.textContent = String(currentRound);
if (rodadasTotalEl) rodadasTotalEl.textContent = String(totalRounds);
const telaFinal = document.getElementById('tela-final');

const questionEl = document.getElementById("question");
const dropZone = document.getElementById("drop-zone");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");

const btnIniciar = document.getElementById('btn-iniciar');
const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const btnReiniciar = document.getElementById('btn-reiniciar');
 
if (btnIniciar) {
  btnIniciar.addEventListener('click', () => {
    if (telaInicial) telaInicial.classList.remove('ativa');
    if (telaJogo) telaJogo.classList.add('ativa');
    currentQuestion = 0;
    currentRound = 1;
    score = 0;
    rounds = [...defaultRounds]; // Reseta para o quiz padrão
    window.totalRounds = 5; // Reseta para o número padrão de rodadas
    questions = [...rounds[0]]; // Carrega as questões da primeira rodada
    if (rodadaNumEl) rodadaNumEl.textContent = String(currentRound);
    if (rodadasTotalEl) rodadasTotalEl.textContent = String(window.totalRounds);
    if (progressBar) progressBar.style.width = '0%';
    loadQuestion();
  });
}


if (btnReiniciar) {
  btnReiniciar.addEventListener('click', () => {
    if (telaJogo) telaJogo.classList.remove('ativa');
    if (telaFinal) telaFinal.classList.remove('ativa');
    if (telaInicial) telaInicial.classList.add('ativa');
    
    currentQuestion = 0;
    currentRound = 1;
    score = 0;
    rounds = [...defaultRounds]; // Reseta para o quiz padrão
    window.totalRounds = 5; // Reseta para o número padrão de rodadas
    questions = [...rounds[0]]; // Reseta para as questões da primeira rodada
    if (pontuacaoEl) pontuacaoEl.textContent = String(score);
    if (pontuacaoFinalEl) pontuacaoFinalEl.textContent = String(score);
    if (feedbackEl) feedbackEl.textContent = '';
    if (rodadaNumEl) rodadaNumEl.textContent = String(currentRound);
    if (rodadasTotalEl) rodadasTotalEl.textContent = String(window.totalRounds);
    if (progressBar) progressBar.style.width = '0%';
  });
}

function loadQuestion() {
  // Atualiza a pontuação na tela
  if (pontuacaoEl) pontuacaoEl.textContent = String(score);
  
  // Limpa feedback
  if (feedbackEl) feedbackEl.textContent = "";

  // Obtém as listas
  const listaTermos = document.getElementById('lista-termos');
  const listaDefinicoes = document.getElementById('lista-definicoes');
  
  // Limpa as listas
  listaTermos.innerHTML = "";
  listaDefinicoes.innerHTML = "";

  // Cria elementos para cada termo
  questions.forEach((q, index) => {
    // Cria o termo
    const termItem = document.createElement('li');
    termItem.className = 'termo';
    termItem.textContent = q.term;
    termItem.setAttribute('data-term-index', index);
    
    // Adiciona eventos de drag and drop
    termItem.addEventListener('dragover', handleDragOver);
    termItem.addEventListener('dragleave', handleDragLeave);
    termItem.addEventListener('drop', handleDrop);
    
    listaTermos.appendChild(termItem);
  });

  // Cria e embaralha as definições
  const definicoes = questions.map(q => q.definition);
  shuffleArray(definicoes);
  
  // Adiciona as definições embaralhadas
  definicoes.forEach(definicao => {
    const defItem = document.createElement('li');
    defItem.className = 'definicao';
    defItem.textContent = definicao;
    defItem.draggable = true;
    defItem.addEventListener('dragstart', dragStart);
    defItem.addEventListener('dragend', (e) => {
      e.currentTarget.classList.remove('dragging');
    });
    
    listaDefinicoes.appendChild(defItem);
  });
}

// Função para embaralhar array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function handleDragOver(event) {
  event.preventDefault();
  if (!event.currentTarget.classList.contains('correct')) {
    event.currentTarget.classList.add('drag-over');
  }
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  const termo = event.currentTarget;
  termo.classList.remove('drag-over');
  
  // Não permite soltar se já estiver correto
  if (termo.classList.contains('correct')) {
    return;
  }
  
  const termIndex = parseInt(termo.getAttribute('data-term-index'));
  const definicao = event.dataTransfer.getData('text');
  
  if (definicao === questions[termIndex].definition) {
    termo.classList.add('correct');
    score++;
    if (pontuacaoEl) pontuacaoEl.textContent = String(score);
    if (feedbackEl) {
      feedbackEl.textContent = "✅ Correlação correta!";
      feedbackEl.className = "feedback correct";
    }
    // remove a definição usada para evitar reutilização
    const defs = document.querySelectorAll('.definicao');
    for (const d of defs) {
      if (d.textContent === definicao) {
        d.parentNode.removeChild(d);
        break;
      }
    }
  } else {
    termo.classList.add('incorrect');
    if (feedbackEl) {
      feedbackEl.textContent = "❌ Tente novamente!";
      feedbackEl.className = "feedback incorrect";
    }
    // Remove a classe incorrect após um tempo
    setTimeout(() => {
      termo.classList.remove('incorrect');
    }, 1000);
  }
  
  // Verifica se todos os termos foram correlacionados corretamente
  const allTerms = document.querySelectorAll('.termo');
  const allCorrect = Array.from(allTerms).every(term => 
    term.classList.contains('correct')
  );
  
  if (allCorrect) {
    if (currentRound < window.totalRounds) {
      setTimeout(() => {
        currentRound++;
        if (rodadaNumEl) rodadaNumEl.textContent = String(currentRound);
        
        // Carrega as questões da próxima rodada
        if (rounds && rounds[currentRound - 1]) {
          questions = [...rounds[currentRound - 1]];
        }
        
        // Atualiza a barra de progresso se existir
        if (progressBar) {
          progressBar.style.width = `${(currentRound / window.totalRounds) * 100}%`;
        }
        
        // Carrega a próxima rodada
        loadQuestion();
      }, 1000);
    } else {
      setTimeout(endQuiz, 1000);
    }
  }
}

function dragStart(event) {
  event.dataTransfer.setData("text", event.target.textContent);
  event.target.classList.add('dragging');
}

function endQuiz() {
  
  if (pontuacaoFinalEl) pontuacaoFinalEl.textContent = String(score);
  
  if (telaJogo) telaJogo.classList.remove('ativa');
  if (telaFinal) telaFinal.classList.add('ativa');
  
  questionEl.textContent = "Quiz finalizado!";
  dropZone.textContent = "";
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "Parabéns por completar o quiz!";
}

const btnCriarQuiz = document.getElementById('btn-criar-quiz');
const telaCriarQuiz = document.getElementById('tela-criar-quiz');
const btnAddPair = document.getElementById('btn-add-pair');
const btnSalvarQuiz = document.getElementById('btn-salvar-quiz');
const btnVoltar = document.getElementById('btn-voltar');
const formCriarQuiz = document.getElementById('form-criar-quiz');
const currentPairsEl = document.getElementById('current-pairs');

let currentQuizQuestions = [];
let currentQuizRounds = [];
let currentCreateRound = 1;
let userTotalRounds = 3;
let userPairsPerRound = 3;

const numRoundsInput = document.getElementById('num-rounds');
const pairsPerRoundInput = document.getElementById('pairs-per-round');
const roundIndicator = document.getElementById('round-indicator');
const btnNextRound = document.getElementById('btn-next-round');

btnCriarQuiz.addEventListener('click', () => {
  document.querySelector('.tela.ativa').classList.remove('ativa');
  telaCriarQuiz.classList.add('ativa');
  resetQuizForm();
  updateRoundDisplay();
});

btnVoltar.addEventListener('click', () => {
  if (confirm('Tem certeza? Todo o progresso será perdido.')) {
    telaCriarQuiz.classList.remove('ativa');
    document.getElementById('tela-inicial').classList.add('ativa');
    resetQuizForm();
  }
});

// Atualiza as variáveis quando o usuário muda os valores
numRoundsInput.addEventListener('change', () => {
  userTotalRounds = parseInt(numRoundsInput.value);
  updateRoundDisplay();
});

pairsPerRoundInput.addEventListener('change', () => {
  userPairsPerRound = parseInt(pairsPerRoundInput.value);
  updateRoundDisplay();
});

function updateRoundDisplay() {
  if (roundIndicator) {
    roundIndicator.textContent = `Rodada ${currentCreateRound} de ${userTotalRounds}`;
  }
  
  // Mostra/esconde botões baseado no progresso
  if (btnNextRound && btnSalvarQuiz) {
    if (currentQuizQuestions.length === userPairsPerRound) {
      btnAddPair.style.display = 'none';
      if (currentCreateRound < userTotalRounds) {
        btnNextRound.style.display = 'inline-block';
        btnSalvarQuiz.style.display = 'none';
      } else {
        btnNextRound.style.display = 'none';
        btnSalvarQuiz.style.display = 'inline-block';
      }
    } else {
      btnAddPair.style.display = 'inline-block';
      btnNextRound.style.display = 'none';
      btnSalvarQuiz.style.display = 'none';
    }
  }
}

if (btnAddPair) {
  btnAddPair.addEventListener('click', () => {
    const termInput = document.querySelector('.term-input');
    const defInput = document.querySelector('.definition-input');
    if (!termInput || !defInput) return;
    if (!termInput.value || !defInput.value) {
      alert('Por favor, preencha termo e definição!');
      return;
    }
    if (currentQuizQuestions.length >= userPairsPerRound) {
      alert(`Máximo de ${userPairsPerRound} pares por rodada atingido!`);
      return;
    }
    const pair = { term: termInput.value.trim(), definition: defInput.value.trim() };
    currentQuizQuestions.push(pair);
    renderCurrentPairs();
    termInput.value = '';
    defInput.value = '';
    updateRoundDisplay();
  });
}

if (btnNextRound) {
  btnNextRound.addEventListener('click', () => {
    if (currentQuizQuestions.length !== userPairsPerRound) {
      alert(`Por favor, adicione exatamente ${userPairsPerRound} pares para esta rodada!`);
      return;
    }
    
    // Salva as questões da rodada atual
    currentQuizRounds.push([...currentQuizQuestions]);
    currentQuizQuestions = [];
    currentCreateRound++;
    
    // Limpa o formulário para a próxima rodada
    renderCurrentPairs();
    updateRoundDisplay();
  });
}

btnSalvarQuiz.addEventListener('click', () => {
  if (currentQuizQuestions.length !== userPairsPerRound) {
    alert(`Por favor, adicione exatamente ${userPairsPerRound} pares para esta rodada!`);
    return;
  }
  
  // Adiciona a última rodada
  currentQuizRounds.push([...currentQuizQuestions]);
  
  // Cria uma cópia independente das rodadas
  let customRounds = currentQuizRounds.map(round => [...round]);
  
  // Configura as variáveis globais
  rounds = customRounds;
  questions = [...customRounds[0]];
  
  // Atualiza o número total de rodadas
  window.totalRounds = userTotalRounds;
  
  // Reseta o estado
  currentQuizQuestions = [];
  currentQuizRounds = [];
  currentCreateRound = 1;
  currentRound = 1;
  score = 0;
  
  // Limpa e atualiza a interface
  if (currentPairsEl) currentPairsEl.innerHTML = '';
  if (rodadaNumEl) rodadaNumEl.textContent = '1';
  if (rodadasTotalEl) rodadasTotalEl.textContent = String(userTotalRounds);
  if (progressBar) progressBar.style.width = '0%';
  if (pontuacaoEl) pontuacaoEl.textContent = '0';
  
  // Muda para a tela de jogo
  telaCriarQuiz.classList.remove('ativa');
  document.getElementById('tela-jogo').classList.add('ativa');
  
  // Inicia o quiz
  loadQuestion();
});

function renderCurrentPairs() {
  if (!currentPairsEl) return;
  currentPairsEl.innerHTML = '';
  currentQuizQuestions.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'pair-item';
    div.innerHTML = `<span class="pair-term">${p.term}</span> — <span class="pair-def">${p.definition}</span> <button class="btn small" data-index="${i}">Remover</button>`;
    currentPairsEl.appendChild(div);
  });
  // adiciona listeners de remover
  currentPairsEl.querySelectorAll('button[data-index]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      currentQuizQuestions.splice(idx, 1);
      renderCurrentPairs();
    });
  });
}

function resetQuizForm() {
  const termInput = document.querySelector('.term-input');
  const defInput = document.querySelector('.definition-input');
  if (termInput) termInput.value = '';
  if (defInput) defInput.value = '';
  if (currentPairsEl) currentPairsEl.innerHTML = '';
  if (numRoundsInput) numRoundsInput.value = '3';
  if (pairsPerRoundInput) pairsPerRoundInput.value = '3';
  
  currentQuizQuestions = [];
  currentQuizRounds = [];
  currentCreateRound = 1;
  userTotalRounds = 3;
  userPairsPerRound = 3;
  
  updateRoundDisplay();
}

loadQuestion();
