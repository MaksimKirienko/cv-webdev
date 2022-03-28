<template>
  <section v-if="bgName" class="match-bg">
    <div v-if="!bgName.match(/\.svg/)" class="match-bg">
      <picture>
        <source :srcset="require(`~/assets/i/match/bg/${ bgName }.jpg?webp`)" type="image/webp">
        <img class="match-bg-pic" :src="require(`~/assets/i/match/bg/${ bgName }.jpg`)">
      </picture>
      <!-- <div class="match-bg-blur"></div> -->
    </div>
    <div v-if="bgName.match(/\.svg/)" class="match-bg">
      <img class="match-bg-pic" :src="require(`~/assets/i/match/bg/${ bgName }`)">
    </div>
  </section>
</template>

<script>
export default {
  props: {
    bgName: String,
    required: true
  }
}
</script>


<style lang="scss">
.match-bg, .match-bg-blur {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.match-bg-blur {
  backdrop-filter: blur(2px);
}

.match-bg-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  // background-image: url('~/assets/i/match/bg/lines.svg?inline');
  background-size: cover;
}
</style>
