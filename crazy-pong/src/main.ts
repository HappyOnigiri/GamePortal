import './style.css'

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const gameContainer = document.getElementById('game-container') as HTMLDivElement;
const annoyingMessage = document.getElementById('annoying-message') as HTMLDivElement;
const uiLayer = document.getElementById('ui-layer') as HTMLDivElement;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;

let score = 0;
let isGameOver = false;
let isGameStarted = false;

const paddle = {
  width: 100,
  height: 15,
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  dx: 5,
  dy: -5,
  speed: 7,
};

let currentRotation = 0;

const annoyingPhrases = [
  "えっ、遅くない？",
  "よそ見してる？",
  "草",
  "もっと頑張れ",
  "目開いてる？",
  "その程度の反射神経？",
  "寝てる？",
  "まさか本気じゃないよね？"
];

function drawPaddle() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ff4444';
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.textAlign = 'left';
  ctx.font = '24px "Orbitron", sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Score: ${score}`, 20, 40);
}

function showAnnoyingMessage() {
  const phrase = annoyingPhrases[Math.floor(Math.random() * annoyingPhrases.length)];
  annoyingMessage.textContent = phrase;
  annoyingMessage.style.opacity = '1';
  annoyingMessage.style.transform = `translate(-50%, -50%) scale(${1 + Math.random()})`;

  setTimeout(() => {
    annoyingMessage.style.opacity = '0';
  }, 800);
}

function applyCrazyGimmick() {
  if (score <= 3) {
    // Score 3 までは普通の pong（傾きなし、ボールサイズ固定、煽り文字なし）
    currentRotation = 0;
    gameContainer.style.transform = `rotate(0deg)`;
    ball.radius = 10;
  } else if (score <= 7) {
    // Score 7 までは軽めの傾きのみ（煽り文字なし、ボールサイズ固定）
    // -10度から10度程度の傾き
    const newRotation = (Math.random() - 0.5) * 20;
    currentRotation = newRotation;
    gameContainer.style.transform = `rotate(${currentRotation}deg)`;
    ball.radius = 10;
  } else {
    // Score 8 からは現在のダイナミックに傾き、煽り文字を表示するモード
    // 画面をランダムな角度に傾ける（-45度〜45度）
    const newRotation = (Math.random() - 0.5) * 90;
    currentRotation = newRotation;
    gameContainer.style.transform = `rotate(${currentRotation}deg)`;

    // ボールのサイズもバウンドのたびにランダムに変化（5〜20）
    ball.radius = 5 + Math.random() * 15;

    // たまに煽りメッセージを出す
    if (Math.random() < 0.3) {
      showAnnoyingMessage();
    }
  }
}

function update() {
  if (!isGameStarted || isGameOver) return;

  // Move paddle based on mouse
  // Mouse tracking is handled in an event listener, so paddle.x is updated there.

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (left/right)
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
    applyCrazyGimmick();
  }

  // Wall collision (top)
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
    applyCrazyGimmick();
  }

  // Paddle collision
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width
  ) {
    // Avoid double collision
    if (ball.dy > 0) {
      ball.dy *= -1;

      // Hit position affects X velocity
      const hitPoint = ball.x - (paddle.x + paddle.width / 2);
      ball.dx = hitPoint * 0.15;

      // Speed up slightly
      ball.speed += 0.2;

      // Normalize velocity
      const angle = Math.atan2(ball.dy, ball.dx);
      ball.dx = Math.cos(angle) * ball.speed;
      ball.dy = Math.sin(angle) * ball.speed;

      score++;
      applyCrazyGimmick();
    }
  }

  // Bottom collision (Game Over)
  if (ball.y + ball.radius > canvas.height) {
    isGameOver = true;
    canvas.style.cursor = 'default';
    if (document.pointerLockElement === canvas) {
      document.exitPointerLock();
    }
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle();
  drawBall();
  drawScore();

  if (isGameOver) {
    ctx.font = '48px "Orbitron", sans-serif';
    ctx.fillStyle = '#ff4444';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px "Orbitron", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 50);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Event Listeners
startBtn.addEventListener('click', () => {
  isGameStarted = true;
  uiLayer.classList.add('hidden');
  canvas.style.cursor = 'none';
  if (document.pointerLockElement !== canvas) {
    canvas.requestPointerLock();
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isGameStarted) return;

  if (document.pointerLockElement === canvas) {
    // プレイ中はPointer Lockの移動量(movementX)を使う
    paddle.x += e.movementX;
  } else {
    const rect = canvas.getBoundingClientRect();
    const rootX = e.clientX - rect.left;
    paddle.x = rootX - paddle.width / 2;
  }

  // Boundary check
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
});

canvas.addEventListener('click', () => {
  if (isGameOver) {
    isGameOver = false;
    score = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5;
    ball.dy = -5;
    ball.speed = 7;
    ball.radius = 10;
    currentRotation = 0;
    gameContainer.style.transform = `rotate(0deg)`;
    canvas.style.cursor = 'none';
  }

  if (!isGameOver && document.pointerLockElement !== canvas) {
    canvas.requestPointerLock();
  }
});

// Start game
loop();
