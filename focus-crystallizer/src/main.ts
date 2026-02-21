import './style.css';

// --- Types & State ---
type AppState = 'IDLE' | 'RUNNING' | 'FINISHED' | 'BROKEN';
let currentState: AppState = 'IDLE';

let totalDurationMs = 5 * 60 * 1000;
let timeRemainingMs = totalDurationMs;
let lastFrameTime = 0;
let animationFrameId = 0;

let growthProgress = 0; // 0.0 to 1.0

// --- DOM Elements ---
const canvas = document.getElementById('crystal-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const timerDisplay = document.getElementById('timer-display')!;
const messageArea = document.getElementById('message-area')!;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;
const durationBtns = document.querySelectorAll('.duration-btn');

// --- Setup ---
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Re-draw if not running so it doesn't just disappear on resize
  if (currentState !== 'RUNNING') {
    drawCrystal(growthProgress);
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateUI() {
  timerDisplay.textContent = formatTime(timeRemainingMs);

  if (currentState === 'IDLE') {
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    messageArea.textContent = 'Ready to focus. Select duration and press Start.';
    messageArea.style.color = 'var(--text-muted)';
  } else if (currentState === 'RUNNING') {
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    messageArea.textContent = 'Focusing... Do not switch tabs!';
    messageArea.style.color = 'var(--text-main)';
  } else if (currentState === 'FINISHED') {
    startBtn.style.display = 'block';
    startBtn.textContent = 'Start Again';
    stopBtn.style.display = 'none';
    messageArea.textContent = 'Excellent! Your focus crystallized perfectly.';
    messageArea.style.color = '#a78bfa'; // Purple accent
  } else if (currentState === 'BROKEN') {
    startBtn.style.display = 'block';
    startBtn.textContent = 'Try Again';
    stopBtn.style.display = 'none';
    messageArea.textContent = 'Oops! You lost focus. The crystal withered.';
    messageArea.style.color = 'var(--danger)';
  }
}

// --- Drawing Logic (Fractal / Generative Art) ---
function drawCrystal(progress: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (progress <= 0) return;

  const startX = canvas.width / 2;
  const startY = canvas.height * 0.95; // Slightly above bottom
  const maxInitialLength = Math.min(canvas.width, canvas.height) * 0.22;

  ctx.save();
  ctx.translate(startX, startY);

  // Colors based on state
  let baseHue = 199; // 38bdf8 in HSL
  let saturation = 92;
  let lightness = 60;

  if (currentState === 'BROKEN') {
    baseHue = 0;
    saturation = 80;
    lightness = 50;
  } else if (currentState === 'FINISHED') {
    baseHue = 260; // purple-ish
    saturation = 100;
    lightness = 75;
  }

  // To make it look "crystalline"/geometric, we use sharper angles instead of biological curves
  const angleSpread = Math.PI / 4.5;
  const lengthDecay = 0.72;
  const maxDepth = 10;

  function branch(length: number, angle: number, depth: number) {
    // If progress hasn't reached this depth layer yet, don't draw or draw partially
    const depthProgressThreshold = depth / maxDepth;
    if (progress < depthProgressThreshold) return;

    // How "complete" is this specific segment based on global progress
    const segmentProgress = Math.min(1, (progress - depthProgressThreshold) * maxDepth);
    const currentLength = length * segmentProgress;

    ctx.save();
    ctx.rotate(angle);

    // Draw line
    const alpha = 1 - (depth / maxDepth) * 0.5;
    ctx.strokeStyle = `hsla(${baseHue}, ${saturation}%, ${lightness}%, ${alpha})`;
    ctx.lineWidth = Math.max(1, (maxDepth - depth) * 1.5);
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -currentLength);
    ctx.stroke();

    ctx.translate(0, -currentLength);

    if (depth < maxDepth && currentLength > 2) {
      // Add a slight rotation offset based on depth to make it look organic yet geometric
      const offset = (Math.PI / 18) * ((depth % 2 === 0) ? 1 : -1);

      // Left branch
      branch(length * lengthDecay, -angleSpread + offset, depth + 1);
      // Right branch
      branch(length * lengthDecay, angleSpread + offset, depth + 1);
      // Sometimes a center branch for thicker crystal core
      if (depth < 4) {
        branch(length * lengthDecay * 0.8, 0, depth + 1);
      }
    }

    ctx.restore();
  }

  branch(maxInitialLength, 0, 0);
  ctx.restore();
}

// --- Main Loop ---
function loop(timestamp: number) {
  if (currentState !== 'RUNNING') return;

  if (lastFrameTime === 0) lastFrameTime = timestamp;
  const dt = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  timeRemainingMs -= dt;

  if (timeRemainingMs <= 0) {
    timeRemainingMs = 0;
    growthProgress = 1.0;
    currentState = 'FINISHED';
    updateUI();
    drawCrystal(growthProgress);
    return; // Stop loop
  }

  // Calculate progress 0.0 -> 1.0
  growthProgress = 1.0 - (timeRemainingMs / totalDurationMs);

  // Throttle UI update so it doesn't flicker wildly, update every frame is fine for text but we can just do it
  timerDisplay.textContent = formatTime(timeRemainingMs);

  drawCrystal(growthProgress);

  animationFrameId = requestAnimationFrame(loop);
}

// --- Event Listeners ---
durationBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentState === 'RUNNING') return; // Cannot change while running

    durationBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const minutes = parseInt(btn.getAttribute('data-duration') || '5', 10);
    totalDurationMs = minutes * 60 * 1000;
    timeRemainingMs = totalDurationMs;
    growthProgress = 0;
    currentState = 'IDLE';

    updateUI();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear crystal
  });
});

startBtn.addEventListener('click', () => {
  if (currentState === 'RUNNING') return;

  // Reset if coming from broken/finished
  if (currentState === 'BROKEN' || currentState === 'FINISHED') {
    // Rely on current selected active button duration
    const activeBtn = document.querySelector('.duration-btn.active');
    const minutes = parseInt(activeBtn?.getAttribute('data-duration') || '5', 10);
    totalDurationMs = minutes * 60 * 1000;
  }

  timeRemainingMs = totalDurationMs;
  growthProgress = 0;
  currentState = 'RUNNING';
  lastFrameTime = 0;

  updateUI();
  animationFrameId = requestAnimationFrame(loop);
});

stopBtn.addEventListener('click', () => {
  if (currentState !== 'RUNNING') return;
  cancelAnimationFrame(animationFrameId);
  currentState = 'BROKEN';
  updateUI();
  drawCrystal(growthProgress);
});

// Detect Visibility Change (Anti-Cheat / Focus Break)
document.addEventListener('visibilitychange', () => {
  if (currentState === 'RUNNING' && document.visibilityState === 'hidden') {
    // Penalty: You looked away!
    cancelAnimationFrame(animationFrameId);
    currentState = 'BROKEN';
    updateUI();
    drawCrystal(growthProgress);
  }
});

// Initial Setup
updateUI();
