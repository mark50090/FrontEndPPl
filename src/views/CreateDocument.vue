<template>
  <div class="pt-1">
    <v-card outlined class="mb-1 mx-1 create-doc-page">
      <v-row class="create-row">
        <v-col cols="12" md="6" lg="6" class="pa-2 pdf-create-card-block">
          <v-overlay absolute opacity="0.3" :value="loading_pdf" class="load-pdf-block"> <!-- load pdf -->
            <img width="100px" src="../assets/loader.gif" class="load-pdf">
          </v-overlay>
          <v-card elevation="0" color="rgb(82, 86, 89)">
            <v-card-title class="pa-0 create-pdf-bar">
              <v-row class="create-row" v-if="uploadedFile"> <!-- show when it has pdf -->
                <v-spacer></v-spacer>
                <v-col cols="8" md="9" lg="9" align-self="center" class="py-2 text-center">
                  <v-btn icon x-small color="white" @click="change_page_fn('prev')">
                    <v-icon size="16">mdi-arrow-left</v-icon>
                  </v-btn>
                  <span class="mx-1 create-pdf-page">{{ page }} / {{ page_count }}</span>
                  <v-btn icon x-small color="white" @click="change_page_fn('next')">
                    <v-icon size="16">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="auto" md="auto" lg="auto" align-self="center" class="py-0 pr-2">
                  <v-btn icon large color="white" @click="gopdf()">
                    <v-icon large>mdi-text-box-search</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="px-1 pb-1">
              <v-row align="center" justify="center" class="mt-1 create-row create-pdf-block">
                <!-- pdf -->
                <div id="pdfBg_create">
                  <!-- pdf -->
                  <div style="position: relative; display: block">
                  <pdf
                    id="pdfDiv"
                    class="text-center"
                    :src="pdf_src"
                    @num-pages="updatePageCount"

                    @page-loaded="loaded"
                    :page="page"
                    ref="pdfComponent"
                  />
                  <template v-for="item in signArray">
                    <vue-draggable-resizable
                      :id="item.name"
                      v-if="item.action == 'Sign' || item.action == 'Sign-Ca'"
                      :key="item.key"
                      :x="item.sign_position_x"
                      :y="item.sign_position_y"
                      :w="item.sign_box_width" 
                      :h="item.sign_box_heigth"
                      @dragging="onDrag(item,...arguments)" 
                      @resizing="onResize(item,...arguments)"
                      :style="{
                        'background-color': 'rgba(83, 186, 71, 0.2)',
                        'display': item.show ? 'block' : 'none',
                        'cursor': 'move'
                        }"
                    >
                      <v-row no-gutters justify="center" align="center">
                        <span style="color: grey">
                          {{textLang.No}} {{ item.sign_queue_no }}
                        </span>
                      </v-row>
                    </vue-draggable-resizable>
                  </template>
                </div>
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <v-row class="create-row">
            <v-col cols="3" md="auto" lg="auto" align-self="center" class="pl-0 pt-2 select-file-title">
              {{textLang.selectfile}} :
            </v-col>
            <v-col cols="9" md="" lg="" class="px-0 pt-2">
              <v-file-input dense outlined hide-details color="#67C25D" truncate-length="60" :placeholder="textLang.selectfilea" prepend-icon="" :clearable="false" accept="application/pdf" v-model="uploadedFile" @change="inputFile" class="create-file delete-file-btn-block">
                <template v-slot:append-outer>
                  <v-btn icon :disabled="!uploadedFile" color="#424242" @click="clearUploadedFile"> <!-- delete pdf button -->
                    <v-icon size="28px">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
          <v-card outlined class="mt-1">
            <v-form v-model="isFormValid">
            <v-overlay absolute opacity="0.5" color="white" :value="!uploadedFile"></v-overlay> <!-- overlay show when it doesn't has document file -->
            <v-card-title class="pa-0">
              <v-tabs grow height="40px" color="#4CAF50" v-model="create_tab">
                <v-tab class="create-tab-title">{{textLang.setupsending}}</v-tab>
                <v-tab class="create-tab-title">{{textLang.approvalform}}</v-tab>
                <v-tab class="create-tab-title">{{textLang.custom}}</v-tab>
              </v-tabs>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="px-2 pt-0 pb-2 create-detail-block">
              <v-tabs-items v-model="create_tab">
                <!-- document setting tab -->
                <v-tab-item>
                  <v-row class="create-row">
                    <v-col cols="4" md="3" lg="3" align-self="center" class="pl-2 pr-1 pt-4 create-setting-title">
                      {{textLang.documentname}} :
                    </v-col>
                    <v-col cols="8" md="9" lg="9" align-self="center" class="px-0 pt-4">
                      <v-text-field dense outlined hide-details color="#4CAF50" class="create-setting create-setting-input" v-model="documentName"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="4" md="3" lg="3" align-self="center" class="pl-2 pt-0 create-setting-title">
                      {{textLang.message}} :
                    </v-col>
                    <v-col cols="8" md="9" lg="9" align-self="center" class="px-0 pt-0">
                      <v-text-field dense outlined hide-details color="#4CAF50" class="create-setting create-setting-input" v-model="documentComment"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="12" md="3" lg="3" class="pl-2 pt-2 create-setting-title">
                      {{textLang.attachfile}} :
                    </v-col>
                    <v-col cols="12" md="9" lg="9" class="pr-0 pt-0 create-attach-file-block">
                      <v-file-input dense outlined multiple counter show-size chips small-chips color="#4CAF50" prepend-icon="" append-outer-icon="$file" :placeholder="textLang.selectattachment" class="create-setting" v-model="attachedFile">
                        <template v-slot:selection="{ text }">
                          <v-chip small dark close color="#4CAF50">{{ text }}</v-chip>
                        </template>
                      </v-file-input>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <!-- select work flow tab -->
                <v-tab-item >
                  <v-row class="create-row">
                    <v-col cols="5" md="4" lg="4" align-self="center" class="pl-2 pb-0 create-setting-title">
                      {{textLang.documenttype}} :
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-autocomplete :no-data-text="loading_list_text" :loading="loading_type" v-model="selected_document_type" :items="document_type_list" item-text="document_type_detail.name" item-value="_id" return-object @change="getDocumentTemplate" dense outlined hide-details auto-select-first color="#4caf50" :placeholder="textLang.choose" append-icon="mdi-chevron-down" class="create-setting create-setting-input email-step-box create-setting-dropdown-icon"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="create-row">
                    <v-col cols="5" md="4" lg="4" align-self="center" class="pl-2 pb-0 create-setting-title">
                      {{textLang.documentformat}} : 
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-autocomplete  :no-data-text="loading_list_text" :loading="loading_template" v-model="selected_document_template" :items="document_template_list" item-text="name" item-value="_id" return-object @change="getFlowData" dense outlined hide-details auto-select-first color="#4caf50" :placeholder="textLang.choose" append-icon="mdi-chevron-down" :disabled="false" :filled="false" class="create-setting create-setting-input email-step-box create-setting-dropdown-icon"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="create-row" v-if="false"> <!-- department row. Show when document type and document style are selected -->
                    <v-col cols="5" md="4" lg="4" align-self="center" class="pl-2 pb-0 create-setting-title">
                      {{textLang.linedepartment}} :
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-autocomplete dense outlined hide-details auto-select-first color="#4caf50" :placeholder="textLang.specifydepartment" append-icon="mdi-chevron-down" class="create-setting create-setting-input email-step-box create-setting-dropdown-icon"></v-autocomplete> <!-- when it has many departments -->
                      <!-- <span class="create-setting-title">การเงินและธุรการ</span> --> <!-- when it has only one department -->
                    </v-col>
                  </v-row>
                  <v-row class="create-row" v-if="is_password">
                    <v-col cols="5" md="4" lg="4" align-self="start" class="pl-2 pr-1 pt-5 pb-0 create-setting-title">
                      {{ textLang.pdf_password_title }} :
                    </v-col>
                    <v-col cols="7" md="8" lg="8" class="px-0 pb-0">
                      <v-text-field dense outlined color="#4caf50" :rules="[() => !!pdf_password || textLang.alert_pdf_password]" v-model="pdf_password" :error="pdf_password == ''" class="create-setting create-setting-input message-pdf-password"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card outlined class="mt-4 px-2 pb-2 workflow-block">
                    <template  v-for="flow_data in flow_datas" >
                      <v-row class="create-row" :key="flow_data.index">
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pb-2 create-setting-title">
                          {{textLang.number}} {{ flow_data.index+1 }} : {{ translate(flow_data.action) }} <!-- or ผู้มีสิทธิ์เซ็น -->
                        </v-col>
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pr-0 pb-2"> <!-- show when it is sign step -->
                          <v-switch disabled dense inset hide-details class="mt-0 pt-0 create-switch-ca" v-model="flow_data.switch_ca" @change="isDirty = true">
                            <template v-slot:label>
                              <span class="create-switch-ca-label">Certificate (CA)</span>
                            </template>
                          </v-switch>
                        </v-col>
                      </v-row>
                      <template v-if="flow_data.actor[0].permission_email_status">
                        <v-row class="create-row each-step-mail-row" v-for="(actor_email,index) in flow_data.actor[0].permission_email" :key="flow_data.index + actor_email.account_id"> <!-- each email row in step -->
                          <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0">
                            <!-- <v-text-field dense outlined hide-details color="#67C25D" v-model="actor_email.thai_email" :error="actor_email.thai_email == ''" placeholder="@one.th" class="create-setting email-step-box each-email-icon" @change="isDirty = true">
                              <template v-slot:prepend>
                                <v-icon large>mdi-account</v-icon>
                              </template>
                            </v-text-field> -->
                            <v-combobox dense outlined hide-details auto-select-first no-data color="#67C25D" v-model="actor_email.thai_email" :error="actor_email.thai_email == ''" @input.native="actor_email.thai_email=$event.srcElement.value" append-icon="mdi-magnify" @click:append="search_citizen(actor_email.thai_email)" placeholder="@one.th" class="create-setting email-step-box each-email-icon email-search-icon" @keyup.enter="search_citizen(actor_email.thai_email)" @keyup="getEmail=[]" :items="getEmail" @change="isDirty = true,getEmail=[]">
                              <template v-slot:prepend>
                                <v-icon large>mdi-account</v-icon>
                              </template>
                            </v-combobox>
                          </v-col>
                          <!-- <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 pt-1 pb-0">
                            <v-checkbox hide-details label="OneChat" v-model="actor_email.checkbox" checked class="mt-0 pt-0 onechat-check"></v-checkbox>
                          </v-col> -->
                          <v-col v-if="flow_data.actor[0].permission_email.length > 1" cols="auto" md="auto" lg="auto" align-self="center" class="pl-2 pr-0 pt-1 pb-0">
                            <v-btn outlined fab x-small color="#67C25D" class="delete-permission-btn" @click="removeActorFlow(flow_data.index,actor_email),getEmail=[]">
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>
                          </v-col>
                          <v-col v-if="index == flow_data.actor[0].permission_email.length-1" cols="auto" md="auto" lg="auto" align-self="center" class="pl-2 pr-0 pt-1 pb-0">
                            <v-btn depressed fab x-small dark color="#67C25D" class="delete-permission-btn" @click="addActorFlow(flow_data.index),getEmail=[]">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </template>
                      <template v-else-if="flow_data.actor[0].permission_status">
                        <v-row class="create-row each-step-mail-row" v-for="actor_role in flow_data.actor[0].permission" :key="flow_data.index + actor_role.role_id"> <!-- each email row in step -->
                          <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0">
                            <v-text-field dense outlined hide-details readonly filled disabled color="#67C25D" v-model="actor_role.role_name" class="create-setting email-step-box each-email-icon">
                              <template v-slot:prepend>
                                <v-icon large>mdi-account</v-icon>
                              </template>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </template>
                      <template v-else-if="flow_data.actor[0].permission_sender_status">
                        <v-row class="create-row each-step-mail-row" v-for="actor_sender in flow_data.actor[0].permission_sender" :key="actor_sender.account_id"> <!-- each email row in step -->
                          <v-col cols="9" md="10" lg="10" class="px-0 pt-1 pb-0">
                            <v-text-field dense outlined hide-details readonly filled disabled color="#67C25D" placeholder="ผู้ส่งเอกสาร" class="create-setting email-step-box each-email-icon">
                              <template v-slot:prepend>
                                <v-icon large>mdi-account</v-icon>
                              </template>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </template>
                    </template>
                  </v-card>
                </v-tab-item>
                <!-- custom work flow tab -->
                <v-tab-item>
                  <v-row class="create-row">
                    <v-col cols="12" md="4" lg="4" align-self="center" class="pl-2 pt-4 pb-0 create-setting-title">
                      {{textLang.documenttype}} :
                    </v-col>
                    <v-col cols="12" md="8" lg="8" align-self="center" class="pr-0 pt-4 pb-0 create-attach-file-block">
                      <v-autocomplete :no-data-text="loading_list_text" :loading="loading_type" v-model="selected_document_type_custom" :items="document_type_list" item-text="document_type_detail.name" item-value="_id" return-object dense outlined hide-details auto-select-first color="#4caf50" :placeholder="textLang.choose" append-icon="mdi-chevron-down" class="create-setting create-setting-input create-setting-dropdown-icon"></v-autocomplete>
                    </v-col>
                  </v-row>
                  <!-- <v-row class="create-row">
                    <v-col cols="7" md="4" lg="4" align-self="center" class="pl-2 pr-1 pt-1 pb-0 create-setting-title">
                      Require Certificate (CA) :
                    </v-col>
                    <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 pt-1 pb-0">
                      <v-switch inset v-model="switchCA" hide-details class="mt-0 create-setting-switch"></v-switch>
                    </v-col>
                  </v-row> -->
                  <!-- <v-row class="create-row">
                    <v-col cols="7" md="4" lg="4" align-self="center" class="pl-2 pr-1 pt-1 pb-0 create-setting-title">
                      Stamp All Page :
                    </v-col>
                    <v-col cols="5" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 pt-1 pb-0">
                      <v-switch inset hide-details v-model="switchStamp" class="mt-0 create-setting-switch"></v-switch>
                    </v-col>
                  </v-row> -->
                  <v-row class="create-row">
                    <v-col cols="12" md="4" lg="4" align-self="start" class="pl-2 pt-6 pb-0 create-setting-title">
                      {{ textLang.pdf_password_title }} :
                    </v-col>
                    <v-col cols="12" md="8" lg="8" align-self="center" class="pr-0 pt-4 pb-0 create-attach-file-block">
                      <v-text-field v-model='pdf_password_custom' @input="inputPassword()" dense outlined persistent-hint color="#4caf50" hint="optional" class="create-setting create-setting-input"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row justify="center" class="create-row">
                    <v-col cols="5" md="4" lg="4" class="pl-0 pr-1 pb-2">
                      <v-btn small block color="#67C25D" :disabled="!selected_document_type_custom" @click="addPersonApprove" class="add-step-btn">
                        <v-icon small class="mr-1">mdi-plus</v-icon> {{textLang.addapprove}}
                      </v-btn>
                    </v-col>
                    <v-col cols="5" md="4" lg="4" class="pl-0 pr-1 pb-2">
                      <v-btn small block color="#67C25D" :disabled="!selected_document_type_custom" @click="addPersonSign" class="add-step-btn">
                        <v-icon small class="mr-1">mdi-plus</v-icon> {{textLang.addsign}}
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-card outlined class="pa-2 all-step-block">
                    <div v-for="(flow_data_custom,index) in flow_datas_custom" :key="flow_data_custom.index" class="mb-3"> <!-- each step -->
                      <v-row align="center" class="create-row">
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 py-1 create-setting-title">
                          {{textLang.number}} {{index+1}} : {{ translate(flow_data_custom.action) }} <!-- ผู้มีสิทธิ์อนุมัติ or ผู้มีสิทธิ์เซ็น -->
                        </v-col>
                        <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-2 pr-1 py-1">
                          <v-btn outlined fab x-small color="error" class="px-0 delete-step-btn" @click="deleteActionFlow(flow_data_custom,flow_data_custom.action)"> <!-- delete step button -->
                            <v-icon small>mdi-minus</v-icon>
                          </v-btn>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col v-if="flow_data_custom.action == 'Sign'" cols="auto" md="auto" lg="auto" align-self="center" class="py-1 pl-0 pr-2 display-pc-only"> <!-- select CA for PC screen and show when it is sign step-->
                          <v-switch dense inset hide-details class="mt-0 pt-0 create-switch-ca" v-model="flow_data_custom.switch_ca">
                            <template v-slot:label>
                              <span class="create-switch-ca-label">Certificate (CA)</span>
                            </template>
                          </v-switch>
                        </v-col>
                        <v-col v-if="flow_data_custom.action == 'Sign'" cols="auto" md="auto" lg="auto" align-self="center" class="pt-0 pb-1 pl-0 pr-2 display-mobile-only"> <!-- select CA for mobile screen and show when it is sign step-->
                          <v-row class="create-row create-ca-title">
                            Certificate
                          </v-row>
                          <v-row class="pl-1 create-row">
                            <v-switch dense inset hide-details class="mt-0 pt-0 create-switch-ca" v-model="flow_data_custom.switch_ca"></v-switch>
                          </v-row>
                        </v-col>
                        <template v-if="flow_data_custom.action == 'Sign'"> <!-- show when it is sign step -->
                          <v-col cols="auto" md="auto" lg="auto" align-self="center" class="pl-1 pr-2 py-1 create-setting-title display-pc-only">
                            {{textLang.signingpage}}
                          </v-col>
                          <v-col cols="3" md="2" lg="2" class="px-0 py-1">
                            <v-select multiple outlined dense hide-details :label="textLang.page" color="#67C25D" item-color="#67C25D" @change="reShowSign" append-icon="mdi-chevron-down" :menu-props="{ bottom: true, offsetY: true }" :items="pdf_page_list" v-model="flow_data_custom.page" item-value="value" item-text="text" class="create-setting page-sign-box page-sign-dropdown-icon create-setting-dropdown-icon">
                              <template v-slot:selection="{ item, index }">
                                <span v-if="flow_data_custom.page.length == pdf_page_list.length && index == 0">{{textLang.all}}</span>
                                <span v-if="flow_data_custom.page.length != pdf_page_list.length">{{item.value}}{{index != flow_data_custom.page.length-1 ? ',':''}}</span>
                              </template>
                              <template v-slot:prepend-item>
                                <v-list-item ripple @click="togglePage(index)">
                                  <v-list-item-action>
                                    <v-icon :color="pdf_page_list.length > 0 ? '#0F3852' : ''">
                                      {{ getIcon(flow_data_custom.page) }}
                                    </v-icon>
                                  </v-list-item-action>
                                  <v-list-item-content>
                                    <v-list-item-title class="all-page-select-list">
                                      {{textLang.all}}
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                                <v-divider class="mt-2"></v-divider>
                              </template>
                            </v-select>
                          </v-col>
                        </template>
                      </v-row>
                      <v-row class="create-row each-step-mail-row" v-for="(actor_email,index) in flow_data_custom.actor.permission_email" :key="flow_data_custom.index + actor_email.id"> <!-- each email row in step -->
                        <v-col cols="9" md="10" lg="10" class="px-0 pt-1 each-email-step-block">
                          <!-- <v-text-field dense outlined hide-details color="#67C25D" placeholder="@one.th" v-model="actor_email.thai_email" :error="actor_email.thai_email == ''" class="create-setting email-step-box each-email-icon">
                            <template v-slot:prepend>
                              <v-icon large>mdi-account</v-icon>
                            </template>
                          </v-text-field> -->
                          <v-combobox dense outlined hide-details auto-select-first color="#67C25D" append-icon="mdi-magnify" @click:append="search_citizen_custom(actor_email.thai_email)" @input.native="actor_email.thai_email=$event.srcElement.value" @keyup.enter="search_citizen_custom(actor_email.thai_email)" @keyup="getEmail=[]" :items="getEmail" placeholder="@one.th" v-model="actor_email.thai_email" :error="actor_email.thai_email == ''" class="create-setting email-step-box each-email-icon email-search-icon" @change="getEmail=[]">
                            <template v-slot:prepend>
                              <v-icon large>mdi-account</v-icon>
                            </template>
                          </v-combobox>
                        </v-col>
                        <!-- <v-col cols="5" md="5" lg="5" align-self="center" class="pa-0">
                          <v-row class="create-row ">
                            <v-col cols="12" md="auto" lg="auto" align-self="center" class="pl-1 pr-0 py-0">
                              <v-checkbox hide-details label="OneChat" v-model="actor_email.checkbox" class="mt-0 pt-0 onechat-check"></v-checkbox>
                            </v-col> -->
                        <v-col v-if="flow_data_custom.actor.permission_email.length > 1" cols="auto" md="auto" lg="auto" align-self="center" class="pt-1 pl-2 pr-0 add-delete-permission-block"> <!-- delete email in each step button -->
                          <v-btn outlined fab x-small color="#67C25D" class="delete-permission-btn" @click="removeActor(flow_data_custom.index,actor_email),getEmail=[]">
                            <v-icon>mdi-minus</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col v-if="index == flow_data_custom.actor.permission_email.length-1" cols="auto" md="auto" lg="auto" align-self="center" class="pt-1 pl-2 pr-0 add-delete-permission-block"> <!-- add email in each step button -->
                          <v-btn depressed fab x-small dark color="#67C25D" class="delete-permission-btn" @click="addActor(flow_data_custom.index),getEmail=[]">
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </v-col>
                          <!-- </v-row>
                        </v-col> -->
                      </v-row>
                    </div>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
            </v-form>
          </v-card>
          <v-row v-if="(create_tab == 1) || (create_tab == 2)" justify="end" class="create-row">
            <v-col cols="auto" md="auto" lg="auto" class="pt-1">
              <v-btn depressed color="#67C25D" :disabled="(!selected_document_template) && (!selected_document_type_custom) || !isFormValid || !uploadedFile" class="send-doc-btn" @click="getDetailbyEmail">{{textLang.senddocuments}}</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <Showpdf/>
  </div>
