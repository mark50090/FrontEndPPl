<template>
  <v-dialog persistent max-width="360px" v-model="signature_dialog">
    <v-card>
      <v-card-title>
        <span class="signature-modal-header">กำหนดลายเซ็น</span>
        <v-spacer></v-spacer>
        <v-btn icon dark small color="black" @click="cancelButton()">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-row class="signature-modal-row">
          <v-btn-toggle group dense mandatory v-model="sign_type" class="signature-setting-btn-group">
            <v-col cols="6" md="6" lg="6" class="pl-0 pr-1">
              <v-btn outlined block color="#67C25D" value="sign_image" @click="openUploadSignatureImage()" active-class="sign-type-btn-active" class="upload-signature-btn">อัพโหลดไฟล์</v-btn>
              <v-file-input v-model="uploadImage" class="input" label="Upload license" type="file" id="signatureImage" accept="image/png" style="display: none"  @change="uploadSignatureImage" />
            </v-col>
            <v-col cols="6" md="6" lg="6" class="px-0">
              <v-btn outlined block color="#67C25D" value="sign_pad" active-class="sign-type-btn-active" class="upload-signature-btn" @click="drawSignature()">วาดลายเซ็น</v-btn>
            </v-col>
          </v-btn-toggle>
        </v-row>
        <v-row no-gutters justify="center" class="signature-modal-row"> 
          <v-col cols="auto" align-self="center" class="signature-block">
            <!-- signature -->
            <v-img v-if="stateDefaultSignature == 'upload'" :src="imageSignature" width="100%" height="100%" class="imagesignature-block" contain></v-img>
            <v-img v-if="stateDefaultSignature == 'show'" :src="default_Signature"  width="100%" height="100%" class="imagesignature-block" contain></v-img>
            <VueSignaturePad v-if="stateDefaultSignature == 'draw'" id="signature" width="100%" height="100%" ref="signaturePad" :options="options" class="imagesignature-block"/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row class="signature-modal-row">
          <v-spacer></v-spacer>
          <v-col v-if="sign_type == 'sign_pad'" cols="auto" class="pl-0 pr-2"> <!-- show when it is sign pad only -->
            <v-btn v-if="stateDefaultSignature == 'draw'" depressed dark color="#757575" class="upload-signature-btn" @click="clearSignature()">ล้างค่า</v-btn>
          </v-col>
          <v-col cols="auto" class="pl-0 pr-2">
            <v-btn depressed dark color="#67C25D" class="upload-signature-btn" @click="saveSignature()">บันทึก</v-btn>
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
    signature_dialog: false,
    signature_image_file: null,
    sign_type: 'sign_pad',
    uploadImage: undefined,
    imageSignature: '',
    save_default_signature: '',
    options: {
      penColor: 'rgb(13, 38, 154)',
    },
    stateDefaultSignature: '',
    default_Signature: '',
    default_Business: '',
    default_sign: false,
    Notify_Email: ''
  }),
  mounted() {
    EventBus.$on('DefaultSignature',this.startSettingSignature)
  },
  methods: {
    async startSettingSignature() {
      this.stateDefaultSignature = 'show'
      try {
      this.signature_dialog = true
      const url = '/user_setting/api/v1/get_usersetting'
      var { data } = await this.axios.get(this.$api_url + url)
        if(data) {
          this.default_Business = data.result.other_setting.Default_Business
          this.default_Signature = data.result.other_setting.Default_Signature
          this.Notify_Email = data.result.other_setting.Notify_Email
          this.default_sign = data.result.default_sign
          if(this.default_Signature != '') {
            this.stateDefaultSignature = 'show'
          }
          if(this.default_Signature == '') {
            this.stateDefaultSignature = 'draw'
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    openUploadSignatureImage() {
      document.getElementById('signatureImage').click()
      this.uploadImage = undefined
    },
    uploadSignatureImage(file) {
      if (!file) {
        return;
      }
      this.createDefaultSignature(file)
      this.stateDefaultSignature = 'upload'
    },
    createDefaultSignature(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSignature = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async saveSignature(){
      try {
        if (this.stateDefaultSignature == 'upload') {
          this.default_Signature = this.imageSignature
          this.default_sign = true
        }
        if (this.stateDefaultSignature == 'draw') {
          var { isEmpty, data } = this.$refs.signaturePad.saveSignature();
          this.default_Signature = data
          this.default_sign = true
          if (this.default_Signature == undefined) {
            this.default_Signature = ''
            this.default_sign = false
          }
        }
        const url = '/user_setting/api/v1/set_usersetting'
        var { data } = await this.axios.post(this.$api_url + url, 
        {
          default_sign : this.default_sign,
          other_setting : 
          {
            Default_Business : this.default_Business, 
            Default_Signature : this.default_Signature,
            Notify_Email : this.Notify_Email
          }
        })
      } catch (error) {
        console.log(error);
      }
      EventBus.$emit('Setting')
      this.signature_dialog = false
		},
    clearSignature() {
      this.$refs.signaturePad.clearSignature();
      this.default_Signature = ''
    },
    drawSignature() {
      this.imageSignature = ''
      this.stateDefaultSignature = 'draw'
    },
    cancelButton() {
      this.signature_dialog = false
      this.uploadImage = undefined
      this.imageSignature = ''
    }

  }
}
</script>

<style>
  .signature-modal-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }

  .signature-modal-row {
    width: 100%;
    margin: 0% !important;
  }

  .upload-signature-btn {
    font-family: 'Sarabun', sans-serif;
  }

  .signature-setting-btn-group {
    width: 100%;
  }

  .sign-type-btn-active {
    background-color: #67C25D;
    color: white !important;
  }

  .signature-block {
    width: 278px;
    height: 140px;
    border: 1.2px dashed grey;
    border-radius: 4px;
    background-color: #f5f5f5;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
  }

  .imagesignature-block{
    width: 278px;
    height: 140px;
  }

</style>