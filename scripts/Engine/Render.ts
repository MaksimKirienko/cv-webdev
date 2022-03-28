import * as PIXI from 'pixi.js'
import { GameObject, GameObjectPosition } from '~/scripts/Engine'

export class Render extends PIXI.Application {
  public parent: HTMLElement
  private _loader: PIXI.Loader | null = null
  public dpr: Readonly<number>

  public showFps: boolean = false
  public fpsText: PIXI.Text | null = null

  private _objects: GameObject[] = []

  private _tickCallbacks: Function[] = []
  private _resizeCallbacks: Function[] = []

  public cameraPosition: [number, number] = [0, 0]

  constructor(container: HTMLElement) {
    super({
      autoDensity: true,
      backgroundAlpha: 0,
      // antialias: true,
      resolution: window.devicePixelRatio,
      resizeTo: container
    })

    this.parent = container
    this.dpr = window.devicePixelRatio

    this.parent.appendChild(this.view)

    this._loader = new PIXI.Loader()

    this.createFpsText()

    this.ticker.maxFPS = 120
    this.ticker.add(() => { this.renderTick() })

    window.addEventListener('resize', () => {
      this.resizeRun()
    })
  }

  destroy() {
    // this.parent.removeChild(this.view)
    // this.ticker.destroy()
    // this.ticker = null as any
    // this.stage.destroy(true)
    // this.stage = null as any
    // this.renderer.destroy(true)
    // this.renderer = null as any

    PIXI.utils.clearTextureCache()

    super.destroy(true, {
      children: true,
      texture: true,
      baseTexture: true
    })
  }

  resizeRun() {
    this?._resizeCallbacks?.forEach(cb => {
      cb()
    })
  }

  updateFixedObjects() {
    this._objects.filter(obj => obj.positionType === GameObjectPosition.camera).forEach(obj => {
      obj.updatePosition()
    })
  }

  updateCamera() {
    this.updateFixedObjects()
    this.stage.x = -this.cameraPosition[0]
    this.stage.y = -this.cameraPosition[1]
  }

  renderTick() {
    if (this.fpsText) {
      this.fpsText.visible = this.showFps
      this.fpsText.x = this.cameraPosition[0] + 10
      this.fpsText.y = this.cameraPosition[1] + 10
      this.fpsText.text = `fps: ${ Math.round(this.ticker.FPS * 10) / 10 }, sprites: ${ this.stage.children.length }`
    }

    this.updateCamera()

    this._tickCallbacks.forEach(cb => {
      cb(this.ticker.deltaTime)
    })
  }

  sortZIndex() {
    this.stage.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex)
  }

  addTick(cb: Function): void {
    this._tickCallbacks.push(cb)
  }

  addResizeCallback(cb: Function): void {
    this._resizeCallbacks.push(cb)
  }

  createFpsText() {
    this.fpsText = new PIXI.Text('', {
      fontFamily: 'Courier New, Arial, sans-serif',
      fontSize: 16,
      fill: 0xFFFFFF,
      align: 'center'
    })
    this.fpsText.zIndex = Number.MAX_SAFE_INTEGER
    this.stage.addChild(this.fpsText)
  }

  async loadImages(imagesToPreload: [string, string][]): Promise<string> {
    if (!this._loader) {
      return Promise.resolve('')
    }

    imagesToPreload.forEach(image => {
      if (!this.getTextureByName(image[0])) {
        this._loader?.add(image[0], image[1])
      }
    })

    return await new Promise((resolve) => {
      this._loader?.load(() => {
        resolve('')
      })
    })
  }

  getTextureByName(name: string): PIXI.Texture | null {
    return this._loader?.resources[name]?.texture ?? null
  }

  createSprite(name: string): PIXI.Sprite | null {
    const texture = this.getTextureByName(name)

    if (!texture) {
      return null
    }

    return new PIXI.Sprite(texture)
  }

  createAnimatedSprite(name: string, framesCount: number, size: [number, number]): PIXI.AnimatedSprite | null {
    const texture = this.getTextureByName(name)
    const frames = []

    if (!texture) {
      return null
    }

    for (let i = 0; i < framesCount; i++) {
      frames.push(
        new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(i * size[0], 0, ...size))
      )
    }

    return new PIXI.AnimatedSprite(frames)
  }

  addGameObject(obj: GameObject) {
    this._objects.push(obj)
  }

  removeGameObject(obj: GameObject) {
    this._objects = this._objects.filter(o => o !== obj)
  }
}
