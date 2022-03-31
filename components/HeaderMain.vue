<template>
  <header class="header-main">
    <div class="header-container container">
      <picture>
        <source :srcset="require(`~/assets/i/header/photo.jpg?sizes[]=1366&sizes[]=1024&format=webp`).srcSet" type="image/webp">
        <img class="header-main-kv" width="1366" height="1578" :src="require(`~/assets/i/header/photo.jpg?resize&size=1024`)" alt="">
      </picture>
      <div
        class="header-vac"
        :style="{
          opacity: 1 - progress * 1.4,
          left: -(progress * 20) + 'px'
        }"
      >
        Web Developer
        <span>Frontend</span>
      </div>
      <div
        class="header-skills"
        :style="{
          opacity: 1 - progress * 2,
          right: -(progress * 20) + 'px'
        }"
      >
        <div class="header-skills-item">JavaScript</div>
        <div class="header-skills-item">TypeScript</div>
        <div class="header-skills-item">Jamstack</div>
        <div class="header-skills-item">Nuxt + VueJS</div>
        <div class="header-skills-item">WebGl</div>
        <div class="header-skills-item">UX / UI</div>
        <div class="header-skills-item">Marketing</div>
        <div class="header-skills-item">
          <a href="/#skills">
            all skills ›
          </a>
        </div>
      </div>
      <div
        class="header-summary"
        :style="{
          top: (75 - progress * 140 * !wideDesign) + 'px'
        }"
      >
        <div class="header-summary-name">
          <b>Maksim</b> Kirienko
        </div>
        <h1>
          Empower you team
        </h1>
        <div class="header-summary-text">
          12+ years of experience, web frontend focus.<br>
          Love &#10084;&#65039; JavaScript / TS, HTML, animations, and good user experience.<br>
          Agile approach.<br>
          Feel free to contact me to discuss your goals, I’ll be glad to communicate&nbsp;&#128513;
          <a class="header-summary-link" href="/#contacts">Get in touch ›</a>
        </div>
        <a class="header-summary-btn btn btn-outline" target="_blank" href="/assets/files/Maksim-Kirienko-CV.pdf">
          Download CV
        </a>
        <div class="header-summary-contacts">
          <a class="header-summary-icon" target="_blank" href="https://t.me/vijener" v-html="require('assets/i/icons/tg.svg?include')" />
          <a class="header-summary-icon" target="_blank" href="mailto:maxim.kirienko@gmail.com" v-html="require('assets/i/icons/email.svg?include')" />
          <a class="header-summary-icon" target="_blank" href="https://www.linkedin.com/in/vijener/" v-html="require('assets/i/icons/linkedin.svg?include')" />
          <a class="header-summary-icon" target="_blank" href="https://www.instagram.com/vijenerm/" v-html="require('assets/i/icons/inst.svg?include')" />
          <a class="header-summary-icon" target="_blank" href="https://github.com/MaksimKirienko/cv-webdev" v-html="require('assets/i/icons/github.svg?include')" />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      progress: 0,
      wideDesign: false,
      ticking: false
    }
  },
  computed: {
    scrollMax(): number {
      return this.wideDesign ? 250 : 200
    },
    scrollOffset(): number {
      return Math.min(window?.innerWidth / 3, this.wideDesign ? 0 : (window?.innerHeight / 3) + 30 ?? 0)
    }
  },
  mounted() {
    window?.addEventListener('scroll', this.handleScroll, { passive: true })
    this.handleScroll()

    window?.addEventListener('resize', this.resize)
    this.resize()
  },
  destroyed() {
    window?.removeEventListener('scroll', this.handleScroll)
    window?.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      this.checkWide()
    },
    checkWide() {
      if (typeof window !== 'undefined') {
        this.wideDesign = (window?.innerWidth / window?.innerHeight) > 4 / 5
      } else {
        this.wideDesign = false
      }
    },
    handleScroll () {
      if (this.ticking) {
        return
      }
      this.ticking = true

      window?.requestAnimationFrame(() => {
        this.ticking = false
        this.progress = Math.min(1, Math.max(0, window?.scrollY - this.scrollOffset) / this.scrollMax)
      })
    }
  }
})
</script>

