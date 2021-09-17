<template>
    <v-dialog v-model="dialog_change_permission_temp" persistent max-width="700px">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <span class="transfer-permission-modal-title"><b>{{ textLang.transfer_modal_title }}{{edit_type}} "{{ temp_name }}"</b></span>
        </v-card-title>
        <v-card-text class="px-10 pt-10 pb-5">
          <v-row justify="center">
            <v-col lg="4" md="4" cols="12" align-self="center" class="pr-0 mail-permission-title">
              {{ textLang.mail_title }}: 
            </v-col>
            <v-col lg="5" md="5" cols="12">
              <v-text-field dense outlined single-line hide-details :color="color_mail_permission" placeholder="example@one.th" class="pad-input mail-permission" v-model="email"></v-text-field>
            </v-col>
          </v-row>
          <br>
          <v-row class="px-3">
            <span class="note-change-permission">** {{ textLang.note_transfer1 }}{{ edit_type }}{{ textLang.note_transfer2 }}</span>
          </v-row>
          <v-divider></v-divider>
        </v-card-text>
        <v-card-actions class="pb-8">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark @click="dialog_change_permission_temp = false" class="px-9 mr-4 button-dialog">{{ textLang.cancel_btn }}</v-btn>
          <v-btn dark depressed large :color="color_change_permission_btn" class="px-8 ml-3 save-setting-btn" @click="summitChange()">{{ textLang.transfer_btn }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import { EventBus } from '../../EventBus'
  export default {
    data: () => ({
      dialog_change_permission_temp: false,
      temp_name: '',
      temp_code: '',
      email: '',
      is_structure: false,
      edit_type: 'รูปแบบเอกสาร',

      //Language Variable
      textLang: {
        transfer_modal_title: "โอนสิทธิ์การแก้ไข",
        template_type: "รูปแบบเอกสาร",
        structure_type: "โครงสร้าง",
        mail_title: "One E-mail ที่ต้องการโอนสิทธิ์",
        note_transfer1: "หมายเหตุ : หลังจากที่ทำการโอนสิทธิ์การแก้ไขไปแล้วจะไม่สามารถกลับมาแก้ไข",
        note_transfer2: "นี้ได้อีก ยกเว้นผู้ใช้งานของ One E-mail ที่ได้ทำการโอนสิทธิ์ไปให้",
        cancel_btn: "ยกเลิก",
        transfer_btn: "โอนสิทธิ์",
        tranfer_success: "โอนสิทธิ์สำเร็จ",
        tranfer_fail: "โอนสิทธิ์ไม่สำเร็จ กรุณาลองใหม่ในภายหลัง"
      },

      //Color Variable
      color_mail_permission: '#2ACA9F',
      color_change_permission_btn: '#2ACA9F',
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
      EventBus.$on('changePermissionTemp', this.startchange)
      EventBus.$on('changeLang', this.changeLange)
      // this.changeColor()
    },
    beforeDestroy() {
      EventBus.$off('changeLang')
    },
    methods: {
      changeColor() {
        this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
        this.color_mail_permission = this.colorObject.modal.modal_main_color
        this.color_change_permission_btn = this.colorObject.modal.modal_main_color
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.ChangePermissionTemplateModal
          if(this.is_structure == false) {
            this.edit_type = lang_th.components.ChangePermissionTemplateModal.template_type
          } else if(this.is_structure == true) {
            this.edit_type = lang_th.components.ChangePermissionTemplateModal.structure_type
          }
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.ChangePermissionTemplateModal
          if(this.is_structure == false) {
            this.edit_type = lang_en.components.ChangePermissionTemplateModal.template_type
          } else if(this.is_structure == true) {
            this.edit_type = lang_en.components.ChangePermissionTemplateModal.structure_type
          }
        }
      },
      startchange(option) {
        this.temp_name = option.template_name
        this.temp_code = option.template_code
        this.email = ""
        if(option.isStructure == false) {
          this.is_structure = false
        } else if(option.isStructure == true) {
          this.is_structure = true
        }
        this.changeLange()
        this.dialog_change_permission_temp = true
      },
      async summitChange() {
        try {
          this.notReady = true
          this.email = this.email.toLowerCase()
          this.email = this.email.trim()
          this.email = this.email.replace(/ /g, "")
          this.email = this.email.split(" ").join("")
          var { data } = await this.axios.post(this.$api+ '/admin/permission_template',
          {
            temp_code: this.temp_code,
            email: this.email
          },
          {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
            }
          })
          this.notReady = false
          this.dialog_change_permission_temp = false
          if(data.result != 'ER') {
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
              this.$router.push({ 'path': '/my_form'})
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
        } catch(err) {
          this.notReady = false
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
          console.log(err)
        }
      },
    }
  }
</script>

<style>
  .transfer-permission-modal-title {
    text-transform: capitalize;
  }

  .mail-permission-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black;
    text-align: center;
  }

  .mail-permission {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }

  .note-change-permission {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
    color: red;
  }

  @media only screen and (max-width:960px){ /*css for mobile screen*/
    .mail-permission-title {
      text-align: center;
    }
  }
</style>