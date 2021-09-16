<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
         <b> {{ textLang.confirm_delete }} {{ dialog_title }} </b>
        </v-card-title>
        <v-card-text class="pa-12 confirm-content">{{ textLang.sure_delete }} {{ dialog_item }} {{ textLang.name }}  "{{ dialog_item_name }}" {{ textLang.or }} </v-card-text>
        <v-card-actions class="pt-0 pb-12">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" @click="dialog = false" class="px-9 mr-4 save-setting-btn">{{ textLang.cancel }} </v-btn>
          <v-btn depressed large color="error" @click="deleteItem()" class="px-12 ml-4 save-setting-btn save-modal-font-btn">{{ textLang.delete }} </v-btn>
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
    dialog_title: '',
    dialog_item: '',
    dialog_item_name: '',
    template_code: '',
    textLang: {
       confirm_delete: "ยืนยันการลบ",
       sure_delete: "คุณต้องการลบ",
       name: "ที่ชื่อว่า",
       or: "หรือไม่",
       cancel: "ยกเลิก",
       delete: "ลบ",
       my_document: "เอกสารของฉัน",
       document: "เอกสาร",
       template: "รูปแบบเอกสาร E-Form",
       eform_template: "รูปแบบเอกสาร E-Form",
       structure_eform: "โครงสร้าง E-Form",
       structure: "โครงสร้าง"
    }
  }),
  mounted() {
    EventBus.$on('deleteMyForm',this.getDataDelete)
    EventBus.$on('deleteTem',this.getDataDeleteTem)
    EventBus.$on('deleteStruc',this.getDataDeleteStruc)
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
          this.textLang = lang_th.components.DeleteModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.DeleteModal
      }
    },
    getDataDelete(option) {
      this.dialog = true
      this.my_form_option = option
      this.dialog_title = this.textLang.my_document
      this.dialog_item = this.textLang.document
      this.dialog_item_name = this.my_form_option.name
    },
    deleteItem() {
      this.dialog = false
      if(this.dialog_title == 'เอกสารของฉัน' || this.dialog_title == 'My Document') {
        var option = this.my_form_option
        EventBus.$emit('toDeleteMyFormFunction',option)
      } else if(this.dialog_title == 'รูปแบบเอกสาร E-Form' || this.dialog_title == 'E-Form Template') {
        var template_code = this.template_code
        EventBus.$emit('toDeleteTemplate',template_code)
      } else if(this.dialog_title == 'โครงสร้าง E-Form' || this.dialog_title == 'E-Form Structure') {
        var template_code = this.template_code
        EventBus.$emit('toDeleteStructure',template_code)
      }
    },
    getDataDeleteTem(tem_code,tem_name) {
      this.dialog = true
      this.template_code = tem_code
      this.dialog_title = this.textLang.template
      this.dialog_item = this.textLang.eform_template
      this.dialog_item_name = tem_name
    },
    getDataDeleteStruc(struc_code,struc_name) {
      this.dialog = true
      this.template_code = struc_code
      this.dialog_title = this.textLang.structure_eform
      this.dialog_item = this.textLang.structure
      this.dialog_item_name = struc_name
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