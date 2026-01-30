/* =========================================================
   DAILY UPSC QUIZ – KBC MODE (FINAL)
   ========================================================= */

const QUIZ_API =
  "https://opentdb.com/api.php?amount=10&difficulty=hard&type=multiple";

const QUIZ_CACHE_KEY = "upsc_daily_quiz";
const QUIZ_TIME_KEY = "upsc_quiz_time";
const ONE_DAY = 24 * 60 * 60 * 1000;

const TIME_PER_Q = 30;

/* ---------- STATE ---------- */
let quiz = [];
let index = 0;
let score = 0;
let selected = null;
let timer = TIME_PER_Q;
let timerInterval = null;
let bestStreak = 0;
let currentStreak = 0;

/* =========================================================
   RENDER QUIZ PAGE
   ========================================================= */
function loadQuizPage() {
  const content = document.getElementById("content");

  content.innerHTML = `
    ${backButton()}

    <h1>🎯 Daily UPSC Quiz</h1>

    <div id="quiz-container" class="quiz-container">
      <h2 id="quiz-question">Loading quiz...</h2>
      <div id="quiz-options"></div>
      <p id="quiz-feedback" class="quiz-feedback"></p>
      <button id="lock-answer">🔒 Lock Answer</button>
    </div>

    <div id="quiz-summary" class="hidden">
      <h2>📊 Quiz Summary</h2>
      <div id="quiz-result"></div>
      <button id="retry-quiz">Retry</button>
      <button id="refresh-quiz-btn">New Quiz</button>
    </div>
  `;

  bindQuizDOM();
  fetchQuiz();
}

/* ---------- DOM BIND ---------- */
let qContainer, qQuestion, qOptions, qFeedback, qLockBtn;
let qSummary, qResult, qRetry, qRefresh;

function bindQuizDOM() {
  qContainer = document.getElementById("quiz-container");
  qQuestion = document.getElementById("quiz-question");
  qOptions = document.getElementById("quiz-options");
  qFeedback = document.getElementById("quiz-feedback");
  qLockBtn = document.getElementById("lock-answer");

  qSummary = document.getElementById("quiz-summary");
  qResult = document.getElementById("quiz-result");
  qRetry = document.getElementById("retry-quiz");
  qRefresh = document.getElementById("refresh-quiz-btn");

  qLockBtn.onclick = () => lockAnswer(false);
  qRetry.onclick = startQuiz;
  qRefresh.onclick = () => fetchQuiz(true);
}

/* =========================================================
   FETCH QUIZ
   ========================================================= */
async function fetchQuiz(force = false) {
  const now = Date.now();
  const lastFetch = localStorage.getItem(QUIZ_TIME_KEY);
  const cached = localStorage.getItem(QUIZ_CACHE_KEY);

  if (!force && cached && lastFetch && now - lastFetch < ONE_DAY) {
    quiz = JSON.parse(cached);
    startQuiz();
    return;
  }

  qQuestion.textContent = "Loading quiz…";
  qOptions.innerHTML = "";

  try {
    const res = await fetch(QUIZ_API);
    const data = await res.json();

    quiz = data.results.map(q => ({
      question: decode(q.question),
      options: shuffle([
        ...q.incorrect_answers.map(decode),
        decode(q.correct_answer)
      ]),
      answer: decode(q.correct_answer)
    }));

    localStorage.setItem(QUIZ_CACHE_KEY, JSON.stringify(quiz));
    localStorage.setItem(QUIZ_TIME_KEY, now.toString());

    startQuiz();
  } catch {
    qQuestion.textContent = "⚠️ Unable to load quiz.";
  }
}

/* =========================================================
   QUIZ FLOW
   ========================================================= */
function startQuiz() {
  index = 0;
  score = 0;
  currentStreak = 0;
  bestStreak = 0;
  selected = null;

  qSummary.classList.add("hidden");
  qContainer.style.display = "block";

  showQuestion();
}

function showQuestion() {
  clearInterval(timerInterval);
  timer = TIME_PER_Q;
  selected = null;

  qFeedback.textContent = "";
  qFeedback.className = "quiz-feedback";

  const q = quiz[index];
  qQuestion.textContent = `Q${index + 1}/10: ${q.question}`;
  qOptions.innerHTML = "";

  const labels = ["A", "B", "C", "D"];

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "quiz-option";
    div.innerHTML = `<strong>${labels[i]}.</strong> ${opt}`;
    div.onclick = () => selectOption(div, opt);
    qOptions.appendChild(div);
  });

  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
    qLockBtn.innerText = `🔒 Lock Answer (${timer}s)`;

    if (timer <= 5) qLockBtn.classList.add("warning");

    if (timer === 0) {
      clearInterval(timerInterval);
      lockAnswer(true);
    }
  }, 1000);
}

function selectOption(el, value) {
  document.querySelectorAll(".quiz-option")
    .forEach(o => o.classList.remove("selected"));

  el.classList.add("selected");
  selected = value;
}

function lockAnswer(timeout) {
  clearInterval(timerInterval);
  qLockBtn.innerText = "🔒 Lock Answer";

  if (!selected && !timeout) {
    qFeedback.textContent = "Please select an option.";
    return;
  }

  const correct = quiz[index].answer;

  if (!timeout && selected === correct) {
    score++;
    currentStreak++;
    bestStreak = Math.max(bestStreak, currentStreak);
    qFeedback.textContent = "✅ Correct!";
    qFeedback.classList.add("correct");
  } else {
    currentStreak = 0;
    qFeedback.textContent = `❌ Correct answer: ${correct}`;
    qFeedback.classList.add("wrong");
  }

  index++;

  setTimeout(() => {
    if (index < quiz.length) showQuestion();
    else finishQuiz();
  }, 1200);
}

/* =========================================================
   FINISH
   ========================================================= */
function finishQuiz() {
  qContainer.style.display = "none";
  qSummary.classList.remove("hidden");

  const accuracy = ((score / quiz.length) * 100).toFixed(1);

  qResult.innerHTML = `
    <p>🏆 Final Score: <strong>${score}/10</strong></p>
    <p>🔥 Best Streak: <strong>${bestStreak}</strong></p>
    <p>📊 Accuracy: <strong>${accuracy}%</strong></p>
  `;
}

/* ---------- UTILS ---------- */
function decode(str) {
  const t = document.createElement("textarea");
  t.innerHTML = str;
  return t.value;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
