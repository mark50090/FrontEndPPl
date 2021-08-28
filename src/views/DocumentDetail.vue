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
                  <v-btn icon x-small color="white">
                    <v-icon size="16">mdi-arrow-left</v-icon>
                  </v-btn>
                  <span class="mx-1 pdf-page">30 / 30</span>
                  <v-btn icon x-small color="white">
                    <v-icon size="16">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="py-0 pr-2">
                  <v-btn icon large color="white">
                    <v-icon large>mdi-text-box-search</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="px-1 pb-1">
              <v-row align="center" justify="center" class="mt-1 detail-row pdf-block">
                <!-- pdf -->
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
                TP-63000000329
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>ชื่อไฟล์</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                เอกสารทดสอบการ Upload.pdf
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>ชื่อผู้ส่ง</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                อากาโมโต้ โอะเมเดะโต (agamoto.om@one.th)
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>ส่งเมื่อ</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                30 พฤศจิกายน 2564 08:00:30
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="3" md="2" lg="2" class="pl-0 pt-1 pb-0 doc-detail-title">
                <b>รายละเอียด</b>
              </v-col>
              <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0 doc-detail-title">
                บลาๆ เอกสารอื่นๆ อีกมากมายก่ายกอง 
              </v-col>
            </v-row>
            <v-row class="detail-row">
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0">
                <v-btn depressed x-small dark color="#4CAF50" class="download-pdf-btn">ดาวน์โหลด PDF</v-btn>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0"> <!-- show when it is document detail from inbox page -->
                <v-btn depressed x-small dark color="#4CAF50" class="download-pdf-btn">
                  <v-icon small>mdi-email-send-outline</v-icon>
                  <span class="ml-2">SEND EMAIL</span>
                </v-btn>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-1 pt-1 pb-0"> <!-- show when it is document detail from sent document page -->
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
                    <v-timeline-item fill-dot icon small color="white"> <!-- each step -->
                      <template v-slot:icon> <!-- icon for each step -->
                        <!-- <v-icon size="30" color="rgb(251, 192, 45)">mdi-clock-outline</v-icon> --> <!-- waiting for approve (current step) -->
                        <!--<v-icon size="30" color="#4caf50">mdi-check-circle-outline</v-icon>--> <!-- approved -->
                        <!--<v-icon size="30" color="#f44336">mdi-close-circle-outline</v-icon>--> <!-- deny -->
                        <v-icon size="30" color="#9e9e9e">mdi-clock-outline</v-icon> <!-- step not arrive yet -->
                      </template>
                      <v-row class="detail-row">
                        <v-col cols="3" md="2" lg="2" align-self="start" class="px-0 py-0 step-doc-title">
                          ลำดับ 10
                        </v-col>
                        <v-col cols="7" md="7" lg="7" align-self="start" class="pl-1 pr-0 py-0">
                          <v-icon small color="#0000008A" class="mr-2">mdi-timer-sand-full</v-icon>
                          <span class="step-period">462 วัน 21 ชั่วโมง 45 นาที 45 วินาที</span>
                        </v-col>
                        <v-spacer></v-spacer>
                        <!--<v-col cols="auto" md="auto" lg="auto" class="pl-0 py-0 transfer-permission-btn-block"> <!-- show when it is current step and the owner of step is that user 
                          <v-btn depressed fab x-small dark color="#074E80">
                            <v-icon>mdi-account-switch</v-icon>
                          </v-btn>
                        </v-col>-->
                      </v-row>
                      <v-row class="detail-row"> <!-- each person data -->
                        <v-col cols="8" md="5" lg="5" align-self="start" class="px-0 pt-0 pb-1 step-doc-title">
                          ศักดิ์สิทธิ มาก่อน
                          <span> (คุณ)</span> <!-- when this name is user's name -->
                        </v-col>
                        <v-col cols="auto" md="auto" lg="auto" align-self="start" class="pl-0 pr-1 pt-0 pb-1 step-status-block">
                          <!--<span class="wait-user-approve-status">รออนุมัติ</span>--> <!-- wait for approve status -->
                          <!--<span class="approved-status">อนุมัติแล้ว</span>--> <!-- approved status -->
                          <span class="deny-status">ปฏิเสธอนุมัติ</span> <!-- deny status -->
                        </v-col>
                        <v-col cols="12" md="4" lg="4" align-self="start" class="pl-2 pr-1 pt-0 pb-1 time-approve-block"> <!-- show when status is approved or deny -->
                          <v-icon small color="black" class="pr-1">mdi-timer-outline</v-icon>
                          <span class="time-approved">2020-02-04 06:44:03</span>
                        </v-col>
                      </v-row>
                    </v-timeline-item>
                  </v-timeline>
                </v-tab-item>
                <!-- comment tab -->
                <v-tab-item>
                  <div class="show-comment-block">
                    <template> <!-- each comment -->
                      <v-row class="detail-row">
                        <v-col cols="auto" md="auto" lg="auto" align-self="start" class="px-0 pt-1 pb-0">
                          <v-icon x-large>mdi-account-circle</v-icon>
                        </v-col>
                        <v-col cols="10" md="10" lg="10" align-self="start" class="pl-0 pr-0 pt-1 pb-0">
                          <v-row class="detail-row comment-owner-name">
                            ยินดี ปรีดา
                          </v-row>
                          <v-row class="mt-3 detail-row">
                            <v-card outlined class="pa-3 comment-box">
                              <pre class="comment">ฉันคิดๆๆๆ</pre>
                            </v-card>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-row align="center" justify="end" class="pr-2 detail-row">
                        <v-btn icon color="#525659"> <!-- show when it is user's comment -->
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <span class="comment-time">24-08-2021 08:00:45</span>
                      </v-row> 
                    </template>
                  </div>
                  <v-row class="detail-row">
                    <v-col cols="10" md="11" lg="11" class="pl-2 pr-0 py-1">
                      <v-textarea dense outlined hide-details no-resize rows="2" row-height="16" placeholder="ระบุข้อความ" color="#4CAF50" class="write-comment-box"></v-textarea>
                    </v-col>
                    <v-col cols="2" md="1" lg="1" class="px-0 py-1">
                      <v-btn depressed dark block color="#4CAF50" class="px-1 send-comment-btn">
                        <v-icon>mdi-send</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <!-- attach file tab -->
                <v-tab-item>
                  <v-row class="detail-row"> <!-- show when it is current step and the owner of step is that user -->
                    <v-col cols="10" md="10" lg="10" align-self="start" class="pl-0 pr-0 py-1 ">
                      <v-file-input dense outlined counter multiple show-size small-chips placeholder="เลือกไฟล์" color="#4CAF50" class="attach-file-box">
                        <template v-slot:selection="{ text }">
                          <v-chip small dark close color="#4CAF50">{{ text }}</v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                    <v-col cols="2" md="2" lg="2" align-self="start" class="px-1 pt-1 pb-0">
                      <v-btn depressed dark block color="#4CAF50" class="attach-file-btn">แนบไฟล์</v-btn>
                    </v-col>
                  </v-row>
                  <template> <!-- each attach file -->
                    <v-row class="px-2 detail-row">
                      <v-col cols="7" md="7" lg="7" align-self="start" class="px-0 pt-1 pb-0 attached-file-name">
                        เอกสารที่เกี่ยวข้อง.pdf
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="2" md="1" lg="1" align-self="start" class="px-0 pt-1 pb-0 text-center">
                        <v-btn icon small color="#4CAF50" :disabled="false">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="2" md="2" lg="2" align-self="start" class="px-0 pt-1 pb-0 text-center">
                        <v-btn icon small color="#4CAF50">
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-divider class="mx-2"></v-divider>
                  </template>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
          <!-- sign card -->
          <v-card outlined class="mt-1 pb-5"> <!-- show when user have to approve in current step -->
            <v-row class="mt-4 mb-2 px-2 detail-row">
              <v-textarea dense outlined hide-details no-resize readonly label="คำอธิบาย" rows="2" color="rgb(158,158,158)" v-model="document_description" class="doc-description"></v-textarea>
            </v-row>
            <v-divider></v-divider>
            <v-row class="detail-row">
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-2 pr-0 py-2">
                <v-switch inset disabled hide-details label="Certificate (CA)" v-model="ca_switch" class="mt-0 ca-switch"></v-switch>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-0 pr-1 py-2">
                <v-btn depressed color="#1CC6A9" :disabled="false" class="approve-btn">อนุมัติ</v-btn>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-0 pr-2 py-2">
                <v-btn depressed dark color="error" class="approve-btn">ปฏิเสธ</v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="detail-row">
              <v-col cols="auto" md="auto" lg="auto" class="pa-2">
                <v-btn outlined color="#757575">
                  <v-icon>mdi-stamper</v-icon>
                </v-btn>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto" md="auto" lg="auto" class="pl-0 pr-2 py-2">
                <v-icon>mdi-draw</v-icon>
              </v-col>
              <v-col cols="4" md="3" lg="3" class="px-0 py-2">
                <v-select dense outlined hide-details color="#4CAF50" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="all_sign_type" class="sign-type sign-type-box sign-type-dropdown-icon"></v-select>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" class="pr-0 py-2">
                <v-btn depressed small color="#1D9BDE" :disabled="false" class="clear-sign-btn">ล้างค่า</v-btn>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row justify="center" align="center" class="detail-row">
              <v-col cols="10" md="7" lg="7" align-self="center" class="pa-0 sign-block">
                <!-- sign pad -->
              </v-col>
            </v-row>
          </v-card> 
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({
      document_detail_tab: null,
      document_description: 'อธิบายอะไรก็ไม่รู้',
      ca_switch: true,
      all_sign_type: ['Default', 'Sign Pad']
    }),
    mounted() {

    },
    methods: {
      back() {
        this.$router.push('/inbox')
      }
    }
  }
</script>

<style>
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
    height: 140px;
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
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