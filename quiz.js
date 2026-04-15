/* ============================================================
   QuizMaster — Quiz Engine
   Each question is shown on its own "page" (single screen).
   Every answer option carries a point value; the correct
   answer always has the highest value.
   ============================================================ */

const QUESTIONS = [
  {
    question: "El 'Bio' o Perfil: ¿Qué descripción te hace hacer swipe a la derecha?",
    options: [
      { text: "Busco a alguien que no se asuste con los imprevistos. Soy de esas personas que siempre tienen una anécdota ridícula que contar tras la primera cita. Soy un desastre, pero un desastre encantador.", points: 3 },
      { text: "Valoro la disciplina y el orden. Me gusta la gente con las ideas claras y que sabe lo que quiere. Si buscas estabilidad y alguien que te cuide, somos compatibles.", points: 1 },
      { text: "Un poco despistado, vivo en las nubes y a veces me pierdo en mis pensamientos. Me gusta escuchar más que hablar y busco a alguien que aprecie el silencio.", points: 5 },
      { text: "Amante de los libros, los museos y las conversaciones que duran hasta el amanecer. Si no sabes de qué hablo, probablemente no seamos el uno para el otro.", points: 2 },
      { text: "Me gusta la buena vida, el lujo y los retos. No me conformo con poco. Busco a alguien ambicioso que sepa mantener el ritmo. El misterio es mi mejor accesorio.", points: 4 },
    ],
    correctIndex: 4,
  },
  {
    question: "La Categoría: ¿Qué tipo de personalidad buscas en una cita?",
    options: [
      { text: "El 'Gafe' Adorable: Alguien auténtico, divertido y un poco desastre.", points: 2 },
      { text: "El 'Deportista/Protector': Alguien fuerte que te defienda de cualquier amenaza.", points: 4 },
      { text: "El 'Bohemio': Un espíritu libre con el que tener conversaciones profundas bajo la luna", points: 1 },
      { text: "El 'Intelectual': Alguien que siempre tiene un dato curioso o una solución lógica.", points: 3 },
      { text: "El 'Socialité': Alguien con carisma, que sepa moverse en las mejores fiestas de Kramanta.", points: 5 },
    ],
    correctIndex: 4,
  },
  {
    question: "La Green Flag: ¿Qué es lo que más te enamora?",
    options: [
      { text: "La honestidad brutal y que sepa reírse de sus propios errores.", points: 1 },
      { text: "Que sea alguien protector y que te ponga como prioridad.", points: 5 },
      { text: "Que sea detallista y que tenga una sensibilidad especial para las cosas pequeñas.", points: 2 },
      { text: "Que te defienda en una discusión con argumentos impecables.", points: 4 },
      { text: "La pasión arrolladora y que te haga sentir la persona más especial del mundo.", points: 3 },
    ],
    correctIndex: 4,
  },
  {
    question: "La Red Flag: ¿Qué defecto estarías dispuesto a perdonar por amor?",
    options: [
      { text: "Que sea una persona muy impulsiva y actúe antes de pensar.", points: 4 },
      { text: "Que sea demasiado rígido con los horarios y se moleste con el camarero si tarda más.", points: 3 },
      { text: "Que esté más pendiente del móvil o de mirar al vacío que de lo que le estás contando, como si no estuviera ahí.", points: 2 },
      { text: "Que te corrija constantemente y siempre quiera tener la última palabra.", points: 5 },
      { text: "Que tenga secretos oscuros o un pasado un poco turbio con sus exes.", points: 1 },
    ],
    correctIndex: 4,
  },
  {
    question: "La Primera Cita: ¿Cuál es el plan ideal según Iannur?",
    options: [
      { text: "Una cena improvisada que acaba en una aventura mágica por accidente.", points: 5 },
      { text: "Un entrenamiento de combate mágico seguido de una comida casera y tranquila.", points: 2 },
      { text: "Un paseo por un jardín encantado tratando de descifrar recuerdos perdidos.", points: 3 },
      { text: "Una tarde en una biblioteca antigua descubriendo mapas de mundos desconocidos.", points: 1 },
      { text: "Una mascarada de lujo con los mejores hechizos de apariencia y mucho misterio.", points: 4 },
    ],
    correctIndex: 4,
  }
];

