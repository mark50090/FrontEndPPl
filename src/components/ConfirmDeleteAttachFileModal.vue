<template>
      <v-dialog
      v-model="dialog"
      max-width="500"
      persistent
      >
      <v-card>
        <v-card-text class="pb-3 pt-7 text-center">
              <span class="font-head-deleteattach">{{ textLang.font_head_deleteattach1 }}การทดสอบไฟล์เอกสารแนบ.pdf{{ textLang.font_head_deleteattach2 }}</span>
        </v-card-text>
        <v-card-actions class="pb-2">
          <v-row align="center" class="text-box-deleteattach">
              <v-spacer></v-spacer>
           <v-col align-self="center" class=" pr-1 pl-0" cols="4" lg="4" md="4">
                <v-btn block color="#757575" dark depressed @click="dialog = false" class="font-btn-deleteattach">
                    {{ textLang.deleteattach_cancel }}
                </v-btn>
           </v-col>
           <v-col align-self="center" class="pr-0 pl-1" cols="4" lg="4" md="4">
                <v-btn block color="#67C25D" dark depressed class="font-btn-deleteattach">
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
    data: () => ({
      dialog: false,
      
      //Language Variable
      textLang: {
          font_head_deleteattach1: 'ต้องการลบไฟล์ \"',
          font_head_deleteattach2: '\" หรือไม่ ?',
          deleteattach_cancel: 'ยกเลิก',
          deleteattach_confirm: 'ตกลง'
      }
    }),
    mounted() {
      EventBus.$on('FormDeleteAttach',this.getFormDeleteAttach)
    },
    methods: {
      getFormDeleteAttach(){
        this.dialog = true
      },
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

  .font-btn-deleteattach {
    font-family: 'Sarabun', sans-serif;
    
  }
</style>