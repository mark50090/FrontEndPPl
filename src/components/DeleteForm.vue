<template>
      <v-dialog
      v-model="dialog"
      max-width="450"
      persistent
      >
      <v-card>
        <v-card-text class="pb-0 pt-2">
          <v-row align="center" class=" text-box-deleteform">
              <v-col class="pt-5" cols="12" lg="12" md="12">
                <span class="font-head-deleteform">ต้องการลบแบบฟอร์ม {{templateform_name}} หรือไม่ ? </span>
              </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-2">
          <v-row align="center" class="text-box-deleteform">
              <v-spacer></v-spacer>
           <v-col align-self="center" class=" pr-1 pl-0" cols="4" lg="4" md="4">
                <v-btn block color="#757575" dark depressed @click="dialog = false" class="font-send-deleteform">
                    ยกเลิก
                </v-btn>
           </v-col>
           <v-col align-self="center" class="pr-0 pl-1" cols="4" lg="4" md="4">
                <v-btn block color="#67C25D" dark depressed class="font-send-deleteform" @click="deleteForm">
                    ตกลง
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
    data: () => ({
      dialog: false,
      templateform_name: ""
    }),
    mounted() {
      EventBus.$on('FormDelete',this.getFormDelete)
    },
    beforeDestroy() {
      EventBus.$off('FormDelete')
    },
    methods: {
      emitLoading(isLoad) {
        EventBus.$emit('loadingOverlay', isLoad)
      },
      getFormDelete(item){
        this.dialog = true
        this.templateform_name = item.templateform_name
        this.template_id = item.template_id
      },
      async deleteForm(){
        try {
          var { data } = await this.axios.get(this.$api_url + '/template_form/api/v1/delete_template_form?template_id=' + this.template_id)
          if(data.status) {
          //Alert ลบสำเร็จ
          this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">สำเร็จ</strong>',
              text: 'ลบแบบฟอร์มสำเร็จ',
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
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">ล้มเหลว</strong>',
              text: 'ลบแบบฟอร์มไม่สำเร็จ',
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
        } catch(e) {
          this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">ล้มเหลว</strong>',
              text: 'ลบแบบฟอร์มไม่สำเร็จ',
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
        this.dialog = false
        EventBus.$emit('getTemplateList')
      }
    }
  }
</script>

<style>

  .text-box-deleteform {
    width: 100%;
    margin: 0% !important;
  }

  .font-head-deleteform {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
  }

  .font-send-deleteform {
    font-family: 'Sarabun', sans-serif;
    
  }
</style>