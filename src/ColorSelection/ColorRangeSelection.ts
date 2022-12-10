import { IColorSelectionStrategy } from "./IColorSelectionStrategy";

export class ColorRangeSelection implements IColorSelectionStrategy {
  getNextHslClor(
    deltaTime: number,
    currentColor: [number, number, number]
  ): [number, number, number] {
    throw new Error("Method not implemented.");
  }
}
