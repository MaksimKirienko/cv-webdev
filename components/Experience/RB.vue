<template>
  <div class="exp-cols">
    <div class="exp-block-text block block-padded">
      <div class="exp-pos-heading">
        <h3>
          Co-Founder, IT Director
        </h3>
        <div class="h3-sub">
          Jan 2010 - Sep 2020
        </div>
        <div class="h3-sub-light">
          Rocket Business
          <div class="small">
            (<a href="https://rocketbusiness.agency" target="_blank">rocketbusiness.agency</a>)
          </div>
        </div>
      </div>
      <div class="exp-text">
        <p>
          <b>Founded the agency in 2010</b> with my colleague. The company provides a wide range of Internet marketing services, number of specialists ranged from 15 to 20. We have always prioritized honest relationships with our partners, transparency, and a focus on results.
        </p>
        <h4>Effective teams</h4>
        <p>
          15–20 specialists in the agency.
          More than 30k tasks completed by team.
          Inside the company, we have shared the principles of teal companies and agile management.
          Professional and friendly relations.
        </p>
        <h4>It staff recruitment, adaptation and training</h4>
        <p>
          Hired and trained 30+ specialists.
          Was directly involved in the selection of IT personnel, interviews, and subsequent training.
          Many specialists have passed the way from junior to middle level, several reached a senior level and afterwards worked in large companies.
        </p>
        <h4>Conference Speaker</h4>
        <p>
          Was a speaker for marketing events at the RSTU university, at IT venues of the city, and for commercial organizations.
        </p>
        <h4>Top 10</h4>
        <p>
          The company consistently ranks among the top 10 internet marketing agencies in Russia in terms of service quality based on customer feedback. As well as in the top 10 companies for SEO in Russia in the budget segment.
          Maintained the profitability of the company throughout all 10 years.
        </p>
        <p>
          <a href="https://rocketbusiness.agency" target="_blank">
            Look at company website ›
          </a>
        </p>
      </div>
    </div>
    <div class="exp-block-right">
      <div ref="rbweb" class="rbweb-block block">
        <ExperienceRBWeb />
        <!-- <div class="exp-logos">
          <picture>
            <source :srcset="require(`~/assets/i/experience/rb-shot.jpg?sizes[]=1152&format=webp`).srcSet" type="image/webp">
            <img class="exp-logos-pic" width="1366" height="1002" :src="require(`~/assets/i/experience/rb-shot.jpg?resize&size=1152`)" alt="" loading="lazy">
          </picture>
        </div> -->
      </div>
      <div class="exp-block-br block">
        <div class="exp-gal">
          <picture>
            <source :srcset="require(`~/assets/i/experience/rb-team.jpg?sizes[]=1364&format=webp`).srcSet" type="image/webp">
            <img class="exp-gal-pic" width="1350" height="1398" :src="require(`~/assets/i/experience/rb-team.jpg?resize&size=1364`)" alt="" loading="lazy">
          </picture>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    this.handleScroll()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const node = this.$refs.rbweb as HTMLElement
      const rect = node.getBoundingClientRect()

      if ((rect.top > window.innerHeight) || (rect.top < -node.clientHeight)) {
        if (node.firstChild && (node.firstChild as HTMLElement).style.display !== 'none') {
          window.requestAnimationFrame(() => {
            if (node.firstChild) {
              (node.firstChild as HTMLElement).style.display = 'none'
            }
          })
        }
      } else if (node.style.display !== 'block') {
        window.requestAnimationFrame(() => {
          if (node.firstChild) {
            (node.firstChild as HTMLElement).style.display = 'block'
          }
        })
      }
    }
  }
})
</script>

<style lang="scss">
.rbweb-block {
  position: relative;
  flex-grow: 1;
  width: 100%;
}
</style>
