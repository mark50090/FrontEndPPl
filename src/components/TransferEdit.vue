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
                <v-text-field color="#4caf50"
                    class="font-box-transfer"
                    :label="textLang.transfer_email"
                    placeholder="@one.th"
                    dense
                    outlined
                    hide-details
                ></v-text-field>
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
                <v-btn block color="#67C25D" dark depressed class="font-send-transfer">
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
    }),
    mounted() {
      EventBus.$on('FormTransfer',this.getFormTransfer)
    },
    methods: {
      getFormTransfer(){
        this.dialog = true
      }
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
    
  }
</style>