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
      <div class="trend-container">
        <trend
          :data="heartBeatDataPoints"
          :gradient="['#FB0650', '#024CFE', '#29C4F1']"
          auto-draw
          smooth
        >
        </trend>
        <div class="time-indicator right">{{ lastHeartRate.time | truncateSeconds }}</div>
        <div class="time-indicator left">{{ firstHeartRate.time | truncateSeconds }}</div>
      </div>
      <div class="text-light text-right text-tiny">
        recorded over the last {{ heartHistoryDuration }} hours
      </div>
      <spacing></spacing>
    </vitals-card>

    <!-- BODY -->
    <vitals-card title="Body" subtitle="Stats" :fill="true">
      <!-- <body-stats></body-stats> -->
      <horizontal-list :items="bodyStats"></horizontal-list>

    </vitals-card>

    <!-- Weight -->
    <vitals-card title="Weight" subtitle="Historical" :fill="false">
      <div class="trend-container">
        <trend
          :data="weightDataPoints"
          :gradient="['#FB0650', '#024CFE', '#29C4F1']"
          auto-draw
          smooth
        >
        </trend>
        <div class="time-indicator right">{{ oldestBodyRecord.date }}</div>
        <div class="time-indicator left">{{ body.date }}</div>
      </div>
    </vitals-card>

    <!-- Activity -->
    <vitals-card title="Activity" subtitle="Today" :fill="true">
      <horizontal-list :items="activityStats"></horizontal-list>
    </vitals-card>
  </div>
</template>

<script>
  import VitalsCard         from '../components/Card';
  import HeartBeat          from '../components/HeartBeat';
  import HorizontalList     from '../components/HorizontalList';
  import { mapGetters }     from 'vuex';
  import _                  from 'lodash';

  function mapBy(name, key) {
    return function () {
      return _.map(this[name], o => _.get(o, key));
    }
  }

  export default {
    name: 'landing',
    components: {
      VitalsCard,
      HeartBeat,
      HorizontalList
    },
    methods: {
      pollData() {
        this.$store
          .dispatch('fetchAll')
          .catch(console.error);
      }
    },
    computed: {
      ...mapGetters([
        'user', 'lastHeartRate', 'firstHeartRate',
        'lastUpdate', 'heartbeat',
        'heartHistoryDuration', 'bodyHistory',
        'body', 'oldestBodyRecord', 'stats',
        'distances'
      ]),

      loaded() {
        return !!this.lastHeartRate;
      },

      heartBeatDataPoints: mapBy('heartbeat', 'value'),
      weightDataPoints: mapBy('bodyHistory', 'weight'),

      bodyStats() {
        return [
          { icon: 'weight', title: 'Weight', value: this.body.weight + ' kg' },
          { icon: 'percent', title: 'Fat', value: this.body.fat.toFixed(1) },
          { icon: 'chart-bar', title: 'BMI', value: this.body.bmi }
        ]
      },

      activityStats() {
        return [
          { icon: 'shoe-prints', title: 'Steps', value: this.stats.steps },
          { icon: 'burn', title: 'Calories', value: this.stats.caloriesOut },
          {
            icon: 'running',
            title: 'Active Minutes',
            value: this.stats.lightlyActiveMinutes
              + this.stats.fairlyActiveMinutes
              + this.stats.veryActiveMinutes
          },
          {
            icon: 'route',
            title: 'Distance',
            value: _.find(this.distances, ['activity', 'total']).distance + ' km'
          }
        ]
      }
    },
    created() {
      this.pollData();
      this.polling = setInterval(() => this.pollData(), 5*60*1000);
    },
    beforeDestroy () {
      clearInterval(this.polling)
    }
  }
</script>

<style lang="scss" scoped>
  .trend-container {
    position: relative;

    .time-indicator {
      position: absolute;
      bottom: 1rem;
      font-size: 0.7rem;
      opacity: 0.7;

      &.right {
        right: 0;
      }

      &.left {
        left: 0;
      }
    }
  }
</style>

