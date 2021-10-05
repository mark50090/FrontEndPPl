<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 px-2 report-detail-page">
      <v-row class="report-detail-row">
        <v-col cols="auto" md="auto" lg="auto" class="back-btn-report-block">
          <v-btn icon color="#4CAF50" @click="back()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="9" md="8" lg="8" class="px-0 report-detail-header">
          <b>รายงานสรุปการใช้งานเอกสาร {{ workflow_name }}</b>
        </v-col>
        <v-spacer></v-spacer>
        <v-col
          cols="12"
          md="auto"
          lg="auto"
          class="pr-0 export-report-btn-block"
        >
          <v-btn
            depressed
            dark
            color="#4CAF50"
            class="export-report-detail-btn"
            @click="exportExcel"
          >
            <svg
              style="width: 24px; height: 24px"
              viewBox="0 0 24 24"
              class="mr-2"
            >
              <path
                fill="currentColor"
                d="M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z"
              />
            </svg>
            Export Excel
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="report-detail-row report-detail-table-block">
        <v-data-table
          fixed-header
          :loading="axios_pending > 0"
          :headers="report_header"
          :items="report_data"
          :server-items-length="count_doc"
          :options.sync="optionsTransaction"
          :footer-props="optionFooter"
          @click:row="goToDocumentDetail($event._id)"
          class="
            report-detail-table
            report-detail-table-border
            report-detail-table-header
            hide-report-detail-progress
            report-detail-data-table
          "
        >
          <template v-slot:[`item.step`]="{ item }" >
            <span v-html="item.step"></span>
          </template>
          <template v-slot:loading>
            <!-- loading data in table -->
            <v-row
              align="center"
              class="report-detail-row report-detail-loading-block"
            >
              <img
                width="100px"
                src="../assets/loader.gif"
                class="report-detail-loading"
              />
            </v-row>
          </template>
        </v-data-table>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    report_header: [
      {
        text: 'ลำดับที่',
        sortable: false,
        value: 'index',
        width: '100px'
      },
      {
        text: 'ประเภทเอกสาร',
        value: 'flow_name'
      },
      {
        text: 'เลขที่เอกสาร',
        value: 'document_id'
      },
      {
        text: 'รายละเอียด',
        value: 'detail'
      },
      {
        text: 'สถานะเอกสาร',
        value: 'document_status'
      },
      {
        text: 'ผู้ส่งเอกสาร',
        value: 'sender_name'
      },
      {
        text: 'วันที่ส่ง',
        value: 'send_date'
      },
      {
        text: 'ระยะเวลาดำเนินการ',
        value: 'step'
      },
      {
        text: 'ระยะเวลาทั้งหมดที่เอกสารถูกดำเนินการ',
        value: 'completed_time'
      },
      {
        text: 'ระยะเวลาตั้งแต่เอกสารถูกนำเข้าถึงลำดับล่าสุด',
        value: 'process_time'
      }
    ],
    report_data: [],
    optionsTransaction: {
      page: 1,
      itemsPerPage: 10
    },
    optionFooter: {
      'items-per-page-options': [5, 10, 15, 20]
    },
    count_doc: 0,
    url: '',
    workflow_name: '',
    workflow_id: '',
    token: '',
    axios_pending: 0
  }),
  watch: {
    "optionsTransaction.page" () {
      this.getReportFlow()
      this.getCountFlowTransaction()
    },
    "optionsTransaction.itemsPerPage" () {
      this.getReportFlow()
      this.getCountFlowTransaction()
    }
  },
  mounted () {
    //   this.getTemplateFormReport()
    //   this.url = JSON.parse(sessionStorage.getItem('selected_template_report')).url
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
    this.getReportFlow()
    this.getCountFlowTransaction()
  },
  methods: {
    goToDocumentDetail(id) {
      sessionStorage.setItem('transaction_id', id)
      this.$router.push('/inbox/detail')
    },
    async getCountFlowTransaction () {
      const url = `${this.$api_url}/report/api/v1/count_flow_transaction?flow_id=${this.workflow_id}`
      const config = {
        Authorization: `Bearer ${this.token}`
      }
      this.axios_pending++
      try {
        var { data } = await this.axios.get(url, config)
        if (data) {
          this.count_doc = data.result
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.axios_pending--
      }
    },
    async getReportFlow () {
      this.axios_pending++
      try {
        var url = '/report/api/v1/report_flow_transaction'
        const body = {
          flow_id: this.workflow_id,
          lim: this.optionsTransaction.itemsPerPage,
          offset: (this.optionsTransaction.page - 1) * this.optionsTransaction.itemsPerPage
        }
        const config = {
          Authorization: `Bearer ${this.token}`
        }
        this.report_data = []
        var { data } = await this.axios.post(this.$api_url + url, body, config)
        if (data) {
          if (this.report_data.length === 0)
            data.result.forEach((e, index) => {
              this.report_data.push({
                index: (this.optionsTransaction.page - 1) * this.optionsTransaction.itemsPerPage + index + 1,
                flow_name: e.flow_name,
                document_id: e.document_id,
                detail: e.detail,
                document_status: e.document_status,
                sender_name: e.sender_name,
                send_date: e.send_date,
                step: e.step.replaceAll('\n', '<br/>'),
                completed_time: e.completed_time,
                process_time: e.process_time,
                _id: e.transaction_id
              })
            })
        } else {
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.axios_pending--
      }
    },
    back () {
      this.$router.push({ name: 'summary_workflow' })
    },
    exportExcel () {
      if (this.$device.windows) window.open(`${this.$api_url}/report/api/v1/export_report_transaction?flow_id=${this.workflow_id}`)
      else window.open(`https://chat-develop.one.th/deeplink-redirect/?url=${`${this.$api_url}/report/api/v1/export_report_transaction?flow_id=${this.workflow_id}`}`)
    }
  },
  beforeDestroy () {
    sessionStorage.removeItem('selected_workflow_report')
  }
}
</script>

<style scoped>
.report-detail-page {
  height: calc(100vh - 72px);
  overflow: auto;
  padding-top: 1% !important;
}

.report-detail-row {
  width: 100%;
  margin: 0% !important;
}

.report-detail-header {
  font-family: "Sarabun", sans-serif;
  font-size: 22px;
  color: #4caf50;
}

.export-report-btn-block {
  padding-top: 1% !important;
}

.export-report-detail-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
}

