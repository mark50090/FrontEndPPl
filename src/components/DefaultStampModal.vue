<template>
    <v-dialog persistent max-width="360px" v-model="default_stamp_dialog">
      <v-card>
        <v-card-title>
          <span class="default-stamp-header">{{ action_header }}{{textLang.stamp_head}}</span>
          <v-spacer></v-spacer>
          <v-btn icon dark small color="black" @click="cancelButton()">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pb-0">
            <v-row class="default-stamp-row">
              <v-text-field dense outlined hide-details color="#67C25D" :label="textLang.stamp_name_show" class="stamp-name-box stamp-name-label" v-model="stamp_name" @keyup="check_name_stamp()"></v-text-field>
            </v-row>
          <v-row class="mt-3 default-stamp-row">
            <v-btn-toggle group dense mandatory v-model="sign_type" class="sign-type-btn-group">
              <v-col cols="6" md="6" lg="6" class="pl-0 pr-1">
                <v-btn outlined block color="#67C25D" @click="openUploadStamp()" value="sign_image" active-class="sign-type-active" class="upload-stamp-btn">{{ textLang.stamp_upload }}</v-btn>
                <v-file-input v-model="uploadImage" type="file" id="stampFile" accept="image/png" style="display: none" @change="uploadStamp" />
              </v-col>
              <v-col cols="6" md="6" lg="6" class="pl-1 pr-0">
                <v-btn outlined block color="#67C25D" value="sign_pad" active-class="sign-type-active" class="upload-stamp-btn" @click="draw_signature()">{{ textLang.stamp_pain }}</v-btn>
              </v-col>
            </v-btn-toggle>
          </v-row>
          <v-row no-gutters justify="center" class="mt-3 default-stamp-row">
            <v-col align-self="center" class="show-stamp-box-modal">
              <!-- signature -->
              <v-img v-if="stateDefaultStamp == 'upload'" :src="imageStamp" width="100%" height="100%" contain ></v-img>
              <v-img v-if="stateDefaultStamp == 'show'" :src="imageStamp"  width="100%" height="100%" contain></v-img>
              <VueSignaturePad v-if="stateDefaultStamp == 'draw'" id="signature" width="100%" height="100%" ref="signaturePad" :options="{penColor: 'rgb(13, 38, 154)', onBegin: () => {$refs.signaturePad.resizeCanvas()}, onEnd}" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row class="default-stamp-row">
            <v-spacer></v-spacer>
            <v-col v-if="action_header == 'แก้ไข'" cols="auto" class="pl-0 pr-2"> <!-- show when edit signature -->
              <v-btn outlined color="error" class="upload-stamp-btn" @click="deleteStamp()">{{ textLang.stamp_delete }}</v-btn>
            </v-col>
            <v-col v-if="sign_type == 'sign_pad'" cols="auto" class="pl-0 pr-2"> <!-- show when it is sign pad only -->
              <v-btn depressed dark color="#757575" class="upload-stamp-btn" @click="clearStamp()">{{ textLang.stamp_clear }}</v-btn>
            </v-col>
            <v-col cols="auto" class="pl-0 pr-2">
              <v-btn :disabled="valid" depressed color="#67C25D" class="upload-stamp-btn white--text" @click="saveStamp()">{{ textLang.stamp_save}}</v-btn>
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
    valid: true,
    default_stamp_dialog: false,
    action_header: '',
    stamp_file: null,
    uploadImage: undefined,
    imageStamp: '',
    sign_type: 'sign_pad',
    stamp_name: '',
    default_stamp: [],
    selectedStamp: [],
    findStamp: '',
    getStampName: '',
    getSrcBase: '',
    notify_email: '',
    textLang: {
      stamp_head: 'ลายเซ็น',
      stamp_name_show: 'ชื่อลายเซ็น',
      stamp_upload: 'อัพโหลดไฟล์',
      stamp_pain: 'วาดลายเซ็น',
      stamp_delete: 'ลบลายเซ็น',
      stamp_clear: 'ล้างค่า',
      stamp_save: 'บันทึก',
      update_stamp_success: 'อัพเดทข้อมูลสำเร็จ',
      update_stamp_fail: 'อัพเดทข้อมูลล้มเหลว',
      stamp_succeed: 'สำเร็จ',
      stamp_error: 'ล้มเหลว'
    },
    stateDefaultStamp: '',
    checkSignature: true,
    check_default_sign: true,
    check_state_sign: false
  }),
  mounted() {
    EventBus.$on('DefaultStamp',this.startSettingStamp)
    if (this.sign_type == 'sign_pad') this.stateDefaultStamp = 'draw'
    else if (this.sign_type == 'sign_image') this.stateDefaultStamp = 'show'
  },
  methods: {
    draw_signature() {
      this.valid = true
      this.stateDefaultStamp = 'draw'
      this.check_state_sign = true
      // if (this.stateDefaultStamp == 'draw' && this.check_state_sign == true) {
      //   this.$refs.signaturePad.clearSignature()
      //   this.checkSignature = this.$refs.signaturePad.isEmpty()
      //   if (this.checkSignature == true) this.valid = true
      // }
    },
    check_name_stamp() {
      if (this.stamp_name != '' && this.imageStamp != '') this.valid = false
      else if ((this.stamp_name == '' && this.imageStamp == '')||(this.stamp_name != '' && this.imageStamp == '')||(this.stamp_name == '' && this.imageStamp != '')) this.valid = true
      if ( this.action_header == 'แก้ไข') {
        if (this.stateDefaultStamp == 'draw') {
          this.checkSignature = this.$refs.signaturePad.isEmpty()
          if (this.stamp_name != '' && this.checkSignature == false) this.valid = false
          else this.valid = true
        }
      }
      else if ( this.action_header == 'เพิ่ม') {
        if (this.stateDefaultStamp == 'draw') {
          this.checkSignature = this.$refs.signaturePad.isEmpty()
          if (this.stamp_name != '' && this.checkSignature == false) this.valid = false
          else this.valid = true
        }
      }
    },
    onEnd() {
      this.checkSignature = this.$refs.signaturePad.isEmpty()
      if (this.stamp_name != '' && this.checkSignature == false) this.valid = false
      if (this.action_header == 'แก้ไข') this.check_state_sign = true
    },
    getDataForEditStamp() {
      EventBus.$off('Stamp_Data_Edit')
      this.sign_type = 'sign_pad'
      this.action_header = 'แก้ไข'
      this.stamp_name = this.selectedStamp.StampName
      this.imageStamp = this.selectedStamp.SrcBase
      this.stateDefaultStamp = 'show'
      this.default_stamp_dialog = true 
      this.uploadImage = this.selectedStamp
      this.valid = false
    },
    getDataForAddStamp() {
      EventBus.$off('Stamp_Data_Add')
      this.action_header = 'เพิ่ม'
      this.stamp_name = ''
      this.imageStamp = ''
      this.sign_type = 'sign_pad'
      this.stateDefaultStamp = 'draw'
      this.valid = true
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
      if (this.action_header == 'เพิ่ม') {
        if (this.imageStamp == '') this.imageStamp = '',this.valid = true
      }
      document.getElementById('stampFile').click()
      if (this.stateDefaultStamp == 'draw') {
        // this.$refs.signaturePad.clearSignature()
        this.checkSignature = this.$refs.signaturePad.isEmpty()
        // if (this.checkSignature == true) this.valid = true
        // this.valid = true
      }
      this.stateDefaultStamp = 'upload'
      console.log("imageStamp",this.imageStamp)
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
        if (this.stamp_name != '' && this.imageStamp != '') this.valid = false  
        else this.valid = true
      };
      reader.readAsDataURL(file);
    },
    clearStamp() {
      this.imageStamp = ''
      this.stateDefaultStamp = 'draw'
      this.valid = true
      if (this.action_header == 'เพิ่ม' && this.stateDefaultStamp == 'draw') this.$refs.signaturePad.clearSignature()
      if (this.action_header == 'แก้ไข' && this.check_state_sign == true) this.$refs.signaturePad.clearSignature()
    },
    saveStamp() {
      if (this.stateDefaultStamp == 'draw') {
        var { isEmpty, data } = this.$refs.signaturePad.saveSignature();
        this.imageStamp = data
        this.default_sign = true
      }
      if (this.action_header == 'เพิ่ม') {
        var stampModal = {StampName: this.stamp_name, SrcBase: this.imageStamp}
        this.default_stamp.push(stampModal);
        this.postStamp()     
      }
      else if (this.action_header == 'แก้ไข') {
        if (this.stamp_name != '') {
          this.default_stamp[this.findStamp] = {StampName: this.stamp_name, SrcBase: this.imageStamp}
          this.postStamp()
        }
      }
		},
    deleteStamp(){
      if (this.action_header == 'แก้ไข') {
        this.default_stamp.splice(this.findStamp, 1);
        this.postStamp()
      }
		},
    cancelButton() {
      this.check_state_sign = false
      this.default_stamp_dialog = false
      if (this.action_header == 'เพิ่ม') {
        this.valid = true
        this.stamp_name = ''
        if (this.stateDefaultStamp == 'draw') {
          this.$refs.signaturePad.clearSignature()
          // this.checkSignature = this.$refs.signaturePad.isEmpty()
        }
        else if (this.stateDefaultStamp == 'upload') {
          this.uploadImage = undefined
          this.imageStamp = ''
        }
      }
      else if (this.action_header == 'แก้ไข') {
        if (this.stateDefaultStamp == 'draw') {
          this.$refs.signaturePad.clearSignature()
          // this.checkSignature = this.$refs.signaturePad.isEmpty()
        }
        else if (this.stateDefaultStamp == 'upload') {
          this.uploadImage = undefined
          this.imageStamp = ''
        }
      }
    },
    async postStamp(){
      try {
        const url = '/user_setting/api/v1/set_usersetting'
        if (this.default_stamp != '') this.check_default_sign = true 
        else if (this.default_stamp == '') this.check_default_sign = false
        var { data } = await this.axios.post(this.$api_url + url,
        {
          default_sign : this.check_default_sign,
          default_stamp : this.default_stamp
        })
        this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.stamp_succeed + '</strong>',
            text: this.textLang.update_stamp_success,
            showCloseButton: true,
            showConfirmButton: false,
            timer: 5000,
            customClass: {
            popup: 'alert-card',
            title: 'alert-title-block',
            closeButton: 'close-alert-btn',
            htmlContainer: 'alert-text-block'
          }
        })
      } catch (error) {
        console.log(error);
        this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.stamp_error + '</strong>',
            text: this.textLang.update_stamp_fail,
            showCloseButton: true,
            showConfirmButton: false,
            timer: 5000,
            customClass: {
            popup: 'alert-card',
            title: 'alert-title-block',
            closeButton: 'close-alert-btn',
            htmlContainer: 'alert-text-block'
          }
        })
      }
      EventBus.$emit('Setting')
      this.default_stamp_dialog = false
      this.checkSignature = true
      this.checkNameSignature = true
      this.valid = true
      if (this.action_header == 'แก้ไข') this.check_state_sign = false
      if (this.stateDefaultStamp == 'draw') this.$refs.signaturePad.clearSignature()
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

  .sign-type-btn-group {
    width: 100%;
  }

  .upload-stamp-btn {
    font-family: 'Sarabun', sans-serif;
  }

  .sign-type-active {
    background-color: #67C25D;
    color: white !important;
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
