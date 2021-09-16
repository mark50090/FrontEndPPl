<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.back_document }} "{{ page_name }}"</b>
          <!-- <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
        </v-card-title>
        <v-card-text class="pa-12 confirm-content">{{ textLang.sure_leave }} "{{ page_name }}" {{ textLang.no_save }}</v-card-text>
        <v-card-actions class="pt-0 pb-12">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-12 mr-4 save-setting-btn" @click="dialog = false">{{ textLang.cancel }}</v-btn>
          <v-btn large depressed :color="color_back"  dark class="px-12 ml-4 button-dialog" @click="back()"><v-icon>mdi-exit-run</v-icon>&nbsp;&nbsp;{{ textLang.back }}</v-btn>
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
    page_name: '',
    textLang: {
      back_document: "ออกจากหน้า" ,
      sure_leave: "คุณต้องการออกจากหน้า" ,
      no_save: "โดยไม่บันทึกหรือไม่" ,
      cancel: "ยกเลิก" ,
      back: "ออก" 
    },

    //Color Variable
    // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
    color_back: '#2ACA9F',
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
    EventBus.$on('backFromCreate',this.startBackModal)
    EventBus.$on('backFromEdit',this.startBackModal)
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
      this.color_back = this.colorObject.modal.modal_main_color
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
        this.textLang = lang_th.components.BackFromCreateModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
        this.textLang = lang_en.components.BackFromCreateModal
      }
    },
    startBackModal(page_name) {
      this.dialog = true
      this.page_name = page_name
    },
    back() {
      this.$router.push({ 'path': '/template'})
    },
  }
}
</script>

<style>

</style>``