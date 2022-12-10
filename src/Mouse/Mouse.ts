export class Mouse {
  private onPositionChange = ({ clientX, clientY }: MouseEvent) => {
    const { top, left } = this.relativeTo.getBoundingClientRect();
    this._position = [clientX - left, clientY - top];
  };
  private _position?: [number, number];

  constructor(private relativeTo: HTMLElement) {}

  public get position() {
    return this._position;
  }

  observePositionChange() {
    this.relativeTo.addEventListener("mousemove", this.onPositionChange);
  }

  unObservePositionChange() {
    this._position = undefined;
    this.relativeTo.removeEventListener("mousemove", this.onPositionChange);
  }
}
