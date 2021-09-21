<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 create-doc-page">
      <v-row class="create-row">
        <v-col cols="12" md="6" lg="6" class="pa-2 pdf-create-card-block">
          <v-overlay absolute opacity="0.3" :value="loading_pdf" class="load-pdf-block"> <!-- load pdf -->
            <img width="100px" src="../assets/loader.gif" class="load-pdf">
          </v-overlay>
          <v-card elevation="0" color="rgb(82, 86, 89)">
            <v-card-title class="pa-0 create-pdf-bar">
              <v-row class="create-row" v-if="uploadedFile"> <!-- show when it has pdf -->
                <v-spacer></v-spacer>
                <v-col cols="8" md="9" lg="9" align-self="center" class="py-2 text-center">
                  <v-btn icon x-small color="white" @click="change_page_fn('prev')">
                    <v-icon size="16">mdi-arrow-left</v-icon>
                  </v-btn>
                  <span class="mx-1 create-pdf-page">{{ page }} / {{ page_count }}</span>
                  <v-btn icon x-small color="white" @click="change_page_fn('next')">
                    <v-icon size="16">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="py-0 pr-2">
                  <v-btn icon large color="white" @click="gopdf()">
                    <v-icon large>mdi-text-box-search</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="px-1 pb-1">
              <v-row align="center" justify="center" class="mt-1 create-row create-pdf-block">
                <!-- pdf -->
                <div id="pdfBg_create">
                  <!-- pdf -->
                  <div style="position: relative; display: block">
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
                    <vue-draggable-resizable
                      :id="item.name"
                      v-for="(item, index) in signArray"
                      :key="index"
                      :x="item.sign_position_x"
                      :y="item.sign_position_y"
                      :w="item.sign_box_width" 
                      :h="item.sign_box_heigth"
                    >
                      <v-row no-gutters justify="center" align="center">
                        <span v-if="item.show == true" style="color: grey">
                          ลำดับที่ {{ item.index }}
                        </span>
                      </v-row>
                    </vue-draggable-resizable>
                </div>
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <v-row class="create-row">
            <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-0 pt-2 select-file-title">
              เลือกไฟล์ :
            </v-col>
            <v-col cols="9" md="" lg="" class="px-0 pt-2">
              <v-file-input dense outlined hide-details color="#67C25D" truncate-length="60" placeholder="เลือกไฟล์" prepend-icon="" :clearable="false" accept="application/pdf" v-model="uploadedFile" @change="inputFile" class="create-file delete-file-btn-block">
                <template v-slot:append-outer>
                  <v-btn icon :disabled="!uploadedFile" color="#424242" @click="clearUploadedFile"> <!-- delete pdf button -->
                    <v-icon size="28px">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
          <v-card outlined class="mt-1">
            <v-overlay absolute opacity="0.5" color="white" :value="!uploadedFile"></v-overlay> <!-- overlay show when it doesn't has document file -->
            <v-card-title class="pa-0">
              <v-tabs grow height="40px" color="#4CAF50" v-model="create_tab">
                <v-tab class="create-tab-title">ตั้งค่าการส่ง</v-tab>
                <v-tab class="create-tab-title">รูปแบบอนุมัติ</v-tab>
                <v-tab v-if="false" class="create-tab-title">กำหนดเอง</v-tab>
              </v-tabs>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="px-2 pt-0 pb-2 create-detail-block">
              <v-tabs-items v-model="create_tab">
                <!-- document setting tab -->
                <v-tab-item>
                  <v-row class="create-row">
                    <v-col cols="4" md="3" lg="3" align-self="center" class="pl-2 pt-4 create-setting-title">
                      ชื่อเอกสาร :
                    </v-col>
                    <v-col cols="8" md="9" lg="9" align-self="center" class="px-0 pt-4">
                      <v-text-field dense outlined hide-details color="#4CAF50" class="create-setting create-setting-input"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="4" md="3" lg="3" align-self="center" class="pl-2 pt-0 create-setting-title">
                      ข้อความ :
                    </v-col>
                    <v-col cols="8" md="9" lg="9" align-self="center" class="px-0 pt-0">
                      <v-text-field dense outlined hide-details color="#4CAF50" class="create-setting create-setting-input"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="12" md="3" lg="3" class="pl-2 pt-2 create-setting-title">
                      แนบไฟล์ :
                    </v-col>
                    <v-col cols="12" md="9" lg="9" class="pr-0 pt-0 create-attach-file-block">
                      <v-file-input dense outlined multiple counter show-size chips small-chips color="#4CAF50" prepend-icon="" append-outer-icon="$file" placeholder="เลือกไฟล์แนบ" class="create-setting">
                        <template v-slot:selection="{ text }">
                          <v-chip small dark close color="#4CAF50">{{ text }}</v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <!-- select work flow tab -->
                <v-tab-item >
                  <v-row class="create-row">
                    <v-col cols="5" md="4" lg="4" align-self="center" class="pl-2 pb-0 create-setting-title">
                      ประเภทเอกสาร :
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-autocomplete v-model="selected_document_type" :items="document_type_list" item-text="keyword" item-value="_id" return-object @change="getDocumentTemplate" dense outlined hide-details auto-select-first color="#4caf50" placeholder="เลือก" append-icon="mdi-chevron-down" class="create-setting create-setting-input email-step-box create-setting-dropdown-icon"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="5" md="4" lg="4" align-self="center" class="pl-2 pb-0 create-setting-title">
                      รูปแบบเอกสาร :
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-autocomplete v-model="selected_document_template" :items="document_template_list" item-text="name" item-value="_id" return-object @change="getFlowData" dense outlined hide-details auto-select-first color="#4caf50" placeholder="เลือก" append-icon="mdi-chevron-down" :disabled="false" :filled="false" class="create-setting create-setting-input email-step-box create-setting-dropdown-icon"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="create-row" v-if="false"> <!-- department row. Show when document type and document style are selected -->
                    <v-col cols="5" md="4" lg="4" align-self="center" class="pl-2 pb-0 create-setting-title">
                      แผนกสายงาน :
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-autocomplete dense outlined hide-details auto-select-first color="#4caf50" placeholder="ระบุแผนก" append-icon="mdi-chevron-down" class="create-setting create-setting-input email-step-box create-setting-dropdown-icon"></v-autocomplete> <!-- when it has many departments -->
                      <!-- <span class="create-setting-title">การเงินและธุรการ</span> --> <!-- when it has only one department -->
                    </v-col>
                  </v-row>
                  <v-card outlined class="mt-4 px-2 pb-2 workflow-block">
                    <template  v-for="flow_data in flow_datas" >
                      <v-row class="create-row" :key="flow_data.index">
                        <v-col cols="auto" md="auto" lg="auto" class="pl-1 pb-2 create-setting-title">
                          ลำดับ {{ flow_data.index+1 }} : {{ flow_data.action | translate }} <!-- or ผู้มีสิทธิ์เซ็น -->
                        </v-col>
                      </v-row>
                      <v-row class="create-row each-step-mail-row" v-for="actor_email in flow_data.actor[0].permission_email" :key="flow_data.index + actor_email.account_id"> <!-- each email row in step -->
                        <v-col cols="8" md="9" lg="9" class="px-0 pt-1 pb-0">
                          <v-text-field dense outlined hide-details color="#67C25D" v-model="actor_email.thai_email" placeholder="@one.th" class="create-setting email-step-box each-email-icon">
                            <template v-slot:prepend>
                              <v-icon large>mdi-account</v-icon>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 pt-1 pb-0">
                          <v-checkbox hide-details label="OneChat" v-model="actor_email.checkbox" checked class="mt-0 pt-0 onechat-check"></v-checkbox>
                        </v-col>
                      </v-row>
                    </template>
                  </v-card>
                </v-tab-item>
                <!-- custom work flow tab -->
                <v-tab-item>
                  <v-row class="create-row">
                    <v-col cols="12" md="4" lg="4" align-self="center" class="pl-2 pt-4 pb-0 create-setting-title">
                      ประเภทเอกสาร :
                    </v-col>
                    <v-col cols="12" md="8" lg="8" align-self="center" class="pr-0 pt-4 pb-0 create-attach-file-block">
                      <v-autocomplete v-model="selected_document_type_custom" :items="document_type_list" item-text="keyword" item-value="_id" return-object dense outlined hide-details auto-select-first color="#4caf50" placeholder="เลือก" append-icon="mdi-chevron-down" class="create-setting create-setting-input create-setting-dropdown-icon"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="7" md="4" lg="4" align-self="center" class="pl-2 pr-1 pt-1 pb-0 create-setting-title">
                      Require Certificate (CA) :
                    </v-col>
                    <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 pt-1 pb-0">
                      <v-switch inset hide-details class="mt-0 create-setting-switch"></v-switch>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="7" md="4" lg="4" align-self="center" class="pl-2 pr-1 pt-1 pb-0 create-setting-title">
                      Stamp All Page :
                    </v-col>
                    <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 pt-1 pb-0">
                      <v-switch inset hide-details class="mt-0 create-setting-switch"></v-switch>
                    </v-col>
                  </v-row>
                  <v-row justify="center" class="create-row">
                    <v-col cols="5" md="4" lg="4" class="pl-0 pr-1 pt-1 pb-2">
                      <v-btn small block color="#67C25D" :disabled="false" class="add-step-btn">
                        <v-icon small class="mr-1">mdi-plus</v-icon> เพิ่ม (อนุมัติ)
                      </v-btn>
                    </v-col>
                    <v-col cols="5" md="4" lg="4" class="pl-0 pr-1 pt-1 pb-2">
                      <v-btn small block color="#67C25D" :disabled="false" class="add-step-btn">
                        <v-icon small class="mr-1">mdi-plus</v-icon> เพิ่ม (เซ็น)
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-card outlined class="pa-2 all-step-block">
                    <div class="mb-3"> <!-- each step -->
                      <v-row class="create-row">
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 py-1 create-setting-title">
                          ลำดับ 20 : ผู้มีสิทธิ์อนุมัติ <!-- or ผู้มีสิทธิ์เซ็น -->
                        </v-col>
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-2 pr-1 py-1">
                          <v-btn outlined fab x-small color="error" class="px-0 delete-step-btn"> <!-- delete step button -->
                            <v-icon small>mdi-minus</v-icon>
                          </v-btn>
                        </v-col>
                        <v-spacer></v-spacer>
                        <template> <!-- show when it is sign step -->
                          <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pr-2 py-1 create-setting-title display-pc-only">
                            หน้าที่เซ็น
                          </v-col>
                          <v-col cols="3" md="2" lg="2" class="px-0 py-1">
                            <v-select outlined dense hide-details label="หน้า" color="#67C25D" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="pdf_page_list" class="create-setting page-sign-box page-sign-dropdown-icon create-setting-dropdown-icon"></v-select>
                          </v-col>
                        </template>
                      </v-row>
                      <v-row class="create-row each-step-mail-row"> <!-- each email row in step -->
                        <v-col cols="7" md="7" lg="7" class="px-0 pt-1 each-email-step-block">
                          <v-text-field dense outlined hide-details color="#67C25D" placeholder="@one.th" class="create-setting email-step-box each-email-icon">
                            <template v-slot:prepend>
                              <v-icon large>mdi-account</v-icon>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-col cols="5" md="5" lg="5" align-self="center" class="pa-0">
                          <v-row class="create-row ">
                            <v-col cols="12" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 py-0">
                              <v-checkbox hide-details label="OneChat" class="mt-0 pt-0 onechat-check"></v-checkbox>
                            </v-col>
                            <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pt-0 pl-2 pr-0 add-delete-permission-block"> <!-- delete email in each step button -->
                              <v-btn outlined fab x-small color="#67C25D" class="delete-permission-btn">
                                <v-icon>mdi-minus</v-icon>
                              </v-btn>
                            </v-col>
                            <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pt-0 px-2 add-delete-permission-block"> <!-- add email in each step button -->
                              <v-btn depressed fab x-small dark color="#67C25D" class="delete-permission-btn">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
          <v-row v-if="(create_tab == 1) || (create_tab == 2)" justify="end" class="create-row">
            <v-col cols="auto" md="auto" lg="auto" class="pt-1">
              <v-btn depressed color="#67C25D" :disabled="!selected_document_template" class="send-doc-btn" @click="addTransaction">ส่งเอกสาร</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <Showpdf/>
  </div>
