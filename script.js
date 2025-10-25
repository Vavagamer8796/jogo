const defaultQuestions = [
  {
    question: "Qual é a capital do Brasil?",
    options: ["São Paulo", "Brasília", "Rio de Janeiro"],
    answer: "Brasília"
  },
  {
    question: "Quanto é 5 + 3?",
    options: ["6", "8", "9"],
    answer: "8"
  },
  {
    question: "Qual é o maior planeta do Sistema Solar?",
    options: ["Terra", "Júpiter", "Marte"],
    answer: "Júpiter"
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
  const q = questions[currentQuestion];
  
  if (rodadaNumEl) rodadaNumEl.textContent = String(currentQuestion + 1);
  if (rodadasTotalEl) rodadasTotalEl.textContent = String(questions.length);
  if (progressBar) progressBar.style.width = `${Math.round(((currentQuestion) / questions.length) * 100)}%`;

  
  if (currentQuestion === 0) {
    score = 0;
    if (pontuacaoEl) pontuacaoEl.textContent = String(score);
  }

  questionEl.textContent = q.question;
  dropZone.textContent = "Arraste a resposta aqui";
  feedbackEl.textContent = "";
  dropZone.classList.remove("correct", "incorrect");

  optionsEl.innerHTML = "";
  q.options.forEach(option => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.textContent = option;
    div.draggable = true;

    div.addEventListener("dragstart", dragStart);
    optionsEl.appendChild(div);
  });
}

function dragStart(event) {
  event.dataTransfer.setData("text", event.target.textContent);
}

dropZone.addEventListener("dragover", event => {
  event.preventDefault();
  dropZone.style.borderColor = "#00ff88";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.borderColor = "#fff";
});

dropZone.addEventListener("drop", event => {
  event.preventDefault();
  dropZone.style.borderColor = "#fff";

  const selected = event.dataTransfer.getData("text");
  const q = questions[currentQuestion];

  if (selected === q.answer) {
    dropZone.textContent = selected;
    feedbackEl.textContent = "✅ Resposta correta!";
    feedbackEl.className = "feedback correct";
    // atualiza pontuação
    score++;
    if (pontuacaoEl) pontuacaoEl.textContent = String(score);
  } else {
    dropZone.textContent = selected;
    feedbackEl.textContent = "❌ Resposta errada!";
    feedbackEl.className = "feedback incorrect";
  }

  
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      endQuiz();
    }
  }, 1000);
});

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