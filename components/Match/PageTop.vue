<template>
  <div class="mpage-top">
    <NuxtLink :to="back" class="mpage-goback" v-on:click.native="goBack()" />
    <div class="mpage-top-right">
      <slot name="topRight"></slot>
    </div>
    <div class="mpage-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      require: true
    },
    back: {
      type: String,
      default: '/',
      require: false
    },
    onBack: {
      type: Function,
      require: false
    }
  },
  methods: {
    goBack() {
      if (this.onBack) {
        this.onBack()
      }
      this.clickSound()
    },
    clickSound() {
      gameAudio.play('click')
    }
  }
}
</script>

<style lang="scss">
.mpage-top {
  position: relative;
  width: 100%;
  padding: 20px 18px 16px 18px;
  background: #FFF;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border-radius: 0 0 16px 16px;
  box-sizing: border-box;
  z-index: 10;
}

@media (min-height: 640px) {
  .mpage-top {
    padding-top: 30px;
  }
}

@media (min-height: 740px) {
  .mpage-top {
    padding-top: 40px;
  }
}

.mpage-top-right {
  position: absolute;
  top: 17px;
  right: 18px;
}

@media (min-height: 640px) {
  .mpage-top-right {
    position: absolute;
    top: 30px;
  }
}

@media (min-height: 740px) {
  .mpage-top-right {
    position: absolute;
    top: 40px;
  }
}

.mpage-goback {
  display: block;
  width: 64px;
  height: 24px;
  background-image: url('~/assets/i/match/icons/back.svg?inline');
  background-size: auto 24px;
  background-repeat: no-repeat;
  padding-bottom: 10px;
}

.mpage-title {
  margin-top: 6px;
  text-align: center;
  font-weight: 800;
  font-size: 19px;
  line-height: 100%;
  color: #000;
}
</style>
