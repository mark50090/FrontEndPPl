<template>
  <div class="pt-2 pl-2 pr-2" >
    <v-card outlined class="screen-height screen-height-mobile ">
      <v-card-title class ="h-heading py-3">
        <b>ตั้งค่าข้อมูลทั่วไป</b>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class ="h-heading pa-0">
        <v-row class="font-all">
          <v-col  cols="5" md="2" lg="2" class=" py-4 pl-4 all-font-color" align-self="center">
            ชื่อ
          </v-col>
          <v-col class=" py-4 pr-2">
            <span class="all-font-color">{{firstnameTh}} {{lastnameTh}}</span>
            <span v-if="nameEng == true" class="font-light-color"> - {{firstnameEng}} {{lastnameEng}}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="font-all">
          <v-col cols="5" md="2" lg="2" class="py-4 pl-4 all-font-color">
            ชื่อผู้ใช้
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
        <v-divider></v-divider>
         <v-row class="font-all">
          <v-col cols="5" md="2" lg="2" class="py-4 pl-4 all-font-color" align-self="center">
            ลายเซ็นเริ่มต้น
          </v-col>
          <v-col cols="4" md="5" lg="5" align-self="center" class="py-4  all-font-color">
            <v-icon v-if="state_Signature == 'Not Found'" class="ic-status-point" size="16" color="#9e9e9e" >mdi-circle</v-icon> <!--FOR NOT FOUND default signature-->
            <v-icon v-if="state_Signature != 'Not Found'" size="16" class="ic-status-point" color="#8BC34A">mdi-circle</v-icon>  <!--FOR default signature is READY-->
            {{state_Signature}} <!-- or Ready-->
          </v-col>
          <v-col align-self="center" cols="3" md="5" lg="5" class="position-btn-mobile">
            <v-btn depressed dark color="#67C25D" small @click="openSetDefaultSignature()"> <!-- button for setting default signature -->
              <v-icon size="16" >mdi-cog</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!--<v-divider></v-divider>
        <v-row class="font-all">
          <v-col cols="5" md="2" lg="2" class="pt-6 pl-4 all-font-color">
            ตราประทับเริ่มต้น
          </v-col>
          <v-col class="pa-0">
            <v-row class="font-all">
              <v-col cols="8" md="5" lg="5" class="px-0 pt-4">
                <v-autocomplete dense outlined hide-details auto-select-first color="#67C25D" append-icon="mdi-chevron-down" class="font-dropdown ic-dropdown select-stamp-box"></v-autocomplete>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pt-4 pr-0 edit-stamp-btn-block">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn outlined small color="#67C25D" v-on="on" @click="openEditStamp()" class="edit-stamp-btn">
                      <v-icon size="16">mdi-cog</v-icon>
                    </v-btn>
                  </template>
                  <span>แก้ไขตราประทับเริ่มต้น</span>
                </v-tooltip>
              </v-col>
              <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pr-0 pt-4 add-stamp-btn-block">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn depressed dark small color="#67C25D" v-on="on" @click="openAddStamp()" class="edit-stamp-btn">
                      <v-icon size="16">mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>เพิ่มตราประทับเริ่มต้น</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row class="font-all show-stamp-block">
              <v-col cols="12" md="5" lg="5" align-self="center" class="mb-4 pa-0 show-stamp-box">
                <!-- stamp -->
              <!--</v-col>
            </v-row>
          </v-col>
        </v-row>-->
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
                    <v-autocomplete class="font-dropdown ic-dropdown text-dropdown" append-icon="mdi-chevron-down" auto-select-first outlined dense hide-details color="#67C25D" v-model="selectedBiz" :items=noneForChangeBiz  return-object></v-autocomplete>
                  </v-col>
                  <v-col cols="auto" md="auto" lg="auto" class="pr-0 position-btn-mobile-cancel" align-self="center">
                    <v-btn depressed color="#757575" small dark @click="stateBusinessOff()">ยกเลิก</v-btn>
                  </v-col>
                  <v-col cols="auto" md="auto" lg="auto" align-self="center">
                    <v-btn depressed color="#67C25D" small dark @click="set_usersetting()"> บันทึก</v-btn>
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
              <li v-for="item in removeDuplicateBusiness" :key="item"> <!-- each business list -->
                {{item}} 
              </li>
            </ul>
          </v-col>
        </v-row>
        <!-- <v-divider></v-divider>
        <v-row class="font-all">
          <v-col cols="12" md="2" lg="2" class="pt-4 pl-4 all-font-color position-setup-notifications position-setup-notifications-mobile">
            ตั้งค่าการแจ้งเตือน 
          </v-col>
          <v-col class="pa-0 ">
            <v-row class="font-all">
              <v-col cols="5" md="2" lg="2" class="pl-4 pt-3 " align-self="center">
                <v-switch class="mt-0 pt-0 " inset label="Email" hide-details></v-switch> <!-- noti email switch -->
              <!--</v-col>
              <v-col class="pt-3 px-0" cols="4" md="5" lg="5">
                <v-text-field outlined hide-details dense :filled="true" :disabled="true" class="search-box-write" color="#67C25D"></v-text-field>
              </v-col> 
              <v-col cols="auto" md="auto" lg="auto" class="px-0 pt-3">
                <v-btn outlined  color="rgb(158,158,158)" class="search-btn-write px-0 bg-btn-pencil"> <!-- button of editing noti email -->
                  <!--<v-icon small  >mdi-lead-pencil</v-icon>
                </v-btn> -->
                <!-- <template> <!-- button of cancel and confirm editing noti email  
                      <v-btn outlined tile class="close-btn-write px-0" color="rgb(158,158,158)"> <!-- cancel editing noti email button 
                        <v-icon small >mdi-close</v-icon>
                      </v-btn>
                      <v-btn outlined class="check-btn-write px-0" color="rgb(158,158,158)"> <!-- confirm editing noti email button
                        <v-icon small >mdi-check</v-icon>
                      </v-btn> 
                </template>  
              </v-col>
            </v-row>
          </v-col>
        </v-row>-->
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
    removeDuplicateBusiness: [],
    noneForChangeBiz:[],
    noneInSelectedbiz: "ไม่มี",
    Default_Signature: '',
    state_Signature: '',
  }),
  mounted() {
    this.getUserDetail()
    this.get_usersetting()
    EventBus.$on('Setting',this.get_usersetting)
    // if (this.confirmBusiness == 'Not Found') {
    //   this.confirmBusiness = 'Not Found'
    // }
    // console.log(this.confirmBusiness)
  },
  methods: {
    openSetDefaultSignature() {
      EventBus.$emit('DefaultSignature')
    },
    openAddStamp() {
      EventBus.$emit('DefaultStamp','add')
    },
    openEditStamp() {
      EventBus.$emit('DefaultStamp','edit')
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
        for (let index = 0; index < this.get_biz_detail.length; index++) {
          this.getBusiness.push(this.get_biz_detail[index].getbiz[0].first_name_th)
        }
      })
      this.removeDuplicateBusiness = [...new Set(this.getBusiness)] 
      if (((this.firstnameEng != '') & (this.lastnameEng != '')) || ((this.firstnameEng != undefined) & (this.lastnameEng != undefined))) {
        this.nameEng = true
      }
    },
    async get_usersetting(){
      try {
        const url = '/user_setting/api/v1/get_usersetting'
        var { data } = await this.axios.get(this.$api_url + url, 
        {
          headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
          }
        })
        if(data) {
          this.confirmBusiness = data.result.other_setting.Default_Business
          this.Default_Signature = data.result.other_setting.Default_Signature
          if (this.confirmBusiness == '') {
            this.confirmBusiness = 'Not Found'
          }
          if (this.Default_Signature == '') {
            this.state_Signature = 'Not Found'
          }
          if (this.Default_Signature != '') {
            this.Default_Signature = data.result.other_setting.Default_Signature
            this.state_Signature = 'Ready'
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async set_usersetting(){
      try {
        const url = '/user_setting/api/v1/set_usersetting'
        var Default_Business = ''
        if ((this.selectedBiz == '') || (this.selectedBiz == 'ไม่มี') || (this.selectedBiz == undefined)) {
          this.confirmBusiness = 'Not Found'
          Default_Business = ''
          this.noneForChangeBiz.shift()
          this.statedefault_Business = false
        }
        else {
          this.confirmBusiness = this.selectedBiz[0]
          Default_Business = this.confirmBusiness
          this.noneForChangeBiz.shift()
          this.statedefault_Business = false
        }
        // console.log(this.confirmBusiness)
        var { data } = await this.axios.post(this.$api_url + url, 
        {
          headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
          },
          other_setting : {Default_Business : Default_Business,Default_Signature : this.Default_Signature}
        })
      } catch (error) {
        console.log(error);
      }
    },
    // changeBiz() {
    //   if ((this.selectedBiz.getbiz[0].first_name_th == '') || 
    //       (this.selectedBiz.getbiz[0].first_name_th == 'ไม่มี') || 
    //       (this.selectedBiz.getbiz[0].first_name_th == undefined)) {
    //     this.confirmBusiness = 'Not Found'
    //     this.get_biz_detail.shift()
    //     this.statedefault_Business = false
    //   }
    //   else {
    //     this.confirmBusiness = this.selectedBiz.getbiz[0].first_name_th
    //     this.get_biz_detail.shift()
    //     this.statedefault_Business = false
    //   }  
    // },
    stateBusinessOn() {
      this.statedefault_Business = true
      this.noneForChangeBiz.push(this.removeDuplicateBusiness)
      this.noneForChangeBiz.unshift(this.noneInSelectedbiz)
    },
    stateBusinessOff() {
      this.noneForChangeBiz.shift()
      this.statedefault_Business = false
    },
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
