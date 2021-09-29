<template>
      <v-dialog
      v-model="dialog"
      max-width="400"
      scrollable
      persistent
      >
      <v-card>
        <v-card-title class="">
          <v-row class="text-box-return">
            <span class="front-head-return pt-1">ส่งคืนแก้ไข</span>
            <v-spacer></v-spacer>
            <v-btn class="pl-3" icon @click="dialog = false" color="black">
              <v-icon>
                mdi-close-circle
              </v-icon> 
            </v-btn>
          </v-row>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-row align="center" class="text-box-return">
              <v-col class="pa-2 pl-6 pr-7 pt-4" cols="12" lg="12" md="12">
                <v-select color="#4caf50" append-icon="mdi-chevron-down" 
                class="front-box-select"
                  :items="items"
                  label="ลำดับที่ส่งคืน"
                  dense
                  outlined
                ></v-select>
              </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row class="text-box">
            <v-spacer></v-spacer>
            <v-col class="py-1" cols="auto" lg="auto" md="auto">
          <v-btn color="#67C25D" dark depressed class="front-send-return">
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
      items: ['ลำดับ 1', 'ลำดับ 2', 'ลำดับ 3', 'ลำดับ 4']
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
  .text-box-return {
    width: 100%;
    margin: 0% !important;
  }
  .front-head-return {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }
  .front-box-select{
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }
  .front-send-return {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }
</style>