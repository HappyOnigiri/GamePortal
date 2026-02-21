export interface Vector {
  x: number;
  y: number;
}

export class Planet {
  constructor(
    public id: string,
    public position: Vector,
    public mass: number,
    public color: string
  ) {}
}

export class Particle {
  public velocity: Vector;
  public trail: Vector[] = [];
  private readonly maxTrailLength = 20;

  constructor(
    public position: Vector,
    public color: string,
    initialVelocity: Vector
  ) {
    this.velocity = initialVelocity;
  }

  update(planets: Planet[], gravityConstant: number) {
    let ax = 0;
    let ay = 0;

    for (const planet of planets) {
      const dx = planet.position.x - this.position.x;
      const dy = planet.position.y - this.position.y;
      const distSq = dx * dx + dy * dy + 0.1; // 0除算防止
      const force = (gravityConstant * planet.mass) / distSq;
      const dist = Math.sqrt(distSq);

      ax += (force * dx) / dist;
      ay += (force * dy) / dist;
    }

    this.velocity.x += ax;
    this.velocity.y += ay;

    // 摩擦（減衰）
    this.velocity.x *= 0.999;
    this.velocity.y *= 0.999;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // トレールの更新
    this.trail.push({ x: this.position.x, y: this.position.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }
}
