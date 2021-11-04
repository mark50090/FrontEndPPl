<template>
	<v-dialog v-model="dialog_attach_file" scrollable persistent max-width="600">
	  <v-card>
			<v-card-title class="py-2 attach-file-header-modal">
				{{ textLang.files }}
			</v-card-title>
			<v-card-text v-if="files.length > 0" class="pt-4 pb-4">
				<v-row class="row-list-all" justify="end">
					<v-btn depressed dark color="#67c25d" class="btn-download-all" @click="fileDownloadAll()">{{ textLang.download_all }}</v-btn>
				</v-row>
				<br/>
				<ol class="attachfile-content">
					<li v-for="item in files" :key="item.file_id">
						<v-row class="row-list">
							<v-col cols="8" md="10" lg="10" class="pl-2 pr-0">{{item.filename}}</v-col>
							<v-spacer></v-spacer> 
							<!-- <v-icon class="mr-2">mdi-eye-outline</v-icon> -->
							<v-col v-show="!item.waitUpload" cols="auto" md="auto" lg="auto" class="pr-0 pt-2">
								<v-btn  icon color="#67c25d" @click="fileDownload(item)">
									<v-icon>mdi-download</v-icon>
								</v-btn>
							</v-col>
							<!-- <v-col cols="auto" md="auto" lg="auto" class="pr-0 pl-0 pt-2">
								<v-btn  icon color="#67c25d" @click="optionFormDeleteAttach()">
									<v-icon>mdi-delete</v-icon>
								</v-btn>
							</v-col> -->
						</v-row>
					</li>
				</ol>
			</v-card-text>
			
		  <v-card-text v-else-if="files.length == 0" class="pt-5 pb-4 not-attach-files-font">
				<v-icon color="#ff8f00" class="mr-2 mb-2">mdi-alert-circle</v-icon>{{ textLang.not_files }}
			</v-card-text>

			<v-divider class="mx-6"></v-divider>

			<v-card-actions class="py-5">
				<v-spacer></v-spacer>
				<v-btn outlined color="#4CAF50" class="px-12 cancel-attach-file-btn" @click="dialog_attach_file = false">{{ textLang.cancel }}</v-btn>
				<v-spacer></v-spacer>
			</v-card-actions>
	  </v-card>
		<showFormDeleteAttach/>
	</v-dialog>
</template>

<script>
 import { EventBus } from '../../EventBus'
 import showFormDeleteAttach from '../ConfirmDeleteAttachFileModal.vue'

 export default {
  computed: {
    textLang() {
        return this.$store.getters.textLang.components.AttachFileModal
    }
  },
  data: () => ({
		dialog_attach_file: false,
		files:[],

		//Color Variable
		// color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
		color_btn_download: '#2ACA9F',
		color_btn_download_all: '#97E2E7',
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
  components: {
	  showFormDeleteAttach
  },
  mounted() {
		EventBus.$on('openAttachFile',this.startAttachFileModal)
		EventBus.$on('changeLang', this.changeLange)
		// this.changeColor()
  },
  beforeDestroy() {
		EventBus.$off('openAttachFile')
    EventBus.$off('changeLang')
  },
  methods: {
	  	optionFormDeleteAttach() {
			  EventBus.$emit('FormDeleteAttach')
		  },
		changeColor() {
			this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
			this.color_btn_download = this.colorObject.modal.modal_main_color
			this.color_btn_download_all = this.colorObject.modal.modal_sub_color
    	},
		startAttachFileModal(folderAttach) {
			folderAttach.forEach(e => {
				if(!e.filename) {
					e.filename = e.file_name
				}
			})
			this.files = folderAttach
			// this.changeLange()
			this.dialog_attach_file = true
		},
		fileDownload(file) {
			window.open(`${this.$api_url}/file-component/api/downloadFile?file_id=${file.file_id}`)
		},
		fileDownloadAll() {
			this.files.forEach(e => {
				if(!e.waitUpload) {
					window.open(`${this.$api_url}/file-component/api/downloadFile?file_id=${e.file_id}`)
				}
			})
		},
		changeLange() {
			if(sessionStorage.getItem('page_lang') == 'th') {
				var lang_th = require('@/components/lauguage/lang_th.json')
				this.textLang = lang_th.components.AttachFileModal
			} else if(sessionStorage.getItem('page_lang') == 'en') {
				var lang_en = require('@/components/lauguage/lang_en.json')
				this.textLang = lang_en.components.AttachFileModal
			}
		},
	}
}
</script>

<style>
	.attach-file-header-modal {
		font-family: "Sarabun", sans-serif;
    font-size: 16px !important;
    color: white;
    background-color: #67c25d;
	}

  .attachfile-content {
		font-family: 'Sarabun', sans-serif;
		font-size: 16px;
		color: black !important;
  }

	.not-attach-files-font{
		font-family: 'Sarabun', sans-serif;
		font-size: 16px;
		color: #ff8f00 !important;
		text-align: center;
	}
  
  .row-list{
	  width: 100%;
	  margin: 0%;
  }

  .row-list-all{
	  width: 100%;
	  margin: 0%;
  }
  
	.btn-download-all{
		text-transform: capitalize;
		font-family: 'Sarabun', sans-serif;
	}

	.cancel-attach-file-btn {
		font-family: 'Sarabun', sans-serif;
		text-transform: capitalize;
	}
</style>