<template>
  <section class="flappy-main">
    <FlappyRules v-if="stage === 'rules'" :on-start="startGame" />
    <FlappyGame v-if="stage === 'game'" />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    stage() {
      return this.$store.state.flappy.stage
    }
  },
  methods: {
    startGame() {
      this.$store.commit('flappy/setStage', 'game')
    }
  }
})
</script>

<style lang="scss">
.flappy-main {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
