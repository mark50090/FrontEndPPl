<template>
      <v-dialog
      v-model="dialog"
      max-width="350"
      persistent
      >
      <v-card>
        <v-card-title class="">
          <v-row align="center" class="text-box-transfer">
            <span class="font-head-transfer">{{ textLang.transfer_edit_form }}</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false" color="black">
              <v-icon>
                mdi-close-circle
              </v-icon> 
            </v-btn>
          </v-row>
        </v-card-title>
        <v-card-text class="pb-2 pt-3">
          <v-row align="center" class="text-box-transfer">
                <v-combobox color="#4caf50"
                    class="font-box-transfer"
                    :label="textLang.transfer_email"
                    placeholder="@one.th"
                    dense
                    outlined
                    hide-details
                    v-model="actor_email.thai_email" 
                    :error="actor_email.thai_email == ''"
                    :items="getEmail"
                    @input.native="actor_email.thai_email=$event.srcElement.value, getEmail = []"
                    v-on:keyup.enter="search_citizen()"
                ></v-combobox>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-2">
          <v-row align="center" class="text-box-transfer">
              <v-spacer></v-spacer>
           <v-col align-self="center" class=" pr-3 pl-0" cols="4" lg="4" md="4">
                <v-btn block color="#757575" dark depressed @click="dialog = false" class="font-send-transfer">
                    {{ textLang.cancel_transfer }}
                </v-btn>
           </v-col>
           <v-col align-self="center" class="pr-0 pl-3" cols="4" lg="4" md="4">
                <v-btn block color="#67C25D" dark depressed class="font-send-transfer" @click="transferTemplate()">
                    {{ textLang.confirm_transfer }}
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
      textLang() {
        return this.$store.getters.textLang.components.TransferEdit
      }
    },
    data: () => ({
      dialog: false,
      getEmail: [],
      actor_email: {
        thai_email: ""
      },
      templateOption: {}
    }),
    mounted() {
      EventBus.$on('FormTransfer',this.getFormTransfer)
    },
    beforeDestroy() {
      EventBus.$off('FormTransfer')
    },
    methods: {
      getFormTransfer(item){
        this.templateOption = item
        this.dialog = true
      },
      async transferTemplate() {
       if(typeof this.actor_email.thai_email === 'object' && this.actor_email.thai_email.value) {
          try {
            var url = `/template_form/api/v1/transfer_template`
            var {data} = await this.axios.post(this.$api_url + url, {
              template_id: this.templateOption.template_id,
              sender_detail: this.actor_email.thai_email.value
            } )
            if(data.status) {
              EventBus.$emit('getTemplateList')
              this.dialog = false
            }
          } catch(e) {
            console.log(e)
          }
        }
      },
      async search_citizen() {
        let searchWord = this.actor_email.thai_email
        if(typeof this.actor_email.thai_email === 'object') {
          searchWord = this.actor_email.thai_email.text
        }
        try {
          this.getEmail = []
          var url = `/citizen/api/v1/search_citizen`
          var {data} = await this.axios.post(this.$api_url + url, {keyword: searchWord} )
          if(data.status) {
            let getResult = data.result
            for (let index = 0; index < getResult.length; index++) {
              this.getEmail.push({text: getResult[index].citizen_data.thai_email, value: {
                account_id: getResult[index].account_id,
                first_name_th: getResult[index].citizen_data.first_name_th,
                last_name_th: getResult[index].citizen_data.last_name_th,
                first_name_eng: getResult[index].citizen_data.first_name_eng,
                last_name_eng: getResult[index].citizen_data.last_name_eng,
                account_title_th: getResult[index].citizen_data.account_title_th,
                account_title_eng: getResult[index].citizen_data.account_title_eng,
                thai_email: getResult[index].citizen_data.thai_email
              }})
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
    }
  }
</script>

<style>
  
  .text-box-transfer {
    width: 100%;
    margin: 0% !important;;
  }
  .font-head-transfer {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }
  .font-box-transfer{
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }
  .font-send-transfer {
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
  }
</style>