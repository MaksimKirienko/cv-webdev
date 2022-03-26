export default class Ani {
  public fps: number = 60

  private _duration: number
  private _startTs: number = Date.now()
  private _lastFrameTs: number = Date.now()
  private _callback: Function
  private _resolve: Function | null = null
  private _stop: boolean = false
  private _delay: number = 1000 / this.fps

  constructor(duration: number = -1, callback: Function) {
    this._duration = duration
    this._callback = callback
  }

  async play(fps: number = 60) {
    if (fps) {
      this.fps = fps
      this._delay = 1000 / this.fps
    }
    return await new Promise((resolve) => {
      this._resolve = resolve
      window.requestAnimationFrame(() => {
        this._render()
      })
    })
  }

  _render() {
    if (this._stop) {
      this._stop = false
      return
    }

    const currentTime: number = Date.now()

    if (currentTime - this._lastFrameTs >= this._delay) {
      this._lastFrameTs = currentTime
      const progress: number = Math.min(1, (currentTime - this._startTs) / this._duration)

      const res = this._callback(progress)

      if (res === -1) {
        return
      }

      if (progress === 1 && this._resolve) {
        this._resolve('')
      } else {
        window.requestAnimationFrame(() => {
          this._render()
        })
      }
    } else {
      window.requestAnimationFrame(() => {
        this._render()
      })
    }
  }

  stop() {
    this._stop = true
  }
}