/* ---- State ---- */
let currentIndex = 0;
let score = 0;
let selectedAnswer = null; // index of currently selected option (not yet confirmed)
let answers = [];

/* ---- DOM refs ---- */
const screenIntro = document.getElementById("screen-intro");
const screenQuiz = document.getElementById("screen-quiz");
const screenResults = document.getElementById("screen-results");

const btnStart = document.getElementById("btn-start");
const btnNext = document.getElementById("btn-next");
const btnRestart = document.getElementById("btn-restart");

const questionCounter = document.getElementById("question-counter");
const scoreLive = document.getElementById("score-live");
const progressBar = document.getElementById("progress-bar");
const questionBadge = document.getElementById("question-badge");
const questionText = document.getElementById("question-text");
const optionsGrid = document.getElementById("options-grid");
const feedbackBox = document.getElementById("feedback-box");
const feedbackIcon = document.getElementById("feedback-icon");
const feedbackText = document.getElementById("feedback-text");

const resultEmoji = document.getElementById("result-emoji");
const resultTitle = document.getElementById("result-title");
const resultSubtitle = document.getElementById("result-subtitle");
const finalScoreNum = document.getElementById("final-score-num");
const circleProgEl = document.getElementById("circle-prog");

const LETTERS = ["A", "B", "C", "D", "E"];

/* ==============================
   SCREEN TRANSITIONS
   ============================== */
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  // Small delay so the CSS transition plays from the "hidden" state
  requestAnimationFrame(() => {
    screen.classList.add("active");
  });
}

/* ==============================
   RENDER A QUESTION
   ============================== */
function renderQuestion() {
  const q = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;

  // header
  questionCounter.textContent = `Pregunta ${currentIndex + 1} de ${total}`;
  scoreLive.textContent = `Puntuación: ${score}`;
  progressBar.style.width = `${((currentIndex) / total) * 100}%`;
  questionBadge.textContent = `Q${currentIndex + 1}`;
  questionText.textContent = q.question;

  // reset
  selectedAnswer = null;
  feedbackBox.classList.add("hidden");
  feedbackBox.classList.remove("is-correct", "is-wrong");
  btnNext.classList.add("hidden");
  optionsGrid.innerHTML = "";

  // Re-trigger card animation
  const card = document.getElementById("question-card");
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";

  // build option buttons
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.id = `option-${i}`;
    btn.innerHTML = `
      <span class="opt-letter">${LETTERS[i]}</span>
      <span class="opt-text">${opt.text}</span>
      <span class="opt-points">+${opt.points} pts</span>
    `;
    btn.addEventListener("click", () => selectOption(i));
    optionsGrid.appendChild(btn);
  });
}

/* ==============================
   SELECT OPTION (visual only — can change freely)
   ============================== */
function selectOption(clickedIndex) {
  const q = QUESTIONS[currentIndex];
  const earned = q.options[clickedIndex].points;

  selectedAnswer = clickedIndex;

  // Update visual state: only highlight the selected button
  const buttons = optionsGrid.querySelectorAll(".option-btn");
  buttons.forEach((btn, i) => {
    btn.classList.remove("selected", "revealed");
    if (i === clickedIndex) {
      btn.classList.add("selected", "revealed");
    }
  });

  // Show points preview in feedback
  feedbackBox.classList.remove("hidden", "is-correct", "is-wrong");
  feedbackBox.classList.add(earned > 0 ? "is-correct" : "is-wrong");
  feedbackIcon.textContent = earned > 0 ? "⭐" : "💬";
  feedbackText.textContent = earned > 0
    ? `Esta respuesta vale +${earned} punto${earned === 1 ? "" : "s"} — confirma pulsando Siguiente`
    : `Esta respuesta vale 0 puntos — confirma pulsando Siguiente`;

  // Show the Next button
  btnNext.classList.remove("hidden");
  btnNext.textContent = currentIndex < QUESTIONS.length - 1 ? "Siguiente →" : "Ver resultados 🏆";
}

/* ==============================
   CONFIRM ANSWER (called by Next button)
   ============================== */
