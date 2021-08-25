<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 px-4 pt-2 inbox-page">
      <v-row class="inbox-row">
        <v-tabs color="#4caf50" v-model="tab">
          <v-tab class="inbox-tab-title">เอกสารทั้งหมด</v-tab>
        </v-tabs>
      </v-row>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-row class="mt-1 inbox-row">
            <v-col cols="12" md="4" lg="4" class="px-0 pb-0">
              <v-text-field outlined hide-details dense clearable clear-icon="mdi-close-circle-outline" color="#4caf50" placeholder="ค้นหา" class="search-box search-btn-block">
                <template v-slot:append-outer>
                  <v-btn outlined color="#9e9e9e" class="search-btn">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 doc-type-title">ประเภทเอกสาร</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0">
              <v-autocomplete outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" class="type-doc-box type-doc-dropdown-icon"></v-autocomplete>
            </v-col>
            <!-- filter document status for mobile only -->
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 doc-type-title display-mobile-only">สถานะเอกสาร</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0 display-mobile-only">
              <v-select outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="doc_status_list" class="status-doc-box type-doc-dropdown-icon"></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-5 inbox-row all-doc-header">
            เอกสารทั้งหมด 800
          </v-row>
          <!-- filter document status for pc only -->
          <v-row class="mt-5 inbox-row display-pc-only">
            <v-btn-toggle mandatory background-color="white" v-model="doc_status" class="status-doc-block">
              <v-btn outlined tile value="ทั้งหมด" class="status-doc-btn">
                ทั้งหมด
                <v-badge inline dark color="black" content="800"></v-badge>
              </v-btn>
              <v-btn outlined tile value="รอนุมัติ" class="status-doc-btn">
                รออนุมัติ
                <v-badge inline light color="#F8F27C" content="300" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="อนุมัติแล้ว" class="status-doc-btn">
                อนุมัติแล้ว
                <v-badge inline light color="#AFDEA9" content="30" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="กำลังดำเนินการ" class="status-doc-btn">
                กำลังดำเนินการ
                <v-badge inline light color="#6EC4D6" content="30" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="ปฏิเสธอนุมัติ" class="status-doc-btn">
                ปฏิเสธอนุมัติ
                <v-badge inline light color="#F49393" content="30" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="รอดำเนินการ" class="status-doc-btn">
                รอดำเนินการ
                <v-badge inline light color="#FCCD5A" content="30" class="status-doc-num"></v-badge>
              </v-btn>
            </v-btn-toggle>
          </v-row>
          <v-row class="inbox-row">
            <v-data-table fixed-header :loading="false" :headers="inbox_header" :items="inbox_data" class="inbox-table inbox-table-border inbox-table-header hide-inbox-table-progress inbox-table-data">
              <template v-slot:loading> <!-- loading data in table -->
                <v-row align="center" justify="center" class="inbox-row inbox-data-load-block">
                  <img width="100px" src="../assets/loader.gif" class="inbox-load">
                </v-row>
              </template>
              <template v-slot:[`item.doc_status`]="{ item }"> <!-- document status column -->
                <v-chip color="#F8F27C">รออนุมัติ</v-chip> <!--สถานะ รออนุมัติ -->
                <!--<v-chip color="#AFDEA9">อนุมัติแล้ว</v-chip>--> <!--สถานะ อนุมัติแล้ว -->
                <!--<v-chip color="#6EC4D6">กำลังดำเนินการ</v-chip>--> <!--สถานะ กำลังดำเนินการ -->
                <!--<v-chip color="#F49393">ปฏิเสธอนุมัติ</v-chip>--> <!--สถานะ ปฏิเสธอนุมัติ -->
                <!--<v-chip color="#FCCD5A">รอดำเนินการ</v-chip>--> <!--สถานะ รอดำเนินการ -->
              </template>
            </v-data-table>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({
      tab: null,
      doc_status_list: ['ทั้งหมด', 'รออนุมัติ', 'อนุมัติแล้ว', 'กำลังดำเนินการ', 'ปฏิเสธอนุมัติ', 'รอดำเนินการ'],
      doc_status: 'ทั้งหมด',
      inbox_header: [
        {text: 'ผู้ส่ง', align: 'start', sortable: true, value: 'sender'},
        {text: 'ประเภท', align: 'start', sortable: true, value: 'doc_type'},
        {text: 'เลขที่เอกสาร', align: 'start', sortable: true, value: 'doc_id'},
        {text: 'รายละเอียด', align: 'start', sortable: false, value: 'doc_detail'},
        {text: 'สถานะ', align: 'center', sortable: true, value: 'doc_status'},
        {text: 'วันที่', align: 'start', sortable: true, value: 'doc_date'}
      ],
      inbox_data: [
        {sender: 'คนดีย์ สิ้นชีวาลัย', doc_type: 'ใบเบิกเงินค่ารักษาพยาบาล', doc_id: 'OTHER-63000000214', doc_detail: 'ขอเบิกค่าถอนฟันหน่อยนะ', doc_status: '', doc_date: '30/12/2020'},
      ]
    }),
    mounted() {

    },
    methods: {
      
    }
  }
</script>

<style>
  .inbox-page {
    height: calc(100vh - 72px);
  }

  .inbox-row {
    width: 100%;
    margin: 0% !important;
  }

  .inbox-tab-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .search-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .search-box.v-text-field input {
    line-height: 24px !important;
  }

  .search-box.v-text-field .v-input__control {
    border-end-end-radius: 0px !important;
    border-start-end-radius: 0px !important;
  }

  .search-btn-block.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer {
    margin-top: 0% !important;
  }

  .v-application--is-ltr .search-btn-block .v-input__append-outer {
    margin-left: 0% !important;
  }

  .search-btn {
    background-color: #f5f7fa;
    border-start-start-radius: 0px;
    border-end-start-radius: 0px;
    height: 40px !important;
    min-width: 58px !important;
  }

  .doc-type-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }

  .type-doc-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .type-doc-box.v-text-field input {
    line-height: 24px !important;
  }

  .type-doc-dropdown-icon .theme--light.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
  }

  .status-doc-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .status-doc-box .v-select__selections {
    line-height: 24px !important;
  }

  .all-doc-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 18px;
    color: #1b9900;
  }

  .status-doc-block {
    border-radius: 0px !important;
  }

  .status-doc-btn {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px !important;
    color: black !important;
  }

  .status-doc-num .v-badge__badge {
    color: black !important;
  }

  .inbox-table {
    width: 100%;
  }

  .inbox-table.v-data-table > .v-data-table__wrapper {
    height: calc(100vh - 366px);
    overflow: auto;
  }  

  .inbox-table-border .v-data-table__wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .inbox-table-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    font-family: 'Sarabun', sans-serif;
    font-size: 15px;
  }

  .hide-inbox-table-progress .v-data-table__progress {
    display: none;
  }

  .inbox-data-load-block {
    height: calc(100vh - 417px);
  }

  .inbox-load {
    opacity: 0.6;
  }

  .inbox-table-data.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
  }

  .inbox-table-data.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover {
    cursor: pointer;
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .inbox-page {
      height: calc(100vh - 64px);
    }

    .inbox-table {
      margin-top: 4%;
    }

    .inbox-table.v-data-table > .v-data-table__wrapper {
      height: calc(100vh - 444px);
    }

    .inbox-data-load-block {
      height: calc(100vh - 506px);
      margin-left: 100% !important;
    }
  }
</style>