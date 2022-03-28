<template>
  <section v-if="showEndGame" class="match-game-end match-window">
    <div class="match-window-close" @click="close()" />
    <div class="match-window-subtitle">
      Привет!
    </div>
    <p>
      Действие акции закончилось, но по вашим просьбам мы решили продлить доступ к игре!
    </p>
    <p>
      К сожалению, подарки за уровни больше не выдаются, а миссии отключены.
    </p>
    <p>
      <b>Хорошей игры!</b>
    </p>
    <div class="btn btn-green" @click="close()" >Хорошо</div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showEndGame: false
    }
  },
  mounted() {
    const shown = localStorage?.getItem('endGameShown')

    if (!shown) {
      this.showEndGame = true
    }

    this.checkBlur()
  },
  methods: {
    close() {
      localStorage?.setItem('endGameShown', 1)
      this.showEndGame = false
      this.checkBlur()
    },
    checkBlur() {
      if (this.showEndGame) {
        this.$store.commit('match/setBlur', {
          status: true,
          handler: 'EndGame wnd',
          callback: null
        })
      }

      if (
        !this.showEndGame &&
        this.$store.state.match.blur.handler == 'EndGame wnd'
      ) {
        this.$store.commit('match/setBlur', {
          status: false,
          handler: 'EndGame wnd - close',
          callback: null
        })
      }
    },
  }
}
</script>