<style lang="scss">
.header-main {
  position: relative;
  overflow: hidden;
  margin-top: 80px;

  h1 {
    font-size: 10vw;
    margin-top: 24px;
  }
}

@media (min-width: 768px) {
  .header-main {
    margin-top: 90px;

    h1 {
      font-size: 80px;
    }
  }
}

.header-container {
  position: relative;
}

.header-main-kv {
  display: block;
  width: 90%;
  max-width: 683px;
  height: auto;
  min-height: 50vw;
  max-height: calc(75vh - 90px);
  margin: 0 auto;
  border-radius: 30px;
  object-fit: cover;
  object-position: center top;
}

@media (min-width: 576px) {
  .header-main-kv {
    border-radius: 60px;
  }
}

@media (min-width: 576px) and (min-aspect-ratio: 4/5) {
  .header-main-kv {
    width: 60%;
  }
}

@media (min-width: 1512px) {
  .header-main-kv {
    min-height: unset;
  }
}

.header-vac {
  position: relative;
  top: 0;
  opacity: 1;
  font-size: 10vw;
  font-weight: 500;
  line-height: 120%;
  margin-top: 20px;
  will-change: opacity left;

  span {
    display: block;
    font-size: 90%;
  }
}

@media (min-width: 768px) {
  .header-vac {
    font-size: 80px;
  }
}

@media (min-width: 576px) and (min-aspect-ratio: 4/5) {
  .header-vac {
    position: absolute;
    font-size: 5vw;
    top: calc(-30px + 8vw);
    margin-left: 0.75rem;
    line-height: 140%;
  }
}

@media (min-width: 992px) and (min-aspect-ratio: 4/5) {
  .header-vac {
    margin-left: 2rem;
  }
}

@media (min-width: 1200px) and (min-aspect-ratio: 4/5) {
  .header-vac {
    top: calc(25px + 2vw);
  }
}

@media (min-width: 1400px) {
  .header-vac {
    top: 50px;
    font-size: 72px;
  }
}

@media (min-width: 1512px) {
  .header-vac {
    font-size: 76px;
  }
}

.header-skills {
  position: relative;
  top: 0;
  opacity: 1;
  display: flex;
  flex-wrap: wrap;
  margin: 20px -10px 0 -10px;
  will-change: opacity right;
}

.header-skills-item {
  margin: 3px 10px;
}

@media (min-width: 576px) and (min-aspect-ratio: 4/5) {
  .header-skills {
    position: absolute;
    flex-direction: column;
    top: 60px;
    margin-right: 0.75rem;
  }
  .header-skills-item {
    margin: 6px 0;
  }
}

@media (min-width: 992px) and (min-aspect-ratio: 4/5) {
  .header-skills {
    margin-right: 2rem;
  }
}

.header-summary {
  position: relative;
  top: 75px;
  margin: 0 auto;
  padding-bottom: 80px;
  text-align: center;
  will-change: top;
  font-size: 115%;
}

@media (min-width: 576px) {
  .header-summary {
    font-size: 125%;
  }
}
@media (min-aspect-ratio: 4/5) {
  .header-summary {
    padding-bottom: 180px;
  }
}

.header-summary-name {
  font-size: 34px;
  font-weight: 300;

  b {
    font-weight: 500;
  }
}

.header-summary-text {
  margin: 0 auto;
  max-width: 660px;
  line-height: 130%;
}

@media (min-width: 992px) {
  .header-summary-text {
    max-width: 919px;
  }
}

.header-summary-link {
  display: block;
  width: fit-content;
  margin: 20px auto 0 auto;
}

.header-summary-btn {
  font-size: 110%;
  width: 80%;
  max-width: 300px;
  padding: 16px 35px 15px 35px;
  margin: 70px 0;
}

@media (min-width: 1200px) {
  .header-summary-btn {
    font-size: 1.75rem;
    width: 90%;
    max-width: 410px;
    padding: 26px 45px 25px 45px;
    margin: 100px 0;
  }
}

.header-summary-contacts {
  display: flex;
  justify-content: center;
}

.header-summary-icon {
  width: 38px;
  height: 38px;
  margin: 0 12px;

  svg {
    width: 100%;
    height: 100%;
  }
}

@media (min-width: 768px) {
  .header-summary-icon {
    width: 50px;
    height: 50px;
    margin: 0 22px;
  }
}
</style>
