<template>
  <v-container>
	<v-dialog v-model="dialog_attach_file" scrollable persistent max-width="600">
	  <v-card>
		 <v-card-title elevation="4" class="dialog_title">
			 <b>{{ textLang.files }}</b>
		</v-card-title>
			<v-card-text v-if="files.length > 0" class="pl-8 pr-3 pt-5 attachfile-content">
				<v-row class="row-list-all" justify="end">
					<v-btn depressed dark :color="color_btn_download_all" class="btn-download-all" @click="fileDownloadAll()">{{ textLang.download_all }}</v-btn>
				</v-row>
				<br/>
				<ol>
					<li class="mb-5" v-for="item in files" :key="item.file_id">
						<v-row align="center" class="row-list">
							<v-col cols="12" md="8" lg="8" class="px-0">{{item.file_name}}</v-col>
							<v-spacer></v-spacer> 
							<!-- <v-icon class="mr-2">mdi-eye-outline</v-icon> -->
							<v-btn v-show="!item.waitUpload" depressed dark :color="color_btn_download" class="btn-download" @click="fileDownload(item)">{{ textLang.download }}</v-btn>
						</v-row>
					</li>
				</ol>
			</v-card-text>
			
		  <v-card-text v-else-if="files.length == 0" class="pt-5 not-attach-files-font">
				<v-icon color="#ff8f00" class="no-step-icon not-attach-files">mdi-alert-circle</v-icon>{{ textLang.not_files }}
			</v-card-text>

			<v-divider class="mx-10"></v-divider>

			<v-card-actions class="pt-8 pb-8">
				<v-spacer></v-spacer>
				<v-btn outlined dark large color="#979797" class="px-12 mr-4 save-setting-btn" @click="dialog_attach_file = false">{{ textLang.cancel }}</v-btn>
				<v-spacer></v-spacer>
			</v-card-actions>
	  </v-card>
	</v-dialog>
  </v-container>
</template>

<script>
 import { EventBus } from '../../EventBus'

 export default {
  data: () => ({
		dialog_attach_file: false,
		textLang :{
			 files: "รายการเอกสารแนบ",
			 not_files: "ไม่มีรายการเอกสารแนบ",
			 cancel: "ยกเลิก",
			 download_all: "ดาวน์โหลดเอกสารทั้งหมด",
			 download: "ดาวน์โหลดเอกสาร",
		},
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
		changeColor() {
			this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
			this.color_btn_download = this.colorObject.modal.modal_main_color
			this.color_btn_download_all = this.colorObject.modal.modal_sub_color
    },
		startAttachFileModal(folderAttach) {
			this.files = folderAttach
			this.changeLange()
			this.dialog_attach_file = true
		},
		fileDownload(file) {
			window.open(this.$api + "/attract_file/download/" + file.file_id)
		},
		fileDownloadAll() {
			this.files.forEach(e => {
				if(!e.waitUpload) {
					window.open(this.$api + "/attract_file/download/" + e.file_id)
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

	.not-attach-files{
		font-size: 30px !important;
	}
  
  .row-list{
	  width: 100%;
	  margin-left: 0%;
  }

  .row-list-all{
	  width: 100%;
	  margin-left: 0%;
  }
  
	.btn-download-all{
		text-transform: capitalize;
	}

	.btn-download{
		text-transform: capitalize;
	}

  @media only screen and (max-width: 960px) {
	  .btn-download{
		  margin: auto;
	  }
  }
</style>