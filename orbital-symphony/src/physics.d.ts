export interface Vector {
    x: number;
    y: number;
}
export declare class Planet {
    id: string;
    position: Vector;
    mass: number;
    color: string;
    constructor(id: string, position: Vector, mass: number, color: string);
}
export declare class Particle {
    position: Vector;
    color: string;
    velocity: Vector;
    trail: Vector[];
    private readonly maxTrailLength;
    constructor(position: Vector, color: string, initialVelocity: Vector);
    update(planets: Planet[], gravityConstant: number): void;
}
//# sourceMappingURL=physics.d.ts.map