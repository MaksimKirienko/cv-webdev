import { GameObject } from './GameObject'
import { Sprite } from './Sprite'

export class Item extends GameObject {
  public name: string
  public color: string | null
  public colorBlow: string | null
  public typeName: string
  public canCombine: boolean
  public canFall: boolean
  public blowSelf: string
  public blowNear: boolean
  public blowInside: boolean
  public lives: number | null
  public positionGrid: [number, number]
  public gridSize: [number, number]
  public stages: any
  public stageNumber: number | null = null
  public spriteAnimations: any
  public blockItem: boolean | null
  public isModifier: boolean

  private _cellSizePx: [number, number]
  private _isFalling: boolean = false

  constructor(
    parent: HTMLElement,
    positionGrid: [number, number],
    gridSize: [number, number],
    cellSizePx: [number, number],
    itemName: string,
    itemData: any,
    typeData: any,
    spriteData: any
  ) {
    super(parent, [
      cellSizePx[0] * 1.25,
      cellSizePx[1] * 1.25
    ])

    this.name = itemName
    this.color = itemData.color ?? null
    this.colorBlow = itemData.colorBlow ?? null
    this.typeName= itemData.type

    this.canCombine = typeData.combine ?? true
    this.canFall = typeData.fall ?? true
    this.blowSelf = typeData.blow ?? ''
    this.blowNear = typeData.blowNear ?? false
    this.blowInside = typeData.blowInside ?? false
    this.lives = itemData.lives ?? null

    this.positionGrid = positionGrid
    this.gridSize = gridSize
    this._cellSizePx = cellSizePx

    if (typeof itemData.blockItem !== 'undefined') {
      // if modifier
      this.blockItem = itemData.blockItem
      this.isModifier = true

      if (!this.blockItem) {
        this.node.style.pointerEvents = 'none'
      }
    } else {
      this.isModifier = false
      this.blockItem = null
    }

    //
    if (itemData.stages) {
      this.stages = itemData.stages
      this.stageNumber = this.stages.length - 1
      this.spriteAnimations = this.stages[this.stageNumber].spriteAnimations
    } else {
      this.spriteAnimations = itemData.spriteAnimations
    }

    this._setSprite(itemData.spriteImageFile, spriteData, this.spriteAnimations)
    this.moveToGrid(positionGrid)
  }

  lowerStage() {
    if (!this.stages || !this.stageNumber) {
      console.log('cant lower stage')
      return
    }

    // console.log(`lower stage ${ this.name }`)

    this.stageNumber = (this.stageNumber ?? 1) - 1
    this.spriteAnimations = this.stages[this.stageNumber].spriteAnimations


    this._updateAnimationsData(this.spriteAnimations)
  }

  setItemIcon(iconIndex: number) {
    this.sprite?.setIcon(iconIndex)
  }

  getPxFromGrid(positionGrid: [number, number] | null = null) {
    positionGrid = positionGrid ?? this.positionGrid

    const positionPx: [number, number] = [
      this._cellSizePx[0] * (positionGrid[0] - 0.125),
      this._cellSizePx[1] * (positionGrid[1] - 0.125)
    ]
    return positionPx
  }

  getPxCenterFromGrid(positionGrid: [number, number] | null = null) {
    positionGrid = positionGrid ?? this.positionGrid

    const positionPx: [number, number] = [
      this._cellSizePx[0] * (positionGrid[0] + 0.5),
      this._cellSizePx[1] * (positionGrid[1] + 0.5)
    ]
    return positionPx
  }

  // max ~ 300
  calcZIndex(positionGrid: [number, number] | null = null) {
    positionGrid = positionGrid ?? this.positionGrid
    return (positionGrid[0] + this.gridSize[0] * (this.gridSize[1] - positionGrid[1] - 1)) * 2 + 5
  }

