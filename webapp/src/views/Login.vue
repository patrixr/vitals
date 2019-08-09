<template>
  <div id="landing-page">
    <el-card class="box-card">
      <!-- Title -->
      <el-row>
        <el-col :span="24">
          <h3 class="title"> Please log in </h3>
        </el-col>
      </el-row>

      <!-- Form -->
      <el-form
        :model="formData"
        status-icon
        ref="loginForm"
        label-width="80px"
        class="login-form"
      >
        <!-- Username Input -->
        <el-form-item label="Username" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>

        <!-- Password Input -->
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="formData.password" autocomplete="off"></el-input>
        </el-form-item>

        <!-- Submit -->
        <el-form-item>
          <el-button type="primary" @click="login">
            Log in
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import router           from '../router'
import _                from 'lodash'
import { mapGetters }   from 'vuex'

export default {
  name: "landing",
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  mounted() {
    if (this.$route.error) {
      this.$message({
        message: this.$route.error,
        type: 'error'
      });
    }
  },
  computed: {
    ...mapGetters([
      'authToken'
    ]),
    isLoggedIn() {
      return !!this.authToken
    }
  },
  methods: {
    login() {
        this.$store.dispatch("login", this.formData)
          .then(() => this.$router.push('/'))
          .catch((e) => {
            this.$alert('Please enter valid credentials', 'Unable to login', {
              confirmButtonText: 'OK',
              callback: _.noop
            });
            return false;
          })
    }
  }
};
</script>


<style lang="scss" scoped>
  @import "../styles/colors";

  #landing-page {
    max-width: 500px;
    margin: 0 auto;
    .title {
      text-indent: 80px;
    }

    .box-card {
      margin-top: 5rem;
      padding: 2rem;
    }
  }
</style>