/**
 * Web Audio API を用いた音響生成クラス
 */
export class StringAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    // ユーザーインタラクション後に初期化する必要がある
  }

  private init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.5;
  }

  /**
   * 弦を弾いた時の音を鳴らす
   * @param frequency 周波数 (Hz)
   * @param velocity 強さ (0.0 ~ 1.0)
   */
  play(frequency: number, velocity: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // 弦楽器らしい波形（鋸歯状波に少しフィルタをかけるなど）
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // エンベロープの設定 (撥音の鋭さ)
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(velocity * 0.4, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    // ローパスフィルタで音色を整える
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 3, now);
    filter.frequency.exponentialRampToValueAtTime(frequency, now + 1.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 1.6);
  }

  /**
   * 全体の音量を設定
   */
  setVolume(v: number) {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(v, this.ctx?.currentTime || 0, 0.1);
    }
  }

  unlock() {
    this.init();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }
}
