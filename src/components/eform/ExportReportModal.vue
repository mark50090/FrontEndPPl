<template>
    <v-dialog v-model="dialog_export_report" max-width="800px" persistent scrollable>
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <span class="font-dialog-title-mobile"><b>{{ textLang.export_report }}</b></span>
        </v-card-title>
        <v-card-text class="pa-8">
          <b class="setting-export-header">{{ textLang.setting_export }}</b><br>
          <v-checkbox :color="color_export_header" class="mt-0" v-model="export_all">
            <template v-slot:label>
              <div class="check-export-all">{{ textLang.export_doc_all }}</div>
            </template>
          </v-checkbox>
          <v-row>
            <div v-if="export_all" class="overlay-filter-date"></div>
            <v-col md="6" lg="6" cols="12" align-self="center">
              <v-checkbox :color="color_filter_date" class="mt-0" v-model="export_date">
                <template v-slot:label>
                  <div class="check-export-all">{{ textLang.export_doc }}</div>
                </template>
              </v-checkbox>
            </v-col>
            <v-col v-if="export_date" md="6" lg="6" cols="12">
              <v-menu ref="menu_date" :close-on-content-click="false" v-model="menu_date">
                <template v-slot:activator="{ on }">
                  <v-text-field :disabled="export_all" readonly outlined dense hide-details :color="color_menu_date" append-icon="mdi-calendar-month" class="pad-input date-range icon-calendar" v-on="on" v-model="dateRangeText"></v-text-field>
                </template>
                <v-date-picker range show-current :color="color_menu_date" locale="th" class="date-calendar" :max="maxReportDate" v-model="date_range">
                  <v-spacer></v-spacer>
                  <v-btn text :color="color_menu_date" @click="menu_date = false">{{ textLang.cancel }}</v-btn>
                  <v-btn text :color="color_menu_date" @click="$refs.menu_date.save(date_range)">{{ textLang.ok }}</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="6" lg="6" cols="12" align-self="end">
              <v-checkbox hide-details :color="color_EmailList" class="mt-0" v-model="export_email">
                <template v-slot:label>
                  <div class="check-export-all">{{ textLang.export_email }}</div>
                </template>
              </v-checkbox>
            </v-col>
            <v-col v-if="export_email" md="6" lg="6" cols="12">
              <v-chip v-for="e in emailList" :key="e" dark close small :color="color_EmailList" class="mr-1 mb-1 email-report">
                {{e}}
              </v-chip>
              <v-text-field outlined dense hide-details :color="color_EmailList" placeholder="One E-mail" append-outer-icon="mdi-plus" class="mt-2 pad-input date-range" @click:append-outer="addEmailList()" v-model="emailValue"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider class="mx-8 "></v-divider>
        <v-card-actions class="pt-12 pb-11">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-12 mr-3 save-setting-btn" @click="dialog_export_report = false">{{ textLang.cancel1 }}</v-btn>
          <v-btn depressed large :color="color_exportReport" class="px-7 ml-3 save-setting-btn save-modal-font-btn" @click="exportReport()">{{ textLang.export_excel }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import { EventBus } from '../../EventBus'

  export default {
    data: () => ({
      dialog_export_report: false,
      menu_date: false,
      date_range: [],
      export_all: true,
      templateOption: "",
      maxReportDate: "",
      export_date: false,
      export_email: false,
      emailList: [],
      emailValue: "",
      textLang: {
        export_report: "Export รายงานการใช้งานเอกสารในรูปแบบ Excel",
        setting_export: "ตั้งค่าการ Export ข้อมูลการใช้งานเอกสาร",
        export_doc_all: "Export ข้อมูลการใช้งานเอกสารทั้งหมด",
        export_doc: "Export ข้อมูลการใช้งานเอกสารในช่วงวันที่ที่กำหนด",
        cancel: "Cancel",
        ok: "OK",
        export_email: "Export ข้อมูลการใช้งานเอกสารของอีเมลตามที่กำหนด",
        cancel1: "ยกเลิก",
        export_excel: "Export Excel",
        no_data: "ไม่พบข้อมูล",
        to: "ถึง"
      },

      //Color Variable
      // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
      color_export_header: '#2ACA9F',
      color_filter_date: '#2ACA9F',
      color_menu_date: '#2ACA9F',
      color_EmailList: '#2ACA9F',
      color_exportReport: '#2ACA9F',
      colorObject: {
      toolbar: {
  				toolbar_bg_color1: '#C2EB81',
  				toolbar_bg_color2: '#A1E9C0',
  				toolbar_font_color: '#0E3852',
  				menu_select_hover_color: '#E6F3CB'
 			},
 			modal: {
  				modal_main_color: '#2ACA9F',
  				modal_sub_color: '#97E2E7',
 			},
 			main_color: '#1b9900'
    }
    }),
    computed: {
      dateRangeText() {
        return this.date_range.join(' ' + this.textLang.to + ' ')
      },
    },
    watch: {
      export_all(val) {
        if(val) {
          this.date_range = []
          this.emailList = []
          this.emailValue = ""
          this.export_date = false
          this.export_email = false
        }
      }
    },
    mounted() {
      this.maxReportDate = new Date().toISOString().substr(0, 10)
      EventBus.$on('exportReport',this.openExportReport)
      EventBus.$on('changeLang', this.changeLange)
      this.changeLange()
      // this.changeColor()
    },
    beforeDestroy() {
      EventBus.$off('changeLang')
    },
    methods: {
      changeColor() {
        this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
        // this.color_dialog_header_bg = this.colorObject.modal.modal_main_color
        // $('.dialog_title').css('background-color', this.color_dialog_header_bg)
        this.color_export_header = this.colorObject.modal.modal_main_color
        this.color_filter_date = this.colorObject.modal.modal_main_color
        this.color_menu_date = this.colorObject.modal.modal_main_color
        this.color_EmailList = this.colorObject.modal.modal_main_color
        this.color_exportReport = this.colorObject.modal.modal_main_color
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
            this.textLang = lang_th.components.ExportReportModal
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
            this.textLang = lang_en.components.ExportReportModal
        }
      },
      openExportReport(option) {
        this.templateOption = option
        this.export_all = true
        this.date_range = []
        this.emailList = []
        this.emailValue = ""
        this.export_date = false
        this.export_email = false
        this.dialog_export_report = true
      },
      async exportReport() {
        try {
          this.dialog_export_report = false
          EventBus.$emit('loding')
          var startDate = ""
          var endDate = ""
          if(this.date_range.length) {
            startDate = this.date_range[0]
            if(this.date_range.length > 1) {
              endDate = this.date_range[1]
            } else {
              endDate = thus.date_range[0]
            }
          }
          var { data } = await this.axios.post(this.$node_api_v3 + '/transection_excel_email',
            {
              template: this.templateOption.template_code,
              start_datetime: startDate,
              end_datetime: endDate,
              email: this.emailList,
              role_name: sessionStorage.getItem("selected_role")
            },
            {
              headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
              }
          })
          EventBus.$emit('stopLoding')
          if(data.messageER == null) {
            if(data.messageText.length > 0) {
              window.open(data.messageText[0].download_excel_file)
            }
          } else if( data.messageER == 'template not found') {
            this.$swal({
              type: 'error',
              html: '<span class="alert-error"><b>' + this.textLang.no_data + '</b></span>',
              showCloseButton: true,
              showConfirmButton: false,
              customClass:{
                popup: 'border-error'
              },
              background: 'white',
              position: 'top',
              timer: 3000,
              backdrop: false,
              closeButtonHtml: '<span class="close-alert-error">&times;</span>'
            })
          } else {
            this.$swal({
              type: 'error',
              html: '<span class="alert-error"><b>' + "Export Excel ล้มเหลว" + '</b></span>',
              showCloseButton: true,
              showConfirmButton: false,
              customClass:{
                popup: 'border-error'
              },
              background: 'white',
              position: 'top',
              timer: 3000,
              backdrop: false,
              closeButtonHtml: '<span class="close-alert-error">&times;</span>'
            })
          }
        } catch (err) {
          EventBus.$emit('stopLoding')
          this.dialog_export_report = false
          this.notReady = false
          if (err.response != null) {
            if (err.response.status == 401) {
              this.$router.push('/login')
            }
          } else {
            console.log(err.message)
          }
        }
      },
      addEmailList() {
        if(this.emailValue && !this.emailList.includes(this.emailValue)) {
          this.emailList.push(this.emailValue)
          this.emailValue = ""
        }
      }
    }
  }
</script>

<style>
  .setting-export-header {
    font-family: "Sarabun", sans-serif;
    font-size: 16px;
    color: #2ACA9F;
  }

  .check-export-all {
    font-family: "Sarabun", sans-serif;
    font-size: 16px;
    color: black;
  }

  .overlay-filter-date {
    width: 94%;
    height: 40%;
    position: absolute;
    z-index: 2;
    background-color: white;
    opacity: 0.5;
  }

  .export-title {
    font-family: "Sarabun", sans-serif;
    color: black;
    text-align: center;
  }

  .report-date-title {
    font-family: "Sarabun", sans-serif;
    font-size: 16px;
    color: black;
  }

  .date-range {
    font-family: "Sarabun", sans-serif;
    font-size: 16px;
  }

  .v-text-field.v-text-field--enclosed.icon-calendar .v-input__append-inner {
    margin-top: 8px !important;
  }

  .date-calendar {
    font-family: "Sarabun", sans-serif;
  }

  .email-report {
    font-family: "Sarabun", sans-serif;
  }

  /*========================================*/

  @media only screen and (max-width:960px){ /*css for mobile screen*/
    .font-dialog-title-mobile {
      font-size: 14px !important;
    }
  }
</style>