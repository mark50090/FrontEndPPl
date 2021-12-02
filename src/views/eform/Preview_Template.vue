<template>
  <div>
    <v-overlay :value="notReady" absolute opacity="0.3" z-index="9">
      <img width="100px" src="../../assets/loader.gif" class="loading-circle">
    </v-overlay>
    <v-toolbar flat class="create-menu-bar preview-form-bar">
      <!-- top bar -->
      <v-btn v-if="!isPreview && ready" text class=" mr-1 px-0 back-data-btn" @click="back()">
        <v-icon large color="#4CAF50">mdi-chevron-left</v-icon>
        <b>{{ textLang.tabMenubar.back_page }}</b>
      </v-btn>
      <v-btn v-if="!(!isPreview && ready)" text class="px-0 mr-1 back-show-btn" @click="backToMyForm()">
        <v-icon large color="#4CAF50">mdi-chevron-left</v-icon>
        <b>{{ textLang.tabMenubar.back_to }}</b>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="isOwner" depressed rounded large dark color="#DC143C" class="send-back-btn-icon send-back-btn display-pc-only" @click="openCancel()">
        <v-icon>mdi-file-cancel-outline</v-icon>
        <span class="btn-expan-word">{{ textLang.tabMenubar.cancel_doc }}</span>
      </v-btn>
      <v-badge bordered left overlap color="red" :value="attachedFiles.length" :content="attachedFiles.length" class="mr-2 display-pc-only">
        <v-btn outlined large color="grey lighten-1" class="mr-2 px-2 export-json-btn" @click="openAttachFile()">
          <v-icon class="mr-2">mdi-text-box-search-outline</v-icon>
            {{ textLang.tabMenubar.view_attachment }}
        </v-btn>
      </v-badge>

      <v-btn v-if="ready && currentStep != ''" large depressed color="#C2EB81" class="mr-4 pl-3 pr-3 save-doc-btn btn-savedraft display-pc-only" @click="checkSave(true)">{{ textLang.tabMenubar.save_draft }}</v-btn>
      <v-btn large depressed dark color="#4CAF50" class="save-doc-btn" @click="checkSave(false)">{{ textLang.tabMenubar.save_doc }}</v-btn>
      <!-- <v-btn v-if="editStep && !allUserStep && !isPublic && ready && !draftPreview" large depressed color="#C2EB81" class="mr-4 pl-3 pr-3 save-doc-btn btn-savedraft display-pc-only" :disabled="buttonClicked" @click="saveStep(true)">{{ textLang.tabMenubar.save_draft }}</v-btn> -->
      <!-- <v-btn v-if="editStep && !allUserStep && !isPublic && ready && !draftPreview" large depressed color="#4CAF50" class="btn-saveStep" :disabled="buttonClicked" @click="openSignature()">{{ textLang.tabMenubar.save_doc }}</v-btn> -->  <!-- mobile -->
      
      <!-- select next template button -->
      <v-menu offset-y z-index="11">
        <template v-slot:activator="{ on }">
          <v-btn v-show="((isPreview && ready && !editStep && !draftPreview) || isNextFill) && nextTemplates.length" large depressed dark color="#525659" class="ml-3 next-temp-btn" v-on="on">{{ textLang.tabMenubar.next_temp_btn }} <v-icon>mdi-menu-down</v-icon></v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="item in nextTemplates" :key="item.temp_code">
            <v-list-item-title class="next-temp-to" @click="openNextTemplate(item)">{{item.temp_name}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn v-if="isPreview && uploadAble && !editStep && isBiz && !isPublic && !draftPreview" large depressed color="#4CAF50" class="ml-4 px-3 export-json-btn send-ppl-btn display-pc-only" :loading="ppl_loading" :disabled="ppl_loading" @click="pplLoadTemplate()">{{ textLang.offer_dialog.offer }}</v-btn>
      
      <v-menu offset-y z-index="11">
        <template v-slot:activator="{ on }">
           <v-btn v-on="on" depressed large color="grey lighten-2" class="ml-4 pr-2 pl-3 display-pc-only more-en">
            {{ textLang.tabMenubar.more }}
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="(isPreview && ready && !editStep) || (isPublic && isPreview)" @click="openRefDoc()">
            <v-list-item-icon>
              <v-icon>mdi-file-eye-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.view_ref_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="(allUserStep || (!isPreview && ready && !editStep && !allUserStep) || (editStep && !allUserStep)) && !isPublic" @click="dialogFiles = true">
            <v-list-item-icon>
              <v-icon>mdi-paperclip</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.attach_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isPreview && ready && !editStep && !isPublic && !draftPreview" @click="exportValue()">
            <v-list-item-icon>
              <v-icon>mdi-open-in-new</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">Export file Json Key</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="ready && currentStep != ''" @click="download('download')">
            <v-list-item-icon>
              <v-icon>mdi-download</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.download_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isPreview && ready && !editStep && !isPublic && !isFlow && !draftPreview && !isAdminPreview" @click="copyDocument()">
            <v-list-item-icon>
              <v-icon>mdi-content-copy</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.copy }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isPreview && ready && !editStep && !isPublic && !isFlow && !draftPreview" @click="openForwardMail()">
            <v-list-item-icon>
              <v-icon>mdi-email-send-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.forward_mail }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- <v-btn v-if="true" large depressed :color="color_pplLoadTemplate" class="ml-4 export-json-btn send-ppl-btn hidden-sm-and-down" :loading="ppl_loading" :disabled="ppl_loading" @click="openSignature()">บันทึกและอนุมัติเอกสาร</v-btn> -->
      <!-- send to paperless button (afetr save) -->
      <!-- button for mobile after save -->
      <v-menu offset-y z-index="11">
        <template v-slot:activator="{ on }">
          <v-btn icon color="#4CAF50" v-on="on" class="display-mobile-only">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="openAttachFile()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-text-box-search-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">
              <v-badge bordered inline color="red" :value="attachedFiles.length" :content="attachedFiles.length" class="mt-0">
                {{ textLang.tabMenubar.view_attachment }}
              </v-badge>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="(isPreview && ready && !editStep) || (isPublic && isPreview)" @click="openRefDoc()">
            <v-list-item-icon>
              <v-icon color="#4CAF50">mdi-file-eye-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.view_ref_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="(allUserStep || (!isPreview && ready && !editStep && !allUserStep) || (editStep && !allUserStep)) && !isPublic" @click="dialogFiles = true">
            <v-list-item-icon>
              <v-icon color="#4CAF50">mdi-paperclip</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.attach_doc }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item v-if="editStep && !allUserStep && !isPublic && !draftPreview" :disabled="buttonClicked" @click="saveStep(true)">
            <v-list-item-icon>
              <v-icon :disabled="buttonClicked" color="#4CAF50">mdi-file-hidden</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.save_draft }}</v-list-item-title>
          </v-list-item> -->
          <v-list-item v-if="ready && currentStep != ''" @click="openDocName(false)">
            <v-list-item-icon>
              <v-icon color="#4CAF50">mdi-file-hidden</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.save_draft }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isPreview && ready && !editStep && !isPublic && !draftPreview" @click="exportValue()">
            <v-list-item-icon>
              <v-icon color="#4CAF50">mdi-open-in-new</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">Export file Json Key</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="ready && currentStep != ''" @click="download('download')">
            <v-list-item-icon>
              <v-icon color="#4CAF50">mdi-download</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.download_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isPreview && ready && !editStep && !isPublic && !isFlow && !draftPreview && !isAdminPreview" @click="copyDocument()">
            <v-list-item-icon>
              <v-icon color="#4CAF50">mdi-content-copy</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.copy }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isPreview && ready && !editStep && !isPublic && !isFlow && !draftPreview" @click="openForwardMail()">
            <v-list-item-icon>
              <v-icon color="#4CAF50">mdi-email-send-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.forward_mail }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item v-if="isPreview && uploadAble && !editStep && isBiz && !isPublic && !draftPreview" @click="pplLoadTemplate()">
            <v-list-item-icon>
              <v-icon color="#4CAF50">mdi-draw</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.offer_dialog.offer }}</v-list-item-title>
          </v-list-item> -->
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-row class="preview-row">
      <v-col :cols="col_preview_sm" :md="col_preview" :lg="col_preview" class="pa-0"> <!-- Sub-Toolbar and Preview Part -->
        <v-toolbar dense elevation="2" class="sub-toolbar-preview">
          <!-- paper menu -->
          <v-spacer></v-spacer>
          <!-- zoom button -->
          <v-btn depressed small color="grey lighten-2" class="display-pc-only" @click="zoomOut()">
            <v-icon color="#aaaaaa">mdi-magnify-minus-outline</v-icon>
          </v-btn>
          <span class="mx-3 zoom-percent display-pc-only">{{zoom_level}} %</span>
          <v-btn depressed small color="grey lighten-2" class="display-pc-only" @click="zoomIn()">
            <v-icon color="#aaaaaa">mdi-magnify-plus-outline</v-icon>
          </v-btn>
          <!-- page number -->
          <v-btn depressed small color="grey lighten-2" class="ml-6" @click="moveToPage(currentPage-1)">
            <v-icon color="#aaaaaa">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="mx-3 zoom-percent">{{ textLang.tabMenubar.page }} {{currentPage}}/{{pages.length}}</span>
          <v-btn depressed small color="grey lighten-2" @click="moveToPage(currentPage+1)">
            <v-icon color="#aaaaaa">mdi-arrow-right</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <!-- comments button -->
          <v-btn v-if="open_comment == false && docComment.length" depressed height="100%" color="grey lighten-2" class="comment-preview-btn" @click="toggleComment()">{{ textLang.tabMenubar.open_comment_btn }}<br class="display-mobile-only">{{ textLang.tabMenubar.comment_btn }}</v-btn>
          <v-btn v-else-if="open_comment == true && docComment.length" depressed x-small height="100%" color="grey lighten-2" class="px-0" @click="toggleComment()"><v-icon large>mdi-chevron-right</v-icon></v-btn>
        </v-toolbar>
        <v-row justify="center" class="mt-3 temp-preview-name">
          <h3>
            {{name_template}}
            <span v-if="templates.document_name != null">: {{ templates.document_name }}</span>
          </h3>
        </v-row>
        <v-row id="paper-block" justify="center" class="mt-2 pl-1 preview-row">
          <v-col cols="12" md="12" lg="12" class="pl-2 pr-0 pt-0 pb-2  preview-paper-block">
            <v-sheet  id="workpaper" :width="current_paper_width + 'px'" :height="current_paper_height + 'px'" :elevation="2" color="white" class="main-paper" style="position: relative; padding: 0px;">
              <div id="preview-paper" style="background-color:white; width:100%; ">
                <!-- <v-overlay v-show="pages[currentPage-1] && pages[currentPage-1].isHide" opacity="0.30" z-index="11" color="red" absolute>
                  <img src="../../assets/hide-paper.png" :width="current_paper_width + 'px'" :height="current_paper_height + 'px'" />
                </v-overlay> -->
                <div :id="item.name" v-for="item in template_array" :key="item.name" v-show="!item.style.hideDisplay && !item.style.hidePreview">
                  <v-layout v-if="item.show && item.page == currentPage && !item.invisible" style="height:100%;">
                    <span :class="item.name+ '-obj'" v-if="!item.hideBysection && item.object_type == 'autofillbox'" :style="'width:100%;' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + '; z-index:5;'">
                      <div v-if="item.value.isUser && !(item.value.show == 'function')" :style="'text-align:' + item.style.font_align + ';'">
                        <div v-if="!(item.value.show == 'doc_no')" :style="'text-align:' + item.style.font_align + ';'">{{item.value.show_index}}{{item.style.suffix}}</div>
                        <div v-if="item.value.show == 'doc_no'" :style="'text-align:' + item.style.font_align + ';'">{{doc_no}}{{item.style.suffix}}</div>
                      
                      </div>
                      <div v-if="!item.value.isUser || (item.value.show == 'function')">
                        <div v-if="item.value.show_array == 'calculatebox' || item.value.isComma" :style="'text-align:' + item.style.font_align + ';'">{{numberToComma(item.value.show_value, item.style.isComma)}}{{item.style.suffix}}</div>
                        <div v-if="!(item.value.show_array == 'calculatebox' || item.value.isComma)" :style="'text-align:' + item.style.font_align + ';'">{{item.value.show_value}}{{item.style.suffix}}</div>
                      </div>
                    </span>
                    <span :class="item.name+ '-obj'" v-if="!item.hideBysection && item.object_type == 'datepickerbox'" :style="'width:100%; z-index:' + String(item.style.zIndex) +'; text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{item.show_value}}</span>
                    <pre :class="item.name+ '-obj'" class="text-area-front textarea-data" v-if="!item.hideBysection && item.object_type == 'textareabox'" :style="'width:100%; z-index:' + String(item.style.zIndex) +'; text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{item.value}}</pre>
                    <span :class="item.name+ '-obj'" :style="'z-index:' + String(item.style.zIndex) +'; white-space: pre; width:100%; text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'" v-if="!item.hideBysection && item.object_type != 'datatable' && item.object_type != 'inputimagebox' && item.object_type != 'inputbox' && item.object_type != 'calculatebox' && item.object_type != 'checkbox' && item.object_type != 'imagebox' && item.object_type != 'datepickerbox' && item.object_type != 'autofillbox' && item.object_type != 'number2textbox'&& item.object_type != 'table'&& item.object_type != 'line' && item.object_type != 'textareabox' && item.object_type != 'signbox' && item.object_type != 'rectangle' && item.object_type != 'dropdownbox'  && item.object_type != 'texteditorbox'">{{item.value}}</span>
                    <span :class="item.name+ '-obj'" :style="'z-index:' + String(item.style.zIndex) +'; white-space: pre; width:100%; text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'" v-if="!item.hideBysection && item.object_type == 'dropdownbox'">{{item.show_value}}</span>
                    <span :class="item.name+ '-obj'" :style="'z-index:' + String(item.style.zIndex) +'; width:100%; text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'" v-if="!item.hideBysection && item.object_type == 'texteditorbox'" class="editor-box-preview" v-html="item.value"></span>
                    <span :class="item.name+ '-obj'" v-if="item.object_type == 'rectangle'" :style="'width:100%; height:100%; border:' + item.style.border_size + 'px solid ' + item.style.border_color + '; background-color:' + item.style.background_color + ';'"></span>
                    <span :class="item.name+ '-obj'" v-if="!item.hideBysection && item.object_type == 'inputbox'" :style="'width:100%; z-index:' + String(item.style.zIndex) +'; text-align:' + item.style.font_align + ';'">
                      <span v-if="item.style.isComma" :style="item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{numberToComma(item.value, item.style.isComma)}}</span>
                      <span v-if="!item.style.isComma" :style="item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{item.value}}</span>
                      {{item.style.suffix}}
                    </span>
                    <span :class="item.name+ '-obj'" v-if="!item.hideBysection && item.object_type == 'calculatebox'" :style="'width:100%; z-index:' + String(item.style.zIndex) +'; text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{numberToComma(item.valueShow, item.style.isComma)}}{{item.style.suffix}}</span>
                    <span :class="item.name+ '-obj'" v-if="!item.hideBysection && item.object_type == 'number2textbox'" :style="'width:100%; z-index:' + String(item.style.zIndex) +'; text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{item.value.show_value}}</span>
                    <div :class="item.name+ '-obj'" v-if="item.object_type == 'checkbox'" :style="'z-index:' + String(item.style.zIndex) +';'">
                      <img v-if="!item.hideBysection && !item.value" :width="item.style.font_size + 'px'" class="check-box-preview" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png"/>
                      <img v-if="!item.hideBysection && item.value" :width="item.style.font_size + 'px'" class="check-box-preview" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_84c82695-0eff-4e1f-9e42-f07d49104a84.png"/>
                      <span :style="item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{item.text}}</span>
                    </div>
                    <div :class="item.name+ '-obj'" v-if="item.object_type == 'imagebox'" :style="'z-index:' + String(item.style.zIndex) +';'">
                      <img :src="item.value" :width="item.style.image_width + 'px'" :height="item.style.image_height + 'px'"/>
                    </div>
                    <div :class="item.name+ '-obj'" v-if="item.object_type == 'inputimagebox' && item.value != '' && item.value != null" :style="'z-index:' + String(item.style.zIndex) +';'"> 
                      <img v-if="item.isValued || !item.isValued" :src="item.value" :width="item.style.image_width + 'px'" :height="item.style.image_height + 'px'"/>
                    </div>
                    <div :class="item.name+ '-obj'" v-if="!item.hideBysection && item.object_type == 'signbox'" :style="'z-index:' + String(item.style.zIndex) +';'">
                      <img v-if="item.value" :width="'100%'" :src="item.value" />
                      <img v-if="!item.value && item.style.signUrl" :width="'100%'" :src="item.style.signUrl" />
                    </div>
                    <div v-if="item.object_type == 'table'" :style="'z-index:' + String(item.style.zIndex) +';'">
                      <table :id="item.name + '-table'" :class="item.name+ '-obj'" :style="'border:' + item.style.border_size + 'px solid ' + item.style.border_color + ';'" class="object-table">
                        <tr :style="'border:' + item.style.border_size + 'px solid ' + item.style.border_color + '; ' + 'height:' + r.size + 'px;'" v-for="r in item.style.table.rowsize" :key="r.index" class="object-table">
                          <td :style="'border:' + item.style.border_size + 'px solid ' + item.style.border_color + '; ' + 'width:' + c.size + 'px;'" v-for="c in item.style.table.colsize" :key="c.index" class="object-table"></td>
                        </tr>
                      </table>
                    </div>
                    <div v-if="item.object_type == 'datatable'" :style="'z-index:' + String(item.style.zIndex) +';'">
                      <table :id="item.name + '-table'" :class="item.name+ '-obj'" :style="'border:' + item.style.border_size + 'px solid ' + item.style.border_color + ';'" class="object-table">
                        <tr :style="'border:' + item.style.border_size + 'px solid ' + item.style.border_color + '; ' + 'height:' + String(Number(r.size)) + 'px;'" v-for="r in item.style.table.rowsize" :key="r.index" class="object-table">
                          <td v-show="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.hideDisplay" :style="'word-break: break-word; border:' + item.style.border_size + 'px solid ' + item.style.border_color + '; ' + 'width:' + c.size + 'px;'+ ' background-color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.background_color" v-for="c in item.style.table.colsize" :key="c.index" class="object-table">
                            <div v-show="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.hideDisplay && !dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].invisible" v-if="!item.hideBysection && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type != 'checkbox' && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type != 'calculatebox'  && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type != 'inputimagebox'" :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name" :style="'text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + ';font-size:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px;'">{{numberToComma(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show_value, dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.isComma)}}{{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.suffix}}</div>
                            <div v-show="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.hideDisplay && !dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].invisible" v-if="!item.hideBysection && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'calculatebox'" :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name" :style="'text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + ';font-size:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px;'">{{numberToComma(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].valueShow, dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.isComma)}}{{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.suffix}}</div>
                            <div v-show="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.hideDisplay && !dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].invisible" v-if="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'checkbox'" :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name" :style="'text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + ';font-size:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px;'">
                              <img v-if="!item.hideBysection && !dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" :width="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px'" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png"/>
                              <img v-if="!item.hideBysection && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" :width="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px'" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_84c82695-0eff-4e1f-9e42-f07d49104a84.png"/>
                              <span>{{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].text}}</span>
                            </div>
                            <div v-show="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.hideDisplay && !dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].invisible" v-if="!item.hideBysection && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'inputimagebox'" :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name" :style="'text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + ';font-size:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px;'">
                              <div v-show="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" :style="'width:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.image_width + '; height:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.image_height + '; border: 0px;'">
                                <img :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-img'" :src="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" :height="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.image_height" :width="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.image_width">
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div :class="item.name+ 'obj'" v-show="item.object_type == 'line'" :style="'height:100%; width:100%;z-index:' + String(item.style.zIndex) +';'">
                      <table v-if="item.style.line_set == 'l'" :style="'width:100%; height:100%; border-collapse:collapse;'">
                        <tr :style="'height:50%; border-bottom:' + item.style.border_size +'px '+ item.style.line_style +' ' + item.style.border_color +'; border-collapse:collapse;'">
                          <td :style="'width:100%;'"></td>
                        </tr>
                        <tr :style="'height:50%; border-top:' + item.style.border_size +'px '+ item.style.line_style +' ' + item.style.border_color +'; border-collapse:collapse;'">
                          <td :style="'width:100%;'"></td>
                        </tr>
                      </table>
                      <table v-if="item.style.line_set == 'p'" :style="'width:100%; height:100%; border-collapse:collapse;z-index:' + String(item.style.zIndex) +';'">
                        <tr :style="'height:100%;'">
                          <td :style="'width:50%; border-right:' + item.style.border_size +'px '+ item.style.line_style +' ' + item.style.border_color +'; border-collapse:collapse;'"></td>
                          <td :style="'width:50%'"></td>
                        </tr>
                      </table>
                    </div>
                  </v-layout>
                </div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="open_comment == true && docComment.length" :cols="col_comment_sm" :md="col_comment" :lg="col_comment" class="pr-0 pb-0 comment-part"> <!-- Comment Part -->
        <v-row class="pr-3 preview-comment-row">
          <b class="mt-4 comment-header">{{ textLang.tabMenubar.comment_header }}</b>
          <v-spacer class="display-mobile-only"></v-spacer>
          <v-btn icon @click="toggleComment()" class="mt-2 display-mobile-only"><v-icon large>mdi-chevron-right</v-icon></v-btn>
        </v-row>
        <div class="comment-boxes">
          <br>
          <v-row  v-for="item in docComment" :key="item.index" class="mb-5 each-comment"> <!-- set of one comment -->
            <v-col cols="auto" class="px-0 pt-0">
              <v-icon size="30">mdi-account-circle</v-icon>
            </v-col>
            <v-col cols="" class="pa-0">
              <v-row class="preview-comment-row comment-name">
                {{item.sender}}
              </v-row>
              <v-card outlined class="mr-3 mt-3 pa-3">
                <pre class="comment-sentence">{{item.message}}</pre>
              </v-card>
              <v-row class="pr-3 preview-comment-row">
                <v-spacer></v-spacer>
                <span class="comment-date">{{item.date}}</span>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <InputDocumentNameModal />
    <RefDocumentModal />
    <SignaturePadModal />
    <AttachFileModal/>
    <ConfirmCancelDocumentModal/>
    <!-- Save Document Modal -->
    <v-dialog v-model="dialog_ppl" scrollable persistent max-width="650px">
      <v-card>
        <v-card-title class="py-2 save-doc-modal-header">
          {{ textLang.offer_dialog.offer_paperless_new }}
        </v-card-title>
        <v-card-text class="pt-4">
          <v-row class="save-doc-row">
            <v-col cols="12" md="4" lg="4" align-self="start" class="pl-0 pr-2 pt-5 pb-0 title-name-paperless">{{ textLang.offer_dialog.subject_new }} </v-col>
            <v-col cols="12" md="8" lg="8" class="px-0 pb-0">
              <v-text-field outlined dense class="title-name-paperless-value paperless-input-line" color="#4CAF50" v-model="pplSubject" :error="name_ppl_error" :error-messages="error_file_name_ppl_msg"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-0 save-doc-row" v-if="isPassword">
            <v-col cols="12" md="4" lg="4" align-self="start" class="pl-0 pt-2 title-name-paperless">{{ textLang.offer_dialog.password_setting }}</v-col>
            <v-col cols="12" md="8" lg="8" class="px-0 py-0">
              <v-text-field dense outlined color="#4CAF50" v-model="pdfPasswordSetting" :error="pdf_setting_error" :error-messages="error_pdf_setting_password" class="title-name-paperless-value paperless-input-line error-messages-set"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-0 save-doc-row" >
            <v-col cols="12" md="4" lg="4" class="pl-0 pt-0 title-name-paperless">{{ textLang.offer_dialog.message }}</v-col>
            <v-col cols="12" md="8" lg="8" class="px-0 pt-0">
              <v-textarea outlined dense hide-details no-resize rows="6" color="#4CAF50" class="pad-textarea message-paperless-row title-name-paperless-value" v-model="pplBody"></v-textarea>
            </v-col>
          </v-row>
          <!-- <v-row justify="center" class="mb-3">
            <v-col cols="12" md="3" lg="3" class="pb-0 type-paperless-title">{{ textLang.offer_dialog.doc_type }}</v-col>
            <v-col cols="12" md="7" lg="7">
              <v-autocomplete dense outlined hide-details :color="color_type_paperless_title" append-icon="mdi-chevron-down" :placeholder="textLang.offer_dialog.choose" class="type-paperless autocomplete-pad icon-select dropdown-icon-color" :items="documentTypes" v-model="selectedDocumentType"></v-autocomplete>
            </v-col>
          </v-row> -->
          <v-row v-if="flowChoices.length > 1" class="mt-0 save-doc-row">
            <v-col cols="12" md="4" lg="4" align-self="center" class="pl-0 pt-0 title-name-paperless">{{ textLang.offer_dialog.doc_format }}</v-col>
            <v-col cols="12" md="8" lg="8" class="px-0 pt-0">
              <v-autocomplete dense outlined hide-details auto-select-first color="#4CAF50" append-icon="mdi-chevron-down" :placeholder="textLang.offer_dialog.choose" :items="flowChoices" v-model="currentFlowId" @change="getFlowData()" class="type-paperless paperless-input-line preview-other-workflow-icon"></v-autocomplete>
            </v-col>
          </v-row>
          <!-- <br /> -->
          <v-row v-if="templates.description" class="save-doc-row">
            <v-textarea outlined dense readonly hide-details no-resize :label="textLang.offer_dialog.note" color="#FF9800" rows="6" class="message-paperless-row digital-workflow-not-line note-paperless-title note-paperless-content note-paperless-box" :value="templates.description"></v-textarea>
          </v-row>
          <br>
          <v-divider></v-divider>
          <br>
          <v-row class="save-doc-row">
            <v-btn depressed large dark color="#4CAF50" class="step-btn" @click="step_show = !step_show">
              Workflow
              <v-icon v-if="step_show == true" large class="ml-12">mdi-chevron-up</v-icon>
              <v-icon v-else-if="step_show == false" large class="ml-12">mdi-chevron-down</v-icon>
            </v-btn>
          </v-row>
          <v-row v-if="step_show == true" class="mt-0 save-doc-row all-workflow-block">
            <v-timeline align-top dense class="pt-6 all-step">
              <v-timeline-item fill-dot icon color="#4CAF50" v-for="item in flow_data" :key="item.index">
                <template v-slot:icon>
                  <span class="number-step">{{(item.index + 1)}}</span>
                </template>
                <!-- <v-text-field v-show="!item.ref_step || (item.ref_step == 'ref-undefined')" outlined dense hide-details color="#4CAF50" class="mb-3 type-paperless" v-for="e in item.one_email" :key="e.ex_email" v-model="e.email"></v-text-field>
                <v-text-field v-show="item.ref_step &&  (item.ref_step != 'ref-undefined')" readonly outlined dense hide-details color="#4CAF50" class="mb-3 type-paperless" :value="textLang.offer_dialog.re_number + item.ref_step"></v-text-field> -->
                 <v-text-field  v-show="!item.editable && item.actor[0].permission_sender_status" readonly outlined dense hide-details color="#4CAF50" class="mb-3 type-paperless" :value="textLang.offer_dialog.doc_sender"></v-text-field>
                 <v-text-field v-for="actor in item.actor[0].permission_email" :key="actor.account_id" v-show="!item.editable" outlined dense hide-details color="#4CAF50" class="mb-3 type-paperless" :error="!actor.thai_email || actor.invalid" v-model="actor.thai_email"></v-text-field>
                 <v-text-field v-for="role in item.actor[0].permission" :key="role.role_id" v-show="!item.editable" readonly outlined dense hide-details color="#4CAF50" class="mb-3 type-paperless" :value="role.role_name"></v-text-field>
              </v-timeline-item>
            </v-timeline>
          </v-row>
          <br />
          <v-divider></v-divider>
          <br />
          <v-row class="mb-2 save-doc-row">
            <v-col v-for="item in attachedFiles"  :key="item.file_id" cols="auto" md="auto" lg="auto" align-self="center" class="pl-0 pr-1 pt-0 pb-1">
              <v-chip class="attached-file-save-modal" v-if="!item.waitUpload" small dark color="#4CAF50" :close="item.username == currentUser" @click="downloadFile(item)" @click:close="deleteFile(item)">{{ item.filename }}</v-chip>
              <!-- <v-chip v-if="item.waitUpload" small label outlined class="ma-1 chip-moblie text-area-front" :color="color_aperless_file_title"><b>{{item.file_name}}</b>&nbsp;<i>({{ textLang.offer_dialog.wait_upload }})</i></v-chip> -->
            </v-col>
          </v-row>
          <v-row class="mt-0 save-doc-row">
            <v-col cols="12" md="auto" lg="auto" class="pl-0 pb-0 attach-title-save-modal paperless-file-title">{{ textLang.offer_dialog.add_attachments }}:</v-col>
            <v-col cols="12" md="" lg="" class="px-0 pb-0">
              <v-file-input show-size dense outlined counter multiple color="#4CAF50" truncate-length="600" :placeholder="textLang.offer_dialog.attached_file_placeholder" class="attach-file-preview-box" id="file" v-model="files">
                <template v-slot:selection="{ text }">
                  <v-chip small dark color="#4CAF50" class="py-1 attach-file-preview-chip">{{ text }}</v-chip>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider class="mx-6"></v-divider>
        <v-row class="px-6 paperless-alert-row" v-show="alert_text">
          <v-col cols="auto" class="pl-0 pt-2">
            <v-icon color="red">mdi-alert</v-icon>
          </v-col>
          <v-col cols="" class="px-0">
            <span class="paperless-alert" v-html="alert_text"></span>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-row justify="center" class="save-doc-row">
            <v-col cols="5" md="3" lg="3" class="pl-0 pr-2">
              <v-btn block outlined color="#67C25D" class="cancel-efrom-modal-btn" @click="dialog_ppl = false">{{ textLang.offer_dialog.cancel }}</v-btn>
            </v-col>
            <v-col cols="5" md="3" lg="3" class="pl-2 pr-0">
              <v-btn block depressed color="#67C25D" class="save-eform-modal-btn" @click="checkName()">{{ textLang.tabMenubar.save_doc }}</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogFiles" scrollable persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="attach-preview-modal-header">{{ textLang.offer_dialog.doc_system }}</span>
          <v-spacer></v-spacer>
          <v-btn icon dark small color="black" @click="dialogFiles = false">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4 pb-0">
          <v-row v-if="attachedFiles.length > 0" class="row-crad-files">
            <div v-for="item in attachedFiles"  :key="item.file_id">
              <v-chip class="ma-1 chip-moblie" v-if="!item.waitUpload" small dark color="#4CAF50" :close="item.username == currentUser" @click="downloadFile(item)" @click:close="deleteFile(item)">{{ item.filename }}</v-chip>
              <v-chip v-if="item.waitUpload" small outlined class="ma-1 chip-moblie" color="#4CAF50" close @click:close="deleteFileWait(item)"><b>{{item.file_name}}</b>&nbsp;<i>({{ textLang.offer_dialog.wait_upload }})</i></v-chip>
            </div>
          </v-row>
          <v-row class="row-crad-files">
            <!-- <v-col cols="12" md="4" lg="4" align-self="center" class="paperless-file-title" >{{ textLang.offer_dialog.add_attachments }}</v-col> -->
            <v-file-input show-size dense outlined counter multiple truncate-length="600" color="#4CAF50" :placeholder="textLang.offer_dialog.please_choose" class="attach-file-preview-box" id="file" v-model="holdFiles">
              <template v-slot:selection="{ text }">
                <v-chip small dark color="#4CAF50" class="py-1 attach-file-preview-chip">{{ text }}</v-chip>
              </template>
            </v-file-input>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-4 pb-5">
          <v-spacer></v-spacer>
          <v-btn outlined color="#4CAF50" dark class="px-8 mr-2 cancel-attach-modal-btn" @click="holdFiles=[]; dialogFiles = false">{{ textLang.offer_dialog.cancel }}</v-btn>
          <v-btn depressed dark color="#4CAF50" class="px-9 ml-2 attach-file-modal-btn" @click="dialogFiles = false; changeHoldFiles()" >{{ textLang.offer_dialog.ok }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { EventBus } from "../../EventBus"
import InputDocumentNameModal from "../../components/eform/InputDocumentNameModal"
import SignaturePadModal from "../../components/eform/SignaturePadModal"
import RefDocumentModal from "../../components/eform/RefDocumentModal"
import AttachFileModal from "../../components/eform/AttachFileModal"
import ConfirmCancelDocumentModal from '../../components/eform/ConfirmCancelDocumentModal'
import { mapState } from 'vuex'

export default {
  computed: mapState({
    objectTemplate: state => state.objectTemplate,
    uploadedFile: state => state.uploadedFile
  }),
  components: {
    InputDocumentNameModal,
    SignaturePadModal,
    RefDocumentModal,
    AttachFileModal,
    ConfirmCancelDocumentModal
  },
  data: () => ({
    textLang:{
      tabMenubar: {
        back_page: "ย้อนกลับไปหน้ากรอกข้อมูล",
        back_to: "ออกจากแบบฟอร์มนี้",
        save_doc: "บันทึกเอกสาร",
        save_draft: "บันทึกเอกสารแบบร่าง",
        page: "หน้า",
        view_ref_doc: "ดูเอกสารอ้างอิง",
        attach_doc: "แนบเอกสารเพิ่มเติม",
        download_doc: "ดาวน์โหลดเอกสาร",
        copy: "คัดลอก",
        forward_mail: "ส่งเอกสารเป็นอีเมล",
        next_temp_btn: "กรอกเอกสารถัดไป",
        more: "เพิ่มเติม",
        view_attachment: "ดูเอกสารแนบ",
        cancel_doc: "ยกเลิกเอกสาร",
        open_comment_btn: "เปิดแถบ",
        comment_btn: "ความคิดเห็น",
        comment_header: "ความคิดเห็น"
      },
      offer_dialog: {
        offer: "เสนอเซ็น",
        offer_paperless_new: "บันทึกเอกสาร",
        offer_paperless_old: "เสนอเซ็นผ่านระบบ Paperless",
        subject_new: "ชื่อเอกสาร:",
        subject_old: "เรื่อง:",
        password_setting: "ตั้งค่ารหัสผ่าน PDF:",
        no_subject: "<ไม่มีหัวเรื่อง>",
        message: "ข้อความ:",
        doc_type: "ประเภทเอกสาร paperless:",
        doc_format: "รูปแบบเอกสาร paperless:",
        doc_sender: "ผู้ส่งเอกสาร",
        add_attachments: "เอกสารแนบเพิ่มเติม",
        attached_file_placeholder: "เลือกเอกสารแนบ",
        please_choose: "กรุณาเลือกเอกสารแนบ",
        doc_system: "แนบเอกสารเพิ่มเติม",
        choose: "เลือก",
        note: "หมายเหตุ",
        re_number: "อ้างอิงลำดับที่",
        cancel: "ยกเลิก",
        ok: "ตกลง",
        default: "(ค่าเริ่มต้น)",
        default_value: "ค่าเริ่มต้น",
        please_input: "กรุณากรอกข้อมูล Email ให้ครบถ้วน",
        email_found: "ไม่พบอีเมล์ต่อไปนี้ในระบบ",
        name_ppl_error: "กรุณากรอกชื่อเอกสาร",
        pdf_setting_error:"กรุณาตั้งค่ารหัสผ่าน",
        wait_upload: "รอการอัพโหลด",
        already_save: "เอกสารในลำดับนี้ ถูกบันทึกแล้ว"
      },
      alert:{
        alert_warning: "แจ้งเตือน",
        alert_success: "สำเร็จ",
        alert_error: "ไม่สำเร็จ",
        send_complete: "เสนอเซ็นสำเร็จ",
        send_fail: "เสนอเซ็นไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
        upload_fail : "อัพโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
        duplicate_user_form: "แบบฟอร์มถูกใช้งานโดยผู้ใช้อื่น",
        duplicate_save: "บันทึกเอกสารไม่สำเร็จ เนื่องจากเอกสารในลำดับนี้ถูกบันทึกแล้ว"
      }
    },
    alert: false,
    alert_error: false,
    dialogFiles: false,
    name_template: "",
    code_template: "",
    version_template: "",
    eform_id: "",
    template_array: [],
    template_header: [{}],
    template_body: [{}],
    template_footer: [{}],
    sleep: false,
    ready: false,
    doc_name: "",
    isPreview: false,
    template_code: "",
    dialog: false,
    templates: {},
    selected_object: null,
    download_url: "",
    ppl_loading: false,
    dialog_ppl: false,
    ppl_choosetemp: "",
    ppl_templatelist: [],
    notReady: true,
    template_paperless_code: "",
    clip: false,
    files: [],
    holdFiles: [],
    uploadAble: false,
    paper_size: [{text:"A4", width:1190, height:1666, value:0},{text:"A3", width:1666, height:2349, value:1}],
    current_paper_width: 1190,
    current_paper_height: 1666,
    note_paperless_show: false,
    step_show: true,
    steps: [],
    alert_text_bool: false,
    alert_text: "",
    orientation: "PORTRAIT",
    stepPermission: [],
    editStep: false,
    isComplete: false,
    allPplTemaplates: [],
    documentTypes: [],
    selectedDocumentType: "",
    defaultPplTemplate: "",
    canNotSendPPL: true,
    currentPage: 1,
    pages: [],
    pageOrientation: {},
    allUserStep: false,
    dataTableObjectArray: {},
    pplSubject: "",
    pdfPasswordSetting: "",
    isPdfLock: false,
    pplBody: "",
    doc_no: "",
    zoom_level: 100,
    saveLatitude: 0,
    saveLongitude: 0,
    col_preview_sm: 12,
    col_preview: 12,
    col_comment_sm: 0,
    col_comment:0,
    open_comment: false,
    docComment: [],
    reSend: false,
    pdfHtml: "",
    isBiz: true,
    statusDraft: false,
    attachedFiles: [],
    currentUser: "",
    uploadFolder: "",
    isPublic: false,
    isFlow: false,
    isCa: false,
    optionsPage: {
      subject_text:"",
      service_properties: "",
      body_text: ""
    },
    pplSignBase: "",
    currentSignStep: {
      name: "",
      sign: ""
    },
    isSaveDraft: false,
    draftPreview: false,
    isSaveTemplate: false,
    isNextFill: false,
    paperSizeIndex: 0,
    refDataDoc: [],
    isAdminPreview: false,
    name_ppl_error: false,
    error_file_name_ppl_msg: '',
    pdf_setting_error: false,
    error_pdf_setting_password: '',
    nextTemplates: [],
    templateId: "",
    isReturnFill: false,
    buttonClicked:false,
    isOwner: false,
    option: {},
    contTableArray: [],
    flow_data: [],
    isPassword: false,
    signNoFlow: false,
    noFlowSignPic: "",
    thenOpenPpl: false,
    thenOpenPplNoFlow: false,
    flowChoices: [],
    currentFlowId: "",
    //Color Variable
    // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
    // color_dropdown_icon: '#1b9900 !important', //class dropdown-icon-color in Toolbar.vue
    // color_loading: '#1b9900', //class lds-roller in App.vue
    color_loading_bar_bg: '#C2EB81',
    color_loading_bar: '#1b9900',
    color_next_temp_btn: '#A1E9C0',
    color_downloadfile: '#2ACA9F',
    color_file_input: '#2ACA9F',
    color_text_input: '#2ACA9F',
    color_ok: '#2ACA9F',
    color_title_name_paperless: '#2ACA9F',
    color_message_paperless: '#2ACA9F',
    color_type_paperless_title: '#2ACA9F',
    color_document_format_paperless: '#2ACA9F',
    color_templates_description: '#2ACA9F',
    color_step_btn: '#2ACA9F',
    color_all_step_block: '#2ACA9F',
    color_paperless_file_title: '#2ACA9F',
    color_save: '#2ACA9F',
    color_chevron_left: '#1b9900',
    color_save_doc: '#1b9900',
    color_savedraft: '#C2EB81',
    color_btn_saveStep: '#1b9900',
    color_pplLoadTemplate: '#1b9900',
    color_btn_save_ppl: '#97E2E7',
    color_comment_icon: '#1b9900',
    colorObject: {
      toolbar: {
  				toolbar_bg_color1: '#C2EB81',
  				toolbar_bg_color2: '#A1E9C0',
  				toolbar_font_color: '#0E3852',
  				menu_select_hover_color: '#E6F3CB'
 			},
 			modal: {
  				modal_main_color: '#2ACA9F',
  				modal_sub_color: '#97E2E7'
 			},
 			main_color: '#1b9900'
    },
    imageQRCODE:''
  }),
  beforeDestroy() {
    EventBus.$off("getDocName")
    EventBus.$off('saveSign')
    EventBus.$off('changeLang')
    EventBus.$off('setPdfPass')
    EventBus.$off("emitSaveDocument")
    if(this.isSaveTemplate) {
      this.returnEform(this.eform_id)
    }
    if(!this.isReturnFill) {
      this.$store.commit('setUploadedFile', [])
    }
  },
  mounted() {
    if(sessionStorage.getItem("public_eform") == 'true') {
      this.isPublic = true
    }
    if(sessionStorage.getItem("adminPreview") == 'true') {
      this.isAdminPreview = true
    }
    if(sessionStorage.getItem('sendBackAndFirst') == 'true') {
      this.isNextFill = true
    }
    this.currentStep = Number(sessionStorage.getItem('current_step'))
    this.getData()
    // this.getLocation()
    this.currentUser = sessionStorage.getItem("oneuser")
    if (sessionStorage.getItem("all_user_step")) {
      this.allUserStep = JSON.parse(sessionStorage.getItem("all_user_step"))
    }
    EventBus.$on("getDocName", this.save)
    EventBus.$on('saveSign', this.saveSign)
    EventBus.$on("emitSaveDocument", this.saveDocument)
    EventBus.$on('changeAttachFiles', this.changeUploadingFiles)
    EventBus.$on('changeLang', this.changeLange)
    EventBus.$on('setPdfPass', this.setPdfPass)
    this.refDataDoc = JSON.parse(sessionStorage.getItem('refDataDoc'))
    EventBus.$on('changeLang', this.changeLange)
    this.changeLange()
    // this.changeColor()
  },
  watch: {
    sleep(val) {
      if (!val) return;
      setTimeout(() => ((this.sleep = false), this.setPosition()), 500);
    },
    template_paperless_code(val) {
      this.steps = this.template_paperless_code.Template_step;
      if (this.template_paperless_code != "") {
        this.canNotSendPPL = false
      } else {
        this.canNotSendPPL = true
      }
    },
    selectedDocumentType() {
      // if (this.dialog_ppl) {
      // this.getPplTemplate()
      // }
    },
    orientation() {
      if (this.orientation == "LANDSCAPE") {
        this.current_paper_width = this.paper_size[this.paperSizeIndex].height;
        this.current_paper_height = this.paper_size[this.paperSizeIndex].width - 50;
      } else {
        this.current_paper_width = this.paper_size[this.paperSizeIndex].width;
        this.current_paper_height = this.paper_size[this.paperSizeIndex].height;
      }
    },
    paperSizeIndex() {
      if(this.orientation == 'PORTRAIT') {
        this.current_paper_width = this.paper_size[this.paperSizeIndex].width
        this.current_paper_height = this.paper_size[this.paperSizeIndex].height
      } else if (this.orientation == 'LANDSCAPE') {
        this.current_paper_width = this.paper_size[this.paperSizeIndex].height
        this.current_paper_height = this.paper_size[this.paperSizeIndex].width-50
      }
    },
    pplSubject(val) {
      if(val == '') {
        this.name_ppl_error = true
        this.error_file_name_ppl_msg = this.textLang.offer_dialog.name_ppl_error
      } else {
        this.name_ppl_error = false
        this.error_file_name_ppl_msg = ''
      }
    },
    pdfPasswordSetting(val) {
      if(val == '') {
        this.pdf_setting_error = true
        this.error_pdf_setting_password = this.textLang.offer_dialog.pdf_setting_error
      } else {
        this.pdf_setting_error = false
        this.error_pdf_setting_password = ''
      }
    },
    files(val) {
      this.applyAttachFiles()
    }
  },
  methods: {
    changeColor() {
      this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
      // this.color_dialog_header_bg = this.colorObject.modal.modal_main_color
      // $('.dialog_title').css('background-color', this.color_dialog_header_bg)
      // this.color_dropdown_icon = this.colorObject.main_color + '!important'
      // $('.dropdown-icon-color .theme--light.v-icon').css('color', this.color_dropdown_icon)
      // this.color_loading = this.colorObject.main_color
      // $('.lds-roller div:after').css('background', this.color_loading)
      this.color_loading_bar_bg = this.colorObject.toolbar.toolbar_bg_color1
      this.color_loading_bar = this.colorObject.main_color
      this.color_next_temp_btn = this.colorObject.toolbar.toolbar_bg_color2
      this.color_downloadfile = this.colorObject.modal.modal_main_color
      this.color_file_input = this.colorObject.modal.modal_main_color
      this.color_text_input = this.colorObject.modal.modal_main_color
      this.color_ok = this.colorObject.modal.modal_main_color
      this.color_title_name_paperless = this.colorObject.modal.modal_main_color
      this.color_message_paperless = this.colorObject.modal.modal_main_color
      this.color_type_paperless_title = this.colorObject.modal.modal_main_color
      this.color_document_format_paperless = this.colorObject.modal.modal_main_color
      this.color_templates_description = this.colorObject.modal.modal_main_color
      this.color_step_btn = this.colorObject.modal.modal_main_color
      this.color_all_step_block = this.colorObject.modal.modal_main_color
      this.color_paperless_file_title = this.colorObject.modal.modal_main_color
      this.color_save = this.colorObject.modal.modal_main_color
      this.color_chevron_left = this.colorObject.main_color
      this.color_save_doc = this.colorObject.main_color
      this.color_savedraft = this.colorObject.toolbar.toolbar_bg_color1
      this.color_btn_saveStep = this.colorObject.main_color
      this.color_pplLoadTemplate = this.colorObject.main_color 
      this.color_btn_save_ppl = this.colorObject.modal.modal_sub_color
      this.color_comment_icon = this.colorObject.main_color
    },
    applyAttachFiles() {
      var holdFiles = this.attachedFiles.filter(item => !item.waitUpload)
      if(this.files.length) {
        this.files.forEach(e => {
          holdFiles.push({
            file_id:e.name,
            file_name:e.name,
            username:"",
            waitUpload: true
          })
        })
        // this.uploadAttachFile('', this.eform_id)
      }
      this.attachedFiles = holdFiles
      // this.$store.commit('setUploadedFile',this.files)
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.preview_template
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.preview_template
        }
      this.error_pdf_setting_password = this.textLang.offer_dialog.pdf_setting_error
    },
    zoomIn() {
      if (this.zoom_level < 200) {
        this.zoom_level += 10;
      }
      $("#workpaper").css("zoom", String(this.zoom_level) + "%")
    },
    zoomOut() {
      if (this.zoom_level > 10) {
        this.zoom_level -= 10;
      }
      $("#workpaper").css("zoom", String(this.zoom_level) + "%")
    },
    backToMyForm() {
      this.$router.push({ path: "/form" })
    },
    moveToPage(pnum) {
      if (pnum != 0 && pnum <= this.pages.length) {
        this.orientation = this.pages[pnum - 1].template_side
        this.currentPage = pnum
        this.template_array.forEach(e => {
          if (e.page == this.currentPage) {
            e.show = true
          } else {
            e.show = false
          }
        })
      }
    },
    toggleComment() {
      if(this.open_comment == false) { //to open comment
        this.col_preview_sm = 12
        this.col_comment_sm = 11
        this.col_preview = 9
        this.col_comment = 3
        this.open_comment = true
      } else { //to close comment
        this.col_preview_sm = 12
        this.col_comment_sm = 0
        this.col_preview = 12
        this.col_comment = 0
        this.open_comment = false
      }
    },
    async returnEform(eform_id) {
      if(eform_id) {
        try {
          var { data } = await this.axios.post(this.$api + '/permission_view_eform',
          {
            e_id: eform_id,
            status:"close"
          },
          {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
            }
          })
          sessionStorage.setItem('onView',false)
        }
        catch(e) {
          console.log(e)
        }
      }
    },
    async getData() {
      if (sessionStorage.getItem("preview") == "true") {
        this.eform_id = sessionStorage.getItem("eform_id")
        this.download_url = sessionStorage.getItem("download_url")
        this.view_url = sessionStorage.getItem("view_url")
        this.option =JSON.parse(sessionStorage.getItem('viewOption'))
        this.getValue(this.eform_id)
      } else {
        if (typeof sessionStorage.getItem("template_array") === "undefined" ||sessionStorage.getItem("template_array") == "false") {
          var objectTemp = await this.getTemplateTemp(JSON.parse(sessionStorage.getItem("template_array_code")))
          this.files = await this.getTempFiles()
          this.template_array = objectTemp.template_array
          this.dataTableObjectArray = objectTemp.dataTableObjectArray
        } else {
          this.template_array = JSON.parse(sessionStorage.getItem("template_array"))
          this.dataTableObjectArray = JSON.parse(sessionStorage.getItem("dataTableObjectArray"))
        }
        this.name_template = sessionStorage.getItem("name_template")
        this.template_code = sessionStorage.getItem("template_code")
        this.code_template = sessionStorage.getItem("code_template")
        this.version_template = sessionStorage.getItem("version_template")
        this.templates.description = sessionStorage.getItem("description")
        var tempPplCode = JSON.parse(sessionStorage.getItem("template_paperless_code"))
        this.attachedFiles = JSON.parse(sessionStorage.getItem("Folder_Attachment_Name"))
        var pageTemp = JSON.parse(sessionStorage.getItem('pageTemp'))
        var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
        this.templates = temp_option
        this.templateId = this.templates.template_code
        this.currentFlowId = this.templates.flow_id
        this.flowChoices = [{
          text: this.textLang.offer_dialog.default_value,
          value: this.templates.flow_id
        }]
        if(typeof this.templates.document_option.extraWorkflow !== 'undefined') {
          this.templates.document_option.extraWorkflow.forEach(e => {
            this.flowChoices.push({
              text: e.name,
              value: e._id
            })
          })
        }
        this.getFlowData()
        if(this.templates.document_option && typeof this.templates.document_option['nextTemplates'] !== 'undefined') {
          this.nextTemplates = this.templates.document_option['nextTemplates']
        }
        if(typeof temp_option !== 'undefined' && temp_option && temp_option.e_id !== 'undefined') {
          this.isSaveTemplate = true
          this.eform_id = temp_option.e_id
        }
        if(temp_option !== 'undefined' && typeof temp_option.document_option !== 'undefined' && typeof temp_option.document_option.isPdfLock !== 'undefined') {
          this.isPdfLock = temp_option.document_option.isPdfLock
        }
        if (typeof this.attachedFiles == "undefined" ||this.attachedFiles == null ) {
          this.attachedFiles = []
        }
        // this.files = this.$store.state.uploadedFile
        this.uploadFolder = sessionStorage.getItem('uploadFolder')
        // if (tempPplCode && tempPplCode[0].document_type) {
        //   this.defaultPplTemplate = tempPplCode[0].code
        //   this.template_paperless_code = tempPplCode[0].code
        // }
        this.pageOrientation = JSON.parse(
          sessionStorage.getItem("orientation")
        )
        var pageLength = this.pageOrientation.length
        for (var i = 0; i < pageLength; i++) {
          var isHidePage = false
          if(typeof pageTemp[i] !== 'undefined' && typeof pageTemp[i].isHide !== 'undefined') {
            isHidePage = pageTemp[i].isHide
          }
          this.pages.push({
            template_side: "PORTRAIT",
            isHide: isHidePage
          })
        }
        for (var i = 0; i < pageLength; i++) {
          var Okey = Object.keys(this.pageOrientation[i])[0]
          if (this.pageOrientation[i][Okey]) {
            this.pages[Number(Okey) - 1].template_side = this.pageOrientation[i][Okey].toUpperCase()
          }
        }
        this.orientation = this.pages[0].template_side
        if (this.orientation == "LANDSCAPE") {
          this.current_paper_width = this.paper_size[this.paperSizeIndex].height
          this.current_paper_height = this.paper_size[this.paperSizeIndex].width - 50
        }
        this.width_hr = (Math.sqrt((this.current_paper_width*this.current_paper_width)+(this.current_paper_height*this.current_paper_height))-700)/2
        var paperSize = sessionStorage.getItem('paper_size')
        if(paperSize && typeof paperSize !== 'undefined' && paperSize != 'undefined') {
          this.paperSizeIndex = this.paper_size.find(item => item.text.toUpperCase() == paperSize.toUpperCase()).value
        } 
        if (sessionStorage.getItem("flow_permission") != "undefined") {
          this.stepPermission = JSON.parse(
            sessionStorage.getItem("flow_permission")
          );
        }
        this.editStep = sessionStorage.getItem("editStep") == "true"
        this.isCa = sessionStorage.getItem('caStep') == 'true'
        this.currentSignStep.name = sessionStorage.getItem('caStepName')
        this.sleep = true
      }
    },
    async getTemplateTemp(template_array_code) {
      this.notReady = false
      return this.objectTemplate
      // try {
      //   // this.notReady = false
      //   // return this.$store.state.objectTemp

      //   var url = ''
      //   if(this.isPublic) {
      //     url = '/object_template_guest'
      //   } else {
      //     url = '/object_template'
      //   }
      //   var { data } = await this.axios.get(
      //     this.$api + url + "?template_code=" + template_array_code,
      //     {
      //       headers: {
      //         Authorization:
      //           "Bearer " + sessionStorage.getItem("one_access_token")
      //       }
      //     }
      //   );
      //   this.notReady = false
      //   if (data.messageER != "ER" && data.messageText != null) {
      //     this.$store.commit('setObjectTemplate',data.messageText.data[0].object)
      //     return data.messageText.data[0].object
      //   } else {
      //     return []
      //   }
      // } catch (err) {
      //   this.notReady = false;
      //   if (err.response != null) {
      //     if (err.response.status == 401) {
      //       this.$router.push("/login")
      //     }
      //   } else {
      //     console.log(err.message)
      //   }
      // }
    },
    async getTempFiles() {
      return this.uploadedFile
    },
    async getValue(eform_id) {
      try {
        await this.returnEform(eform_id)
        this.notReady = true
        var { data } = await this.axios.get(
          this.$api_v6 + '/upload_eform?eform_id=' + eform_id + '&status_draft=' + this.option.showAsDraft,
          {
            headers: {
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          }
        )
        this.notReady = false
        if(data.result == 'OK') {
          this.templates = data.messageText[0]
          var tempOpt = {}
          Object.keys(this.templates).forEach(e => {
            if(e != 'template_header' && e != 'template_body' && e != 'template_footer' && e != 'pdf_File' && e != 'html') {
              tempOpt[e] = this.templates[e]
            }
          })
          if(sessionStorage.getItem('checkOwner') == 'true') {
            this.isOwner = this.templates.create_by == JSON.parse(sessionStorage.getItem("userprofile")).username
          }
          sessionStorage.setItem("template_option", JSON.stringify(tempOpt))
          this.doc_no = this.templates.doc_number_eform
          this.templateId = this.templates.e_template_code
          this.pdfHtml = this.templates.html
          this.refDataDoc = this.templates.ref_document_number
          if(this.templates.comment.length) {
            this.docComment = this.templates.comment
          }
          if (!this.templates.permission_form) {
            this.isBiz = false
          } else {
            this.isBiz = true
          }
          if(this.templates.paperless_data && typeof this.templates.paperless_data.option_page !== 'undefined') {
            this.optionsPage = this.templates.paperless_data.option_page
            this.pplSubject = this.templates.document_name
            this.pplBody = this.optionsPage.body_text
          }
          if(typeof this.templates.document_option !== 'undefined' && typeof this.templates.document_option.isPdfLock !== 'undefined') {
            this.isPdfLock = this.templates.document_option.isPdfLock
          }
          this.isFlow = this.templates.status_flow_permission
          this.pageOrientation = this.templates.orientation
          var pageLength = this.pageOrientation.length
          for (var i = 0; i < pageLength; i++) {
            this.pages.push({
              template_side: "PORTRAIT",
              isHide:false
            });
          }
          for (var i = 0; i < pageLength; i++) {
            var Okey = Object.keys(this.pageOrientation[i])[0]
            if (this.pageOrientation[i][Okey]) {
              this.pages[Number(Okey) - 1].template_side = this.pageOrientation[
                i
              ][Okey].toUpperCase()
            }
          }
          this.orientation = this.pages[0].template_side
          if (this.orientation == "LANDSCAPE") {
            this.current_paper_width = this.paper_size[0].height;
            this.current_paper_height = this.paper_size[0].width - 50;
          }
          this.width_hr = (Math.sqrt((this.current_paper_width*this.current_paper_width)+(this.current_paper_height*this.current_paper_height))-700)/2
          if(this.templates.paper_size) {
            this.paperSizeIndex = this.paper_size.find(item => item.text.toUpperCase() == this.templates.paper_size.toUpperCase()).value
          }

          if (this.templates.ppl_status_upload != "OK" && !this.templates.signing && (sessionStorage.getItem('isUploaded') != 'true')) {
            // if (this.templates.ppl_template_code && this.templates.ppl_template_code[0].document_type) {
            //   this.template_paperless_code = this.templates.ppl_template_code[0].code
            //   this.defaultPplTemplate = this.templates.ppl_template_code[0].code
            // }
            this.uploadAble = true
          }
          if(this.isFlow && !this.templates.signing && (sessionStorage.getItem('isUploaded') != 'true')) {
            var allFlow = this.templates.flow_permission
            allFlow.sort((a, b) => (a.step_num > b.step_num) ? 1 : -1)
            var myMailList = JSON.parse(sessionStorage.getItem("one_email_list"))
            this.uploadAble = false
            myMailList.forEach(ml => {
              if(allFlow[allFlow.length-1].email.includes(ml)) {
                this.uploadAble = true
              }
            })
          }
          this.attachedFiles = this.templates.Folder_Attachment_Name
          if (typeof this.attachedFiles == "undefined") {
            this.attachedFiles = []
          }
          if (this.attachedFiles.length) {
            if (this.templates.folder_name) {
              this.uploadFolder = this.templates.folder_name[0]
            }
          }
          if(this.templates.document_option && typeof this.templates.document_option['nextTemplates'] !== 'undefined') {
            this.nextTemplates= this.templates.document_option['nextTemplates']
          }
          this.syncValue()  
        } else if(data.result == 'ER') {
          if(data.messageER == 'RESERVED') {
            this.$router.push('/inbox')
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
              text: this.textLang.alert.duplicate_user_form,
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
      } catch (err) {
        this.notReady = false
        if (err.response != null) {
          if (err.response.status == 401) {
            this.$router.push("/notfound")
          }
        } else {
          console.log(err.message)
        }
      }
    },
    syncValue() {
      this.name_template = this.templates.template_name
      this.isPreview = true
      for (var i = 0; i < this.templates.orientation.length; i++) {
        var THKey = Object.keys(this.templates.template_header[i])[0]
        this.templates.template_header[i][THKey].forEach(e => {
          e.show = false
          if(e.object_name) {
            e.name = e.object_name.split(" ").join("") 
          }
          e.name = e.name.split("/").join("-")
          e.name = e.name.split("_").join("-")
          e.name = e.name.split(".").join("-")
          this.template_array.push(e)
        });
        var TBKey = Object.keys(this.templates.template_body[i])[0]
        this.templates.template_body[i][TBKey].forEach(e => {
          if (e.object_type == "dataTableObjectArray") {
            this.dataTableObjectArray = e.value
          } else {
            e.show = false
            if(e.object_name) {
              e.name = e.object_name.split(" ").join("") 
            }
            e.name = e.name.split("/").join("-")
            e.name = e.name.split("_").join("-")
            e.name = e.name.split(".").join("-")
            this.template_array.push(e)
          }
        });
        var TFKey = Object.keys(this.templates.template_footer[i])[0]
        this.templates.template_footer[i][TFKey].forEach(e => {
          e.show = false
          if(e.object_name) {
            e.name = e.object_name.split(" ").join("") 
          }
          e.name = e.name.split("/").join("-")
          e.name = e.name.split("_").join("-")
          e.name = e.name.split(".").join("-")
          this.template_array.push(e)
        });
      }
      if(this.templates.signing) {
        this.templates.flow_permission.forEach(lastStep => {
          if(lastStep) {
            var signObj = this.template_array.find(item => (item.object_type == 'signbox' && (item.object_name == lastStep.role[0].object_name || (typeof item.style.permission_section.section !== 'undefined' && item.style.permission_section.section.includes(lastStep.role[0].object_name)))))
            if(signObj) {
              var indx = this.template_array.indexOf(signObj)
              this.template_array[indx].style.signUrl = lastStep.url_sign
            }
          }
        })
      }
      this.sleep = true
    },
    async getFlowData() {
        try {
          if(this.currentFlowId){
            var tax_id = JSON.parse(sessionStorage.getItem('template_option')).tax_id
            var url = `/flowdata/api/v1/get1/?_id=${this.currentFlowId}&tax_id=${tax_id}&no_base=true`
            var {data} = await this.axios.get(this.$api_url + url)
            if(data.status){
              this.flow_data = data.data.flow_data
              this.isPassword = data.data.is_password
            }
          }
        } catch (error) {
          console.log(error);
        }
    },
    async setPosition() {
      var pageLength = this.pages.length
      for (var i = 1; i <= pageLength; i++) {
        this.template_header[0][String(i)] = []
        this.template_body[0][String(i)] = []
        this.template_footer[0][String(i)] = []
      }
      var dataTableCount = 0;
      var hold = "";
      this.template_array.forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("word-wrap", "break-word")
        if(e.object_type != "datatable") {
          $("#" + e.name).css("height", String(e.height) + "px")
        }
        if(typeof e.style.suffix === 'undefined') {
          e.style.suffix = ''
        }
        if(typeof e.valueShow === 'undefined') {
          e.valueShow = e.value
        }
        if (e.object_type != "checkbox") {
          if (e.object_type == "table" || e.object_type == "inputimagebox") {
            if (!e.width) {
              $("#" + e.name).css("width", "auto")
            } else {
              $("#" + e.name).css("width", String(e.width) + "px")
            }
          } else if (e.object_type == "textfield") {
            $("#" + e.name).css("width", String(e.width + 5) + "px")
          } else {
            $("#" + e.name).css("width", String(e.width) + "px")
          }
        }
        if(typeof e.style.suffix === 'undefined') {
          e.style.suffix = ""
        }
        $("#" + e.name).css("opacity", 1)
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        this.selectObject(e)

        if (e.object_type == "textfield") {
          e.font_style = this.change_fontstyle(e)
        } else if (e.object_type == "inputbox") {
          e.font_style = this.change_fontstyle(e)
        } else if (e.object_type == "rectangle") {
          $("#" + e.name).css("z-index", e.style.zIndex)
          this.change_bordersize()
          this.change_backgroundcolor()
          this.change_bordercolor()
        } else if (e.object_type == "textareabox") {
          e.font_style = this.change_fontstyle(e)
        } else if (e.object_type == "dropdownbox") {
          e.font_style = this.change_fontstyle(e)
        } else if (e.object_type == "datepickerbox") {
          e.font_style = this.change_fontstyle(e)
        } else if (e.object_type == "checkbox") {
          if(typeof e.text === 'undefined') {
            e.text = ''
          }
          e.font_style = this.change_fontstyle(e)
        } else if (e.object_type == "calculatebox") {
          if(typeof e.valueShow === 'undefined') {
            e.valueShow = e.value
          }
          e.font_style = this.change_fontstyle(e)
          e.style.isComma = true
        } else if (e.object_type == "datatable") {
          dataTableCount += 1
          hold = this.selected_object
        } else if (e.object_type == "autofillbox") {
          e.font_style = this.change_fontstyle(e)
          if (e.value.show == "doc_no" && !this.doc_no) {
            this.doc_no = e.value.show_index
          }
          if (!e.value.isUser && !(e.value.show == 'leader_role_th')) {
            e.value.show_value = this.dataBlind(e.value.object_name)
          }
        } else if (e.object_type == "table") {
          $("#" + e.name).css("z-index", e.style.zIndex)
        } else if (e.object_type == "line") {
          $("#" + e.name).css("z-index", e.style.zIndex)
        } else if (e.object_type == "signbox") {
          $("#" + e.name).css("z-index", e.style.zIndex)
          if (this.isFlow) {
            if (e.style.permission_section && typeof e.style.permission_section.section !== 'undefined' && e.style.permission_section.section.length) {
              var objSection = e.style.permission_section.section
              objSection.forEach(oS => {
                var signedSection = this.templates.flow_permission.find(item => item.role[0].object_name == oS)
                if(signedSection && signedSection.url_sign) {
                  e.value = signedSection.url_sign
                }
              })
            } else {
              var signedSection = this.templates.flow_permission.find(item => item.role[0].object_name == e.object_name)
              if(signedSection && signedSection.url_sign) {
                e.value = signedSection.url_sign
              }
            }
          }
          this.signNoFlow = sessionStorage.getItem('isNoFlowSign') == 'true'
        } else if (e.object_type == "inputimagebox") {
          $("#" + e.name).css("z-index", e.style.zIndex)
          if (e.style.isValued) {
            e.style.image_width = String(e.width)
            e.style.image_height = String(e.height)
          }
        }
        if (e.object_type == "datepickerbox") {
          this.change_dateformat()
        }
        e.show = true
        if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
          this.contTableArray.push(e.style.contTable)
        }
      })

      var contTableArray = this.template_array.filter(item => item.style.contTable && !this.contTableArray.includes(item.object_name) )
      for (let i=0; i<contTableArray.length; i++) {
        await this.changeConTable(contTableArray[i])
      }
      
      this.template_array.forEach( e => {
         e.section == "header" && typeof this.template_header[0][String(e.page)] !== 'undefined'
          ? this.template_header[0][String(e.page)].push(e)
          : e.section == "body" && typeof this.template_body[0][String(e.page)] !== 'undefined'
          ? this.template_body[0][String(e.page)].push(e)
          : e.section == "footer" && typeof this.template_footer[0][String(e.page)] !== 'undefined'
          ? this.template_footer[0][String(e.page)].push(e)
          : this.template_body[0]["1"].push(e)
      })
      if (Object.keys(this.dataTableObjectArray).length) {
        var dataShowValue = {}
        Object.keys(this.dataTableObjectArray).forEach(e => {
          if(typeof this.dataTableObjectArray[e].text === 'undefined') {
            this.dataTableObjectArray[e].text = ''
          }
          if(typeof this.dataTableObjectArray[e].style.suffix === 'undefined') {
            this.dataTableObjectArray[e].style.suffix = ''
          }
          if(typeof this.dataTableObjectArray[e].show_value=== 'undefined') {
            this.dataTableObjectArray[e].show_value = ''
          }
          if(typeof this.dataTableObjectArray[e].valueShow === 'undefined') {
            this.dataTableObjectArray[e].valueShow = this.dataTableObjectArray[e].value
          }
          if (typeof dataShowValue[e.split("_")[0]] === "undefined") {
            dataShowValue[e.split("_")[0]] = {}
          }
          var dataObj = this.template_array.find(
            item => item.object_name == e.split("_")[0]
          )
          if(typeof dataObj === 'undefined') {
            dataObj = {
              style:{}
            }
          }
          if(dataObj.style.exportDatatable === 'undefined' || typeof dataObj.style.exportDatatable === 'undefined') {
            dataObj.style.exportDatatable = false
          }
          dataShowValue[e.split("_")[0]][e] = {
            value: this.dataTableObjectArray[e].show_value,
            json_key: this.dataTableObjectArray[e].style.json_key,
            row: e.split("_")[1].split("C")[0].split("R")[1],
            col: e.split("C")[1],
            object_name: this.dataTableObjectArray[e].object_name,
            object_type: this.dataTableObjectArray[e].object_type,
            email_report: this.dataTableObjectArray[e].style.email_report,
            role_id: this.dataTableObjectArray[e].style.role_id,
            exportDatatable: dataObj.style.exportDatatable
          }
          if (dataShowValue[e.split("_")[0]][e].row == "1") {
            if (
              typeof dataShowValue[e.split("_")[0]]["header"] == "undefined"
            ) {
              dataShowValue[e.split("_")[0]]["header"] = {}
            }
            if (this.dataTableObjectArray[e].object_type != "textfield") {
              dataShowValue[e.split("_")[0]].header[
                dataShowValue[e.split("_")[0]][e].col
              ] = this.dataTableObjectArray[e].style.json_key
                .split("_1")
                .join("")
            } else {
              dataShowValue[e.split("_")[0]].header[
                dataShowValue[e.split("_")[0]][e].col
              ] = this.dataTableObjectArray[e].show_value
            }
          }
        })
        this.template_body[0]["1"].push({
          object_type: "dataTableObjectArray",
          object_name: "dataTableObjectArray",
          value: this.dataTableObjectArray,
          show_value: dataShowValue
        })
      }

      if (dataTableCount > 0) {
        this.selected_object = hold
      }
      this.ready = true
      if(sessionStorage.getItem('isInstantSave') == 'true') {
        this.checkSave(sessionStorage.getItem('isDraft') == 'true')
      }
    },
    afterSignCheck() {
      if(sessionStorage.getItem('showDraft') == 'true') {
        if(this.editStep && !this.allUserStep ) {
          this.saveStep(true)
        } else {
          this.openDocName(false)
        }
      } else if(sessionStorage.getItem('saveDoc') == 'true' && sessionStorage.getItem('preview_save') == 'false') {
        if((((!this.isPreview && !this.editStep && !this.allUserStep) || this.allUserStep) || (this.isPublic && !this.isPreview)) && this.ready && !this.draftPreview ) {
          this.checkSave()
        } else if (this.editStep && !this.allUserStep && !this.isPublic && this.ready && !this.draftPreview) {
          this.openSignature()
        }
      }
      if(this.noFlowSignPic) {
        this.template_array.forEach(e => {
          if(e.object_type == 'signbox') {
            e.value = this.noFlowSignPic
          }
        })
      }
    },
    async changeConTable(checkObj) {
      try {
        var contTableArray = []
        if(checkObj.style.contTable.includes(",")) {
          contTableArray = checkObj.style.contTable.split(",")
        } else {
          contTableArray.push(checkObj.style.contTable)
        }
        for(let i=0; i<contTableArray.length; i++) {
          let contTable = this.template_array.find(item => item.object_name == contTableArray[i])
          if(contTable) {
            let indx = this.template_array.indexOf(contTable)
            let element = document.getElementsByClassName(checkObj.name + "-obj")[0]
            let rect = element.getBoundingClientRect()
            let element2 = document.getElementById(this.template_array[indx].name)
            let paper = document.getElementById("workpaper")
            let paperRect = paper.getBoundingClientRect()
            this.template_array[indx].top = checkObj.top + rect.height - 1
            element2.style.top = String(checkObj.top + rect.height - 1) + "px"
            if(contTable.style.contTable && contTable.style.contTable != checkObj.object_name) {
              await this.changeConTable(contTable)
            }
          }
        }
        
      } catch(e) {
        console.log(e)
      }
     
    },
    dataBlind(item) {
      var value = ""
      if (String(item).startsWith("datatable")) {
        value = this.dataTableObjectArray[item].show_value
      } else {
        this.template_array.forEach(e => {
          if ((e.object_type == "inputbox" || e.object_type == "calculatebox" || e.object_type == "dropdownbox") && e.object_name == item) {
            if(e.style.autoChoicesSelect) {
              value = String(e.value.text)
            } else {
              value = String(e.value)
            }
          }
        })
      }
      return value
    },
    numberToComma(num, isComma) {
      if (num && isComma) {
        var sp_num = String(num).split(".")
        var decimal = "";
        sp_num[1] ? (decimal = sp_num[1]) : (decimal = "")
        num = sp_num[0];
        var commaNum = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        decimal != "" ? (commaNum += "." + decimal) : (commaNum = commaNum)
        return commaNum
      } else {
        return num
      }
    },
    selectObject(item) {
      this.selected_object = this.template_array.indexOf(item)
    },
    change_fontsize() {
      $("#" + this.template_array[this.selected_object].name).css(
        "font-size",
        this.template_array[this.selected_object].style.font_size + "px"
      );
    },
    change_fontstyle(obj) {
      var font_style = obj.style.font_style
      var font_style_value = ""
      font_style.forEach(e => {
        if (e == "b") {
          font_style_value = font_style_value + "font-weight: bold;"
        } else if (e == "i") {
          font_style_value = font_style_value + "font-style: italic;"
        } else if (e == "u") {
          font_style_value = font_style_value + "text-decoration: underline;"
        }
      })
      return font_style_value
    },
    change_fontcolor() {
      $("#" + this.template_array[this.selected_object].name).css(
        "color",
        this.template_array[this.selected_object].style.font_color
      )
    },
    change_bordersize() {
      $("#" + this.template_array[this.selected_object].name + "-box").css(
        "border",
        this.template_array[this.selected_object].style.border_size + "px solid"
      )
    },
    change_bordercolor() {
      if (this.template_array[this.selected_object].object_type == "table") {
        $("#" + this.template_array[this.selected_object].name + "-table").css(
          "border-color",
          this.template_array[this.selected_object].style.border_color
        )
      } else {
        $("#" + this.template_array[this.selected_object].name + "-box").css(
          "border-color",
          this.template_array[this.selected_object].style.border_color
        )
      }
    },
    change_backgroundcolor() {
      if (this.template_array[this.selected_object].object_type == "table") {
        $("#" + this.template_array[this.selected_object].name + "table").css(
          "background-color",
          this.template_array[this.selected_object].style.background_color
        )
      } else {
        $("#" + this.template_array[this.selected_object].name + "-box").css(
          "background-color",
          this.template_array[this.selected_object].style.background_color
        )
      }
    },
    change_borderradias() {
      if (this.template_array[this.selected_object].style.border_radias) {
        $("#" + this.template_array[this.selected_object].name + "-box").css(
          "border-radius",
          "15px"
        )
      } else {
        $("#" + this.template_array[this.selected_object].name + "-box").css(
          "border-radius",
          "0px"
        )
      }
    },
    change_row() {
      $("#" + this.template_array[this.selected_object].name).css(
        "height",
        this.template_array[this.selected_object].style.font_size *
          this.template_array[this.selected_object].style.row +
          5 +
          "px"
      )
    },
    change_dateformat() {
      if (
        this.template_array[this.selected_object].style.date_format == "be" ||
        this.template_array[this.selected_object].style.date_format == "cbe"
      ) {
        this.template_array[
          this.selected_object
        ].show_value = this.setDateFormatBE(
          this.template_array[this.selected_object].value,
          this.template_array[this.selected_object].style.date_format
        )
      } else {
        this.template_array[
          this.selected_object
        ].show_value = this.setDateFormatCE(
          this.template_array[this.selected_object].value
        )
      }
    },
    setDateFormatBE(date, sub) {
      var curDate = date.split("-")
      var thaiDate = ""
      if (sub == "be") {
        thaiDate =
          String(curDate[2]) +
          " " +
          this.getThaiMonth(curDate[1]) +
          " พ.ศ." +
          String(Number(curDate[0]) + 543)
      } else if (sub == "cbe") {
        thaiDate =
          String(curDate[2]) +
          " " +
          this.getSubThaiMonth(curDate[1]) +
          String(Number(curDate[0]) + 543).slice(-2)
      }
      return date ? thaiDate : ""
    },
    setDateFormatCE(date) {
      var curDate = date.split("-")
      var thaiDate =
        String(curDate[2]) +
        " " +
        this.getEngMonth(curDate[1]) +
        " " +
        String(Number(curDate[0]))
      return date ? thaiDate : ""
    },
    getThaiMonth(mon) {
      var thaiMon = ""
      mon == "01"
        ? (thaiMon = "มกราคม")
        : mon == "02"
        ? (thaiMon = "กุมภาพันธ์")
        : mon == "03"
        ? (thaiMon = "มีนาคม")
        : mon == "04"
        ? (thaiMon = "เมษายน")
        : mon == "05"
        ? (thaiMon = "พฤษภาคม")
        : mon == "06"
        ? (thaiMon = "มิถุนายน")
        : mon == "07"
        ? (thaiMon = "กรกฎาคม")
        : mon == "08"
        ? (thaiMon = "สิงหาคม")
        : mon == "09"
        ? (thaiMon = "กันยายน")
        : mon == "10"
        ? (thaiMon = "ตุลาคม")
        : mon == "11"
        ? (thaiMon = "พฤศจิกายน")
        : mon == "12"
        ? (thaiMon = "ธันวาคม")
        : (thaiMon = "อื่นๆ")
      return thaiMon
    },
    getSubThaiMonth(mon) {
      var thaiMon = ""
      mon == "01"
        ? (thaiMon = "ม.ค.")
        : mon == "02"
        ? (thaiMon = "ก.พ.")
        : mon == "03"
        ? (thaiMon = "มี.ค.")
        : mon == "04"
        ? (thaiMon = "เม.ย.")
        : mon == "05"
        ? (thaiMon = "พ.ค.")
        : mon == "06"
        ? (thaiMon = "มิ.ย.")
        : mon == "07"
        ? (thaiMon = "ก.ค.")
        : mon == "08"
        ? (thaiMon = "ส.ค.")
        : mon == "09"
        ? (thaiMon = "ก.ย.")
        : mon == "10"
        ? (thaiMon = "ต.ค.")
        : mon == "11"
        ? (thaiMon = "พ.ย.")
        : mon == "12"
        ? (thaiMon = "ธ.ค.")
        : (thaiMon = "อื่นๆ")
      return thaiMon
    },
    getEngMonth (mon) {
      var engMon = ''
      mon == '01'? engMon = 'January':
      mon == '02'? engMon = 'Febuary':
      mon == '03'? engMon = 'March':
      mon == '04'? engMon = 'April':
      mon == '05'? engMon = 'May':
      mon == '06'? engMon = 'June':
      mon == '07'? engMon = 'July':
      mon == '08'? engMon = 'August':
      mon == '09'? engMon = 'September':
      mon == '10'? engMon = 'October':
      mon == '11'? engMon = 'November':
      mon == '12'? engMon = 'December':
      engMon = 'Else'
      return engMon
    },
    openRefDoc() {
      var refDoc = this.refDataDoc
      if(this.refDataDoc.length && typeof this.refDataDoc[0].ref_code !== 'undefined') {
        refDoc = []
        this.refDataDoc.forEach(e => {
          refDoc.push(e.ref_code)
        })
      }
      EventBus.$emit("openReferenceDocument",refDoc)
    },
    openAttachFile() {
      var folderAttach = []
      if(typeof this.attachedFiles !== 'undefined') {
        folderAttach = this.attachedFiles
      }
      EventBus.$emit('openAttachFile', folderAttach)
    },
    AddAttachFile() {
        var uploadingFiles = this.files
        var attFiles = []
        EventBus.$emit('attachFiles', uploadingFiles, attFiles)
      },
    checkSave(isDraft) {
      this.isSaveDraft = isDraft
      if(sessionStorage.getItem("firstSent") == "true") {
        this.openDocName()
      } else {
        if(sessionStorage.getItem('signStep') == 'true') {
          EventBus.$emit('openSignPad')
        } else {
          this.updateDocument()
        } 
      }
      // var flowStatus = JSON.parse(sessionStorage.getItem("template_option")).status_flow_permission
      // if(!flowStatus) {
      //   this.pplLoadTemplate()
      // } else {
      //   this.openDocName(false)
      // }
    },
    saveName(thenUpload) {
      if(this.pplSubject && (!this.isPdfLock || (this.isPdfLock && this.pdfPasswordSetting))) {
        this.doc_name = this.pplSubject
        this.name_ppl_error = false
        this.error_file_name_ppl_msg = ""
        var paperless_data = JSON.parse(sessionStorage.getItem("template_option")).paperless_data
        if(paperless_data && paperless_data.option_page) {
          this.optionsPage = paperless_data.option_page
        }
        if(!this.doc_name && this.optionsPage.subject_text) {
          this.doc_name = this.optionsPage.subject_text
        }
        
        this.save(this.doc_name, [], this.optionsPage, "", thenUpload)
      } else {
        this.name_ppl_error = true
        this.error_file_name_ppl_msg = this.textLang.offer_dialog.name_ppl_error
      }
    },
    async saveAndUpload() {
      var validEmail = await this.checkNullEmail(this.template_paperless_code.Template_step)
      if(validEmail) {
        this.saveName(true)
      }
    },
    openDocName() {
      var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
      this.pplSubject = temp_option.template_name
      this.dialog_ppl = true
    },
    async checkName() {
      var validEmail = await this.checkNullEmail(this.flow_data)
      if(this.pplSubject != '' && validEmail) {
        if(sessionStorage.getItem('signStep') == 'true') {
          EventBus.$emit('openSignPad')
        } else {
          var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
          this.saveDocument(temp_option)
        }
      }
    },
    async saveSign(sign64) {
      if(sessionStorage.getItem("firstSent") == "true") {
         var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
        this.saveDocument(temp_option, sign64)
      } else {
        this.updateDocument(sign64)
      }
    },
    async uploadSign(sign64) {
      try {
        this.notReady = true
        var { data } = await this.axios.post(this.$api + "/upload_image_sign",
        {
          sign_base: sign64
        },
        {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
          }
        })
        if(data.result == "OK") {
          this.noFlowSignPic = data.messageText
        }
        this.notReady = false
      } catch (err) {
        this.notReady = false
      }
    },
    async saveStep(isDraft) {
      try {
        if(this.noFlowSignPic) {
          await this.replacSignObject()
        }
        this.buttonClicked = true
        this.statusDraft = isDraft
        var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
        var business = ""
        if (temp_option.permission_form) {
          business = temp_option.permission_form
        }
        var code_doc = ""
        var ver_doc = ""
        if (temp_option.code_document) {
          code_doc = temp_option.code_document
        }
        if (temp_option.version_document) {
          ver_doc = temp_option.version_document
        }
        this.notReady = true
        var temPplCode = JSON.parse(
          sessionStorage.getItem("template_paperless_code")
        )
        var sizeTemp = [{}]
        var orientationTemp = [{}]
        for (var i = 1; i <= this.pageOrientation.length; i++) {
          sizeTemp[0][String(i)] = []
          var Okey = Object.keys(this.pageOrientation[i - 1])[0]
          orientationTemp[0][Okey] = this.pageOrientation[i - 1][Okey]
        }
        if (temp_option.comment == null) {
          temp_option.comment = []
        }
        var url = this.$api_v6 + "/upload_eform"
        if (!temp_option.status_flow_permission) {
          url = this.$node_api + "/update_noflow"
        }
        var { data } = await this.axios.put(
          url,
          {
            ppl_template_code: JSON.stringify(temPplCode),
            temp_code: temp_option.e_template_code,
            header_template: this.template_header,
            body_template: this.template_body,
            footer_template: this.template_footer,
            code_document: code_doc,
            version_document: ver_doc,
            size_header: sizeTemp,
            size_body: sizeTemp,
            size_footer: sizeTemp,
            template_name: temp_option.template_name,
            status_draft: this.statusDraft,
            document_name: temp_option.document_name,
            permission_form: business,
            orientation: orientationTemp,
            e_template_code: temp_option.e_template_code,
            document_id: temp_option.document_id,
            e_id: temp_option.e_id,
            paper_size: temp_option.paper_size,
            comment: temp_option.comment,
            description: temp_option.description,
            ppl_sign: temp_option.ppl_sign,
            document_type_code: temp_option.document_type_code,
            location: {
              latitude: this.saveLatitude,
              longitude: this.saveLongitude
            },
            html: this.genHtml(false),
            html_ppl: this.genHtml(true),
            ppl_sign_base: this.pplSignBase,
            ref_document_number: this.refDataDoc,
            folder_name: this.uploadFolder,
            current_step: this.currentStep
          },
          {
            headers: {
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          }
        )
        this.notReady = false
        if (data.result == "OK") {
          if(data.response_bi && data.response_bi.Warning_Detail!=null){
            if(data.response_bi.Warning_Massager == 'green') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            } else if(data.response_bi.Warning_Massager == 'yellow') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            } else if(data.response_bi.Warning_Massager == 'red') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            }
          }
          if (this.files.length) {
            // this.uploadAttachFile(temp_option.doc_number_eform, temp_option.e_id)
          }
          // if(typeof sessionStorage.getItem('template_array')  == 'undefined' || sessionStorage.getItem('template_array') == 'false') {
          //   this.deleteTemplateTemp(JSON.parse(sessionStorage.getItem('template_array_code')))
          // }
          this.disableButton(temp_option.e_id)
          this.sendUpdateChat(temp_option.e_id)
          if (this.isComplete) {
            this.eform_id = temp_option.e_id
            var template_code = JSON.parse(sessionStorage.getItem('template_option')).template_code
            var speacailForm = this.$speacailForm
            if(speacailForm.includes(template_code)) {
              this.sendMailOnebox()
            }
            var html = this.genHtml(false)
            sessionStorage.setItem('isUploaded', false)
            if(this.isPdfLock) {
              this.thenOpenPpl = true
            }
            await this.sendHtml(html, false, 0)
            if(!this.isPdfLock) {
              if(!this.statusDraft) {
                this.isPreview = true
                this.pplLoadTemplate()
              }
            }
          } else {
            if(!this.statusDraft && !temp_option.status_flow_permission) {
              var html = this.genHtml(false)
              sessionStorage.setItem('isLastStep', true)
              if(this.isPdfLock) {
                this.thenOpenPplNoFlow = true
              }
              await this.sendHtml(html, false, 0)
              if(!this.isPdfLock) {
                sessionStorage.setItem('isUploaded', false)
                sessionStorage.setItem('preview',true)
                sessionStorage.setItem('editStep', false)
                sessionStorage.setItem('download_url',this.download_url)
                this.isPreview = true
                this.editStep = false
                this.uploadAble = true
                this.pplLoadTemplate()
              }
            } else {
              this.$router.push({ path: "/inbox" })
            }
          }
        } else {//result = ER
          if(data.response_bi && data.response_bi.Warning_Detail!=null){
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
              text: data.response_bi.Warning_Detail,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 15000,
              customClass: {
                popup: 'alert-card',
                title: 'alert-title-block',
                closeButton: 'close-alert-btn',
                htmlContainer: 'alert-text-block'
              }
            })
          } else if(data.messageER == "already save") {
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
              text: this.textLang.alert.duplicate_save,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 15000,
              customClass: {
                popup: 'alert-card',
                title: 'alert-title-block',
                closeButton: 'close-alert-btn',
                htmlContainer: 'alert-text-block'
              }
            })
          }
        }
        this.buttonClicked = false
      } catch (error) {
        this.notReady = false
        this.buttonClicked = false
        console.log(error.message)
      }
    },
    replacSignObject() {
      var pageKey = Object.keys(this.template_header[0])
      pageKey.forEach( k => {
        this.template_header[0][k].forEach(e => {
          if(e.object_type == 'signbox') {
            e.value = this.noFlowSignPic
          }
        })
        this.template_body[0][k].forEach(e => {
          if(e.object_type == 'signbox') {
            e.value = this.noFlowSignPic
          }
        })
        this.template_footer[0][k].forEach(e => {
          if(e.object_type == 'signbox') {
            e.value = this.noFlowSignPic
          }
        })
      })
    },
    async save(document_name, uploadFiles, opsPage, sign64, thenUpload) {
      try {
        if(this.noFlowSignPic) {
          await this.replacSignObject()
        }
        this.dialog_ppl = false
        var business = ""
        this.optionsPage = opsPage
        this.doc_name = document_name
        if (JSON.parse(sessionStorage.getItem("selected_business")).id) {
          business = JSON.parse(sessionStorage.getItem("selected_business"))
        }
        var code_tmp = ""
        var ver_tmp = ""
        if (this.code_template) {
          code_tmp = this.code_template
        }
        if (this.version_template) {
          ver_tmp = this.version_template
        }
        if(this.allUserStep) {
          if(sign64) {
            this.currentSignStep.sign = sign64
          } else {
            this.currentSignStep.sign = sessionStorage.getItem("sign_url")
          }
        }
        this.notReady = true
        var temPplCode = JSON.parse(sessionStorage.getItem("template_paperless_code"))
        var sizeTemp = [{}]
        var orientationTemp = [{}]
        for (var i = 1; i <= this.pageOrientation.length; i++) {
          sizeTemp[0][String(i)] = []
          var Okey = Object.keys(this.pageOrientation[i - 1])[0]
          orientationTemp[0][Okey] = this.pageOrientation[i - 1][Okey]
        }
        var flowData = []
        if (JSON.parse(sessionStorage.getItem("template_option")).status_flow_permission
        ) {
          var flowPermission = JSON.parse(sessionStorage.getItem("template_option") ).flow_permission
          if (!(typeof flowPermission[0] === "undefined")) {
            if (flowPermission[0].step_num != "0") {
              flowData = JSON.parse(sessionStorage.getItem("flowPermission"))
            }
          }
        }
        var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
        var description = ""
        if (temp_option.description_template) {
          description = temp_option.description_template
        } else if (temp_option.description) {
          description = temp_option.description
        }
        if (ver_tmp == "undefined") {
          ver_tmp = temp_option.version_document
        }
        if (code_tmp == "undefined") {
          code_tmp = temp_option.code_document
        }
        var comments = []
        if(temp_option.comment) {
          comments = temp_option.comment
        }
        var url = ""
        if(this.isPublic) {
          url = this.$api + "/upload_eform_guest"
        } else {
          url = this.$api_v6 + "/upload_eform"
          var speacailForm = this.$speacailForm
          if(speacailForm.includes(temp_option.template_code)) {
            url = this.$node_api + "/create_eform"
          }
        }
        this.templates.description = description
        if(flowData.length) {
          var stepOne = flowData.find(item => item.step_num == 1)
          if(stepOne) {
            if(stepOne.status == 'Complete') {
              this.allUserStep = true
            }
          }
      }
        var { data } = await this.axios.post(
          url,
          {
            ppl_template_code: JSON.stringify(temPplCode),
            temp_code: temp_option.template_code,
            header_template: this.template_header,
            body_template: this.template_body,
            footer_template: this.template_footer,
            code_document: code_tmp,
            version_document: ver_tmp,
            size_header: sizeTemp,
            size_body: sizeTemp,
            size_footer: sizeTemp,
            template_name: this.name_template,
            document_name: this.doc_name,
            permission_form: business,
            orientation: orientationTemp,
            data: flowData,
            description: description,
            ppl_sign: [],
            document_type_code: temp_option.document_type_code,
            paper_size: temp_option.paper_size,
            comment: comments,
            location: {
              latitude: this.saveLatitude,
              longitude: this.saveLongitude
            },
            html: this.genHtml(false),
            html_ppl: this.genHtml(true),
            paperless_data: {
              option_page: this.optionsPage,
            },
            status_draft: this.isSaveDraft,
            ref_document_number: this.refDataDoc,
            folder_name: this.uploadFolder,
            current_step: this.currentStep
          },
          {
            headers: {
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          }
        )

        this.notReady = false
        if(data.result == "OK") {
          if(data.response_bi && data.response_bi.Warning_Detail!=null){
            if(data.response_bi.Warning_Massager == 'green') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            } else if(data.response_bi.Warning_Massager == 'yellow') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            } else if(data.response_bi.Warning_Massager == 'red') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            }
          }
        } else {
          if(data.response_bi && data.response_bi.Warning_Detail!=null){
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
              text: data.response_bi.Warning_Detail,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 15000,
              customClass: {
                popup: 'alert-card',
                title: 'alert-title-block',
                closeButton: 'close-alert-btn',
                htmlContainer: 'alert-text-block'
              }
            })
          }
        }

        if (data.result == "OK" && !this.isSaveDraft) {
          this.dialog_ppl = false
          this.pplSubject = this.doc_name
          sessionStorage.setItem('refDataDoc',JSON.stringify([]))
          // if(typeof sessionStorage.getItem('template_array')  == 'undefined' || sessionStorage.getItem('template_array') == 'false') {
          //   this.deleteTemplateTemp(JSON.parse(sessionStorage.getItem('template_array_code'))) 
          // }
          if (this.files.length) {
            // await this.uploadAttachFile(data.messageText.doc_number_eform, data.messageText.data.e_id)
          }

          var template_code = JSON.parse(sessionStorage.getItem('template_option')).template_code
          var speacailForm = this.$speacailForm

          if (this.allUserStep && !speacailForm.includes(template_code)) {
            await this.sendInsertChat(data.messageText.data.e_id)
            this.$router.push({ path: "/inbox" })
          } else {
            this.eform_id = data.messageText.data.e_id
            this.doc_no = data.messageText.doc_number_eform
            await this.genQrCode(this.eform_id)
            if(speacailForm.includes(template_code)) {
              sessionStorage.setItem('isUploaded', false)
              this.download_url = data.messageText.url_download
              this.view_url = data.messageText.url_vierw
              window.open(this.view_url)
              this.isPreview = true
              this.editStep = false
              this.uploadAble = false
              this.allUserStep = false
              this.sendMailOnebox()
            } else {
              var html = this.genHtml(false)
              await this.sendHtml(html, false, 0)
              this.isPreview = true
              if(thenUpload) {
                await this.checkPplUpload()
                sessionStorage.setItem('isUploaded', true)
              } else {
                sessionStorage.setItem('isUploaded', false)
              }
            }
            
            sessionStorage.setItem('eform_id',this.eform_id)
            sessionStorage.setItem('preview',true)
            sessionStorage.setItem('editStep', false)
            sessionStorage.setItem('download_url',this.download_url)
            // location.reload()
          }
          this.pplSubject = document_name
        } else if(data.result == "OK" && this.isSaveDraft) {
          if (this.files.length) {
            // await this.uploadAttachFile(data.messageText.doc_number_eform, data.messageText.data.e_id)
          }
          this.$router.push({ path: "/inbox" })
        }
      } catch (error) {
        this.notReady = false
        console.log(error.message)
      }
    },
    async updateDocument(sign64) {
      try {
        this.dialog_ppl = false
        var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
        var url = this.$api_url + '/template_form/api/v1/update_template_form'
        var data = {}
        this.notReady = true
        var { data } = await this.axios.put(
          url,
          {
            transaction_id: temp_option.transaction_id,
            template_data: this.template_array,
            is_full: true,
            step_index: this.currentStep - 1,
            string_sign: sign64,
            comment: temp_option.newComment ,
            typesign: "web",
            type: "approve",
            action: "Fill",
            others: {dataTableObjectArray : this.dataTableObjectArray, saveStep: this.currentStep - 1},
            is_draft: this.isSaveDraft
          }
        )

        this.notReady = false
        if(data.status) {
          if(this.files.length) {
            this.uploadFiles(temp_option.transaction_id)
          }
          if(data.response_bi && data.response_bi.Warning_Detail!=null){
            if(data.response_bi.Warning_Massager == 'green') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            } else if(data.response_bi.Warning_Massager == 'yellow') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            } else if(data.response_bi.Warning_Massager == 'red') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            }
          }
          this.$router.push({ path: "/inbox" })
        } else {
          if(data.message == "already save") {
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + 'Already Save.' + '</strong>',
              text: "Already Save.",
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
            this.$router.push({ path: "/inbox" })
          }
          if(data.response_bi && data.response_bi.Warning_Detail!=null){
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
              text: data.response_bi.Warning_Detail,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 15000,
              customClass: {
                popup: 'alert-card',
                title: 'alert-title-block',
                closeButton: 'close-alert-btn',
                htmlContainer: 'alert-text-block'
              }
            })
          }
        }
      } catch (error) {
        this.notReady = false
        console.log(error.message)
      }
    },
    async saveDocument(opsPage, sign64) {
      try {
        this.dialog_ppl = false
        this.optionsPage = opsPage
        var sizeTemp = [{}]
        var orientationTemp = [{}]
        this.flow_data.forEach(e => {
          if(!e.actor[0].permission.length && !e.permission_sender_status) {
            var tempEmail = []
            e.actor[0].permission_email.forEach(e2 => {
              if(e2.thai_email) {
                tempEmail.push(e2)
              }
            })
            e.actor[0].permission_email = tempEmail
          }
        })
        for (var i = 1; i <= this.pageOrientation.length; i++) {
          sizeTemp[0][String(i)] = []
          var Okey = Object.keys(this.pageOrientation[i - 1])[0]
          orientationTemp[0][Okey] = this.pageOrientation[i - 1][Okey]
        }
        var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
        let isSkipFirstStep = false
        if(sessionStorage.getItem('isSkipFirstStep') == 'true') {
          isSkipFirstStep = true
        }
        // this.template_array
        var url = this.$api_url + '/template_form/api/v1/create_template_form'
        var data = {}
        this.notReady = true
        var { data } = await this.axios.post(
          url,
          {
            template_id: temp_option.template_id,
            template_data: this.template_array,
            size_header: sizeTemp,
            size_body: sizeTemp,
            size_footer: sizeTemp,
            document_name: this.pplSubject,
            orientation: orientationTemp,
            paper_size: temp_option.paper_size,
            string_sign: sign64,
            comment: temp_option.newComment,
            is_full: true,
            flow_data: this.flow_data,
            flow_id: this.currentFlowId,
            is_password: this.isPassword,
            password: this.pdfPasswordSetting,
            is_skip_first_step: isSkipFirstStep,
            is_draft: this.isSaveDraft,
            viewers: this.templates.document_option.viewers,
            object_text: {
              subject: this.pplSubject,
              message: this.pplBody
            },
            others: {dataTableObjectArray : this.dataTableObjectArray, saveStep: ""}
          }
        )

        this.notReady = false
        if(data.status) {
          if(this.files.length) {
            this.uploadFiles(data.data.transaction_id)
          }
          if(data.response_bi && data.response_bi.Warning_Detail!=null){
            if(data.response_bi.Warning_Massager == 'green') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            } else if(data.response_bi.Warning_Massager == 'yellow') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            } else if(data.response_bi.Warning_Massager == 'red') {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
                text: data.response_bi.Warning_Detail,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 15000,
                customClass: {
                  popup: 'alert-card',
                  title: 'alert-title-block',
                  closeButton: 'close-alert-btn',
                  htmlContainer: 'alert-text-block'
                }
              })
            }
          }
          this.$router.push({ path: "/inbox" })
        } else {
          if(data.response_bi && data.response_bi.Warning_Detail!=null){
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
              text: data.response_bi.Warning_Detail,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 15000,
              customClass: {
                popup: 'alert-card',
                title: 'alert-title-block',
                closeButton: 'close-alert-btn',
                htmlContainer: 'alert-text-block'
              }
            })
          }
        }
      } catch (error) {
        this.notReady = false
        console.log(error.message)
      }
    },
    async uploadFiles(transaction_id) {
      let formData = new FormData()
      this.files.forEach(e => {
        formData.append("file", e)
      })
      formData.append("transaction_id", transaction_id)
      try {
        this.notReady = true
        var { data } = await this.axios.post(this.$api_url + "/file-component/api/saveFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          }
        )
        this.notReady = false
        if(data.status) {
          
        } else {
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
              text: this.textLang.alert.upload_fail,
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
        this.notReady = false
        this.$swal({
          backdrop: false,
          position: 'bottom-end',
          width: '330px',
          title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
          text: this.textLang.alert.upload_fail,
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
    async genQrCode(id){
      try {
        var { data } = await this.axios.get(this.$node_api + '/genQrCode?eform_id='+id,
        {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
          }
        })
        this.imageQRCODE = data.data
        var imgItem = this.template_array.find(item => item.value == '{{qrcode}}')
        var indx = this.template_array.indexOf(imgItem)
        if(indx) {
          this.template_array[indx].value = this.imageQRCODE 
        }
      } catch (error) {
        this.imageQRCODE = ''
        console.log(error)
      }
    },
     async sendMailOnebox(){
      try {
        var { data } = await this.axios.post(this.$node_api + '/send_email_onebox',
        {
          e_id: this.eform_id,
          email_list:[],
          user_id:""
        },
        {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
          }
        })
        this.imageQRCODE = data.data
      } catch (error) {
        this.imageQRCODE = ''
        console.log(error)
      }
    },
    async deleteTemplateTemp(template_array_code) {
      try {
        var { data } = await this.axios.post(this.$api + '/del_object_template',
        {
          "template_code":template_array_code
        },
        {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
          }
        })
      } catch (err) {
        if (err.response != null) {
          if (err.response.status == 401) {
            this.$router.push('/notfound')
          }
        } else {
          console.log(err.message)
        }
      }
    },
    async sendInsertChat(e_id) {
      try {
        this.notReady = true
        var { data } = await this.axios.post(
          this.$api + "/send_chat_signing",
          {
            e_id: e_id
          },
          {
            headers: {
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          }
        )
        this.notReady = false
      } catch (error) {
        this.notReady = false
        console.log(error.message)
      }
    },
    async sendUpdateChat(e_id) {
      try {
        this.notReady = true
        var { data } = await this.axios.post(
          this.$api + "/send_chat_signing",
          {
            e_id: e_id
          },
          {
            headers: {
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          }
        )
        this.notReady = false
      } catch (error) {
        this.notReady = false
        console.log(error.message)
      }
    },
    async disableButton(e_id) {
      try {
        var { data } = await this.axios.post(
          this.$api + "/disble_button",
          {
            e_id: e_id
          },
          {
            headers: {
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          })
      } catch (error) {
        console.log(error.message)
      }
    },
    back() {
      if (!this.isPreview && this.ready) {
        // sessionStorage.setItem("template_value", JSON.stringify(this.template_array))
        sessionStorage.setItem("isBack", true)
        sessionStorage.setItem("isStep", false)
        sessionStorage.setItem('Folder_Attachment_Name',JSON.stringify(this.attachedFiles))
        if (JSON.parse(sessionStorage.getItem("template_option")).document_name) {
          sessionStorage.setItem("isDocEdit", true)
          sessionStorage.setItem("isDocStep", true)
        }
        this.$router.push({ path: "/form/input" })
        this.isReturnFill = true
      } else {
        this.$router.push({ path: "/form" })
      }
    },
    async download(action) {
      if (action == "download") {
        window.open(`${this.$api_url}/public/v1/download/${this.templates.tax_id}/${this.templates.transaction_id}`)
      } else {
        // window.open(this.view_url)
      }
    },
    openForwardMail() {
      EventBus.$emit('SendForwardMail')
    },
    async exportValue() {
      this.notReady = true
      var { data } = await this.axios.post(
        this.$api + "/export/eform",
        {
          e_id: this.eform_id
        },
        {
          headers: {
            Authorization:
              "Bearer " + sessionStorage.getItem("one_access_token")
          }
        }
      );
      this.notReady = false
      if (data.messageER != "ER") {
        window.open(data.messageText[0].url)
      }
    },
    genHtmlFontsize(value, html) {
      html += "font-size: " + value + "px;"
      return html
    },
    genHtmlFontstyle(value, html) {
      var font_style = value
      if(typeof font_style !== 'undefined') {
        font_style.forEach(s => {
          if (s == "b") {
            html += "font-weight: bold; "
          } else if (s == "i") {
            html += "font-style: italic; "
          } else if (s == "u") {
            html += "text-decoration: underline; "
          }
        })
        }
      return html;
    },
    genHtmlFontcolor(value, html) {
      var color = value.substring(1, 7)
      html += "color:" + color + ";"
      return html;
    },
    genHtmlBordersize(value, html) {
      html += "border:" + value + "px solid;"
      return html
    },
    genHtmlBorderscolor(value, html) {
      var color = value.substring(1, 7)
      html += "border-color:" + value + ";"
      return html
    },
    genHtmlBorderradias(value, html) {
      if (value) {
        html += "border-radius: 15px;"
      } else {
        html += "border-radius: 0px;"
      }
      return html
    },
    genHtmlBackgroundcolor(value, html) {
      var color = value.substring(1, 7)
      html += "background-color:" + value + " !important;"
      return html
    },
    genHtml(isPplHtml) {
      var html = "<head><link href='https://fonts.googleapis.com/css?family=Sarabun&subset=thai' rel='stylesheet' type='text/css'><meta charset='utf-8'></head><body>"
      for (var p = 1; p <= this.pages.length; p++) {
        if(!this.pages[p - 1].isHide) {
        var styled = false
        var pWidth = this.paper_size[this.paperSizeIndex].width
        var pHeight = this.paper_size[this.paperSizeIndex].height
        if (this.pages[p - 1].template_side == "LANDSCAPE") {
          pWidth = this.paper_size[this.paperSizeIndex].height
          pHeight = this.paper_size[this.paperSizeIndex].width - 70
        }
        html += "<div style='word-wrap: break-word; position:relative;" + "width:" + pWidth + "px; height:" + pHeight + "px;'>"
        this.template_array.forEach(e => {
          if (e.page == p && !e.style.hideDisplay && !e.style.hidePreview && e.object_type != "texteditorbox" && !e.invisible) {
            if (e.object_type == "textareabox") {
              html += "<div style='white-space: pre-wrap; text-overflow: clip; text-align:"
              html += e.style.font_align
              html += "; position:absolute; height:"
            } else if (e.object_type == "datatable") {
              html += "<div style='word-break: break-word; white-space: pre-wrap; text-overflow: clip;"
              html += "; position:absolute; height:"
            } else {
              html += "<div style=' white-space: pre-wrap; text-overflow: clip; text-align:"
              html += e.style.font_align
              html += "; position:absolute; height:"
            }

            if (e.object_type == "rectangle") {
              html += String(e.height - parseInt(e.style.border_size) * 2) + "px; width:"
            } else if(e.object_type != "datatable" && e.object_type != "table"){
              html += String(e.height) + "px; width:"
            } else if(e.object_type == "datatable" || e.object_type == "table"){
              html += "auto; width:"
            }

            if (e.object_type != "rectangle" && e.object_type != "table" && e.object_type != "datatable" &&
              e.object_type != "line" && e.object_type != "textareabox" && e.object_type != "signbox"
            ) {
              if (e.object_type == "textfield" || e.object_type == "inputbox" || e.object_type == "datepickerbox" ||
                e.object_type == "dropdownbox" || e.object_type == "autofillbox" || e.object_type == "timebox" ||
                e.object_type == "calculatebox" || e.object_type == "number2textbox"
              ) {
                html +=String(e.width) + "px; opacity:1; display:table-cell; left:"
                //  html += "auto; opacity:1; display:table-cell; left:"
              } else if (e.object_type == "checkbox") {
                html +=String(e.width + 30) + "px; opacity:1; display:table-cell; left:"
              } else {
                html += "auto; opacity:1; display:table-cell; left:"
              }
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
              html = this.genHtmlFontsize(e.style.font_size, html)
              html = this.genHtmlFontstyle(e.style.font_style, html)
              html = this.genHtmlFontcolor(e.style.font_color, html)
            } else if (e.object_type == "textareabox") {
              html += String(e.width) + "px; opacity:1; display:table-cell; left:"
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
              html = this.genHtmlFontsize(e.style.font_size, html)
              html = this.genHtmlFontstyle(e.style.font_style, html)
              html = this.genHtmlFontcolor(e.style.font_color, html)
            } else if (e.object_type == "rectangle") {
              html += String(e.width - parseInt(e.style.border_size) * 2) + "px; opacity:1; display:table-cell; left:"
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
              html = this.genHtmlBordersize(e.style.border_size, html)
              html = this.genHtmlBorderscolor(e.style.border_color, html)
              html = this.genHtmlBackgroundcolor(e.style.background_color, html)
              html = this.genHtmlBorderradias(e.style.border_radias, html)
            } else if (e.object_type == "signbox") {
              html += String(e.width) + "px; opacity:1; display:table-cell; left:"
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
            } else if (e.object_type == "table" || e.object_type == "datatable"
            ) {
              if (!e.width) {
                html += "auto" + "; opacity:1; left:"
              } else {
                html += "auto" + "; opacity:1; left:"
              }
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
            } else if (e.object_type == "line") {
              html += String(e.width) + "px; opacity:1; left:"
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
            }
            html += 'font-family: "Sarabun", sans-serif;'
            html += "z-index:" + String(e.style.zIndex) +";"
            html += "'>";
            if (e.object_type == "checkbox") {
              if (e.value) {
                html +="<img  width='" + e.style.font_size + "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_84c82695-0eff-4e1f-9e42-f07d49104a84.png'>"
              } else {
                html += "<img  width='" + e.style.font_size + "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png'>"
              }
              html += "<span style='margin-left:3px;'>" + e.text + "</span></div>"
            } else if (e.object_type == "imagebox") {
              html += "<img  width='" + e.style.image_width + "px' height='" + e.style.image_height + "px' src='" + e.value + "'></div>"
            } else if (e.object_type == "inputimagebox" && e.value != "" && e.value != null
            ) {
              var image_qrcode = ''
              if(e.value == '{{qrcode}}'){
                image_qrcode = this.imageQRCODE == '' ? e.value : this.imageQRCODE 
              }else{
                image_qrcode = e.value
              }
              html += "<img  width='" + e.style.image_width + "px' height='" + e.style.image_height + "px' src='" + image_qrcode + "'></div>"
            } else if (e.object_type == "signbox") {
              if(e.style.isCa) {
                if(!isPplHtml) {
                  html += "</div>"
                } else {
                  var objId = e.object_name 
                  if(e.style.permission_section.section) {
                    if(e.style.permission_section.section.length) {
                      objId = e.style.permission_section.section[0]
                    }
                  }
                  if(e.object_name == this.currentSignStep.name) {
                    e.style.signUrl = this.currentSignStep.sign
                  }
                  if(typeof e.style.signUrl === 'undefined') {
                    e.style.signUrl = ""
                  }
                  if(e.style.signUrl) {
                    html += "<img width='100%' src='" + e.style.signUrl + "'></div>"
                  } else {
                    html += "<div id='"+ objId +"'></div></div>"
                  }
                }
              }  else {
                if(this.noFlowSignPic) {
                  e.value = this.noFlowSignPic
                }
                if(e.value) {
                  html += "<img  width='100%' src='" + e.value + "'></div>"
                } else {
                  html += "<div id='"+ e.object_name +"'></div></div>"
                }
              }
            } else if (e.object_type == "datepickerbox") {
              html += e.show_value + "</div>"
            } else if (e.object_type == "autofillbox") {
              if (e.value.isUser && !(e.value.show == "function")) {
                if (e.value.show == "doc_no") {
                  e.value.show_index = this.doc_no
                }
                html += this.replaceGtLt(e.value.show_index + e.style.suffix) + "</div>"
              } else {
                e.value.show_array == "calculatebox" || (e.value.show_array == "inputbox" && e.value.isComma)? (html += this.replaceGtLt(this.numberToComma(e.value.show_value, e.style.isComma) + e.style.suffix) + "</div>")
                :(html += this.replaceGtLt(e.value.show_value + e.style.suffix) + "</div>")
              }
            } else if (e.object_type == "number2textbox") {
              html += e.value.show_value + "</div>"
            } else if (e.object_type == "table") {
              html += "<table style='border-collapse:collapse; margin:0; padding:0; border:"
              html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
              for (var i = 0; i < e.style.table.rowsize.length; i++) {
                html +=
                  "<tr style='margin:0; padding:0; height:" +
                  e.style.table.rowsize[i].size +
                  "px; border-collapse:collapse; border:"
                html +=
                  e.style.border_size +
                  "px solid " +
                  e.style.border_color +
                  ";'>"
                for (var j = 0; j < e.style.table.colsize.length; j++) {
                  html +=
                    "<td style='margin:0; padding:0; width:" +
                    String(parseFloat(e.style.table.colsize[j].size) - 1) +
                    "px; border-collapse:collapse; border:"
                  html +=
                    e.style.border_size +
                    "px solid " +
                    e.style.border_color +
                    ";'></td>"
                }
                html += "</tr>"
              }
              html += "</table></div>"
            } else if (e.object_type == "datatable") {
              html += "<table id='" + e.name +"-table' style='border-collapse:collapse; margin:0; padding:0; border:"
              html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
              for (var i = 0; i < e.style.table.rowsize.length; i++) {
                html += "<tr style='height:" + String(Number(e.style.table.rowsize[i].size)) + "px; border-collapse:collapse; margin:0; padding:0; border:"
                html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
                for (var j = 0; j < e.style.table.colsize.length; j++) {
                  if(!this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.hideDisplay) {
                    html +="<td style='width:" + String(Number(e.style.table.colsize[j].size)-1) + "px; border-collapse:collapse; margin:0; padding:0; border:"
                    html += e.style.border_size + "px solid " + e.style.border_color + "; background-color:" + 
                      this.dataTableObjectArray[ e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.background_color + ";"
                    html += "text-align:" + this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_align +";";
                    html = this.genHtmlFontsize(this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_size,html)
                    html = this.genHtmlFontstyle(this.dataTableObjectArray[e.object_name +"_" +"R" +String(i + 1) + "C" + String(j + 1)].style.font_style,html)
                    html = this.genHtmlFontcolor(this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_color,html)
                    html += "'>"
                    if (this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].object_type == "checkbox" && !this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].style.hideDisplay  && !this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].invisible) {
                      if (this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].show_value) {
                        html += "<img  width='" + this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_size +
                          "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_84c82695-0eff-4e1f-9e42-f07d49104a84.png'>"
                      } else{
                        html += "<img  width='" + this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_size +
                          "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png'>";
                      }
                      html += "<span style='margin-left:3px;'>" + this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].text + "</span>"
                    } else if(this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].object_type != "checkbox" && this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].object_type != "calculatebox" && !this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].style.hideDisplay && !this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].invisible) {
                      html += this.replaceGtLt(this.numberToComma(this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].show_value,
                        this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.isComma)
                      )
                      html += this.dataTableObjectArray[e.object_name +"_" +"R" +String(i + 1) +"C" +String(j + 1)].style.suffix
                    } else if( this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].object_type == "calculatebox" && !this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].style.hideDisplay && !this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].invisible) {
                      html += this.replaceGtLt(this.numberToComma(this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].valueShow,
                        this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.isComma)
                      )
                      html += this.dataTableObjectArray[e.object_name +"_" +"R" +String(i + 1) +"C" +String(j + 1)].style.suffix
                    }
                    html += "</td>";
                  }
                }
                html += "</tr>";
              }
              html += "</table></div>";
            } else if (e.object_type == "line") {
              html +=
                "<table style='border-collapse:collapse; width:100%; height:100%;'>";
              if (e.style.line_set == "l") {
                html += "<tr style='height:50%; border-bottom:" + e.style.border_size + "px " + e.style.line_style + " " + e.style.border_color + "; border-collapse:collapse;'>";
                html += "<td style='width:100%;'></td></tr>";
                html += "<tr style='height:50%; border-top:" + e.style.border_size + "px " + e.style.line_style + " " + e.style.border_color + "; border-collapse:collapse;'>"
                html += "<td style='width:100%;'></td></tr>"
              } else if (e.style.line_set == "p") {
                html += "<tr style='height:100%;'>"
                html += "<td style='width:50%; border-right:" + e.style.border_size + "px " + e.style.line_style + " " + e.style.border_color + "; border-collapse:collapse;'>"
                html += "</td><td style='width:50%'></td></tr>"
              }
              html += "</table></div>"
            } else {
              if (e.value || e.object_type == "calculatebox") {
                if (e.value || e.style.isZero) {
                  if (e.object_type == "textareabox") {
                    html += this.replaceGtLt(String(e.value))+ "</div>"
                  } else if (e.object_type == "calculatebox") {
                    html += this.replaceGtLt(String(this.numberToComma(e.valueShow, e.style.isComma)) + e.style.suffix) + "</div>"
                  } else if (e.object_type == "inputbox" && e.style.isComma) {
                    html += this.replaceGtLt(String(this.numberToComma(e.value, e.style.isComma)) + e.style.suffix) + "</div>"
                  } else if (e.object_type == "dropdownbox") {
                    html += this.replaceGtLt(String(e.show_value)) + "</div>"
                  } else {
                    if(e.object_type != "number2textbox") { 
                      html += this.replaceGtLt(String(e.value)) + e.style.suffix + "</div>"
                    } else {
                      html += this.replaceGtLt(String(e.value)) + "</div>"
                    }
                  }
                } else {
                  html += "</div>"
                }
              } else {
                html += "</div>"
              }
            }
          } else if (e.page == p && !e.style.hideDisplay && !e.style.hidePreview && e.object_type == "texteditorbox"){
            html += "<div class='textEdit' style='position:absolute; font-family: \"Sarabun\", sans-serif; font-size: 16px; width:"
            html += String(e.width) + "px; opacity:1; left:"
            html += String(e.left) + "px; top:"
            html += String(e.top) + "px; "
            html += "z-index:" + String(e.style.zIndex) +";'>"
            // e.value = e.value.split('<div').join('<div class="textEdit"')
            var holdValue = e.value 
            if(!styled) {
              holdValue += '<style>.textEdit>p{margin-bottom: 3px !important; margin-top: 0px !important;}</style>'
              styled = true
            }
            html += holdValue
            html += '</div>'
          }
        })
        html += "</div>";
        var tempPage = this.pages.filter(item => !item.isHide)
        if (p != tempPage.length && p != this.pages.length) {
          html += '<div style="page-break-before: always;"></div>'
        }
      }
      }
      html += "</body>"
      this.pdfHtml = html
      return html
    },
    async sendHtml(html, reDownload, count) {
      try {
        this.pdfHtml = html
        this.notReady = true
        var url = ""
        var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
        if(!this.isPdfLock || (this.isPdfLock && this.pdfPasswordSetting) || sessionStorage.getItem('isLastStep') == 'false') {
          if(this.isPublic) {
            url = this.$api + "/path_html_pdf_guest"
          } else {
            url = this.$api_v3 + "/path_html_pdf"
            // url = this.$node_api_v3 + "/path_html_pdf"
            // url = "http://localhost:3000/api/v3/path_html_pdf"
          }
          var { data } = await this.axios.post(
            url,
            {
              eform_id: this.eform_id,
              html: html,
              orientation: this.orientation,
              paper_size:this.paper_size[this.paperSizeIndex].text,
              userpw: this.pdfPasswordSetting
            },
            {
              headers: {
                Authorization:
                  "Bearer " + sessionStorage.getItem("one_access_token")
              }
            }
          )
          this.notReady = false
          if(data.result == 'OK') {
            if(sessionStorage.getItem('isUploaded') != 'true') {
              this.uploadAble = true
            }
            this.download_url = data.url_download
            this.view_url = data.url_view
            if(reDownload) {
              this.download("download")
            } else {
              // this.download("view")
            }
            if (this.reSend) {
              this.pplUploadDocument()
            }
            if(this.thenOpenPpl) {
              if(!this.statusDraft) {
                this.isPreview = true
                this.pplLoadTemplate()
              }
            }
            if(this.thenOpenPplNoFlow) {
              sessionStorage.setItem('isUploaded', false)
              sessionStorage.setItem('preview',true)
              sessionStorage.setItem('editStep', false)
              sessionStorage.setItem('download_url',this.download_url)
              this.isPreview = true
              this.editStep = false
              this.uploadAble = true
              this.pplLoadTemplate()
            }
          } else {
            if(count < 3) {
              count++
              this.sendHtml(html, reDownload, count)
            }
          }
        } else {
          EventBus.$emit('passwordSetting', html, reDownload, count)
        }
      } catch (error) {
        this.notReady = false
        if(count < 3) {
          count++
          this.sendHtml(html, reDownload, count)
        }
        console.log(error.message)
      }
    },
    openCancel() {
      var tempOpt = this.option
      EventBus.$emit('ConfirmCancelDoc',tempOpt)
    },
    checkDefaultPplTemplate() {
      var temp_option = JSON.parse(sessionStorage.getItem("template_option"))
      var valid = false
      var selectedFlow = {}
      if(typeof temp_option.document_option["flowCondition"] !== 'undefined' && temp_option.document_option["flowCondition"].length) {
        temp_option.document_option["flowCondition"].every(e => {
          var inputCond = e.docCond
          let regexCondition =  /(["'])(?:(?=(\\?))\2.)*?\1|(true|false)|([^a-z])(length)([^a-zA-Z]+)|[<=|==|>=|!=|*|+|\-|\/]([0-9][^a-z]+)|[&\/\\#, +()$~%'":*?<>!{}|=|]/g
          var strArr = inputCond.split("$")
          var nameObject = []
          var otherValue = []
          for(var i=0; i<strArr.length; i++){
            if(strArr[i].match(regexCondition)){
              nameObject.push(strArr[i].replace(regexCondition,''))
            } else nameObject.push(strArr[i])
          }
          nameObject.forEach(e2 => {
            if(e2) {
              inputCond = inputCond.replace('$' + e2 + '.length', '"' + String(this.checkObject(e2,true)) + '".length')
              if(isNaN(parseFloat(this.checkObject(e2,true)))) {
                inputCond = inputCond.replace('$' + e2 ,'"' + this.checkObject(e2,true) + '"')
              } else {
                inputCond = inputCond.replace('$' + e2 ,this.checkObject(e2,true))
              }
            }
          })
          try{
            valid = Function('"use strict";return (' + inputCond + '?true:false)')()
            if(valid) {
              selectedFlow = e.pplSetting
              return false
            }
          } catch(err) {
            console.log(err)
          }
          return true
        })
      }
      return selectedFlow
    },
    checkObject(obj_name,isNum) {
      try {
        var val = obj_name
        val = val.split(" ").join("")
        var tempObj = this.template_array.find(item => item.object_name == val)
        if(tempObj) {
          if(tempObj.object_type == 'autofillbox') {
            if(tempObj.value.show == 'function') {
              if (tempObj.value.isUser) {
                val = tempObj.value.show_value
                isNum = false
              } else {
                if(!tempObj.value.isUser) {
                  val = String(tempObj.value.show_value)
                } else {
                  val = String(0)
                }
              }
            }
          } else {
            val = String(tempObj.value)
            if(isNum) {
              val = val.split(",").join("")
            }
          }
        } else if(obj_name.startsWith('datatable')) {
            if(this.dataTableObjectArray[obj_name].value || (this.dataTableObjectArray[obj_name].object_type == 'linkdatabox' && String(this.dataTableObjectArray[obj_name].value) == '0')) {
              if(this.dataTableObjectArray[obj_name].object_type == 'linkdatabox') {
                if(this.dataTableObjectArray[obj_name].valueList.length && typeof this.dataTableObjectArray[obj_name].valueList[this.dataTableObjectArray[obj_name].value] !== 'undefined') {
                  if(this.dataTableObjectArray[obj_name].valueList[this.dataTableObjectArray[obj_name].value].text != "") {
                    val = String(this.dataTableObjectArray[obj_name].valueList[this.dataTableObjectArray[obj_name].value].text)
                  } else {
                    val = String(this.dataTableObjectArray[obj_name].show_value)
                  }
                } else {
                  val = String(0)
                }
              } else {
                val = String(this.dataTableObjectArray[obj_name].value)
              }
              if(this.dataTableObjectArray[obj_name].object_type == 'inputbox' && this.dataTableObjectArray[obj_name].style.number_only) {
                val = val.split(',').join('')
              }
            } else {
            val = String(0)
          }
        } else {
          val = String(0)
        }
        return val
      }
      catch(e) {
        console.log(e)
        return 0
      }
    },
    async pplLoadTemplate() {
      var paperless_data = JSON.parse(sessionStorage.getItem("template_option")).paperless_data
      if(paperless_data && paperless_data.option_page && !this.pplSubject && !this.pplBody) {
        this.pplSubject = paperless_data.option_page.subject_text
        this.pplBody = paperless_data.option_page.body_text
      }
      this.documentTypes = [{ text: "ไม่เลือก", value: "" }]
      this.ppl_templatelist = [{ text: "ไม่เลือก", value: "" }]
      var defaultDocType = ""
      var checkPplSetting = this.checkDefaultPplTemplate()
      // if(this.templates.ppl_template_code && this.templates.ppl_template_code.length) {
      //   if(!this.selectedDocumentType && this.templates.ppl_template_code[0].document_type) {
      //     defaultDocType = this.templates.ppl_template_code[0].document_type
      //   }
      // }
       if(typeof checkPplSetting.template !== 'undefined' && typeof checkPplSetting.template.Template_Code !== 'undefined') {
        this.defaultPplTemplate = checkPplSetting.template.Template_Code
      }
      if(!this.template_paperless_code) {
        this.template_paperless_code = this.defaultPplTemplate
      }
      var storedDocumentType = this.$store.state.pplDocumentTypes
      storedDocumentType.forEach(e => {
        this.documentTypes.push({
          text: e.Document_Name.document_name,
          value: e.Document_Type
        })
      })
      // this.allPplTemaplates = this.$store.state.storedDocumentTemplates
      this.allPplTemaplates = JSON.parse(localStorage.getItem('setStoredDocumentTemplates'))

      var tempCode = this.template_paperless_code
      if(typeof tempCode.Template_Code !== 'undefined') {
        tempCode = tempCode.Template_Code 
      }
      if(!this.selectedDocumentType && defaultDocType) {
        var selectedType = this.documentTypes.find(item => item.value == defaultDocType)
        if(selectedType) {
          this.selectedDocumentType = selectedType
        }
      }
      this.selectedDocumentType = this.getDocumentType(tempCode)
      this.template_paperless_code = tempCode
      await this.getPplTemplate()
      if (this.template_paperless_code != "") {
        this.canNotSendPPL = false
      } else {
        this.canNotSendPPL = true
      }
      var template_code = JSON.parse(sessionStorage.getItem('template_option')).template_code
      var speacailForm = this.$speacailForm
      if(speacailForm.includes(template_code)){
        this.saveName(false)
      }else{
        this.dialog_ppl = true
      }
    },
    getPplTemplate() {
      this.ppl_templatelist = [{ text: "ไม่เลือก", value: "" }];
      var isNotChange = false;
      this.allPplTemaplates.forEach(e => {
        var holdName =  e.Template_Name
        if (e.Document_Type == this.selectedDocumentType) {
          if (this.template_paperless_code != null) {
            if (e.Template_Code == this.template_paperless_code) {
              holdName  = holdName  + this.textLang.offer_dialog.default;
              this.template_paperless_code = e;
              isNotChange = true;
            }
          }
          this.ppl_templatelist.push({ text: holdName, value: e });
        }
      });
      if (!isNotChange) {
        this.template_paperless_code = "";
      }
    },
    getDocumentType(code) {
      var docType = "";
      if (code) {
        this.allPplTemaplates.forEach(e => {
          if (code == e.Template_Code) {
            docType = e.Document_Type;
          }
        });
      } else {
        docType = "";
      }
      return docType;
    },
    async uploadFile() {
      let formData = new FormData();
      this.files.forEach(e => {
        formData.append("file[]", e);
      });
      formData.append("username", sessionStorage.getItem("oneuser"));
      this.notReady = true;
      var folder_name = "";
      try {
        var { data } = await this.axios.post(
          this.$api_paperless_storage + "/storage/keep/v1",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          }
        );
        this.notReady = false;
        folder_name = data.messageText.folder_name;
      } catch (error) {
        this.notReady = false;
        console.log(error.message);
      }
      return folder_name;
    },
    async uploadAttachFile(doc_no, e_id) {
      let formData = new FormData()
      var neverUpload = false
      if(e_id && !this.uploadFolder) {
        neverUpload = true
      }
      this.files.forEach(e => {
        formData.append("file", e)
      })
      formData.append("doc_number", doc_no)
      formData.append("e_id", e_id)
      formData.append("folder_name", this.uploadFolder)
      try {
        this.notReady = true
        var { data } = await this.axios.post(this.$api_v2 + "/attract_file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization:
                "Bearer " + sessionStorage.getItem("one_access_token")
            }
          }
        )
        this.notReady = false
        if(data.result == "OK") {
          this.uploadFolder = data.messageText[0].Folder_name
          var holdFiles = this.attachedFiles.filter(item => !item.waitUpload)
          if(data.messageText[0].file_attract.length) {
            data.messageText[0].file_attract.forEach(e => {
              holdFiles.push(e)
            })
          }
          this.attachedFiles = holdFiles
          this.attachedFiles.forEach(e => {
            e.waitUpload = false
          })
          // this.files = []
          if(neverUpload) {
            this.updateFolderName(e_id)
          }
        } else {
            // this.files = []
            this.attachedFiles = this.attachedFiles.filter(item => !item.waitUpload)
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
              text: this.textLang.alert.upload_fail,
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
        this.notReady = false
        // this.files = []
        this.attachedFiles = this.attachedFiles.filter(item => !item.waitUpload)
        this.$swal({
          backdrop: false,
          position: 'bottom-end',
          width: '330px',
          title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
          text: this.textLang.alert.upload_fail,
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
    async deleteFile(item) {
      // try {
      //   var { data } = await this.axios.get(this.$api + "/attract_file/delete/" + item.file_id)
      //   if (data.result == "OK") {
      //     var indx = this.attachedFiles.indexOf(item)
      //     this.attachedFiles.splice(indx,1)
      //     sessionStorage.setItem("Folder_Attachment_Name", JSON.stringify(this.attachedFiles))
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
    },
    async updateFolderName(eid) {
      try {
        var { data } = await this.axios.post(this.$api + "/upload_foldername",
          {
            e_id: eid,
            folder_name: this.uploadFolder
          })
      } catch (error) {
        console.log(error);
      }
    },
    deleteFileWait(delItem) {
      var fileIndex = this.files.indexOf(delItem)
      this.files.splice(fileIndex, 1)
    },
    async downloadFile(item) {
      window.open(`${this.$api_url}/file-component/api/downloadFile?file_id=${file.file_id}`)
    },
    changeHoldFiles() {
      this.holdFiles.forEach(e => {
        this.files.push(e)
      })
      this.holdFiles = []
    },
    async checkPplUpload() {
      this.alert_text_bool = false
      var validEmail = false
      this.template_paperless_code.Template_step.forEach(e => {
        if (e.ref_step == "ref-undefined") {
          e.ref_step = null
        }
        e.one_email.forEach(e2 => {
          e2.email = e2.email.toLowerCase()
          e2.email = e2.email.trim()
          e2.email = e2.email.replace(/ /g, "")
          e2.email = e2.email.replace(/[\u0E01-\u0E5B]+/g, "")
          e2.email = e2.email.split(" ").join("")
        })
      })
      validEmail = await this.checkNullEmail(this.template_paperless_code.Template_step)
      if(!this.isPdfLock || (this.isPdfLock && this.pdfPasswordSetting)) {
        if (validEmail) {
          this.autoAddEmail(this.template_paperless_code.Template_step)
          await this.pplUploadDocument()
        }
      } else {
        this.alert_text_bool = true
        this.alert_text = this.error_pdf_setting_password
      }
      
    },
    async checkNullEmail(flow_data) {
      var validEmail = true
      var checkMailArray = []
      var indexKeeper = []
      for(let i=0; i< flow_data.length; i++) {
        let flow_valid_count = 0
        if(!flow_data[i].actor[0].permission.length && !flow_data[i].actor[0].permission_sender_status) {
          for(let j=0; j<flow_data[i].actor[0].permission_email.length; j++) {
            if(flow_data[i].actor[0].permission_email[j].thai_email) {
              flow_valid_count++
              flow_data[i].actor[0].permission_email[j].thai_email = flow_data[i].actor[0].permission_email[j].thai_email.toLowerCase()
              flow_data[i].actor[0].permission_email[j].thai_email = flow_data[i].actor[0].permission_email[j].thai_email.trim()
              flow_data[i].actor[0].permission_email[j].thai_email = flow_data[i].actor[0].permission_email[j].thai_email.replace(/ /g, "")
              flow_data[i].actor[0].permission_email[j].thai_email = flow_data[i].actor[0].permission_email[j].thai_email.split(" ").join("")
              checkMailArray.push(flow_data[i].actor[0].permission_email[j].thai_email)
              indexKeeper.push({
                i_index: i,
                j_index: j
              })
            }
          }
          if(flow_valid_count < flow_data[i].sign_count) {
            validEmail = false
            flow_data[i].actor[0].permission_email.forEach(e => {
              if(!e.thai_email) {
                e.invalid = true
              }
            })
          }
          if(!flow_valid_count) {
            validEmail = false
          }
        }
      }
      if(validEmail) {
        var mailResult = await this.checkOneEmail(checkMailArray)
        for(let i=0; i<mailResult.length; i++) {
          if(!mailResult[i].valid) {
            flow_data[indexKeeper[i].i_index].actor[0].permission_email[indexKeeper[i].j_index] = {
              account_id: null,
              account_title_eng: null,
              account_title_th: null,
              first_name_eng: null,
              first_name_th: null,
              invalid: true,
              last_name_eng: null,
              last_name_th: null,
              thai_email: checkMailArray[i],
            }
            validEmail = false
          } else {
            flow_data[indexKeeper[i].i_index].actor[0].permission_email[indexKeeper[i].j_index] = {
              account_id: mailResult[i].data.id,
              account_title_eng: mailResult[i].data.account_title_eng,
              account_title_th: mailResult[i].data.account_title_th,
              first_name_eng: mailResult[i].data.first_name_eng,
              first_name_th: mailResult[i].data.first_name_th,
              invalid: false,
              last_name_eng: mailResult[i].data.last_name_eng,
              last_name_th: mailResult[i].data.last_name_th,
              thai_email: mailResult[i].data.thai_email,
            }
          }
        }
      }
      this.step_show = false
      this.step_show = true
      if(!validEmail) {
        this.alert_text_bool = true
        this.alert_text = this.textLang.offer_dialog.please_input
      } else {
        this.alert_text_bool = false
        this.alert_text = ""
      }
      return validEmail
    },
    async autoAddEmail(Template_step) {
      var mailArray = []
      for (let i = 0; i < Template_step.length; i++) {
        for (let j = 0; j < Template_step[i].one_email.length; j++) {
          mailArray.push(Template_step[i].one_email[j].email.trim())
        }
      }

      var { data } = await this.axios.post(
        this.$api_paperless_storage + "/api/addfriendmulti/v1",
        {
          email: mailArray
        },
        {
          headers: {
            Authorization:
              "Bearer " + sessionStorage.getItem("one_access_token")
          }
        }
      );
    },
    async checkOneEmail(checkMailArray) {
      var result = []
      try {
        var { data } = await this.axios.post(this.$api_url + "/citizen/api/v1/check_citizen_email",{
          email: checkMailArray
        })
        if (data.status) {
          result = data.result
        }
      } catch (error) {
        console.log(error.message)
      }
      return result
    },
    async pplUploadDocument() {
      if(this.files.length > 0) {
        // await this.uploadAttachFile(this.doc_no, this.eform_id)
      }
      for (
        var i = 0;i < this.template_paperless_code.Template_step.length;i++) {
        if (this.template_paperless_code.Template_step[i].ref_step == null) {
          for (var j = 0;j < this.template_paperless_code.Template_step[i].one_email.length; j++
          ) {
            this.template_paperless_code.Template_step[i].one_email[j] = this.template_paperless_code.Template_step[i].one_email[j].email.trim()
          }
        } else {
          this.template_paperless_code.Template_step[i].one_email = []
        }
      }

      this.dialog_ppl = false
      var doc_type = ""
      // this.ppl_templatelist.forEach(e => {
      //   if (e.value == data) {
      //     doc_type = e.document_type;
      //   }
      // })
      try {
        var business = JSON.parse(sessionStorage.getItem("selected_business"))
        var tax_id = "";
        if (business.id) {
          tax_id = business.id_card_num;
        }
        var paperlessSuject = this.doc_name
        if (this.pplSubject != "" && !paperlessSuject) {
          paperlessSuject = this.pplSubject
        } 
        if (!this.pdfHtml) {
          this.pdfHtml = this.genHtml(false)
        }
        this.notReady = true
        var { data } = await this.axios.post(this.$api + "/approve_ppl",
          {
            eform_id: this.eform_id,
            html: this.pdfHtml,
            tax_id: tax_id,
            document_type: this.template_paperless_code.Document_Type,
            templateDetails: JSON.stringify(this.template_paperless_code),
            subject_text: paperlessSuject,
            body_text: this.pplBody,
            Folder_Attachment_Name: this.uploadFolder,
            userpw: this.pdfPasswordSetting,
            pdflock: this.isPdfLock
          })
        this.notReady = false;
        await this.insertTransaction(data);
        if (data.result == "OK") {
          this.uploadAble = false;
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
            text: this.textLang.alert.send_complete,
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
          sessionStorage.setItem('isUploaded', true)
        } else {
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
            text: this.textLang.alert.send_fail,
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
        console.log(error.message);
        this.notReady = false;
      }
    },
    async insertTransaction(data) {
      try {
        this.notReady = true;
        var { data } = await this.axios.post(this.$api + "/keep_status_ppl",
          {
            status: data.result,
            eform_id: this.eform_id,
            ppl_id: data.data_from_ppl.id_transaction_paperless,
            message: JSON.stringify(data.data_from_ppl)
          });
        this.notReady = false;
      } catch (error) {
        console.log(error.message);
        this.notReady = false;
      }
    },
    openSignature() {
      var signOnly = sessionStorage.getItem('signOnlyStep') == 'true'
      if(this.isCa || signOnly) {
        var isNoFlow = false
        EventBus.$emit('openSignPad', isNoFlow)
      } else {
        this.openDocName(false)
        // this.saveStep(false)
      }
    },
    openNextTemplate(item) {
      var opt = {}
      opt.eform_id = this.eform_id
      opt.statusDraft = false
      opt.code = item.temp_code
      opt.doc_no = this.doc_no
      opt.isImport = true
      sessionStorage.setItem('option',JSON.stringify(opt))
      sessionStorage.setItem('isDocEdit',false)
      sessionStorage.setItem('isDocStep',false)
      sessionStorage.setItem('isBack',false)
      sessionStorage.setItem('isStep',false)
      this.$router.push({ path: '/form/input' })
    },
    setPdfPass(pdfPass, html, reDownload, count) {
      this.pdfPasswordSetting = pdfPass
      this.sendHtml(html, reDownload, count)
    },
    copyDocument() {
      var opt = {}
      opt.eform_id = this.eform_id
      opt.statusDraft = false
      opt.code = this.templateId
      opt.doc_no = this.doc_no
      opt.isCopy = true
      sessionStorage.setItem('option',JSON.stringify(opt))
      sessionStorage.setItem('isDocEdit',false)
      sessionStorage.setItem('isDocStep',false)
      sessionStorage.setItem('isBack',false)
      sessionStorage.setItem('isStep',false)
      this.$router.push({ path: '/form/input' })
    },
    replaceGtLt(inputWord) {
      if(typeof inputWord === 'string') {
        return inputWord.split('<').join('&lt;').split('>').join('&gt;')
      } else {
        return inputWord
      }
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.showLocation,
          this.showError
        );
      } else {
        this.saveLatitude = 0;
        this.saveLongitude = 0;
      }
    },
    showLocation(position) {
      this.saveLatitude = position.coords.latitude;
      this.saveLongitude = position.coords.longitude;
    },
    showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.log("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.log("An unknown error occurred.");
          break;
      }
      this.saveLatitude = 0;
      this.saveLongitude = 0;
    }
  }
}
</script>

