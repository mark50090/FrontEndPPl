<template>
    <v-dialog max-width="90%" persistent scrollable v-model="dialog_link_datatable">
      <v-card>
        <v-overlay :value="notReady" absolute opacity="0.3">
          <img width="100px" src="../../assets/loader.gif" class="load-datatable-link">
        </v-overlay>
        <v-card-title class="py-2 datatable-link-modal-header">
          {{ textLang.setting }} "{{datatable_name}}"
        </v-card-title>
        <v-card-text class="">
          <v-expansion-panels accordion class="flat-expan" multiple v-model="row_panel">
            <v-expansion-panel :key="row" v-for="row in datatable_row">
              <v-expansion-panel-header class="pl-0 pb-0 row-title2">
                {{ textLang.row }} {{row}}
                <template v-slot:actions>
                  <v-icon color="#4CAF50">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <hr class="line-expan-datatable-setting" />
              <v-expansion-panel-content :tableno="row" @scroll.self="onNearBottom" class="data-each-row infinitList" ref="scrolls" style="position:relative">
                <v-row class="mt-3 import-excel-datatable-btn-row">
                  <v-btn depressed dark color="#525659" class="import-excel-datatable-btn" @click="openImportExcel(row-1)">{{ textLang.import_data }}</v-btn>
                  <input v-show='false' type='file' :id='"upload-file" + String(row-1)' @input="importExcel(row-1)" accept=".xlsx, .xls"/>
                </v-row>
                <!-- button to add selecter when it doesn't has any selecter -->
                <v-lazy :options="{ threshold: 0.5 }" min-height="300" transition="fade-transition" v-model="isActive">
                  <v-row class="mt-4 add-selecter-start-row" justify="start" v-if="!tableData[row - 1].length">
                    <v-btn color="#4CAF50" @click="addDataChoice(row - 1)" dark depressed fab x-small>
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-row>
                  <ul class="all-selecter" v-if="tableData[row - 1].length">
                    <li :key="item.index" style="height:110.640625px" v-for="(item, index) in tableData[row-1]">
                      <div class="each-selecter" v-if="scrollPosition[row - 1] - 2 <= index && index <= scrollPosition[row - 1] + 2">
                        <div class="delete-selecter-btn">
                          <v-btn color="#4CAF50" @click="removeDataChoice( row - 1, parseInt(item.index) - 1 )" outlined fab x-small>
                            <v-icon>mdi-minus</v-icon>
                          </v-btn>
                        </div>
                        <div class="add-selecter-btn" v-if="item.index == tableData[row - 1].length">
                          <v-btn color="#4CAF50" @click="addDataChoice(row - 1)" dark depressed fab x-small>
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </div>
                        <div class="mt-1 selecter-title">
                          {{ textLang.group_option }}{{ item.index }} :
                        </div>
                        <div :key="col" class="input-data-value-block" v-for="col in datatable_col">
                          <!-- <v-checkbox :color="color_Excel" class="property-round-check" hide-details label="Excel" v-model.lazy="item.value[col - 1].isExcel"></v-checkbox> -->
                          <v-text-field color="#4CAF50" :label="datatable_obj.object_name + '_R' + row + 'C' + col" class="data-link-box" dense hide-details outlined v-model.lazy="item.value[col - 1].value" v-show="!item.value[col - 1].isExcel"></v-text-field>
                          <v-text-field color="#4CAF50" :label="datatable_obj.object_name + '_R' + row + 'C' + col" class="data-link-box" dense hide-details outlined v-model.lazy="item.value[col - 1].excelKey" v-show="item.value[col - 1].isExcel"></v-text-field>
                        </div>
                      </div>
                    </li>
                  </ul>
                </v-lazy>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-divider class="ml-6 mr-6"></v-divider>
        <v-row class="pl-6 pr-6 help-row">
          <v-col class="pl-0" cols="auto">
            <v-btn @click="help = !help" color="primary" dark depressed fab x-small>
              <v-icon>mdi-help</v-icon>
            </v-btn>
          </v-col>
          <v-col class="px-0" cols="" v-if="help == true">
            <p class="help-content">{{ textLang.select }}</p>
          </v-col>
        </v-row>
        <v-card-actions class="pt-0 pb-6">
          <v-spacer></v-spacer>
          <v-btn color="#4CAF50" @click="close()" class="px-12 mr-4 datatable-setting-modal-btn" outlined>{{ textLang.cancel }}</v-btn>
          <v-btn color="#4CAF50" @click="save()" class="px-6 ml-4 datatable-setting-modal-btn" dark depressed>{{ textLang.save }}</v-btn>
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

      //Color Variable
      // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
      color_loading_bar_bg: '#C2EB81',
      color_loading_bar: '#1b9900',
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
      EventBus.$on('openLinkData',this.getDataTable)
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
        this.color_loading_bar_bg = this.colorObject.toolbar.toolbar_bg_color1
        this.color_loading_bar = this.colorObject.main_color
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
      getDataTable(data_table) {
        this.tableData = []
        this.datatable_obj = {}
        this.datatable_obj = data_table
        if(typeof this.datatable_obj.value !== 'undefined' && this.datatable_obj.value) {
          this.tableData = this.datatable_obj.value
          this.tempData = this.datatable_obj.value
        }
        this.datatable_name = this.datatable_obj.object_name
        this.datatable_row = parseInt(data_table.style.table.crow)
        this.datatable_col = parseInt(data_table.style.table.ccol)
        if(!this.tableData.length) {
         for(let i=0; i<this.datatable_row; i++) {
          this.tableData.push([])
         }
         this.tempData = this.tableData
        } else if(this.tableData.length != this.datatable_row) {
          if(this.tableData.length < this.datatable_row) {
            for(let i=0; i<this.datatable_row-this.tableData.length; i++) {
              this.tableData.push([])
            } 
          } else if(this.tableData.length > this.datatable_row) {
            for(let i=0; i<this.tableData.length-this.datatable_row; i++) {
              this.tableData.pop()
            }
          }
        }
        if(this.tableData.length) {
          this.tableData.forEach( e=> {
            e.forEach(e2 => {
               if(e2.value.length > this.datatable_col) {
                e2.value.pop()
              } else if(e2.value.length < this.datatable_col) {
                e2.value.push({value:"", excelKey:"", isExcel:false})
              }
            })
          })
        }
        // this.visible_data = this.tableData
        // sessionStorage.setItem('saveDataChoice',JSON.stringify(this.tableData))
        this.dialog_link_datatable = true
        this.$nextTick(function () {
          this.addScrollListenner()
        })
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
      openImportExcel(indx) {
        var x = document.getElementById("upload-file" + String(indx))
        document.getElementById('upload-file' + String(indx)).click()
      },
      async importExcel(indx) {
        this.excelFile = ""
        var x = document.getElementById("upload-file" + String(indx))
        if (x.files.length != 0) {
          this.excelFile = x.files[0]
        }
        if(this.excelFile) {
          let formData = new FormData()
          formData.append('excel_file', this.excelFile)
          this.notReady = true
          try {
            var { data } = await this.axios.post(this.$api + '/import_excel_datatable',
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
              this.mappingExcelValue(data.messageText,indx)
            }
          } catch (error) {
            this.notReady = false
            console.log(error.message)
          }
        }
      },
      mappingExcelValue(excelData,indx) {
        var dataSet = []
        if(excelData.length) {
          var rowIndex = 1
          excelData.forEach(e => {
            var dataRow = []
            for(let i=0; i<this.datatable_obj.style.table.ccol; i++) {
              dataRow.push({
                excelKey: "",
                isExcel: false,
                value: e[i]
              })
            }
            dataSet.push({
              index:rowIndex,
              value:dataRow
            })
            rowIndex++
          })
          this.tableData[indx] = dataSet
          this.visible_data = dataSet
        }
      },
      save() {
        var returnData = this.tableData
        EventBus.$emit('saveDataTable', returnData)
        this.dialog_link_datatable = false
      },
      close() {
        var returnData = this.tempData
        EventBus.$emit('saveDataTable', returnData)
        this.dialog_link_datatable = false
      },
  }
}
</script>

