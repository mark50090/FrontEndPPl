<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 detail-page">
      <v-row class="detail-row">
        <!-- Show PDF Part -->
        <v-col cols="12" md="6" lg="6" class="pa-2">
          <v-card elevation="0" color="rgb(82, 86, 89)" class="">
            <v-card-title class="pa-0 pdf-menu-bar">
              <v-row class="detail-row">
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="py-2">
                  <v-btn fab x-small color="white" @click="back()">
                    <v-icon size="24">mdi-reply</v-icon>
                  </v-btn>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="py-2">
                  <v-btn icon x-small color="white" @click="change_page_fn('prev')">
                    <v-icon size="16">mdi-arrow-left</v-icon>
                  </v-btn>
                  <span class="mx-1 pdf-page">{{ page }} / {{ page_count }}</span>
                  <v-btn icon x-small color="white" @click="change_page_fn('next')">
                    <v-icon size="16">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="py-0 pr-2">
                  <v-btn icon large color="white" @click="gopdf()">
                    <v-icon large>mdi-text-box-search</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="px-1 pb-1">
              <v-row align="center" justify="center" class="mt-1 detail-row pdf-block ">
                <div id="pdfBg_create">
                  <!-- pdf -->
                  <pdf
                    id="pdfDiv"
                    class="text-center"
                    :src="pdf_src"
                    @num-pages="page_count = $event"
                    @loaded="loadedPDF"
                    @page-loaded="loaded"
                    :page="page"
                    ref="pdfComponent"
                  />
                  <div
                    :id="item.name"
                    v-for="(item, index) in signArray"
                    :key="index"
                  >
                    <v-row no-gutters justify="center" align="center">
                      <span v-if="item.show == true" style="color: grey">
                        ลำดับที่ {{ item.index }}
                      </span>
                    </v-row>
                  </div>
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Document Detail Part -->
        <v-col cols="12" md="6" lg="6" class="pa-2 doc-detail-block">
          <!-- document detail card 1 -->
          <v-card outlined class="pa-1">
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-0 pb-0 doc-detail-title">
                <b>Doc ID</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-0 pb-0 doc-detail-title">
                {{ doc_details.doc_id }}
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>ชื่อไฟล์</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                {{ doc_details.file_name }}
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>ชื่อผู้ส่ง</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                {{ doc_details.sender }}
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>ส่งเมื่อ</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                {{ doc_details.create_at | fulldate}}
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>รายละเอียด</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                {{ doc_details.detail }}
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0">
                <v-btn depressed x-small dark color="#4CAF50" class="download-pdf-btn" @click="download_pdf_fn">ดาวน์โหลด PDF</v-btn>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0">
                <v-btn v-if="template_id" depressed x-small dark color="#4CAF50" class="download-pdf-btn" @click="copyDocument()">คัดลอกเอกสาร</v-btn>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0"> <!-- show when it is document detail from inbox page -->
                <v-btn @click="optionFormMail()" depressed x-small dark color="#4CAF50" class="download-pdf-btn">
                  <v-icon small>mdi-email-send-outline</v-icon>
                  <span class="ml-2">SEND EMAIL</span>
                </v-btn>
              </v-col>
              <v-col v-if="isShowRevertButton" cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0">
                <v-btn @click="optionFormReturn()" depressed x-small dark color="#FBC02D" class="return-correction-btn">
                  ส่งคืนแก้ไข
                </v-btn>
              </v-col>
              <v-col v-if="false" cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0"> <!-- show when it is document detail from sent document page -->
                <v-btn depressed x-small dark color="error" class="download-pdf-btn">ยกเลิกเอกสาร</v-btn>
              </v-col>
            </v-row>
          </v-card>
          <!-- document detail card 2 -->
          <v-card outlined class="mt-1">
            <v-card-title class="pa-0">
              <v-tabs color="#4caf50" v-model="document_detail_tab" class="doc-detail-tab">
                <v-tab class="doc-detail-tab-title">ลำดับการทำงาน</v-tab>
                <v-tab class="doc-detail-tab-title">บันทึกข้อความ</v-tab>
                <v-tab class="doc-detail-tab-title">ไฟล์แนบ</v-tab>
              </v-tabs>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0 doc-detail-tab-data">
              <v-tabs-items v-model="document_detail_tab">
                <!-- work flow tab -->
                <v-tab-item>
                  <v-timeline align-top dense>
                    <v-timeline-item fill-dot icon small color="white" v-for="(item, index) in step_flow" :key="`flow_${index}`"> <!-- each step -->
                      <template v-slot:icon> <!-- icon for each step -->
                        <v-icon v-if="item.status == 'W'" size="30" color="rgb(251, 192, 45)">mdi-clock-outline</v-icon> <!-- waiting for approve (current step) -->
                        <v-icon v-if="item.status == 'Y'" size="30" color="#4caf50">mdi-check-circle-outline</v-icon> <!-- approved -->
                        <v-icon v-if="item.status == 'R'" size="30" color="#f44336">mdi-close-circle-outline</v-icon> <!-- deny -->
                        <v-icon v-if="item.status == 'N'" size="30" color="#9e9e9e">mdi-clock-outline</v-icon> <!-- step not arrive yet -->
                      </template>
                      <v-row class="detail-row">
                        <v-col cols="3" md="2" lg="2" align-self="start" class="px-0 py-0 step-doc-title">
                          ลำดับ {{ index + 1 }}
                        </v-col>
                        <v-col cols="7" md="7" lg="7" align-self="start" class="pl-1 pr-0 py-0">
                          <v-icon small color="#0000008A" class="mr-2">mdi-timer-sand-full</v-icon>
                          <span class="step-period">{{ item.diff || '' }}</span>
                        </v-col>
                        <v-spacer></v-spacer>
                        <!--<v-col cols="auto" md="auto" lg="auto" class="pl-0 py-0 transfer-permission-btn-block"> <!-- show when it is current step and the owner of step is that user
                          <v-btn depressed fab x-small dark color="#074E80">
                            <v-icon>mdi-account-switch</v-icon>
                          </v-btn>
                        </v-col>-->
                      </v-row>
                      <v-row class="detail-row" v-for="(item_name, index_name) in item.name" :key="`flow_name_${index}${index_name}`"> <!-- each person data -->
                        <v-col cols="8" md="5" lg="5" align-self="start" class="px-0 pt-0 pb-1 step-doc-title">
                          {{ item_name }}
                          <span v-if="my_name === item_name"> (คุณ)</span> <!-- when this name is user's name -->
                        </v-col>
                        <v-col cols="auto" md="auto" lg="auto" align-self="start" class="pl-0 pr-1 pt-0 pb-1 step-status-block">
                          <span v-if="item.status == 'W'" class="wait-user-approve-status">รออนุมัติ</span> <!-- wait for approve status -->
                          <span v-if="item.status == 'Y' && item.approver.name_approver == item_name" class="approved-status">อนุมัติแล้ว</span> <!-- approved status -->
                          <span v-if="item.status == 'R' && item.approver.name_approver == item_name" class="deny-status">ปฏิเสธอนุมัติ</span> <!-- deny status -->
                        </v-col>
                        <v-col v-if="(item.status == 'Y' || item.status == 'R') && item.approver.name_approver == item_name" cols="12" md="4" lg="4" align-self="start" class="pl-2 pr-1 pt-0 pb-1 time-approve-block"> <!-- show when status is approved or deny -->
                          <v-icon small color="black" class="pr-1">mdi-timer-outline</v-icon>
                          <span class="time-approved">{{ item.approver.time_approver }}</span>
                        </v-col>
                      </v-row>
                    </v-timeline-item>
                  </v-timeline>
                </v-tab-item>
                <!-- comment tab -->
                <v-tab-item>
                  <div class="show-comment-block">
                    <template v-for="(item_comment, index_comment) in doc_details.comment"> <!-- each comment -->
                      <v-row class="detail-row" :key="`comment_${index_comment}`">
                        <v-col cols="auto" md="auto" lg="auto" align-self="start" class="px-0 pt-1 pb-0">
                          <v-icon x-large>mdi-account-circle</v-icon>
                        </v-col>
                        <v-col cols="10" md="10" lg="10" align-self="start" class="pl-0 pr-0 pt-1 pb-0">
                          <v-row class="detail-row comment-owner-name">
                            {{ item_comment.comment_by }}
                          </v-row>
                          <v-row class="mt-3 detail-row">
                            <v-card outlined class="pa-3 comment-box">
                              <pre class="comment">{{ item_comment.message_comment }}</pre>
                            </v-card>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-row align="center" justify="end" class="pr-2 detail-row" :key="`comment_time_${index_comment}`">
                        <v-btn icon color="#525659" v-if="item_comment.restore" @click="edit_comment_fn"> <!-- show when it is user's comment -->
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="#525659" v-if="item_comment.comment_by == my_name" @click="deletemessage()"> <!-- show when it is user's comment -->
                          <v-icon>mdi-delete</v-icon>
                        </v-btn> 
                        <span class="comment-time">{{ item_comment.comment_at }}</span>
                      </v-row>
                    </template>
                  </div>
                  <v-row class="detail-row" v-if="check_sign && comment_status">
                    <v-col cols="10" md="11" lg="11" class="pl-2 pr-0 py-1">
                      <v-textarea dense outlined hide-details no-resize rows="2" row-height="16" placeholder="ระบุข้อความ" color="#4CAF50" class="write-comment-box" v-model="comment"></v-textarea>
                    </v-col>
                    <v-col cols="2" md="1" lg="1" class="px-0 py-1">
                      <v-btn depressed dark block color="#4CAF50" class="px-1 send-comment-btn" @click="add_comment_fn">
                        <v-icon>mdi-send</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <!-- attach file tab -->
                <v-tab-item>
                  <v-row class="detail-row" v-if="check_sign"> <!-- show when it is current step and the owner of step is that user -->
                    <v-col cols="12" md="12" lg="12" align-self="start" class="pl-0 pr-0 py-1 ">
                      <v-file-input dense outlined counter multiple show-size small-chips placeholder="เลือกไฟล์" color="#4CAF50" class="attach-file-box" v-model="new_attachment_file">
                        <template v-slot:selection="{ text, index }">
                          <v-chip small dark close color="#4CAF50" @click:close="removeFileInput(index)">{{ text }}</v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                    <v-col cols="2" md="2" lg="2" align-self="start" class="px-1 pt-1 pb-0" v-if="false">
                      <v-btn depressed dark block color="#4CAF50" class="attach-file-btn">แนบไฟล์</v-btn>
                    </v-col>
                  </v-row>
                  <template v-for="(item,index) in attachment_file"> <!-- each attach file -->
                    <v-row class="px-2 detail-row" :key="`${index}_attachment`">
                      <v-col cols="7" md="7" lg="7" align-self="start" class="px-0 pt-1 pb-0 attached-file-name">
                        {{ item.filename }}
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="2" md="1" lg="1" align-self="start" class="px-0 pt-1 pb-0 text-center">
                        <v-btn @click="optionFormFile(item)" icon small color="#4CAF50" :disabled="chack_disable_preview_attachment_fn(item.type)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="2" md="2" lg="2" align-self="start" class="px-0 pt-1 pb-0 text-center">
                        <v-btn icon small color="#4CAF50" @click="download_attachment_fn(item.file_id)">
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-divider class="mx-2" :key="`${index}_attachment_divider`"></v-divider>
                  </template>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
          <!-- sign card -->
          <v-card outlined class="mt-1" :class="{'pb-5': !is_approve}" v-if="check_sign"> <!-- show when user have to approve in current step -->
            <v-row class="mt-4 mb-2 px-2 detail-row">
              <v-textarea dense outlined hide-details no-resize readonly label="คำอธิบาย" rows="2" color="rgb(158,158,158)" :value="doc_details.detail" class="doc-description"></v-textarea>
            </v-row>
            <v-divider></v-divider>
            <v-row class="detail-row">
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-2 pr-0 py-2">
                <v-switch inset disabled hide-details label="Certificate (CA)"  v-if="!is_approve" v-model="ca_switch" class="mt-0 ca-switch"></v-switch>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-0 pr-1 py-2">
                <v-btn depressed color="#1CC6A9" :disabled="false" class="approve-btn" @click="set_approve_fn('approve')">อนุมัติ</v-btn>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-0 pr-2 py-2">
                <v-btn depressed dark color="error" class="approve-btn" @click="set_approve_fn('reject')">ปฏิเสธ</v-btn>
              </v-col>
            </v-row>
            <template v-if="!is_approve">
              <v-divider></v-divider>
              <v-row class="detail-row">
                <!-- <v-col cols="auto" md="auto" lg="auto" class="pa-2">
                  <v-btn outlined @click="gostamp()" color="#757575">
                    <v-icon>mdi-stamper</v-icon>
                  </v-btn>
                </v-col> -->
                <v-spacer></v-spacer>
                <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-2 py-2">
                  <v-icon>mdi-draw</v-icon>
                </v-col>
                <v-col cols="4" md="3" lg="3" class="px-0 py-2">
                  <v-select dense outlined hide-details color="#4CAF50" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="all_sign_type" v-model="sign_type" class="sign-type sign-type-box sign-type-dropdown-icon"></v-select>
                </v-col>
                <v-col cols="auto" md="auto" lg="auto" class="pr-0 py-2">
                  <v-btn depressed small color="#1D9BDE" :disabled="sign_type == 'Default'" class="clear-sign-btn" @click="clearSignature()">ล้างค่า</v-btn>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
              <v-row justify="center" align="center" class="detail-row">
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pa-0 sign-block">
                  <!-- sign pad -->
                  <v-img
                    v-if="sign_type == 'Default'"
                    :src="default_sign"
                    contain
                    height="248px"
                  />
                  <vueSignature v-if="sign_type == 'Sign Pad'" ref="signaturePad" :sigOption="{ ...signature_option,onBegin,onEnd }" w="490" h="250" class="sign-pad-box"></vueSignature>
                </v-col>
              </v-row>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <StampModal/>
    <showFormMail/>
    <showFromFile/>
    <Showpdf/>
    <showFormReturn/>
    <DeleteMessage/>
  </div>
