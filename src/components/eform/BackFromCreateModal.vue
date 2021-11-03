<template>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <!-- <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.back_document }} "{{ page_name }}"</b>
        </v-card-title> -->
        <v-card-text class="pt-6 pb-1 confirm-exit-create-form">{{ textLang.text_confirm_exit }}</v-card-text>
        <v-card-actions>
          <v-row class="exit-create-form-row">
            <v-spacer></v-spacer>
            <v-col cols="4" class="pl-0 pr-2">
              <v-btn block depressed color="#757575" dark class="cancel-exit-form-btn" @click="dialog = false">{{ textLang.cancel }}</v-btn>
            </v-col>
            <v-col cols="4" class="pl-2 pr-0">
              <v-btn block depressed color="#67C25D"  dark class="cancel-exit-form-btn" @click="back()">{{ textLang.back }}</v-btn>
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
  computed: {
    textLang() {
      return this.$store.getters.textLang.components.BackFromCreateModal
    }
  },
  data: () => ({
    dialog: false,
    page_name: '',
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
  .confirm-exit-create-form {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black !important;
    text-align: center;
  }

  .exit-create-form-row {
    width: 100%;
    margin: 0%;
  }

  .cancel-exit-form-btn {
    font-family: 'Sarabun', sans-serif;
  }
</style>