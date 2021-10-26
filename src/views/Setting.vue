<template>
  <div class="pt-2 pl-2 pr-2" >
    <v-card outlined class="screen-height screen-height-mobile ">
      <v-card-title class ="h-heading py-3">
        <b>{{textLang.setgeneralinformation}}</b>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class ="h-heading pa-0">
        <v-row class="font-all">
          <v-col  cols="5" md="2" lg="2" class=" py-4 pl-4 all-font-color" align-self="center">
            {{textLang.name}}
          </v-col>
          <v-col class=" py-4 pr-2">
            <span class="all-font-color">{{firstnameTh}} {{lastnameTh}}</span>
            <span v-if="nameEng == true" class="font-light-color"> - {{firstnameEng}} {{lastnameEng}}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="font-all">
          <v-col cols="5" md="2" lg="2" class="py-4 pl-4 all-font-color">
            {{textLang.Username}}
          </v-col>
          <v-col class="all-font-color py-4 pr-2">
            {{username}}
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="font-all">
          <v-col cols="5" md="2" lg="2" class="py-4 pl-4 all-font-color">
            OneEmail
          </v-col>
          <v-col class="all-font-color py-4 pr-2">
            {{thai_email}}
          </v-col>
        </v-row>
        <!-- <v-divider></v-divider>
         <v-row class="font-all">
          <v-col cols="5" md="2" lg="2" class="py-4 pl-4 all-font-color" align-self="center">
            {{textLang.defaultsignature}}
          </v-col>
          <v-col cols="4" md="5" lg="5" align-self="center" class="py-4  all-font-color">
            <v-icon v-if="state_Signature == 'Not Found'" class="ic-status-point" size="16" color="#9e9e9e" >mdi-circle</v-icon> <!--FOR NOT FOUND default signature
            <v-icon v-if="state_Signature != 'Not Found'" size="16" class="ic-status-point" color="#8BC34A">mdi-circle</v-icon>  <!--FOR default signature is READY
            {{state_Signature}} <!-- or Ready 
          </v-col>
          <v-col align-self="center" cols="3" md="5" lg="5" class="position-btn-mobile">
            <v-btn depressed dark color="#67C25D" small @click="openSetDefaultSignature()"> <!-- button for setting default signature 
              <v-icon size="16" >mdi-cog</v-icon>
            </v-btn>
          </v-col>
        </v-row> -->
        <v-divider></v-divider>
        <v-row class="font-all">
          <v-col cols="5" md="2" lg="2" class="pt-6 pl-4 all-font-color">
            {{textLang.defaultsignature}}
          </v-col>
          <v-col class="pa-0" cols="7" md="10" lg="10">
            <v-row class="font-all">
              <v-col cols="8" md="5" lg="5" class="px-0 pt-4">
                <v-autocomplete :no-data-text="this.textLang.nodefaultsignature" dense outlined hide-details auto-select-first :placeholder="this.textLang.selectsignature" color="#67C25D" append-icon="mdi-chevron-down" class="font-dropdown ic-dropdown select-stamp-box" v-model="selectedStamp" :items="default_stamp" item-text="StampName" return-object></v-autocomplete>
              </v-col>
              <v-col v-if="show_Edit_Stamp == true" cols="auto" md="auto" lg="auto" align-self="center" class="pt-4 pr-0 edit-stamp-btn-block">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn outlined small color="#67C25D" v-on="on" @click="openEditStamp()" class="edit-stamp-btn">
                      <v-icon size="16">mdi-cog</v-icon>
                    </v-btn>
                  </template>
                  <span>{{textLang.Editdefaultsignature}}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pr-0 pt-4 add-stamp-btn-block">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn depressed dark small color="#67C25D" v-on="on" @click="openAddStamp()" class="edit-stamp-btn">
                      <v-icon size="16">mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>{{textLang.Adddefaultsignature}}</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row class="font-all show-stamp-block">
              <v-col cols="12" md="5" lg="5" align-self="center" class="mb-4 pa-0 show-stamp-box">
                <!-- default signature image -->
                <v-img :src="selectedStamp.SrcBase"  width="100%" height="100%" contain ></v-img>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="font-all">
          <v-col cols="5" md="2" lg="2" class=" pl-4 all-font-color font-def-position font-def-position-mobile">
            Default Business 
          </v-col>
          <!-- Default Business when it's not in editing mode -->
          <v-col v-if="statedefault_Business == false" align-self="center" class="pa-0">
            <v-row class="font-all">
              <v-col cols="12" md="6" lg="6" class="  all-font-color def-ic-status-point def-ic-status-point-mobile" align-self="center">
                <v-icon v-if="confirmBusiness == 'Not Found'" class="ic-status-point" size="16" color="#9e9e9e" >mdi-circle</v-icon> <!-- FOR NOT FOUND default business -->
                <v-icon  v-if="confirmBusiness != 'Not Found'" size="16" class="ic-status-point" color="#8BC34A">mdi-circle</v-icon>  <!--FOR default business is READY -->
                {{confirmBusiness}} <!-- or Not Found -->
              </v-col>
              <v-col align-self="center" cols="12" md="6" lg="6" class="def-btn-status-point-mobile def-btn-status-point">
                <v-btn depressed dark color="#67C25D" small @click="stateBusinessOn()"> <!-- button for setting default business -->
                  <v-icon size="16">mdi-cog</v-icon>
                </v-btn>
              </v-col>          
            </v-row>
          </v-col> 
          <!-- Default Business when it's in editing mode -->
          <v-col v-if="statedefault_Business == true" align-self="center" class="pa-0">
                <v-row class="font-all">
                  <v-col cols="12" md="6" lg="6" class="position-dropdown-mobile">
                    <v-autocomplete class="font-dropdown ic-dropdown text-dropdown" :placeholder="this.textLang.ChooseBusiness" append-icon="mdi-chevron-down" auto-select-first outlined dense hide-details color="#67C25D" v-model="selectedBiz" :items="noneForChangeBiz"></v-autocomplete>
                  </v-col>
                  <v-col cols="auto" md="auto" lg="auto" class="pr-0 position-btn-mobile-cancel" align-self="center">
                    <v-btn depressed color="#757575" small dark @click="stateBusinessOff()">{{textLang.cancel}}</v-btn>
                  </v-col>
                  <v-col cols="auto" md="auto" lg="auto" align-self="center">
                    <v-btn depressed color="#67C25D" small dark @click="set_usersetting()"> {{textLang.record}}</v-btn>
                  </v-col>
                </v-row>
          </v-col>
        </v-row>  
        <v-divider></v-divider>
        <v-row class="font-all">
          <v-col cols="5" md="2" lg="2" class="py-4 pl-4 all-font-color">
            Works
          </v-col>
          <v-col  class="font-all pl-4 pr-2 pt-4 all-font-color">
            <ul >
              <li v-for="item in getWork" :key="item"> <!-- each business list -->
                {{item}} 
              </li>
            </ul>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="font-all">
          <v-col cols="12" md="2" lg="2" class="pt-4 pl-4 all-font-color position-setup-notifications position-setup-notifications-mobile">
            {{textLang.Setupnotifications}} 
          </v-col>
          <v-col class="pa-0 ">
            <v-row class="font-all">
              <v-col cols="5" md="2" lg="2" class="pl-4 pt-3 " align-self="center">
                <v-switch class="mt-0 pt-0 " inset label="Email" hide-details v-model="switch_notify_email" v-on:change="check_edit_email()"></v-switch> <!-- noti email switch -->
              </v-col>
              <v-col class="pt-3 px-0" cols="4" md="5" lg="5">
                <v-text-field outlined hide-details dense :filled="disable_notify_email" :disabled="disable_notify_email" class="search-box-write" color="#67C25D" v-model="notify_email"></v-text-field>
              </v-col> 
              <v-col cols="auto" md="auto" lg="auto" class="px-0 pt-3">
                <v-btn v-if="edit_email == false" outlined  color="rgb(158,158,158)" class="search-btn-write px-0 bg-btn-pencil" @click="editEmail()"> <!-- button of editing noti email -->
                  <v-icon small  >mdi-lead-pencil</v-icon>
                </v-btn> 
                <template v-if="edit_email == true" > <!-- button of cancel and confirm editing noti email  -->
                  <v-btn outlined tile class="close-btn-write px-0" color="rgb(158,158,158)" @click="close_notifyemail()"> <!-- cancel editing noti email button -->
                    <v-icon small >mdi-close</v-icon>
                  </v-btn>
                  <v-btn outlined class="check-btn-write px-0" color="rgb(158,158,158)" @click="confirm_notifyemail()" @keyup.enter="confirm_notifyemail()"> <!-- confirm editing noti email button -->
                    <v-icon small >mdi-check</v-icon>
                  </v-btn> 
                </template>  
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <SignatureModal/>
      <DefaultStampModal/>
    </v-card>
 </div>  
