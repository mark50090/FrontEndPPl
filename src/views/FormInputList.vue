<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 px-4 formdoc-page">
          <v-row class="formdoc-row">
            <v-col cols="12" md="6" lg="6" class="px-0 pb-0">
              <v-text-field outlined hide-details dense clearable clear-icon="mdi-close-circle-outline" color="#4caf50" :placeholder="textLang.search" class="search-formdoc search-formdoc-btn-block" v-model="keyword" v-on:keyup.enter="searchKeyword()">
                <template v-slot:append-outer>
                  <v-btn outlined color="#9e9e9e" class="search-formdoc-btn" @click="searchKeyword()">
                    <v-icon >mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-5 formdoc-row alldoc-formdoc-header">
            {{textLang.alldocuments}} {{totalItemsTemplate}} 
          </v-row>
          <v-row class="mt-3 formdoc-row">
            <v-data-table fixed-header :loading="false" :headers="formdoc_table_header" :items="formdoc_data" class="front-table-center formdoc-table formdoc-table-border formdoc-table-header hide-formdoc-table-progress formdoc-table-data" :footer-props="{'items-per-page-options': [5, 10, 15, 20]}">
              <template v-slot:loading> <!-- loading data in table -->
                <v-row align="center" justify="center" class="formdoc-row formdoc-data-load-block">
                  <img width="100px" src="../assets/loader.gif" class="formdoc-load">
                </v-row>
              </template>
              <template v-slot:[`item.form_doc_insert`]="{ item }">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon color="#4CAF50">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item  @click="selectTemplate(item)">
                      <v-list-item-icon>
                          <v-icon color="#4CAF50">mdi-pen</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title class="front-insert-doc">
                            {{textLang.filloutdocument}}
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
      formdoc_table_header: [
        {text: 'ลำดับ', align: 'center', sortable: true, value: 'form_doc_no'},
        {text: 'ชื่อเอกสาร', align: 'start', sortable: true, value: 'form_doc_name'},
        {text: 'แผนก', align: 'center', sortable: true, value: 'form_doc_department'},
        // {text: 'ประเภทเอกสาร', align: 'center', sortable: true, value: 'form_doc_type'},
        {text: 'รหัสเอกสาร', align: 'center', sortable: true, value: 'form_doc_code'},
        // {text: 'วันที่บังคับใช้', align: 'center', sortable: true, value: 'form_doc_date'},
        // {text: 'เวอร์ชั่น', align: 'center', sortable: true, value: 'form_doc_version'},
        {text: '', align: 'center', sortable: false, value: 'form_doc_insert'}
      ],
      formdoc_data: [],
      optionsTemplate: {
        page:1,
        itemsPerPage: 10
      },
      totalItemsTemplate: 0,
      keyword: ""
    }),
    textLang:{
      search: 'ค้นหา',
      alldocuments: 'เอกสารทั้งหมด',
      filloutdocument: 'กรอกเอกสาร',
      number: 'ลำดับ',
      documentname: 'ชื่อเอกสาร',
      department: 'แผนก',
      documentID: 'รหัสเอกสาร',
    },
    mounted() {
      this.searchTemplate()
      EventBus.$emit('loadingOverlay', true)
      EventBus.$on('changeBiz', this.changeBiz)
    },
    methods: { 
      emitLoading(isLoad) {
        EventBus.$emit('loadingOverlay', isLoad)
      },
      async searchTemplate(filter = {}) {
        const { page, itemsPerPage, status } = {
            page: this.optionsTemplate.page,
            itemsPerPage: this.optionsTemplate.itemsPerPage,
            ...filter
          } 

        this.formdoc_data = [] 
        try {
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          this.emitLoading(true)
          var { data } = await this.axios.post(this.$api_url + '/template_form/api/v1/searchTemplate', { 
            tax_id: tax_id, 
            keyword: this.keyword,
            lim: itemsPerPage, 
            offset: (page-1)*itemsPerPage || 0, 
            is_active: true,
            is_fill: true
          })
          if(data.status){
            let index = 1
            data.result.forEach(element => { 
              this.formdoc_data.push({
                form_doc_no: index,
                form_doc_name: element.template_name,
                form_doc_department: element.department,
                form_doc_type: '',
                form_doc_code: element.code_template,
                form_doc_date: '',
                form_doc_version: '',
                template_id: element.template_id
              })
              index++
            })
          }
          this.countTemplate()
        } catch (error) {
          console.log(error)
        }
        this.emitLoading(false)
      },
      changeBiz(){
        this.searchTemplate()
      },
      async countTemplate(){
        try {
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          this.emitLoading(true)
          var { data } = await this.axios.post(this.$api_url + '/template_form/api/v1/countTemplate', {
            tax_id : tax_id,
            keyword: this.keyword,
            is_active: true,
            is_fill: true
          })
          if(data.status){
            this.totalItemsTemplate = data.result
          }
          this.changeTotalItem()
          this.isReady = true
        } catch (error) {
          this.isReady = true
        }
        this.emitLoading(false)
      },
      searchKeyword(){
        if(this.optionsTemplate.page == 1) this.searchTemplate()
        else this.optionsTemplate.page = 1
      },
      selectTemplate(item) {
        let tempOption = {
          template_id: item.template_id,
          isCopy: false,
          isImport: false,
          transaction_id: ""
        }
        sessionStorage.setItem('option',JSON.stringify(tempOption))
        sessionStorage.setItem('isDocEdit',false)
        sessionStorage.setItem('isDocStep',true)
        sessionStorage.setItem('isBack',false)
        sessionStorage.setItem('isStep',false)
        sessionStorage.setItem('isOnlyForm',true)
        this.$router.push({ 'path': '/form/input'})
      }
    }
  }
