<template>
  <section class="match-game">
    <MatchBg :bg-name="levelData.background" />
    <MatchTutorialGame />
    <MatchWndPaused />
    <MatchWndEndLevel
      v-if="levelEndWnd"
      :score="score"
      :score-to-win="scoreToWin"
      :winner="winner"
      :stars="starsCount"
      :trophy-id="trophyID"
      :loading="loading"
      :resend-result="gameEnd"
      :restart="restart"
    />
    <div class="match-stats">
      <div class="match-stats-top">
        <MatchGameScore :score="score" :score-to-win="scoreToWin" />
        <MatchGameTask
          v-if="getTaskById(0)"
          :task="getTaskById(0)"
          :items-data="itemsData"
        />
        <MatchGameTask
          v-if="getTaskById(1)"
          :task="getTaskById(1)"
          :items-data="itemsData"
        />
        <div class="match-pause-icon" @click="pause()" />
      </div>
      <div class="match-stats-bottom">
        <div class="match-stats-moves">
          <div class="match-stats-moves-title">
            moves
          </div>
          <div class="match-stats-moves-count">
            {{ movesLeft }}
          </div>
        </div>
      </div>
    </div>
    <div ref="gameField" class="game-field" />
    <div class="match-tools" />
  </section>
</template>

<script>
import { MatchGame } from '~/scripts/Match2/MatchGame'
import itemsData from '~/scripts/Match2/data/items.json'
import { apiEndLevel } from '~/scripts/Match2/api/api.js'

export default {
  props: {
    setLevelData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      levelEndWnd: false,
      trophyID: 0,
      gameStarted: false,
      matchGame: null,
      loading: false,
      itemsData,
      levelData: {}
    }
  },
  computed: {
    starsCount() {
      return (this.score >= this.scoreToWin ? 1 : 0) +
        (this.getTaskById(0)?.count === 0 ? 1 : 0) +
        (this.getTaskById(1)?.count === 0 ? 1 : 0)
    },
    score() {
      return this.matchGame?.getCurrentScore() ?? 0
    },
    scoreToWin() {
      return this.matchGame?.getScoreToWin() ?? 9999
    },
    movesLeft() {
      return this.matchGame?.getMovesLeft() ?? 999
    },
    levelName() {
      return this.$store.state.match.currentLevel
    },
    token() {
      return this.$store.state.match.token
    },
    attempId() {
      return this.$store.state.match.attempId
    },
    winner() {
      return this.starsCount > 0 // this.score >= this.scoreToWin
    }
  },
  watch: {
    levelData() {
      // console.log(`MatchGame.vue - LevelData changed`)
      this.matchGame.startLevel(this.levelData)
    },
    movesLeft(val) {
      // game end
      if (val === 0 && this.gameStarted) {
        setTimeout(() => {
          this.gameEnd()
        }, 1500)
      }
    }
  },
  mounted() {
    if (typeof gameAudio !== 'undefined') {
      gameAudio.play('match-game')
    }

    this.levelEndWnd = false

    // test end prize
    // this.levelEndWnd = true
    // this.trophyID = 3
    // this.loading = true
    // ------------

    if (!this.matchGame) {
      this.matchGame = new MatchGame(
        this.$refs.gameField,
        itemsData
      )
    }

    if (window) {
      window.matchGame = this.matchGame
    }

    if (this.setLevelData) {
      this.levelData = this.setLevelData
    } else {
      this.loadLevel()
    }
  },
  methods: {
    gameEnd() {
      this.levelEndWnd = true

      if (this.winner) {
        this.loading = true
      }

      apiEndLevel(this.token, this.levelName, this.attempId, this.winner ? this.score : 0, this.winner ? this.starsCount : 0)
        .then((data) => {
          this.loading = false
          this.trophyID = parseInt(data.trophyID)
          this.$store.commit('match/resetProfileTimestamp')
        })
    },
    getTaskById(index) {
      return this.matchGame?.getTaskById(index) ?? null
    },
    restart() {
      // hard reset
      this.levelEndWnd = false
      this.matchGame = new MatchGame(
        this.$refs.gameField,
        itemsData
      )
      this.loadLevel()
      this.matchGame.startLevel(this.levelData)
    },
    loadLevel() {
      fetch(`/scripts/Match2/data/levels/level-${ this.levelName }.json`)
        .then(response => response.json())
        .then(data => {
          this.levelData = data
          this.gameStarted = true
        })
    },
    pause(pVal = true) {
      this.$store.commit('match/setPause', pVal)
    }
  }
}
</script>

<style lang="scss">
:root {
  --sprite-path: "~/assets/i/match/sprites/";
}

.match-game {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #129847;
  flex-grow: 1;
}

// .ios {
//   .match-game {
//     height: -webkit-fill-available;
//   }
// }

.match-stats {
  height: 33%;
  flex-grow: 1;
  flex-direction: column;
  padding: 30px 20px 0 20px;
  box-sizing: border-box;
}

@media (min-height: 640px) {
  .match-stats {
    height: 36%;
    padding-top: 50px;
  }
}

@media (min-height: 740px) {
  .match-stats {
    height: 40%;
    padding-top: 60px;
  }
}

.match-stats-top {
  position: relative;
  height: 90px;
  display: flex;
  flex-grow: 0;
  align-items: center;
}

.match-pause-icon {
  cursor: pointer;
  width: 51px;
  height: 47px;
  background-image: url('~/assets/i/match/icons/pause-btn.svg?inline');
  margin-left: auto;
}

.match-stats-bottom {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.match-stats-moves-title {
  font-weight: 800;
  font-size: 20px;
  color: #fff;
  text-shadow: 0.5px 0.5px 2px rgba(0, 0, 0, 0.8);
}

.match-stats-moves-count {
  font-weight: 900;
  font-size: 48px;
  line-height: 100%;
  color: #fff;
  -webkit-text-stroke: 1px black;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 1);
}

@media (min-width: 360px) {
  .match-stats-moves-count {
    font-size: 56px;
  }
}

@media (min-width: 400px) {
  .match-stats-moves-count {
    font-size: 64px;
  }
}

.match-tools {
  height: 33%;
  flex-grow: 1;
}

// where we are playing
.game-field {
  position: relative;
  width: 96%;
  height: 0;
  padding-bottom: 100%;
  flex-shrink: 0;
  margin: 0 auto;
  box-sizing: border-box;
}

// grid with surroundings, could be movable in field and scalable
.game-grid-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  box-sizing: border-box;
  padding: 12px 7px 7px 7px;
}

.game-grid-bg {
  position: absolute;
  left: 0;
  top: 0;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4));
  transform: translate3d(0, 0, 0);
  z-index: 0;
}

// only squares with items
.game-grid {
  position: relative;
  transform: translate3d(0, 0, 0);
  z-index: 1;
}

.game-object {
  position: absolute;
  image-rendering: -webkit-optimize-contrast;
  // transform: translate3d(0, 0, 0);
}

.game-effect {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 200;
  pointer-events: none;
  transform: translate3d(0, 0, 0);
}
</style>
