<template>
    <v-dialog v-model="dialog" persistent max-width="450">
      <v-card>
        <v-card-text class="pb-3 pt-7 reject-form-text-modal text-center">{{ textLang.sure_reject }} {{ dialog_item_name }} {{ textLang.or }}</v-card-text>
        <v-card-actions class="pb-2">
          <v-row class="reject-modal-row">
            <v-spacer></v-spacer>
            <v-col cols="4" md="4" lg="4" class="pl-0 pr-1">
              <v-btn block depressed dark color="#757575" @click="dialog = false" class="reject-form-modal-btn">{{ textLang.cancel }}</v-btn>
            </v-col>
            <v-col cols="4" md="4" lg="4" class="pl-1 pr-0">
              <v-btn block depressed dark color="#67C25D" @click="rejectItem()" class="reject-form-modal-btn">{{ textLang.reject }}</v-btn>
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
      sure_reject: "ต้องการปฏิเสธอนุมัติเอกสาร",
      or: "หรือไม่ ?",
      cancel: "ยกเลิก",
      reject: "ตกลง",
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

  .reject-form-text-modal {
    font-family: "Sarabun", sans-serif;
    font-size: 14px;
    color: black !important;
  }

  .reject-modal-row {
    width: 100%;
    margin: 0%;
  }

  .reject-form-modal-btn {
    font-family: "Sarabun", sans-serif;
  }
</style>