.report-detail-table-block {
  margin-top: 3% !important;
}

.report-detail-table {
  width: 100%;
}

.report-detail-table.v-data-table > .v-data-table__wrapper {
  height: calc(100vh - 272px);
  overflow: auto;
}

.report-detail-table-border .v-data-table__wrapper {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.report-detail-table-header.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > th {
  font-family: "Sarabun", sans-serif;
  font-size: 15px;
}

.hide-report-detail-progress .v-data-table__progress {
  display: none;
}

.report-detail-loading-block {
  height: calc(100vh - 343px);
}

.report-detail-loading {
  opacity: 0.6;
  position: fixed;
  left: 56%;
}

.report-detail-data-table.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr
  > td {
  font-family: "Sarabun", sans-serif;
}

/*========================================*/

@media only screen and (max-width: 600px) {
  /*css for mobile screen*/
  .report-detail-page {
    height: calc(100vh - 64px);
  }

  .back-btn-report-block {
    padding-top: 2% !important;
  }

  .report-detail-header {
    font-size: 16px;
  }

  .export-report-btn-block {
    padding-top: 0% !important;
    text-align: end;
  }

  .report-detail-table.v-data-table > .v-data-table__wrapper {
    height: calc(100vh - 301px);
  }

  .report-detail-table-header.theme--light.v-data-table
    > .v-data-table__wrapper
    > table
    > .v-data-table-header-mobile {
    display: none;
  }

  .report-detail-loading-block {
    height: calc(100vh - 307px);
  }

  .report-detail-loading {
    left: 39%;
  }
}
</style>
