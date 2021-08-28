import Vue from 'vue'
import VueRouter from 'vue-router'
import Toolbar from '../views/Toolbar.vue'
import Inbox from '../views/Inbox.vue'
import DocumentDetail from '../views/DocumentDetail.vue'
import CreateDocument from '../views/CreateDocument.vue'
import Setting from '../views/Setting.vue'
import Landing from '../views/Landing.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '',
      name: 'Toolbar',
      component: Toolbar,
      children: [
        {
          path: '/inbox',
          name: 'inbox',
          component: Inbox
        },
        {
          path: '/inbox/detail',
          name: 'document_detail',
          component: DocumentDetail
        },
        {
          path: '/create',
          name: 'create',
          component: CreateDocument
        },
        {
          path: '/setting',
          name: 'setting',
          component: Setting
        }
      ]
    },
    {
      path: '/landing', //landing page from bot to web view
      name: 'landing',
      component: Landing,
      props:route => ({ ...route.query }) //collected query after question mark ex. landing?shared_token=...
    }
  ]
})
