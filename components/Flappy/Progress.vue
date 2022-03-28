<template>
  <div class="flappy-progress">
    <div class="flappy-progress-bar" :style="{ width: progress * 100 + '%'}">
      <div class="flappy-progress-info">
        {{ Math.round(progress * 100) }}%
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    progress: {
      type: Number,
      default: 0,
      required: true
    }
  }
})
</script>

<style lang="scss">
.flappy-progress {
  position: relative;
  height: 14px;
  width: 100%;
  max-width: 300px;
  margin: 0 20px;
  background-color: #fff;
  border-radius: 14px;
  display: flex;
  justify-content: flex-start;
}

.flappy-progress-bar {
  position: relative;
  width: 100%;
  // background-color: #EF0E53;
  background: repeating-linear-gradient(
    -45deg,
    #FB4A7F,
    #FB4A7F 6px,
    #F21450 6px,
    #F21450 12px
  );
  border-radius: 14px;
}

.flappy-progress-info {
  position: absolute;
  top: -56px;
  right: -18px;
  width: 44px;
  height: 53px;
  color: #fff;
  font-size: 13px;
  line-height: 100%;
  text-align: center;
  background-image: url('~/assets/i/flappy/progress-info.svg');
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
