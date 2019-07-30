<template functional>
  <div class="hearbeat">
    <fa-icon icon="heartbeat" size="4x" class="heart animated heartBeat"></fa-icon>
  </div>
</template>

<script>
export default {
  name: 'heart-beat',
}
</script>

<style lang="scss" scoped>
  @import "../styles/colors";

  .heart{
    color: $secondary-color;
    animation-iteration-count: infinite;
  }
</style>
