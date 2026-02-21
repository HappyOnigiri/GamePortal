import './style.css';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const uiLayer = document.getElementById('ui-layer')!;
const startBtn = document.getElementById('startBtn')!;
const titleText = document.getElementById('titleText')!;
const descText = document.getElementById('descText')!;
const scoreDisplay = document.getElementById('score-display')!;

let gameState: 'start' | 'playing' | 'gameover' = 'start';
let score = 0;
let frames = 0;

const PLAYER_RADIUS = 12;
const ENEMY_RADIUS = 14;
const COIN_RADIUS = 10;

let mouse = { x: 400, y: 300 };
let player = { x: 400, y: 300 };

interface Entity { x: number; y: number; radius: number; }
interface Enemy extends Entity { vx: number; vy: number; rotation: number; rotSpeed: number; }
interface Coin extends Entity { floatPhase: number; }
interface Doppel { type: string; }

let enemies: Enemy[] = [];
let coins: Coin[] = [];
let doppels: Doppel[] = [];
let playerHistory: { x: number, y: number }[] = [];

const doppelTypes = [
  'invertX',
  'invertY',
  'invertXY',
  'delay20',
  'delay40',
  'swapXY'
];

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

startBtn.addEventListener('click', () => {
  resetGame();
  gameState = 'playing';
  uiLayer.classList.add('hidden');
});

function resetGame() {
  score = 0;
  frames = 0;
  player = { x: 400, y: 300 };
  mouse = { x: 400, y: 300 };
  enemies = [];
  coins = [];
  doppels = [];
  playerHistory = [];
  updateScoreDisplay();

  spawnCoin();
  for (let i = 0; i < 4; i++) spawnEnemy();
}

function updateScoreDisplay() {
  scoreDisplay.innerText = score.toString().padStart(2, '0');
}

function spawnCoin() {
  let x = 0, y = 0, valid = false;
  while (!valid) {
    x = Math.random() * (canvas.width - COIN_RADIUS * 8) + COIN_RADIUS * 4;
    y = Math.random() * (canvas.height - COIN_RADIUS * 8) + COIN_RADIUS * 4;
    const dx = x - player.x;
    const dy = y - player.y;
    if (Math.hypot(dx, dy) > 150) valid = true;
  }
  coins.push({ x, y, radius: COIN_RADIUS, floatPhase: Math.random() * Math.PI * 2 });
}

function spawnEnemy() {
  let x = 0, y = 0, vx = 0, vy = 0;
  const edge = Math.floor(Math.random() * 4);

  const baseSpeed = 2 + Math.min(score * 0.15, 3);
  const speedX = baseSpeed * (0.8 + Math.random() * 0.4);
  const speedY = baseSpeed * (0.8 + Math.random() * 0.4);

  if (edge === 0) {
    x = Math.random() * canvas.width; y = -ENEMY_RADIUS;
    vx = (Math.random() - 0.5) * speedX; vy = speedY;
  } else if (edge === 1) {
    x = canvas.width + ENEMY_RADIUS; y = Math.random() * canvas.height;
    vx = -speedX; vy = (Math.random() - 0.5) * speedY;
  } else if (edge === 2) {
    x = Math.random() * canvas.width; y = canvas.height + ENEMY_RADIUS;
    vx = (Math.random() - 0.5) * speedX; vy = -speedY;
  } else {
    x = -ENEMY_RADIUS; y = Math.random() * canvas.height;
    vx = speedX; vy = (Math.random() - 0.5) * speedY;
  }

  enemies.push({ x, y, vx, vy, radius: ENEMY_RADIUS, rotation: 0, rotSpeed: (Math.random() - 0.5) * 0.2 });
}

function spawnDoppel() {
  const type = doppelTypes[doppels.length % doppelTypes.length];
  doppels.push({ type });
}

function gameOver() {
  gameState = 'gameover';
  uiLayer.classList.remove('hidden');
  titleText.innerText = 'GAME OVER';
  titleText.style.color = '#f43f5e';
  titleText.style.textShadow = '0 0 30px rgba(244, 63, 94, 0.8)';

  let rank = '入門レベル';
  if (score > 5) rank = 'マルチタスカー';
  if (score > 10) rank = '神の左脳';
  if (score > 15) rank = '千手観音';

  descText.innerHTML = `SCORE: <span class="highlight">${score}</span> <br><br>
    <span style="font-size:0.9rem; color:#94a3b8;">称号: ${rank}</span><br>
    分身が多くなるほど、脳の処理限界に達して自滅します。`;
  startBtn.innerText = 'RETRY';
}