<style>
.load-datatable-link {
  opacity: 0.6;
}

.datatable-link-modal-header {
  font-family: "Sarabun", sans-serif;
  font-size: 16px !important;
  color: white;
  background-color: #67c25d;
}

.row-title {
  font-family: "Sarabun", sans-serif;
  font-size: 18px;
}

.row-title2 {
  font-family: "Sarabun", sans-serif;
  font-size: 16px !important;
  color: #4CAF50;
}

.line-expan-datatable-setting {
  border: solid 1px #4CAF50;
}

.data-each-row {
  overflow-x: auto;
}

.selecter-title {
  font-family: "Sarabun", sans-serif;
  color: black;
}

.input-data-value-block {
  margin-left: 3%;
  display: block;
}

.add-selecter-start-row {
  width: 100%;
  margin: 0%;
}

.all-selecter {
  padding-top: 3%;
  padding-left: 0% !important;
  max-height: 200px;
  list-style-type: none;
}

.each-selecter {
  /* display: inline-flex; */
  display: -webkit-inline-box;
  width: 100%;
  padding-bottom: 2%;
}

.input-data-link {
  padding-left: 3% !important;
}

.delete-selecter-btn {
  /* margin-left: 2%; */
  margin-right: 1%;
  /* padding-top: 3%; */
}

.add-selecter-btn {
  /* margin-left: 1%; */
  padding-right: 1%;
  /* padding-top: 3%; */
}

.import-excel-datatable-btn-row {
  width: 100%;
  margin: 0%;
}

.import-excel-datatable-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
}

.data-link-box {
  font-family: "Sarabun", sans-serif;
  font-size: 13px;
}

.data-link-box.v-text-field input {
  line-height: 21px !important;
}

.help-row {
  width: 100%;
  margin: 0%;
}

.help-content {
  font-family: "Sarabun", sans-serif;
  font-size: 12px;
  color: grey;
}

.setting-dialog-button-part {
  padding-bottom: 3%;
}

.save-setting-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
}

.datatable-setting-modal-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
}

.save-setting-icon {
  margin-right: 7%;
}
</style>