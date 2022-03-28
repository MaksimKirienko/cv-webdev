<template>
  <MatchServerError />
</template>

<script>
import { testToken, apiGetProfile } from '~/scripts/Match2/api/api.js'

export default {
  data() {
    return {
      checkProfileInterval: null
    }
  },
  computed: {
    profile() {
      return this.$store.state.match.profile
    },
    token() {
      return this.$store.state.match.token
    },
    wrongToken() {
      return this.$store.state.match.wrongToken
    },
    condition() {
      return this.$store.state.match.condition
    },
    pending: {
      get() {
        return window?.pending?.profile
      },
      set(val) {
        if (!window) {
          return false
        }
        if (typeof window.pending === 'undefined') {
          window.pending = {}
        }
        window.pending.profile = val
      }
    }
  },
  created() {
    this.checkProfileInterval = setInterval(() => {
      this.checkProfile()
    }, 1000)
    this.checkProfile()
  },
  destroyed() {
    clearInterval(this.checkProfileInterval)
  },
  mounted() {
    this.checkToken()

    if (!this.profile || !Object.keys(this.profile).length) {
      this.getProfile()
    }
  },
  methods: {
    checkToken() {
      if (this.wrongToken || (typeof window == 'undefined')) {
        return
      }
      const oldToken = this.token
      const urlSearchParams = new URLSearchParams(window?.location.search)
      const params = Object.fromEntries(urlSearchParams.entries())
      const getPToken = params.token ?? ''
      const localToken = (typeof localStorage !== 'undefined') && localStorage ? localStorage.getItem('token') : ''
      let newToken

      if (getPToken) { // from get parameter
        newToken = getPToken
      } else if (process.env.NODE_ENV === 'development') { // dev
        newToken = testToken
      } else if (localToken) { // local storage
        newToken = localToken
      }

      //demo token
      newToken = 'xxx'

      if (newToken && (oldToken !== newToken)) {
        this.setToken(newToken)
      }

      // can't get token
      if (!newToken) {
        console.log(`can't get token`)
        this.setWrongToken()
      }
    },
    setWrongToken() {
      // no token - game over, clear and redirect

      if (typeof window == 'undefined') {
        return
      }

      console.log('set wrong token')
      const urlSearchParams = new URLSearchParams(window?.location.search)
      const params = Object.fromEntries(urlSearchParams.entries())
      if ((typeof localStorage !== 'undefined') && localStorage) {
        localStorage.removeItem('token')
      }

      if ((params && Object.keys(params).length) || this.$router.path !== '/') {
        this.$router.replace('/')
      }
      this.$store.commit('match/setWrongToken')
    },
    setToken(token) {
      this.$store.commit('match/setToken', token)
    },
    checkProfile() {
      const ts = Date.now()

      // 10 min
      if (this.profile && (this.condition !== 'game') && (ts - this.profile.timestamp > (10* 60 * 1000))) {
        this.getProfile()
      }
    },
    getProfile() {
      if (!this.token) {
        this.checkToken()
      }

      // no ddos
      this.$store.commit('match/setNowProfileTimestamp')

      if (this.pending) {
        return
      }

      this.pending = true

      apiGetProfile(this.token)
      .then(data => {
        this.pending = false

        if (data === 'unauthorized' || (data?.message && data.message === 'Unauthenticated.')) {
          // backend says token wrong
          console.log('backend says wrong token')
          this.setWrongToken()
        }

        if (data && data.level) {
          this.$store.commit('match/setProfile', data)
        }
      })
      .catch((e) => {
        this.pending = false
        this.$store.commit('match/setNowProfileTimestamp') // no ddos
        this.$store.commit('match/setServerError', e)
      })
    }
  }
}
</script>
