import { IColorSelectionStrategy } from "./IColorSelectionStrategy";

export class ColorRangeSelection implements IColorSelectionStrategy {
  constructor(
    private startColorHsl: [number, number, number],
    private hueStart: number,
    private hueEnd: number,
    private hueStepPerSecond: number
  ) {}
  getInitialColor(): [number, number, number] {
    return [
      this.startColorHsl[0],
      this.startColorHsl[1],
      this.startColorHsl[2],
    ];
  }
  getNextHslClor(
    deltaTime: number,
    [h, s, l]: [number, number, number]
  ): [number, number, number] {
    const hueDelta = this.hueStepPerSecond * (deltaTime / 1000);
    const startToCurrentDistance =
      this.hueStart < h ? h - this.hueStart : 360 + h - this.hueStart;
    const startToEndDistance =
      this.hueStart < this.hueEnd
        ? this.hueEnd - this.hueStart
        : 360 + this.hueEnd - this.hueStart;
    const newHue =
      ((startToCurrentDistance + hueDelta) % startToEndDistance) +
      this.hueStart;
    return [newHue, s, l];
  }
}
