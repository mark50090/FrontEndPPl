<template>
    <v-dialog v-model="dialog" persistent max-width="450">
       <v-card>
        <v-card-title>
          <v-row class="text-form">
            <span class="front-section">{{ textLang.import_file }}</span>
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
                    :placeholder="textLang.select_file"
                    accept="application/JSON"
                    outlined
                    dense
                    color="#67C25D"
                    hide-details
                    v-model="file"
                ></v-file-input>
              </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions >
          <v-row class="text-form">
            <v-spacer></v-spacer>
            <v-col  cols="auto" lg="auto" md="auto">
          <v-btn color="#67C25D" dark depressed class="front-form" @click="importJson()">
            {{ textLang.import_form }}
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
        return this.$store.getters.textLang.components.ImportForm
      }
    },
    data: () => ({
        dialog: false,
        file: [],
    }),
    mounted() {
        EventBus.$on('importform',this.importforms)
    },
    methods: {
        importforms() {
            this.dialog = true
        },
        async importJson() {
          let formData = new FormData()
          var business = ""
          if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
            business = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          }
          formData.append('file', this.file)
          formData.append('tax_id', business)
          try {
            var { data } = await this.axios.post(this.$api_url + '/template_form/api/v1/jsonImport',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
              }
            })
            if(data.status) {
              this.file = []
              this.dialog = false
              let tempOption = {
                template_id: data.data.template_id,
              }
              sessionStorage.setItem('option',JSON.stringify(tempOption))
              sessionStorage.setItem('page_action', 'edit')
              this.$router.push({ 'path': '/template/create_template'})
            }
          } catch (error) {
            console.log(error.message)
          }
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