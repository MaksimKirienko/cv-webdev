<template>
  <section class="match-main">
    <MatchTutorialMain />
    <MatchWndNoHearts />
    <MatchWndStartLevel />
    <MatchMainStats />
    <!-- <GameEnd v-if="!showTutorial" /> -->
    <!-- <Draw v-if="!showTutorial" />
    <DrawWnd v-if="showDrawWnd" /> -->
    <DrawPrize v-if="!showTutorial"/>
    <!-- <Prize49 v-if="p49Opened" />
    <Prize49Wnd v-if="showP49" :participant="p49Participant" /> -->
    <MatchMainSettings
      :settingsOpened="settingsOpened"
      :clickClose="() => { settingsOpened = false }"
    />
    <MatchMainControls
      :settingsOpened="settingsOpened"
      :clickSettings="() => { settingsOpened = !settingsOpened }"
    />
    <div ref="map" class="match-main-map">
      <div class="match-main-map-container">
        <picture>
          <source srcset="~/assets/i/match/main/map.jpg?webp" type="image/webp">
          <img class="match-main-map-pic" width="560" height="4646" src="~/assets/i/match/main/map.jpg?resize=375" alt="" @load="scrollToLevel()">
        </picture>
        <div class="lvl-items">
          <div
            v-for="(level, index) in levels"
            :key="level.id"
            ref="level"
            class="lvl-item"
            :class="[ `lvl-item-${ level.id }` ]"
            :style="{ left: `${ lvlPos[index][0] }%`, bottom: `${ lvlPos[index][1] }%`, transform: `translate(-50%, -50%) scale(${ lvlPos[index][2] })`}"
            @click="levelClick(level.id)"
          >
            <div v-if="index < maxLevel" class="stars-block">
              <div class="star" :class="{ active: level.stars > 1 }" />
              <div class="star" :class="{ active: level.stars > 0 }" />
              <div class="star" :class="{ active: level.stars > 2 }" />
            </div>
            <div
              class="lvl-item-bg"
              :style="{ backgroundPosition: getLevelBgPosition(index) }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { apiGetLevels } from '~/scripts/Match2/api/api.js'

