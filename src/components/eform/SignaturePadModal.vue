<template>
      <v-dialog v-model="dialogSign" persistent max-width="360px">
        <v-card>
          <v-card-title>
            <span class="sign-modal-header">{{ textLang.sign_approve }}</span>
            <v-spacer></v-spacer>
            <v-btn icon dark small color="black" @click="closeSignpad">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-row justify="center" class="sign-opt-row">
              <v-col md="auto" lg="auto" cols="auto" align-self="center" class="pl-0 ">
                <v-switch inset hide-details color="primary" disabled class="mt-0" v-model="isCa">
                  <template v-slot:label>
                    <span class="switch-ca-modal">Certificate (CA)</span>
                  </template>
                </v-switch>
              </v-col>
              <v-spacer></v-spacer>
              <v-col md="5" lg="5" cols="5" align-self="center" class="px-0"> <!-- option of sign -->
                <v-select outlined dense hide-details append-icon="mdi-chevron-down" color="#4CAF50" v-model="selectedSignStyle" item-color="#4CAF50" :items="option_style" class="sign-opt sign-pad-dropdown-icon"></v-select>
              </v-col>
            </v-row>
            <v-row justify="center" class="mt-1 sign-opt-row">
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pa-0 sign-block-form">
                <VueSignaturePad v-if="selectedSignStyle == 'Sign Pad'" height="175px" ref="signaturePad" :options="{onBegin, onEnd, penColor: '#0D269A'}" />
                <v-img v-else contain max-height="173px" :src="currentBase"></v-img>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pb-1">
            <v-row class="sign-opt-row">
              <v-spacer></v-spacer>
              <v-col cols="auto" class="pl-0 pr-2">
                <v-btn depressed color="#757575" :disabled="selectedSignStyle != 'Sign Pad'" @click="clearSign()" class="approve-button">{{ textLang.clear_button }}</v-btn>
              </v-col>
              <v-col cols="auto" class="pl-0 pr-3">
                <v-btn depressed dark color="#67C25D" @click="summitSign()" class="approve-button">{{ textLang.approve }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
</template>

<script>
import { EventBus } from '../../EventBus'
export default {
  computed: {
    textLang() {
      return this.$store.getters.textLang.components.SignaturePadModal
    }
  },
  data: () => ({
    dialogSign: false,
    option_style: ['Sign Pad'],
    selectedSignStyle: 'Sign Pad',
    signUrl: "",
    currentBase: "",
    isCa: true,
    signOnly: false,
    buttonClicked: false,
    noFlowSign: false,
    //Color Variable
    // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
    color_ca_switch: '#2ACA9F',
    color_sign_option_box: '#2ACA9F',
    // color_modal_dropdown_icon: '#2ACA9F !important', //class icon-dropdown-modal
    color_approve_btn: '#2ACA9F',
    color_eraser_btn: '#97E2E7',
    colorObject: {
      toolbar: {
  				toolbar_bg_color1: '#C2EB81',
  				toolbar_bg_color2: '#A1E9C0',
  				toolbar_font_color: '#0E3852',
  				menu_select_hover_color: '#E6F3CB'
 			},
 			modal: {
  				modal_main_color: '#2ACA9F',
  				modal_sub_color: '#97E2E7'
 			},
 			main_color: '#1b9900'
    }
  }),
  mounted() {
    EventBus.$on('openSignPad',this.openSignpad)
    EventBus.$on('changeLang', this.changeLange)
    // this.changeLange()
    // this.changeColor()
  },
   beforeDestroy() {
    EventBus.$off('changeLang')
    EventBus.$off('openSignPad')
  },
  watch: {
    selectedSignStyle(val) {
      if(val) {
        this.getSignBase()
      }
      
    }
  },
  methods: {
    changeColor() {
      this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
      // this.color_dialog_header_bg = this.colorObject.modal.modal_main_color
      // $('.dialog_title').css('background-color', this.color_dialog_header_bg)
      this.color_ca_switch = this.colorObject.modal.modal_main_color
      this.color_sign_option_box = this.colorObject.modal.modal_main_color
      // this.color_modal_dropdown_icon = this.colorObject.modal.modal_main_color + '!important'
      // $('.icon-dropdown-modal .theme--light.v-icon').css('color', this.color_modal_dropdown_icon)
      this.color_approve_btn = this.colorObject.modal.modal_main_color
      this.color_eraser_btn = this.colorObject.modal.modal_sub_color
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.components.SignaturePadModal
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.components.SignaturePadModal
      }
    },
    openSignpad() {
      this.dialogSign = true
      this.isCa = false
      this.option_style = ['Sign Pad']
      this.currentBase = ""
      this.getAllSign()
      this.$nextTick(() => {
        if(typeof this.$refs.signaturePad !== 'undefined') {
          this.$refs.signaturePad.resizeCanvas()
        }
      })
    },
    async getAllSign () {
      const url = '/user_setting/api/v1/get_stamp_name_list'
      const config = {
        Authorization: `Bearer ${this.token}`
      }
      this.axios.get(`${this.$api_url}${url}`, config)
        .then((response) => {
          const data = response.data
          if (data.status) {
            if(data.data.length) {
              this.option_style = []
              data.data.forEach(e => {
                this.option_style.push(e)
              })
              this.option_style.push('Sign Pad')
              this.selectedSignStyle = this.option_style[0]
            }
          } else {
            this.option_style = ['Sign Pad']
          }
        }
        )
        .catch((error) => {
          if (error.response) {
            this.option_style = ['Sign Pad']
          }
        })
    },
    async getSignBase () {
      if(this.selectedSignStyle != 'Sign Pad') {
        const url = '/user_setting/api/v1/get_stamp_base64'
        const config = {
          Authorization: `Bearer ${this.token}`,
          params: {
            StampName: this.selectedSignStyle
          }
        }
        this.axios.get(`${this.$api_url}${url}`, config)
          .then((response) => {
            const data = response.data
            if (data.status) {
              this.currentBase = data.data
            }
          })
          .catch((error) => {
            if (error.response) {
              this.selectedSignStyle = 'Sign Pad'
            }
          })
      }
    },
    undoSign() {
      if(typeof this.$refs.signaturePad !== 'undefined') {
        this.$refs.signaturePad.undoSignature()
      }
    },
    closeSignpad() {
      if(typeof this.$refs.signaturePad !== 'undefined') {
        this.$refs.signaturePad.clearSignature()
      }
      EventBus.$emit('cancelSign')
      this.dialogSign = false
    },
    clearSign() {
      if(typeof this.$refs.signaturePad !== 'undefined') {
        this.$refs.signaturePad.clearSignature()
      }
    },
    summitSign() {
      this.buttonClicked = true
      var sign64 = ""
      if(this.selectedSignStyle == 'Sign Pad') {
        const { data } = this.$refs.signaturePad.saveSignature()
        if(data) {
          sign64 = data
          // var isNoFlow = this.noFlowSign
          EventBus.$emit('saveSign',sign64)
          this.dialogSign = false
        }
      } else {
        EventBus.$emit('saveSign',this.currentBase)
        this.dialogSign = false
      }
    },
    rejectSign() {
      if(typeof this.$refs.signaturePad !== 'undefined') {
        this.$refs.signaturePad.clearSignature()
      }
    },
    onBegin(){
      if(this.selectedSignStyle == 'Sign Pad') {
        if(typeof this.$refs.signaturePad !== 'undefined') {
          this.$refs.signaturePad.resizeCanvas()
        }
      } 
    },
    onEnd(){
      
    }
  }
};
</script>

<style>
.sign-modal-header {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
}

.sign-opt-row {
  width: 100%;
  margin: 0%;
}

.switch-ca-modal {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
}

.icon-dropdown-modal .theme--light.v-icon {
  color: #2ACA9F !important;
}

.sign-opt {
  font-family: 'Sarabun', sans-serif;
  font-size: 13px;
}

.sign-pad-dropdown-icon .theme--light.v-icon {
  color: rgba(0, 0, 0, 0.54) !important;
}

.sign-block-form {
  width: 300px;
  height: 175px;
  border: 1.2px dashed grey;
  border-radius: 4px;
  background-color: #f5f5f5;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}

.approve-button {
  font-family: 'Sarabun', sans-serif;
  color: white !important;
  text-transform: capitalize !important;
}
</style>
