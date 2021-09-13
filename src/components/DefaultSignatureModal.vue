<template>
  <v-dialog persistent max-width="360px" v-model="signature_dialog">
    <v-card>
      <v-card-title>
        <span class="signature-modal-header">กำหนดลายเซ็น</span>
        <v-spacer></v-spacer>
        <v-btn icon dark small color="black" @click="signature_dialog = false">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-row class="signature-modal-row">
          <v-btn-toggle group dense mandatory v-model="sign_type" class="signature-setting-btn-group">
            <v-col cols="6" md="6" lg="6" class="pl-0 pr-1">
              <v-btn outlined block color="#67C25D" value="sign_image" @click="openUploadSignatureImage()" active-class="sign-type-btn-active" class="upload-signature-btn">อัพโหลดไฟล์</v-btn>
              <input type="file" id="signatureImage" accept="image/*" style="display: none" @change="uploadSignatureImage">
            </v-col>
            <v-col cols="6" md="6" lg="6" class="px-0">
              <v-btn outlined block color="#67C25D" active-class="sign-type-btn-active" value="sign_pad" class="upload-signature-btn">วาดลายเซ็น</v-btn>
            </v-col>
          </v-btn-toggle>
        </v-row>
        <v-row no-gutters justify="center" class="signature-modal-row"> 
          <v-col cols="auto" align-self="center" class="signature-block">
            <!-- signature -->
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-row class="signature-modal-row">
          <v-spacer></v-spacer>
          <v-col v-if="sign_type == 'sign_pad'" cols="auto" class="pl-0 pr-2"> <!-- show when it is sign pad only -->
            <v-btn depressed dark color="#757575" class="upload-signature-btn">ล้างค่า</v-btn>
          </v-col>
          <v-col cols="auto" class="pl-0 pr-2">
            <v-btn depressed dark color="#67C25D" class="upload-signature-btn">บันทึก</v-btn>
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
      signature_dialog: false,
      signature_image_file: null,
      sign_type: 'sign_pad'
    }),
    mounted() {
      EventBus.$on('DefaultSignature',this.startSettingSignature)
    },
    methods: {
      startSettingSignature() {
        this.signature_dialog = true
      },
      openUploadSignatureImage() {
        document.getElementById('signatureImage').click()
      },
      uploadSignatureImage(e) {
        this.signature_image_file = e.target.files[0] //get file
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
</style>