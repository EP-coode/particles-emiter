export interface ISizeCahngeStrategy {
  readonly initialSize: number;
  getNextSize(deltaTimeMs: number, currentSize: number): number;
}
