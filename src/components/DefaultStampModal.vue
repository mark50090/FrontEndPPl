<template>
  <v-dialog persistent max-width="360px" v-model="default_stamp_dialog">
    <v-card>
      <v-card-title>
        <span class="default-stamp-header">{{ action_header }}ตราประทับ</span>
        <v-spacer></v-spacer>
        <v-btn icon dark small color="black" @click="default_stamp_dialog = false">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-row class="default-stamp-row">
          <v-text-field dense outlined hide-details color="#67C25D" label="ชื่อตราประทับ" class="stamp-name-box stamp-name-label"></v-text-field>
        </v-row>
        <v-row class="mt-3 default-stamp-row">
          <v-btn outlined block color="#67C25D" @click="openUploadStamp()" class="upload-stamp-btn">อัพโหลดไฟล์</v-btn>
          <input type="file" id="stampFile" accept="image/*" style="display: none" @change="uploadStamp">
        </v-row>
        <v-row no-gutters justify="center" class="mt-3 default-stamp-row">
          <v-col align-self="center" class="show-stamp-box-modal">
            <!-- stamp -->
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row class="default-stamp-row">
          <v-col v-if="action_header == 'แก้ไข'" cols="auto" class="pl-2"> <!-- show when edit stamp -->
            <v-btn outlined color="error" class="upload-stamp-btn">ลบตราประทับ</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto" class="pl-0 pr-2">
            <v-btn depressed dark color="#67C25D" class="upload-stamp-btn">บันทึก</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { EventBus } from '../EventBus'

  export default {
    data: () => ({
      default_stamp_dialog: false,
      action_header: '',
      stamp_file: null
    }),
    mounted() {
      EventBus.$on('DefaultStamp', this.startSettingStamp)
    },
    methods: {
      startSettingStamp(action) {
        if(action == 'add') {
          this.action_header = 'เพิ่ม'
        } else if(action == 'edit') {
          this.action_header = 'แก้ไข'
        }
        this.default_stamp_dialog = true
      },
      openUploadStamp() {
        document.getElementById('stampFile').click()
      },
      uploadStamp(e) {
        this.stamp_file = e.target.files[0] //get file
      }
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