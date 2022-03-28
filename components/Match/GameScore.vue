<template>
  <section class="match-game-score">
    <svg class="match-game-score-progress" height="80" width="80" viewBox="0 0 80 80">
      <circle r="40" cx="40" cy="40" filter="url(#inset-shadow)" />
      <path :d="`M 39 39
        L ${ Math.cos(45 / 180 * Math.PI) * 39 + 40 } ${ Math.sin(45 / 180 * Math.PI) * 39 + 40 }
        A 39 39 0 ${ scoreProgress > .5 ? 1 : 0 } 1
        ${ Math.cos((45 + scoreProgress * 360) / 180 * Math.PI) * 39 + 40 }
        ${ Math.sin((45 + scoreProgress * 360) / 180 * Math.PI) * 39 + 40 }
        Z`"

        fill="url(#scoreBlueGradient)"
        filter="url(#inset-shadow-2)"
      />
      <defs>
        <filter id="inset-shadow">
          <feGaussianBlur stdDeviation="15"/>
          <feComposite operator="out" in="SourceGraphic" result="inverse"/>
          <feFlood flood-color="black" flood-opacity="0.6" />
          <feComposite operator="in" in2="inverse"/>
        </filter>
        <filter id="inset-shadow-2">
          <feGaussianBlur stdDeviation="3"/>
          <feComposite operator="out" in="SourceGraphic" result="inverse"/>
          <feFlood flood-color="black" flood-opacity="1" />
          <feComposite operator="in" in2="inverse"/>
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
        <linearGradient id="scoreBlueGradient" gradientTransform="rotate(45)">
          <stop offset="0%" stop-color="#2689BC" />
          <stop offset="100%" stop-color="#10B8FD" />
        </linearGradient>
      </defs>
    </svg>
    <div class="match-game-score-inner">
      <div class="match-game-score-count">
        {{ score }}
      </div>
      <div class="match-game-score-total">
        /{{ scoreToWin }}
      </div>
    </div>
    <div class="match-game-score-star-place">
      <div class="match-game-score-star" :class="{ active: (scoreToWin && (score >= scoreToWin)) }" />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      require: true
    },
    scoreToWin: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      starAchived: false
    }
  },
  watch: {
    score(val) {
      if (val >= this.scoreToWin && !this.starAchived) {
        this.starAchived = true
        gameAudio.play('star-small')
      }
    }
  },
  computed: {
    scoreProgress() {
      return Math.min(0.99999, this.score / this.scoreToWin) || 0
    }
  }
}
</script>

<style lang="scss">
.match-game-score {
  width: 90px;
  height: 90px;
  margin-right: 8px;
}

.match-game-score-progress {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.match-game-score-inner {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 70px;
  height: 70px;
  background: #26BC98;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.match-game-score-count {
  font-weight: 900;
  font-size: 22px;
  line-height: 100%;
  text-align: center;
  color: #fff;
  -webkit-text-stroke: 1px black;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 1);
}

.match-game-score-total {
  font-weight: 800;
  font-size: 13px;
  line-height: 100%;
  text-align: center;
  color: #103151;
}

.match-game-score-star-place {
  position: absolute;
  right: 2px;
  bottom: 7px;
  width: 26px;
  height: 26px;
  background-image: url('~/assets/i/match/icons/star-g.svg?inline');
}

.match-game-score-star {
  width: 100%;
  height: 100%;
  transform-origin: center;
  transform: translate(100px, -160px) scale(4.5);
  opacity: 0;
  background-image: url('~/assets/i/match/icons/star.svg?inline');

  &.active {
    opacity: 1;
    animation: star-appear-score .8s cubic-bezier(0.195, 0.180, 0.775, 0.000) forwards;
  }
}

@keyframes star-appear-score {
  0% {
    transform: translate(100px, -160px) scale(5);
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1));
  }
  100% {
    transform: translate(0, 0) scale(1);
    filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.5));
  }
}
</style>
