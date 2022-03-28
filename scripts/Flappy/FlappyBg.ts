import * as PIXI from 'pixi.js'
import { GameObject, Render, GameObjectPosition } from '../Engine'

export class FlappyBg extends GameObject {
  private _texture: PIXI.Texture | null = null
  private _sprite: PIXI.TilingSprite | null = null

  constructor(render: Render) {
    super(render)

    this._texture = render.getTextureByName('city')

    if (this._texture) {
      this._sprite = new PIXI.TilingSprite(
        this._texture,
        render.screen.width,
        render.screen.height
      )
      this.contaner.addChild(this._sprite)
    }

    this.positionType = GameObjectPosition.camera
    this.x = 0
    this.y = 0

    this.zIndex = 0

    this.addOnStage()

    this.resize()
    this.render?.addResizeCallback(() => {
      this.resize()
    })
  }

  resize() {
    setTimeout(() => {
      if (this.render && this.render.view && this._texture && this._sprite) {
        // console.log('resize bg', this.render.view.offsetWidth, this.render.view.offsetHeight)
        this._sprite.width = this.render.view.offsetWidth // this.render.screen.width
        this._sprite.height = this.render.view.offsetHeight // this.render.screen.height

        const scale = this.render.view.offsetHeight / this._texture.orig.height
        this._sprite.tileScale.y = scale
        this._sprite.tileScale.x = scale
      }
    }, 33)
  }

  setPositionX(x: number) {
    if (this._sprite) {
      this._sprite.tilePosition.x = x
    }
  }
}
