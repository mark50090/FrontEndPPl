<template>
  <div class="pt-1">
    <v-card outlined class="mx-1 px-4 pt-2 templateform-page">
      <v-row class="templateform-row">
            <v-col cols="12" md="6" lg="6" class="px-0 pb-0">
              <v-text-field outlined hide-details dense clearable clear-icon="mdi-close-circle-outline" color="#4caf50" placeholder="ค้นหา" class="search-templateform search-templateform-btn-block">
                <template v-slot:append-outer>
                  <v-btn outlined color="#9e9e9e" class="search-templateform-btn">
                    <v-icon >mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="templateform-row">
            <v-col cols="12" md="auto" lg="auto" align-self="center" class="pb-0 pl-0 templateform-header">
              แบบฟอร์มทั้งหมด 1
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pb-0 px-0">
                  <v-btn color="#67C25D" dark depressed class="front-btn-templateform"><v-icon left>mdi-plus</v-icon>สร้างแบบฟอร์ม</v-btn>
            </v-col>
            <v-col cols="6" md="auto" lg="auto" class="pb-0 pl-2 pr-0">
                  <v-btn color="#67C25D" dark outlined class="front-btn-templateform"><v-icon left>mdi-inbox-arrow-down-outline</v-icon>นำเข้าแบบฟอร์ม</v-btn>
            </v-col>
          </v-row>
          <v-row class="table-top-spacer templateform-row">
            <v-data-table fixed-header :loading="false" :headers="templateform_table_header" :items="templateform_data" 
            class="fronttemplate-table-center templateform-table templateform-table-border templateform-table-header hide-templateform-table-progress templateform-table-data" 
            :footer-props="{'items-per-page-options': [5, 10, 15, 20]}">
              <template v-slot:loading> <!-- loading data in table -->
                <v-row align="center" justify="center" class="templateform-row templateform-data-load-block">
                  <img width="100px" src="../assets/loader.gif" class="templateform-load">
                </v-row>
              </template>
              <template v-slot:[`item.templateform_status`]="{ item }">
                <v-row no-gutters class="templateform-row">
                  <v-col cols="auto" md="auto" lg="auto" align-self="center"> <!-- form status for ready form -->
                    <v-icon size="16" color="#8BC34A" class="mr-1 mb-1">mdi-circle</v-icon>
                      พร้อมใช้งาน
                  </v-col>
                  <!-- <v-col cols="auto" md="auto" lg="auto" align-self="center"> <!-- form status for not ready form 
                    <v-icon size="16" color="error" class="mr-1 mb-1">mdi-circle</v-icon>
                      ไม่พร้อมใช้งาน
                  </v-col> -->
                </v-row>
              </template>
              <template v-slot:[`item.templateform_dowm`]="{ item }">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon color="#4CAF50">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                   <v-list-item>
                      <v-list-item-icon>
                          <v-icon color="#4CAF50">mdi-pencil</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title class="front-templateform-down">
                            แก้ไข
                          </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item> 
                    <v-list-item>
                      <v-list-item-icon>
                          <v-icon color="#4CAF50">mdi-open-in-new</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title class="front-templateform-down">
                            Export
                          </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item> 
                    <v-list-item>
                      <v-list-item-icon>
                          <v-icon color="#4CAF50">mdi-delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title class="front-templateform-down">
                            ลบ
                          </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item> 
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-row>
    </v-card>
  </div>
</template>

<script>
import { EventBus } from '../EventBus'
  export default {
    data: () => ({
      templateform_table_header: [
        {text: 'ลำดับ', align: 'center', sortable: true, value: 'templateform_no'},
        {text: 'ชื่อแบบฟอร์ม', align: 'start', sortable: true, value: 'templateform_name'},
        {text: 'รหัสเอกสาร', align: 'center', sortable: true, value: 'templateform_codedoc'},
        {text: 'แผนก', align: 'center', sortable: true, value: 'templateform_department'},
        {text: 'สร้างโดย', align: 'start', sortable: true, value: 'templateform_fullname'},
        {text: 'วันที่แก้ไขล่าสุด', align: 'center', sortable: true, value: 'templateform_date'},
        {text: 'สถานะ', align: 'start', sortable: true, value: 'templateform_status'},
        {text: '', align: 'center', sortable: false, value: 'templateform_dowm'}
      ],
     templateform_data: [
        {
            templateform_no: '1',
            templateform_name: 'TEST-DEV',
            templateform_codedoc: 'TEST-1112',
            templateform_department: 'Outsoure',
            templateform_fullname: 'ธวัชชัย หนองรวง',
            templateform_date: '2021-09-20 12:30:32',
            templateform_status: 'approved'
        }
     ],
      totalItemsTemplate: 0
    })
  }
</script>

<style>

  .templateform-page {
    height: calc(100vh - 72px);
  }

  .templateform-row {
    width: 100%;
    margin: 0% !important;
  }

  .templateform-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 18px;
    color: #1b9900;
  }

  .front-btn-templateform {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
  }

  .front-templateform-down {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
  }

  .search-templateform {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .search-templateform.v-text-field input {
    line-height: 24px !important;
  }

  .search-templateform.v-text-field .v-input__control {
    border-end-end-radius: 0px !important;
    border-start-end-radius: 0px !important;
  }

  .search-templateform-btn-block.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer {
    margin-top: 0% !important;
  }

  .v-application--is-ltr .search-templateform-btn-block .v-input__append-outer {
    margin-left: 0% !important;
  }

  .search-templateform-btn {
    background-color: #f5f7fa;
    border-start-start-radius: 0px;
    border-end-start-radius: 0px;
    height: 40px !important;
    min-width: 58px !important;
  }

  .templateform-table {
    width: 100%;
  }

  .templateform-table.v-data-table > .v-data-table__wrapper {
    height: calc(100vh - 272px);
    overflow: auto;
  }  

  .templateform-table-border .v-data-table__wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .templateform-table-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    font-family: 'Sarabun', sans-serif;
    font-size: 15px;
  }

  .hide-templateform-table-progress .v-data-table__progress {
    display: none;
  }

  .templateform-data-load-block {
    height: calc(100vh - 322px);
  }

  .templateform-load {
    opacity: 0.6;
  }

  .templateform-table-data.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
  }

  .fronttemplate-table-center > .v-data-table__wrapper > table > .v-data-table-header > tr > th:nth-child(2) {
    text-align: center !important;
  }

  .fronttemplate-table-center > .v-data-table__wrapper > table > .v-data-table-header > tr > th:nth-child(5) {
    text-align: center !important;
  }

  .fronttemplate-table-center > .v-data-table__wrapper > table > .v-data-table-header > tr > th:nth-child(7) {
    text-align: center !important;
  }

  .table-top-spacer {
      margin-top: 2% !important;
    }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/

    .table-top-spacer {
      margin-top: 0% !important;
    }

    .templateform-page {
      height: calc(100vh - 64px);
    }

    .templateform-table {
      margin-top: 4%;
    }

    .templateform-table.v-data-table > .v-data-table__wrapper {
      height: calc(100vh - 327px);
    }

    .templateform-data-load-block {
      height: calc(100vh - 385px);
      margin-left: 100% !important;
    }
  }
</style>