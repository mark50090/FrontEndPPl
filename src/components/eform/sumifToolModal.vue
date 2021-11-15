<template>
    <v-dialog max-width="90%" persistent scrollable v-model="dialog_link_datatable">
      <v-card>
        <v-overlay :value="notReady" absolute opacity="0.3">
          <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </v-overlay>
        <v-card-title class="dialog_title" elevation="4">
          <span>
            <b>{{ textLang.setting }} "{{datatable_name}}"</b>
          </span>
          <!-- <v-spacer></v-spacer>
          <v-btn icon dark @click="save()">
            <v-icon>mdi-close</v-icon>
          </v-btn>-->
        </v-card-title>
        <v-card-text class="px-11 pb-10 pt-3">
          sumif(<v-text-field v-model="objectName"></v-text-field>:<v-text-field v-model="objectCheck"></v-text-field><v-text-field v-model="objectCond"></v-text-field><v-text-field v-model="condOper"></v-text-field>)
          <v-row class="mt-3 import-excel-datatable-btn-row">
            <v-btn depressed dark :color="color_import_excel" class="import-excel-datatable-btn" @click="openImportExcel()">{{ textLang.import_data }}</v-btn>
            <input v-show='false' type='file' :id='"upload-file1"' @input="importExcel()" accept=".xlsx, .xls"/>
          </v-row>
          {{ fullCond}}
        </v-card-text>
        <v-divider class="line-end-setting-datatable"></v-divider>
        <v-row class="px-3 help-row">
          <v-col class="btn-help-block" cols="1">
            <v-btn @click="help = !help" color="primary" dark depressed fab x-small>
              <v-icon>mdi-help</v-icon>
            </v-btn>
          </v-col>
          <v-col class="help-content-block" cols="11" v-if="help == true">
            <p class="help-content">{{ textLang.select }}</p>
          </v-col>
        </v-row>
        <v-card-actions class="pt-0 pb-12">
          <v-spacer></v-spacer>
          <v-btn color="#979797" @click="close()" class="px-12 mr-4 save-setting-btn" large outlined>{{ textLang.cancel }}</v-btn>
          <v-btn :color="color_save" @click="save()" class="px-6 ml-4 save-setting-btn" dark depressed large>{{ textLang.save }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
  import { EventBus } from '../../EventBus'
  export default {
    watch:{
      tableData (v){
        if(this.scrollPosition.length == 0)
          this.scrollPosition = Array(this.datatable_row).fill(0)
      }
    },
    data: () => ({
      dialog_link_datatable: false,
      isActive: false,
      datatable_obj: {},
      datatable_name: '',
      datatable_row: 0,
      datatable_col: 0,
      row_panel: [],
      help: false,
      dataObjectArray: {},
      scrollPosition : [],
      tableData: [],
      visible_data: [],
      limit: 10,
      busy: false,
      notReady:false,
      tempData: [],
      textLang: {
        setting: "ตั้งค่าการเชื่อมโยงข้อมูลของตาราง",
        row: "แถวที่",
        import_data: "นำเข้าข้อมูลตัวเลือกจาก Excel",
        group_option: "ตัวเลือกที่",
        select: "เลือกแถวที่ต้องการเชื่อมโยงข้อมูล(สามารถเชื่อมโยงได้ภายในแถวเดียวกันเท่านั้น) จากนั้นกดปุ่ม + เพื่อเพิ่มจำนวนตัวเลือกของข้อมูลที่ต้องการเชื่อมโยง หรือกดปุ่ม - เพื่อลบตัวเลือกที่ไม่ต้องการ โดยช่องกรอกแต่ละช่องจะแทนเซลล์ที่อยู่ในแถวนั้นๆ เมื่อกำหนดค่าให้แต่ละช่อง หากนำไปใช้แล้วมีการกรอกค่าตรงกับค่าที่ได้กำหนดไว้ช่องใดช่องหนึ่ง ค่าจากช่องอื่นที่ได้กำหนดไว้ก็จะถูกนำมาแสดงด้วย ตัวอย่างเช่นกำหนดให้ช่องเซลล์ datatable1_R1C1 = \"Hello\", datatable1_R1C2 = \"99\", datatable1_R1C3 = \"World\" เมื่อมีการกรอกข้อมูลในช่องเซลล์ datatable1_R1C2 ว่า 99 ข้อมูลในช่องเซลล์ datatable1_R1C1 และ datatable1_R1C3 จะเป็น \"Hello\" และ \"World\" ตามลำดับ หรือถ้าหากช่องเซลล์ datatable1_R1C1 มีการกรอกคำว่า \"Hello\" ช่องเซลล์ datatable1_R1C2 และ datatable1_R1C3 จะเป็น \"99\" และ \"World\" ตามลำดับ นอกจากนั้นหากต้องการ import ข้อมูลตัวเลือกจากไฟล์ Excel ในไฟล์ Excel นั้นต้องใส่ข้อมูลตัวเลือกเริ่มตั้งแต่ช่อง A1 เรียงไปเป็นแนวนอนเรื่อยๆตามจำนวนข้อมูลที่ต้องกรอกในตัวเลือกนั้นๆ โดยข้อมูลที่กรอกใน 1 แถวคือข้อมูลของ 1 ตัวเลือก หากต้องการเพิ่มข้อมูลตัวเลือกให้ไปใส่ข้อมูลเพิ่มที่แถวใหม่",
        cancel: "ยกเลิก",
        save: "บันทึกการตั้งค่า"
      },
      excelFile: "",
      fullCond: "",
      objectName: "",
      objectCheck: "",
      objectCond: "==",
      condOper: "||",

      //Color Variable
      // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
      color_icon_expand: '#2ACA9F',
      color_icon_mdiplus: '#2ACA9F',
      color_Excel: '#2ACA9F',
      color_import_excel: '#97E2E7',
      color_save: '#2ACA9F',
      colorObject: {
      toolbar: {
  				toolbar_bg_color1: '#C2EB81',
  				toolbar_bg_color2: '#A1E9C0',
  				toolbar_font_color: '#0E3852',
  				menu_select_hover_color: '#E6F3CB'
 			},
 			modal: {
  				modal_main_color: '#2ACA9F',
  				modal_sub_color: '#97E2E7'
 			},
 			main_color: '#1b9900'
    }
    }),
    mounted() {
      this.tableData = []
      EventBus.$on('openSumifTool',this.getDataTable)
      EventBus.$on('changeLang', this.changeLange)
      this.changeLange()
      // this.changeColor()
    },
    beforeDestroy() {
      EventBus.$off('changeLang')
    },
    methods: {
      changeColor() {
        this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
        // this.color_dialog_header_bg = this.colorObject.modal.modal_main_color
        // $('.dialog_title').css('background-color', this.color_dialog_header_bg)
        this.color_icon_expand = this.colorObject.modal.modal_main_color
        this.color_icon_mdiplus = this.colorObject.modal.modal_main_color
        this.color_Excel = this.colorObject.modal.modal_main_color
        this.color_import_excel = this.colorObject.modal.modal_sub_color
        this.color_save = this.colorObject.modal.modal_main_color
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.SettingLinkDataTableModal
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.SettingLinkDataTableModal
        }
      },
      getDataTable() {
        this.dialog_link_datatable = true
      },
      addScrollListenner() {
        this.$refs.scrolls.forEach((vueComponent) => {
           $(vueComponent.$el).scroll(this.InfinitScrollHandler)
            $(vueComponent.$el).scrollTop(0)
        })
      },
      InfinitScrollHandler(e) {
        var firstChildOfScrollableContentWrapper = $(e.target).children().first()
        var tableno =  $(e.target).attr("tableno")-0
        var rowIndex = -Math.floor(firstChildOfScrollableContentWrapper.position().top/110.640625)
        if (this.scrollPosition[tableno-1] != rowIndex) {
          this.$set(this.scrollPosition, tableno-1 ,rowIndex);
          
        }
      },
      addDataChoice(row) {
        var tempChoice = []
        for(let i=0; i<this.datatable_col; i++) {
          tempChoice.push({value:"", excelKey:"", isExcel:false})
        }
        this.tableData[row].push({index:this.tableData[row].length+1, value:tempChoice})
      },
      removeDataChoice(row,col) {
        this.tableData[row].splice(col,1)
        for(let i=0; i<this.tableData[row].length; i++) {
          this.tableData[row][i].index = i+1
        }
      },
      openImportExcel() {
        var x = document.getElementById("upload-file1")
        document.getElementById('upload-file1').click()
      },
      async importExcel() {
        this.excelFile = ""
        var x = document.getElementById("upload-file1")
        if (x.files.length != 0) {
          this.excelFile = x.files[0]
        }
        if(this.excelFile) {
          let formData = new FormData()
          formData.append('excel_file', this.excelFile)
          this.notReady = true
          try {
            var { data } = await this.axios.post(this.$eform_api + '/import_excel_datatable',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
              }
            })
            this.notReady = false
            if(data.messageER != 'ER') {
              this.excelFile = ""
              this.mappingExcelValue(data.messageText)
            }
          } catch (error) {
            this.notReady = false
            console.log(error.message)
          }
        }
      },
      mappingExcelValue(excelData) {
        var dataSet = []
        if(excelData.length) {
          excelData.forEach(e => {
            dataSet.push(e[0])
          })
        }
        this.createSumif(dataSet)
      },
      createSumif(dataSet) {
        var dataList = dataSet
        var mainSum = this.objectName
        var condCheck = this.objectCheck
        var fullCond = 'sumif('
        var checkOper = this.objectCond
        var concatOper = this.condOper
        fullCond += mainSum + ':'
        for(let i=0; i< dataList.length; i++) {
          fullCond += condCheck + checkOper + "'" + dataList[i] + "'"
          if(i != dataList.length-1) {
            fullCond += concatOper
          }
        }
      fullCond += ')'
      this.fullCond = fullCond
      },
      save() {
        sessionStorage.setItem('saveDataChoice',JSON.stringify(this.tableData))
        EventBus.$emit('saveDataTable')
        this.dialog_link_datatable = false
      },
      close() {
        sessionStorage.setItem('saveDataChoice',JSON.stringify(this.tempData))
        EventBus.$emit('saveDataTable')
        this.dialog_link_datatable = false
      },
  }
}
</script>
