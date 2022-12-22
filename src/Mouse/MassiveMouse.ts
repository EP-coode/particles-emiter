import { IForceSource } from "../ForceField/IForceSource";
import { IMassiveBody } from "../ForceField/IMassiveBody";
import { G } from "../ParticlesSystem";
import { Mouse } from "./Mouse";

export class MassiveMouse extends Mouse implements IForceSource {
  constructor(
    relativeTo: HTMLElement,
    private mass: number,
    private forceMultipler: [number, number],
    private distanceScale: number
  ) {
    super(relativeTo);
  }

  getForce(otherBody: IMassiveBody): [number, number] {
    if (!this.position) return [0, 0];

    let [dx, dy] = [
      this.position[0] - otherBody.position[0],
      this.position[1] - otherBody.position[1],
    ];

    dx = dx * this.distanceScale;
    dy = dy * this.distanceScale;

    // Prevent shoooting into space
    const r = Math.max(Math.sqrt(dx * dx + dy * dy), 10);
    const rSqr = r * r;

    const force: [number, number] = [
      (G * this.forceMultipler[0] * otherBody.mass * this.mass * (dx / r)) /
        rSqr,
      (G * this.forceMultipler[1] * otherBody.mass * this.mass * (dy / r)) /
        rSqr,
    ];

    return force;
  }
}
