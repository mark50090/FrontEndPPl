<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
         <b>{{ textLang.confirm_reject}}</b>
        </v-card-title>
        <v-card-text class="pa-12 confirm-content">{{ textLang.sure_reject }} "{{ dialog_item_name }}" {{ textLang.or }}</v-card-text>
        <v-card-actions class="pt-0 pb-12">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" @click="dialog = false" class="px-9 mr-4 save-setting-btn">{{ textLang.cancel }}</v-btn>
          <v-btn depressed large color="error" @click="rejectItem()" class="px-12 ml-4 save-setting-btn save-modal-font-btn">{{ textLang.reject }}</v-btn>
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
      eform_id: ''
    },
    dialog_item_name: '',
    template_code: '',
    textLang: {
      confirm_reject: "ยืนยันการปฏิเสธอนุมัติเอกสาร",
      sure_reject: "คุณต้องการปฏิเสธอนุมัติเอกสารที่มีชื่อว่า",
      or: "หรือไม่",
      cancel: "ยกเลิก",
      reject: "ปฏิเสธอนุมัติ",
    }
  }),
  mounted() {
    EventBus.$on('rejectDocument',this.rejectConfirm)
    EventBus.$on('changeLang', this.changeLange)
    this.changeLange()
  },
  beforeDestroy() {
    EventBus.$off('changeLang')
  },
  methods: {
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.rejectModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.rejectModal
      }
    },
    rejectConfirm(option) {
      this.dialog = true
      this.my_form_option = option
      this.dialog_item_name = this.my_form_option.document_name
    },
    rejectItem() {
      this.dialog = false
      var eId = this.my_form_option.e_id
      EventBus.$emit('toRejectTemplate',eId)
    }
  }
}
</script>

<style>
  .dialog_title {
    font-family: "Sarabun", sans-serif;
    font-size: 16px !important;
    color: white;
    background-color: #2ACA9F;
    justify-content: center;
  }

  .delete-dialog-title-block {
    padding: 0%;
  }

  .dialog_text {
    font-family: "Sarabun", sans-serif;
    font-size: 16px;
    color: black !important;
    margin-top: 3%;
  }

  .button-dialog-block {
    padding-bottom: 7%;
    margin-top: 2%;
  }

  .button-dialog {
    font-family: "Sarabun", sans-serif;
    text-transform: capitalize;
  }
</style>