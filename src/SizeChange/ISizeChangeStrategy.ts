import { Particle } from "../Particle";

export interface ISizeCahngeStrategy {
  getNewSize(particle: Particle): number;
}
