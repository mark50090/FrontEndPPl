<template>
  <v-dialog persistent max-width="360px" v-model="signature_dialog">
    <v-card>
      <v-card-title>
        <span class="signature-modal-header">{{ textLang.signature_header }}</span>
        <v-spacer></v-spacer>
        <v-btn icon dark small color="black" @click="cancelButton()">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-row class="signature-modal-row">
          <v-btn-toggle group dense mandatory v-model="sign_type" class="signature-setting-btn-group">
            <v-col cols="6" md="6" lg="6" class="pl-0 pr-1">
              <v-btn outlined block color="#67C25D" value="sign_image" @click="openUploadSignatureImage()" active-class="sign-type-btn-active" class="upload-signature-btn">{{ textLang.upload_file }}</v-btn>
              <v-file-input v-model="uploadImage" class="input" label="Upload license" type="file" id="signatureImage" accept="image/png" style="display: none"  @change="uploadSignatureImage" />
            </v-col>
            <v-col cols="6" md="6" lg="6" class="px-0">
              <v-btn outlined block color="#67C25D" value="sign_pad" active-class="sign-type-btn-active" class="upload-signature-btn" @click="drawSignature()">{{ textLang.signpad }}</v-btn>
            </v-col>
          </v-btn-toggle>
        </v-row>
        <v-row no-gutters justify="center" class="signature-modal-row"> 
          <v-col cols="auto" align-self="center" class="signature-block">
            <!-- signature -->
            <v-img v-if="stateDefaultSignature == 'upload'" :src="imageSignature" width="100%" height="100%" class="imagesignature-block" contain></v-img>
            <v-img v-if="stateDefaultSignature == 'show'" :src="default_Signature"  width="100%" height="100%" class="imagesignature-block" contain></v-img>
            <VueSignaturePad v-if="stateDefaultSignature == 'draw'" id="signature" width="100%" height="100%" ref="signaturePad" :options="{penColor: 'rgb(13, 38, 154)', onBegin: () => {$refs.signaturePad.resizeCanvas()}}" class="imagesignature-block"/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row class="signature-modal-row">
          <v-spacer></v-spacer>
          <v-col v-if="sign_type == 'sign_pad'" cols="auto" class="pl-0 pr-2"> <!-- show when it is sign pad only -->
            <v-btn v-if="stateDefaultSignature == 'draw'" depressed dark color="#757575" class="upload-signature-btn" @click="clearSignature()">{{ textLang.clearsign}}</v-btn>
          </v-col>
          <v-col cols="auto" class="pl-0 pr-2">
            <v-btn depressed dark color="#67C25D" class="upload-signature-btn" @click="saveSignature()">{{ textLang.savesign }}</v-btn>
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
  computed: {
    textLang() {
      return this.$store.getters.textLang.components.DefaultSignatureModal
    }
  },
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
    stateDefaultSignature: 'show',
    default_Signature: '',
    default_Business: '',
    default_sign: false,
    notify_email: '',
    switch_notify_email: false,
    default_Business: '',
  }),
  mounted() {
    EventBus.$on('DefaultSignature',this.startSettingSignature)
  },
  methods: {
    startSettingSignature() {
      this.signature_dialog = true
      EventBus.$on('Signature_Data',(default_Business,default_Signature,switch_notify_email,notify_email) => {
        this.default_Business = default_Business
        this.default_Signature = default_Signature
        this.switch_notify_email = switch_notify_email
        this.notify_email = notify_email
      })
      EventBus.$on('Signature_Data',this.getData)
    },
    getData() {
      EventBus.$off('Signature_Data')
      if (this.default_Signature != '') {
        this.stateDefaultSignature = 'show'
      }
      if ((this.default_Signature == '') || (this.default_Signature == undefined)) {
        this.imageSignature = ''
        this.stateDefaultSignature = 'draw'
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
    saveSignature() {
      if (this.stateDefaultSignature == 'upload') {
        this.default_Signature = this.imageSignature
        this.default_sign = true
        this.postData()
      }
      if (this.stateDefaultSignature == 'show') {
        this.postData()
      }
      if (this.stateDefaultSignature == 'draw') {
        var { isEmpty, data } = this.$refs.signaturePad.saveSignature();
        this.default_Signature = data
        this.default_sign = true
        if (this.default_Signature == undefined) {
          this.default_Signature = ''
          this.default_sign = false
        }
        this.postData()
      }
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
      if (this.stateDefaultSignature == 'draw') {
        this.$refs.signaturePad.clearSignature()
      }
      this.uploadImage = undefined
      this.imageSignature = ''
      // EventBus.$emit('Set_Signature')
    },
    async postData() {
      try {
        if (this.default_Business == undefined) {
          this.default_Business = ''
        }
        if (this.default_Signature == undefined) {
          this.default_Signature = ''
        }
        if (this.switch_notify_email == undefined) {
          this.switch_notify_email = false
        }
        if (this.notify_email == undefined) {
          this.notify_email = ''
        }
        const url = '/user_setting/api/v1/set_usersetting'
        var { data } = await this.axios.post(this.$api_url + url, 
          {
            default_sign : this.default_sign,
            other_setting : 
            {
              Default_Business : this.default_Business, 
              Default_Signature : this.default_Signature,
              Default_NotifyEmail : this.switch_notify_email,
              Notify_Email : this.notify_email
            }
        })
        this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.update_succeed + '</strong>',
            text: this.textLang.update_default_success,
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
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.update_error + '</strong>',
            text: this.textLang.update_default_fail,
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
      EventBus.$emit('Set_Signature')
      this.signature_dialog = false
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
    text-transform: capitalize;
    max-width: 100%;
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
