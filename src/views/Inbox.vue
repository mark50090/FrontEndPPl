<template>
  <div v-if="isReady" class="pt-1">
    <v-card outlined class="mb-1 mx-1 px-4 pt-2 inbox-page">
      <v-row class="inbox-row">
        <v-tabs color="#4caf50" v-model="tab">
          <v-tab class="inbox-tab-title">{{textLang.alldocuments}}</v-tab>
        </v-tabs>
      </v-row>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-row class="mt-1 inbox-row">
            <v-col cols="12" md="4" lg="4" class="px-0 pb-0">
              <v-text-field outlined hide-details dense clearable clear-icon="mdi-close-circle-outline" color="#4caf50" :placeholder="textLang.search" class="search-box search-btn-block" v-model="keyword" @keyup.enter="searchKeyword()">
                <template v-slot:append-outer>
                  <v-btn outlined color="#9e9e9e" class="search-btn" @click="searchKeyword()">
                    <v-icon >mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 doc-type-title">{{textLang.documenttype}}</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0">
              <v-autocomplete outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" class="type-doc-box type-doc-dropdown-icon" v-model="selectedTypeDocs" :items="typeDocument" @change="searchTypeDocs" item-text="name" item-value="_id" return-object></v-autocomplete>
            </v-col>
            <!-- filter document status for mobile only -->
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 doc-type-title display-mobile-only">{{textLang.documentstatus}}</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0 display-mobile-only">
              <v-select outlined hide-details dense color="#4caf50" append-icon="mdi-chevron-down" v-model="document_status" item-value="value" item-text="text" :menu-props="{ bottom: true, offsetY: true }" :items="docStatusOptions" class="status-doc-box type-doc-dropdown-icon"></v-select>
            </v-col>
            <!-- filter document period for mobile only -->
            <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-0 pb-0 doc-type-title display-mobile-only">{{ textLang.date_filter_title }}</v-col>
            <v-col cols="7" md="4" lg="4" class="px-0 pb-0 display-mobile-only">
              <v-menu offset-y :close-on-content-click="false" v-model="date_filter_menu_mobile">
                <template v-slot:activator="{ on }">
                  <v-text-field dense outlined hide-details color="#4caf50" append-icon="mdi-calendar-range-outline" v-on="on" v-model="date_filter_text" class="filter-date-box-mobile"></v-text-field>
                </template>
                <v-date-picker range show-current locale="th" color="#4caf50" :max="new Date().toISOString().substr(0, 10)" v-model="date_filter" @change="changeDateRange" class="filter-date-calendar"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row class="mt-3 inbox-row">
            <v-col cols="auto" md="auto" lg="auto" align-self="center" class="px-0 py-0 all-doc-header">{{textLang.alldocuments}} {{count_transaction_total}}</v-col>
            <!-- filter document period for pc only -->
            <v-spacer class="display-pc-only"></v-spacer>
            <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-0 py-0 doc-type-title display-pc-only">{{ textLang.date_filter_title }}</v-col>
            <v-col cols="4" md="4" lg="4" class="px-0 py-0 display-pc-only">
              <v-menu offset-y min-width="290" :close-on-content-click="false" v-model="date_filter_menu">
                <template v-slot:activator="{ on }">
                  <v-text-field dense outlined hide-details color="#4caf50" append-icon="mdi-calendar-range-outline" v-on="on" v-model="date_filter_text" class="filter-data-box"></v-text-field>
                </template>
                <v-date-picker range show-current locale="th" color="#4caf50" :max="new Date().toISOString().substr(0, 10)" v-model="date_filter" @change="changeDateRange" class="filter-date-calendar"></v-date-picker>
              </v-menu>
            </v-col> 
          </v-row>
          <!-- filter document status for pc only -->
          <v-row class="mt-5 inbox-row display-pc-only">
            <v-btn-toggle mandatory background-color="white" v-model="document_status" class="status-doc-block">
              <v-btn outlined tile value="all" class="status-doc-btn">
                {{textLang.all}}
                <v-badge inline dark color="black" :content="count_transaction_total"></v-badge>
              </v-btn>
              <v-btn outlined tile value="waiting" class="status-doc-btn">
                {{textLang.pendingapproval}}
                <v-badge inline light color="#F8F27C" :content="count_transaction_waiting" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="approved" class="status-doc-btn">
                {{textLang.approved}}
                <v-badge inline light color="#AFDEA9" :content="count_transaction_approved" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="inprogress" class="status-doc-btn">
                {{textLang.inprogress}} 
                <v-badge inline light color="#6EC4D6" :content="count_transaction_inprogress" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="rejected" class="status-doc-btn">
                {{textLang.rejectapproval}}
                <v-badge inline light color="#F49393" :content="count_transaction_rejected" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="incoming" class="status-doc-btn">
                {{textLang.pending}}
                <v-badge inline light color="#FCCD5A" :content="count_transaction_incoming" class="status-doc-num"></v-badge>
              </v-btn>
              <v-btn outlined tile value="cancelled" class="status-doc-btn">
                {{textLang.cancel_status}}
                <v-badge inline dark color="#bd2929" :content="count_transaction_cancel"></v-badge>
              </v-btn>
            </v-btn-toggle>
          </v-row>
          <v-row class="inbox-row">
            <v-data-table fixed-header :loading="false" :headers="inbox_header" @click:row="goToDocumentDetail($event._id, $event)" :options.sync="optionsTransaction" :server-items-length="totalItemsTransaction" :items="inbox_data" class="inbox-table inbox-table-border inbox-table-header hide-inbox-table-progress inbox-table-data" :footer-props="{'items-per-page-options': [5, 10, 15, 20]}">
              <template v-slot:loading> <!-- loading data in table -->
                <v-row align="center" justify="center" class="inbox-row inbox-data-load-block">
                  <img width="100px" src="../assets/loader.gif" class="inbox-load">
                </v-row>
              </template>
              <template v-slot:[`item.updatedAt`]="{ item }">
                <span>{{ item.updatedAt | fulldate }}</span>
              </template>
              <template v-slot:[`item.document_status_text`]="{ item }"> <!-- document status column -->
                <v-chip color="#F8F27C" v-if="item.document_status_text == 'waiting'">{{textLang.pendingapproval}}</v-chip> <!--สถานะ รออนุมัติ -->
                <v-chip color="#AFDEA9" v-if="item.document_status_text == 'approved'">{{textLang.approved}}</v-chip> <!--สถานะ อนุมัติแล้ว -->
                <v-chip color="#6EC4D6" v-if="item.document_status_text == 'inprogress'">{{textLang.inprogress}}</v-chip> <!--สถานะ กำลังดำเนินการ -->
                <v-chip color="#F49393" v-if="item.document_status_text == 'rejected'">{{textLang.rejectapproval}}</v-chip> <!--สถานะ ปฏิเสธอนุมัติ -->
                <v-chip color="#FCCD5A" v-if="item.document_status_text == 'incoming'">{{textLang.pending}}</v-chip> <!--สถานะ รอดำเนินการ -->
                <v-chip dark color="#bd2929" v-if="item.document_status_text == 'cancelled'">{{textLang.cancel_status}}</v-chip> <!-- สถานะ ยกเลิก -->
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
    computed: {
      textLang() {
        return this.$store.getters.textLang.Inbox
      },
      inbox_header() {
        return [
          {text: this.textLang.inboxheader.sender , align: 'start', sortable: false, value: 'sender_name'},
          {text: this.textLang.inboxheader.type , align: 'start', sortable: false, value: 'flow_detail.name'},
          {text: this.textLang.inboxheader.documentnumber , align: 'start', sortable: false, value: 'document_id'},
          {text: this.textLang.inboxheader.details , align: 'start', sortable: false, value: 'detail'},
          {text: this.textLang.inboxheader.status , align: 'center', sortable: false, value: 'document_status_text'},
          {text: this.textLang.inboxheader.date , align: 'start', sortable: false, value: 'updatedAt'}
        ]
      },
      docStatusOptions(){
        return this.doc_status_list.map(e => ({
          ...e,
          text: this.textLang[e.lang]
        }))
      },
      date_filter_text() {
        return this.date_filter.join(this.textLang.join_date_text)
      }
    },
    data: () => ({
      tax_id:'',
      keyword:'',
      status:'',
      lim:'',
      owned: false,
      tab: null,
      doc_status_list: [
        {text:'ทั้งหมด',lang: 'all',value:'all'}, 
        {text: 'รออนุมัติ',lang: 'pendingapproval',value:'waiting'}, 
        {text: 'อนุมัติแล้ว',lang: 'approved',value:'approved'}, 
        {text: 'กำลังดำเนินการ', lang: 'inprogress',value:'inprogress'}, 
        {text: 'ปฏิเสธอนุมัติ',lang: 'rejectapproval',value:'rejected'}, 
        {text: 'รอดำเนินการ',lang: 'pending',value:'incoming'},
        {text: 'ยกเลิก',lang: 'cancel_status',value:'cancelled'}
      ],
      //["","waiting","approved","inprogress","rejected","incoming"]
      document_status: 'all',
      count_transaction_total: 0,
      count_transaction_waiting: 0,
      count_transaction_approved: 0,
      count_transaction_inprogress: 0,
      count_transaction_rejected: 0,
      count_transaction_incoming: 0,
      count_transaction_cancel: 0,
      // inbox_header: [
      //   {text: 'ผู้ส่ง', align: 'start', sortable: true, value: 'sender_name'},
      //   {text: 'ประเภท', align: 'start', sortable: true, value: 'flow_detail.name'},
      //   {text: 'เลขที่เอกสาร', align: 'start', sortable: true, value: 'document_id'},
      //   {text: 'รายละเอียด', align: 'start', sortable: false, value: 'detail'},
      //   {text: 'สถานะ', align: 'center', sortable: true, value: 'document_status_text'},
      //   {text: 'วันที่', align: 'start', sortable: true, value: 'updatedAt'}
      // ],
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
      isChangeTab: false,
      currentAccount: "",
      date_filter_menu: false,
      date_filter_menu_mobile: false,
      date_filter: []
    }),
    

    mounted() {
      this.getdata()
      this.searchTransaction()
      this.countTransaction()
      EventBus.$emit('loadingOverlay', true)
      EventBus.$on('changeBiz', this.changeBiz)
      this.currentAccount = JSON.parse(sessionStorage.getItem('userProfile')).id
      if(sessionStorage.getItem('preinput_id') && sessionStorage.getItem('pre_template_id')) {
        this.redirectTemplate()
      }
    },
    beforeDestroy() {
      EventBus.$off('changeBiz')
    },
    watch:{
      "optionsTransaction.page"(newValue,oldValue){
        if (newValue != 1 || !this.isChangeTab) {
          this.searchTransaction({page:newValue}).then(data => {})
          this.countTransaction()
        }
        },
      "optionsTransaction.itemsPerPage"(newValue,oldValue){
          this.optionsTransaction.page = 1
          this.searchTransaction({page:1, itemsPerPage:newValue}).then(data => {})
          this.countTransaction()
        },
      "document_status"(newValue,oldValue){
        this.optionsTransaction.page = 1
        this.searchTransaction({status:newValue}).then(data => {})
        this.countTransaction()
        this.isChangeTab = true
      },
    },

    methods: {
      changeDateRange(){
        this.optionsTransaction.page = 1
        if(this.date_filter[0] && this.date_filter[1]) this.searchTransaction()
        this.date_filter_menu = false
        this.date_filter_menu_mobile = false
      },
      emitLoading(isLoad) {
        EventBus.$emit('loadingOverlay', isLoad)
      },
      redirectTemplate() {
        let tempOption = {
          template_id: sessionStorage.getItem('pre_template_id'),
          isCopy: false,
          isImport: false,
          transaction_id: "",
          preinput_id: sessionStorage.getItem('preinput_id')
        }
        sessionStorage.setItem('option',JSON.stringify(tempOption))
        sessionStorage.setItem('isDocEdit',false)
        sessionStorage.setItem('isDocStep',true)
        sessionStorage.setItem('isBack',false)
        sessionStorage.setItem('isStep',false)
        sessionStorage.setItem('isOnlyForm',true)
        sessionStorage.setItem('pre_template_id', "")
        sessionStorage.setItem('preinput_id', "")
        this.$router.push({ 'path': '/form/input'})
      },
      goToDocumentDetail(id, event) {
        if(event.document_status == "W") {
          var currentStep = event.flow_data.find(item => item.status == "W")
          if(currentStep && currentStep.action == "Fill" && currentStep.actor[0].permission_email.find(item => item.account_id == this.currentAccount)) {
            this.goToFillPage(event)
          } else {
            this.goToDetailPage(id)
          }
        } else {
          this.goToDetailPage(id)
        }
      },
      goToDetailPage(id) {
        sessionStorage.setItem('transaction_id', id)
        this.$router.push('/inbox/detail')
      },
      goToFillPage(event) {
        let tempOption = {
          template_id: "",
          isCopy: false,
          isImport: false,
          transaction_id: event._id
        }
        sessionStorage.setItem('option',JSON.stringify(tempOption))
        sessionStorage.setItem('isDocEdit',true)
        sessionStorage.setItem('isDocStep',true)
        sessionStorage.setItem('isBack',false)
        sessionStorage.setItem('isStep',false)
        sessionStorage.setItem('isOnlyForm',true)
        this.$router.push({ 'path': '/form/input'})
      },
      getdata() {
        // this.tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num //เรียกใช้ค่า id_card_num ของบริษัทที่เลือก จากตัวแปร selected_business ใน session storage
        this.getTypeDocs()
      },
      async searchTransaction(filter = {}) {
        const { page, itemsPerPage, status } = {
            page: this.optionsTransaction.page,
            itemsPerPage: this.optionsTransaction.itemsPerPage,
            status: this.document_status,
            ...filter
          } //set options ของ data-table

        this.inbox_data = [] //clear data in table
        try {
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          this.emitLoading(true)
          var { data } = await this.axios.post(this.$api_url + '/transaction/api/v1/searchTransaction', { //ตั้งค่าตัวแปร host ไว้แล้ว เรียกใช้เป็น this.$api_url ได้เลย
            tax_id: tax_id, //ต้องทดสอบอีกครั้งว่า ถ้าเปลี่ยน business แล้วค่านี้จะเปลี่ยนด้วยไหม (เพราะ set tax_id แค่ตอน mounted) ปกติจะเรียก get session มาใส่ในนี้โดยตรงเลย
            keyword: this.keyword, //คำในช่องค้นหา
            status: status == 'all' ? '': status, //เช็คค่าของ status ว่าถ้าเป็น all ให้ยิงเป็นค่าว่าง หรือถ้าไม่ ให้ยิงเป็นค่าของ status เลย
            flow_id: this.selectedTypeDocs._id,
            lim: itemsPerPage, //เปลี่ยนค่าให้รองรับกับ footer ของตาราง (จำนวนข้อมูลต่อหน้าตาราง 1 หน้า)
            offset: (page-1)*itemsPerPage || 0, // ค่าเริ่มต้นของข้อมูลในหน้าตารางนั้นๆ เช่นหน้าที่ 1 เริ่มข้อมูลที่อาเรย์ 0, หน้าที่ 2 เริ่มข้อมูลที่อาเรย์ 10(ในกรณีที่ itemsPerpage = 10)
            owned: false, // เป็นค่าคงที่
            start_date: this.date_filter[0],
            end_date: this.date_filter[1]
          })
          if(data.status){ //ถ้า response status == true
            data.result.forEach(element => { //วนลูปข้อมูลที่ได้จาก api
            if(!element.flow_detail.name) {
              element.flow_detail.name = this.textLang.customdoc
            }
            if(!element.object_text.message) {
              element.object_text.message = ""
            }
            if(!element.object_text.subject) {
              element.object_text.subject = ""
            }
              element.detail = `${element.object_text.subject} ${element.object_text.message}`
              this.inbox_data.push(element) // ใส่ค่าที่ได้จาก api ลงในตาราง
            });
            this.emitLoading(false)
          }
          // this.countTransaction()
        } catch (error) {
          console.log(error)
        }
        this.isChangeTab = false
      },
      async countTransaction(){
        var status = ""
        if(this.document_status == 'all') status = ""
        const { page, itemsPerPage } = this.optionsTransaction
        try {
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          // this.emitLoading(true)
          var { data } = await this.axios.post(this.$api_url + '/transaction/api/v1/countTransaction', {
            tax_id : tax_id,
            keyword: this.keyword,
            status: status,
            flow_id: this.selectedTypeDocs._id,
            lim: itemsPerPage,
            offset: (page-1)*itemsPerPage || 0,
            owned: false,
            start_date: this.date_filter[0],
            end_date: this.date_filter[1]
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
        // this.emitLoading(false)
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
        this.countTransaction()
      },
      changeBiz(){
        this.searchTransaction()
        this.countTransaction()
        this.getTypeDocs()
      },
      searchKeyword(){
        if(this.optionsTransaction.page == 1) {
          this.searchTransaction()
          this.countTransaction()
        }
        else this.optionsTransaction.page = 1
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
    font-size: 14px !important;
    text-transform: capitalize !important;
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

  .filter-data-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .filter-date-box.v-text-field input {
    line-height: 24px !important;
  }

  .filter-date-box-mobile {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .filter-date-box-mobile.v-text-field input {
    line-height: 24px !important;
  }

  .filter-date-box-mobile.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
    padding-left: 1% !important;
    padding-right: 0% !important;
  }

  .v-application--is-ltr .filter-date-box-mobile.v-text-field .v-input__append-inner {
    padding-left: 0% !important;
  }

  .filter-date-calendar {
    font-family: 'Sarabun', sans-serif;
  }

  .status-doc-block {
    border-radius: 0px !important;
  }

  .status-doc-btn {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px !important;
    color: black !important;
    text-transform: capitalize;
  }

  .status-doc-num .v-badge__badge {
    color: black !important;
  }

  .inbox-table {
    width: 100%;
  }

  .inbox-table.v-data-table > .v-data-table__wrapper {
    height: calc(100vh - 370px);
    overflow: auto;
  }  

  .inbox-table-border .v-data-table__wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .inbox-table-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    font-family: 'Sarabun', sans-serif;
    font-size: 15px;
  }

  .inbox-table-header .v-data-table-header-mobile {
    display: none;
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
      height: calc(100vh - 487px);
    }

    .inbox-data-load-block {
      height: calc(100vh - 506px);
      margin-left: 100% !important;
    }
  }
</style>