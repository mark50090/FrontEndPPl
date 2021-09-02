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
                  <span>{{ name }}</span>
                </v-col>
                
                <v-col v-if="type == 'pdf'" cols="5" md="4" lg="4" align-self="center" class="px-0 py-1 text-center">
                  <v-btn icon color="white" @click="change_page_fn('prev')">
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>
                  <span class="mx-1 pdf-attpage">{{ page }} / {{ page_count }}</span>
                  <v-btn icon color="white" @click="change_page_fn('next')">
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>
                <v-spacer class="display-pc-only"></v-spacer>
                <v-col cols="1" md="auto" lg="auto" align-self="center" class="py-1 text-right">
                  <v-btn icon color="white" @click="rotate_fn">
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
                  <v-img
                    v-if="type == 'jpg'"
                    :src="file"
                    height="100%"
                    :style="{ transform : `rotate(${rotate}deg)` ,transition: '0.5s' }"
                  />
                  <pdf
                    v-if="type == 'pdf'"
                    id="pdfDiv"
                    :style="{ transform : `rotate(${rotate}deg)` ,transition: '0.5s', width: '50%'}"
                    :src="file"
                    @num-pages="page_count = $event"
                    :page="page"
                    ref="pdfComponent"
                  />
              </v-row>
            </v-card-text>
          </v-card>
      </v-dialog>
</template>

<script>
import { EventBus } from '../EventBus'
import pdf from 'vue-pdf'
  export default {
    components:{
      pdf
    },
    data: () => ({
      dialog: false,
      file: null,
      type: null,
      name: null,
      rotate: 0,
      page_count: 0,
      page: 1
    }),
    mounted() {
      EventBus.$on('FormFile', this.getFormFile)
    },
    methods: {
      getFormFile(file, type, name) {
        var self = this
        this.dialog = true
        this.type = type
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function () {
          self.file = reader.result
        }
        this.name = name
        this.rotate = 0
        this.page = 1
      },
      rotate_fn() {
        this.rotate += 90
      },
      change_page_fn(type) {
      switch (type) {
        case 'next':
          if(this.page < this.page_count)
            this.page++
          break
        case 'prev':
          if(this.page > 1)
            this.page--
          break
      }
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