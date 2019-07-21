import Vue          from "vue";
import Router       from "vue-router";
import LandingView  from "../views/Landing";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      component: LandingView
    }
  ]
});

export default router;