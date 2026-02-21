export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;

  private notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
  ];

  async init() {
    if (this.isInitialized) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    this.isInitialized = true;
  }

  playNote(intensity: number, panning: number) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner();

    // 強度に基づいて音階を選択
    const noteIndex = Math.floor(Math.min(intensity, 0.99) * this.notes.length);
    const frequency = this.notes[noteIndex] ?? 440;
    osc.frequency.setValueAtTime(frequency, now);
    osc.type = 'sine';

    // パンニング設定
    panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panning)), now);

    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.1, now + 0.05);
    env.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(env);
    env.connect(panner);
    panner.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.6);
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}
