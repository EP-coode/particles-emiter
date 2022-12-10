import { IMassiveBody } from "./IMassiveBody";

export interface IForceSource {
  getForce(otherBody: IMassiveBody): [number, number];
}
