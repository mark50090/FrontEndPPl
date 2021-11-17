<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 px-4 sentbox-page">
          <v-row class="sentbox-row">
            <v-col cols="12" md="4" lg="4" class="px-0 pb-0">
              <v-text-field outlined hide-details dense clearable clear-icon="mdi-close-circle-outline" color="#4caf50" :placeholder="textLang.search" class="search-sent-box search-sentbox-btn-block" v-model="keyword" @keyup.enter="searchKeyword()">
                <template v-slot:append-outer>
                  <v-btn outlined color="#9e9e9e" class="search-sentbox-btn" @click="searchKeyword()">
                    <v-icon >mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 front-sentbox-title">{{textLang.documenttype}}</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0">
              <v-autocomplete outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" class="type-doc-sentbox sent-box-dropdown-icon" v-model="selectedTypeDocs" :items="typeDocument" @change="searchTypeDocs" item-text="name" item-value="_id" return-object></v-autocomplete>
            </v-col>
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 front-sentbox-title display-mobile-only">{{textLang.documentstatus}}</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0 display-mobile-only">
              <v-select outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="docStatusOptions" v-model="document_status" item-value="value" item-text="text" class="status-doc-sentbox sent-box-dropdown-icon"></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-2 sentbox-row alldoc-sent-header">
            {{textLang.alldocuments}} {{count_transaction_total}}  
          </v-row>
          <v-row class="mt-3 sentbox-row display-pc-only">
            <v-btn-toggle mandatory background-color="white" v-model="document_status" class="status-sent-block">
              <v-btn outlined tile value="all" class="status-sentbox-btn">
                {{textLang.all}}
                <v-badge inline dark color="black" :content="count_transaction_total"></v-badge>
              </v-btn>
              <v-btn outlined tile value="waiting" class="status-sentbox-btn">
                {{textLang.pendingapproval}}
                <v-badge inline light color="#F8F27C" :content="count_transaction_waiting" class="status-sentbox-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="approved" class="status-sentbox-btn">
                {{textLang.approved}}
                <v-badge inline light color="#AFDEA9" :content="count_transaction_approved" class="status-sentbox-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="inprogress" class="status-sentbox-btn">
                {{textLang.inprogress}} 
                <v-badge inline light color="#6EC4D6" :content="count_transaction_inprogress" class="status-sentbox-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="rejected" class="status-sentbox-btn">
                {{textLang.rejectapproval}}
                <v-badge inline light color="#F49393" :content="count_transaction_rejected" class="status-sentbox-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="incoming" class="status-sentbox-btn">
                {{textLang.pending}}
                <v-badge inline light color="#FCCD5A" :content="count_transaction_incoming" class="status-sentbox-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="cancelled" class="status-sentbox-btn">
                {{textLang.cancel_status}}
                <v-badge inline dark color="#bd2929" :content="count_transaction_cancel"></v-badge>
              </v-btn>
            </v-btn-toggle>
          </v-row>
          <v-row class="sentbox-row">
            <v-data-table fixed-header :loading="false" :headers="sentbox_table_header" :items="sentbox_data" @click:row="goToDocumentDetail($event._id)" :options.sync="optionsTransaction" :server-items-length="totalItemsTransaction" class="sentbox-table sentbox-table-border sentbox-table-header hide-sentbox-table-progress sentbox-table-data" :footer-props="{'items-per-page-options': [5, 10, 15, 20]}">
              <template v-slot:loading> <!-- loading data in table -->
                <v-row align="center" justify="center" class="sentbox-row sentbox-data-load-block">
                  <img width="100px" src="../assets/loader.gif" class="sentbox-load">
                </v-row>
              </template>
              <template v-slot:[`item.updatedAt`]="{ item }">
                <span>{{ item.updatedAt | fulldate }}</span>
              </template>
              <template v-slot:[`item.document_status_text`]="{ item }">
                <v-chip color="#F8F27C" v-if="item.document_status_text == 'waiting'">{{textLang.pendingapproval}}</v-chip> 
                <v-chip color="#AFDEA9" v-if="item.document_status_text == 'approved'">{{textLang.approved}}</v-chip> 
                <v-chip color="#6EC4D6" v-if="item.document_status_text == 'inprogress'">{{textLang.inprogress}}</v-chip> 
                <v-chip color="#F49393" v-if="item.document_status_text == 'rejected'">{{textLang.rejectapproval}}</v-chip> 
                <v-chip color="#FCCD5A" v-if="item.document_status_text == 'incoming'">{{textLang.pending}}</v-chip>
                <v-chip dark color="#bd2929" v-if="item.document_status_text == 'cancelled'">{{textLang.cancel_status}}</v-chip>
              </template>
            </v-data-table>
          </v-row>
    </v-card>
  </div>
