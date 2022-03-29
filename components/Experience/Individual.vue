<template>
  <div class="exp-cols">
    <div class="exp-block-text block block-padded">
      <div class="exp-pos-heading">
        <h3>
          Individual entrepreneur
          <br>
          Web developer
        </h3>
        <div class="h3-sub">
          Sep 2020 – Present, Remote
        </div>
        <div class="h3-sub-light">
          With Yode, Antepa, Rocket Business
        </div>
      </div>
      <div class="exp-text">
        <p>
          Launched 30+ web marketing projects with the “Yode”
          (<a href="https://yode.co" target="_blank">yode.co</a>) partner.
          In collaboration with major brands: Pyaterocha & Magnit retail chains, UNGA agency, Coke collab, Brawl Stars collab, Sony Pictures Monster Vacation collab & more.
          Webview integration in applications, promo pages, games and gamification, 3d technologies in the web.
        </p>
        <p>
          Evolve web direction of the business For “Yode” partner.
          Increased number of web projects from 3-5/year to 20+. Quality standards, UX/UI, optimization.
        </p>
        <p>
          Solved technically complex tasks with a short time required.
          As an example, for the “Antepa” partner, in one month redesign &
          refactor the Django site of the chain of dental clinics, fixed data uploads.
        </p>
        <h4>Examples of marketing campaigns</h4>
        <p>
          <b>Pyaterochka retail chain + Brawl Stars collaboration.</b>
          <br>
          WebView game with match2 mechanics.
          Over 1.5M players.
          Software design based on OOP + event-driven programming with JS Promises.
          Realtime on-the-fly level editor. Nuxt SSG + nginx + CDN. DOM, Canvas,
          SVG, sprites, sounds, js animations, safari optimization, REST optimization.
          Error handling, testing, communication with app team.
        </p>
        <p>
          <b>Magnit retail chain + UNGA agency + Sony Pictures.</b>
          <br>
          WebView game with memo mechanics. Drawing for a collection of in-game 3d prizes.
        </p>
        <p>
          <a href="/#skills">
            Check out my skills ›
          </a>
        </p>
      </div>
    </div>
    <div class="exp-block-right">
      <div class="exp-block-tr block block-padded">
        <div ref="prlx" class="exp-logos">
          <div class="parallax-layer" data-depth="1.2">
            <div class="exp-logo-bs exp-logo" v-html="require(`~/assets/i/experience/logos/brawls.svg?include`)" />
          </div>
          <div class="parallax-layer" data-depth="1.6">
            <div class="exp-logo-yode exp-logo" v-html="require(`~/assets/i/experience/logos/yode.svg?include`)" />
          </div>
          <div class="parallax-layer" data-depth="2.2">
            <div class="exp-logo-5ka exp-logo" v-html="require(`~/assets/i/experience/logos/5ka.svg?include`)" />
          </div>
          <div class="parallax-layer" data-depth="4">
            <div class="exp-logo-vk exp-logo" v-html="require(`~/assets/i/experience/logos/vk.svg?include`)" />
          </div>
          <div class="parallax-layer" data-depth="1.8">
            <div class="exp-logo-qval exp-logo" v-html="require(`~/assets/i/experience/logos/qval.svg?include`)" />
          </div>
          <div class="parallax-layer" data-depth="2.6">
            <div class="exp-logo-se exp-logo" v-html="require(`~/assets/i/experience/logos/se.svg?include`)" />
          </div>
          <div class="parallax-layer" data-depth="3">
            <div class="exp-logo-coke exp-logo" v-html="require(`~/assets/i/experience/logos/coke.svg?include`)" />
          </div>
          <div class="parallax-layer" data-depth="1">
            <div class="exp-logo-magnit exp-logo" v-html="require(`~/assets/i/experience/logos/magnit.svg?include`)" />
          </div>
        </div>
      </div>
      <div class="exp-block-br block">
        <div class="exp-gal">
          <picture>
            <source :srcset="require(`~/assets/i/experience/collabs.jpg?sizes[]=1364&format=webp`).srcSet" type="image/webp">
            <img class="exp-gal-pic" width="1364" height="944" :src="require(`~/assets/i/experience/collabs.jpg?resize&size=1364`)" alt="" loading="lazy">
          </picture>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Parallax from '~/scripts/parallax'

export default Vue.extend({
  data() {
    return {
      prlx: null as Parallax | null
    }
  },
  mounted() {
    if (this.$refs.prlx) {
      this.prlx = new Parallax(this.$refs.prlx as HTMLElement, 5, 4)
    }
  }
})
</script>

<style lang="scss">
.exp-logos {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;

  .parallax-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    will-change: transform;
    pointer-events: none;
    transition: transform 0.1s linear;
  }
}

.exp-logos-pic {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exp-logo {
  position: absolute;
  left: 50%;
  top: 50%;

  svg {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease-in-out;
    pointer-events: all;

    &:hover {
      transform: scale(1.15);
    }
  }
}

.exp-logo-bs {
  width: 20%;
  transform: translate(-173%, -317%);
}
.exp-logo-yode {
  width: 26%;
  transform: translate(-32%, -289%);
}
.exp-logo-5ka {
  width: 23%;
  transform: translate(116%, -169%);
}
.exp-logo-vk {
  width: 22%;
  transform: translate(-191%, -81%);
}
.exp-logo-se {
  width: 36%;
  transform: translate(-139%, 110%);
}
.exp-logo-coke {
  width: 23%;
  transform: translate(-44%, 57%);
}
.exp-logo-qval {
  width: 35%;
  transform: translate(-7%, -117%);
}
.exp-logo-magnit {
  width: 13%;
  transform: translate(217%, 35%);
}
</style>
