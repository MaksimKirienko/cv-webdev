<template>
  <div class="time-left">
    <div v-if="text" class="time-left-text">
      {{ text }}
    </div>
    <div class="time-left-inner" v-html="timeText" />
  </div>
</template>

<script>
import { calcTimeDifferenceTillNow } from '~/scripts/Match2/lib.js'

export default {
  props: {
    time: {
      type: Number,
      default: 0,
      require: false
    },
    timeTo: {
      type: String,
      default: '',
      require: false
    },
    text: {
      type: String,
      require: false,
      default: ''
    }
  },
  computed: {
    timeText() {
      const time = this.timeTo
        ? this.calcTime(this.timeTo)
        : Math.max(0, this.time)

      const d = Math.floor(time / (3600 * 24))
      const h = Math.floor(time % (3600 * 24) / 3600)
      const m = Math.floor(time % 3600 / 60)
      // const s = Math.floor(time % 60)

      if (d > 20) {
        return `${ d } ${ d % 10 === 1 ? 'день' : ((d % 10 > 0) && (d % 10 < 5)) ? 'дня' : 'дней'}`
      }

      if (d > 3) {
        return `${ d } ${ d < 5 ? 'дня' : 'дней'}`
      }

      return `${ d ? d + '<sub>д</sub> : ' : '' }
        ${ h + '<sub>ч</sub>' }
        ${ !d ? ' : ' + (m < 10 ? '0' + m : m) + '<sub>мин</sub>' : '' }
      `
    }
  },
  methods: {
    calcTime(timeTo) {
      return calcTimeDifferenceTillNow(timeTo)
    }
  }
}
</script>

<style lang="scss">
.time-left {
  padding: 7px 7px 6px 7px;
  font-weight: 800;
  font-size: 14px;
  line-height: 100%;
  color: #fff;
  background: linear-gradient(219.82deg, #7C04F3 2.35%, #C75EE1 108.73%);
  border-radius: 7px;
  display: inline-block;
  box-sizing: border-box;

  sub {
    font-size: 65%;
    line-height: 100%;
    font-weight: normal;
    vertical-align: unset;
  }
}
</style>
