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
          <b>รายงานสรุปรายละเอียดการดำเนินการเอกสาร ชื่อเอกสาร</b>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="auto" lg="auto" class="pr-0 export-report-btn-block">
          <v-btn depressed dark color="#4CAF50" class="export-report-detail-btn" :href="url" target="_blank">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24" class="mr-2">
              <path fill="currentColor" d="M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z" />
            </svg>
            Export Excel
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="report-detail-row report-detail-table-block">
        <v-data-table fixed-header :loading="false" :headers="report_header" :items="report_data" class="report-detail-table report-detail-table-border report-detail-table-header hide-report-detail-progress report-detail-data-table">
          <template v-slot:loading> <!-- loading data in table -->
            <v-row align="center" class="report-detail-row report-detail-loading-block">
              <img width="100px" src="../assets/loader.gif" class="report-detail-loading">
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
      report_header: [],
      report_data: [],
      url: ""
    }),
    mounted(){
      this.getTemplateFormReport()
      this.url = JSON.parse(sessionStorage.getItem('selected_template_report')).url
    },
    methods: {
       async getTemplateFormReport(){ // get user detail to show name, email and business list
        try {
          var url = '/template_form/api/v1/getTemplateFormReport'
          this.report_header = [{
            text: 'ลำดับที่',
            sortable: false,
            value: 'index',
            width: '100px'
          }]
          this.report_data = []
          var { data } = await this.axios.post(this.$api_url + url, {
              template_id: JSON.parse(sessionStorage.getItem('selected_template_report')).template_id,
              flow_id: JSON.parse(sessionStorage.getItem('selected_template_report')).flow_id
          })
          if(data) {
            data.result.header.forEach(e => {
              this.report_header.push({
                text: e.text,
                sortable: false,
                value: e.key,
                width: '200px'
              })
            })
            var index = 1
            data.result.body.forEach(e => {
              e.index = index
              this.report_data.push(e)
              index++
            })
            // this.loading_overlay = false
          }else{
            // this.loading_overlay = false
          }
        } catch (error) {
          console.log(error);
          // this.loading_overlay = false
        }
      },
      back() {
        this.$router.push('/report')
      }
    }
  }
</script>

<style>
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
    font-family: 'Sarabun', sans-serif;
    font-size: 22px;
    color: #4CAF50;
  }

  .export-report-btn-block {
    padding-top: 1% !important;
  }

  .export-report-detail-btn {
    font-family: 'Sarabun', sans-serif;
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

  .report-detail-table-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    font-family: 'Sarabun', sans-serif;
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

  .report-detail-data-table.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-family: 'Sarabun', sans-serif;
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
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

    .report-detail-table-header.theme--light.v-data-table > .v-data-table__wrapper > table > .v-data-table-header-mobile {
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