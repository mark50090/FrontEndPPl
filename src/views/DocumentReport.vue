<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 px-4 pt-3 report-page">
      <v-row class="pl-3 report-row report-header">
        <b>รายงานเอกสาร</b>
      </v-row>
      <v-row class="mt-1 report-row">
        <v-col cols="12" md="6" lg="6" class="px-0 pb-1">
          <v-text-field dense outlined hide-details clearable clear-icon="mdi-close-circle-outline" color="#4caf50" placeholder="ค้นหา" class="search-report search-report-btn-block">
            <template v-slot:append-outer>
              <v-btn outlined color="#9e9e9e" class="search-report-btn">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="report-row">
        <v-data-table fixed-header :loading="false" :headers="report_table_header" :items="report_data" class="report-table report-table-border report-table-header doc-type-header hide-report-table-progress report-data-table">
          <template v-slot:loading> <!-- loading data in table -->
            <v-row align="center" justify="center" class="report-row report-loading-block">
              <img width="100px" src="../assets/loader.gif" class="report-load">
            </v-row>
          </template>
          <template v-slot:[`item.action`]="{ item }"> <!-- view / export excel column -->
            <v-btn icon color="#4CAF50" @click="viewReport(item)"> <!-- view report button -->
              <v-icon>mdi-eye-outline</v-icon>
            </v-btn>
            <v-btn icon color="#4CAF50" class="ml-7" :href="item.url" target="_blank" > <!-- export excel button   @click="documentre()"-->
              <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z" />
              </svg>
            </v-btn>
          </template>
        </v-data-table>
      </v-row>
    </v-card>
    <DocumentReport/>
  </div>
</template>

<script>
  import { EventBus } from '../EventBus'
  import DocumentReport from '../components/DocumentReport'
  export default {
    components:{
    DocumentReport
    },
    data: () => ({
      report_table_header: [
        {text: 'ลำดับ', align: 'center', sortable: true, value: 'report_no'},
        {text: 'ชื่อย่อ', align: 'center', sortable: true, value: 'shorten_name'},
        {text: 'ชื่อประเภทเอกสาร', align: 'start', sortable: true, value: 'doc_type'},
        {text: 'View / Export Excel', align: 'start', sortable: false, value: 'action'},
      ],
      report_data: [],
      keyword: ""
    }),
    mounted(){
      this.searchTemplateForm()
      EventBus.$on('changeBiz', this.changeBiz)
    },
    methods: {
      viewReport(item) {
        sessionStorage.setItem('selected_template_report', JSON.stringify(item))
        this.$router.push('/report/view')
      },
      changeBiz() {
        this.searchTemplateForm()
      },
      async searchTemplateForm(){ // get user detail to show name, email and business list
        try {
          var url = '/template_form/api/v1/searchTemplateForm'
          this.report_data = []
          var { data } = await this.axios.post(this.$api_url + url, {
              tax_id: JSON.parse(sessionStorage.getItem('selected_business')).id_card_num,
              keyword: this.keyword
          })
          if(data) {
            var index = 1
            data.data.forEach(e => {
              this.report_data.push({
                report_no: index,
                shorten_name: e.short_name,
                doc_type: e.flow_type_name,
                template_id: e.template_id,
                flow_id: e.flow_id,
                url: `${this.$api_url}/template_form/api/v1/getTemplateFormDataExcel?template_id=${e.template_id}&flow_id=${e.flow_id}`
              })
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
      documentre() {
        EventBus.$emit('documentreport')
    }
    }
  }
</script>

<style>
  .report-page {
    height: calc(100vh - 72px);
  }

  .report-row {
    width: 100%;
    margin: 0% !important;
  }

  .report-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 22px;
    color: #4CAF50;
  }

  .search-report {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .search-report.v-text-field input {
    line-height: 24px !important;
  }

  .search-report.v-text-field .v-input__control {
    border-end-end-radius: 0px !important;
    border-start-end-radius: 0px !important;
  }

  .search-report-btn-block.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer {
    margin-top: 0% !important;
  }

  .v-application--is-ltr .search-report-btn-block .v-input__append-outer {
    margin-left: 0% !important;
  }

  .search-report-btn {
    background-color: #f5f7fa;
    border-start-start-radius: 0px;
    border-end-start-radius: 0px;
    height: 40px !important;
    min-width: 58px !important;
  }

  .report-table {
    width: 100%;
  }

  .report-table.v-data-table > .v-data-table__wrapper {
    height: calc(100vh - 245px);
    overflow: auto;
  }

  .report-table-border .v-data-table__wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .report-table-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    font-family: 'Sarabun', sans-serif;
    font-size: 15px;
  }

  .doc-type-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th:nth-child(3) {
    text-align: center !important;
  }

  .hide-report-table-progress .v-data-table__progress {
    display: none;
  }

  .report-loading-block {
    height: calc(100vh - 296px);
  }

  .report-load {
    opacity: 0.6;
  }

  .report-data-table.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-family: 'Sarabun', sans-serif;
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .report-page {
      height: calc(100vh - 64px);
    }

    .report-table.v-data-table > .v-data-table__wrapper {
      height: calc(100vh - 273px);
    }

    .report-loading-block {
      height: calc(100vh - 332px);
      margin-left: 97% !important;
    }
  }
</style>