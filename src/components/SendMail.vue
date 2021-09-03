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
                placeholder="อีเมลผู้รับ"
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
            ส่งอีเมล
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
      sending_email: ""
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
          var url = '/sendmail/api/v1/send'
          var {data} = await this.axios.post(this.$api_url + url,{
            email : this.sending_email,
            subject : "test",
            data : "test"
          })
          if(data.message){
            alert('sent email success')
          }
          this.dialog = false
        } catch (error) {
          console.log(error);
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