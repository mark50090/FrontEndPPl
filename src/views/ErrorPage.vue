<template>
  <v-container fluid fill-height class="error-bg">
    <!-- back button for pc screen -->
    <v-btn depressed dark x-large color="#4cb000" @click="back()" class="back-page-btn display-pc-only">
      <v-icon x-large class="mr-6">mdi-hand-pointing-left</v-icon> Back
    </v-btn>

    <!-- error page for mobile screen -->
    <v-row class="error-row display-mobile-only">
      <v-row align="center" justify="center" class="error-row">
        <v-img src="https://www.img.in.th/images/7c2a5e2b1c08d683b5394e65accddc24.png"></v-img>
      </v-row>
      <v-row align="center" justify="center" class="mt-7 error-row">
        <v-btn depressed dark x-large color="#5cc44a" @click="back()" class="back-page-btn-mobile">
          <v-icon x-large class="mr-6">mdi-hand-pointing-left</v-icon> Back
        </v-btn>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({

    }),
    methods: {
      back() {
        this.$router.back();
      }
    }
  }
</script>

<style>
  .error-bg {
    background-image: url('https://www.img.in.th/images/553c4166e2ac1746be28d74554eb86fd.png');
    background-size: cover;
    background-position: center;
  }

  .back-page-btn {
    font-family: 'Sarabun', sans-serif;
    font-size: 28px !important;
    font-weight: bold;
    height: 65px !important;
    border-radius: 9px;
    margin-top: auto;
    margin-bottom: 3%;
    margin-left: 20%;
  }

  .error-row {
    width: 100%;
    margin: 0% !important;
  }

  .back-page-btn-mobile {
    font-family: 'Sarabun', sans-serif;
    font-size: 22px !important;
  }

  /*=============================================================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .error-bg {
      background-image: unset;
      background-size: unset;
      background-position: unset;
    }
  }
</style>