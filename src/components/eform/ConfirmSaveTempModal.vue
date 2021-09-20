<template>
    <v-dialog persistent max-width="500" v-model="dialog_confirm_save">
      <v-card>
        <v-card-title elevation="4" class="dialog_title"><b>{{ textLang.confirm_save }}</b></v-card-title>
        <v-card-text class="pa-12 confirm-content">
          {{ textLang.sure_save }}
        </v-card-text>
        <v-card-actions class="pt-0 pb-12">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-12 mr-4 save-setting-btn" @click="dialog_confirm_save = false">{{ textLang.cancel }}</v-btn>
          <v-btn depressed large :color="color_save" class="px-7 ml-4 save-setting-btn save-modal-font-btn" @click="sendToSave()">{{ textLang.save }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import { EventBus } from '../../EventBus'
  export default {
    data: () => ({
      dialog_confirm_save: false,
      textLang: {
        confirm_save: "ยืนยันการบันทึกรูปแบบเอกสาร" ,
        sure_save: "คุณต้องการบันทึกรูปแบบเอกสารนี้หรือไม่" ,
        cancel: "ยกเลิก" ,
        save: "บันทึกเอกสาร" 
      },

      //Color Variable
      // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
      color_save: '#2ACA9F',
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
      EventBus.$on('openConfirmSave',this.startConfirm)
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
        this.color_save = this.colorObject.modal.modal_main_color
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
            this.textLang = lang_th.components.ConfirmSaveTempModal
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
            this.textLang = lang_en.components.ConfirmSaveTempModal
        }
      },
      startConfirm() {
        this.dialog_confirm_save = true
      },
      sendToSave() {
        EventBus.$emit('sendToSaveTemp')
        this.dialog_confirm_save = false
      }
    }
  }
</script>

<style>
  .confirm-content {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black !important;
    text-align: center;
  }
</style>