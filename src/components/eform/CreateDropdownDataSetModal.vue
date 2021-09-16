<template>
  <v-container>
    <v-dialog persistent scrollable max-width="70%" v-model="dialog_dropdown_dataset">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <span>
            <b>{{ textLang.create_edit }}</b>
          </span>
          <!-- <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog_dropdown_dataset = false,choiceSet = []">
            <v-icon>mdi-close</v-icon>
          </v-btn>-->
        </v-card-title>
        <v-row class="add-dataset-row">
          <v-btn depressed dark :color="color_add_choice" class="add-dataset-button" @click="addChoiceSet()">
            <v-icon :color="color_name_choice">mdi-plus</v-icon><b>{{ textLang.add_group }}</b>
          </v-btn>
        </v-row>
        <v-card-text class="pa-7">
          <v-expansion-panels accordion multiple class="flat-expan" v-model="dataset_panel">
            <v-expansion-panel v-for="item in choiceSet" :key="item.index">
              <v-expansion-panel-header class="row-title dataset-title-header">
                <v-row>
                  <v-col cols="2" class="pb-0 dataset-title-block">
                    <b>{{ textLang.group_no }} {{item.index}} :</b>
                  </v-col>
                  <v-col cols="4" class="pb-0 dataset-name-block">
                    <v-text-field outlined dense :label="textLang.name_group" :color="color_name_choice" class="pad-input label-data dataset-name-line-height" v-model="item.name" :error="item.name_error" :error-messages="item.name_error_msg" @input="checkEmptyName(item)"></v-text-field>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="1" class="pb-0 delete-dataset-block">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn text icon color="red" dark v-on="on" @click="deleteChoiceSet(item)">
                          <v-icon class="delete-dataset-icon">mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ textLang.delete_group }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <template v-slot:actions>
                  <v-icon :color="color_icon_expand">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <hr class="line-expan-dataset-modal" />
              <v-expansion-panel-content class="dataset-choice-content">
                <v-row>
                  <v-col cols="10" class="choice-chips-block">
                    <v-chip v-for="choice in item.list" :key="choice" close dark :color="color_name" class="choice-chip" @click:close="deleteChoice(item,choice)">{{choice}}</v-chip>
                  </v-col>
                </v-row>
                <v-row v-show="item.name">
                  <v-col cols="2">
                    <v-subheader class="choice-title">{{ textLang.sub_choices }} :</v-subheader>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field dense hide-details :color="color_choice" append-outer-icon="mdi-plus" @click:append-outer="addChoice(item)" v-on:keyup.enter="addChoice(item)" v-model="newChoice"></v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-divider class="mx-10"></v-divider>
        <v-card-actions class="dataset-dialog-button-part">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-12 mr-4 save-setting-btn" @click="dialog_dropdown_dataset = false,choiceSet = []">{{ textLang.cancel }}</v-btn>
          <v-btn depressed large :color="color_save" class="px-7 ml-4 save-setting-btn save-modal-font-btn" :disabled="!choiceSet.length" @click="saveChoiceSet()">
            <!--<v-icon class="save-setting-icon send-ppl-disable-icon">mdi-content-save-outline</v-icon>-->
            {{ textLang.save }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { EventBus } from "../../EventBus";
export default {
  data: () => ({
    dialog_dropdown_dataset: false,
    dataset_panel: [],
    choiceSet: [],
    newChoice: "",
    textLang: {
      create_edit: "สร้าง / แก้ไข กลุ่มตัวเลือก",
      add_group: "เพิ่มกลุ่มตัวเลือก",
      group_no: "กลุ่มตัวเลือกที่",
      name_group: "ชื่อกลุ่มตัวเลือก",
      please_input: "กรุณากรอกชื่อกลุ่มตัวเลือก",
      delete_group: "ลบกลุ่มตัวเลือก",
      sub_choices: "ตัวเลือก",
      cancel: "ยกเลิก",
      save: "บันทึกกลุ่มตัวเลือก" 
    },

    //Color Variable
    // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
    color_add_choice: '#97E2E7',
    color_name_choice: '#2ACA9F',
    color_icon_expand: '#2ACA9F',
    color_choice: '#97E2E7',
    color_name: '#97E2E7',
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
  				modal_sub_color: '#97E2E7',
 			},
 			main_color: '#1b9900'
    }
  }),
  mounted() {
    EventBus.$on("openCreateDropdownDataset", this.getDropdown);
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
      this.color_add_choice = this.colorObject.modal.modal_sub_color
      this.color_name_choice = this.colorObject.modal.modal_main_color
      this.color_icon_expand = this.colorObject.modal.modal_main_color
      this.color_choice = this.colorObject.modal.modal_sub_color
      this.color_name = this.colorObject.modal.modal_sub_color
      this.color_save = this.colorObject.modal.modal_main_color
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.CreateDropdownDataSetModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.CreateDropdownDataSetModal
      }
    },
    getDropdown(alterChoicesSet) {
      this.choiceSet = [];
      if (typeof alterChoicesSet === "undefined") {
        alterChoicesSet = {};
      }
      var keySets = Object.keys(alterChoicesSet);
      var i = 1;
      keySets.forEach(e => {
        this.choiceSet.push({
          index: i,
          name: e,
          list: alterChoicesSet[e],
          name_error: false,
          name_error_msg: ""
        });
        i++;
      });
      this.choiceSetKey = Object.keys(this.choiceSet);
      this.dialog_dropdown_dataset = true;
    },
    addChoiceSet() {
      var len = this.choiceSet.length;
      this.choiceSet.push({
        index: len + 1,
        name: "",
        list: [],
        name_error: true,
        name_error_msg: this.textLang.please_input
      });
    },
    checkEmptyName(cs) {
      var index = this.choiceSet.indexOf(cs);
      if (cs.name == "") {
        this.choiceSet[index].name_error = true;
        this.choiceSet[index].name_error_msg = this.textLang.please_input;
      } else {
        this.choiceSet[index].name_error = false;
        this.choiceSet[index].name_error_msg = "";
      }
    },
    deleteChoiceSet(cs) {
      var index = this.choiceSet.indexOf(cs);
      this.choiceSet.splice(index, 1);
      for (let i = 1; i <= this.choiceSet.length; i++) {
        this.choiceSet[i - 1].index = i;
      }
    },
    addChoice(cs) {
      var index = this.choiceSet.indexOf(cs);
      this.choiceSet[index].list.push(this.newChoice);
      this.newChoice = "";
    },
    deleteChoice(cs, choice) {
      var index = this.choiceSet.indexOf(cs);
      var choiceIndex = this.choiceSet[index].list.indexOf(choice);
      this.choiceSet[index].list.splice(choiceIndex, 1);
    },
    saveChoiceSet() {
      var choiceDict = {};
      this.choiceSet.forEach(e => {
        choiceDict[e.name] = e.list;
      })
      // sessionStorage.setItem("saveChoiceDict", JSON.stringify(choiceDict));
      EventBus.$emit("saveDropDown", choiceDict)
      this.dialog_dropdown_dataset = false;
      this.choiceSet = [];
    }
  }
};
</script>

