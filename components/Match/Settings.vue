<template>
  <section class="settings">
    <MatchPageTop title="Настройки" />
    <div class="settings-inner">
      <div class="settings-profile">
        <NuxtLink to="/profile" >
          <Ava />
        </NuxtLink>
        <div class="settings-profile-right">
          <div class="settings-username">{{ nickname }}</div>
          <div class="settings-score">{{ points }}</div>
        </div>
      </div>
      <div class="settings-buttons">
        <NuxtLink class="settings-button" to="/profile" >Профиль</NuxtLink>
        <!-- <NuxtLink class="settings-button" to="#" >Лояльность</NuxtLink> -->
        <NuxtLink class="settings-button" to="/faq" >FAQ</NuxtLink>
        <a class="settings-button" href="#" @click="goSupport()">Техподдержка</a>
      </div>
      <div class="settings-content">
        &nbsp;
      </div>
    </div>
  </section>
</template>

<script>
import { sendAppMessage } from '~/scripts/Match2/lib.js'

export default {
  computed: {
    points() {
      return this.$store.state.match.profile.points ?? ''
    },
    nickname() {
      return this.$store.state.match.profile.nickname ?? ''
    },
  },
  mounted() {
    // gameAudio.play('music_menu')
  },
  methods: {
    goSupport() {
      sendAppMessage('Support')
    }
  }
}
</script>

<style lang="scss">
.settings {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// .ios {
//   .settings {
//     height: -webkit-fill-available;
//   }
// }

.settings-inner {
  position: relative;
  overflow: auto;
  padding: 20px 17px;
  box-sizing: border-box;
}

.settings-profile {
  display: flex;
  margin: 16px 0 36px 0;

  .ava {
    width: 108px;
    height: 108px;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 37px;
      height: 37px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.10);
      background-image: url('~/assets/i/match/icons/pen.svg?inline');
      background-position: center;
      background-size: 15px auto;
      background-repeat: no-repeat;
    }
  }
}

.settings-profile-right {
  max-width: calc(100% - 141px);
  flex-shrink: 1;
  padding-left: 26px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.settings-username {
  position: relative;
  height: 26px;
  font-weight: 800;
  font-size: 20px;
  line-height: 100%;
  color: #0C0A44;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
  }
}

.settings-score {
  font-weight: 900;
  font-size: 27px;
  line-height: 100%;
  letter-spacing: 0.045em;
  color: #26BF0D;
  background: -webkit-linear-gradient(#26BF0D, #A7DD0F);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.settings-buttons {
  display: flex;
  flex-direction: column;
}

.settings-button {
  position: relative;
  overflow: hidden;
  transition: height 0.5s ease-in-out;
  box-sizing: border-box;
  padding: 13px 17px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  margin: 3px 0;
  text-decoration: none;

  &::after {
    content: '';
    position: absolute;
    top: 18px;
    right: 22px;
    display: block;
    width: 6px;
    height: 6px;
    border-top: 2px solid #9D9D9D;
    border-right: 2px solid #9D9D9D;
    transform-origin: center;
    transition: transform 0.3s linear;
    transform: rotate(45deg);
  }
}

.settings-content {
  margin-top: 30px;
}

.settings-card {
  font-weight: 800;
  font-size: 16px;
  display: block;
  color: #00923A;
  text-decoration: none;

  &:hover {
    color: #00923A;
  }
}

.settings-card-text {
  margin: 0 0 14px 6%;
}

.settings-card-pic {
  width: 100%;
  height: auto;
}
</style>
