<template>
  <div v-if="leaveLink">
    <div class="match-leave-overlay" @click="closeLeave()" />
    <section class="match-leave match-window">
      <div class="match-window-close" @click="closeLeave()" />
      <div class="match-window-subtitle">
        Переходя по ссылке ты покинешь игру
      </div>
      <div class="btn" @click="closeLeave()">Остаться</div>
      <a class="btn btn-violet" :href="leaveLink" target="_blank">Продолжить</a>
    </section>
  </div>
</template>

<script>
export default {
  computed: {
    leaveLink() {
      return this.$store.state.match.leaveLink.trim()
    },
  },
  watch: {
    leaveLink() {
      this.checkDiplink()
    }
  },
  mounted() {
    this.checkDiplink()
  },
  methods: {
    checkDiplink() {
      const link = this.leaveLink
      if (link.match(/xxx\.page/)) {
        window.open(link, '_blank').focus()
        this.$store.commit('match/setLeaveLink', '')
      }
    },
    closeLeave() {
      this.$store.commit('match/setLeaveLink', '')
    }
  }
}
</script>

<style lang="scss">
.match-leave-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  z-index: 1013;
}

.match-leave {
  text-align: center;
  z-index: 1014;
  padding-top: 50px;
}
</style>
