<template>
  <section class="flappy-rules">
    <GameWindow>
      <div slot="title" class="flappy-rules-wnd-title">
        Game rules
      </div>
      <template slot="contents">
        <ol class="flappy-rules-list">
          <li>
            Hurry up to deliver order in 15&nbsp;minutes
          </li>
          <li>
            Collect coins and dodge pipes along the&nbsp;way
          </li>
        </ol>
      </template>
    </GameWindow>
    <div class="flappy-rules-dron" />
    <div class="flappy-rules-coin" />
    <div class="flappy-rules-pipe" />
    <div class="flappy-rules-btn btn btn-red" @click="onStart">
      Start
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    onStart: {
      type: Function,
      default: () => {},
      required: true
    }
  }
})
</script>

<style lang="scss">
.flappy-rules {
  height: 100%;

  background-image: url('~/assets/i/flappy/city.svg');
  background-size: auto 100%;
  background-position: left top;

  .game-overlay {
    background: transparent;
  }

  .game-window {
    top: 14%;
    transform: translate(-50%, 0);
  }
}

.flappy-rules-wnd-title {
  font-size: 22px;
}

.flappy-rules-list {
  counter-reset: rules-counter;
  list-style: none;
  padding: 0 0 0 50px;
  margin: 40px 0 0 5px;
  box-sizing: border-box;
  font-size: 18px;
  color: #4051A1;

  li {
    position: relative;
    counter-increment: rules-counter;
    margin-bottom: 20px;

    &:before {
      content: counter(rules-counter) ".";
      position: absolute;
      width: 38px;
      height: 38px;
      top: -4px;
      left: -50px;
      color: #FFFFFF;

      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 24px;
      line-height: 100%;
      padding-left: 8px;
      background: #F91154;
      box-sizing: border-box;
      border-radius: 6px;
      box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
    }
    &::after {
      position: absolute;
      content: '';
      left: -58px;
      top: -13px;
      width: 52px;
      height: 29px;
      background: linear-gradient(180deg, rgba(249, 17, 84, 0) 0%, rgba(255, 255, 255, 0.2) 100%);
      border-radius: 50%;
    }
  }
}

.flappy-rules-dron {
  position: absolute;
  left: 50%;
  bottom: 21%;
  width: 196px;
  height: 131px;
  background-image: url('~/assets/i/flappy/player.svg');
  background-size: 400% auto;
  animation: background-sprite 0.2s steps(3) infinite;
  transform: translateX(-90%) rotate(10deg);
}

.flappy-rules-coin {
  position: absolute;
  left: calc(50% + 45px);
  bottom: 27%;
  width: 72px;
  height: 72px;
  background-image: url('~/assets/i/flappy/coin.svg');
  background-size: auto 100%;
  animation: background-sprite 0.6s steps(13) infinite;
}

.flappy-rules-pipe {
  position: absolute;
  left: calc(50% + 22px);
  bottom: 0;
  width: 118px;
  height: 22%;
  background-image: url('~/assets/i/flappy/pipe-bg.svg');
  background-repeat: repeat-y;
  background-size: 100% auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -18.22%;
    width: 136.44%;
    height: 54px;
    background-image: url('~/assets/i/flappy/pipe-t.svg');
    background-size: 100% 100%;
  }
}

.flappy-rules-btn {
  position: absolute;
  width: 220px;
  bottom: 5%;
  left: 50%;
  font-size: 26px;
  font-weight: 800;
  transform: translateX(-50%);
  z-index: 95;
}

@keyframes background-sprite {
  0% {
   background-position: 0 0;
 }
 100% {
   background-position: 100% 0;
 }
}
</style>
