export class ScrollManager {
  constructor() {
    this.progress = 0;
    this.targetProgress = 0;
    this.ease = 0.08;

    window.addEventListener('wheel', (e) => {
      this.targetProgress += e.deltaY * 0.0005;
      this.targetProgress = Math.max(0, Math.min(1, this.targetProgress));
    }, { passive: true });
  }

  update() {
    this.progress += (this.targetProgress - this.progress) * this.ease;
    if (Math.abs(this.targetProgress - this.progress) < 0.001) {
      this.progress = this.targetProgress;
    }
    return this.progress;
  }
}