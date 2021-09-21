import Vue from 'vue'
import VueRouter from 'vue-router'
import Toolbar from '../views/Toolbar.vue'
import Inbox from '../views/Inbox.vue'
import DocumentDetail from '../views/DocumentDetail.vue'
import CreateDocument from '../views/CreateDocument.vue'
import DocumentReport from '../views/DocumentReport.vue'
import ReportDetail from '../views/ReportDetail.vue'
import Setting from '../views/Setting.vue'
import Landing from '../views/Landing.vue'
import SentBoxList from '../views/SentBoxList.vue'
import ErrorPage from '../views/ErrorPage.vue'
import WorkflowReport from '../views/WorkflowReport.vue'
import WorkflowDetail from '../views/WorkflowDetail.vue'
import WorkflowDashboard from '../views/WorkflowDashboard.vue'
import CreateTemplate from '../views/eform/Create_Template.vue'
import QuestionForm from '../views/QuestionForm.vue'
import FormInputList from '../views/FormInputList.vue'
import ApprovalList from '../views/ApprovalList.vue'
import ShowTemplate from '../views/eform/Show_Template.vue'
import PreviewTemplate from '../views/eform/Preview_Template.vue'
import TemplateList from '../views/TemplateList.vue'

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
          path: '/report',
          name: 'report',
          component: DocumentReport
        },
        {
          path: '/report/view',
          name: 'view_report',
          component: ReportDetail
        },
        {
          path: '/setting',
          name: 'setting',
          component: Setting
        },
        {
          path: '/sent_box',
          name: 'sent_box',
          component: SentBoxList
        },
        {
          path: '/sent_box/detail',
          name: 'sent_box_detail',
          component: DocumentDetail
        },
        {
          path: '/summary_workflow',
          name: 'summary_workflow',
          component: WorkflowReport
        },
        {
          path: '/summary_workflow/view',
          name: 'summary_workflow_view',
          component: WorkflowDetail
        },
        {
          path: '/summary_workflow/dashboard',
          name: 'summary_workflow_dashboard',
          component: WorkflowDashboard
        },
        {
          path: '/template/create_template',
          name: 'create_template',
          component: CreateTemplate
        },
        {
          path: '/form/short_form',
          name: 'question_form',
          component: QuestionForm
        },
        {
          path: '/form',
          name: 'form',
          component: FormInputList
        },
        {
          path: '/flow',
          name: 'flow',
          component: ApprovalList
        },
        {
          path: '/form/input',
          name: 'show_template',
          component: ShowTemplate
        },
        {
          path: '/form/preview',
          name: 'preview_template',
          component: PreviewTemplate
        },
        {
          path: '/template',
          name: 'template',
          component: TemplateList
        }
      ]
    },
    {
      path: '/landing', //landing page from bot to web view
      name: 'landing',
      component: Landing,
      props:route => ({ ...route.query }) //collected query after question mark ex. landing?shared_token=...
    },
    {
      path: '*',
      name: 'error_page',
      component: ErrorPage
    }
  ]
})
