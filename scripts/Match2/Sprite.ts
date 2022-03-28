import { Ani } from './Ani'

declare global {
  interface Window {
    webp: boolean
  }
}

export class Sprite {
  public nodeLink: HTMLElement
  public animationName: string = ''

  private _image: string
  private _frameSizePx: [number, number]
  private _imageSizePx: [number, number]

  private _frameIndex: number = 0
  private _animationsData: any
  private _animation: any = null // Animation | Ani | null
  private _animationStep: number = 0

  private _iconIndex: number = -1
  private _iconBackgroundImage: string = `icons.png`
  private _iconBackgroundSize: string = '300% 100%, '
  private _iconBackgroundPosition: string = '0 0, '

  constructor(
    nodeLink: HTMLElement,
    spriteImageFile: string,
    frameSizePx: [number, number],
    imageSizePx: [number, number],
    animationsData: any
  ) {
    this.nodeLink = nodeLink
    this._image = spriteImageFile
    this._frameSizePx = frameSizePx
    this._imageSizePx = imageSizePx

    this.updateAnimationsData(animationsData)
  }

  setIcon(iconIndex: number = -1) {
    this._iconIndex = iconIndex
    this._iconBackgroundPosition = `-${ iconIndex * 100 }% 0%, `

    if (iconIndex >= 0) {
      this.animationName = 'clean'
    } else {
      this.animationName = 'default'
    }

    this.updateImage()
    this.setFrame(this.animationName, this._frameIndex)
  }

  updateAnimationsData(animationsData: any) {
    this._animationsData = animationsData
    this.updateImage()
    this.play('default')
  }

  async play(animationName: string = '', once: boolean = false) {
    this.animationName = animationName || this.animationName

    if (typeof this._animationsData[animationName] == 'undefined') {
      console.log(`error: can't play sprite with animationName '${ animationName }'`)
      return
    }

    const anim = this._animationsData[animationName]

    if (anim.steps) {
      this.setFrame(animationName, 0)
      return await this.runSpriteAnimation(animationName, once)
    } else {
      this.setFrame(animationName, 0)
    }
  }

  updateImage(image: string = '', imageSizePx: [number, number] | null = null, frameSizePx: [number, number] | null = null) {
    this._image = image || this._image

    if (!this._image) {
      console.log('cant set Sprite image - no image file path')
      return
    }

    if (imageSizePx) {
      this._imageSizePx = imageSizePx
    }

    if (frameSizePx) {
      this._frameSizePx = frameSizePx
    }

    let imagePath = ''
    let iconImagePath = ''

    if (typeof window.webp !== 'undefined' && window.webp) {
      imagePath = require(`~/assets/i/match/sprites/${ this._image }?webp`)
      iconImagePath = require(`~/assets/i/match/sprites/${ this._iconBackgroundImage }?webp`)
    } else {
      imagePath = require(`~/assets/i/match/sprites/${ this._image }`)
      iconImagePath = require(`~/assets/i/match/sprites/${ this._iconBackgroundImage }`)
    }

    this.nodeLink.style.backgroundImage = `
      ${ this._iconIndex >= 0 ? `url('${ iconImagePath }'), ` : ''}
      url('${ imagePath }')`

    this.nodeLink.style.backgroundSize = `
      ${ this._iconIndex >= 0 ? this._iconBackgroundSize : ''}
      ${ Math.round(this._imageSizePx[0] / this._frameSizePx[0] * 100) }%
      ${ Math.round(this._imageSizePx[1] / this._frameSizePx[1] * 100) }%`
  }

  setFrame(animationName: string = '', frameIndex: number = 0) {
    this.animationName = animationName || this.animationName

    if (typeof this._animationsData[animationName] == 'undefined') {
      console.log(`error: can't set sprite frame ${frameIndex} with animationName '${ animationName }'`)
      return
    }

    const anim = this._animationsData[animationName]

    this.nodeLink.style.backgroundPosition = `
    ${ this._iconIndex >= 0 ? this._iconBackgroundPosition : ''}
    -${ (anim.col + frameIndex) * 100 }% -${ anim.row * 100 }%`
  }

  async runSpriteAnimation(animationName: string = '', once: boolean = false) {
    this.animationName = animationName || this.animationName

    if (typeof this._animationsData[animationName] == 'undefined') {
      console.log(`error: can't play animation with animationName '${ animationName }'`)
      return
    }

    const anim = this._animationsData[animationName]

    if (!anim.steps || !anim.duration) {
      console.log(`error: can't play animation - no steps or duration '${ animationName }'`)
      return
    }

    this.stopSpriteAnimation()

    this._animationStep = 0

    this._animation = new Ani(once ? anim.duration : -1, () => {
      let parent = this.nodeLink

      while (parent?.parentElement) {
        parent = parent.parentElement
      }

      // check if node exists on page
      if (parent.nodeName !== 'HTML') {
        (<Ani>this._animation)?.stop()
        return -1
      }

      // console.log(this)
      // can't kill infinite
      if (this instanceof Ani) {
        this.stop()
      }

      this._animationStep += 1

      if (this._animationStep === anim.steps) {
        this._animationStep = 0
      }

      // optimized version
      this.nodeLink.style.backgroundPositionX = `-${ (anim.col + this._animationStep) * 100 }%`

      // this.nodeLink.style.backgroundPosition = `
      //   ${ this._iconIndex >= 0 ? this._iconBackgroundPosition : ''}
      //   -${ (anim.col + this._animationStep) * 100 }% -${ anim.row * 100 }%`
    })

    if (once) {
      return await this._animation.play(1000 / (anim.duration / anim.steps))
    } else {
      this._animation.play(1000 / (anim.duration / anim.steps))
    }
  }

  stopSpriteAnimation() {
    if (!this._animation) {
      return
    }

    // if (this._animation instanceof Animation) {
    //   (<Animation>this._animation).cancel()
    // }

    if (this._animation instanceof Ani) {
      (<Ani>this._animation).stop()
    } else {
      this._animation?.cancel?.()
    }
  }
}
