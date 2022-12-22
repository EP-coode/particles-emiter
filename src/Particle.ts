import { IColorSelectionStrategy } from "./ColorSelection/IColorSelectionStrategy";
import { IForceSource } from "./ForceField/IForceSource";
import { IMassiveBody } from "./ForceField/IMassiveBody";
import { G } from "./ParticlesSystem";
import { ISizeCahngeStrategy } from "./SizeChange/ISizeChangeStrategy";

export class Particle implements IMassiveBody, IForceSource {
  constructor(
    private _currentColor: [number, number, number],
    private _size: number,
    private _mass: number,
    private _pos: [number, number] = [0, 0],
    private _v: [number, number] = [0, 0],
    private _f: [number, number] = [0, 0],
    private _colorSelectionStrategy: IColorSelectionStrategy,
    private _sizeChangeStrategy: ISizeCahngeStrategy,
    private _distanceScale: number
  ) {}
  // -------------- Getters and Setters -----------------
  public set position(newPosition: [number, number]) {
    this._pos = newPosition;
  }

  public set velocity(velocity: [number, number]) {
    this._v = velocity;
  }

  public set force(force: [number, number]) {
    this._f = force;
  }

  public set mass(newMass: number) {
    this._mass = newMass;
  }

  public set size(newSize: number) {
    this._size = newSize;
  }

  public set currentColor(newColor: [number, number, number]) {
    this._currentColor = newColor;
  }

  public get position() {
    return this._pos;
  }

  public get velocity() {
    return this._v;
  }

  public get force() {
    return this._f;
  }

  public get mass() {
    return this._mass;
  }

  public get size() {
    return this._size;
  }

  public get currentColor() {
    return this._currentColor;
  }

  public get colorSelectionStrategy() {
    return this._colorSelectionStrategy;
  }

  // -------------- Getters and Setters -----------------

  getForce(otherBody: IMassiveBody): [number, number] {
    if (!this.position) return [0, 0];

    let [dx, dy] = [
      this.position[0] - otherBody.position[0],
      this.position[1] - otherBody.position[1],
    ];

    dx = dx * this._distanceScale;
    dy = dy * this._distanceScale;

    // Prevent shoooting into space
    const r = Math.max(Math.sqrt(dx * dx + dy * dy), 10);
    const rSqr = r * r;

    const force: [number, number] = [
      (G * otherBody.mass * this.mass * (dx / r)) / rSqr,
      (G * otherBody.mass * this.mass * (dy / r)) / rSqr,
    ];

    return force;
  }

  update(deltaTimeMs: number) {
    this.velocity = [
      this.velocity[0] + (this.force[0] / this._mass) * deltaTimeMs,
      this.velocity[1] + (this.force[1] / this._mass) * deltaTimeMs,
    ];
    this.position = [
      this.position[0] + (this.velocity[0] / this._mass) * deltaTimeMs,
      this.position[1] + (this.velocity[1] / this._mass) * deltaTimeMs,
    ];
    this._currentColor = this._colorSelectionStrategy.getNextHslClor(
      deltaTimeMs,
      this._currentColor
    );
    this._size = this._sizeChangeStrategy.getNextSize(deltaTimeMs, this._size);
    this._currentColor = this._colorSelectionStrategy.getNextHslClor(
      deltaTimeMs,
      this._currentColor
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    const [h, s, l] = this._currentColor;
    ctx.fillStyle = `hsl(${h},${s}%,${l}%)`;
    ctx.beginPath();
    ctx.arc(this.position[0], this.position[1], this._size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
