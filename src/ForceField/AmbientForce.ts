import { G } from "../ParticlesSystem";
import { IForceSource } from "./IForceSource";
import { IMassiveBody } from "./IMassiveBody";

export class AmbientForce implements IForceSource {
  constructor(private value: [number, number]) {}

  getForce(otherBody: IMassiveBody): [number, number] {
    return [this.value[0] * G, this.value[1] * G];
  }
}
