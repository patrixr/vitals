<template functional>
  <div v-if="body">
    <el-row :gutter="20">
      <el-col class="text-right" :span="4"><fa-icon icon="weight" size="2x"></fa-icon></el-col>
      <el-col :span="10">Weight</el-col>
      <el-col :span="10">{{ body.weight }} kg</el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col class="text-right" :span="4"><fa-icon icon="percent" size="2x"></fa-icon></el-col>
      <el-col :span="10">Fat</el-col>
      <el-col :span="10">{{ body.fat | truncateFloat }}</el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col class="text-right" :span="4"><fa-icon icon="chart-bar" size="2x"></fa-icon></el-col>
      <el-col :span="10">BMI</el-col>
      <el-col :span="10">{{ body.bmi }}</el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'body-stats',
  computed: {
    ...mapGetters([
      'body'
    ])
  },
}
</script>

<style lang="scss" scoped>

</style>
