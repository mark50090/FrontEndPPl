<template>
    <v-dialog v-model="dialog" persistent max-width="320">
       <v-card>
        <v-card-text class="pt-7 px-7 pb-2">
          <v-row class="text-hing" justify="center">
            <span class="front-hing">ต้องการยกเลิกข้อความหรือไม่ ?</span>    
          </v-row>
        </v-card-text>
        <v-card-actions>
        <v-row class="text-hing">
          <v-spacer></v-spacer>
          <v-col cols="4"
          md="4"
          lg="4"
          class="pr-1 pl-0">
          <v-btn class="front-btn-hing" 
                  color="#757575"
                  dark  
                  block
                  depressed
                  @click="dialog=false"
                  >ยกเลิก</v-btn>
                  </v-col> 
          <v-col cols="4"
          md="4"
          lg="4"
          class="pr-0 pl-1">
          <v-btn class="front-btn-hing"
                  color="#67C25D"
                  dark
                  block
                  depressed
                  @click="confirm_delete_fn"
                  >ตกลง</v-btn
                >
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
        dialog: false
    }),
    mounted() {
        EventBus.$on('deletemessage',this.deletemessages)
    },
    methods: {
        deletemessages() {
            this.dialog = true
        },
        confirm_delete_fn (){
          EventBus.$emit('confirm_deletemessage')
          this.dialog = false
        }
    }
  }
</script>
<style>
.text-hing{
    width: 100%;
    margin: 0% !important;
}
.front-hing{
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
}
.front-btn-hing{
    font-family: 'Sarabun', sans-serif;
}

</style>