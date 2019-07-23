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
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding: 30px;
    .subtitle {
      color: $light-text-color;
    }
    .title {
      color: $reversed-text-color;
    }
    &.fill {
      background-color: $main-color;
      color: $text-color;
      .title {
        color: $text-color;
      }
    }
  }

</style>
