<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 px-4 sentbox-page">
          <v-row class="sentbox-row">
            <v-col cols="12" md="4" lg="4" class="px-0 pb-0">
              <v-text-field outlined hide-details dense clearable clear-icon="mdi-close-circle-outline" color="#4caf50" placeholder="ค้นหา" class="search-sent-box search-sentbox-btn-block">
                <template v-slot:append-outer>
                  <v-btn outlined color="#9e9e9e" class="search-sentbox-btn">
                    <v-icon >mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 front-sentbox-title">ประเภทเอกสาร</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0">
              <v-autocomplete outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" class="type-doc-sentbox sent-box-dropdown-icon"></v-autocomplete>
            </v-col>
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 front-sentbox-title display-mobile-only">สถานะเอกสาร</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0 display-mobile-only">
              <v-select outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="sent_box_select" class="status-doc-sentbox sent-box-dropdown-icon"></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-2 sentbox-row alldoc-sent-header">
            เอกสารทั้งหมด 5 
          </v-row>
          <v-row class="mt-3 sentbox-row display-pc-only">
            <v-btn-toggle mandatory background-color="white" class="status-sent-block">
              <v-btn outlined tile value="all" class="status-sentbox-btn">
                ทั้งหมด
                <v-badge inline dark color="black" :content="5"></v-badge>
              </v-btn>
              <v-btn outlined tile value="waiting" class="status-sentbox-btn">
                รออนุมัติ
                <v-badge inline light color="#F8F27C" :content="1" class="status-sentbox-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="approved" class="status-sentbox-btn">
                อนุมัติแล้ว
                <v-badge inline light color="#AFDEA9" :content="1" class="status-sentbox-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="inprogress" class="status-sentbox-btn">
                กำลังดำเนินการ 
                <v-badge inline light color="#6EC4D6" :content="1" class="status-sentbox-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="rejected" class="status-sentbox-btn">
                ปฏิเสธอนุมัติ
                <v-badge inline light color="#F49393" :content="1" class="status-sentbox-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="incoming" class="status-sentbox-btn">
                รอดำเนินการ
                <v-badge inline light color="#FCCD5A" :content="1" class="status-sentbox-num"></v-badge>
              </v-btn>
            </v-btn-toggle>
          </v-row>
          <v-row class="sentbox-row">
            <v-data-table fixed-header :loading="false" :headers="sentbox_table_header" :items="sentbox_data" @click:row="goToSentDetail()" class="sentbox-table sentbox-table-border sentbox-table-header hide-sentbox-table-progress sentbox-table-data" :footer-props="{'items-per-page-options': [5, 10, 15, 20]}">
              <template v-slot:loading> <!-- loading data in table -->
                <v-row align="center" justify="center" class="sentbox-row sentbox-data-load-block">
                  <img width="100px" src="../assets/loader.gif" class="sentbox-load">
                </v-row>
              </template>
              <template v-slot:[`item.sent_box_status`]="{ item }"> <!-- document status column -->
                <v-chip color="#F8F27C" v-if="item.sent_box_status == 'waiting'">รออนุมัติ</v-chip> <!--สถานะ รออนุมัติ -->
                <v-chip color="#AFDEA9" v-if="item.sent_box_status == 'approved'">อนุมัติแล้ว</v-chip> <!--สถานะ อนุมัติแล้ว -->
                <v-chip color="#6EC4D6" v-if="item.sent_box_status == 'inprogress'">กำลังดำเนินการ</v-chip> <!--สถานะ กำลังดำเนินการ -->
                <v-chip color="#F49393" v-if="item.sent_box_status == 'rejected'">ปฏิเสธอนุมัติ</v-chip> <!--สถานะ ปฏิเสธอนุมัติ -->
                <v-chip color="#FCCD5A" v-if="item.sent_box_status == 'incoming'">รอดำเนินการ</v-chip> <!--สถานะ รอดำเนินการ -->
              </template>
            </v-data-table>
          </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({
      sent_box_select: [
        'ทั้งหมด', 'รออนุมัติ', 'อนุมัติแล้ว', 'กำลังดำเนินการ', 'ปฏิเสธอนุมัติ', 'รอดำเนินการ'
      ],
      sentbox_table_header: [
        {text: 'ผู้ส่ง', align: 'start', sortable: true, value: 'sent_box_sender'},
        {text: 'ประเภท', align: 'start', sortable: true, value: 'sent_box_type'},
        {text: 'เลขที่เอกสาร', align: 'start', sortable: true, value: 'sent_box_number'},
        {text: 'รายละเอียด', align: 'start', sortable: false, value: 'sent_box_details'},
        {text: 'สถานะ', align: 'center', sortable: true, value: 'sent_box_status'},
        {text: 'วันที่', align: 'start', sortable: true, value: 'sent_box_date'},
      ],
      sentbox_data: [
          {
            sent_box_sender: 'ธวัชชัย หนองรวง',
            sent_box_type: 'TEST-DEV',
            sent_box_number: 'TSDEV-45466',
            sent_box_details: 'เฉพาะทดสอบ - หัวเรื่อง test tao เฉพาะทดสอบ - ข้อความ',
            sent_box_status: 'waiting',
            sent_box_date: '7 ก.ย 2564',
          }
        ],
    }),
    mounted() {

    },
    watch:{

    },

    methods: {
      goToSentDetail() {
        this.$router.push('/sent_box/detail')
      }
    }
  }