</template>

<script>
import { EventBus } from '../EventBus'
import SignatureModal from '../components/DefaultSignatureModal.vue'
import DefaultStampModal from '../components/DefaultStampModal.vue'
export default {
  components: {
    SignatureModal,
    DefaultStampModal
  },
  data: () => ({
    firstnameTh: '',
    lastnameTh: '',
    firstnameEng: '',
    lastnameEng: '',
    thai_email:'',
    username:'',
    get_biz_detail: [],
    getbiz_detail: [],
    selectedBiz: '',
    statedefault_Business: false,
    nameEng: false,
    confirmBusiness: 'Not Found',
    getBusiness: [],
    getWork: [],
    noneForChangeBiz:[],
    noneInSelectedbiz: "ไม่มี",
    default_Business: '',
    state_Signature: 'Not Found',
    default_sign: false,
    default_stamp: [],
    selectedStamp: [],
    show_Edit_Stamp: true,
    notify_email: '',
    set_notify_email: '',
    switch_notify_email: false,
    edit_email: false,
    disable_notify_email: true,
    show_Edit_Stamp: Boolean ,
    textLang:{
      setgeneralinformation: 'ตั้งค่าข้อมูลทั่วไป',
      name: 'ชื่อ',
      Username: 'ชื่อผู้ใช้',
      defaultsignature: 'ลายเซ็นเริ่มต้น',
      nodefaultsignature: 'ไม่มีลายเซ็นเริ่มต้น',
      selectsignature: 'เลือกลายเซ็น',
      Editdefaultsignature: 'แก้ไขลายเซ็นเริ่มต้น',
      Adddefaultsignature: 'เพิ่มลายเซ็นเริ่มต้น',
      cancel: 'ยกเลิก',
      record: 'บันทึก',
      Setupnotifications: 'ตั้งค่าการแจ้งเตือน',
      succeed:'สำเร็จ',
      Dataupdatesuccessfully: 'อัพเดทข้อมูลสำเร็จ',
      fail:'ล้มเหลว',
      Dataupdatefailed:'อัพเดทข้อมูลล้มเหลว',
      ChooseBusiness:'เลือก Business',
    },
  }),
  mounted() {
    this.getUserDetail()
    this.get_usersetting()
    EventBus.$on('Set_Signature',this.get_defaultSignature)
    EventBus.$on('Setting',this.get_usersetting)
  },
  methods: {
    // openSetDefaultSignature() {
    //   EventBus.$emit('DefaultSignature')
    //   EventBus.$emit('Signature_Data',this.default_Business,this.default_Signature,this.switch_notify_email,this.notify_email)
    // },
    openAddStamp() {
      EventBus.$emit('DefaultStamp','add')
      EventBus.$emit('Stamp_Data_Add',this.default_stamp)
    },
    openEditStamp() {
      EventBus.$emit('DefaultStamp','edit')
      let findStamp = this.default_stamp.findIndex(item => item.StampName == this.selectedStamp.StampName & item.SrcBase == this.selectedStamp.SrcBase)
      EventBus.$emit('Stamp_Data_Edit',this.default_stamp,findStamp,this.selectedStamp)
    },
    getUserDetail(){ // get user detail
      var userDetail = JSON.parse(sessionStorage.getItem('userProfile'))
      this.firstnameTh = userDetail.first_name_th
      this.lastnameTh = userDetail.last_name_th
      this.firstnameEng = userDetail.first_name_eng
      this.lastnameEng = userDetail.last_name_eng
      this.thai_email = userDetail.thai_email
      this.username = userDetail.username
      userDetail.biz_detail.forEach(element => {
        this.get_biz_detail.push(element)
      })
      for (let index = 0; index < this.get_biz_detail.length; index++) {
        this.getBusiness.push(this.get_biz_detail[index].getbiz[0].first_name_th)
        this.getWork.push(this.get_biz_detail[index].getbiz[0].first_name_th)
      }
      this.getBusiness = [...new Set(this.getBusiness)]
      this.getWork = [...new Set(this.getWork)]
      if (((this.firstnameEng != '') & (this.lastnameEng != '')) || ((this.firstnameEng != undefined) & (this.lastnameEng != undefined))) this.nameEng = true
    },
    async get_usersetting(){
      try {
        const url = '/user_setting/api/v1/get_usersetting'
        var { data } = await this.axios.get(this.$api_url + url)
        if(data) {
          this.confirmBusiness = data.result.other_setting.Default_Business
          this.switch_notify_email = data.result.other_setting.Default_NotifyEmail
          this.notify_email = data.result.other_setting.Notify_Email
          this.set_notify_email = data.result.other_setting.Notify_Email
          this.default_sign = data.result.default_sign
          this.default_stamp = data.result.default_stamp
          if (this.default_stamp != '') {
            if (this.selectedStamp != this.default_stamp[0]) {
              this.selectedStamp = this.default_stamp[0]
              this.show_Edit_Stamp = true
            }
          }
          if (this.default_stamp == '') this.selectedStamp = '' ,this.show_Edit_Stamp = false
          if (this.selectedStamp == undefined) this.selectedStamp = ''
          if ((this.confirmBusiness == '') || (this.confirmBusiness == undefined)) this.confirmBusiness = 'Not Found'
          if (this.default_sign == false) this.state_Signature = 'Not Found'
          else if (this.default_sign == true) this.state_Signature = 'Ready'
        }
      } catch (error) {
        console.log(error);
      }
    },
    // async get_defaultSignature(){
    //   try {
    //     const url = '/user_setting/api/v1/get_usersetting'
    //     var { data } = await this.axios.get(this.$api_url + url)
    //     if(data) {
    //       this.default_Signature = data.result.other_setting.Default_Signature
    //       this.default_sign = data.result.default_sign
    //       if (this.default_sign == false) {
    //         this.state_Signature = 'Not Found'
    //       }
    //       if (this.default_sign == true) {
    //         this.state_Signature = 'Ready'
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    set_usersetting(){
      if ((this.selectedBiz == '') || (this.selectedBiz == 'ไม่มี') || (this.selectedBiz == undefined)) {
        this.confirmBusiness = 'Not Found'
        this.default_Business = ''
        this.noneForChangeBiz.shift()
        this.statedefault_Business = false
      }
      else {
        this.confirmBusiness = this.selectedBiz
        this.default_Business = this.confirmBusiness
        this.noneForChangeBiz.shift()
        this.statedefault_Business = false
      }
      this.postData()
    },
    async postData() {
      try {
        if (this.default_Business == undefined) this.default_Business = ''
        if (this.switch_notify_email == undefined) this.switch_notify_email = false
        if (this.notify_email == undefined) this.notify_email = ''
        const url = '/user_setting/api/v1/set_usersetting'
        var { data } = await this.axios.post(this.$api_url + url, 
          {
            other_setting : {
              Default_Business : this.default_Business,
              Default_NotifyEmail : this.switch_notify_email,
              Notify_Email : this.notify_email
            }
        })
        this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">'+this.textLang.succeed+'</strong>',
            text: this.textLang.Dataupdatesuccessfully,
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
      } catch (error) {
        console.log(error);
        this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">'+this.textLang.fail+'</strong>',
            text: this.textLang.Dataupdatefailed,
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
    },
    stateBusinessOn() {
      this.statedefault_Business = true
      this.noneForChangeBiz = this.getBusiness 
      this.noneForChangeBiz.unshift(this.noneInSelectedbiz)
    },
    stateBusinessOff() {
      this.noneForChangeBiz.shift()
      this.statedefault_Business = false
    },
    check_edit_email() {
      this.postData()
      if (this.edit_email == true) this.edit_email = false
    },
    editEmail() {
      this.edit_email = true
      this.disable_notify_email = false
    },
    confirm_notifyemail() {
      this.postData()
      this.edit_email = false
      this.disable_notify_email = true
    },
    close_notifyemail() {
      this.notify_email = this.set_notify_email
      this.edit_email = false
      this.disable_notify_email = true
    }
  }
}
</script>

<style>
.h-heading{
  font-family: 'Sarabun', sans-serif;
  font-size: 14px !important;
}
.font-dropdown{
  font-family: 'Sarabun', sans-serif;
  font-size: 13px !important;
}
.s-cancel{
  font-family: 'Sarabun', sans-serif;
  font-size: 14px !important;
}
.check-btn-write{
    background-color: rgba(0, 0, 0, 0.06);
    border-start-start-radius: 0px;
    border-end-start-radius: 0px;
    height: 40px !important;
    min-width: 40px !important;
    border-left: 0px;
}
.close-btn-write{
    background-color: rgba(0, 0, 0, 0.06);
    height: 40px !important;
    min-width: 40px !important;
    border-right: 0px;
}
.search-box-write {
    border-end-end-radius: 0px !important;
    border-start-end-radius: 0px !important;
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }
.search-btn-write  {
    border-start-start-radius: 0px;
    border-end-start-radius: 0px;
    height: 40px !important;
    min-width: 40px !important;
}
.font-all{
  width: 100%;
  margin: 0% !important;
  font-family: 'Sarabun', sans-serif;
  font-size: 14px !important;
}
.all-font-color{
  color: black;
}
.font-light-color{
  color: #808080;
}
.ic-status-point{
  vertical-align: text-bottom !important; 
}

.select-stamp-box.v-text-field input {
  line-height: 22px !important;
}

.show-stamp-box {
  height: 140px;
  border: 1.2px dashed grey;
  border-radius: 4px;
  background-color: #f5f5f5;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
}

.def-ic-status-point{
 padding-bottom: 1.5% !important;
 padding-top: 1.5%;
}
.def-btn-status-point{
 padding-bottom: 1.5% !important;
 padding-top: 1.5%;
}
.font-def-position {
 padding-bottom: 1.5% !important;
 padding-top: 1.5%;
 align-self: center;
}

.ic-dropdown .theme--light.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
}
.text-dropdown.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot{
  padding-right: 0% !important;
  padding-left: 2% !important;
}
.screen-height {
    max-height: calc(100vh - 80px);
    overflow: auto;
  }
