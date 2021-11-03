<template>
    <v-dialog v-model="dialog_permission_transference" persistent max-width="700px">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <span class="transfer-permission-modal-title"><b>{{textLang.per_transference}}</b></span>
        </v-card-title>
        <v-card-text class="px-10 pt-10 pb-5">
          <v-row justify="center">
            <v-col lg="4" md="4" cols="12" align-self="center" class="pr-0 mail-permission-title">
              {{textLang.email}}:
            </v-col>
            <v-col lg="5" md="5" cols="12">
              <v-text-field dense outlined single-line hide-details :color="color_mail_permission_transference" placeholder="example@one.th" class="pad-input mail-permission" v-model="email"></v-text-field>
            </v-col>
          </v-row>
          <br>
          <v-divider></v-divider>
        </v-card-text>
        <v-row class="paperless-alert-row" v-if="alertTextShow"> <!-- alert input by step -->
          <v-col cols="1">
            <v-icon color="red">mdi-alert</v-icon>
          </v-col>
          <v-col cols="11">
            <span class="paperless-alert" v-html="alert_text"></span>
          </v-col>
        </v-row> 
        <v-card-actions class="pt-4 pb-8">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark @click="dialog_permission_transference = false" class="px-9 mr-4 button-dialog">{{textLang.cancel}}</v-btn>
          <v-btn dark depressed large :color="color_permission_btn" class="px-8 ml-3 save-setting-btn" @click="transferPermission()">{{textLang.transfer}}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import { EventBus } from '../../EventBus'
  export default {
    computed: {
      textLang() {
        return this.$store.getters.textLang.components.PermissionTransferenceDocument
      }
    },
    data: () => ({
      dialog_permission_transference: false,
      email: "",
      eId: "",
      blockEmail: ['wanchai.vach@one.th', 'morragot.ku@one.th'],
      alertTextShow: false,
      alert_text: "",
      //Color Variable
      color_mail_permission_transference: '#2ACA9F',
      color_permission_btn: '#2ACA9F',
      colorObject: {
        toolbar: {
            toolbar_bg_color1: '#C2EB81',
            toolbar_bg_color2: '#A1E9C0',
            toolbar_font_color: '#0E3852',
            menu_select_hover_color: '#E6F3CB'
        },
        modal: {
            modal_main_color: '#2ACA9F',
            modal_sub_color: '#97E2E7'
        },
        main_color: '#1b9900'
      }
    }),
    mounted() {
      EventBus.$on('PermissionTransference', this.permissTransference)
      EventBus.$on('changeLang', this.changeLange)
      // this.changeColor()
    },
    beforeDestroy() {
      EventBus.$off('changeLang')
      EventBus.$off('PermissionTransference')
    },
    methods: {
      changeColor() {
        this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
        this.color_mail_permission_transference = this.colorObject.modal.modal_main_color
        this.color_permission_btn = this.colorObject.modal.modal_main_color
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.PermissionTransferenceDocument
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.PermissionTransferenceDocument
        }
      },
      permissTransference(eformId) {
        this.email = ""
        this.eId = eformId
        this.dialog_permission_transference = true
      },
      async transferPermission() {
        try {
          var validEmail = false
          this.alertTextShow = false
          this.alert_text = ""
          if(this.email) {
            var checkMailArray = [{
              oneEmail: this.email
            }]
            validEmail = await this.checkOneEmail(checkMailArray)
          }
          if(validEmail) {
            var emailList = JSON.parse(sessionStorage.getItem("one_email_list"))
            var { data } = await this.axios.post(this.$api+ '/transfer_email',
            {
              email_owner: emailList,
              email_tranfer: this.email,
              e_id: this.eId
            },
            {
              headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
              }
            })
            if(data.result == "OK") {
              this.$swal({
                type: 'success',
                html: '<span class="alert"><b>' + this.textLang.tranfer_success + '</b></span>',
                showCloseButton: true,
                showConfirmButton: false,
                background: 'white',
                position: 'top',
                timer: 3000,
                backdrop: false,
                customClass: {
                  popup: 'border-success'
                },
                closeButtonHtml: '<span class="close-alert">&times;</span>'
              })
              this.dialog_permission_transference = false
              EventBus.$emit('transferenceDone')
            } else {
              this.$swal({
                type: 'error',
                html: '<span class="alert-error"><b>' + this.textLang.tranfer_fail +  '</b></span>',
                showCloseButton: true,
                showConfirmButton: false,
                background: 'white',
                customClass:{
                  popup: 'border-error'
                },
                position: 'top',
                timer: 3000,
                backdrop: false,
                closeButtonHtml: '<span class="close-alert-error">&times;</span>'
              })
            }
          }
        } catch(e) {
          this.$swal({
            type: 'error',
            html: '<span class="alert-error"><b>' + this.textLang.tranfer_fail +  '</b></span>',
            showCloseButton: true,
            showConfirmButton: false,
            background: 'white',
            customClass:{
              popup: 'border-error'
            },
            position: 'top',
            timer: 3000,
            backdrop: false,
            closeButtonHtml: '<span class="close-alert-error">&times;</span>'
          })
          console.log(e)
        }
      },
      async checkOneEmail(checkMailArray) {
        try {
          var blockMail = []
          var validEmail = false
          this.notReady = true
          var { data } = await this.axios.post(
            this.$api + "/checkonemail",
            checkMailArray,
            {
              headers: {
                Authorization:
                  "Bearer " + sessionStorage.getItem("one_access_token")
              }
            }
          )
          this.notReady = false
          if (data.result == "OK") {
            var dataEmail = data.messageText
            var errorMail = []
            for (let i = 0; i < dataEmail.length; i++) {
              var mailStatus = dataEmail[i].result
              if (mailStatus == "Fail")
                errorMail.push(checkMailArray[i].oneEmail)
            }
            checkMailArray.forEach(e => {
              if(this.blockEmail.includes(e.oneEmail)) {
                blockMail.push(e.oneEmail)
              }
            })
            if (errorMail.length > 0) {
              // email not found in oneid
              var msg = this.textLang.not_found_email + "<ul>"
              for (let i = 0; i < errorMail.length; i++) {
                msg = msg + "<li>" + errorMail[i] + "</li>"
              }
              msg = msg + "</ul>"
              this.alertTextShow = true
              this.alert_text = msg
            } else if (blockMail.length > 0) {
              // email not found in oneid
              var msg = this.textLang.forbidding_email_title + "<ul>"
              for (let i = 0; i < blockMail.length; i++) {
                msg = msg + "<li>" + blockMail[i] + "</li>"
              }
              msg = msg + "</ul>"
              this.alertTextShow = true
              this.alert_text = msg
            } else {
              validEmail = true;
            }
          }
          return validEmail
        } catch (error) {
          this.notReady = false
          console.log(error.message)
          return validEmail
        }
      },
    }
  }
</script>