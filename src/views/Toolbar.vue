<template>
  <div v-if="isReady">
    <!-- Top Toolbar -->
    <v-overlay absolute :value="loading_overlay" color="white" opacity="0.5">
      <v-progress-circular :size="50" color="light-green" indeterminate></v-progress-circular>
    </v-overlay>
    <v-row class="toolbar-row toolbar-block">
      <v-toolbar elevation="1" class="main-toolbar">
        <v-app-bar-nav-icon @click="drawer = !drawer" class="main-menu-icon"></v-app-bar-nav-icon>
        <v-toolbar-title class="toolbar-logo-block">
          <img height="40px" src="../assets/bot_logo.png" class="mt-1">
          <span class="ml-1 web-name display-pc-only">Digital Workflow</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="toolbar-biz-block">
          <v-autocomplete outlined hide-details dense auto-select-first color="rgb(102, 101, 101)" prepend-inner-icon="mdi-briefcase" class="biz-box" v-model="selectedBiz" :items="business" @change="changeBiz" item-text="first_name_th" item-value="id_card_num" return-object></v-autocomplete>
          <v-divider vertical class="ml-2 my-auto toolbar-divider divider-before-account"></v-divider>
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
                <v-list-item-title class="toolbar-menu-title">{{textLang.setup}}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title class="toolbar-menu-title">{{textLang.logout}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-divider vertical class="mr-1 my-auto toolbar-divider divider-after-account"></v-divider>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text x-small v-on="on" class="px-1">
                <img :src="lang_img"  width="25px">
              </v-btn>
            </template>
            <v-list dense nav>
              <v-list-item @click="changeLang('th')">
                <v-list-item-icon class="lang-img-block">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Flag_of_Thailand_%28non-standard_colours%29.svg" width="27px">
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="toolbar-menu-title">ไทย</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="changeLang('en')">
                <v-list-item-icon class="lang-img-block">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_United_Kingdom.svg" width="27px">
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="toolbar-menu-title">English</v-list-item-title>
                </v-list-item-content>
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
            <v-list-item-title class="menu-title">{{textLang.documentbox}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group no-action color="#53ba47" :value="open_create_menu" active-class="menu-create-doc" :class="create_menu_active_class + ' menu-down-icon'">
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon>mdi-file-edit-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-title">{{textLang.createdocument}}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/create" class="mb-1">
            <v-list-item-icon class="icon-sub-menu">
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-title">{{textLang.uploadapprovaldocuments}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/form" class="mb-1">
            <v-list-item-icon class="icon-sub-menu">
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-title">{{textLang.filloutdocument}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item to="/sent_box" active-class="menu-active">
          <v-list-item-icon>
            <v-icon>mdi-send-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="menu-title">{{textLang.sentitems}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/report" active-class="menu-active menu-icon-svg-active" v-if="role_admin">
          <v-list-item-icon>
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="rgba(0, 0, 0, 0.54)" d="M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z" />
            </svg>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="menu-title">{{textLang.documentreport}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/summary_workflow" active-class="menu-active" v-if="role_admin">
          <v-list-item-icon>
            <v-icon>mdi-file-document</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="menu-title">{{textLang.documentusagereport}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group no-action color="#53ba47" :value="open_doc_style_menu" v-if="role_designer" active-class="menu-create-doc" :class="'doc-style-dropdown-icon ' +  doc_style_active_class">
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon>mdi-file-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-title">{{textLang.managedocumentformats}}</v-list-item-title>
            </v-list-item-content>
          </template>
          <!-- <v-list-item to="/flow" class="mb-1">
            <v-list-item-icon class="icon-sub-menu">
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-title">{{textLang.Createapprovalform}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item> -->
          <v-list-item to="/template" class="mb-1">
            <v-list-item-icon class="icon-sub-menu">
              <v-icon>mdi-circle-medium</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="menu-title">{{textLang.createform}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
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
    computed: {
      textLang() {
        return this.$store.getters.textLang.Toolbar
      },
      lang_img() {
        if(this.$store.state.currentLanguage == 'th') {
          return 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Flag_of_Thailand_%28non-standard_colours%29.svg'
        }
        else {
          return 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_United_Kingdom.svg'
        }
      }
    },
    data: () => ({
      drawer: null,
      firstname: '',
      lastname: '',
      thai_email: '',
      business: [],
      isReady: false,
      loading_overlay: true,
      selectedBiz: '',
      open_create_menu: false,
      create_menu_active_class: '',
      open_doc_style_menu: false,
      doc_style_active_class: '',
      allInfo: [],
      role_admin: false,
      role_designer: false,
      is_remaining_transaction: true
    }),
    watch: {
      $route(to, from) {
        this.checkCreateDocMenu()
        this.checkDocStyleMenu()
      }
    },
    mounted(){
      this.getUserSetting()
      EventBus.$on('loadingOverlay', this.changeLoading)
      this.checkCreateDocMenu()
      this.checkDocStyleMenu()
      if(sessionStorage.role_admin == 'true') this.role_admin = true
      if(sessionStorage.role_designer == 'true') this.role_designer = true
      // this.changeLang(sessionStorage.getItem('page_lang'))

      // Alert Transaction Full
      // this.$swal({
      //   backdrop: false,
      //   width: '100%',
      //   position: 'top',
      //   background: '#FFCDD2',
      //   title: '<svg style="width:35px;height:35px" viewBox="0 0 24 24"><path fill="#D50000" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="transaction-alert-text">' + this.textLang.transaction_alert + '</strong>',
      //   showConfirmButton: false,
      //   customClass: {
      //     container: 'transaction-alert-container',
      //     popup: 'transaction-alert-box',
      //     title: 'transaction-alert-text-block'
      //   }
      // })
    },
    beforeDestroy(){
      sessionStorage.selected_business = ''
    },
    methods: {
      changeLoading(isLoad) {
        this.loading_overlay = isLoad
      },
      async getPackageBusiness(){
        try {
          const url = `/package/api/v1/get_package_business?tax_id=${this.selectedBiz.id_card_num}`
          var { data } = await this.axios.get(this.$api_url + url)
          if(data.status){
            if(data.data.transaction_remaining < 0){
              sessionStorage.isTranRemaining = false
              this.is_remaining_transaction = false
              this.$swal({
                backdrop: false,
                width: '100%',
                position: 'top',
                background: '#FFCDD2',
                title: '<svg style="width:35px;height:35px" viewBox="0 0 24 24"><path fill="#D50000" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="transaction-alert-text">' + this.textLang.transaction_alert + '</strong>',
                showConfirmButton: false,
                customClass: {
                  container: 'transaction-alert-container',
                  popup: 'transaction-alert-box',
                  title: 'transaction-alert-text-block'
                }
              })
              if(this.$route.name == 'create'){
                this.$router.push({ name: 'inbox' })
              }
            }else{
              sessionStorage.isTranRemaining = true
              this.is_remaining_transaction = true
              this.$swal.close()
            }
          }
        } catch (error) {
          sessionStorage.isTranRemaining = true
          this.is_remaining_transaction = true
          this.$swal.close()
        }
      },
      async getUserSetting(){
        try {
          const url = '/user_setting/api/v1/get_usersetting'
          var { data } = await this.axios.get(this.$api_url + url)
          if(data) {
            if(data.result.other_setting) this.defaultBiz = data.result.other_setting.Default_Business? data.result.other_setting.Default_Business : ''
            else this.defaultBiz = ''
            this.$store.commit('changeLanguage',data.result.language)
            EventBus.$emit('changeLang')
          }
        } catch (error) {
          console.log(error);
        }
        this.getUserDetail()
      },
      getUserDetail(){ // get user detail to show name, email and business list
        var userDetail = this.$store.state.userProfile
        var sessionDetail = JSON.parse(sessionStorage.getItem('userProfile'))
        sessionStorage.setItem('name', `${sessionDetail.first_name_th} ${sessionDetail.last_name_th}`)
        this.firstname = sessionDetail.first_name_th
        this.lastname = sessionDetail.last_name_th
        this.thai_email = sessionDetail.thai_email
        this.business = sessionDetail.biz_detail.map(detail => {
          return detail.getbiz[0]
        })
        if(this.defaultBiz != '') this.selectedBiz = this.defaultBiz
        else{
          if(!(sessionStorage.getItem('selected_business'))|| sessionStorage.getItem('selected_business') == 'undefined') this.selectedBiz = this.business[0]
          // this.changeBiz()
          else this.selectedBiz = JSON.parse(sessionStorage.getItem('selected_business'))
        }
        sessionStorage.setItem('selected_business', JSON.stringify(this.selectedBiz))
        this.isReady = true
        // this.getEmployeeInfo()
        this.loading_overlay = false
        this.getPackageBusiness()
      },
      // async getEmployeeInfo(){
      //   try {
      //     var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
      //     var url = `/business/api/v1/showaccount?tax_id=${tax_id}`
      //     var { data } = await this.axios.get(this.$api_url + url)
      //     if(data.status){
      //       this.$store.commit('setAllEmployeeInfo',data.data)
      //     }
      //   } catch (error) {
      //     console.log(error);
      //   }
      // },
      changeBiz(){
        sessionStorage.setItem('selected_business', JSON.stringify(this.selectedBiz))
        EventBus.$emit('changeBiz')
        this.getPackageBusiness()
        this.isReady = true
        // this.getEmployeeInfo()
        // this.$router.push({ path: '/inbox' })
      },
      checkCreateDocMenu() {
        if((this.$route.path.startsWith('/create')) || (this.$route.path.startsWith('/form'))) {
          this.open_create_menu = true
          this.create_menu_active_class = 'menu-create-doc-active'
        } else {
          this.open_create_menu = false
          this.create_menu_active_class = ''
        }
      },
      checkDocStyleMenu() {
        if((this.$route.path.startsWith('/flow')) || (this.$route.path.startsWith('/template'))) {
          this.open_doc_style_menu = true
          this.doc_style_active_class = 'menu-create-doc-active'
        } else {
          this.open_doc_style_menu = false
          this.doc_style_active_class = ''
        }
      },
      changeLang(item) {
        this.$store.commit('changeLanguage',item);
        sessionStorage.setItem('page_lang',item)
        this.setLanguage(item.toUpperCase())
        EventBus.$emit('changeLang')
        if(sessionStorage.isTranRemaining == 'false'){
          this.$swal({
            backdrop: false,
            width: '100%',
            position: 'top',
            background: '#FFCDD2',
            title: '<svg style="width:35px;height:35px" viewBox="0 0 24 24"><path fill="#D50000" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="transaction-alert-text">' + this.textLang.transaction_alert + '</strong>',
            showConfirmButton: false,
            customClass: {
              container: 'transaction-alert-container',
              popup: 'transaction-alert-box',
              title: 'transaction-alert-text-block'
            }
          })
        }
		  },
      async setLanguage(lang){
        try {
          const url = '/user_setting/api/v1/set_usersetting'
          var { data } = await this.axios.post(this.$api_url + url, 
            {
              language: lang
          })
          if(data){}
        } catch (error) {
          console.log(error);
        }
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

  .divider-before-account {
    margin-right: 8px !important;
  }

  .divider-after-account {
    margin-left: 8px !important;
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

  .lang-img-block {
    align-items: center;
  }

  .list-all-menu {
    margin-top: 25%;
  }

  .menu-active {
    background-color: #53ba47;
    color: white !important;
  }

  .v-application--is-ltr .menu-down-icon  .v-list-item__icon:last-of-type:not(:only-child) {
    margin-left: 0% !important;
  }

  .menu-icon-svg-active > .v-list-item__icon > svg > path {
    fill: white !important;
  }

  .menu-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
    line-height: 24px !important;
  }

  .menu-create-doc {
    color: #000000DE !important;
  }

  .v-list .menu-create-doc.v-list-item--active .v-icon {
    color: rgba(0, 0, 0, 0.54);
  }

  .v-application--is-ltr .icon-sub-menu.v-list-item__icon:first-child {
    margin-right: 17px !important;
  }

  .menu-create-doc-active > .v-list-group__header {
    background-color: #53ba47;
    color: white !important;
  }

  .menu-create-doc-active > .v-list-group__header > .v-list-item__icon > .v-icon {
    color: white !important;
  }

  .doc-style-dropdown-icon.v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
    min-width: 24px !important;
  }

  .main-content {
    margin-top: 64px;
    height: calc(100vh - 64px);
    background-color: rgb(245, 245, 245);
  }

  .transaction-alert-container {
    margin-left: 256px;
    top: 58px !important;
  }

  .transaction-alert-box {
    padding-bottom: 1% !important;
  }

  .transaction-alert-text-block {
    text-align: left !important;
    display: inline-flex !important;
    padding-top: 1% !important;
  }

  .transaction-alert-text {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    margin-left: 3%;
    align-self: center;
    color: #D50000;
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .main-menu-icon {
      width: 24px !important;
    }

    .toolbar-logo-block {
      padding-left: 0% !important;
    }

    .biz-box {
      width: 190px;
    }

    .divider-before-account {
      margin-right: 1% !important;
    }

    .divider-after-account {
      margin-left: 1% !important;
    }

    .toolbar-menu-btn {
      padding-left: 1% !important;
      padding-right: 1% !important;
    }

    .main-content {
      margin-top: 56px;
      height: calc(100vh - 56px);
    }

    .transaction-alert-container {
      margin-left: 0px;
      top: 52px !important;
    }

    .transaction-alert-text {
      font-size: 14px;
    }
  }
</style>
