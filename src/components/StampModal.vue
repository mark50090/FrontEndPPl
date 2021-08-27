<template>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="e-stamp pb-0">
        <v-row class="send-email">
          <v-icon class="mr-3"> mdi-stamper</v-icon>  
          Stamp
          <v-spacer></v-spacer>
          <v-btn
        text
        icon
        color="#0000008A"
        @click="dialog=false"
      >
        <v-icon > mdi-close</v-icon>
      </v-btn>
      </v-row>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row class="send-email" >
        <v-col
          cols="12"
          md="12"
          lg="12"
          class="px-1"
        >
          <v-text-field class="m-stamp l-mail"
            placeholder="ข้อความ Stamp"
            color="rgb(102, 101, 101)"
            outlined
            hide-details
            dense
          ></v-text-field>
        </v-col>
        </v-row>
      </v-card-text>
                <v-card-actions class="pb-3 pt-0">
                  <v-row class="send-email">
          <v-spacer></v-spacer>
          <v-col cols="6"
          md="5"
          lg="5"
          class="pr-1">
          <v-btn class="b-email" 
                  color="grey darken-1"
                  outlined
                  block
                  @click="dialog=false"
                  >ยกเลิก</v-btn>
                  </v-col>
          
          <v-col cols="6"
          md="5"
          lg="5"
          class="pl-1">
          <v-btn class="b-email"
                  color="#4caf50"
                  dark
                  depressed
                  block
                  @click="dialogConfirm = true"

                  >บันทึก</v-btn
                >
                </v-col><v-spacer></v-spacer>
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
        EventBus.$on('email',this.sendemail)
    },
    methods: {
        sendemail() {
            this.dialog = true
        }
    }
  }
</script>

<style>
.send-email{
  width: 100%;
  margin: 0% !important;
}
.e-stamp{
  font-family: 'Sarabun', sans-serif;
  font-size: 18px !important;
  
}
.m-stamp{
  font-family: 'Sarabun', sans-serif;  
  font-size: 14px ;
}
.b-email{
  font-family: 'Sarabun', sans-serif;
  font-size: 14px !important;
}
.l-mail.v-text-field input{
  line-height: 24px !important;
}
</style>