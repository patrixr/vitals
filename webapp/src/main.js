import Vue                  from 'vue'
import router               from "./router"
import store                from "./store"
import App                  from './App'
import ElementUI            from 'element-ui'
import locale               from 'element-ui/lib/locale/lang/en'
import { library }          from '@fortawesome/fontawesome-svg-core'
import { faHeartbeat }      from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon }  from '@fortawesome/vue-fontawesome'

import 'element-ui/lib/theme-chalk/index.css'
import './styles/animate.css';
import './styles/main.scss';

// --> Element UI
Vue.use(ElementUI, { locale });

// --> Font aweomse
library.add(faHeartbeat)
Vue.component('fa-icon', FontAwesomeIcon);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");