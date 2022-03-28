<template>
  <section class="main-settings" :class="{ settingsOpened, settingsClosed: !settingsOpened }">
    <div class="main-settings-close" @click="clickSound(); clickClose()" />
    <div class="main-settings-profile">
      <div class="main-settings-ava">
        <Ava />
      </div>
      <div class="main-settings-profile-right">
        <div class="main-settings-username">{{ nickname }}</div>
        <div class="main-settings-score">{{ points }}</div>
      </div>
    </div>
    <div class="main-settings-buttons">
      <NuxtLink to="/settings" class="btn btn-violet" v-on:click.native="clickSound(); clickClose()">
        Настройки
      </NuxtLink>
      <div class="main-setings-sound-btn btn" :class="{ active: this.sound }" @click="clickSound(); toggleSound()">
        {{ this.sound ? 'Выключить' : 'Включить' }} звук
        <div class="main-setings-sound-icon" v-html="require(`~/assets/i/match/icons/sound-b.svg?include`)" />
      </div>
      <div class="btn" @click="clickSound(); howToPlay()">Как играть?</div>
      <NuxtLink to="/close" class="btn" v-on:click.native="clickSound()">
        Выход из игры
      </NuxtLink>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    settingsOpened: {
      type: Boolean,
      default: false,
      require: true
    },
    clickClose: {
      type: Function,
      require: true
    }
  },
  watch: {
    settingsOpened() {
      this.checkBlur()
    }
  },
  computed: {
    points() {
      return this.$store.state.match.profile.points ?? ''
    },
    nickname() {
      return this.$store.state.match.profile.nickname ?? ''
    },
    profile() {
      return this.$store.state.match.profile
    },
    sound() {
      return this.$store.state.match.sound
    }
  },
  mounted() {
    this.checkBlur()
  },
  unmounted() {
    this.checkBlur()
  },
  methods: {
    checkBlur() {
      if (this.settingsOpened) {
        this.$store.commit('match/setBlur', {
          status: true,
          handler: 'MatchMainSetings watcher',
          callback: () => { this.clickClose() }
        })
      }

      if (!this.settingsOpened && (this.$store.state.match.blur?.handler === 'MatchMainSetings watcher')) {
        this.$store.commit('match/setBlur', {
          status: false,
          handler: 'MatchMainSetings watcher - close',
          callback: null
        })
      }
    },
    howToPlay() {
      this.clickClose()
      this.$store.commit('match/setShowTutorial', true)
    },
    clickSound() {
      gameAudio.play('click')
    },
    toggleSound() {
      this.$store.commit('match/setSound', !this.$store.state.match.sound)
    }
  }
}
</script>

<style lang="scss">
.main-settings {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 26px 24px 110px 24px;
  background-color: #fff;
  border-radius: 32px 32px 0 0;
  z-index: 1000;
  box-sizing: border-box;
  will-change: transform;
  transform: translateY(100%);
  transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);

  &.settingsOpened {
    transform: translateY(0);
  }
}

.main-settings-close {
  position: absolute;
  top: 26px;
  right: 24px;
  width: 24px;
  height: 24px;
  background-image: url('~/assets/i/match/icons/x.svg?inline');
}

.main-settings-profile {
  display: flex;
}

.main-settings-ava {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
}

.main-settings-profile-right {
  margin-left: 20px;
  margin-top: 16px;
  flex-shrink: 1;
  width: calc(100% - 150px);
}

.main-settings-username {
  position: relative;
  display: block;
  height: 19px;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 100%;
  color: #0C0A44;
  overflow: hidden;
  box-sizing: border-box;
  padding-right: 4px;
  flex-shrink: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  }
}

.main-settings-score {
  display: block;
  margin-top: 2px;
  font-weight: 900;
  font-size: 27px;
  line-height: 100%;
  letter-spacing: 0.045em;
  color: #26BF0D;
  background: -webkit-linear-gradient(#26BF0D, #A7DD0F);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-settings-buttons {
  margin-top: 30px;

  .btn {
    width: 94%;
    margin: 9px 0 9px 3%;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }
}

.main-setings-sound-btn {

  &.active {
    background-color: #5FC101;
    color: #fff;

    .sound-on {
      display: block;
    }

    .sound-off {
      display: none;
    }
  }
}

.main-setings-sound-icon {
  position: absolute;
  margin-left: 15px;
  margin-top: -2px;
  width: 24px;
  height: 20px;
  display: inline-block;

  svg {
    display: block;
    width: 100%;
  }

  .sound-on {
    display: none;
    fill: #fff;
  }

  .sound-off {
    fill: #a0a0a0;
  }
}

.settingsClosed .main-settings-buttons .btn {
  animation-name: settings-button-fadedown;
  &:nth-child(4) {
    animation-delay: 0ms;
  }
  &:nth-child(3) {
    animation-delay: 50ms;
  }
  &:nth-child(2) {
    animation-delay: 150ms;
  }
  &:nth-child(1) {
    animation-delay: 200ms;
  }
}
.settingsOpened .main-settings-buttons .btn {
  animation-name: settings-button-fadeup;
  &:nth-child(1) {
    animation-delay: 150ms;
  }
  &:nth-child(2) {
    animation-delay: 200ms;
  }
  &:nth-child(3) {
    animation-delay: 250ms;
  }
  &:nth-child(4) {
    animation-delay: 300ms;
  }
}

@keyframes settings-button-fadeup {
  0% {
    transform: translateY(200px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes settings-button-fadedown {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(200px);
    opacity: 0;
  }
}
</style>
