<template>
  <section class="profile">
    <MatchPageTop title="Профиль" :onBack="forgotToSave" back="/settings" />

    <div class="profile-scroll">
      <div ref="profileColor" class="profile-color swiper-container">
        <div class="swiper-wrapper">
          <div
            v-for="(bg, index) in bgs"
            :key="index"
            class="swiper-slide"
            :class="{ active: activeBg == index }"
            @click="activeBg = index"
          >
            <Ava :bgId="index" />
          </div>
        </div>
        <div ref="benfSwiperPagination" class="swiper-pagination" />
      </div>

      <div ref="profilePic" class="profile-pic swiper-container">
        <div class="swiper-wrapper">
          <div
            v-for="pic in 6"
            :key="pic"
            class="swiper-slide"
            :class="{ active: activePic == pic - 1 }"
            @click="activePic = pic - 1"
          >
            <Ava :bgId="activeBg" :picId="pic - 1" />
          </div>
        </div>
        <div ref="benfSwiperPagination" class="swiper-pagination" />
      </div>

      <div class="profile-content">
        <div class="profile-info">
          Введи логин, чтобы он&nbsp;отображался в&nbsp;рейтинге
        </div>
        <div class="profile-subtitle">
          Логин
        </div>
        <div class="profile-input-container">
          <input
            v-model="uname"
            type="text"
            class="profile-uname profile-input"
            maxlength="20"
            @keydown="nameError = false; nameErrorUnacceptable = false; nameErrorTaken = false"
          />
        </div>
        <div v-if="nameError" class="profile-uname-error profile-error">
          Имя должно быть от 3 до 20 символов в длину и состоять только из букв и цифр
        </div>
        <div v-if="nameErrorUnacceptable" class="profile-uname-error profile-error">
          Данное имя недопустимо
        </div>
        <div v-if="nameErrorTaken" class="profile-uname-error profile-error">
          Имя пользователя уже занято
        </div>

        <div class="profile-info">
          Почта нужна, чтобы на нее прислали данные по&nbsp;выигрышам
        </div>
        <div class="profile-subtitle">
          Почта
        </div>
        <div class="profile-input-container" :class="{ valid: emailValid }">
          <input
            v-model="email"
            type="text"
            class="profile-email profile-input"
            @keydown="emailError = false; emailErrorNotValid = false; emailErrorTaken = false;"
          >
        </div>
        <div v-if="emailError" class="profile-uname-error profile-error">
          Пожалуйста, проверьте email
        </div>
        <div v-if="emailErrorNotValid" class="profile-uname-error profile-error">
          Пожалуйста, проверьте email
        </div>
        <div v-if="emailErrorTaken" class="profile-uname-error profile-error">
          Данный email уже используется другим пользователем
        </div>

        <div class="profile-buttons">
          <div ref="saveBtn" class="profile-save-btn btn btn-green" @click="saveProfile()">
            <div class="lds-dual-ring" />
            Сохранить
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BGS from '~/scripts/Match2/bgs.json'
import { Swiper } from 'swiper/bundle'
import { validateEmail } from '~/scripts/Match2/lib.js'
import { apiSaveProfile } from '~/scripts/Match2/api/api.js'


