<template>
    <v-dialog persistent scrollable max-width="900px" v-model="dialog_hide_setting">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.setting_object }}: {{objectName}}</b>
        </v-card-title>
        <v-card-text class="px-10 pt-7 pb-8">
          <h3 class="hide-object-hearder">{{objectName}} {{ textLang.hidden_conditions }}</h3>
          <br>
          <v-card outlined class="pa-3 condition-group-card">
            <span class="condition-group-title">{{ textLang.condition_group_title }} {{firstHideSet.setIndx}}</span>
            <v-row>
              <v-col cols='2' align-self="center" class="condition-hide-title">
                {{ textLang.condition_1 }}:
              </v-col>
              <v-col cols='3' class="pl-0">
                <v-text-field outlined dense hide-details :color="color_name" :label="textLang.name_object" class="pad-input condition-hide condition-hide-line hide-object-name-label" v-model="firstHideSet.hideFx.objectName"></v-text-field>
              </v-col>
              <v-col cols='3' class="px-0">
                <v-select dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.condition" :color="color_logicFx" class="condition-hide hide-object-name-label business-box-inside icon-select icon-dropdown-modal" :items="logicFx" v-model="firstHideSet.hideFx.logic"></v-select>
              </v-col>
              <v-col cols='3'>
                <v-text-field outlined dense hide-details :color="color_hideFx_logicValue" :label="textLang.cost" class="pad-input condition-hide condition-hide-line hide-object-name-label" v-model="firstHideSet.hideFx.logicValue"></v-text-field>
              </v-col>
              <v-col v-show="firstHideSet.hideFxExtra.length == 0" cols="1" align-self="center" class="px-0">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn depressed fab dark x-small v-on="on" :color="color_icon_mdiplus" @click="addLogic(firstHideSet.setIndx)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ textLang.add_condition }}</span>
                </v-tooltip>
              </v-col>
            </v-row>

            <v-row v-for='item in firstHideSet.hideFxExtra' :key="item.index"> 
              <v-col cols='12' class="conect-condition-block">
                <v-select v-if="item.index == 0" dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.conditional_connector" :color="color_intFx" class="condition-hide hide-object-name-label business-box-inside icon-select icon-dropdown-modal" :items="intFx" v-model="firstHideSet.hideFx.int"></v-select>
                <v-select v-else-if="item.index != 0" dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.conditional_connector" :color="color_intFx" class="condition-hide hide-object-name-label business-box-inside icon-select icon-dropdown-modal" :items="intFx" v-model="firstHideSet.hideFxExtra[item.index-1].int"></v-select>
              </v-col>
              <v-col cols='2' align-self="center" class="condition-hide-title">
                {{ textLang.conditions_no }} {{ item.index+2 }}:
              </v-col>
              <v-col cols='3' class="pl-0">
                <v-text-field outlined dense hide-details :color="color_name" :label="textLang.name_object" class="pad-input condition-hide condition-hide-line hide-object-name-label" v-model="item.objectName"></v-text-field>
              </v-col>
              <v-col cols='3' class="px-0">
                <v-select dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.condition" :color="color_logicFx" class="condition-hide hide-object-name-label business-box-inside icon-select icon-dropdown-modal" :items="logicFx" v-model="item.logic"></v-select>
              </v-col>
              <v-col cols='3'>
                <v-text-field outlined dense hide-details :color="color_hideFx_logicValue" :label="textLang.cost" class="pad-input condition-hide condition-hide-line hide-object-name-label" v-model="item.logicValue"></v-text-field>
              </v-col>
              <v-col cols='1' align-self="center" class="px-0">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn depressed fab dark x-small v-on="on" color="error" @click="deleteLogic(item,firstHideSet.setIndx)">
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ textLang.delete_condition }}</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-show="item.index == (firstHideSet.hideFxExtra.length-1)" depressed fab dark x-small v-on="on" :color="color_icon_mdiplus" class="add-cond-btn" @click="addLogic(firstHideSet.setIndx)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ textLang.add_condition }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card>

          <div v-for="hs in hideSetArray" :key="hs.setIndx" v-show="hideSetArray.length">
            <v-row justify="center" class="mt-3">
              <v-col cols="3">
                <v-select dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.conditional_connector_group" :color="color_intFx" class="condition-hide hide-object-name-label business-box-inside icon-select icon-dropdown-modal" :items="intFx" v-model="hs.operand"></v-select>
              </v-col>
            </v-row>
            <v-card outlined class="pa-3 mt-3 condition-group-card">
              <v-row class="condition-group-title-row">
                <span class="condition-group-title">{{ textLang.condition_group_title }} {{hs.setIndx}} </span>
                <v-btn depressed dark small color="error" class="ml-3 delete-cond-group-btn" @click="deleteLogicGroup(hs)">{{ textLang.delete_condition_group }}</v-btn>
              </v-row>
              <v-row>
                <v-col cols='2' align-self="center" class="condition-hide-title">
                  {{ textLang.condition_1 }}:
                </v-col>
                <v-col cols='3' class="pl-0">
                  <v-text-field outlined dense hide-details :color="color_name" :label="textLang.name_object" class="pad-input condition-hide condition-hide-line hide-object-name-label" v-model="hs.hideFx.objectName"></v-text-field>
                </v-col>
                <v-col cols='3' class="px-0">
                  <v-select dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.condition" :color="color_logicFx" class="condition-hide hide-object-name-label business-box-inside icon-select icon-dropdown-modal" :items="logicFx" v-model="hs.hideFx.logic"></v-select>
                </v-col>
                <v-col cols='3'>
                  <v-text-field outlined dense hide-details :color="color_hideFx_logicValue" :label="textLang.cost" class="pad-input condition-hide condition-hide-line hide-object-name-label" v-model="hs.hideFx.logicValue"></v-text-field>
                </v-col>
                <v-col v-show="hs.hideFxExtra.length == 0" cols="1" align-self="center" class="px-0">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn depressed fab dark x-small v-on="on" :color="color_icon_mdiplus" @click="addLogic(hs.setIndx)">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ textLang.add_condition }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>

              <v-row v-for='item in hs.hideFxExtra' :key="item.index"> 
                <v-col cols='12' class="conect-condition-block">
                  <v-select v-if="item.index == 0" dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.conditional_connector" :color="color_intFx" class="condition-hide hide-object-name-label business-box-inside icon-select icon-dropdown-modal" :items="intFx" v-model="hs.hideFx.int"></v-select>
                  <v-select v-else-if="item.index != 0" dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.conditional_connector" :color="color_intFx" class="condition-hide hide-object-name-label business-box-inside icon-select icon-dropdown-modal" :items="intFx" v-model="hs.hideFxExtra[item.index-1].int"></v-select>
                </v-col>
                <v-col cols='2' align-self="center" class="condition-hide-title">
                  {{ textLang.conditions_no }} {{ item.index+2 }}:
                </v-col>
                <v-col cols='3' class="pl-0">
                  <v-text-field outlined dense hide-details :color="color_name" :label="textLang.name_object" class="pad-input condition-hide condition-hide-line hide-object-name-label" v-model="item.objectName"></v-text-field>
                </v-col>
                <v-col cols='3' class="px-0">
                  <v-select dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.condition" :color="color_logicFx" class="condition-hide hide-object-name-label business-box-inside icon-select icon-dropdown-modal" :items="logicFx" v-model="item.logic"></v-select>
                </v-col>
                <v-col cols='3'>
                  <v-text-field outlined dense hide-details :color="color_hideFx_logicValue" :label="textLang.cost" class="pad-input condition-hide condition-hide-line hide-object-name-label" v-model="item.logicValue"></v-text-field>
                </v-col>
                <v-col cols='1' align-self="center" class="px-0">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn depressed fab dark x-small v-on="on" color="error" @click="deleteLogic(item,hs.setIndx)">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ textLang.delete_condition }}</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="item.index == (hs.hideFxExtra.length-1)" depressed fab dark x-small v-on="on" :color="color_icon_mdiplus" class="add-cond-btn" @click="addLogic(hs.setIndx)">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ textLang.add_condition }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <v-row class="mt-3 add-group-cond-row">
            <v-spacer></v-spacer>
            <v-btn depressed :color="color_add_cond_group" class="add-group-cond-btn" @click="addLogicGroup()"><b>{{ textLang.add_group_cond }}</b></v-btn>
          </v-row>
        </v-card-text>
        <v-divider class="mx-10"></v-divider>
        <v-card-actions class="pt-12 pb-10">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-12 mr-3 save-setting-btn" @click="close()">{{ textLang.cancel }}</v-btn>
          <v-btn depressed large :color="color_save" class="px-5 ml-3 save-setting-btn save-modal-font-btn" @click="save()">{{ textLang.save }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import { EventBus } from '../../EventBus'
  export default {
    data: () => ({
      dialog_hide_setting: false,
      logicFx: [{text:"เท่ากับ", value:"=="},{text:"ไม่เท่ากับ", value:"!="},{text:"มากกว่าเท่ากับ", value:">="},
      {text:"น้อยกว่าเท่ากับ", value:"<="},{text:"มากกว่า", value:">"},{text:"น้อยกว่า", value:"<"}],
      intFx: [{text:"และ", value:"&&"},{text:"หรือ", value:"||"}],
      hideFx: {objectName: "", logic: "==", logicValue: "", int: ""},
      hideFxExtra: [],
      objectName: "",
      textLang: {
        setting_object: "ตั้งค่าเงื่อนไขการซ่อน Object",
        hidden_conditions: "จะถูกซ่อนตามเงื่อนไขต่อไปนี้",
        condition_group_title: "กลุ่มเงื่อนไขที่",
        add_group_cond: "เพิ่มกลุ่มเงื่อนไข",
        condition_1: "เงื่อนไขที่ 1",
        name_object: "ชื่อ Object",
        condition: "เงื่อนไข",
        cost: "ค่า",
        conditional_connector: "ตัวเชื่อมเงื่อนไข",
        conditional_connector_group: "ตัวเชื่อมกลุ่มเงื่อนไข",
        add_condition: "เพิ่มเงื่อนไข",
        conditions_no: "เงื่อนไขที่",
        delete_condition: "ลบเงื่อนไข",
        delete_condition_group: "ลบกลุ่มเงื่อนไข",
        cancel: "ยกเลิก",
        save: "บันทึกการตั้งค่า",
        logicFx: {
         equal: "เท่ากับ",
         not_equal: "ไม่เท่ากับ",
         greather: "มากกว่าเท่ากับ",
         lass_equal: "น้อยกว่าเท่ากับ",
         greather_than: "มากกว่า",
         less_than: "น้อยกว่า"
       },
       intFx: {
         and: "และ",
         or: "หรือ"
       }
      },
      firstHideSet: {
        setIndx: 1,
        hideFx: {objectName: "", logic: "==", logicValue: "", int: ""},
        hideFxExtra: [],
        operand: ""
      },
      hideSetArray: [],

      //Color Variable
      // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue 
      color_name: '#2ACA9F',
      color_logicFx: '#2ACA9F',
      color_hideFx_logicValue: '#2ACA9F',
      color_icon_mdiplus: '#2ACA9F',
      color_intFx: '#2ACA9F',
      color_save: '#2ACA9F',
      color_add_cond_group: '#97E2E7',
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
    }
    }),
    mounted() {
      EventBus.$on('openHideSetting',this.getOption)
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
        this.color_name = this.colorObject.modal.modal_main_color
        this.color_logicFx = this.colorObject.modal.modal_main_color
        this.color_hideFx_logicValue = this.colorObject.modal.modal_main_color
        this.color_icon_mdiplus = this.colorObject.modal.modal_main_color
        this.color_intFx = this.colorObject.modal.modal_main_color
        this.color_save = this.colorObject.modal.modal_main_color
        this.color_add_cond_group = this.colorObject.modal.modal_sub_color 
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
            this.textLang = lang_th.components.hideSettingModal
            this.logicFx[0].text = lang_th.components.hideSettingModal.logicFx.equal
            this.logicFx[1].text = lang_th.components.hideSettingModal.logicFx.not_equal
            this.logicFx[2].text = lang_th.components.hideSettingModal.logicFx.greather
            this.logicFx[3].text = lang_th.components.hideSettingModal.logicFx.lass_equal
            this.logicFx[4].text = lang_th.components.hideSettingModal.logicFx.greather_than
            this.logicFx[5].text = lang_th.components.hideSettingModal.logicFx.less_than
            this.intFx[0].text = lang_th.components.hideSettingModal.intFx.and
            this.intFx[1].text = lang_th.components.hideSettingModal.intFx.or
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
            this.textLang = lang_en.components.hideSettingModal
            this.logicFx[0].text = lang_en.components.hideSettingModal.logicFx.equal
            this.logicFx[1].text = lang_en.components.hideSettingModal.logicFx.not_equal
            this.logicFx[2].text = lang_en.components.hideSettingModal.logicFx.greather
            this.logicFx[3].text = lang_en.components.hideSettingModal.logicFx.lass_equal
            this.logicFx[4].text = lang_en.components.hideSettingModal.logicFx.greather_than
            this.logicFx[5].text = lang_en.components.hideSettingModal.logicFx.less_than
            this.intFx[0].text = lang_en.components.hideSettingModal.intFx.and
            this.intFx[1].text = lang_en.components.hideSettingModal.intFx.or
        }
      },
      getOption(settingOption) {
        var hideOption = settingOption.hideOption
        this.objectName = settingOption.objectName
        this.hideFx = {objectName: "", logic: "==", logicValue: "", int: ""},
        this.hideFxExtra = []
        hideOption = hideOption.split("hide(").join("")
        hideOption = hideOption.slice(0, -1)
        hideOption = hideOption.split('"').join("")
        var hideSet = hideOption.split(")&&(").join(')@oper@(')
        hideSet = hideSet.split(")||(").join(')@oper@(')
        hideSet = hideSet.split(")@oper@(")
        this.hideSetArray = []
        var setIndex =1
        hideSet.forEach(hs => {
          var subHide = {
            setIndx: setIndex,
            hideFx: {objectName: "", logic: "==", logicValue: "", int: ""},
            hideFxExtra: [],
            operand: ""
          }
          if(hideSet.length == 1) {
            if(hs[0] == "(") {
              hs = hs.slice(1,hs.length-1)
            }
          } else if(hideSet.length > 1) {
            if(hs[0] == "(") {
              hs = hs.substr(1)
            } else if(hs[hs.length-1] == ")"){
              var indx = hideOption.indexOf(hs)
              if(indx >= 3) {
                if(hideOption[indx-3] == '&') {
                  subHide.operand = '&&'
                } else if(hideOption[indx-3] == '|') {
                  subHide.operand = '||'
                }
              }
              hs = hs.slice(0,-1)
            }
          }
          var hideOptions = hs.split('$')
          subHide.hideFxExtra = []
          var index = 0
          for(let i=1; i<hideOptions.length; i++) {
            this.logicFx.forEach(e => {
              if(hideOptions[i].split(e.value).length > 1 && hideOptions[i].split(e.value)[1][0] != '=') {
                var newHide = {}
                if(i == 1) {
                  subHide.hideFx.objectName = hideOptions[i].split(e.value)[0]
                  subHide.hideFx.logic = e.value
                  if(hideOptions[i].split(e.value)[1].split('&&').length > 1) {
                    subHide.hideFx.logicValue = hideOptions[i].split(e.value)[1].split('&&')[0]
                    subHide.hideFx.int = '&&'
                  } else if(hideOptions[i].split(e.value)[1].split('||').length > 1) {
                    subHide.hideFx.logicValue = hideOptions[i].split(e.value)[1].split('||')[0]
                    subHide.hideFx.int = '||'
                  } else {
                    subHide.hideFx.logicValue = hideOptions[i].split(e.value)[1]
                  }
                } else {
                  newHide.objectName = hideOptions[i].split(e.value)[0]
                  newHide.logic = e.value
                  if(hideOptions[i].split(e.value)[1].split('&&').length > 1) {
                    newHide.logicValue = hideOptions[i].split(e.value)[1].split('&&')[0]
                    newHide.int = '&&'
                  } else if(hideOptions[i].split(e.value)[1].split('||').length > 1) {
                    newHide.logicValue = hideOptions[i].split(e.value)[1].split('||')[0]
                    newHide.int = '||'
                  } else {
                    newHide.logicValue = hideOptions[i].split(e.value)[1]
                  }
                  newHide.index = index
                  subHide.hideFxExtra.push(newHide)
                  index++
                }
              }
            })
          }
          setIndex++
          this.hideSetArray.push(subHide)
        })
        if(this.hideSetArray.length > 1) {
          this.firstHideSet = this.hideSetArray[0]
          this.hideSetArray = this.hideSetArray.splice(1)
        } else {
          this.firstHideSet = this.hideSetArray[0]
          this.hideSetArray = []
        }
        this.dialog_hide_setting = true
      },
      addLogic(setIndx) {
        if(setIndx == 1) {
          this.firstHideSet.hideFxExtra.push({index: this.firstHideSet.hideFxExtra.length,objectName: "", logic: "==", logicValue: "", int: ""})
        } else {
          this.hideSetArray[setIndx - 2].hideFxExtra.push({index: this.hideSetArray[setIndx - 2].hideFxExtra.length,objectName: "", logic: "==", logicValue: "", int: ""})
        }
      },
      deleteLogic(logic,setIndx) {
        if(setIndx == 1) {
          var i =  this.firstHideSet.hideFxExtra.indexOf(logic)
           this.firstHideSet.hideFxExtra.splice(i,1)
          for(let j=0; j< this.firstHideSet.hideFxExtra.length; j++) {
            this.firstHideSet.hideFxExtra[j].index = j
          }
        } else {
          var i = this.hideSetArray[setIndx - 2].hideFxExtra.indexOf(logic)
          this.hideSetArray[setIndx - 2].hideFxExtra.splice(i,1)
          for(let j=0; j<this.hideSetArray[setIndx - 2].hideFxExtra.length; j++) {
            this.hideSetArray[setIndx - 2].hideFxExtra[j].index = j
          }
        }
      },
      addLogicGroup() {
        this.hideSetArray.push(
          {
            setIndx: this.hideSetArray.length+2,
            hideFx: {objectName: "", logic: "==", logicValue: "", int: ""},
            hideFxExtra: [],
            operand: ""
          }
        )
      },
      deleteLogicGroup(obj) {
        var i = this.hideSetArray.indexOf(obj)
        this.hideSetArray.splice(i,1)
        for(let j=0; j<this.hideSetArray.length; j++) {
         this.hideSetArray[j].setIndx = j+2
        }
      },
      save() {
        var logicString = ""
        logicString = "hide("
        if(this.firstHideSet.hideFx.objectName) {
          logicString += "("
          if(!this.firstHideSet.hideFxExtra.length) {
            this.firstHideSet.hideFx.int = ""
          }
          logicString += "$" + this.firstHideSet.hideFx.objectName + this.firstHideSet.hideFx.logic + '"'+ this.firstHideSet.hideFx.logicValue + '"' + this.firstHideSet.hideFx.int
          this.firstHideSet.hideFxExtra.forEach(e => {
            if(e.objectName) {
              var indx = this.firstHideSet.hideFxExtra.indexOf(e)
              logicString += '$'+ e.objectName + e.logic + '"'+ e.logicValue + '"'
              if(typeof e.int !== 'undefined' && typeof this.firstHideSet.hideFxExtra[indx + 1] !== 'undefined' && this.firstHideSet.hideFxExtra[indx + 1].objectName) {
                logicString += e.int
              }
            }
          })
          logicString += ")"
        }
        this.hideSetArray.forEach(hs => {
          logicString += hs.operand
          logicString += "("
          if(!hs.hideFxExtra.length) {
            hs.hideFx.int = ""
          }
          logicString += "$" + hs.hideFx.objectName + hs.hideFx.logic + '"'+ hs.hideFx.logicValue + '"' + hs.hideFx.int
          hs.hideFxExtra.forEach(e => {
            if(e.objectName) {
              var indx = this.firstHideSet.hideFxExtra.indexOf(e)
              logicString += '$'+ e.objectName + e.logic + '"'+ e.logicValue + '"'
              if(typeof e.int !== 'undefined' && typeof hs.hideFxExtra[indx + 1] !== 'undefined' && hs.hideFxExtra[indx + 1].objectName) {
                logicString += e.int
              }
            }
          })
          logicString += ")"
        })
        logicString += ')'
        EventBus.$emit('logicString', logicString)
        this.dialog_hide_setting = false
      },
      close() {
        this.dialog_hide_setting = false
      }
    }
  }
