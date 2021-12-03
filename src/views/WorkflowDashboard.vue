<template>
  <div class="pa-4">
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="7">
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <v-row no-gutters>
              <v-col cols="12">
                <v-card outlined>
                  <v-toolbar color="white" dense flat>
                    <span>{{textLang.alldocuments}}</span>
                  </v-toolbar>
                  <v-card height="73" flat>
                    <v-layout wrap fill-height justify-center="" align-baseline>
                      <span style="font-size: 34px" v-text="count_all_doc"></span>
                    </v-layout>
                  </v-card>
                </v-card>
              </v-col>
              <v-col cols="12" class="pt-4">
                <v-card outlined>
                  <v-toolbar color="white" dense flat>
                    <span style="font-size: 16px">{{textLang.allstatus}}</span>
                    <!-- <v-chip
                  label
                  small
                  color="#67c25d"
                  text-color="white"
                  class="ml-1"
                  >All</v-chip
                > -->
                    <v-spacer></v-spacer>
                    <v-icon medium color="#67c25d">mdi-file-document</v-icon>
                    &nbsp;&nbsp;
                    <span v-text="count_all_doc"></span>
                  </v-toolbar>
                  <v-card flat>
                    <v-layout wrap fill-height justify-center="" align-baseline>
                      <apexcharts type="pie" width="100%" :options="chartOptions" :series="series" ></apexcharts>
                    </v-layout>
                  </v-card>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <!-- <v-col cols="12" sm="6" class="pl-sm-4 pt-4 pt-sm-0">
            <v-card outlined height="100%">
              <v-toolbar color="white" dense flat>
                <span>หัวข้อ1</span>
              </v-toolbar>
              <v-card flat height="73">
                <v-layout wrap fill-height justify-center="" align-baseline>
                  <span style="font-size: 34px">ข้อมูล1</span>
                </v-layout>
              </v-card>
            </v-card>
          </v-col> -->
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { EventBus } from '../EventBus'
import VueApexCharts from 'vue-apexcharts'
export default {
  computed: {
    textLang() {
      return this.$store.getters.textLang.WorkflowDashboard
    }
  },
  components: {
    apexcharts: VueApexCharts
  },
  data: () => ({
    axios_pending: 0,
    count_all_doc: 0,
    series: [0, 0, 0, 0],
    chartOptions: {
      labels: ['Inprogress', 'Approved', 'Reject', 'Cancel', 'Delete'],
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex]
        }
      },
      chart: {
        toolbar: {
          show: false
        },
        fontFamily: 'Sarabun, Arial, sans-serif',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 700,
          animateGradually: {
            enabled: true,
            delay: 100
          },
          dynamicAnimation: {
            enabled: true,
            speed: 700
          }
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        }
      },
      colors: [
        '#008FFB',
        '#00E396',
        '#FF4560',
        '#FEB019',
        '#757575'
      ],
      plotOptions: {
        bar: {
          columnWidth: '40%',
          distributed: true,
          dataLabels: {
            position: 'top'
          }
        }
      }
    },
    workflow_name: '',
    workflow_id: '',
    token: '',
  }),
  mounted () {
    EventBus.$emit('loadingOverlay', false)
    const selected_workflow_report = JSON.parse(
      sessionStorage.getItem('selected_workflow_report')
    )
    if (!selected_workflow_report) {
      this.$router.replace({ name: 'summary_workflow' })
      return
    }
    this.workflow_name = selected_workflow_report.workflow_name
    this.workflow_id = selected_workflow_report.workflow_id
    this.token = sessionStorage.getItem('access_token')
    this.getSummaryFlowTransaction()
  },
  watch: {
    axios_pending (val) {
      if (val > 0) EventBus.$emit('loadingOverlay', true)
      else EventBus.$emit('loadingOverlay', false)
    }
  },
  methods: {
    async getSummaryFlowTransaction () {
      const url = `${this.$api_url}/report/api/v1/summary_flow_transaction?flow_id=${this.workflow_id}`
      const config = {
        Authorization: `Bearer ${this.token}`
      }
      this.axios_pending++
      try {
        var { data } = await this.axios.get(url, config)
        if (data) {
          const result = data.result
          this.count_all_doc = result.total_count
          this.series = [result.inprogress_count, result.approve_count, result.reject_count, result.cancel_count, result.delete_count]
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.axios_pending--
      }
    }
  },
  beforeDestroy () {
    sessionStorage.removeItem('selected_workflow_report')
  }
}
</script>

<style scoped>
* {
  font-family: "Sarabun", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.workflow-dashboard-page {
  height: calc(100vh - 72px);
  overflow: auto;
  padding-top: 1% !important;
}
</style>
