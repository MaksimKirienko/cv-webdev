<template>
  <section class="flappy-game">
    <div ref="flappyGameContainer" class="flappy-game-container" />
    <FlappyPauseWnd v-if="state == 'pause'" :home="home" :replay="replay" :close="unpause" />
    <FlappyEndGameWnd
      v-if="state == 'win'"
      :replay="replay"
      :stars="stars"
      :winner="winner"
      :time="timeString"
      :coins="coins + '/' + coinsTotal"
    />
    <div class="flappy-top">
      <div class="flappy-top-block">
        <div class="flappy-top-coins">
          {{ coins }} / {{ coinsTotal }}
          <div class="icon-coin" />
        </div>
      </div>
      <div class="flappy-top-block">
        <div class="flappy-top-timer">
          <div class="icon-timer" />
          {{ timeLeftString }}
        </div>
      </div>
      <div class="flappy-top-block">
        <div class="flappy-top-pause" @click="pause" />
      </div>
    </div>
    <div class="flappy-bottom">
      <FlappyProgress :progress="progress" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Flappy',
  data() {
    return {
      state: 'game',
      game: null as any | null,
      distance: 0,
      // distanceToBeat: 15000,
      distanceToBeat: 5000,
      timeCounter: 0,
      startTime: 0,
      pauseTime: 0,
      // timeToBeat: [55, 50, 45, 40], // 2 3 4 5 stars
      timeToBeat: [22, 19, 17, 15], // 2 3 4 5 stars
      timeTotal: 45
    }
  },
  computed: {
    progress(): number {
      return Math.min(1, this.distance / this.distanceToBeat)
    },
    winner(): boolean {
      return this.timeCounter <= this.timeTotal * 1000
    },
    coins(): number {
      return this.game?.coinsCollected ?? 0
    },
    coinsTotal(): number {
      return Math.floor((this.distanceToBeat - 400) / 200) + 1
    },
    timeString(): string {
      const timeCalc = this.timeCounter * 20
      return `${ Math.floor(timeCalc / 60000) }:${ new Date(timeCalc).toISOString().substr(17, 2) }`
    },
    timeLeftString(): string {
      const timeLeft = Math.max(0, this.timeTotal * 1000 - this.timeCounter) * 20
      return `${ Math.floor(timeLeft / 60000) }:${ new Date(timeLeft).toISOString().substr(17, 2) }`
    },
    stars(): number {
      let stars = 1
      for (let i = 0; i < 4; i++) {
        if (this.timeCounter <= this.timeToBeat[i] * 1000) {
          stars = i + 2
        }
      }
      return stars
    }
  },
  mounted() {
    if (!this.$refs.flappyGameContainer || (typeof window as string === 'undefined')) {
      return false
    }

    if (!this.game) {
      import('~/scripts/Flappy')
        .then(module => {
          const FlappyGame = module.FlappyGame

          this.game = new FlappyGame(this.$refs.flappyGameContainer as HTMLElement)

          if (window) {
            (window as any).game = this.game
          }

          this.game.ticker = () => {
            this.tick()
          }

          if (process.env.NODE_ENV === 'development') {
            this.game.showFps(true)
          }
        })
    }
  },
  destroyed() {
    this.game?.destroy()
    this.game = null
  },
  methods: {
    pause() {
      this.state = 'pause'
      this.game.pause()
    },
    unpause() {
      this.state = 'game'
      this.game.unpause()
    },
    home() {
      this.$store.commit('flappy/setStage', 'rules')
    },
    tick() {
      // if started flying - count time
      if (this.state === 'game' && this.game.stage === 2) {
        this.distance = this.game.worldPosition

        if (this.progress === 1) {
          this.win()
        }
        const currentTimestamp = Date.now()
        if (!this.startTime) {
          this.startTime = currentTimestamp
        }
        this.timeCounter = currentTimestamp - this.startTime + this.pauseTime
      }
    },
    win() {
      this.game.pause()
      this.state = 'win'

      console.log(`win time ${ this.timeCounter }`)
    },
    replay() {
      this.game.reset()
      this.startTime = 0
      this.timeCounter = 0
      this.pauseTime = 0
      this.state = 'game'
    }
  }
})
</script>

<style lang="scss">
.flappy-game {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.flappy-game-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.flappy-top {
  position: relative;
  display: flex;
  margin: 50px 20px 0 20px;
}

.flappy-top-block {
  flex: 0 0 33.333%;
}

.flappy-top-coins {
  position: relative;
  display: inline-block;
  top: -4px;
  color: #fff;
  font-weight: 800;
  font-size: 20px;
  line-height: 100%;
  border: 3px solid #FFFFFF;
  border-radius: 50px;
  padding: 3px 6px 3px 10px;
  white-space: nowrap;
}

.flappy-top-timer {
  color: #fff;
  font-weight: 800;
  font-size: 22px;
  line-height: 100%;
  margin: 0 auto;
  text-align: center;

  .icon-timer {
    width: 21px;
    height: 21px;
    margin-bottom: -2px;
  }
}

.flappy-top-pause {
  cursor: pointer;
  width: 33px;
  height: 33px;
  border: 3px solid #FFFFFF;
  border-radius: 50%;
  margin: -6px 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    display: block;
    height: 14px;
    width: 5px;
    border-left: 3px solid #FFFFFF;
    border-right: 3px solid #FFFFFF;
  }
}

.flappy-bottom {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  padding-bottom: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 150px;
    bottom: 0;
    left: 0;
    background: linear-gradient(0deg, #4EC8FF 0%, rgba(72, 197, 255, 0.188293) 81.17%, rgba(70, 197, 255, 0) 100%);
  }
}
</style>
