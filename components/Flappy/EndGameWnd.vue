<template>
  <GameWindow class="flappy-end" :class="{ winner: winner, looser: !winner}">
    <template slot="title">
      {{ winner ? 'Victory!' : 'didn\'t&nbsp;make&nbsp;it' }}
      <div v-if="!winner" class="icon-timer" />
    </template>
    <template slot="contents">
      <img :src="require(`~/assets/i/flappy/end/cat-${ stars }.svg`)" alt="" class="flappy-end-picture">

      <div class="flappy-end-review">
        <div class="flappy-end-ava">
          <img src="~/assets/i/flappy/end/ava.svg" alt="" class="flappy-end-ava-pic">
        </div>
        <div class="flappy-end-review-top">
          Review:
          <div class="flappy-end-stars">
            <div v-for="i in 5" :key="`end-star-${i}`" class="star-place">
              <div v-if="stars >= i" class="star-inner" />
            </div>
          </div>
        </div>
        <div class="flappy-end-review-text">
          {{ feedbackText }}
        </div>
      </div>

      <div class="flappy-end-blocks">
        <div v-if="winner" class="flappy-end-block flappy-end-time">
          <div class="icon-timer-green" />
          {{ time }}
        </div>
        <div class="flappy-end-block flappy-end-coins">
          {{ coins }}
          <div class="icon-coin" />
        </div>
      </div>
    </template>
    <template slot="buttons">
      <div class="game-btn-round game-btn-round-red" :class="{ blocked: blockControls}" @click="replay">
        <div class="icon-replay-white" />
      </div>
      <!-- <div class="game-btn-round game-btn-round-blue" :class="{ blocked: blockControls}">
        <div class="icon-share" />
      </div> -->
    </template>
  </GameWindow>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    winner: {
      type: Boolean,
      default: true,
      required: true
    },
    stars: {
      type: Number,
      default: 0,
      required: true
    },
    time: {
      type: String,
      default: '',
      required: true
    },
    coins: {
      type: String,
      default: '',
      required: true
    },
    replay: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      blockControls: true as boolean,
      feedback: [
        [
          'Oh no! It\'s all broken! You have to be more careful!',
          'Oh no! It\'s all broken! You\'re just a zero. Deliver it again and prove otherwise.',
          'You have to ask yourself one question: will this delivery be accepted now or will you have to try again? You seem to know the answer...',
          'Aren\'t you ashamed of yourself? Not even a little bit? There\'s only one way to make it right: deliver the order again.',
          'Next time you can give the remote control of the copter to my cat - he\'ll do better. Practice.'
        ],
        [
          'The box came wrinkled! The cat didn\'t like it :(',
          'The box is wrinkled! Are you sure you\'re the delivery man?',
          'We trusted you, we let you into our house. And that\'s how you delivered our food? Kitty - bite!',
          'Sorry, delivery is not your thing, it requires high qualifications. You\'d better get into programming.',
          'Someone dropped everything. And today that "someone" is not my cat.',
          'My cat is a wonderful cat. And what are you good at? Keep practicing.'
        ],
        [
          'The package is late, and my cat has dinner on schedule!',
          'I and my cat have dinner on schedule, and you decided to be late! Aha, thank you!',
          'Please, look at my cat\'s eyes, and explain why he had to wait so long.',
          'Kitty is scheduled to be asleep by now, and how can you sleep without being full?',
          'While we waited, the cat\'s whole life has passed, only eight left.'
        ],
        [
          'You\'re a little late, but the important thing is that the order is undamaged!',
          'Well, nobody\'s perfect. But you were close!',
          'Smarmy! The cat approves of people like that. Now he can lie in the box and have a good meal too.',
          'Actually, we have everything, we were just checking to see what you can deliver so quickly. Awesome!'
        ],
        [
          'Thanks for the quick delivery!',
          'Who are you, the Flash? Great job!',
          'What? Delivery already? Wait, the cat needs to get dressed.',
          'You\'re my savior! Hurry up and open the food. I hope the cat wouldn\'t attack us.',
          'I love the smell of delivery in the morning!',
          'Run, delivery, run!',
          'Oh, unbelievable! It\'s you! The famous delivery champion! Can I have your autograph?'
        ]
      ]
    }
  },
  computed: {
    feedbackText(): string {
      const textList = this.feedback[this.stars - 1] ?? []

      if (!textList) {
        return ''
      }

      return textList[Math.floor(Math.random() * textList.length)]
    }
  },
  mounted() {
    this.blockControls = true

    setTimeout(() => {
      this.blockControls = false
    }, 2000)
  }
})
</script>

