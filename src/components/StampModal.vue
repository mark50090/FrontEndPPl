<template>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="e-stamp pb-0">
        <v-row class="s-stamp">
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
          <v-row class="s-stamp" >
        <v-col
          cols="12"
          md="12"
          lg="12"
          class="px-1"
        >
          <v-text-field class="m-stamp l-stamp"
            :placeholder="textLang.message_stamp"
            v-model="message"
            color="rgb(102, 101, 101)"
            outlined
            hide-details
            dense
          ></v-text-field>
        </v-col>
        </v-row>
      </v-card-text>
                <v-card-actions class="pb-3 pt-0">
                  <v-row class="s-stamp">
          <v-spacer></v-spacer>
          <v-col cols="6"
          md="5"
          lg="5"
          class="pr-1">
          <v-btn class="b-stamp" 
                  color="grey darken-1"
                  outlined
                  block
                  @click="dialog=false"
                  >{{ textLang.cancel_stamp }}</v-btn>
                  </v-col>
          
          <v-col cols="6"
          md="5"
          lg="5"
          class="pl-1">
          <v-btn class="b-stamp"
                  color="#4caf50"
                  dark
                  depressed
                  block
                  @click="dialogConfirm = true;addStamp()"

                  >{{ textLang.confirm_stamp }}</v-btn
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
        dialog: false,
        message: "",
        //Language Variable
        textLang: {
          message_stamp: 'ข้อความ Stamp',
          cancel_stamp: 'ยกเลิก',
          confirm_stamp: 'บันทึก'
        }
    }),
    mounted() {
        EventBus.$on('stamp', this.stamper)
    },
    methods: {
        stamper() {
            this.dialog = true
        },
        addStamp() {
          var tCtx = document.getElementById('textCanvas').getContext('2d')
          tCtx.canvas.width = tCtx.measureText(this.message).width
          tCtx.canvas.height = 50
          tCtx.font = '50px Arial'
          tCtx.fillText(this.message, 0, 50)
          tCtx.canvas.width = tCtx.measureText(this.message).width
          tCtx.canvas.height = 50
          tCtx.font = '50px Arial'
          tCtx.fillText(this.message, 0, 50)
          EventBus.$emit('getstamp', tCtx.canvas.toDataURL())
          this.message = ''
          this.dialog = false
        }
    },
    beforeDestroy() {
      EventBus.$off('stamp', this.stamper)
    }
  }
</script>

<style>
.s-stamp{
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
.b-stamp{
  font-family: 'Sarabun', sans-serif;
  font-size: 14px !important;
}
.l-stamp.v-text-field input{
  line-height: 24px !important;
}
</style>