function calculateDoppelPosition(type: string): { x: number, y: number } {
  let dx = player.x, dy = player.y;

  switch (type) {
    case 'invertX':
      dx = canvas.width - player.x;
      dy = player.y;
      break;
    case 'invertY':
      dx = player.x;
      dy = canvas.height - player.y;
      break;
    case 'invertXY':
      dx = canvas.width - player.x;
      dy = canvas.height - player.y;
      break;
    case 'swapXY':
      dx = (player.y / canvas.height) * canvas.width;
      dy = (player.x / canvas.width) * canvas.height;
      break;
    case 'delay20': {
      const hist20 = playerHistory[Math.max(0, playerHistory.length - 20)];
      if (hist20) { dx = hist20.x; dy = hist20.y; }
      break;
    }
    case 'delay40': {
      const hist40 = playerHistory[Math.max(0, playerHistory.length - 40)];
      if (hist40) { dx = hist40.x; dy = hist40.y; }
      break;
    }
  }
  return { x: dx, y: dy };
}

function update() {
  if (gameState !== 'playing') return;
  frames++;

  player.x += (mouse.x - player.x) * 0.25;
  player.y += (mouse.y - player.y) * 0.25;

  player.x = Math.max(PLAYER_RADIUS, Math.min(canvas.width - PLAYER_RADIUS, player.x));
  player.y = Math.max(PLAYER_RADIUS, Math.min(canvas.height - PLAYER_RADIUS, player.y));

  playerHistory.push({ x: player.x, y: player.y });
  if (playerHistory.length > 50) playerHistory.shift();

  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];
    const dx = player.x - coin.x;
    const dy = player.y - coin.y;
    if (Math.hypot(dx, dy) < PLAYER_RADIUS + COIN_RADIUS) {
      coins.splice(i, 1);
      score++;
      updateScoreDisplay();
      spawnCoin();
      spawnDoppel();
      spawnEnemy();
    }
  }

  const currentDoppelsPositions = doppels.map(d => calculateDoppelPosition(d.type));

  enemies.forEach(enemy => {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;
    enemy.rotation += enemy.rotSpeed;

    if (enemy.x < ENEMY_RADIUS) { enemy.x = ENEMY_RADIUS; enemy.vx *= -1.05; }
    if (enemy.x > canvas.width - ENEMY_RADIUS) { enemy.x = canvas.width - ENEMY_RADIUS; enemy.vx *= -1.05; }
    if (enemy.y < ENEMY_RADIUS) { enemy.y = ENEMY_RADIUS; enemy.vy *= -1.05; }
    if (enemy.y > canvas.height - ENEMY_RADIUS) { enemy.y = canvas.height - ENEMY_RADIUS; enemy.vy *= -1.05; }

    const maxSpeed = 7;
    const currentSpeed = Math.hypot(enemy.vx, enemy.vy);
    if (currentSpeed > maxSpeed) {
      enemy.vx = (enemy.vx / currentSpeed) * maxSpeed;
      enemy.vy = (enemy.vy / currentSpeed) * maxSpeed;
    }
  });

  for (const enemy of enemies) {
    if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < PLAYER_RADIUS + ENEMY_RADIUS - 4) {
      gameOver(); return;
    }
    for (const dp of currentDoppelsPositions) {
      if (Math.hypot(dp.x - enemy.x, dp.y - enemy.y) < PLAYER_RADIUS + ENEMY_RADIUS - 4) {
        gameOver(); return;
      }
    }
  }
}

function draw() {
  ctx.fillStyle = 'rgba(11, 17, 32, 0.4)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState !== 'playing') {
    requestAnimationFrame(gameLoop);
    return;
  }

  coins.forEach(coin => {
    coin.floatPhase += 0.05;
    const floatY = Math.sin(coin.floatPhase) * 5;

    ctx.beginPath();
    ctx.arc(coin.x, coin.y + floatY, coin.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fbbf24';
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(coin.x - 3, coin.y + floatY - 3, coin.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
  });

  doppels.forEach((d) => {
    const pos = calculateDoppelPosition(d.type);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, PLAYER_RADIUS, 0, Math.PI * 2);

    ctx.strokeStyle = `rgba(56, 189, 248, 0.6)`;
    ctx.lineWidth = 2;
    if (d.type.includes('invert')) {
      ctx.setLineDash([4, 4]);
    } else {
      ctx.setLineDash([1, 4]);
    }

    ctx.stroke();
    ctx.fillStyle = `rgba(56, 189, 248, 0.15)`;
    ctx.fill();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = `rgba(56, 189, 248, 0.08)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  ctx.beginPath();
  ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#38bdf8';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#38bdf8';
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(player.x, player.y, PLAYER_RADIUS * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fill();

  enemies.forEach(enemy => {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.rotation);

    ctx.beginPath();
    const spikes = 4;
    for (let i = 0; i < spikes * 2; i++) {
      const rad = Math.PI * i / spikes;
      const r = (i % 2 === 0) ? enemy.radius : enemy.radius * 0.7;
      ctx.lineTo(Math.cos(rad) * r, Math.sin(rad) * r);
    }
    ctx.closePath();

    ctx.fillStyle = '#f43f5e';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f43f5e';
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.restore();
  });

  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  update();
  draw();
}

requestAnimationFrame(gameLoop);
