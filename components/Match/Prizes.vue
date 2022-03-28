<template>
  <section class="prizes">
    <!-- <MatchBlur />
    <DrawPrize /> -->
    <MatchPageTop title="Мои призы" :onBack="sendEvent" back="/">
      <div class="stars" slot="topRight">{{ stars }}</div>
    </MatchPageTop>
    <div class="prizes-list">
      <!-- <p>
        Действие акции закончилось, но призы доступны для использования
      </p> -->

      <div
        v-for="p in prizes"
        :key="'prizes-' + p.id"
        class="prizes-item"
      >
        <div v-if="p.preview_img" class="prizes-item-pic-container">
          <img :src="p.preview_img" class="prizes-item-pic" loading="lazy" />
          <!-- <img v-if="p.logo_img" :src="p.logo_img" class="prizes-item-logo" loading="lazy" /> -->
          <TimeLeft :timeTo="p.active_to"/>
          <!-- <div class="prizes-item-progress">
            Для открытия нужного уровня осталось 10 звезд
            <div class="prizes-item-progress-bar">
              <div class="prizes-item-progress-bar-inner" :style="{ width: '70%' }" />
            </div>
          </div> -->
        </div>
        <div class="prizes-item-main">
          <div class="prizes-item-content">
            <div class="prizes-item-title">{{ p.name }}</div>
            <div class="prizes-item-text" v-html="p.subtitle" />

            <div v-if="p.description && (p.description.length > 5)" class="prizes-item-prize-htext">
              <div
                class="prizes-item-prize-htext-title"
                :class="{ active: prizeTextOpened == p.id + '#1' }"
                @click="prizeTextOpened == p.id + '#1' ? prizeTextOpened = '' : prizeTextOpened = p.id + '#1'"
              >
                Подробнее
              </div>
              <div
                class="prizes-item-prize-htext-content"
                :class="{ active: prizeTextOpened == p.id + '#1' }"
                v-html="p.description"
              />
            </div>

            <div v-if="p.support && (p.support.length > 5)" class="prizes-item-prize-htext">
              <div
                class="prizes-item-prize-htext-title"
                :class="{ active: prizeTextOpened == p.id + '#2' }"
                @click="prizeTextOpened == p.id +'#2' ? prizeTextOpened = '' : prizeTextOpened = p.id + '#2'"
              >
                Поддержка
              </div>
              <div
                class="prizes-item-prize-htext-content"
                :class="{ active: prizeTextOpened == p.id + '#2' }"
                v-html="p.description"
              />
            </div>
            <div v-if="p.urinfo && (p.urinfo.length > 5)" class="prizes-item-prize-htext">
              <div
                class="prizes-item-prize-htext-title"
                :class="{ active: prizeTextOpened == p.id + '#3' }"
                @click="prizeTextOpened == p.id +'#3' ? prizeTextOpened = '' : prizeTextOpened = p.id + '#3'"
              >
                Юридическая информация
              </div>
              <div
                class="prizes-item-prize-htext-content"
                :class="{ active: prizeTextOpened == p.id + '#3' }"
                v-html="p.urinfo"
              />
            </div>

            <!-- <div
              v-if="p.id === currentTextOpened"
              class="prizes-item-description"
              v-html="p.description"
            /> -->
          </div>
          <!-- <img v-if="!p.preview_img && p.logo_img" :src="p.logo_img" class="prizes-item-logo" /> -->
        </div>
        <div class="prizes-item-bottom">
          <div class="prizes-item-buttons">
            <NuxtLink v-if="!p.open" to="/" class="btn btn-red">
              Продолжить играть
            </NuxtLink>

            <div v-if="((p.type === 'promocode') || (p.type === 'coupon')) && p.coupon && p.open" class="prizes-item-promocode">
              <Coupon :promoType="p.type" :code="p.coupon" />
            </div>
            <div v-if="p.type === 'barcode' && p.coupon && p.open" class="prizes-item-barcode">
              <div
                class="btn btn-orange"
                @click="toggleBarcode(p.id)"
              >
                {{ currentBarcodeOpened == p.id ? 'Скрыть' : 'Открыть' }} штрих-код
              </div>
              <Coupon
                v-if="currentBarcodeOpened == p.id"
                :promoType="p.type"
                :code="p.coupon"
                :barcodeFormat="typeof p.format !== 'undefined' ? p.format : ''" />
            </div>
            <!-- <a v-if="p.link && p.btn_text && p.open" :href="p.link" target="_blank" class="btn btn-violet">{{ p.btn_text }}</a> -->
            <div
              v-if="p.link && p.btn_text && p.open" :href="p.link"
              @click="giftUse(p.id); goLink(p.link, p.event)"
              class="btn btn-violet">
              {{ p.btn_text }}
            </div>
          </div>
        </div>
        <!-- <div
          class="prizes-item-readmore"
          @click="toggleText(p.id)"
          :class="{ active: p.id === currentTextOpened }"
        /> -->
      </div>
    </div>
  </section>
</template>

<script>
import { apiGetGifts, apiSendGiftUse } from '~/scripts/Match2/api/api.js'
import { sendAppMessage } from '~/scripts/Match2/lib.js'

