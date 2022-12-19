export class Mouse {
  private _relativePosition?: [number, number];
  private _position?: [number, number];
  constructor(private relativeTo: HTMLElement) {}

  private onMouseMove = ({ clientX, clientY }: MouseEvent) => {
    const { top, left } = this.relativeTo.getBoundingClientRect();
    this._relativePosition = [clientX - left, clientY - top];
    this._position = [clientX, clientY];
  };

  private onScroll = () => {
    if (!this._relativePosition) return;
    const { top, left } = this.relativeTo.getBoundingClientRect();

    this._relativePosition[0] = Math.max(this._position[0] - left, 0);
    this._relativePosition[1] = Math.max(this._position[1] - top, 0);
  };

  public get position() {
    return this._relativePosition;
  }

  observePositionChange() {
    this.relativeTo.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("scroll", this.onScroll);
  }

  unObservePositionChange() {
    this._relativePosition = undefined;
    this.relativeTo.removeEventListener("mousemove", this.onMouseMove);
    window.addEventListener("scroll", this.onScroll);
  }
}
