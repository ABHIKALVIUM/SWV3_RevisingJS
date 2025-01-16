const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");
const scoreBoard = document.getElementById("score");
const highScoreBoard = document.getElementById("highScore");
const timeLeftBoard = document.getElementById("timeLeft");
const modeBoard = document.getElementById("mode");
const modeSelect = document.getElementById("modeSelect");
const startButton = document.getElementById("startButton");

let lastHole;
let timeUp = false;
let score = 0;
let highScore = 0;
let timeLeft = 30;
let mode = "easy";
let peepTime = 1000;
let gameTimer;
let moleTimer;

const moleImages = [
  "./image/mole1.png",
  "./image/mole2.png",
  "./image/mole3.png",
  "./image/mole.jpg",
];

let selectedImage = ""; 

function setPeepTime(mode) {
  switch (mode) {
    case "easy":
      return 1000;
    case "medium":
      return 800;
    case "hard":
      return 600;
    default:
      return 1000;
  }
}

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function peep() {
  const time = randomTime(peepTime - 300, peepTime);
  const hole = randomHole(holes);
  const mole = hole.querySelector(".mole");

  mole.style.backgroundImage = `url(${selectedImage})`;
  mole.classList.add("up");
  moleTimer = setTimeout(() => {
    mole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  clearInterval(gameTimer);
  clearTimeout(moleTimer);
  scoreBoard.textContent = 0;
  timeLeftBoard.textContent = 30;
  modeBoard.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
  score = 0;
  timeLeft = 30;
  peepTime = setPeepTime(mode);
  timeUp = false;

  selectedImage = moleImages[Math.floor(Math.random() * moleImages.length)];

  peep();
  gameTimer = setInterval(() => {
    timeLeft--;
    timeLeftBoard.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      timeUp = true;
      updateHighScore();
      alert("Game Over! Your score is " + score);
    }
  }, 1000);
}

function bonk(e) {
  if (!e.isTrusted) return; 
  score++;
  this.classList.remove("up");
  scoreBoard.textContent = score;
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    highScoreBoard.textContent = highScore;
  }
}

moles.forEach((mole) => mole.addEventListener("click", bonk));
startButton.addEventListener("click", startGame);
modeSelect.addEventListener("change", (e) => {
  mode = e.target.value;
});
