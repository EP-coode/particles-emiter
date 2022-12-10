export interface ISizeCahngeStrategy {
  getNextSize(deltaTimeMs: number, currentSize: number): number;
}