<style lang="scss">
.flappy-end {
  .stars-block {
    width: 185px;
    margin: 40px auto 0 auto;
  }

  .blocked {
    pointer-events: none;
  }

  .game-window {
    background: linear-gradient(0deg, #FCFCFC 1%, #DFE6FF 50.99%, #DBE5FF 51%, #CFE0FF 61%, #BBDEFF 72%, #9FCFFF 83%, #7BC2FF 93%, #60B9FF 100%);
  }
}

.flappy-end.looser {
  .game-window-title-plate {
    padding: 20px 28px 24px 22px;

    .icon-timer {
      position: absolute;
      width: 34px;
      height: 34px;
      right: -10px;
      top: -33px;
      transform: rotate(15deg) translate3d(0, 0, 0);
      filter: drop-shadow(0 4px 0 rgba(0, 0, 0, 0.15));
    }

    &::before {
      background: linear-gradient(180deg, #F81258 0%, #EC0D51 100%);
    }
  }
}

.flappy-end-picture {
  width: 100%;
  height: auto;
  margin-top: 20px;
}

.flappy-end-review {
  position: relative;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 10px 11px 18px 42px;
  margin: 20px 10px 0 10px;
}

.flappy-end-ava {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 40px;
  height: 40px;
  background: #ACB3F6;
  border: 4px solid #FFFFFF;
  border-radius: 50%;
  overflow: hidden;
}

.flappy-end-ava-pic {
  position: absolute;
  top: 10%;
  left: 50%;
  height: 90%;
  width: auto;
  transform: translateX(-50%);
}

.flappy-end-review-top {
  font-weight: 800;
  font-size: 18px;
  color: #4051A1;
  display: flex;
  justify-content: space-between;
}

.flappy-end-stars {
  display: flex;

  .star-inner {
    opacity: 0;
    animation: flappy-show-star 0.3s forwards ease-in;
  }

  .star-place {
    width: 22px;
    height: 22px;
    margin-left: 2px;

    &:nth-child(2) .star-inner {
      animation-delay: 100ms;
    }
    &:nth-child(3) .star-inner {
      animation-delay: 200ms;
    }
    &:nth-child(4) .star-inner {
      animation-delay: 300ms;
    }
    &:nth-child(5) .star-inner {
      animation-delay: 400ms;
    }
  }
}

@keyframes flappy-show-star {
  from {
    transform: translate(100%, -100%) scale(2);
    opacity: 0;
  }
  to {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
}

.flappy-end-review-text {
  font-size: 15px;
  line-height: 110%;
  color: #4051A1;
  margin-top: 4px;
}

.flappy-end-blocks {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 16px 6px 0 6px;
}

.flappy-end-block {
  width: 117px;
  height: 42px;
  padding: 8px 12px 0 12px;
  box-sizing: border-box;
  text-align: center;
  font-weight: 800;
  color: #4051A1;
  background: #FFFFFF;
  box-shadow: inset 0px 4px 5px rgba(191, 206, 255, 0.48);
  border-radius: 18px;
}

.flappy-end-time, .flappy-end-coins {
  font-size: 22px;
  font-weight: 900;
  line-height: 100%;
}

.flappy-end-time {
  .icon-timer-green {
    position: relative;
    top: 2px;
    width: 22px;
    height: 22px;
  }
}

.flappy-end-coins {
  font-size: 22px;
  font-weight: 900;
  line-height: 100%;
  color: #FFFFFF;
  background: #135EFF;
  box-shadow: inset 0px 4px 4px #0745CC;

  .icon-coin {
    position: relative;
    top: 2px;
    width: 22px;
    height: 23px;
  }
}
</style>
