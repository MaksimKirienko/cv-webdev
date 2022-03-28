import * as PIXI from 'pixi.js'
import { GameObject, Render } from '../Engine'
import { Pipe } from '.'

export class Coin extends GameObject {
  private _sprite: PIXI.AnimatedSprite | null

  constructor(render: Render) {
    super(render, 'coin')
    this.setSize(38, 38)
    this.setPivot(19, 19)

    this._sprite = render.createAnimatedSprite('coin', 14, [256, 256])

    if (this._sprite) {
      this._sprite.width = this.width
      this._sprite.height = this.height
      this._sprite.animationSpeed = 0.3
      this._sprite.play()
      this.contaner.addChild(this._sprite)
    }

    this.zIndex = 9

    this.addOnStage()
  }
}

export class CoinManager {
  public render: Render
  public coins: Coin[] = []

  constructor(render: Render) {
    this.render = render
  }

  updateCoins(pipePairs: [Pipe, Pipe][]) {
    this.clearCoins()
    this.generateCoins(pipePairs)
  }

  findCoins(x: number) {
    return this.coins.filter(c => Math.abs(c.x - x) < 19)
  }

  generateCoins(pipePairs: [Pipe, Pipe][], forAllPipes: boolean = false) {
    if (!this.render) {
      return
    }

    let positionsForCoins: [number, number][] = []

    // get positions from pipes
    for (let i = 1; i < pipePairs.length; i++) {
      if (!forAllPipes) {
        if (pipePairs[i - 1][0].x < this.render.cameraPosition[0] + this.render.screen.width) { // don't generate for pipes on stage
          continue
        }
      }

      const y1 = pipePairs[i - 1][0].y + (pipePairs[i - 1][1].y - pipePairs[i - 1][0].y) / 2
      const y2 = pipePairs[i][0].y + (pipePairs[i][1].y - pipePairs[i][0].y) / 2

      positionsForCoins.push([
        pipePairs[i - 1][0].x,
        y1 + (Math.random() - 0.5) * 120
      ])

      positionsForCoins.push([
        (pipePairs[i - 1][0].x + pipePairs[i][0].x) / 2,
        y1 + (y2 - y1) * 0.35
      ])
    }

    // remove positions where coins already set
    positionsForCoins = positionsForCoins.filter(cp => {
      const coinsNear = this.findCoins(cp[0])
      return !coinsNear.length
    })

    // add coins
    positionsForCoins.forEach(cp => {
      if (this.coins.length > 10) {
        console.log('coin limit')
        return
      }
      const coin = new Coin(this.render)
      coin.setPosition(...cp)
      this.coins.push(coin)
    })
  }

  removeCoin(coin: Coin) {
    this.coins = this.coins.filter(c => {
      const cNear = Math.abs(c.x - coin.x) < 19
      if (cNear) {
        c.destroy()
      }
      return !cNear
    })
  }

  clearCoins() {
    this.coins = this.coins.filter(coin => {
      if (coin.x < this.render.cameraPosition[0] - coin.width / 2) {
        coin.destroy()
        return false
      }
      return true
    })
  }

  clearAll() {
    this.coins.forEach(coin => {
      coin.destroy()
    })
    this.coins = []
  }
}
