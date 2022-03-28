<template>
  <main>
    <MatchGame v-if="matchStarted" />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      meta_title: 'Maksim Kirienko CV',
      meta_description: 'Passionate Web Development. Please contact me to discuss your goals and projects, I’ll be glad to communicate 😁',
      meta_og: 'https://cv.zoy.one/assets/i/og.jpg',
      show3dCard: null as any,
      matchLevelData: {},
      matchStarted: false
    }
  },
  head(): object {
    return {
      title: this.meta_title,
      meta: [
        { hid: 'description', name: 'description', content: this.meta_description },
        { hid: 'og:url', property: 'og:url', content: 'https://cv.zoy.one' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:image', property: 'og:image', content: this.meta_og },
        { hid: 'og:title', property: 'og:title', content: this.meta_title },
        { hid: 'og:description', property: 'og:description', content: this.meta_description },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:image', name: 'twitter:image', content: this.meta_og },
        { hid: 'twitter:title', name: 'twitter:title', content: this.meta_title },
        { hid: 'twitter:description', name: 'twitter:description', content: this.meta_description }
      ],
      script: [
        { src: 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js', type: 'module' }
      ]
    }
  },
  mounted() {
    this.scrollHash()
    window.addEventListener('DOMContentLoaded', this.scrollHash)

    this.$store.commit('match/setSound', false)
    this.$store.commit('match/startLevel', 4)
    this.matchStarted = true
  },
  methods: {
    scrollHash() {
      if (window?.location.hash) {
        setTimeout(() => {
          const hashEl = document.querySelector(window.location.hash)

          if (hashEl) {
            const rect = hashEl.getBoundingClientRect()
            window.scrollTo({ top: rect.top + window.scrollY, behavior: 'smooth' })
          }
        }, 100)
      }
    }
  }
})
</script>
