<template>
  <div>
    <vitals-card :title="user.displayName" subtitle="Vitals" :fill="true">
      <heart-beat></heart-beat>
    </vitals-card>
  </div>
</template>

<script>
import VitalsCard from '../components/Card';
import HeartBeat from '../components/HeartBeat';
import { mapGetters } from 'vuex';

export default {
  name: 'landing',
  components: { VitalsCard, HeartBeat },
  methods: {
    pollData() {
      this.$store.dispatch('pollData')
        .catch(e => console.error(e));
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    this.pollData();
    this.$store.dispatch('fetchUser');
    this.polling = setInterval(() => this.pollData(), 5*60*1000);
  },
  beforeDestroy () {
    clearInterval(this.polling)
  }
}
</script>

<style lang="scss" scoped>

</style>

