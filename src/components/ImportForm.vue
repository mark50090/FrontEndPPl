<template>
    <v-dialog v-model="dialog" persistent max-width="450">
       <v-card>
        <v-card-title>
          <v-row class="text-form">
            <span class="front-section">นำเข้าไฟล์แบบฟอร์ม</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false" color="#000000">
              <v-icon>
                mdi-close-circle
              </v-icon> 
            </v-btn>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-0 pb-0">
          <v-row class="text-form">
              <v-col cols="12" lg="12" md="12" class="pb-0 px-0">
                  <v-file-input
                    class="im-form"
                    placeholder="เลือกไฟล์แบบฟอร์ม"
                    accept="application/JSON"
                    outlined
                    dense
                    color="#67C25D"
                    hide-details
                ></v-file-input>
              </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions >
          <v-row class="text-form">
            <v-spacer></v-spacer>
            <v-col  cols="auto" lg="auto" md="auto">
          <v-btn color="#67C25D" dark depressed class="front-form">
            นำเข้า
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
        dialog: false
    }),
    mounted() {
        EventBus.$on('importform',this.importforms)
    },
    methods: {
        importforms() {
            this.dialog = true
        }
    }
  }
</script>
<style>
.text-form {
    width: 100%;
    margin: 0% !important;
  }
.front-form {
    font-family: 'Sarabun', sans-serif;
  }
.im-form{
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  } 
.front-section {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }   
</style>