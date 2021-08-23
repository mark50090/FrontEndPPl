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
