<template>
  <section v-if="startLevelNum" class="match-start match-window">
    <div class="match-window-close" @click="closeWnd()" />
    <div class="match-start-tbar">
      <div class="match-start-tbar-count">
        {{ startLevelNum }}
      </div>
      Уровень
    </div>

    <div class="stars-block">
      <div class="star" :class="{ active: stars > 1 }" />
      <div class="star" :class="{ active: stars > 0 }" />
      <div class="star" :class="{ active: stars > 2 }" />
    </div>

    <div v-if="levelOpened && !loading && !loadingError" class="match-start-opened">
      <div class="match-start-record">
        Счёт
        <div class="match-start-record-count">{{ record }}</div>
      </div>
      <button class="btn btn-violet" @click="startLevelRequest()">
        Старт
      </button>
    </div>

    <div v-if="loading && !loadingError" class="match-start-loading">
      <h5 class="match-start-loading-header">
        Пожалуйста, подождите.
        <br>
        Ждем ответа сервера.
      </h5>
      <div class="lds-dual-ring" />
    </div>

    <div v-if="loading && loadingError" class="match-start-loading-error">
      <h5 class="match-start-loading-header">
        Не получилось запустить уровень, возможно проблемы с интернетом.
        <br>
        Попробуйте чуть позже
      </h5>
    </div>

    <div v-if="!levelOpened" class="match-start-closed">
      <div class="match-start-need">
        Необходимо:
        <div class="match-start-need-count">{{ starsToOpen }}</div>
        <div class="icon-star" />
      </div>
      <button class="btn btn-green" @click="closeWnd()">
        Хорошо
      </button>
    </div>
  </section>
</template>

<script>
import { apiStartLevel } from '~/scripts/Match2/api/api.js'

export default {
  data() {
    return {
      loading: false,
      loadingError: false
    }
  },
  watch: {
    startLevelNum(val) {
      if (val) {
        this.$store.commit('match/setBlur', {
          status: true,
          handler: 'MatchWndStart watcher',
          callback: () => { this.closeWnd() }
        })
      } else {
        this.$store.commit('match/setBlur', {
          status: false,
          handler: 'MatchWndStart watcher - close',
          callback: null
        })
      }
    }
  },
  computed: {
    record() {
      return this.level?.record
    },
    stars() {
      return this.level?.stars
    },
    starsToOpen() {
      return this.level?.starsToOpen
    },
    levelOpened() {
      return this.level?.open
    },
    level() {
      return this.levels[this.startLevelNum - 1]
    },
    levels() {
      return this.$store.state.match.levels ?? []
    },
    startLevelNum() {
      return this.$store.state.match.startLevelWnd
    },
    token() {
      return this.$store.state.match.token
    }
  },
  methods: {
    startLevelRequest() {
      const levelToStart = this.startLevelNum

      this.loading = true

      setTimeout(() => {
        if (this.loading) {
          this.loadingError = true
        }
      }, 15000)

      apiStartLevel(this.token, levelToStart)
      .then((data) => {
        this.startLevel(levelToStart, data.attempId)
      })
      .catch((e) => {
        this.$store.commit('match/setServerError', e)
      })
    },
    startLevel(levelToStart, attempId) {
      this.loading = false

      this.$store.commit('match/setBlur', {
        status: false,
        handler: 'MatchWndStart level start - close',
        callback: null
      })
      this.$store.commit('match/setAttempId', attempId)
      this.$store.commit('match/startLevel', levelToStart)
    },
    closeWnd() {
      this.$store.commit('match/startLevelWnd', 0)
      this.$store.commit('match/setBlur', {
        status: false,
        handler: 'MatchWndStart close wnd - close',
        callback: null
      })
    }
  }
}
</script>

<style lang="scss">
.match-start {
  .stars-block {
    width: 185px;
    margin: 10px auto 0 auto;
  }
}

.match-start-tbar {
  width: 190px;
  height: 60px;
  margin: 0 auto;
  background: linear-gradient(150deg, #73DD20 0%, #65D315 100%);
  border-radius: 21px;
  margin-top: -50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 27px;
  color: #fff;
  -webkit-text-stroke: 1px black;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 1);
  border: 3px solid #eee;
}

.match-start-tbar-count {
  color: #FC0;
  margin-right: 6px;
}

.match-start-record {
  font-weight: 900;
  font-size: 17px;
  text-align: center;
  margin-top: 27px;
  margin-bottom: 20px;
}

.match-start-record-count {
  font-weight: 900;
  font-size: 26px;
  color: #26BF0D;
  background: -webkit-linear-gradient(#26BF0D, #A7DD0F);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.match-start-need {
  height: 53px;
  background: #F5F5F5;
  border-radius: 18px;
  margin-top: 30px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;

  .icon-star {
    width: 31px;
    height: 31px;
  }
}

.match-start-need-count {
  display: inline-block;
  font-weight: 900;
  font-size: 26px;
  color: #333;
  margin: 0 7px;
}

.match-start-loading {
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

.match-start-loading-error {
  text-align: center;
}

.match-start-loading-header {
  font-size: 15px;
  font-weight: 800;
  margin: 6px 0;
}
</style>
