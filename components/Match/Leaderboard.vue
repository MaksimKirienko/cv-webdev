<template>
  <section class="leader">
    <MatchPageTop title="Рейтинг игроков" />
    <div class="leader-top">
      <div class="leader-top-left">
        <div class="leader-top-subtitle">Место:</div>
        <div class="leader-top-count">{{ place == -1 ? '&infin;' : place }}</div>
      </div>
      <div class="leader-top-mid">
        <Ava />
        <div class="leader-top-uname">{{ nickname }}</div>
      </div>
      <div class="leader-top-right">
        <div class="leader-top-subtitle">Баллы:</div>
        <div class="leader-top-count">{{ points }}</div>
      </div>
    </div>
    <div
      ref="list"
      class="leader-list"
      :style="{ 'padding-bottom': place > 100 ? '80px' : '10px'}"
    >
      <div
        v-for="lp in leaderboard"
        :key="lp.place"
        class="leader-item"
        :class="{ active: lp.place == place }"
        ref="leaderItem"
      >
        <div class="leader-item-place">{{ lp.place }}</div>
        <div class="leader-item-ava"><Ava :picId="getUserPicId(lp.avatar)" :bgId="getUserBgId(lp.avatar)" /></div>
        <div class="leader-item-uname">{{ lp.nickname }}</div>
        <div class="leader-item-score">{{ lp.score }}</div>
      </div>
      <div class="leader-tripple">
        <div class="leader-dots" />
      </div>
    </div>
    <div v-if="place > 100" class="leader-bottom">
      <div class="leader-item active">
        <div class="leader-item-place">{{ place }}</div>
        <div class="leader-item-ava">
          <Ava />
        </div>
        <div class="leader-item-uname">{{ nickname }}</div>
        <div class="leader-item-score">{{ points }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import { apiGetLeaderboard } from '~/scripts/Match2/api/api.js'

export default {
  data() {
    return {
      leaderboard: [],
      place: -1
    }
  },
  //  watch: {
  //   token() {
  //     if (!this.leaderboard || !this.leaderboard.length) {
  //       this.getLeaderboard()
  //     }
  //   }
  // },
  computed: {
    token() {
      return this.$store.state.match.token
    },
    points() {
      return this.$store.state.match.profile.points ?? ''
    },
    nickname() {
      return this.$store.state.match.profile.nickname ?? ''
    },
    profile() {
      return this.$store.state.match.profile
    },
    pending: {
      get() {
        return window?.pending?.leaderboard
      },
      set(val) {
        if (!window) {
          return false
        }
        if (typeof window.pending === 'undefined') {
          window.pending = {}
        }
        window.pending.leaderboard = val
      }
    }
  },
  mounted() {
    // gameAudio.play('music_menu')

     if (!this.leaderboard || !this.leaderboard.length) {
      this.getLeaderboard()
    }
  },
  methods: {
    getUserPicId(avatar) {
      if (avatar && (avatar.indexOf('#') !== -1)) {
        const sAva = avatar.split('#')
        return parseInt(sAva[0])
      } else {
        return Math.floor(Math.random() * 6)
      }
    },
    getUserBgId(avatar) {
      if (avatar && (avatar.indexOf('#') !== -1)) {
        const sAva = avatar.split('#')
        return parseInt(sAva[1])
      } else {
        return Math.floor(Math.random() * 39)
      }
    },
    getLeaderboard() {
      if (!this.token || this.pending) {
        return
      }

      this.pending = true

      apiGetLeaderboard(this.token)
      .then(data => {
        this.pending = false

        if (data && (data.length || data.leaderboard)) {

          this.leaderboard = data.leaderboard ? data.leaderboard : data

          if (typeof data.current !== 'undefined' && parseInt(data.current)) {
            this.place = parseInt(data.current)
          } else {
            this.place = this.$store.state.match.profile.leaderboardPosition ?? -1
          }

          this.scrollToPlace()

          setTimeout(() => {
            this.scrollToPlace()
          }, 50)
        }
      })
      .catch((e) => {
        this.pending = false
        this.$store.commit('match/setServerError', e)
      })
    },
    scrollToPlace() {
      if (
        (this.place > 0) &&
        this.$refs.leaderItem &&
        this.place <= this.$refs.leaderItem.length
      ) {
        const activeItem = this.$refs.leaderItem[this.place - 1]

        if (activeItem && this.$refs.list) {
          this.$refs.list.scrollTo(0, activeItem.offsetTop - 230 - this.$refs.list.clientHeight / 2)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.leader {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// .ios {
//   .leader {
//     height: -webkit-fill-available;
//   }
// }

.leader-top {
  position: relative;
  padding: 40px 20px 20px 20px;
  margin-top: -20px;
  display: flex;
  justify-content: center;
  background: linear-gradient(156.15deg, #8269FF -9.67%, #977CFF 89.72%);
  border-radius: 0 0 20px 20px;
  color: #fff;
  text-align: center;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  z-index: 1;
}

.leader-top-left, .leader-top-right {
  width: 33%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.leader-top-mid {
  width: 33%;
  box-sizing: border-box;
  max-width: calc(100% - 130px);

  .ava {
    width: 63px;
    height: 63px;
    border: 3px solid #fff;
    margin: 0 auto;
  }
}

.leader-top-uname {
  margin-top: 4px;
  width: 100%;
  overflow: hidden;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
}

.leader-top-subtitle {
  font-size: 19px;
  line-height: 120%;
}

.leader-top-count {
  font-weight: 800;
  font-size: 18px;
  line-height: 120%;
}

.leader-list {
  padding: 30px 10px 0 10px;
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  overscroll-behavior: none;
}

.leader-item {
  position: relative;
  display: flex;
  background: #F5F5F5;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 12px 14px;
  margin: 3px 0;
  align-items: center;
  color: #333;
  flex-shrink: 0;

  &.active {
    background: linear-gradient(156.15deg, #876EF8 -9.67%, #987DFF 89.72%);
    color: #fff;
  }
}

.leader-item-place {
  text-align: left;
  width: 30px;
  margin-right: 10px;
  font-style: normal;
  font-weight: 800;
  font-size: 15px;
  line-height: 100%;
  flex-shrink: 0;
}

.leader-item-ava {
  width: 42px;
  flex-shrink: 0;
  margin-right: 13px;

  .ava {
    width: 40px;
    height: 40px;
    border: 2px solid #fff;
  }
}

.leader-item-uname {
  flex-grow: 1;
  overflow: hidden;
  font-weight: 900;
  font-size: 16px;
  line-height: 100%;
}

.leader-item-score {
  min-width: 64px;
  text-align: center;
  flex-shrink: 0;
  margin-left: 13px;
  background: linear-gradient(151.14deg, #26BF0D -1.64%, #A7DD0F 105.06%);
  border-radius: 32px;
  color: #fff;
  font-weight: 800;
  font-size: 25px;
  line-height: 100%;
  padding: 13px 10px 11px 10px;
}

.leader-item.active .leader-item-score {
  font-weight: 900;
  background: linear-gradient(151.14deg, #FF7A00 -1.64%, #FFC226 105.06%);
}

.leader-tripple {
  position: relative;
  width: 94%;
  margin: 6px 3%;
  background: #F5F5F5;
  border-radius: 20px;
  padding: 6px 7px;
  box-sizing: border-box;
}

.leader-dots {
  position: relative;
  width: 7px;
  height: 7px;
  background: #B2B2B2;
  border-radius: 50%;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 7px;
    height: 7px;
    background: #B2B2B2;
    border-radius: 50%;
  }
  &::before {
    right: -12px;
  }
  &::after {
    right: -24px;
  }
}

.leader-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    border-radius: 20px 20px 0 0;
    background-color: #fff;
    z-index: 0;
  }
}
</style>