  // only change item render position
  moveToGrid(positionGrid: [number, number]) {
    this.positionGrid = [...positionGrid]

    const newZIndex = this.calcZIndex() +
      (this.blockItem !== null ? 1 : 0) +
      (this.name === 'bubble' ? 300 : 0)
    this.setZIndex(newZIndex)

    const posPx = this.getPxFromGrid(positionGrid)
    this.moveToPx(posPx[0], posPx[1])
  }

  animationFallToGrid(startPosition: [number, number] | null, endPosition: [number, number]) {
    return new Promise((resolve) => {
      if (!startPosition) {
        startPosition = [...this.positionGrid]
      }
      const pos1 = this.getPxFromGrid(startPosition)
      const pos2 = this.getPxFromGrid(endPosition)
      const deltaY = pos2[1] - pos1[1]

      this.moveToGrid(endPosition)

      this._isFalling = true
      try {
        this.animation = this.node.animate([
          { transform: `translateY(${ -deltaY }px)` },
          { transform: `translateY(0px)` }
        ], {
          duration: 200 + deltaY * 1.7,
          easing: 'cubic-bezier(0.60, 0, 0.475, 1.205)'
        })

        if (this.animation) {
          this.animation.onfinish = () => {
            this.animation = null
            this._isFalling = false
            resolve('')
          }
        }
      } catch(e) {
        console.log('falling animate error', e)
        this.node.style.transform = `translateY(0px)`
        this.animation = null
        this._isFalling = false
        resolve('')
      }
    })
  }

