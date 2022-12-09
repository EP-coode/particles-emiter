import { Particle } from "./Particle";
import { ISizeCahngeStrategy } from "./SizeChange/ISizeChangeStrategy";

export enum SpawnStrategy {
  AT_MOUSE = "at_mouse",
  RANDOM = "random",
}

export interface SystemConfig {
  particles: {
    count: number;
    render: boolean;
    spanwStrategy: SpawnStrategy;
    mouseForceMultipler: [number, number];
    enviromentForceMultipler: [number, number];
    sizeChangeStrategy: ISizeCahngeStrategy;
  };
  edges: {
    render: boolean;
  };
}

// const defaultConfig: SystemConfig = {
//   particles: {
//     count: 20,
//     enviromentForceMultipler: [0,0],
//     mouseForceMultipler: [1,1],
//     render: true,
//     sizeChangeStrategy: null,
//     spanwStrategy: null
//   }
//   edges: {
//     render: false,
//   },
// };

export class ParticlesSystem {
  private resizeObserver: ResizeObserver;
  private lastFrameTime?: number;
  private particles: Particle[];
  private ctx: CanvasRenderingContext2D | null;
  private state: "running" | "iddle";
  private animationFrame: number | null;

  constructor(private canvasContainer: HTMLDivElement) {
    const canvas = document.createElement("canvas");
    canvasContainer.appendChild(canvas);
    this.ctx = canvas.getContext("2d");
    this.resizeObserver = new ResizeObserver(() => {
      const boundingRect = canvasContainer.getBoundingClientRect();
      canvas.width = boundingRect.width;
      canvas.height = boundingRect.height;
    });
    this.resizeObserver.observe(canvasContainer);
    this.particles = [];
    this.state = "iddle";
    this.animationFrame = null;
  }

  private update() {
    if (!this.ctx) return;

    if (!this.lastFrameTime) {
      this.lastFrameTime = new Date().getTime();
    }

    const deltaT = Math.abs(new Date().getTime() - this.lastFrameTime);

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      particle.update(deltaT);
      particle.draw(this.ctx);
    }

    this.animationFrame = requestAnimationFrame(this.update);
  }

  dispose() {
    this.resizeObserver.disconnect();
  }

  start() {
    this.animationFrame = requestAnimationFrame(this.update);
  }

  stop() {
    this.state = "iddle";
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }
}
