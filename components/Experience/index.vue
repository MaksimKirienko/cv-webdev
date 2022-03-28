<template>
  <section class="exp">
    <div id="experience" class="local-link" />
    <div class="exp-container container">
      <div class="exp-heading bl-pad">
        <h2>
          Experience
        </h2>
        <div class="h2-sub">
          Focus on business goals.
          Always keep in&nbsp;touch with my&nbsp;team and&nbsp;partners to achieve the best results possible
        </div>
      </div>
      <ExperienceIndividual />
      <ExperienceRB />
      <ExperienceOld />
    </div>
  </section>
</template>

<style lang="scss">
.exp {
  padding-top: 55px;
  padding-bottom: 65px;

  .h2-sub {
    max-width: 632px;
  }
}

@media(min-width: 768px) {
  .exp {
    padding-top: 110px;
    padding-bottom: 130px;
  }
}

.exp-heading {
  padding-bottom: 35px;
}

@media(min-width: 768px) {
  .exp-heading {
    padding-bottom: 70px;
  }
}

.exp-cols {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 55px;
}

@media(min-width: 768px) {
  .exp-cols {
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 110px;
  }
}

.exp-block-text {
  flex: 0 0 100%;
  margin-bottom: 40px;

  h3 {
    color: #F30092;
  }
}

.exp-block-right {
  flex: 0 0 100%;
}

@media(min-width: 768px) {
  .exp-block-text {
    flex: 0 0 calc(50% - 12.5px);
    margin-bottom: 0;
  }

  .exp-block-right {
    flex: 0 0 calc(50% - 12.5px);
    display: flex;
    flex-direction: column;
  }
}

.exp-block-tr {
  flex-grow: 1;
  display: flex;
  align-items: center;
  background: #fff;
}

.exp-block-br {
  margin-top: 40px;
}

.exp-logos-pic, .exp-gal-pic {
  display: block;
  width: 100%;
  height: auto;
}
</style>
