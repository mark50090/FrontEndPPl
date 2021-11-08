<template>
    <v-dialog persistent max-width="320" v-model="dialog_confirm_save">
      <v-card>
        <v-card-text class="pt-6 pb-1 confirm-content">
          {{ textLang.sure_save }}
        </v-card-text>
        <v-card-actions>
          <v-row class="confirm-save-form-row">
            <v-spacer></v-spacer>
            <v-col cols="4" class="pl-0 pr-2">
              <v-btn depressed block color="#757575" dark class="confirm-save-form-btn" @click="dialog_confirm_save = false">{{ textLang.cancel }}</v-btn>
            </v-col>
            <v-col cols="4" class="pl-2 pr-0">
              <v-btn depressed block dark color="#67C25D" class="confirm-save-form-btn" @click="sendToSave()">{{ textLang.save }}</v-btn>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import { EventBus } from '../../EventBus'
  export default {
    // computed: {
    //   textLang() {
    //     return this.$store.getters.textLang.components.ConfirmSaveTempModal
    //   }
    // },
    data: () => ({
      textLang: {
        confirm_save: "ยืนยันการบันทึกรูปแบบเอกสาร" ,
        sure_save: "ต้องการบันทึกแบบฟอร์มนี้หรือไม่ ?" ,
        cancel: "ยกเลิก" ,
        save: "บันทึก" 
      },
      dialog_confirm_save: false,
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
    font-size: 14px;
    color: black !important;
    text-align: center;
  }

  .confirm-save-form-row {
    width: 100%;
    margin: 0%;
  }

  .confirm-save-form-btn {
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
  }
</style>