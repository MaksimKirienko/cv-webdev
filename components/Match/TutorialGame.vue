<template>
  <section class="tutorial-game" :class="{ active }">
    <div class="tutorial-game-wnd match-window" :class="[`tutorial-game-${ step }`]">
      <div class="tutorial-game-inner">
        <div class="tutorial-game-text" v-html="stepData.text" />
        <div v-if="stepData.button" class="btn btn-green" @click="nextStep()">
          {{ stepData.button }}
        </div>
      </div>
    </div>
    <img ref="hand" src="~/assets/i/match/tutorial/hand.png?inline" class="tutorial-game-hand" />
    <img ref="arrow" src="~/assets/i/match/tutorial/arrow.svg?inline" class="tutorial-game-arrow" />
  </section>
</template>

<script>
export default {
  data() {
    return {
      step: 0,
      steps: [
        {
          text: `Нажми на 2&nbsp;и&nbsp;более фишки одного&nbsp;цвета`,
          arrow: '',
          hand: [1, 4],
          itemsOver: [[1, 4], [1, 5]],
          nodeOver: '.game-grid-container',
          button: '',
        },
        {
          text: `Если соберёшь 5&nbsp;фишек сразу — ты получишь&nbsp;усилитель`,
          arrow: '',
          hand: [5, 4],
          itemsOver: [[5, 2], [5, 3], [5, 4], [5, 5], [5, 6]],
          nodeOver: '.game-grid-container',
          button: ''
        },
        {
          text: `Отлично! Теперь коснись ракеты, чтобы увидеть её&nbsp;в&nbsp;деле!`,
          arrow: '',
          hand: [5, 6],
          itemsOver: [[5, 6]],
          nodeOver: '.game-grid-container',
          button: ''
        },
        {
          text: `Собирай фишки и&nbsp;получай очки. Копи нужное количество очков и&nbsp;получи&nbsp;звёзду`,
          arrow: 'left: 37.5%; top: 10%; animation: tutorial-game-arrow-h 1s ease-in-out infinite;',
          nodeOver: '.match-game-score',
          button: 'Продолжить'
        },
        {
          text: `Выполняй дополнительные миссии, чтобы получить больше звёзд`,
          arrow: 'left: 270px; top: 10%; animation: tutorial-game-arrow-h 1s ease-in-out infinite;',
          nodeOver: '.match-task',
          button: 'Продолжить'
        },
        {
          text: `Помни, число ходов ограничено. Приятной&nbsp;игры!`,
          arrow: 'left: calc(50% - 29px); top: 36%; animation: tutorial-game-arrow-vi 1s ease-in-out infinite;',
          nodeOver: '.match-stats-bottom',
          button: 'Продолжить'
        }
      ]
    }
  },
  watch: {
    active(val) {
      if (val) {
        this.activate()
      }
    }
  },
  computed: {
    stars() {
      return 0
    },
    stepData() {
      return this.step ? this.steps[this.step - 1] : {}
    },
    active() {
      return this.$store.state.match.showGameTutorial
    }
  },
  mounted() {
    this.activate()
  },
  methods: {
    nextStep() {
      const prevStep = this.stepData
      this.step += 1
      const step = this.stepData
      const grid = document.querySelector('.game-grid')
      const gridBlocker = document.createElement('div')

      document.querySelector('.tutorial-game-field-block')?.remove()
      gridBlocker.classList.add('tutorial-game-field-block')

      if (!step) {
        this.$store.commit('match/setShowGameTutorial', false)

        this.$store.commit('match/setBlur', {
          status: false,
          handler: 'MatchTutorialGame ended',
          callback: null
        })

        this.step = 0
      }

      if (this.$refs.hand) {
        if (step?.hand) {
          // game-grid
          const item = matchGame?._gameField.getItem(step.hand)
          const rect = item?.node?.getBoundingClientRect()

          this.$refs.hand.style.cssText = `left: ${ rect?.left + 35 }px; top: ${ rect?.top + 30 }px; display: block;`
        } else {
          this.$refs.hand.style.cssText = 'display: none'
        }
      }

      if (step?.itemsOver) {
        let zi = 250

        grid.prepend(gridBlocker)

        step?.itemsOver.forEach(gPos => {
          const item = matchGame?._gameField.getItem(gPos)

          if (!item || !item.node) {
            return
          }

          item.node.classList.add('tutorial-game-item-over')
          item.node.style.zIndex = zi--

          item.node.addEventListener('click', () => {
            setTimeout(() => {
              this.nextStep()
            }, 1000)
          })
        })
      }

      if (this.$refs.arrow) {
        if (step?.arrow) {
          this.$refs.arrow.style.cssText = step.arrow + 'display: block;'
        } else {
          this.$refs.arrow.style.cssText = 'display: none'
        }
      }

      if ((prevStep?.nodeOver ?? false) && prevStep.nodeOver) {
        const pnodes = document.querySelectorAll(prevStep.nodeOver)

        if (pnodes) {
          if (pnodes && pnodes.length) {
            pnodes.forEach(n => {
              n.style.zIndex = 'unset'
            })
          }
        }
      }

      if ((step?.nodeOver ?? false) && step.nodeOver) {
        const nodes = document.querySelectorAll(step.nodeOver)

        if (nodes && nodes.length) {
          nodes.forEach(n => {
            n.style.zIndex = 1010
          })
        }
      }
    },
    activate() {
      if (this.active) {
        this.step = 0

        this.$store.commit('match/setBlur', {
          status: true,
          handler: 'MatchTutorialGame activated',
          callback: null, // () => { this.nextStep() },
          zIndex: 1010
        })

        // check game ready
        const interval = setInterval(() => {
          const item = document.querySelector('.game-object')

          if (item) {
            clearInterval(interval)
            setTimeout(() => {
              this.nextStep()
            }, 200)
          }
        }, 50)
      }
    }
  }
}
</script>