.position-setup-notifications {
  padding-bottom: 1.5% !important;
}  
.bg-btn-pencil{
  background: rgba(0, 0, 0, 0.06)
}

/*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
  .def-ic-status-point-mobile{
  padding-bottom: 0% !important;
    padding-top: 9% ;
  }
  .font-def-position-mobile {
    padding-bottom: 3% !important;
    padding-top: 5%;
    align-self: start
  }
  .def-btn-status-point-mobile{
  padding-bottom: 3% !important;
  padding-top: 3%;
  text-align: right;

  }

  .edit-stamp-btn-block {
    padding-left: 3% !important;
  }

  .edit-stamp-btn {
    padding-left: 0% !important;
    padding-right: 0% !important;
    min-width: 27px !important;
  }

  .add-stamp-btn-block {
    padding-left: 3% !important;
  }

  .show-stamp-block {
    padding-right: 3%;
  }

  .position-btn-mobile{
    text-align: right;
  }
  .position-btn-mobile-cancel{
    margin-left: 23% ;
  }
  .position-dropdown-mobile{
    padding-bottom: 0% !important;
  }
  .screen-height-mobile  {
    max-height: calc(100vh - 70px); 
  }
  .position-setup-notifications-mobile {
    padding-bottom: 0% !important;
  }  
}

</style>
