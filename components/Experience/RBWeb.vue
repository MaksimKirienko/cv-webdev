<template>
  <section ref="main" class="rbweb">
    <div class="rbweb-header">
      <div class="rbweb-header-text">
        User friendly design solutions
        <div class="rbweb-h1">
          Website development
        </div>
        <div class="rbweb-h1-small-part">
          pleasure to create
        </div>
      </div>
      <div class="rbweb-clouds-grad" />
      <div class="rbweb-rocket-white rbweb-rocket-1" />
      <div class="rbweb-rocket-white rbweb-rocket-2" />
      <div class="rbweb-rocket-white rbweb-rocket-3" />
      <div class="rbweb-rocket-white rbweb-rocket-4" />
      <div class="rbweb-clouds-white" />
      <div class="rbweb-rocket" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      rockets: [] as any[]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    this.handleScroll()

    const rockets = Array.from(document.querySelectorAll('.rbweb-rocket-white'))
    console.log(rockets)
    rockets.forEach(rocket => {
      rocket.addEventListener('mouseenter', this.onFly)
      rocket.addEventListener('animationend', this.onEnd)
    })
  },
  destroyed() {
    const rockets = Array.from(document.querySelectorAll('.rbweb-rocket-white'))
    rockets.forEach(rocket => {
      rocket.removeEventListener('mouseenter', this.onFly)
      rocket.removeEventListener('animationend', this.onEnd)
    })
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const node = this.$refs.main as HTMLElement
      const rect = node.getBoundingClientRect()

      if ((rect.top > window.innerHeight) || (rect.top < -node.clientHeight)) {
        if (node.style.display !== 'none') {
          window.requestAnimationFrame(() => {
            node.style.display = 'none'
          })
        }
      } else if (node.style.display !== 'block') {
        window.requestAnimationFrame(() => {
          node.style.display = 'block'
        })
      }
    },
    onFly(e: Event) {
      const rocket = e.target as HTMLElement
      rocket.classList.add('flightOut', Math.random() >= 0.5 ? 'rbweb-rocket-white-blue' : 'rbweb-rocket-white-orange')
    },
    onEnd(e: Event) {
      const rocket = e.target as HTMLElement
      rocket.classList.remove('flightOut', 'rbweb-rocket-white-blue', 'rbweb-rocket-white-orange')
      rocket.classList.add('fadeIn', 'animated')
    }
  }
})
</script>

<style lang="scss">
.rbweb {
  height: 100%;
}

.rbweb-header {
  color: white;
  width: 100%;
  height: 130vw;
  position: relative;
  overflow: hidden;
  background:
    url('~/assets/i/rbweb/stars.png'),
    linear-gradient(90deg, #45409e 0%, #80275d 100%);

  background-size: 50% 50%, auto auto
}

@media (min-width: 576px) {
  .rbweb-header {
    height: 720px;
  }
}

@media (min-width: 768px) {
  .rbweb-header {
    height: 100%;
    min-height: 690px;
  }
}

@media (min-width: 1200px) {
  .rbweb-header {
    min-height: 820px;
  }
}

.rbweb-header-text {
  position: relative;
  z-index: 10;
  margin: 66px 20px 0 20px;
  font-weight: 300;
  font-size: 5vw;
  line-height: 36px;
  text-align: center;
}

@media (min-width: 768px) {
  .rbweb-header-text {
    margin-top: 170px;
    font-size: 20px;
  }
}

.rbweb-h1 {
    margin: 12px;
    line-height: normal;
    font-size: 7vw;
    font-weight: 500;
  }

@media (min-width: 768px) {
  .rbweb-h1 {
    font-size: 30px;
  }
}

.rbweb-h1-small-part {
  font-size: 6vw;
}

@media (min-width: 768px) {
  .rbweb-h1-small-part {
    font-size: 32px;
  }
}

.rbweb-clouds-grad {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 400px;
  bottom: 0;
  background: url('~/assets/i/rbweb/clouds_grad.svg?inline') no-repeat center bottom -40px;
  background-size: 4212px 400px;
}

.rbweb-clouds-white {
  position: absolute;
  z-index: 8;
  width: 100%;
  height: 278px;
  bottom: 0;
  background: url('~/assets/i/rbweb/clouds_white.svg?inline') no-repeat center bottom -40px;
  background-size: 1500px 235px;
}

.rbweb-rocket {
  position: absolute;
  z-index: 8;
  bottom: 0;
  left: 50%;
  width: 200px;
  height: 0;
  padding-bottom: 100%;
  transform: translate(-50%, 0);
  background: url('~/assets/i/rbweb/rocket.svg?inline') no-repeat center center;
}

@media (min-width: 768px) {
  .rbweb-rocket {
    width: 60%;
  }
}

.rbweb-rocket-white {
  position: absolute;
  z-index: 9;
  left: 50%;
  width: 30%;
  height: 0;
  padding-bottom: 30%;
  background: url('~/assets/i/rbweb/rocket_white.svg?inline') no-repeat center center;
  background-size: 100% 100%;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.rbweb-rocket-white-blue {
  background: url('~/assets/i/rbweb/rocket_blue.svg?inline') no-repeat center center;
}

.rbweb-rocket-white-orange {
  background: url('~/assets/i/rbweb/rocket.svg?inline') no-repeat center center;
}

.rbweb-rocket-1 {
  bottom: 30%;
  margin-left: -55%;
}

.rbweb-rocket-2 {
  bottom: 11%;
  margin-left: -64%;
}

.rbweb-rocket-3 {
  bottom: 3%;
    margin-left: 0%;
}

.rbweb-rocket-4 {
  bottom: 7%;
  margin-left: 25%;
}

@keyframes flightOut {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  99% {
    transform: translate3d(750px, -750px, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(750px, -750px, 0);
    opacity: 0;
  }
}

.flightOut {
  opacity: 0;
  animation: flightOut 2.5s;
}
</style>
