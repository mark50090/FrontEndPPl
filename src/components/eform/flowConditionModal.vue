<template>
  <v-container>
    <v-dialog persistent scrollable max-width="800px" v-model="dialog_condition">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.validation_doc_modal_title }}</b>
        </v-card-title>
        <v-card-text class="pl-10 pt-7 pb-3">
          <h3 class="condition-doc-hearder">{{ textLang.validate_list_title }}</h3>
          <v-row v-for="item in flowCondition" :key="item.setIndex">
            <v-col cols="11">
              <v-card outlined class="pa-3 condition-doc-group-card">
                <span class="condition-doc-group-title">{{ textLang.condition_num }} {{item.setIndex}}</span>
                <v-row class="pl-3 pr-2">
                  <v-col cols='3' align-self="center" class="validate-title">
                    {{ textLang.condition_title }}:
                  </v-col>
                  <v-col cols='9' class="px-0">
                    <v-textarea outlined dense no-resize rows="3" hide-details :color="color_validate_box" class="pad-textarea condition-validate validate-box" v-model="item.docCond">
                      <template v-slot:append-outer>
                        <v-menu offset-x>
                          <template v-slot:activator="{ on }">
                            <v-btn x-small depressed dark fab color="primary" v-on="on">
                              <v-icon>mdi-help</v-icon>
                            </v-btn>
                          </template>
                          <v-card width="400">
                            <v-card-text class="help-varidate-block">
                              <p class="mb-0">{{ textLang.help_card.help_validate }}</p>
                              <v-row>
                                <v-col cols="6" class="pb-0">
                                  <ul>
                                    <li><b>+</b> : {{ textLang.help_card.plus_sign }}</li>
                                    <li><b>-</b> : {{ textLang.help_card.minus_sign }}</li>
                                    <li><b>*</b> : {{ textLang.help_card.multiple_sign }}</li>
                                    <li><b>/</b> : {{ textLang.help_card.divide_sign }}</li>
                                    <li><b>==</b> : {{ textLang.help_card.equal_sign }}</li>
                                    <li><b>!=</b> : {{ textLang.help_card.not_equal_sign }}</li>
                                    <li><b><</b> : {{ textLang.help_card.less_sign }}</li>
                                    <li><b><=</b> : {{ textLang.help_card.less_eq_sign }}</li>
                                    <li><b>></b> : {{ textLang.help_card.more_sign }}</li>
                                    <li><b>>=</b> : {{ textLang.help_card.more_eq_sign }}</li>
                                  </ul>
                                </v-col>
                                <v-col cols="6" class="px-0 pb-0">
                                  <ul>
                                    <li><b>.length</b> : {{ textLang.help_card.length_meaning }}</li>
                                    <li><b>&&</b> : {{ textLang.help_card.and_sign }}</li>
                                    <li><b>||</b> : {{ textLang.help_card.or_sign }}</li>
                                  </ul>
                                </v-col>
                              </v-row>
                              <u>{{ textLang.help_card.condition_example }}</u>
                              <br>
                              <span>($inputbox1+$inputbox2<=$calculatebox3)||($inputbox4.length==13)</span>
                            </v-card-text>
                          </v-card>
                        </v-menu>
                      </template>
                    </v-textarea>
                  </v-col>
                </v-row>
                <v-row class="pl-3 pr-3">
                  <v-col cols='3' align-self="center" class="validate-title">
                    {{ textLang.flow_title }}:
                  </v-col>
                  <v-col cols='9' class="px-0">
                    <v-row class="row-prop">
                      <v-col cols="4" class="title-prop-block">
                        <span class="title-prop">{{ textLang.doc_paperless }}:</span>
                      </v-col>
                      <v-col cols="7" class="px-0 pt-5">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.choose" :color="color_seting_paperless" class="prop-input autocomplete-pad icon-select dropdown-icon-color" :items="documentTypes" v-model="item.pplSetting.docType" @change="changeDocType(item)"></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row class="row-prop">
                      <v-col cols="4" class="title-prop-block">
                        <span class="title-prop">{{ textLang.format_paperless }}:</span>
                      </v-col>
                      <v-col cols="7" class="px-0 pt-5">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.choose" :color="color_seting_paperless" class="prop-input autocomplete-pad icon-select dropdown-icon-color" :items="item.ppl_templatelist" v-model="item.pplSetting.template"></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="1" align-self="end">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-show="item.setIndex == flowCondition.length" depressed fab dark x-small v-on="on" :color="color_add_condition_btn" class="mb-2" @click="addCondition()">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>{{ textLang.add_condition_btn }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-if="item.setIndex != 1" depressed fab dark x-small v-on="on" color="error" @click="deleteCondition(item,item.setIndx)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </template>
                <span>{{ textLang.delete_condition_btn }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider class="mx-7"></v-divider>
        <v-card-actions class="pt-8 pb-8">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-12 mr-3 save-setting-btn" @click="close()">{{ textLang.cancel_modal_btn }}</v-btn>
          <v-btn depressed large :color="color_save_setting" class="px-5 ml-3 save-setting-btn save-modal-font-btn" @click="save()">{{ textLang.save_setting_btn }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { EventBus } from '../../EventBus'
  export default {
    data: () => ({
      dialog_condition: false,
      flowCondition:[],
      documentTypes: [],
      ppl_templatelist: [],
      
      //Color Variable
      color_validate_box: '#2ACA9F',
      color_add_condition_btn: '#2ACA9F',
      color_save_setting: '#2ACA9F',
      color_seting_paperless: '#1b9900',
      colorObject: {
        toolbar: {
            toolbar_bg_color1: '#C2EB81',
            toolbar_bg_color2: '#A1E9C0',
            toolbar_font_color: '#0E3852',
            menu_select_hover_color: '#E6F3CB'
        },
        modal: {
            modal_main_color: '#2ACA9F',
            modal_sub_color: '#97E2E7',
        },
        main_color: '#1b9900'
      },
      //Language Variable
      textLang: {
        validation_doc_modal_title: "ตั้งค่าประเภทและรูปแบบเอกสาร Paperless อัตโนมัติ",
        validate_list_title: "รายการเงื่อนไขที่จะตรวจสอบ",
        condition_num: "เงื่อนไขที่",
        condition_title: "เงื่อนไข",
        flow_title: "ประเภทและรูปแบบเอกสาร Paperless",
        doc_paperless: "ประเภทเอกสาร paperless",
        format_paperless: "รูปแบบเอกสาร paperless",
        choose: "ไม่เลือก",
        add_condition_btn: "เพิ่มเงื่อนไข",
        delete_condition_btn: "ลบเงื่อนไข",
        cancel_modal_btn: "ยกเลิก",
        save_setting_btn: "บันทึกการตั้งค่า",
        help_card: {
          help_validate: "เป็นเงื่อนไขสำหรับตรวจสอบความถูกต้องในการกรอกเอกสาร โดยสามารถเลือกตรวจสอบ object ตามเงื่อนไขที่กำหนดเองได้ ซึ่งในการใส่ชื่อ object จะใช้เครื่องหมาย $ นำหน้าชื่อ ส่วนเครื่องหมายที่ใช้ในการเปรียบเทียบต่างๆจะมีดังนี้",
          plus_sign: "บวก",
          minus_sign: "ลบ",
          multiple_sign: "คูณ",
          divide_sign: "หาร",
          equal_sign: "เท่ากับ",
          not_equal_sign: "ไม่เท่ากับ",
          less_sign: "น้อยกว่า",
          less_eq_sign: "น้อยกว่าหรือเท่ากับ",
          more_sign: "มากกว่า",
          more_eq_sign: "มากกว่าหรือเท่ากับ",
          length_meaning: "ค่าจำนวนตัวอักษรในข้อความ โดยใส่ต่อหลังจากชื่อ object ที่ต้องการค่า",
          and_sign: "และ (ใช้เชื่อมเงื่อนไขย่อยหลายๆเงื่อนไข โดยใส่วงเล็บครอบแต่ละเงื่อนไขก่อนที่จะใส่เครื่องหมายเชื่อม)",
          or_sign: "หรือ (ใช้เชื่อมเงื่อนไขย่อยหลายๆเงื่อนไข โดยใส่วงเล็บครอบแต่ละเงื่อนไขก่อนที่จะใส่เครื่องหมายเชื่อม)",
          condition_example: "ตัวอย่างเงื่อนไข"
        }
      }
    }),
    mounted() {
      EventBus.$on('openFlowCondition',this.getFlowCondition)
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
        this.color_validate_box = this.colorObject.modal.modal_main_color
        this.color_add_condition_btn = this.colorObject.modal.modal_main_color
        this.color_save_setting = this.colorObject.modal.modal_main_color
        this.color_seting_paperless = this.colorObject.main_color
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.flowConditionModal
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.flowConditionModal
        }
      },
      getFlowCondition(flowCond) {
        this.flowCondition = []
        this.flowCondition = flowCond
        this.pplLoadTemplate()
        if(!this.flowCondition.length) {
          this.flowCondition.push({
            setIndex: 1,
            docCond: "",
            pplSetting: {
              docType: "",
              template: ""
            }
          })
        } else {
          this.flowCondition.forEach(e => {
            this.changeDocType(e)
          })
        }
        this.dialog_condition = true
      },
      addCondition() {
        this.flowCondition.push({
          setIndex: this.flowCondition.length + 1,
          docCond: "",
          pplSetting: {
            docType: "",
            template: ""
          }
        })
      },
      deleteCondition(obj, indx) {
        var objIndx = this.flowCondition.indexOf(obj)
        if(objIndx) {
          this.flowCondition.splice(objIndx, 1)
        }
        for(let i=0; i<this.flowCondition.length; i++) {
          this.flowCondition[i].setIndex = i+1
        }
      },
      pplLoadTemplate() {
        this.documentTypes = [{text: this.textLang.choose , value: ""}]
        this.ppl_templatelist = [{text: this.textLang.choose , value: ""}]
        var storedDocumentType = this.$store.state.pplDocumentTypes
        storedDocumentType.forEach(e => {
          this.documentTypes.push({text: e.Document_Name.document_name, value: e.Document_Type})
        })
        this.allPplTemaplates = this.$store.state.pplDocumentTemplates
      },
      changeDocType(item) {
        var indx = this.flowCondition.indexOf(item)
        this.flowCondition[indx].ppl_templatelist = []
        var pplTemplate = this.allPplTemaplates.filter(x => x.Document_Type == item.pplSetting.docType)
        this.flowCondition[indx].ppl_templatelist = pplTemplate.map( function(x)  { return { text:x.Document_Name, value:x} })
      },
      save() {
        var flowCont = this.flowCondition
        flowCont.forEach(e => {
          delete e["ppl_templatelist"]
        })
        EventBus.$emit('saveFlowCondition', flowCont)
        this.dialog_condition = false
      },
      close() {
        this.flowCondition = []
        this.dialog_condition = false
      }
    }
  }
</script>

<style>
  .condition-doc-hearder {
    font-family: 'Sarabun', sans-serif;
    color: black;
  }

  .condition-doc-group-card {
    border: 2px solid #2ACA9F !important;
  }

  .condition-doc-group-title {
    font-family: 'Sarabun', sans-serif;
    color: #2ACA9F;
    font-size: 16px;
    text-decoration: underline;
  }

  .validate-title {
    font-family: 'Sarabun', sans-serif;
    color: black;
    font-size: 16px;
  }

  .condition-validate {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }

  .v-text-field--outlined.validate-box > .v-input__control > .v-input__slot {
    height: 75px !important;
  }

  .help-varidate-block {
    font-family: 'Sarabun', sans-serif;
  }

  .v-text-field.validate-alert input {
    line-height: 27px;
  }
</style>