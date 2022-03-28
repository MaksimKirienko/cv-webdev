<template>
  <section class="tutorial-main" :class="{ active }">
    <div class="tutorial-main-wnd match-window">
      <div class="tutorial-corner" :class="[`tutorial-corner-${ step }`]" v-html="require('~/assets/i/match/tutorial/corner.svg?include')" />
      <div class="tutorial-main-inner">
        <div class="tutorial-main-text" v-html="stepData.text" />
        <div class="btn btn-violet" @click="nextStep()">
          {{ stepData.button }}
        </div>
      </div>
      <picture>
        <source srcset="~/assets/i/match/tutorial/light.png?webp" type="image/webp">
        <img class="tutorial-light" :class="[`tutorial-light-${ step }`]" src="~/assets/i/match/tutorial/light.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/tutorial/marmelad-1.png?webp" type="image/webp">
        <img class="tutorial-marmelad tutorial-marmelad-1" :class="{ active: step == 1 }" src="~/assets/i/match/tutorial/marmelad-1.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/tutorial/marmelad-2.png?webp" type="image/webp">
        <img class="tutorial-marmelad tutorial-marmelad-2" :class="{ active: step == 2 }" src="~/assets/i/match/tutorial/marmelad-2.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/tutorial/marmelad-3.png?webp" type="image/webp">
        <img class="tutorial-marmelad tutorial-marmelad-3" :class="{ active: step == 3 }" src="~/assets/i/match/tutorial/marmelad-3.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/tutorial/marmelad-4.png?webp" type="image/webp">
        <img class="tutorial-marmelad tutorial-marmelad-4" :class="{ active: step == 4 }" src="~/assets/i/match/tutorial/marmelad-4.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/tutorial/marmelad-5.png?webp" type="image/webp">
        <img class="tutorial-marmelad tutorial-marmelad-5" :class="{ active: step == 5 }" src="~/assets/i/match/tutorial/marmelad-5.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/tutorial/marmelad-2.png?webp" type="image/webp">
        <img class="tutorial-marmelad tutorial-marmelad-6" :class="{ active: step == 6 }" src="~/assets/i/match/tutorial/marmelad-2.png" alt="">
      </picture>
      <picture>
        <source srcset="~/assets/i/match/tutorial/marmelad-3.png?webp" type="image/webp">
        <img class="tutorial-marmelad tutorial-marmelad-7" :class="{ active: step == 7 }" src="~/assets/i/match/tutorial/marmelad-3.png" alt="">
      </picture>
    </div>
    <img ref="arrow" src="~/assets/i/match/tutorial/arrow.svg?inline" class="tutorial-main-arrow" />
  </section>
</template>

