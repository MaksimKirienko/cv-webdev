<template>
  <div
    ref="blur"
    class="match-blur-overlay"
    :class="{ active: blured }"
    @click="onClick()"
  />
</template>

<script>
export default {
  computed: {
    blured() {
      return this.$store.state.match.blured
    },
    blur() {
      return this.$store.state.match.blur
    }
  },
  watch: {
    blur() {
      this.setZ()
    }
  },
  mounted() {
    this.setZ()
  },
  methods: {
    setZ() {
      if (!this.$refs.blur) {
        return
      }

      if (typeof this.$store.state.match.blur?.zIndex !== 'udefined') {
        this.$refs.blur.style.zIndex = this.$store.state.match.blur?.zIndex
      } else {
        this.$refs.blur.style.removeProperty('z-index')
      }
    },
    onClick() {
      const callback = this.$store.state.match.blur.callback

      if (callback) {
        callback()
      }
    }
  }
}
</script>

<style lang="scss">
.match-blur-overlay {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  z-index: 999;

  &.active {
    display: block;
  }
}
</style>
