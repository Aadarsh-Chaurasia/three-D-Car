// ScrollController.js
export class ScrollController {
  constructor() {
    this.progress = 0;
    this.target = 0;

    window.addEventListener('wheel', (e) => {
      this.target += e.deltaY * 0.0006;
      this.target = Math.max(0, Math.min(1, this.target));
    }, { passive: true });
  }

  update() {
    this.progress += (this.target - this.progress) * 0.09;
    return this.progress;
  }
}