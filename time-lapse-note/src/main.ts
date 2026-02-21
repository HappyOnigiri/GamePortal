import './style.css'

interface Snapshot {
  text: string;
  time: number;
}

const editor = document.getElementById('editor') as HTMLTextAreaElement;
const timeline = document.getElementById('timeline') as HTMLInputElement;
const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
const timeDisplay = document.getElementById('timeDisplay') as HTMLSpanElement;
const statusIndicator = document.getElementById('statusIndicator') as HTMLSpanElement;
const playIcon = document.getElementById('playIcon') as unknown as SVGElement;
const pauseIcon = document.getElementById('pauseIcon') as unknown as SVGElement;

let history: Snapshot[] = [];
let isPlaying = false;
let playbackTimeouts: number[] = [];

// Initialize
history.push({ text: editor.value, time: Date.now() });

function updateUI() {
  timeline.max = Math.max(0, history.length - 1).toString();

  if (history.length > 1) {
    playBtn.disabled = false;
  } else {
    playBtn.disabled = true;
  }
}

editor.addEventListener('input', () => {
  if (isPlaying) { stopPlayback(); }

  const currentIndex = parseInt(timeline.value, 10);

  // If we are in the past and start typing, discard the future
  if (currentIndex < history.length - 1) {
    history = history.slice(0, currentIndex + 1);
  }

  history.push({ text: editor.value, time: Date.now() });
  timeline.max = (history.length - 1).toString();
  timeline.value = (history.length - 1).toString();

  updateUI();
  updateStatusDisplay();
});

timeline.addEventListener('input', () => {
  if (isPlaying) { stopPlayback(); }
  applyState(parseInt(timeline.value, 10));
});

function applyState(index: number) {
  if (index >= 0 && index < history.length) {
    editor.value = history[index].text;
    updateStatusDisplay();
  }
}

function updateStatusDisplay() {
  const currentIndex = parseInt(timeline.value, 10);
  const isLatest = currentIndex === history.length - 1;

  if (isLatest) {
    statusIndicator.textContent = 'Live';
    statusIndicator.className = 'status-indicator';
    editor.classList.remove('playback-mode');
    if (!isPlaying) {
      editor.readOnly = false;
    }
  } else {
    statusIndicator.textContent = 'History';
    statusIndicator.className = 'status-indicator history';
    editor.classList.add('playback-mode');
    if (!isPlaying) {
      editor.readOnly = true;
    }
  }

  if (history.length > 0) {
    const start = history[0].time;
    const current = history[currentIndex].time;
    const diff = Math.max(0, current - start);

    const ms = Math.floor(diff % 1000 / 10).toString().padStart(2, '0');
    const sec = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
    const min = Math.floor((diff / 60000)).toString().padStart(2, '0');
    timeDisplay.textContent = `${min}:${sec}.${ms}`;
  }
}

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    stopPlayback();
  } else {
    startPlayback();
  }
});

function startPlayback() {
  isPlaying = true;
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  editor.readOnly = true;

  let currentIndex = parseInt(timeline.value, 10);
  if (currentIndex >= history.length - 1) {
    currentIndex = 0; // Restart from beginning if at the end
  }

  const loop = () => {
    if (!isPlaying) return;

    if (currentIndex >= history.length - 1) {
      stopPlayback();
      timeline.value = (history.length - 1).toString();
      applyState(history.length - 1);
      return;
    }

    const currentSnap = history[currentIndex];
    const nextSnap = history[currentIndex + 1];

    let delay = nextSnap.time - currentSnap.time;
    // Compress time gaps: max 400ms pause, min 30ms for natural feel
    delay = Math.min(Math.max(delay, 30), 400);

    timeline.value = currentIndex.toString();
    applyState(currentIndex);

    currentIndex++;
    const timeoutId = window.setTimeout(loop, delay);
    playbackTimeouts.push(timeoutId);
  };

  loop();
}

function stopPlayback() {
  isPlaying = false;
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');

  playbackTimeouts.forEach(id => clearTimeout(id));
  playbackTimeouts = [];

  updateStatusDisplay();
}

resetBtn.addEventListener('click', () => {
  if (confirm('記録をすべて消去しますか？')) {
    stopPlayback();
    history = [{ text: '', time: Date.now() }];
    editor.value = '';
    timeline.max = '0';
    timeline.value = '0';
    updateStatusDisplay();
    updateUI();
  }
});

// Initial Setup
updateUI();
updateStatusDisplay();
editor.focus();
