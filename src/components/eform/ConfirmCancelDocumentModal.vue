<template>
    <v-dialog v-model="dialog" persistent max-width="450">
      <v-card>
        <v-card-text class="pb-3 pt-7 cancel-form-modal-text text-center">{{ textLang.sure_delete }}{{ name_doc }}{{textLang.or_no}}</v-card-text>
        <v-card-actions class="pb-2">
          <v-row class="cancel-form-modal-row">
            <v-spacer></v-spacer>
            <v-col cols="4" md="4" lg="4" class="pl-0 pr-1">
              <v-btn depressed block dark color="#757575" @click="dialog = false" class="cancel-form-modal-btn">{{ textLang.cancel }}</v-btn>
            </v-col>
            <v-col cols="4" md="4" lg="4" class="pl-1 pr-0">
              <v-btn depressed block dark color="#67C25D" @click="summitCancel()" class="cancel-form-modal-btn">{{ textLang.yes_canel }}</v-btn>
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
    name_doc: '',
    eId: '',
    textLang: {
      confirm_delete: "ยืนยันการยกเลิกเอกสาร",
      sure_delete: "ต้องการยกเลิกเอกสาร ",
      or_no: " หรือไม่ ?",
      cancel: "ปิด",
      yes_canel: "ตกลง",
      alert_error: "ไม่สำเร็จ",
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
          backdrop: false,
          position: 'bottom-end',
          width: '330px',
          title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert_error + '</strong>',
          text: this.textLang.cancel_fail,
          showCloseButton: true,
          showConfirmButton: false,
          timer: 5000,
          customClass: {
            popup: 'alert-card',
            title: 'alert-title-block',
            closeButton: 'close-alert-btn',
            htmlContainer: 'alert-text-block'
          }
        })
        console.log(err)
      }
    },
  },
}
</script>

<style>
  .cancel-form-modal-text {
    font-family: "Sarabun", sans-serif;
    font-size: 14px;
    color: black !important;
  }

  .cancel-form-modal-row {
    width: 100%;
    margin: 0%;
  }

  .cancel-form-modal-btn {
    font-family: "Sarabun", sans-serif;
  }
</style>