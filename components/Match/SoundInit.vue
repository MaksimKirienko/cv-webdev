<template>
  <div ref="soundOverlay" class="sound-overlay" @click="initSound()" />
</template>

<script>
export default {
  mounted() {
    gameAudio.init()
      .then(e => {
        if (gameAudio.soundInitialized) {
          this.$refs.soundOverlay.style.display = 'none'
        }
      })
  },
  methods: {
    initSound() {
      this.$refs.soundOverlay.style.display = 'none'
      gameAudio.init()
    }
  }
}
</script>

<style lang="scss">
.sound-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: rgba(255, 0, 0, 0.1);
}
</style>
