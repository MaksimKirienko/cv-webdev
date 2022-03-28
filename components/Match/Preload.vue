<template>
  <section v-if="!preloaded" class="preload">
    <!-- <div class="preload-rotate">
      <picture>
        <source srcset="~/assets/i/match/preload/milk.png?webp&inline" type="image/webp">
        <img class="preload-rotate-image" width="589" height="535" src="~/assets/i/match/preload/milk.png" alt="">
      </picture>
    </div>
    <div class="preload-light" v-html="require('~/assets/i/match/preload/light.svg?include')"/> -->
    <div ref="composition" class="preload-composition">
      <picture>
        <source srcset="~/assets/i/match/preload/cloud-1.png?webp&inline" type="image/webp">
        <img class="preload-composition-image preload-cloud-1" width="220" height="160" src="~/assets/i/match/preload/cloud-1.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/preload/cloud-3.png?webp&inline" type="image/webp">
        <img class="preload-composition-image preload-cloud-3" width="200" height="159" src="~/assets/i/match/preload/cloud-3.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/preload/cloud-4.png?webp&inline" type="image/webp">
        <img class="preload-composition-image preload-cloud-4" width="148" height="114" src="~/assets/i/match/preload/cloud-4.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/preload/main.png?webp&inline" type="image/webp">
        <img class="preload-composition-image preload-main" width="303" height="435" src="~/assets/i/match/preload/main.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/preload/cloud-2.png?webp&inline" type="image/webp">
        <img class="preload-composition-image preload-cloud-2" width="118" height="109" src="~/assets/i/match/preload/cloud-2.png" alt="">
      </picture>
    </div>
    <div class="preload-status-container">
      <div ref="preloadStatus" class="preload-status">
        <div v-if="!noAccess && !noProfile" ref="preloadBtn" class="preload-btn btn btn-green" @click="preloadEnd">
          Играть
        </div>
        <div class="preload-status-error" :class="{ active: noAccess }">
          Нет доступа,<br>попробуйте перезапустить&nbsp;игру
          <br>
          <NuxtLink to="/close" class="btn">Выход</NuxtLink>
        </div>
        <div class="preload-status-error" :class="{ active: noProfile }">
          Пожалуйста подождите,
          <br>
          загружаем профиль
          <br>
          <div class="lds-dual-ring" />
          <br>
          <NuxtLink to="/close" class="btn">Выход</NuxtLink>
        </div>
        <div v-if="!noAccess && !noProfile" class="preload-status-top">Загрузка ресурсов</div>
        <div v-if="!noAccess && !noProfile" class="preload-status-bar">
          <div
            class="preload-status-bar-fill" :style="{
              width: `${ Math.round(percentage * 100) }%`
            }"
          />
        </div>
        <div v-if="!noAccess && !noProfile" class="preload-status-percentage">{{ Math.round(percentage * 100) }}%</div>
      </div>
    </div>
    <div class="preload-files">
      <div
        v-for="image in images"
        :key="'preload-image-' + image"
        class="preload-item"
      >
        <picture>
          <source :srcset="require(`~/assets/i/match/${ image }?webp`)" type="image/webp">
          <img :src="require(`~/assets/i/match/${ image }`)" width="1" alt="" @load="imageLoaded">
        </picture>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      noAccess: false,
      noProfile: false,
      percentage: 0,
      numLoaded: 0,
      waiting: true,
      images: [],
      imagesToPreload: [
        'sprites/items.png',
        'sprites/icons.png',
        'sprites/blockers.png',
        'sprites/disco-green.png',
        'sprites/disco-blue.png',
        'sprites/disco-red.png',
        'sprites/disco-purple.png',
        'sprites/disco-yellow.png',
        'sprites/lightning.png',
        'sprites/modifiers.png',
        'sprites/power.png',
        'sprites/rocketFlame.png',
        'sprites/disco-combo.png',
        'sprites/blow.png',
        'sprites/chest.png',
        'main/map.jpg',
        'main/lvls-sprite.png',
        'tutorial/marmelad-1.png',
        'tutorial/marmelad-2.png',
        'tutorial/marmelad-3.png',
        'tutorial/marmelad-4.png',
        'tutorial/marmelad-5.png'
      ]
    }
  },
  mounted() {
    if (!this.token || this.wrongToken) {
      this.noAccess = true
      return
    }

    this.images = this.imagesToPreload
    // if (window.webp) {
    //   this.images = this.imagesToPreload
    // } else {
    //   this.images = this.imagesToPreload.map(i => 'low/' + i)
    // }

    if (this.$store.state.match.preloaded) {
      this.$store.commit('match/setCondition', 'main')
      return
    } else {
      gameAudio.play('preload')

      setTimeout(() => {
        gameAudio.play('preload')
      }, 100)

      setTimeout(() => {
        this.waiting = false
        this.goNext()
      }, 2000)
    }
  },
  computed: {
    preloaded() {
      return this.$store.state.match.preloaded
    },
    token() {
      return this.$store.state.match.token
    },
    profile() {
      return this.$store.state.match.profile
    },
    wrongToken() {
      return this.$store.state.match.wrongToken
    }
  },
  methods: {
    imageLoaded() {
      this.numLoaded++
      this.percentage = this.numLoaded / this.imagesToPreload.length
      this.goNext()
    },
    preloadEnd() {
      if (!this.token || this.wrongToken) {
        this.noAccess = true
        this.$refs.preloadStatus.classList.add('preload-fade-down')
        return
      }

      if (!this.profile || (Object.keys(this.profile).length < 2)) {
        this.noProfile = true

        setTimeout(() => {
          this.preloadEnd()
        }, 1000)
        return
      }

      gameAudio.init()

      this.$refs.preloadStatus.classList.add('preload-fade-down')
      this.$refs.composition.classList.add('preload-scale')
      this.$store.commit('match/setPreloaded')

      setTimeout(() => {
        this.$store.commit('match/setCondition', 'main')
        gameAudio.fadeOut('preload', 3000)
      }, 1000)
    },
    goNext() {
      if (this.percentage !== 1) {
        return
      }

      if (!this.waiting) {

        if (gameAudio.soundInitialized || !this.$store.state.match.sound) {
          this.preloadEnd()
        } else {
          this.$refs.preloadBtn.classList.add('active')
          this.$refs.preloadStatus.classList.add('preload-fade-down')
        }
      }
    }
  }
}
</script>

