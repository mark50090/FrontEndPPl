<template>
  <div>
    <!-- Top Toolbar -->
    <v-row class="toolbar-row toolbar-block">
      <v-toolbar elevation="1" class="main-toolbar">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-toolbar-items class="toolbar-biz-block">
          <v-autocomplete outlined hide-details dense auto-select-first color="rgb(102, 101, 101)" prepend-inner-icon="mdi-briefcase" class="biz-box"></v-autocomplete>
          <v-divider vertical class="mx-2 my-auto toolbar-divider"></v-divider>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on" class="toolbar-menu-btn">
                <v-icon large color="#666565">mdi-account-circle</v-icon>
                <div class="ml-4 display-pc-only">
                  <v-row class="toolbar-row username">
                    สมมติ กิตติศัพท์สกุล
                  </v-row>
                  <v-row class="toolbar-row user-email">
                    sommud.gi@one.th
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
        <v-list-item active-class="menu-active">
          <v-list-item-icon>
            <v-icon>mdi-send-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="menu-title">รายการที่ส่ง</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- Main Content -->
    <v-container fluid class="pa-0 main-content">
      <router-view/>
    </v-container>
  </div>
</template>

<script>
  export default {
    data: () => ({
      drawer: null
    }),
    methods: {

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

  .menu-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
  }

  .main-content {
    margin-top: 64px;
    height: calc(100vh - 64px);
    background-color: rgb(245, 245, 245);
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
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