<style>

.font-save-doc{
  color: #1b9900 !important;
  font-weight: bold;
  text-transform: capitalize;
}

.save-doc-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
  padding-left: 1% !important;
  padding-right: 1% !important;
}

.export-json-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
}

.next-temp-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
  padding-left: 1% !important;
  padding-right: 1% !important;
}

.next-temp-to {
  font-family: "Sarabun", sans-serif;
  font-size: 14px !important;
  line-height: 21px !important;
}

.text-area-front {
  font-family: "Sarabun", sans-serif;
}

.editor-box-preview > p {
  margin-bottom: 3px !important;
}

.send-ppl-btn {
  color: white !important;
}

.preview-paper-block {
  overflow: auto;
  height: calc(100vh - 224px);
}

.check-box-preview {
  margin-right: 4px;
}

.title-name-paperless {
  font-family: "Sarabun", sans-serif;
  font-size: 16px;
  color: black;
}

.title-name-paperless-value {
  font-family: "Sarabun", sans-serif;
  font-size: 13px;
}

.v-text-field.paperless-input-line input {
  line-height: 21px;
}

.v-text-field--outlined.message-paperless-row > .v-input__control > .v-input__slot {
  height: 150px !important;
}

.digital-workflow-not-line.v-textarea textarea {
  line-height: 21px !important;
}