<style lang="scss">
.preload {
  position: relative;
  width: 100%;
  height: 100%;
  // background: linear-gradient(-30deg, #26BF0D 0%, #A7DD0F 100%);
  background-image: url('~/assets/i/match/preload/preload_bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

// .preload-rotate {
//   position: absolute;
//   width: 589px;
//   max-width: 160%;
//   top: 0;
//   left: 50%;
//   mix-blend-mode: overlay;
//   transform: translateX(-50%);
// }

// .preload-rotate-image {
//   width: 100%;
//   height: auto;
//   will-change: transform;
//   transform: rotate(0);
//   transform-origin: center;
//   animation: preload-rotate 10s linear infinite;
// }

// @keyframes preload-rotate {
//   0% {
//     transform: rotate(0);
//   }
//   0% {
//     transform: rotate(360deg);
//   }
// }

// .preload-light {
//   position: absolute;
//   width: 540px;
//   top: 30px;
//   left: 50%;
//   transform: translateX(-50%);
// }

.preload-composition {
  position: relative;
  width: 320px;
  margin: 0 auto;
  height: 340px;
  margin-top: 20%;
}

.preload-composition-image {
  position: absolute;
  height: auto;
  will-change: transform;
  transform: translateY(0) translate3d(0, 0, 0);
  filter: drop-shadow(0 4px 9px rgba(0, 0, 0, 0.25));
  animation: preload-images-waves 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes preload-images-waves {
  0% {
    transform: translateY(0) translate3d(0, 0, 0);
  }
  50% {
    transform: translateY(-10px) translate3d(0, 0, 0);
  }
  100% {
    transform: translateY(0) translate3d(0, 0, 0);
  }
}

.preload-scale {
  animation: preload-scale 1s ease-in-out forwards;
}

@keyframes preload-scale {
  0% {
    transform: scale(1) translate3d(0, 0, 0);
  }
  40% {
    transform: scale(0.7) translate3d(0, 0, 0);
  }
  100% {
    transform: scale(1.2) translate3d(0, 0, 0);
  }
}

.preload-cloud-1 {
  width: 36%;
  top: 17%;
  left: -3%;
}

.preload-cloud-2 {
  width: 20%;
  top: 47%;
  right: 9%;
  animation-delay: -800ms;
}

.preload-cloud-3 {
  width: 33%;
  top: 25%;
  right: -22%;
  animation-delay: -1200ms;
}

.preload-cloud-4 {
  width: 25%;
  top: 58%;
  left: -4%;
  animation-delay: -1600ms;
}

.preload-main {
  width: 60%;
  top: 15%;
  left: 20%;
  animation-delay: -2000ms;
}

.preload-status-container {
  position: relative;
  width: 100%;
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10%;
  padding-bottom: 10%;
  box-sizing: border-box;
}

.preload-status {
  width: 100%;
  color: #fff;
  font-weight: 600;
  text-align: center;
}

.preload-status-top {
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
}

.preload-status-bar {
  width: 60%;
  max-width: 300px;
  height: 4px;
  border-radius: 4px;
  margin: 11px auto;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.1) 100%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
}

.preload-status-bar-fill {
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
}

.preload-status-percentage {
  font-size: 0.9rem;
  line-height: 100%;
  font-weight: 400;
  opacity: 0.7;
}

.preload-fade-down {
  .preload-status-top {
    animation: preload-fade-down 1.1s ease-in-out forwards;
  }
  .preload-status-bar {
    animation: preload-fade-down 0.8s ease-in-out forwards;
  }
  .preload-status-percentage {
    animation: preload-fade-down 0.5s ease-in-out forwards;
  }
}

@keyframes preload-fade-down {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(200px);
    opacity: 0;
  }
}

.preload-files {
  position: fixed;
  left: 0;
  top: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
}

.preload-btn {
  pointer-events: unset;
  display: none;
  opacity: 0;
  position: relative;
  z-index: 10;
  transition: opacity 0.2s;
  box-sizing: border-box;
  width: 180px;

  &.active {
    pointer-events: auto;
    display: inline-block;
    opacity: 1;
  }
}

.preload-status-error {
  display: none;
  padding: 20px 20px;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.6);

  .btn {
    text-shadow: none;
  }

  &.active {
    display: block;
  }
}
</style>
