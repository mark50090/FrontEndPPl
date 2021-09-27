<template>
    <v-dialog v-model="dialog_folder" persistent max-width="530">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ modal_type }}{{ textLang.document_folder }}</b>
        </v-card-title>
        <v-card-text class="px-12 pt-5">
          <v-row>
            <v-col md="5" lg="5" cols="12" align-self="center" class="pl-0 folder-name-title">
              {{ textLang.folder_name }}:
            </v-col>
            <v-col md="7" lg="7" cols="12" class="px-0">
              <v-text-field outlined dense hide-details :color="color_textfield_box" class="pad-input folder-name-title folder-name-line" v-model="folderName"></v-text-field>
            </v-col>
          </v-row>
          <br>
          <v-row>
            <v-col md="5" lg="5" cols="12" class="pl-0 folder-name-title">
              {{ textLang.folder_tag }}:
            </v-col>
            <v-col md="7" lg="7" cols="12" class="px-0">
              <v-select chips multiple outlined dense hide-details :color="color_textfield_box" append-icon="mdi-chevron-down" :items="filter_folder_type" :item-color="color_item_filter_group" class="filter-group-box icon-dropdown-modal" v-model="folderFilter">
                <template v-slot:selection="{item}">
                  <v-chip dark :color="color_chip_filter_type" small close class="filter-group-chip">{{ item }}</v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-7 pb-9">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-10 mr-3 save-setting-btn" @click="dialog_folder = false">{{ textLang.cancel }}</v-btn>
          <v-btn dark depressed large :color="color_ok_btn_modal" class="px-8 ml-3 save-setting-btn" @click="createFolder()">{{ modal_type }}{{ textLang.folder }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { EventBus } from '../../EventBus'

export default {
  data: () => ({
    dialog_folder: false,
    modal_type: '',
    filter_folder_type: [ "เอกสารที่ใช้ภายนอก", "เอกสารที่ใช้ภายใน","เอกสารชั้นความลับ"],
    textLang: {
       document_folder: "แฟ้มรูปแบบเอกสาร",
       folder_name: "ชื่อแฟ้มรูปแบบเอกสาร",
       folder_tag: "กลุ่มของแฟ้มรูปแบบเอกสาร",
       cancel: "ยกเลิก",
       folder: "แฟ้ม"
    },
    folderName: "",
    folderFilter: [],
    selectedFolder: {},
    editedIndex: -1,
    //Color Variable
    // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
    color_textfield_box: '#2ACA9F',
    color_chip_filter_type: '#2ACA9F',
    color_item_filter_group: '#2ACA9F',
    color_ok_btn_modal: '#2ACA9F',
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
    EventBus.$on('createFolder',this.getStartFolder)
    EventBus.$on('changeLang', this.changeLange)
  },
  beforeDestroy() {
    EventBus.$off('changeLang')
    EventBus.$off('createFolder')
  },
  methods: {
    changeColor() {
      this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
      // this.color_dialog_header_bg = this.colorObject.modal.modal_main_color
      // $('.dialog_title').css('background-color', this.color_dialog_header_bg)
      this.color_textfield_box = this.colorObject.modal.modal_main_color
      this.color_chip_filter_type = this.colorObject.modal.modal_main_color
      this.color_item_filter_group = this.colorObject.modal.modal_main_color
      this.color_ok_btn_modal = this.colorObject.modal.modal_main_color
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.CreateFolderModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.CreateFolderModal
      }
    },
    getStartFolder(modalValue) {
      if(modalValue.modal_type == 'create') {
        if(sessionStorage.getItem('page_lang') == 'th') {
          this.modal_type = 'สร้าง'
          this.changeLange()
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          this.modal_type = 'Create '
          this.changeLange()
        }

      } else if(modalValue.modal_type == 'edit') {
        if(sessionStorage.getItem('page_lang') == 'th') {
          this.modal_type = 'แก้ไข'
          this.changeLange()
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          this.modal_type = 'Edit '
          this.changeLange()
        }
        this.selectedFolder = modalValue.item
        this.folderName = this.selectedFolder.folderName
        this.folderFilter = this.selectedFolder.folderFilter
        this.editedIndex = modalValue.index
      }
      // this.changeColor()
      this.dialog_folder = true
    },
    createFolder(type) {
      var folders = []
      var userprofile = JSON.parse(sessionStorage.getItem('userprofile'))
      if(typeof userprofile.user_folder.folders !== 'undefined') {
        folders = userprofile.user_folder.folders
      } 
      if(this.modal_type == 'แก้ไข') {
        var indx = folders.indexOf(this.selectedFolder)
        folders[this.editedIndex].folderName = this.folderName
        folders[this.editedIndex].folderFilter = this.folderFilter
      }else{
        folders.push({
          folderName: this.folderName,
          folderFilter: this.folderFilter
        })
      }
      this.folderName = ""
      this.folderFilter = []
      userprofile.user_folder.folders = folders
      sessionStorage.setItem('userprofile', JSON.stringify(userprofile))
      EventBus.$emit('folderCreated')
      this.dialog_folder = false
    }
  }
}
</script>

<style>
  .folder-name-title {
    font-family: 'Sarabun', sans-serif;
    color: black;
    font-size: 16px;
  }

  .v-text-field.folder-name-line input {
    line-height: 27px;
  }

  .filter-group-box.v-text-field--outlined > .v-input__control > .v-input__slot {
    height: unset !important;
  }

  .filter-group-chip {
    font-family: 'Sarabun', sans-serif;
  }
</style>