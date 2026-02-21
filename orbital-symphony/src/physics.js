export class Planet {
    id;
    position;
    mass;
    color;
    constructor(id, position, mass, color) {
        this.id = id;
        this.position = position;
        this.mass = mass;
        this.color = color;
    }
}
export class Particle {
    position;
    color;
    velocity;
    trail = [];
    maxTrailLength = 20;
    constructor(position, color, initialVelocity) {
        this.position = position;
        this.color = color;
        this.velocity = initialVelocity;
    }
    update(planets, gravityConstant) {
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
//# sourceMappingURL=physics.js.map