</script>

<style>
  .sentbox-page {
    height: calc(100vh - 72px);
  }

  .sentbox-row {
    width: 100%;
    margin: 0% !important;
  }

  .search-sent-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .search-sent-box.v-text-field input {
    line-height: 24px !important;
  }

  .search-sent-box.v-text-field .v-input__control {
    border-end-end-radius: 0px !important;
    border-start-end-radius: 0px !important;
  }

  .search-sentbox-btn-block.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer {
    margin-top: 0% !important;
  }

  .v-application--is-ltr .search-sentbox-btn-block .v-input__append-outer {
    margin-left: 0% !important;
  }

  .search-sentbox-btn {
    background-color: #f5f7fa;
    border-start-start-radius: 0px;
    border-end-start-radius: 0px;
    height: 40px !important;
    min-width: 58px !important;
  }

  .front-sentbox-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }

  .type-doc-sentbox {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .type-doc-sentbox.v-text-field input {
    line-height: 24px !important;
  }

  .sent-box-dropdown-icon .theme--light.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
  }

  .status-doc-sentbox {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .status-doc-sentbox .v-select__selections {
    line-height: 24px !important;
  }

  .alldoc-sent-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 18px;
    color: #1b9900;
  }

  .status-sent-block {
    border-radius: 0px !important;
  }

  .status-sentbox-btn {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px !important;
    color: black !important;
  }

  .status-sentbox-num .v-badge__badge {
    color: black !important;
  }

  .sentbox-table {
    width: 100%;
  }

  .sentbox-table.v-data-table > .v-data-table__wrapper {
    height: calc(100vh - 287px);
    overflow: auto;
  }  

  .sentbox-table-border .v-data-table__wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .sentbox-table-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    font-family: 'Sarabun', sans-serif;
    font-size: 15px;
  }

  .hide-sentbox-table-progress .v-data-table__progress {
    display: none;
  }

  .sentbox-data-load-block {
    height: calc(100vh - 417px);
  }

  .sentbox-load {
    opacity: 0.6;
  }

  .sentbox-table-data.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
  }

  .sentbox-table-data.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover {
    cursor: pointer;
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .sentbox-page {
      height: calc(100vh - 64px);
    }

    .sentbox-table {
      margin-top: 4%;
    }

    .sentbox-table.v-data-table > .v-data-table__wrapper {
      height: calc(100vh - 374px);
    }

    .sentbox-data-load-block {
      height: calc(100vh - 506px);
      margin-left: 100% !important;
    }
  }
</style>