<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
         <b> {{ textLang.confirm_delete }} </b>
        </v-card-title>
        <v-card-text class="pa-12 confirm-content">{{ textLang.sure_delete }}{{ name_doc }}{{textLang.or_no}}</v-card-text>
        <v-card-actions class="pt-0 pb-12">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" @click="dialog = false" class="px-12 mr-4 save-setting-btn">{{ textLang.cancel }} </v-btn>
          <v-btn depressed large color="#DC143C" @click="summitCancel()" class="px-4 ml-4 save-setting-btn save-modal-font-btn">{{ textLang.yes_canel }} </v-btn>
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
    name_doc: '',
    eId: '',
    textLang: {
      confirm_delete: "ยืนยันการยกเลิกเอกสาร",
      sure_delete: "คุณต้องการยกเลิกเอกสาร \"",
      or_no: "\" หรือไม่ ",
      cancel: "ปิด",
      yes_canel: "ยกเลิกเอกสาร",
      cancel_success: "ยกเลิกเอกสารสำเร็จ",
      cancel_fail: "ยกเลิกเอกสารไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
    }
  }),
  mounted() {
    EventBus.$on('ConfirmCancelDoc',this.ConfirmCancelDocument)
    EventBus.$on('changeLang', this.changeLange)
    this.changeLange()
  },
  beforeDestroy() {
    EventBus.$off('ConfirmCancelDoc')
    EventBus.$off('changeLang')
  },
  methods: {
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.ConfirmCancelDocumentModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.ConfirmCancelDocumentModal
      }
    },
    ConfirmCancelDocument(tempOpt) {
      this.name_doc = tempOpt.name
      this.eId = tempOpt.eform_id
      this.dialog = true
    },
    async summitCancel() {
      try {
        // this.notReady = true
        // var { data } = await this.axios.put(ApiConverterFunction.convertDoctorApi(this.$api_v6) + '/upload_eform',
        // {
        //   e_id: this.eId,
        //   status:"cancel"
        // },
        // {
        //   headers: {
        //     'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
        //   }
        // })
        // this.notReady = false
        // this.dialog = false
        // if(data.result != 'ER') {
        //   this.$swal({
        //     type: 'success',
        //     html: '<span class="alert"><b>' + this.textLang.cancel_success + '</b></span>',
        //     showCloseButton: true,
        //     showConfirmButton: false,
        //     background: 'white',
        //     position: 'top',
        //     timer: 3000,
        //     backdrop: false,
        //     customClass: {
        //       popup: 'border-success'
        //     },
        //     closeButtonHtml: '<span class="close-alert">&times;</span>'
        //   })
        //     this.$router.push({ 'path': '/my_form'})
        //   } else {
        //     this.$swal({
        //       type: 'error',
        //       html: '<span class="alert-error"><b>' + this.textLang.cancel_fail +  '</b></span>',
        //       showCloseButton: true,
        //       showConfirmButton: false,
        //       background: 'white',
        //       customClass:{
        //         popup: 'border-error'
        //       },
        //       position: 'top',
        //       timer: 3000,
        //       backdrop: false,
        //       closeButtonHtml: '<span class="close-alert-error">&times;</span>'
        //     })
        //   }
      } catch(err) {
        this.notReady = false
        this.$swal({
          type: 'error',
          html: '<span class="alert-error"><b>' + this.textLang.cancel_fail +  '</b></span>',
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
  },
}
</script>

<style>
  
</style>