.type-paperless-title {
  font-family: "Sarabun", sans-serif;
  font-size: 14px;
  color: black;
}

.type-paperless {
  font-family: "Sarabun", sans-serif;
  font-size: 13px;
}

.preview-other-workflow-icon .theme--light.v-icon {
  color: rgba(0, 0, 0, 0.54) !important;
}

.v-input.note-paperless-title .v-label {
  /* left: 12px !important; */
  font-family: "Sarabun", sans-serif;
  font-size: 19px;
  top: 6px !important;
  height: 29px;
  color: #FF9800;
}

.v-textarea.v-text-field--enclosed.note-paperless-content .v-text-field__slot textarea {
  font-family: "Sarabun", sans-serif;
  font-size: 13px;
  color: #616161;
}

.theme--light.v-text-field--outlined.note-paperless-box fieldset {
  border-color: #FF9800;
}

.step-btn {
  font-family: "Sarabun", sans-serif;
  font-size: 15px !important;
  text-transform: capitalize;
}

.all-workflow-block {
  /* padding-left: 6%; */
  overflow: auto;
  max-height: 265px;
}

.number-step {
  font-family: "Sarabun", sans-serif;
  color: white;
}

.all-step {
  width: 66%;
}

.paperless-file-title {
  font-family: "Sarabun", sans-serif;
  font-size: 16px;
  color: black;
}

