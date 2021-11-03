<template>
    <v-dialog v-model="dialog" persistent max-width="500">
       <v-card>
            <v-card-title class="front-t-ex py-2">
                {{ textLang.texthead_card }}
            </v-card-title>
        <v-card-text class="pt-5">
          <v-row class="text-form-ex">
                  <span class="front-hing-ex">{{ textLang.select_date }}</span>   
          </v-row>
          <v-row class="text-form-ex mt-6">
            <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    offset-y
                    min-width="290"
                    >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="dateRangeText"
                        prepend-inner-icon="mdi-calendar-range"
                        color="#4CAF50" 
                        v-on="on"
                        outlined
                        dense
                        hide-details
                        class="text-date"
                        readonly
                    ></v-text-field>
                    </template>
                    <v-date-picker
                    locale="th"
                    show-current
                    range
                    color="#4CAF50"
                    v-model="dates"
                    @change="menu2 = false"
                    :max="currentdate"
                    :min="dates[0]"
                    ></v-date-picker>
                </v-menu>
          </v-row>
        </v-card-text>
        <v-card-actions >
        <v-row class="text-form-ex ">
          <v-spacer></v-spacer>
          <v-col cols="4"
          md="3"
          lg="3"
          class="pr-3 pl-0 pt-0">
          <v-btn class="front-btn-hing-ex" 
                  color="#67C25D" 
                  block
                  outlined
                  @click="dialog=false"
                  >{{ textLang.cancel_export }}</v-btn>
                  </v-col> 
          <v-col cols="4"
          md="3"
          lg="3"
          class="pr-0 pl-3 pt-0">
          <v-btn class="front-btn-hing-ex"
                  color="#67C25D"
                  dark
                  block
                  depressed
                  @click="exportExcel"
                  >Export</v-btn
                >
                </v-col>
                <v-spacer></v-spacer>
                  </v-row>
        </v-card-actions> 
      </v-card>
    </v-dialog> 
</template>
<script>
import { EventBus } from '../EventBus'
export default {
  computed: {
    textLang() {
      return this.$store.getters.textLang.components.DocumentReportModal
    }
  },
  data: () => ({
    dates: [],
    currentdate: new Date().toISOString().substr(0, 10),
    dialog: false,
    menu2: false,
    workflow_id: '',
    template_id: '',
  }),
  mounted() {
    EventBus.$on('documentreport',this.documentreports)
  },
  beforeDestroy(){
    EventBus.$off('documentreport')
  },
  computed: {
    dateRangeText() {
      return this.dates.map(x => this.setDateFormatBEShort(x)).join(this.textLang.range_join)
    },
  },
  methods: {
    documentreports(id) {
      if (JSON.parse(sessionStorage.getItem('selected_template_report'))) {
        var data = JSON.parse(sessionStorage.getItem('selected_template_report'))
        this.workflow_id = data.flow_id
        this.template_id = data.template_id
      }else{
        this.workflow_id = id
      }
      this.dialog = true
      this.dates = []
    },
    setDateFormatBEShort (date) {
      var curDate = date.split('-')
      var thaiDate =this.addZero( String(Number(curDate[2]))) + '/' + this.addZero(String(curDate[1])) + '/' + String(Number(curDate[0]) + 543)
      return date ? thaiDate : ''
    },
    addZero(str) {
      if(str.length == 1) {
          str = `0${str}`
      }
      return str
    },
    exportExcel(){
      if(!this.template_id){
        if (this.$device.windows) window.open(`${this.$api_url}/report/api/v1/export_report_transaction?flow_id=${this.workflow_id}&start_date=${this.dates[0]}&end_date=${this.dates[1]}`)
        else window.open(`https://chat-develop.one.th/deeplink-redirect/?url=${this.$api_url}/report/api/v1/export_report_transaction?flow_id=${this.workflow_id}&start_date=${this.dates[0]}&end_date=${this.dates[1]}`)
      }else{
        if (this.$device.windows) window.open(`${this.$api_url}/template_form/api/v1/getTemplateFormDataExcel?template_id=${this.template_id}&flow_id=${this.workflow_id}&start_date=${this.dates[0]}&end_date=${this.dates[1]}`)
        else window.open(`https://chat-develop.one.th/deeplink-redirect/?url=${this.$api_url}/template_form/api/v1/getTemplateFormDataExcel?template_id=${this.template_id}&flow_id=${this.workflow_id}&start_date=${this.dates[0]}&end_date=${this.dates[1]}`)
      }
    }
  },
}
</script>
<style>
.text-form-ex {
    width: 100%;
    margin: 0% !important;
    
  }
.front-hing-ex{
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black;
} 
.front-btn-hing-ex{
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
}
.front-t-ex{
    font-family: 'Sarabun', sans-serif;
    font-size: 16px !important;  
    color: white;
    background: #67C25D;
}
.text-date{
  font-family: 'Sarabun', sans-serif;
  font-size: 13px !important; 
}   
</style>