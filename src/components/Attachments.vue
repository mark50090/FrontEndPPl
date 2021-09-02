<template>
      <v-dialog
        v-model="dialog"
        fullscreen
        scrollable
      >
        <v-card tile elevation="0" color="rgb(82, 86, 89)">
            <v-card-title class="pa-0 pdf-attbar">
              <v-row align="center" class="detail-row">
                <v-col cols="4" md="4" lg="4" align-self="center" class="pr-0 py-1 pl-5 pdf-attfrontname text-truncate">
                  <span>TESTabcdefg.pdf</span>
                </v-col>
                
                <v-col cols="5" md="4" lg="4" align-self="center" class="px-0 py-1 text-center">
                  <v-btn icon color="white">
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>
                  <span class="mx-1 pdf-attpage">30 / 30</span>
                  <v-btn icon color="white">
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>
                <v-spacer class="display-pc-only"></v-spacer>
                <v-col cols="1" md="auto" lg="auto" align-self="center" class="py-1 text-right">
                  <v-btn icon color="white">
                    <v-icon>
                      mdi-rotate-right
                    </v-icon>
                  </v-btn>
                </v-col>
                  <v-col cols="1" md="auto" lg="auto" align-self="center" class="py-1 text-right">
                  <v-btn icon @click="dialog = false" color="white">
                    <v-icon>
                      mdi-close
                    </v-icon> 
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="px-1 pb-2">
              <v-row align="center" justify="center" class="pt-2 prescribe-row">
                <!-- pdf -->
              </v-row>
            </v-card-text>
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
      EventBus.$on('FormFile',this.getFormFile)
    },
    methods: {
      getFormFile(){
        this.dialog = true
      }
    }
  }
</script>

<style>
.prescribe-row {
    width: 100%;
    margin: 0% !important;
  }
.pdf-attpage {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: white;
  }
  .pdf-attbar {
    background: rgb(50, 54, 57);
    height: 48px;
  }
  .pdf-attfrontname {
    font-family: 'Sarabun', sans-serif;
    font-size: 12px;
    color: white;
  }
</style>