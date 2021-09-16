<template>
  <v-container>
    <v-dialog v-model="dialog_forward_mail" persistent max-width="700">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.forward_mail_dialog_title }}</b>
        </v-card-title>
        <v-card-text class="pt-6 pb-0 forward-mail-content">
          <v-row class="forward-mail-header-row">
            <b class="forward-mail-header">{{ textLang.forward_mail_heder }}</b>
          </v-row>
          <ol class="mt-8 pb-7 all-mail-list">
            <li v-for="item in each_mail" :key="item.index">
              <v-row align="center" class="forward-mail-header-row">
                <v-col cols="8" md="10" lg="10" class="py-0">
                  <v-text-field dense outlined :color="color_forward_mail_box" :rules="[validateEmail(item.email,textLang.alert_mail)]" v-model="item.email" class="pad-input forward-mail-header forward-mail-line"></v-text-field>
                </v-col>
                <v-col v-show="item.index != 0" cols="auto" md="auto" lg="auto" align-self="start" class="pl-0 pt-1">
                  <v-btn fab depressed dark x-small color="error"  @click="deleteEmailRow(item)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </v-col>
                <v-col v-show="item.index == each_mail.length-1" cols="auto" md="auto" lg="auto" align-self="start" class="pl-0 pt-1">
                  <v-btn fab depressed dark x-small :color="color_add_mail_btn" @click="addEmailRow()">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </li>
          </ol>
        </v-card-text>
        <v-divider class="end-line-forward-modal"></v-divider>
        <v-card-actions class="pt-9 pb-8">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-8 mr-3 save-setting-btn" @click="dialog_forward_mail = false">{{ textLang.cancel_dialog_btn }}</v-btn>
          <v-btn dark depressed large :color="color_send_email_btn" class="px-7 ml-3 save-setting-btn" @click="sendForwardEmail()">{{ textLang.send_email_btn }}</v-btn>
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
    dialog_forward_mail: false,
    each_mail: [{
      index:0,
      email: ""
    }],

    //Language Variable
    textLang: {
      forward_mail_dialog_title: "ส่งเอกสารผ่านทางอีเมล",
      forward_mail_heder: "เอกสารจะถูกส่งในรูปแบบไฟล์ PDF ไปยังที่อยู่อีเมลต่อไปนี้",
      alert_mail: "รูปแบบอีเมลไม่ถูกต้อง",
      cancel_dialog_btn: "ยกเลิก",
      send_email_btn: "ส่งอีเมล"
    },

    //Color Variable
    color_forward_mail_box: '#2ACA9F',
    color_add_mail_btn: '#2ACA9F',
    color_send_email_btn: '#2ACA9F',
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
  mounted() {
    EventBus.$on('SendForwardMail',this.startForwardMail)
    EventBus.$on('changeLang', this.changeLange)
    // this.changeColor()
  },
  methods: {
    startForwardMail() {
      this.each_mail = [{
        index:0,
        email: ""
      }]
      this.dialog_forward_mail = true
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
				this.textLang = lang_th.components.ForwardMailModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
        this.textLang = lang_en.components.ForwardMailModal
      }
    },
    async sendForwardEmail() {
      var emailList = []
      this.each_mail.forEach(e => {
        if(e.email && this.validateEmail(e.email, false)) {
          e.email = e.email.split(' ').join('')
          emailList.push(e.email)
        }
      })
       try {
          // this.notReady = true
          // var { data } = await this.axios.post(ApiConverterFunction.convertDoctorApi(this.$node_api) + '/send_email',
          // {
          //   e_id: sessionStorage.getItem('eform_id'),
          //   email_list: emailList
          // },
          // {
          //   headers: {
          //     'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
          //   }
          // })
       } catch(e) {
         console.log(e)
       }
      this.each_mail = [{
        index:0,
        email: ""
      }]
      this.dialog_forward_mail = false
    },
    changeColor() {
      this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
      this.color_forward_mail_box =  this.colorObject.modal.modal_main_color
      this.color_add_mail_btn = this.colorObject.modal.modal_main_color
      this.color_send_email_btn = this.colorObject.modal.modal_main_color
    },
    validateEmail(mail, alert_text) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(mail) || alert_text
    },
    addEmailRow() {
      this.each_mail.push({
        index:99,
        email: ""
      })
      for(let i=0; i<this.each_mail.length; i++) {
        this.each_mail[i].index = i
      }
    },
    deleteEmailRow(item) {
      var indx = this.each_mail.indexOf(item)
      this.each_mail.splice(indx, 1)
      for(let i=0; i<this.each_mail.length; i++) {
        this.each_mail[i].index = i
      }
    }
  }
}
</script>

<style>
  .forward-mail-content {
    padding-left: 8% !important;
    padding-right: 8% !important;
  }

  .forward-mail-header-row {
    width: 100%;
    margin-left: 0%;
  }

  .forward-mail-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black;
  }

  .all-mail-list {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black;
    padding-left: 3% !important;
    overflow: auto;
    max-height: 425px;
  }

  .v-text-field.forward-mail-line input {
    line-height: 24px;
  }

  .end-line-forward-modal {
    margin-left: 8%;
    margin-right: 8%;
  }

  /*========================================*/

  @media only screen and (max-width: 960px) { /*css for mobile screen*/
    .forward-mail-content {
      padding-left: 6% !important;
      padding-right: 6% !important;
    }

    .all-mail-list {
      padding-left: 6% !important;
    }

    .end-line-forward-modal {
      margin-left: 6%;
      margin-right: 6%;
    }
  }
</style>