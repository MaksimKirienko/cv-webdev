<template>
  <section class="nav-bar" :class="{ scrolled, expanded }">
    <div class="nav-container container">
      <NuxtLink to="/" class="nav-bar-title">
        Maksim Kirienko
      </NuxtLink>
      <div class="nav-bar-menu">
        <div class="nav-toggle" :class="{ expanded }" @click="expanded = !expanded">
          <div class="nav-toggle-bar" />
        </div>
        <div class="menu-overlay" :class="{ expanded }" @click="expanded = false" />
        <nav class="menu" :class="{ expanded }">
          <ul class="menu-list" @click="expanded = false">
            <li><a href="/#experience">Experience</a></li>
            <li><a href="/#education">Education</a></li>
            <li><a href="/#skills">Skills</a></li>
            <li class="menu-clink">
              <a href="/#contacts">Contacts</a>
            </li>
          </ul>
        </nav>
        <a class="menu-btn" href="/#contacts">Contacts</a>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      expanded: false,
      scrolled: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    this.handleScroll()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      if (window?.scrollY > 300) {
        this.scrolled = true
      } else {
        this.scrolled = false
      }
    }
  }
})
</script>

<style lang="scss">
.nav-bar {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 99;
  will-change: opacity;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.55);
  border-bottom: 1px solid #ddd;
  backdrop-filter: blur(18px);

  &.scrolled {
    position: fixed;
    opacity: 1;
  }

  &.expanded {
    backdrop-filter: none;
  }
}

.nav-container {
  max-width: 1155px;
  height: 52px;
  display: flex;
  align-items: center;
  // background: green;
}

@media (min-width: 992px) {
  .nav-container {
    align-items: center;
  }
}

.nav-bar-title {
  font-size: 19px;
  pointer-events: all;
  color: #000;
  text-decoration: none;

  &:hover {
    color: #000;
    text-decoration: none;
  }
}

@media (min-width: 576px) {
  .nav-bar-title {
    font-size: 21px;
  }
}

.nav-bar-menu {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  pointer-events: auto;
  padding-right: 60px;
  box-sizing: border-box;
}

@media (min-width: 375px) {
  .nav-bar-menu {
    padding-right: 80px;
  }
}

.nav-toggle {
  position: fixed;
  width: 26px;
  height: 20px;
  right: 21px;
  top: 17px;
  user-select: none;
  cursor: pointer;
  z-index: 103;
  pointer-events: auto;
}

@media (min-width: 992px) {
  .nav-toggle {
    display: none;
  }
}

.nav-toggle-bar, .nav-toggle-bar::after, .nav-toggle-bar::before {
  position: absolute;
  top: calc(50% - 1px);
  transition: transform, margin 0.5s ease;
  background: #000;
  height: 2px;
  border-radius: 2px;
  width: 100%;
}

.nav-toggle-bar {
  &::after {
    content: '';
    margin-top: 8px;
  }
  &::before {
    content: '';
    margin-top: -8px;
  }
}

.expanded .nav-toggle-bar {
  background: transparent;
  border: 0;

  &::after {
    background-color: #fff;
    margin-top: 0;
    transform: rotate(45deg);
  }
  &::before {
    background-color: #fff;
    margin-top: 0;
    transform: rotate(-45deg);
  }
}

.menu-overlay {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 101;
  background: #000;
  backdrop-filter: blur(5px);
  display: none;

  &.expanded {
    display: block;
    animation: show-overlay 0.7s ease-in-out forwards;
  }
}

@keyframes show-overlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.3;
  }
}

.menu {
  position: fixed;
  top: 0;
  right: -361px;

  &.expanded {
    right: 0;
  }

  width: 85vw;
  max-width: 340px;
  min-width: 300px;
  height: 100vh;
  // background: linear-gradient(195.43deg, #EE2CFF 9.52%, #C70261 90.48%);
  background: linear-gradient(-15deg, #0087D2 10.66%, #006AE5 90.81%);
  font-size: 1rem;
  transition: right 0.3s ease;
  z-index: 102;

  a {
    text-decoration: none;
    color: white;

    &:hover {
      color: white;
    }
  }
}

@media (min-width: 992px) {
  .menu {
    background: transparent;
    position: static;
    width: unset;
    min-width: unset;
    max-width: unset;
    height: unset;
    margin-right: 25px;

    a {
      font-weight: 300;
      color: #000000;

      &:hover {
        color: #000000;
      }
    }
  }
}

.menu-list {
  margin: 0;
  padding: 70px 20px 40px 35px;
  display: block;
  list-style-type: none;

  li {
    margin: 20px 0;
  }
}

@media (min-width: 992px) {
  .menu-list {
    display: flex;
    padding: 0;
  }
  .menu-list li {
    display: flex;
      align-items: center;
    margin: 0;
    padding: 0 25px;
  }
}

@media (min-width: 992px) {
  .menu-list .menu-clink {
    display: none;
  }
}

a.menu-btn {
  justify-self: flex-end;
  display: inline-block;
  background-color: #006AE6;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 100%;
  font-weight: 300;
  text-decoration: none;
  color: #fff;
  padding: 6px 16px;
  transition: background-color 0.25s ease-in-out;

  &:hover {
    color: #fff;
    background-color: #107AF6;
  }
}
</style>