  animationFlyBothSides(directionHoriontal: boolean, flyLength: number, duration: number = 700) {
    const actions: Array<Promise<any>> = []

    // rockets fly
    actions.push(new Promise((resolve) => {
      const cloneItemNode = <HTMLElement>this.node.cloneNode(true)
      this.parent.appendChild(cloneItemNode)

      try {
        if (directionHoriontal) {
          this.animation = this.node.animate([
            { transform: `translateX(0px)`},
            { transform: `translateX(-${ flyLength * this._cellSizePx[0] }px)`}
          ], {
            duration
          })

          cloneItemNode.animate([
            { transform: `translateX(0px)`},
            { transform: `translateX(${ flyLength * this._cellSizePx[0] }px)`}
          ], {
            duration
          })
        } else {
          this.animation = this.node.animate([
            { transform: `translateY(0px)`, opacity: 1, offset: 0 },
            { transform: `translateY(-${ flyLength * this._cellSizePx[1] * 0.85 }px)`, opacity: 1, offset: 0.85 },
            { transform: `translateY(-${ flyLength * this._cellSizePx[1] }px)`, opacity: 0, offset: 1}
          ], {
            duration
          })

          cloneItemNode.animate([
            { transform: `translateY(0px)`, opacity: 1, offset: 0 },
            { transform: `translateY(${ flyLength * this._cellSizePx[1] * 0.85 }px)`, opacity: 1, offset: 0.85 },
            { transform: `translateY(${ flyLength * this._cellSizePx[1] }px)`, opacity: 0, offset: 1 }
          ], {
            duration
          })
        }

        if (this.animation) {
          this.animation.onfinish = () => {
            this.node.style.opacity = '0'
            this.animation = null
            cloneItemNode.remove()
            resolve('')
          }
        }
      } catch(e) {
        console.log('rockets fly animate error', e)
        this.animation = null
        cloneItemNode.remove()
        resolve('')
      }
    }))

    // rockets flames
    actions.push(new Promise((resolve) => {
      const frameProportion = 128 / 800
      const flameNode1 = document.createElement('div')
      const start = [
        this.node.offsetLeft + this.node.clientWidth / 2,
        this.node.offsetTop + this.node.clientHeight / 2
      ]
      flameNode1.classList.add('game-effect')
      flameNode1.style.height = 48 / frameProportion + 'px'
      flameNode1.style.width = 48 + 'px'
      flameNode1.style.top = start[1] + 'px'
      flameNode1.style.left = start[0] - 24 + 'px'
      flameNode1.style.transformOrigin = 'center top'

      const flameNode2 = <HTMLElement>flameNode1.cloneNode(true)

      this.parent.appendChild(flameNode1)
      this.parent.appendChild(flameNode2)

      const sprite1 = new Sprite(flameNode1, 'rocketFlame.png', [128, 800], [640, 800],
        {
          default: { col: 1, row: 0, steps: 4, duration: 160 }
        }
      )
      const sprite2 = new Sprite(flameNode2, 'rocketFlame.png', [128, 800], [640, 800],
        {
          default: { col: 1, row: 0, steps: 4, duration: 160 }
        }
      )

      sprite1.play('default')
      sprite2.play('default')

      let animation: any = null // Animation | null

      try {
        if (directionHoriontal) {
          animation = flameNode1.animate([
            { transform: `translateX(0px) rotate(-90deg)`, opacity: 1, offset: 0 },
            { transform: `translateX(-${ flyLength * this._cellSizePx[0] * 0.9 }px) rotate(-90deg)`, opacity: 1, offset: 0.9 },
            { transform: `translateX(-${ flyLength * this._cellSizePx[0] }px) rotate(-90deg)`, opacity: 0, offset: 1}
          ], {
            duration
          })

          flameNode2.animate([
            { transform: `translateX(0px) rotate(90deg)`, opacity: 1, offset: 0 },
            { transform: `translateX(${ flyLength * this._cellSizePx[0] * 0.9 }px) rotate(90deg)`, opacity: 1, offset: 0.9 },
            { transform: `translateX(${ flyLength * this._cellSizePx[0] }px) rotate(90deg)`, opacity: 0, offset: 1 }
          ], {
            duration
          })
        } else {
          animation = flameNode1.animate([
            { transform: `translateY(0px)`, opacity: 1, offset: 0 },
            { transform: `translateY(-${ flyLength * this._cellSizePx[0] * 0.9 }px)`, opacity: 1, offset: 0.9 },
            { transform: `translateY(-${ flyLength * this._cellSizePx[0] }px)`, opacity: 0, offset: 1 }
          ], {
            duration
          })

          flameNode2.animate([
            { transform: `scaleY(-1) translateY(0px)`, opacity: 1, offset: 0},
            { transform: `scaleY(-1) translateY(-${ flyLength * this._cellSizePx[0] * 0.9 }px)`, opacity: 1, offset: 0.9 },
            { transform: `scaleY(-1) translateY(-${ flyLength * this._cellSizePx[0] }px)`, opacity: 0, offset: 1 }
          ], {
            duration
          })
        }

        if (animation) {
          animation.onfinish = () => {
            flameNode1.remove()
            flameNode2.remove()
            resolve('')
          }
        }
      } catch(e) {
        console.log('rockets flame animate error', e)
        flameNode1.remove()
        flameNode2.remove()
        resolve('')
      }
    }))

    return Promise.all(actions)
  }

