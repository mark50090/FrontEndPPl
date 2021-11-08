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
    "shared_token",
    "transaction_id"
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
        this.getUserDetail()
        this.getRoleAdmin()
        this.getRoleDesigner()
      } catch (error) {
        console.log(error);
      }
    },
    async getUserDetail(){ // get user detail to show name, email and business list
        try {
          var url = '/citizen/api/v1/detail'
          var { data } = await this.axios.get(this.$api_url + url)
          if(data) {
            sessionStorage.setItem('name', `${data.data.first_name_th} ${data.data.last_name_th}`)
            sessionStorage.setItem('userProfile', JSON.stringify(data.data))
            if(this.transaction_id) this.goToFillPage()
            else this.$router.push({ path: '/inbox' })
          }
        } catch (error) {
          console.log(error);
        }
      },
    goToFillPage() {
      let tempOption = {
        template_id: "",
        isCopy: false,
        isImport: false,
        transaction_id: this.transaction_id
      }
      sessionStorage.setItem('option',JSON.stringify(tempOption))
      sessionStorage.setItem('isDocEdit',true)
      sessionStorage.setItem('isDocStep',true)
      sessionStorage.setItem('isBack',false)
      sessionStorage.setItem('isStep',false)
      sessionStorage.setItem('isOnlyForm',true)
      this.$router.push({ 'path': '/form/input'})
    },
    async getRoleAdmin(){
      try {
        var url = '/citizen/api/v1/checkadmin'
        var { data } = await this.axios.post(this.$api_url + url)
        if(data.status) sessionStorage.setItem('role_admin',true)
        else sessionStorage.setItem('role_admin',false)
      } catch (error) {
        console.log(error);
      }
    },
    async getRoleDesigner(){
      try {
        var url = '/citizen/api/v1/checkdesigner'
        var { data } = await this.axios.post(this.$api_url + url)
        if(data.status) sessionStorage.setItem('role_designer',true)
        else sessionStorage.setItem('role_designer',false)
      } catch (error) {
        console.log(error);
      }
    } 
  }
}
</script>
<style scoped>
.v-progress-circular {
  margin: 5rem;
}
</style>