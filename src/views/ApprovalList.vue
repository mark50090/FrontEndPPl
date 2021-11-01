<template>
    <div class="pt-1 px-1" >
        <v-card outlined class="px-4 page-list">
            <v-row class="approvallist-row ">
            <v-col cols="12" md="6" lg="6" class="px-0 pb-0 ">
              <v-text-field outlined hide-details dense clearable color="#4caf50" :placeholder="textLang.search" class="search-approvallist-box search-approvallist-btn " clear-icon="mdi-close-circle-outline" >
                <template v-slot:append-outer>
                  <v-btn outlined color="#9e9e9e" class="btn-approval-search">
                    <v-icon >mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>  
            </v-col>
          </v-row >
          <v-row class="approvallist-row approval-header ">
                  <v-col cols="12" md="auto" lg="auto" class="pl-0" align-self="center" >
                    {{textlang.Allapprovedforms}} 100
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col align-self="center" cols="auto" md="auto" lg="auto" class="pr-0 position-btn-approval ">
                    <v-btn depressed dark color="#67C25D" class="create-approval-btn">
                      <v-icon class="mr-2">mdi-plus</v-icon>{{textlang.Createanapprovalform}}</v-btn>
                </v-col>
                </v-row>
        <v-row class="approvallist-row mt-1">
        <v-data-table fixed-header :loading="false" :headers="approval_table_header" :items="approval_data" class="approval-table apprpval-table-border apprpval-table-header apprpval-type-header hide-apprpval-table-progress apprpval-data-table">
          <template v-slot:loading> 
            <v-row align="center" justify="center" class="approvallist-row apprpval-loading">
              <img width="100px" src="../assets/loader.gif" class="apprpval-load">
            </v-row>
          </template>
          <template v-slot:[`item.more_approval`]="{ item }">
                <v-btn icon color="#0176b3" class="mr-3" ><v-icon>mdi-pencil</v-icon></v-btn><!-- edit flow button -->
                <v-btn icon color="error" ><v-icon>mdi-delete</v-icon></v-btn><!-- delete flow button -->
            </template>
        </v-data-table>
      </v-row>    
        </v-card>
    </div>
</template>
<script>
export default {
    data: () => ({
        approval_table_header: [
        {text: 'ลำดับ', align: 'center', sortable: true, value: 'approval_no'},
        {text: 'ชื่อรูปแบบอนุมัติ', align: 'start', sortable: true, value: 'approval_name'},
        {text: 'รายละเอียด', align: 'start', sortable: false, value: 'details_approval'},
        {text: 'วันที่เเก้ไขล่าสุด', align: 'center', sortable: true, value: 'edit_date_approval'},
        {text: '', align: 'center', sortable: false, value: 'more_approval'}
      ],
      approval_data: [
          {
            approval_no: '1',
            approval_name: 'TEST-DEV-รายละเอียดงบประมาณแนบท้ายโครงการ',
            details_approval: 'Outsource',
            edit_date_approval: '19 ม.ค. พ.ศ.2556',
            
          }
          
      ],
      textLang: {
        search: 'ค้นหา',
        Allapprovedforms: 'รูปแบบอนุมัติทั้งหมด', 
        Createanapprovalform: 'สร้างรูปแบบอนุมัติ',
        approval_ta:{
          number: 'ลำดับ',
          approvedformatname: 'ชื่อรูปแบบอนุมัติ',
          details: 'รายละเอียด',
          lastrevisiondate: 'วันที่เเก้ไขล่าสุด'
        },
      }

    
}),}
</script>
<style>
.approvallist-row {
    width: 100%;
    margin: 0% !important;
  }
.page-list {
    height: calc(100vh - 73px);
    overflow: auto;
}  
.search-approvallist-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    border-end-end-radius: 0px !important;
    border-start-end-radius: 0px !important;
  }  
 
.btn-approval-search {
    background-color: #f5f7fa;
    border-start-start-radius: 0px;
    border-end-start-radius: 0px;
    height: 40px !important;
    min-width: 58px !important;
  }
.search-approvallist-btn.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer {
    margin-top: 0% !important;
  }

.v-application--is-ltr .search-approvallist-btn .v-input__append-outer {
    margin-left: 0% !important;
  } 
.approval-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 18px;
    color: #1b9900;
}   
.create-approval-btn {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px !important;
}
.approval-table {
    width: 100%;
  }

.approval-table.v-data-table > .v-data-table__wrapper {
    height: calc(100vh - 267px);
    overflow: auto;
  }

.apprpval-table-border .v-data-table__wrapper {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

.apprpval-table-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    font-family: 'Sarabun', sans-serif;
    font-size: 15px;
  }  
.hide-apprpval-table-progress .v-data-table__progress {
    display: none;
  } 
.apprpval-data-table.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-family: 'Sarabun', sans-serif;
  } 
.apprpval-type-header.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th:nth-child(3) {
    text-align: center !important;
  } 
.apprpval-loading {
    height: calc(100vh - 318px);
  }

.apprpval-load {
    opacity: 0.6;
  }  
.search-approvallist-box.v-text-field input{
  line-height: 22px;
}      
@media only screen and (max-width:600px){ /*css for mobile screen*/
.position-btn-approval{
  padding-top: 0% !important; 
  margin-left: 41%;
}
.page-list{
  height: calc(100vh - 62px);
}
.approval-table.v-data-table > .v-data-table__wrapper {
    height: calc(100vh - 325px);
  }
.apprpval-loading {
    height: calc(100vh - 384px);
    margin-left: 100% !important;
  }  
}  
</style>