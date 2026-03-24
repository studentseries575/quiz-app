let questions = [
  {
    q: "Which JS keyword declares a block-scoped variable?",
    options: ["var", "let", "const", "all of these"],
    answer: "let"
  },
  {
    q: "Which HTML tag is used to link CSS?",
    options: ["style", "link", "css", "script"],
    answer: "link"
  },
  {
    q: "Which method removes last element of array?",
    options: ["pop()", "push()", "shift()", "slice()"],
    answer: "pop()"
  },
  {
    q: "Which JS method adds element to end?",
    options: ["push()", "pop()", "shift()", "map()"],
    answer: "push()"
  },
  {
    q: "Which CSS property changes text color?",
    options: ["color", "font", "background", "size"],
    answer: "color"
  }
];

let current = 0;
let score = 0;
let answers = [];
let time = 10;
let timer;

function startQuiz() {
  // shuffle questions
  questions.sort(() => Math.random() - 0.5);

  document.getElementById("startScreen").classList.add("d-none");
  document.getElementById("quizBox").classList.remove("d-none");

  createProgress();
  loadQ();
}

function createProgress() {
  let html = "";
  for (let i = 0; i < questions.length; i++) {
    html += `<div class="progress-segment" id="seg${i}"></div>`;
  }
  document.getElementById("progressContainer").innerHTML = html;
}

function loadQ() {
  clearInterval(timer);

  let q = questions[current];

  document.getElementById("qNo").innerText = current + 1;
  document.getElementById("question").innerText = q.q;

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.innerText = opt;

    btn.onclick = function () {
      selectAns(btn, opt);
    };

    optionsDiv.appendChild(btn);
  });

  // reset colors
  document.querySelectorAll("#options button").forEach(btn => {
    btn.classList.remove("correct", "wrong");
  });

  let saved = answers[current];
  if (saved) {
    document.querySelectorAll("#options button").forEach(btn => {
      if (btn.innerText === saved.selected) {
        btn.classList.add("active");
      }
    });
  }

  startTimer();
}

function selectAns(btn, val) {
  document.querySelectorAll("#options button").forEach(b => {
    b.classList.remove("active");
  });

  btn.classList.add("active");

  answers[current] = {
    question: questions[current].q,
    selected: val,
    correct: questions[current].answer,
    checked: false
  };
}

function nextQ() {
  clearInterval(timer);

  let saved = answers[current];
  let correct = questions[current].answer;

  if (!saved) {
    answers[current] = {
      question: questions[current].q,
      selected: "Not Answered",
      correct: correct,
      checked: false
    };
    saved = answers[current];
  }

  let buttons = document.querySelectorAll("#options button");

  buttons.forEach(btn => {
    let text = btn.innerText;

    if (text === correct) btn.classList.add("correct");
    if (text === saved.selected && saved.selected !== correct) {
      btn.classList.add("wrong");
    }
  });

  // FIXED SCORE BUG
  if (!saved.checked) {
    if (saved.selected === correct) {
      score++;
      document.getElementById(`seg${current}`).classList.add("correct");
    } else {
      document.getElementById(`seg${current}`).classList.add("wrong");
    }
    saved.checked = true;
  }

  setTimeout(() => {
    current++;
    if (current < questions.length) {
      loadQ();
    } else {
      showResult();
    }
  }, 1200);
}

function prevQ() {
  if (current > 0) {
    clearInterval(timer);
    current--;
    loadQ();
  }
}

function startTimer() {
  time = 10;

  timer = setInterval(() => {
    document.getElementById("time").innerText = time + "s";

    if (time <= 3) {
      document.getElementById("time").style.color = "red";
    }

    time--;

    if (time < 0) {
      nextQ();
    }
  }, 1000);
}

function showResult() {
  document.getElementById("quizBox").classList.add("d-none");
  let box = document.getElementById("resultBox");
  box.classList.remove("d-none");

  let msg = score >= 4 ? "Excellent 🎉" : score >= 2 ? "Good 👍" : "Try Again 😅";

  let table = "";

  answers.forEach((a, i) => {
    let status = a.selected === a.correct ? "✅" : "❌";

    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${a.question}</td>
        <td>${a.selected}</td>
        <td>${a.correct}</td>
        <td>${status}</td>
      </tr>
    `;
  });

  box.innerHTML = `
    <div class="glass p-4 text-center">
      <h2>🎉 Quiz Completed!</h2>
      <h3>Score: ${score}/${questions.length}</h3>
      <h4>${msg}</h4>

      <table class="table table-dark table-bordered mt-3">
        <tr>
          <th>#</th>
          <th>Question</th>
          <th>Your Answer</th>
          <th>Correct</th>
          <th>Status</th>
        </tr>
        ${table}
      </table>

      <button class="btn btn-warning mt-2" onclick="restartQuiz()">Restart</button>
      <button class="btn btn-success mt-2" onclick="downloadPDF()">Download PDF</button>
    </div>
  `;
}

function downloadPDF() {
  let buttons = document.querySelectorAll(".btn");

  buttons.forEach(btn => btn.style.display = "none");

  let element = document.getElementById("resultBox");

  html2pdf().from(element).save().then(() => {
    buttons.forEach(btn => btn.style.display = "inline-block");
  });
}

function restartQuiz() {
  current = 0;
  score = 0;
  answers = [];

  document.getElementById("resultBox").classList.add("d-none");
  document.getElementById("quizBox").classList.add("d-none");
  document.getElementById("startScreen").classList.remove("d-none");

  document.getElementById("progressContainer").innerHTML = "";
}

function toggleMode() {
  document.body.classList.toggle("light-mode");
}