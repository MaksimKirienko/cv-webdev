import { Ani } from './Ani'
import { Sprite } from './Sprite'

export class Effect {
  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D | null
  private _sizePx: [number, number]

  constructor(parent: HTMLElement, sizePx: [number, number]) {
    this._canvas = document.createElement('canvas')
    this._ctx = this._canvas?.getContext('2d')
    this._sizePx = sizePx

    if (!this._ctx) {
      return
    }

    this._canvas.classList.add('game-effect')
    this._canvas.style.width = sizePx[0] + "px";
    this._canvas.style.height = sizePx[1] + "px";
    this._canvas.width = sizePx[0] * 2
    this._canvas.height = sizePx[1] * 2

    this._ctx.scale(2, 2)

    parent.appendChild(this._canvas)
  }

  _removeSelf() {
    this._canvas.remove()
  }

  _drawStar(r: number) {
    if (!this._ctx) {
      return
    }

    const vrtx = 8
    this._ctx.save()
    this._ctx.beginPath()
    this._ctx.moveTo(r, 0)

    for (var i = 0; i < (vrtx * 2 - 1); i++) {
      this._ctx.rotate(Math.PI / vrtx)
      if (i % 2 === 0) {
        this._ctx.lineTo(r * 0.5, 0)
      } else {
        this._ctx.lineTo(r, 0)
      }
    }

    this._ctx.closePath()
    this._ctx.fill()
    this._ctx.restore()
  }

  async blow(position: [number, number], color: string, duration: number = 300) {
    if (!this._ctx) {
      return
    }

    this._canvas.style.transform = `translate(${ position[0] - this._sizePx[0] * 0.5 }px, ${ position[1] - this._sizePx[1] * 0.5 }px)`

    const numCircles = 5
    const maxRadius = 5
    const maxDistance = (this._sizePx[0] * 0.5 - maxRadius * 0.5) * 0.95

    this._ctx.fillStyle = color

    const animation = new Ani(duration, (percentage: number) => {
      if (!this._ctx) {
        return
      }

      const distance = maxDistance * (percentage * 0.8 + 0.2)

      this._ctx.clearRect(0, 0, this._sizePx[0], this._sizePx[1])
      this._ctx.globalAlpha = Math.min(1, (1 - percentage) * 2)

      for (let c = 0; c < numCircles; c++) {
        const angle = (90 + (360 / numCircles) * c) * Math.PI / 180
        let deltaPositionX = Math.cos(angle) * distance
        let deltaPositionY = Math.sin(angle) * distance

        // fall force
        deltaPositionY -= Math.sin(percentage * Math.PI * 3 / 2) * 15

        // this._ctx.beginPath()
        // this._ctx.arc(
        //   deltaPositionX + this._sizePx[0] * 0.5,
        //   deltaPositionY + this._sizePx[1] * 0.5,
        //   maxRadius/2,
        //   0,
        //   2 * Math.PI
        // )
        // this._ctx.fill()
        // this._ctx.closePath()

        this._ctx.save()
        this._ctx.translate(
          deltaPositionX + this._sizePx[0] * 0.5,
          deltaPositionY + this._sizePx[1] * 0.5
        )
        this._drawStar(maxRadius * (0.5 + percentage * 0.5))
        this._ctx.restore()
      }
    })

    return await animation.play(24)
      .then(() => {
        this._removeSelf()
      })
  }

  static async lightning(parent: HTMLElement, start: [number, number], end: [number, number]) {
    const frameProportion = 400 / 1000
    const node = document.createElement('div')
    const dx = start[0] - end[0]
    const dy = start[1] - end[1]
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * 180 / Math.PI

    node.classList.add('game-effect')
    node.style.setProperty('mix-blend-mode', 'screen')
    node.style.height = length + 'px'
    node.style.width = (length * frameProportion) + 'px'
    node.style.transformOrigin = 'top center'
    node.style.transform = `translate(${ start[0] - length * frameProportion / 2 }px, ${ start[1] }px) rotate(${ angle + 90 }deg)`

    parent.appendChild(node)

    const sprite = new Sprite(
      node,
      'lightning.png',
      [200, 500],
      [1800, 500],
      {
        default: { col: 0, row: 0, steps: 9, duration: 600 }
      }
    )

    return await sprite.play('default', true)
      .then(() => {
        node.remove()
      })
  }

  static comboConnect(parent: HTMLElement, start: [number, number], end: [number, number]) {
    const frameProportion = 1500 / 1000
    const node = document.createElement('div')
    const dx = start[0] - end[0]
    const dy = start[1] - end[1]
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * 180 / Math.PI

    node.classList.add('game-effect')
    node.style.setProperty('mix-blend-mode', 'screen')
    node.style.height = length + 'px'
    node.style.width = (length * frameProportion) + 'px'
    node.style.transformOrigin = 'top center'
    node.style.transform = `translate(${ start[0] - length * frameProportion / 2 }px, ${ start[1] }px) rotate(${ angle + 90 }deg)`
    node.style.zIndex = '4'

    parent.appendChild(node)

    const sprite = new Sprite(
      node,
      'lightning.png',
      [200, 500],
      [1800, 500],
      {
        default: { col: 2, row: 0, steps: 5, duration: 240 }
      }
    )

    sprite.play('default')
    return sprite
  }

  static async blowBomb(parent: HTMLElement, position: [number, number], sizePx: number) {
    const node = document.createElement('div')
    node.classList.add('game-effect')
    // node.style.setProperty('mix-blend-mode', 'screen')
    node.style.height = sizePx + 'px'
    node.style.width = sizePx + 'px'
    node.style.transformOrigin = 'center'
    node.style.transform = `translate(${ position[0] - sizePx / 2 }px, ${ position[1] - sizePx / 2 }px)`

    parent.appendChild(node)

    const sprite = new Sprite(node, 'blow.png', [256, 256], [2304, 512],
      {
        default: sizePx <= 120 ?
                { col: 0, row: 0, steps: 9, duration: 270 } :
                { col: 0, row: 1, steps: 9, duration: 350 }
      }
    )

    return await sprite.play('default', true)
      .then(() => {
        node.remove()
      })
  }
}
