<template>
  <div>
    <v-overlay :value="notReady" absolute opacity="0.3" z-index="9">
      <img width="100px" src="../../assets/loader.gif" class="loading-circle">
    </v-overlay>
    <v-toolbar flat class="create-menu-bar"> <!-- top bar -->
      <v-btn v-if="!isPublic" text class="px-0 back-show-btn" @click="backToUseTemp()">
        <v-icon large color="#4CAF50">mdi-chevron-left</v-icon>
        <b>{{ textLang.tabMenubar.back }}</b>
      </v-btn>
      <v-spacer></v-spacer>
      <!-- button for web -->
      <v-btn v-if="currentStep != '' && currentStep != '1'" depressed rounded large dark color="#FBC02D" class="send-back-btn-icon send-back-btn display-pc-only" @click="openReverse()">
        <v-icon>mdi-reply</v-icon>
        <span class="btn-return-edit">{{ textLang.tabMenubar.return_edit }}</span>
      </v-btn>
      <v-btn v-if="currentStep != ''" depressed rounded large dark color="red" class="send-back-btn-icon send-back-btn display-pc-only" @click="openReject()">
        <v-icon>mdi-file-excel-outline</v-icon>
        <span class="btn-reject-doc save-draft-word">{{ textLang.tabMenubar.reject_doc }}</span>
      </v-btn>
      <v-btn v-if="false" depressed rounded large dark color="#DC143C" class="send-back-btn-icon send-back-btn display-pc-only" @click="openCancel()">
        <v-icon>mdi-file-cancel-outline</v-icon>
        <span class="btn-cancel-doc">{{ textLang.tabMenubar.cancel_doc }}</span>
      </v-btn>
      <v-badge bordered left overlap color="red" :value="attachedFiles.length" :content="attachedFiles.length" class="mr-2 display-pc-only">
        <v-btn outlined rounded large color="grey lighten-1" class="send-back-btn-icon send-back-btn" @click="openAttachFile()">
          <v-icon>mdi-text-box-search-outline</v-icon>
          <span class="btn-view-attachment save-draft-word">{{ textLang.tabMenubar.view_attachment }}</span>
        </v-btn>
      </v-badge>
      <v-btn outlined rounded large color="#4CAF50" class="send-back-btn-icon send-back-btn display-pc-only" @click="save(false, true)">
        <v-icon>mdi-file-search-outline</v-icon>
        <span class="btn-review-ex save-draft-word">{{ textLang.tabMenubar.review_ex }}</span>
      </v-btn>
      <v-btn v-if="currentStep != ''" depressed rounded large color="#C2EB81" class="btn-savedraft send-back-btn-icon send-back-btn display-pc-only" @click="save(true)">
        <v-icon>mdi-file-hidden</v-icon>
        <span class="btn-expan-word save-draft-word">{{ textLang.tabMenubar.save_draft }}</span>
      </v-btn>
      <v-btn depressed large dark color="#4CAF50" class="preview-btn" @click="save(false, false)">{{ textLang.tabMenubar.save_doc_btn }}</v-btn>

      <v-menu offset-y z-index="13" v-if="!isPublic && !isSendStep">
        <template v-slot:activator="{ on }">
           <v-btn v-on="on" depressed large color="grey lighten-2" class="ml-2 pr-2 pl-3 display-pc-only more-en">
            {{ textLang.tabMenubar.more }}
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="(!isSendStep || isComplete) && isSelf" @click="dialogRefDoc = true">
            <v-list-item-icon><v-icon>mdi-file-import-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.import_other }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="(!isSendStep || isComplete) && isSelf && false" @click="dialogImport = true">
            <v-list-item-icon><v-icon>mdi-microsoft-excel</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">Import Excel</v-list-item-title>
          </v-list-item>
          <v-list-item  @click="AddAttachFile()">
            <v-list-item-icon><v-icon>mdi-paperclip</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.attach_file_menu }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item v-if="isOnlyForm && isReport" @click="openExportReport()">
            <v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.export_excel_all_user }}</v-list-item-title>
          </v-list-item>
          <v-list-item  v-if="isOnlyForm" @click="openExportMyForm()">
            <v-list-item-icon><v-icon>mdi-account-arrow-right</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.export_excel_myform }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="openRefDoc()">
            <v-list-item-icon><v-icon>mdi-file-eye-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.view_ref_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isPaperview == true && isSimpleFill" @click="switchView()">
            <v-list-item-icon><v-icon>mdi-checkbook</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.simple_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-else-if="isPaperview == false && isSimpleFill" @click="switchView()">
            <v-list-item-icon><v-icon>mdi-script-text-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.page_view }}</v-list-item-title>
          </v-list-item>  -->
          <v-list-item @click="downloadFromEid()">
            <v-list-item-icon><v-icon>mdi-download</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.download_doc }}</v-list-item-title>
          </v-list-item> 
          <!--  <v-list-item v-if="isSendBack && isSendFirst && isEmailStep" @click="openPermissionTransference()">
            <v-list-item-icon><v-icon>mdi-human-greeting-proximity</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.transfer_title }}</v-list-item-title>
          </v-list-item> -->
        </v-list>
      </v-menu>
      <!-- button for mobile -->
      <v-menu offset-y z-index="13">
        <template v-slot:activator="{ on }">
          <v-btn v-if="!isPublic && !isSendStep" icon color="#4CAF50" v-on="on" class="display-mobile-only">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="(!isSendStep || isComplete) && isSelf" @click="dialogRefDoc = true">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-file-import-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.import_other }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="(!isSendStep || isComplete) && isSelf && false" @click="dialogImport = true">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-microsoft-excel</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">Import Excel</v-list-item-title>
          </v-list-item>
          <v-list-item @click="AddAttachFile()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-paperclip</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.attach_file_menu }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item v-if="isOnlyForm && isReport && false" @click="openExportReport()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-account-group</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.export_excel_all_user }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="isOnlyForm && false" @click="openExportMyForm()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-account-arrow-right</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.export_excel_myform }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="false" @click="openRefDoc()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-file-eye-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.view_ref_doc }}</v-list-item-title>
          </v-list-item> -->
          <v-list-item @click="openAttachFile()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-text-box-search-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">
              <v-badge bordered inline color="red" :value="attachedFiles.length" :content="attachedFiles.length" class="mt-0">
                {{ textLang.tabMenubar.view_attachment }}
              </v-badge>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="currentStep != ''" @click="openReverse()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-reply</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.return_edit }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="currentStep != ''" @click="openReject()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-file-excel-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.reject_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item  v-if="false" @click="openCancel()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-file-cancel-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.cancel_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="save(true, false)"> 
            <v-list-item-icon><v-icon color="#4CAF50">mdi-file-hidden</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.save_draft }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="save(false, true)"> 
            <v-list-item-icon><v-icon color="#4CAF50">mdi-file-search-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.review_ex }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item v-if="(isPaperview == true) && false" @click="switchView() && isSimpleFill">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-checkbook</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.simple_doc }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-else-if="(isPaperview == false) && false" @click="switchView() && isSimpleFill">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-script-text-outline</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.page_view }}</v-list-item-title>
          </v-list-item> -->
          <v-list-item v-if="false" @click="downloadFromEid()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-download</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.download_doc }}</v-list-item-title>
          </v-list-item>
           <!-- <v-list-item v-if="isSendBack && isSendFirst && isEmailStep && false" @click="openPermissionTransference()">
            <v-list-item-icon><v-icon color="#4CAF50">mdi-human-greeting-proximity</v-icon></v-list-item-icon>
            <v-list-item-title class="menu-show-page">{{ textLang.tabMenubar.transfer_title }}</v-list-item-title>
          </v-list-item> -->
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-row class="show-form-block">
      <v-col v-if="show_page_select == true && isPaperview" cols="0" :md="col_page" :lg="col_page" class="pt-5 select-form-page-block display-pc-only"> <!-- page select -->
        <v-row v-for="item in pages" :key="item.index" class="input-form-row">
          <v-col cols="1" class="pa-0 text-center">
            <span class="num-page-input-form">{{item.index}}</span><br>
            <v-tooltip bottom z-index="18">
              <template v-slot:activator="{ on }">
                <v-btn v-show="!item.isHide" icon x-small color="#4CAF50" v-on="on" @click="toggleHidePage(item.index)"><v-icon class="mr-1">mdi-eye-outline</v-icon></v-btn>
              </template>
              <span>{{ textLang.tabMenubar.show_page_tootip }}</span>
            </v-tooltip>
            <v-tooltip bottom z-index="18">
              <template v-slot:activator="{ on }">
                <v-btn v-show="item.isHide" icon x-small color="red" v-on="on" @click="toggleHidePage(item.index)"><v-icon class="mr-1">mdi-eye-off-outline</v-icon></v-btn>
              </template>
              <span>{{ textLang.tabMenubar.hide_page_tootip }}</span>
            </v-tooltip>
          </v-col>
          <v-col cols="auto" class="pt-0" @click="moveToPage(item.index)">
            <img :id="'mini-page'+item.index"  class="page-mini" :src="item.url_image">
          </v-col>
        </v-row>
      </v-col>
      <v-col v-show="isPaperview" cols="12" :md="col_paper" :lg="col_paper" class="pa-0">
        <v-toolbar dense elevation="2" class="paper-menu-bar"> <!-- paper menu -->
          <!-- toggle page select button -->
          <v-btn v-if="show_page_select == true" depressed x-small color="grey lighten-2" class="px-0 open-page-select-btn display-pc-only" @click="togglePageSelect()"><v-icon large>mdi-chevron-left</v-icon></v-btn>
          <v-btn v-else depressed color="grey lighten-2" class="open-page-select-btn display-pc-only"  @click="togglePageSelect()">{{ textLang.tabMenubar.open_page }}</v-btn>
          <v-spacer></v-spacer>
          <!-- zoom button -->
          <v-btn depressed small color="grey lighten-2" class="display-pc-only" @click="zoomOut()"><v-icon color="#aaaaaa">mdi-magnify-minus-outline</v-icon></v-btn>
          <span class="mx-3 zoom-percent display-pc-only">{{zoom_level}} %</span>
          <v-btn depressed small color="grey lighten-2" class="display-pc-only" @click="zoomIn()"><v-icon color="#aaaaaa">mdi-magnify-plus-outline</v-icon></v-btn>
          <!-- page number -->
          <v-btn depressed small color="grey lighten-2" class="ml-6" @click="moveToPage(currentPage-1)"><v-icon color="#aaaaaa">mdi-arrow-left</v-icon></v-btn>
          <span class="mx-3 zoom-percent">{{ textLang.tabMenubar.page }} {{currentPage}}/{{pages.length}}</span>
          <v-btn depressed small color="grey lighten-2" @click="moveToPage(currentPage+1)"><v-icon color="#aaaaaa">mdi-arrow-right</v-icon></v-btn>
          <!-- re-calculate button -->
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn depressed small color="grey lighten-2" class="recalculate-btn" v-on="on" @click="reCalculate()">
                <v-icon color="#aaaaaa">mdi-calculator-variant-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ textLang.tabMenubar.recalculate_btn }}</span>
          </v-tooltip>
          <v-btn depressed small color="grey lighten-2" class="add-page-btn clear-data-btn" @click="clear()">{{ textLang.tabMenubar.clear }}</v-btn> <!-- clear data button -->
          <v-spacer></v-spacer>
          <!-- toggle comment button-->
          <v-btn v-if="show_comment == true && commentAble" depressed x-small color="grey lighten-2" class="px-0 open-page-select-btn" @click="toggleComment()"><v-icon large>mdi-chevron-right</v-icon></v-btn>
          <v-btn v-else-if="show_comment == false && commentAble" depressed color="grey lighten-2" class="open-page-select-btn show-comment-btn"  @click="toggleComment()">{{ textLang.tabMenubar.show_tab }}<br class="display-mobile-only">{{ textLang.tabMenubar.reviews }}<br class="display-mobile-only">{{ textLang.tabMenubar.comment_tab3 }}</v-btn>
        </v-toolbar>
        <v-row justify="center" class="mt-3 temp-name">
          <h3>{{template_name}} <span v-if="doc_name">: {{doc_name}}</span></h3>
        </v-row>
        <div class="mt-2 ml-1 pl-2 pb-2 show-paper-block"> <!-- paper plane -->
          <v-sheet id="workpaper" :elevation="2" color="white" class="main-paper" style="position: relative; padding: 0px;" :width="current_paper_width + 'px'" :height="current_paper_height + 'px'">
            <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['inputbox']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top-1) + 'px;left:' + String(item.left+1) + 'px;'">
              <v-layout v-show="!item.style.hideDisplay" v-if="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)" justify-center :style="'text-align:' + item.style.font_align + ';'">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon" v-on="on">mdi-eye-off-outline</v-icon>
                  </template>
                  <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                </v-tooltip>
                <input :id="item.name+'-input'" :style="'text-align:' + item.style.font_align + ';box-shadow:' + item.style.boxShadow + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'" :disabled="isSendStep || item.disable" v-if="!item.style.number_only" class="input-box" single-line dense :placeholder="item.placeholder" v-model="item.value" @input="toCapital(item), change_calculate(item.object_name,false)">
                <input :id="item.name+'-input'" :style="'text-align:' + item.style.font_align + ';box-shadow:' + item.style.boxShadow + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'" :disabled="isSendStep || item.disable" v-if="item.style.number_only" class="input-box" single-line dense :placeholder="item.placeholder" v-model="item.value" @input="change_calculate(item.object_name,false)" onkeypress='return event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46'>
                {{item.style.suffix}}
              </v-layout>
            </div>
            <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['textfield']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
              <v-layout v-if="item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon" v-on="on">mdi-eye-off-outline</v-icon>
                  </template>
                  <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                </v-tooltip>
                <span :id="item.name + '-box'" :style="'white-space: pre; text-align:' + item.style.font_align + ';width:100%;' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{item.value}}</span>
              </v-layout>
            </div>
            <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['rectangle']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
              <div :id="item.name + '-box'" :style="'width:100%; height:100%;' + item.boxStyle" v-show="item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)" fill-height justify-center align-center>
              </div>
            </div>
            <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['textareabox']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
              <div v-show="!item.style.hideDisplay" v-if="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)" fill-height justify-center :style="'text-align:' + item.style.font_align + '; height:100%;'">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon-textarea" v-on="on">mdi-eye-off-outline</v-icon>
                  </template>
                  <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                </v-tooltip>
                <textarea :style="'text-align:' + item.style.font_align + '; width:100%; height:100%;box-shadow:' + item.style.boxShadow + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'" :disabled="isSendStep || item.disable || item.style.fixedValue" :rows="item.style.row" :id="item.name+'-input'" :cols="(item.width-17)/8" style="resize: none; border:solid 1px lightgrey;" v-model="item.value" @input="checkTextLength(item)"></textarea>
                <div v-if="item.style.maxLetter" class="letters-length">{{item.value.length}}/{{item.style.maxLetter}}</div>
              </div>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn v-show="item.show && item.style.textAreaValiable.length && getHideByValue(item.style.hideOption, item.name, item.style.zIndex) && !item.disable" text icon color="#4CAF50" class="textarea-btn" v-on="on" @click="openTextAreaValModal(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>{{ textLang.tabMenubar.add_variable }}</span>
              </v-tooltip>
            </div>
            <div :id="item.name" :class="item.name + '-obj '+ item.name + '-input'" v-for="item in objectArray['texteditorbox']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon-editorbox" v-on="on">mdi-eye-off-outline</v-icon>
                </template>
                <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
              </v-tooltip>
              <editor v-show="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex) && !item.style.hideDisplay" :inline="true" :init="editor_config" plugins="lists image table" :placeholder="item.placeholder" :disabled="isSendStep || item.disable" toolbar="fontsizeselect forecolor | bold italic underline | alignleft aligncenter alignright alignjustify | numlist bullist | image | table | undo redo" class="editor-box paragraph-editor-box"  v-model="item.value" />
            </div>
            <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['datepickerbox']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
              <div v-show="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex) && !item.style.hideDisplay" fill-height justify-center :style="'text-align:' + item.style.font_align + ';box-shadow:' + item.style.boxShadow + ';'">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon" v-on="on">mdi-eye-off-outline</v-icon>
                    </template>
                    <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                  </v-tooltip>
                  <v-menu
                      v-model="item.datemenu"
                      :close-on-content-click="false"
                      max-width="290"
                      v-if="item.style.date_format == 'be' || item.style.date_format == 'cbe'"
                    >
                      <template v-slot:activator="{ on }">
                        <input
                          :value="setDateFormatBE(item.value,item.style.date_format)"
                          :id="item.name+'-input'"
                          readonly
                          v-on="on"
                          hide-details
                          outlined
                          class="input-box"
                          :disabled="isSendStep || item.disable"
                          :style="'text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'"
                        >
                      </template>
                      <v-date-picker
                        color="#4CAF50"
                        :min="item.rangeDate"
                        v-model="item.value"
                        locale="th"
                        @change="item.datemenu = datechange = false, dateChangeName = item.object_name, changeDate(item)"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="#4CAF50" @click="item.value = '' ,item.datemenu= false">Clear</v-btn>
                      </v-date-picker>
                    </v-menu>
                    <v-menu
                      v-model="item.datemenu"
                      :close-on-content-click="false"
                      max-width="290"
                      v-if="item.style.date_format == 'ce'"
                    >
                      <template v-slot:activator="{ on }">
                        <input
                          :value="setDateFormatCE(item.value)"
                          :id="item.name+'-input'"
                          readonly
                          v-on="on"
                          hide-details
                          outlined
                          class="input-box"
                          :disabled="isSendStep || item.disable"
                          :style="'text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'"
                        >
                      </template>
                      <v-date-picker
                        color="#4CAF50"
                        :min="item.rangeDate"
                        v-model="item.value"
                        locale="en"
                        @change="item.datemenu = datechange = false, dateChangeName = item.object_name, changeDate(item)"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="#4CAF50" @click="item.value = '' ,item.datemenu= false">Clear</v-btn>
                      </v-date-picker>
                    </v-menu>
                </div>
              </div>
              <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['timebox']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                <div v-show="!item.style.hideDisplay" v-if="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)" fill-height justify-center :style="'text-align:' + item.style.font_align + ';box-shadow:' + item.style.boxShadow + ';'">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon" v-on="on">mdi-eye-off-outline</v-icon>
                  </template>
                  <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                </v-tooltip>
                <v-menu
                  v-model="item.datemenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <input
                      v-model="item.value"
                      label="Picker in menu"
                      :id="item.name+'-input'"
                      :placeholder="item.placeholder"
                      readonly
                      v-on="on"
                      class="input-box"
                      :disabled="isSendStep || item.disable"
                      :style="'text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'"
                    >
                  </template>
                  <v-time-picker
                    color="#4CAF50"
                    v-if="item.datemenu"
                    v-model="item.value"
                    full-width
                    :use-seconds="item.style.time.isSec"
                    @click:minute="item.datemenu = datechange= item.style.time.isSec, dateChangeName = item.object_name"
                    @click:second="item.datemenu = datechange = false, dateChangeName = item.object_name"
                    :format="item.style.time.isFull"
                    ampm-in-title
                    class="time-picker-clock"
                  ></v-time-picker>
                </v-menu>
                </div>
              </div>
              <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['checkbox']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                <div v-show="!item.style.hideDisplay" v-if="item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon-checkbox" v-on="on">mdi-eye-off-outline</v-icon>
                      </template>
                      <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                    </v-tooltip>
                    <img v-if="!item.hideBysection && !item.value" :width="item.style.font_size + 'px'" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png" @click="item.value = checkPermission(item)">
                    <img v-if="!item.hideBysection && item.value" :width="item.style.font_size + 'px'" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_84c82695-0eff-4e1f-9e42-f07d49104a84.png" @click="item.value = checkPermission(item)">
                    <span :style="item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'"> {{item.text}}</span>
                </div>
              </div>
              <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['imagebox']" :key="item.name" :style="'position:absolute;opacity:1;display:table-cell;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                <div v-if="item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)" fill-height justify-center align-center>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon-image" v-on="on">mdi-eye-off-outline</v-icon>
                    </template>
                    <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                  </v-tooltip>
                  <img  :src="item.value" :width="item.style.image_width + 'px'" :height="item.style.image_height + 'px'">
                </div>
              </div>
              <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['dropdownbox']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                <div v-show="!item.style.hideDisplay" v-if="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex) && !item.disable" :id="item.name+'-input'" fill-height justify-center align-center>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon" v-on="on">mdi-eye-off-outline</v-icon>
                    </template>
                    <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                  </v-tooltip>
                  <v-combobox dense outlined hide-details :id="item.name+'-input'" :disabled="isSendStep || item.disable" :class="item.name + '-box ' + item.name + '-icon dropdown-icon-block autocomplete-pad'" color="black" :placeholder="item.placeholder" :items="item.choices" v-model="item.value" @change="changeDropDownChoice(item)" :style="item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'"></v-combobox>
                </div>
                <div v-show="!item.style.hideDisplay" v-if="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex) && item.disable" :id="item.name+'-input'" fill-height justify-center align-center>
                  <input :id="item.name+'-input'" :style="'text-align:' + item.style.font_align + ';box-shadow:' + item.style.boxShadow + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'" disabled class="input-box" single-line dense :placeholder="item.placeholder" v-model="item.show_value">
                </div>
              </div>
              <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['autofillbox']" :key="item.name"  v-show="!item.style.hideDisplay" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                <v-layout v-if="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)"  fill-height :style="'text-align:' + item.style.font_align + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon" v-on="on">mdi-eye-off-outline</v-icon>
                    </template>
                    <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                  </v-tooltip>
                  <div v-if="!isSendStep && item.value.isValued" style="width:100%;">
                    <div v-if="item.value.isUser && !(item.value.show == 'function') && !item.value.withChoices">
                      <input :id="item.name+'-input'" :style="'text-align:' + item.style.font_align + ';box-shadow:' + item.style.boxShadow + ';' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'" :disabled="isSendStep || item.disable" class="input-box" single-line dense :placeholder="item.placeholder" v-model="item.value.show_index">
                    </div>
                    <div v-if="item.value.isUser && !(item.value.show == 'function') && item.value.withChoices" class="input-box">
                      <v-combobox dense outlined hide-details :id="item.name+'-input'" :disabled="isSendStep || item.disable" :class="item.name + '-box ' + item.name + '-icon dropdown-icon-block autocomplete-pad'" :placeholder="item.placeholder" :items="item.value.choices" v-model="item.value.show_index" :style="item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'" @input="changeLeaderName(item)"></v-combobox>
                    </div>
                    <div v-if="!item.value.isUser">
                      <div v-if="item.value.show_index == 'undefined'">
                        <input :id="item.name+'-input'" :disabled="isSendStep || item.disable" class="input-box" single-line dense :placeholder="item.placeholder" v-model="item.value.show_value">{{item.style.suffix}}
                      </div>
                      <div v-if="!(item.value.show_index == 'undefined')">
                        <div v-if="item.value.show_array == 'calculatebox'" class="input-box" style="height: 90%;">{{numberToComma(objectArray[item.value.show_array][item.value.show_index]['value'], true)}}{{item.style.suffix}}</div>
                        <div v-if="!(item.value.show_array == 'calculatebox' || item.value.show_array == 'datatable') && !objectArray[item.value.show_array][item.value.show_index].style.autoChoicesSelect" class="input-box" style="height: 90%;">{{objectArray[item.value.show_array][item.value.show_index]['value']}}{{item.style.suffix}}</div>
                        <div v-if="!(item.value.show_array == 'calculatebox' || item.value.show_array == 'datatable') && objectArray[item.value.show_array][item.value.show_index].style.autoChoicesSelect" class="input-box" style="height: 90%;">{{objectArray[item.value.show_array][item.value.show_index]['value'].text}}{{item.style.suffix}}</div>
                        <div v-if="item.value.show_array == 'datatable'" class="input-box" style="height: 90%;">
                          <div v-if="dataTableObjectArray[item.value.show_index].object_type == 'datepickerbox'">
                            {{dataTableObjectArray[item.value.show_index].show_value}}{{item.style.suffix}}
                          </div>
                          <div v-else-if="(dataTableObjectArray[item.value.show_index].object_type == 'linkdatabox') && (dataTableObjectArray[item.value.show_index].valueList.length) && (String(dataTableObjectArray[item.value.show_index].value) != '') && (typeof dataTableObjectArray[item.value.show_index].valueList[dataTableObjectArray[item.value.show_index].value] !== 'undefined')">
                            {{dataTableObjectArray[item.value.show_index].valueList[dataTableObjectArray[item.value.show_index].value].text}}{{item.style.suffix}}
                          </div>
                          <div v-else>
                            {{dataTableObjectArray[item.value.show_index].value}}{{item.style.suffix}}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.value.isUser && (item.value.show == 'function') && (getAutoFunction(item.value.show_index) != 'HIDE')" class="input-box" style="height: 90%;">{{getAutoFunction(item.value.show_index)}}{{item.style.suffix}}</div>
                  </div>
                  <div v-if="isSendStep || !item.value.isValued">
                    <input :id="item.name+'-input'" :disabled="true" class="input-box" single-line dense :placeholder="item.placeholder">
                  </div>
                </v-layout>
              </div>
              <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['inputimagebox']" :key="item.name" v-show="item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex, item) && !item.style.hideDisplay" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon-image" v-on="on">mdi-eye-off-outline</v-icon>
                  </template>
                  <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                </v-tooltip>
                <div v-if="!item.value" :id="item.name + '-box-cover'" style="width:100%; height:100%; border:3px dashed #BDBDBD" @click="openUploadImage(item)">
                  <div :id="item.name + '-box'" fill-height justify-center align-center style="width:100%; height:100%; background-color:grey; opacity:0.2;">
                    <div style="position:absolute; top:40%; width:100%; height:75%; font-size:20px; text-align:center;">{{ textLang.tabMenubar.image_box }}</div>
                  </div>
                </div>
                <div v-show="item.value && !item.isValued && item.show" style="width:100%; height:100%; border: 0px;">
                  <v-btn v-if="!item.disable" dark fab x-small color="grey lighten-1" class="delete-img" v-show="item.value" @click="deleteUploadImage(item)"><v-icon>mdi-close</v-icon></v-btn>
                  <img :src="item.value" :width='item.style.image_width' :height='item.style.image_height' @click="openUploadImage(item)">
                </div>
                <div v-show="item.value && item.isValued && item.show" style="width:100%; height:100%; border: 0px;">
                  <img :src="item.value" width='100%' height='100%'>
                </div>
              </div>
              <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['number2textbox']" :key="item.name" v-show="!item.style.hideDisplay" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                <v-layout v-if="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)"  fill-height justify-center :style="'text-align:' + item.style.font_align + ';'">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon" v-on="on">mdi-eye-off-outline</v-icon>
                    </template>
                    <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                  </v-tooltip>
                  <div v-if="item.style.n2tdecimal != 'en'" class="input-box" :style="'height: 90%;' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{numberToThai(item.value.show_array,item.value.show_index,item.style.n2tdecimal)}}{{item.style.suffix}}</div>
                  <div v-if="item.style.n2tdecimal == 'en'" class="input-box" :style="'height: 90%;' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{numberToEng(item.value.show_array,item.value.show_index,item.style.n2tdecimal)}}{{item.style.suffix}}</div>      
                </v-layout>
              </div>
            <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['calculatebox']" :key="item.name" v-show="!item.style.hideDisplay" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
              <v-layout v-if="!item.hideBysection && item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)" justify-center :style="'text-align:' + item.style.font_align + ';'">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-if="item.style.hidePreview" small color="red" class="not-show-icon" v-on="on">mdi-eye-off-outline</v-icon>
                  </template>
                  <span>{{ textLang.tabMenubar.not_show_obj_icon }}</span>
                </v-tooltip>
                <div class="input-box" :style="'height: 90%;' + item.font_style + 'font-size: ' + item.style.font_size + 'px;' + 'color: ' + item.style.font_color + ';'">{{numberToComma(item.valueShow,true)}}{{item.style.suffix}}</div>
              </v-layout>
            </div>
            <div :id="item.name" v-for="item in objectArray['table']" :key="item.name" v-on:click="selectObject(item,'table')" :style="'position:absolute;opacity:1;display:table-cell;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                  <div v-if="item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)">
                    <table :class="item.name + '-table ' + item.name + '-obj'" :id="item.name + '-table'" :style="item.tableStyle" class="object-table">
                      <tr :class="item.name + '-table'" v-for="r in item.style.table.rowsize" :key="r.index" class="object-table" :style="'height:' + r.size  + 'px; border: 0px;' + item.tableStyle">
                        <td :class="item.name + '-table'" v-for="c in item.style.table.colsize" :key="c.index" class="object-table" :style="'width:' + c.size + 'px;' + item.tableStyle">
                          <div v-if="r.deleteAble && item.style.addTable" class="delete-row-button-block">
                            <v-btn fab dark depressed x-small color="red accent-4" @click="deleteTableRow(item.object_name, r)"><v-icon>mdi-minus</v-icon></v-btn>
                          </div>
                          <div class="add-row-button-block" v-if="r.index == item.style.table.rowsize[item.style.table.rowsize.length-1].index && item.style.addTable">
                            <v-btn fab dark depressed x-small color="light-blue darken-3" @click="addTableRow(item.object_name)"><v-icon>mdi-plus</v-icon></v-btn>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>     
              </div>
              <div :id="item.name" v-for="item in objectArray['datatable']" :key="item.name" :style="'position:absolute;opacity:1;display:table-cell;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                <div v-if="item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)">
                  <table :class="item.name + '-table ' + item.name + '-obj'" :id="item.name + '-table'" class="object-table" :style="'border:' + item.style.border_size + 'px solid ' + item.style.border_color + ';'">
                    <tr :class="item.name + '-table'" v-for="r in item.style.table.rowsize" :key="r.index" class="object-table" :style="'border:' + item.style.border_size + 'px solid ' + item.style.border_color + ';' + 'height:' + r.size  + 'px;'">
                      <td v-show="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.hideDisplay" :class="item.name + '-table'" v-for="c in item.style.table.colsize" :key="c.index" class="object-table" :style="'border:' + item.style.border_size + 'px solid ' + item.style.border_color + ';' + 'width:' + c.size + 'px;' + ' background-color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.background_color">                  
                        <div v-show="getHideByValue(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.hideOption, item.object_name + '_' + 'R' + r.index + 'C' + c.index, item.style.zIndex)" :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name" :style="'color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + '!important;  font-size:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px; ' + 'text-overflow: ellipsis; white-space: nowrap;overflow: hidden;' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].font_style + 'width:' + String(Number(c.size)-1) + 'px;'">
                          <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].hideBysection && !dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'linkdatabox'">
                            <v-autocomplete v-if="(!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.fixedValue) && (!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable) && (typeof dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].valueList[dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value] !== 'undefined') && (dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].valueList[dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value].text)" :disabled="isSendStep || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable" :class="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-box ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-icon dropdown-icon-block'" :readonly="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.fixedValue" :style="'width:100%; text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';'" dense outlined hide-details color="black" class="dropdown-icon-block autocomplete-pad" :items="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].valueList" v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" @input="changeDataTableValue(item.object_name, r.index, c.index ,item.style.table.ccol)"></v-autocomplete>
                            <input  v-if="(!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.fixedValue) && (!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable) && (typeof dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].valueList[dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value] !== 'undefined') && (!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].valueList[dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value].text)" :placeholder="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].placeholder" :disabled="isSendStep || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable" :readonly="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.fixedValue" :style="'height:100%!important; width:100%; text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; box-shadow:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.boxShadow + ';'" v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show_value" hide-details @input="change_calculate(item.object_name + '_' + 'R' + r.index + 'C' + c.index,false)">
                            <div v-if="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.fixedValue || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable" :style="'white-space: normal; color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + ';'">{{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show_value}}</div>
                          </div>
                          <input :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-input'" v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].hideBysection && !dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'inputbox'" :placeholder="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].placeholder" :disabled="isSendStep || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable" :style="'height:100%!important; width:100%; text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; box-shadow:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.boxShadow + ';'" v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" hide-details @keyup.enter="searchInputText(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index], true, r.index)" @input="toCapital(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index]) ,change_calculate(item.object_name + '_' + 'R' + r.index + 'C' + c.index,false)">
                          <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'textfield'" :style="'word-break: break-word; height:100%!important; width:100%; text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + '!important;'">
                            {{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value}} 
                          </div>
                          <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].hideBysection && !dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'dropdownbox'" :style="'text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; color:lightgrey; width:'+ String(Number(c.size) - 1) + 'px;'">
                            <v-combobox v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable" dense outlined hide-details :disabled="isSendStep || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable" color="black"  :class="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-box ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-icon dropdown-icon-block'" :placeholder="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].placeholder" :items="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].choices" v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" @change="changeDropDownChoice(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index])"></v-combobox>
                            <div v-if="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable" :style="'white-space: normal; color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + ';'">{{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show_value}}</div>
                          </div>
                          <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'checkbox'" :style="'text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';'">
                            <img v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].hideBysection && !dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" :width="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px'" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png" @click="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value = checkPermission(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index])">
                            <img v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].hideBysection && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" :width="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px'" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_84c82695-0eff-4e1f-9e42-f07d49104a84.png" @click="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value = checkPermission(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index])">
                            <span> {{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].text}}</span>
                          </div>
                          <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].hideBysection &&!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'calculatebox'" :style="'height:100%!important; width:100%; text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + '!important;'">
                            {{numberToComma(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].valueShow,true)}}{{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.suffix}}
                          </div>
                          <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].hideBysection &&!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'datepickerbox'" fill-height justify-center :style="'text-align:' + item.style.font_align + ';box-shadow:' + item.style.boxShadow + ';'"> 
                            <v-menu
                                v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu"
                                :close-on-content-click="false"
                                max-width="290"
                                v-if="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.date_format == 'be' || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.date_format == 'cbe'"
                              >
                                <template v-slot:activator="{ on }">
                                  <input
                                    :value="setDateFormatBE(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value,dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.date_format)"
                                    readonly
                                    v-on="on"
                                    hide-details
                                    outlined
                                    class="input-box"
                                    :disabled="isSendStep || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable"
                                    :style="'text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].font_style + 'font-size: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px;' + 'color: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + ';'"
                                  >
                                </template>
                                <v-date-picker
                                  color="#4CAF50"
                                  :min="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].rangeDate"
                                  v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value"
                                  locale="th"
                                  @change="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu = datechange = false, dateChangeName = dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_name,
                                    dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show_value = setDateFormatBE(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value,dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.date_format), 
                                    changeDate(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index])"
                                >
                                  <v-spacer></v-spacer>
                                  <v-btn text color="#4CAF50" @click="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value = '' ,dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show_value = '',  dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu= false">Clear</v-btn>
                                </v-date-picker>
                              </v-menu>
                              <v-menu
                                v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu"
                                :close-on-content-click="false"
                                max-width="290"
                                v-if="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.date_format == 'ce'"
                              >
                                <template v-slot:activator="{ on }">
                                  <input
                                    :value="setDateFormatCE(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value)"
                                    readonly
                                    v-on="on"
                                    hide-details
                                    outlined
                                    class="input-box"
                                    :disabled="isSendStep || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].disable"
                                    :style="'text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].font_style + 'font-size: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px;' + 'color: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + ';'"
                                  >
                                </template>
                                <v-date-picker
                                  color="#4CAF50"
                                  :min="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].rangeDate"
                                  v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value"
                                  locale="en"
                                  @change="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu = datechange = false, dateChangeName = dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_name,
                                    dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show_value = setDateFormatBE(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value,dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.date_format),
                                    changeDate(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index])"
                                >
                                  <v-spacer></v-spacer>
                                  <v-btn text color="#4CAF50" @click="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value = '', dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show_value = '' ,dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu= false">Clear</v-btn>
                                </v-date-picker>
                              </v-menu>
                          </div>
                          <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].hideBysection &&!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'timebox'" fill-height justify-center :style="'text-align:' + item.style.font_align + ';box-shadow:' + item.style.boxShadow + ';'">
                            <v-menu
                              v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <input
                                  v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value"
                                  label="Picker in menu"
                                  :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name+'-input'"
                                  :placeholder="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].placeholder"
                                  readonly
                                  v-on="on"
                                  class="input-box"
                                  :style="'text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_style + 'font-size: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px;' + 'color: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color + ';'"
                                >
                              </template>
                              <v-time-picker
                                color="#4CAF50"
                                v-if="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu"
                                v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value"
                                full-width
                                :use-seconds="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.time.isSec"
                                @click:minute="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu = datechange= dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.time.isSec, dateChangeName = dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_name"
                                @click:second="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].datemenu = datechange = false, dateChangeName = dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_name"
                                :format="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.time.isFull"
                                ampm-in-title
                                class="time-picker-clock"
                              ></v-time-picker>
                            </v-menu>
                          </div>
                        </div>
                        <div v-if="c.index == item.style.table.colsize[0].index && r.deleteAble && item.style.addTable && item.addAble" class="delete-row-button-block">
                          <v-btn fab dark depressed x-small color="red accent-4" @click="deleteTableRow(item.object_name, r)"><v-icon>mdi-minus</v-icon></v-btn>
                        </div>
                        <div class="add-row-button-block" v-if="r.index == item.style.table.rowsize[item.style.table.rowsize.length-1].index && item.style.addTable && item.addAble">
                          <v-btn fab dark depressed x-small color="light-blue darken-3" @click="addTableRow(item.object_name)"><v-icon>mdi-plus</v-icon></v-btn>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>     
              </div>
              <div :id="item.name" v-for="item in objectArray['line']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
                  <div v-if="item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)" :style="'height:100%; width:100%;'">
                    <table v-if="item.style.line_set == 'l'" :style="'width:100%; height:100%; border-collapse:collapse;'">
                      <tr :style="'height:50%; border-bottom:' + item.style.border_size +'px '+ item.style.line_style +' ' + item.style.border_color +'; border-collapse:collapse;'">
                        <td :style="'width:100%;'">
                        
                        </td>
                      </tr>
                      <tr :style="'height:50%; border-top:' + item.style.border_size +'px '+ item.style.line_style +' ' + item.style.border_color +'; border-collapse:collapse;'">
                        <td :style="'width:100%;'">
                        
                        </td>
                      </tr>
                    </table>
                    <table v-if="item.style.line_set == 'p'" :style="'width:100%; height:100%; border-collapse:collapse;'">
                      <tr :style="'height:100%;'">
                        <td :style="'width:50%; border-right:' + item.style.border_size +'px '+ item.style.line_style +' ' + item.style.border_color +'; border-collapse:collapse;'">
                        
                        </td>
                        <td :style="'width:50%'">
                        
                        </td>
                      </tr>
                    </table>
                  </div>     
              </div>
            <div :id="item.name" v-for="item in objectArray['signbox']" :key="item.name" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'" @click="moveSign(item)">
              <div v-show="!item.hideBysection &&item.show && getHideByValue(item.style.hideOption, item.name, item.style.zIndex)" style="height:100%">
                <div v-if="item.value || item.style.signUrl">
                  <img v-if="item.value" :width="'100%'" :src="item.value">
                  <img v-if="!item.value && item.style.signUrl" :width="'100%'" :src="item.style.signUrl">
                </div>
                <div v-if="!(item.value || item.style.signUrl) && !item.disable" style="background-color:#64B5F6; width:100%; height:100%; opacity:0.3; border:3px dashed #2196F3;"></div>
              </div>
            </div>
          </v-sheet>
        </div>
      </v-col>
      <v-col v-show="!isPaperview" cols="12" :md="col_page + col_paper" :lg="col_page + col_paper" class="pt-0 px-0"> <!--  form in mobile style  -->
        <v-row class="temp-title-mobile-row">
          <v-spacer></v-spacer>
          <v-col cols="9" md="10" lg="10">
            <h3 class="temp-name-mobile">{{template_name}}</h3>
          </v-col>
          <v-spacer></v-spacer>
          <v-col v-if="commentAble" cols="3" md="2" lg="2" class="px-0 pt-0 comment-mobile-btn-block">
            <v-btn v-if="show_comment == true && commentAble" depressed x-small color="grey lighten-2" class="px-0 close-comment-mobile-btn" @click="toggleComment()"><v-icon large>mdi-chevron-right</v-icon></v-btn>
            <v-btn v-else-if="show_comment == false && commentAble" depressed color="grey lighten-2" class="open-comment-mobile-btn"  @click="toggleComment()">{{ textLang.tabMenubar.show_tab }}<br class="hidden-md-and-up">{{ textLang.tabMenubar.reviews }}</v-btn>
          </v-col>
        </v-row>
        <!-- <v-row class="all-temp-mobile-row">
          <ShowTemplateMobile/>
        </v-row> -->
      </v-col>
      <v-col :cols="col_comment_sm" :md="col_comment" :lg="col_comment" v-if="show_comment == true && commentAble" class="pr-0 pb-0 comment-block2"> <!-- Comment -->
        <v-row class="pr-3 show-form-block">
          <span class="mt-4 comment-header-property"><b>{{ textLang.text_dialog.comment }}</b></span>
          <v-spacer class="display-mobile-only"></v-spacer>
          <v-btn icon class="mt-2 display-mobile-only" @click="toggleComment()"><v-icon large>mdi-chevron-right</v-icon></v-btn>
        </v-row>
        <br>
        <v-textarea rows="1" outlined single-line dense no-resize :placeholder="textLang.text_dialog.write_comment" color="#4CAF50" class="mr-3 pad-textarea show-input-comment-box" :disabled="!isEditable" v-model="inputComment">
          <template v-slot:append-outer>
            <v-icon size="30" color="#4CAF50" :disabled="newComment != ''" @click="addComment()">mdi-send</v-icon>
          </template>
        </v-textarea>
        <div class="comments-box">
          <v-row v-for="item in comments" :key="item.index" class="mb-5 comment-set"> <!-- set of one comment -->
            <v-col cols="auto" class="px-0 pt-0">
              <v-icon size="30">mdi-account-circle</v-icon>
            </v-col>
            <v-col cols="" class="pa-0">
              <v-row class="show-comment-row comment-name">
                {{item.sender}}
              </v-row>
              <v-card outlined class="mr-3 mt-3 pa-3">
                <pre class="comment-sentence">{{item.message}}</pre>
              </v-card>
              <v-row class="pr-3 show-comment-row">
                <v-spacer></v-spacer>
                <span class="comment-date">{{item.date}}</span>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <!-- Import Excel Modal -->
    <v-dialog v-model="dialogImport" persistent max-width="450px">
      <v-card>
        <v-card-title>
          <span class="input-form-modal-header">{{ textLang.text_dialog.import }}</span>
          <v-spacer></v-spacer>
          <v-btn icon dark small color="black" @click="dialogImport = false">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          <v-file-input dense outlined hide-details color="#4CAF50" truncate-length="32" :placeholder="textLang.text_dialog.select" accept=".xlsx" class="insert-image-file" id="file" v-model="excelFile"></v-file-input>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn outlined color="#4CAF50" class="px-6 mr-2 insert-image-btn-modal" @click="dialogImport = false">{{ textLang.text_dialog.cancle }}</v-btn>
          <v-btn depressed dark color="#4CAF50" class="px-5 ml-2 insert-image-btn-modal" @click="importExcel()">Import</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ReverseWorkFlowModal/>
    <InputDocumentNameModal/>
    <RefDocumentModal/>
    <AttachFileModal/>
    <RejectModal/>
    <ConfirmCancelDocumentModal/>
    <AddAttachFileModal/>
    <PermissionTransferenceDocumentModal />
    <!-- <SignaturePadModal/> -->

    <!-- Import Image Modal -->
    <v-dialog v-model="dialogImageUpload" persistent max-width="500px">
      <v-card>
        <v-card-title>
         <span class="input-form-modal-header">{{ textLang.text_dialog.insert_picture }}</span>
         <v-spacer></v-spacer>
          <v-btn icon dark small color="black" @click="dialogImageUpload = false">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-row class="input-form-row">
            <v-file-input dense outlined hide-details color="#4CAF50" :placeholder="textLang.text_dialog.select_img" accept="image/*" class="insert-image-file" id="file" v-model="uploadImage"></v-file-input>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-6">
          <v-spacer></v-spacer>
          <v-btn outlined color="#4CAF50" class="px-10 mr-4 insert-image-btn-modal" @click="dialogImageUpload = false">{{ textLang.text_dialog.cancle }}</v-btn>
          <v-btn depressed dark color="#4CAF50" class="px-5 ml-4 insert-image-btn-modal" @click="imageUpload()" >{{ textLang.text_dialog.insert_picture }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Setting Variable For Textarea Modal -->
    <v-dialog v-model="dialogTextAreaVal" scrollable persistent max-width="600px">
      <v-card>
        <v-card-title class="py-2 textarea-variable-modal-header">
          {{ textLang.text_dialog.set_messages }}
        </v-card-title>
        <v-card-text class="pt-4">
          <h3 class="variable-textarea-ex-title">{{ textLang.text_dialog.sample_text }}</h3>
          <div class="textarea-ex-box">
            <pre class="textarea-ex">{{selectedTextArea.defaultValue}}</pre>
          </div>
          <br>
          <h3 class="variable-textarea-ex-title">{{ textLang.text_dialog.define_messages }}</h3>
          <v-row class="input-form-row">
            <v-col cols="12" md="6" lg="6" class="pa-0" v-for="val in textAreaVals" :key="val.text"> <!-- setting value of one variable -->
              <v-row class="input-form-row">
                <v-col cols="5" md="4" lg="4" align-self="center" class="pl-0 pb-0">
                  <span class="variable-title">{{val.text}} :</span>
                </v-col>
                <v-col cols="7" md="7" lg="7" class="px-0 pb-0">
                  <v-text-field dense outlined hide-details color="#67c25d" class="pad-input-textarea-variable variable-textarea" v-model="val.value"></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pt-3 pb-6">
          <v-spacer></v-spacer>
          <v-btn outlined color="#4CAF50" class="px-10 mr-2 insert-image-btn-modal" @click="dialogTextAreaVal = false">{{ textLang.text_dialog.cancle }}</v-btn>
          <v-btn depressed dark color="#4CAF50" class="px-3 ml-2 insert-image-btn-modal" @click="closeTextAreaValModal()">{{ textLang.text_dialog.record_variable }}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Import Doc Modal -->
    <v-dialog v-model="dialogRefDoc" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="input-form-modal-header">{{ textLang.text_dialog.import_other }}</span>
          <v-spacer></v-spacer>
          <v-btn icon dark small color="black" @click="dialogRefDoc = false">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-2 pb-0">
          <v-row class="input-form-row">
            <v-col cols="12" md="4" lg="4" align-self="center" class="pl-0 type-doc-import-title">
              {{ textLang.text_dialog.document_type_import }}
            </v-col>
            <v-col cols="12" md="8" lg="8" align-self="center" class="px-0">
              <v-autocomplete dense outlined hide-details color="#4CAF50" append-icon="mdi-chevron-down" :items="typeDocImport" class="type-doc-import type-doc-import-box doc-import-dropdown-icon" v-model="importType"></v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="mt-0 input-form-row">
            <v-col cols="12" md="4" lg="4" align-self="center" class="pl-0 type-doc-import-title">
             {{ textLang.text_dialog.document_number }}
            </v-col>
            <v-col cols="12" md="8" lg="8" align-self="center" class="px-0">
              <v-text-field dense outlined hide-details color="#4CAF50" class="doc-num-import" v-model="refDocNo"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-3">
          <v-row class="input-form-row">
            <v-spacer></v-spacer>
            <v-col cols="6" md="4" lg="4" class="pl-0 pr-2">
              <v-btn outlined block color="#4CAF50" class="insert-image-btn-modal" @click="dialogRefDoc = false">{{ textLang.text_dialog.cancle }}</v-btn>
            </v-col>
            <v-col cols="6" md="4" lg="4" class="pl-2 pr-0">
              <v-btn depressed block dark color="#4CAF50" class="insert-image-btn-modal" @click="checkImportType(refDocNo)" >{{ textLang.text_dialog.import_data }}</v-btn>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { EventBus } from '../../EventBus'
  import ReverseWorkFlowModal from '../../components/ReturnCorrection'
  import InputDocumentNameModal from '../../components/eform/InputDocumentNameModal'
  import AttachFileModal from '../../components/eform/AttachFileModal'
  import RejectModal from '../../components/eform/RejectModal'
  import RefDocumentModal from '../../components/eform/RefDocumentModal'
  import Editor from '@tinymce/tinymce-vue'
  import ConfirmCancelDocumentModal from '../../components/eform/ConfirmCancelDocumentModal'
  import AddAttachFileModal from '../../components/eform/AddAttachFileModal'
  import PermissionTransferenceDocumentModal from '../../components/eform/PermissionTransferenceDocumentModal'
  import { mapState } from 'vuex'
  import moment from 'moment'

  export default {
    computed: mapState({
      objectTemplate: state => state.objectTemplate,
      uploadedFile: state => state.uploadedFile
    }),
    components: {
      ReverseWorkFlowModal,
      InputDocumentNameModal,
      AttachFileModal,
      RejectModal,
      RefDocumentModal,
      ConfirmCancelDocumentModal,
      'editor': Editor,
      AddAttachFileModal,
      PermissionTransferenceDocumentModal
    },
    data: () => ({
      textLang: {
        tabMenubar: {
          back: "ออกจากแบบฟอร์มนี้",
          review_ex: "ดูเอกสารตัวอย่าง",
          save_doc_btn: "บันทึกเอกสาร",
          file: "ยื่นเอกสาร",
          return_edit: "ส่งคืนแก้ไข",
          reject_doc: "ปฏิเสธอนุมัติ",
          cancel_doc: "ยกเลิกเอกสาร",
          page: "หน้า",
          recalculate_btn: "คำนวณข้อมูลในเอกสารใหม่อีกครั้ง",
          clear: "ล้าง",
          more: "เพิ่มเติม",
          import_other: "Import ข้อมูลจากเอกสารอื่น",
          attach_file_menu: "แนบเอกสารเพิ่มเติม",
          export_excel_all_user: "Export Excel ข้อมูลในเอกสารของผู้ใช้",
          export_excel_myform: "Export Excel การใช้งานเอกสารของฉัน",
          view_ref_doc: "ดูเอกสารอ้างอิง",
          view_attachment: "ดูเอกสารแนบ",
          open_page: "เปิดเพื่อดูหน้ากระดาษ",
          show_page_tootip: "แสดงหน้ากระดาษ",
          hide_page_tootip: "ซ่อนหน้ากระดาษ",
          show_tab:"เปิดแถบแสดง",
          reviews: "ความคิดเห็น",
          add_variable: "เพิ่มค่าตัวแปรให้กับข้อความ",
          not_show_obj_icon: "ไม่แสดงในหน้าเอกสาร",
          image_box: "กดเพื่อแทรกรูปภาพ",
          fill: "ช่อง ",
          must: " ต้อง",
          greater_than: "มากกว่า ",
          less_than: "น้อยกว่า",
          equal: "เท่ากับ ",
          greater_equal: "มากกว่าหรือเท่ากับ ",
          lesss_equal: "น้อยกว่าหรือเท่ากับ ",
          not_equal: "ไม่เท่ากับ ",
          and: " และ",
          step: "ลำดับที่ ",
          save_draft: "บันทึกเอกสารแบบร่าง",
          simple_doc : "มุมมองเอกสารอย่างง่าย",
          page_view: "มุมมองหน้ากระดาษ",
          download_doc: "ดาวน์โหลดเอกสาร",
          transfer_title: "โอนสิทธิ์การกรอกเอกสาร"
        },
        text_dialog: {
          import: "Import ข้อมูลจาก Excel",
          files: "ไฟล์ Excel :",
          select: "กรุณาเลือกไฟล์",
          cancle: "ยกเลิก",
          comment: "แสดงความคิดเห็น",
          write_comment: "เขียนความคิดเห็น...",
          insert_picture: "แทรกรูปภาพ",
          image: "รูปภาพ :",
          select_img: "กรุณาเลือกรูปภาพ",
          set_messages: "ตั้งค่าตัวแปรให้กับข้อความ",
          sample_text: "ตัวอย่างข้อความ",
          define_messages: "กำหนดค่าตัวแปรในข้อความ",
          record_variable: "บันทึกค่าตัวแปร",
          document_type_import: "ประเภทเอกสาร :",
          eform_type_import: "เอกสาร E-Form",
          cvm_type_import: "เอกสาร CVM (CVM ID)",
          so_type_import: "หมายเลข SO (SO No.)",
          invoice_type_import: "หมายเลข Invoice (Invoice No.)",
          cus_type_import: "หมายเลขลูกค้า (Customer ID)",
          document_number: "หมายเลขเอกสาร :",
          import_data: "Import ข้อมูล",
          import_other: "Import ข้อมูลจากเอกสารอื่น"
        },
        alert: {
          alert_error: "ไม่สำเร็จ",
          alert_warning: "แจ้งเตือน",
          alert_success: "สำเร็จ",
          fill_data: "กรุณากรอกข้อมูลให้ครบถ้วน",
          assign: "ยื่นเอกสารสำเร็จ",
          fail: "ยื่นเอกสารไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
          reverse: "ส่งคืนแก้ไขสำเร็จ",
          fail_reverse: "ส่งคืนแก้ไขไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
          fail_template: "ไม่พบแบบฟอร์ม",
          prefix_maxchar: 'กรอกค่าเกินจำนวนตัวอักษรสูงสุด (',
          subfix_maxChar: ' ตัวอักษร)',
          reject_complete: "ปฏิเสธอนุมัติสำเร็จ",
          reject_fail: "ปฏิเสธอนุมัติไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
          eform_use: "แบบฟอร์มถูกใช้งานโดย ", 
          upload_fail : "อัพโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่ในภายหลัง"
        }
      },
      col_page: 0,
      col_paper: 0,
      col_comment: 0,
      col_comment_sm: 0,
      show_page_select: true,
      alert_error: false,
      template_name: "",
      template_header: [{}],
      template_body: [{}],
      template_footer: [{}],
      default_height: 30,
      default_fontsize: 23,
      default_width: 100,
      editor_config: {
        menubar: false,
        fontsize_formats: '8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 36px 48px 72px',
        content_style: '.paragraph-editor-box > p {margin-bottom: 3px !important;}',
        image_advtab: true
      },
      objectCounter: {
        'textfield':0,
        'inputbox':0,
        'textareabox':0,
        'texteditorbox':0,
        'inputimagebox':0,
        'line':0,
        'dropdownbox':0,
        'datepickerbox':0,
        'timebox':0,
        'checkbox':0,
        'radiobox':0,
        'textareafield':0,
        'rectangle':0,
        'imagebox':0,
        'autofillbox':0,
        'calculatebox':0,
        'number2textbox':0,
        'table':0,
        'signbox': 0,
        'sectionbox':0,
        'datatable':0
      },
      objectArray: {
        'textfield':[],
        'inputbox':[],
        'textareabox':[],
        'texteditorbox':[],
        'inputimagebox':[],
        'line':[],
        'dropdownbox':[],
        'timebox':[],
        'datepickerbox':[],
        'checkbox':[],
        'radiobox':[],
        'textareafield':[],
        'rectangle':[],
        'imagebox':[],
        'autofillbox':[],
        'calculatebox':[],
        'number2textbox':[],
        'table':[],
        'signbox': [],
        'sectionbox':[],
        'datatable': []
      },
      objectType: [
        'textfield',
        'inputbox',
        'textareabox',
        'texteditorbox',
        'inputimagebox',
        'line',
        'dropdownbox',
        'datepickerbox',
        'timebox',
        'checkbox',
        'radiobox',
        'textareafield',
        'rectangle',
        'imagebox',
        'calculatebox',
        'number2textbox',
        'autofillbox',
        'table',
        'signbox',
        'sectionbox',
        'datatable'
      ],
      objectTypeInput: [
        'inputbox',
        'textareabox',
        'texteditorbox',
        'inputimagebox',
        'dropdownbox',
        'datepickerbox',
        'timebox',
        'checkbox',
        'calculatebox',
        'number2textbox',
        'autofillbox',
      ],
      option: {},
      sleep: false,
      selected_array: null,
      selected_object: null,
      one_result_data: {},
      icon_show_comment: 'mdi-chevron-triple-right',
      show_comment: true,
      notReady: true,
      isSendStep:false,
      doc_name: "",
      dialog: false,
      paper_size: [{text:"A4", width:1190, height:1666, value:0},{text:"A3", width:1666, height:2349, value:1}],
      current_paper_width: 1190,
      current_paper_height : 1666,
      template_option: {},
      current_flow: "",
      isSendBack: false,
      isSendFirst: true,
      dialog_backStep: false,
      backStepTarget: "",
      backStepArray: [],
      inputComment: "",
      comments: [],
      commentAble: false,
      isComplete: false,
      isSelf: true,
      datechange: true,
      validInput: "",
      dialogImport: false,
      excelFile: [],
      time: null,
      menu2: false,
      template_side: "PORTRAIT",
      currentPage: 1,
      pages:[],
      isEditable: false,
      dataDict: {},
      changeDict: {},
      dateChangeName: "",
      allUserStep: false,
      dialogImageUpload: false,
      uploadImage: [],
      dataTableObjectArray: {},
      dialogTextAreaVal: false,
      textAreaVals: [],
      selectedTextArea: {},
      dropdownChangeDict: {},
      zoom_level: 100,
      hideOptionDict: {},
      selectedCell: "",
      isDataTable: false,
      dialogRefDoc: false,
      refDocNo: "",
      isPublic: false,
      isProvinceFetch: false,
      isCvmFetch: false,
      isSoFetch: false,
      isInvoiceFetch: false,
      isCusFetch: false,
      provinceArray: [],
      cvmArray: [],
      soArray: [],
      invoiceArray: [],
      cusArray: [],
      files: [],
      templateArray: [],
      optionsPage:{
        subject_text:"",
        service_properties: "",
        body_text: ""
      },
      newComment: "", 
      isCa: false,
      signing: false,
      refDataDoc: [],
      leaderArray: [],
      onSave: false,
      ext_template : {},
      isPaperview: true,
      isSimpleFill: false,
      paperSizeIndex: 0,
      isOwner: false,
      isFlowDoc: false,
      docReserved: false,
      isOnlyForm: false,
      isReport: false,
      attachedFiles: [],
      files: [],
      typeDocImport: [{text:"เอกสาร E-Form", value:"eform"}, {text:"เอกสาร CVM (CVM ID)", value:"cvm"}, {text:"หมายเลข SO (SO No.)", value:"so"},{text: 'หมายเลขลูกค้า (Customer ID)', value: 'cus_id'},{text: 'หมายเลข Invoice(Invoice No.)', value: 'invoice'}],
      // typeDocImport: [{text:"เอกสาร E-Form", value:"eform"}],
      importType: "eform",
      isEmailStep: false,
      uploadFolder: "",
      currentStep: "",
      checkContSleep:false,
      contTableArray: [],
      changeHideDict: {},
      onImport: false,
      changeDefaultDict: {},
      isFirstFill: false,
       //Color Variable
      // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
      color_loading_bar_bg: '#C2EB81',
      color_loading_bar: '#1b9900',
      color_excel_file: '#2ACA9F',
      color_import: '#2ACA9F',
      color_document_number: '#2ACA9F',
      color_img:'#2ACA9F',
      color_message:'#2ACA9F',
      color_icon_chevron_left: '#1b9900',
      color_btn_background: '#1b9900',
      color_datemenu: '#1b9900',
      color_inputComment: '#1b9900',
      color_icon_human_greeting: '#1b9900',
      // color_loading: '#1b9900', //class lds-roller in App.vue
      color_mini_page: '#1b9900', //function moveToPage
      color_box_shadow: '#1b9900', //function moveToPage
      color_savedraft: '#C2EB81',
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
 			main_color: '#1b9900',
    }
    }),
    beforeDestroy() {
      EventBus.$off('getDocName')
      EventBus.$off('toBackStep')
      EventBus.$off('changeLang')
      EventBus.$off('toRejectTemplate')
      EventBus.$off('changeAttachFiles')
      EventBus.$off('transferenceDone')
      EventBus.$off('removeAttachFiles')
      if(this.option.eform_id && !this.onSave && this.docReserved) {
        this.returnEform(this.option.eform_id)
      }
      if(!this.onSave) {
        this.$store.commit('setUploadedFile', [])
      }
      window.removeEventListener('beforeunload', this.handler)
    },

    // beforeRouteLeave (to, from , next) {
    //   const answer = window.confirm('Do you really want to leave? Changes you made may not be saved!')
    //   if (answer) {
    //     next()
    //   } else {
    //     // next(false)
    //   }
    // },

    created() {
      this.calStartRatioPage()
      window.addEventListener('beforeunload', this.handler)
    },
    mounted() {
      // this.files = this.$store.state.uploadedFile
      sessionStorage.setItem('caStep', false)
      sessionStorage.setItem('signOnlyStep', false)
      sessionStorage.setItem('switchView', true)
      sessionStorage.setItem('caStepName', "")
      sessionStorage.setItem('refDataDoc',JSON.stringify(this.refDataDoc))
      sessionStorage.setItem('showDraft', false)
      sessionStorage.setItem('sendBackAndFirst',false)
      sessionStorage.setItem('isNoFlowSign', false)
      sessionStorage.setItem('isLastStep', false)
      sessionStorage.setItem('signStep', false)
      if(sessionStorage.getItem("public_eform") != 'true') {
        if((sessionStorage.getItem("first_login") == 'true') && (sessionStorage.getItem("wait") == 'true')) {
          sessionStorage.setItem("first_login",false)
        }
        sessionStorage.setItem("wait",false)
        this.getData ()
        this.isSendBack= false
        this.one_result_data = JSON.parse(sessionStorage.getItem('userProfile'))
        EventBus.$on('getDocName',this.sendStep)
        EventBus.$on('toBackStep',this.backStep)
      } else {
        // this.getPublicData ()
        // this.isPublic = true
        // sessionStorage.setItem("public_eform",true)
      }
      if(sessionStorage.getItem('isOnlyForm') == 'true') {
        this.isOnlyForm = true
      }
      // this.changeColor()
      EventBus.$on('changeLang', this.changeLange)
      EventBus.$on('toRejectTemplate',this.summitReject)
      EventBus.$on('changeAttachFiles', this.changeUploadingFiles)
      EventBus.$on('transferenceDone', this.transferenceDone)
      EventBus.$on('removeAttachFiles', this.removeAttachFiles)
      this.changeLange()
    },
     watch: {
      sleep(val) {
        if (!val) return;
        setTimeout(() => ((this.sleep = false), this.setPosition(true)), 500);
      },
      checkContSleep(val) {
        if (!val) return;
        setTimeout(() => ((this.sleep = false), this.checkContTable()), 500)
      },
      datechange(val) {
        if(!this.datechange) {
          this.datechange = true
          this.change_calculate(this.dateChangeName,false)
        }
      },
      template_side() {
        if(this.template_side == "LANDSCAPE") {
          this.current_paper_width = this.paper_size[this.paperSizeIndex].height
          this.current_paper_height = this.paper_size[this.paperSizeIndex].width-50
        } else {
          this.current_paper_width = this.paper_size[this.paperSizeIndex].width
          this.current_paper_height = this.paper_size[this.paperSizeIndex].height
        }
      },
      paperSizeIndex() {
        if(this.template_side == 'PORTRAIT') {
          this.current_paper_width = this.paper_size[this.paperSizeIndex].width
          this.current_paper_height = this.paper_size[this.paperSizeIndex].height
        } else if (this.template_side == 'LANDSCAPE') {
          this.current_paper_width = this.paper_size[this.paperSizeIndex].height
          this.current_paper_height = this.paper_size[this.paperSizeIndex].width-50
        }
      },
      files(val) {
        // this.applyAttachFiles() 
      }
    },
    methods: {
      handler: function handler(e){ // methods
        (e || window.event).returnValue = 'Are you sure you want to close this page?'
        if(this.option.eform_id && !this.onSave && this.docReserved) {
          this.returnEform(this.option.eform_id)
        }
      },
      changeColor() {
        this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
        // this.color_dialog_header_bg = this.colorObject.modal.modal_main_color
        // $('.dialog_title').css('background-color', this.color_dialog_header_bg)
        this.color_loading_bar_bg = this.colorObject.toolbar.toolbar_bg_color1
        this.color_loading_bar = this.colorObject.main_color
        this.color_excel_file = this.colorObject.modal.modal_main_color
        this.color_import = this.colorObject.modal.modal_main_color
        this.color_document_number = this.colorObject.modal.modal_main_color
        this.color_img = this.colorObject.modal.modal_main_color
        this.color_message = this.colorObject.modal.modal_main_color
        this.color_icon_chevron_left = this.colorObject.main_color
        this.color_btn_background = this.colorObject.main_color
        this.color_datemenu = this.colorObject.main_color
        this.color_inputComment = this.colorObject.main_color
        this.color_icon_human_greeting = this.colorObject.main_color
        // this.color_loading = this.colorObject.main_color
        // $('.lds-roller div:after').css('background', this.color_loading)
        this.color_mini_page = this.colorObject.main_color
        this.color_box_shadow = this.colorObject.main_color
        this.color_savedraft = this.colorObject.toolbar.toolbar_bg_color1
      },
      changeLange(){
        if(sessionStorage.getItem('page_lang') == 'th') {
          var lang_th = require('@/components/lauguage/lang_th.json')
          this.textLang = lang_th.show_template.textLang
          this.typeDocImport[0].text = this.textLang.text_dialog.eform_type_import
          this.typeDocImport[1].text = this.textLang.text_dialog.cvm_type_import
          this.typeDocImport[2].text = this.textLang.text_dialog.so_type_import
          this.typeDocImport[3].text = this.textLang.text_dialog.cus_type_import
          this.typeDocImport[4].text = this.textLang.text_dialog.invoice_type_import
        } else if(sessionStorage.getItem('page_lang') == 'en') {
          var lang_en = require('@/components/lauguage/lang_en.json')
          this.textLang = lang_en.show_template.textLang
          this.typeDocImport[0].text = this.textLang.text_dialog.eform_type_import
          this.typeDocImport[1].text = this.textLang.text_dialog.cvm_type_import
          this.typeDocImport[2].text = this.textLang.text_dialog.so_type_import
          this.typeDocImport[3].text = this.textLang.text_dialog.cus_type_import
          this.typeDocImport[4].text = this.textLang.text_dialog.invoice_type_import
        }
      },
      switchView() {
        if(this.isPaperview) {
          this.isPaperview = false
          this.setObjectArray()
        } else {
          this.isPaperview = true
        }
      },
      zoomIn() {
        if(this.zoom_level < 200) {
          this.zoom_level += 10
        }
        $('#workpaper').css('zoom',String(this.zoom_level)+'%');
      },
      zoomOut() {
        if(this.zoom_level > 10) {
          this.zoom_level -= 10
        }
        $('#workpaper').css('zoom',String(this.zoom_level)+'%');
      },
      backToUseTemp() {
        this.clear()
        this.$router.push({ 'path': '/form'})
      },
      openRefDoc() {
        var refDoc = this.refDataDoc
        if(this.refDataDoc.length && typeof this.refDataDoc[0].ref_code !== 'undefined') {
          refDoc = []
          this.refDataDoc.forEach(e => {
            refDoc.push(e.ref_code)
          })
        }
        EventBus.$emit("openReferenceDocument", refDoc)
      },
      openAttachFile() {
        var folderAttach = []
        if(typeof this.attachedFiles !== 'undefined') {
          folderAttach = this.attachedFiles
        }
        EventBus.$emit('openAttachFile', folderAttach)
      },
      openExportReport() {
        var option = this.option
        EventBus.$emit('exportReport',option)
      },
      openExportMyForm() {
        var tempCode = this.option.template_id
        EventBus.$emit('ExportMyForm',tempCode)
      },
      openPermissionTransference() {
        var eformId = this.option.eform_id
        EventBus.$emit('PermissionTransference', eformId)
      },
      transferenceDone() {
        this.$router.push({ 'path': '/form'})
      },
      calStartRatioPage() {
        if(screen.width <= 960) { //mobile screen
          this.col_page = 0
          this.col_comment = 0
          this.col_comment_sm = 0
          this.show_comment = false
          this.show_page_select = false
          this.col_paper = 12
        } else { //pc screen
          if(this.commentAble == true) { //has comment
            this.col_page = 2
            this.col_comment = 3
            this.col_comment_sm = 0
            this.show_comment = true
            this.show_page_select = true
            this.col_paper = 7
          } else { //no comment
            this.col_page = 2
            this.col_comment = 0
            this.col_comment_sm = 0
            this.show_comment = false
            this.show_page_select = true
            this.col_paper = 10
          }
        }
      },
      togglePageSelect() {
        if(this.show_page_select == true) { //to close page select
          this.show_page_select = false
          this.col_page = 0
          this.col_paper = 12 - (this.col_page + this.col_comment)
        } else { //to open page select
          this.show_page_select = true
          this.col_page = 2
          this.col_paper = 12 - (this.col_page + this.col_comment)
        }
      },
      toggleComment() {
        if(screen.width <= 960) { //mobile screen
          if(this.commentAble == true) { //has comment
            if(this.show_comment == false) { //to open comment in mobile
              this.col_comment_sm = 11
              this.show_comment = true
            } else { //to close comment in mobile
              this.col_comment_sm = 0
              this.show_comment = false
            }
          }
        } else { //pc screen
          if(this.commentAble == true) { //has comment
            if(this.show_comment == false) { //to open comment in pc
              this.col_comment = 3
              this.col_paper = 12 - (this.col_page + this.col_comment)
              this.show_comment = true
            } else { //to close comment in pc
              this.col_comment = 0
              this.col_paper = 12 - (this.col_page + this.col_comment)
              this.show_comment = false
            }
          }
        }
      },
      toggleHidePage(index) {
        var item = this.pages.find(x => x.index == index)
        if(item) {
          var pIndex = this.pages.indexOf(item)
          if(this.pages[pIndex].isHide) {
            this.pages[pIndex].isHide = false
          } else {
            this.pages[pIndex].isHide = true
          }
        }
      },
      moveToPage(pnum){
        try {
        if(pnum != 0 && pnum <= this.pages.length) {
          this.template_side = this.pages[pnum - 1].template_side
          var exPage = this.currentPage
          $('#mini-page' + exPage).css("outline-color", "")
          $('#mini-page' + exPage).css("outline-style", "")
          this.currentPage = pnum
          $('#mini-page' + this.currentPage).css("outline-color", '#4CAF50')
          $('#mini-page' + this.currentPage).css("outline-style", "solid")
          this.objectType.forEach(e => {
            this.objectArray[e].forEach( e2 => {
              if(e2.page == this.currentPage && e2.page != 0) {
                e2.show = true
                $('#' + e2.name).css("z-index", e2.style.zIndex)
                if(e == 'textareabox' || e == 'texteditorbox' || e == 'inputbox' || e == 'datepickerbox'
                || e == 'timebox' || e == 'dropdownbox' || (e == 'inputimagebox' && !e2.value)) {
                  if(e2.textHl) {
                    e2.style.boxShadow = "1px 1px 1px 1px #4CAF50"
                    $('#' + e2.name + '-input').css("box-shadow", "1px 1px 1px 1px #4CAF50")
                  }              
                } else if(e == 'checkbox' ) {
                  if(e2.textHl) {
                    e2.style.boxShadow = "1px 1px 1px 1px #4CAF50"
                    $('#' + e2.name + '-input').css("box-shadow", "1px 1px 1px 1px #4CAF50")
                  }
                }
              } else {
                $('#' + e2.name).css("z-index", 1)
                if(e2.textHl) {
                  e2.style.boxShadow = "0"
                  $('#' + e2.name + '-input').css("box-shadow", "0")
                }
                e2.show =false
              }
            })
          })
          if(Object.keys(this.dataTableObjectArray).length) {
            Object.keys(this.dataTableObjectArray).forEach(k => {
              if(this.dataTableObjectArray[k].textHl && this.dataTableObjectArray[k].page == this.currentPage) {
                this.dataTableObjectArray[k].style.boxShadow =  "1px 1px 1px 1px #4CAF50"
              } else {
                this.dataTableObjectArray[k].style.boxShadow =  "0"
              }
            })
          }
        }
        } catch(e) {
          console.log(e)
        }
      },
      getData() {
        if(sessionStorage.getItem('isDocEdit') == 'true') {
          this.option = JSON.parse(sessionStorage.getItem('option'))
          this.getTemplateValue(this.option.transaction_id)
          // if(sessionStorage.getItem('onView') == 'true') {
          //   this.returnEform(this.option.eform_id).then(res => {
          //     this.getTemplateValue(this.option.eform_id)
          //   })
          // } else {
          //   this.getTemplateValue(this.option.eform_id)
          // }
        } else {
          this.option = JSON.parse(sessionStorage.getItem('option'))
          if(this.option.isCopy) {
            this.getTemplate(this.option.template_id, this.option.transaction_id)
            this.isSendStep = sessionStorage.getItem('isStep') == 'true'
          } else if(this.option.isImport) {
            this.getTemplate(this.option.template_id, true)
            this.isSendStep = sessionStorage.getItem('isStep') == 'true'
          } else {
            this.getTemplate(this.option.template_id)
            this.isSendStep = sessionStorage.getItem('isStep') == 'true'
          }
        }
      },
      async reserveEform(eform_id) {
        if(eform_id) {
          try {
            var { data } = await this.axios.post(this.$eform_api + '/permission_view_eform',
            {
                e_id: eform_id,
                status:"view",
                detail: {
                  email: sessionStorage.getItem('onemail'),
                  time: new Date().toISOString()
                }
            })
            sessionStorage.setItem('onView',true)
            this.docReserved = true
          }
          catch(e) {
            console.log(e)
          }
        }
      },
      async returnEform(eform_id) {
        // if(eform_id) {
        //   try {
        //     var { data } = await this.axios.post(this.$eform_api + '/permission_view_eform',
        //     {
        //         e_id: eform_id,
        //         status:"close"
        //     })
        //     sessionStorage.setItem('onView',false)
        //   }
        //   catch(e) {
        //     console.log(e)
        //   }
        // }
        return true
      },
      getPublicData() {
        // this.getPublicTemplate(sessionStorage.getItem("temp_code"))
      },
      async getTemplate(template_id) {
        var template = {}
        try {
          var { data } = await this.axios.get(this.$api_url + '/template_form/api/v1/getTemplateFormById?template_id=' + template_id)
          this.notReady = false
          if(data.status) {
            template = data.data
            this.template_option = template
            this.template_name = template.template_name
            var pageLength = template.orientation.length
            if(this.isOnlyForm) {
              template.role_id.forEach(r => {
                if(r == sessionStorage.getItem('selected_role')) {
                  this.isReport = true
                }
              })
              template.email_report.forEach(em => {
                if((JSON.parse(sessionStorage.getItem("userprofile")))) {
                  if(em == JSON.parse(sessionStorage.getItem("userprofile")).email) {
                    this.isReport = true
                  }
                }
              })
            }

            for(var i=0; i<pageLength; i++) {
              this.pages.push({
                index: i+1,
                template_side: "PORTRAIT",
                isHide:false
              })
            }

            for(var i=0; i<pageLength; i++) {
              var Okey = Object.keys(template.orientation[i])[0]
              if(template.orientation[i][Okey]) {
                this.pages[Number(Okey)-1].template_side = template.orientation[i][Okey].toUpperCase()
              }
            }

            for(var i=0; i<pageLength; i++) {
              var Okey = i+1
              if(template.url_image[Okey]) {
                this.pages[Number(Okey)-1].url_image = template.url_image[Okey]
              } else {
                this.pages[Number(Okey)-1].url_image = "https://www.img.in.th/images/83ca9b38ee2d7d129f1826f75ea05e4f.png"
              }
            }
            this.template_side = this.pages[0].template_side
    
            if(this.template_side == "LANDSCAPE") {
              this.current_paper_width = this.paper_size[this.paperSizeIndex].height
              this.current_paper_height = this.paper_size[this.paperSizeIndex].width-50
            }
            if(this.template_option.paper_size) {
              this.paperSizeIndex = this.paper_size.find(item => item.text.toUpperCase() == this.template_option.paper_size.toUpperCase()).value
            } 

            // var spForm = this.$speacailForm
            //Check For biz
            // if(!this.option.isCopy && !spForm.includes(template_id)) {
            //   var no_biz = false
            //   var doc_no_biz = false

            //   if(!JSON.parse(sessionStorage.getItem('selected_business')).id) {
            //     no_biz = true
            //   }
            //   if(!this.template_option.permission_template) {
            //     doc_no_biz = true
            //   }
            //   if(!(no_biz && doc_no_biz)) {
            //     if(no_biz != doc_no_biz) {
            //       this.changeBiz(this.template_option.permission_template)
            //     }
            //     if(this.template_option.permission_template.id_card_num != JSON.parse(sessionStorage.getItem('selected_business')).id_card_num) {
            //       this.changeBiz(this.template_option.permission_template)
            //     }
            //   }
            // }
            var all_template = []
            template.template_data.forEach(e => {
              e.order = this.getObjectOrder(e)
              all_template.push(e)
            })
            all_template.sort((a, b) => (a.order > b.order) ? 1 : -1)
            this.getArrayValue(all_template, true, true)
            var temp_ppl_code = [{'name': 'default', 'code': ''}]
            if(template.template_paperless_code != null) {
              temp_ppl_code = template.template_paperless_code
            }
            sessionStorage.setItem('template_paperless_code',JSON.stringify(temp_ppl_code))
            sessionStorage.setItem('code_template',template.code_template)
            sessionStorage.setItem('version_template',template.version_template)
            var storeTemplate = {}
            Object.keys(this.template_option).forEach(tk => {
              if(tk != "template_body" && tk != "template_header" && tk != "template_footer") {
                storeTemplate[tk] = this.template_option[tk]
              } else {
                storeTemplate[tk] = {}
              }
            })
            sessionStorage.setItem('template_option',JSON.stringify(storeTemplate))
          } else if (!data.status) {
            this.$router.push({ 'path': '/form'})
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
              text: this.textLang.alert.fail_template,
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
        } catch (err) {
          this.notReady = false
          if (err.response != null) {
            if (err.response.status == 401) {
              this.$router.push('/notfound')
            }
          } else {
            console.log(err.message)
          }
        }
      },
      async getPublicTemplate(template_id) {
        // var template = {}
        // try {
        //   var { data } = await this.axios.get(this.$eform_api + '/template_guest?template=' + template_id)
        //   this.notReady = false
        //   if(data.result == 'OK') {
        //     template = data.data
        //     this.template_option = template
        //     this.template_name = template.template_name
        //     var pageLength = template.orientation.length
        //     for(var i=0; i<pageLength; i++) {
        //       this.pages.push({
        //         index: i+1,
        //         template_side: "PORTRAIT",
        //         isHide:false
        //       })
        //     }

        //     for(var i=0; i<pageLength; i++) {
        //       var Okey = Object.keys(template.orientation[i])[0]
        //       if(template.orientation[i][Okey]) {
        //         this.pages[Number(Okey)-1].template_side = template.orientation[i][Okey].toUpperCase()
        //       }
        //     }

        //     for(var i=0; i<pageLength; i++) {
        //       var Okey = i+1
        //       if(template.url_image[Okey]) {
        //         this.pages[Number(Okey)-1].url_image = template.url_image[Okey]
        //       } else {
        //         this.pages[Number(Okey)-1].url_image = "https://www.img.in.th/images/83ca9b38ee2d7d129f1826f75ea05e4f.png"
        //       }
        //     }
        
        //     this.template_side = this.pages[0].template_side
    
        //     if(this.template_side == "LANDSCAPE") {
        //       this.current_paper_width = this.paper_size[this.paperSizeIndex].height
        //       this.current_paper_height = this.paper_size[this.paperSizeIndex].width-50
        //     }
        //     if(this.template_option.paper_size) {
        //       this.paperSizeIndex = this.paper_size.find(item => item.text.toUpperCase() == this.template_option.paper_size.toUpperCase()).value
        //     }
        //     var no_biz = false
        
        //     this.comments = this.template_option.comment
        //     var all_template = []
        //     for(var i=0; i<template.template_header.length; i++) {
        //       var THkey = Object.keys(template.template_header[i])[0]
        //       template.template_header[i][THkey].forEach( e => {
        //         e.order = this.getObjectOrder(e)
        //         all_template.push(e)
        //       })
        //       template.template_header[i][THkey]
        //       var TBkey = Object.keys(template.template_body[i])[0]
        //       template.template_body[i][TBkey].forEach( e => {
        //         e.order = this.getObjectOrder(e)
        //         all_template.push(e)
        //       })
        //       var TFkey = Object.keys(template.template_footer[i])[0]
        //       template.template_footer[i][TFkey] .forEach( e => {
        //         e.order = this.getObjectOrder(e)
        //         all_template.push(e)
        //       })     
        //     }

        //     for(var i=0; i<pageLength; i++) {
        //       var Okey = i+1
        //       if(template.url_image[Okey]) {
        //         this.pages[Number(Okey)-1].url_image = template.url_image[Okey]
        //       } else {
        //         this.pages[Number(Okey)-1].url_image = "https://www.img.in.th/images/83ca9b38ee2d7d129f1826f75ea05e4f.png"
        //       }
        //     }
          
        //     all_template.sort((a, b) => (a.order > b.order) ? 1 : -1)
        //     this.getPublicArray(all_template)

        //     sessionStorage.setItem('code_template',template.code_template)
        //     sessionStorage.setItem('version_template',template.version_template)
        //   }
        // } catch (err) {
        //   this.notReady = false
        //   if (err.response != null) {
        //     if (err.response.status == 401) {
        //       this.$router.push('/notfound')
        //     }
        //   } else {
        //     console.log(err.message)
        //   }
        // }
      },
      async getTemplateValue(transaction_id) {
        var template = {}
        try {
          var { data } = await this.axios.get(this.$api_url + '/template_form/api/v1/get_eform?transaction_id=' + transaction_id)
          this.notReady = false
          if(data.status) {
            template = data.data[0]
            this.template_option = template
            this.doc_name = this.template_option.transaction_detail.object_text.subject
            let tempStep = template.transaction_detail.flow_data.find(item => item.status == "W")
            if(tempStep) {
              this.currentStep = tempStep.index + 1
            }
            this.isOwner = template.account_id == JSON.parse(sessionStorage.getItem("userProfile")).id
            if(sessionStorage.getItem('copyDoc') == 'true') {
              this.template_option.document_name = ""
            }

            var pageLength = template.orientation.length
            for(var i=0; i<pageLength; i++) {
              this.pages.push({
                index: i+1,
                template_side: "PORTRAIT",
                isHide:false
              })
            }

            for(var i=0; i<pageLength; i++) {
              var Okey = Object.keys(template.orientation[i])[0]
              if(template.orientation[i][Okey]) {
                this.pages[Number(Okey)-1].template_side = template.orientation[i][Okey].toUpperCase()
              }
            }

            for(var i=0; i<pageLength; i++) {
              var Okey = i+1
              if(template.url_image[Okey]) {
                this.pages[Number(Okey)-1].url_image = template.url_image[Okey]
              } else {
                this.pages[Number(Okey)-1].url_image = "https://www.img.in.th/images/83ca9b38ee2d7d129f1826f75ea05e4f.png"
              }
            }
            this.template_side = this.pages[0].template_side
    
            if(this.template_side == "LANDSCAPE") {
              this.current_paper_width = this.paper_size[this.paperSizeIndex].height
              this.current_paper_height = this.paper_size[this.paperSizeIndex].width-50
            }
            if(this.template_option.paper_size) {
              this.paperSizeIndex = this.paper_size.find(item => item.text.toUpperCase() == this.template_option.paper_size.toUpperCase()).value
            } 
            
            this.signing = this.template_option.signing
            this.attachedFiles = await this.getAttachfile(this.template_option )
            if(this.template_option.comments.length) {
              this.template_option.comments[0].comments.forEach(e => {
                var cm_date = new Date(e.comment_at)
                var string_date = String(cm_date.getDate()) + "-" + String(cm_date.getMonth() +1) + "-" + String(cm_date.getFullYear())
                  + " " + String(cm_date.getHours()) + ":" + String(cm_date.getMinutes())
                this.comments.push({
                  index: this.comments.length+1,
                  sender: e.comment_by.name_th,
                  message: e.message,
                  date: string_date
                })
                if(this.comments) {
                  this.comments.reverse()
                }
              })
            }
            

            var all_template = []
            template.template_data.forEach(e => {
              e.order = this.getObjectOrder(e)
              all_template.push(e)
            })

            all_template.sort((a, b) => (a.order > b.order) ? 1 : -1)
            this.commentAble = true
            // if(sessionStorage.getItem('isDocStep') == 'true') {
            //   var flows = []
            //   if(this.template_option.status_flow_permission) {
            //     flows = this.template_option.flow_permission
            //     this.commentAble = true
            //   }
            //   if(flows.length) {
            //     this.isSelf = false
            //   }
            //   this.backStepArray = []
            //   flows.forEach(e => {
            //     if(e.status == "Incomplete") {
            //       this.currentStep = e.step_num
            //       if(e.step_num == 1) {
            //         this.isSendFirst = false
            //       } else if(e.step_num == flows.length && !this.template_option.signing) {
            //         e.role.forEach(r => {
            //           if(r.name == sessionStorage.getItem('selected_role') || r.name == "all-user") {
            //             this.isComplete = true
            //             this.isSendBack = true
            //             this.isEdit = false
            //             sessionStorage.setItem('editStep',false)
            //           }
            //         })
            //         e.email.forEach(em => {
            //           if(JSON.parse(sessionStorage.getItem("one_email_list")).includes(em)) {
            //             this.isComplete = true
            //             this.isSendBack = true
            //             this.isEdit = false
            //             sessionStorage.setItem('editStep',false)
            //           }
            //         })
            //       }
            //       this.current_flow = e
            //       e.role.forEach(r => {
            //         if(r.name == sessionStorage.getItem('selected_role') || r.name == "all-user") {
            //           this.isSelf = true
            //           this.isSendBack = true
            //         }
            //       })
            //       e.email.forEach(em => {
            //         if(JSON.parse(sessionStorage.getItem("one_email_list")).includes(em)) {
            //           this.isSelf = true
            //           this.isSendBack = true
            //           this.isEmailStep = true
            //         }
            //       })
            //     } else if (e.status == "Complete") {
            //       var step_name = ""
            //       if(e.email.length > 0) {
            //         step_name = e.email[0]
            //       } else {
            //         step_name = e.role[0].name
            //       }
            //       if(e.step_num == 1 && this.template_option.e_template_code == "e47aa8d3-5852-47eb-97db-656d532abd83" && e.role[0].object_name == '') {
            //         e.role[0].object_name = 'sectionbox0'
            //       }
            //       this.backStepArray.push({text: this.textLang.tabMenubar.step + e.step_num + ":" + step_name, value: {name: e.role[0].object_name, step: e.step_num} })
            //     }
            //   })
            // }
            
            // if(this.current_flow) {
            //   this.current_flow.blind  =[]
            //   if(this.current_flow.step_num != flows.length) {
            //     flows.forEach(e => {
            //       if(typeof e.observe.observe !== 'undefined' &&e.observe.observe.includes(e.step_num)) {
            //         e.observe.observe.push(Number(e.step_num) + 1)
            //       }
            //       if(e.step_num != this.current_flow.step_num) {
            //         if(typeof e.observe.choicesSet !== 'undefined' && e.observe.choicesSet) {
            //           if(!e.observe.observe.includes(this.current_flow.step_num) && !e.observe.observe.includes(e.step_num)) {
            //             this.current_flow.blind.push(e.role[0].object_name)
            //           }
            //         }
            //       }
            //     })
            //   }
            //   if(this.isSelf) {
            //     this.reserveEform(eform_id)
            //   }
            // }
            // var temp_template = await this.checkTemplateExtent(all_template)
            // if(temp_template.length) {
            //   this.getArrayValue(temp_template, true)
            // }
            if(template.others) {
              this.dataTableObjectArray = template.others.dataTableObjectArray
            }
            this.getArrayValue(all_template)
            this.template_name = template.document_id
            this.option.template_id = template.template_id
            sessionStorage.setItem('code_template',template.document_id)
            // sessionStorage.setItem('version_template',template.version_template)
            // sessionStorage.setItem('Folder_Attachment_Name',JSON.stringify(this.attachedFiles))
            // if(template.Folder_Attachment_Name.length) {
            //   sessionStorage.setItem('folder_name',JSON.stringify(template.folder_name))
            //   if (sessionStorage.getItem("folder_name") != "undefined") {
            //     this.uploadFolder = JSON.parse(sessionStorage.getItem("folder_name"))[0]
            //   }
            // }
          } else if(data.result == 'ER') {
            if(data.messageER == 'RESERVED') {
              this.$router.push('/form')
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
                text: this.textLang.alert.eform_use + data.detail.email,
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
        } catch (error) {
          console.log(error.message)
        }
      },
      async readTemplateData(token) {
        try {
          var { data } = await this.axios.post(this.$eform_node_api + '/read_data',{
            token: token
          })
          if(data.result == 'OK') {
            var dataObj = data.messageText
            if(dataObj) {
              var templateList = []
              Object.keys(dataObj).forEach(e => {
                var jk = e
                templateList.push({
                  json_key: jk,
                  value: dataObj[e]
                })
              })
              this.objectTypeInput.forEach(t => {
                this.objectArray[t].forEach(e => {
                  if(typeof e.value !== 'undefined' && e.value && e.value.show == 'ref_no' && !this.option.isCopy) {
                    e.value.show_index = this.refDocNo
                    e.value.isValued = true
                    e.value.isUser = true
                  } else {
                    var obj = templateList.find(item => item.json_key== e.style.json_key)
                    if(obj && !e.style.noInputRef && t != 'autofillbox') {
                      if(e.object_type == 'datepickerbox' && obj.value.includes("/")) {
                        obj.value = this.thaiDateToDate(obj.value)
                      }
                      e.value = obj.value
                    }
                  }
                })
              })

              Object.keys(this.dataTableObjectArray).forEach(e => {
                var obj = templateList.find(item => item.json_key == this.dataTableObjectArray[e].style.json_key)
                if(obj && ! this.dataTableObjectArray[e].style.noInputRef) {
                  if(this.dataTableObjectArray[e].object_type == 'datepickerbox' && obj.value.includes("/")) {
                    obj.value = this.thaiDateToDate(obj.value)
                  }
                  this.dataTableObjectArray[e].value = obj.value
                  this.dataTableObjectArray[e].show_value = obj.value
                }
              })

              this.getDataTableList(false)
              if(Object.keys(this.dataTableObjectArray).length) {
                Object.keys(this.dataTableObjectArray).forEach(e => {
                  var calType = ['datepickerbox', 'inputbox', 'timebox', 'linkdatabox', 'dropdownbox']
                  if(calType.includes(this.dataTableObjectArray[e].object_type)) {
                    this.change_calculate(e,false)
                  }
                })
              }
            }
          }
        } catch(e) {
          console.log(e)
        }
      },
      checkImportType(doc_no, isImportInRow, selectedRow) {
        if(this.importType == 'eform') {
          this.getTemplateRefdoc(doc_no)
        } else {
          console.log(doc_no)
          this.getOtherService(doc_no, this.importType, isImportInRow, selectedRow)
        }
      },
      thaiDateToDate(thaiDate) {
        var dateString = thaiDate
        var dateMm = moment(dateString,"DD/MM/YYYY")
        var holdDate = new Date(dateMm.toDate())
        holdDate.setHours(7)
        if(holdDate.getFullYear() > 2500) {
          holdDate.setFullYear(holdDate.getFullYear() - 543)
        }
        return holdDate.toISOString().substr(0, 10)
      },
      async getTemplateRefdoc(doc_no, transaction_id) {
        var template = []
        var template_id = ""
        try {
          this.onImport = true
          var url = `${this.$api_url}/template_form/api/v1/get_eform_ref?document_id=${doc_no}&tax_id=${this.template_option.tax_id}`
          if(transaction_id) {
            url = `${this.$api_url}/template_form/api/v1/get_eform_ref?transaction_id=${transaction_id}`
          }
          var { data } = await this.axios.get(url)
          this.notReady = false
          this.dialogRefDoc = false
          template_id = data.data.template_id
          if(data.status) {
            if(!this.option.isCopy) {
              var tempRefDoc = []
              if(this.refDataDoc.length && typeof this.refDataDoc[0].ref_no === 'undefined') {
                tempRefDoc = this.refDataDoc
              } else {
                this.refDataDoc.sort((a, b) => (a.ref_no > b.ref_no) ? 1 : -1)
                this.refDataDoc.forEach(e => {
                  tempRefDoc.push(e.ref_code)
                })
              }

              if(data.data.ref_document_number) {
                data.data.ref_document_number.forEach(e => {
                  if(!tempRefDoc.includes(e)) {
                    if(typeof e.ref_no === 'undefined') {
                      tempRefDoc.push(e)
                    } else {
                      tempRefDoc.push(e.ref_code)
                    }
                  }
                })
              }
              if(tempRefDoc.includes(doc_no)) {
                var indx = tempRefDoc.indexOf(doc_no)
                tempRefDoc.splice(indx, 1)
                tempRefDoc.push(doc_no)
              } else {
                tempRefDoc.push(doc_no)
              }
              if(tempRefDoc.length) {
                this.refDataDoc = []
                for(let i=0; i<tempRefDoc.length; i++) {
                  this.refDataDoc.push({
                    ref_no: i+1,
                    ref_code: tempRefDoc[i]
                  })
                }
              }
            }
            template = data.data.template_data
            this.objectTypeInput.forEach(t => {
              this.objectArray[t].forEach(e => {
                if(typeof e.value !== 'undefined' && e.value && e.value.show == 'ref_data') {
                  var obj = template.find(item => item.object_name == e.style.refValue)
                  if(obj && obj.value) {
                    e.value.show_index = obj.value
                    e.value.isValued = true
                  }
                } else if(typeof e.value !== 'undefined' && e.value && e.value.show == 'ref_no' && !this.option.isCopy) {
                  e.value.show_index = this.refDocNo
                  e.value.isValued = true
                  e.value.isUser = true
                } else {
                  var obj = template.find(item => item.object_name == e.object_name)
                  if(obj && !e.style.noInputRef && t != 'autofillbox' && t != 'number2textbox') {
                    if(e.object_type == 'datepickerbox' && obj.value.includes("/")) {
                      obj.value = this.thaiDateToDate(obj.value)
                    }
                    if(e.object_type != obj.object_type) {
                      if(obj.object_type == 'autofillbox') {
                        obj.value.isUser? e.value = obj.value.show_index: e.value = obj.value.show_value
                      } else {
                        e.value = obj.value
                        if(t == 'dropdownbox') {
                          this.changeDropDownChoice(e)
                          // e.choices = obj.choices
                        }
                      }
                    } else {
                      e.value = obj.value
                      if(t == 'dropdownbox') {
                        this.changeDropDownChoice(e)
                        // e.choices = obj.choices
                      }
                    }
                  }
                }
              })
            })

            this.objectArray['datatable'].forEach(e => {
              var obj = template.find(item => item.object_name == e.object_name)
                if(obj && !e.style.noInputRef) {
                  var obj1Row = Number(e.style.table.crow)
                  var obj2Row = Number(obj.style.table.crow)
                  if(obj1Row < obj2Row) {
                    for(let i=0; i< obj2Row-obj1Row; i++) {
                      this.addTableRow(e.object_name ,true)
                    }
                  }
                }
            })
            this.checkContSleep = true
            var obj = {}
            if(data.data.others && data.data.others.dataTableObjectArray) {
              obj = {
                value: data.data.others.dataTableObjectArray
              }
            }
            if(obj && obj.value) {
              if(typeof obj.value !== 'undefined') {
                Object.keys(obj.value).forEach(e => {
                  if(typeof this.dataTableObjectArray[e] !== 'undefined' && (this.objectTypeInput.includes(this.dataTableObjectArray[e].object_type) || this.dataTableObjectArray[e].object_type == 'linkdatabox') ) {
                    if(this.dataTableObjectArray[e].object_type == obj.value[e].object_type) {
                      this.dataTableObjectArray[e].show_value = obj.value[e].show_value
                      this.dataTableObjectArray[e].value = obj.value[e].value
                      this.dataTableObjectArray[e].valueList = obj.value[e].valueList
                      this.dataTableObjectArray[e].textHl = obj.value[e].textHl
                      // Object.keys(this.dataTableObjectArray[e].style).forEach(s => {
                      //   if(s != 'permission' && s != 'permission_section') {
                      //     this.dataTableObjectArray[e].style[s] = obj.value[e].style[s]
                      //   }
                      // })
                    }
                  }
                })
                this.getDataTableList(false)
                if(Object.keys(this.dataTableObjectArray).length) {
                  Object.keys(this.dataTableObjectArray).forEach(e => {
                    var calType = ['datepickerbox', 'inputbox', 'timebox', 'linkdatabox', 'dropdownbox']
                    if(calType.includes(this.dataTableObjectArray[e].object_type)) {
                      this.change_calculate(e,false)
                    }
                  })
                }
              }
            }
            this.objectArray['calculatebox'].forEach(e => {
              this.change_calculate(e.object_name,true)
            })
            if(this.option.isCopy) {
              this.option.isCopy = false
            }
            this.onImport = false
          }
        } catch (error) {
          console.log(error.message)
        }
        return template_id
      },
      async getOtherService(doc_no,serviceName, isImportInRow, selectedRow) {
        var path = ""
        if(serviceName == 'cvm') {
          path = this.$eform_api + "/data_from_cvm?cvm_id=" + doc_no
        } else if(serviceName == 'so') {
          path = this.$eform_node_api + "/data_from_erp?so_number=" + doc_no
        } else if(serviceName == 'invoice') {
          path = this.$eform_node_api + "/data_bank_statement?invoice=" + doc_no
        }
        var template = []
        if(doc_no) {
          try {
            if(path) {
              this.notReady = true
              var { data } = await this.axios.get(path)
              this.notReady = false
              this.dialogRefDoc = false
              if(data.result == 'OK') {
                var tempRefDoc = []
                if(this.refDataDoc.length && typeof this.refDataDoc[0].ref_no === 'undefined') {
                  tempRefDoc = this.refDataDoc
                } else {
                  this.refDataDoc.sort((a, b) => (a.ref_no > b.ref_no) ? 1 : -1)
                  this.refDataDoc.forEach(e => {
                    tempRefDoc.push(e.ref_code)
                  })
                }
                var dataObj = data.messageText
                if(dataObj) {
                  if(tempRefDoc.includes(doc_no)) {
                    var indx = tempRefDoc.indexOf(doc_no)
                    tempRefDoc.splice(indx, 1)
                    tempRefDoc.push(doc_no)
                  } else {
                    tempRefDoc.push(doc_no)
                  }
                  if(tempRefDoc.length) {
                    this.refDataDoc = []
                    for(let i=0; i<tempRefDoc.length; i++) {
                      this.refDataDoc.push({
                        ref_no: i+1,
                        ref_code: tempRefDoc[i]
                      })
                    }
                  }
                  Object.keys(dataObj).forEach(e => {
                    var jk = ""
                    if(isImportInRow && selectedRow) {
                      jk = `${e}_${String(selectedRow)}`
                    } else {
                      jk = e
                    }
                    template.push({
                      json_key: jk,
                      value: dataObj[e]
                    })
                  })
                  this.objectTypeInput.forEach(t => {
                    this.objectArray[t].forEach(e => {
                      if(typeof e.value !== 'undefined' && e.value && e.value.show == 'ref_no' && !this.option.isCopy) {
                        e.value.show_index = this.refDocNo
                        e.value.isValued = true
                        e.value.isUser = true
                      } else {
                        var obj = template.find(item => item.json_key== e.style.json_key)
                        if(obj && !e.style.noInputRef && t != 'autofillbox') {
                          if(e.object_type == 'datepickerbox' && obj.value.includes("/")) {
                            obj.value = this.thaiDateToDate(obj.value)
                          }
                          e.value = obj.value
                        }
                      }
                    })
                  })

                  Object.keys(this.dataTableObjectArray).forEach(e => {
                    var obj = template.find(item => item.json_key == this.dataTableObjectArray[e].style.json_key)
                    if(obj && ! this.dataTableObjectArray[e].style.noInputRef) {
                      if(this.dataTableObjectArray[e].object_type == 'datepickerbox' && obj.value.includes("/")) {
                        obj.value = this.thaiDateToDate(obj.value)
                      }
                      this.dataTableObjectArray[e].value = obj.value
                      this.dataTableObjectArray[e].show_value = obj.value
                    }
                  })

                  this.getDataTableList(false)
                  if(Object.keys(this.dataTableObjectArray).length) {
                    Object.keys(this.dataTableObjectArray).forEach(e => {
                      var calType = ['datepickerbox', 'inputbox', 'timebox', 'linkdatabox', 'dropdownbox']
                      if(calType.includes(this.dataTableObjectArray[e].object_type)) {
                        this.change_calculate(e,false)
                      }
                    })
                  }
                }
              }
            }
          } catch (error) {
            this.notReady = false
            console.log(error.message)
          }
        }
        
      },
      async getTemplateExtent(eform_id) {
        try {
          var { data } = await this.axios.get(this.$eform_api + '/template_for_revert?eform_id=' + eform_id)
          this.ext_template = data.data
        } catch (error) {
          console.log(error.message)
          this.ext_template = {}
        }
      },
      async checkTemplateExtent(all_template) {
        var temp_template = []
        if(typeof this.ext_template !== 'undefined') {
          var pageLength =this.ext_template.template_header.length
          for(var i=0; i<pageLength; i++) {
            var THkey = Object.keys(this.ext_template.template_header[i])[0]
            this.ext_template.template_header[i][THkey].forEach( e => {
              e.order = this.getObjectOrder(e)
              if(!(all_template.some(item => item.object_name == e.object_name))) {
                if(!e.object_name.startsWith('datatable')) {
                  e.name_input = e.name_input + "_extend"
                  temp_template.push(e)
                }
              }
            })
            this.ext_template.template_header[i][THkey]
            var TBkey = Object.keys(this.ext_template.template_body[i])[0]
            this.ext_template.template_body[i][TBkey].forEach( e => {
              e.order = this.getObjectOrder(e)
              if(!(all_template.some(item => item.object_name == e.object_name))) {
                if(!e.object_name.startsWith('datatable')) {
                  e.name_input = e.name_input + "_extend"
                  temp_template.push(e)
                }
              }
            })
            var TFkey = Object.keys(this.ext_template.template_footer[i])[0]
            this.ext_template.template_footer[i][TFkey] .forEach( e => {
              e.order = this.getObjectOrder(e)
              if(!(all_template.some(item => item.object_name == e.object_name))) {
                if(!e.object_name.startsWith('datatable')) {
                  e.name_input = e.name_input + "_extend"
                  temp_template.push(e)
                }
              }
            })
          }
        }
        return temp_template
      },
      getObjectOrder(obj) {
        var order = 5
        if(obj.object_type == "textfield" || obj.object_type == "textareabox" || obj.object_type == "texteditorbox"  || obj.object_type == "dropdownbox" || obj.object_type == "inputimagebox" 
        || obj.object_type == "datepickerbox" || obj.object_type == "timebox" || obj.object_type == "checkbox" || obj.object_type == "inputbox" ) {
          order =  1 
        } else if(obj.object_type == "autofillbox") {
          order = 2
        } else if(obj.object_type == "calculatebox") {
          order = 3
        } else if(obj.object_type == "number2textbox") {
          order = 4
        }

        return order
      },
      changeBiz(permissonTemplate) {
        EventBus.$emit('toolbarChangeBiz',permissonTemplate)
      },
      async getBackValue() {
         if(typeof sessionStorage.getItem('template_array') === 'undefined' || (sessionStorage.getItem('template_array') == 'false')) {
          var objectTemp = await this.getTemplateTemp(JSON.parse(sessionStorage.getItem('template_array_code')))
          this.files = await this.getTempFiles()
          var value_array = objectTemp.template_array
          value_array.forEach(e => {
            if(e.object_type == 'inputbox' || e.object_type == 'textareabox'|| e.object_type == 'texteditorbox' || e.object_type == 'dropdownbox' || e.object_type == "inputimagebox"
            || e.object_type == 'datepickerbox' || e.object_type == 'checkbox' || e.object_type == 'timebox' || e.object_type == 'signbox' 
            || e.object_type == 'autofillbox' || e.object_type == 'calculatebox' || e.object_type == 'number2textbox') {
              if(e.value) {
                var selObj = this.objectArray[e.object_type].find(item => item.object_name == e.object_name)
                if(selObj) {
                  var selInx = this.objectArray[e.object_type].indexOf(selObj)
                  this.objectArray[e.object_type][selInx].value = e.value
                  this.objectArray[e.object_type][selInx].style = e.style
                  this.objectArray[e.object_type][selInx].page = e.page
                  if(e.object_type == "inputimagebox") {
                    this.objectArray[e.object_type][selInx].style.image_width = e.style.image_width
                    this.objectArray[e.object_type][selInx].style.image_height = e.style.image_height
                  }
                  if(e.object_type == 'dropdownbox' ) {
                    this.objectArray[e.object_type][selInx].choices = e.choices
                  } if(e.object_type == 'textareabox') {
                    if(e.style.extraAddAble && e.style.isAddedExtra) {
                      this.insertTextAreaPage(e ,false)
                    }
                  }
                }
              }
            } else{
              if(e.object_type == 'datatable') {
                var selObj = this.objectArray['datatable'].find(item => item.object_name == e.object_name)
                if(selObj) {
                  var selInx = this.objectArray['datatable'].indexOf(selObj)
                  this.objectArray['datatable'][selInx].style.valueList = this.getValueList(selObj.value)
                  if(selObj.page != this.currentPage) {
                    this.moveToPage(selObj.page)
                  }
                  if(Number(selObj.style.table.crow) < Number(e.style.table.crow)) {
                    var rowDif = Number(e.style.table.crow) - Number(selObj.style.table.crow)
                    for(let i=0; i< rowDif; i++) {
                      this.addTableRow(selObj.object_name, true)
                    }
                  }
                  this.objectArray['datatable'][selInx].page = e.page
                }
              }
            }
          })
          this.checkContSleep = true
          this.dataTableObjectArray = objectTemp.dataTableObjectArray
        }
        var pageTemp = JSON.parse(sessionStorage.getItem('pageTemp'))
        if(typeof pageTemp !== 'undefined') {
          for(let i=0; i<this.pages.length; i++) {
            if(typeof pageTemp[i] !== 'undefined' && typeof pageTemp[i].isHide !== 'undefined') {
              this.pages[i].isHide = pageTemp[i].isHide
            }
          }
        }
        this.uploadFolder = sessionStorage.getItem('uploadFolder')
        this.attachedFiles = JSON.parse(sessionStorage.getItem("Folder_Attachment_Name"))
        this.moveToPage(1)
      },
      async getTemplateTemp() {
        this.notReady = false
        return this.objectTemplate
      },
      async getTempFiles() {
        return this.uploadedFile
      },
      async getArray(temp_array) {
        temp_array.forEach(e => {
          if(typeof e.page === "undefined") {
            e.page = 1
          }
          if(typeof e.value == 'undefined') {
            e.value = ""
          }
          var cmp = {
              name: e.name_input,
              value: e.value,
              show_value: e.show_value,
              valueShow: e.valueShow,
              defaultValue: e.value,
              object_name: e.object_name,
              placeholder: e.placeholder,
              style: e.style,
              text: e.text,
              choices: e.choices,
              show: false,
              selected: false,
              top: e.position.top,
              defaultTop: e.defaultTop,
              defaultPage: e.page,
              left: e.position.left,
              width: e.position.width,
              height: e.position.height,
              section: e.section,
              object_type: e.object_type,
              disable: false,
              textHl: false,
              page: e.page
            }
            if(typeof cmp.valueShow === 'undefined') {
              cmp.valueShow = e.value
            }
            if(!e.defaultTop) {
              cmp.defaultTop = e.position.top
            }
            if(typeof e.style !== 'undefined') {
              if(e.style.showMobile) {
                this.isSimpleFill = true
              }
              if(!cmp.style.permission) {
                cmp.style.permission =  {byRole:true, value_role:'', value_email:''}
              }
              if(typeof cmp.style.suffix === 'undefined' || !cmp.style.suffix ) {
                cmp.style.suffix = ""
              }
              if(!cmp.style.isComma) {
                cmp.style.isComma =  false
              }
              if(!e.excel) {
                cmp.excel = ""
              }
              if(!e.style.decimal) {
                cmp.style.decimal = 0
              }
              if(!e.style.validate) {
                cmp.style.validate = {value:"", fx: ""}
              }
              if(!e.style.font_align) {
                cmp.style.font_align = "justify"
              }
              if(!e.style.addTable) {
                cmp.style.addTable = false
              }
              if(!e.style.isZero) {
                cmp.style.isZero = false
              }
              if(!e.style.isZero) {
                cmp.style.isZero = false
              }
              if(typeof e.style.textAreaValiable === 'undefined') {
                cmp.style.textAreaValiable =[]
              }
              if(typeof e.style.checkBoxGroup === 'undefined') {
                cmp.style.checkBoxGroup =[]
              }
              if(e.object_type != "dataTableObjectArray") {
                cmp.style = this.fixObjectStyle(cmp.style)
              }
            }
            
            if(e.object_type == "autofillbox" || e.object_type == "number2textbox" ) {
              cmp.value = this.initailDatabind(cmp)
              if(typeof cmp.value.show_index === 'undefined' || cmp.value.show_index == 'undefined') {
                if(cmp.value.isUser) {
                  cmp.value = ""
                  this.objectArray["inputbox"].push(cmp)
                  cmp.object_type = 'inputbox'
                  e.object_type = 'inputbox'
                } else {
                  this.objectArray[e.object_type].push(cmp)
                }
              } else {
                this.objectArray[e.object_type].push(cmp)
              }
            } else {
              if(e.object_type != "sectionbox" && e.object_type != "dataTableObjectArray") {
                 if(e.object_type == 'datatable' && !this.isSendStep) {
                  cmp.addAble = true
                }
                this.objectArray[e.object_type].push(cmp)
              } else if(e.object_type == "dataTableObjectArray") {
                this.dataTableObjectArray = e.value
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'cvm_id')) {
                  this.isCvmFetch = true
                }
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'so')) {
                  this.isSoFetch = true
                }
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'invoice')) {
                  this.isInvoiceFetch = true
                }
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'cus_id')) {
                  this.isCusFetch = true
                }
              }
            }
            if(e.object_type == "signbox" ) {
              if(!cmp.disable) {
                sessionStorage.setItem('signStep', true)
              }
            }
            if(e.object_type != "sectionbox" && e.object_type != "dataTableObjectArray") {
              this.dataDict[cmp.object_name] = {objectType: cmp.object_type, arrayIndex: this.objectArray[e.object_type].indexOf(cmp)}
            }
            if(e.object_type == 'dropdownbox' && e.style.autoChoices) {
              if(e.style.autoChoicesSelect == 'pro_th' || e.style.autoChoicesSelect == 'pro_en') {
                this.isProvinceFetch = true
              } else if (e.style.autoChoicesSelect == 'cvm_id') {
                this.isCvmFetch = true
              } else if (e.style.autoChoicesSelect == 'so') {
                this.isSoFetch = true
              }  else if (e.style.autoChoicesSelect == 'invoice') {
                this.isInvoiceFetch = true
              }  else if (e.style.autoChoicesSelect == 'cus_id') {
                this.isCusFetch = true
              }  
            }
            if(e.object_type == 'datepickerbox') {
              if(!e.style.noDefaultDate) {
                cmp.value = new Date().toISOString().substr(0, 10)
              }
              cmp.style.valueFilled = false
            }
          if(e.object_type != "dataTableObjectArray") {
            this.templateArray.push(cmp)
          }
        })
        if(!this.isSendStep) {
          this.objectArray["autofillbox"].forEach(e => {
            if(!e.value.isUser) {
              if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                e.value.isValued = false
                e.value = this.initailDatabind(e)
                if(e.value.isUser) {
                  if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                    e.value.isUser = false
                  }
                }
              }
            } else {
              if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                e.value.isUser = false
              }
            }
          })
          this.objectArray["number2textbox"].forEach(e => {
            if(!e.value.isUser) {
              if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                e.value.isValued = false
                e.value = this.initailDatabind(e)
                if(e.value.isUser) {
                  if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                    e.value.isUser = false
                  }
                }
              }
            } else {
              if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                e.value.isUser = false
              }
            }
          })
        }
        if(this.isCvmFetch) {
          await this.getCvmList()
        }
        if(this.isSoFetch) {
          await this.getSoList()
        }
        if(this.isInvoiceFetch) {
          await this.getInvoiceList()
        }
        if(this.isCusFetch) {
          await this.getCusList()
        }
        if(this.isProvinceFetch) {
          this.getProvinces('pro_th').then(fx => {
            this.sleep = true
          })
        } else {
          this.sleep = true
        }
        this.isFirstFill = true
      },
      async getPublicArray(temp_array) {
        temp_array.forEach(e => {
          if(typeof e.page === "undefined") {
            e.page = 1
          }
          var cmp = {
              name: e.name_input,
              value: e.value,
              show_value: e.show_value,
              valueShow: valueShow,
              defaultValue: e.value,
              object_name: e.object_name,
              placeholder: e.placeholder,
              style: e.style,
              text: e.text,
              choices: e.choices,
              show: false,
              selected: false,
              top: e.position.top,
              defaultTop: e.defaultTop,
              defaultPage: e.page,
              left: e.position.left,
              width: e.position.width,
              height: e.position.height,
              section: e.section,
              object_type: e.object_type,
              disable: false,
              textHl: false,
              page: e.page
            }
            if(typeof cmp.valueShow === 'undefined') {
              cmp.valueShow = e.value
            }
            if(!e.defaultTop) {
              cmp.defaultTop = e.position.top
            }
            if(typeof e.style !== 'undefined') {
              if(e.style.showMobile) {
                this.isSimpleFill = true
              }
              if(!cmp.style.isComma) {
                cmp.style.isComma =  false
              }
              if(!e.excel) {
                cmp.excel = ""
              }
              if(!e.style.decimal) {
                cmp.style.decimal = 0
              }
              if(!e.style.validate) {
                cmp.style.validate = {value:"", fx: ""}
              }
              if(!e.style.font_align) {
                cmp.style.font_align = "justify"
              }
              if(!e.style.addTable) {
                cmp.style.addTable = false
              }
              if(!e.style.isZero) {
                cmp.style.isZero = false
              }
              if(!e.style.isZero) {
                cmp.style.isZero = false
              }
              if(typeof e.style.textAreaValiable === 'undefined') {
                cmp.style.textAreaValiable =[]
              }
              if(typeof e.style.checkBoxGroup === 'undefined') {
                cmp.style.checkBoxGroup =[]
              }
              if(e.object_type != "dataTableObjectArray") {
                cmp.style = this.fixObjectStyle(cmp.style)
              }
            }
            
            if(e.object_type == "autofillbox" || e.object_type == "number2textbox" ) {
              cmp.value = this.initailDatabind(cmp)
              if(typeof cmp.value.show_index === 'undefined' || cmp.value.show_index == 'undefined') {
                if(cmp.value.isUser) {
                  cmp.value = ""
                  this.objectArray["inputbox"].push(cmp)
                  cmp.object_type = 'inputbox'
                  e.object_type = 'inputbox'
                } else {
                  this.objectArray[e.object_type].push(cmp)
                }
              } else {
                this.objectArray[e.object_type].push(cmp)
              }
            } else {
              if(e.object_type != "sectionbox" && e.object_type != "dataTableObjectArray") {
                if(e.object_type == 'datatable' && !this.isSendStep) {
                  cmp.addAble = true
                }
                this.objectArray[e.object_type].push(cmp)
              } else if(e.object_type == "dataTableObjectArray") {
                this.dataTableObjectArray = e.value
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'cvm_id')) {
                  this.isCvmFetch = true
                }
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'so')) {
                  this.isSoFetch = true
                }
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'invoice')) {
                  this.isInvoiceFetch = true
                }
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'cus_id')) {
                  this.isCusFetch = true
                }
              }
            }
            if(e.object_type != "sectionbox" && e.object_type != "dataTableObjectArray") {
              this.dataDict[cmp.object_name] = {objectType: cmp.object_type, arrayIndex: this.objectArray[e.object_type].indexOf(cmp)}
            }
            if(e.object_type == 'dropdownbox' && e.style.autoChoices) {
              if(e.style.autoChoicesSelect == 'pro_th' || e.style.autoChoicesSelect == 'pro_en') {
                this.isProvinceFetch = true
              } else if (e.style.autoChoicesSelect == 'cvm_id') {
                this.isCvmFetch = true
              } else if (e.style.autoChoicesSelect == 'so') {
                this.isSoFetch = true
              } else if (e.style.autoChoicesSelect == 'invoice') {
                this.isInvoiceFetch = true
              } else if (e.style.autoChoicesSelect == 'cus_id') {
                this.isCusFetch = true
              } 
            }
        })
        if(this.isCvmFetch) {
          await this.getCvmList()
        }
        if(this.isSoFetch) {
          await this.getSoList()
        }
        if(this.isInvoiceFetch) {
          await this.getInvoiceList()
        }
        if(this.isCusFetch) {
          await this.getCusList()
        }
        if(this.isProvinceFetch) {
          this.getProvinces('pro_th').then(fx => {
            this.sleep = true
          })
        } else {
          this.sleep = true
        }
      },
      async getArrayValue(temp_array, isFromTemplate, isFirst) {
        if(isFirst) {
          this.isFirstFill = true
        }
        temp_array.forEach(e => {
          if(typeof e.page === "undefined") {
            e.page = 1
          }
          if(typeof e.value == 'undefined') {
            e.value = ""
          }
          var cmp = {}
          if(isFromTemplate) {
            cmp = {
              name: e.name_input,
              value: e.value,
              show_value: e.show_value,
              valueShow: e.valueShow,
              defaultValue: e.value,
              object_name: e.object_name,
              placeholder: e.placeholder,
              style: e.style,
              text: e.text,
              choices: e.choices,
              show: false,
              selected: false,
              defaultTop: e.defaultTop,
              defaultPage: e.page,
              top: e.position.top,
              left: e.position.left,
              width: e.position.width,
              height: e.position.height,
              section: e.section,
              object_type: e.object_type,
              disable: false,
              textHl: false,
              hideBysection: false,
              page: e.page
            }
            if(typeof cmp.valueShow === 'undefined') {
              cmp.valueShow = e.value
            }
            if(!e.defaultTop) {
              cmp.defaultTop = e.position.top
            }
            if(typeof e.style !== 'undefined' && e.style.showMobile) {
              this.isSimpleFill = true
            }
          } else {
            var cmp = {
              name: e.name,
              value: e.value,
              show_value: e.show_value,
              valueShow: e.valueShow,
              object_name: e.object_name,
              placeholder: e.placeholder,
              style: e.style,
              text: e.text,
              choices: e.choices,
              show: false,
              selected: false,
              top: e.top,
              defaultTop: e.defaultTop,
              left: e.left,
              width: e.width,
              height: e.height,
              section: e.section,
              object_type: e.object_type,
              disable: false,
              textHl: false,
              hideBysection: false,
              page: e.page
            }
            if(typeof cmp.valueShow === 'undefined') {
              cmp.valueShow = e.value
            }
            if(!e.defaultTop) {
              cmp.defaultTop = e.top
            }
            if(typeof e.style !== 'undefined' && e.style.showMobile) {
              this.isSimpleFill = true
            }
          }
          
          if(typeof style !== 'undefined') {
            if(!cmp.style.permission) {
              cmp.style.permission =  {byRole:true, value_role:[], value_email:[]}
            }
            if(typeof cmp.style.suffix === 'undefined' || !cmp.style.suffix ) {
                cmp.style.suffix = ""
              }
            if(!cmp.style.isComma) {
              cmp.style.isComma =  false
            }
            if(!e.excel) {
              cmp.excel = ""
            }
            if(!e.style.decimal) {
              cmp.style.decimal = 0
            }
            if(!e.style.validate) {
              cmp.style.validate = {value:"", fx: ""}
            }
            if(!e.style.font_align) {
              cmp.style.font_align = "justify"
            }
            if(!e.style.addTable) {
              cmp.style.addTable = false
            }
            if(!e.style.isZero) {
              cmp.style.isZero = false
            }
            if(!e.style.isZero) {
              cmp.style.isZero = false
            }
            if(typeof e.style.textAreaValiable === 'undefined') {
              cmp.style.textAreaValiable =[]
            }
            if(typeof e.style.checkBoxGroup === 'undefined') {
              cmp.style.checkBoxGroup =[]
            }
            if(e.object_type != "dataTableObjectArray") {
              cmp.style = this.fixObjectStyle(cmp.style)
            }
          }
            if(sessionStorage.getItem('isDocStep') == 'true' && cmp.object_type != "dataTableObjectArray") {
              cmp.disable = true
              if(typeof cmp.style.permission_step === 'undefined') {
                cmp.style.permission_step = ""
              }
              if(typeof cmp.style.permission_step_section === 'undefined') {
                cmp.style.permission_step_section = ""
              }
              if((cmp.style.permission_step == this.currentStep &&  !cmp.style.permission_step_section)||(!cmp.style.permission_step && cmp.style.permission_step_section == this.currentStep)) {
                this.isSendBack = true
                this.isEditable = true
                cmp.textHl = true
                cmp.disable = false
              }
            }
            if(this.isComplete) {
              cmp.disable = true
            }

            if(e.object_type == "autofillbox" || e.object_type == "number2textbox" ) {
              
              if(!cmp.disable && !(cmp.value.show == 'ref_no')) {
                cmp.value.isValued = false
              }
              if(cmp.value.show == 'leader_name_th' || cmp.value.show == 'leader_name_eng' ||  cmp.value.show == 'one_department') {
                cmp.value = {show: cmp.value.show}
              }
              cmp.value = this.initailDatabind(cmp)
              console.log(cmp.value)
              if(typeof cmp.value.show_index === 'undefined' || cmp.value.show_index == 'undefined') {
                if(cmp.value.isUser) {
                  cmp.value = ""
                  this.objectArray["inputbox"].push(cmp)
                  cmp.object_type = 'inputbox'
                  e.object_type = 'inputbox'
                } else {
                  this.objectArray[e.object_type].push(cmp)
                }
              } else {
                this.objectArray[e.object_type].push(cmp)
              }
            } else {
              if(e.object_type != "sectionbox" && e.object_type != "dataTableObjectArray") {
                this.objectArray[e.object_type].push(cmp)
              } else if(e.object_type == "dataTableObjectArray") {
                this.dataTableObjectArray = e.value
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'cvm_id')) {
                  this.isCvmFetch = true
                }
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'so')) {
                  this.isSoFetch = true
                }
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'invoice')) {
                  this.isInvoiceFetch = true
                }
                if(Object.values(this.dataTableObjectArray).find(item => item.style.autoChoicesSelect == 'cus_id')) {
                  this.isCusFetch = true
                }
              }
            }
            if(e.object_type == "signbox" ) {
              if(!cmp.disable) {
                sessionStorage.setItem('signStep', true)
              }
            }
            if(e.object_type != "sectionbox" && e.object_type != "dataTableObjectArray") {
              this.dataDict[cmp.object_name] = {objectType: cmp.object_type, arrayIndex: this.objectArray[e.object_type].indexOf(cmp)}
            }
            if(e.object_type == 'dropdownbox' && e.style.autoChoices) {
              if(e.style.autoChoicesSelect == 'pro_th' || e.style.autoChoicesSelect == 'pro_en') {
                this.isProvinceFetch = true
              } else if (e.style.autoChoicesSelect == 'cvm_id') {
                this.isCvmFetch = true
              } else if (e.style.autoChoicesSelect == 'so') {
                this.isSoFetch = true
              } else if (e.style.autoChoicesSelect == 'invoice') {
                this.isInvoiceFetch = true
              } else if (e.style.autoChoicesSelect == 'cus_id') {
                this.isCusFetch = true
              }
            }
        })
        if(sessionStorage.getItem('isDocStep') == 'true') {
          Object.keys(this.dataTableObjectArray).forEach(k => {
            this.dataTableObjectArray[k].disable = true
            this.dataTableObjectArray[k].style.boxShadow = "0"
            this.dataTableObjectArray[k].textHl = false
            this.dataTableObjectArray[k].hideBysection = false
            var objName = this.dataTableObjectArray[k].object_name.split('_')[0]
            if(typeof this.dataDict[objName] !== 'undefined') {
              var tableObjIndex = this.dataDict[objName].arrayIndex
              if(typeof this.dataTableObjectArray[k].style.permission_step === 'undefined') {
                this.dataTableObjectArray[k].style.permission_step = ""
              }
              if(typeof this.dataTableObjectArray[k].style.permission_step_section === 'undefined') {
                this.dataTableObjectArray[k].style.permission_step_section = ""
              }
              if((this.dataTableObjectArray[k].style.permission_step == this.currentStep && !this.dataTableObjectArray[k].style.permission_step_section) || (this.dataTableObjectArray[k].style.permission_step_section == this.currentStep && !this.dataTableObjectArray[k].style.permission_step)) {
                this.isSendBack = true
                this.isEditable = true
                this.dataTableObjectArray[k].textHl = true
                this.dataTableObjectArray[k].disable = false
                if(typeof this.objectArray['datatable'][tableObjIndex] !== 'undefined') {
                  this.objectArray['datatable'][tableObjIndex].addAble = true
                }
              }
            }
          })
        }
        if(!this.isSendStep) {
          this.objectArray["autofillbox"].forEach(e => {
            if(!e.value.isUser) {
              e.value.isValued = false
              e.value = this.initailDatabind(e)
              if(e.value.isUser) {
                if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                  e.value.isUser = false
                }
              }
            } else {
              if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                e.value.isUser = false
              }
            }
          })
          this.objectArray["number2textbox"].forEach(e => {
            if(!e.value.isUser) {
              if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                e.value.isValued = false
                e.value = this.initailDatabind(e)
                if(e.value.isUser) {
                  if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                    e.value.isUser = false
                  }
                }
              }
            } else {
              if(typeof e.value.show_index === 'undefined' || e.value.show_index == 'undefined') {
                e.value.isUser = false
              }
            }
          })
        }
        if(this.isCvmFetch) {
          await this.getCvmList()
        }
        if(this.isSoFetch) {
          await this.getSoList()
        }
        if(this.isInvoiceFetch) {
          await this.getInvoiceList()
        }
        if(this.isCusFetch) {
          await this.getCusList()
        }
        if(this.isProvinceFetch) {
          this.getProvinces('pro_th').then(fx => {
            this.sleep = true
          })
        } else {
          this.sleep = true
        }
      },
      async importData(type, id, isImportInRow, selectedRow) {
        try{
          var url = ""
          if(type == "preinput") {
            url = this.$api_url + "/external_service/api/v1/get_preinput?preinput_id=" +id
          }
          if(url) {
            var { data } = await this.axios.get(url)
            if(data.status) {
                var dataObj = data.result.json_data
                var template = []
                if(dataObj) {
                  Object.keys(dataObj).forEach(e => {
                    var jk = ""
                    if(typeof dataObj[e] === 'object' && dataObj[e].isRowImport) {
                      var obj = this.objectArray['datatable'].find(item => item.object_name == e)
                      if(obj) {
                        var obj1Row = Number(dataObj[e].row_data.length)
                        var obj2Row = Number(obj.style.table.crow)
                        if(obj1Row > obj2Row) {
                          for(let i=0; i< obj1Row-obj2Row; i++) {
                            this.addTableRow(obj.object_name ,true)
                          }
                        }
                      }
                      let row_index = 1
                      dataObj[e].row_data.forEach(e2 => {
                        Object.keys(e2).forEach(e3 => {
                          template.push({
                            json_key: `${e3}_${String(row_index)}`,
                            value: e2[e3]
                          })
                        })
                        row_index++
                      })
                    } else {
                      if(isImportInRow && selectedRow) {
                        jk = `${e}_${String(selectedRow)}`
                      } else {
                        jk = e
                      }
                      template.push({
                        json_key: jk,
                        value: dataObj[e]
                      })
                    }
                    
                  })

                  this.objectTypeInput.forEach(t => {
                    this.objectArray[t].forEach(e => {
                      if(typeof e.value !== 'undefined' && e.value && e.value.show == 'ref_no' && !this.option.isCopy) {
                        e.value.show_index = this.refDocNo
                        e.value.isValued = true
                        e.value.isUser = true
                      } else {
                        var obj = template.find(item => item.json_key== e.style.json_key)
                        if(obj && !e.style.noInputRef && t != 'autofillbox') {
                          if(e.object_type == 'datepickerbox' && obj.value.includes("/")) {
                            obj.value = this.thaiDateToDate(obj.value)
                          }
                          e.value = obj.value
                        }
                      }
                    })
                  })

                  Object.keys(this.dataTableObjectArray).forEach(e => {
                    var obj = template.find(item => item.json_key == this.dataTableObjectArray[e].style.json_key)
                    if(obj && ! this.dataTableObjectArray[e].style.noInputRef) {
                      if(this.dataTableObjectArray[e].object_type == 'linkdatabox') {
                        if(this.dataTableObjectArray[e].valueList) {
                          let findValue = this.dataTableObjectArray[e].valueList.find(item => item.text == obj.value)
                          if(findValue) {
                            this.dataTableObjectArray[e].value = findValue.value
                            this.dataTableObjectArray[e].show_value = findValue.text
                          }
                        }
                        
                      } else {
                        if(this.dataTableObjectArray[e].object_type == 'datepickerbox' && obj.value.includes("/")) {
                          obj.value = this.thaiDateToDate(obj.value)
                        }
                        this.dataTableObjectArray[e].value = obj.value
                        this.dataTableObjectArray[e].show_value = obj.value
                      }
                      
                    }
                  })

                  this.getDataTableList(false)
                  if(Object.keys(this.dataTableObjectArray).length) {
                    Object.keys(this.dataTableObjectArray).forEach(e => {
                      var calType = ['datepickerbox', 'inputbox', 'timebox', 'linkdatabox', 'dropdownbox']
                      if(calType.includes(this.dataTableObjectArray[e].object_type)) {
                        this.change_calculate(e,false)
                      }
                    })
                  }
                }
              }
          }
        } catch(e) {
          console.log(e)
        }
      },
      async searchInputText(obj, isDatatable, row) {
        try {
        if(obj && obj.style && obj.style.search_api) {
          let searchkeyword = obj.style.json_key
          if(isDatatable) {
            searchkeyword = searchkeyword.split(`_${String(row)}`).join("")
          }
          var { data } = await this.axios.post(this.$api_url + "/external_service/api/v1/search_external_data", {
            search_api: obj.style.search_api,
            keyword: searchkeyword,
            value: obj.value
          })
          if(data.status && data.result) {
            var importData = []
            if(isDatatable) {
              Object.keys(data.result).forEach(e => {
                importData.push({
                  json_key: `${e}_${String(row)}`,
                  value: data.result[e]
                })
              })
            } else {
              Object.keys(data.result).forEach(e => {
                importData.push({
                  json_key: e,
                  value: data.result[e]
                })
              })
            }
            if(importData.length) {
              this.objectTypeInput.forEach(t => {
                this.objectArray[t].forEach(e => {
                  if(typeof e.value !== 'undefined' && e.value && e.value.show == 'ref_no' && !this.option.isCopy) {
                    e.value.show_index = this.refDocNo
                    e.value.isValued = true
                    e.value.isUser = true
                  } else {
                    var obj = importData.find(item => item.json_key== e.style.json_key)
                    if(obj && !e.style.noInputRef && t != 'autofillbox') {
                      if(e.object_type == 'datepickerbox' && obj.value.includes("/")) {
                        obj.value = this.thaiDateToDate(obj.value)
                      }
                      e.value = obj.value
                    }
                  }
                })
              })

              Object.keys(this.dataTableObjectArray).forEach(e => {
                var obj = importData.find(item => item.json_key == this.dataTableObjectArray[e].style.json_key)
                if(obj && ! this.dataTableObjectArray[e].style.noInputRef) {
                  if(this.dataTableObjectArray[e].object_type == 'linkdatabox') {
                    if(this.dataTableObjectArray[e].valueList) {
                      let findValue = this.dataTableObjectArray[e].valueList.find(item => item.text == obj.value)
                      if(findValue) {
                        this.dataTableObjectArray[e].value = findValue.value
                        this.dataTableObjectArray[e].show_value = findValue.text
                      }
                    }
                  } else {
                    if(this.dataTableObjectArray[e].object_type == 'datepickerbox' && obj.value.includes("/")) {
                      obj.value = this.thaiDateToDate(obj.value)
                    }
                      this.dataTableObjectArray[e].value = obj.value
                      this.dataTableObjectArray[e].show_value = obj.value
                  }    
                }
              })

              this.getDataTableList(false)
              if(Object.keys(this.dataTableObjectArray).length) {
                Object.keys(this.dataTableObjectArray).forEach(e => {
                  var calType = ['datepickerbox', 'inputbox', 'timebox', 'linkdatabox', 'dropdownbox']
                  if(calType.includes(this.dataTableObjectArray[e].object_type)) {
                    this.change_calculate(e,false)
                  }
                })
              }
            }
          }
        }
        }
        catch(e) {
          console.log(e)
        }
      },
      fixObjectStyle(style) {
        if(style.border_radias == 'False') {
          style.border_radias = false
        }
        if(style.permission.byRole == 'False') {
          style.permission.byRole = false
        }
        if(style.permission_section.byRole == 'False') {
          style.permission_section.byRole = false
        }
        if(style.hidesection == 'False') {
          style.hidesection = false
        }
        if(style.mandatory == 'False') {
          style.mandatory = false
        }
        if(style.number_only == 'False') {
          style.number_only = false
        }
        if(typeof style.time !== 'undefined') {
          if(style.time.isSec == 'False') {
            style.time.isSec = false
          }
        }
        if(style.isComma == 'False') {
          style.isComma = false
        }
        if(style.addTable == 'False') {
          style.addTable = false
        }
        if(style.function == 'None') {
          style.function = ''
        }
        if(style.suffix == 'None') {
          style.suffix = ''
        }
        if(style.validate.value == 'None') {
          style.validate.value = ''
        }
        if(style.validate.fx == 'None') {
          style.validate.fx = ''
        }
        if(style.refPermission == 'None') {
          style.refPermission = ''
        }
        if(style.refValue == 'None') {
          style.refValue = ''
        }
        if(style.n2tdecimal == 'None') {
          style.n2tdecimal = ''
        }
        return style
      },
      setPosition(isMovePage) {
        this.objectArray["textfield"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 5
          }
          this.selectObject(e, "textfield")
          e.font_style = this.change_fontstyle(e)
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
        })

        this.objectArray["rectangle"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 2
          }
          this.selectObject(e, "rectangle")
          e.boxStyle = ""
          e.boxStyle += "border:" + this.objectArray[this.selected_array][this.selected_object].style.border_size + "px solid;"
          e.boxStyle += "background-color:" + this.objectArray[this.selected_array][this.selected_object].style.background_color + ";"
          e.boxStyle += "border-color:" + this.objectArray[this.selected_array][this.selected_object].style.border_color + ";"
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
        })
        
        this.objectArray["line"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 6
          }
          this.selectObject(e, "line")
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
        })

        this.objectArray["textareabox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 6
          }
          e.style.boxShadow = '0'
          this.selectObject(e, "textareabox")
          e.font_style = this.change_fontstyle(e)
          if(!e.value) {
            e.value = this.getTextAreaValue(e)
          }
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
        })

        this.objectArray["texteditorbox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 6
          }
          e.style.boxShadow = '0'
          this.selectObject(e, "texteditorbox")
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
        })

        this.objectArray["dropdownbox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 6
          }
          $("#" + e.name + " div:first div:first").addClass(e.name + '-box') //add class of box height
          $("#" + e.name + " div:first div:first").addClass(e.name + '-icon') //add class of arrow down box height
          e.style.boxShadow = '0'
          if(typeof e.style.decimalShow === 'undefined') {
            e.style.decimalShow =  e.style.decimal
          }
          if(typeof e.show_value === 'undefined') {
            e.show_value = e.value
          }
          if(e.style.autoChoices && (e.style.autoChoicesSelect == 'pro_th' || e.style.autoChoicesSelect == 'pro_en')) {
            e.choices = []
            if(e.style.autoChoicesSelect == 'pro_th') {
              this.provinceArray.forEach(e2 => {
                e.choices.push({text:e2.name_th, value:e2})
              })
            } else {
              this.provinceArray.forEach(e2 => {
                e.choices.push({text:e2.name_en, value:e2})
              })
            }
          }
          if(e.style.autoChoices && e.style.autoChoicesSelect == 'cvm_id') {
            e.choices = this.cvmArray
          }
          if(e.style.autoChoices && e.style.autoChoicesSelect == 'so') {
            e.choices = this.soArray
          }
          if(e.style.autoChoices && e.style.autoChoicesSelect == 'invoice' && !e.style.refAutoChoices) {
            e.choices = this.invoiceArray
          }
          if(e.style.autoChoices && e.style.autoChoicesSelect == 'cus_id') {
            e.choices = this.cusArray
          }
          this.selectObject(e, "dropdownbox")
          e.font_style = this.change_fontstyle(e)
          if(typeof e.choices !== 'undefined' && e.choices && !e.choices.includes("")) {
            var tempChoice = [""]
            e.choices = tempChoice.concat(e.choices)
          }
          $("<style type=\"text/css\">.v-text-field--outlined." + e.name + "-box > .v-input__control > .v-input__slot {font-size: " + e.style.font_size + "px; min-height: " + e.style.font_size + "px!important; max-height: " + (Number(e.style.font_size) + 6) + "px!important;}</style>").appendTo("head")
          $("<style type=\"text/css\">." + e.name + "-box.v-select.v-text-field input {text-align: " + e.style.font_align + ";}</style>").appendTo("head") //align of text in dropdown
          $("<style type=\"text/css\">." + e.name + "-icon .v-input__icon {max-height: " + (Number(e.style.font_size) + 6) + "px!important;}</style>").appendTo("head")
          if(e.style.refValue) {
            if(typeof this.dataDict[e.style.refValue] !== 'undefined') {
              if(typeof this.dropdownChangeDict[e.style.refValue] !== 'undefined') {
                this.dropdownChangeDict[e.style.refValue].push(e.object_name)
              } else {
                this.dropdownChangeDict[e.style.refValue] = []
                this.dropdownChangeDict[e.style.refValue].push(e.object_name)
              }
            }
          }
          if(e.style.refAutoChoices) {
            if(typeof this.dataDict[e.style.refAutoChoices] !== 'undefined') {
              if(typeof this.dropdownChangeDict[e.style.refAutoChoices] !== 'undefined') {
                this.dropdownChangeDict[e.style.refAutoChoices].push(e.object_name)
              } else {
                this.dropdownChangeDict[e.style.refAutoChoices] = []
                this.dropdownChangeDict[e.style.refAutoChoices].push(e.object_name)
              }
            }
          }
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
        })

        this.objectArray["datepickerbox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 6
          }
          e.style.boxShadow = '0'
          var startDate = new Date().toISOString().substr(0, 10)
          e.rangeDate = ""
          if(e.style.startDateType == "current") {
            e.rangeDate = new Date().toISOString().substr(0, 10)
            if(e.style.startDateFrom && e.style.startDateFrom !== 'undefined') {
              var tempDate = new Date()
              tempDate.setDate(tempDate.getDate() + Number(e.style.startDateFrom))
              e.rangeDate = tempDate.toISOString().substr(0, 10)
              startDate = e.rangeDate
            } else {
              startDate = e.rangeDate
            }
          } else if (e.style.startDateType == "custom") {
            if(e.style.startDateValue) {
              e.rangeDate = new Date(e.style.startDateValue).toISOString().substr(0, 10)
              startDate = new Date(e.style.startDateValue).toISOString().substr(0, 10)
            } else {
              e.rangeDate = new Date().toISOString().substr(0, 10)
            }
          } else if(typeof e.style.startDateType == 'undefined') {
            startDate = new Date().toISOString().substr(0, 10)
          }

          if(e.style.defaultDateSelect == 'custom' && !e.style.noDefaultDate) {
            if(e.style.defaultDateValue) {
              startDate = new Date(e.style.defaultDateValue).toISOString().substr(0, 10)
            }
          } else if(e.style.defaultDateSelect == 'ref_date' && !e.style.noDefaultDate) {
            var refDate = this.objectArray["datepickerbox"].find(item => item.object_name == e.style.defaultDateValue)
            if(!refDate) {
              refDate = Object.values(this.dataTableObjectArray).find(item => item.object_name == e.style.defaultDateValue)
              if(refDate && !refDate.value) {
                this.dataTableObjectArray[refDate.object_name].value = new Date().toISOString().substr(0, 10)
                refDate.value = new Date().toISOString().substr(0, 10)
              }
            }
            if(refDate) {
              var holdDate = new Date(refDate.value)
              if(e.style.additionYear) {
                holdDate.setFullYear(holdDate.getFullYear() + Number(e.style.additionYear))
              }
              if(e.style.additionMon) {
                holdDate.setMonth(holdDate.getMonth() + Number(e.style.additionMon))
              }
              if(e.style.additionDate) {
                holdDate.setDate(holdDate.getDate() + Number(e.style.additionDate))
              }
              startDate = holdDate.toISOString().substr(0, 10)
            }
          }
          if((sessionStorage.getItem('isDocEdit') == 'false') && (sessionStorage.getItem('isBack') == 'false')) {
            if(!e.style.noDefaultDate) {
              e.value = startDate
            } else {
              e.value = ""
            }
          }
          if(!this.isSendStep && !e.disable && !e.style.valueFilled) {
            if(!e.style.noDefaultDate) {
              e.value = startDate
            } else {
              e.value = ""
            }
            e.style.valueFilled = true
          }
          this.selectObject(e, "datepickerbox")
          e.font_style = this.change_fontstyle(e)
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
        })

        if(this.objectArray["datepickerbox"].length) {
          this.objectArray["datepickerbox"].forEach(e => {
            this.changeDate(e)
          })
        }

        this.objectArray["timebox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 6
          }
          e.font_style = this.change_fontstyle(e)
          e.style.boxShadow = '0'
          var time = new Date()
          var hr = '', mn = '', sc = ''
          time.getHours()<10?hr = '0' + time.getHours():hr = time.getHours()
          time.getMinutes()<10?mn = '0' + time.getMinutes():mn = time.getMinutes()
          time.getSeconds()<10?sc = '0' + time.getSeconds():sc = time.getSeconds()
          if((sessionStorage.getItem('isDocEdit') == 'false') && (sessionStorage.getItem('isBack') == 'false')) {
            e.value = hr + ":" + mn
            if(e.style.time.isSec) {
              e.value += ':' + sc
            }
          } else {
            if(!e.value) {
              e.value = hr + ":" + mn
            }
          }
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
            $('#' + e.name + '-input').css("box-shadow", "1px 1px 1px 1px #4CAF50")
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
        })

        this.objectArray["checkbox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 6
          }
          
          this.selectObject(e, "checkbox")
          e.font_style = this.change_fontstyle(e)
          if(e.page == this.currentPage) {
            e.show = true
            $("#" + e.name).css("z-index", e.style.zIndex)
            $('#' + e.name + '-input').css("box-shadow", "1px 1px 1px 1px #4CAF50")
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
        })

        this.objectArray["imagebox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 3
          }
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
        })

        this.objectArray["autofillbox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 5
          }
          if(typeof e.style.decimalShow === 'undefined') {
            e.style.decimalShow =  e.style.decimal
          }
          $("#" + e.name + " div:first div:first").addClass(e.name + '-box') //add class of box height and text align in dropdown
          $("#" + e.name + " div:first div:first").addClass(e.name + '-icon') //add class of arrow down box height
          $("<style type=\"text/css\">.v-text-field--outlined." + e.name + "-box > .v-input__control > .v-input__slot {font-size: " + e.style.font_size + "px; min-height: " + e.style.font_size + "px!important; max-height: " + (Number(e.style.font_size) + 6) + "px!important;}</style>").appendTo("head")
          $("<style type=\"text/css\">." + e.name + "-box.v-select.v-text-field input {text-align: " + e.style.font_align + ";}</style>").appendTo("head") //align of text in dropdown
          $("<style type=\"text/css\">." + e.name + "-icon .v-input__icon {max-height: " + (Number(e.style.font_size) + 6) + "px!important;}</style>").appendTo("head")
          this.selectObject(e, "autofillbox")
          e.font_style = this.change_fontstyle(e)
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
        })

        this.objectArray["inputbox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 7
          }
          if(typeof e.style.decimalShow === 'undefined') {
            e.style.decimalShow =  e.style.decimal
          }
          e.style.boxShadow = '0'
          this.selectObject(e, "inputbox")
          e.font_style = this.change_fontstyle(e)
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
            $('#' + e.name + '-input').css("box-shadow", "1px 1px 1px 1px #4CAF50")
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
          if(e.style.defaultValueObj) {
            if(typeof this.changeDefaultDict[e.style.defaultValueObj] !== 'undefined' && !this.changeDefaultDict[e.style.defaultValueObj].includes(e.object_name)) {
              this.changeDefaultDict[e.style.defaultValueObj].push(e.object_name)
            } else {
              this.changeDefaultDict[e.style.defaultValueObj] = [e.object_name]
            }
          }
        })

        this.objectArray["calculatebox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 5
          }
          if(typeof e.style.decimalShow === 'undefined') {
            e.style.decimalShow =  e.style.decimal
          }
          e.value = 0
          this.selectObject(e, "calculatebox")
          e.font_style = this.change_fontstyle(e)
          this.change_calculate(e.object_name,true)
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
        })

        this.objectArray["number2textbox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 5
          }
          this.selectObject(e, "number2textbox")
          e.font_style = this.change_fontstyle(e)
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
        })  

        this.objectArray["table"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 2
          }
          this.selectObject(e, "table")
          e.tableStyle = ""
          e.tableStyle += "border:" + this.objectArray[this.selected_array][this.selected_object].style.border_size + "px solid;"
          e.tableStyle += "border-color:" + this.objectArray[this.selected_array][this.selected_object].style.border_color + ";"
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
        })

        this.objectArray["datatable"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 5
          }
          $("#" + e.name).css("opacity",1)
          e.style.valueList = this.getValueList(e.value)
          if(e.page == this.currentPage) {
            this.selectObject(e, "datatable")
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
        })

        this.objectArray["signbox"].forEach(e => {
          if(!e.style.zIndex) {
            e.style.zIndex = 2
          }
          this.selectObject(e, "signbox")
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(!this.template_option.status_flow_permission) {
            sessionStorage.setItem('isNoFlowSign', true)
          }
        })

        this.objectArray["inputimagebox"].forEach(e => {
          if(e.style.isValued) {
            e.isValued = true
          } else {
            e.isValued = false
          }
          this.selectObject(e, "inputimagebox")
          if(e.page == this.currentPage) {
            $("#" + e.name).css("z-index", e.style.zIndex)
            e.show = true
          } else {
            $("#" + e.name).css("z-index", 1)
          }
          if(e.style.contTable && !this.contTableArray.includes(e.style.contTable)) {
            this.contTableArray.push(e.style.contTable)
          }
          if(e.style.hideOption) {
            this.setHideChangeDict(e.style.hideOption, e.object_name)
          }
        })
        
        if(this.objectArray['datatable'].length) {
          this.getDataTableList(true)
        }
        this.setChangeDict()
        this.mergeChangeDict()
        if(isMovePage) {
          this.moveToPage(1)
        }
        if(sessionStorage.getItem('isBack') == 'true') {
          this.getBackValue()
        }
        if(this.option.isCopy && !(sessionStorage.getItem('isBack') == 'true')) {
          this.getTemplateRefdoc("", this.option.transaction_id)
        }
        if(this.option.isImport && !(sessionStorage.getItem('isBack') == 'true')) {
          this.getTemplateRefdoc(this.option.doc_no)
        }
        if(sessionStorage.getItem('readTemplate') && !(sessionStorage.getItem('isBack') == 'true')) {
          this.readTemplateData(sessionStorage.getItem('readTemplate'))
        }
        if(this.isFirstFill) {
          this.checkChangeDefault(true)
        }

        if(this.option.preinput_id) {
          this.importData("preinput", this.option.preinput_id)
        }
        this.checkContSleep = true
      },
      checkContTable() {
        var contAllArray = []
        this.objectType.forEach(e => {
          let checkArray = this.objectArray[e].filter(item => item.style.contTable && !this.contTableArray.includes(item.object_name))
          contAllArray = contAllArray.concat(checkArray)
        })
        contAllArray.forEach( e => {
          this.changeConTable(e)
        })
        this.checkContSleep = false
      },
      checkChangeDefault(isAll, objectName) {
        if(isAll) {
          Object.keys(this.changeDefaultDict).forEach(k => {
            var changeVal = this.checkObject(k, false)
            this.changeDefaultDict[k].forEach(e => {
              if(e.startsWith('datatable')) {
                this.dataTableObjectArray[e].valueShow = changeVal
                this.dataTableObjectArray[e].value = changeVal
                this.change_calculate(e, false)
              } else {
                var objArray = this.dataDict[e].objectType
                var objIndex = this.dataDict[e].arrayIndex
                if(typeof this.objectArray[objArray][objIndex] !== 'undefined') {
                  this.objectArray[objArray][objIndex].value = changeVal
                  this.objectArray[objArray][objIndex].valueShow= changeVal
                  this.change_calculate(e, false)
                }
              }
            })
          })
        } else {
          if(typeof this.changeDefaultDict[objectName] !== 'undefined' && this.changeDefaultDict[objectName].length) {
            var changeVal = this.checkObject(objectName, false)
            this.changeDefaultDict[objectName].forEach(e => {
                if(e.startsWith('datatable')) {
                  this.dataTableObjectArray[e].valueShow = changeVal
                  this.dataTableObjectArray[e].value = changeVal
                  this.change_calculate(e, false)
                } else {
                  var objArray = this.dataDict[e].objectType
                  var objIndex = this.dataDict[e].arrayIndex
                  if(typeof this.objectArray[objArray][objIndex] !== 'undefined') {
                    this.objectArray[objArray][objIndex].value = changeVal
                    this.objectArray[objArray][objIndex].valueShow= changeVal
                    this.change_calculate(e, false)
                  }
                }
              })
          }
        }
      },
      getValueList(val) {
        var valList = []
        for(let i=0; i<val.length; i++) { //row
          valList.push([])
          for(let j=0; j<val[i].length; j++) { //choice
            valList[i].push(val[i][j].value.map(a => a.value))
          }
        }
        return valList
      },
      getDataTableList(isCal) {
        Object.keys(this.dataTableObjectArray).forEach(e => {
          this.dataTableObjectArray[e].valueList = []
          if(typeof  this.dataTableObjectArray[e].style.decimalShow === 'undefined') {
            this.dataTableObjectArray[e].style.decimalShow = this.dataTableObjectArray[e].style.decimal
          }
          var objName = this.dataTableObjectArray[e].object_name.split('_')[0]
          this.dataTableObjectArray[e].font_style = this.change_fontstyle(this.dataTableObjectArray[e])
          if(typeof this.dataDict[objName] !== 'undefined') {
            var tableObjIndex = this.dataDict[objName]
            if(this.dataTableObjectArray[e].style.showMobile) {
              this.isSimpleFill = true
            }
            if(typeof tableObjIndex !== 'undefined' && this.dataTableObjectArray[e].object_type == 'linkdatabox') {
              $("#" + this.dataTableObjectArray[e].name + " div:first").addClass(this.dataTableObjectArray[e].name + '-box') //add class of box height
              $("#" + this.dataTableObjectArray[e].name + " div:first").addClass(this.dataTableObjectArray[e].name + '-icon')
              $("<style type=\"text/css\">.v-text-field--outlined." + this.dataTableObjectArray[e].name + "-box > .v-input__control > .v-input__slot {font-size: " + this.dataTableObjectArray[e].style.font_size + "px; min-height: " + this.dataTableObjectArray[e].style.font_size + "px!important; max-height: " + (Number(this.dataTableObjectArray[e].style.font_size) + 6) + "px!important;}</style>").appendTo("head")
              $("<style type=\"text/css\">." + this.dataTableObjectArray[e].name + "-box.v-select.v-text-field input {text-align: " + this.dataTableObjectArray[e].style.font_align + ";}</style>").appendTo("head") //align of text in dropdown
              $("<style type=\"text/css\">." + this.dataTableObjectArray[e].name + "-icon .v-input__icon {max-height: " + (Number(this.dataTableObjectArray[e].style.font_size) + 6) + "px!important;}</style>").appendTo("head")
              var tableObj = this.objectArray[tableObjIndex.objectType][tableObjIndex.arrayIndex]
              var row = this.dataTableObjectArray[e].object_name.split('_')[1].split('C')[0].split('R')[1]
              var col = this.dataTableObjectArray[e].object_name.split('_')[1].split('C')[1]
              this.dataTableObjectArray[e].valueList = []
              if(tableObj.style.isDefaultRow){
                if(typeof tableObj.style.valueList[Number(tableObj.style.defaultRow)-1] !== 'undefined') {
                  for(let i=0; i<tableObj.style.valueList[Number(tableObj.style.defaultRow)-1].length; i++) {
                    this.dataTableObjectArray[e].valueList.push({text:tableObj.style.valueList[Number(tableObj.style.defaultRow)-1][i][parseInt(col)-1], value: i})
                  }
                }
              } else if(typeof tableObj.style.valueList[parseInt(row)-1] !== 'undefined') {
                for(let i=0; i<tableObj.style.valueList[parseInt(row)-1].length; i++) {
                  this.dataTableObjectArray[e].valueList.push({text:tableObj.style.valueList[parseInt(row)-1][i][parseInt(col)-1], value: i})
                }
              }
              if(typeof this.dataTableObjectArray[e].valueList === 'undefined') {
                this.dataTableObjectArray[e].valueList = []
              }
              if(this.dataTableObjectArray[e].value == '' && this.dataTableObjectArray[e].valueList.length) {
                this.dataTableObjectArray[e].value = 0
              }
            }
            if(this.dataTableObjectArray[e].object_type == 'dropdownbox') {
              $("#" + this.dataTableObjectArray[e].name + " div:first  div:first").addClass(this.dataTableObjectArray[e].name + '-box') //add class of box height
              $("#" + this.dataTableObjectArray[e].name + " div:first  div:first").addClass(this.dataTableObjectArray[e].name + '-icon')
              $("<style type=\"text/css\">.v-text-field--outlined." + this.dataTableObjectArray[e].name + "-box > .v-input__control > .v-input__slot {font-size: " + this.dataTableObjectArray[e].style.font_size + "px; min-height: " + this.dataTableObjectArray[e].style.font_size + "px!important; max-height: " + (Number(this.dataTableObjectArray[e].style.font_size) + 6) + "px!important;}</style>").appendTo("head")
              $("<style type=\"text/css\">." + this.dataTableObjectArray[e].name + "-box.v-select.v-text-field input {text-align: " + this.dataTableObjectArray[e].style.font_align + ";}</style>").appendTo("head") //align of text in dropdown
              $("<style type=\"text/css\">." + this.dataTableObjectArray[e].name + "-icon .v-input__icon {max-height: " + (Number(this.dataTableObjectArray[e].style.font_size) + 6) + "px!important;}</style>").appendTo("head")
              if(this.dataTableObjectArray[e].style.refValue) {
                if(typeof this.dropdownChangeDict[this.dataTableObjectArray[e].style.refValue] !== 'undefined') {
                  this.dropdownChangeDict[this.dataTableObjectArray[e].style.refValue].push(this.dataTableObjectArray[e].object_name)
                } else {
                  this.dropdownChangeDict[this.dataTableObjectArray[e].style.refValue] = []
                  this.dropdownChangeDict[this.dataTableObjectArray[e].style.refValue].push(this.dataTableObjectArray[e].object_name)
                }
              }
              if(this.dataTableObjectArray[e].style.autoChoices && (this.dataTableObjectArray[e].style.autoChoicesSelect == 'pro_th' || this.dataTableObjectArray[e].style.autoChoicesSelect == 'pro_en')) {
                this.dataTableObjectArray[e].choices = []
                if(this.dataTableObjectArray[e].style.autoChoicesSelect == 'pro_th') {
                  this.provinceArray.forEach(e2 => {
                    this.dataTableObjectArray[e].choices.push({text:e2.name_th, value:e2})
                  })
                } else {
                  this.provinceArray.forEach(e2 => {
                    this.dataTableObjectArray[e].choices.push({text:e2.name_en, value:e2})
                  })
                }
              }
              if(this.dataTableObjectArray[e].style.autoChoices && (this.dataTableObjectArray[e].style.autoChoicesSelect == 'cvm_id')) {
                this.dataTableObjectArray[e].choices = this.cvmArray
              }
              if(this.dataTableObjectArray[e].style.autoChoices && (this.dataTableObjectArray[e].style.autoChoicesSelect == 'so')) {
                this.dataTableObjectArray[e].choices = this.soArray
              }
              if(this.dataTableObjectArray[e].style.autoChoices && (this.dataTableObjectArray[e].style.autoChoicesSelect == 'invoice') && !this.dataTableObjectArray[e].style.refAutoChoices) {
                this.dataTableObjectArray[e].choices = this.invoiceArray
              }
              if(this.dataTableObjectArray[e].style.autoChoices && (this.dataTableObjectArray[e].style.autoChoicesSelect == 'cus_id')) {
                this.dataTableObjectArray[e].choices = this.cusArray
              }
              if(typeof this.dataTableObjectArray[e].choices !== 'undefined' && this.dataTableObjectArray[e].choices && !this.dataTableObjectArray[e].choices.includes("")) {
                var tempChoice = [""]
                this.dataTableObjectArray[e].choices = tempChoice.concat(this.dataTableObjectArray[e].choices)
              }
            } else if(this.dataTableObjectArray[e].object_type == 'calculatebox') {
              var objArray = this.dataDict[objName].objectType
              var objIndex = this.dataDict[objName].arrayIndex
              if(objArray == 'datatable' && typeof this.objectArray[objArray][objIndex] !== 'undefined') {
                if(this.objectArray[objArray][objIndex].style.isDefaultRow) {
                  var col = this.dataTableObjectArray[e].object_name.split('_')[1].split('C')[1]
                  var row = this.dataTableObjectArray[e].object_name.split('_')[1].split('C')[0].split('R')[1]
                  var defualtRow = this.objectArray[objArray][objIndex].style.defaultRow
                  var defaultRowData = this.dataTableObjectArray[objName + '_' + 'R' + String(defualtRow) + 'C' + col]
                  this.dataTableObjectArray[e].style.function = defaultRowData.style.function.split('R' + defualtRow).join('R' + row)
                  this.change_calculate(e, true)
                }
              }
              var fx = this.dataTableObjectArray[e].style.function
              var operand = fx.split('(')[0]
              if(operand == 'sum' || operand == 'sumif' || operand == 'sub' || operand == 'mul' || operand == 'dvd' || operand == 'avg' || 
              operand == 'min' || operand == 'max' || operand == 'diffDate' || operand == 'lenDate' || operand == 'diffMon' || operand == 'diffTime' || operand == 'diffTimeHr' || operand == 'diffTimeMn') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                var cond = ""
                if(operand == 'sumif') {
                  cond = nums.split(':')[1]
                  nums = nums.split(':')[0]
                }
                nums = nums.split(',')
                if(cond) {
                  var obj_name = ""
                  var isHead = true
                  var isTail = false
                  for(let j=0; j<cond.length; j++) {
                    if((cond.charAt(j) != "=" && cond.charAt(j) != "!" && cond.charAt(j) != "&"  && cond.charAt(j) != "|" 
                      && cond.charAt(j) != ">" && cond.charAt(j) != "<")
                      && isHead) {
                        obj_name += cond.charAt(j)
                    } else if(!isTail && isHead){
                      if(obj_name.includes('RX')) {
                        var dataObj = this.objectArray['datatable'].find(item => item.object_name == obj_name.split('_')[0])
                        if(dataObj) {
                          dataObj.style.table.crow = dataObj.style.table.rowsize.length
                          var rowCount = Number(dataObj.style.table.crow)
                          for(let r=1; r<=rowCount; r++) {
                            let subRow = obj_name.split('RX').join('R' + r)
                            this.setChangeObject(subRow,this.dataTableObjectArray[e].object_name)
                          }
                        } else {
                          this.setChangeObject(obj_name,this.dataTableObjectArray[e].object_name)
                        }
                      } else {
                        this.setChangeObject(obj_name,this.dataTableObjectArray[e].object_name)
                      }
                      obj_name = ""
                      isHead = false
                      isTail = true
                    }
                  }
                }
                nums.forEach(e2 => {
                  if(e2.startsWith('datatable')) {
                    if(e2.includes('RX')) {
                      var dataObj = this.objectArray['datatable'].find(item => item.object_name == e2.split('_')[0])
                      if(dataObj) {
                        dataObj.style.table.crow = dataObj.style.table.rowsize.length
                        var rowCount = Number(dataObj.style.table.crow)
                        for(let r=1; r<=rowCount; r++) {
                          let subRow = e2.split('RX').join('R' + r)
                          this.setChangeObject(subRow,this.dataTableObjectArray[e].object_name)
                        }
                      } else {
                        this.setChangeObject(e2,this.dataTableObjectArray[e].object_name)
                      }
                    } else {
                      this.setChangeObject(e2,this.dataTableObjectArray[e].object_name)
                    }
                  } else {
                    this.setChangeObject(e2,this.dataTableObjectArray[e].object_name)
                  }
                })
              } else if(operand == 'calc') {
                var nums = fx.split('calc(')[1].trim()
                nums = "(" + nums
                var num_array = nums.split('$')
                for(let i=0; i< num_array.length; i++) {
                  var obj_name = ""
                  var isHead = true
                  var isTail = false
                  for(let j=0; j < num_array[i].length; j++) {
                    if((num_array[i].charAt(j) != "+" && num_array[i].charAt(j) != "-" && num_array[i].charAt(j) != "*"  && num_array[i].charAt(j) != ":" 
                      && num_array[i].charAt(j) != "/" && num_array[i].charAt(j) != "%" && num_array[i].charAt(j) != ")" && num_array[i].charAt(j) != "(")
                      && isHead) {
                        obj_name += num_array[i].charAt(j)
                    } else if(!isTail && isHead){
                      this.setChangeObject(obj_name,this.dataTableObjectArray[e].object_name)
                      isHead = false
                      isTail = true
                    }
                  }
                }
              }
            } else if(this.dataTableObjectArray[e].object_type == 'datepickerbox') {
              this.dataTableObjectArray[e].rangeDate = ""
              if(!this.dataTableObjectArray[e].value && !this.dataTableObjectArray[e].style.defaultDateSelect && !this.dataTableObjectArray[e].style.noDefaultDate && !this.dataTableObjectArray[e].isValued) {
                this.dataTableObjectArray[e].value = new Date().toISOString().substr(0, 10)
                this.dataTableObjectArray[e].isValued = true
              }
              var startDate = this.dataTableObjectArray[e].value
              if(this.dataTableObjectArray[e].style.startDateType == "current") {
                this.dataTableObjectArray[e].rangeDate = new Date().toISOString().substr(0, 10)
                if(this.dataTableObjectArray[e].style.startDateFrom) {
                  var tempDate = new Date()
                  tempDate.setDate(tempDate.getDate() + Number(this.dataTableObjectArray[e].style.startDateFrom))
                  this.dataTableObjectArray[e].rangeDate = tempDate.toISOString().substr(0, 10)
                }
              } else if (this.dataTableObjectArray[e].style.startDateType == "custom") {
                if(this.dataTableObjectArray[e].style.startDateValue) {
                  this.dataTableObjectArray[e].rangeDate = new Date(this.dataTableObjectArray[e].style.startDateValue).toISOString().substr(0, 10)
                } else {
                  this.dataTableObjectArray[e].rangeDate = new Date().toISOString().substr(0, 10)
                }
              }
              if(this.dataTableObjectArray[e].style.defaultDateSelect != '' && typeof this.dataTableObjectArray[e].style.defaultDateSelect !== 'undefined') {
                if(this.dataTableObjectArray[e].style.defaultDateSelect == 'custom' && !this.dataTableObjectArray[e].style.noDefaultDate) {
                  if(this.dataTableObjectArray[e].style.defaultDateValue) {
                    startDate = new Date(this.dataTableObjectArray[e].style.defaultDateValue).toISOString().substr(0, 10)
                    this.dataTableObjectArray[e].value = startDate
                  }
                } else if(this.dataTableObjectArray[e].style.defaultDateSelect == 'ref_date' && !this.dataTableObjectArray[e].style.noDefaultDate) {
                  var refDate = this.objectArray["datepickerbox"].find(item => item.object_name == this.dataTableObjectArray[e].style.defaultDateValue)
                  if(refDate) {
                    var holdDate = new Date(refDate.value)
                    if(this.dataTableObjectArray[e].style.additionYear) {
                      holdDate.setFullYear(holdDate.getFullYear() + Number(this.dataTableObjectArray[e].style.additionYear))
                    }
                    if(this.dataTableObjectArray[e].style.additionMon) {
                      holdDate.setMonth(holdDate.getMonth() + Number(this.dataTableObjectArray[e].style.additionMon))
                    }
                    if(this.dataTableObjectArray[e].style.additionDate) {
                      holdDate.setDate(holdDate.getDate() + Number(this.dataTableObjectArray[e].style.additionDate))
                    }
                    startDate = holdDate.toISOString().substr(0, 10)
                  }
                  this.dataTableObjectArray[e].value = startDate
                }
              }
            } else if(this.dataTableObjectArray[e].object_type == 'inputbox') {
              if(this.dataTableObjectArray[e].style.defaultValueObj) {
                if(typeof this.changeDefaultDict[this.dataTableObjectArray[e].style.defaultValueObj] !== 'undefined' && !this.changeDefaultDict[this.dataTableObjectArray[e].style.defaultValueObj].includes(e)) {
                  this.changeDefaultDict[this.dataTableObjectArray[e].style.defaultValueObj].push(e)
                } else {
                  this.changeDefaultDict[this.dataTableObjectArray[e].style.defaultValueObj] = [e]
                }
              }
            }
          }
        })
        this.setChangeDict()
        if(isCal) {
          if(Object.keys(this.dataTableObjectArray).length) {
            Object.keys(this.dataTableObjectArray).forEach(e => {
              if(this.dataTableObjectArray[e].style.hideOption) {
                if(typeof this.changeHideDict[e] === 'undefined') {
                  this.setHideChangeDict(this.dataTableObjectArray[e].style.hideOption, this.dataTableObjectArray[e].object_name)
                } 
              }
              var calType = ['datepickerbox', 'inputbox', 'timebox', 'linkdatabox', 'dropdownbox']
              if(calType.includes(this.dataTableObjectArray[e].object_type)) {
                this.change_calculate(e,false)
              }
            })
          }
        }
      },
      changeDataTableValue(objName, row, col, colCount){
        var dataName = objName + "_R" + row + 'C' + col
        var val = this.dataTableObjectArray[dataName].value
        if(typeof this.dataTableObjectArray[dataName].valueList[val] === 'undefined') {
          val = this.dataTableObjectArray[dataName].value = 0
        }
        for(let i=1; i<=parseInt(colCount); i++) {
          var name = objName + "_R" + row + 'C' + i
          if(this.dataTableObjectArray[name].object_type == 'linkdatabox') {
            this.dataTableObjectArray[name].value = val
            this.dataTableObjectArray[name].show_value = this.dataTableObjectArray[name].valueList[val].text
          }
          this.change_calculate(name ,false)
          if(this.dataTableObjectArray[name].object_type == 'calculatebox') {
            this.checkChangeDefault(false, name)
          }
        }

      },
      getTextAreaValue(obj) {
        if(typeof obj.style.textAreaValiable !== 'undefined' && typeof obj.defaultValue !== 'undefined') {
          var textValue = obj.defaultValue
          obj.style.textAreaValiable.forEach (e => {
            if(e.value == '') {
              textValue = textValue.split('[$' + e.text + ']').join(" ")
            } else {
              textValue = textValue.split('[$' + e.text + ']').join(e.value)
            }
          })
          obj.value = textValue
        }
        return obj.value
      },
      selectObject(item, type) {
          this.selected_array = type
          this.selected_object = this.dataDict[item.object_name].arrayIndex
      },
      initailDatabind(obj) {
        var item = obj.value.show
        var value = {isUser: true, show: item, isValued: false }
        // if(typeof obj.value.show_index === 'undefined') {
        if(false) {
          value = {
            isUser: false,
            show: item,
            isValued: false
          }
        } else {
          if(!obj.value.isValued) {
            value.isValued = true
            if(item == 'firstname_th' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index= this.one_result_data.first_name_th
              }
            } else if(item == 'lastname_th' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index = this.one_result_data.last_name_th
              }
            } else if(item == 'fullname_th' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index = this.one_result_data.account_title_th + ' ' + this.one_result_data.first_name_th + ' ' +this.one_result_data.last_name_th
              }
            } else if(item == 'fullname_en' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index = this.one_result_data.account_title_eng + ' ' + this.one_result_data.first_name_eng + ' ' +this.one_result_data.last_name_eng
              }
            } else if(item == 'doc_no' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined') {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              }
            } else if(item == 'firstname_en' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index = this.one_result_data.first_name_eng
              }
            } else if(item == 'lastname_en' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index = this.one_result_data.last_name_eng
              }
            } else if(item == 'role_name' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
                  value.show_index = sessionStorage.getItem('selected_role')
                } else {
                  value.show_index = 'undefined'
                }
              }
            } else if(item == 'account_title_th' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index = this.one_result_data.account_title_th
              }
            } else if(item == 'account_title_eng' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index = this.one_result_data.account_title_eng
              }
            } else if((item == 'email' || item == 'thai_email') && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                if(JSON.parse(sessionStorage.getItem('selected_business')).id &&
                typeof JSON.parse(sessionStorage.getItem('selected_business')).citizen_data !== 'undefined' &&
                typeof JSON.parse(sessionStorage.getItem('selected_business')).citizen_data[0] !== 'undefined' &&
                typeof JSON.parse(sessionStorage.getItem('selected_business')).citizen_data[0].email !== 'undefined') {
                  value.show_index = this.one_result_data.email[0].email = JSON.parse(sessionStorage.getItem('selected_business')).citizen_data[0].email
                } else {
                  if(this.one_result_data.email) {
                    value.show_index = this.one_result_data.email[0].email
                  } else {
                    value.show_index = 'undefined'
                  }
                }
              }
            }  else if(item == 'one_email' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                if(JSON.parse(sessionStorage.getItem("userprofile"))) {
                  value.show_index = JSON.parse(sessionStorage.getItem("userprofile")).email
                } else {
                  value.show_index = 'undefined'
                }
              }
            } else if(item == 'employee_id' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
                  if(JSON.parse(sessionStorage.getItem('selected_business')).citizen_data) {
                    if(JSON.parse(sessionStorage.getItem('selected_business')).citizen_data.length) {
                      value.show_index = JSON.parse(sessionStorage.getItem('selected_business')).citizen_data[0].employee_id
                    } else {
                      value.show_index = 'undefined'
                    }
                  } else {
                    value.show_index = 'undefined'
                  }
                } else {
                  value.show_index = 'undefined'
                }
              }
            } else if(item == 'leader_name_th' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
                  this.getLeaderInfo(JSON.parse(sessionStorage.getItem('selected_business')).id_card_num).then(res => {
                    value.isUser = true
                    value.withChoices = true
                    value.choices = res.map(item => item.thai_name)
                    if(value.choices.length) {
                      value.show_index = value.choices[0]
                    }
                    obj.value = value
                    this.changeLeaderName(obj)
                  })
                }
              }
            } else if(item == 'leader_name_eng' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
                  this.getLeaderInfo(JSON.parse(sessionStorage.getItem('selected_business')).id_card_num).then(res => {
                    value.isUser = true
                    value.withChoices = true
                    value.choices = res.map(item => item.eng_name)
                    if(value.choices.length) {
                      value.show_index = value.choices[0]
                    }
                    obj.value = value
                    this.changeLeaderName(obj)
                  })
                }
              }
            } else if(item == 'one_department' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
                  if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
                    if(JSON.parse(sessionStorage.getItem('selected_business')).dept_name) {
                      value.isUser = true
                      value.withChoices = true
                      value.choices = JSON.parse(sessionStorage.getItem('selected_business')).dept_name
                      if(value.choices.length) {
                        value.show_index = value.choices[0]
                      }
                      obj.value = value
                    } else {
                      value.show_index = 'undefined'
                    }
                  }
                }
              }
            } else if(item == 'tel_no' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                if(this.one_result_data.mobile) {
                  value.show_index = this.one_result_data.mobile[0].mobile_no
                } else {
                  value.show_index = "undefined"
                }
              }
            } else if(item == 'bussiness_address' && !this.isPublic) {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                var bizz_add = {house_no:"", building_name: "", floor: "", street:"", zipcode_tambon: "",
                zipcode_amphoe: "", zipcode_zipcode: ""}
                if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
                  if(JSON.parse(sessionStorage.getItem('selected_business')).biz_details) {
                    bizz_add = JSON.parse(sessionStorage.getItem('selected_business')).biz_details[0].address
                  }
                  var full_address = ""
                  if(bizz_add.house_no) {
                    full_address += bizz_add.house_no + " "
                  }
                  if(bizz_add.building_name) {
                    full_address += "อาคาร" + bizz_add.building_name + " "
                  }
                  if(bizz_add.floor) {
                    full_address += "ชั้น" + bizz_add.floor + " "
                  }
                  if(bizz_add.street) {
                    full_address += "ถนน" + bizz_add.street + " "
                  }
                  if(bizz_add.zipcode_tambon) {
                    full_address += "แขวง" + bizz_add.zipcode_tambon + " "
                  }
                  if(bizz_add.zipcode_amphoe) {
                    full_address += "เขต" + bizz_add.zipcode_amphoe + " "
                  }
                  if(bizz_add.zipcode_zipcode) {
                    full_address += bizz_add.zipcode_zipcode + " "
                  }
                  value.show_index = full_address
                } else {
                  value.show_index = 'undefined'
                }
              }
            } else if(item == 'sys_cus_name') {
              if(!value.show_index) {
                value.show_index = ""
              }
            } else if(item == 'function') {
              if(obj.style.function) {
                value.show_index = obj.style.function
              } else {
                value.show_index = 'undefined'
              }
            } else if(item == 'ref_no') {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index = this.refDocNo
              }
            } else if(item == 'ref_data') {
              if(typeof obj.value.show_index === 'undefined' || obj.disable) {
                value = {
                  isUser: false,
                  show: item,
                  isValued: false
                }
              } else {
                value.show_index = ""
              }
            } else {
              value.isUser = false
              if(!(typeof this.dataDict[item] === 'undefined')) {
                value.show_array = this.dataDict[item].objectType
                value.show_index = this.dataDict[item].arrayIndex        
              } else {
                if(typeof this.dataTableObjectArray[item] !== 'undefined') {
                  value.show_array = 'datatable'
                  value.show_index = item 
                } else {
                  value.show_index = 'undefined'
                }
              }
            }
            if(value.show_index == null || value.show_index == 'undefined') {
                value.show_index = 'undefined'
            } else if(!value.isUser && !(value.show_index == null || value.show_index == 'undefined') && !(value.show_array == 'datatable')) {
                value.show_index = parseInt(value.show_index)
            }
          } else {
            value = obj.value
          }
        }

        return value
      },
      getSign(obj) {
        var imageUrl = ""
        if(!obj.disable && !obj.style.isCa) {
          imageUrl = sessionStorage.getItem("sign_url")
        } else if(!(typeof obj.value === 'undefined') && !(obj.value == '')) {
          imageUrl = obj.value
        } else if(obj.style.isCa) {
          imageUrl = obj.value
        }
        return imageUrl
      },
      change_fontstyle(obj) {
        var font_style = obj.style.font_style
        var font_style_value = ''
        font_style.forEach( e => {
          if(e == "b") {
            font_style_value = font_style_value + 'font-weight: bold;'
          } else if(e == 'i') {
            font_style_value = font_style_value + 'font-style: italic;'
          } else if(e == "u") {
            font_style_value = font_style_value + 'text-decoration: underline;'
          }
        })
        return font_style_value
      },
      changeDropDownChoice(obj) {
        var isImportInRow = false
        var selectedRow = 0
        if(obj.style.importInRow) {
          isImportInRow = obj.style.importInRow
          selectedRow = obj.object_name.split('_R')[1].split('C')[0]
        }
        if(typeof this.dropdownChangeDict[obj.object_name] !== 'undefined') {
          var changeDropDownList = this.dropdownChangeDict[obj.object_name]
          changeDropDownList.forEach(e => {
            if(e.startsWith("datatable")) {
              if(!this.dataTableObjectArray[e].style.autoChoices) {
                if(this.dataTableObjectArray[e].style.alterChoices[obj.value] !== 'undefined') {
                  this.dataTableObjectArray[e].choices = this.dataTableObjectArray[e].style.alterChoices[obj.value]
                  if(!this.dataTableObjectArray[e].choices.includes("")) {
                    var tempChoice = [""]
                    this.dataTableObjectArray[e].choices = tempChoice.concat(this.dataTableObjectArray[e].choices)
                  }
                } else {
                  this.dataTableObjectArray[e].choices = []
                }
              } else {
                var value = ""
                if(obj.style.autoChoicesSelect == 'pro_th' ||obj.style.autoChoicesSelect == 'pro_en') {
                  value = obj.value.provinces_id
                } else if(obj.style.autoChoicesSelect == 'dis_th' ||obj.style.autoChoicesSelect == 'dis_en') {
                  value = obj.value.amphure_id
                } else if(obj.style.autoChoicesSelect == 'subdis_th' ||obj.style.autoChoicesSelect == 'subdis_en') {
                  if(this.dataTableObjectArray[e].style.autoChoicesSelect == 'post')  {
                    this.dataTableObjectArray[e].choices = [""]
                    this.dataTableObjectArray[e].choices.push({text:obj.value.zip_code, value:obj.value})
                    this.dataTableObjectArray[e].value = obj.value
                  }
                }
                var resChoices = []
                if(value) {
                  this.getProvinces(this.dataTableObjectArray[e].style.autoChoicesSelect, value).then(res => {
                    var tempChoice = [""]
                    res.forEach(e => {
                      if(this.dataTableObjectArray[e].style.autoChoicesSelect.endsWith('th')) {
                        tempChoice.push({text:e.name_th, value:e})
                      } else {
                        tempChoice.push({text:e.name_en, value:e})
                      }
                    })
                    this.dataTableObjectArray[e].choices = tempChoice
                  })
                }
              }
            } else if(typeof this.dataDict[e] !== 'undefined') {
              var ddIndex = this.dataDict[e].arrayIndex
              if(!this.objectArray['dropdownbox'][ddIndex].style.autoChoices) {
                if(this.objectArray['dropdownbox'][ddIndex].style.alterChoices[obj.value] !== 'undefined') {
                  this.objectArray['dropdownbox'][ddIndex].choices = this.objectArray['dropdownbox'][ddIndex].style.alterChoices[obj.value]
                } else {
                  this.objectArray['dropdownbox'][ddIndex].choices = []
                }
              } else {
                var value = ""
                if(obj.style.autoChoicesSelect == 'pro_th' ||obj.style.autoChoicesSelect == 'pro_en') {
                  value = obj.value.value.provinces_id
                } else if(obj.style.autoChoicesSelect == 'dis_th' ||obj.style.autoChoicesSelect == 'dis_en') {
                  value = obj.value.value.amphure_id
                } else if(obj.style.autoChoicesSelect == 'subdis_th' ||obj.style.autoChoicesSelect == 'subdis_en') {
                  if(this.objectArray['dropdownbox'][ddIndex].style.autoChoicesSelect == 'post')  {
                    this.objectArray['dropdownbox'][ddIndex].choices = [""]
                    this.objectArray['dropdownbox'][ddIndex].choices.push({text: obj.value.value.zip_code, value: obj.value.value})
                    this.objectArray['dropdownbox'][ddIndex].value =  {text: obj.value.value.zip_code, value: obj.value.value}
                  }
                }
                var resChoices = []
                if(value) {
                  this.getProvinces(this.objectArray['dropdownbox'][ddIndex].style.autoChoicesSelect, value).then(res => {
                    var tempChoice = [""]
                    res.forEach(e => {
                      if(this.objectArray['dropdownbox'][ddIndex].style.autoChoicesSelect.endsWith('th')) {
                        tempChoice.push({text:e.name_th, value:e})
                      } else {
                        tempChoice.push({text:e.name_en, value:e})
                      }
                    })
                    this.objectArray['dropdownbox'][ddIndex].choices = tempChoice
                  })
                }
              }
            }
          })
        }
        this.change_calculate(obj.object_name, false)
        if(obj.style.autoChoicesSelect == 'cvm_id' && !this.onImport) {
          this.importType = 'cvm'
          this.checkImportType(obj.value, isImportInRow, selectedRow)
        }
        if(obj.style.autoChoicesSelect == 'so' && !this.onImport) {
          this.importType = 'so'
          this.checkImportType(obj.value, isImportInRow, selectedRow)
        }
        if(obj.style.autoChoicesSelect == 'invoice' && !this.onImport) {
          this.importType = 'invoice'
          this.checkImportType(obj.value, isImportInRow, selectedRow)
        }
        if(obj.style.autoChoicesSelect == 'cus_id' && !this.onImport) {
          this.getInvioceFromCus(obj.value, obj.object_name)
        }
      },
      change_calculate(objectName,isCalculate, calStack) {
        this.datechange = true
        var allChangeObject = []
        if(isCalculate) {
          allChangeObject.push(objectName)
        } else {
          allChangeObject = this.changeDict[objectName]
        }
        if(!(typeof allChangeObject === 'undefined')) {
          var tmpAllChange = []
          allChangeObject.forEach(ch => {
            if(!ch.startsWith('datatable')) {
              if(this.dataDict[ch].objectType == 'autofillbox') {
                var chList = this.changeDict[ch]
                if(!(typeof chList === 'undefined')) {
                  chList.forEach(cl => {
                    if(!tmpAllChange.includes(cl)) {
                      tmpAllChange.push(cl)
                    }
                  })
                }
              } else {
                tmpAllChange.push(ch)
              }
            } else {
              tmpAllChange.push(ch)
            }
          })
          allChangeObject = tmpAllChange
          allChangeObject.forEach(changeObj => {
            try {
            var e = {}
            if(changeObj.startsWith('datatable')) {
              e = this.dataTableObjectArray[changeObj]
            } else {
              var changeArray = this.dataDict[changeObj].arrayIndex
              e = this.objectArray['calculatebox'][changeArray]
            }
            var exValue = e.value
            if(e.object_type != 'calculatebox') {
              // if(!calStack) {
              //   this.change_calculate(e.object_name, false, true)
              // }
            } else {
              if(typeof e.style.decimal === 'undefined' || e.style.decimal == null) {
                e.style.decimal = 0
              }
              e.value = 0
              var fx = e.style.function
              var operand = fx.split('(')[0]
              if(operand == 'sum' || operand == 'sumif') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                var cond = ""
                if(operand == 'sumif') {
                  cond = nums.split(':')[1]
                  nums = nums.split(':')[0]
                }
                nums = nums.split(',')
                nums.forEach(e2 => {
                  if(e2.startsWith('datatable')) {
                    if(e2.includes('RX')) {
                      var subNums = []
                      var dataObj = this.objectArray['datatable'].find(item => item.object_name == e2.split('_')[0])
                      if(dataObj) {
                        dataObj.style.table.crow = dataObj.style.table.rowsize.length
                        var rowCount = Number(dataObj.style.table.crow)
                        for(let r=1; r<=rowCount; r++) {
                          if(cond) {
                            var tempCond = cond
                            var obj_name = ""
                            var isHead = true
                            var isTail = false
                            for(let j=0; j<tempCond.length; j++) {
                              if((tempCond.charAt(j) != "=" && tempCond.charAt(j) != "!" && tempCond.charAt(j) != "&"  && tempCond.charAt(j) != "|" 
                                && tempCond.charAt(j) != ">" && tempCond.charAt(j) != "<")
                                && isHead) {
                                  obj_name += tempCond.charAt(j)
                              } else if(!isTail && isHead){
                                  if(obj_name.includes('RX')) {
                                    var tempObjName = obj_name
                                    obj_name = obj_name.split('RX').join('R' + r)
                                    tempCond = tempCond.split(tempObjName).join("'"+this.checkObject(obj_name,true).split(',').join("")+"'")
                                  } else {
                                    tempCond = tempCond.split(obj_name).join("'"+this.checkObject(obj_name,true).split(',').join("")+"'")
                                  }
                                obj_name = ""
                                isHead = false
                                isTail = true
                              }
                            }
                            if (Function('"use strict";return (' + tempCond + ')')()) {
                              var subObj = e2.split('RX').join('R' + r)
                              if(typeof this.dataTableObjectArray[subObj] !== 'undefined' && this.dataTableObjectArray[subObj].value != "" && this.dataTableObjectArray[subObj].value != null) {
                                if(this.dataTableObjectArray[subObj].object_type == 'linkdatabox') {
                                  if(!isNaN(parseFloat(this.dataTableObjectArray[subObj].valueList[this.dataTableObjectArray[subObj].value].text))) {
                                    e.value += parseFloat(this.dataTableObjectArray[subObj].valueList[this.dataTableObjectArray[subObj].value].text)
                                  }
                                } else {
                                  if(!isNaN(parseFloat(this.dataTableObjectArray[subObj].value))) {
                                    e.value += parseFloat(this.dataTableObjectArray[subObj].value)
                                  }
                                }
                              }
                            }
                          } else {
                            var subObj = e2.split('RX').join('R' + r)
                            if(typeof this.dataTableObjectArray[subObj] !== 'undefined' && this.dataTableObjectArray[subObj].value != "" && this.dataTableObjectArray[subObj].value != null) {
                              if(this.dataTableObjectArray[subObj].object_type == 'linkdatabox') {
                                if(!isNaN(parseFloat(this.dataTableObjectArray[subObj].valueList[this.dataTableObjectArray[subObj].value].text))) {
                                  e.value += parseFloat(this.dataTableObjectArray[subObj].valueList[this.dataTableObjectArray[subObj].value].text)
                                }
                              } else {
                                if(!isNaN(parseFloat(this.dataTableObjectArray[subObj].value))) {
                                  e.value += parseFloat(this.dataTableObjectArray[subObj].value)
                                  }
                                }
                              }
                            }
                          }
                      }
                    } else {
                      if(typeof this.dataTableObjectArray[e2] !== 'undefined' && this.dataTableObjectArray[e2].value != "" && this.dataTableObjectArray[e2].value != null) {
                        if(cond) {
                          if(this.getCond(cond)) {
                            e.value += parseFloat(this.dataTableObjectArray[e2].value)
                            if(this.dataTableObjectArray[e2].object_type == 'linkdatabox') {
                              if(!isNaN(parseFloat(this.dataTableObjectArray[e2].valueList[this.dataTableObjectArray[e2].value].text))) {
                                e.value += parseFloat(this.dataTableObjectArray[e2].valueList[this.dataTableObjectArray[e2].value].text)
                              }
                            } else {
                              if(!isNaN(parseFloat(this.dataTableObjectArray[e2].value))) {
                                e.value += parseFloat(this.dataTableObjectArray[e2].value)
                              }
                            }
                          }
                        } else {
                          if(this.dataTableObjectArray[e2].object_type == 'linkdatabox') {
                            if(!isNaN(parseFloat(this.dataTableObjectArray[e2].valueList[this.dataTableObjectArray[e2].value].text))) {
                              e.value += parseFloat(this.dataTableObjectArray[e2].valueList[this.dataTableObjectArray[e2].value].text)
                            }
                          } else {
                            if(!isNaN(parseFloat(this.dataTableObjectArray[e2].value))) {
                              e.value += parseFloat(this.dataTableObjectArray[e2].value)
                            }
                          }
                        }
                      }
                    }
                  } else if(typeof this.dataDict[e2] != 'undefined') {
                    var objType = this.dataDict[e2].objectType
                    var arryIndex = this.dataDict[e2].arrayIndex
                    if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                      if(cond) {
                        if(this.getCond(cond)) {
                          if(!isNaN(parseFloat(this.objectArray[objType][arryIndex].value))) {
                            e.value += parseFloat(this.objectArray[objType][arryIndex].value)
                          }
                        }
                      } else {
                        if(!isNaN(parseFloat(this.objectArray[objType][arryIndex].value))) {
                          e.value += parseFloat(this.objectArray[objType][arryIndex].value)
                        }
                      }
                    }
                  }
                })
                if(!(typeof e.value === 'undefined' || e.value == null)) {
                  e.value = this.fixJSRound(e)
                  var holdShowVal = e.value
                  e.valueShow = holdShowVal.toFixed(e.style.decimalShow)
                  e.value = e.value.toFixed(e.style.decimal)
                }
              } else if(operand == 'sub') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(typeof this.dataDict[e2] != 'undefined') {
                    var objType = this.dataDict[e2].objectType
                    var arryIndex = this.dataDict[e2].arrayIndex
                    if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                      value_array.push(parseFloat(this.objectArray[objType][arryIndex].value))
                    }
                  }
                })
                e.value = value_array[0]
                for(var i=1; i<value_array.length; i++) {
                  e.value -= value_array[i]
                }
                if(!(typeof e.value === 'undefined' || e.value == null)) {
                  e.value = this.fixJSRound(e)
                  var holdShowVal = e.value
                  e.valueShow = holdShowVal.toFixed(e.style.decimalShow)
                  e.value = e.value.toFixed(e.style.decimal)
                }
              } else if(operand == 'mul') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(typeof this.dataDict[e2] != 'undefined') {
                    var objType = this.dataDict[e2].objectType
                    var arryIndex = this.dataDict[e2].arrayIndex
                    if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                      value_array.push(parseFloat(this.objectArray[objType][arryIndex].value))
                    }
                  }
                })
                e.value = value_array[0]
                for(var i=1; i<value_array.length; i++) {
                  e.value *= value_array[i]
                }
                if(!(typeof e.value === 'undefined' || e.value == null)) {
                  e.value = this.fixJSRound(e)
                  var holdShowVal = e.value
                  e.valueShow = holdShowVal.toFixed(e.style.decimalShow)
                  e.value = e.value.toFixed(e.style.decimal)
                }
              } else if(operand == 'dvd') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(typeof this.dataDict[e2] != 'undefined') {
                    var objType = this.dataDict[e2].objectType
                    var arryIndex = this.dataDict[e2].arrayIndex
                    if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                      value_array.push(parseFloat(this.objectArray[objType][arryIndex].value))
                    }
                  }
                })
                e.value = value_array[0]
                for(var i=1; i<value_array.length; i++) {
                  e.value /= value_array[i]
                }
                if(!(typeof e.value === 'undefined' || e.value == null)) {
                  e.value = this.fixJSRound(e)
                  var holdShowVal = e.value
                  e.valueShow = holdShowVal.toFixed(e.style.decimalShow)
                  e.value = e.value.toFixed(e.style.decimal)
                }
              } else if(operand == 'avg') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                nums.forEach(e2 => {
                  if(typeof this.dataDict[e2] != 'undefined') {
                    var objType = this.dataDict[e2].objectType
                    var arryIndex = this.dataDict[e2].arrayIndex
                    if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                      e.value += parseFloat(this.objectArray[objType][arryIndex].value)
                    }
                  }
                })
                e.value = (e.value/nums.length)
                if(!(typeof e.value === 'undefined' || e.value == null)) {
                  e.value = this.fixJSRound(e)
                  e.value = e.value.toFixed(e.style.decimal)
                }
              } else if(operand == 'min') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(typeof this.dataDict[e2] != 'undefined') {
                    var objType = this.dataDict[e2].objectType
                    var arryIndex = this.dataDict[e2].arrayIndex
                    if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                      value_array.push(parseFloat(this.objectArray[objType][arryIndex].value))
                    }
                  }
                })
                e.value = value_array[0]
                value_array.forEach(e3 => {
                  if(e3 <= e.value) {
                    e.value = e3
                  }
                })
              } else if(operand == 'max') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(e2.startsWith('datatable')) {
                    if(this.dataTableObjectArray[e2].value) {
                      value_array.push(this.dataTableObjectArray[e2].value)
                    }
                  } else {
                    if(typeof this.dataDict[e2] != 'undefined') {
                      var objType = this.dataDict[e2].objectType
                      var arryIndex = this.dataDict[e2].arrayIndex
                      if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                        value_array.push(parseFloat(this.objectArray[objType][arryIndex].value))
                      }
                    }
                  }
                })
                e.value = value_array[0]
                value_array.forEach(e3 => {
                  if(e3 >= e.value) {
                    e.value = e3
                  }
                })
              } else if(operand == 'diffDate') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(e2.startsWith('datatable')) {
                    if(this.dataTableObjectArray[e2].value) {
                      value_array.push(this.dataTableObjectArray[e2].value)
                    }
                  } else {
                    if(typeof this.dataDict[e2] != 'undefined') {
                      var objType = this.dataDict[e2].objectType
                      var arryIndex = this.dataDict[e2].arrayIndex
                      if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                        value_array.push(this.objectArray[objType][arryIndex].value)
                      }
                    }
                  }
                })
                if(value_array.length >= 2) {
                  e.value = this.getDiffDays(value_array[0], value_array[1])
                  e.valueShow = this.getDiffDays(value_array[0], value_array[1])
                } else {
                  e.value = 0
                  e.valueShow = 0
                }
              } else if(operand == 'lenDate') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(e2.startsWith('datatable')) {
                    if(this.dataTableObjectArray[e2].value) {
                      value_array.push(this.dataTableObjectArray[e2].value)
                    }
                  } else {
                    if(typeof this.dataDict[e2] != 'undefined') {
                      var objType = this.dataDict[e2].objectType
                      var arryIndex = this.dataDict[e2].arrayIndex
                      if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                        value_array.push(this.objectArray[objType][arryIndex].value)
                      }
                    }
                  }
                })
                if(value_array.length >= 2) {
                  e.value = new Date(value_array[0]).getDate() - new Date(value_array[1]).getDate()
                  e.valueShow = new Date(value_array[0]).getDate() - new Date(value_array[1]).getDate()
                } else {
                  e.value = 0
                  e.valueShow = 0
                }
              } else if(operand == 'diffMon') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(e2.startsWith('datatable')) {
                    if(this.dataTableObjectArray[e2].value) {
                      value_array.push(this.dataTableObjectArray[e2].value)
                    }
                  } else {
                    if(typeof this.dataDict[e2] != 'undefined') {
                      var objType = this.dataDict[e2].objectType
                      var arryIndex = this.dataDict[e2].arrayIndex
                      if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                        value_array.push(this.objectArray[objType][arryIndex].value)
                      }
                    }
                  }
                })
                if(value_array.length >= 2) {
                  e.value = this.getDiffMons(value_array[0], value_array[1])
                  e.valueShow = this.getDiffMons(value_array[0], value_array[1])
                } else {
                  e.value = 0
                  e.valueShow = 0
                }
              } else if(operand == 'diffTime') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(e2.startsWith('datatable')) {
                    if(this.dataTableObjectArray[e2].value) {
                      value_array.push(this.dataTableObjectArray[e2].value)
                    }
                  }
                  else {
                    if(typeof this.dataDict[e2] != 'undefined') {
                    var objType = this.dataDict[e2].objectType
                    var arryIndex = this.dataDict[e2].arrayIndex
                    if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                      value_array.push(this.objectArray[objType][arryIndex].value)
                    }
                  }
                  }
                })
                if(value_array.length >= 2) {
                  e.value = this.getDiffTime(value_array[0], value_array[1])
                  e.valueShow = this.getDiffTime(value_array[0], value_array[1])
                } else {
                  e.value = 0
                  e.valueShow = 0
                }
              } else if(operand == 'diffTimeHr') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(e2.startsWith('datatable')) {
                    if(this.dataTableObjectArray[e2].value) {
                      value_array.push(this.dataTableObjectArray[e2].value)
                    }
                  } else {
                    if(typeof this.dataDict[e2] != 'undefined') {
                      var objType = this.dataDict[e2].objectType
                      var arryIndex = this.dataDict[e2].arrayIndex
                      if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                        value_array.push(this.objectArray[objType][arryIndex].value)
                      }
                    }
                  }
                })
                if(value_array.length >= 2) {
                  e.value = this.getDiffTime(value_array[0], value_array[1]).split(':')[0]
                  e.valueShow = this.getDiffTime(value_array[0], value_array[1]).split(':')[0]
                } else {
                  e.value = 0
                  e.valueShow = 0
                }
              } else if(operand == 'diffTimeMn') {
                var nums = fx.split('(')[1]
                nums = nums.split(')')[0]
                nums = nums.split(',')
                var value_array = []
                nums.forEach(e2 => {
                  if(e2.startsWith('datatable')) {
                    if(this.dataTableObjectArray[e2].value) {
                      value_array.push(this.dataTableObjectArray[e2].value)
                    }
                  } else {
                    if(typeof this.dataDict[e2] != 'undefined') {
                      var objType = this.dataDict[e2].objectType
                      var arryIndex = this.dataDict[e2].arrayIndex
                      if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null) {
                        value_array.push(this.objectArray[objType][arryIndex].value)
                      }
                    }
                  }
                })
                if(value_array.length >= 2) {
                  e.value = this.getDiffTime(value_array[0], value_array[1]).split(':')[1]
                } else {
                  e.value = 0
                  e.valueShow = 0
                }
              } else if(operand == 'calc') {
                var nums = fx.split('calc(')[1].trim()
                nums = "(" + nums
                if(this.checkValidFx(nums)) {
                  var num_array = nums.split('$')
                  var sol = ""
                  for(let i=0; i< num_array.length; i++) {
                    var obj_name = ""
                    var isHead = true
                    var isTail = false
                    for(let j=0; j < num_array[i].length; j++) {
                      if(num_array[i].charAt(j) == "(") {
                        sol += num_array[i].charAt(j)
                      } else if((num_array[i].charAt(j) != "+" && num_array[i].charAt(j) != "-" && num_array[i].charAt(j) != "*" 
                        && num_array[i].charAt(j) != "/" && num_array[i].charAt(j) != "%" && num_array[i].charAt(j) != ")" && num_array[i].charAt(j) != "(")
                        && isHead) {
                          obj_name += num_array[i].charAt(j)
                      } else if(!isTail && isHead){
                        sol += parseFloat(this.checkObject(obj_name,true).split(',').join("")) + num_array[i].charAt(j)
                        isHead = false
                        isTail = true
                      } else if(isTail){
                        sol += num_array[i].charAt(j)
                      }
                    }
                  }

                  if(Function('"use strict";return (' + sol + ')')()) {
                    e.value = Function('"use strict";return (' + sol + ')')()
                    if(!(typeof e.value === 'undefined' || e.value == null)) {
                      if(e.style.noDecimal) {
                        e.value = Math.floor(e.value)
                        e.valueShow = e.value
                      } else {
                        if(e.style.decimal == 0) {
                          var holdShowVal = e.value
                          if(e.style.decimalShow == 0) {
                            e.valueShow = Math.round(holdShowVal)
                          } else {
                            e.valueShow = holdShowVal.toFixed(e.style.decimalShow)
                          }
                          e.value = Math.round(e.value)
                        } else {
                          var holdVal = e.value*100000
                          holdVal = holdVal.toFixed(e.style.decimal)
                          e.value = holdVal/100000
                          e.value = this.fixJSRound(e)
                          var holdShowVal = e.value
                          e.value = e.value.toFixed(e.style.decimal)
                          if(e.style.decimalShow == 0) {
                            e.valueShow = Math.round(holdShowVal)
                          } else {
                            e.valueShow = holdShowVal.toFixed(e.style.decimalShow)
                          }
                        }
                      }
                    }
                  } else {
                    e.value = 0
                    e.valueShow = 0
                  }
                } else {
                  e.value = 0
                  e.valueShow = 0
                }
              }
              if(e.value == 'Infinity' && e.style.isInfinityZero) {
                e.value = 0
                e.valueShow = 0
              }
              if(!(typeof e.value === 'undefined' || e.value == null)) {
                if(e.object_type == 'calculatebox' && !isCalculate) {
                  this.change_calculate(e.object_name,false)
                }
              }
              }
              if(exValue != e.value) {
                this.checkChangeDefault(false, e.object_name)
              }
            }
            catch(e) {
              e.value = 'สูตรคำนวณไม่ถูกต้อง'
            }
          })
        }
        if(typeof this.dropdownChangeDict[objectName] !== 'undefined') {
          if(objectName.startsWith('datatable')) {
           var item = this.dataTableObjectArray[objectName]
           if(item.object_type != 'dropdownbox') {
             this.changeDropDownChoice(item)
           }
          } else {
            var itemArray = this.dataDict[objectName].objectType
            var itemIndex = this.dataDict[objectName].arrayIndex
            var item = this.objectArray[itemArray][itemIndex]
            if(item.object_type != 'dropdownbox') {
              this.changeDropDownChoice(item)
            }
          }
        }
      },
      fixJSRound(e) {
        if(e.style.decimal) {
          var remain = 1/(Math.pow(10, (Number(e.style.decimal) + 1)))
          var reMainlLen = String(remain).split('.')[1].length
          var valueString = String(e.value).split('.')
          if(typeof valueString[1] !== 'undefined' && typeof reMainlLen !== 'undefined') {
            if(valueString[1].charAt(reMainlLen-1) !== 'undefined' && valueString[1].charAt(reMainlLen-1) != '4') {
              e.value = e.value + remain
            }
          }
        }

        return e.value
      },
      getCond(cond) {
        var obj_name = ""
        var isHead = true
        var isTail = false
        for(let j=0; j<cond.length; j++) {
          if((cond.charAt(j) != "=" && cond.charAt(j) != "!" && cond.charAt(j) != "&"  && cond.charAt(j) != "|" 
              && cond.charAt(j) != ">" && cond.charAt(j) != "<") && isHead) {
              obj_name += cond.charAt(j)
          } else if(!isTail && isHead){
            cond = cond.split(obj_name).join("'"+this.checkObject(obj_name,true)+"'")
            obj_name = ""
            isHead = false
            isTail = true
          }
        }
        return Function('"use strict";return (' + cond + ')')()
      },
      setChangeDict() {
        this.datechange = true
        this.objectArray['calculatebox'].forEach(e => {
          var fx = e.style.function
          var operand = fx.split('(')[0]
          if(operand == 'sum' || operand == 'sumif' || operand == 'sub' || operand == 'mul' || operand == 'dvd' || operand == 'avg' || 
          operand == 'min' || operand == 'max' || operand == 'diffDate' || operand == 'lenDate' || operand == 'diffMon' || operand == 'diffTime' || operand == 'diffTimeHr' || operand == 'diffTimeMn') {
            var nums = fx.split('(')[1]
            nums = nums.split(')')[0]
            nums = nums.split(',')
            var cond = ""
            if(operand == 'sumif') {
              cond = nums.split(':')[1]
              nums = nums.split(':')[0]
            }
            if(cond) {
              var obj_name = ""
              var isHead = true
              var isTail = false
              for(let j=0; j<cond.length; j++) {
                if((cond.charAt(j) != "=" && cond.charAt(j) != "!" && cond.charAt(j) != "&"  && cond.charAt(j) != "|" 
                  && cond.charAt(j) != ">" && cond.charAt(j) != "<")
                  && isHead) {
                    obj_name += cond.charAt(j)
                } else if(!isTail && isHead){
                  if(obj_name.includes('RX')) {
                    var dataObj = this.objectArray['datatable'].find(item => item.object_name == obj_name.split('_')[0])
                    if(dataObj) {
                      dataObj.style.table.crow = dataObj.style.table.rowsize.length
                      var rowCount = Number(dataObj.style.table.crow)
                      for(let r=1; r<=rowCount; r++) {
                        let subRow = obj_name.split('RX').join('R' + r)
                        this.setChangeObject(subRow,e.object_name)
                      }
                    }
                  } else {
                    this.setChangeObject(obj_name,e.object_name)
                  }
                  obj_name = ""
                  isHead = false
                  isTail = true
                }
              }
            }
            nums.forEach(e2 => {
              if(e2.startsWith('datatable')) {
                if(e2.includes('RX')) {
                  var dataObj = this.objectArray['datatable'].find(item => item.object_name == e2.split('_')[0])
                    if(dataObj) {
                      dataObj.style.table.crow = dataObj.style.table.rowsize.length
                      var rowCount = Number(dataObj.style.table.crow)
                      for(let r=1; r<=rowCount; r++) {
                        let subRow = e2.split('RX').join('R' + r)
                        this.setChangeObject(subRow,e.object_name)
                      }
                    }
                } else {
                  this.setChangeObject(e2,e.object_name)
                }
              } else {
                this.setChangeObject(e2,e.object_name)
              }
            })
          } else if(operand == 'calc') {
            var nums = fx.split('calc(')[1].trim()
            nums = "(" + nums
            var num_array = nums.split('$')
            for(let i=0; i< num_array.length; i++) {
              var obj_name = ""
              var isHead = true
              var isTail = false
              for(let j=0; j < num_array[i].length; j++) {
                if((num_array[i].charAt(j) != "+" && num_array[i].charAt(j) != "-" && num_array[i].charAt(j) != "*"  && num_array[i].charAt(j) != ":" 
                  && num_array[i].charAt(j) != "/" && num_array[i].charAt(j) != "%" && num_array[i].charAt(j) != ")" && num_array[i].charAt(j) != "(")
                  && isHead) {
                    obj_name += num_array[i].charAt(j)
                } else if(!isTail && isHead){
                  this.setChangeObject(obj_name,e.object_name)
                  isHead = false
                  isTail = true
                }
              }
            }
          }
        })
        this.objectArray['autofillbox'].forEach(e => {
          if(e.value.show == 'function') {
            var fx = e.value.show_index
            var nums = fx.split('cond(')[1].trim()
            nums = "(" + nums
            var num_array = nums.split('$')
            for(let i=0; i< num_array.length; i++) {
              var obj_name = ""
              var isHead = true
              var isTail = false
              for(let j=0; j < num_array[i].length; j++) {
                if((num_array[i].charAt(j) != "=" && num_array[i].charAt(j) != "!" && num_array[i].charAt(j) != "<"  && num_array[i].charAt(j) != ":" 
                  && num_array[i].charAt(j) != ">" && num_array[i].charAt(j) != ")" && num_array[i].charAt(j) != "(")
                  && isHead) {
                    obj_name += num_array[i].charAt(j)
                } else if(!isTail && isHead){
                  this.setChangeObject(obj_name,e.object_name)
                  isHead = false
                  isTail = true
                }
              }
            }
          }
        })
        // this.mergeChangeDict()
      },
      setHideChangeDict(hideOption, objectName) {
        if(hideOption) {
          var hideOpt = hideOption
          var objectHideValue = []
          hideOpt = hideOpt.split("hide(").join("")
          hideOpt = hideOpt.slice(0, -1)
          if(hideOpt[0] == '(' && hideOpt[hideOpt.length-1] == ')') {
             hideOpt = hideOpt.slice(1, hideOpt.length-1)
          }
          hideOpt = hideOpt.split("==").join("-")
          hideOpt = hideOpt.split("!=").join("-")
          hideOpt = hideOpt.split(">").join("-")
          hideOpt = hideOpt.split("<").join("-")
          hideOpt = hideOpt.split("<=").join("-")
          hideOpt = hideOpt.split(">=").join("-")
          hideOpt = hideOpt.split(")&&(").join("-")
          hideOpt = hideOpt.split(")||(").join("-")
          hideOpt = hideOpt.split("&&").join("-")
          hideOpt = hideOpt.split("||").join("-")
          var hideOptArray = hideOpt.split("-")
          hideOptArray.forEach(e => {
            if(e.startsWith("$")) {
              if(!objectHideValue.includes(e.split("$").join(""))){
                objectHideValue.push(e.split("$").join(""))
              }
            }
          })
          objectHideValue.forEach(e => {
            this.setChangeHideObject(e, objectName)
          })
        }
      },
      mergeChangeDict () {
        var changeDictKeys = Object.keys(this.changeDict)
        var holdChange = []
        Object.keys(this.changeHideDict).forEach(e => {
          var holdMerge = []
          this.changeHideDict[e].forEach(e2 => {
            if(changeDictKeys.includes(e2)) {
               holdMerge.push(e2)
            }
          })
          if(holdMerge.length) {
            holdChange.push({
              key: e,
              value:  holdMerge
            })
          }
        })
        if(holdChange.length) {
          holdChange.forEach(e => {
            var holdNewValue = []
            e.value.forEach(e2 => {
              holdNewValue = [...new Set([...holdNewValue ,...this.changeDict[e2]])]
            })
            this.changeDict[e.key] = holdNewValue
          })
        }
      },
      checkValidFx(fx) {
        var res = true
        var string_fx = fx.split("(").join("")
        string_fx = string_fx.split(")").join("")
        string_fx = string_fx.split("$").join("")
        string_fx = string_fx.split("+").join("-")
        string_fx = string_fx.split("/").join("-")
        string_fx = string_fx.split("*").join("-")
        string_fx = string_fx.split("%").join("-")
        var para_arrays = string_fx.split("-")
        para_arrays.forEach(e => {
          if(isNaN(parseFloat(e))) {
            if(isNaN(parseFloat(this.checkObject(e,true)))) {
              res = false
              return res
            }
          }
        })
        return res
      },
      checkObject(obj_name,isNum) {
        try {
          var val = obj_name
          val = val.split(" ").join("")
          if(typeof this.dataDict[obj_name] != 'undefined') {
            var objType = this.dataDict[obj_name].objectType
            var arryIndex = this.dataDict[obj_name].arrayIndex
            if(this.objectArray[objType][arryIndex].value != "" && this.objectArray[objType][arryIndex].value != null && this.getHideByValue(this.objectArray[objType][arryIndex].style.hideOption, this.objectArray[objType][arryIndex].name, this.objectArray[objType][arryIndex].style.zIndex)) {
              if(objType == 'autofillbox') {
                if(this.objectArray[objType][arryIndex].value.show == 'function') {
                  val = String(this.getAutoFunction(this.objectArray[objType][arryIndex].value.show_index))
                  if(val == 'HIDE') {
                    val = '0'
                  }
                } else if (this.objectArray[objType][arryIndex].value.isUser) {
                  val = this.objectArray[objType][arryIndex].value.show_index
                  isNum = false
                } else {
                  var a = this.objectArray[objType][arryIndex].value.show_array
                  if(typeof a !== 'undefined') {
                    var i = this.objectArray[objType][arryIndex].value.show_index
                    if(!this.objectArray[objType][arryIndex].value.isUser) {
                      val = String(this.objectArray[a][i].value)
                    } else {
                      val = String(0)
                    }
                  } else {
                    val = this.objectArray[objType][arryIndex].value.show_index
                  }
                  if(val == 'HIDE') {
                    val = '0'
                  }
                }
                if(isNum) {
                  val = val.split(",").join("")
                }
              } else {
                if(objType == 'calculatebox') {
                  // this.change_calculate(val,true)
                }
                val = String(this.objectArray[objType][arryIndex].value)
                if(isNum) {
                  val = val.split(",").join("")
                }
              }
              return val
            } else {
            val = String(0)
              return val
            }
          } else if(obj_name.startsWith('datatable')) {
            if((this.dataTableObjectArray[obj_name].value || (this.dataTableObjectArray[obj_name].object_type == 'linkdatabox' && String(this.dataTableObjectArray[obj_name].value) == '0')) && this.getHideByValue(this.dataTableObjectArray[obj_name].style.hideOption, obj_name , this.dataTableObjectArray[obj_name].style.zIndex)) {
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
        } catch(e) {
          return String(0)
        }
      },
      checkDocCondition(conditions) {
        var valid = true
        conditions.forEach(e => {
          if(valid) {
            if((e.isSomeCheck && e.checkStep.includes(this.currentStep)) || !e.isSomeCheck) {
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
                var val = this.checkObject(e2,true)
                if(e2) {
                  inputCond = inputCond.replaceAll('$' + e2 + '.length', '"' + String(val) + '".length')
                  if(isNaN(parseFloat(val))  || val.includes('-') || val.includes('_') || val.includes('/')) {
                    inputCond = inputCond.replaceAll('$' + e2 ,'"' + val + '"')
                  } else {
                    inputCond = inputCond.replaceAll('$' + e2 ,val)
                  }
                }
              })
              try{
                valid = Function('"use strict";return (' + inputCond + '?true:false)')()
                if(!valid) {
                  this.validInput = e.alertText
                }
              } catch(err) {
                console.log(err)
              }
            }
          }
        })
        return valid
      },
      setChangeObject(objName, calObject) {
        var val = objName
        val = val.split(" ").join("")
        if(typeof this.changeDict[val] == 'undefined') {
          this.changeDict[val] = []
        }
        if(typeof this.dataDict[val] !== 'undefined') {
          var objTyp = this.dataDict[val].objectType
          if(objTyp == 'autofillbox') {
            var objInx = this.dataDict[val].arrayIndex
            var selObj = this.objectArray[objTyp][objInx]
            if(!selObj.value.isUser) {
              if(typeof this.changeDict[selObj.value.show] === 'undefined') {
                this.changeDict[selObj.value.show] = []
              }
              if(!this.changeDict[selObj.value.show].includes(calObject)) {
                this.changeDict[selObj.value.show].push(calObject)
              }
            }
          }
        }
        if(!this.changeDict[val].includes(calObject)) {
          this.changeDict[val].push(calObject)
        }
      },
      setChangeHideObject(objName, calObject) {
        var val = objName
        val = val.split(" ").join("")
        if(typeof this.changeHideDict[val] == 'undefined') {
          this.changeHideDict[val] = []
        }
        if(typeof this.dataDict[val] !== 'undefined') {
          var objTyp = this.dataDict[val].objectType
          if(objTyp == 'autofillbox') {
            var objInx = this.dataDict[val].arrayIndex
            var selObj = this.objectArray[objTyp][objInx]
            if(!selObj.value.isUser) {
              if(typeof this.changeHideDict[selObj.value.show] === 'undefined') {
                this.changeHideDict[selObj.value.show] = []
              }
              if(!this.changeHideDict[selObj.value.show].includes(calObject)) {
                this.changeHideDict[selObj.value.show].push(calObject)
              }
            }
          }
        }
        if(!this.changeHideDict[val].includes(calObject)) {
          this.changeHideDict[val].push(calObject)
        }
      },
      getAutoFunction(func) {
        try {
          var result = ""
          if(func) {
            var funcString = String(func).split('cond(')[1]
            if(funcString ) {
              funcString = funcString.split("show=").join("")
              funcString = funcString.split("hide").join('"HIDE"')
              funcString  = "(" + funcString 
              var funcString_array = funcString.split('$')
              var sol = ""
              for(let i=0; i< funcString_array.length; i++) {
                var obj_name = ""
                var isHead = true
                var isTail = false
                for(let j=0; j < funcString_array[i].length; j++) {
                  if(funcString_array[i].charAt(j) == "(") {
                    sol += funcString_array[i].charAt(j)
                  } else if((funcString_array[i].charAt(j) != "=" && funcString_array[i].charAt(j) != "!" && funcString_array[i].charAt(j) != ">" 
                    && funcString_array[i].charAt(j) != "<" && funcString_array[i].charAt(j) != ")" && funcString_array[i].charAt(j) != "(" && funcString_array[i].charAt(j) != ":")
                    && isHead) {
                    obj_name += funcString_array[i].charAt(j)
                  } else if(!isTail && isHead){
                    sol += "'" + this.checkObject(obj_name,false) + "'" + funcString_array[i].charAt(j)
                    isHead = false
                    isTail = true
                  } else if(isTail){
                    sol += funcString_array[i].charAt(j)
                  }
                }
              }
              if(Function('"use strict";return (' + sol + ')')()) {
                result = Function('"use strict";return (' + sol + ')')()
              } else {
                result = ""
              }
            } else {
              result = func
            }
          }
          return result
        }
        catch(e) {
          return "Error"
          console.log(e)
        }
      },
      getDiffDays(startDate, endDate) {
        var sdate = new Date(startDate)
        var edate = new Date(endDate)
        var timeDiff = Math.abs(sdate.getTime() - edate.getTime())
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
        return diffDays + 1
      },
      getDiffMons(startDate, endDate) {
        var sdate = new Date(startDate)
        var edate = new Date(endDate)
        var diffMons = (edate.getFullYear()*12 + edate.getMonth()) - (sdate.getFullYear()*12 + sdate.getMonth());
        return diffMons + 1
      },
      getDiffTime(startTime, endTime) {
        var sTime_array = startTime.split(":")
        var eTime_array = endTime.split(":")
        if(sTime_array.length == 2) {
          sTime_array.push("00")
        }
        if(eTime_array.length == 2) {
          eTime_array.push("00")
        }
        var sumStart =  (parseInt(sTime_array[0])*3600) + (parseInt(sTime_array[1])*60) + (parseInt(sTime_array[2])) 
        var sumEnd = (parseInt(eTime_array[0])*3600) + (parseInt(eTime_array[1])*60) + (parseInt(eTime_array[2])) 
        var diffTime = 0
        if(sumStart > sumEnd) {
          diffTime = ((24*3600) - sumStart) + sumEnd
        } else {
          diffTime = sumEnd - sumStart
        }

        var diffHr = String(parseInt(diffTime/3600))
        var diffMn = String(parseInt((diffTime/60))%60)
        var diffSc = String(diffTime%60)
        if(String(parseInt(diffTime/3600)).length == 1) {
          diffHr = "0" + String(parseInt(diffTime/3600))
        }
        if(String(parseInt((diffTime/60))%60).length == 1) {
          diffMn = "0" + String(parseInt((diffTime/60))%60)
        }
        if(String(diffTime%60).length == 1) {
          diffSc = "0" + String(diffTime%60)
        }
        var diffTimeStr = diffHr + ":"  + diffMn + ":"  + diffSc
      
        return diffTimeStr
      },
      checkPermission(item) {
        if(!item.disable && !this.isSendStep) {
          if(item.value) {
            return false
          } else {
            if(typeof item.style.checkBoxGroup !== 'undefined') {
              item.style.checkBoxGroup.forEach(e => {
                if(e.startsWith('datatable')) {
                  this.dataTableObjectArray[e].value = false
                } else {
                  this.objectArray['checkbox'].find(obj => {
                    if(obj.object_name == e) {
                      obj.value = false
                    }
                  })
                }
              })
            }
            return true
          }
        } else {
          return item.value
        }
      },
      addComment() {
        if(this.inputComment) {
          this.newComment = this.inputComment
          if(this.comments) {
            this.comments.reverse()
          } else {
            this.comments = []
          }
          var now_date = new Date()
          var string_date = String(now_date.getDate()) + "-" + String(now_date.getMonth() +1) + "-" + String(now_date.getFullYear())
            + " " + String(now_date.getHours()) + ":" + String(now_date.getMinutes())
          this.comments.push({
            index: this.comments.length+1,
            sender: sessionStorage.getItem("name"),
            message: this.inputComment,
            date: string_date
          })
          if(this.comments) {
            this.comments.reverse()
          }
        }
        this.inputComment = ""
      },
      numberToThai(showArray, showIndex, type){
        try {
        var num = 0
        if(showArray == 'datatable') {
          num = Number(this.dataTableObjectArray[showIndex].value)
        } else {
          num = Number(this.objectArray[showArray][showIndex].value)
        }
        var strThai = ""
        if(num < 0) {
          num = num*(-1)
          strThai = "ลบ"
        }
        var strNum = String(num)
        var subStrNum = String(num).split('.')[1]
        strNum = strNum.split('.')[0]
        var lenNum = strNum.length

        if(strNum != "NaN") {
          for(var i = 0; i < lenNum ; i++) {
            var index = lenNum - i
            if(strNum[i] == "0" && lenNum == 1) {
              strThai += 'ศูนย์'
            } else if(strNum[i] == "1") {
              if(parseInt(index)%6 != 2) {
                if(parseInt(index)%6 == 1 && strNum[i-1] != "0" && strNum[i-1]) {
                  strThai += 'เอ็ด'
                } else {
                  strThai += 'หนึ่ง'
                }
              }
            } else if(strNum[i] == "2") {
              if(parseInt(index)%6 == 2) {
                  strThai += 'ยี่'
                } else {
                  strThai += 'สอง'
                }
            } else if(strNum[i] == "3") {
              strThai += 'สาม'
            } else if(strNum[i] == "4") {
              strThai += 'สี่'
            } else if(strNum[i] == "5") {
              strThai += 'ห้า'
            } else if(strNum[i] == "6") {
              strThai += 'หก'
            } else if(strNum[i] == "7") {
              strThai += 'เจ็ด'
            } else if(strNum[i] == "8") {
              strThai += 'แปด'
            } else if(strNum[i] == "9") {
              strThai += 'เก้า'
            }


            if(parseInt(index)%6 == 1) {
              if(parseInt(index) >= 7) {
                strThai += 'ล้าน'
              }
            }
            if(strNum[i] != "0") {
              if(parseInt(index)%6 == 1) {
        
              } else if(parseInt(index)%6 == 2) {
                strThai += 'สิบ'
              } else if(parseInt(index)%6 == 3) {
                strThai += 'ร้อย'
              } else if(parseInt(index)%6 == 4) {
                strThai += 'พัน'
              } else if(parseInt(index)%6 == 5) {
                strThai += 'หมื่น'
              } else if(parseInt(index)%6 == 0) {
                strThai += 'แสน'
              }
            }
          }
        }
        if(type == 'thb' && !isNaN(Number(strNum))) {
          if(strThai == 'ศูนย์') {
            strThai = ''
          } else {
            strThai += 'บาท'
            if(isNaN(Number(subStrNum))) {
              strThai += 'ถ้วน'
            }
          }
        }

        if(subStrNum != "NaN" && Number(subStrNum > 0)) {
          if(type == 'thb') {
            if(subStrNum.length == 1) {
              subStrNum += '0'
            }
            var lenNum = subStrNum.length
            for(var i = 0; i < lenNum ; i++) {
              var index = lenNum - i
              if(subStrNum[i] == "0" && lenNum == 1) {
                strThai += 'ศูนย์'
              } else if(subStrNum[i] == "1") {
                if(parseInt(index)%6 != 2) {
                  if(parseInt(index)%6 == 1 && subStrNum[i-1] != "0" && subStrNum[i-1]) {
                    strThai += 'เอ็ด'
                  } else {
                    strThai += 'หนึ่ง'
                  }
                }
              } else if(subStrNum[i] == "2") {
                if(parseInt(index)%6 == 2) {
                    strThai += 'ยี่'
                  } else {
                    strThai += 'สอง'
                  }
              } else if(subStrNum[i] == "3") {
                strThai += 'สาม'
              } else if(subStrNum[i] == "4") {
                strThai += 'สี่'
              } else if(subStrNum[i] == "5") {
                strThai += 'ห้า'
              } else if(subStrNum[i] == "6") {
                strThai += 'หก'
              } else if(subStrNum[i] == "7") {
                strThai += 'เจ็ด'
              } else if(subStrNum[i] == "8") {
                strThai += 'แปด'
              } else if(subStrNum[i] == "9") {
                strThai += 'เก้า'
              }


              if(parseInt(index)%6 == 1) {
                if(parseInt(index) >= 7) {
                  strThai += 'ล้าน'
                }
              }
              if(subStrNum[i] != "0") {
                if(parseInt(index)%6 == 1) {
          
                } else if(parseInt(index)%6 == 2) {
                  strThai += 'สิบ'
                } else if(parseInt(index)%6 == 3) {
                  strThai += 'ร้อย'
                } else if(parseInt(index)%6 == 4) {
                  strThai += 'พัน'
                } else if(parseInt(index)%6 == 5) {
                  strThai += 'หมื่น'
                } else if(parseInt(index)%6 == 0) {
                  strThai += 'แสน'
                }
              }
            }
            strThai += 'สตางค์'
          }
          else {
            strThai += 'จุด'
            for(var i = 0; i < subStrNum.length; i++) { 
              if(subStrNum[i] == '0') {
                strThai += 'ศูนย์'
              } else if(subStrNum[i] == '1') {
                strThai += 'หนึ่ง'
              } else if(subStrNum[i] == '2') {
                strThai += 'สอง'
              } else if(subStrNum[i] == '3') {
                strThai += 'สาม'
              } else if(subStrNum[i] == '4') {
                strThai += 'สี่'
              } else if(subStrNum[i] == '5') {
                strThai += 'ห้า'
              } else if(subStrNum[i] == '6') {
                strThai += 'หก'
              } else if(subStrNum[i] == '7') {
                strThai += 'เจ็ด'
              } else if(subStrNum[i] == '8') {
                strThai += 'แปด'
              } else if(subStrNum[i] == '9') {
                strThai += 'เก้า'
              } 
            }
          }
        }
        
        return strThai
        }
        catch(e) {
          return " "
        }
      },
      numberToEng(showArray, showIndex){
        var s = 0
        if(showArray == 'datatable') {
          s = Number(this.dataTableObjectArray[showIndex].value)
        } else {
          s = Number(this.objectArray[showArray][showIndex].value)
        }
        var str = ""
        if(!isNaN(s)) {
          var th = ['','thousand','million', 'billion','trillion']
          var dg = ['zero','one','two','three','four','five','six','seven','eight','nine'] 
          var tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
          var tw = ['twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

          s = s.toString()
          s = s.replace(/[\, ]/g,'')
          if (s != parseFloat(s)) {
            str = 'not a number'
          }
          var x = s.indexOf('.') 
          if (x == -1) {
            x = s.length
          }
          if (x > 15) {
            str = 'too big'
          }
          var n = s.split('') 
          var str = ''
          var sk = 0 
          for (var i=0; i < x; i++) {
            if((x-i)%3==2) {
              if (n[i] == '1') {
                str += tn[Number(n[i+1])] + ' ' 
                i++ 
                sk=1
              } else if (n[i]!=0) {
                str += tw[n[i]-2] + ' '
                sk=1;
              }
            } else if (n[i]!=0) {
              str += dg[n[i]] +' '
              if ((x-i)%3==0) {
                str += 'hundred '
              }
              sk=1
            } 
            if ((x-i)%3==1) {
              if (sk) {
                str += th[(x-i-1)/3] + ' '
              }
              sk=0;
            }
          } 

          if (x != s.length) {
            var point = s.split('.')[1]
            str += 'point ' 
            for(var i=0; i<point.length; i++) {
              str += dg[point[i]] + ' '
            }
          }
        }
        return str
      },
      numberToComma(num, isComma) {
        if(num && isComma) {
          num = String(num)
          var sp_num = num.split(".")
          var decimal = ""
          sp_num[1]?decimal = sp_num[1]: decimal = ""
          num = sp_num[0]
          var commaNum =  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          decimal != ""? commaNum += "." + decimal: commaNum = commaNum
          return commaNum
        } else {
          return num
        }
      },
      toCapital(item) {
        if(item.object_name.startsWith('datatable')) {
          if(typeof this.dataTableObjectArray[item.object_name] !== 'undefined') {
            if(typeof this.dataTableObjectArray[item.object_name].style.alphabetType !== 'undefined' && this.dataTableObjectArray[item.object_name].style.alphabetType == 'UpperCase') {
              this.dataTableObjectArray[item.object_name].value = this.dataTableObjectArray[item.object_name].value.toUpperCase()
            } else if(typeof this.dataTableObjectArray[item.object_name].style.alphabetType !== 'undefined' && this.dataTableObjectArray[item.object_name].style.alphabetType == 'LowwerCase') {
             this.dataTableObjectArray[item.object_name].value = this.dataTableObjectArray[item.object_name].value.toLowerCase()
            }
          }
        } else {
          var itemObj = this.objectArray[item.object_type].find(x => x.object_name == item.object_name)
          if(itemObj) {
            if(typeof itemObj.style.alphabetType !== 'undefined' && itemObj.style.alphabetType == 'UpperCase') {
              var indx = this.objectArray[item.object_type].indexOf(itemObj)
              this.objectArray[item.object_type][indx].value = this.objectArray[item.object_type][indx].value.toUpperCase()
            } else if(typeof itemObj.style.alphabetType !== 'undefined' && itemObj.style.alphabetType == 'LowwerCase') {
              var indx = this.objectArray[item.object_type].indexOf(itemObj)
              this.objectArray[item.object_type][indx].value = this.objectArray[item.object_type][indx].value.toLowerCase()
            }
          }
        }
        if(typeof item.style.textType !== 'undefined' && item.style.textType == 'Email') {
          if(!this.validateEmail(item.value)) {
            $('#' + item.name + '-input').css("border", "1px solid red")
          } else {
            $('#' + item.name + '-input').css("border", "1px solid lightgrey")
          }
        }
      },
      validateEmail(email) {
        if(!email || email == '-') {
          return true
        } else {
          const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return re.test(String(email).toLowerCase());
        }
        
      },
      setDateFormatBE (date,sub) {
        if(date) {
          var curDate = date.split('-')
          var thaiDate = ""
          if(sub == 'be') {
            thaiDate = String(curDate[2]) + ' ' + this.getThaiMonth(curDate[1]) + ' พ.ศ.' + String(Number(curDate[0]) + 543)
          } else if(sub == 'cbe') {
            thaiDate = String(curDate[2]) + ' ' + this.getSubThaiMonth(curDate[1]) + String(Number(curDate[0]) + 543).slice(-2)
          }
        }
        return date ? thaiDate : ''
      },
      setDateFormatCE (date) {
        if(date) {
          var curDate = date.split('-')
          var thaiDate = String(curDate[2]) + ' ' + this.getEngMonth(curDate[1]) + ' ' + String(Number(curDate[0]))
        }
        return date ? thaiDate : ''
      },
      getThaiMonth (mon) {
        var thaiMon = ''
        mon == '01'? thaiMon = 'มกราคม':
        mon == '02'? thaiMon = 'กุมภาพันธ์':
        mon == '03'? thaiMon = 'มีนาคม':
        mon == '04'? thaiMon = 'เมษายน':
        mon == '05'? thaiMon = 'พฤษภาคม':
        mon == '06'? thaiMon = 'มิถุนายน':
        mon == '07'? thaiMon = 'กรกฎาคม':
        mon == '08'? thaiMon = 'สิงหาคม':
        mon == '09'? thaiMon = 'กันยายน':
        mon == '10'? thaiMon = 'ตุลาคม':
        mon == '11'? thaiMon = 'พฤศจิกายน':
        mon == '12'? thaiMon = 'ธันวาคม':
        thaiMon = 'อื่นๆ'
        return thaiMon
      },
      getSubThaiMonth (mon) {
        var thaiMon = ''
        mon == '01'? thaiMon = 'ม.ค.':
        mon == '02'? thaiMon = 'ก.พ.':
        mon == '03'? thaiMon = 'มี.ค.':
        mon == '04'? thaiMon = 'เม.ย.':
        mon == '05'? thaiMon = 'พ.ค.':
        mon == '06'? thaiMon = 'มิ.ย.':
        mon == '07'? thaiMon = 'ก.ค.':
        mon == '08'? thaiMon = 'ส.ค.':
        mon == '09'? thaiMon = 'ก.ย.':
        mon == '10'? thaiMon = 'ต.ค.':
        mon == '11'? thaiMon = 'พ.ย.':
        mon == '12'? thaiMon = 'ธ.ค.':
        thaiMon = 'อื่นๆ'
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
      changeDate(item) {
        var changeAr = this.objectArray['datepickerbox'].filter(d => d.style.defaultDateValue == item.object_name)
        var dataAr =  Object.values(this.dataTableObjectArray).filter(d=> d.style.defaultDateValue == item.object_name)
        var allAr = []
        if(changeAr) {
          changeAr.forEach(e => {
            allAr.push(e)
          })
        }
        if(dataAr) {
          dataAr.forEach(e => {
            allAr.push(e)
          })
        }
        allAr.forEach(e => {
          if(!e.object_name.startsWith('datatable')) {
            var indx = this.objectArray['datepickerbox'].indexOf(e)
            var startDate = ""
            if(e.style.defaultDateSelect == 'custom' && !e.style.noDefaultDate) {
              if(e.style.defaultDateValue) {
                startDate = new Date(e.style.defaultDateValue).toISOString().substr(0, 10)
              }
            } else if(e.style.defaultDateSelect == 'ref_date' && !e.style.noDefaultDate) {
              var refDate = item
              if(refDate) {
                var holdDate = new Date(refDate.value)
                if(e.style.additionYear) {
                  holdDate.setFullYear(holdDate.getFullYear() + Number(e.style.additionYear))
                }
                if(e.style.additionMon) {
                  holdDate.setMonth(holdDate.getMonth() + Number(e.style.additionMon))
                }
                if(e.style.additionDate) {
                  holdDate.setDate(holdDate.getDate() + Number(e.style.additionDate))
                }
                startDate = holdDate.toISOString().substr(0, 10)
              }
            }
            if( this.objectArray['datepickerbox'][indx].value != startDate) {
              this.objectArray['datepickerbox'][indx].value = startDate
              this.changeDate(e)
            } else {
              this.objectArray['datepickerbox'][indx].value = startDate
            }
          } else {
            var startDate = ""
            if(e.style.defaultDateSelect == 'custom' && !e.style.noDefaultDate) {
              if(e.style.defaultDateValue) {
                startDate = new Date(e.style.defaultDateValue).toISOString().substr(0, 10)
              }
            } else if(e.style.defaultDateSelect == 'ref_date' && !e.style.noDefaultDate) {
              var refDate = item
              if(refDate) {
                var holdDate = new Date(refDate.value)
                if(e.style.additionYear) {
                  holdDate.setFullYear(holdDate.getFullYear() + Number(e.style.additionYear))
                }
                if(e.style.additionMon) {
                  holdDate.setMonth(holdDate.getMonth() + Number(e.style.additionMon))
                }
                if(e.style.additionDate) {
                  holdDate.setDate(holdDate.getDate() + Number(e.style.additionDate))
                }
                startDate = holdDate.toISOString().substr(0, 10)
              }
            }
            if(this.dataTableObjectArray[e.object_name].value != startDate) {
              this.dataTableObjectArray[e.object_name].value = startDate
              this.changeDate(e)
            } else {
              this.dataTableObjectArray[e.object_name].value = startDate
            }
          }
          this.change_calculate(e.object_name,false)
        })
      },
      checkLogic(obj) {
        var valid = true
        var text = this.textLang.tabMenubar.fill + obj.object_name + this.textLang.tabMenubar.must
        var value = 0
        var value2 = 0
        if(obj.style.number_only && obj.style.validate) {
          if(obj.style.validate.fx != "" && this.getHideByValue(obj.style.hideOption)) {
            if(isNaN(parseFloat(obj.style.validate.value))) {
              value = parseFloat(this.checkObject(obj.style.validate.value,true))
              if (isNaN(parseFloat(value))) {
                value = 0
              }
            } else {
              value = parseFloat(obj.style.validate.value)
            }

            if(isNaN(parseFloat(obj.style.validate.value2))) {
              value2 = parseFloat(this.checkObject(obj.style.validate.value2,true))
              if (isNaN(parseFloat(value2))) {
                value2 = 0
              }
            } else {
              value2 = parseFloat(obj.style.validate.value2)
            }


            if(obj.style.validate.fx == "gt") {
              if(!(parseFloat(obj.value) > value)) {
                text  += this.textLang.tabMenubar.greater_than + obj.style.validate.value
                valid = false
              }
            } else if(obj.style.validate.fx == "lt") {
              if(!(parseFloat(obj.value) < value)) {
                text  += this.textLang.tabMenubar.less_than + obj.style.validate.value
                valid = false
              }
            } else if(obj.style.validate.fx == "eq") {
              if(!(parseFloat(obj.value) == value)) {
                text += this.textLang.tabMenubar.equal + obj.style.validate.value
                valid = false
              }
            } else if(obj.style.validate.fx == "gte") {
              if(!(parseFloat(obj.value) >= value)) {
                text += this.textLang.tabMenubar.greater_equal + obj.style.validate.value
                valid = false
              }
            } else if(obj.style.validate.fx == "lte") {
              if(!(parseFloat(obj.value) <= value)) {
                text += this.textLang.tabMenubar.lesss_equal + obj.style.validate.value
                valid = false
              }
            } else if(obj.style.validate.fx == "neq") {
              if(!(parseFloat(obj.value) != value)) {
                text += this.textLang.tabMenubar.not_equal + obj.style.validate.value
                valid = false
              }
            } else if(obj.style.validate.fx == "bet") {
              if(!(parseFloat(obj.value) > value && parseFloat(obj.value)< value2)) {
                text += this.textLang.tabMenubar.greater_than + obj.style.validate.value + this.textLang.tabMenubar.and + this.textLang.tabMenubar.less_than + obj.style.validate.value2
                valid = false
              }
            } else if(obj.style.validate.fx == "betle") {
              if(!(parseFloat(obj.value) >= value && parseFloat(obj.value) < value2)) {
                text += this.textLang.tabMenubar.greater_equal + obj.style.validate.value + this.textLang.tabMenubar.and + this.textLang.tabMenubar.less_than + obj.style.validate.value2
                valid = false
              }
            } else if(obj.style.validate.fx == "betge") {
              if(!(parseFloat(obj.value) > value && parseFloat(obj.value) <= value2)) {
                text += this.textLang.tabMenubar.greater_than + obj.style.validate.value + this.textLang.tabMenubar.and + this.textLang.tabMenubar.lesss_equal + obj.style.validate.value2
                valid = false
              }
            } else if(obj.style.validate.fx == "beteq") {
              if(!(parseFloat(obj.value) >= value && parseFloat(obj.value) <= value2)) {
                text += this.textLang.tabMenubar.greater_equal + obj.style.validate.value + this.textLang.tabMenubar.and + this.textLang.tabMenubar.lesss_equal + obj.style.validate.value2
                valid = false
              }           
            }
          }
        }
        this.validInput = text
        return valid
      },
      addTableRow(obj, notCheckCont) {
        var objArray = this.dataDict[obj].objectType
        var objIndex = this.dataDict[obj].arrayIndex
        if(!this.objectArray[objArray][objIndex].style.maxRow || this.objectArray[objArray][objIndex].style.maxRow > this.objectArray[objArray][objIndex].style.table.crow) {
        if(objArray == 'datatable' && typeof this.objectArray[objArray][objIndex] !== 'undefined') {
          if(this.objectArray[objArray][objIndex].style.valueList) {
            this.objectArray[objArray][objIndex].style.valueList.push([])
          } else {
            this.objectArray[objArray][objIndex].style.valueList = []
          }
          var column = this.objectArray[objArray][objIndex].style.table.ccol
          var column = parseInt(this.objectArray[objArray][objIndex].style.table.ccol)
          var row = parseInt(this.objectArray[objArray][objIndex].style.table.crow) +1
          var defualtRow = row-1
          if(this.objectArray[objArray][objIndex].style.isDefaultRow) {
            defualtRow = this.objectArray[objArray][objIndex].style.defaultRow
          }
          for(let i=1; i<=column; i++) {
            let tempObj = this.dataTableObjectArray[obj + '_R' + defualtRow + 'C' + i]
            if(typeof tempObj === 'undefined') {
              tempObj = this.dataTableObjectArray[obj + '_R1' + 'C' + i]
            }
            this.dataTableObjectArray[obj + '_R' + row + 'C' + i] = {
              excel: tempObj.excel,
              name: obj + '_R' + row + 'C' + i,
              object_name: obj + '_R' + row + 'C' + i,
              object_type: "linkdatabox",
              page: tempObj.page,
              placeholder: tempObj.placeholder,
              disable: tempObj.disable,
              section: tempObj.section,
              show: true,
              style: {},
              value: "",
              valueList: []
            }
            if(this.objectArray[objArray][objIndex].style.isDefaultRow) {
              let cpObj = tempObj
              this.dataTableObjectArray[obj + '_R' + row + 'C' + i].object_type = tempObj.object_type
              Object.keys(cpObj.style).forEach(sk => {
                this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style[sk] = cpObj.style[sk]
              })
              this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style.json_key = cpObj.style.json_key.split('_'+defualtRow).join('_'+row)
              if(!(this.dataTableObjectArray[obj + '_R' + row + 'C' + i].object_type == 'calculatebox' ||
              this.dataTableObjectArray[obj + '_R' + row + 'C' + i].object_type != 'inputbox' ||
              this.dataTableObjectArray[obj + '_R' + row + 'C' + i].object_type != 'checkbox')) {
                this.dataTableObjectArray[obj + '_R' + row + 'C' + i].value = tempObj.value
              }
              this.dataTableObjectArray[obj + '_R' + row + 'C' + i].valueList = tempObj.valueList
              this.dataTableObjectArray[obj + '_R' + row + 'C' + i].text = tempObj.text
              this.dataTableObjectArray[obj + '_R' + row + 'C' + i].choices = tempObj.choices
              if(this.dataTableObjectArray[obj + '_R' + row + 'C' + i].object_type == 'calculatebox') {
               this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style.function = cpObj.style.function.split('R' + defualtRow).join('R' + row)
              } else if(this.dataTableObjectArray[obj + '_R' + row + 'C' + i].object_type == 'linkdatabox') {
                this.objectArray[objArray][objIndex].style.valueList[row-1] = this.objectArray[objArray][objIndex].style.valueList[defualtRow-1]
              } else if(this.dataTableObjectArray[obj + '_R' + row + 'C' + i].object_type == 'dropdownbox') {
                if(this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style.refValue) {
                  this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style.refValue = this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style.refValue.split('R' + defualtRow).join('R' + row)
                }
              } else if(this.dataTableObjectArray[obj + '_R' + row + 'C' + i].object_type == 'inputbox') {
                if(this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style.defaultValueObj) {
                  var holdDefault = this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style.defaultValueObj 
                  if(holdDefault) {
                    if(holdDefault.startsWith(obj)) {
                      var newChange = holdDefault.split('R' + defualtRow).join('R' + row)
                      this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style.defaultValueObj = newChange
                      this.changeDefaultDict[newChange] = [obj + '_R' + row + 'C' + i]
                    } else {
                      this.dataTableObjectArray[obj + '_R' + row + 'C' + i].style.defaultValueObj = holdDefault
                      this.changeDefaultDict[holdDefault] = [obj + '_R' + row + 'C' + i]
                    }
                  }
                }
              }
            }
          }
          var tempDataObj = {}
          Object.keys(this.dataTableObjectArray).forEach(e => {
            tempDataObj[e] = this.dataTableObjectArray[e]
          })
          this.dataTableObjectArray = tempDataObj
        }
        var rowObj = this.objectArray[objArray][objIndex].style.table.rowsize[parseInt(this.objectArray[objArray][objIndex].style.table.crow) - 1]
        var row = {
          index: parseInt(rowObj.index) +1,
          size: rowObj.size,
          deleteAble: true
        
        }
        if(!this.objectArray[objArray][objIndex].style.addTableUnmove) {
          this.checkMoveDown(this.objectArray[objArray][objIndex],rowObj.size)
        }
        this.objectArray[objArray][objIndex].style.table.rowsize.push(row)
        this.objectArray[objArray][objIndex].style.table.crow = parseInt(this.objectArray[objArray][objIndex].style.table.crow) +1
        }
        if(!notCheckCont) {
          if(objArray == 'datatable') {
            this.getDataTableList(false)
          }
          this.checkContSleep = true
        }
      },
      changeConTable(checkObj) {
        try {
          var contTableArray = []
          if(checkObj.style.contTable.includes(",")) {
            contTableArray = checkObj.style.contTable.split(",")
          } else {
            contTableArray.push(checkObj.style.contTable)
          }
          contTableArray.forEach(e => {
            var findDict = this.dataDict[e]
            if(typeof findDict !== 'undefined') {
              var element = document.getElementsByClassName(checkObj.name + "-obj")[0]
              var rect = element.getBoundingClientRect()
              var element2 = document.getElementById(this.objectArray[findDict.objectType][findDict.arrayIndex].name)
              var rect2 = element2.getBoundingClientRect()
              var paper = document.getElementById("workpaper")
              var paperRect = paper.getBoundingClientRect()
              this.objectArray[findDict.objectType][findDict.arrayIndex].top = checkObj.top + rect.height - 1
              if(this.objectArray[findDict.objectType][findDict.arrayIndex].style.contTable && this.objectArray[findDict.objectType][findDict.arrayIndex].style.contTable != checkObj.object_name) {
                this.changeConTable(this.objectArray[findDict.objectType][findDict.arrayIndex])
              }
            }
          })
        } catch(e) {
          console.log(e)
        }
      },
      deleteTableRow(obj, row, notCheckCont) {
        var objArray = this.dataDict[obj].objectType
        var objIndex = this.dataDict[obj].arrayIndex
        var rowNum = Number(row.index)
        var rowDiff = this.objectArray[objArray][objIndex].style.table.rowsize.length - rowNum
        if(!this.objectArray[objArray][objIndex].style.addTableUnmove) {
          this.checkMoveUp(this.objectArray[objArray][objIndex],row.size) 
        }
        this.objectArray[objArray][objIndex].style.table.rowsize.pop()
        if(objArray == 'datatable') {
          for(let i=0; i< rowDiff; i++) {
            for(let j=1; j<= Number(this.objectArray[objArray][objIndex].style.table.ccol); j++) {
              var obj = this.objectArray[objArray][objIndex].object_name + '_' + 'R' + (rowNum + i) + 'C' + j
              var next_obj = this.objectArray[objArray][objIndex].object_name + '_' + 'R' + (rowNum + i + 1) + 'C' + j
              this.dataTableObjectArray[obj].show = this.dataTableObjectArray[next_obj].show 
              this.dataTableObjectArray[obj].show_value = this.dataTableObjectArray[next_obj].show_value 
              this.dataTableObjectArray[obj].style = this.dataTableObjectArray[next_obj].style
              this.dataTableObjectArray[obj].textHl = this.dataTableObjectArray[next_obj].textHl 
              this.dataTableObjectArray[obj].value = this.dataTableObjectArray[next_obj].value
              this.dataTableObjectArray[obj].valueList = this.dataTableObjectArray[next_obj].valueList
            }
          }
          for(let i=1; i<= Number(this.objectArray[objArray][objIndex].style.table.ccol); i++) {
            var obj = this.objectArray[objArray][objIndex].object_name + '_' + 'R' + this.objectArray[objArray][objIndex].style.table.crow
            + 'C' + i
            delete this.dataTableObjectArray[obj]
          }
          Object.keys(this.dataTableObjectArray).forEach(e => {
            if(e.startsWith(this.objectArray[objArray][objIndex].object_name)) {
              this.change_calculate(e,false)
            }
          })
        }
        this.objectArray[objArray][objIndex].style.table.crow = parseInt(this.objectArray[objArray][objIndex].style.table.crow) -1
        if(objArray == 'datatable') {
          this.getDataTableList(false)
        }
         if(!notCheckCont) {
          this.checkContSleep = true
        }
      },
      checkMoveDown(obj,size) {
        var element = document.getElementById(obj.name)
        var rect = element.getBoundingClientRect()
        var fromPage = false
        this.objectType.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            if(!e2.style.fixPosition && obj.object_name != e2.object_name) {
              var element2 = document.getElementById(e2.name)
              var rect2 = element2.getBoundingClientRect()
              var paper = document.getElementById("workpaper")
              var paperRect = paper.getBoundingClientRect()
              if(obj.page == e2.defaultPage && e2.defaultPage != e2.page) {
                fromPage = true
              }
              if((rect2.top+3) >= rect.bottom && e2.page == obj.page) {
                if((rect2.bottom + parseFloat(size)) <= paperRect.bottom) {
                  element2.style.top = String(e2.top + parseFloat(size) + 1) + "px"
                  e2.top = e2.top + parseFloat(size) + 1
                } else {
                  if(this.pages.length < Number(e2.page) + 1) {
                    this.pages.push({
                      index: Number(e2.page) + 1,
                      template_side: this.pages[0].template_side,
                      isHide:false
                    })
                    var orObj = {}
                    orObj[String(Number(e2.page) + 1)] = this.template_option.orientation[0][Object.keys(this.template_option.orientation[0])]
                    this.template_option.orientation.push(orObj)
                  } else {
                    this.moveDownPage(Number(e2.page) + 1, Number(e2.height))
                  }
                  element2.style.top = "0px"
                  e2.top = 0
                  e2.justMove = true
                  e2.page = Number(e2.page) + 1
                  e2.show = false
                }
              }
            }
          })
        })
        if(fromPage) {
          this.moveDownPage(Number(obj.page) + 1, size)
        }
      },
      moveDownPage(page, size) {
        var paper = document.getElementById("workpaper")
        var paperRect = paper.getBoundingClientRect()
        this.objectType.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            if(e2.page == page && !e2.justMove && !e2.style.fixPosition) {
              if(e2.top + Number(size) <= paperRect.bottom) {
                e2.top += Number(size)
              } else {
                if(this.pages.length < Number(e2.page) + 1) {
                  this.pages.push({
                    index: Number(e2.page) + 1,
                    template_side: this.pages[0].template_side,
                    isHide:false
                  })
                  var orObj = {}
                  orObj[String(Number(e2.page) + 1)] = this.template_option.orientation[0][Object.keys(this.template_option.orientation[0])]
                  this.template_option.orientation.push(orObj)
                } else {
                  this.moveDownPage(Number(e2.page) + 1, Number(e2.height))
                }
                e2.top = 0
                e2.page = Number(e2.page) + 1
              }
            }
            e2.justMove = false
          })
        })
      },
      checkMoveUp(obj,size) {
        var element = document.getElementById(obj.name)
        var rect = element.getBoundingClientRect()
        var upPages = []
        this.objectType.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            if(!e2.style.fixPosition) {
              var element2 = document.getElementById(e2.name)
              var rect2 = element2.getBoundingClientRect()
              if(rect2.top >= (rect.bottom-3) && e2.page == obj.page) {
                if(e2.top - parseFloat(size) >= e2.defaultTop) {
                  element2.style.top = String(e2.top - parseFloat(size) - 1) + "px"
                  e2.top = e2.top - parseFloat(size) - 1
                }
              }
              if(e2.defaultPage == obj.page && e2.page != obj.page) {
                if(!upPages.includes(e2.page)) {
                  upPages.push(e2.page)
                }
              }
            }
          })
        })
        upPages.sort()
        upPages.forEach(e => {
          this.moveUpPage(e, size)
        })
      },
      moveUpPage(page, size) {
        var paper = document.getElementById("workpaper")
        var paperRect = paper.getBoundingClientRect()
        this.objectType.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            if(e2.page == page && !e2.style.fixPosition) {
              if(e2.top - Number(size) >= 0) {
                e2.top -= Number(size)
              } else {
                e2.top = Number(this.paper_size[this.paperSizeIndex].height) - Number(e2.height)
                e2.page = Number(e2.page) - 1
                if(e2.page == this.currentPage) {
                  e2.show = true
                }
              }
            }
          })
        })
      },
      checkFilled(obj) {
        var filled = true
        if(!obj.disable) {
          if(obj.object_name.startsWith('datatable')) {
            if(obj.object_type == 'linkdatabox' || obj.object_type == 'inputbox' || obj.object_type == 'dropdownbox' || obj.object_type == 'datepickerbox' || obj.object_type == 'timebox' || obj.object_type == 'checkbox') {
              if(obj.style.mandatory && this.getHideByValue(obj.style.hideOption)) {
                if(obj.object_type == 'checkbox') {
                  if(!obj.value) {
                    filled = false
                    obj.style.checkBoxGroup.forEach(e => {
                      if(e.startsWith('datatable')) {
                        if(typeof this.dataTableObjectArray[e] !== 'undefined') {
                          if(this.dataTableObjectArray[e].value || this.dataTableObjectArray[e].value === 0) {
                            filled = true
                          } 
                        }
                      } else {
                        if(typeof this.dataDict[e] !== 'undefined') {
                          var arr = this.dataDict[e].objectType
                          var indx = this.dataDict[e].arrayIndex
                          if(this.objectArray[arr][indx].value || this.objectArray[arr][indx].value === 0) {
                            filled = true
                          } 
                        }
                      }
                    })
                  }
                  if(!filled) {
                    $('#' + obj.name).css("border", "2px solid red")
                    obj.style.checkBoxGroup.forEach(e => {
                      var holdObj = ""
                      if(e.startsWith('datatable')) {
                        holdObj = this.dataTableObjectArray[e]
                      } else {
                        holdObj = this.objectArray['checkbox'].find(item => item.object_name == e)
                      }
                      if(holdObj) {
                        $('#' + holdObj.name).css("border", "2px solid red")
                      }
                    })
                  } else {
                    $('#' + obj.name).css("border", "1px solid lightgrey")
                    obj.style.checkBoxGroup.forEach(e => {
                      var holdObj = ""
                      if(e.startsWith('datatable')) {
                        holdObj = this.dataTableObjectArray[e]
                      } else {
                        holdObj = this.objectArray['checkbox'].find(item => item.object_name == e)
                      }
                      if(holdObj) {
                        $('#' + holdObj.name).css("border", "2px solid lightgrey")
                      }
                    })
                  }
                } else {
                  if((obj.show_value == "" || typeof obj.show_value === 'undefined' || obj.show_value == null || obj.show_value == 'undefined') &&  obj.show_value !== 0) {
                    filled = false
                  }
                  if(!filled) {
                    $('#' + obj.name).css("border", "2px solid red")
                  } else {
                    $('#' + obj.name).css("border", "1px solid lightgrey")
                  }
                }
              }
            }
          } else {
            if(obj.object_type == 'inputbox' || obj.object_type == 'textareabox' || obj.object_type == 'texteditorbox' || obj.object_type == 'dropdownbox' || obj.object_type == 'datepickerbox' || obj.object_type == 'timebox' || obj.object_type == 'checkbox') {
              if(obj.style.mandatory && !obj.disable && this.getHideByValue(obj.style.hideOption)) {
                if(obj.object_type == 'checkbox') {
                  if(!obj.value) {
                    filled = false
                    obj.style.checkBoxGroup.forEach(e => {
                      if(e.startsWith('datatable')) {
                        if(typeof this.dataTableObjectArray[e] !== 'undefined') {
                          if(this.dataTableObjectArray[e].value || this.dataTableObjectArray[e].value === 0) {
                            filled = true
                          } 
                        }
                      } else {
                        if(typeof this.dataDict[e] !== 'undefined') {
                          var arr = this.dataDict[e].objectType
                          var indx = this.dataDict[e].arrayIndex
                          if(this.objectArray[arr][indx].value || this.objectArray[arr][indx].value === 0) {
                            filled = true
                          } 
                        }
                      }
                    })
                  }
                  if(!filled) {
                    $('#' + obj.name).css("border", "2px solid red")
                    obj.style.checkBoxGroup.forEach(e => {
                      var holdObj = ""
                      if(e.startsWith('datatable')) {
                        holdObj = this.dataTableObjectArray[e]
                      } else {
                        holdObj = this.objectArray['checkbox'].find(item => item.object_name == e)
                      }
                      if(holdObj) {
                        $('#' + holdObj.name).css("border", "2px solid red")
                      }
                    })
                  } else {
                    $('#' + obj.name).css("border", "1px solid lightgrey")
                    obj.style.checkBoxGroup.forEach(e => {
                      var holdObj = ""
                      if(e.startsWith('datatable')) {
                        holdObj = this.dataTableObjectArray[e]
                      } else {
                        holdObj = this.objectArray['checkbox'].find(item => item.object_name == e)
                      }
                      if(holdObj) {
                        $('#' + holdObj.name).css("border", "2px solid lightgrey")
                      }
                    })
                  }
                } else {
                  if((obj.value == "" || typeof obj.value === 'undefined' || obj.value == null || obj.value == 'undefined') &&  obj.value !== 0) {
                    $('#' + obj.name + '-input').css("border", "2px solid red")
                    $('.' + obj.name + '-input').css("border", "2px solid red")
                    filled = false
                  } else {
                    $('#' + obj.name + '-input').css("border", "1px solid lightgrey")
                    $('.' + obj.name + '-input').css("border", "1px solid lightgrey")
                  }
                }
              }
            } else {

            }
          }
        }
        return filled
      },
      setObjectArray() {
        var template_array = []
        this.objectType.forEach( e => {
          this.objectArray[e].forEach(obj => {
            template_array.push(obj)
          })
        })
        var currentFlow = this.current_flow
        var dataTableArray = this.dataTableObjectArray
        EventBus.$emit('changeView',template_array, currentFlow, dataTableArray)
      },
      save(isDraft, isToPreview) {
        var template_array = []
        var allFilled = true
        var allValid = true
        this.onSave = true
        this.objectType.forEach( e => {
          this.objectArray[e].forEach(obj => {
            var temp_obj = obj
            temp_obj.object_type = e
            if(e == "autofillbox" && temp_obj.value.show_index != 'undefined') {
              if(!temp_obj.value.isUser){
                if(temp_obj.value.isValued) {
                  if(String(temp_obj.value.show_index).startsWith('datatable')) {
                    temp_obj.value.object_name = this.dataTableObjectArray[temp_obj.value.show_index].object_name
                    temp_obj.value.isComma = this.dataTableObjectArray[temp_obj.value.show_index].style.isComma
                    temp_obj.value.show_value = this.dataTableObjectArray[temp_obj.value.show_index].value
                    if(this.dataTableObjectArray[temp_obj.value.show_index].object_type == 'calculatebox') {
                      temp_obj.style.isComma = true
                    }
                  } else {
                    temp_obj.value.object_name = this.objectArray[temp_obj.value.show_array][parseInt(temp_obj.value.show_index)].object_name
                    temp_obj.value.isComma = this.objectArray[temp_obj.value.show_array][parseInt(temp_obj.value.show_index)].style.isComma
                    if(temp_obj.value.show_array == 'calculatebox') {
                      temp_obj.style.isComma = true
                    }
                    if(this.objectArray[temp_obj.value.show_array][parseInt(temp_obj.value.show_index)].style.autoChoicesSelect) {
                      temp_obj.value.show_value = this.objectArray[temp_obj.value.show_array][parseInt(temp_obj.value.show_index)].value.text
                    } else {
                      temp_obj.value.show_value = this.objectArray[temp_obj.value.show_array][parseInt(temp_obj.value.show_index)].value
                    }
                  }
                }
              } else if(temp_obj.value.show == 'function') {
                temp_obj.value.show_value = this.getAutoFunction(temp_obj.value.show_index)
                if(temp_obj.value.show_value == 'HIDE') {
                  temp_obj.value.show_value = ''
                }
              }
            } else if(e == "number2textbox") {
              if(temp_obj.value.show_index != 'undefined') {
                temp_obj.style.n2tdecimal != 'en'?temp_obj.value.show_value = this.numberToThai(temp_obj.value.show_array, temp_obj.value.show_index, temp_obj.style.n2tdecimal):
                temp_obj.value.show_value = this.numberToEng(temp_obj.value.show_array,temp_obj.value.show_index, temp_obj.style.n2tdecimal)
                if(temp_obj.style.suffix && !(typeof temp_obj.style.suffix === 'undefined') ) {
                  temp_obj.value.show_value += temp_obj.style.suffix
                }
              }
            } else if(e == "dropdownbox") {
              if(temp_obj.style.autoChoices && typeof temp_obj.value.value !== 'undefined') {
                if(temp_obj.style.autoChoicesSelect.endsWith('th')) {
                  temp_obj.show_value = temp_obj.value.value.name_th
                } else if(temp_obj.style.autoChoicesSelect.endsWith('en')) {
                  temp_obj.show_value = temp_obj.value.value.name_en
                } else {
                  temp_obj.show_value = temp_obj.value.value.zip_code
                }
              } else {
                if(typeof temp_obj.choices !== 'undefined' && temp_obj.choices.includes(temp_obj.value)) {
                  temp_obj.show_value = temp_obj.value
                } else {
                  temp_obj.show_value = temp_obj.value = ""
                }
              }
            } else if(e == "datepickerbox") {
              if(temp_obj.style.date_format == 'be' || temp_obj.style.date_format == 'cbe') {
                temp_obj.show_value = this.setDateFormatBE(temp_obj.value,temp_obj.style.date_format)
              } else {
                temp_obj.show_value = this.setDateFormatCE(temp_obj.value)
              }
            } else if(e == "signbox" && (this.allUserStep || this.isSendStep)) {
              var work_paper = document.getElementById('workpaper')
              var paper_rect = work_paper.getBoundingClientRect()
              var element = document.getElementById(temp_obj.name)
              var rect = element.getBoundingClientRect()
              temp_obj.top = rect.top - paper_rect.top
              temp_obj.left = rect.left - paper_rect.left
              temp_obj.width = rect.width
              temp_obj.height = rect.height
              var signLly = String((1 - ((temp_obj.top + temp_obj.height) /this.current_paper_height)).toFixed(3))
              var signLlx = String((temp_obj.left /this.current_paper_width).toFixed(3))
              var signUry = String((temp_obj.height /this.current_paper_height).toFixed(3))
              var signUrx = String((temp_obj.width /this.current_paper_width).toFixed(3))
              var flowObj = this.template_option.flow_permission.find(item => item.role[0].object_name == temp_obj.object_name)
              if(flowObj) {
                var indxFlow = this.template_option.flow_permission.indexOf(flowObj)
                this.template_option.flow_permission[indxFlow].ppl_sign.forEach(ps => {
                  ps.activity_data[0].sign_llx = signLlx
                  ps.activity_data[0].sign_lly = signLly 
                  ps.activity_data[0].sign_urx = signUrx
                  ps.activity_data[0].sign_ury = signUry
                })
              } else {
                if(temp_obj.style.permission_section && typeof  temp_obj.style.permission_section.section !== 'undefined') {
                    flowObj = this.template_option.flow_permission.find(item => temp_obj.style.permission_section.section.includes(item.role[0].object_name))
                  if(flowObj) {
                    var indxFlow = this.template_option.flow_permission.indexOf(flowObj)
                    this.template_option.flow_permission[indxFlow].ppl_sign.forEach(ps => {
                      ps.activity_data[0].sign_llx = signLlx
                      ps.activity_data[0].sign_lly = signLly 
                      ps.activity_data[0].sign_urx = signUrx
                      ps.activity_data[0].sign_ury = signUry
                    })
                  }
                }
              } 
            }
            if(allFilled) {
              allFilled = this.checkFilled(obj)
            } else {
              this.checkFilled(obj)
            }
            if(e == "inputbox" && allValid) {
              if(!(this.checkLogic(obj))) {
                allValid = false
                $('#' + obj.name + '-input').css("border", "2px solid red")
              }
            }
            var isVisible = this.getHideByValue(temp_obj.style.hideOption) 
            if(isVisible || e == 'datatable') {
              if(!isVisible && e == 'datatable') {
                temp_obj.invisible = true
              }
              template_array.push(temp_obj)
            }
            if(e == 'textareabox' && temp_obj.style.maxLetter) {
              if(temp_obj.value.length > Number(temp_obj.style.maxLetter)) {
                this.validInput = temp_obj.object_name + this.textLang.alert.prefix_maxchar + String(temp_obj.style.maxLetter) + this.textLang.alert.subfix_maxChar
                allValid = false
                $('#' + obj.name + '-input').css("border", "2px solid red")
              }
            }
            if(e == "inputbox") {
              if(typeof obj.style.textType !== 'undefined' && obj.style.textType == 'Email' && !obj.disable && this.getHideByValue(obj.style.hideOption)) {
                if(!this.validateEmail(obj.value)) {
                  $('#' + obj.name + '-input').css("border", "1px solid red")
                  this.validInput = "รูปแบบอีเมล " + obj.object_name + " ไม่ถูกต้อง"
                  allValid = false
                } else if(!obj.style.mandatory){
                  $('#' + obj.name + '-input').css("border", "1px solid lightgrey")
                }
              }
            }
          })
        })
        if(this.objectArray['datatable'].length) {
          Object.keys(this.dataTableObjectArray).forEach(e => {
            this.dataTableObjectArray[e].invisible = !this.getHideByValue(this.dataTableObjectArray[e].style.hideOption)
            if(!this.dataTableObjectArray[e].style.noCellData) {
              if(this.dataTableObjectArray[e].value != null) {
                if(this.dataTableObjectArray[e].object_type == 'linkdatabox') {
                  if(typeof this.dataTableObjectArray[e].valueList[this.dataTableObjectArray[e].value] !== 'undefined') {
                    if(this.dataTableObjectArray[e].valueList[this.dataTableObjectArray[e].value].text) {
                      this.dataTableObjectArray[e].show_value = this.dataTableObjectArray[e].valueList[this.dataTableObjectArray[e].value].text
                    }
                  } else {
                    this.dataTableObjectArray[e].show_value = ""
                  }
                } else {
                  this.dataTableObjectArray[e].show_value = this.dataTableObjectArray[e].value 
                }
              } else {
                this.dataTableObjectArray[e].show_value = ""
              }
              if(this.dataTableObjectArray[e].object_type == 'calculatebox') {
                this.dataTableObjectArray[e].style.isComma = true
              } else if(this.dataTableObjectArray[e].object_type == 'datepickerbox') {
                if(this.dataTableObjectArray[e].style.date_format == 'be'||this.dataTableObjectArray[e].style.date_format == 'cbe') {
                    this.dataTableObjectArray[e].show_value = this.setDateFormatBE(this.dataTableObjectArray[e].show_value,this.dataTableObjectArray[e].style.date_format)
                  } else {
                    this.dataTableObjectArray[e].show_value = this.setDateFormatCE(this.dataTableObjectArray[e].show_value)
                  }
              } else if(this.dataTableObjectArray[e].object_type == 'checkbox') {
                if(!this.dataTableObjectArray[e].text) {
                  this.dataTableObjectArray[e].text = ""
                }
              } else if(this.dataTableObjectArray[e].object_type == 'inputbox') {
                if(this.dataTableObjectArray[e].style.number_only && this.dataTableObjectArray[e].value) {
                  this.dataTableObjectArray[e].value = Number(String(this.dataTableObjectArray[e].value).split(",").join(""))
                  this.dataTableObjectArray[e].value = Number(String(this.dataTableObjectArray[e].value).split(" ").join(""))
                  this.dataTableObjectArray[e].value = Number(String(this.dataTableObjectArray[e].value).replace(/(?!-)[^0-9.]/g, ""))
                  if(!isNaN(this.dataTableObjectArray[e].value)) {
                    this.dataTableObjectArray[e].show_value = this.dataTableObjectArray[e].value
                  } else {
                    this.dataTableObjectArray[e].show_value = ""
                  }
                }
                if(typeof  this.dataTableObjectArray[e].style.textType !== 'undefined' &&  this.dataTableObjectArray[e].style.textType == 'Email' && !this.dataTableObjectArray[e].disable && this.getHideByValue(this.dataTableObjectArray[e].style.hideOption)) {
                  if(!this.validateEmail(this.dataTableObjectArray[e].value)) {
                    $('#' +  this.dataTableObjectArray[e].name + '-input').css("border", "1px solid red")
                    this.validInput = "รูปแบบอีเมล " + this.dataTableObjectArray[e].object_name + " ไม่ถูกต้อง"
                    allValid = false
                  } else {
                    $('#' +  this.dataTableObjectArray[e].name + '-input').css("border", "1px solid lightgrey")
                  }
                }
              } else if(this.dataTableObjectArray[e].object_type == 'timebox') {
                this.dataTableObjectArray[e].show_value = this.dataTableObjectArray[e].value
              } else if(this.dataTableObjectArray[e].object_type == 'dropdownbox' &&  this.dataTableObjectArray[e].choices !== 'undefined') {
                if(typeof this.dataTableObjectArray[e].choices === 'undefined') {
                  this.dataTableObjectArray[e].choices = []
                }
                if(this.dataTableObjectArray[e].choices.includes(this.dataTableObjectArray[e].value)) {
                  this.dataTableObjectArray[e].show_value = this.dataTableObjectArray[e].value
                } else {
                  this.dataTableObjectArray[e].show_value = this.dataTableObjectArray[e].value = ""
                }
              }
              if(allFilled) {
                allFilled = this.checkFilled(this.dataTableObjectArray[e])
              } else {
                this.checkFilled(this.dataTableObjectArray[e])
              }
            } else {
              this.dataTableObjectArray[e].show_value = ""
            }
          })
        }

        if(this.template_option.document_option && typeof this.template_option.document_option['condition'] !== 'undefined' && allValid) {
          allValid = this.checkDocCondition(this.template_option.document_option['condition'] )
        }
        //New session
        sessionStorage.setItem("firstSent", this.currentStep == "")
        sessionStorage.setItem("isInstantSave", isToPreview != true)
        sessionStorage.setItem('isDraft',isDraft)

        //Old session
        this.template_option.comment = this.comments
        this.template_option.newComment = this.newComment
        sessionStorage.setItem('name_template',this.template_name)
        sessionStorage.setItem('template_id',this.option.template_id)
        sessionStorage.setItem('description',this.template_option.description_template)
        sessionStorage.setItem('preview',false)
        sessionStorage.setItem('current_step', this.currentStep)
        sessionStorage.setItem('orientation',JSON.stringify(this.template_option.orientation))
        sessionStorage.setItem('pageTemp',JSON.stringify(this.pages))
        sessionStorage.setItem('flow_permission',JSON.stringify(this.template_option.flow_permission))
        sessionStorage.setItem('paper_size',this.template_option.paper_size)
        this.template_option.template_body = this.template_option.template_header = this.template_option.template_footer = {}
        sessionStorage.setItem('template_option',JSON.stringify(this.template_option))
        sessionStorage.setItem('Folder_Attachment_Name',JSON.stringify(this.attachedFiles))
        sessionStorage.setItem('preview_save', isToPreview)
        sessionStorage.setItem('uploadFolder', this.uploadFolder)
        if(this.isSendBack && this.isSendFirst) {
          sessionStorage.setItem('sendBackAndFirst',true)
        }
        if(this.template_option.e_template_code) {
          sessionStorage.setItem('template_id',this.template_option.e_template_code)
        }
        sessionStorage.setItem('refDataDoc',JSON.stringify(this.refDataDoc))
        sessionStorage.setItem('showDraft',isDraft)
        sessionStorage.setItem('saveDoc',true)
        sessionStorage.setItem('isLastStep',this.isComplete)
        // sessionStorage.setItem('dataTableObjectArray',JSON.stringify(this.dataTableObjectArray))
        if(this.isComplete) {
          sessionStorage.setItem('isDocStep',false)
        }
        var isEdit = sessionStorage.getItem('isDocStep')
        sessionStorage.setItem('all_user_step',false)
        if(this.allUserStep) {
          sessionStorage.setItem('all_user_step',true)
        }
        if(isEdit == 'true') {
          sessionStorage.setItem('editStep',true)
        } else {
          sessionStorage.setItem('template_option',JSON.stringify(this.template_option))
          sessionStorage.setItem('editStep', false)
        }
        if((allFilled && allValid) || isDraft) {
          this.templateTempStore(template_array)
        } else if(!allFilled){
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
            text: this.textLang.alert.fill_data,
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
          allFilled = true
        } else if(!allValid){
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
            text: this.validInput,
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
          allValid = true
        }
      },
      openDocName() {
        var flowPermission =  this.template_option.flow_permission
        var caStep = this.isCa
        EventBus.$emit('openInputDocName',flowPermission, caStep)
      },
      openTextAreaValModal(item) {
        this.dialogTextAreaVal = true
        this.selectedTextArea = item
        this.textAreaVals = item.style.textAreaValiable
      },
      closeTextAreaValModal() {
        var index = this.objectArray['textareabox'].indexOf(this.selectedTextArea)
        this.objectArray['textareabox'][index].style.textAreaValiable = this.textAreaVals
        this.objectArray['textareabox'][index].value = this.getTextAreaValue(this.objectArray['textareabox'][index])
        this.dialogTextAreaVal = false
      },
      checkTextLength(obj) {
        if(obj.style.maxLetter) {
          var indx = this.objectArray[obj.object_type].indexOf(obj)
          if(obj.value.length > Number(obj.style.maxLetter)) {
            obj.value = obj.value.substr(0, Number(obj.style.maxLetter))
            if(!this.objectArray[obj.object_type][indx].style.isAddedExtra && this.objectArray[obj.object_type][indx].style.extraAddAble) {
              this.objectArray[obj.object_type][indx].style.isAddedExtra = true
              this.insertTextAreaPage(obj, true)
            }
          } else {
            if(this.objectArray[obj.object_type][indx].style.isAddedExtra && this.objectArray[obj.object_type][indx].style.extraAddAble) {
              this.objectArray[obj.object_type][indx].style.isAddedExtra = false
              this.removeTextAreaPage(obj)
            }
          }
          this.objectArray[obj.object_type][indx].value = obj.value
        }
      },
      // checkName() {
      //   if(this.doc_name != '') {
      //     this.dialog = false
      //     this.sendStep()
      //   }
      // },
      genTemplate(temp_array) {
        var pageLength = temp_array.length
        var pageTemplates = [{}]
        for(var i = 0; i < pageLength; i++ ) {
          var THkey = Object.keys(temp_array[i])[0]
          var array_temaplate = []
          temp_array[i][THkey].forEach(e => {
            var cmp = {
              name: e.name_input,
              value: e.value,
              object_name: e.object_name,
              placeholder: e.placeholder,
              style: e.style,
              text: e.text,
              choices: e.choices,
              show: false,
              selected: false,
              top: e.position.top,
              left: e.position.left,
              width: e.position.width,
              height: e.position.height,
              section: e.position.section,
              object_type: e.object_type,
              page: e.page
            }
            if(typeof style !== 'undefined') {
              if(e.object_type == 'datepickerbox') {
                if(!e.style.noDefaultDate) {
                  cmp.value = new Date().toISOString().substr(0, 10)
                }
                cmp.style.valueFilled = false
              }
              if(!cmp.style.permission) {
                cmp.style.permission =  {byRole:true, value_role:[], value_email:[]}
              }
              if(typeof cmp.style.suffix === 'undefined' || !cmp.style.suffix ) {
                  cmp.style.suffix = ""
                }
              if(!cmp.style.isComma) {
                cmp.style.isComma =  false
              }
              if(!e.excel) {
                cmp.excel = ""
              }
              if(!e.style.decimal) {
                cmp.style.decimal = 0
              }
              if(!e.style.validate) {
                cmp.style.validate = {value:"", fx: ""}
              }
              if(!e.style.font_align) {
                cmp.style.font_align = "justify"
              }
              if(!e.style.addTable) {
                cmp.style.addTable = false
              }
              if(!e.style.isZero) {
                cmp.style.isZero = false
              }
              if(!e.style.isZero) {
                cmp.style.isZero = false
              }
              if(typeof e.style.textAreaValiable === 'undefined') {
                cmp.style.textAreaValiable =[]
              }
              if(typeof e.style.checkBoxGroup === 'undefined') {
                cmp.style.checkBoxGroup =[]
              }
              if(e.object_type != "dataTableObjectArray") {
                cmp.style = this.fixObjectStyle(cmp.style)
              }
            }
            array_temaplate.push(cmp)
          })
          pageTemplates[0][THkey] = array_temaplate   
        }
        
        return pageTemplates 
      },
      async templateTempStore(template_array) {
        this.notReady = false
        this.$store.commit('setObjectTemplate',{ 
            template_array: template_array,
            dataTableObjectArray: this.dataTableObjectArray,
            template_option:this.template_option
          }
        )
        sessionStorage.setItem('template_array',false)
        this.$router.push({ 'path': '/form/preview'})
        // try {
        //   this.notReady = true
        //   var url = ''
        //   if(this.isPublic) {
        //     url = '/object_template_guest'
        //   } else {
        //     url = '/object_template'
        //   }
        //   var { data } = await this.axios.post(this.$eform_api + url,
        //   { 
        //     object_temp: {
        //       template_array: template_array,
        //       dataTableObjectArray: this.dataTableObjectArray,
        //       template_option:this.template_option
        //       }
        //   })
        //   this.notReady = false
        //   if(data.messageText.messageER != 'ER') {
        //     sessionStorage.setItem('template_array',false)
        //     sessionStorage.setItem('template_array_code',JSON.stringify(data.messageText.data.temp))
        //     this.$router.push({ 'path': '/form/preview_template'})
        //   }
        // } catch (error) {
        //   this.notReady = false
        //   console.log(error.message)
        // }
      },
      async sendStep(document_name, uploadFiles, opsPage) {
        try {
          // this.files = uploadFiles
          // if (this.files.length) {
          //   await this.uploadAttachFile("", "")
          // }
          this.optionsPage = opsPage
          var business = ""
          this.doc_name = document_name
          if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
            business = JSON.parse(sessionStorage.getItem('selected_business'))
          }
          var code_tmp = ""
          var ver_tmp = ""
          if(sessionStorage.getItem('code_template')) {
            code_tmp = sessionStorage.getItem('code_template')
          }
          if(sessionStorage.getItem('version_template')) {
            ver_tmp = sessionStorage.getItem('version_template')
          }
          var docTypeCode = ''
          if(this.template_option.document_type_code) {
            docTypeCode = this.template_option.document_type_code
          }
          var flowPerm = JSON.parse(sessionStorage.getItem('flowPermission'))
          var template_prop = this.setTemplateProperty(this.template_option)
          var sendingHtml = await this.genHtml()
          this.notReady = true
          var url = this.$eform_api_v6 + '/upload_eform'
          var speacailForm = this.$speacailForm
          if(speacailForm.includes(this.template_option.template_id)) {
            url = this.$eform_node_api + "/create_eform"
          }
          var { data } = await this.axios.post(url,
          { 
            ppl_template_code: this.template_option.template_paperless_code,
            temp_code: this.template_option.template_id,
            header_template: this.genTemplate(this.template_option.template_header),
            body_template: this.genTemplate(this.template_option.template_body),
            footer_template: this.genTemplate(this.template_option.template_footer),
            code_document: code_tmp ,
            version_document: ver_tmp,
            size_header: template_prop.size_header,
            size_body: template_prop.size_body,
            size_footer: template_prop.size_footer,
            template_name: this.template_name,
            document_name: this.doc_name,
            permission_form: business,
            orientation: template_prop.orientation,
            paper_size: this.template_option.paper_size,
            comment: [],
            data: this.template_option.flow_permission,
            description: this.template_option.description_template,
            ppl_sign:[],
            document_type_code: docTypeCode,
            html: sendingHtml,
            html_ppl: sendingHtml,
            paperless_data: {
              option_page: this.optionsPage,
            },
            status_draft: false,
            ref_document_number: [],
            folder_name: this.uploadFolder,
            current_step: this.currentStep
          },
          {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
            }
          })
          this.notReady = false
          if(data.result != "ER") {
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
              } else {
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
              } else {
                this.$swal({
                  backdrop: false,
                  position: 'bottom-end',
                  width: '330px',
                  title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
                  text: this.textLang.alert.assign,
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
            this.sendInsertChat(data.messageText.data.e_id)
            this.$router.push({ 'path': '/form'})
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
            } else {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
                text: this.textLang.alert.fail,
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
        } catch (error) {
          this.notReady = false
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
            text: this.textLang.alert.fail,
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
          console.log(error.message)
        }
      },
      async uploadAttachFile(doc_no, e_id) {
        let formData = new FormData()
        this.files.forEach(e => {
          formData.append("file", e)
        })
        formData.append("doc_number", doc_no)
        formData.append("e_id", e_id)
        formData.append("folder_name", this.uploadFolder)
        try {
          this.notReady = true
          var { data } = await this.axios.post(
            this.$eform_api_v2 + "/attract_file",
            formData)
          this.notReady = false
          if(data.result == "OK") {
            this.uploadFolder = data.data.Folder_name
            var holdFiles = this.attachedFiles.filter(item => !item.waitUpload)
            if(data.data.file_attract.length) {
              data.data.file_attract.forEach(e => {
                holdFiles.push(e)
              })
            }
            this.attachedFiles = holdFiles
            this.attachedFiles.forEach(e => {
              e.waitUpload = false
            })
            this.files = []
          } else {
            this.files = []
            this.attachedFiles = this.attachedFiles.filter(item => !item.waitUpload)
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
              text: this.textLang.alert.upload_fail,
              showCloseButton: true,
              showConfirmButton: false,
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
          this.files = []
          this.attachedFiles = this.attachedFiles.filter(item => !item.waitUpload)
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#FF8F00" d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_warning + '</strong>',
            text: this.textLang.alert.upload_fail,
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
              popup: 'alert-card',
              title: 'alert-title-block',
              closeButton: 'close-alert-btn',
              htmlContainer: 'alert-text-block'
            }
          })
        }
      },
      async sendInsertChat(e_id) {
        try {
          this.notReady = true
          var { data } = await this.axios.post(this.$eform_api + "/send_chat_signing",
            { 
              e_id: e_id
            })
          this.notReady = false
        } catch (error) {
          this.notReady = false
          console.log(error.message)
        }
      },      
      setTemplateProperty(template) {
        var tempOrientation = template.orientation
        var pageLen = template.orientation.length
        var prop = {
          orientation: [{}],
          size_header: [{}],
          size_body: [{}],
          size_footer: [{}],
        }

        for(var i = 0; i<pageLen; i++) {
          var Okey = Object.keys(template.orientation[i])[0]
          if(template.orientation[i][Okey]) {
            prop.orientation[0][Okey] = template.orientation[i][Okey].toUpperCase()
          } else {
            prop.orientation[0][Okey] = "PORTRAIT"
          }
          prop.size_header[0][i+1] = []
          prop.size_body[0][i+1] = []
          prop.size_footer[0][i+1] = []
        }

        return prop
      },
      AddAttachFile() {
        var uploadingFiles = this.files
        var attFiles = this.attachedFiles
        EventBus.$emit('attachFiles', uploadingFiles, attFiles)
      },
      openReverse() {
        var backStepChoice = this.backStepArray
        // EventBus.$emit('reverseDocument',backStepChoice)
        EventBus.$emit('FormReturn',this.template_option)
      },
      openReject() {
        var eId = this.template_option 
        EventBus.$emit('rejectDocument',eId)
      },
      openCancel() {
        var tempOpt = this.option
        EventBus.$emit('ConfirmCancelDoc',tempOpt)
      },
      async summitReject(detail) {
        try {
          this.notReady = true
          // var { data } = await this.axios.put(this.$eform_api_v6 + '/upload_eform',
          // {
          //   e_id: eId,
          //   status:"reject"
          // })
          var step_index = 0
          detail.transaction_detail.flow_data.forEach(element => {
            if(element.status == 'W') step_index = element.index
          });
          var body = {
            type:'reject',
            transaction_id: detail.transaction_id,
            document_id:detail.transaction_detail.document_id,
            tracking:detail.transaction_detail.tracking,
            step_index:step_index,
            action:'reject',
            string_sign:'',
            typesign:'web'
          }
          const url = '/transaction/api/v1/updatetransaction'
          var {data} = await this.axios.put(this.$api_url + url, body)
          this.notReady = false
          if(data.status) {
            // this.disableButton(eId)
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
              text: this.textLang.alert.reject_complete,
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
            this.$router.push({ 'path': '/form'})
          } else {
            this.$swal({
              backdrop: false,
              position: 'bottom-end',
              width: '330px',
              title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
              text: this.textLang.alert.reject_fail,
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
        } catch(err) {
          this.notReady = false
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
            text: this.textLang.alert.reject_fail,
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
          console.log(err)
        }
      },
      changeUploadingFiles(uploadingFiles) {
        this.files = uploadingFiles
        this.$store.commit('setUploadedFile',this.files)
        // this.applyAttachFiles() 
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
          this.uploadAttachFile('', '')
        }
        this.attachedFiles = holdFiles
        // this.$store.commit('setUploadedFile',this.files)
      },
      removeAttachFiles() {
        this.attachedFiles = JSON.parse(sessionStorage.getItem("Folder_Attachment_Name"))
      },
      async disableButton(e_id) {
        try {
          var { data } = await this.axios.post(this.$eform_api + "/disble_button",
            {
              e_id: e_id
            })
        } catch (error) {
          console.log(error.message)
        }
      },
      async backStep(backStepTarget) {
        try {
          this.notReady = true
          var { data } = await this.axios.put(this.$eform_api_v6 + '/upload_eform',
          { 
            e_id: this.template_option.e_id,
            document_name: this.template_option.document_name,
            document_email: this.template_option.email_user,
            comment:this.comments,
            name:backStepTarget.name,
            step_num: backStepTarget.step
          })
          this.notReady = false
          if(data.result != "ER") {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
                text: this.textLang.alert.reverse,
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
              this.$router.push({ 'path': '/form'})
              } else {
                this.$swal({
                  backdrop: false,
                  position: 'bottom-end',
                  width: '330px',
                  title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
                  text: this.textLang.alert.fail_reverse,
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
        } catch(err) {
          this.notReady = false
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
            text: this.textLang.alert.fail_reverse,
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
          console.log(err)
        }
      },
      changeLeaderName(obj) {
        var indx = this.objectArray['autofillbox'].findIndex(item => item.style.refValue == obj.object_name)
        var leaderValue = ""
        if(indx >= 0) {
          if(obj.value.show == 'leader_name_th') {
            leaderValue = this.leaderArray.find(item => item.thai_name == obj.value.show_index)
          } else if(obj.value.show == 'leader_name_eng') {
            leaderValue = this.leaderArray.find(item => item.eng_name == obj.value.show_index)
          }
          if(leaderValue) {
            this.objectArray['autofillbox'][indx].value.show_value = leaderValue.role_name
          } else {
            this.objectArray['autofillbox'][indx].value.show_value = ""
          }
        }
      },
      async importExcel() {
        let formData = new FormData()
        formData.append('excel_file', this.excelFile)
        formData.append('template_id', this.template_option.template_id)
        this.dialogImport = false
        this.notReady = true
        try {
          var { data } = await this.axios.post(this.$eform_api_v2 + '/import_template_excel',
          formData)
          this.notReady = false
          if(data.messageER != 'ER') {
            this.mappingExcelValue(data.messageText)
          }
        } catch (error) {
          this.notReady = false
          console.log(error.message)
        }
      },
      async imageUpload() {
        let formData = new FormData()
        formData.append('imagefile', this.uploadImage)
        this.dialogImageUpload = false
        this.notReady = true
        try {
          var { data } = await this.axios.post(this.$eform_api + '/upload_image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
            }
          })
          this.notReady = false
          if(data.messageER != 'ER') {
            this.objectArray[this.selected_array][this.selected_object].value = data.url[0].url
          }
        } catch (error) {
          this.notReady = false
          console.log(error.message)
        }
      },
      openUploadImage(obj) {
        if(!obj.disable) {
          this.selected_array = this.dataDict[obj.object_name].objectType
          this.selected_object = this.dataDict[obj.object_name].arrayIndex
          if(parseFloat(obj.width) > parseFloat(obj.height)) {
            this.objectArray[this.selected_array][this.selected_object].style.image_width = "auto"
            this.objectArray[this.selected_array][this.selected_object].style.image_height = obj.height + "px"
          } else {
            this.objectArray[this.selected_array][this.selected_object].style.image_width = obj.width + "px"
            this.objectArray[this.selected_array][this.selected_object].style.image_height = "auto"
          }
          this.dialogImageUpload = true
        }
        
      },
      async deleteUploadImage(obj) {
        if(!obj.disable) {
          this.selectObject(obj, obj.object_type)
          var imageLink = this.objectArray[this.selected_array][this.selected_object].value
          this.objectArray[this.selected_array][this.selected_object].value = ''
          try {
            var { data } = await this.axios.post(this.$eform_api + '/del_image',
            {
              url:imageLink
            })
          } catch(error) {
            console.log(error)
          }
        }
      },
      getHideByValue(hideFx, obj_name, indx, obj) {
        var hideOpt = hideFx
        var objectHideValue = []
        var isHide = true
        if(obj) {
          if(obj.object_type == 'inputimagebox' && !obj.isValued) {
            indx = '6'
          }
        }
        if(hideOpt) {
          hideOpt = hideOpt.split("hide(").join("")
          hideOpt = hideOpt.slice(0, -1)
          if(hideOpt[0] == '(' && hideOpt[hideOpt.length-1] == ')') {
             hideOpt = hideOpt.slice(1, hideOpt.length-1)
          }
          hideOpt = hideOpt.split("==").join("-")
          hideOpt = hideOpt.split("!=").join("-")
          hideOpt = hideOpt.split(">").join("-")
          hideOpt = hideOpt.split("<").join("-")
          hideOpt = hideOpt.split("<=").join("-")
          hideOpt = hideOpt.split(">=").join("-")
          hideOpt = hideOpt.split(")&&(").join("-")
          hideOpt = hideOpt.split(")||(").join("-")
          hideOpt = hideOpt.split("&&").join("-")
          hideOpt = hideOpt.split("||").join("-")
          var hideOptArray = hideOpt.split("-")
          hideOptArray.forEach(e => {
            if(e.startsWith("$")) {
              if(!objectHideValue.includes(e.split("$").join(""))){
                objectHideValue.push(e.split("$").join(""))
              }
            }
          })
          var hideValue = hideFx
          hideValue = hideValue.split("hide(").join("")
          hideValue = hideValue.slice(0, -1)
          objectHideValue.forEach(e => {
            if(e.startsWith('datatable')) {
              if(typeof this.dataTableObjectArray[e] != 'undefined') {
                 if(this.dataTableObjectArray[e].object_type == 'calculatebox') {
                  val = Number(this.dataTableObjectArray[e].value)
                } else {
                  if((this.dataTableObjectArray[e].object_type == 'inputbox' && this.dataTableObjectArray[e].style.number_only)||this.dataTableObjectArray[e].object_type == 'calculatebox') {
                    val = Number(this.dataTableObjectArray[e].value)
                  } else {
                    val = '"' + this.dataTableObjectArray[e].value + '"'
                  }
                }
                hideValue = hideValue.split('$'+e).join(val)
              } else {
                hideValue = hideValue.split('$'+e).join('0')
              }
            } else {
              if(typeof this.dataDict[e] != 'undefined') {
                var val = ""
                if(this.dataDict[e].objectType == 'calculatebox') {
                  val = Number(this.objectArray[this.dataDict[e].objectType][this.dataDict[e].arrayIndex].value)
                } else {
                  if(this.dataDict[e].objectType == 'inputbox' && this.objectArray[this.dataDict[e].objectType][this.dataDict[e].arrayIndex].style.number_only) {
                    val = Number(this.objectArray[this.dataDict[e].objectType][this.dataDict[e].arrayIndex].value)
                  } else {
                    val = '"' + this.objectArray[this.dataDict[e].objectType][this.dataDict[e].arrayIndex].value + '"'
                  }
                }
                hideValue = hideValue.split('$'+e).join(val)
              } else {
                hideValue = hideValue.split('$'+e).join('0')
              }
            }
          })
          try {
            isHide = Function('"use strict";return (' + hideValue+ '?false:true)')()
          } catch(e) {
            isHide = true
          }
        }
        if(obj_name) {
          if(isHide) {
            $('#' + obj_name).css('z-index',Number(indx))
          } else {
            $('#' + obj_name).css('z-index',1)
          }
        }
        return isHide
      },
      mappingExcelValue(tempArray) {
        tempArray.forEach(temp => {
          if(temp.template_header) {
            temp.template_header.forEach(e => {
              if(e.object_type != "dataTableObjectArray" && e.object_type != 'number2textbox' && e.object_type != 'autofillbox') {
                var obj = this.objectArray[e.object_type].find(item => item.object_name == e.object_name)
                if(obj) {
                  var objIndx = this.objectArray[e.object_type].indexOf(obj)
                  if(this.objectArray[e.object_type][objIndx].object_type == 'datepickerbox' && e.value.includes("/")) {
                    e.value = this.thaiDateToDate(e.value)
                  }
                  this.objectArray[e.object_type][objIndx].value = e.value
                  if(e.object_type == "inputbox") {
                    this.change_calculate(this.objectArray[e.object_type][objIndx].object_name, false)
                  }
                }
              }
            })
          }
        
          if(temp.template_body) {
            temp.template_body.forEach(e => {
              if(e.object_type != "dataTableObjectArray" && e.object_type != 'number2textbox' && e.object_type != 'autofillbox') {
                var obj = this.objectArray[e.object_type].find(item => item.object_name == e.object_name)
                if(obj) {
                  var objIndx = this.objectArray[e.object_type].indexOf(obj)
                  if(this.objectArray[e.object_type][objIndx].object_type == 'datepickerbox' && e.value.includes("/")) {
                    e.value = this.thaiDateToDate(e.value)
                  }
                  this.objectArray[e.object_type][objIndx].value = e.value
                  if(e.object_type == "inputbox") {
                    this.change_calculate(this.objectArray[e.object_type][objIndx].object_name, false)
                  }
                }
              }
            })
          }

          if(temp.template_footer) {
            temp.template_footer.forEach(e => {
              if(e.object_type != "dataTableObjectArray" && e.object_type != 'number2textbox' && e.object_type != 'autofillbox') {
                var obj = this.objectArray[e.object_type].find(item => item.object_name == e.object_name)
                if(obj) {
                  var objIndx = this.objectArray[e.object_type].indexOf(obj)
                  if(this.objectArray[e.object_type][objIndx].object_type == 'datepickerbox' && e.value.includes("/")) {
                    e.value = this.thaiDateToDate(e.value)
                  }
                  this.objectArray[e.object_type][objIndx].value = e.value
                  if(e.object_type == "inputbox") {
                    this.change_calculate(this.objectArray[e.object_type][objIndx].object_name, false)
                  }
                }
              }
            })
          }
          this.objectArray["datatable"].forEach(e => {
            e.style.valueList = this.getValueList(e.value)
          })
          var tempDatatable = temp.template_header.find(item => item.object_type == "dataTableObjectArray")
          if(tempDatatable) {
            Object.keys(tempDatatable.value).forEach( e => {
              if(this.dataTableObjectArray[e].object_type == 'datepickerbox' && tempDatatable.value[e].value.includes("/")) {
                tempDatatable.value[e].value = this.thaiDateToDate(tempDatatable.value[e].value)
              }
              this.dataTableObjectArray[e].value = tempDatatable.value[e].value
            })
          }
          if(this.objectArray['datatable'].length) {
            this.getDataTableList(true)
          }
        })
      },
      insertTextAreaPage(obj, isMove) {
        this.pages.push({
          index: this.pages.length + 1,
          template_side: this.pages[this.pages.length-1].template_side,
          url_image: this.pages[this.pages.length-1].url_image,
          isHide:false
        })
        var addedPage = Number(obj.page) + 1
        var moveArray = []
        var copyObj = []
        for(let i = addedPage; i <= this.pages.length; i++) {
          moveArray.push(i)
        }
        if(isMove) {
          this.objectType.forEach(e => {
            this.objectArray[e].forEach(e2 => {
              if(moveArray.includes(e2.page)) {
                e2.page++
              }
            })
          })
        }

        this.objectType.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            if(e2.page == obj.page && e2.object_type != 'datatable') {
              copyObj.push(e2)
            }
          })
        })

        copyObj.forEach(e => {
          var cmp = {
            name: e.name + "_extent",
            value: e.value,
            defaultValue: e.defaultValue,
            object_name: e.object_name + "_extent",
            placeholder: e.placeholder,
            style: {},
            text: e.text,
            choices: e.choices,
            show: false,
            selected: false,
            top: e.top,
            defaultTop: e.defaultTop,
            defaultPage: addedPage,
            left: e.left,
            width: e.width,
            height: e.height,
            section: e.section,
            object_type: e.object_type,
            disable: false,
            textHl: false,
            page: addedPage
          }
          Object.keys(e.style).forEach(e2 => {
            cmp.style[e2] = e.style[e2]
          })
          if(cmp.object_type == 'textareabox') {
            cmp.value = ""
          }
          cmp.style.json_key = cmp.style.json_key + "_extend"
          cmp.style.isAddedExtra = false
          this.objectArray[e.object_type].push(cmp)
          this.dataDict[cmp.object_name] = {objectType: cmp.object_type, arrayIndex: this.objectArray[cmp.object_type].indexOf(cmp)}
        })
        
        this.setPosition(false)
        var newOrt = {}
        newOrt[this.template_option.orientation.length +1] = this.template_side
        this.template_option.orientation.push(newOrt)
      },
      removeTextAreaPage(obj) {
        var exLength = this.pages.length
        this.pages.pop()
        var removePage = Number(obj.page) + 1
        var moveArray = []
        var copyObj = []
        this.objectType.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            if(e2.page == removePage) {
              copyObj.push(e2)
            }
          })
        })

        if(copyObj.length) {
          copyObj.forEach(e => {
            var extObj = this.objectArray[e.object_type].find(item => item.object_name == e.object_name)
            if(extObj) {
              var indx = this.objectArray[e.object_type].indexOf(extObj)
              this.objectArray[e.object_type].splice(indx, 1)
            }
          })
        }
        for(let i =removePage; i <= exLength; i++) {
          moveArray.push(i)
        }
        this.objectType.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            if(moveArray.includes(e2.page)) {
              e2.page--
            }
          })
        })
         this.template_option.orientation.pop()
      },
      async getCvmList() {
        try{
          var { data } = await this.axios.get(this.$eform_api + '/list_cvmid')
          if(data.result == 'OK') {
            this.cvmArray = data.messageText
          }
        } catch(e) {

        }
      },
      async getSoList() {
        try{
          var { data } = await this.axios.get(this.$eform_node_api + '/list_sonumber')
          if(data.result == 'OK') {
            this.soArray = data.messageText
          }
        } catch(e) {

        }
      },
      async getInvoiceList() {
        try{
          this.notReady = true
          var { data } = await this.axios.get(this.$eform_node_api + '/list_invoice',
          {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem("one_access_token")
            }
          })
          this.notReady = false
          if(data.result == 'OK') {
            this.invoiceArray = data.messageText
          }
        } catch(e) {
          this.notReady = false
        }
      },
      async getCusList() {
        try{
          this.notReady = true
          var { data } = await this.axios.get(this.$eform_node_api + '/list_cusid')
          this.notReady = false
          if(data.result == 'OK') {
            this.cusArray = data.messageText
          }
        } catch(e) {
          this.notReady = false
        }
      },
      async getInvioceFromCus(value, obj_name) {
        try{
          if(value) {
            var { data } = await this.axios.get(this.$eform_node_api + '/data_customer?cus_id=' + value)
            if(data.result == 'OK') {
              var holdDropdown = this.objectArray['dropdownbox'].filter(item => item.style.autoChoices && item.style.autoChoicesSelect == 'invoice' && item.style.refAutoChoices == obj_name)
              holdDropdown.forEach(e => {
                var objIndex = this.dataDict[e.object_name].arrayIndex
                this.objectArray['dropdownbox'][objIndex].choices = data.messageText.Invoice
              })
              var holdDataDropdown = Object.values(this.dataTableObjectArray).filter(item => item.style.autoChoices && item.style.autoChoicesSelect == 'invoice' && item.style.refAutoChoices == obj_name)
              holdDataDropdown.forEach(e => {
                this.dataTableObjectArray[e.object_name].choices = data.messageText.Invoice
              })
              var holdAutoFill = this.objectArray['autofillbox'].filter(item => item.value.show == 'sys_cus_name')
              holdAutoFill.forEach(e => {
                var objIndex = this.dataDict[e.object_name].arrayIndex
                this.objectArray['autofillbox'][objIndex].value.show_index = data.messageText.Cus_Name
              })
            }
          }
          
        } catch(e) {

        }
      },
      async getProvinces(type, value) {
        var url = ""
        var resArray = []
        if(type == 'pro_th' || type == 'pro_en') {
          url = this.$eform_api + '/thailand_provinces'
        } else if(type == 'dis_th' || type == 'dis_en') {
          url = this.$eform_api + '/thailand_provinces?provinces_id=' + value
        } else if(type == 'subdis_th' || type == 'subdis_en') {
          url = this.$eform_api + '/thailand_provinces?amphure_id=' + value
        }
        try {
          var { data } = await this.axios.get(url)
          this.notReady = false
          if(data.result == 'OK') {
            if(type == 'pro_th' || type == 'pro_en') {
              this.provinceArray = data.messageText
            } else {
              resArray = data.messageText
            }
          }
          return resArray
        } catch (err) {
          this.notReady = false
          if (err.response != null) {
            if (err.response.status == 401) {
              this.$router.push('/notfound')
            }
          } else {
            console.log(err.message)
          }
        }
        return []
      },
      async getLeaderInfo(taxId) {
        try {
          var res = []
          var { data } = await this.axios.post(this.$eform_api + '/get_parent',
          {
            "tax_id":taxId
          })
          this.notReady = false
          if(data.result == 'OK') {
            res = data.messageText
            this.leaderArray = data.messageText
          }
        } catch (err) {
          this.notReady = false
          if (err.response != null) {
            if (err.response.status == 401) {
              this.$router.push('/notfound')
            }
          } else {
            console.log(err.message)
          }
        }
        return res
      },
      genHtmlFontsize(value, html) {
        html += "font-size: " + value + "px;"
        return html
      },
      genHtmlFontstyle(value, html) {
        var font_style = value
        font_style.forEach(s => {
          if (s == "b") {
            html += "font-weight: bold; "
          } else if (s == "i") {
            html += "font-style: italic; "
          } else if (s == "u") {
            html += "text-decoration: underline; "
          }
        });
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
      genHtml() {
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
        this.templateArray.forEach(e => {
          if (e.page == p && !e.style.hideDisplay && !e.style.hidePreview && e.object_type != "texteditorbox") {
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
            } else {
              html += String(e.height) + "px; width:"
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
              html += "z-index:" + String(e.style.zIndex) +";"
              html = this.genHtmlFontsize(e.style.font_size, html)
              html = this.genHtmlFontstyle(e.style.font_style, html)
              html = this.genHtmlFontcolor(e.style.font_color, html)
            } else if (e.object_type == "textareabox") {
              html += String(e.width) + "px; opacity:1; display:table-cell; left:"
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
              html += "z-index:" + String(e.style.zIndex) +";"
              html = this.genHtmlFontsize(e.style.font_size, html)
              html = this.genHtmlFontstyle(e.style.font_style, html)
              html = this.genHtmlFontcolor(e.style.font_color, html)
            } else if (e.object_type == "rectangle") {
              html += String(e.width - parseInt(e.style.border_size) * 2) + "px; opacity:1; display:table-cell; left:"
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
              html += "z-index:" + String(e.style.zIndex) +";"
              html = this.genHtmlBordersize(e.style.border_size, html)
              html = this.genHtmlBorderscolor(e.style.border_color, html)
              html = this.genHtmlBackgroundcolor(e.style.background_color, html)
              html = this.genHtmlBorderradias(e.style.border_radias, html)
            } else if (e.object_type == "signbox") {
              html += String(e.width) + "px; opacity:1; display:table-cell; left:"
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
              html += "z-index:" + String(e.style.zIndex) +";"
            } else if (e.object_type == "table" || e.object_type == "datatable"
            ) {
              if (!e.width) {
                html += "auto" + "; opacity:1; left:"
              } else {
                html += "auto" + "; opacity:1; left:"
              }
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
              html += "z-index:" + String(e.style.zIndex) +";"
            } else if (e.object_type == "line") {
              html += String(e.width) + "px; opacity:1; left:"
              html += String(e.left) + "px; top:"
              html += String(e.top) + "px; "
              html += "z-index:" + String(e.style.zIndex) +";"
            }
            html += 'font-family: "Sarabun", sans-serif;'
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
              html += "<img  width='" + e.style.image_width + "px' height='" + e.style.image_height + "px' src='" + e.value + "'></div>"
            } else if (e.object_type == "signbox") {
              if(e.style.isCa) {
                html += "<div id='"+ e.object_name +"'></div></div>"
              }  else {
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
                html += this.replaceGtLt(e.value.show_index + e.style.suffix) + "</div>"
              } else {
                e.value.show_array == "calculatebox" || (e.value.show_array == "inputbox" && e.value.isComma)? (html += this.replaceGtLt(this.numberToComma(e.value.show_value, e.style.isComma) + e.style.suffix) + "</div>")
                :(html += this.replaceGtLt(e.value.show_value + e.style.suffix) + "</div>")
              }
            } else if (e.object_type == "number2textbox") {
              html += e.value.show_value + "</div>"
            } else if (e.object_type == "table") {
              html += "<table style='border-collapse:collapse; border:"
              html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
              for (var i = 0; i < e.style.table.rowsize.length; i++) {
                html +=
                  "<tr style='height:" +
                  e.style.table.rowsize[i].size +
                  "px; border-collapse:collapse; border:"
                html +=
                  e.style.border_size +
                  "px solid " +
                  e.style.border_color +
                  ";'>"
                for (var j = 0; j < e.style.table.colsize.length; j++) {
                  html +=
                    "<td style='width:" +
                    String(parseFloat(e.style.table.colsize[j].size) - 3) +
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
              html += "<table style='border-collapse:collapse; border:"
              html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
              for (var i = 0; i < e.style.table.rowsize.length; i++) {
                html += "<tr style='height:" + String(Number(e.style.table.rowsize[i].size) + 1) + "px; border-collapse:collapse; border:"
                html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
                for (var j = 0; j < e.style.table.colsize.length; j++) {
                  if(!this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.hideDisplay) {
                    html +="<td style='width:" + String(Number(e.style.table.colsize[j].size) - 3) + "px; border-collapse:collapse; border:"
                    html += e.style.border_size + "px solid " + e.style.border_color + "; background-color:" + 
                      this.dataTableObjectArray[ e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.background_color + ";"
                    html += "text-align:" + this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_align +";";
                    html = this.genHtmlFontsize(this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_size,html)
                    html = this.genHtmlFontstyle(this.dataTableObjectArray[e.object_name +"_" +"R" +String(i + 1) + "C" + String(j + 1)].style.font_style,html)
                    html = this.genHtmlFontcolor(this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_color,html)
                    html += "'>"
                    if (this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].object_type == "checkbox" && !this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].style.hideDisplay) {
                      if (this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].show_value) {
                        html += "<img  width='" + this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_size +
                          "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_84c82695-0eff-4e1f-9e42-f07d49104a84.png'>"
                      } else{
                        html += "<img  width='" + this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.font_size +
                          "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png'>";
                      }
                      html += "<span style='margin-left:3px;'>" + this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].text + "</span></div>"
                    } else if(this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].object_type != "checkbox" && this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].object_type != "calculatebox" && !this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].style.hideDisplay) {
                      html += this.replaceGtLt(this.numberToComma(this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].show_value,
                        this.dataTableObjectArray[e.object_name + "_" + "R" + String(i + 1) + "C" + String(j + 1)].style.isComma)
                      )
                      html += this.dataTableObjectArray[e.object_name +"_" +"R" +String(i + 1) +"C" +String(j + 1)].style.suffix
                    } else if( this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].object_type == "calculatebox" && !this.dataTableObjectArray[e.object_name +"_" + "R" + String(i + 1) + "C" + String(j + 1)].style.hideDisplay) {
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
                    html += this.replaceGtLt(String(e.value)) + "</div>"
                  } else if (e.object_type == "calculatebox") {
                    html += this.replaceGtLt(String(this.numberToComma(e.valueShow, e.style.isComma)) + e.style.suffix) + "</div>"
                  } else if (e.object_type == "inputbox" && e.style.isComma) {
                    html += this.replaceGtLt(String(this.numberToComma(e.value, e.style.isComma)) + e.style.suffix) + "</div>"
                  } else if (e.object_type == "dropdownbox") {
                    html += this.replaceGtLt(String(e.show_value)) + "</div>"
                  } else {
                    if(e.object_type != "number2textbox") { 
                      html += String(e.value) + e.style.suffix + "</div>"
                    } else {
                      html += String(e.value) + "</div>"
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
    replaceGtLt(inputWord) {
      if(typeof inputWord === 'string') {
        return inputWord.split('<').join('&lt;').split('>').join('&gt;')
      } else {
        return inputWord
      }
    },
    async downloadFromEid() {
      window.open(`${this.$api_url}/public/v1/download/${this.template_option.tax_id}/${this.template_option.transaction_id}`)
    },
      clear () {
        this.objectArray['inputbox'].forEach(obj => {
          if(!obj.disable) {
            obj.value = ""
          }
        })
        this.objectArray['dropdownbox'].forEach(obj => {
          if(!obj.disable) {
            obj.value = ""
          }
        })
        this.objectArray['checkbox'].forEach(obj => {
          if(!obj.disable) {
            obj.value = false
          }
        })
        this.objectArray['datepickerbox'].forEach(obj => {
          if(!obj.disable) {
            obj.value = ""
          }
        })
        this.objectArray['textareabox'].forEach(obj => {
          if(!obj.disable) {
            obj.value = ""
          }
        })
        this.objectArray['texteditorbox'].forEach(obj => {
          if(!obj.disable) {
            obj.value = ""
          }
        })
      },
      async reCalculate() {
        this.notReady= true
        await this.reCalculateFx()
        this.notReady= false
      },
      async reCalculateFx() {
        for(let i=0; i<this.objectArray['calculatebox'].length; i++) {
          await this.change_calculate(this.objectArray['calculatebox'][i].object_name, true)
        }
        var calDatatable = Object.values(this.dataTableObjectArray).filter(item => item.object_type == 'calculatebox')
        for(let i=0; i<calDatatable.length; i++) {
          await this.change_calculate(calDatatable[i].object_name, true)
        }
      },
      moveSign(item) {
        if(this.allUserStep || this.isSendStep) {
          if(item.page == this.currentPage) {
            $('#' + item.name).draggable({cursor: "move" ,containment: "#workpaper", scroll: false})
          }
        }
      },
      back () {
        this.clear()
        this.$router.push({ 'path': '/use_template'})
      },
      openSignpad() {
        EventBus.$emit('openSignpad')
      },
      async getAttachfile(template_opt) {
        var resAttach = []
        try {
          const url = `/file-component/api/getListFile?transaction_id=${template_opt.transaction_id}`
          var { data } = await this.axios.get(`${this.$api_url}${url}`)
          resAttach = data.data
        } catch(e) {
          console.log(e)
        }
        return resAttach 
      }
    }
  }
</script>

<style>
  .back-show-btn {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px !important;
    text-transform: capitalize;
  }

  .send-back-btn {
    font-family: 'Sarabun', sans-serif;
    margin-right: 1%;
    text-transform: capitalize;
  }

  .send-back-btn-icon {
    min-width: 60px !important;
  }

  .send-back-btn-icon:hover .btn-view-attachment {
    width: 152px !important;
  }

  .btn-view-attachment {
    width: 0px !important;
    transition: width 0.5s;
    overflow: hidden;
    padding-left: 5%;
  }

  .send-back-btn-icon:hover .btn-review-ex {
    width: 120px !important;
  }

  .btn-review-ex {
    width: 0px !important;
    transition: width 0.5s;
    overflow: hidden;
    padding-left: 5%;
  }

  .send-back-btn-icon:hover .btn-expan-word {
    width: 155px !important;
  }

  .btn-expan-word {
    width: 0px !important;
    transition: width 1s;
    overflow: hidden;
    padding-left: 3%;
  }

  .send-back-btn-icon:hover .btn-return-edit {
    width: 78px !important;
  }

  .btn-return-edit {
    width: 0px !important;
    transition: width 0.5s;
    overflow: hidden;
    padding-left: 5%;
  }

  .send-back-btn-icon:hover .btn-reject-doc {
    width: 88px !important;
  }

  .btn-reject-doc{
    width: 0px !important;
    transition: width 0.5s;
    overflow: hidden;
    padding-left: 5%;
  }

  .send-back-btn-icon:hover .btn-cancel-doc {
    width: 98px !important;
  }

  .btn-cancel-doc{
    width: 0px !important;
    transition: width 0.5s;
    overflow: hidden;
    padding-left: 5%;
  }

  .save-draft-word {
    line-height: 22px;
  }

  .preview-btn {
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
  }

  .select-form-page-block {
    background-color: white;
    height: calc(100vh - 129px);
    overflow: auto;
    border-right: solid 1px #E0E0E0;
  }

  .recalculate-btn {
    margin-left: 4%;
  }

  .clear-data-btn {
    margin-left: 4%;
    padding-left: 3% !important;
    padding-right: 3% !important;
  }

  .menu-show-page {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    line-height: 20px !important;
  }

  .show-form-block {
    width: 100%;
    margin: 0%;
  }

  .input-form-row {
    width: 100%;
    margin: 0%;
  }

  .num-page-input-form {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
  }

  .temp-name {
    width: 100%;
    margin: 0%;
    font-family: 'Sarabun', sans-serif;
    text-align: center;
  }

  .show-paper-block {
    /* margin-left: 2%;
    margin-top: 1%; */
    overflow: auto;
    height: calc(100vh - 224px);
    /* padding: 1%; */
  }

  .not-show-icon {
    position: absolute !important;
    top: -50%;
    left: 0%;
    z-index: 1;
    opacity: 0.5;
  }

  .not-show-icon-textarea {
    position: absolute !important;
    top: -19%;
    z-index: 1;
    opacity: 0.5;
  }

  .not-show-icon-editorbox {
    position: absolute !important;
    top: -8%;
    z-index: 1;
    opacity: 0.5;
  }

  .not-show-icon-checkbox {
    position: absolute !important;
    top: -50%;
    z-index: 1;
    opacity: 0.5;
  }

  .not-show-icon-image {
    position: absolute !important;
    top: -7%;
    z-index: 1;
    opacity: 0.5;
  }

  .time-picker-clock .v-picker__body {
    width: 100%;
  }

  .temp-title-mobile-row {
    width: 100%;
    margin-left: 0%;
  }

  .temp-name-mobile {
    font-family: 'Sarabun', sans-serif;
    text-align: center;
  }

  .comment-mobile-btn-block {
    text-align: end;
  }

  .open-comment-mobile-btn {
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
  }

  .close-comment-mobile-btn {
    height: 100% !important;
  }

  .all-temp-mobile-row {
    width: 100%;
    margin-left: 0%;
  }

  .comments-box {
    height: calc(100vh - 271px);
    overflow: auto;
  }

  .comment-set {
    width: 100%;
    margin: 0%;
  }

  .comment-block2 {
    background-color: white;
    border-left: solid 1px #E0E0E0;
    height: 100%;
    z-index: 12;
  }

  .comment-name {
    font-family: 'Sarabun', sans-serif;
    color: black;
    font-size: 14px;
  }

  .comment-sentence {
    font-family: 'Sarabun', sans-serif;
    font-size: 14px;
    color: black;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .show-comment-row {
    width: 100%;
    margin: 0%;
  }

  .comment-date {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
    color: #808080;
  }

  .variable-textarea-ex-title {
    font-family: 'Sarabun', sans-serif;
    color: black;
  }

  .textarea-ex-box {
    border-style: solid;
    border-width: 2px;
    border-color:#67c25d;
    border-radius: 5px;
    padding: 6px;
    margin-top: 2%;
  }

  .textarea-ex {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
    color: black;
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }

  .variable-title {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    color: black;
  }

  .v-text-field.pad-input-textarea-variable input {
    line-height: 21px;
  }

  .variable-textarea {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .letters-length {
    font-family: 'Sarabun', sans-serif;
    text-align: right;
    font-size: 12px;
    color: lightgray;
    line-height: 3px;
  }

  .editor-box {
    border: 1px solid lightgray;
    padding-left: 2px;
    padding-right: 2px;
    border-radius: 4px;
    height: inherit;
    overflow: auto;
  }

  .tox-notifications-container {
    display: none !important;
  }

  .tox .tox-editor-header {
    z-index: 10 !important;
  }

  #workpaper {
    font-family: 'Sarabun', sans-serif;
  }

  .type-doc-import-title {
    font-family: 'Sarabun', sans-serif;
    color: black;
    font-size: 16px;
  }

  .type-doc-import {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .type-doc-import-box.v-text-field input {
    line-height: 21px !important;
  }

  .doc-import-dropdown-icon .theme--light.v-icon {
    color: rgba(0, 0, 0, 0.54) !important;
  }

  .doc-num-import {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .input-form-modal-header {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
  }

  .insert-image-file {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .insert-image-btn-modal {
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
  }

  .textarea-variable-modal-header {
    font-family: "Sarabun", sans-serif;
    font-size: 16px !important;
    color: white;
    background-color: #67c25d;
  }

  /*======== style from old file >> Show_Template(old version) ========*/

  .loading-circle-block {
    position: fixed;
    /* top:25%; 
    left:45%;  */
    width: 100%;
    height: 100%;
    z-index: 15;
    background-color: gray;
    opacity: 0.3;
  }

  .textarea-btn {
    position: absolute;
    right: -30px;
    top: -10px;
  }

  .autocomplete-pad.v-select.v-text-field input {
    /* padding-left: 4px !important; */
    line-height: unset;
  }

  .delete-img {
    position: absolute;
    top: -3%;
    right: -3%;
  }

  .datatable-delete-img {
    position: absolute;
    right: 0%;
    width: 20px !important;
    height: 20px !important;
  }

  .add-row-button-block {
    position: absolute;
    right: -75px;
    bottom: -6px;
  }

  .delete-row-button-block {
    position: absolute;
    right: -37px;
    /* display: inline-block; */
    margin-top: -25px;
  }

  .show-input-comment-box {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
  }

  .comment-header-property {
    font-family: 'Sarabun', sans-serif;
    font-size: 16px;
    text-decoration: underline;
    display: inline-block;
  }

  .v-textarea.v-text-field--enclosed.pad-textarea .v-text-field__slot textarea {
    margin-top: 0px;
    /* padding-left: 2%;
    padding-bottom: 0%;
    padding-top: 0%; */
    line-height: 23px;
  }

  .comment {
    color: darkslategrey !important;
    font-family: 'Sarabun', sans-serif;
  }

  .theme--light.v-pagination.page-button-use .v-pagination__navigation {
    background-color: #C2EB81;
    color: #1b9900;
  }

  .theme--light.v-pagination.page-button-use .v-pagination__item {
    background-color: #C2EB81;
    color: #1b9900;
  }

  .theme--light.v-pagination .v-pagination__item--active {
    color: white !important;
  }

  .more-en{
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
  }

  /*========================================*/
  @media only screen and (max-width:600px){ /*css for mobile screen*/

    .preview-btn {
      padding-left: 2% !important;
      padding-right: 2% !important;
    }

    .recalculate-btn {
      margin-left: 2% !important;
    }

    .clear-data-btn {
      margin-left: 2% !important;
      padding-left: 1% !important;
      padding-right: 1% !important;
    }

    .open-comment-mobile-btn {
      font-size: 11px !important;
    }

    .show-comment-btn {
      font-size: 11px !important;
      margin-left: 2%;
      padding-left: 2% !important;
    }

    .temp-name {
      padding-left: 2%;
    }

    .comment-block2 {
      position: fixed;
      right: 0px;
      top: 112px;
    }

    .comments-box {
      height: calc(100vh - 259px);
    }

    .show-paper-block { 
      height: calc(100vh - 214px);
    }

    .type-doc-import-title {
      padding-bottom: 0%;
    }

  }
</style>
