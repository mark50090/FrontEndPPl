<template>
    <v-dialog v-model="dialog" persistent max-width="450">
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
        <v-card-text class="pb-0 pt-3">
          <v-row class="s-stamp" >
            <v-col  cols="12" md="4" lg="4" class=" pl-0 m-stamp a-stamp font-color-stamp " align-self="center">
            {{textLang.stamp_type}}:
            </v-col>
            <v-col  cols="12" md="8" lg="8" class=" px-0  a-stamp" align-self="center">
            <v-select dense outlined hide-details :placeholder="textLang.stamp_type"  color="rgb(102, 101, 101)" class="m-stamp l-stamp" v-model="stamp_type_value" :items="items" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }"></v-select>
            </v-col>
            </v-row>
            <br class="display-mobile-only">
            <v-row class="s-stamp " v-if="stamp_type_value === 'stamp_text'">
            <v-col  cols="12" md="4" lg="4" class=" pl-0 m-stamp font-color-stamp  a-stamp" align-self="center">
            {{textLang.message_stamp}}:
        </v-col>
          <v-col
            cols="12"
            md="8"
            lg="8"
            class="px-0  a-stamp"
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
        <!--  <v-row class="s-stamp " >
            <v-col  cols="12" md="4" lg="4" class=" pl-0 m-stamp font-color-stamp  a-stamp" align-self="center">
            Stamp:
        </v-col>
          <v-col
            cols="12"
            md="8"
            lg="8"
            class="px-0  a-stamp"
          >
            <v-autocomplete class="m-stamp l-stamp"
              :placeholder="textLang.name"
              color="rgb(102, 101, 101)"
              outlined
              hide-details
              dense
              append-icon="mdi-chevron-down"
            ></v-autocomplete>
          </v-col>
          </v-row> -->
      </v-card-text>
                <v-card-actions class="pb-3 pt-2">
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
  computed: {
    textLang () {
      return this.$store.getters.textLang.components.StampModal
    },
    items() {
      return [
        { text: this.textLang.current_date , value: 'current_date' },
        { text: this.textLang.text , value: 'stamp_text' },
        // { text: this.textLang.juristic_person , value: 'juristic_person'}
      ]
    }
  },
  data: () => ({
    dialog: false,
    message: '',
    // items: [{ text: 'วันที่ปัจจุบัน', value: 'current_date' },
    //   { text: 'ข้อความ', value: 'stamp_text' },
    //   { text: 'นิติบุคคล', value: 'juristic_person' }],
    stamp_type_value: 'stamp_text',
    // Language Variable
    // textLang: {
    //   message_stamp: 'ข้อความ Stamp',
    //   cancel_stamp: 'ยกเลิก',
    //   confirm_stamp: 'บันทึก',
    //   stamp_type: 'ประเภท Stamp',
    //   current_date: 'วันที่ปัจจุบัน',
    //   text: 'ข้อความ',
    //   juristic_person: 'นิติบุคคล',
    //   name: 'ชื่อ Stamp'
    // }
  }),
  mounted () {
    EventBus.$on('stamp', this.stamper)
  },
  watch: {
    stamp_type_value () {
      this.message = ''
    }
  },
  methods: {
    stamper () {
      this.dialog = true
      this.stamp_type_value = 'stamp_text'
    },
    addStamp () {
      if (this.stamp_type_value === 'current_date') {
        var date = new Date()
        this.message = new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Bangkok' }).format(date)
      }
      var tCtx = document.getElementById('textCanvas').getContext('2d')
      tCtx.canvas.width = tCtx.measureText(this.message).width
      tCtx.canvas.height = 60
      tCtx.font = '50px Arial'
      tCtx.fillText(this.message, 0, 50)
      tCtx.canvas.width = tCtx.measureText(this.message).width
      tCtx.canvas.height = 60
      tCtx.font = '50px Arial'
      tCtx.fillText(this.message, 0, 50)
      EventBus.$emit('getstamp', tCtx.canvas.toDataURL())
      this.message = ''
      this.dialog = false
    }
  },
  beforeDestroy () {
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
  text-transform: capitalize;
}
.l-stamp.v-text-field input{
  line-height: 24px !important;
}
.a-stamp{
  padding-top: 4%;
}
.font-color-stamp{
  color: black;
}
@media only screen and (max-width:600px){ /*css for mobile screen*/
.a-stamp{
  padding-top: 0%;
}

}
</style>