.paperless-alert-row {
  width: 100%;
  margin: 0%;
}

.paperless-alert {
  font-family: "Sarabun", sans-serif;
  font-size: 14px;
  color: red;
}

.preview-row {
  width: 100%;
  margin: 0%;
}

.sub-toolbar-preview .v-toolbar__content, .v-toolbar__extension {
  padding-right: 0%;
}

.comment-preview-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
}

.temp-preview-name {
  font-family: "Sarabun", sans-serif;
  width: 100%;
  margin: 0%;
  text-align: center;
}

.back-data-btn{
    font-family: "Sarabun", sans-serif;
    font-size: 16px !important;
    text-transform: capitalize;
  }

.btn-saveStep{
  font-family: "Sarabun", sans-serif;
  padding-left: 1% !important;
  padding-right: 1% !important;
  color: white !important;
}

.btn-savedraft{
  color: #4CAF50 !important;
}

.textarea-data {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}

.comment-part {
  background-color: white;
  border-left: solid 1px #E0E0E0;
}

.preview-comment-row {
  width: 100%;
  margin: 0%;
}

.comment-header {
  font-family: "Sarabun", sans-serif;
  font-size: 16px;
  text-decoration: underline;
}

.comment-boxes {
  height: calc(100vh - 181px);
  overflow: auto;
}