</script>

<style>
  .hide-object-hearder {
    font-family: 'Sarabun', sans-serif;
    color: black;
  }

  .condition-group-card {
    border: 2px solid #2ACA9F !important;
  }

  .condition-group-title {
    font-family: 'Sarabun', sans-serif;
    color: #2ACA9F;
    font-size: 16px;
    text-decoration: underline;
  }

  .condition-hide-title {
    font-family: 'Sarabun', sans-serif;
    color: black;
    font-size: 16px;
  }

  .condition-hide {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }

  .v-text-field.condition-hide-line input {
    line-height: 25px;
  }

  .v-input.hide-object-name-label .v-label {
    left: 12px !important;
    font-family: "Sarabun", sans-serif;
  }

  .conect-condition-block {
    padding-left: 40%;
    padding-right: 40%;
  }

  .add-cond-btn {
    margin-left: 4%;
  }

  .add-group-cond-row {
    width: 100%;
    margin-left: 0%;
  }

  .add-group-cond-btn {
    font-family: "Sarabun", sans-serif;
    color: #0E3852 !important;
    text-transform: capitalize;
  }

  .condition-group-title-row {
    width: 100%;
    margin-left: 0%;
  }

  .delete-cond-group-btn {
    font-family: "Sarabun", sans-serif;
    text-transform: capitalize;
  }
</style>