export default {
  data() {
    return {
      currentTextOpened: -1,
      currentBarcodeOpened: -1,
      prizeTextOpened: '',
      prizes: []
    }
  },
  computed: {
    stars() {
      return this.$store.state.match.profile.stars ?? ''
    },
    token() {
      return this.$store.state.match.token
    },
    pending: {
      get() {
        return window?.pending?.gifts
      },
      set(val) {
        if (!window) {
          return false
        }
        if (typeof window.pending === 'undefined') {
          window.pending = {}
        }
        window.pending.gifts = val
      }
    }
  },
  mounted() {
    this.getPrizes()
  },
  methods: {
    toggleBarcode(pID) {
      if (this.currentBarcodeOpened == pID) {
        this.currentBarcodeOpened = -1
      } else {
        this.giftUse(pID);
        this.currentBarcodeOpened = pID
      }
    },
    giftUse(giftId) {
      apiSendGiftUse(this.token, giftId)
    },
    goLink(link, event = '') {
      if (event && event.trim()) {
        sendAppMessage(event.trim())
      }
      this.$store.commit('match/setLeaveLink', link)
    },
    sendEvent() {
      // iOS
      window?.webkit?.messageHandlers?.close?.postMessage('Prizes_close')

      // android
      if (typeof window.close?.postMessage !== 'undefined') {
        window.close?.postMessage('Prizes_close')
      }
    },
    toggleText(id) {
      id === this.currentTextOpened ? this.currentTextOpened = -1 : this.currentTextOpened = id
    },
    getPrizes() {
      if (!this.token || this.pending) {
        return
      }

      this.pending = true

      apiGetGifts(this.token)
      .then(data => {
        this.pending = false

        if (data) {
          this.prizes = data
        }
      })
      .catch((e) => {
        this.pending = false
        this.$store.commit('match/setServerError', e)
      })
    },
  }
}
</script>

<style lang="scss">
.prizes {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #F8F8F8;
}

// .ios {
//   .prizes {
//     height: -webkit-fill-available;
//   }
// }

.prizes-list {
  overflow: auto;
  box-sizing: border-box;
  padding: 10px 11px;
}

.prizes-item {
  position: relative;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  padding: 8px 7px 7px 7px;
  box-sizing: border-box;
  margin: 9px 0;
}

.prizes-item-pic-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 7px;

  // &::after {
  //   content: '';
  //   position: absolute;
  //   width: 100%;
  //   height: 100%;
  //   left: 0;
  //   top: 0;
  //   background: linear-gradient(180deg, rgba(97, 97, 97, 0) 43.75%, #333 100%);
  // }

  .time-left {
    position: absolute;
    right: 8px;
    top: 8px;
  }

  .prizes-item-logo {
    position: absolute;
    left: 4px;
    top: 4px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
}

.prizes-item-pic {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.prizes-item-main {
  display: flex;

  .prizes-item-logo {
    width: 60px;
    height: 60px;
    margin-left: 20px;
    object-fit: contain;
    flex-shrink: 0;
    border-radius: 50%;
  }
}

.prizes-item-progress {
  position: absolute;
  bottom: 7px;
  left: 3%;
  width: 94%;
  font-size: 13px;
  line-height: 120%;
  color: #fff;
  z-index: 2;
}

.prizes-item-progress-bar {
  position: relative;
  height: 7px;
  margin-top: 4px;
  background: rgba(215, 215, 215, 0.3);
  border-radius: 14px;
}

.prizes-item-progress-bar-inner {
  height: 100%;
  background: linear-gradient(151.14deg, #26BF0D -1.64%, #A7DD0F 105.06%);
  border-radius: 14px;
}

.prizes-item-content {
  flex-grow: 1;
}

.prizes-item-title {
  font-weight: 800;
  font-size: 15px;
  color: #000;
}

.prizes-item-text {
  font-weight: 400;
  font-size: 15px;
  color: #000;
  margin-top: 4px;
}

.prizes-item-description {
  font-weight: 400;
  font-size: 16px;
  color: #000;
  margin-top: 8px;
  word-break: break-word;
}

.prizes-item-bottom {
  display: flex;
  align-items: center;
  margin-top: 9px;
}

.prizes-item-buttons {
  flex-grow: 1;
  // padding-right: 30px;
  vertical-align: bottom;

  .btn {
    font-size: 13px;
    padding: 7px 12px;
    border-radius: 7px;
    margin: 4px 5px 4px 0;

    &:last-child {
      margin-right: 0;
    }
  }
}

.prizes-item-promocode {
  display: inline-block;
  margin: 4px 0;
  vertical-align: bottom;

  .coupon {
    width: 154px;
    height: 27px;
    padding: 2% 6%;
    border-radius: 7px;
  }
  .coupon-text {
    height: 16px;
    font-size: 13px;
  }
  .coupon-copytext {
    height: 27px;
    font-size: 13px;
  }
}

.prizes-item-barcode {
  .coupon {
    width: 100%;
  }
}

.prizes-item-readmore {
  position: absolute;
  right: 10px;
  bottom: 12px;
  width: 20px;
  height: 20px;

  &::after {
    content: '';
    // position: absolute;
    // top: 5px;
    // right: 6px;
    display: block;
    width: 6px;
    height: 6px;
    border-bottom: 2px solid #333;
    border-right: 2px solid #333;
    transform-origin: center;
    transition: transform 0.3s linear;
    transform: rotate(45deg);
  }

  &.active::after {
    transform: scaleY(-1) rotate(45deg);
  }
}

.prizes-item-prize-htext-title {
  position: relative;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin: 8px 0;

  &::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 6px;
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
    transform: rotate(-45deg);
  }
}

.prizes-item-prize-htext-content {
  position: relative;
  max-height: 0;
  overflow: hidden;
  font-size: 13px;
  color: #878786;
  transition: max-height 0.5s ease-in-out;
  word-break: break-word;

  &.active {
    max-height: 3500px;
  }
}
</style>