.each-comment {
  width: 100%;
  margin: 0%;
}

.attach-preview-modal-header {
  font-family: "Sarabun", sans-serif;
  font-size: 16px;
}

.attach-file-preview-box {
  font-family: "Sarabun", sans-serif;
  font-size: 13px;
}

.attach-file-preview-chip {
  white-space: unset;
  height: auto !important;
}

.attach-file-preview-chip.v-chip .v-chip__content {
  display: block !important;
}

.cancel-attach-modal-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
}

.attach-file-modal-btn {
  font-family: "Sarabun", sans-serif;
}

.save-doc-modal-header {
  font-family: "Sarabun", sans-serif;
  font-size: 16px !important;
  color: white;
  background-color: #67c25d;
}

.save-doc-row {
  width: 100%;
  margin: 0%;
}

.error-messages-set .v-messages__message {
  line-height: 20px !important;
}

.attached-file-save-modal {
  font-family: "Sarabun", sans-serif;
}

.attached-file-save-modal {
  white-space: inherit;
  height: auto !important;
}

.attached-file-save-modal .v-chip__content {
  display: flex !important;
}

.attach-title-save-modal {
  padding-top: 3% !important;
}

.cancel-efrom-modal-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
}

.save-eform-modal-btn {
  font-family: "Sarabun", sans-serif;
  color: white !important;
  text-transform: capitalize;
}


