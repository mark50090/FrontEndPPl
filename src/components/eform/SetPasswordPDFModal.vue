<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.password_setting }}</b>
        </v-card-title>
        <v-card-text class="pt-8 pb-5">
          <v-row class="row-crad-actions" justify="center">
            <v-col cols="12" md="2" lg="2" class="pr-0 pt-5 font_password" align-self="start">
              {{ textLang.password }}:
            </v-col>
            <v-col cols="12" md="6" lg="6" align-self="center">
              <v-text-field outlined dense class="pad-input title-name-paperless-value paperless-input-line error_messages_set" :color="color_password_download" v-model="pdfSettingPassword" :error="pdf_password_error" :error-messages="error_pdf_setting_password"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-5 pb-12">
          <v-spacer></v-spacer>
          <v-row class="hidden-sm-and-down row-crad-actions" justify="center" align="center">
            <v-btn outlined large color="#979797" dark class="mr-4 save-setting-btn px-cancel" @click="dialog = false">{{ textLang.cancel }}</v-btn>
            <v-btn large depressed :color="color_password_download"  dark class="px-3 ml-4 button-dialog" @click="settingPassword()">{{ textLang.password_download }}</v-btn>
          </v-row>
          <!-- mobile -->
          <v-row class="hidden-md-and-up row-crad-actions">
            <v-col cols="12" justify="center" align="center">
              <v-btn large depressed :color="color_password_download"  dark class="px-3 button-dialog" @click="settingPassword()">{{ textLang.password_download }}</v-btn>
            </v-col>
            <v-col cols="12" justify="center" align="center">
              <v-btn outlined large color="#979797" dark class="save-setting-btn px-cancel" @click="dialog = false">{{ textLang.cancel }}</v-btn>
            </v-col>
          </v-row>
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
    dialog: false,
    pdfSettingPassword: "",
    pdf_password_error: false,
    error_pdf_setting_password: "",
    holdHtml: "",
    holdRedownload: "",
    holdCount: "",
    textLang: {
      password_setting: "ตั้งค่ารหัสผ่านเอกสาร (pdf)",
      password: "รหัสผ่าน:",
      pleaseSet_password: "กรุณาตั้งค่ารหัสผ่าน",
      password_download: "ตั้งค่าและดาวน์โหลดเอกสาร",
      cancel: "ยกเลิก",
    },

    //Color Variable
    color_password_download: '#2ACA9F',
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
  watch: {
    pdfSettingPassword(val) {
      if(val == '') {
        this.pdf_password_error = true
        this.error_pdf_setting_password = this.textLang.pleaseSet_password
      } else {
        this.pdf_password_error = false
        this.error_pdf_setting_password = ''
      }
    }
  },
  mounted() {
    EventBus.$on('passwordSetting',this.startPasswordModal)
    EventBus.$on('changeLang', this.changeLange)
    this.changeLange()
    // this.changeColor()
  },
  beforeDestroy() {
    EventBus.$off('changeLang')
    EventBus.$off('passwordSetting')
  },
  methods: {
    changeColor() {
      this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
      this.color_password_download = this.colorObject.modal.modal_main_color
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
        this.textLang = lang_th.components.SetPasswordPDFModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
        this.textLang = lang_en.components.SetPasswordPDFModal
      }
    },
    startPasswordModal(html, reDownload, count) {
      this.dialog = true
      this.holdHtml = html
      this.holdRedownload = reDownload
      this.holdCount = count
      this.pdfSettingPassword = ""
    },
    settingPassword(){
      if(this.pdfSettingPassword == ''){
        this.pdf_password_error = true
        this.error_pdf_setting_password = this.textLang.pleaseSet_password
      }else{
        this.pdf_password_error = false
        this.error_pdf_setting_password = ""
        var pdfPass = this.pdfSettingPassword
        var html = this.holdHtml
        var reDownload = this.holdRedownload
        var count = this.holdCount
        EventBus.$emit('setPdfPass', pdfPass, html, reDownload, count)
        this.dialog = false
      }
    }
  }
}
</script>

<style>
.px-cancel{
  padding-left: 82px !important;
  padding-right: 82px !important;
}

.font_password{
  font-family: "Sarabun", sans-serif;
  font-size: 16px;
  color: black !important;
  text-align: right;
}

.row-crad-actions{
  width: 100%;
  margin-left: 0%;
}

.error_messages_set .v-messages__message{
  line-height: 25px;
} 

/*========================================*/

@media only screen and (max-width:600px){ /*css for mobile screen*/
  .font_password{
    text-align: left !important;
  }
}
</style>``