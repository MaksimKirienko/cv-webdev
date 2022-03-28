import * as PIXI from 'pixi.js'
import { GameObject, Render } from '../Engine'

export class Pipe extends GameObject {
  private _textureBg: PIXI.Texture | null = null
  private _textureTop: PIXI.Texture | null = null
  private _textureBottom: PIXI.Texture | null = null

  private _spriteBg: PIXI.Sprite | null = null
  private _spriteTop: PIXI.Sprite | null = null
  private _spriteBottom: PIXI.Sprite | null = null

  constructor(render: Render) {
    super(render)
    this.setSize(56, render.screen.height * 2)

    this._textureBg = render.getTextureByName('pipe-bg')
    if (this._textureBg) {
      // this._spriteBg = new PIXI.TilingSprite(this._textureBg, this.width, this.height)
      // this._spriteBg.width = this.width
      // this._spriteBg.height = this.height / 2
      // this._spriteBg.tileScale.set(this.width / 128, this.height / 64)

      this._spriteBg = new PIXI.Sprite(this._textureBg)
      this._spriteBg.width = this.width
      this._spriteBg.height = this.height

      this.contaner.addChild(this._spriteBg)
    }

    this._textureTop = render.getTextureByName('pipe-t')
    if (this._textureTop) {
      this._spriteTop = new PIXI.Sprite(this._textureTop)
      this._spriteTop.width = 78
      this._spriteTop.height = 26
      this._spriteTop.x = -11
      this.contaner.addChild(this._spriteTop)
    }

    this._textureBottom = render.getTextureByName('pipe-b')
    if (this._textureBottom) {
      this._spriteBottom = new PIXI.Sprite(this._textureBottom)
      this._spriteBottom.width = 78
      this._spriteBottom.height = 26
      this._spriteBottom.x = -11
      this._spriteBottom.y = this.height - this._spriteBottom.height
      this.contaner.addChild(this._spriteBottom)
    }

    this.zIndex = 5

    this.resize()
    this.render?.addResizeCallback(() => {
      this.resize()
    })
  }

  resize() {
    if (this.render) {
      this.setSize(56, this.render.screen.height * 2)
    }
  }
}

export class PipeManager {
  public render: Render
  public pipePairs: [Pipe, Pipe][] = []
  public spaceEmpty: [number, number] = [270, 380] // 200 400
  public spaceBetween: [number, number] = [400, 400] // 380 460
  public verticalRandom = 160

  private _spaceBetweenNext: number = 0

  constructor(render: Render) {
    this.render = render
  }

  tick() {
    this.clearPipes()
    this.generatePipes()
  }

  _findMaxX(): number {
    let maxX = this.render.cameraPosition[0] + this.render?.screen.width / 4

    this.pipePairs.forEach(pipePair => {
      if (pipePair[0].x > maxX) {
        maxX = pipePair[0].x
      }
    })

    return maxX
  }

  generatePipes() {
    if (!this.render) {
      return
    }

    const pipesMaxX = this._findMaxX()
    const lineGenerate = this.render.cameraPosition[0] + this.render?.screen.width + this.spaceBetween[1] * 2 + 11

    if (!this._spaceBetweenNext) {
      this._spaceBetweenNext = this.spaceBetween[1]
    }

    if (lineGenerate - pipesMaxX > this._spaceBetweenNext) {
      this.addPipes(pipesMaxX + this._spaceBetweenNext)

      this._spaceBetweenNext = this.spaceBetween[0] + Math.random() * (this.spaceBetween[1] - this.spaceBetween[0])

      this.generatePipes() // recursive
    }
  }

  addPipes(positionX: number) {
    if (!this.render) {
      return
    }

    const spaceCenter = (this.render.screen.height / 2) + (Math.random() - 0.5) * this.verticalRandom

    const newPair: [Pipe, Pipe] = [
      new Pipe(this.render),
      new Pipe(this.render)
    ]

    const spaceEmpty = this.spaceEmpty[0] + Math.random() * (this.spaceEmpty[1] - this.spaceEmpty[0])
    newPair[0].setPivot(newPair[0].width / 2, newPair[0].height)
    newPair[0].x = positionX
    newPair[0].y = spaceCenter - spaceEmpty / 2

    newPair[1].setPivot(newPair[1].width / 2, 0)
    newPair[1].x = positionX
    newPair[1].y = spaceCenter + spaceEmpty / 2

    newPair[0].addOnStage()
    newPair[1].addOnStage()

    this.pipePairs.push(newPair)
  }

  clearPipes() {
    this.pipePairs = this.pipePairs.filter(pipePair => {
      if (pipePair[0].x < this.render.cameraPosition[0] - pipePair[0].width * 1.3) {
        pipePair[0].destroy()
        pipePair[1].destroy()
        return false
      }
      return true
    })
  }

  clearAll() {
    this.pipePairs.forEach(pipePair => {
      pipePair[0].destroy()
      pipePair[1].destroy()
    })
    this.pipePairs = []
  }
}
