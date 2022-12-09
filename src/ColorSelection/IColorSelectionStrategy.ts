export interface IColorSelectionStrategy {
  getHslColor(): [number, number, number];
  getRgbColor(): [number, number, number];
}
