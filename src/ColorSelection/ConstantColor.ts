import { IColorSelectionStrategy } from "./IColorSelectionStrategy";

export class ConstantColor implements IColorSelectionStrategy {
  constructor(private hslaColor: [number, number, number]) {}
  getInitialColor(): [number, number, number] {
    return this.hslaColor;
  }
  getNextHslClor(): [number, number, number] {
    return this.hslaColor;
  }
}
