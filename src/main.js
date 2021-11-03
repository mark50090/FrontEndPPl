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
import VueDraggableResizable from 'vue-draggable-resizable/src/index'
import device from "vue-device-detector"
import VueApexCharts from 'vue-apexcharts'
import VueSignaturePad from 'vue-signature-pad'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2)
Vue.prototype.$apiConfig = new Api(axios)
Vue.use(device)
Vue.use(VueApexCharts)
Vue.use(VueSignaturePad)

Vue.prototype.$api_url = 'https://uatpaperless.one.th/api3'
// Vue.prototype.$api_url = 'http://localhost:8808'
Vue.component('vue-draggable-resizable', VueDraggableResizable)

Vue.prototype.$eform_api = 'https://eform.one.th/eform_api/api/v1'
Vue.prototype.$eform_api_v2 = 'https://eform.one.th/eform_api/api/v2'
Vue.prototype.$eform_api_v3 = 'https://eform.one.th/eform_api/api/v3'
Vue.prototype.$eform_api_paperless = 'https://paperless.one.th/paper_less/api/v1'
Vue.prototype.$eform_api_tracking = 'https://paperless.one.th'
Vue.prototype.$eform_api_paperless_v2 = 'https://paperless.one.th/paper_less/api/v2'
Vue.prototype.$eform_api_paperless_storage = 'https://paperless.one.th/paper_less'
Vue.prototype.$eform_api_paperless_v3 = 'https://paperless.one.th/paper_less/api/v3'
Vue.prototype.$eform_api_v4 = 'https://eform.one.th/eform_api/api/v4'
Vue.prototype.$eform_api_paperless_v4 = 'https://paperless.one.th/paper_less/api/v4'
Vue.prototype.$eform_api_v5 = 'https://eform.one.th/eform_api/api/v5'
Vue.prototype.$base_url = 'https://digitalflow_dev.one.th/'
Vue.prototype.$eform_api_v6 = 'https://eform.one.th/eform_api/api/v6'
Vue.prototype.$eform_node_api_v6 = 'https://eform.one.th/node_api/api/v6'
Vue.prototype.$eform_node_api = 'https://eform.one.th/node_api/api/v1'
Vue.prototype.$eform_node_api_v3 = 'https://eform.one.th/node_api/api/v3'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