<script>
export default {
  data() {
    return {
      step: 0,
      steps: [
        {
          text: `Привет!<br>
            Добро пожаловать в&nbsp;игру "За&nbsp;покупками"!<br>
            Я&nbsp;мармеладка, пойдем я&nbsp;покажу как все тут&nbsp;устроено!`,
          arrow: '',
          itemOver: '',
          button: 'Продолжить',
        },
        {
          text: `Это твои очки. Набирай больше очков, соревнуйся с другими игроками и участвуй в розыгрыше суперпризов!`,
          arrow: 'left: 220px; top: 40px; animation: tutorial-arrow-h 1s ease-in-out infinite;',
          itemOver: '.main-stats-profile',
          button: 'Продолжить'
        },
        {
          text: `Играй и получай звёздочки, чтобы открыть следующие уровни!`,
          arrow: 'right: 120px; top: 33px; animation: tutorial-arrow-hi 1s ease-in-out infinite;',
          itemOver: '.main-stats-stars',
          button: 'Продолжить'
        },
        {
          text: `Каждый день ты получаешь 3&nbsp;игровые попытки, но помни, что они действуют до конца&nbsp;дня`,
          arrow: 'right: 120px; top: 76px; animation: tutorial-arrow-hi 1s ease-in-out infinite;',
          itemOver: '.main-stats-lives',
          button: 'Продолжить'
        },
        {
          text: `Ты можешь получить дополнительные попытки выполняя задания или обменивая их на&nbsp;баллы`,
          arrow: 'left: 6.5%; bottom: 110px; animation: tutorial-arrow-v 1s ease-in-out infinite;',
          itemOver: '.control-btn-task, .main-controls',
          itemOverSaturated: '.control-btn-prizes, .control-btn-play, .control-btn-rating, .control-btn-settings',
          button: 'Продолжить'
        },
        {
          text: `Все полученные призы будут храниться&nbsp;здесь`,
          arrow: 'left: 23.5%; bottom: 110px; animation: tutorial-arrow-v 1s ease-in-out infinite;',
          itemOver: '.control-btn-prizes, .main-controls',
          itemOverSaturated: '.control-btn-task, .control-btn-play, .control-btn-rating, .control-btn-settings',
          button: 'Продолжить'
        },
        {
          text: `Отслеживай свои достижения и&nbsp;соревнуйся с&nbsp;другими игроками!<br>Желаю тебе удачи!`,
          arrow: 'right: 23.5%; bottom: 110px; animation: tutorial-arrow-v 1s ease-in-out infinite;',
          itemOver: '.control-btn-rating, .main-controls',
          itemOverSaturated: '.control-btn-prizes, .control-btn-play, .control-btn-task, .control-btn-settings',
          button: 'Начать'
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
      return this.$store.state.match.showTutorial
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

      if (!step) {
        this.$store.commit('match/setShowTutorial', false)

        this.$store.commit('match/setBlur', {
          status: false,
          handler: 'MatchTutorialMain ended',
          callback: null
        })

        this.step = 0
      }

      if (this.step == 5) {
        this.$store.commit('match/resetProfileTimestamp')
      }

      if (this.$refs.arrow) {
        if (step?.arrow) {
          this.$refs.arrow.style.cssText = step.arrow
        } else {
          this.$refs.arrow.style.cssText = 'display: none'
        }
      }

      if ((prevStep?.itemOver ?? false) && prevStep.itemOver) {
        const pnodes = document.querySelectorAll(prevStep.itemOver)

        if (pnodes) {
          if (pnodes && pnodes.length) {
            pnodes.forEach(n => {
              n.style.cssText = ''
            })
          }
        }
      }

      if ((step?.itemOver ?? false) && step.itemOver) {
        const nodes = document.querySelectorAll(step.itemOver)

        if (nodes && nodes.length) {
          nodes.forEach(n => {
            n.style.cssText = 'z-index: 1012; pointer-events: none; filter: unset;'
          })
        }
      }

      if ((prevStep?.itemOverSaturated ?? false) && prevStep.itemOverSaturated) {
        const pnodes = document.querySelectorAll(prevStep.itemOverSaturated)

        if (pnodes && pnodes.length) {
          pnodes.forEach(n => {
            n.style.cssText = ''
          })
        }
      }

      if ((step?.itemOverSaturated ?? false) && step.itemOverSaturated) {
        const nodes = document.querySelectorAll(step.itemOverSaturated)

        if (nodes && nodes.length) {
          nodes.forEach(n => {
            n.style.cssText = 'z-index: 1011; pointer-events: none; filter: saturate(0);'
          })
        }
      }
    },
    activate() {
      if (this.active) {
        this.$store.commit('match/setProfile', {
          avatar: "0#27",
          nickname: "Брокколи",
          points: 1727,
          stars: 7,
          attempts: 3
        })

        this.step = 0

        this.nextStep()
        this.$store.commit('match/setBlur', {
          status: true,
          handler: 'MatchTutorialMain activated',
          callback: null, // () => { this.nextStep() },
          zIndex: 1010
        })
      }
    }
  }
}
</script>


<style lang="scss">
.tutorial-main {
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

.tutorial-main-wnd {
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

.tutorial-main-inner {
  position: relative;
  z-index: 1;
}

.tutorial-light {
  position: absolute;
  mix-blend-mode: overlay;
  z-index: 1013;
}

.tutorial-light-1 {
  width: 280px;
  top: -130px;
  right: -160px;
}

.tutorial-light-2 {
  width: 430px;
  bottom: -420px;
  left: -130px;
  transform: rotate(15deg);
}

.tutorial-light-3 {
  width: 380px;
  bottom: -391px;
  right: -130px;
  transform: rotate(-33deg) scaleX(-1);
}

.tutorial-light-4 {
  width: 430px;
  bottom: -440px;
  left: -100px;
  transform: rotate(-75deg) scaleX(-1);
}

.tutorial-light-5 {
  width: 300px;
  top: -230px;
  left: -115px;
  transform: rotate(-25deg) scaleX(-1);
}

.tutorial-light-6 {
  width: 250px;
  top: -180px;
  right: -55px;
  transform: rotate(75deg);
}

.tutorial-light-7 {
  width: 250px;
  top: -290px;
  left: -35px;
  transform: rotate(-105deg);
}

.tutorial-main-arrow {
  position: absolute;
  width: 60px;
  height: auto;
  z-index: 1011;
}

.tutorial-main-text {
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

.tutorial-marmelad-1 {
  top: -90px;
  right: -40px;
  width: 120px;
}

.tutorial-marmelad-2 {
  bottom: -220px;
  left: -40px;
  width: 170px;
}

.tutorial-marmelad-3 {
  bottom: -200px;
  right: -20px;
  width: 150px;
}

.tutorial-marmelad-4 {
  bottom: -210px;
  left: -20px;
  width: 170px;
}

.tutorial-marmelad-5 {
  top: -160px;
  left: 0;
  width: 120px;
}

.tutorial-marmelad-6 {
  top: -140px;
  right: 0;
  width: 100px;
  transform: rotate(30deg);
}

.tutorial-marmelad-7 {
  top: -160px;
  left: 0;
  width: 100px;
  transform: rotate(180deg);
}

.tutorial-corner {
  position: absolute;
  width: 107px;
  z-index: 0;

  svg {
    display: block;
    width: 100%;
  }
}

.tutorial-corner-1 {
  display: none;
}

.tutorial-corner-2, .tutorial-corner-4 {
  left: 0;
  bottom: -46px;
  filter: drop-shadow(0 4px 2px rgba(0, 0, 0, 0.25));
}

.tutorial-corner-3 {
  right: 0;
  bottom: -46px;
  filter: drop-shadow(0 4px 2px rgba(0, 0, 0, 0.25));
  transform-origin: center top;
  transform: scaleX(-1);
}

.tutorial-corner-5, .tutorial-corner-7 {
  left: 0;
  top: -46px;
  filter: drop-shadow(0 -4px 2px rgba(0, 0, 0, 0.25));
  transform: scaleY(-1);
}

.tutorial-corner-6 {
  right: 0;
  top: -46px;
  filter: drop-shadow(0 -4px 2px rgba(0, 0, 0, 0.25));
  transform: scale(-1, -1);
}

@keyframes tutorial-arrow-h {
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

@keyframes tutorial-arrow-hi {
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

@keyframes tutorial-arrow-v {
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
</style>
