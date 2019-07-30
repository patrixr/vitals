<template>
  <div class="vitals-card" :class="{ fill: fill }">
    <h3 class="subtitle"> {{ subtitle }} </h3>
    <h2 class="title"> {{ title }} </h2>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'vitals-card',
  props: ['fill', 'title', 'subtitle']
}
</script>


<style lang="scss" scoped>
  @import "../styles/colors";

  .vitals-card {
    color: $reversed-text-color;
    background-color: white;
    padding: 30px;
    padding-bottom: 50px;
    position: relative;

    &:not(:first-child) {
      margin-top: -20px;
    }

    .text-secondary, .subtitle {
      color: $light-text-color;
    }
    .text-main, .title {
      color: $reversed-text-color;
    }

    .text-main {
      font-size: 1.3rem;
    }

    .text-secondary {
      font-size: 0.9rem;
    }

    &:not(.fill) {
      border-radius: 20px;
      box-shadow: 0px 0px 12px 1px #444;
      z-index: 2;
    }
    &.fill {
      background-color: $main-color;
      color: $text-color;
      z-index: 1;
      .text-main, .title {
        color: $text-color;
      }
    }
  }

</style>
