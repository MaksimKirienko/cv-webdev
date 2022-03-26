<template>
  <div class="soft">
    <div class="soft-container container">
      <div class="soft-heading bl-pad">
        <h2>
          Soft Skills
        </h2>
        <div class="h2-sub">
          The best results are achieved through the interaction of all team members, each of whom is a professional in field of expertise. Aiming for the result, positive communication, critical thinking - these and other skills allow the team and the whole business to reach new qualitative levels.
        </div>
      </div>

      <div class="soft-cols">
        <div class="soft-icons-col">
          <picture>
            <source :srcset="require(`~/assets/i/soft/soft-icons.jpg?sizes[]=892&format=webp`).srcSet" type="image/webp">
            <img class="soft-icons-pic" width="892" height="914" :src="require(`~/assets/i/soft/soft-icons.jpg?resize&size=892`)" alt="" loading="lazy">
          </picture>
        </div>
        <div class="soft-content-col">
          <div class="soft-lines">
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
      },
      tags: ['teamwork', 'flexibility', 'time management', 'leadership', 'problem solving']
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

.soft-icons-pic {
  width: 80%;
  height: auto;
  display: block;
  margin: 0 auto;
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
