<template>
  <div>
    <div class="match-end-big-chest-container" :class="{ active: showChest }">
      <img src="~/assets/i/match/main/bg-stripes.svg?inline" alt="" class="match-end-big-chest-bg">
      <div ref="bigChest" class="match-end-big-chest" />
    </div>
    <section ref="wnd" class="match-end match-window">
      <div v-if="!showPrize" class="match-end-tbar">
        <div class="match-end-tbar-count">
          {{ currentLevel }}
        </div>
        Level
      </div>

      <!-- winner stars window -->
      <div v-if="winner && !showPrize" class="match-end-winner">
        <div class="stars-block">
          <div class="star-place" :class="{ active: stars > 1 }">
            <div ref="star1" class="star-inner" />
          </div>
          <div class="star-place active">
            <div ref="star2" class="star-inner" />
          </div>
          <div class="star-place" :class="{ active: stars > 2 }">
            <div ref="star3" class="star-inner" />
          </div>
        </div>
        <div class="match-end-points">
          Score
          <div class="match-end-points-count">
            {{ score }}
          </div>
        </div>

        <div v-if="loading && !loadingError" class="match-end-loading">
          <h5 class="match-end-loading-header">
            Пожалуйста, подождите.
            <br>
            Отправляем результат игры.
          </h5>
          <div class="lds-dual-ring" />
        </div>

        <div v-if="loading && loadingError" class="match-end-loading-error">
          <h5 class="match-end-loading-header">
            Не получилось отправить результат, возможно проблемы с интернетом.
          </h5>
          <button class="btn btn-violet" @click="tryResend()">
            Попробовать отправить еще раз
          </button>
          <button class="btn btn-violet" @click="exit()">
            Продолжить
          </button>
        </div>

        <div v-if="loadingGift && !loadingGiftError" class="match-end-loading">
          <h5 class="match-end-loading-header">
            Пожалуйста, подождите.
            <br>
            Ожидаем подарок
          </h5>
          <div class="lds-dual-ring" />
        </div>

        <div v-if="loadingGift && loadingGiftError" class="match-end-loading-error">
          <h5 class="match-end-loading-header">
            Не получилось показать подарок, возможно проблемы с интернетом.
            <br>
            Не переживайте, он появится в вашем списке призов.
          </h5>
          <button class="btn btn-violet" @click="exit('/prizes')">
            Перейти к призам
          </button>
          <button class="btn btn-violet" @click="exit()">
            Продолжить
          </button>
        </div>

        <div v-if="!loading && !loadingGift && trophyID" class="match-end-choose">
          Забери свою награду
          <div class="match-end-chests">
            <div class="match-end-chest" @click="showReward(0)" />
            <div class="match-end-chest" @click="showReward(1)" />
            <div class="match-end-chest" @click="showReward(2)" />
          </div>
        </div>

        <!-- <button v-if="!loading && !trophyID" class="btn btn-violet" @click="exit()">
          Продолжить
        </button> -->
        <!-- <button v-if="!loading && !trophyID" class="btn btn-violet" @click="restartGame()">
          Restart
        </button> -->

        <div v-if="!loading && !trophyID" class="match-end-loading">
          <h3 class="match-end-loading-header">
            Thanks for
            <br>
            playing!
          </h3>
        </div>
      </div>

      <!-- loose window -->
      <div v-if="!winner && !showPrize" class="match-end-loose">
        <div class="stars-block">
          <div class="star" />
          <div class="star" />
          <div class="star" />
        </div>
        <div class="match-end-minus">
          -1 <div class="icon-heart" />
        </div>

        <div class="match-end-minus-gg">
          Ты большой молодец!
          <br>
          Но, к сожалению, ходы закончились(
        </div>

        <div class="match-end-minus-scores">
          Для прохождения необходимо набрать одну звезду
        </div>

        <div class="match-end-minus-title">
          Осталось <mark>{{ attempts }}</mark> попыт{{ attempts == 1 ? 'а' : ((attempts > 1) && (attempts < 5) ? 'ки' : 'ок') }}
        </div>
        <div class="match-end-minus-text">
          Попытки восстанавливаются каждый&nbsp;день
        </div>

        <button class="btn btn-violet" @click="exit()">
          Продолжить
        </button>
      </div>

      <!-- prize window -->
      <div v-if="showPrize" class="match-end-prize">
        <div v-if="prize.preview_img" class="match-end-prize-pic-container">
          <img :src="prize.preview_img" class="match-end-prize-pic">
          <!-- <img v-if="prize.logo_img" :src="prize.logo_img" class="match-end-prize-logo" /> -->
          <div class="match-end-prize-ico">
            Твой приз
          </div>
        </div>
        <div class="match-end-prize-main">
          <div class="match-end-prize-content">
            <div class="match-end-prize-title">
              {{ prize.name }}
            </div>
            <div class="match-end-prize-text" v-html="prize.subtitle" />
            <Coupon
              :promo-type="prize.type"
              :code="prize.coupon"
              :barcode-format="typeof prize.format !== 'undefined' ? prize.format : ''"
            />
            <div v-if="prize.description && (prize.description.length > 5)" class="match-end-prize-htext">
              <div
                class="match-end-prize-htext-title"
                @click="prizeTextOpened == 1 ? prizeTextOpened = -1 : prizeTextOpened = 1"
              >
                Подробнее
              </div>
              <div
                class="match-end-prize-htext-content"
                :class="{ active: prizeTextOpened == 1 }"
                v-html="prize.description"
              />
            </div>
            <div v-if="prize.support && (prize.support.length > 5)" class="match-end-prize-htext">
              <div
                class="match-end-prize-htext-title"
                @click="prizeTextOpened == 2 ? prizeTextOpened = -1 : prizeTextOpened = 2"
              >
                Поддержка
              </div>
              <div
                class="match-end-prize-htext-content"
                :class="{ active: prizeTextOpened == 2 }"
                v-html="prize.description"
              />
            </div>
            <div v-if="prize.urinfo && (prize.urinfo.length > 5)" class="match-end-prize-htext">
              <div
                class="match-end-prize-htext-title"
                @click="prizeTextOpened == 3 ? prizeTextOpened = -1 : prizeTextOpened = 3"
              >
                Юридическая информация
              </div>
              <div
                class="match-end-prize-htext-content"
                :class="{ active: prizeTextOpened == 3 }"
                v-html="prize.urinfo"
              />
            </div>
          </div>
          <!-- <img v-if="!prize.preview_img && prize.logo_img" :src="prize.logo_img" class="match-end-prize-logo" /> -->
        </div>
        <div v-if="prize.link && prize.link.trim()" class="btn btn-violet" @click="giftUse(prize.id); goLink(prize.link, prize.event)">
          Активировать
        </div>
        <button class="btn btn-green" @click="exit()">
          Использовать позже
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { Ani } from '~/scripts/Match2/Ani'
import { apiGetGift, apiSendGiftUse } from '~/scripts/Match2/api/api.js'
import { sendAppMessage } from '~/scripts/Match2/lib.js'

export default {
  props: {
    winner: {
      type: Boolean,
      require: true
    },
    loading: {
      type: Boolean,
      require: true
    },
    stars: {
      type: Number,
      default: 0,
      require: true
    },
    score: {
      type: Number,
      default: 0,
      require: true
    },
    scoreToWin: {
      type: Number,
      default: 0,
      require: true
    },
    trophyID: {
      type: [Number, Boolean],
      default: false,
      require: true
    },
    resendResult: {
      type: Function,
      default: () => {},
      require: true
    },
    restart: {
      type: Function,
      default: () => {},
      require: false
    }
  },
  data() {
    return {
      prize: null,
      showPrize: false,
      prizeTextOpened: -1,
      loadingError: false,
      loadingGift: false,
      loadingGiftError: false,
      showChest: false
    }
  },
  computed: {
    currentLevel() {
      return this.$store.state.match.currentLevel
    },
    attempts() {
      return this.$store.state.match.profile.attempts ?? ''
    },
    token() {
      return this.$store.state.match.token
    }
  },
  watch: {
    trophyID() {
      this.getReward()
    }
  },
  activated() {
    this.$store.commit('match/setBlur', { status: true, hander: 'MatchWndEndLevel activated', callback: null })
  },
  deactivated() {
    this.$store.commit('match/setBlur', { status: false, hander: 'MatchWndEndLevel deactivated', callback: null })
  },
  mounted() {
    gameAudio.fadeOut('music_game')

    if (this.winner) {
      gameAudio.play('win')
      this.showStars()
    } else {
      gameAudio.play('loose')
    }

    if (this.trophyID) {
      this.getReward()
    }

    setTimeout(() => {
      if (this.loading) {
        this.loadingError = true
      }
    }, 15000)

    this.$store.commit('match/setBlur', { status: true, hander: 'MatchWndEndLevel mounted', callback: null })
  },
  unmounted() {
    this.$store.commit('match/setBlur', { status: false, hander: 'MatchWndEndLevel unmounted', callback: null })
  },
  methods: {
    giftUse(giftId) {
      apiSendGiftUse(this.token, giftId)
    },
    goLink(link, event = '') {
      if (event && event.trim()) {
        sendAppMessage(event.trim())
      }
      this.$store.commit('match/setLeaveLink', link)
    },
    tryResend() {
      this.loadingError = false
      this.resendResult()

      setTimeout(() => {
        if (this.loading) {
          this.loadingError = true
        }
      }, 15000)
    },
    showReward() {
      // if (chestId >= this.stars) {
      //   return
      // }
      this.showChest = true

      this.$refs.bigChest.classList.add('bounce')
      setTimeout(() => {
        this.$refs.bigChest.classList.remove('bounce')
        this.$refs.bigChest.classList.add('open')
      }, 2300)

      setTimeout(() => {
        this.showChest = false
        this.showPrize = true
        this.$refs.bigChest.classList.remove('open')
      }, 3600)
    },
    getReward() {
      if (!this.trophyID) {
        return
      }

      this.loadingGift = true

      setTimeout(() => {
        if (this.loadingGift) {
          this.loadingGiftError = true
        }
      }, 15000)

      apiGetGift(this.token, this.trophyID)
        .then(data => {
          this.prize = data

          this.loadingGift = false
        })
        .catch((e) => {
          this.$store.commit('match/setServerError', e)
        })
    },
    restartGame() {
      this.$store.commit('match/setBlur', { status: false, hander: 'MatchWndEndLevel exit', callback: null })
      this.restart()
    },
    exit(goNext = '') {
      this.$store.commit('match/closeLevel')
      this.$store.commit('match/setBlur', { status: false, hander: 'MatchWndEndLevel exit', callback: null })

      if (goNext) {
        this.$router.push(goNext)
      }
    },
    starAnimation(star, percentage) {
      const unperc = Math.pow(1 - percentage, 0.6)
      if (!star) {
        return
      }

      star.style = `
        transform: translate(${ 0 * unperc }px, ${ -150 * unperc }px)
                  scale(${ 1 + 1 * unperc });
        opacity: ${ Math.min(1, percentage * 3) };
        `

      if (percentage === 1) {
        // gameAudio.play('sucess')
        try {
          this.$refs.wnd.animate(
            [
              { transform: 'translate(-50%, -50%)' },
              { transform: 'translate(-50%, -48%)' },
              { transform: 'translate(-50%, -50%)' }
            ], {
              duration: 150,
              easing: 'ease-in-out'
            })
        } catch (e) {
          console.log('end level wnd animate error', e)
        }
      }
    },
    showStars() {
      if (!window || !this.$refs.star1) {
        return
      }

      this.$refs.star1.style = ''
      this.$refs.star2.style = ''
      this.$refs.star3.style = ''

      const starAni1 = new Ani(700, (percentage) => {
        this.starAnimation(this.$refs.star1, percentage)
      })

      gameAudio.play('star')
      starAni1.play()

      if (this.stars > 1) {
        setTimeout(() => {
          gameAudio.play('star')
          const starAni2 = new Ani(700, (percentage) => {
            this.starAnimation(this.$refs.star2, percentage)
          })
          starAni2.play()
        }, 500)
      }

      if (this.stars > 2) {
        setTimeout(() => {
          gameAudio.play('star')
          const starAni3 = new Ani(700, (percentage) => {
            this.starAnimation(this.$refs.star3, percentage)
          })
          starAni3.play()
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss">
.match-end {
  .stars-block {
    width: 185px;
    margin: 10px auto 0 auto;
  }
}

.match-end-tbar {
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

.match-end-tbar-count {
  color: #FC0;
  margin-right: 6px;
}

.match-end-points {
  font-weight: 900;
  font-size: 17px;
  text-align: center;
  margin-top: 27px;
  margin-bottom: 20px;
}

.match-end-points-count {
  font-weight: 900;
  font-size: 38px;
  line-height: 100%;
  color: #26BF0D;
  background: -webkit-linear-gradient(#26BF0D, #A7DD0F);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.match-end-loading {
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

.match-end-loading-error {
  text-align: center;
}

.match-end-loading-header {
  font-size: 15px;
  font-weight: 800;
  margin: 6px 0;
}

.match-end-minus {
  width: 76px;
  height: 37px;
  margin: 10px auto 0 auto;
  background: #E9E9E9;
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  font-weight: 900;
  font-size: 27px;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;

  .icon-heart {
    width: 26px;
    height: 22px;
    margin-left: 6px;
  }
}

.match-end-minus-title {
  font-weight: 600;
  font-size: 15px;
  line-height: 100%;
  margin-top: 20px;
  text-align: center;

  mark {
    color: #EC2F2E;
    background: transparent;
  }
}

.match-end-minus-text {
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 16px;
  text-align: center;
}

.match-end-minus-gg {
  text-align: center;
  font-weight: 900;
  font-size: 17px;
  color: #333;
  margin: 30px 0;
}

.match-end-minus-scores {
  margin-top: 8px;
  text-align: center;

  mark {
    color: #EC2F2E;
    background: transparent;
  }
}

.match-end-choose {
  max-width: 220px;
  margin: 15px auto 0 auto;
  background: #E9E9E9;
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  padding: 15px 9px 19px 9px;
  text-align: center;
  font-size: 15px;
}

.match-end-chests {
  display: flex;
  justify-content: space-around;
  margin-top: 12px;
}

.match-end-chest {
  width: 54px;
  height: 54px;
  background-image: url('~/assets/i/match/icons/chest.png?inline');
  background-size: contain;
  background-repeat: no-repeat;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  transform: scale(1);
  animation: match-chest 3s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.5s
  }
  &:nth-child(3) {
    animation-delay: 1s
  }

  &.blocked {
    animation: unset;
    pointer-events: unset;
    filter: saturate(0) drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  }
}

@keyframes match-chest {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.15);
  }
  25% {
    transform: rotate(-15deg) scale(1.15);
  }
  35% {
    transform: rotate(15deg) scale(1.15);
  }
  40% {
    transform: rotate(0) scale(1.15);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}

.match-end-prize-pic-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 7px;

  .time-left {
    position: absolute;
    right: 8px;
    top: 8px;
  }

  .match-end-prize-logo {
    position: absolute;
    left: 4px;
    top: 4px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
}

.match-end-prize-pic {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.match-end-prize-main {
  display: flex;
  max-height: calc(85vh - 310px);
  overflow: auto;

  .match-end-prize-logo {
    width: 60px;
    height: 60px;
    margin-left: 20px;
    object-fit: contain;
    flex-shrink: 0;
    border-radius: 50%;
  }
}

.match-end-prize-progress {
  position: absolute;
  bottom: 7px;
  left: 3%;
  width: 94%;
  font-size: 13px;
  line-height: 120%;
  color: #fff;
  z-index: 2;
}

.match-end-prize-progress-bar {
  position: relative;
  height: 7px;
  margin-top: 4px;
  background: rgba(215, 215, 215, 0.3);
  border-radius: 14px;
}

.match-end-prize-progress-bar-inner {
  height: 100%;
  background: linear-gradient(151.14deg, #26BF0D -1.64%, #A7DD0F 105.06%);
  border-radius: 14px;
}

.match-end-prize-content {
  flex-grow: 1;
}

.match-end-prize-title {
  font-weight: 800;
  font-size: 15px;
  color: #000;
}

.match-end-prize-text {
  font-weight: 400;
  font-size: 15px;
  color: #000;
  margin-top: 4px;
  margin-bottom: 10px;
}

.match-end-prize-description {
  font-weight: 400;
  font-size: 16px;
  color: #000;
  margin-top: 8px;
}

.match-end-prize-ico {
  position: absolute;
  right: 8px;
  top: 8px;
  padding: 7px 7px 6px 7px;
  font-weight: 800;
  font-size: 14px;
  line-height: 100%;
  color: #fff;
  background: linear-gradient(219.82deg, #7C04F3 2.35%, #C75EE1 108.73%);
  border-radius: 7px;
  display: inline-block;
  box-sizing: border-box;
}

.match-end-prize-htext {
  display: flex;
  flex-direction: column;
  margin: 2px 0;
}

.match-end-prize-htext-title {
  position: relative;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin: 8px 0;

  &::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 6px;
    display: block;
    width: 6px;
    height: 6px;
    border-bottom: 2px solid #9D9D9D;
    border-right: 2px solid #9D9D9D;
    transform-origin: center;
    transition: transform 0.3s linear;
    transform: rotate(45deg);
  }

  &.active::after {
    transform: scaleY(-1) rotate(45deg);
  }
}

.match-end-prize-htext-content {
  position: relative;
  max-height: 0;
  overflow: hidden;
  font-size: 13px;
  color: #878786;
  transition: max-height 0.5s ease-in-out;
  word-break: break-word;

  &.active {
    max-height: 3500px;
  }
}

.match-end-big-chest-container {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(18, 152, 71, 0.6);
  backdrop-filter: blur(10px);
  z-index: 1012;
  // display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    display: flex;
  }
}

.match-end-big-chest-bg {
  position: absolute;
  width: 1000px;
  height: 1000px;
  object-fit: cover;
  transform: rotate(0deg);
  animation: chest-bg-rotate 20s linear infinite;
  opacity: 0.7;
}

.match-end-big-chest {
  position: relative;
  width: 256px;
  height: 256px;
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 0 0;
  transform: scale(0.9);
  filter: drop-shadow(0 0 35px rgba(255, 255, 255, 0.8));

  &.bounce {
    animation: chest-bounce 2s cubic-bezier(0.170, 1.650, 0.660, 1.005) forwards;
  }

  &.open {
    animation: chest-open 0.3s steps(7) forwards;
  }
}

.webp .match-end-big-chest {
  background-image: url('assets/i/match/sprites/chest.png?webp');
}

.no-webp .match-end-big-chest {
  background-image: url('assets/i/match/sprites/chest.png');
}

@keyframes chest-bounce {
  0% {
    opacity: 0;
    transform: scale(0.001);
  }
  20% {
    opacity: 1;
    transform: scale(0.2);
  }
  100% {
    opacity: 1;
    transform: scale(0.9);
  }
}

@keyframes chest-open {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@keyframes chest-bg-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359.99deg);
  }
}
</style>
