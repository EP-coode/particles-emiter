import { IColorSelectionStrategy } from "./IColorSelectionStrategy";

export class ColorRangeSelection implements IColorSelectionStrategy {
  getHslColor(): [number, number, number] {
    throw new Error("Method not implemented.");
  }
  getRgbColor(): [number, number, number] {
    throw new Error("Method not implemented.");
  }
}