/*======== style from old file >> Preview_Template(old version) ========*/

.loading-circle-preview {
  position: fixed;
  top: 40%;
  left: 50%;
  z-index: 16;
}

.alert {
  font-family: "Sarabun", sans-serif;
  font-size: 18px !important;
  color: #ADCA5A !important;
}

.close-alert {
  color: #ADCA5A !important;
}

.v-text-field--outlined.body-paperless-row
  > .v-input__control
  > .v-input__slot {
  height: 75px !important;
}

.note-paperless {
  font-family: "Sarabun", sans-serif;
  color: #ef6c00 !important;
  font-size: 13px;
  margin-top: 1%;
  padding-left: 5%;
  overflow: auto;
  max-height: 250px;
  white-space: pre-wrap;
}

.v-text-field--outlined.show-note-row > .v-input__control > .v-input__slot {
  height: 150px !important;
}

.v-input.note-title .v-label {
  left: 12px !important;
  font-family: "Sarabun", sans-serif;
  font-size: 19px;
  top: 14px !important;
  height: 29px;
  color: #ffb74d;
}

.v-textarea.v-text-field--enclosed.note-content .v-text-field__slot textarea {
  font-family: "Sarabun", sans-serif;
  font-size: 13px;
  color: #ef6c00;
}

.theme--light.v-text-field--outlined.note-box-line fieldset {
  border-color: #ffb74d;
}

