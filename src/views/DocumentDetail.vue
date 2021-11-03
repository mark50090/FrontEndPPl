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
                  <template v-for="(signature, index_sign) in signArray">
                      <vue-draggable-resizable
                      :id="item.name"
                      :draggable="false"
                      :resizable="false"
                      v-for="(item, index) in signature"
                      :key="`${index_sign}_${index}`"
                      :x="item.sign_position_x"
                      :y="item.sign_position_y"
                      :w="item.sign_box_width"
                      :h="item.sign_box_heigth"
                      :style="{
                        'background-color': 'rgba(83, 186, 71, 0.2)',
                        'display': item.show ? 'block' : 'none',
                        }"
                    >
                      <v-row no-gutters justify="center" align="center">
                        <span style="color: grey">
                          {{textLang.no}} {{ index_sign + 1 }} {{`(${index + 1}/${signature.length})`}}
                        </span>
                      </v-row>
                    </vue-draggable-resizable>
                    </template>
                    <vue-draggable-resizable
                    :id="item.name"
                    :draggable="true"
                    :resizable="true"
                    v-for="(item, index_position) in stamp_position"
                    :key="`stamp_${index_position}`"
                    :x="item.sign_position_x"
                    :y="item.sign_position_y"
                    :w="item.sign_box_width"
                    :h="item.sign_box_heigth"
                    @activated="onActivated(index_position)"
                    @deactivated="onDeactivated(index_position)"
                    @dragstop="onDrag(item,...arguments)"
                    @resizestop="onResize(item,...arguments)"
                    :style="{
                      'background-color': 'rgba(83, 186, 71, 0)',
                      'display': item.show ? 'block' : 'none',
                      }"
                    >
                      <v-btn
                        color="#f44336"
                        elevation="0"
                        x-small
                        fab
                        dark
                        absolute
                        v-show="item.active"
                        style="top:-45px;right:-15px"
                        @click="delete_stamper_fn(index_position)"
                      >
                        <v-icon small>mdi-close</v-icon>
                      </v-btn>
                      <v-menu
                        :close-on-content-click="false"
                        :nudge-width="200"
                        offset-x
                      >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="#4CAF50"
                          elevation="0"
                          x-small
                          fab
                          dark
                          absolute
                          v-show="item.active"
                          style="top:-45px;right:20px"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon small>mdi-cog</v-icon>
                        </v-btn>
                      </template>
                       <v-card>
                         <v-card-title primary-title>
                         </v-card-title>
                         <v-card-text>
                           <v-select
                             :items="select_page"
                             v-model="item.page"
                             multiple
                             @change="reShowStamp()"
                             label="หน้าที่"
                             outlined
                             dense
                             hide-details
                           ></v-select>
                         </v-card-text>
                        <v-card-actions>

                        </v-card-actions>
                      </v-card>
                      </v-menu>
                      <img :src="item.base64" height="100%" width="100%" />
                    </vue-draggable-resizable>
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
                <b>{{textLang.filename}}</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                {{ doc_details.file_name }}
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>{{textLang.sendername}}</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                {{ doc_details.sender }}
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>{{textLang.senton}}</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                {{ doc_details.create_at | fulldate}}
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>{{textLang.details}}</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                {{ doc_details.detail }}
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0">
                <v-btn depressed x-small dark color="#4CAF50" class="download-pdf-btn" @click="download_pdf_fn">{{textLang.downloadPDF}}</v-btn>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0">
                <v-btn v-if="template_id" depressed x-small dark color="#4CAF50" class="download-pdf-btn" @click="copyDocument()">{{textLang.copydocuments}}</v-btn>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0"> <!-- show when it is document detail from inbox page -->
                <v-btn @click="optionFormMail()" depressed x-small dark color="#4CAF50" class="download-pdf-btn">
                  <v-icon small>mdi-email-send-outline</v-icon>
                  <span class="ml-2">SEND EMAIL</span>
                </v-btn>
              </v-col>
              <v-col v-if="isShowRevertButton" cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0">
                <v-btn @click="optionFormReturn()" depressed x-small dark color="#FBC02D" class="return-correction-btn">
                  {{textLang.returnedit}}
                </v-btn>
              </v-col>
              <v-col v-if="false" cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0"> <!-- show when it is document detail from sent document page -->
                <v-btn depressed x-small dark color="error" class="download-pdf-btn">{{textLang.canceldocument}}</v-btn>
              </v-col>
            </v-row>
          </v-card>
          <!-- document detail card 2 -->
          <v-card outlined class="mt-1">
            <v-card-title class="pa-0">
              <v-tabs color="#4caf50" v-model="document_detail_tab" class="doc-detail-tab">
                <v-tab class="doc-detail-tab-title">{{textLang.workorder}}</v-tab>
                <v-tab class="doc-detail-tab-title">{{textLang.messagememo}}</v-tab>
                <v-tab class="doc-detail-tab-title">{{textLang.attachment}}</v-tab>
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
                        <v-icon v-if="item.status == 'W' && !is_reject" size="30" color="rgb(251, 192, 45)">mdi-clock-outline</v-icon> <!-- waiting for approve (current step) -->
                        <v-icon v-else-if="item.status == 'Y'" size="30" color="#4caf50">mdi-check-circle-outline</v-icon> <!-- approved -->
                        <v-icon v-else-if="item.status == 'R'" size="30" color="#f44336">mdi-close-circle-outline</v-icon> <!-- deny -->
                        <v-icon v-else-if="item.status == 'N'  && !is_reject" size="30" color="#9e9e9e">mdi-clock-outline</v-icon> <!-- step not arrive yet -->
                        <v-icon v-else-if="is_reject" size="30" color="#9e9e9e">mdi-circle-slice-8</v-icon> <!-- step other if reject transaction -->
                      </template>
                      <v-row class="detail-row">
                        <v-col cols="3" md="2" lg="2" align-self="start" class="px-0 py-0 step-doc-title">
                          {{textLang.number}} {{ index + 1 }} {{ item.sign_count > 1 ? `(${item.active_count}/${item.sign_count})` : null }}
                        </v-col>
                        <v-col cols="7" md="7" lg="7" align-self="start" class="pl-1 pr-0 py-0">
                          <v-icon small color="#0000008A" class="mr-2">mdi-timer-sand-full</v-icon>
                          <span class="step-period">{{ item.diff || '' }}</span>
                        </v-col>
                        <v-spacer></v-spacer>
                        <!-- <v-col cols="auto" md="auto" lg="auto" class="pl-0 py-0 transfer-permission-btn-block"> show when it is current step and the owner of step is that user
                          <v-btn depressed fab x-small dark color="#074E80">
                            <v-icon>mdi-account-switch</v-icon>
                          </v-btn>
                        </v-col> -->
                      </v-row>
                      <v-row class="detail-row" v-for="(item_name, index_name) in item.actor" :key="`flow_name_${index}${index_name}`"> <!-- each person data -->
                        <v-col cols="8" md="5" lg="5" align-self="start" class="px-0 pt-0 pb-1 step-doc-title">
                          {{ item_name.name }}
                          <span v-if="my_name === item_name.name"> {{textLang.you}}</span> <!-- when this name is user's name -->
                        </v-col>
                        <v-col cols="auto" md="auto" lg="auto" align-self="start" class="pl-0 pr-1 pt-0 pb-1 step-status-block">
                          <span v-if="!item_name.approved && item.status == 'W' && !is_reject" class="wait-user-approve-status">{{textLang.pendingapproval}}</span> <!-- wait for approve status -->
                          <span v-if="item_name.approved == 'Y'" class="approved-status">{{textLang.approved}}</span> <!-- approved status -->
                          <span v-if="item_name.approved == 'R'" class="deny-status">{{textLang.rejectapproval}}</span> <!-- deny status -->
                        </v-col>
                        <v-col v-if="item_name.approved && (item_name.approved == 'Y' || item_name.approved == 'R')" cols="12" md="4" lg="4" align-self="start" class="pl-2 pr-1 pt-0 pb-1 time-approve-block"> <!-- show when status is approved or deny -->
                          <v-icon small color="black" class="pr-1">mdi-timer-outline</v-icon>
                          <span class="time-approved">{{ item_name.time_approver }}</span>
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
                      <v-textarea dense outlined hide-details no-resize rows="2" row-height="16" :placeholder="textLang.specifymessage" color="#4CAF50" class="write-comment-box" v-model="comment"></v-textarea>
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
                      <v-file-input dense outlined counter multiple show-size small-chips :placeholder="textLang.attached_file_placeholder" color="#4CAF50" class="attach-file-box" v-model="new_attachment_file">
                        <template v-slot:selection="{ text, index }">
                          <v-chip small dark close color="#4CAF50" @click:close="removeFileInput(index)">{{ text }}</v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                    <v-col cols="2" md="2" lg="2" align-self="start" class="px-1 pt-1 pb-0" v-if="false">
                      <v-btn depressed dark block color="#4CAF50" class="attach-file-btn">{{textLang.attachfile}}</v-btn>
                    </v-col>
                  </v-row>
                  <template v-for="(item,index) in attachment_file"> <!-- each attach file -->
                    <v-row class="px-2 detail-row" :key="`${index}_attachment`">
                      <v-col cols="7" md="7" lg="7" align-self="start" class="px-0 pt-1 pb-0 attached-file-name">
                        {{ item.filename }}
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="1" md="1" lg="1" align-self="start" class="px-0 pt-1 pb-0 text-center">
                        <v-btn @click="optionFormFile(item)" icon small color="#4CAF50" :disabled="chack_disable_preview_attachment_fn(item.type)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="2" md="2" lg="2" align-self="start" class="px-0 pt-1 pb-0 text-center">
                        <v-btn icon small color="#4CAF50" @click="download_attachment_fn(item.file_id)">
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </v-col>
                      <!-- <v-col cols="1" md="1" lg="1" align-self="start" class="px-0 pt-1 pb-0 text-center">
                        <v-btn icon small color="#4CAF50" @click="optionFormDeleteAttach()">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col> -->
                    </v-row>
                    <v-divider class="mx-2" :key="`${index}_attachment_divider`"></v-divider>
                  </template>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
          <!-- sign card -->
          <v-card outlined class="mt-1" :class="{'pb-5': !is_approve}" v-if="check_sign && !is_reject"> <!-- show when user have to approve in current step -->
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
                <v-btn depressed color="#1CC6A9" :disabled="false" class="approve-btn" @click="set_approve_fn('approve')">{{textLang.approvee}}</v-btn>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-0 pr-2 py-2">
                <v-btn depressed dark color="error" class="approve-btn" @click="set_approve_fn('reject')">{{textLang.refuse}}</v-btn>
              </v-col>
            </v-row>
            <template v-if="!is_approve">
              <v-divider></v-divider>
              <v-row class="detail-row">
                <v-col cols="auto" md="auto" lg="auto" class="pa-2">
                  <v-btn outlined @click="gostamp()" color="#757575">
                    <v-icon>mdi-stamper</v-icon>
                  </v-btn>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-2 py-2">
                  <v-icon>mdi-draw</v-icon>
                </v-col>
                <v-col cols="4" md="3" lg="3" class="px-0 py-2">
                  <v-select dense outlined hide-details color="#4CAF50" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="all_sign" item-text="name" item-value="index" v-model="sign_type" @change="get_signature_default_fn" class="sign-type sign-type-box sign-type-dropdown-icon"></v-select>
                </v-col>
                <v-col cols="auto" md="auto" lg="auto" class="pr-0 py-2">
                  <v-btn depressed small color="#1D9BDE" :disabled="all_sign[sign_type].default" class="clear-sign-btn" @click="clearSignature()">{{textLang.clear}}</v-btn>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
              <v-row justify="center" align="center" class="detail-row">
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pa-0 sign-block">
                  <!-- sign pad -->
                  <v-img
                    v-if="all_sign[sign_type].default"
                    :src="default_sign"
                    contain
                    height="248px"
                  />
                  <vueSignature v-else ref="signaturePad" :sigOption="{ ...signature_option,onBegin,onEnd }" w="490" h="250" class="sign-pad-box"></vueSignature>
                </v-col>
              </v-row>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <canvas id='textCanvas' width="300" height="30" style="display:none"></canvas>
    <StampModal/>
    <showFormMail/>
    <showFromFile/>
    <Showpdf/>
    <showFormReturn/>
    <DeleteMessage/>
    <showFormDeleteAttach/>
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
import showFormDeleteAttach from '../components/ConfirmDeleteAttachFileModal.vue'
export default {
  computed: {
    textLang() {
      return this.$store.getters.textLang.DocumentDetail
    }
  },
  components: {
    StampModal,
    showFormMail,
    showFromFile,
    Showpdf,
    pdf,
    vueSignature,
    showFormReturn,
    DeleteMessage,
    showFormDeleteAttach
  },
  data: () => ({
    document_detail_tab: null,
    ca_switch: true,
    all_sign: [
      {
        name: 'Sign Pad',
        default: false,
        signImage: null,
        index: 0
      }
    ],
    sign_type: 0,
    page_count: 0,
    page: 1,
    doc_details: {
      document_status: null
    },
    new_attachment_file: [],
    attachment_file: [],
    pdf_src: '',
    select_page:[],
    token: '',
    transaction_id: '',
    default_sign: null,
    signature_option: {
      penColor: 'rgb(13, 38, 154)',
      backgroundColor: 'rgba(255,255,255,0)'
    },
    padStatus: false,
    allStatus: [],
    sign_position: [],
    stamp_position: [],
    stamp_position_px: [],
    signArray: [],
    step_flow: [],
    my_name: '',
    axios_pending: 0,
    check_sign: false,
    comment: '',
    comment_status: true,
    last_step: 0,
    template_id: '',
    is_approve: false,
    is_reject: false,
    isShowRevertButton: true,
  }),
  mounted () {
    this.token = sessionStorage.getItem('access_token')
    this.my_name = sessionStorage.getItem('name')
    this.transaction_id = sessionStorage.getItem('transaction_id')
    this.getTemplateId(this.transaction_id)
    if (!this.transaction_id) {
      this.$router.replace({ name: 'inbox' })
      return
    }
    this.get_detail_fn()
    this.get_attachment_file_fn()
    this.get_signature_name_default_fn()
    EventBus.$on('confirm_deletemessage', this.delete_comment_fn)
    EventBus.$on('getstamp', this.get_stamper_fn)
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
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.warn + '</strong>',
            text: this.textLang.notuploadingfiles + element.name + this.textLang.oversize,
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
      }
    }
  },
  methods: {
    optionFormDeleteAttach() {
			  EventBus.$emit('FormDeleteAttach')
		  },
    optionFormReturn () {
      EventBus.$emit('FormReturn', this.transaction_detail)
    },
    optionFormMail () {
      EventBus.$emit('FormMail')
    },
    optionFormFile (file) {
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
    gostamp () {
      EventBus.$emit('stamp')
    },
    gopdf () {
      EventBus.$emit('showpdf', this.pdf_src)
    },
    back () {
      this.$router.back()
    },
    deletemessage () {
      EventBus.$emit('deletemessage')
    },
    change_page_fn (type) {
      switch (type) {
        case 'next':
          if (this.page < this.page_count) { this.page++ }
          break
        case 'prev':
          if (this.page > 1) { this.page-- }
          break
      }
    },
    chack_disable_preview_attachment_fn (type) {
      const allow = 'jpg,jpeg,gif,png,pdf'
      if (allow.indexOf(type.toLowerCase()) >= 0) return false
      else return true
    },
    download_pdf_fn () {
      const a = document.createElement('a') // Create <a>
      a.href = this.pdf_src // Image Base64 Goes here
      a.download = this.doc_details.file_name // File name Here
      a.click() // Downloaded file
    },
    download_attachment_fn (file_id) {
      window.open(`${this.$api_url}/file-component/api/downloadFile?file_id=${file_id}`)
    },
    convertDateTime () {
      const datenow = new Date()
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
      const data_comment = {
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
    async set_approve_fn (type) {
      var string_sign, data
      if (!this.all_sign[this.sign_type].default) {
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
        typesign: 'web',
        stamp_comments: this.stamp_position.map(item => {
          return {
            sign_llx: item.sign_llx.toString(),
            sign_lly: item.sign_lly.toString(),
            sign_page: item.page.length === this.page_count
              ? 'all'
              : item.page.toString(),
            sign_urx: item.sign_urx.toString(),
            sign_ury: item.sign_ury.toString(),
            stamp_base: item.base64
          }
        })
      }
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
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.succeed + '</strong>',
                text: this.textLang.Successfullyapproved,
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
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.succeed + '</strong>',
                text: this.textLang.Successfullyrejected,
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
          } else {
            this.error_swal_fn(this.textLang.approve_fail)
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
    async getTemplateId (transaction_id) {
      var { data } = await this.axios.get(`${this.$api_url}/template_form/api/v1/is_eform_by_id?transaction_id=${transaction_id}`)
      if (data.status) {
        this.template_id = data.result.template_id
      }
    },
    async get_detail_fn () {
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
              if (element.status == 'W') {
                this.isShowRevertButton = element.actor.map(item => item.name).includes(sessionStorage.getItem('name'))
              }
            })
            if (data.data.flow_step[0].status == 'W' || data.data.document_status == 'Y' || data.data.document_status == 'R') {
              this.isShowRevertButton = false
            }
            doc_data.flow_step.forEach((flowData, index) => {
              flowData.active_count = flowData.actor.filter(item => (item.approved === 'Y' || item.approved === 'R')).length
              this.$set(this.sign_position, index, flowData.sign_position)
              this.$set(this.step_flow, index, flowData)

              // chack status waiting and account approve
              if (flowData.status.toLowerCase() === 'w') {
                this.last_step = index
                const find_name_in_w = flowData.actor.findIndex((element) => element.name === this.my_name)
                if (find_name_in_w > -1 && this.$route.name === 'document_detail') {
                  if (flowData.actor[find_name_in_w].approved !== undefined) {
                    const statusMyApprove = flowData.actor[find_name_in_w].approved
                    if (statusMyApprove === 'Y' || statusMyApprove === 'R') this.check_sign = false
                    else this.check_sign = true
                  } else this.check_sign = true
                  this.ca_switch = flowData.send_update.action.toLowerCase() === 'sign-ca'
                  this.is_approve = flowData.send_update.action.toLowerCase() === 'approve'
                }
              } else if (flowData.status.toLowerCase() === 'r') {
                this.is_reject = true
              }

              // allow sign position
              let arrAllowPosition = []
              if (flowData.send_update.action.toLowerCase() === 'sign' || flowData.send_update.action.toLowerCase() === 'sign-ca') {
                arrAllowPosition = flowData.sign_position.map(item => item.status === 'Incomplete')
              } else {
                arrAllowPosition = new Array(flowData.sign_position.length).fill(false)
              }
              this.$set(this.allStatus, index, arrAllowPosition)
            })
            this.doc_details.transaction_id = doc_data.transaction_id
            this.doc_details.doc_id = doc_data.doc_id
            this.doc_details.sender = doc_data.sender
            this.doc_details.detail = `${doc_data.object_text.subject} ${doc_data.object_text.message}`
            this.doc_details.tracking = doc_data.tracking
            this.doc_details.create_at = doc_data.create_at
            this.doc_details.file_name = doc_data.file_name
            this.doc_details.comment = doc_data.comment
            this.doc_details.step_index = doc_data.flow_step.length != this.last_step ? doc_data.flow_step[this.last_step].send_update.step_index : null
            this.doc_details.action = doc_data.flow_step.length != this.last_step ? doc_data.flow_step[this.last_step].send_update.action : null
            this.pdf_src = `data:application/pdf;base64,${data.data.pdfbase}`
          }
        })
        .catch((error) => {
          if (error.response) {
            const errResponse = error.response.data
            if (errResponse.message === 'error read pdf') {
              this.error_swal_fn(this.textLang.cantread)
            } else {
              this.error_swal_fn(errResponse.message || this.textLang.erroroccurred)
            }
            this.$router.replace({ name: 'inbox' })
          }
        })
        .then(() => {
          this.axios_pending--
        })
    },
    error_swal_fn (msg = this.textLang.erroroccurred) {
      this.$swal({
        backdrop: false,
        position: 'bottom-end',
        width: '330px',
        title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.fail + '</strong>',
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
    async get_signature_name_default_fn () {
      const url = '/user_setting/api/v1/get_stamp_name_list'
      const config = {
        Authorization: `Bearer ${this.token}`
      }
      this.axios_pending++
      this.axios.get(`${this.$api_url}${url}`, config)
        .then((response) => {
          const data = response.data
          if (data.status) {
            // if (data.data[0]) this.default_sign = `data:image/png;base64,${data.data[0]}`
            // console.log(data)
            // this.sign_type = data.data[0]
            this.all_sign = [
              ...Array.from(
                { length: data.data.length },
                (_, i) => { return { name: data.data[i], default: true, index: i, signImage: null } }
              ),
              {
                name: 'Sign Pad',
                default: false,
                signImage: null,
                index: data.data.length
              }]
            this.sign_type = 0
          } else {
            this.sign_type = 0
            this.all_sign = [{
              name: 'Sign Pad',
              default: false,
              signImage: null,
              index: 0
            }]
          }
        }
        )
        .catch((error) => {
          if (error.response) {
            this.sign_type = 0
            this.all_sign = [{
              name: 'Sign Pad',
              default: false,
              signImage: null,
              index: 0
            }]
          }
        })
        .then(() => {
          this.get_signature_default_fn()
          this.axios_pending--
        })
    },
    async get_signature_default_fn () {
      if (!this.all_sign[this.sign_type].default) return
      if (this.all_sign[this.sign_type].signImage !== null) {
        this.default_sign = this.all_sign[this.sign_type].signImage
      } else {
        const url = '/user_setting/api/v1/get_stamp_base64'
        const config = {
          Authorization: `Bearer ${this.token}`,
          params: {
            StampName: this.all_sign[this.sign_type].name
          }
        }
        this.axios_pending++
        this.axios.get(`${this.$api_url}${url}`, config)
          .then((response) => {
            const data = response.data
            if (data.status) {
              // if (data.data[0]) this.default_sign = `data:image/png;base64,${data.data[0]}`
              // console.log(data)
              this.all_sign[this.sign_type].signImage = data.data
              this.default_sign = data.data
              // this.all_sign_type = [...data.data, 'Sign Pad']
            }
          })
          .catch((error) => {
            if (error.response) {
              this.sign_type = 'Sign Pad'
            }
          })
          .then(() => {
            this.axios_pending--
          })
      }
    },
    onBegin () {
      this.padStatus = true
    },
    onEnd () {
    },
    clearSignature () {
      if (!this.all_sign[this.sign_type].default) { this.$refs.signaturePad.clear() }
      this.padStatus = false
    },
    loadedPDF () {
      this.sign_position.forEach((stepItem, index) => {
        const arr = stepItem.map((element) => {
          if (element.sign_page !== 'all') {
            element.sign_page = (typeof element.sign_page === 'string' ? element.sign_page : element.sign_page.toString()).split(',')
            for (var i = 0; i < element.sign_page.length; i++) { element.sign_page[i] = +element.sign_page[i] }
          } else element.sign_page = Array.from({ length: this.page_count }, (_, i) => i + 1)
          return element
        })
        this.$set(this.sign_position, index, arr)
        this.select_page = Array.from({ length: this.page_count }, (_, i) => i + 1)
      })
    },
    loaded: function (e) {
      this.reShowSign(this.sign_position)
      this.reShowStamp()
    },
    reShowSign (data) {
      this.signArray = []
      for (let index = 0; index < data.length; index++) {
        const step = data[index]
        this.signArray.push([])
        for (let index2 = 0; index2 < step.length; index2++) {
          const position = step[index2]
          this.signArray[index].push({
            index: index + 1,
            index2: index2 + 1,
            name: `draggableDiv${index}_${index2}`,
            show: false,
            sign_page: position.sign_page
          })
          var shownonPage = this.signArray[index][index2].sign_page
          var isShow = shownonPage.includes(this.page)
          this.signArray[index][index2].show = isShow && this.allStatus[index][index2]
          this.setPositionSign(
            this.signArray[index][index2].index,
            this.signArray[index][index2].index2,
            data[index][index2].sign_llx,
            data[index][index2].sign_lly,
            data[index][index2].sign_urx,
            data[index][index2].sign_ury
          )
        }
      }
    },
    setPositionSign (index, index2, llx, lly, urx, ury) {
      var arr_index = index - 1
      var arr_index2 = index2 - 1

      var clientWidth = $('#pdfDiv')[0].getBoundingClientRect().width
      var clientHeight = $('#pdfDiv')[0].getBoundingClientRect().height

      var setHeight = parseFloat(clientHeight) * lly

      var sign = this.signArray[arr_index][arr_index2]

      sign.sign_llx = llx
      sign.sign_lly = lly
      sign.sign_urx = urx
      sign.sign_ury = ury

      sign.sign_position_x = clientWidth * (+llx)
      sign.sign_position_y = ((-setHeight) + (Math.abs(ury - lly))) + (-clientHeight) * (+lly + (ury - lly))
      sign.sign_box_heigth = (clientHeight * (ury))
      sign.sign_box_width = (clientWidth * urx)

      this.$set(this.signArray[arr_index], arr_index2, sign)
    },
    copyDocument () {
      const tempOption = {
        template_id: this.template_id,
        isCopy: true,
        isImport: false,
        transaction_id: this.transaction_id
      }
      sessionStorage.setItem('option', JSON.stringify(tempOption))
      sessionStorage.setItem('isDocEdit', false)
      sessionStorage.setItem('isDocStep', true)
      sessionStorage.setItem('isBack', false)
      sessionStorage.setItem('isStep', false)
      sessionStorage.setItem('isOnlyForm', true)
      this.$router.push({ path: '/form/input' })
    },
    get_stamper_fn (base64) {
      this.stamp_position.push({ base64: base64, page: [1] })
      this.reShowStamp()
    },
    delete_stamper_fn (index) {
      // this.stamp_position.splice(index, 1)
      this.stamp_position = this.stamp_position.filter((item, index2) => index !== index2)
      this.reShowStamp()
    },
    onResize: function (item, x, y, width, height) {
      var clientWidth = $('#pdfDiv')[0].getBoundingClientRect().width
      var clientHeight = $('#pdfDiv')[0].getBoundingClientRect().height
      item.sign_llx = (x / clientWidth).toFixed(3)
      item.sign_lly = (-(y + item.sign_box_heigth) / clientHeight).toFixed(3)
      item.sign_urx = (width / clientWidth).toFixed(3)
      item.sign_ury = (height / clientHeight).toFixed(3)
      item.sign_position_x = x
      item.sign_position_y = y
      item.sign_box_heigth = height
      item.sign_box_width = width
    },
    onDrag: function (item, x, y) {
      var clientWidth = $('#pdfDiv')[0].getBoundingClientRect().width
      var clientHeight = $('#pdfDiv')[0].getBoundingClientRect().height
      item.sign_llx = (x / clientWidth).toFixed(4)
      item.sign_lly = (-(y + item.sign_box_heigth) / clientHeight).toFixed(4)
      item.sign_position_x = x
      item.sign_position_y = y
    },
    onActivated (index) {
      const stamp = this.stamp_position[index]
      this.$set(this.stamp_position, index, { ...stamp, active: true })
    },
    onDeactivated (index) {
      const stamp = this.stamp_position[index]
      this.$set(this.stamp_position, index, { ...stamp, active: false })
    },
    reShowStamp () {
      for (let index = 0; index < this.stamp_position.length; index++) {
        const position = this.stamp_position[index]
        this.stamp_position[index] = {
          index: index + 1,
          name: `stamp_position_${index}`,
          show: false,
          active: false,
          page: position.page,
          base64: position.base64,
          sign_llx: position.sign_llx || 0,
          sign_lly: position.sign_lly || 0.95,
          sign_urx: position.sign_urx || 0.2,
          sign_ury: position.sign_ury || 0.05,
          sign_position_x: position.sign_position_x || 0,
          sign_position_y: position.sign_position_y || 0,
          sign_box_heigth: position.sign_box_heigth || 0,
          sign_box_width: position.sign_box_width || 0
        }
        var shownonPage = this.stamp_position[index].page
        var isShow = shownonPage.includes(this.page)
        this.$set(this.stamp_position, index, { ...this.stamp_position[index], show: isShow })
        this.setPositionStamp(
          this.stamp_position[index].index,
          this.stamp_position[index].sign_llx,
          this.stamp_position[index].sign_lly,
          this.stamp_position[index].sign_urx,
          this.stamp_position[index].sign_ury
        )
      }
    },
    setPositionStamp (index, llx, lly, urx, ury) {
      var arr_index = index - 1

      var clientWidth = $('#pdfDiv')[0].getBoundingClientRect().width
      var clientHeight = $('#pdfDiv')[0].getBoundingClientRect().height

      var setHeight = parseFloat(clientHeight) * lly

      var stamp = this.stamp_position[arr_index]

      stamp.sign_llx = llx
      stamp.sign_lly = lly
      stamp.sign_urx = urx
      stamp.sign_ury = ury

      stamp.sign_position_x = clientWidth * (+llx)
      stamp.sign_position_y = ((-setHeight) + (Math.abs(ury - lly))) + (-clientHeight) * (+lly + (ury - lly))
      stamp.sign_box_heigth = (clientHeight * (ury))
      stamp.sign_box_width = (clientWidth * urx)

      this.stamp_position[arr_index] = stamp
      // console.log(`stamp${arr_index}`, this.stamp_position[arr_index])
    }
  },
  beforeDestroy () {
    sessionStorage.removeItem('transaction_id')
    EventBus.$off('confirm_deletemessage')
    EventBus.$off('getstamp')
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
