<template>
    <v-dialog
      v-model="dialog"
      max-width="550"
      scrollable
      persistent
      >
      <v-card>
        <v-card-title>
          <v-row class="text-selectdocumentfile-box">
            <span class="front-selectdocumentfile-head">{{ textLang.font_head_selectdocumentfile }}</span>
            <v-spacer></v-spacer>
            <v-btn icon color="#0000008A" @click="dialog = false">
              <v-icon>
                mdi-close-circle
              </v-icon>
            </v-btn>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-3">
          <v-row class="text-selectdocumentfile-box">
            <v-col cols="8" md="9" lg="9" class="px-0 pt-2">
              <v-file-input dense outlined hide-details color="#67C25D" accept="application/pdf" truncate-length="55" :clearable="false"  
              :placeholder="textLang.select_selectdocumentfile" prepend-icon="" class="front-selectdocumentfile-textselect"> 
              </v-file-input>
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
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row class="text-selectdocumentfile-box">
            <v-spacer></v-spacer>
            <v-col align-self="center" class=" pr-1 pl-0" cols="4" lg="4" md="4">
              <v-btn block color="#757575" dark depressed outlined @click="dialog = false" class="front-selectdocumentfile-btn">
                {{ textLang.selectdocumentfile_cancel }}
              </v-btn>
            </v-col>
            <v-col align-self="center" class="pr-0 pl-1" cols="4" lg="4" md="4">
              <v-btn block color="#67C25D" dark depressed class="front-selectdocumentfile-btn">
                {{ textLang.selectdocumentfile_upload }}
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
    computed: {
      textLang() {
        return this.$store.getters.textLang.components.SelectDocumentFile
      }
    },
    data: () => ({
      dialog: false
    }),
    mounted() {
      EventBus.$on('FormSelectFile',this.getFromSelectFile)
    },
    methods: { 
        getFromSelectFile(){
            this.dialog = true
      },
    }
  }
</script>

<style>
  .text-selectdocumentfile-box {
    width: 100%;
    margin: 0% !important;
  }
  .front-selectdocumentfile-head {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }
  .front-selectdocumentfile-textselect {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }
  .front-selectdocumentfile-btn {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    text-transform: capitalize;
  }
</style>