</template>

<script>
import { EventBus } from '../EventBus'
import Showpdf from '../components/ShowPdf'
import pdf from 'vue-pdf'
import vueSignature from 'vue-signature'
import VueDraggableResizable from 'vue-draggable-resizable'

  export default {
    components: {
      Showpdf,
      pdf,
      vueSignature,
      VueDraggableResizable
    },
    computed: {
      textLang() {
        return this.$store.getters.textLang.CreateDocument
      },
      loading_list_text(){
        return this.textLang[this.loading_list_langkey]
      }
    },
    data: () => ({
      create_tab: null,
      pdf_page_list: [],
      pdf_src: undefined,
      page_count: 0,
      page: 1,
      signArray: [],
      uploadedFile: undefined,
      loading_pdf: false,
      sign_position: [],
      allStatus: [true, true, true, true],
      default_sign: '',
      padStatus: false,
      step_flow: [],
      doc_details: {},
      selected_document_type: '',
      selected_document_type_custom: '',
      document_type_list: [],
      selected_document_template: '',
      document_template_list: [],
      pdf_password: '',
      pdf_password_custom: '',
      actionOrder: 1,
      action: '',
      flow_datas: [],
      flow_datas_custom: [],
      flow_id: '',
      last_step: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      eventMouse: false,
      indexEventMouse: 0,
      allEmployeeInfo: [],
      switchStamp: false,
      switchCA: false,
      isFormValid: false,
      loading_list_langkey: '',
      loading_template: false,
      loading_type: false,
      isDirty: false,
      documentName: '',
      documentComment: '',
      attachedFile: [],
      actor_email: [],
      is_password: false,
      is_password_custom: false,
      getEmail: [],
    }),
    mounted() {
      this.getDocumentType()
      EventBus.$on('changeBiz', this.changeBiz)
    },
    beforeDestroy () {
      EventBus.$off('changeBiz')
    },
    watch:{
      "create_tab"(newValue,oldValue){
        if ((newValue == 1 && oldValue == 2) || (newValue == 2 && oldValue == 1)) 
            this.clearTabData()
        },
        pdf_src(val) {
          if(val) {
            this.checkValidPDF()
          }
        }
    },
    methods: {
      translate(keyword){
        switch (keyword){
          case "Sign" : return this.textLang.authorizedsignatory
          case "Sign-Ca" : return this.textLang.authorizedsignatory
          case "Approve" : return this.textLang.Authorizedperson
          case "Fill" : return this.textLang.fill_permission
          default: return keyword 
        }
      },
      changeBiz(){
        this.getDocumentType()
        this.selected_document_template = ''
        this.selected_document_type_custom = ''
        this.flow_datas = []
        this.flow_datas_custom = []
        this.signArray = []
      },
      onResize: function (item, x, y, width, height) {
        var clientWidth = $('#pdfDiv')[0].getBoundingClientRect().width
        var clientHeight = $('#pdfDiv')[0].getBoundingClientRect().height
        item.sign_llx = (x / clientWidth).toFixed(3)
        item.sign_lly = (-(y+item.sign_box_heigth) / clientHeight).toFixed(3)
        item.sign_urx = (width / clientWidth).toFixed(3)
        item.sign_ury = (height / clientHeight).toFixed(3)
        item.sign_position_x = x
        item.sign_position_y = y
        item.sign_box_heigth = height
        item.sign_box_width = width
        this.isDirty = true
      },
      onDrag: function (item, x, y) {
        var clientWidth = $('#pdfDiv')[0].getBoundingClientRect().width
        var clientHeight = $('#pdfDiv')[0].getBoundingClientRect().height
        item.sign_llx = (x / clientWidth).toFixed(4)
        item.sign_lly = (-(y+item.sign_box_heigth) / clientHeight).toFixed(4)
        item.sign_position_x = x
        item.sign_position_y = y
        this.isDirty = true
      },
      getIcon(page){
        if (page.length == this.pdf_page_list.length) return 'mdi-close-box'
        if (page.length > 0) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
      togglePage(index){
        this.$nextTick(() => {
          if (this.chooseAllPage()[index]) {
            this.flow_datas_custom[index].sign.sign_page = [];
          } else {
            this.flow_datas_custom[index].sign.sign_page = this.pdf_page_list.slice().map(x=>x.value)
          }
        });
      },
      chooseAllPage() {
        let arr = [];
        for (let index = 0; index < this.flow_datas_custom.length; index++) {
          const element = this.flow_datas_custom[index].sign?.sign_page || 0
          arr.push(this.pdf_page_list.length === element.length);
        }
        return arr;
      },
      emitLoading(isLoad) {
        EventBus.$emit('loadingOverlay', isLoad)
      },
      clearUploadedFile(){
        this.uploadedFile = undefined
        this.pdf_src = undefined
        this.signArray = []
        this.flow_datas_custom = []
        this.flow_datas = []
        this.selected_document_template = ''
        this.selected_document_type = ''
        this.is_password = false
        this.isDirty = false
      },
      async getDocumentType(){
        this.loading_type = true
        this.loading_list_langkey = 'Fetching'
        this.document_type_list = []
        try {
          var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
          var url = `/doctype/api/v1?tax_id=`
          var {data} = await this.axios.get(this.$api_url + url + tax_id)
          if(data.status) {
            data.data.forEach(element => {
              this.document_type_list.push(element)
            });
          }
        } catch (error) {
          console.log(error);
        }
        this.loading_list_langkey = 'noinformationfound'
        this.loading_type = false
      },
      async getDocumentTemplate(){
        this.document_template_list = []
        this.selected_document_template = ''
        this.signArray = []
        this.flow_datas = []
        this.isDirty = false
        this.loading_list_langkey = 'Fetching'
        this.loading_template = true
        try {
          var url = `/flowdata/api/v1/getbydocID?document_type_id=${this.selected_document_type._id}`
          var {data} = await this.axios.get(this.$api_url + url)
          if(data.status){
            data.data.forEach(element => {
              this.document_template_list.push(element)
            });
          }
        } catch (error) {
          console.log(error);
        }
        this.loading_template = false
        this.loading_list_langkey = 'noinformationfound'
      },
      async getFlowData(){
        this.emitLoading(true)
        this.signArray = []
        try {
          if(this.selected_document_template){
            var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
            var url = `/flowdata/api/v1/get1/?_id=${this.selected_document_template._id}&tax_id=${tax_id}&no_base=true`
            var {data} = await this.axios.get(this.$api_url + url)
            if(data.status){
              if (data.data.is_password) this.is_password = true
              else this.is_password = false
              for (let index = 0; index < this.page_count; index++) {
                this.pdf_page_list.push({text:index+1,value:index+1})
              }
              this.flow_id = data.data._id
              this.flow_datas = [...data.data.flow_data]
              this.flow_datas.forEach(flow_data => {
                if(!flow_data.actor[0].permission_email.length){
                  flow_data.actor[0].permission_email = [{account_id : new Date().getTime()}]
                }
                if(flow_data.action == 'Sign-Ca') flow_data.switch_ca = true
                else flow_data.switch_ca = false
                if(flow_data.actor[0].permission_status) this.permission_role_email = 'role'
                if(flow_data.actor[0].permission_email_status) this.permission_role_email = 'email'
                flow_data.approver.sign_position.action = flow_data.action
                this.signArray.push(flow_data.approver.sign_position)
              })
              this.signArray.forEach((element,index) => {
                element.sign_queue_no = index+1
              })
              this.loaded()
            }
          }
          else{
            this.flow_datas = []
          }
        } catch (error) {
          console.log(error);
        }
        this.emitLoading(false)
      },
      inputPassword(){
        if(this.pdf_password_custom != '') this.is_password_custom = true
        else this.is_password_custom = false
      },
      async uploadFiles() {
      let formData = new FormData()
      this.attachedFile.forEach(e => {
        formData.append("file", e)
      })
      formData.append("transaction_id", this.transaction_id)
      try {
        var { data } = await this.axios.post(this.$api_url + "/file-component/api/saveFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        if(data.status) {

        } else {
            
        }
        } catch (error) {
          console.log(error);
        }
      },
      async getDetailbyEmail(){
        this.actor_email = []
        if(this.create_tab == 1){
          this.flow_datas.forEach(ele => {
            if(!ele.actor[0].permission_email[0].thai_email){
              return
            }else{
              ele.actor[0].permission_email.forEach(el => {
                this.actor_email.push(el.thai_email)
              })
            }
          })
        }else{
          this.flow_datas_custom.forEach((ele) => {
            ele.actor.permission_email.forEach(el => {
              this.actor_email.push(el.thai_email)
            })
          })
        }
        try {
          this.emitLoading(true)
          var url = '/citizen/api/v1/check_citizen_email'
          var {data} = await this.axios.post(this.$api_url + url,{
            email: this.actor_email
          })
          if(data.status){
            this.emitLoading(false)
            this.user_detail = data.result.map(el => {
              if(el.valid) return el
              else return undefined 
            })
            if(this.user_detail.includes(undefined)) {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">'+ this.textLang.fail+'</strong>',
                text: this.textLang.alert_email_data,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 5000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            }
            else this.addTransaction()
          }
        } catch (error) {
          console.log(error);
          this.emitLoading(false)
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">'+ this.textLang.fail+'</strong>',
            text: this.textLang.alert_email_data,
            showCloseButton: true,
            showConfirmButton: false,
            timer: 5000,
            customClass: {
              popup: 'alert-card',
              title: 'alert-title-block',
              closeButton: 'close-alert-btn',
              htmlContainer: 'alert-text-block'
            }
          })
        }
      },
      async checkValidPDF() {
        try {
          var url = this.$api_url + '/transaction/api/v1/checkValidPdf'
          var {data} = await this.axios.post(url, {
            "pdfData": this.pdf_src.slice(28),
          })
          if(data.status) {
            if(!data.data) {
              this.clearUploadedFile()
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">'+ this.textLang.fail+'</strong>',
                text: "Invalid PDF",
                showCloseButton: true,
                showConfirmButton: false,
                timer: 5000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            }
          }
        } catch(e) {
          console.log(e)
        }
      },
      async addTransaction(){
        try {
          this.emitLoading(true)
          if(this.create_tab == 1){
            var flow_data = this.flow_datas.map(xyz => {
              if(xyz.actor[0].permission_email_status){
                return {
                  "actor": [
                    {
                      "permission_status": false,
                      "permission": [],
                      "permission_email_status": true,
                      "permission_email": xyz.actor[0].permission_email.map((yz,index) => {
                        var result = []
                        result = this.user_detail.filter(ele => {
                          if((ele.data.thai_email == yz.thai_email.trim()) || 
                          (ele.data.thai_email2 == yz.thai_email.trim()) || 
                          (ele.data.thai_email3 == yz.thai_email.trim()))
                          return ele
                        })
                        result = [...new Set(result)]
                        if(!result.length) {
                          this.user_detail.forEach(ele => {
                            ele.data.email.forEach(e => {
                              if(e.email == yz.thai_email.trim()){
                                result.push(ele)
                              }
                            })
                            if(ele.data.business_mail){
                              ele.data.business_mail.forEach(e =>{
                                if(e.email == yz.thai_email.trim()){
                                  result.push(ele)
                                }
                              })
                            }
                          })
                        }
                        var res_data = result[0].data
                        return {
                          account_id : res_data.id,
                          first_name_th: res_data.first_name_th,
                          last_name_th: res_data.last_name_th,
                          first_name_eng: res_data.first_name_eng,
                          last_name_eng: res_data.last_name_eng,
                          account_title_th: res_data.account_title_th,
                          account_title_eng: res_data.account_title_eng,
                          thai_email: res_data.thai_email,
                          detp_id: null,
                          role_id: null,
                          dept_name: null,
                          role_name: null
                        }
                      })
                    }
                  ],
                  "approver": {
                    "account_id": null,
                    "first_name_th": null,
                    "last_name_th": null,
                    "first_name_eng": null,
                    "last_name_eng": null,
                    "account_title_th": null,
                    "account_title_eng": null,
                    "thai_email": null,
                    "detp_id": null,
                    "role_id": null,
                    "dept_name": null,
                    "role_name": null,
                    "status": "Incomplete",
                    "sign_position": xyz.action=='Sign'? {
                      "sign_llx": xyz.approver.sign_position.sign_llx,
                      "sign_lly": xyz.approver.sign_position.sign_lly,
                      "sign_urx": xyz.approver.sign_position.sign_urx,
                      "sign_ury": xyz.approver.sign_position.sign_ury,
                      "sign_page": this.switchStamp == true? 'all': xyz.approver.sign_position.sign_page
                    }: undefined
                  },
                  "action": xyz.switch_ca == true && xyz.action == 'Sign'? 'Sign-Ca' : xyz.action,
                  "status": "W",
                  "index": xyz.index
                }
              }else if(xyz.actor[0].permission_status){
                return{
                  "actor": [
                    {
                      "permission_status": true,
                      "permission": xyz.actor[0].permission.map(yz => ({
                        "dept_id": null,
                        "dept_name": null,
                        "role_id": yz.role_id,
                        "role_level": yz.role_level,
                        "role_name": yz.role_name,
                      })),
                      "permission_email_status": false,
                      "permission_email": []
                    }
                  ],
                  "approver": {
                    "account_id": null,
                    "first_name_th": null,
                    "last_name_th": null,
                    "first_name_eng": null,
                    "last_name_eng": null,
                    "account_title_th": null,
                    "account_title_eng": null,
                    "thai_email": null,
                    "detp_id": null,
                    "role_id": null,
                    "dept_name": null,
                    "role_name": null,
                    "status": "Incomplete",
                    "sign_position": xyz.action=='Sign'? {
                      "sign_llx": xyz.approver.sign_position.sign_llx,
                      "sign_lly": xyz.approver.sign_position.sign_lly,
                      "sign_urx": xyz.approver.sign_position.sign_urx,
                      "sign_ury": xyz.approver.sign_position.sign_ury,
                      "sign_page": this.switchStamp == true? 'all': xyz.approver.sign_position.sign_page
                    }: undefined
                  },
                  "action": xyz.switch_ca == true && xyz.action == 'Sign'? 'Sign-Ca' : xyz.action,
                  "status": "W",
                  "index": xyz.index
                }
              }else if(xyz.actor[0].permission_sender_status){
                return{
                  "actor": [
                    {
                      "permission_status": false,
                      "permission": [],
                      "permission_email_status": false,
                      "permission_email": [],
                      "permission_sender_status": true,
                      "permission_sender":{
                        "account_id": null,
                        "account_title_eng": null,
                        "account_title_th": null,
                        "first_name_eng": null,
                        "first_name_th": null,
                        "last_name_eng": null,
                        "last_name_th": null,
                        "thai_email": null
                      }
                    }
                  ],
                  "approver": {
                    "account_id": null,
                    "first_name_th": null,
                    "last_name_th": null,
                    "first_name_eng": null,
                    "last_name_eng": null,
                    "account_title_th": null,
                    "account_title_eng": null,
                    "thai_email": null,
                    "detp_id": null,
                    "role_id": null,
                    "dept_name": null,
                    "role_name": null,
                    "status": "Incomplete",
                    "sign_position": xyz.action=='Sign'? {
                      "sign_llx": xyz.approver.sign_position.sign_llx,
                      "sign_lly": xyz.approver.sign_position.sign_lly,
                      "sign_urx": xyz.approver.sign_position.sign_urx,
                      "sign_ury": xyz.approver.sign_position.sign_ury,
                      "sign_page": this.switchStamp == true? 'all': xyz.approver.sign_position.sign_page
                    }: undefined
                  },
                  "action": xyz.switch_ca == true && xyz.action == 'Sign'? 'Sign-Ca' : xyz.action,
                  "status": "W",
                  "index": xyz.index,
                }
              }
            })
            if(this.isDirty){
              var body = {
                flow_id: this.flow_id,
                file_name: this.uploadedFile.name,
                pdfbase: this.pdf_src.slice(28),
                email_change: this.isDirty,
                flow_data: flow_data,
                object_text : {
                  subject : this.documentName, //ชื่อไฟล์
                  message : this.documentComment //ข้อความ
                },
                is_password : this.is_password,
                password: this.pdf_password,
              }
            }else{
              var body = {
                flow_id: this.flow_id,
                file_name: this.uploadedFile.name,
                pdfbase: this.pdf_src.slice(28),
                object_text : {
                  subject : this.documentName, //ชื่อไฟล์
                  message : this.documentComment //ข้อความ
                },
                is_password : this.is_password,
                password: this.pdf_password,
              }
            }
          }else if(this.create_tab == 2){
            // var info = this.$store.state.allEmployeeInfo
            var flow_data = this.flow_datas_custom.map(xyz => ({
              "status_implement": false,
              "input_status": false,
              "form_input": {
                  "status": false,
                  "form_id": ""
              },
              "self": false,
              "require": {
                  "attachment": false
              },
              "condition": {
                  "status": false,
                  "condition_id": null
              },
              //ตรงนี้ กำหนดคนเซ็น
              "actor": [
                  {
                      //ถ้าเป็น Role
                      "permission_status": false,
                      "permission": [],
                      //ถ้ารายคนใส่ตรงนี้
                      "permission_email_status": true,
                      "permission_email": 
                      xyz.actor.permission_email.map(yz => {
                        var result = []
                        // var result = this.user_detail.find(ele => ele.data.thai_email == yz.thai_email)
                        result = this.user_detail.filter(ele => {
                          if((ele.data.thai_email == yz.thai_email.trim()) || 
                          (ele.data.thai_email2 == yz.thai_email.trim()) || 
                          (ele.data.thai_email3 == yz.thai_email.trim()))
                          return ele
                        })
                        result = [...new Set(result)]
                        if(!result.length) {
                          this.user_detail.forEach(ele => {
                            ele.data.email.forEach(e => {
                              if(e.email == yz.thai_email.trim()){
                                result.push(ele)
                              }
                            })
                            if(ele.data.business_mail){
                              ele.data.business_mail.forEach(e =>{
                                if(e.email == yz.thai_email.trim()){
                                  result.push(ele)
                                }
                              })
                            }
                          })
                        }
                        var res_data = result[0].data
                        return {
                          account_id : res_data.id,
                          first_name_th: res_data.first_name_th,
                          last_name_th: res_data.last_name_th,
                          first_name_eng: res_data.first_name_eng,
                          last_name_eng: res_data.last_name_eng,
                          account_title_th: res_data.account_title_th,
                          account_title_eng: res_data.account_title_eng,
                          thai_email: res_data.thai_email
                        }
                      })
                  }
              ],
              "approver": {
                  "account_id": null,
                  "first_name_th": null,
                  "last_name_th": null,
                  "first_name_eng": null,
                  "last_name_eng": null,
                  "account_title_th": null,
                  "account_title_eng": null,
                  "thai_email": null,
                  "detp_id": null,
                  "role_id": null,
                  "dept_name": null,
                  "role_name": null,
                  "status": "Incomplete",
                  //ตำแหน่งลายเซ็น
                  "sign_position": xyz.action=='Sign'? {
                      "sign_llx": xyz.sign.sign_llx,
                      "sign_lly": xyz.sign.sign_lly,
                      "sign_urx": xyz.sign.sign_urx,
                      "sign_ury": xyz.sign.sign_ury,
                      //กำหนดหน้าที่เซ็นมี 3 แบบ
                      //แบบหน้าเดียวใส่ "1" หรือ "3"
                      //แบบหลายหน้าใส่ "1,3,5"
                      //แบบเซ็นทั้งหมดใส่ "all"
                      "sign_page": xyz.page.length == this.pdf_page_list.length || this.switchStamp == true? 'all': xyz.sign.sign_page.join(',')
                  }: undefined
              },
              "amount_approve": 1,
              "action_detail": [],
              "ref": {
                  "status": false,
                  "detail": {
                      "index": ""
                  }
              },
              "actor_type": "personal",
              //อันนี้ประเภทการเซ็นมี Sign, Sign-Ca, Approve
              "action": xyz.switch_ca == true && xyz.action == 'Sign'? 'Sign-Ca' : xyz.action,
              "status": "W",
              //ลำดับการเซ็น
              "index": xyz.index
            }))
          }
          var url = '/transaction/api/v1/addtransaction'
          if(this.create_tab == 1){
            var {data} = await this.axios.post(this.$api_url + url,body)
          }
          else if(this.create_tab == 2){
            var {data} = await this.axios.post(this.$api_url + url,{
              doc_id: this.selected_document_type_custom._id,
              set_flow: "true",
              flow_data: flow_data,
              object_text : {
                subject : this.documentName, //ชื่อไฟล์
                message : this.documentComment //ข้อความ
              },
              pdfbase: this.pdf_src.slice(28),
              business: JSON.parse(sessionStorage.getItem('selected_business')),
              is_password: this.is_password_custom,
              password: this.pdf_password_custom,
            })
          }
          if(data.status){
            this.transaction_id = data.data.transaction_id
            if(data.data.new_signposition) this.isNewPosition = true
            // if(this.isDirty) 
            this.saveNewSignPosition()
            if(this.attachedFile.length) this.uploadFiles()
            this.emitLoading(false)
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">'+ this.textLang.succeed +'</strong>',
              text: this.textLang.transactionsucceed,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 5000,
              customClass: {
                popup: 'alert-card',
                title: 'alert-title-block',
                closeButton: 'close-alert-btn',
                htmlContainer: 'alert-text-block'
              }
            })
          }
        } catch (error) {
          console.log(error);
          this.emitLoading(false)
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">'+ this.textLang.fail+'</strong>',
            text: this.textLang.transactionfail,
            showCloseButton: true,
            showConfirmButton: false,
            timer: 5000,
            customClass: {
              popup: 'alert-card',
              title: 'alert-title-block',
              closeButton: 'close-alert-btn',
              htmlContainer: 'alert-text-block'
            }
          })
        }
      },
      async saveNewSignPosition(){//ถ้ามี sign/ca => ยิงทุกลำดับรวมทั้ง approve ด้วย, ถ้ามีแต่ approve => ไม่ต้องยิง api นี้
        var url = `/transaction/api/v1/saveTransaction?transaction_id=${this.transaction_id}`
        var tab_flow_data = this.flow_datas_custom.length?this.flow_datas_custom:this.flow_datas
        this.statusAction = tab_flow_data.map(ele => {
          return ele.action
        })
        var flow_data = tab_flow_data.map((element,index) => {
          if(element.action == 'Approve'){
            return {
              sign_position:{
                sign_llx: 0,
                sign_lly: 0,
                sign_urx: 0,
                sign_ury: 0,
                sign_page: 'all'
              },
              index: index
            } 
          }else if(element.action == 'Sign' || element.action == 'Sign-Ca'){
            if(tab_flow_data == this.flow_datas_custom){
              if(Array.isArray(element.sign.sign_page)){
                return {
                  sign_position:{
                    sign_llx: element.sign.sign_llx,
                    sign_lly: element.sign.sign_lly,
                    sign_urx: element.sign.sign_urx,
                    sign_ury: element.sign.sign_ury,
                    sign_page: element.sign.sign_page.length == this.pdf_page_list.length? 'all': element.sign.sign_page.join(','),
                  },
                  index: index
                }
              }else{
                return {
                  sign_position:{
                    sign_llx: element.sign.sign_llx,
                    sign_lly: element.sign.sign_lly,
                    sign_urx: element.sign.sign_urx,
                    sign_ury: element.sign.sign_ury,
                    sign_page: element.sign.sign_page
                  },
                  index: index
                }
              }
            }else{
              return{
                sign_position:{
                  sign_llx: element.approver.sign_position.sign_llx,
                  sign_lly: element.approver.sign_position.sign_lly,
                  sign_urx: element.approver.sign_position.sign_urx,
                  sign_ury: element.approver.sign_position.sign_ury,
                  sign_page: element.approver.sign_position.sign_page
                },
                index: index
              }
            }
          }
        })
        try {
          this.emitLoading(true)
          if((this.create_tab == 2 && this.statusAction.includes('Sign')) || (this.create_tab == 1 && this.isNewPosition)){
            var {data} = await this.axios.put(this.$api_url + url,{
              flow_data: flow_data
            })
            if(data){
              this.emitLoading(false)
            }
          }
        } catch (error) {
          this.emitLoading(false)
          console.log(error);
        }
        this.$router.push('/inbox')
      },
      updatePageCount(page_count) {
        this.pdf_page_list = []
        this.page_count = page_count
        for (let index = 0; index < this.page_count; index++) {
          this.pdf_page_list.push({text:index+1,value:index+1})
        }
      },
      clearTabData(){
        this.signArray = []
        this.flow_datas_custom = []
        this.flow_datas = []
        this.selected_document_template = ''
        this.isDirty = false
        this.is_password = false
        this.pdf_password_custom = ''
        this.pdf_password = ''
      },
      addPersonSign(){
        this.getEmail = []
        var index = this.flow_datas_custom.length
        var newItem = {
          index: index,
          action: 'Sign',
          actor: {
            permission_email: []
          },
          switch_ca: false,
          page: [...this.pdf_page_list].map(x => x.value),
        }
        this.flow_datas_custom.push(newItem)
        if(!this.flow_datas_custom[index].actor.permission_email.length){
          this.addActor(index)
        }
        var init_sign = {
          sign_llx: "0",
          sign_lly: "0.9",
          get sign_page() {
            return newItem.page
          },
          set sign_page(val) {
            newItem.page = val
          },
          get sign_queue_no() {
            return newItem.index + 1
          },
          sign_urx: "0.200",
          sign_ury: "0.100",
          action: 'Sign'
        }
        newItem.sign = init_sign
        this.signArray.push(init_sign)
        this.reShowSign(this.signArray)
      },
      addPersonApprove(){
        this.getEmail = []
        var index = this.flow_datas_custom.length
        var newItem = {
          index: index,
          action: 'Approve',
          actor: {
            permission_email: []
          }
        }
        this.flow_datas_custom.push(newItem)
        if(!this.flow_datas_custom[index].actor.permission_email.length){
          this.addActor(index)
        }
      },
      deleteActionFlow(item,status){
        var target_index = this.flow_datas_custom.indexOf(item);
        this.flow_datas_custom.splice(target_index, 1)
        if(status == 'Sign'){
          var target_sign_index = this.signArray.indexOf(item.sign)
          this.signArray.splice(target_sign_index, 1)
        }
        this.flow_datas_custom.forEach((element,index) => {
          element.index = index 
        })
      },
      addActor(index){
        var newItem = {
          id: +(new Date()),
          thai_email: ''
        }
        this.flow_datas_custom[index].actor.permission_email.push(newItem)
        this.flow_datas_custom[index].actor.permission_email.forEach(email => {
          email.checkbox = true
        })
      },
      addActorFlow(index){
        var newItem = {
          account_id: new Date().getTime(),
          thai_email: ''
        }
        this.flow_datas[index].actor[0].permission_email.push(newItem)
      },
      removeActor(index,item){
        var target_index = this.flow_datas_custom[index].actor.permission_email.indexOf(item);
        this.flow_datas_custom[index].actor.permission_email.splice(target_index, 1)  
      },
      removeActorFlow(index,item){
        var target_index = this.flow_datas[index].actor[0].permission_email.indexOf(item);
        this.flow_datas[index].actor[0].permission_email.splice(target_index, 1)
      },
      inputFile(){
        this.basePDF()
      },
      basePDF(){
        if(this.uploadedFile){
          this.loading_pdf = true
          var reader = new FileReader();
          reader.readAsDataURL(this.uploadedFile);
          reader.onload = () => {
            this.pdf_src = reader.result
            this.loading_pdf = false
          };
          this.documentName = this.uploadedFile.name.substr(0, this.uploadedFile.name.lastIndexOf("."))
        }
      },
      change_page_fn(type){
        switch (type) {
          case 'next':
            if(this.page < this.page_count)
              this.page++
            break
          case 'prev':
            if(this.page > 1)
              this.page--
            break
        }
        this.loaded()
      },
      gopdf() {
        EventBus.$emit('showpdf', this.pdf_src)
      },
      loaded() {
          if(this.signArray.length) this.reShowSign(this.signArray)
      },
      reShowSign() {
        for (let index = 0; index < this.signArray.length; index++) {
          this.signArray[index].name= 'draggableDiv' + String(index)
          this.signArray[index].index = index + 1
        }
          this.signArray.forEach((element,index) => {
            if (!element.key) {
              element.key = Math.random()
            }
            var shownonPage = element.sign_page.toString().split(',')
            var isShow =  shownonPage.includes('all') ||  shownonPage.includes(this.page.toString())
            element.show = isShow
            this.setPositionSign(
              index+1,
              element.sign_llx,
              element.sign_lly,
              element.sign_urx,
              element.sign_ury
            );
          })
      },
      setPositionSign(index, llx, lly, urx, ury) {
        var arr_index = index - 1

        var clientWidth = $('#pdfDiv')[0].getBoundingClientRect().width
        var clientHeight = $('#pdfDiv')[0].getBoundingClientRect().height

        var setHeight = parseFloat(clientHeight) * lly

        var sign = this.signArray[arr_index]

        sign.sign_llx = llx
        sign.sign_lly = lly
        sign.sign_urx = urx
        sign.sign_ury = ury

        sign.sign_position_x = clientWidth*(+llx)
        sign.sign_position_y = ((-setHeight)+ (Math.abs(ury-lly)))+(-clientHeight)*(+lly+(ury-lly))
        sign.sign_box_heigth = (clientHeight*(ury))
        sign.sign_box_width = (clientWidth*urx)

        this.$set(this.signArray,arr_index,sign)
      },
      async search_citizen(item) {
        item = item.trim()
        try {
          this.getEmail = []
          var url = `/citizen/api/v1/search_citizen`
          var {data} = await this.axios.post(this.$api_url + url, {keyword: item} )
          if(data.status) {
            let getEmail = data.result
            for (let index = 0; index < getEmail.length; index++) {
              this.getEmail.push(getEmail[index].citizen_data.thai_email)
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      async search_citizen_custom(item) {
        item = item.trim()
        try {
          this.getEmail = []
          var url = `/citizen/api/v1/search_citizen`
          var {data} = await this.axios.post(this.$api_url + url, {keyword: item} )
          if(data.status) {
            let getEmail = data.result
            for (let index = 0; index < getEmail.length; index++) {
              this.getEmail.push(getEmail[index].citizen_data.thai_email)
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
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
    text-transform: capitalize;
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

  .message-pdf-password .v-messages__message {
    line-height: 20px !important;
  }

  .workflow-block {
    height: calc(100vh - 466px);
    overflow: auto;
  }

  .create-switch-ca-label {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: #00000099;
  }

  .v-application--is-ltr .create-switch-ca .v-input--selection-controls__input {
    margin-right: 0px !important;
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
    text-transform: capitalize;
  }

  .all-step-block {
    height: calc(100vh - 448px);
    overflow: auto;
  }

  .delete-step-btn {
    width: 18px !important;
    height: 18px !important;
  }

  .create-ca-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 11px;
    color: #00000099;
    line-height: 10px;
  }

  .page-sign-box .v-select__slot {
    height: 32px;
  }

  .page-sign-box.v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot {
    min-height: 32px !important;
    padding-left: 3%;
    padding-right: 0%;
  }

  .page-sign-box.v-text-field--outlined.v-input--dense .v-label {
    top: 8px !important;
    left: 9px !important;
    font-size: 13px;
  }

  .page-sign-dropdown-icon.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
    margin-top: 5px !important;
  }

  .all-page-select-list {
    font-family: 'Sarabun', sans-serif;
    line-height: 21px !important;
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

  .email-search-icon.v-select.v-select--is-menu-active .v-input__icon--append .v-icon {
    transform: none !important;
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
    text-transform: capitalize;
  }

  #pdfBg_create {
    position: relative;
    z-index: 0;
    overflow-y: hidden;
    overflow-x: hidden;
    width: 90%;
    text-align: center;
    background: #525659;
  }

  #pdfDiv {
    position: absolute;
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
      padding-bottom: 3% !important;
    }

    .delete-permission-btn {
      height: 20px !important;
      width: 20px !important;
    }
  }
</style>
