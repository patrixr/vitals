<template>
  <div class="horizontal-container">
    <div class="transparent-card" v-for="item in items" :key="item.title">
      <div><fa-icon :icon="item.icon" size="2x"></fa-icon></div>
      <div class="title">{{ item.title }}</div>
      <div class="value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'horizontal-list',
  props: ['items']
}
</script>


<style lang="scss" scoped>
  @import "../styles/colors";
  @import "../styles/font-names";

  .horizontal-container {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    overflow-x: scroll;

    .transparent-card {
      line-height: 2rem;
      text-align: center;
      width: 7rem;
      height: 10rem;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      display: inline-block;
      margin-right: 1rem;
      padding: 1rem;
      padding-top: 2rem;

      &:first-child {
        margin-left: 7rem;
      }

      opacity: 0.9;

      .value {
        font-family: $base-font-bold;
        font-size: 1.6rem;
        margin-top: 1rem;
      }

      $colors-list: $third-color rgba(255, 255, 255, 0.3) $secondary-color;
      @for $i from 0 through 10 {
        &:nth-child(#{$i}) {
          background-color: nth($colors-list, 1 + $i % 3)
        }
      }
    }
  }

</style>
