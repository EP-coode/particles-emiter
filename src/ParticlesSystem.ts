import { ConstantColor } from "./ColorSelection/ConstantColor";
import { IColorSelectionStrategy } from "./ColorSelection/IColorSelectionStrategy";
import { AmbientForce } from "./ForceField/AmbientForce";
import { IForceSource } from "./ForceField/IForceSource";
import { IMassiveBody } from "./ForceField/IMassiveBody";
import { MassiveMouse } from "./Mouse/MassiveMouse";
import { Mouse } from "./Mouse/Mouse";
import { Particle } from "./Particle";
import { ISizeCahngeStrategy } from "./SizeChange/ISizeChangeStrategy";
import { LinearChange } from "./SizeChange/LinearChange";

export enum SpawnStrategy {
  AT_MOUSE = "at_mouse",
  RANDOM = "random",
}

export const G = 1;

export interface SystemConfig {
  particles: {
    count: number;
    render: boolean;
    spanwStrategy: SpawnStrategy;
    mouseForceMultipler: [number, number];
    sizeChangeStrategy: ISizeCahngeStrategy;
    colorChangeStrategy: IColorSelectionStrategy;
  };
  edges: {
    render: boolean;
  };
  ambientForce?: [number, number];
  speed: number;
}

const defaultConfig: SystemConfig = {
  particles: {
    count: 5000,
    mouseForceMultipler: [-1, -1],
    render: true,
    sizeChangeStrategy: new LinearChange(0, 10),
    colorChangeStrategy: new ConstantColor([250, 100, 50]),
    spanwStrategy: SpawnStrategy.AT_MOUSE,
  },
  edges: {
    render: false,
  },
  ambientForce: [0, 0.5],
  speed: 0.5,
};

/* TODO:
  2. initialization
  3. edges
*/
export class ParticlesSystem {
  private resizeObserver: ResizeObserver;
  private lastFrameTime?: number;
  private particles: Particle[];
  private ctx: CanvasRenderingContext2D | null;
  private state: "running" | "iddle";
  private animationFrame: number | null;
  private forceSources: IForceSource[];
  private config: SystemConfig;
  private mouse: Mouse;

  constructor(
    private canvas: HTMLCanvasElement,
    config: Partial<SystemConfig>
  ) {
    this.config = Object.assign({}, defaultConfig, config);
    this.ctx = canvas.getContext("2d");

    this.resizeObserver = new ResizeObserver(() => {
      const boundingRect = canvas.getBoundingClientRect();
      canvas.width = boundingRect.width;
      canvas.height = boundingRect.height;
    });
    // canvas.addEventListener();
    const massiveMouse = new MassiveMouse(
      canvas,
      5,
      this.config.particles.mouseForceMultipler
    );
    this.mouse = massiveMouse;
    this.resizeObserver.observe(canvas);
    this.particles = [];

    for (let i = 0; i < this.config.particles.count; i++) {
      const particle = new Particle(
        [100, 100, 500],
        10,
        10,
        [0, 0],
        [0, 0],
        [0, 0],
        this.config.particles.colorChangeStrategy,
        this.config.particles.sizeChangeStrategy
      );

      this.particles.push(particle);
      this.respawnParticle(particle);
    }

    this.state = "iddle";
    this.animationFrame = null;

    this.forceSources = [];
    if (this.config.ambientForce) {
      this.forceSources.push(new AmbientForce(this.config.ambientForce));
    }

    this.forceSources.push(massiveMouse);
  }

  private getNetForce(masiveBody: IMassiveBody): [number, number] {
    const [fx, fy] = this.forceSources
      .filter((fs) => !Object.is(fs, masiveBody))
      .reduce(
        (acc, fs) => {
          const [fx, fy] = fs.getForce(masiveBody);
          return [acc[0] + fx, acc[1] + fy];
        },
        [0, 0]
      );

    return [fx, fy];
  }

  private isVisable(particle: Particle): boolean {
    if (particle.position[0] < 0 || particle.position[1] < 0) return false;
    const { width, height } = this.canvas;
    if (particle.position[0] > width || particle.position[1] > height)
      return false;
    return true;
  }

  private respawnParticle(particle: Particle, randomnessScale = 10) {
    const {
      particles: {
        spanwStrategy,
        sizeChangeStrategy: { initialSize },
      },
    } = this.config;
    particle.size = initialSize;
    switch (spanwStrategy) {
      case SpawnStrategy.AT_MOUSE:
        const [mx, my] = this.mouse.position ?? [0, 0];
        particle.position = [
          mx + Math.random() * randomnessScale - randomnessScale / 2,
          my + Math.random() * randomnessScale - randomnessScale / 2,
        ];
        break;
      case SpawnStrategy.RANDOM:
        const { width, height } = this.canvas;
        particle.position = [width * Math.random(), height * Math.random()];
    }
    particle.force = [
      Math.random() * randomnessScale - randomnessScale / 2,
      Math.random() * randomnessScale - randomnessScale / 2,
    ];
    particle.velocity = [
      Math.random() * randomnessScale - randomnessScale / 2,
      Math.random() * randomnessScale - randomnessScale / 2,
    ];
  }

  private renderMouse() {
    if (!this.ctx || !this.mouse) return;
    if (!this.mouse.position) return;
    this.ctx.fillStyle = `hsl(10,100%,50%)`;
    this.ctx.beginPath();
    this.ctx.arc(
      this.mouse.position[0],
      this.mouse.position[1],
      10,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  private update() {
    if (!this.ctx) return;

    if (!this.lastFrameTime) {
      this.lastFrameTime = new Date().getTime();
    }

    const deltaT =
      Math.abs(new Date().getTime() - this.lastFrameTime) * this.config.speed;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      if (!this.isVisable(particle)) this.respawnParticle(particle);
      particle.force = this.getNetForce(particle);
      particle.update(deltaT);
      particle.draw(this.ctx);
    }

    this.renderMouse();

    this.lastFrameTime = new Date().getTime();
    this.animationFrame = requestAnimationFrame(this.update.bind(this));
  }

  dispose() {
    this.resizeObserver.disconnect();
  }

  start() {
    this.mouse.observePositionChange();
    this.animationFrame = requestAnimationFrame(this.update.bind(this));
    this.state = "running";
  }

  stop() {
    this.mouse.unObservePositionChange();
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.state = "iddle";
  }
}
