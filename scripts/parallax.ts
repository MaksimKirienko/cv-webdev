// let iosPermOrientationChecked = false
// eslint-disable-next-line prefer-const
let blockMouseMoveParallax = false

export default class Parallax {
  public parallaxPowerX: number
  public parallaxPowerY: number

  private _parallaxLayers: HTMLElement[]
  private _lastMouseX: number = 0
  private _lastMouseY: number = 0
  private _node: HTMLElement
  private _ticking = false

  constructor (node: HTMLElement, parallaxPowerX: number = 12, parallaxPowerY: number = 3) {
    // ios check permitions
    // node.addEventListener('click', () => {
    //   if (!window.iOS || iosPermOrientationChecked) {
    //     return
    //   }

    //   iosPermOrientationChecked = true
    //   // DeviceOrientationEvent.requestPermission()
    // })

    this._node = node
    this.parallaxPowerX = parallaxPowerX
    this.parallaxPowerY = parallaxPowerY

    this._parallaxLayers = Array.from(node.querySelectorAll('.parallax-layer'))

    if (window.iOS || window.android) {
      // window.addEventListener('deviceorientation', (e) => {
      //   blockMouseMoveParallax = true
      //   this.setParallaxLayers(e.gamma / 90 * parallaxPowerX, (Math.min(90, e.beta) - 90) / 90 * parallaxPowerY)
      // })
    } else {
      document.addEventListener('mousemove', this.update.bind(this))
      document.addEventListener('scroll', this.update.bind(this), { passive: true })
    }

    // this.setParallaxLayers(0, 0)
  }

  destroy() {
    document.removeEventListener('mousemove', this.update)
    document.removeEventListener('scroll', this.update)
  }

  update(e: Event) {
    if (this._ticking) {
      return
    }
    this._ticking = true

    window?.requestAnimationFrame(() => {
      this._ticking = false

      if (blockMouseMoveParallax) {
        return
      }

      const rect = this._node.getBoundingClientRect()
      if ((rect.top > window.innerHeight) || (rect.top < -this._node.clientHeight)) {
        return
      }

      let x, y

      if (e instanceof MouseEvent) {
        x = e.clientX
        y = e.clientY
      } else {
        x = this._lastMouseX
        y = this._lastMouseY
      }

      const offsetX = (x / document.body.clientWidth - 0.5) * this.parallaxPowerX
      const offsetY = ((y - rect.top) / document.body.clientHeight - 0.5) * this.parallaxPowerY
      this.setParallaxLayers(offsetX, offsetY)

      if (e instanceof MouseEvent) {
        this._lastMouseX = e.pageX
        this._lastMouseY = e.clientY
      }
    })
  }

  setParallaxLayers(offsetX: number, offsetY: number) {
    this._parallaxLayers.forEach(l => {
      const prlxDepth = parseFloat(l.dataset.depth ?? '0')
      const tx = l.dataset.ofx ? `${offsetX * prlxDepth + parseFloat(l.dataset.ofx)}` : `${offsetX * prlxDepth}`
      l.style.transform = `translate(${tx}%, ${offsetY * prlxDepth}%)`
    })
  }
}