<style lang="scss">
.tutorial-game {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &.active {
    display: block;
  }
}

.tutorial-game-wnd {
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 30px;
    background-color: #fff;
    z-index: 1;
  }
}

.tutorial-game-1, .tutorial-game-2, .tutorial-game-3 {
  margin-top: -40%;
}

.tutorial-game-6 {
  margin-top: 33%;
}

.tutorial-game-inner {
  position: relative;
  z-index: 1;
}

.tutorial-game-hand {
  display: none;
  position: fixed;
  width: 60px;
  height: auto;
  z-index: 1011;
  animation: game-hand 1s ease-in-out infinite;
  pointer-events: none;
}

@keyframes game-hand {
  0% {
    transform: rotate(0deg);
  }
  80% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.tutorial-game-arrow {
  position: absolute;
  width: 60px;
  height: auto;
  z-index: 1011;
  display: none;
}

.tutorial-game-text {
  font-weight: 800;
  font-size: 18px;
  text-align: center;
  margin-bottom: 14px;
}

.tutorial-marmelad {
  position: absolute;
  display: none;
  z-index: 1014;

  &.active {
    display: block;
  }
}

@keyframes tutorial-game-arrow-h {
  0% {
    transform: translateX(0);
  }
  45% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes tutorial-game-arrow-hi {
  0% {
    transform: scaleX(-1) translateX(0);
  }
  45% {
    transform: scaleX(-1) translateX(-10px);
  }
  100% {
    transform: scaleX(-1) translateX(0);
  }
}

@keyframes tutorial-game-arrow-v {
  0% {
    transform: translateY(0) rotate(-90deg);
  }
  45% {
    transform: translateY(-10px) rotate(-90deg);
  }
  100% {
    transform: translateY(0) rotate(-90deg);
  }
}

@keyframes tutorial-game-arrow-vi {
  0% {
    transform: scaleY(-1) translateY(0) rotate(-90deg);
  }
  45% {
    transform: scaleY(-1) translateY(-10px) rotate(-90deg);
  }
  100% {
    transform: scaleY(-1) translateY(0) rotate(-90deg);
  }
}

.tutorial-game-field-block {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 200;
}

.tutorial-game-item-over {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))
}
</style>