  animationCombine(endPosition: [number, number], duration: number = 500) {
    this.setZIndex(this.calcZIndex() + 150)

    return new Promise((resolve) => {
      const pos1 = this.getPxFromGrid(this.positionGrid)
      const pos2 = this.getPxFromGrid(endPosition)
      const deltaX = pos2[0] - pos1[0]
      const deltaY = pos2[1] - pos1[1]

      try {
        this.animation = this.node.animate([
          { transform: `translate(0, 0)`, filter: 'drop-shadow(0 0 1px rgba(255, 255, 255, 0.5)) brightness(1)'},
          { transform: `translate(${ deltaX }px, ${ deltaY }px)`, filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)) brightness(1.5)'}
        ], {
          duration,
          easing: 'cubic-bezier(0.60, 0, 0.475, 1.205)'
        })

        if (this.animation) {
          this.animation.onfinish = () => {
            this.animation = null
            this.setZIndex(this.calcZIndex())
            resolve('')
          }
        }
      } catch(e) {
        console.log('combine animate error', e)
        this.animation = null
        this.setZIndex(this.calcZIndex())
        resolve('')
      }
    })
  }

  animationMoveShuffle(startPosition: [number, number], duration: number = 400) {
    console.log('animationMoveShuffle', startPosition, this.positionGrid)
    this.setZIndex(this.calcZIndex())

    return new Promise((resolve) => {
      const pos1 = this.getPxFromGrid(startPosition)
      const pos2 = this.getPxFromGrid(this.positionGrid)
      const deltaX = pos2[0] - pos1[0]
      const deltaY = pos2[1] - pos1[1]

      const posPx = this.getPxFromGrid(this.positionGrid)
      this.moveToPx(posPx[0], posPx[1])

      try {
        this.animation = this.node.animate([
          { transform: `translate(${ -deltaX }px, ${ -deltaY }px)`},
          { transform: `translate(0, 0)`}
        ], {
          duration,
          easing: 'cubic-bezier(0.60, 0, 0.475, 1.205)'
        })

        if (this.animation) {
          this.animation.onfinish = () => {
            this.animation = null
            resolve('')
          }
        }
      } catch(e) {
        console.log('shuffle animate error', e)
        this.node.style.transform = `translate(0, 0)`
        this.animation = null
        resolve('')
      }
    })
  }

  animationScaleDown(duration: number = 500) {
    return new Promise((resolve) => {
      try {
        this.animation = this.node.animate([
          { transform: `scale(1)`, opacity: 1},
          { transform: `scale(0)`, opacity: 0}
        ], {
          duration,
          easing: 'ease-in' // 'cubic-bezier(0.60, 0, 0.475, 1.205)'
        })

        if (this.animation) {
          this.animation.onfinish = () => {
            this.animation = null
            resolve('')
          }
        }
      } catch(e) {
        console.log('scale down animate error', e)
        this.node.style.opacity = '0'
        this.animation = null
        resolve('')
      }
    })
  }

  animationScaleUp(scaleFactor:number = 1.5, duration: number = 1400, light = false) {
    const actions: Array<Promise<any>> = []
    this.node.style.zIndex = '610'

    if (light) {
      const glowNode = document.createElement('div')
      glowNode.classList.add('game-effect')
      glowNode.style.left = this.node.offsetLeft + 'px'
      glowNode.style.top = this.node.offsetTop + 'px'
      glowNode.style.width = this.node.clientWidth + 'px'
      glowNode.style.height = this.node.clientHeight + 'px'
      glowNode.style.zIndex = '609'
      glowNode.style.borderRadius = '50%'
      glowNode.style.backgroundColor = '#fff'
      // glowNode.style.boxShadow = '0 0 4px 3px white'
      glowNode.style.setProperty('mix-blend-mode', 'screen')
      glowNode.style.filter = 'blur(3px)'
      this.parent.appendChild(glowNode)

      actions.push(
        new Promise((resolve) => {

          try {
            const lightAnimation = glowNode.animate([
              { transform: `scale(0.6)`, opacity: 1, offset: 0 },
              { transform: `scale(${ scaleFactor })`, opacity: 1, offset: 0.05 },
              { transform: `scale(${ scaleFactor })`, opacity: 1, offset: 0.9 },
              { transform: `scale(0.5)`, opacity: 0, offset: 1 }
            ], {
              duration,
              easing: 'ease-in'
            })

            lightAnimation.onfinish = (e) => {
              this.animation = null
              glowNode.remove()
              resolve('')
            }
          } catch(e) {
            console.log('scale up light animate error', e)
            this.animation = null
            glowNode.remove()
            resolve('')
          }
        })
      )
    }

    actions.push(
      new Promise((resolve) => {

        this.node.style.left = (this.node.offsetLeft - this.node.clientWidth) + 'px'
        this.node.style.top = (this.node.offsetTop - this.node.clientHeight) + 'px'
        this.node.style.width = (this.node.clientWidth * 3) + 'px'
        this.node.style.height = (this.node.clientHeight * 3) + 'px'

        try {
          this.animation = this.node.animate([
            { transform: `scale(0.3333)`, filter: light ? 'blur(0) brightness(1)' : '', opacity: 1, offset: 0 },
            { transform: `scale(${ scaleFactor / 3 })`, filter: light ? 'blur(0.01px) brightness(1.2)' : '', opacity: 1, offset: 0.05 },
            { transform: `scale(${ scaleFactor / 3 })`, filter: light ? 'blur(0.01px) brightness(1.2)' : '', opacity: 1, offset: 0.9 },
            { transform: `scale(0.3333)`, filter: light ? 'blur(0) brightness(1)' : '', opacity: 0, offset: 1 }
          ], {
            duration,
            easing: 'ease-in'
          })

          this.animation.onfinish = () => {
            this.animation = null
            this.node.style.opacity = '0'
            resolve('')
          }
        } catch(e) {
          console.log('scale up animate error', e)
          this.animation = null
          this.node.style.opacity = '0'
          resolve('')
        }

        // bug fix animation won't finish
        // setTimeout(() => {
        //   this.animation = null
        //   this.node.style.opacity = '0'
        //   resolve('')
        // }, duration)
      })
    )

    return Promise.all(actions)
  }

  animationFlyTask(screenEndPositionPx: [number, number]) {
    let cloneItemNode: HTMLElement

    if (typeof this.spriteAnimations['task'] !== 'undefined') {
      // set sprite hack
      const curretAnimationName = this.sprite?.animationName
      this.sprite?.setIcon(-1)
      this.sprite?.setFrame('task', 0)
      cloneItemNode = <HTMLElement>this.node.cloneNode(true)
      this.sprite?.play(curretAnimationName)
    } else {
      cloneItemNode = <HTMLElement>this.node.cloneNode(true)
    }

    if (!cloneItemNode) {
      return
    }

    cloneItemNode.style.zIndex = "600"
    this.parent.appendChild(cloneItemNode)

    const nodeRect = cloneItemNode.getBoundingClientRect()
    const startPosition = [
      ((nodeRect.left + nodeRect.right) / 2),
      ((nodeRect.top + nodeRect.bottom) / 2)
    ]
    const dx = screenEndPositionPx[0] - startPosition[0]
    const dy = screenEndPositionPx[1] - startPosition[1]

    return new Promise((resolve) => {
      try {
        this.animation = cloneItemNode.animate([
          { transform: `translate(0, 0) scale(0.7)`, opacity: 1, offset: 0 },
          { transform: `translate(${ dx * 0.5 }px, ${ dy * 0.5 }px) scale(1)`, opacity: 1, offset: 0.5 },
          { transform: `translate(${ dx * 0.8 }px, ${ dy * 0.8 }px) scale(0.9)`, opacity: 1, offset: 0.8 },
          { transform: `translate(${ dx }px, ${ dy }px) scale(0.7)`, opacity: 0, offset: 1 }
        ], {
          duration: Math.sqrt(dx*dx + dy*dy) * 2.5,
          easing: 'ease-in-out'
        })

        this.animation.onfinish = () => {
          this.animation = null
          cloneItemNode.remove()
          resolve('')
        }
      } catch(e) {
        console.log('fly animate error', e)
        this.animation = null
        cloneItemNode.remove()
        resolve('')
      }
    })
  }

  setHighlight(on: boolean) {
    if (on) {
      this.node.style.filter = 'brightness(1.2) drop-shadow(0 0 5px white)'
    } else {
      this.node.style.filter = ''
    }
  }

  setZIndex(zIndex: number) {
    this.node.style.zIndex = zIndex + '';
  }
}
