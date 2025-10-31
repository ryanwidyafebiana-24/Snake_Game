const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");

const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
let food = { x: 5, y: 5 };
let direction = 'right';
let score = 0;
let gamerunning = false;
let gameInterval;

function draw() {
  ctx.fillStyle = "rgb(162, 87, 162)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(95, 50, 95, 1)";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  ctx.fillStyle = "rgba(189, 30, 30, 1)";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
  if (!gamerunning) return;

  const head = { ...snake[0] };

  if (direction == 'up') head.y--;
  if (direction == 'down') head.y++;
  if (direction == 'left') head.x--;
  if (direction == 'right') head.x++;

  // Tabrak tembok
  if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
    endGame();
    return;
  }

  // Tabrak badan
  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      endGame();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight)
  };
}

function endGame() {
  gamerunning = false;
  clearInterval(gameInterval);
  gameOverElement.style.display = "block";
}

function resetGame() {
  snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
  direction = 'right';
  score = 0;
  scoreElement.textContent = score;
  gamerunning = false;
  generateFood();
  gameOverElement.style.display = "none";
  draw();
}

function startGame() {
  if (!gamerunning) {
    gamerunning = true;
    gameOverElement.style.display = "none";
    gameInterval = setInterval(() => {
      update();
      draw();
    }, 150);
  }
}

function pauseGame() {
  gamerunning = false;
  clearInterval(gameInterval);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== 'down') direction = 'up';
  if (e.key === "ArrowDown" && direction !== 'up') direction = 'down';
  if (e.key === "ArrowLeft" && direction !== 'right') direction = 'left';
  if (e.key === "ArrowRight" && direction !== 'left') direction = 'right';
});

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", pauseGame);
document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
  startGame();
});

resetGame();