export default {
  data() {
    return {
      settingsOpened: false,
      lvlPos: [[72.5, 4.9, 1], [60, 7.3, .75], [38.5, 9, .75], [35.5, 11.9, .75], [50.6, 13.9, .75],
                [63.5, 15.8, .75], [61, 18.2, .75], [42, 19.4, .75], [21, 20.9, .75], [20, 23.1, .75],
                [32, 25.0, .75], [53, 26.0, .75], [72, 27.5, .75], [83, 29.8, .75], [65, 31.4, .75],
                [45, 32.0, .75], [24, 32.5, .75], [14, 34.5, .75], [27, 36.5, .75], [47, 38.7, .75],
                [65, 40.6, .75], [82, 42.1, .75], [77, 44.3, .75], [62, 45.6, .75], [43, 46.4, .75],
                [25, 47.8, .75], [14, 49.6, .75], [36, 51.0, .75], [57, 52.0, .75], [74, 53.5, .75],
                [82, 55.4, .75], [61, 56.2, .75], [36, 57.5, .75], [18, 59, .75], [20, 61.5, .75],
                [40, 62.7, .75], [62, 63.9, .75], [73, 65.9, .75], [64, 67.9, .75], [46, 69.7, .75],
                [30, 71.7, .75], [37, 74.1, .75], [56, 76.3, .75], [81, 78.3, .75], [84, 81.0, .75],
                [68, 83.0, .75], [44, 84.0, .75], [18, 85.0, .7], [16, 87.5, .7], [41, 89.5, 1.1]
              ],
      // p49Opened: false,
      // p49Participant: false
    }
  },
  mounted() {
    this.getLevels()
    // .then(() => {
    //   if (!!this.levels[48]?.open && !!this.levels[47]?.stars) {
    //     return this.getP49()
    //   } else {
    //     return Promise.resolve()
    //   }
    // })
    // .then(() => {
    //   this.checkP49()
    // })

    if (this.$store.state.match.firstMenu) {
      gameAudio.play('music_menu-intro')
      this.$store.commit('match/setFirstMenu')
    } else {
      gameAudio.play('music_menu')
    }
  },
  watch: {
    lastLevel() {
      this.scrollToLevel()
    }
  },
  computed: {
    // showP49() {
    //   return this.$store.state.match.showP49
    // },
    showTutorial() {
      return this.$store.state.match.showTutorial
    },
    showDrawWnd() {
      return this.$store.state.match.showDraw
    },
    maxLevel() {
      return this.profile.level ?? 1
    },
    profile() {
      return this.$store.state.match.profile
    },
    token() {
      return this.$store.state.match.token
    },
    levels() {
      return this.$store.state.match.levels ?? []
    },
    lastLevel() {
      const ll = this.$store.state.match.lastLevel ?? 1
      return ll < 50 ? ll : 50
    },
    pending: {
      get() {
        return window?.pending?.games
      },
      set(val) {
        if (!window) {
          return false
        }
        if (typeof window.pending === 'undefined') {
          window.pending = {}
        }
        window.pending.games = val
      }
    }
  },
  methods: {
    // getP49() {
    //   console.log('getP49')

    //   return apiDopgift(this.token)
    //   .then(data => {
    //     if (data && (data.can_accept || data.participant)) {
    //       this.p49Opened = true
    //       this.p49Participant = data.participant
    //     }
    //   })
    //   .catch((e) => {
    //     this.$store.commit('match/setServerError', e)
    //   })
    // },
    // checkP49() {
    //   const showedOnce = localStorage?.getItem('p49Showed') ?? false

    //   if (this.p49Opened && !showedOnce) {
    //     this.$store.commit('match/setShowP49', true)
    //     localStorage.setItem('p49Showed', 1)
    //   }
    // },
    getLevelBgPosition(index) {
      if (index === 49) {
        return index < this.maxLevel ? `-700% 0` : '-600% 0'
      }

      return index < this.maxLevel ? `${ -Math.floor(index / 10) * 100 }% 0` : '-500% 0'
    },
    setLevelsData(levels) {
      this.$store.commit('match/setLevelsData', levels)
    },
    getLevels() {
      if (!this.token || this.pending) {
        return Promise.resolve()
      }

      this.pending = true

      return apiGetLevels(this.token)
      .then(data => {
        this.pending = false

        if (data) {
          this.setLevelsData(data)

          setTimeout(() => {
            this.scrollToLevel()
          }, 50)
        }
      })
      .catch((e) => {
        this.pending = false
        this.$store.commit('match/setServerError', e)
      })
    },
    scrollToLevel() {
      if (
        this.$refs.map &&
        this.$refs.level &&
        this.$refs.level.length &&
        typeof this.$refs.level[this.lastLevel] !== 'undefined'
      ) {
        const lvlNode = this.$refs.level[this.lastLevel]

        this.$refs.map.scrollTo(0,
          Math.min(lvlNode.offsetTop - (this.$refs.map.clientHeight / 2), this.$refs.map.scrollHeight))
      }
    },
    levelClick(levelName) {
      if (this.profile.attempts) {
        this.$store.commit('match/startLevelWnd', levelName)
      } else {
        this.$store.commit('match/setHeartNoError', false)
      }
    }
  }
}
</script>

<style lang="scss">
.match-main {
  height: 100%;
  width: 100%;
}

.match-main-map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  overscroll-behavior: none;
  -webkit-overscroll-behavior: none;
}

.match-main-map-container {
  position: relative;
  height: 0;
  padding-bottom: 830%;
}

.webp .match-main-map-container {
  background-image: url('~/assets/i/match/main/map-lowres.png?webp&inline');
  background-size: cover;
}

.no-webp .match-main-map-container {
  background-image: url('~/assets/i/match/main/map-lowres-nw.jpg?inline');
  background-size: cover;
}

.match-main-map-pic {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
}

.lvl-items {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.lvl-item {
  position: absolute;
  width: 31.25%;

  .stars-block {
    position: absolute;
    width: 60%;
    left: 20%;
    top: 9%;
  }
}

.lvl-item-bg {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background-size: auto 100%;
  background-position: -500% center;
}

.lvl-item:last-child .lvl-item-bg {
  background-position: -600% center;
}

.no-webp .lvl-item-bg {
  // background-image: url('~/assets/i/match/low/main/lvls-sprite.png');
  background-image: url('~/assets/i/match/main/lvls-sprite.png');
}
.webp .lvl-item-bg {
  background-image: url('~/assets/i/match/main/lvls-sprite.png?webp');
}
</style>
