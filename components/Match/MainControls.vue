<template>
  <section class="main-controls" :class="{ settingsOpened }">
    <div class="main-controls-buttons">
      <NuxtLink
        to="/task"
        class="control-btn control-btn-task"
        v-html="require('~/assets/i/match/icons/v.svg?include')"
        v-on:click.native="clickSound()"
      />
      <NuxtLink
        to="/prizes"
        class="control-btn control-btn-prizes"
        v-html="require('~/assets/i/match/icons/present.svg?include')"
        v-on:click.native="clickSound()"
      />
      <div
        class="control-btn control-btn-play"
        v-html="require('~/assets/i/match/icons/play.svg?include')"
        @click="clickSound(); startGame()"
      />
      <NuxtLink
        to="/leaderboard"
        class="control-btn control-btn-rating"
        v-html="require('~/assets/i/match/icons/cup.svg?include')"
        v-on:click.native="clickSound()"
      />
      <div
        class="control-btn control-btn-settings"
        v-html="require('~/assets/i/match/icons/settings.svg?include')"
        @click="clickSound(); clickSettings()"
      />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    clickSettings: {
      type: Function,
      require: true
    },
    settingsOpened: {
      type: Boolean,
      require: true
    }
  },
  computed: {
    lastLevel() {
      const ll = this.$store.state.match.profile?.level ?? 1
      return ll < 50 ? ll : 50
    },
    profile() {
      return this.$store.state.match.profile
    },
  },
  methods: {
    clickSound() {
      gameAudio.play('click')
    },
    startGame() {
      if (this.profile.attempts) {
        this.$store.commit('match/startLevelWnd', this.lastLevel)
      } else {
        this.$store.commit('match/setHeartNoError', false)
      }
    }
  }
}
</script>

<style lang="scss">
.main-controls {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 14vw;
  width: 100%;
  background: #FFF;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
  border-radius: 24px 24px 0 0;
  z-index: 1001;
}

@media (min-height: 640px) {
  .main-controls {
    bottom: 10px;

    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      bottom: -10px;
      left: 0;
      height: 10px;
      background-color: #fff;
    }
  }
}

@media (min-height: 740px) {
  .main-controls {
    bottom: 15px;

    &::after {
      bottom: -15px;
      height: 15px;
    }
  }
}

@media (min-width: 480px) {
  .main-controls {
    height: 64px;
  }
}

.control-btn {
  position: absolute;
  top: -20%;
  width: 14.375%;
  border-radius: 50%;
  background: #725BFF;
  overflow: hidden;
  transition: filter 0.3s ease-in-out;

  &::before {
    content: '';
    display: block;
    width: 91.34%;
    padding-bottom: 91.34%;
    margin-bottom: 8.66%;
    margin-left: 4.33%;
    border-radius: 50%;
    background: linear-gradient(150deg, #725BFF 0%, #A286FF 100%);
  }

  svg {
    position: absolute;
    left: 50%;
    top: 49%;
    width: 55%;
    height: 55%;
    transform: translate(-50%, -50%);
    object-position: center center;
  }
}

.settingsOpened .control-btn {
  filter: saturate(0);
  pointer-events: none;
}

.settingsOpened .control-btn-settings {
  filter: saturate(1);
  pointer-events: auto;
}

.control-btn-task {
  left: 6%;
}

.control-btn-prizes {
  left: 23%;
}

.control-btn-play {
  width: 18%;
  top: -48%;
  left: 50%;
  transform: translateX(-50%);
  background: #53C203;

  &::before {
    background: linear-gradient(150deg, #73DD20 0%, #63D213 100%);
  }

  svg {
    width: 50%;
    height: 50%;
    top: 48%;
    left: 55%;
  }
}

.control-btn-rating {
  right: 23%;
}

.control-btn-settings {
  right: 6%;
}
</style>
