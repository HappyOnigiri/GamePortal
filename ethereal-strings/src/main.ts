import './style.css'
import { StringPhysics } from './physics'
import { StringAudio } from './audio'

class Particle {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public color: string;
  public life: number = 1.0;

  constructor(x: number, y: number, vx: number, vy: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.life -= 0.02;
  }
}

class EtherealApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private audio: StringAudio;
  private strings: { physics: StringPhysics; color: string; freq: number }[] = [];
  private particles: Particle[] = [];

  // 物理パラメータ
  private tensionValue: number = 0.5;

  // マウス座標の履歴（スワイプ判定用）
  private lastX: number = 0;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.audio = new StringAudio();

    this.setupStrings(7);
    this.resize();
    this.bindEvents();
    this.render();
  }

  private setupStrings(count: number) {
    this.strings = [];
    const colors = ['#646cff', '#535bf2', '#747bff', '#8a2be2', '#9370db', '#483d8b', '#6a5acd'];

    // 音階（ペンタトニックスケール風）
    const baseFreq = 220; // A3
    const intervals = [1, 1.125, 1.25, 1.5, 1.666]; // ドレミソラ

    for (let i = 0; i < count; i++) {
      const intervalIndex = i % intervals.length;
      const octave = Math.floor(i / intervals.length);
      const freq = baseFreq * intervals[intervalIndex] * Math.pow(2, octave);

      this.strings.push({
        physics: new StringPhysics(),
        color: colors[i % colors.length],
        freq: freq
      });
    }
  }

  private resize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  private bindEvents() {
    window.addEventListener('resize', () => this.resize());

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = ('touches' in e) ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const y = ('touches' in e) ? e.touches[0].clientY : (e as MouseEvent).clientY;

      this.checkInteraction(x, y);

      this.lastX = x;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });

    // オーディオコンテキストのアンロック
    window.addEventListener('mousedown', () => this.audio.unlock());
    window.addEventListener('touchstart', () => this.audio.unlock());

    // UI制御
    document.getElementById('string-count')?.addEventListener('input', (e) => {
      this.setupStrings(parseInt((e.target as HTMLInputElement).value));
    });

    document.getElementById('tension')?.addEventListener('input', (e) => {
      this.tensionValue = parseInt((e.target as HTMLInputElement).value) / 100;
    });
  }

  private createParticles(x: number, y: number, color: string) {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color
      ));
    }
  }

  private checkInteraction(x: number, y: number) {
    const stringSpacing = window.innerWidth / (this.strings.length + 1);

    this.strings.forEach((s, i) => {
      const stringX = (i + 1) * stringSpacing;

      // X座標を跨いだか判定（左右どちらからでも）
      if ((this.lastX < stringX && x >= stringX) || (this.lastX > stringX && x <= stringX)) {
        // マウスの速度や位置に応じたエフェクト
        const velocity = Math.abs(x - this.lastX);
        const relativeY = y / window.innerHeight;

        s.physics.pluck(relativeY, (x - this.lastX) * 0.5);
        this.audio.play(s.freq, Math.min(velocity / 10, 1.0));
        this.createParticles(stringX, y, s.color);
      }
    });
  }

  private render() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // 背景の微かなグラデーション
    const grad = this.ctx.createRadialGradient(
      window.innerWidth / 2, window.innerHeight / 2, 0,
      window.innerWidth / 2, window.innerHeight / 2, window.innerWidth
    );
    grad.addColorStop(0, '#151518');
    grad.addColorStop(1, '#0d0d0f');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const stringSpacing = window.innerWidth / (this.strings.length + 1);

    this.strings.forEach((s, i) => {
      // 外部パラメータを反映
      (s.physics as any).tension = 0.1 + this.tensionValue * 0.9;

      s.physics.update();

      const x = (i + 1) * stringSpacing;
      this.drawString(x, s.physics, s.color);
    });

    // パーティクルの描画
    this.particles.forEach((p, i) => {
      p.update();
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        return;
      }
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;

    requestAnimationFrame(() => this.render());
  }

  private drawString(x: number, physics: StringPhysics, color: string) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';

    const h = window.innerHeight;
    this.ctx.moveTo(x, 0);

    const steps = physics.points.length;
    for (let i = 0; i < steps; i++) {
      const p = physics.points[i];
      const y = (i / (steps - 1)) * h;

      // 曲線で描画
      if (i === 0) {
        this.ctx.moveTo(x + p.y, y);
      } else {
        const prevP = physics.points[i - 1];
        const prevY = ((i - 1) / (steps - 1)) * h;
        const cpY = (prevY + y) / 2;
        this.ctx.quadraticCurveTo(x + prevP.y, cpY, x + p.y, y);
      }
    }

    this.ctx.stroke();

    // グロー効果
    this.ctx.globalAlpha = 0.3;
    this.ctx.lineWidth = 6;
    this.ctx.stroke();
    this.ctx.globalAlpha = 1.0;
  }
}

new EtherealApp();
