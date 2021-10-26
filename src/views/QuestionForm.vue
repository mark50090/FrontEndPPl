<template>
    <div class="pt-2 pl-2 pr-2">
        <v-card class="pt-2 question-page px-4" outlined>
        <v-row  class="all-round">
        <v-col
        cols="auto"
        md="auto"
        lg="auto"
        class="back-question  pl-0">       
        <v-btn icon color="#67C25D"  >
              <v-icon>
                mdi-arrow-left
              </v-icon>
        </v-btn>
        </v-col>
        <v-col
          class="pl-0 question-header pr-0" >
        <b>{{textLang.documentreport}} </b>
        </v-col>
        </v-row>
            <v-card class="question-in pt-3 pr-5 pl-5 mt-1" outlined>
                <v-row class="all-round mb-3"> 
                <v-card outlined class="box-question " >
                <v-card-title  class="font-question py-2">สวัสดีครับ ผมจักรกรินทร์ ปงแก้ว 6030202065 ทั้งหมดดูดี</v-card-title> 
                <v-card-text class="py-3 px-3 ">
                <v-text-field outlined hide-details dense  class="font-answer" color="#404040"></v-text-field>
                </v-card-text> 
                </v-card>
                </v-row>
            </v-card>
        <v-row class="all-round">
          <v-spacer></v-spacer>
         <v-col cols="auto"
          md="auto"
          lg="auto"
          class="pr-0 pt-4 "
          align-self="center">
          <v-btn class="font-send-btn"
          depressed dark  color="#67C25D"
          >{{textLang.senddocuments}}</v-btn>
          </v-col>
        </v-row>
        </v-card>    
    </div>
    
</template>
<script>
export default {
    data:() => ({
    textLang:{
      documentreport:'รายงานเอกสาร',
      senddocuments: 'ส่งเอกสาร',
    },
    }),
    
}
</script>
<style>
.question-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 22px;
    color: #67C25D;
  }
.question-page {
    height: calc(100vh - 80px);
    overflow: auto;
  }  
.question-row {
    width: 100%;
    margin: 0% !important;
    overflow: auto;
  } 
.question-in {
    height: calc(100vh - 220px);
    overflow: auto;
  }   
.box-question{
  font-family: 'Sarabun', sans-serif;
  width: 100%;
}
.font-question {
  font-size: 16px;
  color: white;
  background: #404040;
}
.answer-question {
    border-end-start-radius: 20px !important;
    border-end-end-radius: 20px !important;
}

.all-round{
  width: 100%;
  margin: 0% !important; 
}
.font-answer{
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
}
.font-answer.v-text-field input {
  line-height: 25px !important;
}
.font-send-btn{
 font-family: 'Sarabun', sans-serif;
}
/*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
 
.question-page {
    height: calc(100vh - 70px);
} 
.question-in {
    height: calc(100vh - 215px);
 }     
}

</style>