<template>
    <v-dialog persistent scrollable max-width="800px" v-model="dialog_condition">
      <v-card>
        <v-card-title class="py-2 condition-doc-modal-header">
          {{ textLang.validation_doc_modal_title }}
        </v-card-title>
        <v-card-text class="pt-4">
          <h3 class="cond-doc-hearder">{{ textLang.validate_list_title }}</h3>
          <v-row v-for="item in docCondition" :key="item.setIndex" class="mt-0 condition-doc-modal-row">
            <v-col cols="11" class="px-0">
              <v-card outlined class="pa-3 cond-doc-group-card">
                <u class="cond-doc-group-title">{{ textLang.condition_num }} {{item.setIndex}}</u>
                <v-row class="condition-doc-modal-row">
                  <v-col cols='3' align-self="start" class="pl-0 cond-doc-title">
                    {{ textLang.condition_title }}:
                  </v-col>
                  <v-col cols='9' class="px-0">
                    <v-textarea outlined dense no-resize rows="3" hide-details color="#4CAF50" class="pad-textarea cond-validate validate-cond-box" v-model="item.docCond">
                      <template v-slot:append-outer>
                        <v-menu offset-x>
                          <template v-slot:activator="{ on }">
                            <v-btn x-small depressed dark fab color="primary" v-on="on">
                              <v-icon>mdi-help</v-icon>
                            </v-btn>
                          </template>
                          <v-card width="400">
                            <v-card-text class="pr-1 help-varidate-content">
                              <p class="mb-0">{{ textLang.help_card.help_validate }}</p>
                              <v-row class="condition-doc-modal-row">
                                <v-col cols="6" class="pl-0 pb-0">
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
                <v-row class="mt-0 condition-doc-modal-row">
                  <v-col cols='3' align-self="center" class="pl-0 cond-doc-title">
                    {{ textLang.step_check_cond_type }}:
                  </v-col>
                  <v-col cols="auto" align-self="center" class="px-0 ">
                    <v-radio-group row mandatory hide-details dense class="mt-0 pt-0" v-model="item.isSomeCheck">
                      <v-radio color="#4CAF50" :value="false">
                        <template v-slot:label>
                          <span class="cond-doc-title">{{ textLang.check_all_step_choice }}</span>
                        </template>
                      </v-radio>
                      <v-radio color="#4CAF50" :value="true">
                        <template v-slot:label>
                          <span class="cond-doc-title">{{ textLang.check_custom_step_choice }}</span>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col v-if="item.isSomeCheck" cols="auto" align-self="center" class="cond-doc-title">
                    {{ textLang.step_check_cond_title }}:
                  </v-col>
                  <v-col v-if="item.isSomeCheck" align-self="center" class="px-0">
                    <v-select outlined dense hide-details multiple append-icon="mdi-chevron-down" :placeholder="textLang.step_check_cond_placeholder" color="#4CAF50" item-color="#4CAF50" :items="cond_step" class="cond-validate validate-doc-dropdown-icon" v-model="item.checkStep"></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-0 condition-doc-modal-row">
                  <v-col cols='3' align-self="center" class="pl-0 cond-doc-title">
                    {{ textLang.alert_title }}:
                  </v-col>
                  <v-col cols='9' class="px-0">
                    <v-text-field outlined dense hide-details color="#4CAF50" class="validate-doc-alert-box cond-validate" v-model="item.alertText"></v-text-field>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="1" align-self="end" class="pr-0">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-show="item.setIndex == docCondition.length" depressed fab dark x-small v-on="on" color="#4CAF50" class="mb-2" @click="addCondition()">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>{{ textLang.add_condition_btn }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-if="item.setIndex != 1" outlined fab x-small v-on="on" color="#4CAF50" @click="deleteCondition(item,item.setIndx)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </template>
                <span>{{ textLang.delete_condition_btn }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider class="mx-6"></v-divider>
        <v-card-actions class="py-5">
          <v-spacer></v-spacer>
          <v-btn outlined color="#67c25d" class="mr-4 validate-doc-modal-btn" @click="close()">{{ textLang.cancel_modal_btn }}</v-btn>
          <v-btn depressed dark color="#67c25d" class="ml-4 validate-doc-modal-btn" @click="save()">{{ textLang.save_setting_btn }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import { EventBus } from '../../EventBus'
  export default {
    // computed: {
    //   textLang() {
    //     return this.$store.getters.textLang.components.docConditionModal
    //   }
    // },
    data: () => ({
      dialog_condition: false,
      docCondition:[],
      cond_step: [],
      textLang: {
        validation_doc_modal_title: "ตั้งค่าการตรวจสอบความถูกต้องของเอกสาร",
        validate_list_title: "รายการเงื่อนไขที่จะตรวจสอบ",
        condition_num: "เงื่อนไขที่",
        condition_title: "เงื่อนไข",
        step_check_cond_type: "ลำดับที่ตรวจสอบ",
        check_all_step_choice: "ทั้งหมด",
        check_custom_step_choice: "กำหนดเอง",
        step_check_cond_title: "ลำดับที่",
        step_check_cond_placeholder: "เลือก",
        alert_title: "ข้อความแจ้งเตือน",
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
      },
      //Color Variable
      color_validate_box: '#2ACA9F',
      color_add_condition_btn: '#2ACA9F',
      color_save_setting: '#2ACA9F',
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
    }),
    mounted() {
      EventBus.$on('openDocCondition',this.getCondition)
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
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.docConditionModal
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.docConditionModal
        }
      },
      getCondition(docCond, checkStep) {
        this.docCondition = []
        this.docCondition = docCond
        this.cond_step = checkStep
        if(!this.docCondition.length) {
          this.docCondition.push({
            setIndex: 1,
            docCond: "",
            alertText: "",
            isSomeCheck: false,
            checkStep: []
          })
        }
        this.dialog_condition = true
      },
      addCondition() {
        this.docCondition.push({
          setIndex: this.docCondition.length + 1,
          docCond: "",
          alertText: "",
          isSomeCheck: false,
          checkStep: []
        })
      },
      deleteCondition(obj, indx) {
        var objIndx = this.docCondition.indexOf(obj)
        if(objIndx) {
          this.docCondition.splice(objIndx, 1)
        }
        for(let i=0; i<this.docCondition.length; i++) {
          this.docCondition[i].setIndex = i+1
        }
      }, 
      save() {
        var docCont = this.docCondition
        EventBus.$emit('saveDocCondition', docCont)
        this.dialog_condition = false
      },
      close() {
        this.docCondition = []
        this.dialog_condition = false
      }
    }
  }
</script>

<style>
  .condition-doc-modal-header {
    font-family: "Sarabun", sans-serif;
    font-size: 16px !important;
    color: white;
    background-color: #67c25d;
  }

  .cond-doc-hearder {
    font-family: 'Sarabun', sans-serif;
    color: black;
  }

  .condition-doc-modal-row {
    width: 100%;
    margin: 0%;
  }

  .cond-doc-group-card {
    border: 2px solid #67c25d !important;
  }

  .cond-doc-group-title {
    font-family: 'Sarabun', sans-serif;
    color: #67c25d;
    font-size: 16px;
    /* text-decoration: underline; */
  }

  .cond-doc-title {
    font-family: 'Sarabun', sans-serif;
    color: black;
    font-size: 16px;
  }

  .cond-validate {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .v-text-field--outlined.validate-cond-box > .v-input__control > .v-input__slot {
    height: 75px !important;
  }

  .help-varidate-content {
    font-family: 'Sarabun', sans-serif;
  }

  .validate-doc-dropdown-icon .theme--light.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
  }

  .v-text-field.validate-doc-alert-box input {
    line-height: 21px;
  }

  .validate-doc-modal-btn {
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
    width: 142px;
  }
</style>