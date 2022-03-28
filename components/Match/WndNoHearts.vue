<template>
  <section v-if="heartErrorOpened" class="match-hearts-error match-window">
    <div class="match-window-close" @click="closeHeartError()" />
    <div class="match-hearts-error-pic" v-html="require('~/assets/i/match/icons/no-hearts.svg?include')" />
    <div class="match-window-subtitle">
      Похоже попытки закончились
    </div>
    <!-- <p>
      Дополнительные попытки можно получить за выполнение заданий
    </p> -->
    <!-- <NuxtLink to="/task" class="btn btn-green" @click.native="closeHeartError()" >Посмотреть задания</NuxtLink> -->
  </section>
</template>

<script>
export default {
  watch: {
    heartErrorOpened(val) {
      this.checkBlur()
    }
  },
  computed: {
    heartErrorOpened() {
      return !this.heartNoError && (this.attempts < 1)
    },
    heartNoError() {
      return this.$store.state.match.heartNoError
    },
    attempts() {
      return this.$store.state.match.profile.attempts ?? 0
    },
    blured() {
      return this.$store.state.match.blured
    }
  },
  mounted() {
    this.checkBlur()
  },
  updated() {
    this.checkBlur()
  },
  methods: {
    checkBlur() {
      if (this.heartErrorOpened && !this.blured) {
        this.$store.commit('match/setBlur', {
          status: true,
          handler: 'MatchWndNoHearts watcher',
          callback: () => { this.closeHeartError() }
        })
      }

      if (
        !this.heartErrorOpened &&
        this.blured &&
        this.$store.state.match.blur.handler == 'MatchWndNoHearts watcher'
      ) {
        this.$store.commit('match/setBlur', {
          status: false,
          handler: 'MatchWndNoHearts watcher - close',
          callback: null
        })
      }
    },
    closeHeartError() {
      this.$store.commit('match/setHeartNoError', true)
    }
  }
}
</script>

<style lang="scss">
.match-hearts-error {
  text-align: center;
}

.match-hearts-error-pic {
  width: 190px;
  margin: 30px auto 0 auto;
}
</style>
