<template>
  <div v-if="paused" class="match-pause match-window">
    <div class="match-window-close" @click="unpause()" />
    <h2 v-if="!shure">Paused</h2>
    <h2 v-if="shure">Уверен?</h2>
    <div v-if="!shure" class="match-pause-buttons">
      <!-- <div class="match-pause-home" @click="shure = true" />
      <div class="match-pause-play" @click="unpause()" /> -->
      <div class="match-pause-sound"
        :class="{ active: sound }"
        v-html="require('~/assets/i/match/icons/sound.svg?include')"
        @click="toggleSound()"
      />
    </div>

    <div v-if="shure" class="match-pause-shure">
      <div class="match-pause-minus">
        -1 <div class="icon-heart" />
      </div>
      <div class="match-pause-minus-title">
        Ты потеряешь <mark>1</mark> попытку!
      </div>
      <div class="match-pause-minus-text">
        Попытки восстанавливаются каждый&nbsp;день
      </div>
      <div v-if="loading" class="match-pause-loading">
        <h5 class="match-end-loading-header">
          Пожалуйста, подождите.
        </h5>
        <div class="lds-dual-ring" />
      </div>
      <div v-if="!loading" class="btn btn-violet" @click="unpause()">Играть</div>
      <div v-if="!loading" class="btn btn-gray" @click="exit()">Выход</div>
    </div>
  </div>
</template>

<script>
import { apiEndLevel } from '~/scripts/Match2/api/api.js'

export default {
  data() {
    return {
      shure: false,
      loading: false
    }
  },
  computed: {
    sound() {
      return this.$store.state.match.sound
    },
    paused() {
      return this.$store.state.match.paused
    },
    levelName() {
      return this.$store.state.match.currentLevel
    },
    token() {
      return this.$store.state.match.token
    },
    attempId() {
      return this.$store.state.match.attempId
    },
    condition: {
      get() {
        return this.$store.state.match.condition
      },
      set(newCondition) {
        this.$store.commit('match/setCondition', newCondition)
      }
    }
  },
  watch: {
    paused(pVal) {
      this.checkBlur()
    }
  },
  mounted() {
    this.shure = false
  },
  methods: {
    checkBlur() {
      if (this.paused) {
        this.$store.commit('match/setBlur', {
          status: true,
          handler: 'MatchPaused watcher',
          callback: () => { this.unpuse() }
        })
      }

      if (!this.paused && (this.$store.state.match.blur?.handler === 'MatchPaused watcher')) {
        this.$store.commit('match/setBlur', {
          status: false,
          handler: 'MatchPaused watcher - close',
          callback: null
        })
      }
    },
    exit() {
      this.loading = true

      setTimeout(() => {
        if (this.loading) {
          this.endLevel()
        }
      }, 5000)

      apiEndLevel(this.token, this.levelName, this.attempId, 0, 0)
        .then(() => {
          this.endLevel()
        })
    },
    endLevel() {
      this.loading = false

      this.shure = false
      this.$store.commit('match/setPause', false)
      this.checkBlur()

      this.$store.commit('match/resetProfileTimestamp')
      this.$store.commit('match/closeLevel')
    },
    unpause() {
      gameAudio.play('click')
      this.shure = false
      this.$store.commit('match/setPause', false)
    },
    toggleSound() {
      this.$store.commit('match/setSound', !this.$store.state.match.sound)

      //
      if (this.$store.state.match.sound) {
        gameAudio.mute(false)
        setTimeout(() => {
          gameAudio.play('click')
        }, 100)
      } else {
        gameAudio.mute(true)
      }
    },
  }
}
</script>

<style lang="scss">
.match-pause-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.match-pause-home {
  width: 60px;
  height: 60px;
  background-image: url('~/assets/i/match/icons/home.svg?inline');
  object-fit: contain;
  background-repeat: no-repeat;
}

.match-pause-play {
  width: 72px;
  height: 72px;
  background-image: url('~/assets/i/match/icons/play-g.svg?inline');
  object-fit: contain;
  background-repeat: no-repeat;
  margin: 0 10px;
}

.match-pause-sound {
  width: 60px;
  height: 60px;

  svg {
    width: 100%;
    height: 100%;
  }

  .sound-on {
    display: none;
  }

  &.active {
    .sound-off {
      display: none;
    }
    .sound-on {
      display: block;
    }
  }
}

.match-pause-shure {
  text-align: center;
  color: #1F1F1F;
}

.match-pause-minus {
  width: 180px;
  height: 89px;
  margin: 0 auto;
  background: #E9E9E9;
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  font-weight: 900;
  font-size: 66px;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;

  .icon-heart {
    width: 64px;
    height: 54px;
    margin-left: 10px;
  }
}

.match-pause-minus-title {
  font-weight: 900;
  font-size: 17px;
  line-height: 100%;
  margin-top: 20px;
  text-align: center;

  mark {
    color: #EC2F2E;
    background: transparent;
  }
}

.match-pause-minus-text {
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 16px;
  text-align: center;
}

.match-pause-loading {
  text-align: center;
  margin-bottom: 20px;

  .lds-dual-ring {
    width: 30px;
    height: 30px;
    margin: 10px 0;

    &::after {
      width: 30px;
      height: 30px;
      border-color: #888 transparent #888 transparent;
    }
  }
}
</style>
