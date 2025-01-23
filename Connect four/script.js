const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const timerDisplay = document.getElementById("timer");
const startScreen = document.querySelector(".startScreen");
const startButton = document.getElementById("start");
const message = document.getElementById("message");

let initialMatrix = Array.from({ length: 6 }, () => Array(7).fill(0));
let currentPlayer;
let timer;
let timeLeft;

const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const verifyArray = (arrayElement) =>
  arrayElement.join("").includes("1111") || arrayElement.join("").includes("2222");

const gameOverCheck = () => {
  if (initialMatrix.every((row) => row.every((val) => val !== 0))) {
    message.innerText = "Game Over";
    startScreen.classList.remove("hide");
    clearInterval(timer);
  }
};

const winCheck = (row, col) => {
  const getCol = () => initialMatrix.map((row) => row[col]);
  const getDiag = (r, c, dr, dc) => {
    const diag = [];
    for (
      let i = r, j = c;
      i >= 0 && i < 6 && j >= 0 && j < 7;
      i += dr, j += dc
    ) {
      diag.push(initialMatrix[i][j]);
    }
    return diag;
  };
  return (
    verifyArray(initialMatrix[row]) ||
    verifyArray(getCol()) ||
    verifyArray(getDiag(row, col, -1, -1)) ||
    verifyArray(getDiag(row, col, -1, 1))
  );
};

const findEmptyRow = (col) => {
  for (let row = 5; row >= 0; row--) {
    if (initialMatrix[row][col] === 0) {
      return row;
    }
  }
  return -1; 
};

const setPiece = (col, isAI = false) => {
  const row = findEmptyRow(col);
  if (row === -1) return; 
  initialMatrix[row][col] = currentPlayer;
  const box = document.querySelectorAll(".grid-row")[row].children[col];
  box.classList.add("filled", `player${currentPlayer}`);
  if (winCheck(row, col)) {
    message.innerHTML = `Player <span>${currentPlayer}</span> wins!`;
    startScreen.classList.remove("hide");
    clearInterval(timer);
    return;
  }
  gameOverCheck();
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateTurnDisplay();
  if (!isAI) startTimer();
  if (currentPlayer === 2) aiMove();
};

const aiMove = () => {
  setTimeout(() => {
    const winningMove = calculateBestMove(2); 
    const blockingMove = calculateBestMove(1); 
    const col =
      winningMove !== null
        ? winningMove
        : blockingMove !== null
        ? blockingMove
        : generateRandomNumber(0, 7); 

    if (findEmptyRow(col) !== -1) {
      setPiece(col, true);
    } else {
      aiMove();
    }
  }, 500); 
};

const calculateBestMove = (player) => {
  for (let col = 0; col < 7; col++) {
    const row = findEmptyRow(col);
    if (row !== -1) {
      initialMatrix[row][col] = player;
      const isWinningMove = winCheck(row, col);
      initialMatrix[row][col] = 0;
      if (isWinningMove) return col;
    }
  }
  return null; 
};

const startTimer = () => {
  clearInterval(timer);
  timeLeft = 10;
  timerDisplay.textContent = `Time Left: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = `Time Left: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      updateTurnDisplay();
      if (currentPlayer === 2) aiMove();
      else startTimer();
    }
  }, 1000);
};

const updateTurnDisplay = () => {
  playerTurn.innerHTML = `Player <span>${currentPlayer}</span>'s turn`;
};

startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  currentPlayer = 1;
  updateTurnDisplay();
  initialMatrix = Array.from({ length: 6 }, () => Array(7).fill(0));
  container.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.classList.add("grid-row");
    for (let j = 0; j < 7; j++) {
      const box = document.createElement("div");
      box.classList.add("grid-box");
      box.addEventListener("click", () => {
        if (currentPlayer === 1) setPiece(j);
      });
      row.appendChild(box);
    }
    container.appendChild(row);
  }
  startTimer();
});
