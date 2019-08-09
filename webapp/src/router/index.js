import Vue          from "vue";
import Router       from "vue-router";
import LandingView  from "../views/Landing";
import LoginView    from "../views/Login";
import Store        from "../store";
import _            from "lodash"

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      component: LandingView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/auth",
      component: LoginView
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const authenticated = Store.getters.authToken;
    if (!authenticated) {
      return next({
        path: "/auth",
        params: {
          nextUrl: to.fullPath
        }
      });
    }
  }
  next();
});

export default router;