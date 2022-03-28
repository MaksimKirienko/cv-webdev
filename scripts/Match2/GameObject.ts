import { Sprite } from './Sprite'

export class GameObject {
  public node: HTMLElement
  public sprite: Sprite | null = null
  public positionPx: [number, number] = [0, 0]
  public sizePx: [number, number] = [0, 0]
  public animation: any = null // Animation | null
  public parent: HTMLElement

  constructor(parent: HTMLElement, sizePx: [number, number]) {
    this.parent = parent
    this.sizePx = sizePx

    this.node = document.createElement('div')
    this.node.classList.add('game-object')
    this.node.style.width = sizePx[0] + 'px'
    this.node.style.height = sizePx[1] + 'px'
    this.parent.append(this.node)
  }

  _removeSelfNode() {
    this.node.remove()
  }

  _setSprite(spriteImageFile: string, spriteData: any, spriteAnimations: any) {
    this.sprite = new Sprite(
      this.node,
      spriteImageFile,
      spriteData.frameSize,
      spriteData.imageSize,
      spriteAnimations
    )
  }

  _updateAnimationsData(animationsData: any) {
    this.sprite?.updateAnimationsData(animationsData)
  }

  moveToPx(x: number, y: number) {
    this.node.style.left = x + 'px'
    this.node.style.top = y + 'px'
  }
}
