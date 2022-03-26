<template>
  <section class="hard">
    <div id="skills" class="local-link" />
    <div class="hard-container container">
      <div class="exp-heading bl-pad">
        <h2>
          Hard Skills
        </h2>
        <div class="h2-sub">
          Responsiveness, mobile first, stability.<br>
          Animation, graphics and gamificaion.
        </div>
      </div>
      <div class="hard-grid">
        <div class="hard-cell-fox">
          <div class="hard-fox-wrapper">
            123
            <model-viewer
              class="hard-fox"
              :src="'/assets/3d/Fox.glb'"
              camera-controls
              disable-zoom
              autoplay
              background-color="transparent"
              camera-orbit="40deg 90deg 550m"
              camera-target="0 0 0"
              data-js-focus-visible
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.hard {
  padding-top: 55px;
  padding-bottom: 55px;
  color: #fff;

  .h2-sub {
    max-width: 632px;
  }
}

@media(min-width: 768px) {
  .hard {
    padding-top: 110px;
    padding-bottom: 110px;
  }
}

.hard-grid {
  display: grid;
}

@media (min-width: 768px) {
  .hard-grid {
    grid-template-columns: 1fr 1fr;
    grid-gap: 25px;
  }
}

.hard-fox-wrapper {
  position: relative;
  padding-bottom: 140%;
}

.hard-fox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  outline: none !important;
  outline-width: 0 !important;
  user-select: none;

  --poster-color: rgba(0, 0, 0, 0);
  --progress-mask: rgba(0, 0, 0, 0);
}
</style>
