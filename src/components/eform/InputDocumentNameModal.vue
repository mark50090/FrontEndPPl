<template>
    <v-dialog v-model="dialog" max-width="650px" scrollable persistent>
      <v-card>
        <v-overlay :value="notReady" absolute opacity="0.3" class="loading-content">
          <!-- <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> -->
          <v-progress-linear indeterminate rounded height="15" :background-color="color_loading_bar_bg" :color="color_loading_bar" class="loading-bar"></v-progress-linear>
        </v-overlay>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.name_document }}</b>&nbsp;<span v-if="flowPerm.length"><b>{{ textLang.order_document }}</b></span>
        </v-card-title>
        <v-card-text class="px-12 pt-5">
          <v-row>
            <v-col cols="12" md="3" lg="3" align-self="center" class="pb-0 name-document-title">
              {{ textLang.name }}
            </v-col>
            <v-col cols="12" md="9" lg="9">
              <v-text-field outlined dense hide-details class="pad-input title-name-paperless-value paperless-input-line" :color="color_name" :placeholder="textLang.please_name_document" v-model="doc_name" required></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="flowPerm.length && isCa">
            <v-col cols="12" md="3" lg="3" align-self="center" :color="color_subject" class="pb-0 name_paperless title-name-paperless">{{ textLang.subject }}</v-col>
            <v-col cols="12" md="9" lg="9">
              <v-text-field outlined dense hide-details class="pad-input title-name-paperless-value paperless-input-line" :color="color_title_name_paperless" :placeholder="textLang.no_subject" v-model="optionsPage.subject_text"></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="flowPerm.length && isCa">
            <v-col cols="12" md="3" lg="3" class="pb-0 name_paperless title-name-paperless">{{ textLang.message }}</v-col>
            <v-col cols="12" md="9" lg="9">
              <v-textarea outlined single-line dense hide-details no-resize rows="6" :color="color_message_paperless" class="pad-textarea message-paperless-row title-name-paperless-value" v-model="optionsPage.body_text"></v-textarea>
            </v-col>
          </v-row>
          <v-row v-show="flowPerm.length" class="mt-8 step-input-btn-block">
            <v-btn depressed large dark :color="color_step_show" class="step-btn" @click="step_show = !step_show">
              {{ textLang.order_filling }} 
              <v-icon v-if="step_show == false" large class="ml-12">mdi-chevron-down</v-icon>
              <v-icon v-else-if="step_show == true" large class="ml-12">mdi-chevron-up</v-icon>
            </v-btn>
          </v-row>
          <v-row v-if="step_show == true && flowPerm.length" class="step-input-all-block">
            <v-timeline align-top class="pt-11 step-input-all set-line-oopsite">
              <v-timeline-item fill-dot right icon class="btn-opposite set-time-line-justify set-time-line-mb set-timeline-divider-mb" :color="color_icon" v-for="item in flowPerm" :key="item">
                <!-- <v-tooltip top slot="opposite">                
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon color="error" v-if="item.isEdit && !(item.step_num == 1 && (item.role && item.role[0].value.name == 'all-user') && false)" @click="deleteStep(item)">
                      <v-icon>mdi-trash-can-outline</v-icon>
                   </v-btn>
                  </template>
                  <span>{{ textLang.delete_no }}  {{item.step_num}}</span>
                </v-tooltip> -->
                <template v-slot:icon>
                  <b class="number-step">{{item.step_num}}</b>
                </template>
                <!-- {{orderMessage[item.step_num]}} -->
                <v-text-field :label="orderMessage[item.step_num]" v-show="item.isEmail && !item.isRef && !item.isLeader" :readonly="!item.isEdit" outlined dense hide-details :color="color_item_email" class="mb-3 note-inputmail-label pad-input input-mail-step input-mail-box add-delete-mail-block" v-for="e in item.email" :key="e.index" v-model="e.value">
                  <template v-slot:append-outer>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn v-show="item.isEmail && !item.isRef && !item.isLeader && item.isEdit && (item.email.length >1)" v-on="on" icon small :color="color_add_delete_btn" @click="deleteStepEmail(item, e.index)">
                          <v-icon>mdi-minus-circle-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ textLang.delete_email_btn }}</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn  v-show="item.isEmail && !item.isRef && !item.isLeader && item.isEdit && (e.index == item.email.length-1)" v-on="on" icon small :color="color_add_delete_btn" @click="addStepEmail(item)">
                          <v-icon>mdi-plus-circle</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ textLang.add_email_btn }}</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
                <v-combobox :label="orderMessage[item.step_num]" v-show="item.isEmail && !item.isRef && item.isLeader" :readonly="!item.isEdit" outlined dense hide-details :color="color_item_email" class="mb-3 note-inputmail-label pad-input input-mail-step input-mail-box" v-for="e in item.email" :key="e.index" :items="leaderArray" v-model="e.value"></v-combobox>
                <v-text-field :label="orderMessage[item.step_num]" v-show="!item.isEmail && !item.isRef" readonly outlined dense hide-details :color="color_item_email" class="mb-3 note-inputmail-label pad-input input-mail-step input-mail-box" v-for="e in item.role" :key="e.index" v-model="e.value.name"></v-text-field>
                <v-text-field :label="orderMessage[item.step_num]" v-show="item.isRef" readonly outlined dense hide-details :color="color_item_email" class="mb-3 note-inputmail-label pad-input input-mail-step input-mail-box" v-model="item.ref"></v-text-field>
              </v-timeline-item>
            </v-timeline>
          </v-row>
          <v-row v-if="step_show == true && flowPerm.length && !isCa" class="mt-5 sender-paperless-row">
            <v-col cols="12" md="4" lg="4" class="px-0 pb-0 sender-paperless-title">
              {{ textLang.document_sender }}:
            </v-col>
            <v-col cols="12" md="8" lg="8" class="pl-0 pr-1 sender-peperless-block">
              <v-text-field v-show="senderPerm.isEmail == true" :readonly="!senderPerm.isEdit" outlined dense hide-details :color="color_senderPerm_email" class="mb-3 pad-input input-mail-step" v-for="e in senderPerm.email" :key="e.index" v-model="e.value"></v-text-field>
              <v-text-field v-show="senderPerm.isEmail == false" readonly outlined dense hide-details :color="color_senderPerm_email" class="mb-3 pad-input input-mail-step" v-for="e in senderPerm.role" :key="e.index" v-model="e.value.name"></v-text-field>
               <v-text-field v-show="senderPerm.isEmail == 'ref'" readonly outlined dense hide-details :color="color_senderPerm_email" class="mb-3 pad-input input-mail-step" v-model="senderPerm.ref"></v-text-field>
            </v-col>
          </v-row>
           <v-row v-show="tempFlowPerm.length && (tempFlowPerm[0].role && tempFlowPerm[0].role[0].name != 'all-user')">
            <v-col cols="12" md="3" lg="3" align-self="center" :color="color_additional" class="name-document-title padding_title">{{ textLang.additional }}</v-col>
            <v-col cols="12" md="9" lg="9">
              <v-file-input show-size dense counter multiple :color="color_paperless_file_title" :placeholder="textLang.please_attachment" class="file-input" id="file" v-model="files">
                <template v-slot:selection="{ text }">
                  <v-chip small label dark :color="color_paperless_file_title">{{ text }}</v-chip>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
        </v-card-text>  
        <v-row class="paperless-alert-row" v-if="alertTextShow"> <!-- alert input by step -->
          <v-col cols="1">
            <v-icon color="red">mdi-alert</v-icon>
          </v-col>
          <v-col cols="11">
            <span class="paperless-alert" v-html="alert_text"></span>
          </v-col>
        </v-row> 
        <v-card-actions class="pt-6 pb-12">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-12 mr-3 save-setting-btn" @click="dialog = false">{{ textLang.cancel }}</v-btn>
          <v-btn depressed large :color="color_save" :disabled="buttonClicked" class="px-8 ml-3 save-setting-btn save-modal-font-btn" @click="buttonClicked =  true, checkName()">{{ textLang.save }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>      
      </v-card>
    </v-dialog>
</template>

<script>
import { EventBus } from '../../EventBus'
export default {
  data: () => ({ 
    dialog: false,
    doc_name: '',
    flowPerm: [],
    tempFlowPerm: [],
    senderPerm: "",
    step_show: true,
    buttonClicked:false,
    textLang: {
      name_document: "ตั้งชื่อเอกสาร",
      order_document: "และลำดับการกรอกเอกสาร",
      name: "ชื่อเอกสาร:",
      please_name_document: "กรุณาตั้งชื่อเอกสาร",
      subject: "เรื่อง:",
      no_subject: "<ไม่มีหัวเรื่อง>",
      message: "ข้อความ:",
      order_filling: "ลำดับการกรอก",
      delete_no: "ลบลำดับที่",
      delete_email_btn: "ลบอีเมลผู้กรอก",
      add_email_btn: "เพิ่มอีเมลผู้กรอก",
      document_sender: "ผู้ส่งเอกสารเข้าระบบ Paperless",
      additional: "เอกสารแนบเพิ่มเติม:",
      please_attachment: "กรุณาเลือกเอกสารแนบ",
      cancel: "ยกเลิก",
      save: "บันทึกเอกสาร",
      input_doc_name: "กรุณากรอกชื่อเอกสาร",
      reference: "อ้างอิงลำดับที่ ",
      not_found_email: "ไม่พบอีเมล์ต่อไปนี้ในระบบ",
      forbidding_email_title: "ไม่สามารถใช้อีเมลต่อไปนี้ในลำดับดังกล่าวได้"
    },
    alert_text: "",
    orderMessage: {},
    files: [],
    optionsPage: {
      subject_text:"",
      service_properties: "",
      body_text: ""
    },
    isCa: false,
    currentStepCa: false,
    alertTextShow: false,
    notReady: false,
    signOnlyStep: false,
    blockEmail: ['wanchai.vach@one.th', 'morragot.ku@one.th'],
    leaderArray: [],

    //Color Variable
    // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
    color_loading_bar_bg: '#C2EB81',
    color_loading_bar: '#1b9900',
    color_name: '#2ACA9F',
    color_step_show: '#2ACA9F',
    color_icon: '#2ACA9F',
    color_item_email: '#2ACA9F',
    color_add_delete_btn: '#2ACA9F',
    color_senderPerm_email: '#2ACA9F',
    color_save: '#2ACA9F',
    color_paperless_file_title: '#2ACA9F',
    color_title_name_paperless: '#2ACA9F',
    color_message_paperless: '#2ACA9F',
    color_subject: '#2ACA9F',
    color_additional: '#2ACA9F',
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
    EventBus.$on('openInputDocName',this.openInputDocName)
    // EventBus.$on('changeLang', this.changeLange)
    EventBus.$on('saveSign', this.saveSign)
    EventBus.$on('cancelSign', this.cancelSign)
    // this.changeLange()
    // this.changeColor()
  },
  beforeDestroy() {
    EventBus.$off('changeLang')
    EventBus.$off('saveSign')
    EventBus.$off('cancelSign')
  },
  methods: {
    changeColor() {
      this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
      // this.color_dialog_header_bg = this.colorObject.modal.modal_main_color
      // $('.dialog_title').css('background-color', this.color_dialog_header_bg)
      this.color_loading_bar_bg = this.colorObject.toolbar.toolbar_bg_color1
      this.color_loading_bar = this.colorObject.main_color
      this.color_name = this.colorObject.modal.modal_main_color
      this.color_step_show = this.colorObject.modal.modal_main_color
      this.color_icon = this.colorObject.modal.modal_main_color
      this.color_item_email = this.colorObject.modal.modal_main_color
      this.color_add_delete_btn = this.colorObject.modal.modal_main_color
      this.color_senderPerm_email = this.colorObject.modal.modal_main_color
      this.color_save = this.colorObject.modal.modal_main_color
      this.color_message_paperless = this.colorObject.modal.modal_main_color
      this.color_type_paperless_title = this.colorObject.modal.modal_main_color
      this.color_subject  = this.colorObject.modal.modal_main_color
      this.color_additional = this.colorObject.modal.modal_main_color
      this.color_paperless_file_title = this.colorObject.modal.modal_main_color
      this.color_title_name_paperless = this.colorObject.modal.modal_main_color
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.InputDocumentNameModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.InputDocumentNameModal
      }
    },
    async openInputDocName(flowPermission, caStep, signOnly) {
      this.isCa = caStep
      this.signOnlyStep = signOnly
      this.currentStepCa = sessionStorage.getItem('caStep') == 'true'
      this.tempFlowPerm = flowPermission
      this.flowPerm = []
      var paperless_data = JSON.parse(sessionStorage.getItem("template_option")).paperless_data
      if(paperless_data && paperless_data.option_page) {
        this.optionsPage = paperless_data.option_page
      }
      if(!this.doc_name && this.optionsPage.subject_text) {
        this.doc_name = this.optionsPage.subject_text
      }
      // if(!this.isCa) {
      //   for(let i=0; i<flowPermission.length-1; i++) {
      //     var isEmail = false
      //     if(flowPermission[i].ref) {
      //       this.flowPerm.push({index:i, isRef:true, ref: this.textLang.reference + flowPermission[i].ref, step_num: flowPermission[i].step_num, isEdit: flowPermission[i].role[0].editable})
      //     } else if(flowPermission[i].email.length && !flowPermission[i].ref) {
      //       isEmail = true
      //       var emailList = []
      //       var indx = 0
      //       flowPermission[i].email.forEach(e => {
      //         emailList.push({index: indx, value: e})
      //         indx++
      //       })
      //       this.flowPerm.push({index:i, isEmail: isEmail, email: emailList, step_num: flowPermission[i].step_num, isEdit: flowPermission[i].role[0].editable})
      //     } else if(flowPermission[i].role.length && !flowPermission[i].ref){
      //       if(flowPermission[i].role[0].name != "" && !flowPermission[i].role.find(r => r.name == 'leader-user')) {
      //         var roleList = []
      //         var indx = 0
      //         flowPermission[i].role.forEach(e => {
      //           roleList.push({index: indx, value: e})
      //           indx++
      //         })
      //         this.flowPerm.push({index:i, isEmail: isEmail, role: roleList, step_num: flowPermission[i].step_num, isEdit: flowPermission[i].role[0].editable})
      //       } else if(flowPermission[i].role[0].name != "" && flowPermission[i].role.find(r => r.name == 'leader-user')) {
      //         await this.getLeaderArray(JSON.parse(sessionStorage.getItem('selected_business')).id_card_num).then(res => {
      //           isEmail = true
      //           var emailList = []
      //           if(res.length) {
      //             emailList.push({index:0, value:res[0]})
      //           }
      //           this.flowPerm.push({index:i, isEmail: isEmail, email: emailList, step_num: flowPermission[i].step_num, isEdit: true, isLeader: true})
      //         })
      //       }
      //     }
      //     if(typeof flowPermission[i].role[0].text !== 'undefined') {
      //       this.orderMessage[flowPermission[i].step_num] = flowPermission[i].role[0].text
      //     } else {
      //       this.orderMessage[flowPermission[i].step_num] = ""
      //     }
      //   }
      //   if(flowPermission.length) {
      //     var senderIndex = flowPermission.length-1
      //     var isEmail = false
      //     if(typeof flowPermission[senderIndex].role[0] === 'undefined'){
      //       flowPermission[senderIndex].role[0] = {name: "", editable: true}
      //     }
      //     if(flowPermission[senderIndex].ref) {
      //       isEmail = 'ref'
      //       this.senderPerm = {isEmail: isEmail, refValue: flowPermission[senderIndex].ref, ref: this.textLang.reference +  flowPermission[senderIndex].ref, isEdit:false}
      //     } else if(flowPermission[senderIndex].email.length) {
      //       isEmail = true
      //       var emailList = []
      //       var indx = 0
      //       flowPermission[senderIndex].email.forEach(e => {
      //         emailList.push({index: indx, value: e})
      //         indx++
      //       })
      //       this.senderPerm = {isEmail: isEmail, email: emailList, isEdit:flowPermission[senderIndex].role[0].editable}
      //     } else if(flowPermission[senderIndex].role.length){
      //       if(flowPermission[senderIndex].role[0].name != "") {
      //         var roleList = []
      //         var indx = 0
      //         flowPermission[senderIndex].role.forEach(e => {
      //           roleList.push({index: indx, value: e})
      //           indx++
      //         })
      //         this.senderPerm = {isEmail: isEmail, role: roleList, isEdit:flowPermission[senderIndex].role[0].editable}
      //       }
      //     } else {
      //       this.senderPerm = {isEmail: true, role: [], isEdit: true, email: [""]}
      //     }
      //   }
      // } else {
      //   for(let i=0; i<flowPermission.length; i++) {
      //     var isEmail = false
      //     if(flowPermission[i].ref) {
      //       this.flowPerm.push({index:i, isRef:true, ref: this.textLang.reference + flowPermission[i].ref, step_num: flowPermission[i].step_num, isEdit: flowPermission[i].role[0].editable})
      //     } else if(flowPermission[i].email.length && !flowPermission[i].ref) {
      //       isEmail = true
      //       var emailList = []
      //       var indx = 0
      //       flowPermission[i].email.forEach(e => {
      //         emailList.push({index: indx, value: e})
      //         indx++
      //       })
      //       this.flowPerm.push({index:i, isEmail: isEmail, email: emailList, step_num: flowPermission[i].step_num, isEdit: flowPermission[i].role[0].editable})
      //     } else if(flowPermission[i].role.length && !flowPermission[i].ref){
      //       if(flowPermission[i].role[0].name != "") {
      //         var roleList = []
      //         var indx = 0
      //         flowPermission[i].role.forEach(e => {
      //           roleList.push({index: indx, value: e})
      //           indx++
      //         })
      //         this.flowPerm.push({index:i, isEmail: isEmail, role: roleList, step_num: flowPermission[i].step_num, isEdit: flowPermission[i].role[0].editable})
      //       }
      //     }
      //     if(typeof flowPermission[i].role[0].text !== 'undefined') {
      //       this.orderMessage[flowPermission[i].step_num] = flowPermission[i].role[0].text
      //     } else {
      //       this.orderMessage[flowPermission[i].step_num] = ""
      //     }
      //   }
      // }
      // var template_code = JSON.parse(sessionStorage.getItem('template_option')).template_code
      // var speacailForm = this.$speacailForm
      // if(speacailForm.includes(template_code)) {
      //   this.checkName()
      // } else {
      //   this.dialog = true
      // }
      this.dialog = true
    },
    checkName() {
      this.alertTextShow = false
      this.alert_text = ""
      var notEnoughEmail = false
      if(this.doc_name != '') {
        var document_name = this.doc_name
        // for(let i=0; i<this.flowPerm.length; i++) {
        //   if(this.flowPerm[i].isEmail) {
        //     var emailList = []
        //     this.flowPerm[i].email.forEach(e => {
        //       e.value = e.value.toLowerCase()
        //       e.value = e.value.trim()
        //       e.value = e.value.replace(/ /g, "")
        //       e.value = e.value.replace(/[\u0E01-\u0E5B]+/g, "")
        //       e.value = e.value.split(" ").join("")
        //       if(e.value) {
        //         emailList.push(e.value)
        //       }
        //     })
        //     if(emailList.length) {
        //       this.tempFlowPerm[i].email = emailList
        //     } else {
        //       notEnoughEmail = true
        //     }
        //   }
        // }
        // if(this.tempFlowPerm.length) {
        //   if(this.senderPerm.isEmail == true) {
        //     var emailList = []
        //    this.senderPerm.email.forEach(e => {
        //       e.value = e.value.toLowerCase()
        //       e.value = e.value.trim()
        //       e.value = e.value.replace(/ /g, "")
        //       e.value = e.value.replace(/[\u0E01-\u0E5B]+/g, "")
        //       e.value = e.value.split(" ").join("")
        //       emailList.push(e.value)
        //     })
        //     var senderIndex = this.tempFlowPerm.length-1
        //     this.tempFlowPerm[senderIndex].email = emailList
        //     if(typeof emailList[0] === 'undefined' || emailList == "") {
        //       notEnoughEmail = true
        //     }
        //   } else if(this.senderPerm.isEmail == 'ref') {
        //     var senderIndex = this.tempFlowPerm.length-1
        //     this.tempFlowPerm[senderIndex].ref = this.senderPerm.refValue
        //   }
        // }

        var uploadFiles = this.files
        var opsPage = this.optionsPage
        if(this.doc_name) {
          this.optionsPage.subject_text = this.doc_name
        }
        if(!this.optionsPage.subject_text) {
          this.optionsPage.subject_text = "<ไม่มีชื่อเรื่อง>"
        }
        // if(!notEnoughEmail) {
        //   this.checkEmail(this.tempFlowPerm).then(res => {
        //     if(res) {
        //       if((this.currentStepCa || this.signOnlyStep) && sessionStorage.getItem('showDraft') != 'true') {
        //         EventBus.$emit('openSignPad')
        //       } else {
        //         this.dialog = false
        //         sessionStorage.setItem('flowPermission',JSON.stringify(this.tempFlowPerm))
        //         EventBus.$emit('getDocName', document_name, uploadFiles, opsPage)
        //       }
        //     }
        //   })
        //   this.buttonClicked = false
        // } else {
        //   this.buttonClicked =  false
        //   this.alertTextShow = true
        //   this.alert_text = "กรุณากรอก Email ให้ครบทุกลำดับ"
        // }
        this.dialog = false
        EventBus.$emit('emitSaveDocument', document_name, opsPage)
      } else {
        this.buttonClicked =  false
        this.alertTextShow = true
        this.alert_text = this.textLang.input_doc_name
      }
    },
    saveSign(sign64) {
      if(this.tempFlowPerm.length) {
        this.tempFlowPerm[0].ppl_sign_base = sign64
        var document_name = this.doc_name
        var uploadFiles = this.files
        var opsPage = this.optionsPage
        this.dialog = false
        sessionStorage.setItem('flowPermission',JSON.stringify(this.tempFlowPerm))
        // EventBus.$emit('getDocName', document_name, uploadFiles, opsPage, sign64)
      } 
    },
    cancelSign() {
      this.buttonClicked = false
    },
    deleteStep(step) {
      var indexNum = 1
      var newOrder = {}
      Object.keys(this.orderMessage).forEach(e => {
        if(e != step.step_num) {
          newOrder[String(indexNum)] = this.orderMessage[e]
          indexNum++
        }
      })
      this.orderMessage = newOrder
      var revStep = this.tempFlowPerm.find(item => item.step_num == step.step_num)
      if(revStep) {
        var indx = this.tempFlowPerm.indexOf(revStep)
        this.tempFlowPerm.splice(indx,1)
      }
      var indx = this.flowPerm.indexOf(step)
      this.flowPerm.splice(indx,1)
      for(var i=1; i<=this.flowPerm.length; i++) {
        this.tempFlowPerm[i-1].step_num = i
        this.flowPerm[i-1].step_num = i
      }
      this.tempFlowPerm[this.flowPerm.length].step_num = this.flowPerm.length + 1
      if(this.senderPerm && this.senderPerm.isEmail == 'ref') {
        if(Number(this.senderPerm.refValue) >  this.flowPerm.length) {
          this.senderPerm.refValue = this.flowPerm.length
          this.senderPerm.ref = this.textLang.reference + this.flowPerm.length
        }
      }
    },
    async checkEmail(templateFlow) {
      var checkMailArray = []
      var validEmail = true
      templateFlow.forEach(e => {
        if(!e.block_email) {
          e.block_email = []
        }
        e.email.forEach(e2 => {
          if(e2) {
            checkMailArray.push({
              oneEmail: e2.trim()
            })
            if(e.block_email.includes(e2)) {
              this.blockEmail.push(e2)
            }
          }
        })
      })
      
      if (checkMailArray.length) {
        validEmail = await this.checkOneEmail(checkMailArray)
      }
      return validEmail
    },
    async checkOneEmail(checkMailArray) {
      try {
        var blockMail = []
        var validEmail = false
        this.notReady = true
        var { data } = await this.axios.post(
          this.$api + "/checkonemail",
          checkMailArray,
          {
            headers: {
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          }
        )
        this.notReady = false
        if (data.result == "OK") {
          var dataEmail = data.messageText
          var errorMail = []
          for (let i = 0; i < dataEmail.length; i++) {
            var mailStatus = dataEmail[i].result
            if (mailStatus == "Fail")
              errorMail.push(checkMailArray[i].oneEmail)
          }
          checkMailArray.forEach(e => {
            if(this.blockEmail.includes(e.oneEmail)) {
              blockMail.push(e.oneEmail)
            }
          })
          if (errorMail.length > 0) {
            // email not found in oneid
            var msg = this.textLang.not_found_email + "<ul>"
            for (let i = 0; i < errorMail.length; i++) {
              msg = msg + "<li>" + errorMail[i] + "</li>"
            }
            msg = msg + "</ul>"
            this.alertTextShow = true
            this.alert_text = msg
          } else if (blockMail.length > 0) {
            // email not found in oneid
            var msg = this.textLang.forbidding_email_title + "<ul>"
            for (let i = 0; i < blockMail.length; i++) {
              msg = msg + "<li>" + blockMail[i] + "</li>"
            }
            msg = msg + "</ul>"
            this.buttonClicked = false
            this.alertTextShow = true
            this.alert_text = msg
          } else {
            validEmail = true;
          }
        }
        return validEmail
      } catch (error) {
        this.notReady = false
        console.log(error.message)
        return validEmail
      }
    },
    async getLeaderArray (taxId) {
      try {
          this.leaderArray = []
          var { data } = await this.axios.post(this.$api + '/get_parent',
          {
            "tax_id":taxId
          },
          {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
            }
          })
          if(data.result == 'OK') {
            this.leaderArray =  data.messageText.map(item => item.onemail)
          }
      } catch (err) {
        if (err.response != null) {
          if (err.response.status == 401) {
            this.$router.push('/login')
          }
        } else {
          console.log(err.message)
        }
      }
      return this.leaderArray
    },
    addStepEmail(step) {
      var step = this.flowPerm.indexOf(step)
      if(step >= 0) {
        this.flowPerm[step].email.push({
          index:this.flowPerm[step].email.length,
          value: ""
        })
        for(let i=0; i<this.flowPerm[step].email.length; i++) {
          this.flowPerm[step].email[i].index = i
        }
      }
    },
    deleteStepEmail(step, indx) {
      var step = this.flowPerm.indexOf(step)
      if(step >= 0) {
        this.flowPerm[step].email.splice(indx, 1)
        for(let i=0; i<this.flowPerm[step].email.length; i++) {
          this.flowPerm[step].email[i].index = i
        }
      }
    }
  }
}
</script>

<style>
  /* .dialog-width {
    max-width: 600px !important;
  } */
  .name-document-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black;
    text-align: right;
  }

  .step-input-btn-block {
    padding-left: 11%;
  }

  .step-input-all-block {
    overflow: auto;
    max-height: 265px;
    padding-left: 11%;
  }

  .step-input-all {
    width: 100%;
  }

  .set-time-line-justify {
    justify-content: flex-end !important;
  }

  .set-time-line-mb .v-timeline-item__body{
    max-width: 55% !important;
  }

  .input-mail-box .v-input__control {
    max-width: 76%;
  }

  .input-mail-step {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .sender-paperless-row {
    padding-left: 14%;
    padding-right: 14%;
  }

  .sender-paperless-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
  }

  .sender-peperless-block {
    overflow: auto;
    max-height: 163px;
  }

  .v-input.note-inputmail-label .v-label {
    left: 11px !important;
    top: 5px !important;
    line-height: 28px !important;
  }

  .btn-opposite .v-timeline-item__opposite{
    align-self: start !important;
    max-width: 5% !important;
  }

  .set-line-oopsite.v-timeline:not(.v-timeline--dense):not(.v-timeline--reverse):before {
    left: 14.5% !important;
  }

  .padding_title{
    padding-left: 10%;
    padding-right: 1%;
  }

  .name_paperless{
    padding-left: 10%;
  }

  /*========================================*/
  @media only screen and (max-width:960px){ /*css for mobile screen*/
    .v-dialog {
      margin: 13px !important;
      max-width: 600px !important;
    }

    .v-dialog__content{
      justify-content: center !important;
    }

    .dialog-head-block {
      padding-left: 3%;
      padding-right: 3%;
    }

    .name-document-title { 
      text-align: left;
    }

    .step-input-btn-block {
      padding-left: 5%;
    }

    .step-input-all-block { 
      padding-left: 5%;
      padding-right: 0%;
    }

    .step-input-all {
      width: 100%;
    }

    .add-delete-mail-block .v-input__append-outer {
      display: grid !important;
      margin-left: 0% !important;
    }

    .sender-paperless-row {
      padding-right: 0%;
    }

    .set-time-line-mb .v-timeline-item__body{
      max-width: 72% !important;
    }

    .set-timeline-divider-mb .v-timeline-item__divider{
      min-width: 58px;
    }

    .padding_title .v-application .pb-10{
      padding-bottom: 0px !important;
    }

    .padding_title{
      padding-left: 5%;
      padding-bottom: 0%;
    }

    .name_paperless{
      padding-left: 5%;
    }
  }
</style>