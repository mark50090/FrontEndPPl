<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 create-doc-page">
      <v-row class="create-row">
        <v-col cols="12" md="6" lg="6" class="pa-2 pdf-create-card-block">
          <v-overlay absolute opacity="0.3" :value="false" class="load-pdf-block"> <!-- load pdf -->
            <img width="100px" src="../assets/loader.gif" class="load-pdf">
          </v-overlay>
          <v-card elevation="0" color="rgb(82, 86, 89)">
            <v-card-title class="pa-0 create-pdf-bar">
              <v-row class="create-row"> <!-- show when it has pdf -->
                <v-spacer></v-spacer>
                <v-col cols="8" md="9" lg="9" align-self="center" class="py-2 text-center">
                  <v-btn icon x-small color="white">
                    <v-icon size="16">mdi-arrow-left</v-icon>
                  </v-btn>
                  <span class="mx-1 create-pdf-page">30 / 30</span>
                  <v-btn icon x-small color="white">
                    <v-icon size="16">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="py-0 pr-2">
                  <v-btn icon large color="white">
                    <v-icon large>mdi-text-box-search</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="px-1 pb-1">
              <v-row align="center" justify="center" class="mt-1 create-row create-pdf-block">
                <!-- pdf -->
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <v-row class="create-row">
            <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-0 pt-2 select-file-title">
              เลือกไฟล์ :
            </v-col>
            <v-col cols="9" md="" lg="" class="px-0 pt-2">
              <v-file-input dense outlined hide-details color="#67C25D" truncate-length="60" placeholder="เลือกไฟล์" prepend-icon="" :clearable="false" class="create-file delete-file-btn-block">
                <template v-slot:append-outer>
                  <v-btn icon :disabled="false" color="#424242"> <!-- delete pdf button -->
                    <v-icon size="28px">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
          <v-card outlined class="mt-1">
            <v-overlay absolute opacity="0.5" color="white" :value="false"></v-overlay> <!-- overlay show when it doesn't has document file -->
            <v-card-title class="pa-0">
              <v-tabs grow height="40px" color="#4CAF50" v-model="create_tab">
                <v-tab class="create-tab-title">ตั้งค่าการส่ง</v-tab>
                <v-tab v-if="false" class="create-tab-title">รูปแบบอนุมัติ</v-tab>
                <v-tab class="create-tab-title">กำหนดเอง</v-tab>
              </v-tabs>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="px-2 pt-0 pb-2 create-detail-block">
              <v-tabs-items v-model="create_tab">
                <!-- document setting tab -->
                <v-tab-item>
                  <v-row class="create-row">
                    <v-col cols="4" md="3" lg="3" align-self="center" class="pl-2 pt-4 create-setting-title">
                      ชื่อเอกสาร :
                    </v-col>
                    <v-col cols="8" md="9" lg="9" align-self="center" class="px-0 pt-4">
                      <v-text-field dense outlined hide-details color="#4CAF50" class="create-setting create-setting-input"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="4" md="3" lg="3" align-self="center" class="pl-2 pt-0 create-setting-title">
                      ข้อความ :
                    </v-col>
                    <v-col cols="8" md="9" lg="9" align-self="center" class="px-0 pt-0">
                      <v-text-field dense outlined hide-details color="#4CAF50" class="create-setting create-setting-input"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="12" md="3" lg="3" class="pl-2 pt-2 create-setting-title">
                      แนบไฟล์ :
                    </v-col>
                    <v-col cols="12" md="9" lg="9" class="pr-0 pt-0 create-attach-file-block">
                      <v-file-input dense outlined multiple counter show-size chips small-chips color="#4CAF50" prepend-icon="" append-outer-icon="$file" placeholder="เลือกไฟล์แนบ" class="create-setting">
                        <template v-slot:selection="{ text }">
                          <v-chip small dark close color="#4CAF50">{{ text }}</v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <!-- select work flow tab -->
                <v-tab-item v-if="false">
                  <v-row class="create-row">
                    <v-col cols="5" md="4" lg="4" align-self="center" class="pl-2 pb-0 create-setting-title">
                      ประเภทเอกสาร :
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-autocomplete dense outlined hide-details auto-select-first color="#4caf50" placeholder="เลือก" append-icon="mdi-chevron-down" class="create-setting create-setting-input email-step-box create-setting-dropdown-icon"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="5" md="4" lg="4" align-self="center" class="pl-2 pb-0 create-setting-title">
                      รูปแบบเอกสาร :
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-autocomplete dense outlined hide-details auto-select-first color="#4caf50" placeholder="เลือก" append-icon="mdi-chevron-down" :disabled="false" :filled="false" class="create-setting create-setting-input email-step-box create-setting-dropdown-icon"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="create-row"> <!-- department row. Show when document type and document style are selected -->
                    <v-col cols="5" md="4" lg="4" align-self="center" class="pl-2 pb-0 create-setting-title">
                      แผนกสายงาน :
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-autocomplete dense outlined hide-details auto-select-first color="#4caf50" placeholder="ระบุแผนก" append-icon="mdi-chevron-down" class="create-setting create-setting-input email-step-box create-setting-dropdown-icon"></v-autocomplete> <!-- when it has many departments -->
                      <!-- <span class="create-setting-title">การเงินและธุรการ</span> --> <!-- when it has only one department -->
                    </v-col>
                  </v-row>
                  <v-card outlined class="mt-4 px-2 pb-2 workflow-block">
                    <template>
                      <v-row class="create-row">
                        <v-col cols="auto" md="auto" lg="auto" class="pl-1 pb-2 create-setting-title">
                          ลำดับ 20 : ผู้มีสิทธิ์อนุมัติ <!-- or ผู้มีสิทธิ์เซ็น -->
                        </v-col>
                      </v-row>
                      <v-row class="create-row each-step-mail-row"> <!-- each email row in step -->
                        <v-col cols="8" md="9" lg="9" class="px-0 pt-1 pb-0">
                          <v-text-field dense outlined hide-details color="#67C25D" placeholder="@one.th" class="create-setting email-step-box each-email-icon">
                            <template v-slot:prepend>
                              <v-icon large>mdi-account</v-icon>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 pt-1 pb-0">
                          <v-checkbox hide-details label="OneChat" class="mt-0 pt-0 onechat-check"></v-checkbox>
                        </v-col>
                      </v-row>
                    </template>
                  </v-card>
                </v-tab-item>
                <!-- custom work flow tab -->
                <v-tab-item>
                  <v-row class="create-row">
                    <v-col cols="12" md="4" lg="4" align-self="center" class="pl-2 pt-4 pb-0 create-setting-title">
                      ประเภทเอกสาร :
                    </v-col>
                    <v-col cols="12" md="8" lg="8" align-self="center" class="pr-0 pt-4 pb-0 create-attach-file-block">
                      <v-autocomplete dense outlined hide-details auto-select-first color="#4caf50" placeholder="เลือก" append-icon="mdi-chevron-down" class="create-setting create-setting-input create-setting-dropdown-icon"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="7" md="4" lg="4" align-self="center" class="pl-2 pr-1 pt-1 pb-0 create-setting-title">
                      Require Certificate (CA) :
                    </v-col>
                    <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 pt-1 pb-0">
                      <v-switch inset hide-details class="mt-0 create-setting-switch"></v-switch>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="7" md="4" lg="4" align-self="center" class="pl-2 pr-1 pt-1 pb-0 create-setting-title">
                      Stamp All Page :
                    </v-col>
                    <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 pt-1 pb-0">
                      <v-switch inset hide-details class="mt-0 create-setting-switch"></v-switch>
                    </v-col>
                  </v-row>
                  <v-row justify="center" class="create-row">
                    <v-col cols="5" md="4" lg="4" class="pl-0 pr-1 pt-1 pb-2">
                      <v-btn small block color="#67C25D" :disabled="false" class="add-step-btn">
                        <v-icon small class="mr-1">mdi-plus</v-icon> เพิ่ม (อนุมัติ)
                      </v-btn>
                    </v-col>
                    <v-col cols="5" md="4" lg="4" class="pl-0 pr-1 pt-1 pb-2">
                      <v-btn small block color="#67C25D" :disabled="false" class="add-step-btn">
                        <v-icon small class="mr-1">mdi-plus</v-icon> เพิ่ม (เซ็น)
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-card outlined class="pa-2 all-step-block">
                    <div class="mb-3"> <!-- each step -->
                      <v-row class="create-row">
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 py-1 create-setting-title">
                          ลำดับ 20 : ผู้มีสิทธิ์อนุมัติ <!-- or ผู้มีสิทธิ์เซ็น -->
                        </v-col>
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-2 pr-1 py-1">
                          <v-btn outlined fab x-small color="error" class="px-0 delete-step-btn"> <!-- delete step button -->
                            <v-icon small>mdi-minus</v-icon>
                          </v-btn>
                        </v-col>
                        <v-spacer></v-spacer>
                        <template> <!-- show when it is sign step -->
                          <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pr-2 py-1 create-setting-title display-pc-only">
                            หน้าที่เซ็น
                          </v-col>
                          <v-col cols="3" md="2" lg="2" class="px-0 py-1">
                            <v-select outlined dense hide-details label="หน้า" color="#67C25D" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="pdf_page_list" class="create-setting page-sign-box page-sign-dropdown-icon create-setting-dropdown-icon"></v-select>
                          </v-col>
                        </template>
                      </v-row>
                      <v-row class="create-row each-step-mail-row"> <!-- each email row in step -->
                        <v-col cols="7" md="7" lg="7" class="px-0 pt-1 each-email-step-block">
                          <v-text-field dense outlined hide-details color="#67C25D" placeholder="@one.th" class="create-setting email-step-box each-email-icon">
                            <template v-slot:prepend>
                              <v-icon large>mdi-account</v-icon>
                            </template>
                          </v-text-field>
                        </v-col>
                        <v-col cols="5" md="5" lg="5" align-self="center" class="pa-0">
                          <v-row class="create-row ">
                            <v-col cols="12" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 py-0">
                              <v-checkbox hide-details label="OneChat" class="mt-0 pt-0 onechat-check"></v-checkbox>
                            </v-col>
                            <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pt-0 pl-2 pr-0 add-delete-permission-block"> <!-- delete email in each step button -->
                              <v-btn outlined fab x-small color="#67C25D" class="delete-permission-btn">
                                <v-icon>mdi-minus</v-icon>
                              </v-btn>
                            </v-col>
                            <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pt-0 px-2 add-delete-permission-block"> <!-- add email in each step button -->
                              <v-btn depressed fab x-small dark color="#67C25D" class="delete-permission-btn">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
          <v-row v-if="(create_tab == 1) || (create_tab == 2)" justify="end" class="create-row">
            <v-col cols="auto" md="auto" lg="auto" class="pt-1">
              <v-btn depressed color="#67C25D" :disabled="false" class="send-doc-btn">ส่งเอกสาร</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({
      create_tab: null,
      pdf_page_list: []
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

  .pdf-create-card-block {
    position: relative;
  }

  .load-pdf-block {
    border-radius: 4px;
  }

  .load-pdf {
    opacity: 0.6;
  }

  .create-pdf-bar {
    background: rgb(50, 54, 57);
    height: 48px;
  }

  .create-pdf-page {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: white;
  }

  .create-pdf-block {
    height: calc(100vh - 148px);
    overflow: auto;
  }

  .select-file-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .create-file {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .delete-file-btn-block.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-outer {
    margin-top: 2px !important;
    margin-bottom: 0%;
  }

  .create-tab-title {
    font-family: 'Sarabun', sans-serif;
  }

  .create-detail-block {
    height: calc(100vh - 252px);
    overflow: auto;
  }

  .create-setting-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
  }

  .create-setting {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .create-setting-input.v-text-field input {
    line-height: 24px !important;
  }

  .create-attach-file-block {
    padding-left: 0% !important;
  }

  .workflow-block {
    height: calc(100vh - 433px);
    overflow: auto;
  }

  .create-setting-dropdown-icon .theme--light.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
  }

  .create-setting-switch .v-input--selection-controls__input {
    height: 40px !important;
  }

  .add-step-btn {
    font-family: 'Sarabun', sans-serif;
    color: white !important;
  }

  .all-step-block {
    height: calc(100vh - 452px);
    overflow: auto;
  }

  .delete-step-btn {
    width: 18px !important;
    height: 18px !important;
  }

  .page-sign-box .v-select__slot {
    height: 32px;
  }

  .page-sign-box.v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot {
    min-height: 32px !important;
  }

  .page-sign-box.v-text-field--outlined.v-input--dense .v-label {
    top: 6px !important;
    font-size: 13px;
  }

  .page-sign-dropdown-icon.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
    margin-top: 5px !important;
  }

  .each-step-mail-row {
    padding-left: 3% !important;
  }

  .each-email-step-block {
    padding-bottom: 0% !important;
  }

  .each-email-icon.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-outer {
    margin-top: 4px !important;
    margin-bottom: 0px;
  }

  .email-step-box.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
    padding-left: 2% !important;
    padding-right: 0% !important;
  }

  .onechat-check {
    font-family: 'Sarabun', sans-serif;
  }

  .add-delete-permission-block {
    padding-bottom: 0% !important;
  }

  .delete-permission-btn {
    height: 27px !important;
    width: 27px !important;
  }

  .send-doc-btn {
    font-family: 'Sarabun', sans-serif;
    color: white !important;
  }

  /*========================================*/

  @media only screen and (max-width:600px){ /*css for mobile screen*/
    .create-doc-page {
      height: calc(100vh - 64px);
      overflow: auto;
    }

    .create-pdf-block {
      height: calc(100vh - 319px);
    }

    .create-detail-block {
      height: unset;
    }

    .create-attach-file-block {
      padding-left: 2% !important;
    }

    .workflow-block {
      height: unset;
    }

    .all-step-block {
      height: unset;
    }

    .each-step-mail-row {
      padding-left: 0% !important;
    }

    .each-email-step-block {
      padding-bottom: 3% !important;
    } 

    .add-delete-permission-block {
      padding-bottom: 5% !important;
    }

    .delete-permission-btn {
      height: 20px !important;
      width: 20px !important;
    }
  }
</style>