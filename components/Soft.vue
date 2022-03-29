<template>
  <div class="soft">
    <div class="soft-container container">
      <div class="soft-heading bl-pad">
        <h2>
          Soft Skills
        </h2>
        <div class="h2-sub">
          The best results are achieved through the interaction of all team members,
          each of whom is a professional in field of expertise. Aiming for the result,
          positive communication, critical thinking - these and other skills allow the
          team and the whole business to reach new levels.
        </div>
      </div>
      <div class="soft-cols">
        <div class="soft-icons-col">
          <div ref="prlx" class="soft-icons">
            <div class="parallax-layer" data-depth="1.2">
              <div class="soft-icon-1 soft-icon" v-html="require(`~/assets/i/soft/icons/1.svg?include`)" />
            </div>
            <div class="parallax-layer" data-depth="1.6">
              <div class="soft-icon-2 soft-icon" v-html="require(`~/assets/i/soft/icons/2.svg?include`)" />
            </div>
            <div class="parallax-layer" data-depth="2.2">
              <div class="soft-icon-3 soft-icon" v-html="require(`~/assets/i/soft/icons/3.svg?include`)" />
            </div>
            <div class="parallax-layer" data-depth="4">
              <div class="soft-icon-4 soft-icon" v-html="require(`~/assets/i/soft/icons/4.svg?include`)" />
            </div>
            <div class="parallax-layer" data-depth="1.8">
              <div class="soft-icon-5 soft-icon" v-html="require(`~/assets/i/soft/icons/5.svg?include`)" />
            </div>
          </div>
        </div>
        <div class="soft-content-col">
          <div ref="lines" class="soft-lines">
            <div
              v-for="(skill, skillName) in skills"
              :key="skillName"
              class="soft-line"
            >
              <div class="soft-line-bar" :style="{ 'width': (skill * 100) + '%' }" />
              <div class="soft-line-progress" :style="{ 'min-width': (skill * 100) + '%' }">
                <div class="soft-line-title">
                  {{ skillName }}
                </div>
                <div class="soft-line-perc">
                  {{ skill * 100 }}%
                </div>
              </div>
            </div>
          </div>
          <div class="soft-progress-text">
            In everyday life, I share the values of a healthy lifestyle and nutrition. I try to be pedantic, but not nerd 🤓. To have fun with my friends. Always happy to work in a friendly and positive team.
          </div>
          <div class="soft-tags">
            <div
              v-for="(tag, index) in tags"
              :key="`tag-${index}`"
              class="soft-tag"
            >
              {{ tag }}
            </div>
          </div>
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
      skills: {
        Turquoise: 1,
        Empathy: 0.9,
        Management: 0.7,
        Design: 0.7,
        'Critical thinking': 0.8,
        Agility: 0.9,
        Nerd: 0.1
      } as any,
      tags: ['teamwork', 'flexibility', 'time management', 'leadership', 'problem solving'],
      prlx: null as Parallax | null,
      startedAnimation: false
    }
  },
  mounted() {
    if (this.$refs.prlx) {
      this.prlx = new Parallax(this.$refs.prlx as HTMLElement, 5, 4)
    }

    window.addEventListener('scroll', this.checkStart, { passive: true })
  },
  destroyed() {
    window.removeEventListener('scroll', this.checkStart)
  },
  methods: {
    checkStart() {
      if (this.startedAnimation) {
        return
      }

      if (window.scrollY + document.body.clientHeight > (this.$refs.lines as HTMLElement).offsetTop) {
        this.animateBars()
        this.startedAnimation = true
      }
    },
    animateBars() {
      if (this.startedAnimation) {
        return
      }
      this.startedAnimation = true

      const bars = document.querySelectorAll('.soft-line-bar')
      const progress = document.querySelectorAll('.soft-line-progress')
      const text = document.querySelectorAll('.soft-line-perc')

      bars.forEach((bar, index) => {
        (bar as HTMLElement).style.width = '0%';
        (progress[index] as HTMLElement).style.minWidth = '0%'
      })

      const animate = (bar: HTMLElement, percent: number, progress: HTMLElement, text: HTMLElement) => {
        const width = percent * 100
        const id = setInterval(frame, 15)
        let currentWidth = 0

        function frame() {
          window.requestAnimationFrame(() => {
            if (currentWidth >= width) {
              clearInterval(id)
            } else {
              currentWidth++
              bar.style.width = currentWidth + '%'
              progress.style.minWidth = currentWidth + '%'
              text.innerHTML = currentWidth + '%'
            }
          })
        }
      }

      Object.keys(this.skills).forEach((skillName, index) => {
        animate(
          bars[index] as HTMLElement,
          this.skills[skillName] as number,
          progress[index] as HTMLElement,
          text[index] as HTMLElement
        )
      })
    }
  }
})
</script>

<style lang="scss">
.soft {
  padding: 55px 0;
}

@media (min-width: 768px) {
  .soft {
    padding: 110px 0;
  }
}

.soft-heading {
  max-width: 810px;
  box-sizing: border-box;
  padding-bottom: 55px;
}

@media (min-width: 768px) {
  .soft-heading {
    padding-bottom: 110px;
  }
}

.soft-cols {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.soft-icons-col {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 55px;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .soft-icons-col {
    flex: 0 0 calc(40% - 12.5px);
  }
}

.soft-icons {
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

.soft-icons-pic {
  position: absolute;
  width: 80%;
  height: auto;
  display: block;
  margin: 0 auto;
  left: 10%;
  top: 9%;
}

.soft-icon {
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

.soft-icon-1 {
  width: 22%;
  transform: translate(-120%, -188%);
}
.soft-icon-2 {
  width: 22%;
  transform: translate(67%, -163%);
}
.soft-icon-3 {
  width: 22%;
  transform: translate(-182%, 24%);
}
.soft-icon-4 {
  width: 22%;
  transform: translate(-30%, -40%);
}
.soft-icon-5 {
  width: 22%;
  transform: translate(83%, 88%);
}

.soft-content-col {
  flex: 0 0 100%;
}

@media (min-width: 768px) {
  .soft-content-col {
    flex: 0 0 calc(60% - 12.5px);
  }
}

.soft-line {
  position: relative;
  height: 15px;
  background: #EAECEF;
  border-radius: 4px;
  margin-top: 46px;
}

.soft-line-progress {
  position: relative;
  width: fit-content;
  display: flex;
  justify-content: space-between;
}

.soft-line-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,#f6663f 31%,#ed145b 69%);
  border-radius: 4px;
}

.soft-line-title {
  position: relative;
  top: -24px;
  height: 15px;
  font-size: 90%;
}

.soft-line-perc {
  position: relative;
  top: -24px;
  height: 15px;
  width: fit-content;
  font-size: 90%;
  margin-left: 10px;
}

@media (min-width: 992px) {
  .soft-line-title, .soft-line-perc {
    top: -32px;
  }
}

.soft-progress-text {
  margin-top: 50px;
  font-weight: 500;
}

.soft-tags {
  display: flex;
  flex-wrap: wrap;
  margin: 40px -10px 0 -10px;
}

.soft-tag {
  color: #fff;
  padding: 5px 26px;
  background: #000000;
  border-radius: 8px;
  margin: 0 10px 11px 10px;
}
</style>
