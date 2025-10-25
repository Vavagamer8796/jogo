
const defaultQuestions = [
  {
    term: "HTML",
    definition: "Linguagem de marcação utilizada para estruturar páginas web"
  },
  {
    term: "CSS",
    definition: "Linguagem utilizada para estilizar elementos escritos em HTML"
  },
  {
    term: "JavaScript",
    definition: "Linguagem de programação que permite implementar funcionalidades dinâmicas"
  },
  {
    term: "DOM",
    definition: "Interface de programação que representa documentos HTML como uma árvore de objetos"
  }
];

let questions = [...defaultQuestions];

const customQuizzes = [];

let currentQuestion = 0;

let score = 0;
const pontuacaoEl = document.getElementById('pontuacao');
const pontuacaoFinalEl = document.getElementById('pontuacao-final');
const rodadaNumEl = document.getElementById('rodada-num');
const rodadasTotalEl = document.getElementById('rodadas-total');
const progressBar = document.getElementById('progress-bar');
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
    if (!questions || questions.length === 0) questions = [...defaultQuestions];
    loadQuestion();
  });
}


if (btnReiniciar) {
  btnReiniciar.addEventListener('click', () => {
    
    if (telaJogo) telaJogo.classList.remove('ativa');
    if (telaFinal) telaFinal.classList.remove('ativa');
    if (telaInicial) telaInicial.classList.add('ativa');
    
    questions = [...defaultQuestions];
    currentQuestion = 0;
    score = 0;
    if (pontuacaoEl) pontuacaoEl.textContent = String(score);
    if (pontuacaoFinalEl) pontuacaoFinalEl.textContent = String(score);
    if (feedbackEl) feedbackEl.textContent = '';
  });
}

function loadQuestion() {
  // Reseta pontuação no início
  score = 0;
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
    setTimeout(endQuiz, 1000);
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
const btnAddQuestion = document.getElementById('btn-add-question');
const btnSalvarQuiz = document.getElementById('btn-salvar-quiz');
const btnVoltar = document.getElementById('btn-voltar');
const formCriarQuiz = document.getElementById('form-criar-quiz');

let currentQuizQuestions = [];

btnCriarQuiz.addEventListener('click', () => {
  document.querySelector('.tela.ativa').classList.remove('ativa');
  telaCriarQuiz.classList.add('ativa');
  resetQuizForm();
});

btnVoltar.addEventListener('click', () => {
  telaCriarQuiz.classList.remove('ativa');
  document.getElementById('tela-inicial').classList.add('ativa');
});

btnAddQuestion.addEventListener('click', () => {
  const questionInput = document.querySelector('.question-input');
  const optionInputs = document.querySelectorAll('.option-input');
  const answerSelect = document.querySelector('.answer-select');
  
  if (!questionInput.value || [...optionInputs].some(input => !input.value)) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const question = {
    question: questionInput.value,
    options: [...optionInputs].map(input => input.value),
    answer: answerSelect.value
  };

  currentQuizQuestions.push(question);
  resetQuizForm();
  alert('Pergunta adicionada com sucesso!');
});

btnSalvarQuiz.addEventListener('click', () => {
  if (currentQuizQuestions.length === 0) {
    alert('Adicione pelo menos uma pergunta ao quiz!');
    return;
  }

  customQuizzes.push([...currentQuizQuestions]);
  questions = currentQuizQuestions;
  currentQuizQuestions = [];
  
  telaCriarQuiz.classList.remove('ativa');
  document.getElementById('tela-jogo').classList.add('ativa');
  currentQuestion = 0;
  loadQuestion();
});

function resetQuizForm() {
  const questionInput = document.querySelector('.question-input');
  const optionInputs = document.querySelectorAll('.option-input');
  const answerSelect = document.querySelector('.answer-select');

  questionInput.value = '';
  optionInputs.forEach(input => input.value = '');
  
  answerSelect.innerHTML = '<option value="">Selecione a resposta correta</option>';
  optionInputs.forEach((input, index) => {
    if (input.value) {
      const option = document.createElement('option');
      option.value = input.value;
      option.textContent = input.value;
      answerSelect.appendChild(option);
    }
  });
}

document.querySelectorAll('.option-input').forEach(input => {
  input.addEventListener('input', () => {
    const answerSelect = document.querySelector('.answer-select');
    answerSelect.innerHTML = '<option value="">Selecione a resposta correta</option>';
    
    document.querySelectorAll('.option-input').forEach(input => {
      if (input.value) {
        const option = document.createElement('option');
        option.value = input.value;
        option.textContent = input.value;
        answerSelect.appendChild(option);
      }
    });
  });
});

loadQuestion();
