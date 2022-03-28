<template>
  <section class="hard">
    <div id="skills" class="local-link" />
    <div class="hard-container container">
      <div class="exp-heading bl-pad">
        <h2>
          Hard Skills
        </h2>
        <div class="h2-sub">
          Responsiveness, mobile first, stability.<br>
          Animation, graphics and gamificaion.
        </div>
      </div>
      <div class="hard-grid">
        <div class="hard-cell-fox">
          <div class="hard-fox-wrapper">
            <model-viewer
              ref="hardFox"
              class="hard-fox"
              :src="'/assets/3d/Fox.glb'"
              camera-controls
              disable-zoom
              autoplay
              background-color="transparent"
              camera-orbit="50deg 90deg"
              camera-target="0 0 0"
              data-js-focus-visible
            />
          </div>
        </div>
        <div class="hard-cell-tags">
          <div class="hard-tags-container">
            <div class="hard-tag hard-tag-ts">
              TypeScript
            </div>
            <div class="hard-tag hard-tag-wd">
              Web Development
            </div>
            <div class="hard-tag hard-tag-fe">
              Front-end Development
            </div>
            <div class="hard-tag hard-tag-w3d">
              Web 3D
            </div>
            <div class="hard-tag hard-tag-nuxt">
              Nuxt + VueJS
            </div>
            <div class="hard-tag hard-tag-ux">
              UX / UI
            </div>
            <div class="hard-tag hard-tag-seo">
              SEO
            </div>
            <div class="hard-tag hard-tag-js">
              JavaScript
            </div>
            <div class="hard-tag hard-tag-pixi">
              Pixi JS
            </div>
            <div class="hard-tag hard-tag-sql">
              SQL
            </div>
            <div class="hard-tag hard-tag-wa">
              Web Analytics
            </div>
          </div>
          <div class="hard-skills-list bl-pad">
            SSG jamstack git gulp webpack react bash mysql python php svg canvas webgl three babylon rest scss nginx debian es6-es12
          </div>
        </div>
        <div class="hard-cell-webview bl-pad">
          <div class="hard-cell-wrapper">
            <h2>
              Webview<br>
              game<br>
              development
            </h2>
            Webview allows application developers to isolate game mechanics. To integrate the CI / CD pipeline into the marketing product and achieve flexibility in conducting the campaign.
          </div>
        </div>
        <div class="hard-cell-flappy">
          <div ref="flappy" class="hard-game-wrapper">
            <Flappy />
            <!-- <picture>
              <source :srcset="require(`~/assets/i/hard/flappy.jpg?sizes[]=1130&format=webp`).srcSet" type="image/webp">
              <img class="hard-flappy-pic" width="1130" height="1942" :src="require(`~/assets/i/hard/flappy.jpg?resize&size=1130`)" alt="" loading="lazy">
            </picture> -->
          </div>
        </div>
        <div class="hard-cell-case bl-pad">
          <h2>
            Case
          </h2>
          <div class="hard-case-desc">
            The marketing campaign for a retail chain based on match2 mechanics
          </div>
          <div class="hard-stats">
            <div class="hard-stat-item">
              <div class="hard-stat-title">
                80K
              </div>
              <div class="hard-stat-text">
                CCU – simultaneous users
              </div>
            </div>
            <div class="hard-stat-item">
              <div class="hard-stat-title">
                1.5M+
              </div>
              <div class="hard-stat-text">
                players during the campaign
              </div>
            </div>
            <div class="hard-stat-item">
              <div class="hard-stat-title">
                3T+
              </div>
              <div class="hard-stat-text">
                frontend traffic per day
              </div>
            </div>
          </div>
        </div>
        <div class="hard-cell-match2">
          <div ref="match2" class="hard-game-wrapper">
            <MatchGame v-if="matchStarted" />
            <!-- <picture>
              <source :srcset="require(`~/assets/i/hard/match2.jpg?sizes[]=1138&format=webp`).srcSet" type="image/webp">
              <img class="hard-match-pic" width="1138" height="1942" :src="require(`~/assets/i/hard/match2.jpg?resize&size=1138`)" alt="" loading="lazy">
            </picture> -->
          </div>
          * example redesigned
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      matchStarted: false
    }
  },
  mounted() {
    this.$store.commit('match/setSound', false)
    this.$store.commit('match/startLevel', 1)
    this.matchStarted = true
  },
  destroyed() {
    (this.$refs.hardFox as HTMLElement).remove()
  },
  methods: {
    handleScroll() {
      const nodes = [
        this.$refs.hardFox as HTMLElement,
        this.$refs.flappy as HTMLElement,
        this.$refs.match2 as HTMLElement
      ]

      nodes.forEach(node => {
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
      })
    }
  }
})
</script>

