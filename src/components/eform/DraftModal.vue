<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.fillout_draft }}</b>
        </v-card-title>
        <v-card-text class="pa-12 confirm-content">{{ textLang.you_fillout }} "{{ dialog_item_name }}" {{ textLang.continue }}</v-card-text>
        <v-card-actions class="pt-0 pb-5">
          <v-spacer></v-spacer> 
          <v-btn dark depressed large :color="color_success" @click="loadDraft(true)" class="px-10 mr-1 save-setting-btn font-en">{{ textLang.yes }}</v-btn>
          <v-btn depressed large color="error" @click="loadDraft(false)" class="px-6 mr-1 save-setting-btn save-modal-font-btn font-en">{{ textLang.no }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-card-actions class="pt-0 pb-8">
          <v-spacer></v-spacer> 
          <v-btn outlined large color="#979797" dark class="px-12 mr-1 save-setting-btn" @click="dialog = false">{{ textLang.cancel }}</v-btn> 
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
    my_form_option: {
      name: '',
      code: '',
      eform_id: '',
    },
    dialog_item_name: '',
    textLang: {
      fillout_draft: "กรอกเอกสารต่อจากแบบร่าง",
      you_fillout: "คุณต้องการกรอกเอกสาร",
      continue: "ต่อจากแบบร่างที่บันทึกไว้หรือไม่",
      yes: "ใช่, กรอกเอกสารต่อ",
      no: "ไม่, เริ่มกรอกเอกสารใหม่",
      cancel: "ยกเลิก"
    },

    //Color Variable
    // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
    color_success: '#2ACA9F',
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
    EventBus.$on('draftMyForm',this.getDataDelete)
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
      this.color_success = this.colorObject.modal.modal_main_color
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
        this.textLang = lang_th.components.DraftModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
        this.textLang = lang_en.components.DraftModal
      }
    },
    getDataDelete(option) {
      this.dialog = true
      this.my_form_option = option
      this.dialog_item_name = this.my_form_option.name
    },
    loadDraft(isLoad) {
      this.dialog = false
      this.my_form_option.statusDraft = isLoad
      var option = this.my_form_option
      EventBus.$emit('loadDraftFunction',option)
    }
  }
}
</script>

<style>

  .font-en{
    text-transform: inherit;
  }

</style>