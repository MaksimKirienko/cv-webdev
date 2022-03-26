let iosPermOrientationChecked = false
// eslint-disable-next-line prefer-const
let blockMouseMoveParallax = false

export default class Parallax {
  public parallaxPowerX: number
  public parallaxPowerY: number

  private _parallaxLayers: HTMLElement[]

  constructor (node: HTMLElement, parallaxPowerX: number = 12, parallaxPowerY: number = 3) {
    // ios check permitions
    node.addEventListener('click', () => {
      if (!window.iOS || iosPermOrientationChecked) {
        return
      }

      iosPermOrientationChecked = true
      // DeviceOrientationEvent.requestPermission()
    })

    this.parallaxPowerX = parallaxPowerX
    this.parallaxPowerY = parallaxPowerY

    this._parallaxLayers = Array.from(node.querySelectorAll('.parallax-layer'))

    if (window.iOS || window.android) {
      // window.addEventListener('deviceorientation', (e) => {
      //   blockMouseMoveParallax = true
      //   this.setParallaxLayers(e.gamma / 90 * parallaxPowerX, (Math.min(90, e.beta) - 90) / 90 * parallaxPowerY)
      // })
    } else {
      document.addEventListener('mousemove', (e) => {
        if (blockMouseMoveParallax) {
          return
        }

        const rect = node.getBoundingClientRect()

        if ((rect.top > window.innerHeight) || (rect.top < -node.clientHeight)) {
          return
        }

        const offsetX = (e.pageX - document.body.clientWidth / 2) / document.body.clientWidth * this.parallaxPowerX
        const offsetY = ((e.pageY - window.scrollY - rect.top) - document.body.clientHeight / 2) / document.body.clientHeight * this.parallaxPowerY
        this.setParallaxLayers(offsetX, offsetY)
      })
    }

    this.setParallaxLayers(0, 0)
  }

  setParallaxLayers(offsetX: number, offsetY: number) {
    this._parallaxLayers.forEach(l => {
      const prlxDepth = parseFloat(l.dataset.depth ?? '0')
      const tx = l.dataset.ofx ? `${offsetX * prlxDepth + parseFloat(l.dataset.ofx)}` : `${offsetX * prlxDepth}`
      l.style.transform = `translate(${tx}%, ${offsetY * prlxDepth}%)`
    })
  }
}
