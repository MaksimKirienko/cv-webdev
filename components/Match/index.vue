<template>
  <section class="match">
    <MatchBlur />
    <MatchPreload v-if="condition == 'preload'" />
    <MatchMain v-if="condition == 'main'" />
    <MatchGame v-if="condition == 'game'" />
  </section>
</template>
<script>
  export default {
    data() {
      return {
        levelData: {}
      }
    },
    watch: {
      sound(soundVal) {
        // watch store sound var
        if (!gameAudio) {
          return
        }
        gameAudio.mute(!soundVal)
      }
    },
    computed: {
      preloaded() {
        return this.$store.state.match.preloaded
      },
      sound() {
        return this.$store.state.match.sound
      },
      blured() {
        return this.$store.state.match.blured
      },
      token() {
        return this.$store.state.match.token
      },
      condition: {
        get () {
          return this.$store.state.match.condition
        },
        set (condition) {
          this.$store.commit('match/setCondition', condition)
        }
      }
    },
    mounted() {
      if (gameAudio) {
        gameAudio.mute(!this.sound)
      }

      if (process.env.NODE_ENV !== 'development') {
        if (!this.preloaded) {
          this.condition = 'preload'
        } else {
          this.condition = 'main'
        }

      } else {
        // this.condition = 'main'
        if (!this.preloaded) {
          this.condition = 'preload'
        } else {
          this.condition = 'main'
        }
        // this.condition = 'game'
        // this.$store.commit('match/startLevel', 1)
      }
    },
    created() {
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = 'hidden'
      }

      if ((typeof localStorage !== 'undefined') && localStorage) {
        this.$store.commit('match/setSound', localStorage.getItem('sound') === '0' ? false : true)
      }
    },
    destroyed() {
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = ''
      }
    }
  }
</script>

<style lang="scss">
.match {
  position: relative;
  height: 100%;
  user-select: none;
  background: #fff;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  overflow: hidden;
}

// .ios {
//   .match {
//     height: -webkit-fill-available;
//   }
// }
</style>
