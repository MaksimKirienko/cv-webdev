<template>
  <section class="main-stats">
    <div class="main-stats-profile">
      <div class="main-stats-ava">
        <Ava />
      </div>
      <div class="main-stats-username">{{ profile.nickname }}</div>
      <div class="main-stats-score">{{ points }}</div>
    </div>
    <div class="stars main-stats-stars">{{ stars }}</div>
    <div class="lives main-stats-lives">{{ attempts }}</div>
  </section>
</template>

<script>
export default {
  computed: {
    attempts() {
      return this.$store.state.match.profile.attempts ?? ''
    },
    stars() {
      return this.$store.state.match.profile.stars ?? ''
    },
    points() {
      return this.$store.state.match.profile.points ?? ''
    },
    nickname() {
      return this.$store.state.match.profile.nickname ?? ''
    },
    profile() {
      return this.$store.state.match.profile
    }
  }
}
</script>

<style lang="scss">
.main-stats {
  position: absolute;
  left: 0;
  top: 0;
  height: 180px;
  width: 100%;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: linear-gradient(0deg, rgba(140, 140, 140, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
    z-index: 899;
  }
}

.main-stats-profile {
  position: absolute;
  left: 31px;
  top: 37px;
  max-width: calc(100% - 160px);
  background: #fff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  padding: 5px 13px 3px 37px;
  box-sizing: border-box;
  z-index: 900;
}

@media (min-height: 640px) {
  .main-stats-profile {
    top: 47px;
  }
}

@media (min-height: 740px) {
  .main-stats-profile {
    top: 57px;
  }
}

.main-stats-ava {
  position: absolute;
  top: -12px;
  left: -16px;
  width: 41px;
  height: 41px;
  border-radius: 50%;
  border: 4px solid #fff;
}

.main-stats-username {
  position: relative;
  display: block;
  height: 19px;
  font-style: normal;
  font-weight: 800;
  font-size: 17px;
  line-height: 100%;
  color: #0C0A44;
  overflow: hidden;
  box-sizing: border-box;
  padding-right: 4px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  }
}

.main-stats-score {
  display: block;
  margin-top: 2px;
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

.main-stats-stars, .main-stats-lives {
  position: absolute;
  right: 18px;
  z-index: 900;
}

.main-stats-stars {
  top: 43px;
}

.main-stats-lives {
  top: 88px;
}

@media (min-height: 640px) {
  .main-stats-stars {
    top: 53px;
  }

  .main-stats-lives {
    top: 98px;
  }
}

@media (min-height: 740px) {
  .main-stats-stars {
    top: 63px;
  }

  .main-stats-lives {
    top: 108px;
  }
}
</style>
