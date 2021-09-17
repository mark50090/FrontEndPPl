<template>
      <v-dialog v-model="dialogSign" persistent max-width="500px">
        <v-card>
          <v-card-title elevation="4" class="dialog_title">
            <span><b>{{ textLang.sign_approve }}</b></span>
          </v-card-title>
          <v-card-text class="px-0 pt-5 pb-3">
            <v-row justify="center" class="sign-opt-row">
              <v-col md="4" lg="4" cols="12" align-self="center" class="px-0 pt-0">
                <v-switch readonly inset dense hide-details :color="color_ca_switch" :disabled="false" class="mt-0 ca-block" v-model="isCa">
                  <template v-slot:label>
                    <span class="switch-ca-modal">Certificate (CA)</span>
                  </template>
                </v-switch>
              </v-col>
              <v-col md="3" lg="3" cols="6" align-self="center" class="px-0 sign-opt-block"> <!-- option of sign -->
                <v-select outlined dense hide-details append-icon="mdi-chevron-down" :disabled="false" :color="color_sign_option_box" v-model="selectedSignStyle" :item-color="color_sign_option_box" :items="option_style" class="business-box-inside icon-dropdown-modal sign-opt"></v-select>
              </v-col>
            </v-row>
            <v-row justify="center" class="mt-1 sign-opt-row">
              <v-col v-if="selectedSignStyle == 'Sign Pad'" md="9" lg="9" cols="10" class="pa-0"> <!-- sign pad -->
                <VueSignaturePad height="188px" ref="signaturePad" :options="{onBegin, onEnd, penColor: '#0D269A'}" class="sign-pad-box" />
              </v-col>
              <v-col v-if="selectedSignStyle == 'Default'" md="9" lg="9" cols="10" class="pa-0 sign-img-box"> 
                <v-img contain max-height="186px" :src="signUrl"></v-img>
              </v-col>
            </v-row>
            <v-row justify="center" align="center" class="sign-opt-row">
              <v-col md="7" lg="7" cols="8" class="px-0">
                <v-btn block depressed :color="color_approve_btn" :disabled="false" class="approve-button" @click="summitSign()">{{ textLang.approve }}</v-btn>
                <v-btn block depressed v-if="false" color="error" :disabled="false" class="mt-2 approve-button" @click="rejectSign()">{{ textLang.reject_approval }}</v-btn>
              </v-col>
              <v-col md="2" lg="2" cols="2" class="py-0 pr-0"> <!-- eraser button for erasing sign -->
                <v-btn block depressed :color="color_eraser_btn" :disabled="false" class="eraser-button" @click="clearSign()"><v-icon color="white">mdi-eraser</v-icon></v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pb-8">
            <v-spacer></v-spacer>
            <v-btn outlined large color="#979797" class="px-12 save-setting-btn" @click="closeSignpad">{{ textLang.cancel }}</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
</template>

<script>
import { EventBus } from '../../EventBus'
export default {
  data: () => ({
    dialogSign: false,
    option_style: ['Default', 'Sign Pad'],
    selectedSignStyle: 'Default',
    signUrl: "",
    isCa: true,
    signOnly: false,
    buttonClicked: false,
    noFlowSign: false,
    textLang: {
      sign_approve: "ลงนามอนุมัติ",
      reject_approval: "ปฏิเสธอนุมัติ",
      approve: "ลงนามอนุมัติ",
      cancel: "ยกเลิก"
    },
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
    this.changeLange()
    // this.changeColor()
  },
   beforeDestroy() {
    EventBus.$off('changeLang')
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
    openSignpad(isNoFlow) {
      this.noFlowSign = isNoFlow
      this.dialogSign = true
      this.signUrl = sessionStorage.getItem("sign_url")
      this.isCa = !(sessionStorage.getItem('signOnlyStep') == 'true')
      if(this.noFlowSign) {
        this.isCa = false
      }
      if(!this.signUrl) {
        this.selectedSignStyle = 'Sign Pad'
        this.option_style.splice(0,1)
      }
      this.$nextTick(() => {
        if(typeof this.$refs.signaturePad !== 'undefined') {
          this.$refs.signaturePad.resizeCanvas()
        }
      })
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
          var isNoFlow = this.noFlowSign
          EventBus.$emit('saveSign',sign64, isNoFlow)
          this.dialogSign = false
        }
      } else {
        var isNoFlow = this.noFlowSign
        EventBus.$emit('saveSign',sign64, isNoFlow)
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
.sign-opt-row {
  width: 100%;
  margin-left: 0%;
}

.switch-ca-modal {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
}

.icon-dropdown-modal .theme--light.v-icon {
  color: #2ACA9F !important;
}

.sign-opt-block {
  margin-left: 5%;
}

.sign-opt {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
}

.sign-pad-box {
  border: 1px solid lightgray;
  border-radius: 4px;
}

.sign-img-box {
  border: 1px solid lightgray;
  border-radius: 4px;
  height: 188px;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.approve-button {
  font-family: 'Sarabun', sans-serif;
  color: white !important;
  text-transform: capitalize !important;
}

.eraser-button {
  height: 80px !important;
}

/*========================================*/

@media only screen and (max-width:960px){ /*css for mobile screen*/
  .ca-block {
    justify-content: center;
  }

  .sign-opt-block {
    margin-left: 0%;
  }
}
</style>