</template>

<script>
import { EventBus } from '../EventBus'
import StampModal from '../components/StampModal'
import showFormMail from '../components/SendMail'
import showFromFile from '../components/Attachments'
import Showpdf from '../components/ShowPdf'
import pdf from 'vue-pdf'
import vueSignature from 'vue-signature'
import showFormReturn from '../components/ReturnCorrection'
import DeleteMessage from '../components/DeleteMessage'
export default {
  components: {
    StampModal,
    showFormMail,
    showFromFile,
    Showpdf,
    pdf,
    vueSignature,
    showFormReturn,
    DeleteMessage
  },
  data: () => ({
    document_detail_tab: null,
    document_description: 'อธิบายอะไรก็ไม่รู้',
    ca_switch: true,
    all_sign_type: ['Default', 'Sign Pad'],
    sign_type: 'Default',
    page_count: 0,
    page: 1,
    doc_details: {
      document_status: null
    },
    new_attachment_file: [],
    attachment_file: [],
    pdf_src: '',
    token: '',
    transaction_id: '',
    default_sign: '',
    signature_option: {
      penColor: 'rgb(13, 38, 154)',
      backgroundColor: 'rgba(255,255,255,0)'
    },
    padStatus: false,
    allStatus: [],
    sign_position: [],
    signArray: [],
    step_flow: [],
    my_name: '',
    axios_pending: 0,
    check_sign: false,
    comment: '',
    comment_status: true,
    last_step: 0,
    template_id: "",
    is_approve: false,
    isShowRevertButton: true
  }),
  computed: {
  },
  mounted () {
    this.token = sessionStorage.getItem('access_token')
    this.my_name = sessionStorage.getItem('name')
    this.transaction_id = sessionStorage.getItem('transaction_id')
    this.getTemplateId(this.transaction_id )
    if (!this.transaction_id) {
      this.$router.replace({ name: 'inbox' })
      return
    }
    this.get_detail_fn()
    this.get_attachment_file_fn()
    this.get_signature_default_fn()
    EventBus.$on('confirm_deletemessage',this.delete_comment_fn)
  },
  watch: {
    axios_pending (val) {
      if (val > 0) EventBus.$emit('loadingOverlay', true)
      else EventBus.$emit('loadingOverlay', false)
    },
    new_attachment_file (val) {
      for (let index = 0; index < val.length; index++) {
        const element = val[index]
        if (element.size > 31457280) {
          this.removeFileInput(index)
          alert(`ไม่อนุญาตให้อัปโหลดไฟล์ "${element.name}" เนื่องจากมีขนาดเกิน 30 MB`)
        }
      }
    }
  },
  methods: {
    optionFormReturn() {
      EventBus.$emit('FormReturn',this.transaction_detail)
    },
    optionFormMail() {
      EventBus.$emit('FormMail')
    },
    optionFormFile(file) {
      const url = `${this.$api_url}/file-component/api/getComponentFile`
      const config = {
        Authorization: `Bearer ${this.token}`,
        responseType: 'blob',
        params: {
          file_id: file.file_id
        }
      }
      this.axios_pending++
      this.axios.get(url, config)
        .then((response) => {
          EventBus.$emit('FormFile', response.data, file.type, file.filename)
        })
        .catch((error) => {
          // console.log(error)
        })
        .then(() => {
          this.axios_pending--
        })
    },
    gostamp() {
      EventBus.$emit('stamp')
    },
    gopdf() {
      EventBus.$emit('showpdf', this.pdf_src)
    },  
    back() {
      this.$router.back();
    },
    deletemessage () {
        EventBus.$emit('deletemessage')
    },
    change_page_fn(type) {
      switch (type) {
        case 'next':
          if(this.page < this.page_count)
            this.page++
          break
        case 'prev':
          if(this.page > 1)
            this.page--
          break
      }
    },
    chack_disable_preview_attachment_fn (type) {
      const allow = 'jpg,jpeg,gif,png,pdf'
      if (allow.indexOf(type.toLowerCase()) >= 0) return false
      else return true
    },
    download_pdf_fn () {
      let a = document.createElement('a') // Create <a>
      a.href = this.pdf_src // Image Base64 Goes here
      a.download = this.doc_details.file_name // File name Here
      a.click() // Downloaded file
    },
    download_attachment_fn (file_id) {
      window.open(`${this.$api_url}/file-component/api/downloadFile?file_id=${file_id}`)
    },
    convertDateTime () {
      let datenow = new Date()
      var todate = new Date(datenow).getDate()
      var tomonth = new Date(datenow).getMonth() + 1
      var toyear = new Date(datenow).getFullYear()
      var toHours = new Date(datenow).getHours()
      var toMinutes = new Date(datenow).getMinutes()
      var toSecond = new Date(datenow).getSeconds()

      var date = todate.toString().length == 1 ? '0' + todate.toString() : todate
      var month = tomonth.toString().length == 1 ? '0' + tomonth.toString() : tomonth
      var Hours = toHours.toString().length == 1 ? '0' + toHours.toString() : toHours
      var Minutes = toMinutes.toString().length == 1 ? '0' + toMinutes.toString() : toMinutes
      var Second = toSecond.toString().length == 1 ? '0' + toSecond.toString() : toSecond

      var setDateTime = toyear + '-' + month + '-' + date + ' ' + Hours + ':' + Minutes + ':' + Second

      return setDateTime
    },
    removeFileInput (index) {
      if (index > -1) {
        this.new_attachment_file.splice(index, 1)
      }
    },
    add_comment_fn () {
      let data_comment = {
        comment_by: this.my_name,
        comment_at: this.convertDateTime(),
        message_comment: this.comment,
        restore: true
      }
      this.doc_details.comment.push(data_comment)
      this.comment_status = false
    },
    edit_comment_fn () {
      this.doc_details.comment.pop()
      this.comment_status = true
    },
    delete_comment_fn () {
      this.doc_details.comment.pop()
      this.comment_status = true
      this.comment = ''
    },
    async set_approve_fn(type) {
      var string_sign, data
      if (this.sign_type === 'Sign Pad') {
        string_sign = this.$refs.signaturePad.save().split(',')[1]
      } else {
        string_sign = this.default_sign.split(',')[1]
      }
      data = {
        type: type,
        transaction_id: this.doc_details.transaction_id,
        document_id: this.doc_details.doc_id,
        tracking: this.doc_details.tracking,
        step_index: this.doc_details.step_index,
        action: this.doc_details.action,
        string_sign: string_sign,
        comment: !this.comment_status ? this.comment : null,
        typesign: 'web'
      }
      // console.log(data)
      if (this.new_attachment_file.length > 0) this.upload_attachment()
      const url = '/transaction/api/v1/updatetransaction'
      const config = {
        Authorization: `Bearer ${this.token}`
      }
      this.axios_pending++
      this.axios.put(`${this.$api_url}${url}`, data, config)
        .then((response) => {
          // console.log(response.data)
          if (response.data.status) {
            if (type === 'approve') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">สำเร็จ</strong>',
                text: 'อนุมัติเอกสารสำเร็จ',
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
            } else if (type === 'reject') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">สำเร็จ</strong>',
                text: 'ปฏิเสธเอกสารสำเร็จ',
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
            }
            this.$router.replace({ name: 'inbox' })
          }
        })
        .catch((error) => {
          // console.log(error)
        })
        .then(() => {
          this.axios_pending--
        })
    },
    async upload_attachment () {
      const url = '/file-component/api/saveFile'
      const config = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${this.token}`
      }
      var formData = new FormData()
      formData.append('transaction_id', this.transaction_id)
      for (let index = 0; index < this.new_attachment_file.length; index++) {
        const element = this.new_attachment_file[index]
        formData.append('file', element)
      }
      this.axios.post(`${this.$api_url}${url}`, formData, config)
        .then(response => {
          // console.log('input', response)
        })
        .catch(error => {
          // console.log(error)
        })
    },
    async getTemplateId(transaction_id) {
      var {data} = await this.axios.get(`${this.$api_url}/template_form/api/v1/is_eform_by_id?transaction_id=${transaction_id}`)
      if(data.status) {
        this.template_id = data.result.template_id
      }
    },
    async get_detail_fn() {
      const url = `/transaction/api/v1/detailTransaction?transaction_id=${this.transaction_id}`
      const config = {
        Authorization: `Bearer ${this.token}`
      }
      this.axios_pending++
      this.axios.get(`${this.$api_url}${url}`, config)
        .then((response) => {
          const data = response.data
          if (data.status) {
            const doc_data = data.data
            this.transaction_detail = doc_data
            doc_data.flow_step.forEach(element => {
              if(element.status == 'W'){
                this.isShowRevertButton = element.name.includes(sessionStorage.getItem('name'))
              }
            });
            if(data.data.flow_step[0].status == "W" || data.data.document_status == "Y" || data.data.document_status == "R") {
              this.isShowRevertButton = false
            }
            this.allStatus = doc_data.flow_step.map(
              (element) => element.send_update.action.toLowerCase() === 'sign' || element.send_update.action.toLowerCase() === 'sign-ca'
            )
            const find_w = doc_data.flow_step.findIndex((element) => element.status.toLowerCase() === 'w')
            if (find_w > -1) {
              this.last_step = find_w
              const find_name_in_w = doc_data.flow_step[find_w].name.findIndex((element) => element === this.my_name)
              if (find_name_in_w > -1 && this.$route.name === 'document_detail') {
                this.check_sign = true
                this.ca_switch = doc_data.flow_step[find_w].send_update.action.toLowerCase() === 'sign-ca'
                this.is_approve = doc_data.flow_step[find_w].send_update.action.toLowerCase() === 'approve'
              }
            }else{
              this.last_step = doc_data.flow_step.length
            }
            this.doc_details.transaction_id = doc_data.transaction_id
            this.doc_details.doc_id = doc_data.doc_id
            this.doc_details.sender = doc_data.sender
            this.doc_details.detail = doc_data.detail
            this.doc_details.tracking = doc_data.tracking
            this.doc_details.create_at = doc_data.create_at
            this.doc_details.file_name = doc_data.file_name
            this.doc_details.comment = doc_data.comment
            // console.log(this.last_step)
            this.doc_details.step_index = doc_data.flow_step.length != this.last_step ? doc_data.flow_step[this.last_step].send_update.step_index : null
            this.doc_details.action = doc_data.flow_step.length != this.last_step ? doc_data.flow_step[this.last_step].send_update.action : null
            for (let index = 0; index < doc_data.flow_step.length; index++) {
              const element = doc_data.flow_step[index]
              this.sign_position.push(element.sign_position)
              this.step_flow.push(element)
            }
            this.pdf_src = `data:application/pdf;base64,${data.data.pdfbase}`
          }
        })
        .catch((error) => {
          // console.log(error)
          if (error.response) {
            const errResponse = error.response.data
            if (errResponse.message === 'error read pdf') {
              this.error_swal_fn('ไม่สามารถอ่าน PDF ได้')
            } else {
              this.error_swal_fn(errResponse.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
            }
            this.$router.replace({ name: 'inbox' })
          }
        })
        .then(() => {
          this.axios_pending--
        })
    },
    error_swal_fn (msg = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง') {
      this.$swal({
        backdrop: false,
        position: 'bottom-end',
        width: '330px',
        title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">ล้มเหลว</strong>',
        text: msg,
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
    },
    async get_attachment_file_fn () {
      const url = `/file-component/api/getListFile?transaction_id=${this.transaction_id}`
      const config = {
        Authorization: `Bearer ${this.token}`
      }
      this.axios_pending++
      this.axios.get(`${this.$api_url}${url}`, config)
        .then((response) => {
          const data = response.data
          if (data.status) {
            this.attachment_file = data.data
          }
        })
        .catch((error) => {
          // console.log(error)
        })
        .then(() => {
          this.axios_pending--
        })
    },
    async get_signature_default_fn () {
      const url = '/signature/api/v1/image?credentialId=DEFAULT'
      const config = {
        Authorization: `Bearer ${this.token}`
      }
      this.axios_pending++
      this.axios.get(`${this.$api_url}${url}`, config)
        .then((response) => {
          const data = response.data
          if (data.status) {
            if (data.data[0]) this.default_sign = `data:image/png;base64,${data.data[0]}`
            else {
              this.sign_type = 'Sign Pad'
              this.all_sign_type = ['Sign Pad']
            }
          }
        })
        .catch((error) => {
          // console.log(error)
        })
        .then(() => {
          this.axios_pending--
        })
    },
    onBegin () {
      this.padStatus = true
    },
    onEnd () {
    },
    clearSignature () {
      if (this.sign_type === 'Sign Pad') { this.$refs.signaturePad.clear() }
      this.padStatus = false
    },
    loadedPDF () {
      this.sign_position = this.sign_position.map((element) => {
        if (element.sign_page !== 'all') {
          element.sign_page = (typeof element.sign_page === 'string' ? element.sign_page : element.sign_page.toString()).split(',')
          for (var i = 0; i < element.sign_page.length; i++) { element.sign_page[i] = +element.sign_page[i] }
        } else element.sign_page = Array.from({ length: this.page_count }, (_, i) => i + 1)
        return element
      })
      // this.setPreViewImg()
    },
    loaded: function (e) {
      this.reShowSign(this.sign_position)
    },
    reShowSign(data) {
      this.signArray = []
      for (let index = 0; index < data.length; index++) {
        if (index == this.focusNoArr) this.signPage = data[index].sign_page
        let step_array = this.signArray.length
        this.signArray.push({
          index: step_array + 1,
          name: 'draggableDiv' + String(step_array + 1),
          show: false,
          sign_page: data[index].sign_page,
        })
        setTimeout(() => {
          if (
            this.signArray[step_array].sign_page.findIndex(
              (item) => item == this.page
            ) >= 0 &&
            this.allStatus[step_array]
          ) {
            this.multiShow(step_array + 1, this.allStatus[index])
            this.setPositionSign(
              this.signArray[index].index,
              data[index].sign_llx,
              data[index].sign_lly,
              data[index].sign_urx,
              data[index].sign_ury
            )
            // this.addEventResize(step_array + 1, this.allStatus[index]);
          } else {
            // // console.log("sign_page != page", JSON.stringify(data[index]));
            this.multiShow(step_array + 1, false)
            this.setPositionSign(
              this.signArray[index].index,
              data[index].sign_llx,
              data[index].sign_lly,
              data[index].sign_urx,
              data[index].sign_ury
            )
            // this.addEventResize(step_array + 1, false);
          }
        }, 100)
      }
    },
    setPreViewImg () {
      // // console.log("setPreViewImg start");
      this.signArray = []
      for (let index = 0; index < this.sign_position.length; index++) {
        this.createSign()
      }
      this.$nextTick(function () {
        this.changePageSign(this.sign_position)
      })
    },
    changePageSign (data) {
      for (let index = 0; index < this.sign_position.length; index++) {
        setTimeout(() => {
          if (
            this.signArray[index].sign_page.findIndex(
              (item) => item == this.page
            ) >= 0 &&
            this.allStatus[index]
          ) {
            this.multiShow(index + 1, this.allStatus[index])
            this.setPositionSign(
              this.signArray[index].index,
              data[index].sign_llx,
              data[index].sign_lly,
              data[index].sign_urx,
              data[index].sign_ury
            )
            // this.addEventResize(index + 1, this.allStatus[index])
          } else {
            this.multiShow(index + 1, false)
            this.setPositionSign(
              this.signArray[index].index,
              data[index].sign_llx,
              data[index].sign_lly,
              data[index].sign_urx,
              data[index].sign_ury
            )
            // this.addEventResize(index + 1, false)
          }
        }, 400)
      }
    },
    createSign () {
      const step_array = this.signArray.length
      this.signArray.push({
        index: step_array + 1,
        name: 'draggableDiv' + String(step_array + 1),
        show: false,
        sign_page: this.sign_position[step_array].sign_page
      })
      setTimeout(() => {
        if (
          this.signArray[step_array].sign_page.findIndex(
            (item) => item == this.page
          ) >= 0 &&
            this.allStatus[step_array]
        ) {
          this.multiShow(step_array + 1, this.allStatus[step_array])
          // this.addEventResize(step_array + 1, this.allStatus[step_array])
        } else {
          this.multiShow(step_array + 1, false)
          // this.addEventResize(step_array + 1, false)
        }
      }, 400)
    },
    multiShow (index, status) {
      this.signArray[index - 1].show = status
      $('#draggableDiv' + index).css('cursor', 'context-menu')
      $('#draggableDiv' + index).css('position', 'absolute')
      $('#draggableDiv' + index).css('height', '33px')
      $('#draggableDiv' + index).css('width', '50px')
      $('#draggableDiv' + index).css(
        'background-color',
        'rgba(83, 186, 71, 0.2)'
      )
      $('#draggableDiv' + index).css('border', '1.2px dashed grey')
      $('#draggableDiv' + index).css('color', 'white')
      $('#draggableDiv' + index).css('text-align', 'center')
      $('#draggableDiv' + index).css('margin', '1px')
      if (status && this.last_step < index) {
        $('#draggableDiv' + index).css('display', 'block')
        $('#draggableDiv' + index).css('z-index', 5)
        $('#draggableDiv' + index).css('opacity', 1)
        // this.setSigntemplate(index)
      } else $('#draggableDiv' + index).css('display', 'none')
    },
    setSigntemplate (index) {
      this.setPdfAreaMulti(index)
    },
    setPdfAreaMulti (index) {
      // // console.log("setPdfAreaMulti index:", index);
      try {
        var clientHeight = document.getElementById('pdfDiv').clientHeight
        var clientWidth = document.getElementById('pdfDiv').clientWidth
        var element = document.getElementById('pdfDiv')
        var rect = element.getBoundingClientRect()
        // element.addEventListener("click", this.mouseIsMoving);

        var elementLeft, elementTop, elementRight, elementBot // x and y

        var scrollTop = document.documentElement.scrollTop
          ? document.documentElement.scrollTop
          : document.body.scrollTop
        var scrollLeft = document.documentElement.scrollLeft
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft

        elementTop = rect.top
        elementLeft = rect.left
        elementRight = rect.right
        elementBot = rect.bottom

        var xMin = elementLeft
        var xMax = elementRight
        var yMin = elementTop
        var yMax = elementBot
        this.getSignAreaMulti(xMin, xMax, yMin, yMax, index)
      } catch (error) {
        // console.error("ล้มเหลว", error);
      }
    },
    getSignAreaMulti (xMin, xMax, yMin, yMax, index) {
      // // console.log("getSignAreaMulti index:", index);
      var element = document.getElementById('draggableDiv' + index)
      var rect = element.getBoundingClientRect()

      var elementLeft, elementTop, elementRight, elementBot // x and y

      var scrollTop = document.documentElement.scrollTop
        ? document.documentElement.scrollTop
        : document.body.scrollTop
      var scrollLeft = document.documentElement.scrollLeft
        ? document.documentElement.scrollLeft
        : document.body.scrollLeft
      elementTop = rect.top
      elementLeft = rect.left
      elementRight = rect.right
      elementBot = rect.bottom

      // // console.log("getSignAreaMulti left " + elementLeft);
      // // console.log("getSignAreaMulti top " + elementTop);
      // // console.log("getSignAreaMulti right " + elementRight);
      // // console.log("getSignAreaMulti bot " + elementBot);

      var xMinSign = elementLeft
      var xMaxSign = this.stringBefore(elementRight.toString(), '.')
      var yMinSign = this.stringBefore(elementTop.toString(), '.')
      var yMaxSign = elementBot
      this.getSignResultMulti(
        xMinSign,
        xMaxSign,
        xMin,
        xMax,
        yMaxSign,
        yMinSign,
        yMin,
        yMax,
        index
      )
    },
    getSignResultMulti (
      xMinSign,
      xMaxSign,
      xMin,
      xMax,
      yMaxSign,
      yMinSign,
      yMin,
      yMax,
      index
    ) {
      // // console.log("getSignResultMulti index:", index);
      // // console.log("xMinSign", xMinSign);
      // // console.log("xMin", xMin);
      // // console.log("xMax", xMax);
      var lly = this.getPercent(yMaxSign, yMin, yMax)
      var sign_llx = this.getPercent(xMinSign, xMin, xMax)
      var sign_lly = parseFloat(100 - lly)
      // // console.log("sign_llx", sign_llx);
      // // console.log("sign_lly", sign_lly);

      var sign_urx = this.getPercentAll(xMinSign, xMaxSign, xMin, xMax)
      var sign_ury = this.getPercentAll(yMinSign, yMaxSign, yMin, yMax)
      // // console.log("sign_urx", sign_urx);
      // // console.log("sign_ury", sign_ury);

      sign_llx = (sign_llx * 0.01).toFixed(3)
      sign_lly = (sign_lly * 0.01).toFixed(3)
      sign_urx = (sign_urx * 0.01).toFixed(3)
      sign_ury = (sign_ury * 0.01).toFixed(3)

      var index_array = parseInt(index) - 1
      //   this.tempSign[index_array] = {
      //     sign_llx: sign_llx,
      //     sign_lly: sign_lly,
      //     sign_urx: sign_urx,
      //     sign_ury: sign_ury,
      //     sign_page: this.signArray[index_array].sign_page,
      //     status: "incomplete",
      //   };
      this.sign_position[index_array] = {
        sign_llx: sign_llx,
        sign_lly: sign_lly,
        sign_urx: sign_urx,
        sign_ury: sign_ury,
        sign_page: this.signArray[index_array].sign_page
      }

      // // console.log(this.preData);
      // // console.log(this.signArray);
    },
    setPositionSign(index, llx, lly, urx, ury) {
      // console.log('position' + index)
      // // console.log(`llx: ${llx}\nlly: ${lly}\nurx: ${urx}\nury: ${ury}`)
      var arr_index = index - 1

      // MainFunction.ShowLog("sign "+index+" row(llx) "+llx)
      // MainFunction.ShowLog("sign "+index+" column(lly) "+lly)
      // MainFunction.ShowLog("sign "+index+" row(llx) "+urx)
      // MainFunction.ShowLog("sign "+index+" column(lly) "+ury)

      var cardWidth = $('#pdfBg_create')[0].getBoundingClientRect().width
      var cardHeight = $('#pdfBg_create')[0].getBoundingClientRect().height

      var clientWidth = $('#pdfDiv')[0].getBoundingClientRect().width
      var clientHeight = $('#pdfDiv')[0].getBoundingClientRect().height

      // //// console.log(cardWidth)
      // //// console.log(cardHeight)

      // //// console.log(clientWidth)
      // //// console.log(clientHeight)

      // var clientHeight = clientWidth * 141.5805606367726
      // clientHeight = parseFloat(clientHeight) / 100
      // clientHeight = parseFloat(clientHeight.toFixed(2))

      // MainFunction.ShowLog("cardWidth "+cardWidth)
      // MainFunction.ShowLog("cardHeight "+cardHeight)
      // MainFunction.ShowLog("clientWidth "+clientWidth)
      // MainFunction.ShowLog("clientHeight "+clientHeight)

      var _pxdraggableDivHeight = clientHeight * parseFloat(ury)
      var _pxdraggableDivWidth = clientWidth * parseFloat(urx)

      // var setWidth  =  (parseFloat(cardWidth)  - parseFloat(clientWidth)) / 2
      // var setHeight =  (parseFloat(cardHeight) - parseFloat(clientHeight)) / 2

      // setWidth  = setWidth  + (clientWidth * llx)
      // setHeight = setHeight + (clientHeight * lly)

      var setWidth = parseFloat(clientWidth) * llx
      var setHeight = parseFloat(clientHeight) * lly

      // MainFunction.ShowLog("setWidth "+setWidth)
      // MainFunction.ShowLog("setHeight "+setHeight)
      document.getElementById('draggableDiv' + index).style.height =
        _pxdraggableDivHeight.toFixed(2) + 'px'
      document.getElementById('draggableDiv' + index).style.width =
        _pxdraggableDivWidth.toFixed(2) + 'px'

      document
        .getElementById('draggableDiv' + index)
        .style.removeProperty('top')
      document.getElementById('draggableDiv' + index).style.left =
        setWidth + 'px'
      document.getElementById('draggableDiv' + index).style.bottom =
        setHeight + 'px'
      //  document.getElementById("draggableDiv"+index).style.left   =  0 +"px"
      //  document.getElementById("draggableDiv"+index).style.bottom =  0 +"px"

      //   var cardWidth = $("#pdfBg_create")[0].clientWidth;
      //   var cardHeight = $("#pdfBg_create")[0].clientHeight;

      //   var clientWidth = $("#pdfDiv")[0].getBoundingClientRect().width;
      //   var clientHeight = $("#pdfDiv")[0].getBoundingClientRect().height;

      //   //   clientWidth = parseFloat(clientWidth.toFixed(2));
      //   //   clientHeight = parseFloat(clientHeight.toFixed(2));

      //   var _pxdraggableDivHeight = clientHeight * parseFloat(ury);
      //   var _pxdraggableDivWidth = clientWidth * parseFloat(urx);

      //   var setWidth = parseFloat(clientWidth) * llx;
      //   var setHeight = parseFloat(clientHeight) * lly;

      //   //// console.log("setWidth", setWidth);
      //   //// console.log("setHeight", setHeight);

      //   var dragWidth = clientWidth * urx;
      //   var dragHeight = clientHeight * ury;

      //   document.getElementById("draggableDiv" + index).style.height =
      //     _pxdraggableDivHeight.toFixed(2) + "px";
      //   document.getElementById("draggableDiv" + index).style.width =
      //     _pxdraggableDivWidth.toFixed(2) + "px";

      //   document.getElementById("draggableDiv" + index).style.left =
      //     setWidth.toFixed(2) + "px";
      //   document.getElementById("draggableDiv" + index).style.bottom =
      //     setHeight.toFixed(2) + "px";

      //   this.tempSign[arr_index].sign_llx = llx;
      //   this.tempSign[arr_index].sign_lly = lly;
      //   this.tempSign[arr_index].sign_urx = urx;
      //   this.tempSign[arr_index].sign_ury = ury;

      this.sign_position[arr_index].sign_llx = llx
      this.sign_position[arr_index].sign_lly = lly
      this.sign_position[arr_index].sign_urx = urx
      this.sign_position[arr_index].sign_ury = ury
      //   //// console.log("cardWidth", cardWidth);
      //   //// console.log("cardHeight", cardHeight);
      //   //// console.log("clientWidth", clientWidth);
      //   //// console.log("clientHeight", clientHeight);
      //   //// console.log("dragWidth", dragWidth);
      //   //// console.log("dragHeight", dragHeight);
    },
    getPercent (data, min, max) {
      var itemlength = parseFloat(max) - parseFloat(min)
      var itemdata = parseFloat(data) - parseFloat(min)
      var itemresult = (itemdata * 100) / itemlength
      return parseFloat(itemresult).toFixed(3)
    },
    getPercentAll (mindata, maxdata, min, max) {
      var itemlength = parseInt(max) - parseInt(min)
      var itemdata = parseInt(maxdata) - parseInt(mindata)
      var itemresult = (itemdata * 100) / itemlength
      return parseFloat(itemresult).toFixed(3)
    },
    copyDocument() {
      let tempOption = {
        template_id: this.template_id,
        isCopy: true,
        isImport: false,
        transaction_id: this.transaction_id
      }
      sessionStorage.setItem('option',JSON.stringify(tempOption))
      sessionStorage.setItem('isDocEdit',false)
      sessionStorage.setItem('isDocStep',true)
      sessionStorage.setItem('isBack',false)
      sessionStorage.setItem('isStep',false)
      sessionStorage.setItem('isOnlyForm',true)
      this.$router.push({ 'path': '/form/input'})
    },
    stringBefore (string, item) {
      var strbefore = string.split(item)[0]
      return strbefore
    }
  },
  beforeDestroy () {
    sessionStorage.removeItem('transaction_id')
    EventBus.$off('confirm_deletemessage')
  }
}
</script>

<style>
  #pdfBg_create {
    position: relative;
    z-index: 0;
    overflow-y: auto;
    overflow-x: hidden;
    width: 90%;
    text-align: center;
    /* height: 100vh; */
    /* height: calc(100vh - 148px); */
    background: #525659;
    /* padding-top: 10px;
      padding-bottom: 10px; */
    /* position: fixed; */
  }

  #pdfDiv {
    position: absolute;
    /* z-index: 1;
    width: 70vw;
    max-width: 700px; */
    /* width:   70%; */
    /* border: 1px solid black; */
  }

  .detail-page {
    height: calc(100vh - 72px);
  }

  .detail-row {
    width: 100%;
    margin: 0% !important;
  }

  .pdf-menu-bar {
    background: rgb(50, 54, 57);
  }

  .pdf-page {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: white;
  }

  .pdf-block {
    height: calc(100vh - 148px);
    overflow: auto;
  }

  .doc-detail-block {
    height: calc(100vh - 76px);
    overflow: auto;
  }

  .doc-detail-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .download-pdf-btn {
    font-family: 'Sarabun', sans-serif;
  }

  .return-correction-btn {
    font-family: 'Sarabun', sans-serif;
  }

  .doc-detail-tab-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .doc-detail-tab-data {
    height: calc(39vh);
    overflow: auto;
  }

  .step-doc-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
  }

  .step-period {
    font-family: 'Sarabun', sans-serif;
    font-size: 12px;
    color: black;
  }

  .step-status-block {
    margin-left: 8%;
  }

  .wait-user-approve-status {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
    color: #FBC02D;
  }

  .approved-status {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
    color: #008000;
  }

  .deny-status {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
    color: #FF0000;
  }

  .time-approved {
    font-family: 'Sarabun', sans-serif;
    font-size: 11px;
    color: black;
  }

  .show-comment-block {
    height: calc(32vh);
    overflow: auto;
  }

  .comment-owner-name {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
  }

  .comment-box {
    width: 100%;
  }

  .comment {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    white-space: pre-wrap;
  }

  .comment-time {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
    color: #808080;
  }

  .write-comment-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 12px;
  }

  .write-comment-box.v-textarea textarea {
    margin-top: 1% !important;
    line-height: 20px !important;
  }

  .send-comment-btn {
    height: 100% !important;
  }

  .attach-file-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .attach-file-btn {
    font-family: 'Sarabun', sans-serif;
    padding-left: 2% !important;
    padding-right: 2% !important;
  }

  .attached-file-name {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: #808080;
  }

  .doc-description {
    font-family: 'Sarabun', sans-serif;
    font-size: 12px;
  }

  .doc-description.v-textarea textarea {
    margin-top: 2% !important;
    line-height: 20px !important;
  }

  .ca-switch {
    font-family: 'Sarabun', sans-serif;
  }

  .approve-btn {
    font-family: 'Sarabun', sans-serif;
    color: white !important;
  }

  .sign-type {
    font-family: 'Sarabun', sans-serif;
    font-size: 12px;
  }

  .sign-type-dropdown-icon.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
    margin-top: 2px !important;
  }

  .sign-type-dropdown-icon .theme--light.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
  }

  .sign-type-box.v-text-field--outlined.v-input--dense.v-text-field--outlined>.v-input__control>.v-input__slot {
    min-height: 28px !important;
    height: 28px;
  }

  .clear-sign-btn {
    font-family: 'Sarabun', sans-serif;
    color: white !important;
  }

  .sign-block {
    border: 1px solid lightgray;
    border-radius: 4px;
    height: 250px;
    width: 490px;
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .sign-pad-box {
    width: 100%;
    height: 100%;
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .detail-page {
      height: calc(100vh - 64px);
      overflow: auto;
    }

    .pdf-block {
      height: calc(100vh - 319px);
    }

    .doc-detail-block {
      height: unset;
    }

    .doc-detail-tab.v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev {
      display: none !important;
    }

    .doc-detail-tab-title {
      font-size: 13px;
    }

    .doc-detail-tab-data {
      height: calc(50vh);
    }

    .transfer-permission-btn-block {
      padding-right: 2% !important;
    }

    .step-status-block {
      margin-left: 4%;
    }

    .time-approve-block {
      text-align: right;
    }

    .show-comment-block {
      height: calc(100vh - 457px);
    }

    .attach-file-btn {
      font-size: 11px !important;
      padding-left: 6% !important;
      padding-right: 6% !important;
    }
  }
</style>
