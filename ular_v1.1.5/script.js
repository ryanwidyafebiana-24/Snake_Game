const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const eatSound = document.getElementById("eatSound");
const hitSound = document.getElementById("hitSound");
const gameOverSound = document.getElementById("gameOverSound");
const bgMusic = document.getElementById("bgMusic");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = spawnFood();
let score = 0;
let game;
let paused = false;
let gameOver = false;

document.addEventListener("keydown", directionControl);
document.getElementById("startBtn").onclick = startGame;
document.getElementById("pauseBtn").onclick = pauseGame;
document.getElementById("restartBtn").onclick = restartGame;

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box,
  };
}

function directionControl(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function startGame() {
  if (!game && !gameOver) {
    bgMusic.volume = 0.5;
    bgMusic.play();
    game = setInterval(draw, 120);
  }
}

function pauseGame() {
  if (!paused && !gameOver) {
    clearInterval(game);
    bgMusic.pause();
    paused = true;
  } else if (!gameOver) {
    game = setInterval(draw, 120);
    bgMusic.play();
    paused = false;
  }
}

function restartGame() {
  clearInterval(game);
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  food = spawnFood();
  score = 0;
  scoreElement.innerText = score;
  paused = false;
  gameOver = false;
  bgMusic.currentTime = 0;
  bgMusic.play();
  game = setInterval(draw, 120);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🐍 Gambar ular
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#00BFFF" : "#1E90FF";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#003366";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // 🍎 Gambar makanan kotak merah
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    return;
  }

  // Posisi kepala ular
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // 🍴 Makan
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreElement.innerText = score;
    eatSound.currentTime = 0;
    eatSound.play();
    food = spawnFood();
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  // 💥 Nabrak
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    gameOver = true;
    bgMusic.pause();
    hitSound.currentTime = 0;
    hitSound.play();
    setTimeout(() => {
      gameOverSound.currentTime = 0;
      gameOverSound.play();
    }, 400);
    draw(); // langsung gambar GAME OVER
    return;
  }

  snake.unshift(newHead);
}

function collision(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x === arr[i].x && head.y === arr[i].y) return true;
  }
  return false;
}
