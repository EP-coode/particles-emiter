import { G } from "../ParticlesSystem";
import { IForceSource } from "./IForceSource";

export class AmbientForce implements IForceSource {
  constructor(private value: [number, number]) {}

  getForce(): [number, number] {
    return [this.value[0] * G, this.value[1] * G];
  }
}