</template>

<script>
import { EventBus } from '../EventBus'
import Showpdf from '../components/ShowPdf'
import pdf from 'vue-pdf'
import vueSignature from 'vue-signature'
import VueDraggableResizable from 'vue-draggable-resizable'

  export default {
    components: {
      Showpdf,
      pdf,
      vueSignature,
      VueDraggableResizable
    },
    data: () => ({
      create_tab: null,
      pdf_page_list: [],
      pdf_src: undefined,
      page_count: 0,
      page: 1,
      signArray: [],
      uploadedFile: undefined,
      loading_pdf: false,
      sign_position: [],
      allStatus: [true, true, true, true],
      default_sign: '',
      padStatus: false,
      step_flow: [],
      doc_details: {},
      selected_document_type: '',
      selected_document_type_custom: '',
      document_type_list: [],
      selected_document_template: '',
      document_template_list: [],
      actionOrder: 1,
      action: '',
      flow_datas: [],
      flow_id: '',
      last_step: 0,
      width: null,
      height: null,
      x: 100,
      y: 100,
      sign_position_new: [
        {
          w: 50,
          h: 50,
          x: 10,
          y: -100
        }
      ],
    }),
    mounted() {
      this.getDocumentType()
    },
    filters:{
      translate(keyword){
        switch (keyword){
          case "Sign" : return 'ผู้มีสิทธิ์เซ็น'
          case "Approve" : return 'ผู้มีสิทธิ์อนุมัติ'
          default: return "" 
        }
      }
    },
    methods: {
      emitLoading(isLoad) {
        EventBus.$emit('loadingOverlay', isLoad)
      },
      clearUploadedFile(){
        this.uploadedFile = undefined
        this.pdf_src = undefined
        this.sign_position = []
        this.signArray = []
      },
      async getDocumentType(){
        try {
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          var url = `/doctype/api/v1?tax_id=`
          var {data} = await this.axios.get(this.$api_url + url + tax_id)
          if(data.status) {
            data.data.forEach(element => {
              this.document_type_list.push(element)
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      async getDocumentTemplate(){
        this.document_template_list = []
        this.selected_document_template = ''
        this.flow_datas = []
        try {
          var url = `/flowdata/api/v1/getbydocID?document_type_id=${this.selected_document_type._id}`
          var {data} = await this.axios.get(this.$api_url + url)
          if(data.status){
            data.data.forEach(element => {
              this.document_template_list.push(element)
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      async getFlowData(){
        this.emitLoading(true)
        this.sign_position = []
        try {
          if(this.selected_document_template){
            var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
            var url = `/flowdata/api/v1/get1/?_id=${this.selected_document_template._id}&tax_id=${tax_id}`
            var {data} = await this.axios.get(this.$api_url + url)
            if(data.status){
              this.flow_id = data.data._id
              this.flow_datas = [...data.data.flow_data]
              this.flow_datas.forEach(flow_data => {
                if(!flow_data.actor[0].permission_email.length){
                  flow_data.actor[0].permission_email = [{account_id : new Date()}]
                }
                flow_data.actor[0].permission_email.forEach(email => {
                  email.checkbox = true
                })
                this.sign_position.push(flow_data.approver.sign_position)
                this.sign_position_new.push(flow_data.approver.sign_position)
              })
              this.loadedPDF()
              this.loaded()
            }
          }
          else{
            this.flow_datas = []
          }
        } catch (error) {
          console.log(error);
        }
        this.emitLoading(false)
      },
      async addTransaction(){
        try {
          this.emitLoading(true)
          var url = '/transaction/api/v1/addtransaction'
          var {data} = await this.axios.post(this.$api_url + url,{
              flow_id: this.flow_id,
              file_name: this.uploadedFile.name,
              pdfbase: this.pdf_src.slice(28)
          })
          if(data.status){
            this.emitLoading(false)
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">สำเร็จ</strong>',
              text: 'สร้าง transaction สำเร็จ',
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
            this.$router.push('/inbox')
          }
        } catch (error) {
          console.log(error);
          this.emitLoading(false)
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">ล้มเหลว</strong>',
            text: 'สร้าง transaction ไม่สำเร็จ',
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
      },
      inputFile(){
        this.basePDF()
      },
      basePDF(){
        if(this.uploadedFile){
          this.loading_pdf = true
          var reader = new FileReader();
          reader.readAsDataURL(this.uploadedFile);
          reader.onload = () => {
            this.pdf_src = reader.result
            this.loading_pdf = false
          };
        }
      },
      change_page_fn(type){
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
      gopdf() {
        EventBus.$emit('showpdf', this.pdf_src)
      },
      loadedPDF () {
        if (this.sign_position.length) {
            this.sign_position = this.sign_position.map((element) => {
              if (element.sign_page !== 'all') {
                element.sign_page = (typeof element.sign_page === 'string' ? element.sign_page : element.sign_page.toString()).split(',')
            for (var i = 0; i < element.sign_page.length; i++) { element.sign_page[i] = +element.sign_page[i] }
          } else element.sign_page = Array.from({ length: this.page_count }, (_, i) => i + 1)
          return element
          })
        }
        // this.setPreViewImg()
      },
      loaded: function (e) {
        if(this.sign_position.length) this.reShowSign(this.sign_position)
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
            sign_position_x: 0,
            sign_position_y: 0,
            sign_box_width: 1,
            sign_box_heigth: 1,
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
            } else {
              this.multiShow(step_array + 1, false)
              this.setPositionSign(
                this.signArray[index].index,
                data[index].sign_llx,
                data[index].sign_lly,
                data[index].sign_urx,
                data[index].sign_ury
              )
            }
          }, 100)
          console.log(this.signArray);

        }
      },
      setPositionSign(index, llx, lly, urx, ury) {
        console.log(index, llx, lly, urx, ury)
        var arr_index = index - 1

        var cardWidth = $('#pdfBg_create')[0].getBoundingClientRect().width
        var cardHeight = $('#pdfBg_create')[0].getBoundingClientRect().height

        var clientWidth = $('#pdfDiv')[0].getBoundingClientRect().width
        var clientHeight = $('#pdfDiv')[0].getBoundingClientRect().height

        var _pxdraggableDivHeight = clientHeight * parseFloat(ury)
        var _pxdraggableDivWidth = clientWidth * parseFloat(urx)

        var setWidth = parseFloat(clientWidth) * llx
        var setHeight = parseFloat(clientHeight) * lly

        this.sign_position[arr_index].sign_llx = llx
        this.sign_position[arr_index].sign_lly = lly
        this.sign_position[arr_index].sign_urx = urx
        this.sign_position[arr_index].sign_ury = ury

        this.signArray[arr_index].sign_position_x = clientWidth*(+llx)
        this.signArray[arr_index].sign_position_y = ((-setHeight)+ (Math.abs(ury-lly)))+(-clientHeight)*(+lly+(ury-lly))
        this.signArray[arr_index].sign_box_heigth = (clientHeight*(ury))
        this.signArray[arr_index].sign_box_width = (clientWidth*urx)
      },
      multiShow (index, status) {
        // this.last_step = this.signArray.length
        this.signArray[index - 1].show = status
        $('#draggableDiv' + index).css('cursor', 'move')
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
          $("#draggableDiv" + index).draggable({
            containment: "#pdfDiv",
            cursor: "move",
            scroll: true,
            scrollSensitivity: 100,
            disabled: false,
          });
          document
            .getElementById("draggableDiv" + index)
            .addEventListener("mousedown", () => {
              this.eventMouse = true;
              this.indexEventMouse = index;
            });
          document
            .getElementById("draggableDiv" + index)
            .addEventListener("mouseup", () => {
              // this.setSigntemplate(index);
              this.eventMouse = false;
            });
          // this.setSigntemplate(index)
        } else $('#draggableDiv' + index).css('display', 'none')
      },
    }
  }
</script>

<style>
  .create-doc-page {
    height: calc(100vh - 72px);
  }

  .create-row {
    width: 100%;
    margin: 0% !important;
  }

  .pdf-create-card-block {
    position: relative;
  }

  .load-pdf-block {
    border-radius: 4px;
  }

  .load-pdf {
    opacity: 0.6;
  }

  .create-pdf-bar {
    background: rgb(50, 54, 57);
    height: 48px;
  }

  .create-pdf-page {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: white;
  }

  .create-pdf-block {
    height: calc(100vh - 148px);
    overflow: auto;
  }

  .select-file-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .create-file {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .delete-file-btn-block.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer {
    margin-top: 2px !important;
    margin-bottom: 0%;
  }

  .create-tab-title {
    font-family: 'Sarabun', sans-serif;
  }

  .create-detail-block {
    height: calc(100vh - 252px);
    overflow: auto;
  }

  .create-setting-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
  }

  .create-setting {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .create-setting-input.v-text-field input {
    line-height: 24px !important;
  }

  .create-attach-file-block {
    padding-left: 0% !important;
  }

  .workflow-block {
    height: calc(100vh - 433px);
    overflow: auto;
  }

  .create-setting-dropdown-icon .theme--light.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
  }

  .create-setting-switch .v-input--selection-controls__input {
    height: 40px !important;
  }

  .add-step-btn {
    font-family: 'Sarabun', sans-serif;
    color: white !important;
  }

  .all-step-block {
    height: calc(100vh - 452px);
    overflow: auto;
  }

  .delete-step-btn {
    width: 18px !important;
    height: 18px !important;
  }

  .page-sign-box .v-select__slot {
    height: 32px;
  }

  .page-sign-box.v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot {
    min-height: 32px !important;
  }

  .page-sign-box.v-text-field--outlined.v-input--dense .v-label {
    top: 6px !important;
    font-size: 13px;
  }

  .page-sign-dropdown-icon.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
    margin-top: 5px !important;
  }

  .each-step-mail-row {
    padding-left: 3% !important;
  }

  .each-email-step-block {
    padding-bottom: 0% !important;
  }

  .each-email-icon.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-outer {
    margin-top: 4px !important;
    margin-bottom: 0px;
  }

  .email-step-box.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
    padding-left: 2% !important;
    padding-right: 0% !important;
  }

  .onechat-check {
    font-family: 'Sarabun', sans-serif;
  }

  .add-delete-permission-block {
    padding-bottom: 0% !important;
  }

  .delete-permission-btn {
    height: 27px !important;
    width: 27px !important;
  }

  .send-doc-btn {
    font-family: 'Sarabun', sans-serif;
    color: white !important;
  }

  #pdfBg_create {
    position: relative;
    z-index: 0;
    overflow-y: hidden;
    overflow-x: hidden;
    width: 90%;
    text-align: center;
    background: #525659;
  }

  #pdfDiv {
    position: absolute;
  }
  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .create-doc-page {
      height: calc(100vh - 64px);
      overflow: auto;
    }

    .create-pdf-block {
      height: calc(100vh - 319px);
    }

    .create-detail-block {
      height: unset;
    }

    .create-attach-file-block {
      padding-left: 2% !important;
    }

    .workflow-block {
      height: unset;
    }

    .all-step-block {
      height: unset;
    }

    .each-step-mail-row {
      padding-left: 0% !important;
    }

    .each-email-step-block {
      padding-bottom: 3% !important;
    } 

    .add-delete-permission-block {
      padding-bottom: 5% !important;
    }

    .delete-permission-btn {
      height: 20px !important;
      width: 20px !important;
    }
  }
</style>
