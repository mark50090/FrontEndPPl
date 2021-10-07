<template>
    <v-dialog v-model="dialog" persistent max-width="500">
       <v-card>
            <v-card-title class="front-t-ex py-2">
                Export รายงาน Excel
            </v-card-title>
        <v-card-text class="pt-5">
          <v-row class="text-form-ex">
                  <span class="front-hing-ex">เลือกช่วงวันที่ที่ต้องการ Export</span>   
          </v-row>
          <v-row class="text-form-ex mt-6">
            <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    offset-y
                    min-width="290"
                    >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="dateRangeText"
                        prepend-inner-icon="mdi-calendar-range"
                        color="#4CAF50" 
                        v-on="on"
                        outlined
                        dense
                        hide-details
                        class="text-date"
                        readonly
                    ></v-text-field>
                    </template>
                    <v-date-picker
                    locale="th"
                    show-current
                    range
                    color="#4CAF50"
                    v-model="dates"
                    @change="menu2 = false"
                    :max="currentdate"
                    ></v-date-picker>
                </v-menu>
          </v-row>
        </v-card-text>
        <v-card-actions >
        <v-row class="text-form-ex ">
          <v-spacer></v-spacer>
          <v-col cols="4"
          md="3"
          lg="3"
          class="pr-3 pl-0 pt-0">
          <v-btn class="front-btn-hing-ex" 
                  color="#67C25D" 
                  block
                  outlined
                  @click="dialog=false"
                  >ยกเลิก</v-btn>
                  </v-col> 
          <v-col cols="4"
          md="3"
          lg="3"
          class="pr-0 pl-3 pt-0">
          <v-btn class="front-btn-hing-ex"
                  color="#67C25D"
                  dark
                  block
                  depressed
                  >Export</v-btn
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
        dates: [],
        currentdate: new Date().toISOString().substr(0, 10),
        dialog: false
    }),
    mounted() {
        EventBus.$on('documentreport',this.documentreports)
    },
    methods: {
        documentreports() {
            this.dialog = true
        }
    },
    computed: {
      dateRangeText  () {
        return this.dates.join(' จนถึง ')
      },
    },
  }
</script>
<style>
.text-form-ex {
    width: 100%;
    margin: 0% !important;
    
  }
.front-hing-ex{
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black;
} 
.front-btn-hing-ex{
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
}
.front-t-ex{
    font-family: 'Sarabun', sans-serif;
    font-size: 16px !important;  
    color: white;
    background: #67C25D;
}
.text-date{
  font-family: 'Sarabun', sans-serif;
  font-size: 13px !important; 
}   
</style>