</script>

<style>
  .front-insert-doc {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
  }

  .formdoc-page {
    height: calc(100vh - 72px);
  }

  .formdoc-row {
    width: 100%;
    margin: 0% !important;
  }

  .search-formdoc {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .search-formdoc.v-text-field input {
    line-height: 24px !important;
  }

  .search-formdoc.v-text-field .v-input__control {
    border-end-end-radius: 0px !important;
    border-start-end-radius: 0px !important;
  }

  .search-formdoc-btn-block.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer {
    margin-top: 0% !important;
  }

  .v-application--is-ltr .search-formdoc-btn-block .v-input__append-outer {
    margin-left: 0% !important;
  }

  .search-formdoc-btn {
    background-color: #f5f7fa;
    border-start-start-radius: 0px;
    border-end-start-radius: 0px;
    height: 40px !important;
    min-width: 58px !important;
  }

  .alldoc-formdoc-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 18px;
    color: #1b9900;
  }

  .formdoc-table {
    width: 100%;
  }

  .formdoc-table.v-data-table > .v-data-table__wrapper {
    height: calc(100vh - 258px);
    overflow: auto;
  }  

  .formdoc-table-border .v-data-table__wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .formdoc-table-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    font-family: 'Sarabun', sans-serif;
    font-size: 15px;
  }

  .hide-formdoc-table-progress .v-data-table__progress {
    display: none;
  }

  .formdoc-data-load-block {
    height: calc(100vh - 312px);
  }

  .formdoc-load {
    opacity: 0.6;
  }

  .formdoc-table-data.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
  }

  .formdoc-table-data.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover {
    cursor: pointer;
  }

  .front-table-center > .v-data-table__wrapper > table > .v-data-table-header > tr > th:nth-child(2) {
    text-align: center !important;
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .formdoc-page {
      height: calc(100vh - 64px);
    }

    .formdoc-table {
      margin-top: 4%;
    }

    .formdoc-table.v-data-table > .v-data-table__wrapper {
      height: calc(100vh - 300px);
    }

    .formdoc-data-load-block {
      height: calc(100vh - 360px);
      margin-left: 100% !important;
    }
  }
</style>