export default {
  data() {
    return {
      uname: '',
      nameValid: false,
      nameError: false,
      nameErrorUnacceptable: false,
      nameErrorTaken: false,
      email: '',
      emailValid: true,
      emailError: false,
      emailErrorNotValid: false,
      emailErrorTaken: false,
      bgs: BGS.bgs,
      swiperColor: null,
      swiperPic: null,
      activeBg: 1,
      activePic: 1,
      saved: false
    }
  },
  watch: {
    activePic(val) {
      this.swiperPic.slideTo(val)
    },
    activeBg(val) {
      this.swiperColor.slideTo(val)
    },
    uname(val) {
      const nameRegExp = /^([a-zA-Zа-яА-я0-9\:\;\)\(\_\-\. ]|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/
      this.nameValid = nameRegExp.test(this.uname) && (this.uname.length > 3) && (this.uname.length <= 20)

      // debug
      if (val === 'screen-test') {
        this.$router.push('/screen-test')
      }
    },
    email(val) {
      this.email = this.email.trim()
      this.emailValid = validateEmail(val) || !val
    }
  },
  computed: {
    nickname() {
      return this.$store.state.match.profile.nickname ?? ''
    },
    userMail() {
      return this.$store.state.match.profile.email ?? ''
    },
    profile() {
      return this.$store.state.match.profile
    },
    token() {
      return this.$store.state.match.token
    },
    avatar() {
      const avatar = this.$store.state.match.profile?.avatar ?? ''
      return avatar ? avatar : '0#27'
    }
  },
  updated() {
    if (this.swiperColor) {
      this.swiperColor.update()
    }
    if (!this.swiperPic) {
      this.swiperPic.update()
    }
  },
  unmounted() {
    if (this.swiperColor) {
      this.swiperColor.destroy()
    }
    if (!this.swiperPic) {
      this.swiperPic.destroy()
    }
  },
  destroyed() {
    if (this.swiperColor) {
      this.swiperColor.destroy()
    }
    if (!this.swiperPic) {
      this.swiperPic.destroy()
    }
  },
  mounted() {
    const ava = this.avatar.split('#')
    this.activePic = parseInt(ava[0])
    this.activeBg = parseInt(ava[1])

    this.uname = this.nickname
    this.email = this.userMail

    if (!this.swiperColor) {
      this.swiperColor = new Swiper(this.$refs.profileColor, {
        slidesPerView: 'auto',
        spaceBetween: 0,
        centeredSlides: true,
        initialSlide: this.activeBg
      })
    }

    if (!this.swiperPic) {
      this.swiperPic = new Swiper(this.$refs.profilePic, {
        slidesPerView: 'auto',
        spaceBetween: 0,
        centeredSlides: true,
        initialSlide: this.activePic
      })
    }
  },
  methods: {
    forgotToSave() {
      if (!this.saved) {
        this.saveProfile()
      }
    },
    saveProfile() {
      if (!this.emailValid || !this.nameValid) {
        if (!this.emailValid) {
          this.emailError = true
        }
        if (!this.nameValid) {
          this.nameError = true
        }
        return
      }

      this.$refs?.saveBtn?.classList.add('active')

      apiSaveProfile(this.token, `${ this.activePic }#${ this.activeBg }`, this.uname.trim(), this.email)
      .then((data) => {
        if (data && data.level) {
          this.$store.commit('match/setProfile', data)
        }

        if (Array.isArray(data.errors?.nickname) && data.errors?.nickname.length) {
          data.errors?.nickname.forEach(e => {
            if (e == 'Not acceptable.') {
              this.nameErrorUnacceptable = true
            }
            if (e == 'The nickname has already been taken.') {
              this.nameErrorTaken = true
            }
          });
        }

        if (Array.isArray(data.errors?.email) && data.errors?.email.length) {
          data.errors?.email.forEach(e => {
            if (e == 'The email must be a valid email address.') {
              this.emailErrorNotValid = true
            }
            if (e == 'The email has already been taken.') {
              this.emailErrorTaken = true
            }
          });
        }

        this.saved = true

        this.$refs?.saveBtn?.classList.remove('active')
        this.$refs?.saveBtn?.classList.add('saved')
        setTimeout(() => {
          this.$refs?.saveBtn?.classList.remove('saved')
        }, 2000)
      })
      .catch((e) => {
        this.$store.commit('match/setServerError', e)
        this.$refs?.saveBtn?.classList.remove('active')
      })
    }
  }
}
</script>

<style lang="scss">
.profile {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// .ios {
//   .profile {
//     height: -webkit-fill-available;
//   }
// }

.profile-scroll {
  overflow: auto;
}

.profile-color {
  width: 100%;
  margin-top: 20px;

  .ava {
    width: 42px;
    height: 42px;
    padding: 14px;
    display: inline-block;
    will-change: transform;
    transform: scale(1);
  }

  .swiper-slide {
    height: unset;
    width: unset;
  }

  .swiper-slide.active .ava {
    transform: scale(1.4);
  }
}

.profile-pic {
  width: 100%;
  margin-top: 20px;

  .ava {
    width: 42px;
    height: 42px;
    margin: 10px;
    display: inline-block;
    will-change: transform;
    transform: scale(1);
    border: 2px solid transparent;
  }

  .swiper-slide {
    width: unset;
  }

  .swiper-slide.active .ava {
    transform: scale(1.4);
    border: 2px solid rgba(0, 0, 0, 0.7);
  }
}

.profile-content {
  padding: 16px 20px 20px 20px;
}

.profile-info {
  margin: 18px 0;
  background: #F5F5F5;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  color: #777;
  padding: 8px 22px;
  box-sizing: border-box;
}

.profile-subtitle {
  font-weight: 800;
  font-size: 16px;
  color: #0C0A44;
}

.profile-input-container {
  position: relative;
  border-bottom: 1px solid #bbb;

  &.valid {
    padding-right: 30px;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      bottom: 6px;
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #67CF0E;
      background-image: url('~/assets/i/match/icons/v.svg?inline');
      background-size: 10px auto;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
}

.profile-input {
  width: 100%;
  font-size: 18px;
  color: #0C0A44;
  border: unset;
  border-radius: unset;
  padding-left: 0;
  margin-top: 12px;
  outline: none;
}

.profile-buttons {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.profile-uname-error {
  margin-top: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #F79016;
}

.profile-save-btn {
  width: 180px;
  height: 56px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .lds-dual-ring {
    display: none;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    vertical-align: bottom;

    &::after {
      width: 14px;
      height: 14px;
    }
  }

  &.active {
    pointer-events: unset;

    .lds-dual-ring {
      display: inline-block;
    }
  }

  &.saved {
    pointer-events: unset;

    &::before {
      content: '';
      display: inline-block;
      vertical-align: bottom;
      width: 20px;
      height: 20px;
      margin-right: 10px;
      background-image: url('~/assets/i/match/icons/v.svg?inline');
      background-size: 20px auto;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
}
</style>