.theme--light.v-btn.v-btn--disabled .v-icon.send-ppl-disable-icon {
  color: #bdbdbd !important;
}

@media print {
  body * {
    visibility: hidden;
  }
  #preview-paper,
  #preview-paper * {
    visibility: visible;
  }
  #preview-paper {
    position: fixed;
    left: 0;
    top: 0;
  }
}

.row-crad-files{
  width: 100%;
  margin: 0%;
}

.chip-moblie{
  font-family: "Sarabun", sans-serif;
}


/*========================================*/
@media only screen and (max-width: 600px) { /*css for mobile screen*/
  .preview-form-bar .v-toolbar__content {
    padding-left: 1% !important;
  }

  .save-doc-btn {
    margin-right: 2%;
  }

  .next-temp-btn {
    padding-left: 2% !important;
    padding-right: 0% !important;
  }

  .preview-paper-block {
    height: calc(100vh - 211px);
  }

  .all-step {
    width: 100%;
  }

  .back-data-btn {
    font-size: 14px  !important;
  }

  .btn-saveStep{
    margin-right: 0%;
    margin-left: 2%;
  }

  .comment-preview-btn {
    font-size: 11px !important;
    padding-left: 2% !important;
    padding-right: 2% !important;
  }

  .comment-part {
    position: fixed;
    right: 0px;
    top: 112px;
    height: 100%;
    z-index: 12;
  }

  .comment-boxes {
    height: calc(100vh - 169px);
  }

  .attach-title-save-modal {
    padding-top: 0% !important;
  }

  .chip-moblie{
    white-space: inherit;
    height: auto !important;
  }

  .chip-moblie .v-chip__content {
    display: block !important;
  }

  .attach-file-preview-box.v-file-input.v-text-field--outlined.v-input--dense .v-text-field__slot {
    width: 91%;
  }

  /*======== style from old file >> Preview_Template(old version) ========*/
  .loading-circle-preview {
    position: fixed;
    top: 13%;
    left: 13%;
    z-index: 16;
  }
}
</style>