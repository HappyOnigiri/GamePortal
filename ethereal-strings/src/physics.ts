/**
 * 弦の物理シミュレーションを管理するクラス
 */
export class StringPhysics {
  public points: { y: number; vy: number; ay: number }[];
  private numPoints: number = 20;
  private tension: number = 0.5; // 張力
  private damping: number = 0.98; // 減衰
  private mass: number = 1.0; // 質量

  constructor() {
    this.points = Array.from({ length: this.numPoints }, () => ({
      y: 0,
      vy: 0,
      ay: 0,
    }));
  }

  /**
   * 物理状態を更新する
   */
  update() {
    for (let i = 1; i < this.numPoints - 1; i++) {
      const p = this.points[i];
      const prev = this.points[i - 1];
      const next = this.points[i + 1];

      // 隣接する点からの復元力を計算
      const forcePrev = this.tension * (prev.y - p.y);
      const forceNext = this.tension * (next.y - p.y);

      p.ay = (forcePrev + forceNext) / this.mass;
      p.vy += p.ay;
      p.vy *= this.damping;
      p.y += p.vy;
    }

    // 両端は固定 (y = 0)
    this.points[0].y = 0;
    this.points[this.numPoints - 1].y = 0;
  }

  /**
   * 特定の位置で弦を「弾く」
   * @param x 0.0 ~ 1.0 の相対位置
   * @param force 弾く強さ
   */
  pluck(x: number, force: number) {
    const index = Math.floor(x * (this.numPoints - 1));
    if (index > 0 && index < this.numPoints - 1) {
      this.points[index].vy += force;
    }
  }

  /**
   * 弦上の特定位置のY座標を取得
   */
  getYAt(x: number): number {
    const idx = x * (this.numPoints - 1);
    const i = Math.floor(idx);
    const f = idx - i;
    if (i >= this.numPoints - 1) return this.points[this.numPoints - 1].y;
    return this.points[i].y * (1 - f) + this.points[i + 1].y * f;
  }
}
