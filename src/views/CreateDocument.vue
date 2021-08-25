<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 create-doc-page">
      <v-row class="create-row">
        <v-col cols="12" md="6" lg="6">
          pdf
        </v-col>
        <v-col cols="12" md="6" lg="6">
          create
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({

    }),
    mounted() {

    },
    methods: {

    }
  }
</script>

<style>
  .create-doc-page {
    height: calc(100vh - 72px);
  }

  .create-row {
    width: 100%;
    margin: 0% !important;
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .create-doc-page {
      height: calc(100vh - 64px);
    }
  }
</style>