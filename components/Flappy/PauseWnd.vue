<template>
  <GameWindow class="flappy-pause">
    <div slot="title" class="flappy-pause-title">
      Pause
    </div>
    <template slot="contents">
      <div class="game-window-buttons">
        <div class="game-btn-round game-btn-round-red" @click="home">
          <div class="icon-home" />
        </div>
        <div class="game-btn-round game-btn-round-blue" @click="replay">
          <div class="icon-replay-white" />
        </div>
        <div class="game-btn-round game-btn-round-green" @click="close">
          <div class="icon-play" />
        </div>
      </div>
    </template>
  </GameWindow>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    home: {
      type: Function,
      default: () => {}
    },
    replay: {
      type: Function,
      default: () => {}
    },
    close: {
      type: Function,
      default: () => {}
    }
  }
})
</script>

<style lang="scss">
.flappy-pause-title {
  padding: 8px 20px 10px 20px;
}

.flappy-pause {
  .game-window-buttons {
    margin: 50px 0 10px 0;
  }
}
</style>
