import * as PIXI from 'pixi.js'
import { Render } from './Render'

export enum GameObjectPosition {
  world = 'WORLD',
  camera = 'CAMERA'
}

export class GameObject {
  public name: string
  public render: Render | null = null
  public contaner: PIXI.Container
  public _x: number = 0
  public _y: number = 0
  public width: Readonly<number> = 100
  public height: Readonly<number> = 100
  public _zIndex: Readonly<number> = 0
  public positionType: GameObjectPosition = GameObjectPosition.world

  constructor(render: Render, name: string = '') {
    this.render = render
    this.name = name
    this.contaner = new PIXI.Container()

    this.render.addGameObject(this)
  }

  public get x(): number {
    return this._x
  }

  public set x(newX: number) {
    this._x = newX
    if (this.positionType === GameObjectPosition.camera) {
      this.contaner.x = newX + (this.render?.cameraPosition[0] || 0)
    } else {
      this.contaner.x = newX
    }
  }

  public get y(): number {
    return this._y
  }

  public set y(newY: number) {
    this._y = newY
    if (this.positionType === GameObjectPosition.camera) {
      this.contaner.y = newY + (this.render?.cameraPosition[1] || 0)
    } else {
      this.contaner.y = newY
    }
  }

  public get zIndex(): number {
    return this._zIndex
  }

  public set zIndex(newZ: number) {
    this._zIndex = newZ
    this.contaner.zIndex = newZ
    this.render?.sortZIndex()
  }

  updatePosition() {
    this.x = this._x
    this.y = this._y
  }

  addOnStage() {
    this.render?.stage.addChild(this.contaner)
    this.render?.sortZIndex()
  }

  destroy() {
    if (this.render) {
      this.render.removeGameObject(this)

      this.contaner.removeChildren()
      this.render.stage.removeChild(this.contaner)
    }
  }

  setPosition(x: number, y: number) {
    this._x = x
    this._y = y
    this.contaner.position.set(x, y)
  }

  setPivot(x: number, y: number) {
    this.contaner.pivot.set(x, y)
  }

  setSize(width: number, height: number) {
    this.width = width
    this.height = height
  }
}
