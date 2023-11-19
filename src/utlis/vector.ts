export function randomNormal2Dvector(): [number, number] {
  const vecX = Math.random() - 0.5;
  const vecY = Math.random() - 0.5;

  const vecLen = Math.sqrt(vecX * vecX + vecY * vecY);

  return [vecX / vecLen, vecY / vecLen];
}
