import { ColorRangeSelection } from "./ColorSelection/ColorRangeSelection";
import { ISizeCahngeStrategy } from "./SizeChange/ISizeChangeStrategy";

export class Particle {
  constructor(
    private _size: number,
    private _pos: [number, number] = [0, 0],
    private _v: [number, number] = [0, 0],
    private _f: [number, number] = [0, 0],
    private _colorSelection = new ColorRangeSelection(),
    private _sizeChangeStrategy: ISizeCahngeStrategy
  ) {}

  // -------------- Getters and Setters -----------------
  public set position(position: [number, number]) {
    this._pos = position;
  }

  public set velocity(velocity: [number, number]) {
    this._v = velocity;
  }

  public set force(force: [number, number]) {
    this._f = force;
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
  // -------------- Getters and Setters -----------------

  // isVisable(ps: ParticlesSystem): boolean {}

  update(deltaTime: number) {}

  draw(ctx: CanvasRenderingContext2D) {
    const [h, s, l] = this._colorSelection.getHslColor();
    ctx.fillStyle = `hsl(${h},${s},${l})`;
    ctx.beginPath();
    ctx.arc(this.position[0], this.position[1], this._size, 0, Math.PI * 2);
    ctx.fill();
  }
}
