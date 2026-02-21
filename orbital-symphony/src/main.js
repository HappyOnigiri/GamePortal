import './style.css';
import { Planet, Particle, Vector } from './physics';
import { AudioEngine } from './audio';
class App {
    canvas;
    ctx;
    planets = [];
    particles = [];
    audioEngine;
    isAddingMode = true;
    gravityConstant = 0.5;
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.audioEngine = new AudioEngine();
        this.setupEventListeners();
        this.resize();
        this.initParticles();
        this.animate();
    }
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousedown', (e) => {
            this.audioEngine.init();
            this.audioEngine.resume();
            const pos = { x: e.clientX, y: e.clientY };
            if (this.isAddingMode) {
                this.addPlanet(pos);
            }
            else {
                this.removePlanet(pos);
            }
        });
        document.getElementById('mode-add')?.addEventListener('click', (e) => {
            this.isAddingMode = true;
            this.updateUIMode(e.target);
        });
        document.getElementById('mode-remove')?.addEventListener('click', (e) => {
            this.isAddingMode = false;
            this.updateUIMode(e.target);
        });
        document.getElementById('clear-all')?.addEventListener('click', () => {
            this.planets = [];
        });
        const intensitySlider = document.getElementById('intensity');
        intensitySlider?.addEventListener('input', (e) => {
            this.gravityConstant = parseFloat(e.target.value) / 100;
        });
    }
    updateUIMode(activeBtn) {
        document.querySelectorAll('.button-group button').forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    initParticles() {
        for (let i = 0; i < 15; i++) {
            this.spawnParticle();
        }
    }
    spawnParticle() {
        const margin = 100;
        const pos = {
            x: Math.random() * (this.canvas.width - margin * 2) + margin,
            y: Math.random() * (this.canvas.height - margin * 2) + margin
        };
        const vel = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
        const hue = Math.random() * 60 + 180; // 青〜シアン系
        this.particles.push(new Particle(pos, `hsla(${hue}, 80%, 60%, 0.8)`, vel));
    }
    addPlanet(pos) {
        const id = Math.random().toString(36).substr(2, 9);
        const mass = 50 + Math.random() * 150;
        const hue = Math.random() * 360;
        this.planets.push(new Planet(id, pos, mass, `hsl(${hue}, 70%, 50%)`));
    }
    removePlanet(pos) {
        const threshold = 30;
        this.planets = this.planets.filter(p => {
            const dx = p.position.x - pos.x;
            const dy = p.position.y - pos.y;
            return Math.sqrt(dx * dx + dy * dy) > threshold;
        });
    }
    animate() {
        this.ctx.fillStyle = 'rgba(5, 5, 8, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // 粒子の更新と描画
        this.particles.forEach(p => {
            p.update(this.planets, this.gravityConstant);
            // 描画
            this.ctx.beginPath();
            this.ctx.strokeStyle = p.color;
            this.ctx.lineWidth = 2;
            this.ctx.moveTo(p.trail[0]?.x || p.position.x, p.trail[0]?.y || p.position.y);
            for (let i = 1; i < p.trail.length; i++) {
                this.ctx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            this.ctx.stroke();
            // 画面外に出た場合の処理
            if (p.position.x < -100 || p.position.x > this.canvas.width + 100 ||
                p.position.y < -100 || p.position.y > this.canvas.height + 100) {
                this.particles = this.particles.filter(p2 => p2 !== p);
                this.spawnParticle();
            }
            // 惑星に近い場合に音を鳴らす
            this.planets.forEach(planet => {
                const dx = planet.position.x - p.position.x;
                const dy = planet.position.y - p.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 20) {
                    const intensity = planet.mass / 200;
                    const panning = (planet.position.x / this.canvas.width) * 2 - 1;
                    this.audioEngine.playNote(intensity, panning);
                }
            });
        });
        // 惑星の描画
        this.planets.forEach(p => {
            this.ctx.beginPath();
            const grad = this.ctx.createRadialGradient(p.position.x, p.position.y, 0, p.position.x, p.position.y, Math.sqrt(p.mass) * 2);
            grad.addColorStop(0, p.color);
            grad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = grad;
            this.ctx.arc(p.position.x, p.position.y, Math.sqrt(p.mass) * 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        requestAnimationFrame(() => this.animate());
    }
}
new App();
//# sourceMappingURL=main.js.map