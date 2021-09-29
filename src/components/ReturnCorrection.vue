<template>
      <v-dialog
      v-model="dialog"
      max-width="300"
      persistent
      >
      <v-card>
        <v-card-title>
          <v-row align="center" class="text-box-return">
            <span class="font-head-return">ส่งคืนแก้ไข</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false" color="black">
              <v-icon>
                mdi-close-circle
              </v-icon> 
            </v-btn>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-row align="center" class="text-box-return">
              <v-col class="pa-0" cols="12" lg="12" md="12">
                <v-select color="#4caf50" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }"
                class="font-box-select fontin icon-select fontin-select"
                  label="ลำดับที่ส่งคืน"
                  dense
                  outlined
                  hide-details
                ></v-select>
              </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-row class="text-box-return">
            <v-spacer></v-spacer>
            <v-col class="pa-0" cols="auto" lg="auto" md="auto">
          <v-btn color="#67C25D" dark depressed class="font-send-return">
            ส่งคืน
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
    }),
    mounted() {
      EventBus.$on('FormReturn',this.getFormReturn)
    },
    methods: {
      getFormReturn(){
        this.dialog = true
      }
    }
  }
</script>

<style>
  .fontin-select .v-label {
    font-size: 13px !important;
  }
  .icon-select .v-icon.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
  }
  .fontin .v-select__selections {
    line-height: 22px !important;
  }
  .text-box-return {
    width: 100%;
    margin: 0% !important;
  }
  .font-head-return {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }
  .font-box-select{
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }
  .font-send-return {
    font-family: 'Sarabun', sans-serif;
    
  }
</style>