<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  
  data: () => ({
    //
  }),
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Sarabun&display=swap');

  /*==================================== Alert CSS =============================*/
  .alert-card {
    padding-bottom: 16px !important;
  }
  
  .alert-title-block {
    text-align: left !important;
    padding-left: 6% !important;
    padding-top: 0% !important;
  }

  .alert-icon {
    vertical-align: middle;
  }

  .alert-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black;
    margin-left: 18px;
    vertical-align: middle;
  }

  .close-alert-btn {
    font-size: 23px !important;
    margin-right: 4% !important;
    margin-top: 3% !important;
    color: gray !important;
  }

  .close-alert-btn:hover {
    color: lightgray !important;
  }

  .alert-text-block {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
    text-align: left !important;
    margin-left: 63px !important;
    margin-top: 2% !important;
    margin-bottom: 0% !important;
  }

  /*=============================================================================*/

  /*==================================== loading CSS =============================*/
  .loading-circle {
    opacity: 0.6;
  }
  /*=============================================================================*/  

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .display-pc-only {
      display: none !important;
    }
  }

  /*==========================================*/

  @media only screen and (min-width: 600px) { /*css for pc screen*/
    .display-mobile-only {
      display: none !important;
    }
  }
</style>
