import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Api } from "./api/axiosInstant";
import './filters/dateFilters'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2)
Vue.prototype.$apiConfig = new Api(axios);

Vue.prototype.$api_url = 'https://uatpaperless.one.th/api3'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
