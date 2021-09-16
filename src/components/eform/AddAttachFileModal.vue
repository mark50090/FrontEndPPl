<template>
  <v-container>
    <v-dialog v-model="add_attach_dialog" scrollable persistent max-width="650px">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.attach_header_dialog }}</b>
        </v-card-title>
        <v-card-text class="px-12 pt-5">
          <v-row class="row-crad-files">
            <div v-for="item in attachedFiles"  :key="item.file_id">
              <v-chip class="ma-1 chip-moblie" v-if="!item.waitUpload" small label dark :color="color_chip_file" :close="item.username == currentUser" @click="downloadFile(item)" @click:close="deleteFile(item)">{{ item.file_name }}</v-chip>
              <v-chip v-if="item.waitUpload" small label outlined class="ma-1 chip-moblie text-area-front" :color="color_paperless_file_title" close @click:close="deleteFileWait(item)"><b>{{item.file_name}}</b>&nbsp;<i>({{ textLang.wait_upload }})</i></v-chip>
            </div>
          </v-row>
          <v-row>
            <v-col cols="12" md="4" lg="4" align-self="center" class="attach-file-title">{{ textLang.input_attach_title }}</v-col>
            <v-col cols="12" md="8" lg="8">
              <v-file-input show-size dense counter multiple :color="color_file_input" :placeholder="textLang.placeholder_file" class="file-input" v-model="selFiles">
                <template v-slot:selection="{ text }">
                  <v-chip small label dark :color="color_chip_file">{{ text }}</v-chip>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-0 pb-12">
          <v-spacer></v-spacer>
          <v-btn outlined large color="#979797" dark class="px-11 mr-4 save-setting-btn" @click="add_attach_dialog = false">{{ textLang.cancel_attach_btn }}</v-btn>
          <v-btn depressed large :color="color_attach_btn" class="px-12 ml-4 save-setting-btn save-modal-font-btn" @click="saveAttachFiles()">{{ textLang.attach_btn }}</v-btn>
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
      add_attach_dialog: false,
      files: [],
      selFiles: [],
      currentUser: "",
      attachedFiles: [],
      //Language Variable
      textLang: {
        attach_header_dialog: "แนบเอกสารเข้าระบบ Paperless",
        input_attach_title: "เอกสารแนบเพิ่มเติม",
        placeholder_file: "กรุณาเลือกเอกสารแนบ",
        cancel_attach_btn: "ยกเลิก",
        attach_btn: "ตกลง",
        wait_upload: "รอการอัพโหลด"
      },

      //Color Variable
      color_chip_file: '#2ACA9F',
      color_file_input: '#2ACA9F',
      color_attach_btn: '#2ACA9F',
      color_paperless_file_title: '#2ACA9F',
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
      EventBus.$on('attachFiles', this.startAttach)
      EventBus.$on('changeLang', this.changeLange)
      // this.changeColor()
    },
    watch: {
      files(val) {
        this.applyAttachFiles()
      }
    },
    methods: {
      changeColor() {
        this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
        this.color_chip_file = this.colorObject.modal.modal_main_color
        this.color_file_input = this.colorObject.modal.modal_main_color
        this.color_attach_btn = this.colorObject.modal.modal_main_color
        this.color_paperless_file_title = this.colorObject.modal.modal_main_color
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
				  this.textLang = lang_th.components.AddAttachFileModal
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.AddAttachFileModal
        }
      },
      startAttach(uploadingFiles, attFiles) {
        this.selFiles = []
        this.currentUser = sessionStorage.getItem("oneuser")
        this.files = uploadingFiles
        this.attachedFiles = attFiles
        this.add_attach_dialog = true
      },
      saveAttachFiles() {
        this.selFiles.forEach(e => {
          this.files.push(e)
        })
        var uploadingFiles = this.files
        EventBus.$emit('changeAttachFiles', uploadingFiles)
        this.add_attach_dialog = false
      },
      deleteFileWait(delItem) {
        var fileIndex = this.files.indexOf(delItem)
        this.files.splice(fileIndex, 1)
      },
      applyAttachFiles() {
        var holdFiles = this.attachedFiles.filter(item => !item.waitUpload)
        this.files.forEach(e => {
          holdFiles.push({
            file_id:e.name,
            file_name:e.name,
            username:"",
            waitUpload: true
          })
        })
        this.attachedFiles = holdFiles
      },
      async deleteFile(item) {
        try {
          // var { data } = await this.axios.get(
          //   ApiConverterFunction.convertDoctorApi(this.$api) + "/attract_file/delete/" + item.file_id,
          //   {
          //     headers: {
          //       Authorization:
          //         "Bearer " + sessionStorage.getItem("one_access_token")
          //     }
          //   }
          // )
          // if (data.result == "OK") {
          //   var indx = this.attachedFiles.indexOf(item)
          //   this.attachedFiles.splice(indx,1)
          //   sessionStorage.setItem("Folder_Attachment_Name", JSON.stringify(this.attachedFiles))
          //   EventBus.$emit('removeAttachFiles')
          // }
        } catch (error) {
          console.log(error);
        }
      },
    }
  }
</script>

<style>
  .attach-file-title {
    font-family: "Sarabun", sans-serif;
    font-size: 16px;
    color: black;
    text-align: right;
  }

  @media only screen and (max-width: 960px) {
    .attach-file-title {
      text-align: left;
    }
  }
</style>