import { ParticlesSystem } from "../ParticlesSystem";

const canvas = document.querySelector("#main-canvas") as HTMLCanvasElement;

if (canvas) {
  const ps = new ParticlesSystem(canvas, {});
  ps.start()
}

export default null;
