<template>
      <v-dialog
      v-model="dialog"
      max-width="400"
      scrollable
      persistent
      >
      <v-card>
        <v-card-title>
          <v-row class="text-box">
            <span class="front-th">Send Email</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false" color="#0000008A">
              <v-icon>
                mdi-close-circle
              </v-icon> 
            </v-btn>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-3">
          <v-row class="text-box">
            <v-col class="pb-1 px-0 pt-0" cols="8" lg="8" md="8">
              <v-text-field
              class="front-box"
                placeholder="อีเมลผู้รับ"
                outlined
                dense
                hide-details
                color="#67C25D"
              ></v-text-field>
            </v-col>
            <v-col align-self="center" class="pb-1 pr-1 pl-2 pt-0" cols="auto" lg="auto" md="auto">
              <v-btn icon outlined fab color="#67C25D" x-small>
                <v-icon>
                  mdi-minus
                </v-icon>
              </v-btn>
              </v-col>
              <v-col align-self="center" class="pb-1 pr-1 pl-2 pt-0" cols="auto" lg="auto" md="auto">
              <v-btn dark depressed fab color="#67C25D" x-small>
                <v-icon>
                  mdi-plus</v-icon>
                </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row class="text-box">
            <v-spacer></v-spacer>
            <v-col class="py-1" cols="auto" lg="auto" md="auto">
          <v-btn color="#67C25D" dark depressed class="front-send">
            ส่งอีเมล
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
      reveal: false,
    }),
    mounted() {
      EventBus.$on('FormMail',this.getFromMail)
    },
    methods: {
      getFromMail(){
        this.dialog = true
      }
    }
  }
</script>

<style>
  .text-box {
    width: 100%;
    margin: 0% !important;
  }
  .front-th {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }
  .front-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }
  .front-send {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }
</style>