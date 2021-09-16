<template>
  <v-container>
    <v-dialog v-model="dialog_export_myfrom" max-width="800px" persistent>
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <span class="font-dialog-title-myform-mobile"><b>{{ textLang.export_myform }}</b></span>
        </v-card-title>
        <v-card-text class="pa-8 pb-0">
          <b class="setting-export-header">{{ textLang.setting_export_myform }}</b><br>
          <v-checkbox :color="color_export_form_header" class="mt-5" v-model="export_myform_all">
            <template v-slot:label>
              <div class="check-export-all">{{ textLang.export_doc_all_myform }}</div>
            </template>
          </v-checkbox>
          <v-row>
            <div v-if="export_myform_all" class="overlay-filter-date-myform"></div>
            <v-col md="6" lg="6" cols="12" align-self="center">
              <v-checkbox :color="color_filter_date" class="mt-0" v-model="export_myform_date">
                <template v-slot:label>
                  <div class="check-export-all">{{ textLang.export_doc_myform }}</div>
                </template>
              </v-checkbox>
            </v-col>
            <v-col v-if="export_myform_date" md="6" lg="6" cols="12" class="export-myform-date-mobile">
              <v-menu ref="menu_date" :close-on-content-click="false" v-model="menu_date">
                <template v-slot:activator="{ on }">
                  <v-text-field :disabled="export_myform_all" readonly outlined dense hide-details :color="color_menu_date" append-icon="mdi-calendar-month" class="pad-input date-range icon-calendar" v-on="on" v-model="dateRangeText"></v-text-field>
                </template>
                <v-date-picker range show-current :color="color_menu_date" locale="th" class="date-calendar" :max="maxReportDate" v-model="date_range">
                  <v-spacer></v-spacer>
                  <v-btn text :color="color_menu_date" @click="menu_date = false">{{ textLang.cancel }}</v-btn>
                  <v-btn text :color="color_menu_date" @click="$refs.menu_date.save(date_range)">{{ textLang.ok }}</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider class="mx-8"></v-divider>
        <v-card-actions class="pt-10 pb-10">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-12 mr-3 save-setting-btn" @click="dialog_export_myfrom = false">{{ textLang.cancel1 }}</v-btn>
          <v-btn depressed large :color="color_exportMyForm" class="px-7 ml-3 save-setting-btn save-modal-font-btn" @click="exportReport()">{{ textLang.export_excel }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { EventBus } from '../../EventBus'

  export default {
    data: () => ({
      dialog_export_myfrom: false,
      menu_date: false,
      date_range: [],
      export_myform_all: true,
      maxReportDate: "",
      export_myform_date: false,
      templateCode: "",
      textLang: {
        export_myform: "Export รายงานการใช้งานเอกสารของฉันในรูปแบบ Excel",
        setting_export_myform: "ตั้งค่าการ Export รายงานการใช้งานเอกสารของฉัน",
        export_doc_all_myform: "Export รายการใช้งานเอกสารของฉันทั้งหมด",
        export_doc_myform: "Export รายการใช้งานเอกสารของฉันในช่วงวันที่ที่กำหนด",
        cancel: "Cancel",
        ok: "OK",
        cancel1: "ยกเลิก",
        export_excel: "Export Excel",
        no_data: "ไม่พบข้อมูล",
        to: "ถึง",
        no_permission: "ไม่พบสิทธิ์ในการเข้าถึงข้อมูล"
      },

      //Color Variable
      // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
      color_export_form_header: '#2ACA9F',
      color_filter_date: '#2ACA9F',
      color_menu_date: '#2ACA9F',
      color_exportMyForm: '#2ACA9F',
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
      }
    },
    watch: {
      export_myform_all(val) {
        if(val) {
          this.date_range = []
        }
      }
    },
    mounted() {
      this.maxReportDate = new Date().toISOString().substr(0, 10)
      EventBus.$on('ExportMyForm',this.openExportMyForm)
      EventBus.$on('changeLang', this.changeLange)
      this.changeLange()
      // this.changeColor()
    },
    beforeDestroy() {
      EventBus.$off('ExportMyForm')
      EventBus.$off('changeLang')
    },
    methods: {
      changeColor() {
        this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
        this.color_export_form_header = this.colorObject.modal.modal_main_color
        this.color_filter_date = this.colorObject.modal.modal_main_color
        this.color_menu_date = this.colorObject.modal.modal_main_color
        this.color_exportMyForm = this.colorObject.modal.modal_main_color
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
            this.textLang = lang_th.components.ExportMyFormReportModal
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
            this.textLang = lang_en.components.ExportMyFormReportModal
        }
      },
      openExportMyForm(tempCode) {
        this.templateCode = tempCode
        this.dialog_export_myfrom = true
      },
      async exportReport() {
        try {
          this.dialog_export_myfrom = false
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
          var { data } = await this.axios.post(this.$api + '/excel_report_cost',
          {
            temp_code: this.templateCode,
            start_datetime: startDate,
            end_datetime: endDate
          },
          {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
            }
          })
          this.datas = data.messageText
          if(data.result == 'OK') {
            if(data.messageText.length > 0) {
              window.open(data.messageText[0].download_excel_file)
            }
          } else {
            this.$swal({
              type: 'error',
              html: '<span class="alert-error"><b>' + this.textLang.no_permission + '</b></span>',
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
          if (err.response != null) {
            if (err.response.status == 401) {
              this.$router.push('/login')
            }
          } else {
            console.log(err.message)
          }
        }
      },
    }
  }
</script>

<style>
  .overlay-filter-date-myform {
    width: 94%;
    height: 15%;
    position: absolute;
    z-index: 2;
    background-color: white;
    opacity: 0.5;
    margin-right: 200% !important;
  }

   @media only screen and (max-width:960px){ /*css for mobile screen*/
    .font-dialog-title-myform-mobile {
      font-size: 14px !important;
      text-align: center;
    }

    .export-myform-date-mobile{
      margin-bottom: 10%;
    }
  }
</style>