</template>

<script>
import { EventBus } from '../EventBus'
  export default {
    computed: {
      textLang() {
        return this.$store.getters.textLang.SentBoxList
      },
      sentbox_table_header() {
        return [
          {text: this.textLang.sentboxtable.sender , align: 'start', sortable: false, value: 'sender_name'},
          {text: this.textLang.sentboxtable.type , align: 'start', sortable: false, value: 'flow_detail.name'},
          {text: this.textLang.sentboxtable.documentnumber , align: 'start', sortable: false, value: 'document_id'},
          {text: this.textLang.sentboxtable.details , align: 'start', sortable: false, value: 'detail'},
          {text: this.textLang.sentboxtable.status , align: 'center', sortable: false, value: 'document_status_text'},
          {text: this.textLang.sentboxtable.date , align: 'start', sortable: false, value: 'updatedAt'},
        ]
      },
      docStatusOptions(){
        return this.sent_box_select.map(e => ({
          ...e,
          text: this.textLang[e.lang]
        }))
      }
    },
    data: () => ({
      tab: null,
      owned: true,
      lim:'',
      tax_id:'',
      keyword:'',
      document_status: 'all',
      count_transaction_total: 0,
      count_transaction_waiting: 0,
      count_transaction_approved: 0,
      count_transaction_inprogress: 0,
      count_transaction_rejected: 0,
      count_transaction_incoming: 0,
      count_transaction_cancel: 0,
      sent_box_select: [
        {text:'ทั้งหมด',lang: 'all',value:'all'}, 
        {text: 'รออนุมัติ',lang: 'pendingapproval',value:'waiting'}, 
        {text: 'อนุมัติแล้ว',lang: 'approved',value:'approved'}, 
        {text: 'กำลังดำเนินการ', lang: 'inprogress',value:'inprogress'}, 
        {text: 'ปฏิเสธอนุมัติ',lang: 'rejectapproval',value:'rejected'}, 
        {text: 'รอดำเนินการ',lang: 'pending',value:'incoming'},
        {text: 'ยกเลิก',lang: 'cancel_status',value:'cancelled'}
      ],
      // sentbox_table_header: [
      //   {text: 'ผู้ส่ง', align: 'start', sortable: true, value: 'sender_name'},
      //   {text: 'ประเภท', align: 'start', sortable: true, value: 'flow_detail.name'},
      //   {text: 'เลขที่เอกสาร', align: 'start', sortable: true, value: 'document_id'},
      //   {text: 'รายละเอียด', align: 'start', sortable: false, value: 'detail'},
      //   {text: 'สถานะ', align: 'center', sortable: true, value: 'document_status_text'},
      //   {text: 'วันที่', align: 'start', sortable: true, value: 'updatedAt'},
      // ],
      sentbox_data: [
          // {
          //   sent_box_sender: 'ธวัชชัย หนองรวง',
          //   sent_box_type: 'TEST-DEV',
          //   sent_box_number: 'TSDEV-45466',
          //   sent_box_details: 'เฉพาะทดสอบ - หัวเรื่อง test tao เฉพาะทดสอบ - ข้อความ',
          //   sent_box_status: 'waiting',
          //   sent_box_date: '7 ก.ย 2564',
          // }
        ],
      optionsTransaction: {
        page:1,
        itemsPerPage: 10
      },
      totalItemsTransaction: 0,
      typeDocument:[{name: 'ทั้งหมด', _id: "", detail: ""}],
      selectedTypeDocs: {name: 'ทั้งหมด', _id: "", detail: ""},
      isReady: false,  
      isChangeTab: false,
    }),
    
    mounted() {
      this.getdata()
      this.searchTransaction()
      EventBus.$emit('loadingOverlay', true)
      EventBus.$on('changeBiz', this.changeBiz)
    },
    beforeDestroy() {
      EventBus.$off('changeBiz')
    },
    watch:{
      "optionsTransaction.page"(newValue,oldValue){
        if (newValue != 1 || !this.isChangeTab) 
            this.searchTransaction({page:newValue}).then(data => {})
        },
      "optionsTransaction.itemsPerPage"(newValue,oldValue){
          this.optionsTransaction.page = 1
          this.searchTransaction({page:1, itemsPerPage:newValue}).then(data => {})
        },
      "document_status"(newValue,oldValue){
        this.optionsTransaction.page = 1
        this.searchTransaction({status:newValue}).then(data => {})
        this.changeTotalItem()
        this.isChangeTab = true
      }
    },

    methods: {
      emitLoading(isLoad) {
        EventBus.$emit('loadingOverlay', isLoad)
      },
      goToDocumentDetail(id) {
        sessionStorage.setItem('transaction_id', id)
        this.$router.push('/sent_box/detail')
      },
      getdata() {
        this.getTypeDocs()
      },
      async searchTransaction(filter = {}) {
        const { page, itemsPerPage, status } = {
            page: this.optionsTransaction.page,
            itemsPerPage: this.optionsTransaction.itemsPerPage,
            status: this.document_status,
            ...filter
          } 

        this.sentbox_data = [] 
        try {
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          this.emitLoading(true)
          var { data } = await this.axios.post(this.$api_url + '/transaction/api/v1/searchTransaction', { 
            tax_id: tax_id, 
            keyword: this.keyword, 
            status: status == 'all' ? '': status, 
            flow_id: this.selectedTypeDocs._id,
            lim: itemsPerPage, 
            offset: (page-1)*itemsPerPage || 0, 
            owned: true ,
          })
          if(data.status){ 
            data.result.forEach(element => { 
              this.sentbox_data.push(element) 
            });
          }
          this.countTransaction()
        } catch (error) {
          console.log(error)
        }
        this.emitLoading(false)
        this.isChangeTab = false
      },
      async countTransaction(){
        var status = ""
        if(this.document_status == 'all') status = ""
        const { page, itemsPerPage } = this.optionsTransaction
        try {
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          this.emitLoading(true)
          var { data } = await this.axios.post(this.$api_url + '/transaction/api/v1/countTransaction', {
            tax_id : tax_id,
            keyword: this.keyword,
            status: status,
            flow_id: this.selectedTypeDocs._id,
            lim: itemsPerPage,
            offset: (page-1)*itemsPerPage || 0,
            owned: true
          })
          if(data.status){
            var res = data.result
            this.count_transaction_total = res.total.toString()
            this.count_transaction_approved = res.approved.toString()
            this.count_transaction_waiting = res.waiting.toString()
            this.count_transaction_rejected = res.rejected.toString()
            this.count_transaction_inprogress = res.inprogress.toString()
            this.count_transaction_incoming = res.incoming.toString()
            this.count_transaction_cancel = res.cancelled.toString()
          }
          this.changeTotalItem()
          this.isReady = true
        } catch (error) {
          this.isReady = true
        }
        this.emitLoading(false)
      },
      changeTotalItem(){
        if(this.document_status == 'all') this.totalItemsTransaction = parseInt(this.count_transaction_total)
        else if(this.document_status == 'approved') this.totalItemsTransaction = parseInt(this.count_transaction_approved)
        else if(this.document_status == 'waiting') this.totalItemsTransaction = parseInt(this.count_transaction_waiting)
        else if(this.document_status == 'rejected') this.totalItemsTransaction = parseInt(this.count_transaction_rejected)
        else if(this.document_status == 'inprogress') this.totalItemsTransaction = parseInt(this.count_transaction_inprogress)
        else if(this.document_status == 'incoming') this.totalItemsTransaction = parseInt(this.count_transaction_incoming)
        else if(this.document_status == 'cancelled') this.totalItemsTransaction = parseInt(this.count_transaction_cancel)
      },
      async getTypeDocs() { 
        try {
          var url = '/flowdata/api/v1/getAllFlow?tax_id='
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          var { data } = await this.axios.get(this.$api_url + url + tax_id)
          if(data){ 
            data.result.forEach(element => { 
                  this.typeDocument.push(element)
            })
          }
        } catch (error) {
          console.log(error)
        }
      },
      searchTypeDocs(){
        this.searchTransaction()
      },
      changeBiz(){
        this.searchTransaction()
        this.getTypeDocs()
      },
      searchKeyword(){
        if(this.optionsTransaction.page == 1) this.searchTransaction()
        else this.optionsTransaction.page = 1
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
    text-transform: capitalize;
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