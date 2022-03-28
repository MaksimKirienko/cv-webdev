// const audioPath = '/assets/audio/'
const audioPath = 'https://storage.yandexcloud.net/music-brawls/'

class GameAudio {
  constructor() {
    this.soundInitialized = false
    this.soundEnabled = false
    this.musicName = null

    this.soundList = [
      {
        name: "empty",
        type: "sound",
        audio: new Audio('data:audio/mpeg;base64,/+NIxAAAAAAAAAAAAFhpbmcAAAAPAAAACAAAA2AAICAgICAgICAgICAgQEBAQEBAQEBAQEBAYGBgYGBgYGBgYGBgYICAgICAgICAgICAgKCgoKCgoKCgoKCgoKDAwMDAwMDAwMDAwMDg4ODg4ODg4ODg4ODg////////////////AAAAOUxBTUUzLjEwMAIeAAAAAAAAAAAUCCQCZiIAAAgAAANgAh7DbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAMWGnkAGJSBVixzAkAIOLo2J9dtQAgAAwTisNhcEydukDgAAAA8PDw8MAAAAAA8PDw9IIgAH/m//gKRbksunapQzNS/+MYxAkMeGYEeGGQIKnOiWms4CKCryiWUJBRgOaIufo37vPvT7lKtX/t6b+J1b/2f/ZR/+rTygGiTenQYJd0JtKqaOlMiKvm/+MYxBINoM3wADvQCCXQQtjEoJjRxWgmkzT+KSjUyXtS3hlwqg+I3sa4HmE0P9H//pX/4bVo+gT66CSKGOrFQ/VDAzR8uS+T/+MYxBYNgTX0AHhEqCV7BKpK49avq2zywlOONdzJGjt/KWZRIkFDkCLsbyXp/rBRuVy5joFWaCwCrR6WTo5ZUHx0QC0fnyO8/+MYxBsOYPHwAHsKKEwRHDZETStyOZqbvmHsxBdzDwcDTppaZi7Yvx5aXoXoCa8DZVnDh6jMlfNlq1kzUbyNSCGr//VkQXqb/+MYxBwOco4AABJEDPcjN+EIrkkV0Y6EUjUZT5zoQnUhCN9s///////qIf//SpOQSQiskB8QWogHDeaKEM4NLKwIM7LPO/vN/+MYxB0NWo4IAEhEnO5HZCnj7GLVb0vXrOvyhW9Hfn8v////QSr3DNCEMykVJSEMwoLMTIRSgBJ9Io5iyIGjygaBqdLHlgrW/+MYxCIMqIHoABJSAKfnjwKg0JTvBV3/t////liNTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'),
        instances: 1
      },
      {
        name: "click",
        type: "sound",
        audio: new Audio(audioPath + 'click.mp3'),
        instances: 1
      },
      {
        name: "fall-respawn",
        type: "sound",
        audio: new Audio(audioPath + 'fall-respawn-5.mp3'),
        instances: 1
      },
      {
        name: "preload",
        type: "sound",
        audio: new Audio(audioPath + 'preload.mp3'),
        instances: 1
      },
      {
        name: "music_menu-intro",
        audio: new Audio(audioPath + 'menu-intro.mp3'),
        instances: 1
      },
      {
        name: "music_menu",
        audio: new Audio(audioPath + 'menu.mp3'),
        instances: 1
      },
      {
        name: "music_game",
        audio: new Audio(audioPath + 'game.mp3'),
        instances: 1
      },
      {
        name: "win",
        audio: new Audio(audioPath + 'win.mp3'),
        instances: 1
      },
      {
        name: "loose",
        audio: new Audio(audioPath + 'loose.mp3'),
        instances: 1
      },
      {
        name: "disco-combo",
        audio: new Audio(audioPath + 'disco-combo.mp3'),
        instances: 1
      },
      {
        name: "star",
        audio: new Audio(audioPath + 'star.mp3'),
        instances: 3
      },
      {
        name: "star-small",
        audio: new Audio(audioPath + 'star-small.mp3'),
        instances: 3
      },
      {
        name: "bomb-big",
        audio: new Audio(audioPath + 'bomb-big.mp3'),
        instances: 1
      },
      {
        name: "disco",
        audio: new Audio(audioPath + 'disco.mp3'),
        instances: 2
      },
      {
        name: "rocket",
        audio: new Audio(audioPath + 'rocket.mp3'),
        instances: 3
      },
      {
        name: "rockets",
        audio: new Audio(audioPath + 'rockets.mp3'),
        instances: 1
      },
      {
        name: "bomb",
        audio: new Audio(audioPath + 'bomb.mp3'),
        instances: 2
      },
      {
        name: "bombs",
        audio: new Audio(audioPath + 'bombs.mp3'),
        instances: 1
      },
      {
        name: "combine",
        audio: new Audio(audioPath + 'combine.mp3'),
        instances: 2
      },
      {
        name: "shuffle",
        audio: new Audio(audioPath + 'shuffle.mp3'),
        instances: 2
      },
      {
        name: "item-blow",
        audio: new Audio(audioPath + 'item-blow.mp3'),
        instances: 2
      }
    ]

    this.sounds = {}

    this.soundList.forEach(s => {
      const soundInstances = []

      if (s.name.match(/music_/)) {
        s.audio.loop = true
      }

      soundInstances.push(s.audio)

      for (let i = 1; i < s.instances; i++) {
        soundInstances.push(s.audio.cloneNode())
      }

      this.sounds[s.name] = soundInstances
    })

    this.init()
  }

