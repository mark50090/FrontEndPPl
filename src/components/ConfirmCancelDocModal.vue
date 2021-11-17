<template>
    <v-dialog v-model="dialog" persistent max-width="500">
       <v-card>
            <v-card-text class="pt-7 px-7 pb-2">
                <v-row class="text-box-confirmcanceldoc" justify="center">
                    <span class="front-head-confirmcanceldoc">
                        {{ textLang.font_head_confirmcanceldoc1 }}{{ textTest }}{{ textLang.font_head_confirmcanceldoc2 }}
                    </span>    
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row class="text-box-confirmcanceldoc">
                    <v-spacer></v-spacer>
                    <v-col cols="4" md="4" lg="4" class="pr-1 pl-0">
                        <v-btn class="front-cancel-confirmcanceldoc" color="#757575" dark block depressed @click="dialog=false">
                            {{textLang.confirmcanceldoc_cancel}}
                        </v-btn>
                    </v-col> 
                    <v-col cols="4" md="4" lg="4" class="pr-0 pl-1">
                        <v-btn class="front-confirm-confirmcanceldoc" color="#67C25D" dark block depressed>
                            {{textLang.confirmcanceldoc_confirm}}
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
        return this.$store.getters.textLang.components.ConfirmCancelDocModal
      }
    },
    data: () => ({
        dialog: false,
        textTest: 'testcodedev.pdf'
    }),
    mounted() {
        EventBus.$on('FormConfirmCancelDoc',this.getConfirmCancelDoc)
    },
    methods: {
        getConfirmCancelDoc() {
            this.dialog = true
        }
    }
  }
</script>
<style>
.text-box-confirmcanceldoc {
    width: 100%;
    margin: 0% !important;
}
.front-head-confirmcanceldoc {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
}

.front-cancel-confirmcanceldoc {
  font-family: 'Sarabun', sans-serif;
  text-transform: capitalize;
}

.front-confirm-confirmcanceldoc {
    font-family: 'Sarabun', sans-serif;
}

</style>