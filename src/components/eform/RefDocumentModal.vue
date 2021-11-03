<template>
    <v-dialog scrollable persistent max-width="600" v-model="dialog_ref_doc">
      <v-card>
        <v-card-title elevation="4" class="dialog_title">
          <b>{{ textLang.ref_doc_title }}</b>
        </v-card-title>
        <v-card-text v-if="refDocData.length > 0" class="px-10 pt-7">
          <ol>
            <li v-for="item in refDocData" :key="item" class="pl-3 mb-4 each-ref-doc-block">
              <span class="each-ref-doc" @click="getPdfFromDoc(item)">{{item}}</span>
            </li>
          </ol>
        </v-card-text>

        <v-card-text v-else-if="refDocData.length == 0" class="pt-7 not-attach-files-font">
				  <v-icon color="#ff8f00" class="no-step-icon not-attach-files">mdi-alert-circle</v-icon>{{ textLang.not_files }}
			  </v-card-text>

        <v-divider class="mx-10"></v-divider>
        <v-card-actions class="pt-8 pb-8">
          <v-spacer></v-spacer>
          <v-btn outlined dark large color="#979797" class="px-12 save-setting-btn" @click="dialog_ref_doc = false">{{ textLang.cancel }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  import { EventBus } from '../../EventBus'

  export default {
    computed: {
      textLang() {
        return this.$store.getters.textLang.components.RefDocumentModal
      }
    },
    data: () => ({
      dialog_ref_doc: false,
      refDocData: [],
      //Color Variable
      colorObject: {
        toolbar: {
          toolbar_bg_color1: '#C2EB81',
          toolbar_bg_color2: '#A1E9C0',
          toolbar_font_color: '#0E3852',
          menu_select_hover_color: '#E6F3CB'
        },
        modal: {
          modal_main_color: '#2ACA9F',
          modal_sub_color: '#97E2E7',
        },
        main_color: '#1b9900'
      }
    }),
    mounted() {
      EventBus.$on('openReferenceDocument', this.openReferenceDoc)
      // this.changeColor()
    },
    methods: {
      openReferenceDoc(refDoc) {
        this.refDocData = refDoc
        this.changeLange()
        this.dialog_ref_doc = true
      },
      changeColor() {
        this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
      },
      changeLange() {
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
				  this.textLang = lang_th.components.RefDocumentModal
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.RefDocumentModal
        }
      },
      async getPdfFromDoc(docId) {
        try {
          var { data } = await this.axios.get(this.$api + '/pdf_from_doc_number?doc_number_eform=' + docId,
          {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
            }
          })
          if(data.result == "OK") {
            window.open(data.messageText[0].url_view_pdf)
          } else {
            this.$swal({
              type: 'error',
              html: '<span class="alert-error"><b>'+ this.textLang.no_pdf +'</b></span>',
              showCloseButton: true,
              showConfirmButton: false,
              background: 'white',
              customClass:{
                popup: 'border-error'
              },
              position: 'top',
              timer: 3000,
              backdrop: false,
              closeButtonHtml: '<span class="close-alert-error">&times;</span>'
            })
          }
        } catch (error) {
          console.log(error.message)
        }
      },
    }
  }
</script>

<style>
  .each-ref-doc-block {
    font-family: 'Sarabun', sans-serif;
		font-size: 16px;
		color: black;
  }

  .each-ref-doc {
    font-family: 'Sarabun', sans-serif;
		font-size: 16px;
		color: black;
  }

  .each-ref-doc:hover {
    text-decoration: underline;
    color: #2ACA9F;
    cursor: pointer;
  }
</style>