  async init() {
    console.log('try init sound')

    if (this.soundInitialized) {
      return true
    }

    Object.keys(this.sounds).forEach((s) => {
      this.sounds[s].forEach(inst => {
          inst.play()
          .catch(e => {
            // ignore
          })

          inst.pause()
        }
      )
    })

    Object.keys(this.sounds).forEach((s) => {
      this.sounds[s].forEach(inst => inst.pause())
    })

    return await this.sounds.empty[0].play()
    .then(() => {
      console.log('#SOUND enabled')

      // setTimeout(() => {
      //   Object.keys(this.sounds).forEach((s) => {
      //     this.sounds[s].forEach(inst => inst.pause())
      //   })
      // }, 1)

      // setTimeout(() => {
      //   Object.keys(this.sounds).forEach((s) => {
      //     console.log('PAUSE', s)
      //     this.sounds[s].forEach(inst => inst.pause())
      //   })

      //   if (this.musicName) {
      //     this.play(this.musicName)
      //   }
      // }, 500)

      this.soundInitialized = true

      return true
    })
    .catch((e) => {
      console.log('#SOUND catch', e)
      return false
    })
  }

  stop(name) {
    // pause with reset to start
    this.pause(name, true)
  }

  pause(name = '', reset = false) {
    // pause sound
    if (name) {
      this.sounds[name]?.forEach(inst => {
        inst.pause()
        if (reset) {
          inst.currentTime = 0
        }
      })
    }

    // pause all
    if (!name) {
      Object.keys(this.sounds).forEach((s) => {
        this.sounds[s].forEach(inst => {
          inst.pause()
          if (reset) {
            inst.currentTime = 0
          }
        })
      })
    }
  }

  checkPaused(name) {
    let paused = false
    this.sounds[name]?.forEach(inst => {
      if (!inst.paused) {
        paused = false
      }
    })
  }

  play(name, fromStart = false) {
    // console.log('play', name)

    // if music stop all other
    if (name.match(/music_/)) {
      this.musicName = name

      const otherMusic = Object.keys(this.sounds).filter(sName => sName !== name && sName.match(/music_/))

      otherMusic.forEach(m => {
        this.stop(m)
      })
    }

    if (!this.soundInitialized) {
      return
    }

    // iOS can't mute, so just don't play
    // if (!this.soundEnabled && window?.iOS) {
    //   return false
    // }

    // always don't play on mute
    if (!this.soundEnabled) {
      return false
    }



    const freeInstances = this.sounds[name]?.filter(i => i.paused)

    if (!freeInstances.length) {
      // no instances left
      return
    }

    if (fromStart) {
      freeInstances[0].currentTime = 0
    }

    freeInstances[0].play()
  }



  mute(state = true) {
    // console.log(`mute ${ state }`)

    this.soundEnabled = !state

    Object.keys(this.sounds).forEach(soundName => {
      this.sounds[soundName].forEach(inst => {
        inst.volume = this.soundEnabled ? 1 : 0
      })
    })

    // iOS can't mute, so just stop
    if (!this.soundEnabled && window?.iOS) {
      this.stop()
    }

    if (this.soundEnabled) {
      this.init()

      if (this.musicName) {
        this.play(this.musicName)
      }
    }
  }

  _fadeOutAudio(audio, time = 1000) {
    if (audio.paused) {
      return false
    }

    const step = 33 / time

    const interval = setInterval(() => {
      audio.volume = Math.max(0, audio.volume - step)
    }, 33)

    setTimeout(() => {
      clearInterval(interval)
      audio.pause()
      audio.volume = 1
    }, time)
  }

  fadeOut(name) {
    this.sounds[name]?.forEach(inst => this._fadeOutAudio(inst))
  }
}

window.gameAudio = new GameAudio()
