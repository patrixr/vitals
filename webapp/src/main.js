import Vue                  from 'vue'
import router               from "./router"
import store                from "./store"
import App                  from './App'
import ElementUI            from 'element-ui'
import locale               from 'element-ui/lib/locale/lang/en'
import { library }          from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon }  from '@fortawesome/vue-fontawesome'
import Spacing              from './components/Spacing'
import Trend                from "vuetrend"
import {
  faHeartbeat,
  faWeight,
  faPercent,
  faChartBar,
  faShoePrints,
  faBurn,
  faRunning,
  faRoute
} from '@fortawesome/free-solid-svg-icons'

import 'element-ui/lib/theme-chalk/index.css'
import './styles/animate.css';
import './styles/main.scss';
import './filters'

// --> Element UI
Vue.use(ElementUI, { locale });
Vue.use(Trend)

// --> Font aweomse
library.add(faHeartbeat, faWeight, faPercent, faChartBar, faShoePrints, faBurn, faRunning, faRoute);
Vue.component('fa-icon', FontAwesomeIcon);
Vue.component('spacing', Spacing)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");