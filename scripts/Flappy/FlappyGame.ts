import CollisionDetails from 'collider2d/build/collision_details'
import { Bird, FlappyBg, PipeManager, CoinManager, Coin } from '.'
import { Render, Collider, GameObject } from '~/scripts/Engine'

enum FlappyGameStage {
  loading = 0,
  waiting = 1,
  game = 2,
  paused = 3,
  over = 4
}

export default class FlappyGame {
  public parent: HTMLElement
  public render: Render
  public collider: Collider

  public stage: Readonly<FlappyGameStage> = FlappyGameStage.loading
  private _saveStage: FlappyGameStage = FlappyGameStage.loading

  public worldPosition: number = 0
  public coinsCollected: Readonly<number> = 0
  public speed: number = 1
  public player: Bird | null = null
  public bg: FlappyBg | null = null
  public pipeManager: PipeManager | null = null
  public coinManager: CoinManager | null = null

  public preloaded: boolean = false

  public ticker: Function | null = null

  constructor(container: HTMLElement) {
    this.parent = container

    this.render = new Render(this.parent)
    this.render.addTick((deltaTime: number) => {
      this.tick(deltaTime)
    })

    this.collider = new Collider()

    this.preload()
      .then(() => {
        this.afterPreload()
      })
  }

  destroy() {
    this.render.destroy()
  }

  showFps(showFps: boolean) {
    this.render.showFps = showFps
  }

  async preload() {
    let imagesToPreload: any[] = [
      ['coin', require('~/assets/i/flappy/coin.svg')],
      ['city', require('~/assets/i/flappy/city.svg')],
      ['pipe-bg', require('~/assets/i/flappy/pipe-bg.png')],
      ['pipe-t', require('~/assets/i/flappy/pipe-t.png')],
      ['pipe-b', require('~/assets/i/flappy/pipe-b.svg')],
      ['player', require('~/assets/i/flappy/player.svg')]
    ]

    const imagesNoWebp: any[] = [
      // ['coin', require('~/assets/i/flappy/coin.svg')]
    ]

    const imagesWebp: any[] = [
      // ['coin', require('~/assets/i/flappy/coin.png?format=webp')]
    ]

    if (window?.webp) {
      imagesToPreload = imagesToPreload.concat(imagesWebp)
    } else {
      imagesToPreload = imagesToPreload.concat(imagesNoWebp)
    }

    return await this.render.loadImages(imagesToPreload)
  }

  afterPreload() {
    this.preloaded = true
    this.bg = new FlappyBg(this.render)
    this.player = new Bird(this.render)

    this.pipeManager = new PipeManager(this.render)
    this.coinManager = new CoinManager(this.render)

    this.pipeManager.tick()
    this.coinManager.generateCoins(this.pipeManager.pipePairs, true)

    this.render.stage.interactive = true

    this.render.stage.on('pointerdown', () => {
      this.click()
    })

    this.stage = FlappyGameStage.waiting
  }

  checkPlayerPipeCollision() {
    if (!this.pipeManager || !this.player) {
      return false
    }

    let collisionDetails

    for (let i = 0; i < this.pipeManager.pipePairs.length; i++) {
      const pipePair = this.pipeManager.pipePairs[i]
      collisionDetails = this.collider.rectangles(this.player as GameObject, pipePair[0] as GameObject)

      if (collisionDetails) {
        return [pipePair[0], collisionDetails]
      }

      collisionDetails = this.collider.rectangles(this.player as GameObject, pipePair[1] as GameObject)

      if (collisionDetails) {
        return [pipePair[1], collisionDetails]
      }
    }

    return false
  }

  checkPlayerCoinCollision() {
    if (!this.coinManager || !this.player) {
      return false
    }

    for (let i = 0; i < this.coinManager.coins.length; i++) {
      const coin = this.coinManager.coins[i]
      const collisionDetails = this.collider.rectangles(this.player as GameObject, coin as GameObject)

      if (collisionDetails) {
        return [coin, collisionDetails]
      }
    }

    return false
  }

  tick(deltaTime: number) {
    if (!this.stage || !this.player || !this.pipeManager || !this.coinManager) {
      return
    }

    if (this.stage === FlappyGameStage.game) {
      // collision pipes
      const playerPipeCollision = this.checkPlayerPipeCollision()

      if (playerPipeCollision) {
        const overlap = (playerPipeCollision[1] as CollisionDetails).overlapV
        this.speed = Math.max(1, (this.speed - 0.8) * 0.7)

        if (overlap.x > 0) { // hit right
          this.speed = -0.3
          // this.worldPosition += deltaTime * 1.5 * this.speed
        }
        // this.worldPosition -= overlap.x

        if (overlap.y > 0) {
          this.player.hitBottom(this.player.y - overlap.y)
        }

        if (overlap.y < 0) {
          this.player.hitTop(this.player.y - overlap.y)
        }
      } else { // no pipe collision - move forward
        // eslint-disable-next-line no-lonely-if
        if (this.speed < 3) {
          this.speed += deltaTime * 0.011
        } else {
          this.speed -= deltaTime * 0.004
        }
      }

      this.worldPosition += deltaTime * 1.5 * this.speed

      const playerCoinCollision = this.checkPlayerCoinCollision()

      if (playerCoinCollision) {
        this.coinsCollected += 1
        this.coinManager.removeCoin(playerCoinCollision[0] as Coin)
        this.speed = Math.min(5, this.speed + 0.3)
      }

      this.player.tick(deltaTime)
      this.pipeManager.tick()
      this.coinManager.updateCoins(this.pipeManager.pipePairs)
    }

    this.player.x = this.worldPosition + this.render.screen.width / 4
    this.render.cameraPosition[0] = this.worldPosition
    this.render.updateCamera()

    this.bg?.setPositionX(-this.player.x / 4)

    if (this.ticker) {
      this.ticker()
    }
  }

  click() {
    if (this.stage === FlappyGameStage.waiting) {
      this.stage = FlappyGameStage.game
    }

    if (this.stage === FlappyGameStage.game) {
      if (this.player) {
        this.player.vSpeed = 6 + this.player.vSpeed * 0.3
      }
    }
  }

  pause() {
    this._saveStage = this.stage
    this.stage = FlappyGameStage.paused
  }

  unpause() {
    this.stage = this._saveStage
  }

  reset() {
    this.worldPosition = 0
    this.coinsCollected = 0
    this.render.cameraPosition[0] = this.worldPosition

    if (this.player) {
      this.player.setPosition(
        this.worldPosition + this.render.screen.width / 4,
        this.render.screen.height / 2
      )
    }
    this.pipeManager?.clearAll()
    this.coinManager?.clearAll()

    this.pipeManager?.tick()
    if (this.pipeManager) {
      this.coinManager?.generateCoins(this.pipeManager.pipePairs, true)
    }

    this.speed = 1

    if (this.preloaded) {
      this.stage = FlappyGameStage.waiting
    } else {
      this.stage = FlappyGameStage.loading
    }
  }
}
