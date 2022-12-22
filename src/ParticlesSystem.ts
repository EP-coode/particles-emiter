import { ColorRangeSelection } from "./ColorSelection/ColorRangeSelection";
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
  mouse: {
    forceMultipler: [number, number];
    mass: number;
    render: boolean;
  };
  particles: {
    count: number;
    render: boolean;
    spanwStrategy: SpawnStrategy;
    sizeChangeStrategy: ISizeCahngeStrategy;
    colorChangeStrategy: IColorSelectionStrategy;
    avgMass: number;
    respanwSpeedRange: number;
    respanwSizeRange: number;
  };
  edges: {
    render: boolean;
  };
  ambientForce?: [number, number];
  speed: number;
  distanceScale: number;
}

export const defaultConfig: SystemConfig = {
  mouse: {
    forceMultipler: [1, 1],
    mass: 10,
    render: false,
  },
  particles: {
    count: 1000,
    render: true,
    sizeChangeStrategy: new LinearChange(-15),
    colorChangeStrategy: new ColorRangeSelection([49, 100, 50], 0, 50, -50),
    spanwStrategy: SpawnStrategy.AT_MOUSE,
    avgMass: 10,
    respanwSpeedRange: 10,
    respanwSizeRange: 10,
  },
  edges: {
    render: false,
  },
  ambientForce: [0.4, -0.3],
  speed: 0.5,
  distanceScale: 1,
};

/* TODO:
  3. edges
*/
export class ParticlesSystem {
  private resizeObserver: ResizeObserver;
  private lastFrameTime?: number;
  private particles: Particle[];
  private ctx: CanvasRenderingContext2D | null;
  // private state: "running" | "iddle";
  private animationFrame: number | null;
  private forceSources: IForceSource[];
  private config: SystemConfig;
  private mouse: Mouse;
  private canRespawn: boolean;

  constructor(
    private canvas: HTMLCanvasElement,
    config: Partial<SystemConfig>
  ) {
    this.config = Object.assign({}, defaultConfig, config);
    this.ctx = canvas.getContext("2d");

    // ADJUST CANVAS RESOLUTION ON SIZE CHANGE
    this.resizeObserver = new ResizeObserver(() => {
      const boundingRect = canvas.getBoundingClientRect();
      canvas.width = boundingRect.width;
      canvas.height = boundingRect.height;
    });
    this.resizeObserver.observe(canvas);

    this.canRespawn = false;
    // this.state = "iddle";
    this.animationFrame = null;
    this.particles = [];
    this.forceSources = [];

    const massiveMouse = new MassiveMouse(
      canvas,
      this.config.mouse.mass,
      this.config.mouse.forceMultipler,
      defaultConfig.distanceScale
    );
    this.mouse = massiveMouse;

    // GENERATE PARTICLES
    for (let i = 0; i < this.config.particles.count; i++) {
      const particle = new Particle(
        this.config.particles.colorChangeStrategy.getInitialColor(),
        0,
        10,
        [-1000, -1000],
        [-1000, -1000],
        [-1000, -1000],
        this.config.particles.colorChangeStrategy,
        this.config.particles.sizeChangeStrategy,
        defaultConfig.distanceScale
      );

      this.particles.push(particle);
      this.respawnParticle(particle);
    }

    // ADD FORCE SOURCE
    if (this.config.ambientForce) {
      this.forceSources.push(new AmbientForce(this.config.ambientForce));
    }

    if (this.config.mouse.mass != 0) this.forceSources.push(massiveMouse);
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

  private starved(particle: Particle): boolean {
    return particle.size < 0;
  }

  private respawnParticle(particle: Particle) {
    const {
      particles: { spanwStrategy, respanwSizeRange },
    } = this.config;
    // PREVENT PULSING
    // TODO: Distribution system
    particle.size = respanwSizeRange - (Math.random() * respanwSizeRange) / 2;

    switch (spanwStrategy) {
      case SpawnStrategy.AT_MOUSE:
        particle.position = this.mouse.position ?? [0, 0];
        break;
      case SpawnStrategy.RANDOM:
        const { width, height } = this.canvas;
        particle.position = [width * Math.random(), height * Math.random()];
    }
    particle.force = [0, 0];
    const speedRange = this.config.particles.respanwSpeedRange;
    particle.velocity = [
      Math.random() * speedRange - speedRange / 2,
      Math.random() * speedRange - speedRange / 2,
    ];
    particle.currentColor = particle.colorSelectionStrategy.getInitialColor();
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
      const notRendereble = !this.isVisable(particle) || this.starved(particle);
      if (notRendereble && this.canRespawn) this.respawnParticle(particle);
      if (!notRendereble) particle.draw(this.ctx);
      particle.force = this.getNetForce(particle);
      particle.update(deltaT);
    }

    if (this.config.mouse.render) this.renderMouse();

    this.lastFrameTime = new Date().getTime();
    this.animationFrame = requestAnimationFrame(this.update.bind(this));
  }

  setRespanw(canRespawn = true) {
    this.canRespawn = canRespawn;
  }

  dispose() {
    this.resizeObserver.disconnect();
  }

  start() {
    this.mouse.observePositionChange();
    this.animationFrame = requestAnimationFrame(this.update.bind(this));
    // this.state = "running";
  }

  stop() {
    this.mouse.unObservePositionChange();
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    // this.state = "iddle";
  }
}
