<template>
      <v-dialog
        v-model="dialog"
        fullscreen
        scrollable
      >
        <v-card tile  color="rgb(82, 86, 89)">
            <v-card-title class="pa-0 pdf-showpdfbar">
              <v-row class="detail-showpdf" align="center">
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pr-2 pl-2 py-0 front-namepdf" >
                  <span >Page</span>
                </v-col>
                <v-col cols="5" md="2" lg="2" align-self="center" class="pr-0 pl-3 py-0 front-namepdf" >  
                  <v-btn icon x-small color="white" >
                    <v-icon size="24">mdi-arrow-left</v-icon>
                  </v-btn> 
                  <span class="mx-3">300 / 300</span>
                  <v-btn icon x-small color="white">
                    <v-icon size="24">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>   
                
                <v-col cols="4" md="7" lg="7" align-self="center" class=" py-0 text-center">
                  <v-btn icon color="white"  >
                    <v-icon large>
                      mdi-magnify-minus-outline
                    </v-icon> 
                    </v-btn>
                  <v-btn icon  color="white" class="ml-3">
                    <v-icon large >
                      mdi-magnify-plus-outline
                    </v-icon> 
                    </v-btn>
                </v-col>
                <v-spacer class="display-pc-only"> </v-spacer>
                <v-col cols="1" md="2" lg="2" align-self="center" class="py-0 pl-1 pr-3 text-right" > 
                  <v-btn icon @click="dialog = false" color="white">
                    <v-icon size="24">
                      mdi-close
                    </v-icon> 
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="px-1 pb-3">
              <v-row align="center" justify="center" class="pt-3 detail-row b-pdf ">
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
        EventBus.$on('showpdf',this.pdfshow)
    },
    methods: {
        pdfshow() {
            this.dialog = true
        }
    }
  }
</script> 
<style>
.detail-showpdf {
    width: 100%;
    margin: 0% !important;
  }
.pdf-showpdfbar {
    background: rgb(50, 54, 57);
    height: 48px;
  }
.front-namepdf {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: white;
  }

</style>