<style>
.add-dataset-row {
  width: 100%;
  padding-top: 2%;
  padding-left: 5%;
  padding-bottom: 2%;
}

.add-dataset-button {
  font-family: "Sarabun", sans-serif;
  color: #2aca9f !important;
  text-transform: capitalize;
}

.dataset-title-header {
  font-family: "Sarabun", sans-serif;
  padding-bottom: 0%;
}

.dataset-title-block {
  padding-right: 0%;
  padding-top: 2%;
}

.dataset-name-block {
  padding-left: 0%;
}

.delete-dataset-block {
  padding-top: 2%;
}

.v-text-field.dataset-name-line-height input {
  line-height: 30px !important;
}

.delete-dataset-icon {
  font-size: 32px !important;
}

.line-expan-dataset-modal {
  border: solid 1px #2aca9f;
  margin-right: 2%;
  margin-left: 2%;
}

.dataset-choice-content {
  padding-bottom: 5%;
}

.choice-chips-block {
  margin-left: 10%;
}

.choice-chip {
  font-family: "Sarabun", sans-serif;
  margin-right: 2%;
  margin-bottom: 1%;
}

.choice-title {
  font-family: "Sarabun", sans-serif;
  font-size: 16px;
}

.dataset-dialog-button-part {
  padding-bottom: 4%;
  padding-top: 5%;
}

.save-modal-font-btn {
  color: white !important;
  text-transform: capitalize;
}
</style>