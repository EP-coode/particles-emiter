export interface IColorSelectionStrategy {
  getNextHslClor(
    deltaTime: number,
    currentHslColor: [number, number, number]
  ): [number, number, number];
}
