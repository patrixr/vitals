<template>
  <div v-if="loaded">
    <!-- Current heartrate -->
    <vitals-card :title="user.displayName" subtitle="Vitals" :fill="true">
      <spacing></spacing>
      <div class="text-center">
        <heart-beat></heart-beat>
      <div>
      <spacing></spacing>
      <div class="text-main text-center">
        {{ lastHeartRate.value }} bpm
      <div>
      <div class="text-secondary text-center">
        as of {{ lastUpdate | timeSince }}
      <div>
    </vitals-card>

    <!-- Heart history -->
    <vitals-card title="Heart Rate" subtitle="Historical" :fill="false">
      <trend
        :data="heartBeatDataPoints"
        :gradient="['#FB0650', '#024CFE', '#29C4F1']"
        auto-draw
        smooth
      >
      </trend>
      <div class="text-light text-right text-tiny">
        recorded over the last {{ heartHistoryDuration }} hours
      </div>
      <spacing></spacing>
    </vitals-card>

    <!-- BODY -->
    <vitals-card title="Body" subtitle="Stats" :fill="true">
      <body-stats></body-stats>
    </vitals-card>
  </div>
</template>

<script>
import VitalsCard from '../components/Card';
import HeartBeat from '../components/HeartBeat';
import BodyStats from '../components/BodyStats';
import { mapGetters } from 'vuex';
import _ from 'lodash';

export default {
  name: 'landing',
  components: { VitalsCard, HeartBeat, BodyStats },
  methods: {
    pollData() {
      this.$store.dispatch('pollData')
        .catch(e => console.error(e));
    }
  },
  computed: {
    ...mapGetters([
        'user', 'lastHeartRate', 'lastUpdate',
        'heartbeatHistory', 'heartHistoryDuration'
      ]),

    loaded() {
      return !!this.lastHeartRate;
    },
    heartBeatDataPoints() {
      return _.map(this.heartbeatHistory, p => p.value)
    }
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

