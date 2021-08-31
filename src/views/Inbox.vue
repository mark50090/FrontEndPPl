<template>
  <div v-if="isReady" class="pt-1">
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
              <v-text-field outlined hide-details dense clearable clear-icon="mdi-close-circle-outline" color="#4caf50" placeholder="ค้นหา" class="search-box search-btn-block" v-model="keyword" @keyup.enter="searchTransaction()">
                <template v-slot:append-outer>
                  <v-btn outlined color="#9e9e9e" class="search-btn" @click="searchTransaction()">
                    <v-icon >mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 doc-type-title">ประเภทเอกสาร</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0">
              <v-autocomplete outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" class="type-doc-box type-doc-dropdown-icon" v-model="selectedTypeDocs" :items="typeDocument" @change="searchTypeDocs" item-text="name" item-value="_id" return-object></v-autocomplete>
            </v-col>
            <!-- filter document status for mobile only -->
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 doc-type-title display-mobile-only">สถานะเอกสาร</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0 display-mobile-only">
              <v-select outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="doc_status_list" class="status-doc-box type-doc-dropdown-icon"></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-5 inbox-row all-doc-header">
            เอกสารทั้งหมด {{count_transaction_total}} 
          </v-row>
          <!-- filter document status for pc only -->
          <v-row class="mt-5 inbox-row display-pc-only">
            <v-btn-toggle mandatory background-color="white" v-model="document_status" class="status-doc-block">
              <v-btn outlined tile value="all" class="status-doc-btn">
                ทั้งหมด
                <v-badge inline dark color="black" :content="count_transaction_total"></v-badge>
              </v-btn>
              <v-btn outlined tile value="waiting" class="status-doc-btn">
                รออนุมัติ
                <v-badge inline light color="#F8F27C" :content="count_transaction_waiting" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="approved" class="status-doc-btn">
                อนุมัติแล้ว
                <v-badge inline light color="#AFDEA9" :content="count_transaction_approved" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="inprogress" class="status-doc-btn">
                กำลังดำเนินการ 
                <v-badge inline light color="#6EC4D6" :content="count_transaction_inprogress" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="rejected" class="status-doc-btn">
                ปฏิเสธอนุมัติ
                <v-badge inline light color="#F49393" :content="count_transaction_rejected" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="incoming" class="status-doc-btn">
                รอดำเนินการ
                <v-badge inline light color="#FCCD5A" :content="count_transaction_incoming" class="status-doc-num"></v-badge>
              </v-btn>
            </v-btn-toggle>
          </v-row>
          <v-row class="inbox-row">
            <v-data-table fixed-header :loading="false" :headers="inbox_header" @click:row="goToDocumentDetail()" :options.sync="optionsTransaction" :server-items-length="totalItemsTransaction" :items="inbox_data" class="inbox-table inbox-table-border inbox-table-header hide-inbox-table-progress inbox-table-data">
              <template v-slot:loading> <!-- loading data in table -->
                <v-row align="center" justify="center" class="inbox-row inbox-data-load-block">
                  <img width="100px" src="../assets/loader.gif" class="inbox-load">
                </v-row>
              </template>
              <template v-slot:[`item.updatedAt`]="{ item }">
                <span>{{ item.updatedAt | fulldate }}</span>
              </template>
              <template v-slot:[`item.document_status_text`]="{ item }"> <!-- document status column -->
                <v-chip color="#F8F27C" v-if="item.document_status_text == 'waiting'">รออนุมัติ</v-chip> <!--สถานะ รออนุมัติ -->
                <v-chip color="#AFDEA9" v-if="item.document_status_text == 'approved'">อนุมัติแล้ว</v-chip> <!--สถานะ อนุมัติแล้ว -->
                <v-chip color="#6EC4D6" v-if="item.document_status_text == 'inprogress'">กำลังดำเนินการ</v-chip> <!--สถานะ กำลังดำเนินการ -->
                <v-chip color="#F49393" v-if="item.document_status_text == 'rejected'">ปฏิเสธอนุมัติ</v-chip> <!--สถานะ ปฏิเสธอนุมัติ -->
                <v-chip color="#FCCD5A" v-if="item.document_status_text == 'incoming'">รอดำเนินการ</v-chip> <!--สถานะ รอดำเนินการ -->
              </template>
            </v-data-table>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import { EventBus } from '../EventBus'
  export default {
    data: () => ({
      tax_id:'',
      keyword:'',
      status:'',
      lim:'',
      owned: false,
      tab: null,
      doc_status_list: ['ทั้งหมด', 'รออนุมัติ', 'อนุมัติแล้ว', 'กำลังดำเนินการ', 'ปฏิเสธอนุมัติ', 'รอดำเนินการ'],
      //["","waiting","approved","inprogress","rejected","incoming"]
      document_status: 'all',
      count_transaction_total: 0,
      count_transaction_waiting: 0,
      count_transaction_approved: 0,
      count_transaction_inprogress: 0,
      count_transaction_rejected: 0,
      count_transaction_incoming: 0,
      inbox_header: [
        {text: 'ผู้ส่ง', align: 'start', sortable: true, value: 'sender_name'},
        {text: 'ประเภท', align: 'start', sortable: true, value: 'flow_detail.name'},
        {text: 'เลขที่เอกสาร', align: 'start', sortable: true, value: 'document_id'},
        {text: 'รายละเอียด', align: 'start', sortable: false, value: 'detail'},
        {text: 'สถานะ', align: 'center', sortable: true, value: 'document_status_text'},
        {text: 'วันที่', align: 'start', sortable: true, value: 'updatedAt'}
      ],
      inbox_data: [
        // {sender: 'คนดีย์ สิ้นชีวาลัย', doc_type: 'ใบเบิกเงินค่ารักษาพยาบาล', document_id: 'OTHER-63000000214', detail: 'ขอเบิกค่าถอนฟันหน่อยนะ', document_status_text: '', updateAt: '30/12/2020'},
      ],
      optionsTransaction: {
        page:1,
        itemsPerPage: 10
        },
      totalItemsTransaction: 0,
      typeDocument:[{name: 'ทั้งหมด', _id: "", detail: ""}],
      selectedTypeDocs: {name: 'ทั้งหมด', _id: "", detail: ""},
      isReady: false,
    }),
    mounted() {
      this.getdata()
      this.searchTransaction()
      EventBus.$emit('loadingOverlay', true)
      EventBus.$on('changeBiz', this.changeBiz)
    },
    watch:{
      "optionsTransaction.page"(newValue,oldValue){
          if (newValue != 1) 
            this.searchTransaction({page:newValue}).then(data => {})
        },
      "optionsTransaction.itemsPerPage"(newValue,oldValue){
          this.optionsTransaction.page = 1
          this.searchTransaction({page:1, itemsPerPage:newValue}).then(data => {})
        },
      "document_status"(newValue,oldValue){
        this.optionsTransaction.page = 1
        this.searchTransaction({status:newValue}).then(data => {})
      }
    },

    methods: {
      emitLoading(isLoad) {
        EventBus.$emit('loadingOverlay', isLoad)
      },
      goToDocumentDetail() {
        this.$router.push('/inbox/detail')
      },
      getdata() {
        // this.tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num //เรียกใช้ค่า id_card_num ของบริษัทที่เลือก จากตัวแปร selected_business ใน session storage
        this.getTypeDocs()
      },
      async searchTransaction(filter = {}) { // ใช้แค่ params status เพราะตัวอื่นเรียกค่าจาก this ได้
        const { page, itemsPerPage, status } = {
            page: this.optionsTransaction.page,
            itemsPerPage: this.optionsTransaction.itemsPerPage,
            status: this.document_status,
            ...filter
          } //set options ของ data-table

        this.inbox_data = [] //clear data in table
        // var status = this.document_status
        // if(status == 'all') status = "" //status ทั้งหมด ต้องยิง body เป็น ""
        try {
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          this.emitLoading(true)
          var { data } = await this.axios.post(this.$api_url + '/transaction/api/v1/searchTransaction', { //ตั้งค่าตัวแปร host ไว้แล้ว เรียกใช้เป็น this.$api_url ได้เลย
            tax_id: tax_id, //ต้องทดสอบอีกครั้งว่า ถ้าเปลี่ยน business แล้วค่านี้จะเปลี่ยนด้วยไหม (เพราะ set tax_id แค่ตอน mounted) ปกติจะเรียก get session มาใส่ในนี้โดยตรงเลย
            keyword: this.keyword, //คำในช่องค้นหา
            status: status == 'all' ? '': status, //params status ที่เก็บมา
            flow_id: this.selectedTypeDocs._id,
            lim: itemsPerPage, //เปลี่ยนค่าให้รองรับกับ footer ของตาราง (จำนวนข้อมูลต่อหน้าตาราง 1 หน้า)
            offset: (page-1)*itemsPerPage || 0, // ค่าเริ่มต้นของข้อมูลในหน้าตารางนั้นๆ เช่นหน้าที่ 1 เริ่มข้อมูลที่อาเรย์ 0, หน้าที่ 2 เริ่มข้อมูลที่อาเรย์ 10(ในกรณีที่ itemsPerpage = 10)
            owned: false // เป็นค่าคงที่
          })
          if(data.status){ //ถ้า response status == true
            data.result.forEach(element => { //วนลูปข้อมูลที่ได้จาก api
                this.inbox_data.push(element) // ใส่ค่าที่ได้จาก api ลงในตาราง
            });
          }
          this.countTransaction()
        } catch (error) {
          console.log(error)
        }
        this.emitLoading(false)
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
            owned: false
          })
          if(data.status){
            var res = data.result
            this.count_transaction_total = res.total.toString()
            this.count_transaction_approved = res.approved.toString()
            this.count_transaction_waiting = res.waiting.toString()
            this.count_transaction_rejected = res.rejected.toString()
            this.count_transaction_inprogress = res.inprogress.toString()
            this.count_transaction_incoming = res.incoming.toString()
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
        // this.countTransaction()
      },
      changeBiz(){
        this.searchTransaction()
        this.getTypeDocs()
      }
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