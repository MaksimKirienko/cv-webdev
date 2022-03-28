<template>
  <section class="faq">
    <MatchPageTop title="FAQ" back="/settings" />
    <div class="faq-list">
      <div
        v-for="q in faq"
        :key="q.id"
        class="faq-item"
        :class="{ active: currentQuestion == q.id }"
        @click="toggleActive(q.id)"
      >
        <div class="faq-item-title">{{ q.question }}</div>
        <div class="faq-item-inner">
          <div class="faq-item-text" v-html="q.answer"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { apiGetFaq } from '~/scripts/Match2/api/api.js'

export default {
  data() {
    return {
      currentQuestion: -1,
      faq: []
    }
  },
  watch: {
    token() {
      if (!this.faq || !this.faq.length) {
        this.getFaq()
      }
    }
  },
  computed: {
    token() {
      return this.$store.state.match.token
    }
  },
  mounted() {
    // gameAudio.play('music_menu')

    if (!this.faq || !this.faq.length) {
      this.getFaq()
    }
  },
  methods: {
    getFaq() {
      if (!this.token) {
        return
      }
      apiGetFaq(this.token)
      .then(data => {
        if (data && data.length) {
          this.faq = data
        }
      })
      .catch((e) => {
        this.$store.commit('match/setServerError', e)
      })
    },
    toggleActive(index) {
      if (index !== this.currentQuestion) {
        this.currentQuestion = index
      } else {
        this.currentQuestion = -1
      }
    }
  }
}
</script>

<style lang="scss">
.faq {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// .ios {
//   .faq {
//     height: -webkit-fill-available;
//   }
// }

.faq-list {
  overflow: auto;
  box-sizing: border-box;
  padding: 20px 15px;
}

.faq-item {
  position: relative;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
  box-sizing: border-box;
  padding: 13px 17px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  margin: 10px 0;

  &::after {
    content: '';
    position: absolute;
    top: 18px;
    right: 22px;
    display: block;
    width: 6px;
    height: 6px;
    border-bottom: 2px solid #9D9D9D;
    border-right: 2px solid #9D9D9D;
    transform-origin: center;
    transition: transform 0.3s linear;
    transform: rotate(45deg);
  }

  &.active::after {
    transform: scaleY(-1) rotate(45deg);
  }
}

.faq-item-inner {
  position: relative;
  max-height: 0;
  transition: max-height 0.4s ease-in-out;
  overflow: hidden;
}

.faq-item.active .faq-item-inner {
  max-height: 1000px;
}

.faq-item-title {
  font-weight: 600;
  font-size: 18px;
  color: #000;
  margin-right: 22px;
}

.faq-item-text {
  padding-top: 10px;
  font-size: 16px;
  line-height: 20px;
  color: #7B7B7B;
}
</style>
