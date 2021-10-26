<template>
      <v-dialog
      v-model="dialog"
      max-width="400"
      scrollable
      persistent
      >
      <v-card>
        <v-card-title>
          <v-row class="text-box">
            <span class="front-th">Send Email</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false" color="#0000008A">
              <v-icon>
                mdi-close-circle
              </v-icon> 
            </v-btn>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-3">
          <v-row class="text-box">
            <template  v-for="item in selected_email" >
            <v-col class="pb-1 px-0 pt-0" cols="8" lg="8" md="8" :key="item.key">
              <v-text-field
              class="front-box"
                :placeholder="textLangSendMail.recipient_email"
                outlined
                dense
                hide-details
                color="#67C25D"
                v-model="item.value"
              ></v-text-field>
            </v-col>
            <v-col align-self="center" class="pb-1 pr-1 pl-2 pt-0" cols="auto" lg="auto" md="auto" :key="item.key">
              <v-btn icon outlined fab color="#67C25D" x-small v-if="selected_email.length > 1" @click ="deleteEmail(item)">
                <v-icon>
                  mdi-minus
                </v-icon>
              </v-btn>
              </v-col>
            </template>
              <v-col align-self="center" class="pb-1 pr-1 pl-2 pt-0" cols="auto" lg="auto" md="auto">
              <v-btn dark depressed fab color="#67C25D" x-small @click="addEmail()">
                <v-icon>
                  mdi-plus</v-icon>
                </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row class="text-box">
            <v-spacer></v-spacer>
            <v-col class="py-1" cols="auto" lg="auto" md="auto">
          <v-btn color="#67C25D" dark depressed class="front-send" @click="sendEmail">
            {{ textLangSendMail.send_email }}
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
      reveal: false,
      selected_email: [],
      sending_email_array: [],
      sending_email: "",

      //Language Variable
      textLangSendMail: {
        recipient_email: 'อีเมลผู้รับ',
        send_email: 'ส่งอีเมล',
        send_email_success: 'ส่งอีเมลสำเร็จ',
        send_email_fail: 'ส่งอีเมลล้มเหลว'
      }
    }),
    mounted() {
      EventBus.$on('FormMail',this.getFromMail)
      this.addEmail()
    },
    methods: {
      getFromMail(){
        this.dialog = true
      },
      emitLoading(isLoad) {
        EventBus.$emit('loadingOverlay', isLoad)
      },
      deleteEmail(item){
        var target_index = this.selected_email.indexOf(item);
        if(this.selected_email.length > 1) this.selected_email.splice(target_index, 1)
        else item.value = null
      },
      addEmail(){
        var index = this.selected_email.length
        var newItem = {
          index: index,
          value: null,
        }
        this.selected_email.push(newItem)
      },
      async sendEmail(){
        this.sending_email = ""
        this.sending_email_array = []
        this.selected_email.forEach(element => {
          if(element.value) {
            this.sending_email_array.push(element.value)
          }
        })
        this.sending_email = this.sending_email_array.join(",")
        try {
          this.emitLoading(true)
          var id = sessionStorage.transaction_id
          var url = `/sendmail/api/v1/send?transaction_id=${id}`
          var {data} = await this.axios.post(this.$api_url + url,{
            to : this.sending_email,
          })
          if(data.message){
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">สำเร็จ</strong>',
              text: this.textLangSendMail.send_email_success,
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
              text: this.textLangSendMail.send_email_fail,
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
        } catch (error) {
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">ล้มเหลว</strong>',
            text: this.textLangSendMail.send_email_fail,
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
        this.emitLoading(false)
      }
    }
  }
</script>

<style>
  .text-box {
    width: 100%;
    margin: 0% !important;
  }
  .front-th {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }
  .front-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }
  .front-send {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }
</style>