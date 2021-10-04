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
                <span class="font-head-deleteform">ต้องการลบแบบฟอร์ม "ชื่อแบบฟอร์ม" หรือไม่ ? </span>
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
                <v-btn block color="#67C25D" dark depressed class="font-send-deleteform">
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
    }),
    mounted() {
      EventBus.$on('FormDelete',this.getFormDelete)
    },
    methods: {
      getFormDelete(){
        this.dialog = true
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