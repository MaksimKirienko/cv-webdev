<template>
  <section class="game-window-container">
    <div class="game-overlay" />
    <div ref="wnd" class="game-window">
      <div v-if="hasTitleSlot" class="game-window-title-plate">
        <div class="game-window-title-plate-inner">
          <slot name="title" />
        </div>
      </div>
      <slot name="contents" />
      <div v-if="hasButtons" class="game-window-buttons game-window-buttons-bottom">
        <slot name="buttons" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    onClose: {
      type: Function,
      default: () => {},
      required: false
    }
  },
  computed: {
    hasTitleSlot(): Boolean {
      return !!this.$slots.title
    },
    hasButtons(): Boolean {
      return !!this.$slots.buttons
    }
  }
})
</script>
