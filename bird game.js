const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game settings
canvas.width = 320;
canvas.height = 480;
const gravity = 0.6;
const birdWidth = 20;
const birdHeight = 20;
const gap = 100;
const pipeWidth = 50;
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlap = -10;
let pipes = [];
let score = 0;
let gameOver = false;

const bird = {
  x: 50,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
  velocity: birdVelocity,
};

const pipe = {
  x: canvas.width,
  y: 0,
  width: pipeWidth,
  height: Math.floor(Math.random() * (canvas.height - gap)),
};

// Bird movement
document.addEventListener('keydown', () => {
  if (!gameOver) {
    bird.velocity = birdFlap;
  }
});

// Generate new pipe
function createPipe() {
  const pipeHeight = Math.floor(Math.random() * (canvas.height - gap));
  pipes.push({ x: canvas.width, y: pipeHeight });
}

// Update the bird's position
function updateBird() {
  bird.velocity += gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

// Update pipes and check for collisions
function updatePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;

    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
      score++;
    }

    // Collision check with the bird
    if (
      bird.x + bird.width > pipes[i].x &&
      bird.x < pipes[i].x + pipeWidth &&
      (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + gap)
    ) {
      gameOver = true;
    }
  }
}

// Draw everything on canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bird
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Draw pipes
  ctx.fillStyle = 'green';
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
    ctx.fillRect(pipe.x, pipe.y + gap, pipeWidth, canvas.height - pipe.y - gap);
  });

  // Draw score
  scoreElement.textContent = `Score: ${score}`;

  // Game over text
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Game loop
function gameLoop() {
  if (gameOver) return;

  updateBird();
  updatePipes();
  draw();

  requestAnimationFrame(gameLoop);
}

// Start the game loop
function startGame() {
  pipes = [];
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  score = 0;
  gameOver = false;

  createPipe();
  gameLoop();

  setInterval(createPipe, 2000); // Generate a new pipe every 2 seconds
}

startGame();
