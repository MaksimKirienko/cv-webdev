<template>
  <section v-if="serverError" class="match-server-error match-window">
    <div class="match-window-close" @click="clearError()" />
    <div class="match-server-error-pic" v-html="require('~/assets/i/match/icons/404.svg?include')" />
    <div class="match-window-subtitle">
      Ошибка при ответе сервера
    </div>
    <p>
      Уже разбираемся. Попробуйте зайти чуть позже или проверьте подключение интернета.
    </p>
    <div class="btn btn-violet" @click="clearError()" >Хорошо</div>
  </section>
</template>

<script>
import { apiSendError } from '~/scripts/Match2/api/api.js'

export default {
  watch: {
    serverError(val) {
      if (val) {
        console.log(val)

        apiSendError(`
          token: ${ this.token }
          log: ${ val }
        `)

        this.$store.commit('match/setBlur', {
          status: true,
          handler: 'MatchServerError watcher',
          callback: () => { this.clearError() }
        })
      }

      if (!val && (this.$store.state.match.blur?.handler === 'MatchServerError watcher')) {
        this.$store.commit('match/setBlur', {
          status: false,
          handler: 'MatchServerError watcher - close',
          callback: null
        })
      }
    }
  },
  computed: {
    serverError() {
      return this.$store.state.match.serverError
    },
    token() {
      return this.$store.state.match.token
    }
  },
  methods: {
    clearError() {
      this.$store.commit('match/setServerError', '')
    }
  }
}
</script>

<style lang="scss">
.match-server-error {
  text-align: center;
  z-index: 1100;
}

.match-server-error-pic {
  width: 145px;
  margin: 0 auto;
}
</style>
