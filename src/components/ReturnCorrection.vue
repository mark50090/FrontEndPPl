<template>
      <v-dialog
      v-model="dialog"
      max-width="300"
      persistent
      >
      <v-card>
        <v-card-title>
          <v-row align="center" class="text-box-return">
            <span class="font-head-return">{{ textLang.text_head_return }}</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false" color="black">
              <v-icon>
                mdi-close-circle
              </v-icon> 
            </v-btn>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-row align="center" class="text-box-return">
              <v-col class="pa-0" cols="12" lg="12" md="12">
                <v-select color="#4caf50" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }"
                class="font-box-select fontin icon-select fontin-select"
                  :label="textLang.num_return"
                  dense
                  outlined
                  hide-details
                  v-model="selected_order"
                  :items="revertable_order"
                  item-text="text"
                  item-value="value"
                ></v-select>
              </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-row class="text-box-return">
            <v-spacer></v-spacer>
            <v-col class="pa-0" cols="auto" lg="auto" md="auto">
          <v-btn color="#67C25D" dark depressed class="font-send-return" @click="revertTransaction">
            {{ textLang.recorrection }}
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
        return this.$store.getters.textLang.components.ReturnCorrection
      }
    },
    data: () => ({
      dialog: false,
      transaction_id: '',
      revertable_order: [],
      selected_order: '',
    }),
    mounted() {
      EventBus.$on('FormReturn',this.getFormReturn)
    },
    beforeDestroy(){
      EventBus.$off('FormReturn')
    },
    methods: {
      getFormReturn(data){
        this.dialog = true
        this.revertable_order = []
        this.transaction_id = data.transaction_id
        var detail = data.flow_step?data.flow_step:data.transaction_detail.flow_data
        detail.forEach((element,index) => {
          if(element.status == 'Y')
          this.revertable_order.push({text: this.textLang.return_revertable_no + (index+1),value: index, name: element.name})
        });
      },
      async revertTransaction(){
        try {
          var { data } = await this.axios.put(this.$api_url + `/transaction/api/v1/returntoedit?transaction_id=${this.transaction_id}`, {
            step_index: this.selected_order
          })
          if(data.status){
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.return_succeed + '</strong>',
              text: this.textLang.return_file_success,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 5000,
              customClass: {
              popup: 'alert-card',
              title: 'alert-title-block',
              closeButton: 'close-alert-btn',
              htmlContainer: 'alert-text-block'
              }
            })
          }else{
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.return_error + '</strong>',
              text: this.textLang.return_file_fail,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 5000,
              customClass: {
              popup: 'alert-card',
              title: 'alert-title-block',
              closeButton: 'close-alert-btn',
              htmlContainer: 'alert-text-block'
              }
            })
          }
        } catch (error) {
          console.log(error);
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.return_error + '</strong>',
            text: this.textLang.return_file_fail,
            showCloseButton: true,
            showConfirmButton: false,
            timer: 5000,
            customClass: {
            popup: 'alert-card',
            title: 'alert-title-block',
            closeButton: 'close-alert-btn',
            htmlContainer: 'alert-text-block'
            }
          })
        }
        this.dialog = false
        this.$router.push('/inbox')
      }
    }
  }
</script>

<style>
  .fontin-select .v-label {
    font-size: 13px !important;
  }
  .icon-select .v-icon.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
  }
  .fontin .v-select__selections {
    line-height: 22px !important;
  }
  .text-box-return {
    width: 100%;
    margin: 0% !important;
  }
  .font-head-return {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }
  .font-box-select{
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }
  .font-send-return {
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
  }
</style>