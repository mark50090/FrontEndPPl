<template>
  <v-dialog persistent max-width="360px" v-model="default_stamp_dialog">
    <v-card>
      <v-card-title>
        <span class="default-stamp-header">{{ action_header }}ตราประทับ</span>
        <v-spacer></v-spacer>
        <v-btn icon dark small color="black" @click="cancelButton()">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-row class="default-stamp-row">
          <v-text-field v-if="action_header == 'เพิ่ม'" dense outlined hide-details color="#67C25D" label="ชื่อตราประทับ" class="stamp-name-box stamp-name-label" v-model="stamp_name"></v-text-field>
          <v-text-field v-if="action_header == 'แก้ไข'" dense outlined hide-details color="#67C25D" :label="stamp_name" class="stamp-name-box stamp-name-label" v-model="stamp_name"></v-text-field>
        </v-row>
        <v-row class="mt-3 default-stamp-row">
          <v-btn outlined block color="#67C25D" @click="openUploadStamp()" class="upload-stamp-btn">อัพโหลดไฟล์</v-btn>
          <v-file-input v-model="uploadImage" type="file" id="stampFile" accept="image/png" style="display: none" @change="uploadStamp" />
        </v-row>
        <v-row no-gutters justify="center" class="mt-3 default-stamp-row">
          <v-col align-self="center" class="show-stamp-box-modal">
            <!-- stamp -->
            <v-img :src="imageStamp" width="100%" height="100%" contain></v-img>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row class="default-stamp-row">
          <v-col v-if="action_header == 'แก้ไข'" cols="auto" class="pl-2"> <!-- show when edit stamp -->
            <v-btn outlined color="error" class="upload-stamp-btn" @click="deleteStamp()">ลบตราประทับ</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto" class="pl-0 pr-2">
            <v-btn depressed dark color="#67C25D" class="upload-stamp-btn" @click="saveStamp()">บันทึก</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from '../EventBus'
import Setting from '../views/Setting.vue'
export default {
  components: {
    Setting
  },
  data: () => ({
    default_stamp_dialog: false,
    action_header: '',
    stamp_file: null,
    uploadImage: undefined,
    imageStamp: '',
    stamp_name: '',
    default_stamp: [],
    selectedStamp: [],
    findStamp: '',
    getStampName: '',
    getSrcBase: '',
    notify_email: ''
  }),
  mounted() {
    EventBus.$on('DefaultStamp',this.startSettingStamp)
  },
  methods: {
    getDataForEditStamp() {
      EventBus.$off('Stamp_Data_Edit')
      this.action_header = 'แก้ไข'
      this.stamp_name = this.selectedStamp.StampName
      this.imageStamp = this.selectedStamp.SrcBase
      this.default_stamp_dialog = true 
    },
    getDataForAddStamp() {
      EventBus.$off('Stamp_Data_Add')
      this.action_header = 'เพิ่ม'
      this.stamp_name = ''
      this.imageStamp = ''
      this.default_stamp_dialog = true 
    },
    startSettingStamp(action) {
      if (action == 'add') {
        EventBus.$on('Stamp_Data_Add',(default_stamp) => {
          this.default_stamp = default_stamp
        })
        EventBus.$on('Stamp_Data_Add',this.getDataForAddStamp)
      } 
      else if (action == 'edit') {
        EventBus.$on('Stamp_Data_Edit',(default_stamp,findStamp,selectedStamp) => {
          this.default_stamp = default_stamp
          this.findStamp = findStamp
          this.selectedStamp = selectedStamp
        })
        EventBus.$on('Stamp_Data_Edit',this.getDataForEditStamp)
      }
    },
    openUploadStamp() {
      document.getElementById('stampFile').click()
    },
    uploadStamp(file) {
      if (!file) {
        return;
      }
      this.createDefaultStamp(file)
    },
    createDefaultStamp(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageStamp = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async saveStamp(){
      try {
        var Stampname = []
        var getStampname = []
        this.default_stamp.forEach(element => {
          Stampname.push(element)
        })
        for (let index = 0; index < Stampname.length; index++) {
          getStampname.push(Stampname[index].StampName)
        }
        if (this.action_header == 'เพิ่ม') {
          if ((this.stamp_name != '') & (this.imageStamp != '')) {
            const checkDataArray = getStampname.find(element => element == this.stamp_name);
            if (checkDataArray == undefined) {
              var stampModal = {StampName: this.stamp_name, SrcBase: this.imageStamp}
              this.default_stamp.push(stampModal);
              this.postStamp()
            }
            else if (checkDataArray != undefined) {
              alert("มีชื่อตราประทับซ้ำในระบบ");
              this.default_stamp_dialog = true
            }
          }
          else if ((this.stamp_name == '') & (this.imageStamp == '')) {
            alert("กรุณากรอกชื่อและอัพโหลดรูปภาพตราประทับ");
            this.default_stamp_dialog = true
          }
          else if ((this.stamp_name == '') & (this.imageStamp != '')) {
            alert("กรุณากรอกชื่อตราประทับ");
            this.default_stamp_dialog = true
          }
          else if ((this.stamp_name != '') & (this.imageStamp == '')) {
            alert("กรุณาอัพโหลดรูปภาพตราประทับ");
            this.default_stamp_dialog = true
          }
        }
        else if (this.action_header == 'แก้ไข') {
          if (this.stamp_name != '') {
            getStampname.splice(this.findStamp, 1);
            const checkDataArray = getStampname.find(element => element == this.stamp_name);
            if (checkDataArray == undefined) {
              this.default_stamp[this.findStamp] = {StampName: this.stamp_name, SrcBase: this.imageStamp}
              this.postStamp()
            }
            else if (checkDataArray != undefined) {
              alert("มีชื่อตราประทับซ้ำในระบบ");
              this.default_stamp_dialog = true
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
		},
    deleteStamp(){
      if (this.action_header == 'แก้ไข') {
        this.default_stamp.splice(this.findStamp, 1);
        this.postStamp()
      }
		},
    cancelButton() {
      if (this.action_header == 'เพิ่ม') {
        this.default_stamp_dialog = false
        this.uploadImage = undefined
        this.stamp_name = ''
        this.imageStamp = ''
      }
      else if (this.action_header == 'แก้ไข') {
        this.default_stamp_dialog = false
        this.uploadImage = undefined
      }
    },
    async postStamp(){
      try {
        const url = '/user_setting/api/v1/set_usersetting'
        var { data } = await this.axios.post(this.$api_url + url, 
        {
          default_stamp : this.default_stamp
        })
      } catch (error) {
        console.log(error);
      }
      EventBus.$emit('Setting')
      this.default_stamp_dialog = false
		},
  }
}
</script>

<style>
  .default-stamp-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }

  .default-stamp-row {
    width: 100%;
    margin: 0% !important;
  }

  .stamp-name-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .stamp-name-box.v-text-field input {
    line-height: 22px !important;
  }

  .stamp-name-label.v-input .v-label {
    line-height: 24px !important;
  }

  .upload-stamp-btn {
    font-family: 'Sarabun', sans-serif;
  }

  .show-stamp-box-modal {
    height: 140px;
    border: 1.2px dashed grey;
    border-radius: 4px;
    background-color: #f5f5f5;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
  }
</style>