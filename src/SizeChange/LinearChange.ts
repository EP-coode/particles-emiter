import { ISizeCahngeStrategy } from "./ISizeChangeStrategy";

export class LinearChange implements ISizeCahngeStrategy {
  constructor(
    private changePerSecond: number,
    public readonly initialSize: number
  ) {}

  getNextSize(deltaTimeMs: number, currentSize: number): number {
    return currentSize + (this.changePerSecond * deltaTimeMs) / 1000;
  }
}
