<template>
      <v-dialog
      v-model="dialog"
      max-width="500"
      persistent
      >
      <v-card>
        <v-card-text class="pb-3 pt-7 text-center">
              <span class="font-head-deleteattach">{{ textLang.font_head_deleteattach1 }}{{ filename }}{{ textLang.font_head_deleteattach2 }}</span>
        </v-card-text>
        <v-card-actions class="pb-2">
          <v-row align="center" class="text-box-deleteattach">
              <v-spacer></v-spacer>
           <v-col align-self="center" class=" pr-1 pl-0" cols="4" lg="4" md="4">
                <v-btn block color="#757575" dark depressed @click="dialog = false" class="cancel-delete-file-btn">
                    {{ textLang.deleteattach_cancel }}
                </v-btn>
           </v-col>
           <v-col align-self="center" class="pr-0 pl-1" cols="4" lg="4" md="4">
                <v-btn block color="#67C25D" dark depressed @click="deleteAttachFile" class="font-btn-deleteattach">
                    {{ textLang.deleteattach_confirm }}
                </v-btn>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { EventBus } from '../EventBus'
export default {
  computed: {
    textLang () {
      return this.$store.getters.textLang.components.ConfirmDeleteAttachFileModal
    }
  },
  data: () => ({
    dialog: false,
    filename: '',
    fileid: null,
    transaction_id: null,
    file_data: null
    // Language Variable
  }),
  mounted () {
    EventBus.$on('FormDeleteAttach', this.getFormDeleteAttach)
  },
  methods: {
    getFormDeleteAttach (file, transaction_id) {
      this.dialog = true
      this.filename = file.filename
      this.fileid = file.file_id
      this.transaction_id = transaction_id
      this.file_data = file
      // console.log(this.filename,this.fileid,this.transaction_id)
    },
    deleteAttachFile () {
      const url = `${this.$api_url}/file-component/api/deleteonefile`
      const config = {
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        params: {
          transaction_id: this.transaction_id,
          file_id: this.fileid
        }
      }
      this.axios.delete(url, config)
        .then((response) => {
          // console.log('deleted', response)
          if (response.data.status) {
            EventBus.$emit('afterDeleteAttach', this.file_data)
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert_success + '</strong>',
              text: this.textLang.success_message,
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
          } else {
            throw new Error(response)
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            if (error.response.data.meassage === 'File not found') this.error_swal(this.textLang.error_filenotfound)
            else this.error_swal(error.response.data.meassage)
          }
        })
        .finally(() => {
          this.dialog = false
        })
    },
    error_swal (message) {
      this.$swal({
        backdrop: false,
        position: 'bottom-end',
        width: '330px',
        title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert_error + '</strong>',
        text: message,
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
  }
}
</script>

<style>

  .text-box-deleteattach {
    width: 100%;
    margin: 0% !important;
  }

  .font-head-deleteattach {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
  }

  .cancel-delete-file-btn {
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
  }

  .font-btn-deleteattach {
    font-family: 'Sarabun', sans-serif;
  }
</style>
