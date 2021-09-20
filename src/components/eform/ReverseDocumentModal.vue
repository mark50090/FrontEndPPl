<template>
    <v-dialog v-model="dialog_backStep" persistent max-width="600px">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <span><b>{{ textLang.return_doc_edit }}</b></span>
          <!-- <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog_backStep = false">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
        </v-card-title>
        <v-card-text class="pa-10">
          <v-container>
            <v-row justify="center" align="center">
              <v-col cols="12" sm="12" md="4" lg="4" class="reverse-doc-title-block">
                <span class="reverse-doc-title">{{ textLang.return_doc_to }}:</span>
              </v-col>
              <v-col cols="12" sm="12" md="8" lg="8">
                <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" class="business-box-inside icon-select autocomplete-pad icon-dropdown-modal" :items="backStepChoice" v-model="backStepTarget" :color="color_backStepChoice" :placeholder="textLang.order_return_edit"></v-autocomplete>
              </v-col>  
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0 pb-12">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark @click="dialog_backStep = false" class="px-12 mr-4 button-dialog">{{ textLang.cancel }}</v-btn>
          <v-btn depressed large color="yellow accent-4" @click="sendToBackStep()" dark class="px-10 ml-4 button-dialog">{{ textLang.send_edit }}</v-btn>
          <v-spacer></v-spacer>
          <!-- <v-btn color="blue darken-1" text @click="dialog_ppl = false">ยกเลิก</v-btn>
          <v-btn color="blue darken-1" text @click="pplUploadDocument(ppl_choosetemp)">ตกลง</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { EventBus } from '../../EventBus'
export default {
  data: () => ({
    dialog_backStep: false,
    backStepTarget: "",
    backStepChoice: [],
    textLang: {
      return_doc_edit: "ส่งเอกสารคืนเพื่อแก้ไข",
      return_doc_to: "ส่งเอกสารคืนไปยัง",
      cancel: "ยกเลิก",
      send_edit: "ส่งคืนแก้ไข",
      order_return_edit: "ลำดับที่ต้องการส่งเอกสารคืนเพื่อแก้ไข"
    },

    //Color Variable
    // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue 
    // color_dropdown_icon: '#2ACA9F !important', //class icon-dropdown-modal in SignaturePadModal.vue
    color_backStepChoice: '#2ACA9F',
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
    EventBus.$on('reverseDocument',this.getDataReverse)
    EventBus.$on('changeLang', this.changeLange)
    // this.changeColor()
    this.changeLange()
  },
  beforeDestroy() {
    EventBus.$off('changeLang')
  },
  methods: {
    changeColor() {
      this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
      // this.color_dialog_header_bg = this.colorObject.modal.modal_main_color
      // $('.dialog_title').css('background-color', this.color_dialog_header_bg)
      // this.color_dropdown_icon = this.colorObject.modal.modal_main_color + '!important'
      // $('.icon-dropdown-modal .theme--light.v-icon').css('color', this.color_dropdown_icon)
      this.color_backStepChoice = this.colorObject.modal.modal_main_color
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.ReverseDocumentModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.ReverseDocumentModal
      }
    },
    getDataReverse(backStepChoice) {
      this.backStepChoice = backStepChoice
      this.dialog_backStep = true
    },
    sendToBackStep() {
      if(this.backStepTarget) {
        this.dialog_backStep =false
        var backStepTarget = this.backStepTarget
        EventBus.$emit('toBackStep',backStepTarget)
      }
    }
  }
}
</script>

<style>
  .reverse-doc-title-block {
    text-align: center;
  }

  .reverse-doc-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black;
  }
</style>