<template>
  <div class="text-center">
    <v-progress-circular
      :size="100"
      :width="10"
      color="#0f3852"
      indeterminate
    ></v-progress-circular>
    <!-- <img  :size="50" src="../assets/loader.gif" class="mt-1"> -->
  </div>
</template>
<script>
export default {
  props: [
    "shared_token"
  ],
  mounted(){
    if(this.shared_token) this.getToken()
  },
  methods:{
      // this.$store.dispatch("changeHospital",this.hospital_code || sessionStorage.hospital_code)
      //this.$router.push({ path: '/' })
    async getToken(){
      try {
        var url = '/citizen/api/v1/loginbysharetoken'
        var {data} = await this.axios.post(this.$api_url + url,{
          shared_token: this.shared_token
        })
        this.$apiConfig.setToken(data.data.access_token)
        this.$apiConfig.setRefreshToken(data.data.refresh_token)
        this.$router.push({ path: '/' })
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>
<style scoped>
.v-progress-circular {
  margin: 5rem;
}
</style>