<style lang="scss">
.hard {
  padding-top: 55px;
  padding-bottom: 55px;
  color: #fff;

  .h2-sub {
    max-width: 632px;
  }
}

@media(min-width: 768px) {
  .hard {
    padding-top: 110px;
    padding-bottom: 110px;
  }
}

.hard-grid {
  display: grid;
  grid-gap: 100px 25px;
}

@media (min-width: 768px) {
  .hard-grid {
    grid-template-columns: 1fr 1fr;
    grid-gap: 180px 25px;
  }
}

.hard-cell-wrapper {
  max-width: 520px;
}

.hard-fox-wrapper {
  position: relative;
  padding-bottom: 80%;
}

.hard-fox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  outline: none !important;
  outline-width: 0 !important;
  user-select: none;

  --poster-color: rgba(0, 0, 0, 0);
  --progress-mask: rgba(0, 0, 0, 0);
}

.hard-tags-pic {
  position: absolute;
  width: 100%;
}

.hard-tags-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 80%;
}

.hard-tag {
  position: absolute;
}

.hard-tag-ts {
  font-size: 5.4vw;
  left: 25%;
  top: 2%;
}
.hard-tag-wd {
  font-size: 3.5vw;
  left: 64%;
  top: 10%;
}
.hard-tag-fe {
  font-size: 5.4vw;
  left: 0%;
  top: 26%;
}
.hard-tag-w3d {
  font-size: 9vw;
  left: 66%;
  top: 31%;
}
.hard-tag-nuxt {
  font-size: 9vw;
  left: 4%;
  top: 53%;
}
.hard-tag-ux {
  font-size: 5.4vw;
  left: 79%;
  top: 53%;
}
.hard-tag-seo {
  font-size: 5.4vw;
  left: 27%;
  top: 77%;
}
.hard-tag-js {
  font-size: 7.4vw;
  left: 45%;
  top: 70%;
}
.hard-tag-pixi {
  font-size: 5.4vw;
  left: 9%;
  top: 90%;
}
.hard-tag-sql {
  font-size: 3.5vw;
  left: 50%;
  top: 90%;
}
.hard-tag-wa {
  font-size: 3.5vw;
  left: 71%;
  top: 86%;
}
@media (min-width: 768px) {
  .hard-tag-ts, .hard-tag-fe, .hard-tag-ux, .hard-tag-seo, .hard-tag-pixi {
    font-size: 2.5vw;
  }
  .hard-tag-wd, .hard-tag-sql, .hard-tag-wa {
    font-size: 1.7vw;
  }
  .hard-tag-w3d, .hard-tag-nuxt {
    font-size: 4.3vw;
  }
  .hard-tag-js {
    font-size: 3.4vw;
  }
}
@media (min-width: 1512px) {
  .hard-tag-ts, .hard-tag-fe, .hard-tag-ux, .hard-tag-seo, .hard-tag-pixi {
    font-size: 37px;
  }
  .hard-tag-wd, .hard-tag-sql, .hard-tag-wa {
    font-size: 24px;
  }
  .hard-tag-w3d, .hard-tag-nuxt {
    font-size: 65px;
  }
  .hard-tag-js {
    font-size: 51px;
  }
}

.hard-cell-webview {
  display: flex;
  align-items: center;
}

.hard-cell-flappy {
  padding: 0 10px;
  box-sizing: border-box;
}

.hard-game-wrapper {
  position: relative;
  max-width: 375px;
  height: 600px;
  margin: 0 auto;
  border-radius: 30px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hard-game-wrapper {
    height: 636px;
    border-radius: 60px;
  }
}

.hard-cell-match2 {
  padding: 0 10px;
  box-sizing: border-box;
  text-align: center;

  .hard-game-wrapper {
    margin-bottom: 20px;
  }
}

.hard-tags-pic, .hard-flappy-pic, .hard-match-pic {
  width: 100%;
  height: auto;
  display: block;
}

.hard-skills-list {
  margin-top: 80px;
  font-size: 120%;
  line-height: 130%;
}

@media (min-width: 768px) {
  .hard-cell-case {
    grid-column: 2;
  }
  .hard-cell-match2 {
    grid-column: 1;
    grid-row: 3;
  }
}

.hard-case-desc {
  font-size: 150%;
  line-height: 130%;
}

.hard-stat-item {
  margin-top: 60px;
}

.hard-stat-title {
  font-size: 80px;
  line-height: 100%;
}

.hard-stat-text {
  margin-top: 6px;
  font-size: 150%;
}
</style>
