<template>
  <main>
    <section class="flex-grow-1 d-flex align-items-center">
      <div class="container text-center py-6 my-6">
        <h1 v-if="error.statusCode === 404">
          Page not found
        </h1>
        <h1 v-else>
          Error - {{ error.statusCode }}
        </h1>
        <h3 class="mt4">
          We have a lot of interesting, <a href="/">please look</a>.
        </h3>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'error', // you can set a custom layout for the error page
  props: {
    error: {
      type: Object,
      default: Function
    }
  },
  head() {
    return {
      title: `Ошибка - ${ this.error.statusCode }`
    }
  }
})
</script>
