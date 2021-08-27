<template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Click Me
        </v-btn>
</template>

<script>
import { EventBus } from '../EventBus'

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

</style>