function confirmAnswer() {
  if (selectedAnswer === null) return;
  const q = QUESTIONS[currentIndex];
  const correct = selectedAnswer === q.correctIndex;
  const earned = q.options[selectedAnswer].points;
  const maxPoints = q.options[q.correctIndex].points;

  score += earned;
  answers.push({ questionText: q.question, earnedPoints: earned, maxPoints, correct });
  scoreLive.textContent = `Score: ${score}`;
}

/* ==============================
   NEXT / FINISH
   ============================== */
function goNext() {
  if (selectedAnswer === null) return; // nothing selected yet
  confirmAnswer();
  currentIndex++;
  if (currentIndex < QUESTIONS.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

/* ==============================
   RESULTS
   ============================== */
function showResults() {
  showScreen(screenResults);

  const maxScore = QUESTIONS.reduce((s, q) => s + q.options[q.correctIndex].points, 0);
  const pct = score / maxScore;

  // emoji + title
  if (score >= 24) { resultEmoji.textContent = "🌙"; resultTitle.textContent = "¡MATCH CON LURYA!"; }
  else if (score >= 22) { resultEmoji.textContent = "🪽"; resultTitle.textContent = "¡MATCH CON RHAEL!"; }
  else if (score >= 19) { resultEmoji.textContent = "👓"; resultTitle.textContent = "¡MATCH CON SIGMUS!"; }
  else if (score >= 16) { resultEmoji.textContent = "🐉"; resultTitle.textContent = "¡MATCH CON RINNA!"; }
  else if (score >= 14) { resultEmoji.textContent = "🎤"; resultTitle.textContent = "¡MATCH CON YIXA!"; }
  else if (score >= 11) { resultEmoji.textContent = "👻"; resultTitle.textContent = "¡MATCH CON CIARAN!"; }
  else if (score >= 8) { resultEmoji.textContent = "🔥"; resultTitle.textContent = "¡MATCH CON KERIAC!"; }
  else { resultEmoji.textContent = "🍁"; resultTitle.textContent = "¡MATCH CON AUTUMN!"; }

  resultSubtitle.textContent = `Tu puntuación es: ${score}`;

  // Show the matching character card
  const charIds = ["char-lurya", "char-rhael", "char-sigmus", "char-rinna", "char-yixa", "char-ciaran", "char-keriac", "char-autumn"];
  charIds.forEach(id => document.getElementById(id).classList.add("hidden"));

  let matchId;
  if (score >= 24) matchId = "char-lurya";
  else if (score >= 22) matchId = "char-rhael";
  else if (score >= 19) matchId = "char-sigmus";
  else if (score >= 16) matchId = "char-rinna";
  else if (score >= 14) matchId = "char-yixa";
  else if (score >= 11) matchId = "char-ciaran";
  else if (score >= 8) matchId = "char-keriac";
  else matchId = "char-autumn";

  document.getElementById(matchId).classList.remove("hidden");

  // Animated score number
  finalScoreNum.textContent = "0";
  animateCounter(finalScoreNum, score, 1200);

  // SVG circle
  const circumference = 2 * Math.PI * 52; // r=52
  const offset = 0;

  // We need an SVG gradient — inject it if missing
  let svg = document.querySelector(".circle-svg");
  if (!svg.querySelector("defs")) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.id = "grad";
    grad.innerHTML = `<stop offset="0%" stop-color="#7c5cfc"/><stop offset="100%" stop-color="#34d399"/>`;
    defs.appendChild(grad);
    svg.prepend(defs);
  }

  circleProgEl.style.strokeDasharray = circumference;
  circleProgEl.style.strokeDashoffset = circumference;
  requestAnimationFrame(() => {
    circleProgEl.style.strokeDashoffset = offset;
  });

}

/* ==============================
   ANIMATED COUNTER
   ============================== */
function animateCounter(el, target, duration) {
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(progress * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ==============================
   RESTART
   ============================== */
function restart() {
  currentIndex = 0;
  score = 0;
  answers = [];
  showScreen(screenIntro);
}

/* ==============================
   EVENT LISTENERS
   ============================== */
btnStart.addEventListener("click", () => {
  showScreen(screenQuiz);
  renderQuestion();
});

btnNext.addEventListener("click", goNext);
btnRestart.addEventListener("click", restart);
