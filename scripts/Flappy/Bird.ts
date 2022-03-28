import * as PIXI from 'pixi.js'
import { Polygon, Vector } from 'collider2d'
import { GameObject, Render } from '../Engine'

export class Bird extends GameObject {
  public gravity: number = 9.8
  public vSpeed: number = 0
  private _sprite: PIXI.AnimatedSprite | null
  public collissionPolygon: Polygon

  constructor(render: Render) {
    super(render, 'player')
    this.setSize(128, 86)
    this.setPivot(64, 43)

    this.collissionPolygon = new Polygon(new Vector(0, 0), [
      (new Vector(-40, -43)),
      (new Vector(64, -43)),
      (new Vector(32, 0)),
      (new Vector(29, 43)),
      (new Vector(-25, 43)),
      (new Vector(-25, -6))
    ])

    this._sprite = render.createAnimatedSprite('player', 4, [512, 343])

    if (this._sprite) {
      this._sprite.width = this.width
      this._sprite.height = this.height
      this._sprite.animationSpeed = 0.5
      this._sprite.play()
      this.contaner.addChild(this._sprite)
    }

    this.y = render.stage.height / 2

    this.zIndex = 10

    this.addOnStage()

    // this.resize()
    // this.render?.addResizeCallback(() => {
    //   this.resize()
    // })
  }

  tick(deltaTime: number) {
    this.vSpeed -= this.gravity * deltaTime / 60
    this.gravityStep(deltaTime)
    this.setAngle()
  }

  setAngle() {
    const angle = -this.vSpeed * 2.5

    this.contaner.angle = (angle * 0.2 + this.contaner.angle) / 1.2
  }

  gravityStep(deltaTime: number) {
    if (!this.render) {
      return
    }

    const maxY = this.render.screen.height - this.height / 2

    this.y -= (this.vSpeed * deltaTime * 64) / 60 // 64px in meter

    if (this.y < this.height / 2) {
      this.hitTop(this.height / 2)
    }

    if (this.y > maxY) {
      this.hitBottom(maxY)
    }
  }

  hitTop(y: number) {
    this.y = y
    this.vSpeed = -1
  }

  hitBottom(y: number) {
    this.y = y
    this.vSpeed = 3
  }

  // resize() {
  //   if (!this.render) {
  //     return
  //   }
  // }
}
