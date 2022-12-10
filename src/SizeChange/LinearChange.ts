import { ISizeCahngeStrategy } from "./ISizeChangeStrategy";

export class LinearChange implements ISizeCahngeStrategy {
  constructor(
    private changePerSecond: number,
  ) {}

  getNextSize(deltaTimeMs: number, currentSize: number): number {
    return currentSize + (this.changePerSecond * deltaTimeMs) / 1000;
  }
}
