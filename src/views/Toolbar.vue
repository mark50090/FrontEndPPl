<template>
  <div v-if="isReady">
    <!-- Top Toolbar -->
    <v-overlay absolute :value="loading_overlay" color="white" opacity="0.5">
      <v-progress-circular :size="50" color="light-green" indeterminate></v-progress-circular>
    </v-overlay>
    <v-row class="toolbar-row toolbar-block">
      <v-toolbar elevation="1" class="main-toolbar">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="toolbar-logo-block">
          <img height="40px" src="../assets/bot_logo.png" class="mt-1">
          <span class="ml-1 web-name display-pc-only">Digital Workflow</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="toolbar-biz-block">
          <v-autocomplete outlined hide-details dense auto-select-first color="rgb(102, 101, 101)" prepend-inner-icon="mdi-briefcase" class="biz-box" v-model="selectedBiz" :items="business" @change="changeBiz" item-text="first_name_th" item-value="id_card_num" return-object></v-autocomplete>
          <v-divider vertical class="mx-2 my-auto toolbar-divider"></v-divider>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on" class="toolbar-menu-btn">
                <v-icon large color="#666565">mdi-account-circle</v-icon>
                <div class="ml-4 display-pc-only">
                  <v-row class="toolbar-row username">
                    {{firstname}} {{lastname}}
                  </v-row>
                  <v-row class="toolbar-row user-email">
                    {{thai_email}}
                  </v-row>
                </div>
                <v-icon color="#666565" class="toolbar-menu-icon">mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list dense nav>
              <v-list-item to="/setting">
                <v-list-item-title class="toolbar-menu-title">ตั้งค่า</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="toolbar-menu-title">ออกจากระบบ</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </v-toolbar>
    </v-row>
    <!-- Left Menu -->
    <v-navigation-drawer app v-model="drawer">
      <v-list nav dense class="list-all-menu">
        <v-list-item to="/inbox" active-class="menu-active">
          <v-list-item-icon>
            <v-icon>mdi-inbox-arrow-down-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="menu-title">กล่องเอกสาร</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/create" active-class="menu-active">
          <v-list-item-icon>
            <v-icon>mdi-file-edit-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="menu-title">สร้างเอกสาร</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item to="/sent_box" active-class="menu-active">
          <v-list-item-icon>
            <v-icon>mdi-send-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="menu-title">รายการที่ส่ง</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item to="/report" active-class="menu-active menu-icon-svg-active">
          <v-list-item-icon>
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="rgba(0, 0, 0, 0.54)" d="M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z" />
            </svg>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="menu-title">รายงานเอกสาร</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item to="/summary_workflow" active-class="menu-active">
          <v-list-item-icon>
            <v-icon>mdi-file-document</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="menu-title">รายงานการใช้งานเอกสาร</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
    <!-- Main Content -->
    <v-container fluid class="pa-0 main-content">
      <router-view/>
    </v-container>
  </div>
</template>

<script>
  import { EventBus } from '../EventBus'
  export default {
    data: () => ({
      drawer: null,
      firstname: '',
      lastname: '',
      thai_email: '',
      business: [],
      isReady: false,
      loading_overlay: true,
      selectedBiz: ''
    }),
    mounted(){
      this.getUserDetail().then(()=>{ // set defualt business to the 1st of item in business list
        this.selectedBiz = this.business[0]
        // this.changeBiz()
        sessionStorage.setItem('selected_business', JSON.stringify(this.selectedBiz))
        this.isReady = true
      })
      EventBus.$on('loadingOverlay', this.changeLoading)
    },
    methods: {
      changeLoading(isLoad) {
        this.loading_overlay = isLoad
      },
      async getUserDetail(){ // get user detail to show name, email and business list
        try {
          var url = '/citizen/api/v1/detail'
          var { data } = await this.axios.get(this.$api_url + url)
          if(data) {
            sessionStorage.setItem('name', `${data.data.first_name_th} ${data.data.last_name_th}`)
            this.firstname = data.data.first_name_th
            this.lastname = data.data.last_name_th
            this.thai_email = data.data.thai_email
            data.data.biz_detail.forEach(element => {
              this.business.push(...element.getbiz)
            });
            this.loading_overlay = false
          }else{
            this.loading_overlay = false
          }
        } catch (error) {
          console.log(error);
          this.loading_overlay = false
        }
      },
      changeBiz(){
        sessionStorage.setItem('selected_business', JSON.stringify(this.selectedBiz))
        EventBus.$emit('changeBiz')
        this.isReady = true
        // this.$router.push({ path: '/inbox' })
      }
    }
  }
</script>

<style>
  .toolbar-block {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
  }

  .main-toolbar .v-toolbar__content {
    padding-right: 0% !important;
  }

  .toolbar-logo-block {
    padding-left: 1% !important;
  }

  .web-name {
    font-family: 'Sarabun', sans-serif;
    font-size: 19px;
    font-weight: bold;
    vertical-align: super;
    color: #0f3852;
  }

  .toolbar-biz-block {
    align-items: center;
  }

  .biz-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
    width: 230px;
  }

  .biz-box.v-text-field input {
    line-height: 24px !important;
  }

  .toolbar-divider.v-divider--vertical {
    min-height: 87% !important;
    max-height: 87% !important;
  }

  .toolbar-row {
    width: 100%;
    margin: 0% !important;
  }

  .username {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: #666565;
  }

  .user-email {
    font-family: 'Sarabun', sans-serif;
    font-size: 11px;
    color: #666565;
    text-transform: initial;
  }

  .toolbar-menu-icon {
    margin-left: 10%;
  }

  .toolbar-menu-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
    line-height: 24px !important;
  }

  .list-all-menu {
    margin-top: 25%;
  }

  .menu-active {
    background-color: #53ba47;
    color: white !important;
  }

  .menu-icon-svg-active > .v-list-item__icon > svg > path {
    fill: white !important;
  }

  .menu-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
    line-height: 24px !important;
  }

  .main-content {
    margin-top: 64px;
    height: calc(100vh - 64px);
    background-color: rgb(245, 245, 245);
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .toolbar-logo-block {
      padding-left: 0% !important;
    }

    .biz-box {
      width: 198px;
    }

    .toolbar-menu-btn {
      padding-left: 3% !important;
      padding-right: 2% !important;
    }

    .main-content {
      margin-top: 56px;
      height: calc(100vh - 56px);
    }
  }
</style>