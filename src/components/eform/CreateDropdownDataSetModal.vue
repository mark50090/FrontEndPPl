<template>
    <v-dialog persistent scrollable max-width="70%" v-model="dialog_dropdown_dataset">
      <v-card>
        <v-card-title class="py-2 create-dropdown-header-modal">
          {{ textLang.create_edit }}
        </v-card-title>
        <v-row class="px-6 py-5 add-dataset-row">
          <v-btn depressed dark color="#0F3852" class="pl-2 add-dataset-button" @click="addChoiceSet()">
            <v-icon class="mr-2">mdi-plus</v-icon>{{ textLang.add_group }}
          </v-btn>
        </v-row>
        <v-card-text class="pb-8">
          <v-expansion-panels accordion multiple class="flat-expan" v-model="dataset_panel">
            <v-expansion-panel v-for="item in choiceSet" :key="item.index">
              <v-expansion-panel-header class="px-0 pb-0 dataset-title-header">
                <v-row class="add-dataset-row">
                  <v-col cols="auto" align-self="center" class="pl-2 pt-0 dataset-title-block">
                    <b>{{ textLang.group_no }} {{item.index}} :</b>
                  </v-col>
                  <v-col cols="4" align-self="center" class="px-0 pb-0">
                    <v-text-field outlined dense :label="textLang.name_group" color="#67c25d" class="dropdown-dataset-name dropdown-dataset-name-label" v-model="item.name" :error="item.name_error" :error-messages="item.name_error_msg" @input="checkEmptyName(item)"></v-text-field>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="auto" align-self="start" class="delete-dataset-block">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn text icon large color="red" v-on="on" @click="deleteChoiceSet(item)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ textLang.delete_group }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <template v-slot:actions>
                  <v-icon color="#67c25d">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <hr class="ml-2 line-expan-dataset-modal" />
              <v-expansion-panel-content class="dataset-choice-content">
                <v-row justify="end" class="pl-2 add-dataset-row">
                  <v-col cols="11" class="pr-0 pb-0">
                    <v-chip v-for="choice in item.list" :key="choice" close dark small color="#4CAF50" class="mr-2 mb-2 choice-chip" @click:close="deleteChoice(item,choice)">{{choice}}</v-chip>
                  </v-col>
                </v-row>
                <v-row v-show="item.name" class="pl-2 add-dataset-row">
                  <v-col cols="1" align-self="center" class="pl-0 choice-title">
                    {{ textLang.sub_choices }} :
                  </v-col>
                  <v-col cols="5" align-self="center" class="pr-0">
                    <v-text-field dense hide-details color="#4CAF50" append-outer-icon="mdi-plus" @click:append-outer="addChoice(item)" v-on:keyup.enter="addChoice(item)" v-model="newChoice" class="dropdown-dataset-choice"></v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-divider class="ml-8 mr-6"></v-divider>
        <v-card-actions class="py-5">
          <v-spacer></v-spacer>
          <v-btn outlined color="#67c25d" class="px-12 mr-4 cancel-create-dropdown-dataset" @click="dialog_dropdown_dataset = false,choiceSet = []">{{ textLang.cancel }}</v-btn>
          <v-btn depressed color="#67c25d" class="px-3 ml-4 save-create-dropdown-dataset" :disabled="!choiceSet.length" @click="saveChoiceSet()">{{ textLang.save }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { EventBus } from "../../EventBus";
export default {
  computed: {
    textLang() {
      return this.$store.getters.textLang.components.CreateDropdownDataSetModal
    }
  },
  data: () => ({
    dialog_dropdown_dataset: false,
    dataset_panel: [],
    choiceSet: [],
    newChoice: "",
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
.create-dropdown-header-modal {
  font-family: "Sarabun", sans-serif;
  font-size: 16px !important;
  color: white;
  background-color: #67c25d;
}

.add-dataset-row {
  width: 100%;
  margin: 0%;
}

.add-dataset-button {
  font-family: "Sarabun", sans-serif;
  /* color: #2aca9f !important; */
  text-transform: capitalize;
}

.dataset-title-header {
  font-family: "Sarabun", sans-serif;
  /* padding-bottom: 0%; */
}

.dataset-title-block {
  /* padding-right: 0%;
  padding-top: 2%; */
  font-family: "Sarabun", sans-serif;
  font-size: 16px;
}

.delete-dataset-block {
  padding-top: 2%;
}

.dropdown-dataset-name {
  font-family: "Sarabun", sans-serif;
  font-size: 13px;
}

.v-text-field.dropdown-dataset-name input {
  line-height: 21px !important;
}

.dropdown-dataset-name-label.v-input .v-label {
  height: 24px !important;
  line-height: 24px !important;
}

.dropdown-dataset-name-label.v-text-field--outlined.v-input--dense .v-label {
  top: 6px !important;
}

.line-expan-dataset-modal {
  border: solid 1px #67c25d;
  /* margin-right: 2%;
  margin-left: 2%; */
}

.dataset-choice-content .v-expansion-panel-content__wrap {
  padding-left: 0% !important;
  padding-right: 0% !important;
}

.choice-chip {
  font-family: "Sarabun", sans-serif;
  /* margin-right: 2%;
  margin-bottom: 1%; */
}

.choice-title {
  font-family: "Sarabun", sans-serif;
  font-size: 16px;
}

.dropdown-dataset-choice {
  font-family: "Sarabun", sans-serif;
  font-size: 13px;
}

.dropdown-dataset-choice.v-text-field input {
  line-height: 21px !important;
}

.save-modal-font-btn {
  color: white !important;
  text-transform: capitalize;
}

.cancel-create-dropdown-dataset {
  font-family: "Sarabun", sans-serif;
}

.save-create-dropdown-dataset {
  font-family: "Sarabun", sans-serif;
  color: white !important;
  text-transform: capitalize;
}
</style>