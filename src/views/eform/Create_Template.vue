<template>
  <div>
    <v-overlay :value="notReady" absolute opacity="0.3">
      <img width="100px" src="../../assets/loader.gif" class="loading-circle">
    </v-overlay>
    <v-toolbar dense flat class="create-menu-bar"> <!--menu bar -->
      <v-btn icon text large color="#4CAF50" @click="openBack()"><v-icon>mdi-chevron-left</v-icon></v-btn>
      <span class="name-page"><b>{{ textLang.tabMenubar.create_doc }}</b></span>
      <v-spacer></v-spacer>
      <v-tabs centered color="#4CAF50" class="create-menu" v-model="tab">
        <v-tab class="create-each-menu">{{ textLang.tabMenubar.set_format }}</v-tab>
        <v-tab class="create-each-menu">{{ textLang.tabMenubar.tools }}</v-tab>
        <v-tab class="create-each-menu">{{ textLang.tabMenubar.property }}</v-tab>
        <!-- <v-tab class="create-each-menu" @click="getAllPermission">{{ textLang.tabMenubar.complete_sequence }}</v-tab> -->
        <v-tab class="create-each-menu">{{ textLang.tabMenubar.set_paperless }}</v-tab>
        <v-tab class="create-short-form-menu">{{ textLang.tabMenubar.filling_mobile }}</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <!-- <v-btn depressed color="grey lighten-2" class="create-preview-btn"><v-icon>mdi-file-document</v-icon><b>ดูเอกสารตัวอย่าง</b></v-btn> -->
      <v-btn depressed dark color="#67C25D" class="save-create-btn" @click="openConfirmSave()">{{ textLang.tabMenubar.save }}</v-btn>
    </v-toolbar>
    <v-row class="create-form-row">
      <v-col v-show="show_page_select == true" :cols="col_page" class="page-select-block"> <!-- page select -->
        <v-row v-for="item in pages" :key="item.index">
          <v-col cols="1" class="num-page-block">
            <span class="num-page">{{item.index}}</span><br>
            <v-btn v-if="item.index != 1" icon text x-small color="#aaaaaa" @click="deletePage(item.index)"><v-icon>mdi-delete-forever</v-icon></v-btn>
          </v-col>
            <div id="droptarget" @drop="dropPage(item)" @dragover="allowDrop" style="cursor:move;">
              <v-col cols="10" class="page-mini-block" @click="moveToPage(item.index)">
                <img :id="'mini-page'+item.index" class="page-mini" draggable="true" @dragstart="dragPage(item)" :src="item.url_image">
              </v-col>
            </div>
        </v-row>
      </v-col>
      <v-col :cols="col_paper" class="pa-0">
        <v-toolbar dense elevation="2" class="paper-menu-bar"> <!-- paper menu -->
          <!-- toggle page select button -->
          <v-btn v-if="show_page_select == true" depressed x-small color="grey lighten-2" class="px-0 open-page-select-btn" @click="togglePageSelect()"><v-icon large>mdi-chevron-left</v-icon></v-btn>
          <v-btn v-else depressed color="grey lighten-2" class="open-page-select-btn"  @click="togglePageSelect()">{{ textLang.tabMenubar.open_page }}</v-btn>
          <v-spacer></v-spacer>
          <!-- zoom button -->
          <v-btn depressed small color="grey lighten-2"  v-on:click="zoomOut()"><v-icon color="#aaaaaa">mdi-magnify-minus-outline</v-icon></v-btn>
          <span class="mx-2 zoom-percent">{{zoom_level}} %</span>
          <v-btn depressed small color="grey lighten-2" ><v-icon color="#aaaaaa" v-on:click="zoomIn()">mdi-magnify-plus-outline</v-icon></v-btn>
          <!-- page number -->
          <v-btn depressed small color="grey lighten-2" class="ml-3" v-on:click="moveToPage(currentPage-1)"><v-icon color="#aaaaaa">mdi-arrow-left</v-icon></v-btn>
          <span class="mx-2 zoom-percent">{{ textLang.tabMenubar.page }} {{currentPage}}/{{pages.length}}</span>
          <v-btn depressed small color="grey lighten-2" v-on:click="moveToPage(currentPage+1)"><v-icon color="#aaaaaa">mdi-arrow-right</v-icon></v-btn>
          <v-btn depressed small color="grey lighten-2" class="ml-3 add-page-btn" @click="addPage()"><v-icon class="add-page-icon">mdi-plus</v-icon> {{ textLang.tabMenubar.add_page }}</v-btn> <!-- add page button -->
          <!-- undo / redo button -->
          <v-btn v-show="deleteTempList.length" depressed small color="grey lighten-2" class="ml-3" @click="undoDelete()"><v-icon color="#aaaaaa">mdi-undo-variant</v-icon></v-btn>
          <!-- <v-btn depressed small color="grey lighten-2" class="ml-xl-3 mx-md-1"><v-icon color="#aaaaaa">mdi-redo-variant</v-icon></v-btn> -->
          <!-- tooggle property button -->
          <v-spacer></v-spacer>
          <v-btn v-if="show_property == true" depressed x-small color="grey lighten-2" class="px-0 open-page-select-btn" @click="toggleProperty()"><v-icon large>mdi-chevron-right</v-icon></v-btn>
          <v-btn v-else depressed color="grey lighten-2" class="open-page-select-btn"  @click="toggleProperty()">{{ textLang.tabMenubar.show_toolbar }}</v-btn>
        </v-toolbar>
        <div class="main-paper-block"> <!-- paper plane -->
          <v-sheet id="workpaper" :width="current_paper_width + 'px'" :height="current_paper_height + 'px'" :elevation="2" color="white" class="main-paper" style="position: relative; padding: 0px; font-size:1cm;">
            <div :style="'height:' + current_paper_height +'px;'" v-on:click="selectPlain()"> 
              <div id="header-area" :style="'height:' + this.header_section.height + 'px;'">
                <div v-if="show_area" class="section-define">Header</div>
              </div>
              <div id="body-area" :style="'height:' + this.body_section.height + 'px;'">
                <div v-if="show_area" class="section-define">Body</div>
              </div>
              <div id="footer-area" :style="'height:' + this.footer_section.height + 'px;'">
                <div v-if="show_area" class="section-define">Footer</div>
              </div>
            </div>
            <div v-show="middle_grid" :style="'position:absolute; top:0; left: 0; height:100%; width:50%; border-right:2px dashed lightgrey;'">
            </div>
            <div v-show="paper_grid" :style="'position:absolute; top:0; left: 0; width:' + current_paper_width + 'px;'" v-on:click="selectPlain()">
              <v-divider v-for="n in row_count" :key="n" :style="row_style"></v-divider>
            </div>
            <div v-show="paper_grid"  :style="'position:absolute; top:0; left: 0; height:' + current_paper_height + 'px;'" v-on:click="selectPlain()">
              <v-divider v-for="m in col_count" :key="m" vertical :style="col_style"></v-divider>
            </div>
            <div :id="item.name" v-for="item in objectArray['textfield']" :key="item.name" v-on:click="selectObject(item,'textfield')">
              <div v-show="item.show" :class="item.name + '-obj'"  fill-height justify-center align-center>
                <input class="text-feild" :placeholder="item.object_name" :disabled="!item.selected" @click="copyObject = ''" v-model="item.value" :style="'text-align:' + item.style.font_align + ';'">
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['inputbox']" :key="item.name" v-on:click="selectObject(item,'inputbox')">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-inputbox">mdi-eye-off-outline</v-icon>
              <div v-show="item.show" :class="item.name + '-obj'" fill-height justify-center>
                <input class="input-box" outlined disabled single-line dense :placeholder="item.placeholder"  :style="'text-align:' + item.style.font_align + ';'">
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['rectangle']" :key="item.name" v-on:click="selectObject(item,'rectangle')">
              <div :id="item.name + '-box'" :class="item.name + '-obj'" v-show="item.show" fill-height justify-center align-center>
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" justify-left v-for="item in objectArray['textareabox']" :key="item.name" v-on:click="selectObject(item,'textareabox')">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-textareabox">mdi-eye-off-outline</v-icon>
              <div v-show="item.show" class="textareabox" :class="item.name + '-obj'" fill-height  :style="'white-space: pre; text-align:' + item.style.font_align + ';'">{{item.value}}</div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" justify-left v-for="item in objectArray['texteditorbox']" :key="item.name" v-on:click="selectObject(item,'texteditorbox')" style="text-align: center;">
              <div class="editor-box-title" v-if="item.show"><v-icon v-show="item.style.hideDisplay" small color="red" class="mr-1">mdi-eye-off-outline</v-icon>Editor Box</div>
              <div v-show="item.show" :class="item.name + '-obj'" fill-height class="editor-box-raw"></div>
              <v-btn color="secondary" fab depressed x-small v-if="item.selected" disabled class="button-drag" style="position: absolute;">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['dropdownbox']" :key="item.name" v-on:click="selectObject(item,'dropdownbox')" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-inputbox">mdi-eye-off-outline</v-icon>
              <div v-if="item.show" :class="item.name + '-obj'" fill-height justify-center>
                <v-select outlined single-line disabled :class="item.name + '-box ' + item.name + '-icon dropdown-icon-block'" hide-details :placeholder="item.placeholder" :style="'text-align:' + item.style.font_align + ';'"></v-select>
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['datepickerbox']" :key="item.name" v-on:click="selectObject(item,'datepickerbox')">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-inputbox">mdi-eye-off-outline</v-icon>
              <div v-show="item.show" :class="item.name + '-obj'" fill-height justify-center align-center>
                <input class="input-box" disabled single-line dense :placeholder="item.show_value" :style="'text-align:' + item.style.font_align + ';'">
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['timebox']" :key="item.name" v-on:click="selectObject(item,'timebox')">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-inputbox">mdi-eye-off-outline</v-icon>
              <div v-show="item.show" :class="item.name + '-obj'" fill-height justify-center align-center>
                <input class="input-box" disabled single-line dense :placeholder="item.placeholder" :style="'text-align:' + item.style.font_align + ';'">
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['checkbox']" :key="item.name" v-on:click="selectObject(item,'checkbox')" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;text-align:left;'">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-checkbox">mdi-eye-off-outline</v-icon>
              <div v-if="item.show" :class="item.name+ '-input ' + item.name + '-obj'" :style="'border:1px dashed lightgrey;'">
                  <img :width="item.style.font_size + 'px'" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png">
                  <span> {{item.text}}</span>
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['imagebox']" :key="item.name" v-on:click="selectObject(item,'imagebox')">
              <div v-show="item.show" :class="item.name + '-obj'" fill-height justify-center align-center>
                <img  :src="item.value" :width="item.style.image_width + 'px'" :height="item.style.image_height + 'px'">
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['autofillbox']" :key="item.name" v-on:click="selectObject(item,'autofillbox')">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-autofillbox">mdi-eye-off-outline</v-icon>
              <div v-show="item.show" :class="item.name + '-obj'" fill-height justify-center align-center>
                <input class="input-box" outlined disabled single-line dense :placeholder="item.placeholder" :style="'text-align:' + item.style.font_align + ';'">
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" :class="item.name + '-obj'" v-for="item in objectArray['inputimagebox']" :key="item.name" v-show="item.show" v-on:click="selectObject(item,'inputimagebox')">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-checkbox">mdi-eye-off-outline</v-icon>
              <div v-show="!item.value && item.show" :id="item.name + '-box-cover'" style="width:100%; height:100%;" @click="openUploadImage(item)">
                <div :id="item.name + '-box'" fill-height justify-center align-center>
                  <div style="position:absolute; top:40%; width:100%; height:75%; font-size:20px; text-align:center;">{{ textLang.tabMenubar.insert_img }}</div>
                </div>
              </div>
              <div v-show="item.value && item.show" style="width:100%; height:100%; border: 0px;">
                <v-btn dark fab x-small color="grey lighten-1" class="delete-img" v-show="item.value" @click="deleteUploadImage(item)"><v-icon>mdi-close</v-icon></v-btn>
                <img :id="item.name + '-img'" :src="item.value" width='100%' height='100%'>
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['calculatebox']" :key="item.name" v-on:click="selectObject(item,'calculatebox')" :style="'position:absolute; height:' + String(item.height) + 'px;opacity:1;display:table-cell;width:'+ String(item.width)+ 'px;top:' + String(item.top) + 'px;left:' + String(item.left) + 'px;'">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-autofillbox">mdi-eye-off-outline</v-icon>
              <div v-if="item.show" :class="item.name + '-obj'" fill-height justify-center align-center>
                <input class="input-box" outlined disabled single-line dense :placeholder="item.placeholder" :style="'text-align:' + item.style.font_align + ';'">
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['number2textbox']" :key="item.name" v-on:click="selectObject(item,'number2textbox')">
              <v-icon v-if="item.style.hideDisplay && item.show" small color="red" class="icon-eye-autofillbox">mdi-eye-off-outline</v-icon>
              <div v-show="item.show" :class="item.name + '-obj'" fill-height justify-center align-center>
                <input class="input-box" outlined disabled single-line dense :placeholder="item.placeholder" :style="'text-align:' + item.style.font_align + ';'">
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['sectionbox']" :key="item.name" v-on:click="selectObject(item,'sectionbox')">
              <div :id="item.name + '-box'" v-show="item.show">
                <div class="section-name">{{item.object_name}}</div>
                <div fill-height justify-center align-center :id="item.name + '-section-box'"></div>
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
            <div :id="item.name" v-for="item in objectArray['table']" :key="item.name" v-on:click="selectObject(item,'table')">
              <div v-show="item.show">
                <table :class="item.name + '-table ' + item.name + '-obj'" :id="item.name + '-table'" class="object-table">
                  <tr :class="item.name + '-table'" v-for="r in item.style.table.rowsize" :key="r.index" class="object-table" :style="'height:' + r.size + 'px;'">
                    <td :class="item.name + '-table'" v-for="c in item.style.table.colsize" :key="c.index" class="object-table" :style="'width:' + c.size + 'px;'">
                      
                    </td>
                  </tr>
                </table>
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>   
            </div>
            <div :id="item.name" v-for="item in objectArray['datatable']" :key="item.name" v-on:click="selectObject(item,'datatable')">
              <div v-show="item.show">
                <table :class="item.name + '-table ' + item.name + '-obj'" :id="item.name + '-table'" class="object-table" style="width:max-content;">
                  <tr :class="item.name + '-table'" v-for="r in item.style.table.rowsize" :key="r.index" class="object-table" :style="'height:' + r.size + 'px;'">
                    <td :class="item.name + '-table'" v-for="c in item.style.table.colsize" :key="c.index" class="object-table table-icon-eye" :style="'width:' + String(c.size) + 'px;' + ' background-color:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.background_color + ';'" v-on:click="selectCellObject(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index], r.index, c.index )" >
                      <v-icon v-if="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.hideDisplay && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show" small color="red" class="icon-eye-datatable">mdi-eye-off-outline</v-icon>
                      <div :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name" v-show="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show"
                      :style="'font-size:'+ dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px; text-overflow: ellipsis; white-space: nowrap; color:lightgrey; overflow: hidden; ' + 'width:' + String(c.size)+'; max-height:' + String(Number(r.size)-2) + 'px;'">
                        <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && (dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'inputbox' || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'linkdatabox' || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'calculatebox' || dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'autofillbox')" :style="'text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; text-overflow: ellipsis; white-space: nowrap; color:lightgrey; overflow: hidden; width:'+ String(Number(c.size) - 1) + 'px;'">
                          {{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name}}
                        </div>
                        <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && (dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'datepickerbox')" :style="'text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; text-overflow: ellipsis; white-space: nowrap; color:lightgrey; overflow: hidden; width:'+ String(Number(c.size) - 1) + 'px;'">
                          {{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].show_value}}
                        </div>
                        <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && (dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'timebox')" :style="'text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; text-overflow: ellipsis; white-space: nowrap; color:lightgrey; overflow: hidden; width:'+ String(Number(c.size) - 1) + 'px;'">
                          {{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].placeholder}}
                        </div>
                        <input v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'textfield'" class="text-feild" @click="copyObject = ''" v-model="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" :style="'color:'+ dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color +'!important; text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';'">
                        <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'dropdownbox'" :style="'text-align: ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + '; color:lightgrey; width:'+ String(Number(c.size) - 1) + 'px;'">
                          <v-select outlined single-line disabled :class="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-box ' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-icon dropdown-icon-block'" hide-details :placeholder="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].placeholder" :style="'text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';' + 'font-size:'+ dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px;'"></v-select>
                        </div>
                        <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'checkbox'" :style="'border:1px dashed lightgrey;color:'+ dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color +'!important; text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';'">
                            <img :width="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_size + 'px'" src="https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png">
                            <span> {{dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].text}}</span>
                        </div>
                        <div v-if="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.noCellData && dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].object_type == 'inputimagebox'" :style="'border:1px dashed lightgrey;color:'+ dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_color +'!important; text-align:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.font_align + ';'">
                            <div v-show="!dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-box-cover'" style="width:100%; height:100%;">
                              <div :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-box'" fill-height justify-center align-center>
                                <div style="position:absolute; top:40%; width:100%; height:75%; font-size:16px; text-align:center;">{{ textLang.tabMenubar.insert_img }}</div>
                              </div>
                            </div>
                            <div v-show="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" :style="'width:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.image_width + '; height:' + dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].style.image_height + '; border: 0px;'">
                              <v-btn dark fab x-small color="grey lighten-1" class="delete-img" v-show="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" @click="deleteUploadImage(dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index])"><v-icon>mdi-close</v-icon></v-btn>
                              <img :id="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].name + '-img'" :src="dataTableObjectArray[item.object_name + '_' + 'R' + r.index + 'C' + c.index].value" height='100%'>
                            </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                  <v-icon class="icon-drag">mdi-arrow-all</v-icon>
                </v-btn>
              </div> 
            </div>
            <div :id="item.name" v-for="item in objectArray['line']" :key="item.name" v-on:click="selectObject(item,'line')">
                <div v-show="item.show" :style="'height:100%; width:100%;'">
                  <table v-if="item.style.line_set == 'l'" :style="'width:100%; height:100%; border-collapse:collapse; border:' + item.style.line_focus + 'px dashed lightgrey;'">
                    <tr :style="'height:50%; border-bottom:' + item.style.border_size +'px '+ item.style.line_style +' ' + item.style.border_color +'; border-collapse:collapse;'">
                      <td :style="'width:100%;'">
                      
                      </td>
                    </tr>
                    <tr :style="'height:50%; border-top:' + item.style.border_size +'px '+ item.style.line_style +' ' + item.style.border_color +'; border-collapse:collapse;'">
                      <td :style="'width:100%;'">
                      
                      </td>
                    </tr>
                  </table>
                  <table v-if="item.style.line_set == 'p'" :style="'width:100%; height:100%; border-collapse:collapse; border:' + item.style.line_focus + 'px dashed lightgrey;'">
                    <tr :style="'height:100%;'">
                      <td :style="'width:50%; border-right:' + item.style.border_size +'px '+ item.style.line_style +' ' + item.style.border_color +'; border-collapse:collapse;'">
                      
                      </td>
                      <td :style="'width:50%'">
                      
                      </td>
                    </tr>
                  </table>
                </div>
                <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                  <v-icon class="icon-drag">mdi-arrow-all</v-icon>
                </v-btn>    
            </div>
            <div :id="item.name" v-for="item in objectArray['signbox']" :key="item.name" v-show="item.show" v-on:click="selectObject(item,'signbox')">
              <div :id="item.name + '-box-cover'" style="width:100%; height:100%;">
                <div :id="item.name + '-box'" fill-height justify-center align-center></div>
              </div>
              <v-btn color="secondary" fab depressed x-small disabled v-if="item.selected" class="button-drag">
                <v-icon class="icon-drag">mdi-arrow-all</v-icon>
              </v-btn>
            </div>
          </v-sheet>
        </div>
      </v-col>
      <v-col v-if="show_property == true" :cols="col_property" class="property-block2"> <!-- Property Plane -->
        <v-tabs-items v-model="tab">
          <v-tab-item> <!-- E-Form Setting Tab -->
            <span class="header-property"><b>{{ textLang.set_format_form.set_doc_format }}</b></span>
            <br><br>
            <span class="sub-title-property"><b>{{ textLang.set_format_form.set_doc_detail }}</b></span>
            <v-row class="row-prop">
              <v-col cols="4" class="pt-4 pb-0 mt-3 title-prop-block">
                <span class="title-prop">{{ textLang.set_format_form.name_doc }}</span>
              </v-col>
              <v-col cols="8" class="pl-0 pr-2 pb-0 mt-3">
                <v-text-field outlined dense class="prop-input create-prop-line-height" color="#4caf50" v-model="template_name" :error="name_template_error" :error-messages="error_file_name_msg" @click="copyObject = ''"></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-row class="row-prop">
              <v-col cols="4" class=" pt-0 title-prop-block">
                <span class="title-prop">{{ textLang.set_format_form.doc_type }}</span>
              </v-col>
              <v-col cols="7" class="px-0 pt-0">
                <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" :color="color_document_format" class="prop-input autocomplete-pad icon-select dropdown-icon-color" :items="eformDocTypes" v-model="selectedEformDocType"></v-autocomplete>
              </v-col>
            </v-row> -->
            <!-- <v-row class="mt-0 row-prop">
              <v-col cols="4" align-self="center" class="py-0 title-prop-block">
                <span class="title-prop">{{ textLang.set_format_form.department }}</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2 py-0">
                <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4caf50" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="departments" v-model="docDepartment"></v-autocomplete>
              </v-col>
            </v-row> -->
            <!-- <v-row class="row-prop">
              <v-col cols="4" align-self="center" class="pb-0 title-prop-block">
                <span class="title-prop">กลุ่มของแบบฟอร์ม:</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2 pb-0">
                <v-select dense outlined hide-details multiple color="#4caf50" item-color="#4caf50" append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" class="font-in-property create-prop-line-height create-prop-dropdown-icon group-form-box" :items="document_level" v-model="docLevel"></v-select>
              </v-col>
            </v-row> -->
            <v-row class="mt-0 row-prop">
              <v-col cols="4" align-self="center" class="py-0 title-prop-block">
                <span class="title-prop">{{ textLang.set_format_form.id }}</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2 py-0">
                <v-text-field outlined dense hide-details color="#4caf50" class="prop-input create-prop-line-height" @click="copyObject = ''" v-model="code_template"></v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-prop">
              <v-col cols="4" align-self="center" class="pb-0 title-prop-block">
                <span class="title-prop">{{ textLang.set_format_form.version }}</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2 pb-0">
                <v-text-field outlined dense hide-details color="#4caf50" class="prop-input create-prop-line-height" @click="copyObject = ''" v-model="version_template"></v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-prop">
              <v-col cols="4" align-self="center" class="title-prop-block">
                <span class="title-force-date-prop">{{ textLang.set_format_form.en_data }}</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2">
                <v-menu :close-on-content-click="false" v-model="menu_date_force">
                  <template v-slot:activator="{ on }">
                    <v-text-field outlined dense readonly v-on="on" hide-details color="#4caf50" class="prop-input create-prop-line-height form-force-date-box" :value="setDateFormatBE(docUseDate, 'be')"></v-text-field>
                  </template>
                  <v-date-picker color="#67C25D" locale="th" @change="menu_date_force = false"  v-model="docUseDate"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <!-- Lock PDF -->
            <v-row v-if="false" class="row-prop"> 
              <v-col cols="4" align-self="center" class="pb-0 title-prop-block">
                <span class="title-prop">{{ textLang.set_format_form.locking_pdf }}</span>
              </v-col>
              <v-col cols="8" class="pl-0 pr-2 pb-0" align-self="center">
                <v-checkbox hide-details class="mt-0 pt-0" color="#4caf50" v-model="docOption.isPdfLock"></v-checkbox>
              </v-col>
            </v-row>
            <!-- <br>
            <v-divider class="divider-prop"></v-divider>
            <br>
            <span class="sub-title-property"><b>{{ textLang.set_num_doc.set_doc_num }}</b></span><br>
            <v-subheader class="px-0 pb-5 example-doc-num">{{ textLang.set_num_doc.num_format }} <span class="ml-1 prefix-color">{{ textLang.set_num_doc.prefix }}</span>-<span class="date-num-doc-color">{{ textLang.set_num_doc.date }}</span><span class="doc-num-color">{{ textLang.set_num_doc.num }}</span></v-subheader>
            <v-row class="row-prop">
              <v-radio-group row hide-details class="mt-0 template-type-block" v-model="prefixType">
                <v-radio :color="color_document_format" value="DOCTYPE">
                  <template v-slot:label>
                    <span class="title-prop">{{ textLang.set_num_doc.by_doc }}</span>
                  </template>
                </v-radio>
                <v-radio :color="color_document_format" value="CUSTOM">
                  <template v-slot:label>
                    <span class="title-prop">{{ textLang.set_num_doc.custom }}</span>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-row>
            <v-row class="row-prop">
              <v-col cols="4" class="title-prop-block">
                <span class="title-prop">{{ textLang.set_num_doc.prefix1 }}</span>
              </v-col>
              <v-col cols="7" class="px-0">
                <v-text-field outlined dense hide-details :readonly="prefixType == 'DOCTYPE'" :color="color_document_format" class="prop-input pad-input" v-model="prefix_code" @click="copyObject = ''"></v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-prop">
              <v-col cols="4" class="title-prop-block">
                <span class="title-prop">{{ textLang.set_num_doc.date_format }}</span>
              </v-col>
              <v-col cols="7" class="px-0">
                <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" :items="prefixPatternList" :color="color_document_format" v-model="prefixPattern" class="prop-input autocomplete-pad icon-select dropdown-icon-color"></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="row-prop">
              <v-col cols="4" class="pt-1 title-prop-block">
                <span class="title-prop num-doc-length-title">{{ textLang.set_num_doc.digit_num_doc }}</span>
              </v-col>
              <v-col cols="7" class="px-0">
                <v-select dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" :color="color_document_format" :items="prefixDigitList" class="prop-input business-box-inside icon-select dropdown-icon-color"  v-model="prefixDigit"></v-select>
              </v-col>
            </v-row> -->
            <br>
            <v-divider class="divider-prop"></v-divider>
            <br>
            <!-- Template / Structure -->
            <!-- <span class="sub-title-property"><b>{{ textLang.format_doc.doc_type }}</b></span>
            <v-row class="row-prop">
              <v-radio-group row hide-details class="template-type-block" v-model="template_type">
                <v-radio :color="color_document_format" value="TEMPLATE">
                  <template v-slot:label>
                    <span class="title-prop">{{ textLang.format_doc.doc_type_form }}</span>
                  </template>
                </v-radio>
                <v-radio :color="color_document_format" value="STRUCTURE">
                  <template v-slot:label>
                    <span class="title-prop">{{ textLang.format_doc.structure }}</span>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-row> -->
            <!-- <br>
            <v-divider class="divider-prop"></v-divider>
            <br> -->
            <span class="sub-title-property"><b>{{ textLang.set_font_paper.page_setup }}</b></span>
            <!-- <v-row class="row-prop">
              <v-col cols="4" align-self="center" class="pb-0 title-prop-block">
                <span class="title-prop">{{ textLang.set_font_paper.paper_size }}</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2 pb-0">
                <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4caf50" :items="paper_size" class="prop-input create-prop-line-height create-prop-dropdown-icon" v-model="paperSizeIndex"></v-autocomplete>
              </v-col>
            </v-row> -->
            <!-- <v-row class="row-prop">
              <v-radio-group row hide-details class="template-type-block" v-model="template_side">
                <v-radio color="#4caf50" value="PORTRAIT">
                  <template v-slot:label>
                    <span class="title-prop">{{ textLang.set_font_paper.vertical }}</span>
                  </template>
                </v-radio>
                <v-radio color="#4caf50" value="LANDSCAPE">
                  <template v-slot:label>
                    <span class="title-prop">{{ textLang.set_font_paper.landscape }}</span>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-row> -->
            <v-row class="row-prop">
              <v-checkbox hide-details class="check-grid-block" color="#4caf50" v-model="show_area">
                <template v-slot:label>
                  <span class="title-prop">{{ textLang.set_font_paper.show_page_line }}</span>
                </template>
              </v-checkbox>
            </v-row>
            <v-row class="mt-0 row-prop">
              <v-checkbox hide-details class="check-grid-block" color="#4caf50" v-model="middle_grid">
                <template v-slot:label>
                  <span class="title-prop">{{ textLang.set_font_paper.show_line }}</span>
                </template>
              </v-checkbox>
            </v-row>
            <v-row class="mt-0 row-prop">
              <v-col cols="" align-self="center" class="pr-1 pb-1 check-paper-grid-block">
                <v-checkbox hide-details class="mt-0" color="#4caf50" v-model="paper_grid">
                  <template v-slot:label>
                    <span class="title-prop">{{ textLang.set_font_paper.show_grids }}</span>
                  </template>
                </v-checkbox>
              </v-col>
              <v-col cols="4" align-self="center" class="pl-0 pr-2 pb-1" v-if="paper_grid">
                <v-text-field outlined dense hide-details color="#4caf50" suffix="px" type="number" class="prop-input grid-size-box" v-model="grid_size" @click="copyObject = ''"></v-text-field>
              </v-col>
            </v-row>
            <br>
            <v-divider class="divider-prop"></v-divider>
            <br>
            <span class="sub-title-property"><b>{{ textLang.status_doc.status_doc}}</b></span>
            <v-row class="row-prop">
              <v-radio-group row hide-details class="template-type-block" v-model="template_status">
                <v-radio color="#4caf50" value="ACTIVE">
                  <template v-slot:label>
                    <span class="title-prop">{{ textLang.status_doc.ready}}</span>
                  </template>
                </v-radio>
                <v-radio color="#4caf50" value="INACTIVE">
                  <template v-slot:label>
                    <span class="title-prop">{{ textLang.status_doc.not_available}}</span>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-row>
            <br>
            <v-divider class="divider-prop"></v-divider>
            <br>
            <span class="sub-title-property"><b>{{ textLang.validation_doc.validation_title }}</b></span>
            <v-row class="row-prop">
              <v-col cols="11" class="mt-1 pb-0 text-center">
                <v-btn depressed block dark small color="#525659" class="validate-doc-btn" @click="openDocCondition()">{{ textLang.validation_doc.validate_setting_btn }}</v-btn>
              </v-col>
            </v-row>
            <br>
            <v-divider class="divider-prop"></v-divider>
            <br>
            <span class="sub-title-property"><b>{{ textLang.set_sharing.doc_sharing_set}}</b></span>
            <v-row class="mt-1 row-prop">
              <v-col cols="4" align-self="center" class="pb-0 title-prop-block">
                <span class="title-prop">{{ textLang.set_sharing.doc_sharing}}</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2 pb-0">
                <v-text-field readonly outlined dense hide-details color="#4caf50" class="prop-input create-prop-line-height" v-model="business.first_name_th"></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-row class="row-prop" v-if="business.first_name_th != 'เฉพาะฉัน' && !all_permission.length">
              <v-checkbox hide-details class="check-grid-block" color="#4caf50" v-model="isPublicForm">
                <template v-slot:label>
                  <span class="title-prop">แบบฟอร์มสำหรับบุคคลทั่วไป</span>
                </template>
              </v-checkbox>
            </v-row> -->
            <!-- <v-row class="mt-2 row-prop" v-if="!isPublicForm && business.first_name_th != 'เฉพาะฉัน'">
              <v-col cols="4" align-self="center" class="pb-0 title-prop-block">
                <span class="title-prop">{{ textLang.set_sharing.doc_usage}}</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2 pb-0">
                <v-autocomplete dense outlined hide-details multiple chips append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" item-color="#4caf50" color="#4caf50" class="prop-input permission-box form-permission-box create-prop-dropdown-icon" :items="roleNameList" v-model="accessRole">
                  <template v-slot:selection="data">
                    <v-chip dark color="#4caf50" class="mb-1 data-chip-roleList" v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="deleteAccesstRoleList(data.item)">
                      {{data.item}}
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row> -->
            <v-row class="row-prop" v-if="!isPublicForm && business.first_name_th != 'เฉพาะฉัน'">
              <v-col cols="4" align-self="end" class="title-prop-block">
                <span class="title-prop">{{ textLang.set_sharing.permission_view_all_title }}:</span>
              </v-col>
              <v-col cols="8" align-self="center" class="px-0">
                <v-chip v-for="item in docOption.viewers" :key="item" small close dark color="#4caf50" class="mb-1 mr-1 forbiden-email-chip" @click:close="deleteNewViewer(item)"> 
                  <div class="text-truncate">{{item}}</div>
                </v-chip>
                <v-text-field dense hide-details outlined color="#4caf50" placeholder="One E-mail" append-outer-icon="mdi-plus" class="prop-input" @click="copyObject = ''" @click:append-outer="addNewViewer()" v-model="addViewer"></v-text-field>
              </v-col>
            </v-row>
            <!-- <br>
            <v-divider class="divider-prop"></v-divider>
            <br>
            <span class="sub-title-property"><b>{{ textLang.set_data_doc.set_data_doc}}</b></span>
            <div v-for="item in webhookUrl" :key="item.service">
              <v-row class="mt-2 row-prop">
                <v-col cols="4" align-self="center" class="pb-0 title-prop-block">
                  <span class="title-prop">{{ textLang.set_data_doc.system_name }}</span>
                </v-col>
                <v-col cols="8" align-self="center" class="pl-0 pr-2 pb-0">
                  <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4caf50" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="othersService" v-model="item.service"></v-autocomplete>
                </v-col>
              </v-row>
              <v-row class="row-prop">
                <v-col cols="4" align-self="center" class="pb-0 title-prop-block">
                  <span class="title-prop">{{ textLang.set_data_doc.webhook}}</span>
                </v-col>
                <v-col cols="8" align-self="center" class="pl-0 pr-2 pb-0">
                  <v-text-field outlined dense hide-details color="#4caf50" class="prop-input" v-model="item.api"></v-text-field>
                </v-col>
              </v-row>
              <v-row class="row-prop">
                <v-col cols="4" align-self="center" class="title-prop-block">
                  <span class="title-prop">{{ textLang.set_data_doc.send_api }}</span>
                </v-col>
                <v-col cols="8" align-self="center" class="pr-2 pb-0">
                  <v-select dense outlined hide-details multiple color="#4caf50" item-color="#4caf50" append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" class="font-in-property create-prop-line-height create-prop-dropdown-icon step-see-height-box" :items="step_api_send" v-model="item.sendStep"></v-select>
                </v-col>
              </v-row>
            </div> -->
            <!-- <br>
            <v-divider class="divider-prop"></v-divider>
            <br>
            <span class="sub-title-property"><b>ตั้งค่าแบบฟอร์มถัดไป</b></span>
            <v-row class="mt-2 row-prop">
              <v-col cols="4" align-self="center" class="title-prop-block">
                <span class="title-prop">{{ textLang.set_next_template.next_temp }}:</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2">
                <v-autocomplete dense outlined hide-details multiple chips append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" item-color="#4caf50" color="#4caf50" :menu-props="{zIndex:11}" class="prop-input next-temp-box create-prop-dropdown-icon" v-model="docOption['nextTemplates']" :items="allEformList">
                  <template v-slot:selection="data">
                    <v-chip small dark color="#4caf50" v-bind="data.attrs" :input-value="data.selected" close>
                      <span class="text-truncate next-temp-chip">{{data.item.text}}</span>
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row> -->
            <br>
            <v-divider class="divider-prop"></v-divider>
            <br><br>
          </v-tab-item>
          <v-tab-item> <!-- Object Tab -->
            <span class="header-property"><b>{{ textLang.tools_create_form.tools_create}}</b></span>
            <v-expansion-panels accordion multiple class="flat-expan all-object-block" v-model="panel">
              <v-expansion-panel> <!-- Section Object -->
                <v-expansion-panel-header class="section-object-header">
                  <b>Section Object</b>
                  <template v-slot:actions>
                    <v-icon color="#4CAF50">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <hr class="line-expan-object">
                <v-expansion-panel-content class="obj-expand-content">
                  <v-row class="obj-group">
                    <v-col cols="4" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_8a6ea025-6845-4d45-92f5-263785a9cf4f.jpg" class="img-of-obj" v-on="on" @click="addObject('section_box')">
                        </template>
                        <span>Section Box</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel> <!-- Normal Object -->
                <v-expansion-panel-header class="object-type-header">
                  <b>Object</b>
                  <template v-slot:actions>
                    <v-icon color="#4CAF50">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <hr class="line-expan-object">
                <v-expansion-panel-content class="obj-expand-content">
                  <v-row class="obj-group">
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_c050340b-786c-47b8-9c10-3e1434f29d8f.png" class="img-of-obj" v-on="on"  @click="addObject('text_field')">
                        </template>
                        <span>Text Field</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_977c2c21-20d8-40f2-8ed7-c12513cd0f53.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('rectangle')">
                        </template>
                        <span>Rectangle</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_129b70a7-e64e-4ea8-9891-cda5917bffa7.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('input_box')">
                        </template>
                        <span>Input Box</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_6a8836b8-ec84-41ad-a4af-fbd49ec66dce.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('text_area_box')">
                        </template>
                        <span>Text Area</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_079400e7-a95c-49b3-a677-c6812a9e971f.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('dropdown_box')">
                        </template>
                        <span>Dropdown Input</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_686c2b47-1cb9-4497-a15c-af17071b427a.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('datepicker_box')">
                        </template>
                        <span>Date Picker</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_59002c61-cb37-4800-851a-3b64bb4366d9.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('time_box')">
                        </template>
                        <span>Time Picker</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" class="line-block">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-row class="line-block-row" v-on="on" v-on:click="addObject('line')">
                            <v-col cols="6" class="block-to-line obj-line"> </v-col><v-col cols="6" class="block-to-line"> </v-col>
                          </v-row>
                        </template>
                        <span>Line</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_42f69f7d-2b96-4b97-9299-ad4a067c32f0.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('check_box')">
                        </template>
                        <span>Check Box</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://sv1.picz.in.th/images/2019/12/09/iUxdqk.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('table')">
                        </template>
                        <span>Table</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_b0b3d0f5-d57b-4a9b-a910-058b57cd1232.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('data_table')">
                        </template>
                        <span>Data Table</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_8c4f4036-5fa8-43a9-acfd-a7545102b6b9.png" class="object-image" v-on="on" v-on:click="addObject('input_image_box')">
                        </template>
                        <span>Image Box</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_8ed93c31-1c52-4226-ac56-897bf914eb38.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('texteditorbox')">
                        </template>
                        <span>Editor Box</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0 text-center">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_f2722e8c-75d7-48fd-99f1-8cd831071966.jpg" class="object-sign-img" v-on="on" v-on:click="addObject('sign_box')">
                        </template>
                        <span>Sign Box</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel> <!-- Auto Object -->
                <v-expansion-panel-header class="object-type-header">
                  <b>Auto Object</b>
                  <template v-slot:actions>
                    <v-icon color="#4CAF50">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <hr class="line-expan-object">
                <v-expansion-panel-content class="obj-expand-content">
                  <v-row class="obj-group">
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_cd68e597-0455-4f3a-b9b8-a1261997415a.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('autofill_box')">
                        </template>
                        <span>Input Box Auto</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_a4cbcffb-560d-4684-9454-575a84e2b505.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('calculate_box')">
                        </template>
                        <span>Calculate Box</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_76d90d03-9175-4a66-bee4-dcfe04c2cc2c.jpg" class="img-of-obj" v-on="on" v-on:click="addObject('number2text_box')">
                        </template>
                        <span>Number To Text Box</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- <v-expansion-panel> 
                <v-expansion-panel-header class="object-type-header">
                  <b>Paperless Object</b>
                  <template v-slot:actions>
                    <v-icon color="#4CAF50">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <hr class="line-expan-object">
                <v-expansion-panel-content class="obj-expand-content">
                  <v-row class="obj-group">
                    <v-col cols="4" align-self="center" class="pr-0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <img src="https://eform.one.th/eform_api/api/v1/view_image?file_name=3138425702_f2722e8c-75d7-48fd-99f1-8cd831071966.jpg" class="object-sign-img" v-on="on" v-on:click="addObject('sign_box')">
                        </template>
                        <span>Sign Box</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel> -->
            </v-expansion-panels>
            <v-divider class="divider-obj"></v-divider>
            <br>
            <v-row class="row-prop">
              <v-col cols="auto" class="pl-3 pr-0">
                <v-btn color="#4CAF50" depressed fab x-small dark class="tips-btn" @click="tips = !tips">
                  <b>Tips</b>
                </v-btn>
              </v-col>
              <v-col cols="" v-if="tips == true" class="pl-0 pr-2">
                <ul class="tips2">
                  <li>
                    {{ textLang.tips_data.ctrl_arrow }}
                  </li>
                  <li>
                    {{ textLang.tips_data.moving_object }}
                  </li>
                  <li>
                    {{ textLang.tips_data.delete_keys }}
                  </li>
                  <li>
                    {{ textLang.tips_data.c_copy }}
                  </li>
                  <li>
                    {{ textLang.tips_data.v_pasting }}
                  </li>
                  <li>
                    {{ textLang.tips_data.z_reverting }}
                  </li>
                  <li>
                    {{ textLang.tips_data.selecting }}
                  </li>
                </ul>
              </v-col>
            </v-row>
            <br><br>
          </v-tab-item>
          <v-tab-item> <!-- Property Tab -->
            <span class="header-property"><b>{{ textLang.property_text.property_object }}</b></span>
            <br><br>
            <!-- <v-btn outlined small color="black" class="permission-data-btn" @click="openObjectRole()">{{ textLang.property_text.set_data_access }} <v-icon color="#4CAF50" class="ml-2">mdi-cursor-default-click-outline</v-icon></v-btn>
            <br><br> -->
            <span class="sub-title-property"><b>{{ textLang.property_text.set_pro_values }}</b></span>
            <v-row class="row-table-prop" @click="copyObject = ''">
              <v-simple-table class="table-prop">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="property-title-header no-border"><b>{{ textLang.property_text.title }}</b></th>
                      <th class="property-header no-border"><b>{{ textLang.property_text.property }}</b></th>
                    </tr>
                  </thead>
                  <tbody class="font-in-property table-color-striped">
                    <tr v-if="custom_object_name">
                      <td class="property-title no-border">{{ textLang.property_type.object }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" :readonly="selected_array == 'datatable'" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].object_name"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_name">
                      <td class="property-title no-border">JSON Key:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" :hint="textLang.property_type.for_database" persistent-hint class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.json_key"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_name">
                      <td class="property-title no-border">{{ textLang.property_type.fixed_object }}:</td>
                      <td class="no-border">
                         <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.fixPosition"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_bordercolor">
                      <td class="property-title no-border">{{ textLang.property_type.border_color }}:</td>
                      <td class="no-border">
                        <v-menu v-model="border_color_menu" :close-on-content-click="false">
                            <template v-slot:activator="{ on }">
                              <v-text-field hide-details v-on="on" height="25px" color="#4CAF50" class="font-in-property input-color" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.border_color"></v-text-field>
                            </template>
                            <v-color-picker show-swatches hide-mode-switch mode="hexa" @input="border_color_menu = false" v-model="objectArray[selected_array][selected_object].style.border_color"></v-color-picker>
                          </v-menu>
                      </td>
                    </tr>
                    <tr v-if="custom_object_bordersize">
                      <td class="property-title no-border">{{ textLang.property_type.border_thickness }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.border_size" @input="change_bordersize"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_colcount">
                      <td class="property-title no-border">{{ textLang.property_type.num_col }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.cols" class="font-in-property" color="#4CAF50" @click="copyObject = ''" @input="change_ccol"  v-model="objectArray[selected_array][selected_object].style.table.ccol"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_rowcount">
                      <td class="property-title no-border">{{ textLang.property_type.num_row }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.rows" class="font-in-property" color="#4CAF50" @click="copyObject = ''" @input="change_crow" v-model="objectArray[selected_array][selected_object].style.table.crow"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_rowcount">
                      <td class="property-title no-border">{{ textLang.property_type.max_row }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.rows" class="font-in-property" color="#4CAF50" @click="copyObject = ''" @input="change_crow" v-model="objectArray[selected_array][selected_object].style.maxRow"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_addtable && selected_array == 'datatable'">
                      <td class="property-title no-border">{{ textLang.property_type.export_data_table }}:</td>
                      <td class="no-border">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.exportDatatable"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_addtable">
                      <td class="property-title no-border">{{ textLang.property_type.allow_table_row }}:</td>
                      <td class="no-border">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.addTable"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_name">
                      <td class="property-title no-border">{{ textLang.property_type.continue_table }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" @input="changeConTable(objectArray[selected_array][selected_object])" v-model="objectArray[selected_array][selected_object].style.contTable"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="objectArray[selected_array][selected_object].style.addTable">
                      <td class="property-title no-border">{{ textLang.property_type.line_def }}:</td>
                      <td class="no-border">
                        <v-row class="property-row">
                          <v-col cols="auto" align-self="center" class="py-0 pl-0">
                            <v-checkbox color="#4CAF50" hide-details class="pt-0 property-check" v-model="objectArray[selected_array][selected_object].style.isDefaultRow"></v-checkbox>
                          </v-col>
                          <v-col cols="" align-self="center" class="pa-0">
                            <v-text-field v-if="objectArray[selected_array][selected_object].style.isDefaultRow" dense height="25px" type="number" class="font-in-property" color="#4CAF50"  @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.defaultRow"></v-text-field>
                          </v-col>
                        </v-row>
                      </td>
                    </tr>
                    <tr v-if="objectArray[selected_array][selected_object].style.addTable">
                      <td class="property-title no-border">{{ textLang.property_type.not_moving_below }}:</td>
                      <td class="no-border">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.addTableUnmove"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_colsetting">
                      <td colspan="2" class="pa-0 no-border">
                        <v-expansion-panels class="flat-expan">
                          <v-expansion-panel>
                            <v-expansion-panel-header class="font-in-property column-property-header"><b>{{ textLang.property_type.set_col_width }}</b></v-expansion-panel-header>
                            <v-expansion-panel-content class="column-property-content">
                              <v-simple-table>
                                <tbody class="font-in-property table-color-striped">
                                  <tr>
                                    <td width="40%" class="property-title no-border">{{ textLang.property_type.total_col }}:</td>
                                    <td class="no-border">
                                      <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" color="#4CAF50"  @click="copyObject = ''" v-model="colsize"></v-text-field>
                                    </td>
                                  </tr>
                                  <tr v-for="item in objectArray[selected_array][selected_object].style.table.colsize" :key="item.index">
                                    <td width="40%" class="property-title no-border">{{ textLang.property_type.column }} {{item.index}}</td>
                                    <td class="no-border">
                                      <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="item.size" @input="calColSize()"></v-text-field> 
                                    </td>
                                  </tr>
                                </tbody>
                              </v-simple-table>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </td>
                    </tr>
                    <tr v-if="custom_object_rowsetting">
                      <td colspan="2" class="pa-0 no-border">
                        <v-expansion-panels class="flat-expan">
                          <v-expansion-panel class="table-row-property-header">
                            <v-expansion-panel-header class="font-in-property column-property-header"><b>{{ textLang.property_type.set_row_height }}</b></v-expansion-panel-header>
                            <v-expansion-panel-content class="column-property-content">
                              <v-simple-table>
                                <tbody class="font-in-property setting-table-row-color-striped">
                                  <tr>
                                    <td width="40%" class="property-title no-border">{{ textLang.property_type.total_row }}:</td>
                                    <td class="no-border">
                                      <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="rowsize"></v-text-field>
                                    </td>
                                  </tr>
                                  <tr v-for="item in objectArray[selected_array][selected_object].style.table.rowsize" :key="item.index">
                                    <td width="40%" class="property-title no-border">{{ textLang.property_type.row }} {{item.index}}</td>
                                    <td class="no-border">
                                      <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="item.size"></v-text-field>
                                    </td>
                                  </tr>
                                </tbody>
                              </v-simple-table>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </td>
                    </tr>
                    <tr v-if="custom_object_datatablesetting">
                      <td colspan="2" class="no-border">
                        <v-btn  block small depressed color="rgb(50, 54, 57)" dark class="setting-hiding" @click="toOpenLinkData(objectArray[selected_array][selected_object])">{{ textLang.property_type.set_link }}</v-btn>
                      </td>
                    </tr>
                    <tr v-if="custom_object_datatablesetting && false">
                      <td colspan="2" class="no-border">
                        <v-btn  block color="cyan lighten-1" dark class="setting-hiding" @click="toOpenSumif()">ปุ่มวิเศษ</v-btn>
                      </td>
                    </tr>
                    <tr v-if="custom_object_cellname">
                      <td class="property-title no-border">{{ textLang.property_type.call_name }}:</td>
                      <td class="no-border">
                        <v-text-field dense readonly height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].name"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_cellname">
                      <td class="property-title no-border">Cell JSON Key:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" :hint="textLang.property_type.for_database" persistent-hint class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.json_key"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_cellname">
                      <td class="property-title no-border">{{ textLang.property_type.hide_object_cell }}:</td>
                      <td class="no-border">
                        <v-btn depressed small dark color="#525659" class="setting-hiding display-set-object-cell" @click="openHideSetting(selectedCell)">{{ textLang.property_type.set_object_cell }}</v-btn>
                      </td>
                    </tr>
                    <tr v-if="objectTypeInput.includes(selected_array) || (selectedCell && objectTypeInput.includes(dataTableObjectArray[selectedCell].object_type))">
                      <td class="property-title no-border">{{ textLang.property_type.not_referring }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                         <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.noInputRef"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell && objectTypeInput.includes(dataTableObjectArray[selectedCell].object_type)">
                         <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.noInputRef"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="objectTypeInput.includes(selected_array) || (selectedCell && (objectTypeInput.includes(dataTableObjectArray[selectedCell].object_type) || dataTableObjectArray[selectedCell].object_type == 'linkdatabox'))">
                      <td class="property-title no-border">{{ textLang.property_type.hide_display }}:</td>
                      <td class="no-border"  v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.hideDisplay"></v-checkbox>
                      </td>
                      <td class="no-border"  v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.hideDisplay" @input="changeSelected(selectedCell)"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="(objectTypeInput.includes(selected_array) || selected_array == 'textfield') && !objectArray[selected_array][selected_object].style.hideDisplay">
                      <td class="property-title no-border">{{ textLang.property_type.hide_preview }}:</td>
                      <td class="no-border">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.hidePreview"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_cell_nodata && selectedCell">
                      <td class="property-title no-border">{{ textLang.property_type.don_show_cell }}:</td>
                      <td class="no-border">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.noCellData"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="selectedCell && !dataTableObjectArray[selectedCell].style.noCellData">
                      <td class="property-title no-border">{{ textLang.property_type.object_inside }}:</td>
                      <td class="no-border">
                        <v-select v-model="dataTableObjectArray[selectedCell].object_type" @change="changeCellObject()" dense outlined background-color="white" hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" :items="cellObjectTypes" class="font-in-property create-prop-dropdown-icon"></v-select>
                      </td>
                    </tr>
                    <tr v-if="custom_object_text || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'checkbox')">
                      <td class="property-title no-border">{{ textLang.property_type.body }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].text"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].text"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_fontsize || custom_cell_fontsize">
                      <td class="property-title no-border">{{ textLang.property_type.font_size }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" @input="change_fontsize" v-model="objectArray[selected_array][selected_object].style.font_size"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" @input="change_fontsize, changeSelected(selectedCell)" v-model="dataTableObjectArray[selectedCell].style.font_size"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_font || custom_cell_font">
                      <td class="property-title no-border">{{ textLang.property_type.font_style }}:</td>
                      <td class="no-border"  v-if="!selectedCell">
                        <v-btn-toggle dense group multiple color="#4CAF50" v-model="objectArray[selected_array][selected_object].style.font_style" @change="change_fontstyle">
                          <v-btn small value="b" text class="mx-0 px-1">
                            <v-icon>mdi-format-bold</v-icon>
                          </v-btn>
                          <v-btn small value="i" text class="px-1">
                            <v-icon>mdi-format-italic</v-icon>
                          </v-btn>
                          <v-btn small value="u" text class="mx-0 px-1">
                            <v-icon>mdi-format-underline</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-btn-toggle dense group multiple color="#4CAF50" v-model="dataTableObjectArray[selectedCell].style.font_style" @change="change_fontstyle">
                          <v-btn small value="b" text class="mx-0 px-1">
                            <v-icon>mdi-format-bold</v-icon>
                          </v-btn>
                          <v-btn small value="i" text class="px-1">
                            <v-icon>mdi-format-italic</v-icon>
                          </v-btn>
                          <v-btn small value="u" text class="mx-0 px-1">
                            <v-icon>mdi-format-underline</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </td>
                    </tr>
                    <tr v-if="custom_object_align || selectedCell">
                      <td class="property-title no-border">{{ textLang.property_type.text_format }}:</td>
                      <td class="pl-2 pr-0 no-border" v-if="!selectedCell">
                        <v-btn-toggle dense group mandatory color="#4CAF50" v-model="objectArray[selected_array][selected_object].style.font_align" class="align-prop-block">
                          <v-btn small value="left" text class="mx-0 px-1">
                            <v-icon>mdi-format-align-left</v-icon>
                          </v-btn>
                          <v-btn small value="center" text class="mr-0 px-1">
                            <v-icon>mdi-format-align-center</v-icon>
                          </v-btn>
                          <v-btn small value="right" text class="mr-0 px-1">
                            <v-icon>mdi-format-align-right</v-icon>
                          </v-btn>
                          <v-btn small value="justify" text class="mr-0 px-1">
                            <v-icon>mdi-format-align-justify</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </td>
                      <td class="pl-2 pr-0 no-border" v-if="selectedCell">
                        <v-btn-toggle dense group mandatory color="#4CAF50" v-model="dataTableObjectArray[selectedCell].style.font_align">
                          <v-btn small value="left" text class="mx-0 px-1">
                            <v-icon>mdi-format-align-left</v-icon>
                          </v-btn>
                          <v-btn small value="center" text class="mr-0 px-1">
                            <v-icon>mdi-format-align-center</v-icon>
                          </v-btn>
                          <v-btn small value="right" text class="mr-0 px-1">
                            <v-icon>mdi-format-align-right</v-icon>
                          </v-btn>
                          <v-btn small value="justify" text class="mr-0 px-1">
                            <v-icon>mdi-format-align-justify</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </td>
                    </tr>
                    <tr v-if="custom_object_fontcolor || custom_cell_fontcolor">
                      <td class="property-title no-border">{{ textLang.property_type.font_color }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-menu v-model="font_color_menu" :close-on-content-click="false">
                          <template v-slot:activator="{ on }">
                            <v-text-field hide-details v-on="on" color="#4CAF50" class="font-in-property input-color" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.font_color"></v-text-field>
                          </template>
                          <v-color-picker show-swatches hide-mode-switch mode="hexa" v-model="objectArray[selected_array][selected_object].style.font_color" @input="font_color_menu = false"></v-color-picker>
                        </v-menu>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-menu v-model="font_color_menu" :close-on-content-click="false">
                          <template v-slot:activator="{ on }">
                            <v-text-field hide-details v-on="on" color="#4CAF50" class="font-in-property input-color" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.font_color"></v-text-field>
                          </template>
                          <v-color-picker show-swatches hide-mode-switch mode="hexa" v-model="dataTableObjectArray[selectedCell].style.font_color" @input="font_color_menu = false, changeSelected(selectedCell)"></v-color-picker>
                        </v-menu>
                      </td>
                    </tr>
                    <tr v-if="selected_array == 'inputbox' || (selectedCell && (dataTableObjectArray[selectedCell].object_type == 'inputbox'))">
                      <td class="property-title no-border">{{ textLang.property_type.alphabet_type }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" color="#4CAF50" background-color="white" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="AlphabetType" v-model="objectArray[selected_array][selected_object].style.alphabetType"></v-autocomplete>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" color="#4CAF50" background-color="white" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="AlphabetType" v-model="dataTableObjectArray[selectedCell].style.alphabetType"></v-autocomplete>
                      </td>
                    </tr>
                    <tr v-if="custom_object_linecolor">
                      <td class="property-title no-border">{{ textLang.property_type.line_color }}:</td>
                      <td class="no-border">
                        <v-menu v-model="border_color_menu" :close-on-content-click="false">
                          <template v-slot:activator="{ on }">
                            <v-text-field hide-details v-on="on" color="#4CAF50" class="font-in-property input-color" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.border_color"></v-text-field>
                          </template>
                          <v-color-picker show-swatches hide-mode-switch mode="hexa" v-model="objectArray[selected_array][selected_object].style.border_color" @input="border_color_menu = false"></v-color-picker>
                        </v-menu>
                      </td>
                    </tr>
                    <tr v-if="custom_object_linesize">
                      <td class="property-title no-border">{{ textLang.property_type.line_thickness }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.border_size"  @input="change_linesize"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_lineside">
                      <td class="property-title no-border">{{ textLang.property_type.line }}:</td>
                      <td class="no-border">
                        <v-radio-group row hide-details class="object-line-type-block"  v-model="objectArray[selected_array][selected_object].style.line_set" @change="change_lineside">
                          <v-radio color="#4CAF50" value="p" class="mb-1">
                            <template v-slot:label>
                              <span class="template-status">{{ textLang.property_type.vertical }}</span>
                            </template>
                          </v-radio>
                          <v-radio :color="color_property_Object" value="l" class="mb-1">
                            <template v-slot:label>
                              <span class="template-status">{{ textLang.property_type.landscape }}</span>
                            </template>
                          </v-radio>
                        </v-radio-group>
                      </td>
                    </tr>
                    <tr v-if="custom_object_lineside">
                      <td class="property-title no-border">{{ textLang.property_type.line_style }}:</td>
                      <td class="no-border">
                        <v-btn-toggle dense group mandatory color="#4CAF50" v-model="objectArray[selected_array][selected_object].style.line_style">
                          <v-btn min-width="30px" height="30px" value="solid" class="pa-0" active-class="line-style-active">
                            <hr class="solid-line-property2">
                          </v-btn>
                          <v-btn min-width="30px" height="30px" value="dashed" text class="pa-0" active-class="line-style-active">
                            <hr class="dashed-line-property2">
                          </v-btn>
                          <v-btn min-width="30px" height="30px" value="dotted" text class="pa-0" active-class="line-style-active">
                            <hr class="dotted-line-property2">
                          </v-btn>
                        </v-btn-toggle>
                      </td>
                    </tr>
                    <tr v-if="custom_object_backgroundcolor || selectedCell">
                      <td class="property-title no-border">{{ textLang.property_type.bg_color }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-menu v-model="background_color_menu" :close-on-content-click="false">
                          <template v-slot:activator="{ on }">
                            <v-text-field hide-details  @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.background_color" v-on="on" color="#4CAF50" class="font-in-property input-color"></v-text-field>
                          </template>
                          <v-color-picker show-swatches hide-mode-switch mode="rgba" v-model="objectArray[selected_array][selected_object].style.background_color_select" @input="change_backgroundcolor()"></v-color-picker>
                        </v-menu>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-menu v-model="background_color_menu" :close-on-content-click="false">
                          <template v-slot:activator="{ on }">
                            <v-text-field hide-details  @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.background_color" v-on="on" color="#4CAF50" class="font-in-property input-color"></v-text-field>
                          </template>
                          <v-color-picker show-swatches hide-mode-switch mode="rgba" v-model="dataTableObjectArray[selectedCell].style.background_color_select" @input="change_backgroundcolor()"></v-color-picker>
                        </v-menu>
                      </td>
                    </tr>
                    <!-- <tr v-if="custom_object_boxwidth">
                      <td class="property-title no-border">{{ textLang.property_type.width }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" :color="color_property_Object" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.image_width"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_boxheight">
                      <td class="property-title no-border">{{ textLang.property_type.height }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" type="number" suffix="px" class="font-in-property" :color="color_property_Object" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.image_height"></v-text-field>
                      </td>
                    </tr> -->
                    <tr v-if="custom_object_placholder || (selectedCell && (dataTableObjectArray[selectedCell].object_type == 'dropdownbox' || dataTableObjectArray[selectedCell].object_type == 'inputbox' || dataTableObjectArray[selectedCell].object_type == 'datepickerbox' || dataTableObjectArray[selectedCell].object_type == 'timebox'))">
                      <td class="property-title no-border">{{ textLang.property_type.textbox }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].placeholder"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].placeholder"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_row">
                      <td class="property-title no-border">{{ textLang.property_type.line_num }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.line1" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.row" @input="change_row"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_row">
                      <td class="property-title no-border">{{ textLang.property_type.maximum_characters }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.characters" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.maxLetter"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_row && objectArray[selected_array][selected_object].style.maxLetter">
                      <td class="property-title no-border">{{ textLang.property_type.add_extra_characters }}:</td>
                      <td class="no-border">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.extraAddAble"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_refvalue || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'dropdownbox')">
                      <td class="property-title no-border">{{ textLang.property_type.choice_reference }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" :hint="textLang.property_type.name_object" persistent-hint class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.refValue"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" :hint="textLang.property_type.name_object" persistent-hint class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.refValue" @input="changeSelected(selectedCell)"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_refvalue || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'dropdownbox')">
                      <td class="property-title no-border">{{ textLang.property_type.auto_select }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.autoChoices"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.autoChoices"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="selected_array == 'inputimagebox'">
                      <td class="property-title no-border">{{ textLang.property_type.img_link }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" persistent-hint class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].value"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="(custom_object_choices && !objectArray[selected_array][selected_object].style.refValue) || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'dropdownbox' && !dataTableObjectArray[selectedCell].style.refValue)">
                      <td class="property-title no-border">{{ textLang.property_type.options }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <template v-if="!objectArray[selected_array][selected_object].style.autoChoices">
                          <v-row class="property-row">
                            <v-col v-for="item in objectArray[selected_array][selected_object].choices" :key="item" cols="auto" align-self="center" class="pl-0 pr-2 pt-1 pb-0">
                              {{item}}<v-icon v-on:click="deleteChoices(item)">mdi-trash-can-outline</v-icon>
                            </v-col>
                          </v-row>
                          <v-row class="property-row">
                            <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" append-outer-icon="mdi-plus" @click:append-outer="addChoices()" @click="copyObject = ''" v-model="choice"></v-text-field>
                          </v-row>
                        </template>
                        <template v-else>
                          <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" background-color="white" :placeholder="textLang.set_format_form.choose" color="#4CAF50" class="mt-3 prop-input create-prop-line-height create-prop-dropdown-icon" :items="autoChoices" v-model="objectArray[selected_array][selected_object].style.autoChoicesSelect"></v-autocomplete>
                          <v-text-field dense height="25px" :hint="textLang.property_type.name_object" persistent-hint class="mb-2 font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.refAutoChoices"></v-text-field>
                        </template>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <template v-if="!dataTableObjectArray[selectedCell].style.autoChoices">
                          <v-row class="property-row">
                            <v-col v-for="item in dataTableObjectArray[selectedCell].choices" :key="item" cols="auto" align-self="center" class="pl-0 pr-2 pt-1 pb-0">
                              {{item}}<v-icon v-on:click="deleteChoices(item)">mdi-trash-can-outline</v-icon>
                            </v-col>
                          </v-row>
                          <v-row class="property-row">
                            <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" append-outer-icon="mdi-plus" @click:append-outer="addChoices()" @click="copyObject = ''" v-model="choice"></v-text-field>
                          </v-row>
                        </template>
                        <template v-else>
                          <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" background-color="white" :placeholder="textLang.set_format_form.choose" color="#4CAF50" class="mt-3 prop-input create-prop-line-height create-prop-dropdown-icon" :items="autoChoices" v-model="dataTableObjectArray[selectedCell].style.autoChoicesSelect"></v-autocomplete>
                          <v-text-field dense height="25px" :hint="textLang.property_type.name_object" persistent-hint class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.refAutoChoices" @input="changeSelected(selectedCell)"></v-text-field>
                          <v-checkbox color="#4CAF50" hide-details class="mb-1 property-check" v-model="dataTableObjectArray[selectedCell].style.importInRow">  
                            <template v-slot:label>
                              <span class="title-prop">{{ textLang.property_type.in_row_import }}</span>
                            </template>
                          </v-checkbox>
                        </template>
                      </td>
                    </tr>
                    <tr v-if="(custom_object_refvalue && objectArray[selected_array][selected_object].style.refValue) || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'dropdownbox' && dataTableObjectArray[selectedCell].style.refValue)">
                      <td class="property-title no-border">{{ textLang.property_type.choice_group }}:</td>
                      <td class="no-border">
                        <v-btn depressed small dark color="#525659" class="setting-hiding" @click="openCreateDropdownDataset()">{{ textLang.property_type.create_edit }}</v-btn>
                      </td>
                    </tr>
                    <tr v-if="custom_object_datestyle || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'datepickerbox')">
                      <td class="property-title no-border">{{ textLang.property_type.date_format }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-select dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" :items="property_date_style" class="font-in-property create-prop-line-height create-prop-dropdown-icon" @input="change_dateformat" v-model="objectArray[selected_array][selected_object].style.date_format"></v-select>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-select dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" :items="property_date_style" class="font-in-property create-prop-line-height create-prop-dropdown-icon" @input="change_dateformat" v-model="dataTableObjectArray[selectedCell].style.date_format"></v-select>
                      </td>
                    </tr>
                    <tr v-if="custom_object_datestyle || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'datepickerbox')">
                      <td class="property-title no-border">{{ textLang.property_type.default }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-select dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" class="my-1 font-in-property create-prop-line-height create-prop-dropdown-icon date-default-prop" :items="defaultDatePicker" v-model="objectArray[selected_array][selected_object].style.defaultDateSelect" @change="objectArray[selected_array][selected_object].style.defaultDateValue = ''"></v-select>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-select dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" class="my-1 font-in-property create-prop-line-height create-prop-dropdown-icon date-default-prop" :items="defaultDatePicker" v-model="dataTableObjectArray[selectedCell].style.defaultDateSelect" @change="dataTableObjectArray[selectedCell].style.defaultDateValue  = ''"></v-select>
                      </td>
                    </tr>
                    <tr v-if="(custom_object_datestyle && (objectArray[selected_array][selected_object].style.defaultDateSelect == 'custom')) || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'datepickerbox' && dataTableObjectArray[selectedCell].style.defaultDateSelect == 'custom')">
                      <td class="property-title no-border">{{ textLang.property_type.def_custom_date }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-menu :close-on-content-click="false" v-model="menu_date_default">
                          <template v-slot:activator="{ on }">
                            <v-text-field dense readonly v-on="on" hide-details color="#4CAF50" class="prop-input" :value="setDateFormatBE(objectArray[selected_array][selected_object].style.defaultDateValue, 'be')"></v-text-field>
                          </template>
                          <v-date-picker color="#4CAF50" locale="th" @change="menu_date_default = false" v-model="objectArray[selected_array][selected_object].style.defaultDateValue"></v-date-picker>
                        </v-menu>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-menu :close-on-content-click="false" v-model="menu_date_default">
                          <template v-slot:activator="{ on }">
                            <v-text-field dense readonly v-on="on" hide-details color="#4CAF50" class="prop-input"  :value="setDateFormatBE(dataTableObjectArray[selectedCell].style.defaultDateValue, 'be')"></v-text-field>
                          </template>
                          <v-date-picker color="#4CAF50" locale="th" @change="menu_date_default = false" v-model="dataTableObjectArray[selectedCell].style.defaultDateValue"></v-date-picker>
                        </v-menu>
                      </td>
                    </tr>
                    <tr v-if="(custom_object_datestyle && (objectArray[selected_array][selected_object].style.defaultDateSelect == 'ref_date')) || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'datepickerbox' && dataTableObjectArray[selectedCell].style.defaultDateSelect == 'ref_date')">
                      <td class="property-title no-border">{{ textLang.property_type.datepicker_name }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" v-model="objectArray[selected_array][selected_object].style.defaultDateValue"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" v-model="dataTableObjectArray[selectedCell].style.defaultDateValue" @input="changeSelected(selectedCell)"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="(custom_object_datestyle && (objectArray[selected_array][selected_object].style.defaultDateSelect == 'ref_date')) || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'datepickerbox' && dataTableObjectArray[selectedCell].style.defaultDateSelect == 'ref_date')">
                      <td class="property-title no-border">{{ textLang.property_type.num_date_ref }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.start_date_day" class="font-in-property" color="#4CAF50" v-model="objectArray[selected_array][selected_object].style.additionDate"></v-text-field>
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.num_month" class="font-in-property" color="#4CAF50" v-model="objectArray[selected_array][selected_object].style.additionMon"></v-text-field>
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.num_year" class="font-in-property" color="#4CAF50" v-model="objectArray[selected_array][selected_object].style.additionYear"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.start_date_day" class="font-in-property" color="#4CAF50" v-model="dataTableObjectArray[selectedCell].style.additionDate" @input="changeSelected(selectedCell)"></v-text-field>
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.num_month" class="font-in-property" color="#4CAF50" v-model="dataTableObjectArray[selectedCell].style.additionMon" @input="changeSelected(selectedCell)"></v-text-field>
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.num_year" class="font-in-property" color="#4CAF50" v-model="dataTableObjectArray[selectedCell].style.additionYear" @input="changeSelected(selectedCell)"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_datestyle || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'datepickerbox')">
                      <td class="property-title no-border">{{ textLang.property_type.start_date_setting }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="startDateTypes" v-model="objectArray[selected_array][selected_object].style.startDateType"></v-autocomplete>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="startDateTypes" v-model="dataTableObjectArray[selectedCell].style.startDateType"></v-autocomplete>
                      </td>
                    </tr>
                    <tr v-if="(custom_object_datestyle && objectArray[selected_array][selected_object].style.startDateType == 'custom') || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'datepickerbox' && dataTableObjectArray[selectedCell].style.startDateType == 'custom')">
                      <td class="property-title no-border">{{ textLang.property_type.start_date_custom }}</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-menu :close-on-content-click="false" v-model="menu_date_start">
                          <template v-slot:activator="{ on }">
                            <v-text-field dense readonly v-on="on" hide-details color="#4CAF50" class="prop-input" :value="setDateFormatBE(objectArray[selected_array][selected_object].style.startDateValue, 'be')"></v-text-field>
                          </template>
                          <v-date-picker color="#4CAF50" locale="th" @change="menu_date_start = false"  v-model="objectArray[selected_array][selected_object].style.startDateValue"></v-date-picker>
                        </v-menu>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-menu :close-on-content-click="false" v-model="menu_date_start">
                          <template v-slot:activator="{ on }">
                            <v-text-field dense readonly v-on="on" hide-details color="#4CAF50" class="prop-input" :value="setDateFormatBE(dataTableObjectArray[selectedCell].style.startDateValue, 'be')"></v-text-field>
                          </template>
                          <v-date-picker color="#4CAF50" locale="th" @change="menu_date_start = false"  v-model="dataTableObjectArray[selectedCell].style.startDateValue"></v-date-picker>
                        </v-menu>
                      </td>
                    </tr>
                    <tr v-if="(custom_object_datestyle && objectArray[selected_array][selected_object].style.startDateType == 'current') || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'datepickerbox' && dataTableObjectArray[selectedCell].style.startDateType == 'current')">
                      <td class="property-title no-border">{{ textLang.property_type.start_date_from }}</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.start_date_day" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.startDateFrom"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.start_date_day" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.startDateFrom" @input="changeSelected(selectedCell)"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_datestyle || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'datepickerbox')">
                      <td class="property-title no-border">{{ textLang.property_type.no_default }}</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.noDefaultDate"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.noDefaultDate"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_databind">
                      <td class="property-title no-border">{{ textLang.property_type.data_sync }}:</td>
                      <td class="no-border">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="databind_choice" v-model="objectArray[selected_array][selected_object].value" @input="change_datablind"></v-autocomplete>
                      </td>
                    </tr>
                    <tr v-if="custom_object_databind && (objectArray[selected_array][selected_object].value == 'leader_role_th')">
                      <td class="property-title no-border"></td>
                      <td class="no-border">
                        <v-combobox dense height="25px" :hint="textLang.property_type.name_object" persistent-hint class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.refValue" :items="autofillboxLeaders"></v-combobox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_databind && objectArray[selected_array][selected_object].value == 'ref_data'">
                      <td class="property-title no-border">{{ textLang.property_type.name_reference }}:</td>
                      <td class="no-border">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.refValue" @input="change_datablind"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_n2tdecimal">
                      <td class="property-title no-border">{{ textLang.property_type.reading_style }}:</td>
                      <td class="no-border">
                        <v-select dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" :items="number2textDecimalType" class="my-1 font-in-property create-prop-line-height create-prop-dropdown-icon date-default-prop" v-model="objectArray[selected_array][selected_object].style.n2tdecimal"></v-select>
                      </td>
                    </tr>
                    <tr v-if="custom_object_timestyle || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'timebox')">
                      <td class="property-title no-border">{{ textLang.property_type.time_format }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-select dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" :items="time_style" class="font-in-property create-prop-line-height create-prop-dropdown-icon" v-model="objectArray[selected_array][selected_object].style.time.isFull"></v-select>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-select dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" :items="time_style" class="font-in-property create-prop-line-height create-prop-dropdown-icon" v-model="dataTableObjectArray[selectedCell].style.time.isFull"></v-select>
                      </td>
                    </tr>
                    <tr v-if="custom_object_timeseccond || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'timebox')">
                      <td class="property-title no-border">{{ textLang.property_type.second }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.time.isSec"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.time.isSec"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="(custom_object_mandatory || (selected_array == 'checkbox' && objectArray[selected_array][selected_object].style.checkBoxGroup.length)) || 
                      (selectedCell && (dataTableObjectArray[selectedCell].object_type == 'dropdownbox' || dataTableObjectArray[selectedCell].object_type == 'inputbox' || dataTableObjectArray[selectedCell].object_type == 'datepickerbox'
                      || (dataTableObjectArray[selectedCell].object_type == 'checkbox') && dataTableObjectArray[selectedCell].style.checkBoxGroup.length))">
                      <td class="property-title no-border">{{ textLang.property_type.need_fillout }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.mandatory"></v-checkbox>
                      </td><td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.mandatory"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_fixedValue || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'linkdatabox')">
                      <td class="property-title no-border">{{ textLang.property_type.not_allowed }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.fixedValue"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.fixedValue"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="selected_array == 'inputbox' || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'inputbox')">
                      <td class="property-title no-border">{{ textLang.property_type.text_type }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" color="#4CAF50" background-color="white" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="TextType"  v-model="objectArray[selected_array][selected_object].style.textType"></v-autocomplete>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" color="#4CAF50" background-color="white" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="TextType" v-model="dataTableObjectArray[selectedCell].style.textType"></v-autocomplete>
                      </td>
                    </tr>
                    <tr v-if="custom_object_isnumber || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'inputbox')">
                      <td class="property-title no-border">{{ textLang.property_type.num_only }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.number_only" @change="change_numberonly"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.number_only"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="selected_array == 'calculatebox' || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'calculatebox')">
                      <td class="property-title no-border">{{ textLang.property_type.show_zero }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.isZero"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.isZero"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="selected_array == 'calculatebox' || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'calculatebox')">
                      <td class="property-title no-border">{{ textLang.property_type.infinity }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.isInfinityZero"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.isInfinityZero"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="objectArray[selected_array][selected_object].style.number_only || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'inputbox')">
                      <td class="property-title no-border">{{ textLang.property_type.format_commas }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.isComma"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.isComma"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_decimal || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'calculatebox')">
                      <td class="property-title no-border">{{ textLang.property_type.don_show_decimal }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.noDecimal"></v-checkbox>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="dataTableObjectArray[selectedCell].style.noDecimal"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="(selected_array != 'paper' && (!objectArray[selected_array][selected_object].style.noDecimal && selected_array == 'calculatebox')) || (selectedCell && !dataTableObjectArray[selectedCell].style.noDecimal)&& dataTableObjectArray[selectedCell].object_type == 'calculatebox'">
                      <td class="property-title no-border">{{ textLang.property_type.decimal_num }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.position" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.decimal"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.position" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.decimal" @input="changeSelected(selectedCell)"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="(selected_array != 'paper' && (!objectArray[selected_array][selected_object].style.noDecimal && selected_array == 'calculatebox')) || (selectedCell && !dataTableObjectArray[selectedCell].style.noDecimal)&& dataTableObjectArray[selectedCell].object_type == 'calculatebox'">
                      <td class="property-title no-border">{{ textLang.property_type.decimal_num_show }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.position" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.decimalShow"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" type="number" :suffix="textLang.property_type.position" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.decimalShow" @input="changeSelected(selectedCell)"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_function || (selectedCell && dataTableObjectArray[selectedCell].object_type == 'calculatebox')">
                      <td class="property-title no-border">{{ textLang.property_type.fuction }}:</td>
                      <td class="py-2 no-border" v-if="!selectedCell">
                        <v-textarea dense no-resize outlined single-line hide-details rows="4" color="#4CAF50" background-color="white" class="font-in-property calc-function-prop-create textarea-prop-auto-row" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.function"></v-textarea>
                      </td>
                      <td class="py-2 no-border" v-if="selectedCell">
                        <v-textarea dense no-resize outlined single-line hide-details rows="4" color="#4CAF50" background-color="white" class="font-in-property calc-function-prop-create textarea-prop-auto-row" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.function"></v-textarea>
                      </td>
                    </tr>
                    <tr v-if="(objectArray[selected_array][selected_object].value == 'function' && selected_array == 'autofillbox')">
                      <td class="property-title no-border">{{ textLang.property_type.condition }}:</td>
                      <td class="py-2 no-border">
                        <v-textarea dense no-resize outlined single-line hide-details rows="4" color="#4CAF50" background-color="white" class="font-in-property calc-function-prop-create textarea-prop-auto-row" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.function"></v-textarea>
                      </td>
                    </tr>
                    <tr v-if="custom_object_defaultvalue || (selectedCell && (dataTableObjectArray[selectedCell].object_type == 'inputbox' || dataTableObjectArray[selectedCell].object_type == 'dropdownbox'))">
                      <td class="property-title no-border">{{ textLang.property_type.default }}:</td>
                      <td class="py-2 no-border" v-if="selected_array == 'textareabox' && !selectedCell"> <!-- for textarea -->
                        <v-textarea dense no-resize outlined single-line hide-details rows="3" color="#4CAF50" class="font-in-property calc-function-prop-create textarea-default-value-prop-auto-row" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].value"></v-textarea>
                      </td>
                      <td class="no-border" v-if="(selected_array == 'inputbox' || selected_array == 'dropdownbox') && !selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].value"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].value" @input="changeSelected(selectedCell)"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="selected_array == 'inputbox'  || (selectedCell && (dataTableObjectArray[selectedCell].object_type == 'inputbox'))">
                      <td class="property-title no-border">{{ textLang.property_type.default_input }}:</td>
                      <td class="no-border" v-if="selected_array == 'inputbox' && !selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.defaultValueObj"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.defaultValueObj" @input="changeSelected(selectedCell)"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_textareavaliable">
                      <td class="property-title no-border">{{ textLang.property_type.variable_default }}:</td>
                      <td class="no-border">
                        <v-row class="property-row">
                          <v-col v-for="item in objectArray[selected_array][selected_object].style.textAreaValiable" :key="item" cols="auto" align-self="center" class="pl-0 pr-2 pt-1 pb-0">
                          {{item.text}} <v-icon v-on:click="deleteTextAreaValiable(item)">mdi-trash-can-outline</v-icon>
                          </v-col>
                        </v-row>
                        <v-row class="property-row">
                          <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" append-outer-icon="mdi-plus" v-model="textAreaValiable" @click:append-outer="addTextAreaValiable()" @click="copyObject = ''"></v-text-field>
                        </v-row>
                      </td>
                    </tr>
                    <tr v-if="objectArray[selected_array][selected_object].style.number_only">
                      <td rowspan="2" class="property-title no-border">{{ textLang.property_type.condition }}:</td>
                      <td class="no-border">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :label="textLang.property_type.condition" color="#4CAF50" background-color="white" class="prop-input create-prop-line-height create-prop-dropdown-icon condition-title-label" :items="logic_fx" v-model="objectArray[selected_array][selected_object].style.validate.fx" @input="change_logictype"></v-autocomplete>
                      </td>
                    </tr>
                    <tr v-if="objectArray[selected_array][selected_object].style.number_only">
                      <td class="pt-2 no-border">
                        <v-text-field v-if="!betValue" dense height="25px" :label="textLang.property_type.cost" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.validate.value"></v-text-field>
                        <v-text-field v-if="betValue" dense height="25px" :label="textLang.property_type.since" class="font-in-property condition-start-value-label" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.validate.value"></v-text-field>
                        <v-text-field v-if="betValue" dense height="25px" :label="textLang.property_type.to" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.validate.value2"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="selected_array == 'checkbox'  || (selectedCell && (dataTableObjectArray[selectedCell].object_type == 'checkbox'))">
                      <td class="property-title no-border">{{ textLang.property_type.group_options }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-row class="property-row">
                          <v-col v-for="item in objectArray[selected_array][selected_object].style.checkBoxGroup" :key="item" cols="auto" align-self="center" class="pl-0 pr-2 pt-1 pb-0">
                            {{item}}
                            <v-icon small color="grey lighten-1" v-on:click="deleteCheckGroup(item)">mdi-close-circle</v-icon>
                          </v-col>
                        </v-row>
                        <v-row class="property-row">
                          <v-text-field dense height="25px" @click="copyObject = ''" v-model="selectedCheckGroup" class="font-in-property" color="#4CAF50" append-outer-icon="mdi-plus" @click:append-outer="addCheckGroup()"></v-text-field>
                        </v-row>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-row class="property-row">
                          <v-col v-for="item in dataTableObjectArray[selectedCell].style.checkBoxGroup" :key="item" cols="auto" align-self="center" class="pl-0 pr-2 pt-1 pb-0">
                            {{item}}
                            <v-icon small color="grey lighten-1" v-on:click="deleteCheckGroup(item)">mdi-close-circle</v-icon>
                          </v-col>
                        </v-row>
                        <v-row class="property-row">
                          <v-text-field dense height="25px" @click="copyObject = ''" v-model="selectedCheckGroup" class="font-in-property" color="#4CAF50" append-outer-icon="mdi-plus" @click:append-outer="addCheckGroup()"></v-text-field>
                        </v-row>
                      </td>
                    </tr>
                    <tr v-if="custom_object_excel || selectedCell">
                      <td class="property-title no-border">{{ textLang.property_type.cell_excel }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" placeholder="Ex. A1, D14, B23" :hint="textLang.property_type.used_importing" persistent-hint class="font-in-property" color="#4CAF50"  @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].excel"></v-text-field>
                      </td>
                      <td class="no-border"  v-if="selectedCell">
                        <v-text-field dense height="25px" placeholder="Ex. A1, D14, B23" :hint="textLang.property_type.used_importing" persistent-hint class="font-in-property" color="#4CAF50"  @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].excel"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_hidesection">
                      <td class="property-title no-border">{{ textLang.property_type.show_scope }}:</td>
                      <td class="no-border">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="hidesection"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_refpermission">
                      <td class="property-title no-border">{{ textLang.property_type.con_scope }}:</td>
                      <td class="no-border">
                        <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" background-color="white" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="allPermissionSection" v-model="objectArray[selected_array][selected_object].style.refPermission"></v-autocomplete>
                      </td>
                    </tr>
                    <tr v-if="custom_object_suffix || (selectedCell && (dataTableObjectArray[selectedCell].object_type == 'calculatebox'|| dataTableObjectArray[selectedCell].object_type == 'inputbox'))">
                      <td class="property-title no-border">{{ textLang.property_type.suffix }}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.suffix"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.suffix"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="selected_array == 'signbox'">
                      <td class="property-title no-border">Certificate Authority (CA):</td>
                      <td class="no-border">
                        <v-checkbox color="#4CAF50" hide-details class="property-check" v-model="objectArray[selected_array][selected_object].style.isCa"></v-checkbox>
                      </td>
                    </tr>
                    <tr v-if="custom_object_name">
                      <td class="property-title no-border">{{ textLang.property_type.arrange_object }}:</td>
                      <td class="pl-1 pr-0 no-border">
                        <v-tooltip top> 
                          <template v-slot:activator="{ on }"> 
                            <v-btn outlined small min-width="34" v-on="on" class="mr-1 px-0 arrange-obj-btn" @click="changeZindex('forward')">
                              <v-icon>mdi-arrange-bring-forward</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ textLang.property_type.arrange_forward }}</span>
                        </v-tooltip>
                        <v-tooltip top> 
                          <template v-slot:activator="{ on }"> 
                            <v-btn outlined small min-width="34" v-on="on" class="mr-1 px-0 arrange-obj-btn" @click="changeZindex('front')">
                              <v-icon>mdi-arrange-bring-to-front</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ textLang.property_type.arrange_front }}</span>
                        </v-tooltip>
                        <v-tooltip top> 
                          <template v-slot:activator="{ on }"> 
                            <v-btn outlined small min-width="34" v-on="on" class="mr-1 px-0 arrange-obj-btn" @click="changeZindex('backward')">
                              <v-icon>mdi-arrange-send-backward</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ textLang.property_type.arrange_backward }}</span>
                        </v-tooltip>
                        <v-tooltip top> 
                          <template v-slot:activator="{ on }"> 
                            <v-btn outlined small min-width="34" v-on="on" class="px-0 arrange-obj-btn" @click="changeZindex('back')">
                              <v-icon>mdi-arrange-send-to-back</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ textLang.property_type.arrange_back }}</span>
                        </v-tooltip>
                      </td>
                    </tr>
                    <tr v-if="selected_array == 'inputbox' || (selectedCell && (dataTableObjectArray[selectedCell].object_type == 'inputbox'))">
                      <td class="property-title no-border">{{textLang.property_type.search_api}}:</td>
                      <td class="no-border" v-if="!selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="objectArray[selected_array][selected_object].style.search_api"></v-text-field>
                      </td>
                      <td class="no-border" v-if="selectedCell">
                        <v-text-field dense height="25px" class="font-in-property" color="#4CAF50" @click="copyObject = ''" v-model="dataTableObjectArray[selectedCell].style.search_api"></v-text-field>
                      </td>
                    </tr>
                    <tr v-if="custom_object_name">
                      <td class="property-title no-border">{{ textLang.property_type.hide_object }}:</td>
                      <td class="py-1 no-border">
                        <v-btn depressed small dark color="#525659" class="py-1 setting-hiding set-hiding-obj-btn" @click="openHideSetting()">{{ textLang.property_type.set_object }}</v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-row>
            <br>
            <v-divider class="divider-permission"></v-divider>
            <!-- Permission Property -->
            <template v-if="(custom_object_permission || custom_cell_permission)">
              <br>
              <span class="sub-title-property"><b>{{ textLang.property_type.assignment }}</b></span>
              <v-row class="mt-1 row-prop">
                <v-col cols="4" align-self="center" class="pb-0 title-prop-block">
                  <span class="title-prop">{{ textLang.property_type.order_refer }}</span>
                </v-col>
                <v-col cols="8" align-self="center" class="pl-0 pr-2 pb-0">
                  <v-autocomplete outlined dense hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" :items="step_choices_options" item-text="text" item-value="value" v-model="objectArray[selected_array][selected_object].style.permission_step" color="#4caf50" class="prop-input create-prop-line-height create-prop-dropdown-icon"></v-autocomplete>
                </v-col>
              </v-row>
              <br>
            </template>
            <!-- Help -->
            <v-row class="row-prop">
              <v-col cols="auto" class="pl-4 pr-0 pb-0">
                <v-btn color="primary" depressed fab x-small dark class="" @click="help = !help">
                  <v-icon>mdi-help</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="" v-if="help == true" class="pl-2 pr-0 pb-0">
                <p class="help-msg" v-html="help_message"></p>
              </v-col>
            </v-row>
            <br>
            <v-row justify="center" class="delete-object-row">
              <v-btn large depressed color="error" class="delete-object-btn" @click="deleteObjectTemp()">{{ textLang.property_text.delete_object }}</v-btn>
            </v-row>
            <br><br>
          </v-tab-item>
          <!-- Step Tap -->
          <!-- <v-tab-item>
            <span class="header-property"><b>{{ textLang.order_fill.order_of }}</b></span>
            <br><br>
            <div v-if="all_permission.length > 0">
              <span class="sub-title-property"><b>{{ textLang.order_fill.set_order }}</b></span>
              <v-subheader class="suggest-checkbox-setting-step">{{ textLang.order_fill.check_box }}</v-subheader>
              <br>
              <v-row class="row-prop" v-for="item in order_permission" :key="item.index">
                <v-col cols="4" align-self="end" class="pb-5 title-prop-block">
                  <span class="title-prop">{{ textLang.order_fill.order }} {{item.index}} :</span>
                </v-col>
                <v-col cols="1" align-self="end" class="pb-5 px-0 mr-1">
                  <v-checkbox :color="color_all_permission" hide-details class="property-check" v-model="item.value.isEditable"></v-checkbox>
                </v-col>
                <v-col cols="6" class="px-0">
                  <v-text-field dense hide-details :placeholder="textLang.order_fill.ex" :label="textLang.order_fill.person" :color="color_all_permission" class="mb-1 prop-input pad-input"  @click="copyObject = ''" v-model="orderMessage[Number(item.index)-1]"></v-text-field>
                  <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" :color="color_all_permission" class="prop-input autocomplete-pad icon-select dropdown-icon-color" :items="all_permission" v-model="item.value"></v-autocomplete>
                </v-col>
              </v-row>
              <br>
              <v-divider class="divider-prop"></v-divider>
              <br>
              <span class="sub-title-property"><b>{{ textLang.order_fill.forbiden_email_title }}</b></span>
              <br>
              <v-row class="row-prop" v-for="item in order_permission" :key="item.index">
                <v-col cols="4" align-self="end" class="title-prop-block">
                  <span class="title-prop">{{ textLang.order_fill.order }}  {{item.index}}:</span>
                </v-col>
                <v-col cols="7" class="px-0">
                  <v-chip v-for="mail in item.blockEmail" :key="mail" small close dark :color="color_forbiden_email_chip" class="mb-2 forbiden-email-chip" @click:close="deleteBlockEmail(item, mail)">{{mail}}</v-chip>
                  <v-text-field outlined dense hide-details :color="color_all_permission" placeholder="One E-mail" append-outer-icon="mdi-plus" class="prop-input pad-input" v-model="item.selectedBlockemail"  @click="copyObject = ''"  @click:append-outer="addBlockEmail(item, item.selectedBlockemail)"></v-text-field>
                </v-col>
              </v-row>
              <br>
              <v-divider class="divider-prop"></v-divider>
              <br>
              <span v-if="!caStep" class="sub-title-property"><b>{{ textLang.order_fill.set_sender }}</b></span>
              <v-row v-if="!caStep" class="row-prop">
                <v-radio-group row hide-details class="template-type-block"  v-model="step_sender.byRole" @change="changeSender()">
                  <v-radio :color="color_all_permission" class="mb-2" :value="true">
                    <template v-slot:label>
                      <span class="title-prop">{{ textLang.order_fill.by_position }}</span>
                    </template>
                  </v-radio>
                  <v-radio :color="color_all_permission" class="mb-2" :value="false">
                    <template v-slot:label>
                      <span class="title-prop">{{ textLang.order_fill.by_email }}</span>
                    </template>
                  </v-radio>
                  <v-radio :color="color_all_permission" class="mb-2" :value="'ref'">
                    <template v-slot:label>
                      <span class="title-prop">{{ textLang.order_fill.by_step }}</span>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-row>
              <br v-if="!caStep">
              <div v-show="!caStep" class="role-name" v-for="item in step_sender.value_role" :key="item">
                {{item.role_name}}<v-icon small color="grey lighten-1" v-on:click="deletePermList(item,true)">mdi-close-circle</v-icon>
              </div>
              <div v-show="!caStep" class="role-name"  v-for="item in step_sender.value_email" :key="item">
                {{item}}<v-icon small color="grey lighten-1" v-on:click="deletePermList(item,true)">mdi-close-circle</v-icon>
              </div>
              <v-row v-if="!caStep" class="row-prop" v-show="step_sender.byRole == true">
                <v-col cols="4" class="title-prop-block">
                  <span class="title-prop">{{ textLang.order_fill.position }}:</span>
                </v-col>
                <v-col cols="7" class="px-0">
                  <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" append-outer-icon="mdi-plus" :placeholder="textLang.set_format_form.choose" :color="color_all_permission" class="prop-input autocomplete-pad icon-select dropdown-icon-color" :items="roles" v-model="selectedPermRole" @click:append-outer="addPermList(true)"></v-autocomplete>
                </v-col>
              </v-row>
              <v-row v-if="!caStep" class="row-prop" v-show="!step_sender.byRole">
                <v-col cols="4" class="title-prop-block">
                  <span class="title-prop">{{ textLang.order_fill.email }}:</span>
                </v-col>
                <v-col cols="1" class="px-0 mr-1">
                  <v-checkbox :color="color_all_permission" hide-details class="property-check" v-model="step_sender.isEditable"></v-checkbox>
                </v-col>
                <v-col cols="6" class="px-0">
                  <v-text-field outlined dense hide-details :color="color_all_permission" append-outer-icon="mdi-plus" class="prop-input pad-input" @click="copyObject = ''" v-model="selectedPermEmail" @click:append-outer="addPermList(true)"></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="!caStep" v-show="step_sender.byRole == 'ref'" class="row-prop">
                <v-col cols="4" class="title-prop-block">
                  <span class="title-prop">{{ textLang.order_fill.step_send_ppl }}:</span>
                </v-col>
                <v-col cols="7" class="px-0">
                  <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :color="color_all_permission" class="prop-input autocomplete-pad icon-select dropdown-icon-color" :items="senderRef" v-model="step_sender.ref"></v-autocomplete>
                </v-col>
              </v-row>
              <br v-if="!caStep">
              <v-row v-if="!caStep" class="row-prop">
                <span class="pl-3 pr-4 note-step">{{ textLang.order_fill.event }}</span>
              </v-row>
              <br v-if="!caStep">
              <v-divider v-if="!caStep" class="divider-prop"></v-divider>
              <br v-if="!caStep">
              <span v-if="caStep" class="sub-title-property"><b>{{ textLang.order_fill.set_doc }}</b></span>
              <br>
              <v-row v-if="caStep" class="row-prop">
                <v-col cols="4" align-self="center" class="title-prop-block">
                  <span class="title-prop">{{ textLang.order_fill.approval }}:</span>
                </v-col>
                <v-col cols="1" align-self="center" class="px-0">
                  <v-checkbox hide-details dense :color="color_all_permission" class="mt-0 pt-0" v-model="paperless_data.time_expire.status"></v-checkbox>
                </v-col>
                <v-col v-if="paperless_data.time_expire.status" cols="6" class="pl-2 pr-0">
                  <v-text-field outlined dense hide-details type="number" :suffix="textLang.order_fill.day" :color="color_all_permission" class="prop-input pad-input inside-expire-day-box" @click="copyObject = ''" v-model="paperless_data.time_expire.data_ex.day"></v-text-field>
                  <v-text-field outlined dense hide-details type="number" :suffix="textLang.order_fill.hour" :color="color_all_permission" class="mt-1 prop-input pad-input inside-expire-day-box" @click="copyObject = ''" v-model="paperless_data.time_expire.data_ex.hour"></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="caStep" class="row-prop">
                <v-col cols="4" align-self="end" class="title-prop-block">
                  <span class="title-prop">{{ textLang.order_fill.des_email }}:</span>
                </v-col>
                <v-col cols="7" class="px-0">
                  <v-chip  v-for="item in paperless_data.email_center" :key="item" small close dark :color="color_all_permission" class="mr-1 mb-1 email-last-alert" @click:close="deleteEmailCenter(item)">{{item}}</v-chip>
                  <v-text-field outlined dense hide-details :color="color_all_permission" append-outer-icon="mdi-plus" class="prop-input pad-input dropdown-icon-color" @click="copyObject = ''" v-model="selectedEmailCenter" @click:append-outer="addEmailCenter()"></v-text-field>
                </v-col>
              </v-row>
              <br>
              <v-divider v-if="caStep" class="divider-prop"></v-divider>
              <br><br>
            </div>
            <v-row justify="center" align="center" class="px-3 no-step-row" v-else-if="all_permission.length == 0">
              <span class="no-step-word"><v-icon color="#ff8f00" class="no-step-icon">mdi-alert-circle</v-icon> {{ textLang.order_fill.cannot_find }}</span>
            </v-row>
          </v-tab-item> -->
          <v-tab-item> <!-- Digital Workflow Tab -->
            <span class="header-property"><b>{{ textLang.set_doc_paperless.setting }}</b></span>
            <br>
            <!-- <v-row align="center" class="mt-2 row-prop">
              <v-col cols="4" class="title-prop-block">
                <span class="title-prop">{{ textLang.set_doc_paperless.ppl_subject }}:</span>
              </v-col>
              <v-col cols="8" class="px-0">
                <v-text-field outlined dense hide-details :color="color_seting_paperless" class="prop-input pad-input" :placeholder="textLang.set_doc_paperless.subject_placeholder" v-model="paperless_data.option_page.subject_text"></v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-prop">
              <v-col cols="4" class="title-prop-block">
                <span class="title-prop">{{ textLang.set_doc_paperless.ppl_message }}:</span>
              </v-col>
              <v-col cols="8" class="px-0">
                <v-textarea rows="5" dense outlined hide-details single-line no-resize :color="color_seting_paperless" class="prop-input pad-textarea note-row2" v-model="paperless_data.option_page.body_text"></v-textarea>
              </v-col>
            </v-row> -->
            <!-- <v-row class="row-prop">
              <v-col cols="4" class="title-prop-block">
                <span class="title-prop">{{ textLang.set_doc_paperless.doc_paperless }}:</span>
              </v-col>
              <v-col cols="7" class="px-0 pt-5">
                <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" :color="color_seting_paperless" class="prop-input autocomplete-pad icon-select dropdown-icon-color" :items="documentTypes" v-model="selectedDocumentType"></v-autocomplete>
              </v-col>
            </v-row> -->
            <v-row class="mt-2 row-prop">
              <v-col cols="4" align-self="center"  class="title-prop-block">
                <span class="title-prop">{{ textLang.set_doc_paperless.foermat_paperless }}:</span>
              </v-col>
              <v-col cols="8" align-self="center" class="pl-0 pr-2">
                <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" color="#4CAF50" class="prop-input create-prop-line-height create-prop-dropdown-icon" :items="ppl_templatelist" v-model="selected_ppltemplate" @change="getFlowData()"></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="row-prop">
              <v-col cols="4" class="title-prop-block">
                <span class="title-prop">{{ textLang.set_doc_paperless.note }}:</span>
              </v-col>
              <v-col cols="8" class="pl-0 pr-2">
                <v-textarea rows="5" dense outlined hide-details single-line no-resize color="#4CAF50" class="prop-input pad-textarea note-row2" v-model="note_paperless"></v-textarea>
              </v-col>
            </v-row>
            <!-- <br>
            <v-divider class="divider-prop"></v-divider>
            <br> -->
            <!-- Auto Flow -->
            <!-- <span class="sub-title-property"><b>{{ textLang.set_doc_paperless.set_auto_flow }}</b></span>
            <v-row class="row-prop">
              <v-col cols="11" class="mt-1 pb-0 text-center">
                <v-btn depressed block small :color="color_varidate_button" class="validate-doc-btn" @click="openFlowCondition()">{{ textLang.set_doc_paperless.set_auto_flow_btn }}</v-btn>
              </v-col>
            </v-row> -->
            <v-card outlined class="mr-2 mt-3 pa-2 all-create-workflow-block"> <!-- example workflow -->
              <div v-for="item in currentSelectedFlow.flow_data" :key="item.index"> <!-- each step --> 
                <v-row v-if="item.action == 'Fill'" class="workflow-step-row title-prop">
                  {{ textLang.set_doc_paperless.step_num }} {{item.index + 1}} : {{textLang.set_doc_paperless.permission_input_form}} <!-- ผู้มีสิทธิ์อนุมัติ(textLang.set_doc_paperless.permission_approve) / ผู้มีสิทธิ์เซ็น(textLang.set_doc_paperless.permission_sign) / ผู้มีสิทธิ์กรอก(textLang.set_doc_paperless.permission_input_form) / ผู้มีสิทธิ์กรอกและเซ็น(textLang.set_doc_paperless.permission_sign_input) -->
                </v-row>
                <v-row v-if="item.action == 'Sign' || item.action == 'Sign-Ca'" class="workflow-step-row title-prop">
                  {{ textLang.set_doc_paperless.step_num }} {{item.index + 1}} : {{textLang.set_doc_paperless.permission_sign}} 
                </v-row>
                <v-row v-if="item.action == 'Approve'" class="workflow-step-row title-prop">
                  {{ textLang.set_doc_paperless.step_num }} {{item.index + 1}} : {{textLang.set_doc_paperless.permission_approve}}
                </v-row>
                <v-list dense class="pt-1 pb-5">
                  <v-list-item v-for="email in item.actor[0].permission_email" :key="email.account_id" dense class="pl-2 pr-0 each-step-workflow"> <!-- each mail in step -->
                    <v-list-item-icon class="mr-2 my-0 each-step-workflow-icon">
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content class="py-0 each-step-workflow-mail">
                      {{ email.thai_email }}
                    </v-list-item-content>
                    <!-- <v-list-item-icon class="ml-2 my-0 alert-onechat-block">
                      <img height="21px" src="https://www.img.in.th/images/a368504d4cdb93225bda2f04c665ead7.png" />
                    </v-list-item-icon> -->
                  </v-list-item>
                </v-list>
              </div>
            </v-card>
          </v-tab-item>
          <v-tab-item> <!-- Filling Mobile Tab -->
            <span class="pr-2 header-property"><b>{{ textLang.filling_mobile.title }}</b></span>
            <br><br>
            <span class="sub-title-property"><b>{{ textLang.filling_mobile.sub_title }}</b></span>
            <v-subheader class="suggest-checkbox-setting-step">{{ textLang.filling_mobile.define_question_detail }}</v-subheader>
            <v-row align-self="center" class="mt-5 pl-6 pr-2 property-row">
              <v-btn dark depressed color="#4CAF50" class="py-1 btn-label-mobile" @click="showAllMobile()">{{ textLang.filling_mobile.show_all_mobile }}</v-btn>
            </v-row>
            <v-row align-self="center" class="pl-6 pr-2 property-row">
              <v-btn dark depressed color="red" class="py-1 btn-label-mobile" @click="disableAllMobile()">{{ textLang.filling_mobile.not_show_all_mobile }}</v-btn>
            </v-row>
            <br>
            <v-card v-for="item in mobileInputOrder" :key="item.index" outlined class="px-3 pt-1 pb-4 ml-6 mr-2 mb-3 question-card" draggable="true" style="cursor:move;" @drop="dropBox(item)" @dragover="allowDrop" @dragstart="dragPage(item)">
              <div v-if="item.objType != 'datatable' && !objectArray[item.objType][item.objIndex].deleted">
                <v-checkbox hide-details color="#4CAF50" class="mt-0" v-model="objectArray[item.objType][item.objIndex].style.showMobile">
                  <template v-slot:label>
                    <b class="filling-obj-label">{{objectArray[item.objType][item.objIndex].object_name}}</b>
                  </template>
                </v-checkbox>
                <br>
                <v-textarea :disabled="!objectArray[item.objType][item.objIndex].style.showMobile" outlined dense hide-details no-resize rows="3" :label="textLang.filling_mobile.question" color="#4CAF50" class="font-in-property question-form-box textarea-default-value-prop-auto-row" v-model="objectArray[item.objType][item.objIndex].style.showQuestion"></v-textarea>
              </div>
              <div v-if="item.objType == 'datatable'">
                <v-checkbox hide-details color="#4CAF50" class="mt-0" v-model="dataTableObjectArray[item.objIndex].style.showMobile">
                  <template v-slot:label>
                    <b class="filling-obj-label">{{dataTableObjectArray[item.objIndex].object_name}}</b>
                  </template>
                </v-checkbox>
                <br>
                <v-textarea :disabled="!dataTableObjectArray[item.objIndex].style.showMobile" outlined dense hide-details no-resize rows="3" :label="textLang.filling_mobile.question" color="#4CAF50" class="font-in-property question-form-box textarea-default-value-prop-auto-row" v-model="dataTableObjectArray[item.objIndex].style.showQuestion"></v-textarea>
              </div>
            </v-card>
            <br>
            <v-divider class="divider-prop"></v-divider>
            <br>
            <span class="sub-title-property"><b>{{ textLang.filling_mobile.add_obj_title }}</b></span>
            <v-row align="center" class="row-prop">
              <v-col cols="4" class="pb-0 mt-3 title-prop-block">
                <span class="title-prop">Object:</span>
              </v-col>
              <v-col cols="8" class="pl-0 pr-2 pb-0 mt-3">
                <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" color="#4CAF50" class="prop-input create-prop-dropdown-icon" :items="moreObjectMobile" v-model="selectedObjMob">
                  <template v-slot:append-outer>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon @click="addObject(selectedObjMob, true)" v-on="on">mdi-plus</v-icon>
                      </template>
                      <span>{{ textLang.filling_mobile.add_obj_hover }}</span>
                    </v-tooltip>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <br>
            <v-divider class="divider-prop"></v-divider>
            <br><br>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <SettingLinkDataTableModal/>
      <CreateDropdownDataSetModal/>
      <ConfirmSaveTempModal/>
      <BackFromCreateModal/>
      <hideSettingModal/>
      <docConditionModal/>
      <sumifToolModal/>
      <!-- Import Image Modal -->
      <v-dialog v-model="dialogImageUpload" persistent max-width="450px">
        <v-card>
          <v-card-title>
            <v-row class="insert-img-modal-row">
              <span class="inert-img-modal-header">{{ textLang.modal.insert_picture }}</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="dialogImageUpload = false" color="black">
                <v-icon> mdi-close-circle</v-icon> 
              </v-btn>
            </v-row>
          </v-card-title>
          <v-card-text class="pt-3">
            <v-row justify="center" align="center" class="insert-img-modal-row">
              <v-file-input dense outlined single-line hide-details color="#67C25D" :placeholder="textLang.modal.select_picture" truncate-length="50" accept="image/*" class="prop-input" id="file" v-model="uploadImage"></v-file-input>
            </v-row>
          </v-card-text>
          <v-card-actions class="">
            <v-row class="insert-img-modal-row">
              <v-spacer></v-spacer>
              <v-col cols="auto" class="px-0 pt-0">
                <v-btn depressed dark color="#67C25D" class="insert-img-modal-btn" @click="imageUpload()" >{{ textLang.modal.insert_picture }}</v-btn>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Permission Data Modal -->
      <v-dialog v-model="dialogObjectRole" scrollable persistent max-width="1900px">
        <v-card>
          <v-card-title elevation="4" class="dialog_title">
           <b> {{ textLang.modal.set_data }} </b>
          </v-card-title>
          <v-card-text class="pa-5">
            <v-row>
              <v-col cols="2" align-self="center" class="permission-data-all-title">
                {{ textLang.modal.set_position }}:
              </v-col>
              <v-col cols="2">
                <v-autocomplete dense outlined hide-details append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" :color="color_set_position" class="prop-input autocomplete-pad icon-select dropdown-icon-color" :items="roles" v-model="selectedObjectRole"></v-autocomplete>
              </v-col>
              <v-col cols="2">
                <v-btn depressed color="grey lighten-2" class="apply-all-btn" @click="addAllObjectRoleList()">{{ textLang.modal.apply }}</v-btn>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="2" align-self="center" class="permission-data-all-title">
                {{ textLang.modal.set_email }}:
              </v-col>
              <v-col cols="2">
                <v-text-field dense outlined single-line hide-details :color="color_set_email" class="prop-input pad-input" v-model="selectedObjectEmail"></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn depressed color="grey lighten-2" class="apply-all-btn" @click="addAllObjectEmailList()">{{ textLang.modal.apply_email }}</v-btn>
              </v-col>
            </v-row>
            <v-expansion-panels accordion multiple flat class="flat-expan">
              <v-expansion-panel v-for="obj in objectTypeInput" :key="obj" v-show="objectArray[obj].length - 1">
                <v-expansion-panel-header class="pb-0 permission-object-type"> <!-- object type -->
                  {{ getObjectTypeName(obj) }} ({{objectArray[obj].length - 1}})
                  <template v-slot:actions>
                    <v-icon :color="color_icon_expand">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <hr class="line-expan-permission">
                <v-expansion-panel-content class="object-content-permission">
                  <v-simple-table dense fixed-header>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th width="5%" class="permission-title">{{ textLang.property_type.object }}</th>
                          <th width="10%" class="permission-title">JSON Key</th>
                          <th width="43%" class="permission-title">{{ textLang.modal.loc_access }}</th>
                          <th width="42%" class="permission-title">{{ textLang.modal.email_access }}</th>
                        </tr>
                      </thead>
                      <tbody class="permission-table-striped ">
                        <tr v-for="item in objectArray[obj]" :key="item.name"  v-show="!item.deleted && !item.isPre">
                          <td class="permission-table-data">{{item.object_name}}</td> <!-- object name -->
                          <td class="permission-table-data">{{item.style.json_key}}</td> <!-- JSON Key -->
                          <td class="py-3 permission-table-data"> <!-- role permission setting -->
                            <v-autocomplete filled dense outlined hide-details multiple chips background-color="white" append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" :item-color="color_choice" :color="color_autocomplete" class="prop-input permission-box autocomplete-pad icon-select dropdown-icon-color" :items="roleNameList" v-model="item.style.role_id">
                              <template v-slot:selection="data">
                                <v-chip dark :color="color_chip" class="role-chip"  v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="deleteObjectRoleList(obj, item, data.item)">
                                  {{data.item}}
                                </v-chip>
                              </template>
                            </v-autocomplete>
                          </td>
                          <td class="py-3 permission-table-data"> <!-- e-mail permission setting -->
                            <v-row class="mb-2 row-email-permission">
                              <v-chip close :color="color_chip" class="mr-2 mb-2 role-chip" v-for="e in item.style.email_report" :key="e" @click:close="deleteObjectEmailList(obj, item, e)">
                                {{e}}
                              </v-chip>
                            </v-row>
                            <v-text-field dense outlined single-line hide-details :color="color_text_field" background-color="white" append-outer-icon="mdi-plus" class="prop-input pad-input" @click:append-outer="addObjectEmailList(obj, item)" v-model="selectedObjectEmail"></v-text-field>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header class="pb-0 permission-object-type"> <!-- object type -->
                  Data Table Cell ({{ datatableRoleCell.length }})
                  <template v-slot:actions>
                    <v-icon :color="color_icon_expand">$expand</v-icon>
                  </template>
                </v-expansion-panel-header>
                <hr class="line-expan-permission">
                <v-expansion-panel-content class="object-content-permission">
                  <v-simple-table dense fixed-header>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th width="5%" class="permission-title">{{ textLang.property_type.object }}</th>
                          <th width="10%" class="permission-title">JSON Key</th>
                          <th width="43%" class="permission-title">{{ textLang.modal.loc_access }}</th>
                          <th width="42%" class="permission-title">{{ textLang.modal.email_access }}</th>
                        </tr>
                      </thead>
                      <tbody class="permission-table-striped ">
                        <tr v-for="item in datatableRoleCell" :key="item">
                          <td class="permission-table-data">{{dataTableObjectArray[item].object_name}}</td>
                          <td class="permission-table-data">{{dataTableObjectArray[item].style.json_key}}</td>
                          <td class="py-3 permission-table-data">
                            <v-autocomplete filled dense outlined hide-details multiple chips background-color="white" append-icon="mdi-chevron-down" :placeholder="textLang.set_format_form.choose" :item-color="color_choice" :color="color_autocomplete" class="prop-input permission-box autocomplete-pad icon-select dropdown-icon-color" :items="roleNameList" v-model="dataTableObjectArray[item].style.role_id">
                              <template v-slot:selection="data">
                                <v-chip dark :color="color_chip" class="role-chip" v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="deleteObjectRoleList('datatable', item, data.item)">
                                  {{data.item}}
                                </v-chip>
                              </template>
                            </v-autocomplete>
                          </td>
                          <td class="py-3 permission-table-data">
                            <v-row class="mb-2 row-email-permission">
                              <v-chip close :color="color_chip" class="mr-2 mb-2 role-chip" v-for="e in dataTableObjectArray[item].style.email_report" :key="e" @click:close="deleteObjectEmailList('datatable', item, e)">
                                {{e}}
                              </v-chip>
                            </v-row>
                            <v-text-field dense outlined single-line hide-details :color="color_text_field" background-color="white" append-outer-icon="mdi-plus" class="prop-input pad-input" @click:append-outer="addObjectEmailList('datatable', item)" v-model="selectedObjectEmail"></v-text-field>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
          <v-divider class="divider-end-permission-modal"></v-divider>
          <v-card-actions class="pt-8 pb-12">
            <v-spacer></v-spacer>
            <v-btn outlined large color="#979797" dark class="px-12 mr-3 save-setting-btn" @click="closeObjectRole()">{{ textLang.modal.cancel }}</v-btn>
            <v-btn depressed large :color="color_save" class="px-7 mx-4 save-setting-btn save-modal-font-btn" @click="dialogObjectRole = false">{{ textLang.modal.save }}</v-btn>
            <v-btn depressed large color="red" class=" save-setting-btn save-modal-font-btn" @click="clearObjectRole()">{{ textLang.modal.clear }}</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { EventBus } from '../../EventBus.js'
import SettingLinkDataTableModal from '../../components/eform/SettingLinkDataTableModal'
import CreateDropdownDataSetModal from '../../components/eform/CreateDropdownDataSetModal'
import ConfirmSaveTempModal from '../../components/eform/ConfirmSaveTempModal'
import BackFromCreateModal from '../../components/eform/BackFromCreateModal'
import hideSettingModal from '../../components/eform/hideSettingModal'
import docConditionModal from '../../components/eform/docConditionModal'
import sumifToolModal from '../../components/eform/sumifToolModal'

var ArrowEventHandle
var CrtlEventHandle = false

export default {
  computed: {
  //   textLang() {
  //       return this.$store.getters.textLang.Create_Template
  //   }
  step_choices_options() {
    return this.step_choices.map((x,i) => ({
      ...x,
      text: i == 0? this.textLang.property_type.sender_flow : this.textLang.property_type.step_flow + i
    }))
  }
  },
  components: {
    SettingLinkDataTableModal,
    CreateDropdownDataSetModal,
    ConfirmSaveTempModal,
    BackFromCreateModal,
    hideSettingModal,
    docConditionModal,
    sumifToolModal,
  },

  data: () => ({
    textLang:{
      tabMenubar: {
        create_doc: "ออกจากหน้าสร้าง",
        set_format: "กำหนดรูปแบบฟอร์ม",
        tools: "เครื่องมือ",
        property: "คุณสมบัติ",
        complete_sequence: "ลำดับการกรอกและเซ็น",
        set_paperless: "ตั้งค่าเอกสาร Digital Workflow",
        filling_mobile: "ตั้งค่าการกรอกในมุมมองแบบฟอร์มอย่างง่าย",
        save: "บันทึกแบบฟอร์ม",
        open_page: "เปิดเพื่อดูหน้ากระดาษ",
        page: "หน้า",
        add_page: "เพิ่มหน้ากระดาษ",
        show_toolbar: "เปิดแสดงแถบเครื่องมือ",
        insert_img: "กดเพื่อแทรกรูปภาพ"
      },
      set_format_form: {
        set_doc_format: "กำหนดรูปแบบฟอร์ม",
        set_doc_detail: "กำหนดรายละเอียดแบบฟอร์ม",
        name_doc: "ชื่อแบบฟอร์ม:",
        doc_type: "ประเภทเอกสาร:",
        department: "แผนก:",
        group: "กลุ่มของเอกสาร:",
        id: "รหัสแบบฟอร์ม:",
        version: "เวอร์ชันแบบฟอร์ม:",
        en_data: "วันที่บังคับใช้:",
        locking_pdf: "ตั้งค่าการล็อกเอกสาร (pdf):",
        choose: "เลือก",
        please_fill_in: "กรุณากรอกชื่อแบบฟอร์ม",
        permission_step: " (อ้างอิงลำดับที่",
        step: "ลำดับที่"
      },
      set_num_doc: {
        set_doc_num: "ตั้งค่าหมายเลขเอกสาร",
        num_format: "รูปแบบหมายเลข:",
        prefix: "คำนำหน้า",
        date: "วันที่",
        num: "หมายเลข",
        by_doc: "ตามประเภทเอกสาร",
        custom: "กำหนดเอง",
        prefix1: "คำนำหน้า:",
        date_format: "รูปแบบวันที่:",
        digit_num_doc: "จำนวนหลักของหมายเลขเอกสาร:"
      },
      format_doc: {
        doc_type: "รูปแบบเอกสาร",
        doc_type_form: "รูปแบบเอกสาร E-Form",
        structure: "โครงสร้าง"
      },
      set_font_paper: {
        page_setup: "ตั้งค่าหน้ากระดาษ",
        paper_size: "ขนาดกระดาษ:",
        vertical: "แนวตั้ง",
        landscape: "แนวนอน",
        show_page_line: "แสดงเส้นแบ่งส่วนหน้า",
        show_line: "แสดงเส้นกึ่งกลางหน้ากระดาษ",
        show_grids: "แสดงเส้นตารางหน้ากระดาษ"
      },
      status_doc: {
        status_doc: "สถานะของแบบฟอร์ม",
        ready: "พร้อมใช้งาน",
        not_available: "ยังไม่พร้อมใช้งาน"
      },
      validation_doc: {
        validation_title: "การตรวจสอบความถูกต้องของเอกสาร",
        validate_setting_btn: "ตั้งค่าการตรวจสอบ"
      },
      set_sharing: {
        doc_sharing_set: "ตั้งค่าการแชร์แบบฟอร์ม",
        doc_sharing: "Business ที่แชร์:",
        doc_general: "เอกสารสำหรับบุคคลทั่วไป",
        doc_usage: "สิทธิ์การใช้งาน:",
        permission_view_all_title: "สิทธิ์การดูเอกสารเพิ่มเติม"
      },
      set_data_doc: {
        set_data_doc: "ตั้งค่าข้อมูลเอกสาร",
        system_name: "ชื่อระบบ:",
        webhook: "API สำหรับเชื่อมต่อระบบอื่น:",
        send_api: "ลำดับที่ต้องการส่งข้อมูล:"
      },
      set_next_template: {
        set_next_temp_title: "ตั้งค่ารูปแบบเอกสารลำดับถัดไป",
        next_temp: "รูปแบบเอกสารลำดับถัดไป"
      },
      tools_create_form: {
        tools_create: "เครื่องมือในการสร้าง"
      },
      tips_data: {
        ctrl_arrow: "ctrl + ปุ่มลูกศร: ใช้สำหรับปรับขนาด Object",
        moving_object: "ปุ่มลูกศร: ใช้สำหรับเคลื่อนย้าย Object",
        delete_keys: "ปุ่ม delete: ใช้สำหรับลบ Object",
        c_copy: "ctrl + c: ใช้สำหรับคัดลอก object ที่กำลังเลือกอยู่",
        v_pasting: "ctrl + v: ใช้สำหรับวาง object ที่คัดลอกมาลงบนหน้ากระดาษ",
        z_reverting: "ctrl + z: ใช้สำหรับย้อน object ที่ถูกลบไปก่อนหน้ากลับมา",
        selecting: "ctrl + การกดเลือก object หลาย ๆ อัน: เป็นการเลือก object ทีเดียวหลายอันเพื่อให้สามารถไปกดลบ object เหล่านั้นทีเดียวได้ที่แถบคุณสมบัติ"
      },
      property_text: {
        property_object: "คุณสมบัติของ Object",
        set_data_access: "ตั้งค่าสิทธิ์การเข้าถึงชุดข้อมูล",
        set_pro_values: "กำหนดค่าคุณสมบัติ",
        title: "หัวข้อ",
        property: "ค่าคุณสมบัติ",
        delete_object: "ลบ Object"
      },
      property_type: {
        object: "ชื่อ Object",
        for_database: "Key สำหรับเชื่อมฐานข้อมูล",
        fixed_object: "ตำแหน่งของ Object คงที่",
        hide_display: "ซ่อน Object จากหน้ากระดาษ",
        hide_preview: "แสดงในหน้ากรอกเท่านั้น",
        border_color: "สีเส้นขอบ",
        border_thickness: "ความหนาเส้นขอบ",
        num_col: "จำนวนคอลัมน์",
        cols: "คอลัมน์",
        num_row: "จำนวนแถว",
        max_row: "จำนวนแถวสูงสุด",
        rows: "แถว",
        export_data_table: "Export ข้อมูลภายในตาราง",
        allow_table_row: "อนุญาตให้เพิ่มแถวตาราง",
        continue_table: "Object ต่อเนื่อง",
        line_def: "แถวที่จะคัดลอกเมื่อเพิ่มแถว",
        not_moving_below: "ไม่ขยับ Object ด้านล่าง",
        set_col_width: "ตั้งค่าความกว้างของคอลัมน์",
        total_col: "คอลัมน์ทั้งหมด",
        column: "คอลัมน์ที่",
        set_row_height: "ตั้งค่าความสูงของแถว",
        total_row: "แถวทั้งหมด",
        row: "แถวที่",
        set_link: "ตั้งค่าการเชื่อมโยงของตาราง",
        call_name: "ชื่อเซลล์",
        not_referring: "ไม่อ้างอิงข้อมูลจากเอกสารอื่น",
        don_show_cell: "ไม่แสดง Object ภายในเซลล์",
        object_inside: "Object ภายในเซลล์",
        body: "เนื้อความ",
        font_size: "ขนาดตัวอักษร",
        font_style: "รูปแบบตัวอักษร",
        text_format: "การจัดรูปแบบข้อความ",
        font_color: "สีอักษร",
        line_color: "สีเส้น",
        line_thickness: "ความหนาเส้น",
        line: "แนวเส้น",
        vertical: "แนวตั้ง",
        landscape: "แนวนอน",
        line_style: "รูปแบบเส้น",
        bg_color: "สีพื้นหลัง",
        width: "ความกว้าง",
        height: "ความสูง",
        textbox: "กล่องข้อความ",
        line_num: "จำนวนบรรทัด",
        maximum_characters:"จำนวนตัวอักษรสูงสุด",
        add_extra_characters: "เพิ่มหน้าอัตโนมัติเมื่อจำนวนตัวอักษรเกิน",
        characters:"ตัวอักษร",
        alphabet_type: "ประเภทตัวอักษร",
        upper_case: "ตัวอักษรพิมพ์ใหญ่",
        lowwer_case: "ตัวอักษรพิมพ์เล็ก",
        line1: "บรรทัด",
        name_object: "ชื่อ Object ที่ต้องการอ้างอิง",
        auto_select: "ตัวเลือกอัตโนมัติ",
        choice_reference: "การอ้างอิงกลุ่มตัวเลือก",
        img_link: "ลิงค์รูปภาพ",
        options: "ตัวเลือก",
        choice_group: "กลุ่มตัวเลือก",
        create_edit: "สร้าง / แก้ไข",
        in_row_import: "นำเข้าข้อมูลภายในแถว",
        date_format: "รูปแบบวันที่",
        def_custom_date: "กำหนดค่าเริ่มต้น",
        datepicker_name: "ชื่อ Date Picker อ้างอิง",
        num_date_ref: "ค่าเริ่มต้นนับจากวันที่อ้างอิง",
        num_month: "เดือน",
        num_year: "ปี",
        start_date_setting: "วันที่เริ่มต้น",
        data_sync: "การเชื่อมข้อมูล",
        name_reference: "ชื่อ Object อ้างอิง",
        reading_style: "รูปแบบการอ่าน",
        time_format: "รูปแบบเวลา",
        second: "วินาที",
        need_fillout: "จำเป็นต้องกรอก",
        not_allowed: "ไม่อนุญาตให้แก้ไข",
        text_type: "ประเภทข้อความ",
        num_only: "ตัวเลขเท่านั้น",
        show_zero: "แสดงค่าเลขศูนย์(0)",
        infinity: "เปลี่ยน \"Infinity\" เป็นศูนย์(0)",
        format_commas: "จัดรูปแบบด้วยจุลภาค(,)",
        don_show_decimal: "ไม่เอาค่าทศนิยม(ตัดเศษทิ้ง)",
        decimal_num: "จำนวนทศนิยม",
        decimal_num_show: "จำนวนทศนิยมที่แสดง",
        position: "ตำแหน่ง",
        fuction: "ฟังก์ชัน",
        condition: "เงื่อนไข",
        default: "ค่าเริ่มต้น",
        variable_default: "ตัวแปรในค่าเริ่มต้น",
        cost: "ค่า",
        since: "ตั้งแต่",
        to: "ถึง",
        group_options: "จัดกลุ่มตัวเลือก",
        cell_excel: "เซลล์ Excel",
        show_scope: "แสดงขอบเขต",
        con_scope: "ขอบเขตต่อเนื่อง",
        suffix: "คำลงท้าย",
        hide_object: "การซ่อน Object",
        set_object: "ตั้งค่าการซ่อน Object",
        hide_object_cell: "การซ่อนภายในเซลล์",
        set_object_cell: "ตั้งค่าการซ่อนภายในเซลล์",
        arrange_object: "การจัดเรียง Object",
        arrange_forward: "นำไปไว้ข้างหน้า",
        arrange_front: "นำไปไว้ข้างหน้าสุด",
        arrange_backward: "ย้ายไปข้างหลัง",
        arrange_back: "ย้ายไปไว้ข้างหลังสุด",
        assignment: "การกำหนดสิทธิ์",
        reference: "อ้างอิงสิทธิ์ตามลำดับก่อนหน้า",
        order_refer: "ลำดับ Workflow:",
        sender_flow: "ผู้ส่งเอกสาร",
        step_flow: "ลำดับที่ ",
        by_positio: "โดยตำแหน่ง",
        by_email: "โดยอีเมล",
        email: "อีเมล",
        used_importing: "ใช้สำหรับ import ข้อมูลจากช่องเซลล์ใน Excel เข้ามา",
        start_date_from: "จำนวนวันจากวันปัจจุบัน",
        start_date_custom: "กำหนดวันที่เริ่มต้น",
        start_date_day: "วัน",
        no_default: "ไม่แสดงค่าเริ่มต้น",
        default_input: `ค่าเริ่มต้นจาก Object อื่น`,
        search_api: "API เชื่อมต่อข้อมูล"
      },
      tips_help_message: {
        box_displaying: "กล่องสำหรับแสดงข้อความบนแบบฟอร์ม",
        box_filling: "กล่องสำหรับกรอกข้อมูลบนแบบฟอร์ม (หนึ่งบรรทัด) หากกำหนดการกรอกให้เป็นค่าตัวเลขเท่านั้นจะสามารถกำหนดเงื่อนไขให้กับกล่อง input box ได้ โดยเลือกเงื่อนไขที่ต้องการ และกำหนดค่าให้กับเงื่อนไขนั้นซึ่งอาจเป็นตัวเลข กล่อง input box (กำหนดได้โดยใช้ชื่อ object) หรือกล่อง calculate box (กำหนดได้โดยใช้ชื่อ object)",
        square_box: "กล่องสี่เหลี่ยมใช้ในการสร้างรูปสี่เหลี่ยมประกอบแบบฟอร์ม",
        box_information: "กล่องสำหรับกรอกข้อมูลบนแบบฟอร์ม (มากกว่าหนึ่งบรรทัด) และสามารถเพิ่มตัวแปรให้กับข้อความเริ่มต้นได้",
        box_information_editor: "กล่องสำหรับกรอกข้อมูลที่ผู้ใช้งานสามารถปรับแต่งตัวอักษรเองได้",
        box_selecting: "กล่องสำหรับเลือกข้อมูลวันที่บนแบบฟอร์ม",
        box_for_selecting: "กล่องสำหรับเลือกข้อมูลเวลาบนแบบฟอร์ม",
        check_box: "กล่องทำเครื่องหมายสำหรับเลือกหรือไม่เลือกตัวเลือกนั้น ๆ ซึ่งสามารถจัดกลุ่มของตัวเลือกให้อยู่กลุ่มเดียวกันได้ โดยไปที่ \"จัดกลุ่มตัวเลือก\" แล้วใส่ชื่อของ check box ที่ต้องการให้อยู่กลุ่มเดียวกัน จากนั้นกดปุ่ม \"+\" ด้านหลังช่องกรอกเพื่อเพิ่ม check box นั้นให้อยู่กลุ่มเดียวกัน ซึ่งเมื่อจัดกลุ่มแล้วจะมีคุณสมบัติ “จำเป็นต้องกรอก” ขึ้นมาให้เลือก เพื่อเป็นการบังคับว่าต้องเลือกอย่างน้อย 1 ตัวเลือกจากตัวเลือกในกลุ่มนั้นทั้งหมด",
        pictures: "รูปภาพใช้ประกอบการสร้างเอกสาร",
        box_selecting_one: "กล่องสำหรับเลือกตัวเลือกใดตัวเลือกหนึ่งจากกลุ่มตัวเลือกที่มีหลายตัวเลือก สามารถทำให้กลุ่มตัวเลือกเปลี่ยนตามค่าที่อ้างอิงจาก input box หรือ dropdown input อื่นได้ โดยไปใส่ชื่อ object ที่ต้องการอ้างอิงที่ \"การอ้างอิงกลุ่มตัวเลือก\" แล้วกดปุ่ม \"สร้าง/แก้ไข\" ที่กลุ่มตัวเลือก จากนั้นตั้งชื่อกลุ่มตัวเลือกให้ตรงกับค่าที่จะอ้างอิงจาก input box หรือ dropdown input แล้วใส่ตัวเลือกตามที่ต้องการลงในกลุ่มตัวเลือกนั้น ๆ",
        automatic: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;กล่องแสดงข้อมูลอัตโนมัติโดยมีการเชื่อมข้อมูลจากข้อมูลที่ได้เลือกไว้ <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; หากเลือกข้อมูลเป็น \"เงื่อนไข(ระบุ)\" จะเป็นการนำค่าผลลัพธ์มาแสดงตามเงื่อนไขที่กำหนด โดยมีรูปแบบการเขียนเงื่อนไขคือ cond (\"เงื่อนไข\"?show=\"ผลลัพธ์กรณีเป็นจริง\":show=\"ผลลัพธ์กรณีเป็นเท็จ\") หรือเปลี่ยนจาก show=\"ผลลัพธ์\" เป็น hide เพื่อซ่อนกล่อง input box auto ตามเงื่อนไขที่กำหนด และสามารถมีเงื่อนไขซ้อนได้มากกว่าหนึ่งเงื่อนไข เช่น cond(\"เงื่อนไข1\"?show=\"ผลลัพธ์กรณีเป็นจริง1\":\"เงื่อนไข2\"?show=\"ผลลัพธ์กรณีเป็นจริง2\":show=\"ผลลัพธ์กรณีเป็นเท็จ\") ดังตัวอย่างต่อไปนี้ cond($dropdownbox0==\"ใช่\"?show=\"Yes\": $dropdownbox0 == \"ไม่\"?show=\"No\": show=\"Else\") ซึ่งมีเครื่องหมายที่ใช้ในการเปรียบเทียบเงื่อนไขดังนี้ ==(เท่ากับ), !=(ไม่เท่ากับ), >=(มากกว่าเท่ากับ), <=(น้อยกว่าเท่ากับ), >(มากกว่า), <(น้อยกว่า) ส่วนข้อความที่จะนำมาเปรียบเทียบต้องอยู่ภายในเครื่องหมาย (\") หรือ (') และผลลัพธ์ที่จะแสดงต้องนำหน้าด้วย \"show=\" และอยู่ภายในเครื่องหมาย (\") หรือ (') เช่นกัน ซึ่งสามารถใช้ได้กับ input box, dropdown box, calculate box, input box auto และ check box (ข้อความที่จะนำมาเปรียบเทียบของ check box เมื่อมีการทำเครื่องหมายจะเป็น true หากไม่มีการทำเครื่องหมายจะเป็น false และไม่ต้องอยู่ภายในเครื่องหมาย (\") หรือ (')) โดยใส่เครื่องหมาย $ นำหน้าชื่อ Object ที่ต้องการอ้างอิงถึง",
        box_show: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;กล่องแสดงข้อมูลที่ได้จากการนำค่าในกล่อง input box, calculate box, date picker, time picker หรือค่าตัวเลขมาคำนวณตามที่ได้กำหนดไว้ในฟังก์ชัน โดยสามารถใส่การคำนวณไว้ข้างใน calc (...) พร้อมกับการใช้เครื่องหมาย +, -, *, /,( ),% ซึ่งสามารถกำหนดจำนวนตำแหน่งทศนิยมของผลลัพธ์ได้ และหากต้องการนำค่าในกล่อง input box หรือ calculate box มาคำนวณ ให้ใส่เครื่องหมาย $ หน้าชื่อ input box หรือ calculate box นั้น ตัวอย่างเช่น calc(($calculatebox1*2)+ $inputbox2) <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;นอกจากนั้นยังสามารถคำนวณค่าฟังก์ชันอื่นๆได้ดังต่อไปนี้ <br><ul><li>Modulate(%): การหารเพื่อเก็บเศษตัวอย่างเช่น calc(15%10) ผลลัพธ์คือ 5</li><li>ค่าเฉลี่ย: avg(inputbox1,inputbox2,...)</li><li>ค่าน้อยสุด: min(inputbox1,inputbox2,...)</li><li>ค่ามากสุด: max(inputbox1,inputbox2,...)</li><li>ผลต่างจำนวนเดือน: diffMon(datepickerbox1, datepickerbox2)</li><li>ผลต่างวันที่: diffDate(datepickerbox1, datepickerbox2)</li><li>ระยะเวลาระหว่างวันที่(วัน): lenDate(datepickerbox1, datepickerbox2)</li><li>ผลต่างเวลา: diffTime(timebox1,timebox2)</li><li>ผลต่างเวลา(เอาเฉพาะค่าชั่วโมง): diffTimeHr(timebox1, timebox2)</li><li>ผลต่างเวลา(เอาเฉพาะค่านาที): diffTimeMn(timebox1, timebox2)</li><li>ผลรวมทุกค่าในคอมลัมน์ของตาราง Data Table: sum(datatable1_RXC1)</li><li>ผลรวมค่าในคอมลัมน์ของตาราง Data Table ตามเงื่อนไข: sumif(datatable1_RXC1: เงื่อนไข)</li></ul>",
        box_show_thai: "กล่องแสดงคำอ่านของค่าตัวเลขจากกล่อง input box (ต้องกำหนดค่าเป็นตัวเลขเท่านั้นไว้ด้วย) หรือ calculate box ตามที่ได้เลือกการเชื่อมข้อมูลไว้",
        scope_box: "กล่องขอบเขตสำหรับการกำหนดสิทธิ์การกรอกแบบฟอร์ม โดย Object ภายในขอบเขตจะถูกกำหนดสิทธิ์การกรอกแบบฟอร์มตามสิทธิ์ที่กำหนดไว้ของขอบเขต ยกเว้น Object ที่มีการกำหนดสิทธิ์อยู่แล้ว หากกล่องขอบเขตใดอยู่คนละพื้นที่กันและต้องการให้มีสิทธิ์การกรอกอันเดียวกัน (อยู่ลำดับการกรอกเดียวกัน) ให้ไปตั้งค่าที่ \"ขอบเขตต่อเนื่อง\" แล้วเลือกกล่องขอบเขตที่เป็นสิทธิ์การกรอกอันเดียวกัน",
        displaying: "ตารางสำหรับแสดงข้อมูลต่าง ๆ ที่สามารถเชื่อมโยงข้อมูลภายในแถวเดียวกันได้เพื่อดึงข้อมูลมาใส่เมื่อเซลล์มีค่าตรงกับข้อมูลที่ได้กำหนดไว้ โดยกดที่ปุ่ม \"ตั้งค่าการเชื่อมโยงของตาราง\" ซึ่งจะทำให้ภายในเซลล์ทุกเซลล์ของตารางกลายเป็น Dropdown Input สำหรับเลือกข้อมูลตามที่ได้กำหนดไว้",
        consists: "ตารางประกอบการสร้างแบบฟอร์มที่สามารถตั้งค่าความกว้างของคอลัมน์ และความสูงของแถวได้ โดยสามารถตั้งค่าทุกคอลัมน์หรือทุกแถวในครั้งเดียว หรือจะตั้งค่าแยกเฉพาะคอมลัมน์หรือแถวนั้น ๆ",
        straight: "เส้นตรงประกอบการสร้างแบบฟอร์มที่สามารถปรับเป็นแนวตั้งหรือแนวนอนได้ และสามารถเปลี่ยนรูปแบบเป็นเส้นตรง, เส้นประ หรือเส้นจุดไข่ปลาได้",
        area_displaying: "พื้นที่สำหรับแสดงลายเซ็น",
        picture_box: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;กล่องรูปภาพที่สามารถเลือกได้ว่าจะให้เป็นรูปภาพประกอบแบบฟอร์มหรือพื้นที่สำหรับแทรกรูปภาพในแบบฟอร์มเมื่อกดใช้งาน<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;หากต้องการให้เป็นรูปภาพประกอบแบบฟอร์มให้ใส่รูปภาพลงไปในกล่อง image box ซึ่งสามารถเลือกได้ว่าจะใส่รูปภาพโดยการใส่ลิงค์รูปภาพหรือไฟล์รูปภาพจากในเครื่องคอมพิวเตอร์ (กดที่กล่อง image box เพื่อเลือกไฟล์รูปภาพ) ซึ่งขนาดของรูปภาพจะเป็นไปตามขนาดของกล่อง image box ที่ได้กำหนดไว้<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;หากต้องการให้เป็นพื้นที่สำหรับแทรกรูปภาพในแบบฟอร์มเมื่อกดใช้งาน ไม่ต้องใส่รูปภาพลงไปในกล่อง image box ให้กำหนดแค่ขนาดกล่องตามที่ต้องการ ซึ่งขนาดของรูปภาพจะอ้างอิงตามขนาดของกรอบด้านที่สั้นที่สุดตามที่ได้กำหนดไว้ นั่นคือหากด้านกว้างสั้นกว่าด้านยาว รูปภาพจะมีความกว้างเท่ากับกรอบที่ได้กำหนด ส่วนด้านยาวจะถูกปรับให้มีขนาดที่เหมาะสมโดยอัตโนมัติ"
      },
      order_fill: {
        order_of: "ลำดับการกรอกและเซ็นเอกสาร",
        set_order: "กำหนดลำดับการกรอกและเซ็นเอกสาร",
        check_box: "ทำเครื่องหมายหน้ากล่องสำหรับเลือก object ในแต่ละลำดับการกรอกเพื่ออนุญาตให้ผู้ยื่นเอกสารสามารถแก้ไขผู้กรอกในลำดับนั้น ๆ ได้",
        order: "ลำดับที่",
        ex: "Ex. sale, นิติกร, ...",
        person: "ตำแหน่งผู้กรอกหรือเซ็น",
        forbiden_email_title: "ตั้งค่าสิทธิ์ห้ามกรอกสำหรับแต่ละลำดับ",
        set_sender: "ตั้งค่าผู้ส่งเอกสารเข้าระบบ Paperless",
        by_position: "โดยตำแหน่ง",
        by_email: "โดยอีเมล",
        by_step: "โดยลำดับการกรอก",
        position: "ตำแหน่ง",
        email: "อีเมล",
        step_send_ppl: "ลำดับที่เป็นผู้ส่งเข้าระบบ",
        event: "* ในกรณีที่ไม่กำหนดผู้ส่งเอกสาร ผู้กรอกลำดับที่ 1 จะเป็นผู้ส่งเอกสารเข้าระบบ Paperless",
        permissions: "กำหนดสิทธิ์การดูข้อมูลของแต่ละลำดับ",
        information: "ข้อมูลของลำดับที่",
        order_information: "ลำดับที่สามารถดูข้อมูลได้",
        set_doc: "ตั้งค่าการอนุมัติเอกสาร",
        approval: "ระยะเวลาในการอนุมัติ",
        day:"วัน",
        hour: "ชั่วโมง",
        des_email: "อีเมลปลายทาง",
        cannot_find: "ไม่พบการกำหนดสิทธิ์การกรอกในเอกสารนี้"
      },
      set_doc_paperless: {
        ppl_subject: "เรื่อง",
        subject_placeholder: "<ไม่มีหัวเรื่อง>",
        ppl_message: "ข้อความ", 
        setting: "ตั้งค่าเริ่มต้นแบบฟอร์ม Digital Workflow",
        doc_paperless: "ประเภทเอกสาร paperless",
        foermat_paperless: "รูปแบบ Workflow",
        note: "หมายเหตุ",
        set_auto_flow: "ตั้งค่าประเภทและรูปแบบเอกสาร Paperless อัตโนมัติ",
        set_auto_flow_btn: "ตั้งค่าประเภทและรูปแบบเอกสาร Paperless",
        step_num: "ลำดับที่",
        permission_approve: "ผู้มีสิทธิ์อนุมัติ",
        permission_sign: "ผู้มีสิทธิ์เซ็น",
        permission_input_form: "ผู้มีสิทธิ์กรอก",
        permission_sign_input: "ผู้มีสิทธิ์กรอกและเซ็น"
      },
      filling_mobile: {
        title: "ตั้งค่าการกรอกในมุมมองแบบฟอร์มอย่างง่าย",
        sub_title: "กำหนดคำถามสำหรับแต่ละ Object",
        define_question_detail: "ทำเครื่องหมายหน้าชื่อ object เพื่อเลือกให้ object นั้นไปแสดงในมุมมองแบบฟอร์มอย่างง่ายพร้อมกับคำถาม",
        not_show_all_mobile: "ไม่แสดงทุก object ในมุมมองแบบฟอร์มอย่างง่าย",
        show_all_mobile: "แสดงทุก object ในมุมมองแบบฟอร์มอย่างง่าย",
        question: "คำถาม",
        add_obj_title: "สร้าง Object ในมุมมองแบบฟอร์มอย่างง่ายเพิ่มเติม",
        add_obj_hover: "สร้าง Object"
      },
      modal:{
        insert_picture: "แทรกรูปภาพ",
        select_picture: "กรุณาเลือกรูปภาพ",
        image: "รูปภาพ",
        cancel: "ยกเลิก",
        set_data: "ตั้งค่าสิทธิ์การเข้าถึงชุดข้อมูล",
        set_position: "กำหนดทั้งหมดด้วยตำแหน่ง",
        apply: "นำตำแหน่งไปใช้กับทั้งหมด",
        set_email: "กำหนดทั้งหมดด้วยอีเมล",
        apply_email: "นำอีเมลไปใช้กับทั้งหมด",
        loc_access: "ตำแหน่งที่มีสิทธิ์เข้าถึงข้อมูล",
        email_access: "อีเมลที่มีสิทธิ์เข้าถึงข้อมูล",
        save: "บันทึกการตั้งค่า",
        clear: "ล้างการตั้งค่าทั้งหมด"
      },
      alert:{
        alert_error: "ไม่สำเร็จ",
        alert_success: "สำเร็จ",
        name_object: "ชื่อ Object \"",
        change_name: "\" ซ้ำ กรุณาเปลี่ยนชื่อ Object",
        duplicate: "ลำดับการกรอกซ้ำ",
        section_boxes: "Section Box ซ้อนทับกัน กรุณาจัดวาง Section Box ใหม่",
        save_complete: "บันทึกแบบฟอร์มสำเร็จ",
        fail_save: "บันทึกแบบฟอร์มไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
        create_eform: "สร้างรูปแบบเอกสาร",
        workflow_alert: "กรุณาเลือก Worflow ของแบบฟอร์ม"
      },
      dropdown:{
        buddhist: "พุทธศักราช",
        anno: "คริสต์ศักราช",
        buddhist_era: "พุทธศักราช(ย่อ)",
        present_date: "วันที่ปัจจุบัน",
        custom_date: "วันที่กำหนดเอง",
        ref_date: "อ้างอิงจากDate Pickerอื่น",
        hr: "24 ชม.",
        greater_than: "มากกว่า",
        less_than: "น้อยกว่า",
        equal: "เท่ากับ",
        greater_equal: "มากกว่าเท่ากับ",
        lesss_equal: "น้อยกว่าเท่ากับ",
        not_equal: "ไม่เท่ากับ",
        between_a_b: "ระหว่าง(A < x < B)",
        between_a_b1: "ระหว่าง(A ≤ x < B)",
        between_a_b2: "ระหว่าง(A < x ≤ B)",
        between_a_b3: "ระหว่าง(A ≤ x ≤ B)",
        nothing: "ไม่มี",
        no_setting: "ไม่เลือก",
        number_value_th: "ค่าตัวเลขธรรมดา",
        money_value: "ค่าเงิน (บาท)",
        number_value_en: "ค่าตัวเลขธรรมดา(ภาษาอังกฤษ)",
        default: "ค่าเริ่มต้น",
        no_set: "ไม่กำหนดสิทธิ์",
        no_sender: "ไม่กำหนดผู้ส่ง",
        no_define: "ไม่กำหนด",
        email: "อีเมล",
        inputbox_auto: {
          no_choose: "ไม่เลือก",
          doc_no: "หมายเลขเอกสาร",
          condition: "เงื่อนไข(ระบุ)",
          fullname_th: "ชื่อเต็ม(ไทย)",
          prefix_name_th: "คำนำหน้าชื่อ(ไทย)",
          first_name_th: "ชื่อจริง(ไทย)",
          last_name_th: "นามสกุล(ไทย)",
          tel: "เบอร์โทรศัพท์",
          ref_doc_no: "หมายเลขเอกสารอ้างอิง",
          customer_name: "ชื่อลูกค้า",
          employee_id: "รหัสพนักงาน",
          department: "แผนก/ฝ่าย",
          role: "ตำแหน่ง",
          leader_name_th: "ชื่อ-นามสกุลหัวหน้างาน",
          leader_role: "ตำแหน่งหัวหน้างาน",
          company_address: "ที่อยู่บริษัท"
        }
      }
    },
    draggingItem: {},
    focus_at_paper: false,
    show_page_select: false,
    show_property: true,
    col_paper: 9,
    col_page: 0,
    col_property: 3,
    panel: [1],
    tab: null,
    template_name: "",
    name_template_error: false,
    code_template: "",
    version_template: "0",
    error_file_name_msg: '',
    template_id: "",
    isStucture: false,
    choice: null,
    template_privacy: 'PRIVATE',
    template_type: 'TEMPLATE',
    template_status: 'ACTIVE',
    template_header: [{}],
    template_body: [{}],
    template_footer: [{}],
    header_section: { height: 0, width: 0 },
    body_section: { height: 0, width: 0 },
    footer_section: { height: 0, width: 0 },
    res_saveArray: [],
    default_height: 30,
    default_fontsize: 15,
    default_width: 100,
    template_array: [],
    template_html_array: [{}],
    objectCounter: {
      'paper':0,
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
      'calculatebox':0,
      'sectionbox':0,
      'number2textbox':0,
      'table':0,
      'autofillbox':0,
      'signbox': 0,
      'datatable':0
    },
    objectArray: {
      'paper':[],
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
      'sectionbox':[],
      'number2textbox':[],
      'table':[],
      'signbox': [],
      'datatable':[]
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
      'sectionbox',
      'number2textbox',
      'autofillbox',
      'table',
      'signbox',
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
    show_area: false,
    showProp: true,
    icon_show_property: 'mdi-chevron-triple-right',
    tips: false,
    header_section_default: 400,
    body_section_default: 830,
    footer_section_default: 400,
    selectedItem: {},
    isStructure: false,
    // font_style: [{text:'ตัวหนา', value:'b'}, {text:'ตัวเอียง', value:'i'}, {text:'ขีดเส้นใต้', value:'u'}],
    font_color_menu: false,
    font_color: '#000000',
    border_color_menu: false,
    border_color: '#000000',
    background_color_menu: false,
    border_radias_value: false,
    background_color: {'r':255,'g':255,'b':255,'a':0},
    property_date_style: [{text:'พุทธศักราช', value:'be'}, {text:'คริสต์ศักราช', value:'ce'}, {text:'พุทธศักราช(ย่อ)', value:'cbe'}],
    time_style: [{text:'AM/PM', value: 'ampm'}, {text:'24 ชม.', value: '24hr'}],
    radio_color_menu: false,
    radio_color: '#000000',
    custom_object_name: false,
    custom_object_fontsize: false,
    custom_object_font: false,
    custom_object_fontcolor: false,
    custom_object_bordercolor: false,
    custom_object_bordersize: false,
    custom_object_backgroundcolor: false,
    custom_object_boxwidth: false,
    custom_object_boxheight: false,
    custom_object_borderradias: false,
    custom_object_placholder: false,
    custom_object_row: false,
    custom_object_choices: false,
    custom_object_datestyle: false,
    custom_object_timestyle: false,
    custom_object_timeseccond: false,
    custom_object_radiocolor: false,
    custom_object_text: false,
    custom_object_databind: false,
    custom_object_mandatory: false,
    custom_object_function: false,
    custom_object_isnumber: false,
    custom_object_permission:false,
    custom_object_hidesection:false,
    custom_object_suffix:false,
    custom_object_rowcount:false,
    custom_object_colcount:false,
    custom_object_colsetting:false,
    custom_object_rowsetting:false,
    custom_object_excel:false,
    custom_object_linecolor: false,
    custom_object_linesize: false,
    custom_object_lineside: false,
    custom_object_decimal: false,
    custom_object_defaultvalue: false,
    custom_object_datatablesetting:false,
    custom_object_cellname: false,
    custom_object_celltype: false,
    custom_object_align: false,
    custom_object_textareavaliable:false,
    custom_object_addtable: false,
    custom_object_refpermission: false,
    custom_object_refvalue: false,
    custom_object_n2tdecimal: false,
    custom_object_fixedValue: false,
    custom_cell_text: false,
    custom_cell_fontsize: false,
    custom_cell_font: false,
    custom_cell_fontcolor: false,
    custom_cell_placholder: false,
    custom_cell_choices: false,
    custom_cell_databind: false,
    custom_cell_timestyle: false,
    custom_cell_timeseccond: false,
    custom_cell_mandatory: false,
    custom_cell_isnumber: false,
    custom_cell_decimal: false,
    custom_cell_defaultvalue: false,
    custom_cell_excel: false,
    custom_cell_suffix: false,
    custom_cell_permission: false,
    custom_cell_datestyle: false,
    custom_cell_function: false,
    custom_cell_nodata: false,
    help_message: "",
    hidesection: true,
    grid_size: 10,
    paper_grid: false,
    middle_grid: false,
    row_count: 0,
    row_style: "",
    col_count: 0,
    col_style: "",
    databind_choice: [],
    selected_array: 'paper',
    selected_object: 0,
    import_image: '',
    plane_body_col: 5,
    business: {first_name_th:"เฉพาะฉัน"},
    notReady: true,
    paper_size: [{text:"A4", width:1190, height:1666, value:0}],
    current_paper_width: 1190,
    current_paper_height : 1666,
    property_block_size: 0,
    ppl_templatelist: [],
    selected_ppltemplate: "",
    template_side: "PORTRAIT",
    help: false,
    roles: [],
    sender_roles: [],
    zoom_level: 100,
    order_permission: [],
    all_permission: [],
    step_choices: [{text: "ผู้ส่งเอกสาร", value: ""}],
    colsize:0,
    rowsize:0,
    note_paperless: "",
    logic_fx: [{text:"มากกว่า",value:"gt"},{text:"น้อยกว่า",value:"lt"},{text:"เท่ากับ",value:"eq"},
              {text:"มากกว่าเท่ากับ",value:"gte"},{text:"น้อยกว่าเท่ากับ",value:"lte"},{text:"ไม่เท่ากับ",value:"neq"},
              {text:"ระหว่าง(A < x < B)",value:"bet"},{text:"ระหว่าง(A ≤ x < B)",value:"betle"},{text:"ระหว่าง(A < x ≤ B)",value:"betge"},
              {text:"ระหว่าง(A ≤ x ≤ B)",value:"beteq"},{text:"ไม่มี",value:""}],
    betValue: false,
    copyObject: "",
    pasted: false,
    allPplTemaplates: [],
    documentTypes:[],
    selectedDocumentType:"",
    currentPage: 1,
    pages:[],
    isSetPosition: true,
    step_sender: {byRole:true, value_role: [], value_email: [], isEditable:true, ref: ""},
    senderRef: [],
    dataTableObjectArray: {},
    selectedCell: "",
    textAreaValiable: "",
    allPermissionSection: [],
    eformDocTypes: [{text:'ไม่เลือก', value: '',  type: ''}],
    selectedEformDocType: "",
    number2textDecimalType: [{text:'ค่าตัวเลขธรรมดา', value: ''}, {text:'ค่าเงิน (บาท)', value: 'thb'}, {text:'ค่าตัวเลขธรรมดา(ภาษาอังกฤษ)', value: 'en'}],
    selectedPermRole: "",
    selectedPermEmail: "",
    prefix_code: "",
    prefixType: "CUSTOM",
    prefixPattern: "",
    prefixPatternList: [{text:'ไม่เลือก', value: ''},{text:'YYYYMM', value: 'YYYY/MM'},
                      {text:'YYMM', value: 'YY/MM'},{text:'YYYY', value: 'YYYY'}],
    prefixDigit: 6,
    prefixDigitList: [1,2,3,4,5,6,7,8,9],
    selectedCheckGroup: "",
    keepPage: 1,
    checkObejctName: false,
    dialogImageUpload:false,
    uploadImage: [],
    dialogObjectRole: false,
    selectedObjectRole: "",
    allObjectRoles: [],
    deleteTempList: [],
    document_level: [{text:'แบบฟอร์มที่ใช้ภายนอก', value: 'outer'},{text:'แบบฟอร์มที่ใช้ภายใน', value: 'inner'},{text:'แบบฟอร์มชั้นความลับ', value: 'secret'}],
    step_api_send: [],
    menu_date_force: false,
    roleNameList: [],
    departments: [],
    docDepartment: "",
    docLevel: [],
    docUseDate: new Date().toISOString().substr(0, 10),
    selectedObjectEmail: "",
    allObjectEmails: [],
    selectedObjectGroup: [],
    mergeTemplate: {},
    addOnArray: [],
    refOrders: [],
    datatableRoleCell: [],
    cellObjectTypes: [{text:'ค่าเริ่มต้น', value:'linkdatabox'}, {text:'Text Field', value:'textfield'}, {text:'Input Box', value:'inputbox'}, 
      {text:'Dropdown Box', value:'dropdownbox'}, {text:'Datepicker Box', value:'datepickerbox'},{text:'Time Box', value:'timebox'}, {text:'Check Box', value:'checkbox'}, {text:'Calculate Box', value:'calculatebox'}, {text:'Image Box', value:'inputimagebox'}],
    step_can_see: [],
    webhookUrl: [{
      service: "",
      api: "",
      sendStep: []
    }],
    accessRole: [],
    isPublicForm: false,
    orderMessage: [],
    autoChoices: [{text:'จังหวัด', value: 'pro_th'},{text:'เขต/อำเภอ', value: 'dis_th'},{text:'แขวง/ตำบล', value: 'subdis_th'},{text:'รหัสไปรษณีย์ (Post Code)', value: 'post'},
                  {text:'Provinces', value: 'pro_en'},{text:'District(Amphure)', value: 'dis_en'},{text:'Sub District(Tumbon)', value: 'subdis_en'},{text:'CVM ID', value: 'cvm_id'},{text:'SO No.', value: 'so'},{text: 'Customer ID', value: 'cus_id'},{text: 'Invoice No.', value: 'invoice'}],
    selectedEmailCenter: "",
    caStep: false,
    show_mobile: [],
    moreObjectMobile: [{text:'Input Box', value:'input_box'}, {text:'Text Area', value:'text_area_box'}, {text:'Dropdown Input', value:'dropdown_box'}, {text:'Date Picker', value:'datepicker_box'}, {text:'Time Picker', value:'time_box'}, {text:'Check Box', value:'check_box'}, {text:'Image Box', value:'input_image_box'},],
    defaultDatePicker: [{text: 'วันที่ปัจจุบัน', value: ''}, {text: 'วันที่กำหนดเอง', value: 'custom'}, {text: 'อ้างอิงจากDate Pickerอื่น', value: 'ref_date'}],
    menu_date_default: false,
    startDateTypes: [{text: 'ไม่กำหนด', value: ""},{text: 'วันที่ปัจจุบัน', value: "current"},{text: 'วันที่กำหนดเอง', value: "custom"}],
    selectedObjMob: "",
    mobileInputOrder: [],
    othersService: [],
    autofillboxLeaders: [],
    paperless_data: {
      email_center:[],
      time_expire:{status:false, data_ex:{}},
      option_page:{
        subject_text:"",
        service_properties: "",
        body_text: ""
      }
    },
    paperSizeIndex: 0,
    menu_date_start: false,
    docOption: {
      nextTemplates: [],
      viewers: [],
      isPdfLock: false
    },
    addViewer: "",
    cellHideSetting: false,
    AlphabetType: [{text: 'ไม่กำหนด', value: ""},{text: 'ตัวอักษรพิมพ์ใหญ่', value: "UpperCase"},{text: 'ตัวอักษรพิมพ์เล็ก', value: "LowwerCase"}],
    allEformList: [],
    TextType: [{text: 'ไม่กำหนด', value: ""},{text: 'อีเมล', value: "Email"}],
    currentSelectedFlow: {},
    //Color Variable
    // color_dialog_header_bg: '#2ACA9F', //class dialog_title in DeleteModal.vue
    // color_dropdown_icon: '#1b9900 !important', //class dropdown-icon-color in Toolbar.vue
    // color_loading: '#1b9900', //class lds-roller in App.vue
    color_loading_bar_bg: '#C2EB81',
    color_loading_bar: '#1b9900',
    color_image: '#2ACA9F',
    color_imageUpload: '#2ACA9F',
    color_set_position: '#2ACA9F',
    color_set_email: '#2ACA9F',
    color_icon_expand: '#2ACA9F',
    color_autocomplete: '#97E2E7',
    color_text_field: '#97E2E7',
    color_save: '#2ACA9F',
    color_chip: '#97E2E7',
    color_choice: '#2ACA9F',
    color_chevron_left: '#1b9900',
    color_confirm_save: '#1b9900',
    color_document_format: '#1b9900',
    color_varidate_button: '#C2EB81',
    color_tools_creating: '#1b9900',
    color_property_Object: '#1b9900',
    color_all_permission: '#1b9900',
    color_forbiden_email_chip: '#1b9900',
    color_mail_view_all: '#1b9900',
    color_seting_paperless: '#1b9900',
    color_mini_page: '#4CAF50', //function show_page_select
    color_checkbox_not_show_mobile: '#1b9900',
    color_question_box: '#1b9900',
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
    }
  }),
  beforeDestroy() {
    this.selected_array = null
    this.selected_object = null
    EventBus.$off('changeBiz')
    EventBus.$off('sendToSaveTemp')
    EventBus.$off('saveDataTable')
    EventBus.$off('saveDropDown')
    EventBus.$off('logicString')
    EventBus.$off('changeLang')
    EventBus.$off('saveDocCondition')
    EventBus.$off('saveFlowCondition')
  },
  mounted() {
    this.getGrid()
    this.toggleProperty()
    this.toggleProperty()
    this.getRole()
    this.getOthersService()
    this.getDepartment()
    if(sessionStorage.getItem('page_action') == 'create') {
      this.notReady = false
      this.getArea()
      // this.pplLoadTemplate() // Load Template
      this.digitalWorkflowLoad()
      this.objectType.forEach( e => {
        this.initailFirstValue(e)
      })
      this.initailFirstValue('paper')
      this.selected_array = 'paper'
      this.selected_object = 0
      this.changeBusiness()
      this.pages = [{
        index: 1,
        template_side: this.template_side,
        header_section: this.header_section,
        body_section: this.body_section,
        footer_section: this.footer_section,
        url_image: "https://www.img.in.th/images/83ca9b38ee2d7d129f1826f75ea05e4f.png"
      }]
    } else if(sessionStorage.getItem('page_action') == 'edit') {
      this.getData ()
      this.changeBusiness()
    }
    EventBus.$on('changeBiz',this.changeBusiness)
    this.digitalWorkflowLoad()
    // EventBus.$on('changeBiz',this.pplLoadTemplate)
    EventBus.$on('changeBiz',this.digitalWorkflowLoad)
    EventBus.$on('changeBiz',this.getRole)
    EventBus.$on('changeBiz',this.getDepartment)
    EventBus.$on('sendToSaveTemp',this.checkSave)
    window.addEventListener("keydown", function(ev){
      if (this.focus_at_paper == false) {
        return
      }
      if([37, 38, 39, 40].indexOf(ev.keyCode) > -1) {
        ev.preventDefault()
      }
      if([17].indexOf(ev.keyCode) > -1) {
        CrtlEventHandle = true
      } else {
        ArrowEventHandle = ev
      }
    }, true)

    window.addEventListener("keyup", function(ev){
      if (this.focus_at_paper == false) {
        return
      }
      if([37, 38, 39, 40].indexOf(ev.keyCode) > -1) {
        ev.preventDefault()
      }
      if([17].indexOf(ev.keyCode) > -1) {
        CrtlEventHandle = false
      } 
    }, true)

    window.addEventListener("keydown", this.eventKey)
    $(window).click(function(e) {
      if ($(e.target).closest("#workpaper").length == 1 || $(e.target).hasClass("img-of-obj")) {
        this.focus_at_paper = true
      }
      else{
        this.focus_at_paper = false
      }
    })
    this.getAllTempName()
    EventBus.$on('saveDataTable',this.getDataTable)
    EventBus.$on('saveDropDown', this.getDropDownChoiceSet)
    EventBus.$on('logicString', this.setLogicString)
    EventBus.$on('changeLang', this.changeLange)
    EventBus.$on('saveDocCondition', this.saveDocCondition)
    EventBus.$on('saveFlowCondition', this.saveFlowCondition)
    this.changeLange()
  },
  watch: {
    sleep(val) {
      if (!val) return;
      setTimeout(() => ((this.sleep = false), this.setPosition()), 500);
      setTimeout(() => ((this.sleep = false), this.getArea()), 500);
    },
    show_area(val) {
      setTimeout(() => ((this.sleep = false), this.showArea(val)), 500);
    },
    border_color_menu(val) {
      this.change_bordercolor()
    },
    border_radias_value(val) {
      this.change_borderradias()
    },
    template_name(val) {
      if(val == '') {
        this.name_template_error = true
        this.error_file_name_msg = this.textLang.set_format_form.please_fill_in
      } else {
        this.name_template_error = false
        this.error_file_name_msg = ''
      }
    },
    hidesection() {
      this.change_hidesection()
    },
    font_color_menu() {
      this.change_fontcolor()
    },
    paperSizeIndex() {
      if(this.template_side == 'PORTRAIT') {
        this.current_paper_width = this.paper_size[this.paperSizeIndex].width
        this.current_paper_height = this.paper_size[this.paperSizeIndex].height
      } else if (this.template_side == 'LANDSCAPE') {
        this.current_paper_width = this.paper_size[this.paperSizeIndex].height
        this.current_paper_height = this.paper_size[this.paperSizeIndex].width-50
      }
      this.getGrid()
    },
    template_side(val) {
      if(val == 'PORTRAIT') {
        this.current_paper_width = this.paper_size[this.paperSizeIndex].width
        this.current_paper_height = this.paper_size[this.paperSizeIndex].height
      } else if (val == 'LANDSCAPE') {
        this.current_paper_width = this.paper_size[this.paperSizeIndex].height
        this.current_paper_height = this.paper_size[this.paperSizeIndex].width-50
      }
      this.getGrid()
    },
    colsize(val) {
      this.objectArray[this.selected_array][this.selected_object].style.table.colsize.forEach(e => {
        e.size = val
      })
      this.calColSize()
    },
    rowsize(val) {
      this.objectArray[this.selected_array][this.selected_object].style.table.rowsize.forEach(e => {
        e.size = val
      })
    },
    selectedDocumentType() {
      this.getPplTemplate()
    },
    selectedEformDocType(val) {
      if(this.prefixType == "DOCTYPE") {
        this.prefix_code = this.eformDocTypes.find(type => {if (type.value == val) {return type }}).type
      }
    },
    prefixType(val) {
      if(val == "DOCTYPE") {
         this.prefix_code = this.eformDocTypes.find(type => {if (type.value == this.selectedEformDocType) {return type }}).type
      }
    },
    show_page_select(val) {
      if(val) {
        $('#mini-page' + this.currentPage).css("outline-color", this.color_mini_page)
        $('#mini-page' + this.currentPage).css("outline-style", "solid")
      }
    },
    isPublicForm(val) {
      if(val) {
        this.accessRole = []
      }
    },
    grid_size(val) {
      if(val) {
        this.getGrid()
      }
    }
  },
  methods: {
    changeColor() {
      this.colorObject = JSON.parse(sessionStorage.getItem('biz_theme'))
      this.color_loading_bar_bg = this.colorObject.toolbar.toolbar_bg_color1
      this.color_loading_bar = this.colorObject.main_color
      this.color_image = this.colorObject.modal.modal_main_color
      this.color_imageUpload = this.colorObject.modal.modal_main_color
      this.color_set_position = this.colorObject.modal.modal_main_color
      this.color_set_email = this.colorObject.modal.modal_main_color
      this.color_icon_expand = this.colorObject.modal.modal_main_color
      this.color_autocomplete = this.colorObject.modal.modal_sub_color
      this.color_text_field = this.colorObject.modal.modal_sub_color
      this.color_save = this.colorObject.modal.modal_main_color
      this.color_chip = this.colorObject.modal.modal_sub_color
      this.color_choice = this.colorObject.modal.modal_main_color
      this.color_chevron_left = this.colorObject.main_color
      this.color_confirm_save = this.colorObject.main_color
      this.color_document_format = this.colorObject.main_color
      this.color_varidate_button = this.colorObject.toolbar.toolbar_bg_color1
      this.color_tools_creating = this.colorObject.main_color
      this.color_property_Object = this.colorObject.main_color
      this.color_all_permission = this.colorObject.main_color
      this.color_forbiden_email_chip = this.colorObject.main_color
      this.color_mail_view_all = this.colorObject.main_color
      this.color_seting_paperless = this.colorObject.main_color
      this.color_mini_page = this.colorObject.main_color
      this.color_checkbox_not_show_mobile = this.colorObject.main_color
      this.color_question_box = this.colorObject.main_color 
    },
    changeLange() {
      if(sessionStorage.getItem('page_lang') == 'th') {
        var lang_th = require('@/components/lauguage/lang_th.json')
        this.textLang = lang_th.Create_Template
        this.property_date_style[0].text = lang_th.Create_Template.dropdown.buddhist
        this.property_date_style[1].text = lang_th.Create_Template.dropdown.anno
        this.property_date_style[2].text = lang_th.Create_Template.dropdown.buddhist_era
        this.defaultDatePicker[0].text = lang_th.Create_Template.dropdown.present_date
        this.defaultDatePicker[1].text = lang_th.Create_Template.dropdown.custom_date
        this.defaultDatePicker[2].text = lang_th.Create_Template.dropdown.ref_date
        this.startDateTypes[0].text = lang_th.Create_Template.dropdown.no_define
        this.startDateTypes[1].text = lang_th.Create_Template.dropdown.present_date
        this.startDateTypes[2].text = lang_th.Create_Template.dropdown.custom_date
        this.time_style[1].text = lang_th.Create_Template.dropdown.hr
        this.logic_fx[0].text = lang_th.Create_Template.dropdown.greater_than
        this.logic_fx[1].text = lang_th.Create_Template.dropdown.less_than
        this.logic_fx[2].text = lang_th.Create_Template.dropdown.equal
        this.logic_fx[3].text = lang_th.Create_Template.dropdown.greater_equal
        this.logic_fx[4].text = lang_th.Create_Template.dropdown.lesss_equal
        this.logic_fx[5].text = lang_th.Create_Template.dropdown.not_equal
        this.logic_fx[6].text = lang_th.Create_Template.dropdown.between_a_b
        this.logic_fx[7].text = lang_th.Create_Template.dropdown.between_a_b1
        this.logic_fx[8].text = lang_th.Create_Template.dropdown.between_a_b2
        this.logic_fx[9].text = lang_th.Create_Template.dropdown.between_a_b
        this.logic_fx[10].text = lang_th.Create_Template.dropdown.nothing
        this.eformDocTypes[0].text = lang_th.Create_Template.dropdown.no_setting
        this.number2textDecimalType[0].text = lang_th.Create_Template.dropdown.number_value_th
        this.number2textDecimalType[1].text = lang_th.Create_Template.dropdown.money_value
        this.number2textDecimalType[2].text = lang_th.Create_Template.dropdown.number_value_en
        this.prefixPatternList[0].text = lang_th.Create_Template.dropdown.no_setting
        this.cellObjectTypes[0].text = lang_th.Create_Template.dropdown.default
        this.AlphabetType[0].text = lang_th.Create_Template.dropdown.no_define
        this.AlphabetType[1].text = lang_th.Create_Template.property_type.upper_case
        this.AlphabetType[2].text = lang_th.Create_Template.property_type.lowwer_case
        this.TextType[0].text = lang_th.Create_Template.dropdown.no_define
        this.TextType[1].text = lang_th.Create_Template.dropdown.email
        if(this.selected_array == 'textfield'){
          this.help_message = lang_th.Create_Template.tips_help_message.box_displaying
        }else if(this.selected_array == 'inputbox'){
          this.help_message = lang_th.Create_Template.tips_help_message.box_filling
        }else if(this.selected_array == 'rectangle'){
          this.help_message = lang_th.Create_Template.tips_help_message.square_box
        }else if(this.selected_array == 'textareabox'){
          this.help_message = lang_th.Create_Template.tips_help_message.box_information
        }else if(this.selected_array == 'texteditorbox'){
          this.help_message = lang_th.Create_Template.tips_help_message.box_information_editor
        }else if(this.selected_array == 'datepickerbox'){
          this.help_message = lang_th.Create_Template.tips_help_message.box_selecting
        }else if(this.selected_array == 'timebox'){
          this.help_message = lang_th.Create_Template.tips_help_message.box_for_selecting
        }else if(this.selected_array == 'checkbox'){
          this.help_message = lang_th.Create_Template.tips_help_message.check_box
        }else if(this.selected_array == 'imagebox'){
          this.help_message = lang_th.Create_Template.tips_help_message.pictures
        }else if(this.selected_array == 'dropdownbox'){
          this.help_message = lang_th.Create_Template.tips_help_message.box_selecting_one
        }else if(this.selected_array == 'autofillbox'){
          this.help_message = lang_th.Create_Template.tips_help_message.automatic
        }else if(this.selected_array == 'calculatebox'){
          this.help_message = lang_th.Create_Template.tips_help_message.box_show
        }else if(this.selected_array == 'number2textbox'){
          this.help_message = lang_th.Create_Template.tips_help_message.box_show_thai
        }else if(this.selected_array == 'sectionbox'){
          this.help_message = lang_th.Create_Template.tips_help_message.scope_box
        }else if(this.selected_array == 'datatable'){
          this.help_message = lang_th.Create_Template.tips_help_message.displaying
        }else if(this.selected_array == 'table'){
          this.help_message = lang_th.Create_Template.tips_help_message.consists
        }else if(this.selected_array == 'line'){
          this.help_message = lang_th.Create_Template.tips_help_message.straight
        }else if(this.selected_array == 'signbox'){
          this.help_message = lang_th.Create_Template.tips_help_message.area_displaying
        }else if(this.selected_array == 'inputimagebox'){
          this.help_message = lang_th.Create_Template.tips_help_message.picture_box
        }   
      } else if(sessionStorage.getItem('page_lang') == 'en') {
        var lang_en = require('@/components/lauguage/lang_en.json')
        this.textLang = lang_en.Create_Template
        this.property_date_style[0].text = lang_en.Create_Template.dropdown.buddhist
        this.property_date_style[1].text = lang_en.Create_Template.dropdown.anno
        this.property_date_style[2].text = lang_en.Create_Template.dropdown.buddhist_era
        this.defaultDatePicker[0].text = lang_en.Create_Template.dropdown.present_date
        this.defaultDatePicker[1].text = lang_en.Create_Template.dropdown.custom_date
        this.defaultDatePicker[2].text = lang_en.Create_Template.dropdown.ref_date
        this.startDateTypes[0].text = lang_en.Create_Template.dropdown.no_define
        this.startDateTypes[1].text = lang_en.Create_Template.dropdown.present_date
        this.startDateTypes[2].text = lang_en.Create_Template.dropdown.custom_date
        this.time_style[1].text = lang_en.Create_Template.dropdown.hr
        this.logic_fx[0].text = lang_en.Create_Template.dropdown.greater_than
        this.logic_fx[1].text = lang_en.Create_Template.dropdown.less_than
        this.logic_fx[2].text = lang_en.Create_Template.dropdown.equal
        this.logic_fx[3].text = lang_en.Create_Template.dropdown.greater_equal
        this.logic_fx[4].text = lang_en.Create_Template.dropdown.lesss_equal
        this.logic_fx[5].text = lang_en.Create_Template.dropdown.not_equal
        this.logic_fx[6].text = lang_en.Create_Template.dropdown.between_a_b
        this.logic_fx[7].text = lang_en.Create_Template.dropdown.between_a_b1
        this.logic_fx[8].text = lang_en.Create_Template.dropdown.between_a_b2
        this.logic_fx[9].text = lang_en.Create_Template.dropdown.between_a_b
        this.logic_fx[10].text = lang_en.Create_Template.dropdown.nothing
        this.eformDocTypes[0].text = lang_en.Create_Template.dropdown.no_setting
        this.number2textDecimalType[0].text = lang_en.Create_Template.dropdown.number_value_th
        this.number2textDecimalType[1].text = lang_en.Create_Template.dropdown.money_value
        this.number2textDecimalType[2].text = lang_en.Create_Template.dropdown.number_value_en
        this.prefixPatternList[0].text = lang_en.Create_Template.dropdown.no_setting
        this.cellObjectTypes[0].text = lang_en.Create_Template.dropdown.default
        this.AlphabetType[0].text = lang_en.Create_Template.dropdown.no_define
        this.AlphabetType[1].text = lang_en.Create_Template.property_type.upper_case
        this.AlphabetType[2].text = lang_en.Create_Template.property_type.lowwer_case
        this.TextType[0].text = lang_en.Create_Template.dropdown.no_define
        this.TextType[1].text = lang_en.Create_Template.dropdown.email
        if(this.selected_array == 'textfield'){
          this.help_message = lang_en.Create_Template.tips_help_message.box_displaying
        }else if(this.selected_array == 'inputbox'){
          this.help_message = lang_en.Create_Template.tips_help_message.box_filling
        }else if(this.selected_array == 'rectangle'){
          this.help_message = lang_en.Create_Template.tips_help_message.square_box
        }else if(this.selected_array == 'textareabox'){
          this.help_message = lang_en.Create_Template.tips_help_message.box_information
        }else if(this.selected_array == 'texteditorbox'){
          this.help_message = lang_en.Create_Template.tips_help_message.box_information_editor
        }else if(this.selected_array == 'datepickerbox'){
          this.help_message = lang_en.Create_Template.tips_help_message.box_selecting
        }else if(this.selected_array == 'timebox'){
          this.help_message = lang_en.Create_Template.tips_help_message.box_for_selecting
        }else if(this.selected_array == 'checkbox'){
          this.help_message = lang_en.Create_Template.tips_help_message.check_box
        }else if(this.selected_array == 'imagebox'){
          this.help_message = lang_en.Create_Template.tips_help_message.pictures
        }else if(this.selected_array == 'dropdownbox'){
          this.help_message = lang_en.Create_Template.tips_help_message.box_selecting_one
        }else if(this.selected_array == 'autofillbox'){
          this.help_message = lang_en.Create_Template.tips_help_message.automatic
        }else if(this.selected_array == 'calculatebox'){
          this.help_message = lang_en.Create_Template.tips_help_message.box_show
        }else if(this.selected_array == 'number2textbox'){
          this.help_message = lang_en.Create_Template.tips_help_message.box_show_thai
        }else if(this.selected_array == 'sectionbox'){
          this.help_message = lang_en.Create_Template.tips_help_message.scope_box
        }else if(this.selected_array == 'datatable'){
          this.help_message = lang_en.Create_Template.tips_help_message.displaying
        }else if(this.selected_array == 'table'){
          this.help_message = lang_en.Create_Template.tips_help_message.consists
        }else if(this.selected_array == 'line'){
          this.help_message = lang_en.Create_Template.tips_help_message.straight
        }else if(this.selected_array == 'signbox'){
          this.help_message = lang_en.Create_Template.tips_help_message.area_displaying
        }else if(this.selected_array == 'inputimagebox'){
          this.help_message = lang_en.Create_Template.tips_help_message.picture_box
        }
      }
    },
    changeSender() {
      if(this.step_sender.byRole == true) {
        this.step_sender.value_email = []
        this.step_sender.ref = ""
      } else if(this.step_sender.byRole == false) {
        this.step_sender.value_role = []
        this.step_sender.ref = ""
      } else if(this.step_sender.byRole =='ref') {
        this.step_sender.value_email = []
        this.step_sender.value_role = []
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
    addPage() {
      if(typeof this.pages === 'undefined') {
        this.pages = []
      }
      var indx = this.pages.length
      var pageObject = {
        index: indx+1,
        template_side: "PORTRAIT",
        header_section: this.header_section,
        body_section: this.body_section,
        footer_section: this.footer_section,
        url_image: "https://www.img.in.th/images/83ca9b38ee2d7d129f1826f75ea05e4f.png"
      }

      this.pages.push(pageObject)
    },
    deletePage(pnum) {
      if(this.pages.length > 1) {
        this.objectType.forEach( e=> {
          this.objectArray[e].forEach (e2 => {
            if(e2.page == pnum) {
              e2.deleted = true
              e2.show = false
            }
          })
        })
        this.objectType.forEach( e=> {
          this.objectArray[e].forEach (e2 => {
            if(e2.page > pnum) {
              e2.page -=1
            }
          })
        })
        this.pages.splice(pnum-1,1)
        for(let i=0; i<this.pages.length; i++) {
          this.pages[i].index = i+1
        }
        if(this.currentPage >= this.pages.length) {
          this.currentPage = this.pages.length
          $('#mini-page' + this.currentPage).css("outline-color", this.color_mini_page)
          $('#mini-page' + this.currentPage).css("outline-style", "solid")
        }
        this.moveToPage(this.currentPage)
      }
    },
    dragPage(minipage) {
      this.draggingItem = minipage
    },
    allowDrop:function(event) {
      event.preventDefault();
    },
    dropPage(minipage) {
      this.pageSwap(this.draggingItem.index, minipage.index) 
    },
    dropBox(minipage) {
      this.boxSwap(this.draggingItem, minipage) 
    },
    async moveToPage(pnum){
      this.selectPlain()
      var headerArea = document.getElementById('header-area')
      var headerRect = headerArea.getBoundingClientRect()
      var bodyArea = document.getElementById('body-area')
      var bodyRect = bodyArea.getBoundingClientRect()
      var footerArea = document.getElementById('footer-area')
      if(pnum != 0 && pnum <= this.pages.length) {
        this.pages[this.currentPage - 1] = {
          index: this.pages[this.currentPage - 1].index,
          template_side: this.template_side,
          header_section: {height: headerRect.height, width: 0},
          body_section: {height: bodyRect.height, width: 0},
          footer_section: {height: (this.current_paper_height - (headerRect.height + bodyRect.height)), width: 0},
          url_image: this.pages[this.currentPage - 1].url_image
        }
        this.template_side = this.pages[pnum - 1].template_side
        this.header_section = this.pages[pnum - 1].header_section
        this.body_section = this.pages[pnum - 1].body_section
        this.footer_section =  this.pages[pnum - 1].footer_section
        this.pageSectionChange()
        var exPage = this.currentPage
        $('#mini-page' + exPage).css("outline-color", "")
        $('#mini-page' + exPage).css("outline-style", "")
        this.currentPage = pnum
        $('#mini-page' + this.currentPage).css("outline-color", this.color_mini_page)
        $('#mini-page' + this.currentPage).css("outline-style", "solid")
        await this.changeIndex() 
      }
    },
    pageSectionChange() {
      var headerArea = document.getElementById('header-area')
      var footerArea = document.getElementById('footer-area')
      $("#header-area").css("height", String(this.header_section.height) + "px")
      $("#body-area").css("height", String(this.body_section.height) + "px")
      $("#footer-area").css("height", String(this.current_paper_height - (this.header_section.height + this.body_section.height)) + "px")
      headerArea.style.top = String(0) + "px"
      footerArea.style.top = String(this.header_section.height + this.body_section.height) + "px"
    },
    pageSwap(src, dest) {
      if(src < 0  || dest < 0 || dest > this.pages.length || src > this.pages.length || typeof(src)!='number' || typeof(dest)!='number'){
        throw 'invalid page index'
      }
      this.objectType.forEach(e => {
        this.objectArray[e].forEach(e2 => {
          var changed = false
          if(e2.page == src && !changed) {
            e2.page = String(dest)
            changed = true
          } else if(e2.page == dest && !changed) {
            e2.page = String(src)
          }
        })
      })
      this.moveToPage(src)
    },
    boxSwap(src, dest) {
      var srcIndex = src.index
      var destIndex = dest.index
      var srcObjIndex = this.mobileInputOrder.indexOf(src)
      var destObjIndex = this.mobileInputOrder.indexOf(dest)
      this.mobileInputOrder[srcObjIndex].index = destIndex
      this.mobileInputOrder[destObjIndex].index = srcIndex
      this.objectArray[this.mobileInputOrder[srcObjIndex].objType][this.mobileInputOrder[srcObjIndex].objIndex].style.mobileIndex = destIndex
      this.objectArray[this.mobileInputOrder[destObjIndex].objType][this.mobileInputOrder[destObjIndex].objIndex].style.mobileIndex = srcIndex
      this.mobileInputOrder.sort((a, b) => (a.index > b.index) ? 1 : -1)
      for(let i = 0; i < this.mobileInputOrder.length; i++) {
        this.mobileInputOrder[i].index = i + 1
      }
    },
    changeIndex() {
      this.objectType.forEach(e => {
        this.objectArray[e].forEach( e2 => {
          $('#' + e2.name).css("z-index", 1)
          if(e2.page == this.currentPage && e2.page != 0 && !e2.deleted) {
            e2.show = true
            if(e == 'rectangle') {
              $('#' + e2.name).css("z-index", e2.style.zIndex)
            } else if(e == 'imagebox') {
              $('#' + e2.name).css("z-index", e2.style.zIndex4)
            } else if(e == 'table' || e == 'datatable') {
              $('#' + e2.name).css("z-index", e2.style.zIndex)
            } else if(e == 'sectionbox') {
              $('#' + e2.name).css("z-index", e2.style.zIndex)
            } else if(e == 'line') {
              $('#' + e2.name).css("z-index", e2.style.zIndex)
            } else if(e == 'signbox') {
              $('#' + e2.name).css("z-index", e2.style.zIndex)
            } else {
              $('#' + e2.name).css("z-index", e2.style.zIndex)
            }           
          } else {
            $('#' + e2.name).css("z-index", 0)
            e2.show =false
          }
        })
      })
    },
    eventKey() {
      if(this.selected_array != 'paper') {
        if(CrtlEventHandle && ArrowEventHandle) {
          var element = document.getElementById(this.objectArray[this.selected_array][this.selected_object].name)
          var rect = element.getBoundingClientRect()
          var obj_id = "#" + this.objectArray[this.selected_array][this.selected_object].name
          if(ArrowEventHandle.code == "ArrowUp" && (this.selected_array == "rectangle" || this.selected_array == "line" || this.selected_array == "signbox" || this.selected_array == "inputimagebox")) {
            if(!(this.selected_array == "line" && this.objectArray[this.selected_array][this.selected_object].style.line_set == 'l')) {
              var temp_height = rect.height
              $(obj_id).css("height",String(temp_height - 1) + "px")
            }
          } else if(ArrowEventHandle.code == "ArrowDown" && (this.selected_array == "rectangle" || this.selected_array == "line" || this.selected_array == "signbox" || this.selected_array == "inputimagebox")) {
            if(!(this.selected_array == "line" && this.objectArray[this.selected_array][this.selected_object].style.line_set == 'l')) {
              var temp_height = rect.height
              $(obj_id).css("height",String(temp_height + 1) + "px")
            }
          } else if(ArrowEventHandle.code == "ArrowLeft") {
            if(!(this.selected_array == "line" && this.objectArray[this.selected_array][this.selected_object].style.line_set == 'p')) {
              var temp_width = rect.width
              $(obj_id).css("width",String(temp_width - 1) + "px")
            }
          } else if(ArrowEventHandle.code == "ArrowRight") {
            if(!(this.selected_array == "line" && this.objectArray[this.selected_array][this.selected_object].style.line_set == 'p')) {
              var temp_width = rect.width
              $(obj_id).css("width",String(temp_width + 1) + "px")
            }
          } else if(ArrowEventHandle.code == "KeyV" && this.copyObject != "") {
            this.pasteObject()
          } else if(ArrowEventHandle.code == "KeyC") {
            // if(this.selected_array != 'datatable') {
            //   this.copyObject = this.objectArray[this.selected_array][this.selected_object]
            //   this.copyObject.object_type= this.selected_array
            // }
            this.copyObject = this.objectArray[this.selected_array][this.selected_object]
            this.copyObject.object_type= this.selected_array
          } else if(ArrowEventHandle.code == "KeyZ") {
            this.undoDelete()
          } 
          ArrowEventHandle = null
        } else if(!CrtlEventHandle) {
          var work_paper = document.getElementById('workpaper')
          var paper_rect = work_paper.getBoundingClientRect()
          var element = document.getElementById(this.objectArray[this.selected_array][this.selected_object].name)
          var rect = element.getBoundingClientRect()
          if(ArrowEventHandle.code == "ArrowUp") {
            var temp_pos_top = rect.top - paper_rect.top
            element.style.top = String(temp_pos_top - 1) + "px"
          } else if(ArrowEventHandle.code == "ArrowDown") {
            var temp_pos_top = rect.top - paper_rect.top
            element.style.top = String(temp_pos_top + 1) + "px"
          } else if(ArrowEventHandle.code == "ArrowLeft") {
            var temp_pos_left = rect.left - paper_rect.left
            element.style.left = String(temp_pos_left - 1) + "px"
          } else if(ArrowEventHandle.code == "ArrowRight") {
            var temp_pos_left = rect.left - paper_rect.left
            element.style.left = String(temp_pos_left + 1) + "px"
          } else if(ArrowEventHandle.code == "Delete") {
            this.deleteObjectTemp()
          }
          ArrowEventHandle = null
        }
      } else {
        if(CrtlEventHandle && typeof ArrowEventHandle !== 'undefined' && ArrowEventHandle) {
          if(ArrowEventHandle.code == "KeyV" && this.copyObject != "") {
            this.pasteObject()
          } else if(ArrowEventHandle.code == "KeyC" && this.selected_array != 'paper') {
            // if(this.selected_array != 'datatable') {
            //   this.copyObject = this.objectArray[this.selected_array][this.selected_object]
            //   this.copyObject.object_type= this.selected_array
            // }
            this.copyObject = this.objectArray[this.selected_array][this.selected_object]
            this.copyObject.object_type= this.selected_array
          } else if(ArrowEventHandle.code == "KeyZ") {
            this.undoDelete()
          } 
          ArrowEventHandle = null
        }
      }
    },
    changeBusiness() {
      if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
        this.business = JSON.parse(sessionStorage.getItem('selected_business'))
      } else {
        this.business = {first_name_th:'เฉพาะฉัน',first_name_eng:'Private'}
      }
    },
    togglePageSelect() {
      if(this.show_page_select == true) { //to close page select
        this.show_page_select = false
        this.col_page = 0
        this.col_paper = 12 - (this.col_page + this.col_property)
      } else { //to open page select
        this.show_page_select = true
        this.col_page = 2
        this.col_paper = 12 - (this.col_page + this.col_property)
      }
    },
    toggleProperty() {
      if(this.show_property == true) { //to close property
        this.show_property = false
        this.col_property = 0
        this.col_paper = 12 - (this.col_page + this.col_property)
      } else { //to open property
        this.show_property = true
        this.col_property = 3
        this.col_paper = 12 - (this.col_page + this.col_property)
      }
    },
    async pplLoadTemplate() {
      this.documentTypes = [{text: this.textLang.dropdown.no_setting , value: ""}]
      this.ppl_templatelist = [{text: this.textLang.dropdown.no_setting , value: ""}]
      var storedDocumentType = this.$store.state.pplDocumentTypes
      storedDocumentType.forEach(e => {
        this.documentTypes.push({text: e.Document_Name.document_name, value: e.Document_Type})
      })
      this.allPplTemaplates = this.$store.state.pplDocumentTemplates
      this.getPplTemplate()
      this.getEformDoctype()
    },
    async digitalWorkflowLoad() {
      try {
        this.ppl_templatelist = [{text: this.textLang.dropdown.no_setting , value: ""}]
        var url = '/flowdata/api/v1/getAllFlow?tax_id='
        var tax_id = JSON.parse(
          sessionStorage.getItem('selected_business')
        ).id_card_num
        var { data } = await this.axios.get(this.$api_url + url + tax_id)
        if(data.message == 'success') {
          data.result.forEach(e => {
            this.ppl_templatelist.push({
              text: e.name,
              value: e._id
            })
          })
        }
      } catch(e) {
        console.log(e)
      }
    },
    getPplTemplate() {
      this.ppl_templatelist = [{text: this.textLang.dropdown.no_setting , value: ""}]
      var isNotChange = false
      this.allPplTemaplates.forEach(e => {
        if(e.Document_Type == this.selectedDocumentType) {
          this.ppl_templatelist.push({ text:e.Template_Name, value:e.Template_Code,document_type :e.Document_Type})
          if(e.Template_Code == this.selected_ppltemplate) {
            isNotChange = true
          }
        }
      })
      if(!isNotChange) {
        this.selected_ppltemplate = ""
      }
    },
    getDocumentType(code) {
      var docType = ""
      if(code) {
        this.allPplTemaplates.forEach(e => {
          if(code == e.Template_Code) {
            docType = e.Document_Type
          }
        })
      } else {
        docType = ""
      }
      return docType
    },
    async getEformDoctype() {
       try {
        var business = JSON.parse(sessionStorage.getItem('selected_business'))
        var tax_id = ""
        var username = ""
        this.eformDocTypes = [{text: this.textLang.dropdown.no_setting , value: '', type: ''}]
        var url = ""
        if(business.id) {
          tax_id = business.id_card_num
          url = '/document_type?taxid=' + tax_id
        } else {
          username = sessionStorage.getItem("oneuser")
          url = '/document_type?username=' + username
        }
        if(url) {
          var { data } = await this.axios.get(this.$eform_api + url)
          if (data.result == 'OK') {
            this.eformDocTypes = [{text: this.textLang.dropdown.no_setting , value: '', type: ''}]
            data.messageText.forEach(e => {
              this.eformDocTypes.push({text: e.documentJson.document_name, value: e.documentCode, type: e.documentType})
            })
          }
        }
      } catch (err) {
        this.notReady = false
      }
    },
    async getAllTempName() {
      try {
        var business = JSON.parse(sessionStorage.getItem('selected_business'))
        var tax_id = ""
        this.allEformList = []
        // if(business.id) {
        //   tax_id = business.id_card_num
        // } 
        
        // var { data } = await this.axios.get(this.$eform_api + "/get_temp_name_code?taxid=" + tax_id) 
        //   if (data.result == 'OK') {
        //     data.messageText.forEach(e => {
        //       this.allEformList.push({text:e.temp_name, value: e })
        //     })
        //   }
      } catch (err) {
        this.notReady = false
      }
    },
    async getOthersService() {
      this.othersService = []
       try {
      //   var url = '/others_service'
      //   if(url) {
      //     var { data } = await this.axios.get(this.$eform_api + url) 
      //     if (data.result == 'OK') {
      //       data.messageText.forEach(e => {
      //         this.othersService.push({
      //           text: e.service_name,
      //           value: e.service_id
      //         })
      //       })
      //     }
      //   }
      } catch (err) {
        this.notReady = false
      }
    },
    async getRole() {
      try {
        var business = JSON.parse(sessionStorage.getItem('selected_business'))
        var tax_id = ""
        this.roles = [{text: this.textLang.dropdown.no_set , value: ''}]
        this.sender_roles = [{text: this.textLang.dropdown.no_sender , value: ''}]
        this.roleNameList = []
        if(business.id) {
          tax_id = business.id_card_num
        } else {
          username = sessionStorage.getItem("oneuser")
        }
        if(tax_id) {
          var { data } = await this.axios.post(this.$eform_api + '/get_role',
          { 
            tax_id: tax_id
          })
          if (data.result == 'OK') {
            this.roles = [{text: this.textLang.dropdown.no_set , value: ''}]
            this.sender_roles = [{text: this.textLang.dropdown.no_sender , value: ''}]
            data.messageText[0].role.forEach(e => {
              var role = {text: e.role_name, value: e}
              this.sender_roles.push(role)
              this.roles.push(role)
              this.roleNameList.push(e.role_name)
            })
            var role = {text: 'leader-user', 
              value: {
                role_id: "Nan",
                role_level: "99",
                role_level_number: 99,
                role_name: "leader-user"
              }
            }
            this.sender_roles.push(role)
            this.roles.push(role)
          }
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
    async getDepartment() {
      try {
        var business = JSON.parse(sessionStorage.getItem('selected_business'))
        var tax_id = ""
        this.departments = [{text: this.textLang.dropdown.no_define , value: ''}]
        if(business.id) {
          tax_id = business.id_card_num
        }
        if(tax_id) {
          var { data } = await this.axios.post(this.$eform_api + '/get_department',
          { 
            tax_id: tax_id
          }) 
          if (data.result == 'OK') {
            this.departments = this.departments.concat(data.messageText[0].dept_name)
          }
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
    getArea() {
      if(sessionStorage.getItem('page_action') == 'create') {
        $("#header-area").css("width", "100%")
        $("#header-area").css("height", this.header_section_default + "px")
        $("#header-area").css("opacity",1)
        
        $("#body-area").css("width", "100%")
        $("#body-area").css("height", this.body_section_default + "px")
        $("#body-area").css("opacity",1)

        $("#footer-area").css("width", "100%")
        $("#footer-area").css("height", this.footer_section_default + "px")
        $("#footer-area").css("position", "absolute")
        $("#footer-area").css("bottom", "0")
        $("#footer-area").css("opacity",1)

      } else if(sessionStorage.getItem('page_action') == 'edit') {
        $("#header-area").css("width", "100%")
        $("#header-area").css("height", this.header_section.height + "px")
        $("#header-area").css("opacity",1)
        
        $("#body-area").css("width", "100%")
        $("#body-area").css("height", this.body_section.height + "px")
        $("#body-area").css("opacity",1)

        $("#footer-area").css("width", "100%")
        $("#footer-area").css("height", this.footer_section.height + "px")
        $("#footer-area").css("position", "absolute")
        $("#footer-area").css("bottom", "0")
        $("#footer-area").css("opacity",1)
      }
    },
    showArea(val) {
      if(val) {
        $("#header-area").css("border-bottom","2px dashed lightgray")
        $("#header-area").resizable({
          handles: 's',
          alsoResizeReverse: "#body-area",
          minHeight: 5,
          maxHeight: this.current_paper_height
        })
        $("#footer-area").css("border-top","2px dashed lightgray")
        $("#footer-area").resizable({
          handles: 'n',
          alsoResizeReverse: "#body-area",
          minHeight: 5,
          maxHeight: this.current_paper_height
          })
      } else {
        $("#header-area").css("border-bottom","2px dashed white")
        $("#header-area").resizable('destroy')
        $("#footer-area").css("border-top","2px dashed white")
        $("#footer-area").resizable('destroy')
      }
    },
    getData() {
      this.option = JSON.parse(sessionStorage.getItem('option'))
      this.template_id = this.option.template_id
      this.getTemplate(this.option.template_id)
    },
    async getTemplate(template_id) {
      var template = {}
      try {
        var { data } = await this.axios.get(this.$api_url + '/template_form/api/v1/getTemplateFormById?template_id=' + template_id)
        template = data.data
        this.template_privacy = template.permission_template
        this.template_type = template.structure_template_type
        this.template_status = template.template_status
        this.code_template = template.code_template
        this.version_template = template.version_template
        this.selectedEformDocType = template.document_type_code
        this.prefix_code = template.document_detail[0].prefix
        this.prefixType = template.document_detail[0].type
        this.prefixPattern = template.document_detail[0].pattern
        this.prefixDigit = template.document_detail[0].digit
        this.selected_ppltemplate = template.flow_id
        await this.getFlowData()
        this.template_name = template.template_name
        if(template.document_option) {
          this.docOption = template.document_option
          if(typeof this.docOption['nextTemplates'] === 'undefined') {
            this.docOption['nextTemplates'] = []
          }
          if(typeof this.docOption['isPdfLock'] === 'undefined') {
            this.docOption['isPdfLock'] = false
          }
        }
        if(template.webhook.length) {
          this.webhookUrl = template.webhook
        }
        this.accessRole = template.access_role
        this.isPublicForm = template.public_template
        if(this.isStructure) {
          this.template_type = "TEMPLATE"
        }
        if(template.document_priority) {
          this.docLevel = template.document_priority
        } else {
          this.docLevel = []
        }
        if(template.department) {
          this.docDepartment = template.department
        } else {
          this.docDepartment = ""
        }
        if(template.datetime_use == "None" || !template.datetime_use) {
          this.docUseDate = new Date().toISOString().substr(0, 10)
        } else {
          this.docUseDate = template.datetime_use.substr(0, 10)
        }
        if(template.paperless_data) {
          this.paperless_data = template.paperless_data
        } 
        if(template.paper_size) {
          this.paperSizeIndex = this.paper_size.find(item => item.text.toUpperCase() == template.paper_size.toUpperCase()).value
        } 
        this.notReady = false
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
      var pageLength = template.orientation.length
      var pageChecks = []
      for(var i=0; i<pageLength; i++) {
        if(!pageChecks.includes(Object.keys(template.orientation[i])[0])) {
          pageChecks.push(Object.keys(template.orientation[i])[0])
          this.addPage()
        }
      }
      for(var i=0; i<pageLength; i++) {
        var Okey = Object.keys(template.orientation[i])[0]
        if(template.orientation[i][Okey]) {
          this.pages[Number(Okey)-1].template_side = template.orientation[i][Okey].toUpperCase()
        }
        this.pages[Number(Okey)-1].header_section = template.template_header_size[String(Okey)]
        this.pages[Number(Okey)-1].body_section = template.template_body_size[String(Okey)]
        this.pages[Number(Okey)-1].footer_section = template.template_footer_size[String(Okey)]
      }
      this.getArray(template.template_data)

      for(var i=0; i<pageLength; i++) {
        var Okey = i+1
        if(template.url_image[Okey]) {
          this.pages[Number(Okey)-1].url_image = template.url_image[Okey]
        } else {
          this.pages[Number(Okey)-1].url_image = "https://www.img.in.th/images/83ca9b38ee2d7d129f1826f75ea05e4f.png"
        }
      }
      this.template_side = this.pages[0].template_side
      this.header_section = this.pages[0].header_section 
      this.body_section = this.pages[0].body_section 
      this.footer_section = this.pages[0].footer_section 
  
      // this.getAllPermission()
      this.objectType.forEach( e => {
        this.formatObjectId(e)
      })
      this.sleep = true
    },
    getArray(temp_array) {
      temp_array.forEach(e => {
        if(typeof e.page === "undefined") {
          e.page = 1
        }
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
            section: e.section,
            excel: e.excel,
            page: e.page
          }
          if(cmp.style) {
            if(typeof cmp.style.permission_step === "undefined") {
              cmp.style.permission_step = ""
            }
            if(!cmp.style.permission) {
              cmp.style.permission =  {byRole:true, value_role:[], value_email:[]}
            }
            if(typeof cmp.style.permission.value_email == 'string') {
              var emailArr = []
              emailArr.push(cmp.style.permission.value_email)
              cmp.style.permission.value_email = emailArr
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
            if(!e.style.json_key) {
              cmp.style.json_key = cmp.object_name
            }
            if(!e.style.isZero) {
              cmp.style.isZero = false
            }
            if(!e.style.hideOption) {
              cmp.style.hideOption = ""
            }
            if(!e.style.role_id) {
              cmp.style.role_id = []
            }
            if(!e.style.email_report) {
              cmp.style.email_report = []
            }
            if(typeof e.style.textAreaValiable === 'undefined') {
              cmp.style.textAreaValiable =[]
            }
            if(typeof e.style.checkBoxGroup === 'undefined') {
              cmp.style.checkBoxGroup =[]
            }
            if(!cmp.style.permission)  {
              cmp.style.permission = ""
              cmp.style.permission_section = ""
            }
          }
         
          if(e.object_type != "dataTableObjectArray") {
            cmp.style = this.fixObjectStyle(cmp.style)
          }
          if(e.object_type == "dataTableObjectArray") {
            this.dataTableObjectArray = e.value
          } else {
            if(e.object_type == 'datatable') {
              if(!this.objectArray[e.object_type].some(obj => obj.object_name == e.object_name)){
                this.objectArray[e.object_type].push(cmp)
              } 
            } else {
              this.objectArray[e.object_type].push(cmp)
            }
          }
      })
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
      if(style.noCellData == 'False') {
        style.noCellData = false
      }
      if(style.isCellTextField == 'False') {
        style.isCellTextField = false
      }
      if(style.isZero == "False") {
        style.isZero = false
      }

      return style
    },
    getGrid() {
      this.row_count = Math.floor(this.current_paper_height/this.grid_size)
      this.col_count = Math.floor(this.current_paper_width/this.grid_size)
      this.row_style = "margin-top:" + String(this.grid_size - 1) + "px;"
      this.col_style = "margin-left:" + String(this.grid_size - 1) + "px;"
    },
    setPosition() {
      this.isSetPosition = true
      this.initailFirstValue('paper')
      this.objectArray["textfield"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        this.selectObject(e, "textfield")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index", e.style.zIndex)
          e.show = true
        }
      })
      this.objectArray["inputbox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("color","white")
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        if(typeof e.style.decimalShow === 'undefined') {
          e.style.decimalShow =  e.style.decimal
        }
        if(e.value == 'None') {
          e.value = ""
        }
        this.selectObject(e, "inputbox")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
        var mIndex = this.mobileInputOrder.length + 1
        if(e.style.mobileIndex) {
          mIndex = e.style.mobileIndex
        } else {
          e.style.mobileIndex = mIndex
        }
        var mobileOrder = {
          index: mIndex,
          objType: "inputbox",
          objIndex: this.objectArray["inputbox"].indexOf(e)
        }
        this.mobileInputOrder.push(mobileOrder)
      })
      this.objectArray["rectangle"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name + '-box').css("height", '100%')
        $("#" + e.name + '-box').css("width", '100%')
        $("#" + e.name + '-box').css("border", "1px solid black")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        e.style.border_radias = false
        this.border_radias_value = e.style.border_radias
        this.selectObject(e, "rectangle")
        this.change_bordersize()
        this.change_backgroundcolor()
        this.change_bordercolor()
        this.change_borderradias()
        if(!e.style.zIndex) {
          e.style.zIndex = 2
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })
      this.objectArray["line"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        this.selectObject(e, "line")
        this.change_lineside()
        this.change_linesize()
        if(!e.style.zIndex) {
          e.style.zIndex = 4
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })
      this.objectArray["textareabox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        if(e.value == 'None') {
          e.value = ""
        }
        this.selectObject(e, "textareabox")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
        var mIndex = this.mobileInputOrder.length + 1
        if(e.style.mobileIndex) {
          mIndex = e.style.mobileIndex
        } else {
          e.style.mobileIndex = mIndex
        }
        var mobileOrder = {
          index: mIndex,
          objType: "textareabox",
          objIndex: this.objectArray["textareabox"].indexOf(e)
        }
        this.mobileInputOrder.push(mobileOrder)
      })
      this.objectArray["texteditorbox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        if(e.value == 'None') {
          e.value = ""
        }
        this.selectObject(e, "texteditorbox")
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
        var mIndex = this.mobileInputOrder.length + 1
        if(e.style.mobileIndex) {
          mIndex = e.style.mobileIndex
        } else {
          e.style.mobileIndex = mIndex
        }
        var mobileOrder = {
          index: mIndex,
          objType: "texteditorbox",
          objIndex: this.objectArray["texteditorbox"].indexOf(e)
        }
        this.mobileInputOrder.push(mobileOrder)
      })
      this.objectArray["dropdownbox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        $("#" + e.name + " div:first div:first").addClass(e.name + '-box') //add class of box height
        $("#" + e.name + " div:first div:first").addClass(e.name + '-icon') //add class of arrow down box height
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        if(e.value == 'None') {
          e.value = ""
        }
        if(typeof e.style.decimalShow === 'undefined') {
          e.style.decimalShow =  e.style.decimal
        }
        this.selectObject(e, "dropdownbox")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        $("<style type=\"text/css\">.v-text-field--outlined." + e.name + "-box > .v-input__control > .v-input__slot {font-size: " + e.style.font_size + "px; min-height: " + e.style.font_size + "px; max-height: " + (Number(e.style.font_size) + 6) + "px;}</style>").appendTo("head")
        $("<style type=\"text/css\">." + e.name + "-icon .v-input__icon {max-height: " + (Number(e.style.font_size) + 6) + "px;}</style>").appendTo("head")
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
        var mIndex = this.mobileInputOrder.length + 1
        if(e.style.mobileIndex) {
          mIndex = e.style.mobileIndex
        } else {
          e.style.mobileIndex = mIndex
        }
        var mobileOrder = {
          index: mIndex,
          objType: "dropdownbox",
          objIndex: this.objectArray["dropdownbox"].indexOf(e)
        }
        this.mobileInputOrder.push(mobileOrder)
      })

      this.objectArray["datepickerbox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        e.value = new Date().toISOString().substr(0, 10)
        this.selectObject(e, "datepickerbox")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        this.change_dateformat()
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
        var mIndex = this.mobileInputOrder.length + 1
        if(e.style.mobileIndex) {
          mIndex = e.style.mobileIndex
        } else {
          e.style.mobileIndex = mIndex
        }
        var mobileOrder = {
          index: mIndex,
          objType: "datepickerbox",
          objIndex: this.objectArray["datepickerbox"].indexOf(e)
        }
        this.mobileInputOrder.push(mobileOrder)
      })

      this.objectArray["timebox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        if(e.value == 'None') {
          e.value = ""
        }
        this.selectObject(e, "timebox")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
        var mIndex = this.mobileInputOrder.length + 1
        if(e.style.mobileIndex) {
          mIndex = e.style.mobileIndex
        } else {
          e.style.mobileIndex = mIndex
        }
        var mobileOrder = {
          index: mIndex,
          objType: "timebox",
          objIndex: this.objectArray["timebox"].indexOf(e)
        }
        this.mobileInputOrder.push(mobileOrder)
      })

      this.objectArray["checkbox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("height","auto")
        $("#" + e.name + '-input').css("border", "1px dashed lightgrey")
        $("#" + e.name).css("text-align", "left")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        e.value = false
        this.selectObject(e, "checkbox")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
        var mIndex = this.mobileInputOrder.length + 1
        if(e.style.mobileIndex) {
          mIndex = e.style.mobileIndex
        } else {
          e.style.mobileIndex = mIndex
        }
        var mobileOrder = {
          index: mIndex,
          objType: "checkbox",
          objIndex: this.objectArray["checkbox"].indexOf(e)
        }
        this.mobileInputOrder.push(mobileOrder)
      })

      this.objectArray["imagebox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        if(!e.style.zIndex) {
          e.style.zIndex = 3
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })

      this.objectArray["autofillbox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("color","white")
        // $("#" + e.name).css("text-align", "center")
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        e.value = e.value.show
        if(typeof e.style.decimalShow === 'undefined') {
          e.style.decimalShow =  e.style.decimal
        }
        this.selectObject(e, "autofillbox")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })

      this.objectArray["calculatebox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("color","white")
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        this.selectObject(e, "calculatebox")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(typeof e.style.decimalShow === 'undefined') {
          e.style.decimalShow =  e.style.decimal
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })

      this.objectArray["sectionbox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name + '-section-box').css("width", 'auto')
        $("#" + e.name + '-section-box').css("height", 'calc(100% - 20px)')
        $("#" + e.name + '-section-box').css("border", 'dashed 3px #7CB342')
        $("#" + e.name + '-box').css("width", '100%')
        $("#" + e.name + '-box').css("height", '100%')
        $("#" + e.name + '-box').css("border", 'dashed 1px lightgrey')
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        e.style.hidesection = true
        this.selectObject(e, "sectionbox")
        if(!e.style.zIndex) {
          e.style.zIndex = 6
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })

      this.objectArray["number2textbox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("color","white")
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        e.value = e.value.show
        this.selectObject(e, "number2textbox")
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        if(!e.style.zIndex) {
          e.style.zIndex = 5
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })

      this.objectArray["datatable"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        this.selectObject(e, "datatable")
        var dtKey = Object.keys(this.dataTableObjectArray)
        dtKey.forEach(e2 => {
          if(e2.startsWith(e.object_name)) {
            this.dataTableObjectArray[e2].name = this.dataTableObjectArray[e2].object_name
            this.dataTableObjectArray[e2].style = this.fixObjectStyle(this.dataTableObjectArray[e2].style)
            this.dataTableObjectArray[e2].page = e.page
            this.selectedCell = e2
            this.changeCellObject()
            this.change_backgroundcolor()
          }
        })
        this.change_bordersize()
        if(!e.style.zIndex) {
          e.style.zIndex = 4
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })

      this.objectArray["table"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        this.selectObject(e, "table")
        this.change_bordersize()
        if(!e.style.zIndex) {
          e.style.zIndex = 3
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })

      this.objectArray["signbox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        $("#" + e.name + '-box').css("height", '100%')
        $("#" + e.name + '-box').css("width", '100%')
        $("#" + e.name + '-box-cover').css("border", "3px dashed #2196F3")
        $("#" + e.name + '-box').css("background-color", "#64B5F6")
        $("#" + e.name + '-box').css("opacity", 0.2)
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        this.selectObject(e, "signbox")
        if(!e.style.zIndex) {
          e.style.zIndex = 4
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
      })

      this.objectArray["inputimagebox"].forEach(e => {
        $("#" + e.name).css("position", "absolute")
        $("#" + e.name).css("height", String(e.height) + "px")
        $("#" + e.name).css("width", String(e.width) + "px")
        $("#" + e.name).css("opacity",1)
        $("#" + e.name).css("display", "table-cell")
        $("#" + e.name).css("text-align", "center")
        $("#" + e.name + '-box').css("height", '100%')
        $("#" + e.name + '-box').css("width", '100%')
        $("#" + e.name + '-box-cover').css("border", "3px dashed #BDBDBD")
        $("#" + e.name + '-box').css("background-color", "grey")
        $("#" + e.name + '-box').css("opacity", 0.2)
        var element = document.getElementById(e.name)
        element.style.left = String(e.left) + "px"
        element.style.top = String(e.top) + "px"
        this.selectObject(e, "inputimagebox")
        if(!e.style.zIndex) {
          e.style.zIndex = 4
        }
        if(e.page == this.currentPage) {
          $("#" + e.name).css("z-index",  e.style.zIndex)
          e.show = true
        }
        var mIndex = this.mobileInputOrder.length + 1
        if(e.style.mobileIndex) {
          mIndex = e.style.mobileIndex
        } else {
          e.style.mobileIndex = mIndex
        }
        var mobileOrder = {
          index: mIndex,
          objType: "inputimagebox",
          objIndex: this.objectArray["inputimagebox"].indexOf(e)
        }
        this.mobileInputOrder.push(mobileOrder)
      })

      if(!this.objectArray['datatable'].length) {
        this.dataTableObjectArray = {}
      }else {
        Object.keys(this.dataTableObjectArray).forEach(e=> {
          if(typeof this.dataTableObjectArray[e].style.decimalShow === 'undefined') {
            this.dataTableObjectArray[e].style.decimalShow =  this.dataTableObjectArray[e].style.decimal
          }
          this.selectedCell = e
          this.change_fontstyle()
          if(this.objectTypeInput.includes(this.dataTableObjectArray[e].object_type)) {
            var mIndex = this.mobileInputOrder.length + 1
            if(this.dataTableObjectArray[e].style.mobileIndex) {
              mIndex = this.dataTableObjectArray[e].style.mobileIndex
            } else {
              this.dataTableObjectArray[e].style.mobileIndex = mIndex
            }
            var mobileOrder = {
              index: mIndex,
              objType: "datatable",
              objIndex: e
            }
            this.mobileInputOrder.push(mobileOrder)
          }
          })
          this.selectedCell = ""
      }

      this.objectType.forEach( e => {
        this.initailFirstValue(e)
      })
      this.isSetPosition = false
      this.mobileInputOrder.sort((a, b) => (a.index > b.index) ? 1 : -1)
      for(let i = 0; i < this.mobileInputOrder.length; i++) {
        this.mobileInputOrder.index = i+1
      }
      this.moveToPage(1)
      this.selectPlain()
    },
    formatObjectId(key) {
      var index = 0
      this.objectArray[key].forEach( e => {
        e.name = key + String(index)
        index++
      })
    },
    initailFirstValue (key) {
      this.objectCounter[key] = this.objectArray[key].length
      if(this.objectCounter[key] > 0) {
        if(key != 'datatable') {
          this.objectCounter[key] = Number(String(Math.round(Math.random()*1000)) + (this.objectCounter[key]))
        } else {
          this.objectArray[key].sort((a, b) => (Number(a.object_name.split('_')[0].split('datatable').join("")) > Number(b.object_name.split('_')[0].split('datatable').join(""))) ? 1 : -1)
          this.objectCounter[key] = Number(this.objectArray[key][this.objectArray[key].length-1].object_name.split('_')[0].split('datatable').join("")) +1
        }
      }
      var obj = {name:key + String(this.objectCounter[key]), excel: "",
        show: false, section:"header", selected: false}
      obj.object_name = obj.placeholder = obj.name
      obj.value = ""
      obj.selected = false
      obj.isPre = true
      obj.style = {
        font_size: 16, font_style: [], font_color: "#000000",
        border_size: 1, border_color: "#000000", background_color: 'rgba(255,255,255,0)', background_color_select:{'r':255,'g':255,'b':255,'a':0}, 
        border_radias: false, permission: {byRole:true, value_role:[], value_email:[], ref: ""}, permission_section: {byRole:true, value_role:[], value_email:[]}, hidesection: true,
        row: 3, date_format: 'be', image_width: 100, image_height: 100, mandatory: false, function: "", font_align:'justify', textAreaValiable: [],startDateType: "",
        number_only: false, suffix: "", table: {crow:3, ccol:3, rowsize:[{index:1,size:50},{index:2,size:50},{index:3,size:50}], colsize:[{index:1,size:200},{index:2,size:200},{index:3,size:200}]},
        validate: {value:"", fx: ""}, time: {isSec: false, isFull: "24hr"}, line_set: "p", line_focus: "0", line_style: "solid", decimal:2, isComma: false, isZero: false, refOrder:false, 
        addTable: false, refPermission: "", refValue: "", alterChoices: {}, n2tdecimal: '', json_key: obj.object_name, checkBoxGroup: [], fixedValue: false,role_id: [], email_report: [], hideOption: "", addTableUnmove: false
      }
      obj.page = 0
      if(key == 'datepickerbox') {
        obj.value = new Date().toISOString().substr(0, 10)
        obj.show_value = this.setDateFormatBE(new Date().toISOString().substr(0, 10),'be')
      }
      if(key == 'checkbox') {obj.text= obj.name}
      if(key == 'dropdownbox') {obj.choices = []}
      if(key == 'datatable') {
        this.addDataTableCell(obj.object_name, 3, 3)
      }
      this.objectArray[key].push(obj)
    },
    getObjectTypeName(objType) {
      var objectTypeName = ""
      if(objType == "textfield") {
        objectTypeName = "Text Field"
      } else if(objType == "inputbox") {
        objectTypeName = "Input Box"
      } else if(objType == "rectangle") {
        objectTypeName = "Rectangle"
      } else if(objType == "line") {
        objectTypeName = "Line"
      } else if(objType == "textareabox") {
        objectTypeName = "Textarea"
      } else if(objType == "dropdownbox") {
        objectTypeName = "Dropdown Input"
      } else if(objType == "datepickerbox") {
        objectTypeName = "Date Picker"
      } else if(objType == "timebox") {
        objectTypeName = "Time Picker"
      } else if(objType == "checkbox") {
        objectTypeName = "Check Box"
      } else if(objType == "autofillbox") {
        objectTypeName = "Input Box Auto"
      } else if(objType == "calculatebox") {
        objectTypeName = "Calculate Box"
      } else if(objType == "sectionbox") {
        objectTypeName = "Section Box"    
      } else if(objType == "number2textbox") {
        objectTypeName = "Number To Text Box"
      } else if(objType == "datatable") {
        objectTypeName = "Data Table"
      } else if(objType == "table") {
        objectTypeName = "Table"
      } else if(objType == "signbox") {
        objectTypeName = "Sign Box"
      } else if(objType == "inputimagebox") {
        objectTypeName = "Image Box"
      } else if(objType == "texteditorbox") {
        objectTypeName = "Editor Box"
      }

      return objectTypeName
    },
    addObject(object_name, hideDisplay) {
      if(this.selectedObjMob) {
        this.selectedObjMob = ""
      }
      var obj_id = ''
      var obj_prefix = ''
      var objZindex = 1
      if (object_name == 'text_field') {
        obj_prefix = 'textfield'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'e, w'})
        $(obj_id).css("height", this.default_height+ "px")
        $(obj_id).css("font-size", this.default_fontsize + "px")
        $(obj_id).css("width", this.default_width + "px")
        $(obj_id).css("z-index", 5)
        objZindex = 5

      } else if (object_name == 'input_box') {
        obj_prefix = 'inputbox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'e, w'})
        $(obj_id).css("height", this.default_height+ "px")
        $(obj_id).css("font-size", this.default_fontsize + "px")
        $(obj_id).css("width", this.default_width + "px")
        $(obj_id).css("z-index", 5)
        objZindex = 5

      } else if (object_name == 'text_area_box') {
        obj_prefix = 'textareabox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'e, w'})
        $(obj_id).css("font-size", this.default_fontsize + "px")
        $(obj_id).css("height", "84px")
        $(obj_id).css("width", '250' + "px")
        $(obj_id).css("z-index", 5)
        objZindex = 5

      } else if (object_name == 'texteditorbox') {
        obj_prefix = 'texteditorbox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'n,s,e, w'})
        $(obj_id).css("font-size", this.default_fontsize + "px")
        $(obj_id).css("height", "84px")
        $(obj_id).css("width", '250' + "px")
        $(obj_id).css("z-index", 5)
        objZindex = 5

      } else if (object_name == 'rectangle') {
        obj_prefix = 'rectangle'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'n, s, e, w'})
        $(obj_id).css("height", '500'+ "px")
        $(obj_id).css("width", '500' + "px")
        $(obj_id).css("z-index", 2)
        $(obj_id + '-box').css("height", '100%')
        $(obj_id + '-box').css("width", '100%')
        $(obj_id + '-box').css("border", "1px solid black")
        objZindex = 2
      } else if (object_name == 'line') {
        obj_prefix = 'line'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).css("height", "300px")
        $(obj_id).css("width", "21px")
        $(obj_id).resizable({handles: 'n,s'})
        $(obj_id).css("z-index", 4)
        objZindex = 4

      } else if (object_name == 'dropdown_box') {
        obj_prefix = 'dropdownbox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'e, w'})
        $(obj_id).css("height", this.default_height+ "px")
        $(obj_id).css("font-size", this.default_fontsize + "px")
        //height of dropdown box
        $(obj_id + " div:first div:first").addClass(obj_prefix + this.objectCounter[obj_prefix] + '-box')
        $("<style type=\"text/css\">.v-text-field--outlined." + obj_prefix + this.objectCounter[obj_prefix] + "-box > .v-input__control > .v-input__slot {font-size: " + this.default_fontsize + "px; min-height: " + this.default_fontsize + "px; max-height: " + (this.default_fontsize + 6) + "px;}</style>").appendTo("head")

        //position of arrow down icon
        $(obj_id + " div:first div:first").addClass(obj_prefix + this.objectCounter[obj_prefix] + '-icon')
        $("<style type=\"text/css\">." + obj_prefix + this.objectCounter[obj_prefix] + "-icon .v-input__icon {max-height: " + (this.default_fontsize + 6) + "px;}</style>").appendTo("head")

        $(obj_id).css("z-index", 5)
        objZindex = 5

      } else if (object_name == 'datepicker_box') {
        obj_prefix = 'datepickerbox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'e, w'})
        $(obj_id).css("height", this.default_height+ "px")
        $(obj_id).css("font-size", this.default_fontsize + "px")
        $(obj_id).css("z-index", 5)
        objZindex = 5

      } else if (object_name == 'time_box') {
        obj_prefix = 'timebox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'e'})
        $(obj_id).css("height", this.default_height+ "px")
        $(obj_id).css("font-size", this.default_fontsize + "px")
        $(obj_id).css("z-index", 5)
        objZindex = 5

      } else if (object_name == 'check_box') {
        obj_prefix = 'checkbox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).css("height","auto")
        $(obj_id).css("font-size",this.default_fontsize + "px")
        $(obj_id+ '-input').css("border", "1px dashed lightgrey")
        $(obj_id + '-input').css("z-index", 5)
        $(obj_id + '-input').css("text-align", 'left')
        objZindex = 5

      }  else if (object_name == 'image_box') {
        obj_prefix = 'imagebox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).css("z-index", 3)
        objZindex = 3
      } else if (object_name == 'autofill_box') {
        obj_prefix = 'autofillbox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'e, w'})
        $(obj_id).css("height", this.default_height+ "px")
        $(obj_id).css("font-size", this.default_fontsize + "px")
        $(obj_id).css("width", this.default_width + "px")
        $(obj_id).css("z-index", 5)
        objZindex = 5
      }  else if (object_name == 'calculate_box') {
        obj_prefix = 'calculatebox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'e, w'})
        $(obj_id).css("height", this.default_height+ "px")
        $(obj_id).css("font-size", this.default_fontsize + "px")
        $(obj_id).css("width", this.default_width + "px")
        $(obj_id).css("z-index", 5)
        objZindex = 5
      } else if (object_name == 'section_box') {
        obj_prefix = 'sectionbox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'n, s, e, w'})
        $(obj_id).css("z-index", 6)
        $(obj_id + '-section-box').css("border", 'dashed 3px #7CB342')
        $(obj_id + '-section-box').css("width", 'auto')
        $(obj_id + '-section-box').css("height", 'calc(100% - 20px)')
        $(obj_id).css("width", '500px')
        $(obj_id).css("height", '250px')
        $(obj_id + '-box').css("width", '100%')
        $(obj_id + '-box').css("height", '100%')
        $(obj_id + '-box').css("border", 'dashed 1px lightgrey')
        objZindex = 6
      } else if (object_name == 'number2text_box') {
        obj_prefix = 'number2textbox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'e, w'})
        $(obj_id).css("height", this.default_height+ "px")
        $(obj_id).css("font-size", this.default_fontsize + "px")
        $(obj_id).css("width", this.default_width + "px")
        $(obj_id).css("z-index", 5)
        objZindex = 5
      } else if (object_name == 'table') {
        obj_prefix = 'table'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).css("width", 'auto')
        $(obj_id).css("z-index", 2)
        objZindex = 2
      } else if (object_name == 'data_table') {
        obj_prefix = 'datatable'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).css("width", 'auto')
        $(obj_id).css("z-index", 3)
        Object.keys(this.dataTableObjectArray).forEach(k => {
          if(k.startsWith(obj_prefix + this.objectCounter[obj_prefix])) {
            this.dataTableObjectArray[k].page = this.currentPage
          }
        })
        objZindex = 3
      } else if (object_name == 'sign_box') {
        obj_prefix = 'signbox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'n, s, e, w'})
        $(obj_id).css("height", '100'+ "px")
        $(obj_id).css("width", '100' + "px")
        $(obj_id).css("z-index", 2)
        $(obj_id + '-box').css("height", '100%')
        $(obj_id + '-box').css("width", '100%')
        $(obj_id + '-box-cover').css("border", "3px dashed #2196F3")
        $(obj_id + '-box').css("background-color", "#64B5F6")
        $(obj_id + '-box').css("opacity", 0.2)
        objZindex = 2
      } else if (object_name == 'input_image_box') {
        obj_prefix = 'inputimagebox'
        obj_id = '#'+ obj_prefix + this.objectCounter[obj_prefix]
        $(obj_id).resizable({handles: 'n, s, e, w'})
        $(obj_id).css("height", '300'+ "px")
        $(obj_id).css("width", '300' + "px")
        $(obj_id).css("z-index", 4)
        $(obj_id + '-box').css("height", '100%')
        $(obj_id + '-box').css("width", '100%')
        $(obj_id + '-box-cover').css("border", "3px dashed #BDBDBD")
        $(obj_id + '-box').css("background-color", "grey")
        $(obj_id + '-box').css("opacity", 0.2)
        objZindex = 4
      } else {

      }

      $(obj_id).css("position", "absolute")      
      $(obj_id).css("padding", "0px")
      $(obj_id).css("opacity",1)
      $(obj_id).css("text-align", "center")
      $(obj_id).css("display", "table-cell")

      var index = this.objectArray[obj_prefix].length - 1
      var element = document.getElementById(this.objectArray[obj_prefix][index].name)
      element.style.left = -$(".main-paper").position().left + 50 +  "px"
      element.style.top = -$(".main-paper").position().top + 50 +  "px"
      if (object_name == 'image_box') {
        this.objectArray[obj_prefix][index].value = this.import_image
        this.import_image = ''
      }
      if(this.pasted) {
        var work_paper = document.getElementById('workpaper')
        var paper_rect = work_paper.getBoundingClientRect()
        let cpObj = this.copyObject
        this.objectArray[obj_prefix][index].style = {
          font_size: cpObj.style.font_size, font_style: cpObj.style.font_style, font_color: cpObj.style.font_color,
          border_size: cpObj.style.border_size, border_color: cpObj.style.border_color, background_color: cpObj.style.background_color, background_color_select:cpObj.style.background_color_select,
          border_radias: cpObj.style.border_radias, permission:cpObj.style.permission, permission_section: cpObj.style.permission_section, hidesection: cpObj.style.hidesection,
          row: cpObj.style.row, date_format: cpObj.style.date_format, image_width: cpObj.style.image_width, image_height: cpObj.style.image_height, mandatory:cpObj.style.mandatory, function: cpObj.style.function,
          number_only: cpObj.style.number_only, suffix: cpObj.style.suffix, table: cpObj.style.table, font_align: cpObj.style.font_align, textAreaValiable: cpObj.style.textAreaValiable,
          validate: cpObj.style.validate, time: cpObj.style.time, line_set: cpObj.style.line_set, line_focus: cpObj.style.line_focus, line_style: cpObj.style.line_style, decimal: cpObj.style.decimal, isComma: cpObj.style.isComma,
          addTable: cpObj.style.addTable, refPermission: cpObj.style.refPermission, refValue: cpObj.style.refValue, alterChoices: cpObj.style.alterChoices, n2tdecimal: cpObj.style.n2tdecimal,json_key: cpObj.style.json_key,checkBoxGroup: cpObj.style.checkBoxGroup,
          fixedValue: cpObj.style.fixedValue,role_id: cpObj.style.role_id, isZero: cpObj.style.isZero, email_report: cpObj.style.email_report, hideOption: cpObj.style.hideOption,refOrder: cpObj.style.refOrder, addTableUnmove:cpObj.style.addTableUnmove,
          isDefaultRow: cpObj.style.isDefaultRow, defaultRow: cpObj.style.defaultRow, Zindex: objZindex
        }
        this.objectArray[obj_prefix][index].placeholder = cpObj.placeholder
        this.objectArray[obj_prefix][index].section = cpObj.section
        this.objectArray[obj_prefix][index].value = cpObj.value
        this.objectArray[obj_prefix][index].text = cpObj.text
        this.objectArray[obj_prefix][index].choices = cpObj.choices
        this.objectArray[obj_prefix][index].show_value = cpObj.show_value
        this.objectArray[obj_prefix][index].excel = cpObj.excel 
        var temp_element = document.getElementById(cpObj.name)
        var temp_rect = temp_element.getBoundingClientRect()
        element.style.left = String(temp_rect.left - paper_rect.left + 3) + "px"
        element.style.top = String(temp_rect.top - paper_rect.top + 3) + "px"
        $(obj_id).css("height", String(temp_rect.height)+ "px")
        if(obj_prefix == 'checkbox' || obj_prefix == 'table' || obj_prefix == 'datatable') {
          $(obj_id).css("width", "auto")
        } else {
          $(obj_id).css("width", String(temp_rect.width) + "px")
        }
        if(obj_prefix == 'datatable') {
          $(obj_id).css("height", "auto")
          this.copyDatatable(this.copyObject.object_name,this.objectArray[obj_prefix][index].object_name)
        }
        this.pasted = false
      }
      this.objectArray[obj_prefix][index].page = this.currentPage
      this.objectArray[obj_prefix][index].style.hideDisplay = hideDisplay
      this.selectObject(this.objectArray[obj_prefix][index],obj_prefix)
      this.objectArray[obj_prefix][index].selected = true
      this.objectArray[obj_prefix][index].show = true
      this.objectArray[obj_prefix][index].isPre = false
      if(obj_prefix== 'rectangle') {
        $('#' + this.objectArray[obj_prefix][index].name).css("z-index", 2)
        objZindex = 2
      } else if(obj_prefix == 'imagebox') {
        $('#' + this.objectArray[obj_prefix][index].name).css("z-index", 4)
        objZindex = 4
      } else if(obj_prefix == 'table' || obj_prefix == 'datatable') {
        $('#' + this.objectArray[obj_prefix][index].name).css("z-index", 4)
        objZindex = 4
      } else if(obj_prefix == 'sectionbox') {
        $('#' + this.objectArray[obj_prefix][index].name).css("z-index", 6)
        objZindex = 6
      } else if(obj_prefix == 'line') {
        $('#' + this.objectArray[obj_prefix][index].name).css("z-index", 4)
        objZindex = 4
      } else if(obj_prefix == 'signbox') {
        $('#' + this.objectArray[obj_prefix][index].name).css("z-index", 4)
        objZindex = 4
      } else {
        $('#' + this.objectArray[obj_prefix][index].name).css("z-index", 5)
        objZindex = 5
      }           
      this.selectObject(this.objectArray[obj_prefix][index],obj_prefix)
      this.objectCounter[obj_prefix]++

      var obj = {name:obj_prefix + this.objectCounter[obj_prefix], value: null, show: false, section:"header",excel: "",}
      obj.object_name = obj.placeholder = obj.name
      obj.value = ""
      obj.selected = false
      obj.isPre = true
      obj.style = {
        font_size: 16, font_style: [], font_color: "#000000",
        border_size: 1, border_color: "#000000", background_color: 'rgba(255,255,255,0)', background_color_select:{'r':255,'g':255,'b':255,'a':0},
        border_radias: false, permission: {byRole:true, value_role:[], value_email:[], ref: ""}, permission_section: {byRole:true, value_role:[], value_email:[]}, hidesection: true,
        row: 3, date_format: 'be', image_width: 100, image_height: 100, mandatory:false, function: "", font_align:'justify', textAreaValiable: [],
        number_only: false, suffix: "", table: {crow:3, ccol:3, rowsize:[{index:1,size:50},{index:2,size:50},{index:3,size:50}], colsize:[{index:1,size:200},{index:2,size:200},{index:3,size:200}]},
        validate: {value:"", fx: ""}, time: {isSec: false, isFull: "24hr"}, line_set: "p", line_focus: "0", line_style: "solid", decimal:2, isComma: false, isZero: false, refOrder: false,
        addTable: false, refPermission: "", refValue: "", alterChoices: {}, n2tdecimal: '', json_key: obj.object_name,checkBoxGroup: [], fixedValue: false,role_id: [], email_report: [], hideOption: "", addTableUnmove: false,
        zIndex: objZindex, startDateType: ""
      }
      obj.style.mobileIndex = ""
      obj.page = 0
      if(obj_prefix == 'datepickerbox') {
        obj.value = new Date().toISOString().substr(0, 10)
        obj.show_value = this.setDateFormatBE(new Date().toISOString().substr(0, 10),'be')
      }
      if(obj_prefix == 'checkbox') {obj.text= obj.name}
      if(obj_prefix == 'dropdownbox') {obj.choices = []}
      if(obj_prefix == 'datatable') {
        this.addDataTableCell(obj_prefix + this.objectCounter[obj_prefix], 3, 3)
      }

      this.objectArray[obj_prefix].push(obj)
      if(this.objectTypeInput.includes(obj_prefix)) {
        var mobileObj = {
          index: this.mobileInputOrder.length + 1,
          objType: obj_prefix,
          objIndex: this.objectArray[obj_prefix].indexOf(obj)
        }
        this.objectArray[obj_prefix][mobileObj.objIndex].style.mobileIndex = mobileObj.index
        this.mobileInputOrder.push(mobileObj)
        for(let i = 0; i < this.mobileInputOrder.length; i++) {
          this.mobileInputOrder[i].index = i + 1
        }
      }
    },
    addDatatableObject(object_name, tableName, tableRow, tableCol) {
      var obj_id = tableName + '_' + 'R' + tableRow + 'C' + tableCol
      if(typeof this.dataTableObjectArray[obj_id] === 'undefined') {
        var obj = {name:obj_id , value: null, show: false, section:"header",excel: "",}
        obj.object_name = obj.placeholder = obj.name
        obj.value = ""
        obj.style = {
          font_size: 16, font_style: [], font_color: "#000000",
          border_size: 1, border_color: "#000000", background_color: 'rgba(255,255,255,0)', background_color_select:{'r':255,'g':255,'b':255,'a':0},
          border_radias: false, permission: {byRole:true, value_role:[], value_email:[], ref: ""}, permission_section: {byRole:true, value_role:[], value_email:[]}, hidesection: true,
          row: 3, date_format: 'be', image_width: 100, image_height: 100, mandatory:false, function: "", font_align:'justify', textAreaValiable: [],
          number_only: false, suffix: "", table: {crow:3, ccol:3, rowsize:[{index:1,size:50},{index:2,size:50},{index:3,size:50}], colsize:[{index:1,size:50},{index:2,size:50},{index:3,size:50}]},
          validate: {value:"", fx: ""}, time: {isSec: false, isFull: "24hr"}, line_set: "p", line_focus: "0", line_style: "solid", decimal:2, isComma: false, isZero: false,isCellTextField: false, startDateType: "",
          addTable: false, refPermission: "", refValue: "", alterChoices: {}, n2tdecimal: '', json_key: obj.object_name,checkBoxGroup: [], noCellData: false, fixedValue: false,role_id: [], email_report: [], hideOption: "",refOrder: false
        }
        obj.style.hideDisplay = false
        obj.page = this.currentPage

        this.dataTableObjectArray[obj_id] = obj
        this.dataTableObjectArray[obj_id].page = this.currentPage
        this.dataTableObjectArray[obj_id].show = true
        if(this.objectTypeInput.includes(this.dataTableObjectArray[obj_id].object_type)) {
          var mobileObj = {
            index: this.mobileInputOrder.length + 1,
            objType: 'datatable',
            objIndex: obj_id
          }
          this.dataTableObjectArray[obj_id].style.mobileIndex = mobileObj.index
          this.mobileInputOrder.push(mobileObj)
          for(let i = 0; i < this.mobileInputOrder.length; i++) {
            this.mobileInputOrder[i].index = i + 1
          }
        }


        if (object_name == 'link_data_box') {
          this.dataTableObjectArray[obj_id].object_type = 'linkdatabox'
          $(obj_id).css("height", this.default_height+ "px")
          $(obj_id).css("font-size", this.default_fontsize + "px")
          $(obj_id).css("width", "auto")
          $(obj_id).css("z-index", 4)
        } 

        $(obj_id).css("position", "absolute")      
        $(obj_id).css("padding", "0px")
        $(obj_id).css("opacity",1)
        $(obj_id).css("text-align", "center")
        $(obj_id).css("display", "table-cell")
      }
    },
    copyDatatable(src, dst) {
      Object.keys(this.dataTableObjectArray).forEach(e => {
        if(e.startsWith(src)) {
          var cellName = e.split(src).join(dst)
          this.dataTableObjectArray[cellName] = this.dataTableObjectArray[e]
          var obj = {name:cellName , value: this.dataTableObjectArray[e].value, show: false, 
            section:this.dataTableObjectArray[e].section,excel: this.dataTableObjectArray[e].excel,}
          obj.object_name = cellName
          obj.object_type = this.dataTableObjectArray[e].object_type
          obj.placeholder = this.dataTableObjectArray[e].placeholder
          if(this.dataTableObjectArray[e].object_type == 'dropdownbox') {
            obj.choices = this.dataTableObjectArray[e].choices
          }

          obj.style = this.dataTableObjectArray[e].style
          obj.page = this.currentPage

          this.dataTableObjectArray[cellName] = obj
          this.dataTableObjectArray[cellName].page = this.currentPage
          this.dataTableObjectArray[cellName].show = true
          if(this.objectTypeInput.includes(this.dataTableObjectArray[cellName].object_type)) {
            var mobileObj = {
              index: this.mobileInputOrder.length + 1,
              objType: 'datatable',
              objIndex: cellName
            }
            this.dataTableObjectArray[cellName].style.mobileIndex = mobileObj.index
            this.mobileInputOrder.push(mobileObj)
            for(let i = 0; i < this.mobileInputOrder.length; i++) {
              this.mobileInputOrder[i].index = i + 1
            }
          }
        }
      })
    },
    addDataTableCell(objectName,r,c) {
      for(let i=0; i<parseInt(r); i++) {
        for(let j=0; j<parseInt(c); j++) {
          this.addDatatableObject('link_data_box',objectName,i+1,j+1)
        }
      }
    },
    pasteObject() {
      this.pasted = true
      if (this.copyObject.object_type == 'textfield') {
        this.addObject('text_field') 
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
      } else if (this.copyObject.object_type == 'inputbox') {
        this.addObject('input_box')
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
      } else if (this.copyObject.object_type == 'textareabox') {
        this.addObject('text_area_box')
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
      } else if (this.copyObject.object_type == 'texteditorbox') {
        this.addObject('texteditorbox')
      } else if (this.copyObject.object_type == 'imagefield') {
        this.addObject('image_field')
      } else if (this.copyObject.object_type == 'rectangle') {
        this.addObject('rectangle')
        this.change_bordersize()
        this.change_backgroundcolor()
        this.change_bordercolor()
        this.change_borderradias()
      } else if (this.copyObject.object_type == 'verticalline') {
        this.addObject('vertical_line')
      } else if (this.copyObject.object_type == 'dropdownbox') {
        this.addObject('dropdown_box')
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
      } else if (this.copyObject.object_type == 'datepickerbox') {
        this.addObject('datepicker_box')
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
        this.change_dateformat()
      } else if (this.copyObject.object_type == 'timebox') {
        this.addObject('time_box')
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
      } else if (this.copyObject.object_type == 'checkbox') {
        this.addObject('check_box')
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
      } else if (this.copyObject.object_type == 'radiobox') {
        this.addObject('radio_box')
      } else if (this.copyObject.object_type == 'imagebox') {
        this.addObject('image_box')
      } else if (this.copyObject.object_type == 'autofillbox') {
        this.addObject('autofill_box')
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
      } else if (this.copyObject.object_type == 'calculatebox') {
        this.addObject('calculate_box')
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
      } else if (this.copyObject.object_type == 'sectionbox') {
        this.addObject('section_box')
      } else if (this.copyObject.object_type == 'number2textbox') {
        this.addObject('number2text_box')
        this.change_fontsize()
        this.change_fontstyle()
        this.change_fontcolor()
      } else if (this.copyObject.object_type == 'table') {
        this.addObject('table')
        this.change_bordersize()
      } else if (this.copyObject.object_type == 'line') {
        this.addObject('line')
        this.change_linesize()
        this.change_lineside()
      } else if(this.copyObject.object_type == 'signbox') {
        this.addObject('sign_box')
      } else if(this.copyObject.object_type == 'inputimagebox') {
        this.addObject('input_image_box')
      } else if(this.copyObject.object_type == 'datatable') {
        this.addObject('data_table')
        // this.copyObject = ""
      }
    },
    changeSelected(val) {
      this.selectedCell = ""
      this.selectedCell = val
    },
    selectObject(item, type) {
      var tempSelectArray = this.selected_array
      var tempSelectObject = this.selected_object
      if(CrtlEventHandle) {
        if(!this.selectedObjectGroup.length) {
          this.selectPlain()
        }
        if(!this.selectedObjectGroup.includes(item.object_name)) {
          var newObj = {
            obj_name:item.object_name,
            obj_array: type,
            obj_index: this.objectArray[type].indexOf(item)
          }
          this.selectedObjectGroup.push(newObj)
          $('#' + this.objectArray[newObj.obj_array][newObj.obj_index].name).css("outline-color", "#009688")
          $('#' + this.objectArray[newObj.obj_array][newObj.obj_index].name).css("outline-style", "dotted")
        }
      }
      else {
        if(this.selectedObjectGroup.length) {
          this.selectPlain()
        }
        if((this.objectArray[type][this.objectArray[type].indexOf(item)].page != this.currentPage && !this.isSetPosition) || this.objectArray[type][this.objectArray[type].indexOf(item)].deleted) {
            this.selectPlain()
        } else {
          if(this.objectArray[tempSelectArray][tempSelectObject].style.isResize) {
            $('#' + this.objectArray[tempSelectArray][tempSelectObject].name).resizable('destroy')
          }
          $('#' + this.objectArray[tempSelectArray][tempSelectObject].name).draggable('destroy')
          $('#' + this.objectArray[tempSelectArray][tempSelectObject].name).css("cursor","default")
          $('#' + this.objectArray[tempSelectArray][tempSelectObject].name).css("outline-color", "")
          $('#' + this.objectArray[tempSelectArray][tempSelectObject].name).css("outline-style", "")
          this.objectArray[tempSelectArray][tempSelectObject].selected = false
          if(this.objectArray[type][this.objectArray[type].indexOf(item)].page == this.currentPage) {
            this.objectArray['line'].forEach(e=> {
                e.style.line_focus = "0"
            })
          }

          this.selected_array = type
          this.selected_object = this.objectArray[type].indexOf(item)
          if(this.selected_array != 'datatable') {
            this.selectedCell = ''
          }
          this.objectArray[this.selected_array][this.selected_object].selected = true
          if(this.selected_array == 'datatable') {
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).draggable({cursor: "move" , scroll: false})
          } else {
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).draggable({cursor: "move" ,containment: "#workpaper", scroll: false})
          }
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("cursor","move")
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("outline-color", "#009688")
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("outline-style", "dotted")

          this.custom_object_name = false
          this.custom_object_fontsize = false
          this.custom_object_font = false
          this.custom_object_fontcolor = false
          this.custom_object_bordercolor = false
          this.custom_object_bordersize = false
          this.custom_object_backgroundcolor = false
          this.custom_object_boxwidth = false
          this.custom_object_boxheight = false
          this.custom_object_borderradias = false
          this.custom_object_placholder = false
          this.custom_object_row = false
          this.custom_object_choices = false
          this.custom_object_datestyle = false
          this.custom_object_timestyle = false
          this.custom_object_timeseccond = false
          this.custom_object_radiocolor = false
          this.custom_object_text = false
          this.custom_object_databind = false
          this.custom_object_mandatory = false
          this.custom_object_function = false
          this.custom_object_isnumber = false
          this.custom_object_permission = false
          this.custom_object_hidesection = false
          this.custom_object_suffix = false
          this.custom_object_rowcount = false
          this.custom_object_colcount = false
          this.custom_object_colsetting = false
          this.custom_object_rowsetting = false
          this.custom_object_excel = false
          this.custom_object_linecolor = false
          this.custom_object_linesize = false
          this.custom_object_lineside = false
          this.custom_object_decimal = false
          this.custom_object_defaultvalue = false
          this.custom_object_datatablesetting = false
          this.custom_object_align = false
          this.custom_object_textareavaliable = false
          this.custom_object_addtable = false
          this.custom_object_refpermission = false
          this.custom_object_refvalue = false
          this.custom_object_n2tdecimal = false
          this.custom_object_fixedValue = false
          if(type != 'datatable') {
            this.custom_object_cellname = false
            this.custom_object_celltype = false
            this.custom_cell_text = false
            this.custom_cell_fontsize =  false
            this.custom_cell_font =  false
            this.custom_cell_fontcolor =  false
            this.custom_cell_placholder =  false
            this.custom_cell_choices = false
            this.custom_cell_databind = false
            this.custom_cell_timestyle = false
            this.custom_cell_timeseccond = false
            this.custom_cell_mandatory = false
            this.custom_cell_isnumber = false
            this.custom_cell_decimal = false
            this.custom_cell_defaultvalue = false
            this.custom_cell_excel = false
            this.custom_cell_suffix = false
            this.custom_cell_permission = false
            this.custom_cell_nodata = false
          }

          this.custom_object_name = true
          if(type == 'textfield') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_align = true
            this.help_message = this.textLang.tips_help_message.box_displaying
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e, w'})
          } else if(type == 'inputbox') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_placholder = true
            this.custom_object_mandatory = true
            this.custom_object_isnumber = true
            this.custom_object_permission = true
            this.custom_object_excel = true
            this.custom_object_defaultvalue = true
            this.custom_object_align = true
            this.custom_object_suffix = true
            this.getRefOrder()
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e, w'})
            this.help_message = this.textLang.tips_help_message.box_filling
          } else if(type == 'rectangle') {
            this.custom_object_bordercolor = true
            this.custom_object_bordersize = true
            this.custom_object_backgroundcolor = true
            this.custom_object_borderradias = true
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'n,s,e,w'})
            this.help_message = this.textLang.tips_help_message.square_box
          } else if(type == 'textareabox') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_placholder = true
            this.custom_object_row = true
            this.custom_object_mandatory = true
            this.custom_object_permission = true
            this.custom_object_excel = true
            this.custom_object_defaultvalue = true
            this.custom_object_align = true
            this.custom_object_textareavaliable = true
            this.custom_object_fixedValue = true
            this.getRefOrder()
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e, w'})
            this.help_message = this.textLang.tips_help_message.box_information
          } else if(type == 'texteditorbox') {
            this.custom_object_placholder = true
            this.custom_object_mandatory = true
            this.custom_object_permission = true
            this.custom_object_excel = true
            this.getRefOrder()
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'n,s,e, w'})
            this.help_message = this.textLang.tips_help_message.box_information_editor
          } else if(type == 'datepickerbox') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_datestyle = true
            this.custom_object_permission = true
            this.custom_object_mandatory = true
            this.custom_object_excel = true
            this.custom_object_align = true
            this.getRefOrder()
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e, w'})
            this.help_message = this.textLang.tips_help_message.box_selecting
          } else if(type == 'timebox') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_permission = true
            this.custom_object_placholder = true
            this.custom_object_timestyle =  true
            this.custom_object_timeseccond = true
            this.custom_object_mandatory = true
            this.custom_object_excel = true
            this.custom_object_align = true
            this.getRefOrder()
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e, w'})
            this.help_message = this.textLang.tips_help_message.box_for_selecting
          } else if(type == 'checkbox') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_text = true
            this.custom_object_permission = true
            this.custom_object_excel = true
            this.getRefOrder()
            this.help_message = this.textLang.tips_help_message.check_box
          } else if (type == 'imagebox') {
            // $("#" + this.objectArray[this.selected_array][this.selected_object].name).css("border", "1.2px dashed lightgrey")
            this.custom_object_boxwidth = true
            this.custom_object_boxheight = true
            this.help_message = this.textLang.tips_help_message.pictures
          } else if(type == 'dropdownbox') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_placholder = true
            this.custom_object_choices = true
            this.custom_object_mandatory = true
            this.custom_object_permission = true
            this.custom_object_excel = true
            this.custom_object_refvalue = true
            this.custom_object_align = true
            this.custom_object_defaultvalue = true
            this.getRefOrder()
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e, w'})
            this.help_message = this.textLang.tips_help_message.box_selecting_one
          } else if(type == 'autofillbox') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_placholder = true
            this.custom_object_databind = true
            this.custom_object_permission = true
            this.custom_object_align = true
            this.custom_object_suffix = true
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e, w'})
            this.help_message = this.textLang.tips_help_message.automatic
            this.autofillboxLeaders = this.objectArray['autofillbox'].filter(con => (con.value == 'leader_name_th'||con.value == 'leader_name_eng')).map(item => item.object_name)
            this.initailDatabind()
          } else if(type == 'calculatebox') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_placholder = true
            this.custom_object_function = true
            this.custom_object_permission = true
            this.custom_object_decimal = true
            this.custom_object_align = true
            this.custom_object_suffix = true
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e, w'})
            this.help_message = this.textLang.tips_help_message.box_show
          } else if(type == 'number2textbox') {
            this.custom_object_fontsize = true
            this.custom_object_font = true
            this.custom_object_fontcolor = true
            this.custom_object_placholder = true
            this.custom_object_databind = true
            this.custom_object_permission = true
            this.custom_object_suffix = true
            this.custom_object_n2tdecimal = true
            this.custom_object_align = true
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e, w'})
            this.help_message = this.textLang.tips_help_message.box_show_thai
            this.initailDatabind()
          } else if(type == 'sectionbox') {
            this.custom_object_permission = true
            this.custom_object_hidesection = true
            this.custom_object_refpermission = true
            this.hidesection = this.objectArray[this.selected_array][this.selected_object].style.hidesection
            this.getSectionPermission()
            this.getRefOrder()
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'n, s, e, w'})
            this.help_message = this.textLang.tips_help_message.scope_box
          } else if(type == 'datatable') {
            this.custom_object_rowcount = true
            this.custom_object_colcount = true
            this.custom_object_colsetting = true
            this.custom_object_rowsetting = true
            this.custom_object_bordercolor = true
            this.custom_object_bordersize = true
            this.custom_object_datatablesetting = true
            this.custom_object_addtable = true
            if(true) {
              this.custom_object_fontsize = true
              this.custom_object_font = true
              this.custom_object_fontcolor = true
            }
            this.help_message = this.textLang.tips_help_message.displaying
          } else if(type == 'table') {
            this.custom_object_rowcount = true
            this.custom_object_colcount = true
            this.custom_object_colsetting = true
            this.custom_object_rowsetting = true
            this.custom_object_bordercolor = true
            this.custom_object_bordersize = true
            this.custom_object_addtable = true
            this.help_message = this.textLang.tips_help_message.consists
          } else if(type == 'line') {
            this.custom_object_linecolor = true
            this.custom_object_linesize = true
            this.custom_object_lineside = true
            this.objectArray[this.selected_array][this.selected_object].style.line_focus = "1"
            this.change_lineside()
            this.help_message = this.textLang.tips_help_message.straight
          } else if(type == 'signbox') {
            this.custom_object_permission = true
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'n,s,e,w'})
            this.getRefOrder()
            this.help_message = this.textLang.tips_help_message.area_displaying
          } else if(type == 'inputimagebox') {
            this.custom_object_permission = true
            $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'n,s,e,w'})
            this.getRefOrder()
            this.help_message = this.textLang.tips_help_message.picture_box
          }
        }
      }
    },
    selectCellObject(obj, row, col) {
      if(this.objectArray[this.selected_array][this.selected_object].page != this.currentPage) {
          this.selectPlain()
      } else {
        if(this.objectArray[this.selected_array][this.selected_object].page == this.currentPage) {
          this.objectArray['line'].forEach(e=> {
              e.style.line_focus = "0"
          })
        }

        this.selectedCell = obj.object_name
        var type = obj.object_type
        this.custom_object_cellname = false
        this.custom_object_celltype = false
        this.custom_cell_text = false
        this.custom_cell_fontsize =  false
        this.custom_cell_font =  false
        this.custom_cell_fontcolor =  false
        this.custom_cell_placholder =  false
        this.custom_cell_choices = false
        this.custom_cell_databind = false
        this.custom_cell_timestyle = false
        this.custom_cell_timeseccond = false
        this.custom_cell_mandatory = false
        this.custom_cell_isnumber = false
        this.custom_cell_decimal = false
        this.custom_cell_defaultvalue = false
        this.custom_cell_excel = false
        this.custom_cell_suffix = false
        this.custom_cell_permission = false
        this.custom_cell_datestyle = false
        this.custom_cell_function = false
        this.custom_cell_false = true

        this.custom_cell_nodata = true
        this.custom_object_cellname = true
        this.custom_object_celltype = true
        if(type == 'textfield') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.help_message = this.textLang.tips_help_message.box_displaying
        } else if(type == 'inputbox') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.custom_cell_placholder = true
          this.custom_cell_mandatory = true
          this.custom_ocell_isnumber = true
          this.custom_cell_permission = true
          this.custom_cell_excel = true
          this.custom_cell_defaultvalue = true
          this.help_message = this.textLang.tips_help_message.box_filling
        } else if(type == 'textareabox') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.custom_cell_placholder = true
          this.custom_cell_row = true
          this.custom_cell_mandatory = true
          this.custom_cell_permission = true
          this.custom_cell_excel = true
          this.custom_cell_defaultvalue = true
          this.help_message = this.textLang.tips_help_message.box_information
        } else if(type == 'datepickerbox') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.custom_cell_datestyle = true
          this.custom_cell_permission = true
          this.custom_cell_excel = true
          this.help_message = this.textLang.tips_help_message.box_selecting
        } else if(type == 'timebox') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.custom_cell_permission = true
          this.custom_cell_placholder = true
          this.custom_cell_timestyle =  true
          this.custom_cell_timeseccond = true
          this.custom_cell_mandatory = true
          this.custom_cell_excel = true
          this.help_message = this.textLang.tips_help_message.box_for_selecting
        } else if(type == 'checkbox') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.custom_cell_text = true
          this.custom_cell_permission = true
          this.custom_cell_excel = true
          this.help_message = this.textLang.tips_help_message.check_box
        } else if(type == 'dropdownbox') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.custom_cell_placholder = true
          this.custom_cell_choices = true
          this.custom_ell_mandatory = true
          this.custom_cell_permission = true
          this.custom_cell_excel = true
          this.help_message = this.textLang.tips_help_message.box_selecting_one
        } else if(type == 'autofillbox') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.custom_cell_placholder = true
          this.custom_cell_databind = true
          this.custom_cell_permission = true
          this.help_message = this.textLang.tips_help_message.automatic
          this.initailDatabind()
        } else if(type == 'calculatebox') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.custom_cell_placholder = true
          this.custom_cell_function = true
          this.custom_cell_permission = true
          this.custom_cell_decimal = true
          this.help_message = this.textLang.tips_help_message.box_show
        } else if(type == 'number2textbox') {
          this.custom_cell_fontsize = true
          this.custom_cell_font = true
          this.custom_cell_fontcolor = true
          this.custom_cell_placholder = true
          this.custom_cell_databind = true
          this.custom_cell_permission = true
          this.custom_cell_suffix = true
          this.help_message = this.textLang.tips_help_message.box_show_thai
          this.initailDatabind()
        } else if(type == 'inputimagebox') {
          this.custom_cell_permission = true
          if(!this.dataTableObjectArray[obj.object_name].value) {
            this.openUploadImage(this.dataTableObjectArray[obj.object_name], row)
          }
         
          this.help_message = this.textLang.tips_help_message.picture_box
        } else if(type == 'linkdatabox') {
          this.custom_object_fontsize = true
          this.custom_object_font = true
          this.custom_object_fontcolor = true
          this.help_message = this.textLang.tips_help_message.box_displaying
        } 
      }
    },
    changeCellObject() {
      var holdObj = this.mobileInputOrder.find(item => item.objIndex == this.selectedCell)
      if(holdObj) {
        var indx = this.mobileInputOrder.indexOf(holdObj)
        this.mobileInputOrder.splice(indx,1)
      }
      var objType = this.dataTableObjectArray[this.selectedCell].object_type
      var holdCell = this.selectedCell
      if(objType == 'linkdatabox') {
        this.dataTableObjectArray[this.selectedCell].style.isCellTextField = false
      } else if(objType == 'textfield') {
        this.dataTableObjectArray[this.selectedCell].style.isCellTextField = true
      } else if(objType == 'inputbox') {
        this.dataTableObjectArray[this.selectedCell].style.isCellTextField = false
      } else if(objType == 'dropdownbox') {
        $("#" + this.dataTableObjectArray[this.selectedCell].name + " div:first div:first").addClass(this.dataTableObjectArray[this.selectedCell].name + '-box') //add class of box height
        $("#" + this.dataTableObjectArray[this.selectedCell].name + " div:first div:first").addClass(this.dataTableObjectArray[this.selectedCell].name + '-icon') //add class of arrow down box height
        $("<style type=\"text/css\">.v-text-field--outlined." + this.dataTableObjectArray[this.selectedCell].name + "-box > .v-input__control > .v-input__slot {font-size: " + this.dataTableObjectArray[this.selectedCell].style.font_size + "px; min-height: " + this.dataTableObjectArray[this.selectedCell].style.font_size + "px; max-height: " + (Number(this.dataTableObjectArray[this.selectedCell].style.font_size) + 6) + "px;}</style>").appendTo("head")
        $("<style type=\"text/css\">." + this.dataTableObjectArray[this.selectedCell].name + "-icon .v-input__icon {max-height: " + (Number(this.dataTableObjectArray[this.selectedCell].style.font_size) + 6) + "px;}</style>").appendTo("head")
        this.dataTableObjectArray[this.selectedCell].style.isCellTextField = false
      } else if(objType == 'checkbox') {
        this.dataTableObjectArray[this.selectedCell].style.isCellTextField = false
      } else if(objType == 'calculatebox') {
        this.dataTableObjectArray[this.selectedCell].style.isCellTextField = false
      } else if(objType == 'datepickerbox') {
        this.dataTableObjectArray[this.selectedCell].style.isCellTextField = false
        this.change_dateformat()
      } else if(objType == 'inputimagebox') {
        this.dataTableObjectArray[this.selectedCell].style.isCellTextField = false
      }

      if(this.objectTypeInput.includes(objType)) {
        var mobileObj = {
          index: this.mobileInputOrder.length + 1,
          objType: 'datatable',
          objIndex: this.selectedCell
        }
        this.dataTableObjectArray[this.selectedCell].style.mobileIndex = mobileObj.index
        this.mobileInputOrder.push(mobileObj)
        // for(let i = 0; i < this.mobileInputOrder.length; i++) {
        //   this.mobileInputOrder[i].index = i + 1
        // }
      }

      this.selectedCell = ""
      this.selectedCell = holdCell
    },
    initailDatabind() {
      if(this.selected_array == 'autofillbox') {
        this.databind_choice = [
          {text: this.textLang.dropdown.inputbox_auto.no_choose, value: null},
          {text: this.textLang.dropdown.inputbox_auto.doc_no, value: 'doc_no'},
          {text: this.textLang.dropdown.inputbox_auto.condition, value: 'function'},
          {text: this.textLang.dropdown.inputbox_auto.fullname_th, value: 'fullname_th'},
          {text: this.textLang.dropdown.inputbox_auto.prefix_name_th, value: 'account_title_th'},
          {text: this.textLang.dropdown.inputbox_auto.first_name_th, value: 'firstname_th'},
          {text: this.textLang.dropdown.inputbox_auto.last_name_th, value: 'lastname_th'},
          {text: 'Fullname(EN)', value: 'fullname_en'},
          {text: 'Name title(EN)', value: 'account_title_eng'},
          {text: 'Firstname(EN)', value: 'firstname_en'},
          {text: 'Lastname(EN)', value: 'lastname_en'},
          {text: this.textLang.dropdown.inputbox_auto.tel, value: 'tel_no'},
          {text: 'One E-mail', value: 'one_email'},
          {text: this.textLang.dropdown.inputbox_auto.ref_doc_no, value: 'ref_no'},
          {text:  this.textLang.dropdown.inputbox_auto.customer_name, value: 'sys_cus_name'},
          // {text: 'อ้างอิงข้อมูลเอกสารอื่น', value: 'ref_data'},
        ]
        if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
          this.databind_choice.push({text: 'E-mail', value: 'email'})
          this.databind_choice.push({text: this.textLang.dropdown.inputbox_auto.employee_id, value: 'employee_id'})
          this.databind_choice.push({text: this.textLang.dropdown.inputbox_auto.department, value: 'one_department'})
          this.databind_choice.push({text: this.textLang.dropdown.inputbox_auto.role, value: 'role_name'})
          this.databind_choice.push({text: this.textLang.dropdown.inputbox_auto.leader_name_th, value: 'leader_name_th'})
          this.databind_choice.push({text: this.textLang.dropdown.inputbox_auto.leader_role, value: 'leader_role_th'})
          this.databind_choice.push({text: 'Leader Name(EN)', value: 'leader_name_eng'})
          this.databind_choice.push({text: this.textLang.dropdown.inputbox_auto.company_address, value: 'bussiness_address'})
        }
        for(var i=0; i<this.objectArray['inputbox'].length-1; i++) {
          if(typeof this.objectArray['inputbox'][i] !== 'undefined' && !this.objectArray['inputbox'][i].deleted) {
            this.databind_choice.push(this.objectArray['inputbox'][i].object_name)
          }
        }
        for(var i=0; i<this.objectArray['calculatebox'].length-1; i++) {
          if(typeof this.objectArray['calculatebox'][i] !== 'undefined' && !this.objectArray['calculatebox'][i].deleted) {
            this.databind_choice.push(this.objectArray['calculatebox'][i].object_name)
          }
        }
        for(var i=0; i<this.objectArray['dropdownbox'].length-1; i++) {
          if(typeof this.objectArray['dropdownbox'][i] !== 'undefined' && !this.objectArray['dropdownbox'][i].deleted) {
            this.databind_choice.push(this.objectArray['dropdownbox'][i].object_name)
          }
        }
        var allDatatable = []
        for(var i=0; i<this.objectArray['datatable'].length-1; i++) {
          allDatatable.push(this.objectArray['datatable'][i].object_name)
        }
        for(var key in this.dataTableObjectArray){
          var datatableObj = this.dataTableObjectArray[key].object_name.split("_")[0]
          if(allDatatable.includes(datatableObj)) {
            this.databind_choice.push(this.dataTableObjectArray[key].object_name)
          }
        }
      } else if (this.selected_array == 'number2textbox') {
        this.databind_choice = []
        for(var i=0; i<this.objectArray['inputbox'].length-1; i++) {
          if(typeof this.objectArray['inputbox'][i] !== 'undefined' && this.objectArray['inputbox'][i].style.number_only && !this.objectArray['inputbox'][i].deleted) {
            this.databind_choice.push(this.objectArray['inputbox'][i].object_name)
          }
        }
        for(var i=0; i<this.objectArray['calculatebox'].length-1; i++) {
          if(typeof this.objectArray['calculatebox'][i] !== 'undefined' && !this.objectArray['calculatebox'][i].deleted) {
            this.databind_choice.push(this.objectArray['calculatebox'][i].object_name)
          }
        }
        var allDatatable = []
        for(var i=0; i<this.objectArray['datatable'].length-1; i++) {
          allDatatable.push(this.objectArray['datatable'][i].object_name)
        }
        for(var key in this.dataTableObjectArray){
          var datatableObj = this.dataTableObjectArray[key].object_name.split("_")[0]
          if(allDatatable.includes(datatableObj)) {
            this.databind_choice.push(this.dataTableObjectArray[key].object_name)
          }
        }
      }
      
    },
    change_datablind() {
      var val = this.objectArray[this.selected_array][this.selected_object].value
      if(val == 'firstname_th') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "ชื่อจริง"
      } else if(val == 'lastname_th') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "นามสกุล"
      } else if(val == 'fullname_th') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "ชื่อเต็ม"
      } else if(val == 'fullname_en') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "Fullname"
      } else if(val == 'firstname_en') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "Firstname"
      } else if(val == 'lastname_en') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "Lastname"
      } else if(val == 'role_name') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "ตำแหน่ง"
      } else if(val == 'account_title_th') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "คำนำหน้าชื่อ"
      } else if(val == 'account_title_eng') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "Name title"
      } else if(val == 'email') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "E-mail"
      } else if(val == 'employee_id') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "รหัสพนักงาน"
      } else if(val == 'tel_no') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "เบอร์โทรศัพท์"
      } else if(val == 'ref_no') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "หมายเลขเอกสารอ้างอิง"
      } else if(val == 'ref_data') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "อ้างอิงข้อมูลจาก " + this.objectArray[this.selected_array][this.selected_object].style.refValue
      } else if(val == 'leader_name_th') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "ขื่อ - นามสกุลหัวหน้างาน"
      } else if(val == 'leader_role_th') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "ตำแหน่งหัวหน้างาน"
      } else if(val == 'leader_name_eng') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "Leader Name"
      } else if(val == 'sys_cus_name') {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "ชื่อลูกค้า"
      } else if(val == 'bussiness_address') {
        var bizz_add = {house_no:"", building_name: "", floor: "", street:"", zipcode_tambon: "",
          zipcode_amphoe: "", zipcode_zipcode: ""}
        if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
          if(JSON.parse(sessionStorage.getItem('selected_business')).biz_details) {
            bizz_add = JSON.parse(sessionStorage.getItem('selected_business')).biz_details[0].address
          }
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
        this.objectArray[this.selected_array][this.selected_object].placeholder = full_address
      } else {
        this.objectArray[this.selected_array][this.selected_object].placeholder = "อ้างอิง " + val
      }
    },
    change_fontsize() {
      if(this.selected_array == 'dropdownbox') {
        var dropdownbox_size = 0
        dropdownbox_size = parseInt(this.objectArray[this.selected_array][this.selected_object].style.font_size) + 6
        //font
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("font-size", this.objectArray[this.selected_array][this.selected_object].style.font_size + "px")
        //change box size
        $(".v-text-field--outlined." + this.objectArray[this.selected_array][this.selected_object].name + "-box > .v-input__control > .v-input__slot")
        .css({"font-size": this.objectArray[this.selected_array][this.selected_object].style.font_size + "px", "min-height": this.objectArray[this.selected_array][this.selected_object].style.font_size + "px", "max-height": dropdownbox_size + "px"})
        //change arrow down icon box size
        $("." + this.objectArray[this.selected_array][this.selected_object].name + "-icon .v-input__icon")
        .css({"max-height": dropdownbox_size + "px"})
      } else if(this.selected_array == 'datatable') {
        if(this.dataTableObjectArray[this.selectedCell].object_type == 'dropdownbox') {
          var dropdownbox_size = 0
          dropdownbox_size = parseInt(this.dataTableObjectArray[this.selectedCell].style.font_size) + 6
          //font
          $('#' + this.dataTableObjectArray[this.selectedCell].name)
          .css("font-size", this.dataTableObjectArray[this.selectedCell].style.font_size + "px")
          //change box size
          $(".v-text-field--outlined." + this.dataTableObjectArray[this.selectedCell].name + "-box > .v-input__control > .v-input__slot")
          .css({"font-size": this.dataTableObjectArray[this.selectedCell].style.font_size + "px", "min-height": this.dataTableObjectArray[this.selectedCell].style.font_size + "px", "max-height": dropdownbox_size + "px"})
          //change arrow down icon box size
          $("." + this.dataTableObjectArray[this.selectedCell].name + "-icon .v-input__icon")
          .css({"max-height": dropdownbox_size + "px"})
        }
      } else {
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("font-size", this.objectArray[this.selected_array][this.selected_object].style.font_size + "px")
      }
    },
    change_fontstyle() {
      if(!this.selectedCell) {
        var font_style = this.objectArray[this.selected_array][this.selected_object].style.font_style
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("font-weight", "")  
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("font-style", "")  
        if(this.selected_array == 'textfield' || this.selected_array == 'inputbox' || this.selected_array == 'datepickerbox' || this.selected_array == 'timebox' || this.selected_array == 'autofillbox' || this.selected_array == 'calculatebox') {
          $('#' + this.objectArray[this.selected_array][this.selected_object].name + ' input')
          .css("text-decoration", "")
        } else {
          $('#' + this.objectArray[this.selected_array][this.selected_object].name)
          .css("text-decoration", "")
        }

        font_style.forEach( e => {
          if(e == "b") {
            $('#' + this.objectArray[this.selected_array][this.selected_object].name)
            .css("font-weight", "bold")  
          }
          else if(e == 'i') {
            $('#' + this.objectArray[this.selected_array][this.selected_object].name)
            .css("font-style", "italic")  
          } else if(e == "u") {
            if(this.selected_array == 'textfield' || this.selected_array == 'inputbox' || this.selected_array == 'datepickerbox' || this.selected_array == 'timebox' || this.selected_array == 'autofillbox' || this.selected_array == 'calculatebox') {
              $('#' + this.objectArray[this.selected_array][this.selected_object].name + ' input')
              .css("text-decoration", "underline")
            } else {
              $('#' + this.objectArray[this.selected_array][this.selected_object].name)
              .css("text-decoration", "underline")
            }
          }
        })
      } else {
        var font_style = this.dataTableObjectArray[this.selectedCell].style.font_style
        $('#' + this.dataTableObjectArray[this.selectedCell].name)
        .css("font-weight", "")  
        $('#' + this.dataTableObjectArray[this.selectedCell].name)
        .css("font-style", "")  
        $('#' + this.dataTableObjectArray[this.selectedCell].name + ' input')
        .css("text-decoration", "")
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("text-decoration", "")

        font_style.forEach( e => {
          if(e == "b") {
            $('#' + this.dataTableObjectArray[this.selectedCell].name)
            .css("font-weight", "bold")  
          }
          else if(e == 'i') {
            $('#' + this.dataTableObjectArray[this.selectedCell].name)
            .css("font-style", "italic")  
          } else if(e == "u") {
            $('#' + this.dataTableObjectArray[this.selectedCell].name + ' input')
            .css("text-decoration", "underline")
            $('#' + this.dataTableObjectArray[this.selectedCell].name)
            .css("text-decoration", "underline")
          }
        })
      }
    },
    change_fontcolor() {
      if(this.selected_array == 'textfield') {
        $('#' + this.objectArray[this.selected_array][this.selected_object].name + ' input.text-feild')
        .css("color", this.objectArray[this.selected_array][this.selected_object].style.font_color)
      } else {
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("color", this.objectArray[this.selected_array][this.selected_object].style.font_color)
      }
    },
    change_bordersize() {
      if(this.selected_array == 'table' || this.selected_array == 'datatable') {
        $('.' + this.objectArray[this.selected_array][this.selected_object].name + "-table")
        .css("border", this.objectArray[this.selected_array][this.selected_object].style.border_size + "px solid")
        this.change_bordercolor()
      } else {
        $('#' + this.objectArray[this.selected_array][this.selected_object].name + '-box')
        .css("border", this.objectArray[this.selected_array][this.selected_object].style.border_size + "px solid")
        this.change_bordercolor()
      }
    },
    change_bordercolor() {
      if(this.selected_array == 'table' || this.selected_array == 'datatable') {
        $('.' + this.objectArray[this.selected_array][this.selected_object].name + "-table")
        .css("border-color", this.objectArray[this.selected_array][this.selected_object].style.border_color)
      }
      else {
        $('#' + this.objectArray[this.selected_array][this.selected_object].name + '-box')
        .css("border-color", this.objectArray[this.selected_array][this.selected_object].style.border_color)
      }
    },
    change_backgroundcolor() {
      if(this.objectArray[this.selected_array][this.selected_object].style.background_color  == "#FFFFFF") {
        this.objectArray[this.selected_array][this.selected_object].style.background_color_select = {'r':255,'g':255,'b':255,'a':0}
      }
      var background_select = this.objectArray[this.selected_array][this.selected_object].style.background_color_select
      var color = 'rgba(' + background_select['r'] + ',' + background_select['g'] + ',' + background_select['b'] + ',' 
      + background_select['a'] + ')'
      this.objectArray[this.selected_array][this.selected_object].style.background_color = color
      $('#' + this.objectArray[this.selected_array][this.selected_object].name + '-box')
      .css("background-color", this.objectArray[this.selected_array][this.selected_object].style.background_color)
      if(this.selectedCell) {
        var background_select = this.dataTableObjectArray[this.selectedCell].style.background_color_select
        var color = 'rgba(' + background_select['r'] + ',' + background_select['g'] + ',' + background_select['b'] + ',' 
        + background_select['a'] + ')'
        this.dataTableObjectArray[this.selectedCell].style.background_color = color
      }
    },
    change_borderradias() {
      if(this.border_radias_value) {
        this.objectArray[this.selected_array][this.selected_object].style.border_radias = true
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("border-radius", "15px")
      } else {
        this.objectArray[this.selected_array][this.selected_object].style.border_radias = false
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("border-radius", "0px")
      }
    },
    change_row() {
      $('#' + this.objectArray[this.selected_array][this.selected_object].name)
      .css("height", ((this.objectArray[this.selected_array][this.selected_object].style.row *24) + 12) + "px")
    },
    change_dateformat() {
      if(!this.selectedCell) {
        if(this.objectArray[this.selected_array][this.selected_object].style.date_format == 'be'|| this.objectArray[this.selected_array][this.selected_object].style.date_format == 'cbe') {
          this.objectArray[this.selected_array][this.selected_object].show_value = this.setDateFormatBE(new Date().toISOString().substr(0, 10),this.objectArray[this.selected_array][this.selected_object].style.date_format)
        } else {
          this.objectArray[this.selected_array][this.selected_object].show_value = this.setDateFormatCE(new Date().toISOString().substr(0, 10))
        }
      } else {
        if(this.dataTableObjectArray[this.selectedCell].style.date_format == 'be'||this.dataTableObjectArray[this.selectedCell].style.date_format == 'cbe') {
          this.dataTableObjectArray[this.selectedCell].show_value = this.setDateFormatBE(new Date().toISOString().substr(0, 10),this.dataTableObjectArray[this.selectedCell].style.date_format)
        } else {
          this.dataTableObjectArray[this.selectedCell].show_value = this.setDateFormatCE(new Date().toISOString().substr(0, 10))
        }
      }
    },
    change_hidesection() {
      var obj_id = '#' +this.objectArray[this.selected_array][this.selected_object].name
      if(this.hidesection) {
        $(obj_id + '-section-box').css("border", 'dashed 3px #7CB342')
      } else {
        $(obj_id + '-section-box').css("border", 'dashed 0px #7CB342')
      }
      this.objectArray[this.selected_array][this.selected_object].style.hidesection = this.hidesection
    },
    change_crow() { 
      var temp_size_array = []
      var count = this.objectArray[this.selected_array][this.selected_object].style.table.crow
      var ex_count = this.objectArray[this.selected_array][this.selected_object].style.table.rowsize.length
      var ccol = this.objectArray[this.selected_array][this.selected_object].style.table.colsize.length
      var objName = this.objectArray[this.selected_array][this.selected_object].object_name
      if(this.selected_array == 'datatable') {
        this.changeDataTableRow(objName, count, ex_count, ccol)
      }
      if(this.objectArray[this.selected_array][this.selected_object].style.table.rowsize.length < count) {
        var len = this.objectArray[this.selected_array][this.selected_object].style.table.rowsize.length
        count = count - this.objectArray[this.selected_array][this.selected_object].style.table.rowsize.length
        for(var i = 0; i < count; i++) {
          this.objectArray[this.selected_array][this.selected_object].style.table.rowsize.push({
            index:len + (i+1),
            size:50
          })
        }
      } else if(this.objectArray[this.selected_array][this.selected_object].style.table.rowsize.length > count) {
        for(var i = 0; i < count; i++) {
          temp_size_array.push(this.objectArray[this.selected_array][this.selected_object].style.table.rowsize[i])
        }
        this.objectArray[this.selected_array][this.selected_object].style.table.rowsize = temp_size_array
      }
      this.change_bordersize()
    },
    changeConTable(checkObj) {
      var contTable = ""
      this.objectType.every(e => {
        var checkInArray = this.objectArray[e].find(item => item.object_name == checkObj.style.contTable)
        if(checkInArray) {
          contTable = checkInArray
          contTable.object_type = e
          return false
        } else {
          return true
        }
      })
      // var contTable = this.objectArray[checkObj.object_type].find(item => item.object_name == checkObj.style.contTable)
      if(contTable) { 
        var indx = this.objectArray[contTable.object_type].indexOf(contTable)
        var element = document.getElementsByClassName(checkObj.name + "-obj")[0]
        var rect = element.getBoundingClientRect()
        var element2 = document.getElementById(this.objectArray[contTable.object_type][indx].name)
        var rect2 = element2.getBoundingClientRect()
        var paper = document.getElementById("workpaper")
        var paperRect = paper.getBoundingClientRect()
        element2.style.top = String(rect.top - paperRect.top + rect.height -1) + "px"
        if(contTable.style.contTable && contTable.style.contTable != checkObj.object_name) {
          this.changeConTable(contTable)
        }
      }
    },
    changeDataTableRow(objName, crow, ex_crow, ccol) {
      var colCount = parseInt(ccol)
      if(parseInt(ex_crow) > parseInt(crow)) {
        for(let j=parseInt(ex_crow); j> parseInt(crow); j--) {
          for(let i=1; i<= colCount; i++) {
            // delete this.dataTableObjectArray[objName + "_" + "R" + j + "C" + i];
          }
        }
      } 
      else if( parseInt(ex_crow) <  parseInt(crow)) {
        for(let j=parseInt(ex_crow)+ 1 ; j<= parseInt(crow); j++) {
          for(let i=1; i<= colCount; i++) {
            this.addDatatableObject('link_data_box', objName, j, i)
          }
        }
      }
    },
    change_ccol() {
      var temp_size_array = []
      var count = this.objectArray[this.selected_array][this.selected_object].style.table.ccol
       var ex_count = this.objectArray[this.selected_array][this.selected_object].style.table.colsize.length
      var crow = this.objectArray[this.selected_array][this.selected_object].style.table.rowsize.length
      var objName = this.objectArray[this.selected_array][this.selected_object].object_name
      if(this.selected_array == 'datatable') {
        this.changeDataTableCol(objName, count, ex_count, crow)
      }
      if(this.objectArray[this.selected_array][this.selected_object].style.table.colsize.length < count) {
        var len = this.objectArray[this.selected_array][this.selected_object].style.table.colsize.length
        count = count - this.objectArray[this.selected_array][this.selected_object].style.table.colsize.length
        for(var i = 0; i < count; i++) {
          this.objectArray[this.selected_array][this.selected_object].style.table.colsize.push({
            index:len + (i+1),
            size:200
          })
        }
      } else if(this.objectArray[this.selected_array][this.selected_object].style.table.colsize.length > count) {
        for(var i = 0; i < count; i++) {
          temp_size_array.push(this.objectArray[this.selected_array][this.selected_object].style.table.colsize[i])
        }
        this.objectArray[this.selected_array][this.selected_object].style.table.colsize = temp_size_array
      }
      this.change_bordersize()
    },
    changeDataTableCol(objName, ccol, ex_ccol, crow) {
      var rowCount = parseInt(crow)
      if(parseInt(ex_ccol) > parseInt(ccol)) {
        for(let j=parseInt(ex_ccol); j> parseInt(ccol); j--) {
          for(let i=1; i<= rowCount; i++) {
            delete this.dataTableObjectArray[objName + "_" + "R" + i + "C" + j];
          }
        }
      } 
      else if( parseInt(ex_ccol) <  parseInt(ccol)) {
        for(let j=parseInt(ex_ccol)+ 1 ; j<= parseInt(ccol); j++) {
          for(let i=1; i<= rowCount; i++) {
            this.addDatatableObject('link_data_box', objName, i, j)
          }
        }
      }
    },
    changeDataTableCol(objName, ccol, ex_ccol, crow) {
      var rowCount = parseInt(crow)
      if(parseInt(ex_ccol) > parseInt(ccol)) {
        // for(let j=parseInt(ex_ccol); j> parseInt(ccol); j--) {
        //   for(let i=1; i<= rowCount; i++) {
        //     // delete this.dataTableObjectArray[objName + "_" + "R" + i + "C" + j];
        //   }
        // }
      } 
      else if( parseInt(ex_ccol) <  parseInt(ccol)) {
        for(let j=parseInt(ex_ccol)+ 1 ; j<= parseInt(ccol); j++) {
          for(let i=1; i<= rowCount; i++) {
            this.addDatatableObject('link_data_box', objName, i, j)
          }
        }
      }
    },
    change_logictype() {
      var fx = this.objectArray[this.selected_array][this.selected_object].style.validate.fx 
      if(fx == 'bet' || fx == 'betge' || fx == 'betle' || fx == 'beteq') {
        this.betValue = true
      } else {
        this.betValue = false
      }
    },
    change_numberonly() {
      this.objectArray[this.selected_array][this.selected_object].style.validate = {value:"", value2: "", fx: ""}
    },
    change_lineside() {
      var obj_name = this.objectArray[this.selected_array][this.selected_object].name
      var area = document.getElementById(obj_name)
      var rect = area.getBoundingClientRect()
      if(this.objectArray[this.selected_array][this.selected_object].style.line_set == 'l') {
        if(rect.height > rect.width) {
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("width", String(rect.height)+"px")
        } else {
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("width", String(rect.width)+"px")
        }
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("height", String( parseInt(this.objectArray[this.selected_array][this.selected_object].style.border_size)+20)+"px")
       
        if(this.objectArray[this.selected_array][this.selected_object].style.isResize) {
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable('destroy')
        }
        $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'e,w'})
      } else {
        if(rect.width > rect.height) {
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("height", String(rect.width)+"px")
        } else {
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("height", String(rect.height)+"px")
        } 
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("width", String( parseInt(this.objectArray[this.selected_array][this.selected_object].style.border_size)+20)+"px")
        if(this.objectArray[this.selected_array][this.selected_object].style.isResize) {
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable('destroy')
        }
        $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable({handles: 'n,s'})
      }
    },
    change_linesize() {
      var size = parseInt(this.objectArray[this.selected_array][this.selected_object].style.border_size)
      if(this.objectArray[this.selected_array][this.selected_object].style.line_set == 'l') {
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("height", String(size+20)+"px")
      } else {
        $('#' + this.objectArray[this.selected_array][this.selected_object].name)
        .css("width", String(size+20)+"px")
      }
    },
    calColSize() {
      if(this.selected_array != 'datatable') {
        var sumSize = 0
        this.objectArray[this.selected_array][this.selected_object].style.table.colsize.forEach(e => {
          if(Number(sumSize) > Number(this.current_paper_width)) {
            e.size = 0
          } else {
            if(Number(sumSize) + Number(e.size) > Number(this.current_paper_width)) {
              e.size = Number(this.current_paper_width) - Number(sumSize)
            }
          }
          sumSize += Number(e.size)
        })
      }
    },
    selectPlain() {
      this.selectedCell = ''
      this.background_color_menu = false
      CrtlEventHandle = false
      if(this.selectedObjectGroup.length) {
        this.selectedObjectGroup.forEach(e => {
          $('#' + this.objectArray[e.obj_array][e.obj_index].name).css("outline-color", "")
          $('#' + this.objectArray[e.obj_array][e.obj_index].name).css("outline-style", "")
        })
        this.selectedObjectGroup = []
      }

      if(this.selected_array != 'paper' && this.selected_array != null) {
        if(this.objectArray[this.selected_array][this.selected_object].style.isResize) {
          $('#' + this.objectArray[this.selected_array][this.selected_object].name).resizable('destroy')
        }
        $('#' + this.objectArray[this.selected_array][this.selected_object].name).draggable('destroy')
        $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("cursor","default")
        $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("outline-color", "")
        $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("outline-style", "")
        this.objectArray[this.selected_array][this.selected_object].selected = false
        this.selected_array = 'paper'
        this.selected_object = 0
        this.objectArray['textfield'].forEach(e=> {
          if(e.page != this.currentPage) {
            $('#' + e.name).css("z-index","1")
          }
        })
        this.objectArray['inputbox'].forEach(e=> {
          if(e.page != this.currentPage) {
            $('#' + e.name).css("z-index","1")
          }
        })
        this.objectArray['autofillbox'].forEach(e=> {
          if(e.page != this.currentPage) {
            $('#' + e.name).css("z-index","1")
          }
        })
        this.objectArray['calculatebox'].forEach(e=> {
          if(e.page != this.currentPage) {
            $('#' + e.name).css("z-index","1")
          }
        })
        this.objectArray['datepickerbox'].forEach(e=> {
          if(e.page != this.currentPage) {
            $('#' + e.name).css("z-index","1")
          }
        })
        this.objectArray['datatable'].forEach(e=> {
          if(e.page != this.currentPage) {
            $('#' + e.name).css("z-index","1")
          }
        })
        this.objectArray['timebox'].forEach(e=> {
          if(e.page != this.currentPage) {
            $('#' + e.name).css("z-index","1")
          }
        })
        this.objectArray['line'].forEach(e=> {
          if(e.page != this.currentPage) {
            $('#' + e.name).css("z-index","1")
          }
          e.style.line_focus = "0"
        })
        this.custom_object_name = false
        this.custom_object_fontsize = false
        this.custom_object_font = false
        this.custom_object_fontcolor = false
        this.custom_object_bordercolor = false
        this.custom_object_bordersize = false
        this.custom_object_backgroundcolor = false
        this.custom_object_boxwidth = false
        this.custom_object_boxheight = false
        this.custom_object_borderradias = false
        this.custom_object_placholder = false
        this.custom_object_row = false
        this.custom_object_choices = false
        this.custom_object_datestyle = false
        this.custom_object_timestyle = false
        this.custom_object_timeseccond = false
        this.custom_object_radiocolor = false
        this.custom_object_text = false
        this.custom_object_databind = false
        this.custom_object_mandatory = false
        this.custom_object_function = false
        this.custom_object_isnumber = false
        this.custom_object_permission = false
        this.custom_object_hidesection = false
        this.custom_object_suffix = false
        this.custom_object_rowcount = false
        this.custom_object_colcount = false
        this.custom_object_colsetting = false
        this.custom_object_rowsetting = false
        this.custom_object_excel = false
        this.custom_object_linecolor = false
        this.custom_object_linesize = false
        this.custom_object_lineside = false
        this.custom_object_decimal = false
        this.custom_object_defaultvalue = false
        this.custom_object_datatablesetting = false
        this.custom_object_addtable = false
        this.custom_object_cellname = false
        this.custom_object_celltype = false
        this.custom_object_align = false
        this.custom_object_textareavaliable = false
        this.custom_object_addtable = false
        this.custom_object_refpermission = false
        this.custom_object_refvalue = false
        this.custom_object_n2tdecimal = false
        this.custom_cell_text = false
        this.custom_cell_fontsize =  false
        this.custom_cell_font =  false
        this.custom_cell_fontcolor =  false
        this.custom_cell_placholder =  false
        this.custom_cell_choices = false
        this.custom_cell_databind = false
        this.custom_cell_timestyle = false
        this.custom_cell_timeseccond = false
        this.custom_cell_mandatory = false
        this.custom_cell_isnumber = false
        this.custom_cell_decimal = false
        this.custom_cell_defaultvalue = false
        this.custom_cell_excel = false
        this.custom_cell_suffix = false
        this.custom_cell_permission = false
        this.custom_cell_datestyle = false
        this.custom_cell_function = false
        this.custom_object_textareavaliable = false
        this.custom_cell_nodata = false
        this.custom_object_fixedValue = false
      }
    },
    getSectionPermission() {
      // this.getAllPermission()
      this.allPermissionSection = [{text: this.textLang.dropdown.no_setting , value: ''}]
      this.all_permission.forEach(e => {
        if(e.value.object_name != this.objectArray[this.selected_array][this.selected_object].object_name) {
          this.allPermissionSection.push(e.value.object_name)
        }
      })
    },
    addPermList(isSender) {
      if(isSender) {
        if(this.step_sender.byRole) {
          this.step_sender.value_email = []
          if(this.selectedPermRole.role_name == 'leader-user') {
            this.step_sender.value_role = []
          } else if(this.step_sender.value_role.find(item => item.text == 'leader-user')) {
            this.step_sender.value_role = []
          }
          this.step_sender.value_role.push(this.selectedPermRole)
          this.selectedPermRole = ''
        } else {
          this.step_sender.value_role = []
          this.step_sender.value_email.push(this.selectedPermEmail)
          this.selectedPermEmail = ''
        }
      } else {
        this.objectArray[this.selected_array][this.selected_object].style.permission.ref = ""
        if(this.objectArray[this.selected_array][this.selected_object].style.permission.byRole) {
          this.objectArray[this.selected_array][this.selected_object].style.permission.value_email = []
          if(this.selectedPermRole.role_name == 'leader-user') {
            this.objectArray[this.selected_array][this.selected_object].style.permission.value_role = []
          } else if(this.objectArray[this.selected_array][this.selected_object].style.permission.value_role.find(item => item.text == 'leader-user')) {
            this.objectArray[this.selected_array][this.selected_object].style.permission.value_role = []
          }
          var newPerm = {
            text:this.selectedPermRole.role_name, value:this.selectedPermRole
          }
          var mapRole = this.objectArray[this.selected_array][this.selected_object].style.permission.value_role.map(x => x.text)
          if(!mapRole.includes(this.selectedPermRole.role_name) && this.selectedPermRole) {
            this.objectArray[this.selected_array][this.selected_object].style.permission.value_role.push(newPerm)
          }
          this.selectedPermRole = ''
        } else {
          this.objectArray[this.selected_array][this.selected_object].style.permission.value_role = []
          var newPerm = {
            text:this.selectedPermEmail, value:this.selectedPermEmail
          }
          var mapEmail = this.objectArray[this.selected_array][this.selected_object].style.permission.value_email.map(x => x.text)
          if(!mapEmail.includes(this.selectedPermEmail) && this.selectedPermEmail) {
            this.objectArray[this.selected_array][this.selected_object].style.permission.value_email.push(newPerm)
          }
          this.selectedPermEmail = ''
        }
      }
    },
    deletePermList(item,isSender) {
      if(isSender) {
        if(this.step_sender.byRole) {
          var index = this.step_sender.value_role.indexOf(item)
          this.step_sender.value_role.splice(index,1)
        } else {
          var index = this.step_sender.value_email.indexOf(item)
          this.step_sender.value_email.splice(index,1)
        }
      } else {
        if(this.objectArray[this.selected_array][this.selected_object].style.permission.byRole) {
          var index = this.objectArray[this.selected_array][this.selected_object].style.permission.value_role.indexOf(item)
          this.objectArray[this.selected_array][this.selected_object].style.permission.value_role.splice(index,1)
        } else {
          var index = this.objectArray[this.selected_array][this.selected_object].style.permission.value_email.indexOf(item)
          this.objectArray[this.selected_array][this.selected_object].style.permission.value_email.splice(index,1)
        }
      }
    },
    addChoices() {
      if(!(typeof this.choice === "undefined")){
        if(this.selected_array == 'datatable') {
          if(this.choice != "" && this.choice != null) {
            if(typeof this.dataTableObjectArray[this.selectedCell].choices == 'undefined') {
              this.dataTableObjectArray[this.selectedCell].choices = []
            }
            this.dataTableObjectArray[this.selectedCell].choices.push(this.choice)
            this.choice = ""
          }
        } else {
          if(this.choice != "" && this.choice != null) {
            this.objectArray[this.selected_array][this.selected_object].choices.push(this.choice)
            this.choice = ""
          }
        }
      }
    },
    deleteChoices(item) {
      if(this.selected_array == 'datatable') {
        var index = this.dataTableObjectArray[this.selectedCell].choices.indexOf(item)
        this.dataTableObjectArray[this.selectedCell].choices.splice(index,1)
        this.dataTableObjectArray[this.selectedCell].object_type = 'textfield'
        this.dataTableObjectArray[this.selectedCell].object_type = 'dropdownbox'
      } else {
        var index = this.objectArray[this.selected_array][this.selected_object].choices.indexOf(item)
        this.objectArray[this.selected_array][this.selected_object].choices.splice(index,1)
      }
    },
    addTextAreaValiable() {
      if(!(typeof this.textAreaValiable === "undefined")){
        if(this.textAreaValiable != "" && this.textAreaValiable != null) {
          if(typeof this.objectArray[this.selected_array][this.selected_object].style.textAreaValiable === 'undefined') {
            this.objectArray[this.selected_array][this.selected_object].style.textAreaValiable = []
          }
          if(!this.objectArray[this.selected_array][this.selected_object].style.textAreaValiable.includes({text:this.textAreaValiable , value: ""})) {
            this.objectArray[this.selected_array][this.selected_object].style.textAreaValiable.push({text:this.textAreaValiable , value: ""})
          }
          var textValue = this.objectArray[this.selected_array][this.selected_object].value
          textValue = String(textValue) + '[$' + this.textAreaValiable + ']'
          this.objectArray[this.selected_array][this.selected_object].value = textValue
          this.textAreaValiable = ""
        }
      }
    },
    deleteTextAreaValiable(item) {
      var index = this.objectArray[this.selected_array][this.selected_object].style.textAreaValiable.indexOf(item)
      this.objectArray[this.selected_array][this.selected_object].style.textAreaValiable.splice(index,1)
      var textValue = this.objectArray[this.selected_array][this.selected_object].value.split('[$' + item.text + ']').join('')
      this.objectArray[this.selected_array][this.selected_object].value = textValue
    },
    addCheckGroup() {
      if(this.selectedCell) {
        if(this.dataTableObjectArray[this.selectedCell] != this.selectedCheckGroup) {
          this.dataTableObjectArray[this.selectedCell].style.checkBoxGroup.push(this.selectedCheckGroup)
          this.selectedCheckGroup = ""
          var tmpObj = this.dataTableObjectArray[this.selectedCell]
          var tempGroup = []
          tmpObj.style.checkBoxGroup.forEach(e => {
            tempGroup.push(e)
          })
          tempGroup.push(tmpObj.object_name)
          tempGroup.forEach(e => {
            if(e.startsWith('datatable')) {
              tempGroup.forEach(e2 => {
                if(!this.dataTableObjectArray[e].style.checkBoxGroup.includes(e2) && e2 != this.dataTableObjectArray[e].object_name){
                  this.dataTableObjectArray[e].style.checkBoxGroup.push(e2)
                }
              })
            } else {
              this.objectArray['checkbox'].find(obj => {
                if (obj.object_name == e) {
                  tempGroup.forEach(e2 => {
                    if(!obj.style.checkBoxGroup.includes(e2) && e2 != obj.object_name){
                      obj.style.checkBoxGroup.push(e2)
                    }
                  })
                }
              })
            }
          })
        }
      } else {
        if(this.objectArray[this.selected_array][this.selected_object].object_name != this.selectedCheckGroup) {
          this.objectArray[this.selected_array][this.selected_object].style.checkBoxGroup.push(this.selectedCheckGroup)
          this.selectedCheckGroup = ""
          var tmpObj = this.objectArray[this.selected_array][this.selected_object]
          var tempGroup = []
          tmpObj.style.checkBoxGroup.forEach(e => {
            tempGroup.push(e)
          })
          tempGroup.push(tmpObj.object_name)
          tempGroup.forEach(e => {
            if(e.startsWith('datatable')) {
              tempGroup.forEach(e2 => {
                if(!this.dataTableObjectArray[e].style.checkBoxGroup.includes(e2) && e2 != this.dataTableObjectArray[e].object_name){
                  this.dataTableObjectArray[e].style.checkBoxGroup.push(e2)
                }
              })
            } else {
              this.objectArray['checkbox'].find(obj => {
                if (obj.object_name == e) {
                  tempGroup.forEach(e2 => {
                    if(!obj.style.checkBoxGroup.includes(e2) && e2 != obj.object_name){
                      obj.style.checkBoxGroup.push(e2)
                    }
                  })
                }
              })
            }
          })
        }
      }
    },
    addNewViewer() {
      if(typeof this.docOption.viewers === 'undefined') {
        this.docOption.viewers = []
      }
      if(!this.docOption.viewers.includes(this.addViewer)) {
        this.docOption.viewers.push(this.addViewer)
      }
      this.addViewer = ""
    },
    deleteNewViewer(item) {
      if(typeof this.docOption.viewers === 'undefined') {
        this.docOption.viewers = []
      }
      var indx = this.docOption.viewers.indexOf(item)
      if(indx >= 0) {
        this.docOption.viewers.splice(indx, 1)
      }
    },
    deleteCheckGroup(item) {
      if(this.selectedCell) {
        var ind = this.dataTableObjectArray[this.selectedCell].style.checkBoxGroup.indexOf(item)
        this.dataTableObjectArray[this.selectedCell].style.checkBoxGroup.splice(ind,1)
      } else {
        var ind = this.objectArray[this.selected_array][this.selected_object].style.checkBoxGroup.indexOf(item)
        this.objectArray[this.selected_array][this.selected_object].style.checkBoxGroup.splice(ind,1)
      }
      // this.objectArray['checkbox'].find(obj => {
      //   if (obj.object_name == item) {
      //     obj.style.checkBoxGroup = []
      //   }
      // })
      // this.objectArray['checkbox'].forEach(e => {
      //   if(this.objectArray[this.selected_array][this.selected_object].style.checkBoxGroup.includes(e.object_name)) {
      //     let indx = e.style.checkBoxGroup.indexOf(item)
      //     e.style.checkBoxGroup.splice(indx,1)
      //   }
      // })
    },
    deleteObjectRoleList(obj, item, delItem) {
      if(obj == 'datatable') {
        if(typeof this.dataTableObjectArray[item].style.role_id === 'undefined') {
          this.objectArray[obj][indx].style.role_id = []
        }
        var roleIndx = this.dataTableObjectArray[item].style.role_id.indexOf(delItem)
        this.dataTableObjectArray[item].style.role_id.splice(roleIndx,1)
      } else {
        var indx = this.objectArray[obj].indexOf(item)
        if(typeof this.objectArray[obj][indx].style.role_id === 'undefined') {
          this.objectArray[obj][indx].style.role_id = []
        }
        var roleIndx = this.objectArray[obj][indx].style.role_id.indexOf(delItem)
        this.objectArray[obj][indx].style.role_id.splice(roleIndx,1)
      }
    },
    addAllObjectRoleList() {
      if(this.selectedObjectRole) {
        this.objectTypeInput.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            if(!e2.isPre && !e2.deleted) {
              if(typeof e2.style.role_id === 'undefined') {
                e2.style.role_id = []
              }
              if(!e2.style.role_id.includes(this.selectedObjectRole.role_name)) {
                e2.style.role_id.push(this.selectedObjectRole.role_name)
              }
            }
          })
        })
        this.datatableRoleCell.forEach(e => {
          if(typeof this.dataTableObjectArray[e].style.role_id === 'undefined') {
            this.dataTableObjectArray[e].style.role_id = []
          }
          if(!this.dataTableObjectArray[e].style.role_id.includes(this.selectedObjectRole.role_name)) {
            this.dataTableObjectArray[e].style.role_id.push(this.selectedObjectRole.role_name)
          }
        })
        this.selectedObjectRole = ""
      }
    },
    addObjectEmailList(obj, item) {
      if(obj == 'datatable') {
        if(this.selectedObjectEmail) {
          if(typeof this.dataTableObjectArray[item].style.email_report === 'undefined') {
            this.dataTableObjectArray[item].style.email_report = []
          }
          if(!this.dataTableObjectArray[item].style.email_report.includes(this.selectedObjectEmail)) {
            this.dataTableObjectArray[item].style.email_report.push(this.selectedObjectEmail)
          }
          this.selectedObjectEmail = ""
        }
      } else {
        var indx = this.objectArray[obj].indexOf(item)
        if(this.selectedObjectEmail) {
          if(typeof this.objectArray[obj][indx].style.email_report === 'undefined') {
            this.objectArray[obj][indx].style.email_report = []
          }
          if(!this.objectArray[obj][indx].style.email_report.includes(this.selectedObjectEmail)) {
            this.objectArray[obj][indx].style.email_report.push(this.selectedObjectEmail)
          }
          this.selectedObjectEmail = ""
        }
      }
    },
    deleteObjectEmailList(obj, item, delItem) {
      if(obj == 'datatable') {
        if(typeof this.dataTableObjectArray[item].style.email_report === 'undefined') {
          this.dataTableObjectArray[item].style.email_report = []
        }
        var emailIndx = this.dataTableObjectArray[item].style.email_report.indexOf(delItem)
        this.dataTableObjectArray[item].style.email_report.splice(emailIndx,1)
        this.dialogObjectRole = false
        this.dialogObjectRole = true
      } else {
        var indx = this.objectArray[obj].indexOf(item)
        if(typeof this.objectArray[obj][indx].style.email_report === 'undefined') {
          this.objectArray[obj][indx].style.email_report = []
        }
        var emailIndx = this.objectArray[obj][indx].style.email_report.indexOf(delItem)
        this.objectArray[obj][indx].style.email_report.splice(emailIndx,1)
        this.dialogObjectRole = false
        this.dialogObjectRole = true
      }
    },
    addAllObjectEmailList() {
      if(this.selectedObjectEmail) {
        this.objectTypeInput.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            if(!e2.isPre && !e2.deleted) {
              if(typeof e2.style.email_report === 'undefined') {
                e2.style.email_report = []
              }
              if(!e2.style.email_report.includes(this.selectedObjectEmail)) {
                e2.style.email_report.push(this.selectedObjectEmail)
              }
            }
          })
        })
        this.datatableRoleCell.forEach(e => {
          if(typeof this.dataTableObjectArray[e].style.email_report === 'undefined') {
            this.dataTableObjectArray[e].style.email_report = []
          }
          if(!this.dataTableObjectArray[e].style.email_report.includes(this.selectedObjectEmail)) {
            this.dataTableObjectArray[e].style.email_report.push(this.selectedObjectEmail)
          }
        })
        this.selectedObjectEmail = ""
      }
    },
    getSection(position_top) {
      var body_area = document.getElementById('body-area')
      var body_rect = body_area.getBoundingClientRect()
      var footer_area = document.getElementById('footer-area')
      var footer_rect = footer_area.getBoundingClientRect()
      var section = "body"
      if(position_top <= body_rect.top) {
        section =  "header"
      } else if (position_top >= footer_rect.top) {
        section =  "footer"
      } else {
        section =  "body"
      }
      return section
    },
    getAllPermission() {
      var temp_all_permission = []
      var temp_order_permission = []
      var index_count= 1
      this.objectType.forEach( e=> {
        if(e == 'inputbox' || e == 'textareabox' || e == 'texteditorbox' || e == 'dropdownbox' || e == 'datepickerbox'|| e == 'checkbox'
        || e == 'autofillbox' || e == 'calculatebox' || e == 'sectionbox' || e == 'timebox' || e == 'signbox' || e == 'inputimagebox') {
          this.objectArray[e].forEach(e2 => {
            if(typeof e2 !== 'undefined' && !e2.style.refPermission && !e2.deleted) {
              if(e2.style.refOrder) {
                temp_all_permission.push({text:e2.object_name +  this.textLang.set_format_form.permission_step + e2.style.permission.ref + ")", value: {object_name:e2.object_name, permission:e2.style.permission, isEditable: true}})
                temp_order_permission.push({object_name:e2.object_name, permission:e2.style.permission, isEditable: true})
                index_count++
              } else if(e2.style.permission.byRole && !e2.style.refOrder) {
                if(e2.style.permission.value_role.length  && e2.style.permission.value_role != undefined) {
                  var allRole = ''
                  e2.style.permission.value_role.forEach(e3 => {
                    allRole += e3.value.role_name + ','
                  })
                  temp_all_permission.push({text:e2.object_name + " (" + allRole + ")", value: {object_name:e2.object_name, permission:e2.style.permission, isEditable: true}})
                  temp_order_permission.push({object_name:e2.object_name, permission:e2.style.permission, isEditable: true})
                  index_count++
                }
              } else if(!e2.style.permission.byRole && !e2.style.refOrder) {
                if(e2.style.permission.value_email.length  && e2.style.permission.value_email != undefined) {
                  var allEmail = ''
                  e2.style.permission.value_email.forEach(e3 => {
                    allEmail += e3.value + ','
                  })
                  temp_all_permission.push({text:e2.object_name + " (" + allEmail + ")", value: {object_name:e2.object_name, permission:e2.style.permission, isEditable: true}})
                  temp_order_permission.push({object_name:e2.object_name, permission:e2.style.permission, isEditable: true })
                  index_count++
                }
              }
            }
          })
        }
      })

      var temp_op = []
      this.order_permission.forEach(e => {
        temp_order_permission.forEach(e2 => {
          if(e2.object_name == e.value.object_name) {
            var foundIndex = temp_all_permission.findIndex(temp => temp.value.object_name == e.value.object_name)
            temp_all_permission[foundIndex].value.isEditable = e.value.isEditable
            var e3 = e2
            e3.isEditable = e.value.isEditable
            if(!e.blockEmail) {
              e.blockEmail = []
            }
            temp_op.push({value:e3, choices:e.choices, observe: e.observe, choicesSet: e.choicesSet ,blockEmail: e.blockEmail})
            var index = temp_order_permission.indexOf(e2)
            temp_order_permission.splice(index,1)
          }
        })
      })
      this.order_permission = []

      temp_order_permission.forEach(e => {
        temp_op.push({value:e, choices:[], observe: [], choicesSet: false, blockEmail: []})
      })
      temp_op.forEach(e => {
        if(temp_order_permission.length) {
          e.choicesSet = false
        }
        if(!e.blockEmail) {
          e.blockEmail = []
        }
        this.order_permission.push({index: "0", value: e.value, choices:e.choices, observe: e.observe, choicesSet: e.choicesSet, blockEmail: e.blockEmail})
      })
      
      this.step_can_see = []
      this.step_api_send = []
      this.senderRef = []
      for(let i=0; i < this.order_permission.length; i++) {
        this.order_permission[i].index = i + 1
      }
      var tempOrderMessage = []
      for(let i=0; i < this.order_permission.length; i++) {
        if(typeof this.orderMessage[i] !== 'undefined') {
          tempOrderMessage.push(this.orderMessage[i])
        } else {
          tempOrderMessage.push('')
        }
        if(this.order_permission[i].choices.includes(this.order_permission[i].index)) {
          this.order_permission[i].choicesSet = false
        }
        if(!this.order_permission[i].choicesSet) {
          this.order_permission[i].choices = []
          this.order_permission[i].observe = []
          for(let j=0; j < this.order_permission.length; j++) {
            if((j + 1) != this.order_permission[i].index) {
              this.order_permission[i].choices.push(j+1)
              this.order_permission[i].observe.push(j+1)
            }
          }
          this.order_permission[i].choicesSet = true
        }
        this.step_api_send.push(i+1)
        this.senderRef.push(i+1)
      }
      this.step_api_send.push(this.order_permission.length+1)
      var currentWebhook = this.webhookUrl[0].sendStep
      this.webhookUrl[0].sendStep = []
      currentWebhook.forEach(e => {
        if(this.step_api_send.includes(e)) {
          this.webhookUrl[0].sendStep.push(e)
        }
      })
      this.orderMessage = tempOrderMessage
      this.all_permission = temp_all_permission
      this.caStep = false
      this.objectArray['signbox'].forEach( e => {
        if(typeof e !== 'undefined' && e.style.isCa && !e.deleted) {
          this.caStep = true
        }
      })
    },
    getRefOrder() {
      if(this.objectArray[this.selected_array][this.selected_object].style.refOrder) {
        this.objectArray[this.selected_array][this.selected_object].style.permission.byRole = false
        this.objectArray[this.selected_array][this.selected_object].style.permission.value_role = []
        this.objectArray[this.selected_array][this.selected_object].style.permission.value_email = []
        var currentOrder = this.order_permission.find(item => item.value.object_name == this.objectArray[this.selected_array][this.selected_object].object_name)
        if(currentOrder) {
          var index = currentOrder.index
          this.refOrders = []
          for(var i=1; i< index; i++) {
            this.refOrders.push({text: this.textLang.set_format_form.step + i, value: i})
          }
          if(!this.objectArray[this.selected_array][this.selected_object].style.permission.ref && this.refOrders.length) {
            this.objectArray[this.selected_array][this.selected_object].style.permission.ref = this.refOrders[0].value
          }
        }
      }
    },
    getPermissionSection(selArray, selObj) {
      if(selArray != 'datacell') {
        var element = document.getElementById(this.objectArray[selArray][selObj].name)
        var position = element.getBoundingClientRect()
        for(var i=0; i<this.objectArray['sectionbox'].length-1; i++) {
          if(this.objectArray['sectionbox'][i].style.permission_step && this.objectArray['sectionbox'][i].page == this.currentPage) {
            var section = document.getElementById(this.objectArray['sectionbox'][i].name + '-section-box')
            var section_rect = section.getBoundingClientRect()
            if(position.top > section_rect.top && position.top < (section_rect.top + section_rect.height)) {
              if(position.left > section_rect.left && position.left < (section_rect.left + section_rect.width)) {
                if(!this.objectArray[selArray][selObj].style.permission_step) {
                  this.objectArray[selArray][selObj].style.permission_step_section = this.objectArray['sectionbox'][i].style.permission_step
                } else {
                  this.objectArray[selArray][selObj].style.permission_step_section = ""
                }
              } 
            }
          }
        }
      } else {
        var element = document.getElementById(this.dataTableObjectArray[selObj].name)
        var position = element.getBoundingClientRect()
        for(var i=0; i<this.objectArray['sectionbox'].length-1; i++) {
          this.objectArray['sectionbox'][i].show = true
          if(this.objectArray['sectionbox'][i].style.permission_step && this.dataTableObjectArray[selObj].page == this.objectArray['sectionbox'][i].page) {
            var section = document.getElementById(this.objectArray['sectionbox'][i].name + '-section-box')
            var section_rect = section.getBoundingClientRect()
            if(position.top >= section_rect.top && position.top <= (section_rect.top + section_rect.height)) {
              if(position.left >= section_rect.left && position.left <= (section_rect.left + section_rect.width)) {
                if(!this.dataTableObjectArray[selObj].style.permission_step) {
                  this.dataTableObjectArray[selObj].style.permission_step_section = this.objectArray['sectionbox'][i].style.permission_step
                } else {
                  this.dataTableObjectArray[selObj].style.permission_step_section = ""
                }
              }
            }
          }
          if(this.objectArray['sectionbox'][i].page != this.currentPage) {
            this.objectArray['sectionbox'][i].show = false
          }
        }
      }
    },
    swapPage(source,des) {
      this.objectType.forEach(e => {
        this.objectArray[e].forEach(e2 => {
          var changed = true
          if(e2.page == source && changed) {
            e2.page = des
            changed = false
          } else if(e2.page == des && changed){
            e2.page  = source
            changed = false
          }
        })
      })
    },
    async checkInvalidSection() {
      var isIntersect = false
      for(var p=1; p<=this.pages.length; p++) {
        await this.moveToPage(p)
        for(var i=0; i<this.objectArray['sectionbox'].length-1; i++) {
          if(typeof this.objectArray['sectionbox'][i] !== 'undefined' &&this.objectArray['sectionbox'][i].page == this.currentPage && !this.objectArray['sectionbox'][i].deleted) {
            for(var j=i+1; j<this.objectArray['sectionbox'].length-1; j++) {
              if(this.objectArray['sectionbox'][i].page == this.objectArray['sectionbox'][j].page) {
                var sectionA = document.getElementById(this.objectArray['sectionbox'][i].name + '-section-box')
                var sectionA_rect = sectionA.getBoundingClientRect()
                var sectionB = document.getElementById(this.objectArray['sectionbox'][j].name + '-section-box')
                var sectionB_rect = sectionB.getBoundingClientRect()
                if(sectionB_rect.top >= sectionA_rect.top && sectionB_rect.top <= (sectionA_rect.top + sectionA_rect.height)) {
                  if(sectionB_rect.left >= sectionA_rect.left && sectionB_rect.left <= (sectionA_rect.left + sectionA_rect.width)) {
                    isIntersect = true
                  } else if(sectionA_rect.left >= sectionB_rect.left && sectionA_rect.left <= (sectionB_rect.left + sectionB_rect.width)) {
                    isIntersect = true
                  }
                } else if(sectionA_rect.top >= sectionB_rect.top && sectionA_rect.top <= (sectionB_rect.top + sectionB_rect.height)) {
                  if(sectionB_rect.left >= sectionA_rect.left && sectionB_rect.left <= (sectionA_rect.left + sectionA_rect.width)) {
                    isIntersect = true
                  } else if(sectionA_rect.left >= sectionB_rect.left && sectionA_rect.left <= (sectionB_rect.left + sectionB_rect.width)) {
                    isIntersect = true
                  }
                }
              }
            }
          }
        }
      }

      return isIntersect
    },
    checkDuplicationOrder() {
      var dup = false
      for(let i = 0; i < this.order_permission.length - 1; i++) {
        for(let j = i + 1; j < this.order_permission.length; j++) {
          if(this.order_permission[i].value.object_name == this.order_permission[j].value.object_name) {
            dup = true
            return dup
          }
        }
      }
      return dup
    },
    checkDuplicationObjectName() {
      if(this.checkObejctName) {
        var res = 'ready'
        this.keepPage = this.currentPage
        for(var i=0; i < this.res_saveArray.length - 1; i++){
          for(var j=i + 1; j < this.res_saveArray.length; j++) {
            if(this.res_saveArray[i].object_name == this.res_saveArray[j].object_name) {
              // this.res_saveArray[j].object_name = this.res_saveArray[j].object_name + "_" + this.res_saveArray[j].page
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
                text: this.textLang.alert.name_object + this.res_saveArray[j].object_name + this.textLang.alert.change_name,
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
              $('#' + this.res_saveArray[i].name_input).css("outline-color", "red")
              $('#' + this.res_saveArray[i].name_input).css("outline-style", "solid")
              $('#' + this.res_saveArray[j].name_input).css("outline-color", "red")
              $('#' + this.res_saveArray[j].name_input).css("outline-style", "solid")
              $('#' + this.res_saveArray[j].name_input).css("z-index", "10")
              this.keepPage = this.res_saveArray[i].page
              this.checkObejctName = false
              res = 'notready'
            }
          }
        }
        return res
      } else {
        return 'notready'
      }
    },
    async checkSave() {
      this.checkObejctName = true
      // var checking = await this.checkInvalidSection()
      var checking = false
      if(!checking) {
        if(!this.checkDuplicationOrder()) {
          if(!this.prefix_code) {
            this.prefix_code = 'OTHERS'
          }
          if(!this.prefixPattern) {
            this.prefixPattern = ''
          }
          if(!this.prefixDigit) {
            this.prefixDigit = 6
          }
          if(!this.prefixType) {
            this.prefixType = 'CUSTOM'
          }
          this.save()
        } else {
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
            text: this.textLang.alert.duplicate,
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
      } else {
        this.$swal({
          backdrop: false,
          position: 'bottom-end',
          width: '330px',
          title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
          text: this.textLang.alert.section_boxes,
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
    async save() {
      var saveArray = []
      this.res_saveArray = []
      this.allObjectRoles = []
      // this.getAllPermission()
      var work_paper = document.getElementById('workpaper')
      var paper_rect = work_paper.getBoundingClientRect()
      for(let i = 0; i < this.mobileInputOrder.length; i++) {
        if(this.mobileInputOrder[i].objType != 'datatable') {
          if(typeof this.objectArray[this.mobileInputOrder[i].objType][this.mobileInputOrder[i].objIndex] === 'undefined') {
            this.objectArray[this.mobileInputOrder[i].objType][this.mobileInputOrder[i].objIndex].style.mobileIndex = this.mobileInputOrder[i].index
          }
        }
      }

      for(var i=0; i<this.objectArray['autofillbox'].length-1; i++) {
        if(!this.objectArray['autofillbox'][i].value || this.objectArray['autofillbox'][i].value == null) {
          this.selected_array = 'autofillbox'
          this.selected_object = this.objectArray['autofillbox'].indexOf(this.objectArray['autofillbox'][i])
          this.deleteObjectTemp()
        }   
      }

      for(var i=0; i<this.objectArray['number2textbox'].length-1; i++) {
        if(!this.objectArray['number2textbox'][i].value || this.objectArray['number2textbox'][i].value == null) {
          this.selected_array = 'number2textbox'
          this.selected_object = this.objectArray['number2textbox'].indexOf(this.objectArray['number2textbox'][i])
          this.deleteObjectTemp()
        }   
      }

      for(var i=0; i<this.objectArray['inputimagebox'].length-1; i++) {
        if(this.objectArray['inputimagebox'][i].value) {
          this.objectArray['inputimagebox'][i].style.isValued = true
        } else {
          this.objectArray['inputimagebox'][i].style.isValued = false
        }
      }

      var tempDTArray = {}

      for(var p = 1; p <= this.pages.length; p++) {
        await this.moveToPage(p)
        this.objectType.forEach( e => {
          if(e != 'paper') {
            for(var i=0; i<this.objectArray[e].length-1; i++) {
              try {
                if(typeof this.objectArray[e][i] !== 'undefined' && !this.objectArray[e][i].deleted) {
                  if(this.objectArray[e][i].page == this.currentPage) {
                    var element = document.getElementById(this.objectArray[e][i].name)
                    var rect = element.getBoundingClientRect()
                    var temp_val = this.objectArray[e][i].value
                    if((this.objectArray[e][i].style.permission.value_email.length && this.objectArray[e][i].style.permission.value_email[0] == "") 
                    || this.objectArray[e][i].style.permission.value_email == "") {
                      this.objectArray[e][i].style.permission.value_email = []
                    }
                    if((this.objectArray[e][i].style.permission.value_role.length && this.objectArray[e][i].style.permission.value_role[0] == "") 
                    || this.objectArray[e][i].style.permission.value_role == "") {
                      this.objectArray[e][i].style.permission.value_role = []
                    }
                    if(!this.objectArray[e][i].style.permission.value_role.length && !this.objectArray[e][i].style.permission.value_email.length) {
                      this.objectArray[e][i].style.permission_section = ""
                      this.getPermissionSection(e,i)
                    }
                    if(e == "autofillbox" || e == "number2textbox") {
                      temp_val = {}
                      temp_val.show = this.objectArray[e][i].value
                    }
                    this.objectArray[e][i].top = rect.top - paper_rect.top
                    this.objectArray[e][i].left = rect.left - paper_rect.left
                    this.objectArray[e][i].width = rect.width
                    this.objectArray[e][i].height = rect.height
                    let comp = {
                      name_input: this.objectArray[e][i].name,
                      object_type: e,
                      position: {
                        top: rect.top - paper_rect.top,
                        left: rect.left - paper_rect.left,
                        width: rect.width,
                        height: rect.height
                      },
                      defaultTop: rect.top - paper_rect.top,
                      section: this.getSection(rect.top),
                      value: temp_val,
                      object_name: this.objectArray[e][i].object_name,
                      placeholder: this.objectArray[e][i].placeholder,
                      style: this.objectArray[e][i].style,
                      text: this.objectArray[e][i].text,
                      choices: this.objectArray[e][i].choices,
                      excel: this.objectArray[e][i].excel,
                      page: this.objectArray[e][i].page
                    }
                    if(typeof comp.style.role_id !== 'undefined') {
                      comp.style.role_id.forEach(r_id => {
                        if(!this.allObjectRoles.includes(r_id)) {
                          this.allObjectRoles.push(r_id)
                        }
                      })
                      comp.style.email_report.forEach(email => {
                        if(!this.allObjectEmails.includes(email)) {
                          this.allObjectEmails.push(email)
                        }
                      })
                    }
                    saveArray.push(comp)
                  }
                }
              } catch(err) {
                console.log(err + ":Fail to save object")
              }     
            }
          }
        })

        for(let k=0; k<this.objectArray['datatable'].length-1; k++) {
          try {
            if(typeof this.objectArray['datatable'][k] !== 'undefined' && this.objectArray['datatable'][k].page == this.currentPage) {
              for(let i=1; i <= Number(this.objectArray['datatable'][k].style.table.crow); i++) {
                for(let j=1; j <= Number(this.objectArray['datatable'][k].style.table.ccol); j++) {
                  if(!this.objectArray['datatable'][k].deleted) {
                    var objName = this.objectArray['datatable'][k].object_name + '_R' + i + "C" + j
                    this.dataTableObjectArray[objName].style.permission_section = ""
                    this.dataTableObjectArray[objName].page = this.objectArray['datatable'][k].page
                    if(this.dataTableObjectArray[objName].object_type != 'calculatebox'&& this.dataTableObjectArray[objName].object_type != 'inputbox') {
                      this.dataTableObjectArray[objName].style.suffix = ""
                    }
                    this.getPermissionSection('datacell',objName)
                    if(typeof this.dataTableObjectArray[objName].style.role_id !== 'undefined') {
                      this.dataTableObjectArray[objName].style.role_id.forEach(r_id => {
                        if(!this.allObjectRoles.includes(r_id)) {
                          this.allObjectRoles.push(r_id)
                        }
                      })
                      this.dataTableObjectArray[objName].style.email_report.forEach(email => {
                        if(!this.allObjectEmails.includes(email)) {
                          this.allObjectEmails.push(email)
                        }
                      })
                    }
                    tempDTArray[objName] = this.dataTableObjectArray[objName]
                    if(this.dataTableObjectArray[objName].object_type == 'linkdatabox') {
                      this.dataTableObjectArray[objName].value = ""
                    }
                  }
                }
              }
            }
          } catch(err) {
            console.log(err + ": Fail to save datatable")
          }
        }
      }

      let comp = {
        name_input: "dataTableObjectArray",
        object_type: "dataTableObjectArray",
        position: {
          top: 0,
          left: 0,
          width: 0,
          height: 0
        },
        section: 'header',
        value: tempDTArray ,
        object_name: "dataTableObjectArray",
        placeholder: "dataTableObjectArray",
        style: {},
        text: "",
        choices: [],
        excel: "",
        page: 1
      }

      saveArray.push(comp)
      if(this.template_name != "") {
        if(this.selected_ppltemplate) {
          this.res_saveArray = saveArray
          var isReady = this.checkDuplicationObjectName()
          if(isReady == 'ready') {
            this.sendData()
          } else {
            // await this.moveToPage(this.keepPage)
          }
        } else{
          this.$swal({
            backdrop: false,
            position: 'bottom-end',
            width: '330px',
            title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
            text: this.textLang.alert.workflow_alert,
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
      } else {
        this.name_template_error = true
        this.error_file_name_msg = this.textLang.set_format_form.please_fill_in
        this.$swal({
          backdrop: false,
          position: 'bottom-end',
          width: '330px',
          title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
          text: this.textLang.set_format_form.please_fill_in,
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
    classifySection() {
      // this.template_header = [{}]
      // this.template_body = [{}]
      // this.template_footer = [{}]
      // for(var i = 1; i <= this.pages.length; i++) {
      //   this.template_header[0][String(i)] = []
      //   this.template_body[0][String(i)] = []
      //   this.template_footer[0][String(i)] = []
      // }
      // this.res_saveArray.forEach(e => {
      //   if(e.section == "header") {
      //     this.template_header[0][e.page].push(e)
      //   } else if (e.section == "body") {
      //     this.template_body[0][e.page].push(e)
      //   } else {
      //     this.template_footer[0][e.page].push(e)
      //   }
      // })

      var header_area = document.getElementById('header-area')
      var header_rect = header_area.getBoundingClientRect()
      var body_area = document.getElementById('body-area')
      var body_rect = body_area.getBoundingClientRect()
      var footer_area = document.getElementById('footer-area')
      var footer_rect = footer_area.getBoundingClientRect()

      this.header_section.height = header_rect.height
      this.body_section.height = body_rect.height 
      this.footer_section.height = footer_rect.height 
    },
    classifyPage() {

      var header_size = {}
      var body_size = {}
      var footer_size = {}
      var ort = []

      this.pages[this.currentPage - 1] = {
          template_side: this.template_side,
          header_section: this.header_section,
          body_section: this.body_section,
          footer_section: this.footer_section,
          url_image: "https://www.img.in.th/images/83ca9b38ee2d7d129f1826f75ea05e4f.png"
      }

      for(var i = 1; i <= this.pages.length; i++) {
        ort.push({})
      }

      for(var i=0; i<this.pages.length; i++) {
        header_size[String(i+1)] = this.pages[i].header_section
        body_size[String(i+1)] = this.pages[i].body_section
        footer_size[String(i+1)] = this.pages[i].footer_section
        ort[i][String(i+1)] = this.pages[i].template_side
      }

      var cmp = {
        header_size: header_size,
        body_size: body_size,
        footer_size: footer_size,
        orientation: ort
      }

      return cmp
    },
    async sendData() {
      if(sessionStorage.getItem('page_action') == 'create') {
        this.classifySection()
        var pageCompoment = this.classifyPage()
        // this.preGen()
        try {
              this.notReady = true
              var temp_name = this.template_name
              var business = ""
              if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
                business = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
              }
              var pathUrl = this.$api_url + '/template_form/api/v1/templateEform'
              var { data } = await this.axios.post(pathUrl,
                { 
                  tax_id: business,
                  temp_ppl_code: [{name:'default', code:this.selected_ppltemplate, document_type:this.selectedDocumentType}],
                  structure_template_type: this.template_type,
                  flow_id: this.selected_ppltemplate,
                  is_permission: this.currentSelectedFlow.is_permission,
                  set_role: this.currentSelectedFlow.set_role,
                  template_status: this.template_status,
                  template_name: temp_name,
                  code_template: this.code_template,
                  version_template: this.version_template,
                  template_data: this.res_saveArray,
                  template_header_size: pageCompoment.header_size,
                  template_body_size: pageCompoment.body_size,
                  template_footer_size: pageCompoment.footer_size,
                  orientation: pageCompoment.orientation,
                  description: this.note_paperless,
                  document_type_code: this.selectedEformDocType,
                  ppl_sign: "",
                  document_detail :[{prefix: this.prefix_code, pattern: this.prefixPattern, digit: this.prefixDigit, type: this.prefixType}],
                  role_id: this.allObjectRoles,
                  document_priority: this.docLevel,
                  department: this.docDepartment,
                  datetime_use: this.docUseDate,
                  email_report: this.allObjectEmails,
                  webhook: this.webhookUrl,
                  access_role: this.accessRole,
                  public_template: this.isPublicForm,
                  paperless_data: this.paperless_data,
                  paper_size: this.paper_size[this.paperSizeIndex].text,
                  document_option:this.docOption
                })
              this.notReady = false
              this.res_saveArray = []
              if(data.result != "ER") {
                // this.objectType.forEach( e => {
                //   this.objectArray[e] = []
                // })
                this.$swal({
                  backdrop: false,
                  position: 'bottom-end',
                  width: '330px',
                  title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
                  text: this.textLang.alert.save_complete,
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
                this.$router.push({ 'path': '/template'})
              } else {
                this.$swal({
                  backdrop: false,
                  position: 'bottom-end',
                  width: '330px',
                  title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
                  text: this.textLang.alert.fail_save,
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
          console.log(error.message)
        }
      }
      else if(sessionStorage.getItem('page_action') == 'edit') {
        this.classifySection()
        var pageCompoment = this.classifyPage()
        try {
              this.notReady = true
              var temp_name = this.template_name
              var temp_code = this.template_id
              var business = ""
              var res = ""
              if(JSON.parse(sessionStorage.getItem('selected_business')).id) {
                business = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
              }
              var { data } = await this.axios.put(this.$api_url + '/template_form/api/v1/templateEform',
                { 
                  tax_id: business,
                  temp_ppl_code: [{name:'default', code:this.selected_ppltemplate, document_type:this.selectedDocumentType}],
                  flow_id:this.selected_ppltemplate,
                  is_permission: this.currentSelectedFlow.is_permission,
                  set_role: this.currentSelectedFlow.set_role,
                  structure_template_type: this.template_type,
                  template_status: this.template_status,
                  template_id: temp_code,
                  template_name: temp_name,
                  code_template: this.code_template,
                  version_template: this.version_template,
                  template_data: this.res_saveArray,
                  template_header_size: pageCompoment.header_size,
                  template_body_size: pageCompoment.body_size,
                  template_footer_size: pageCompoment.footer_size,
                  orientation: pageCompoment.orientation,
                  description: this.note_paperless,
                  document_type_code: this.selectedEformDocType,
                  ppl_sign: "",
                  document_detail :[{prefix: this.prefix_code, pattern: this.prefixPattern, digit: this.prefixDigit, type: this.prefixType}],
                  role_id: this.allObjectRoles,
                  document_priority: this.docLevel,
                  department: this.docDepartment,
                  datetime_use: this.docUseDate,
                  email_report: this.allObjectEmails,
                  webhook: this.webhookUrl,
                  html: this.template_html_array,
                  access_role: this.accessRole,
                  public_template: this.isPublicForm,
                  paperless_data: this.paperless_data,
                  paper_size: this.paper_size[this.paperSizeIndex].text,
                  document_option:this.docOption
                })
            res = data
            this.notReady = false
            this.res_saveArray = []
            if(res.result != "ER") {
              // this.objectType.forEach( e => {
              //   this.objectArray[e] = []
              // })
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#67C25D" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_success + '</strong>',
                text: this.textLang.alert.save_complete,
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
              this.$router.push({ 'path': '/template'})
            } else {
              this.$swal({
                backdrop: false,
                position: 'bottom-end',
                width: '330px',
                title: '<svg style="width:24px;height:24px" class="alert-icon" viewBox="0 0 24 24"><path fill="#E53935" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg><strong class="alert-title">' + this.textLang.alert.alert_error + '</strong>',
                text: this.textLang.alert.fail_save,
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
          console.log(error.message)
        }
      }
    },
    deleteObject() {
      if(this.selected_array != 'paper') {
        if(this.selected_array == 'inputimagebox') {
          this.deleteUploadImage(this.objectArray[this.selected_array][this.selected_object])
        }
        this.objectArray[this.selected_array].splice(this.selected_object,1)
        this.selectPlain()
      }
    },
    deleteObjectTemp() {
      if(this.selected_array != 'paper') {
          var selArray = this.selected_array
          var selIndex = this.selected_object
          this.deleteTempList.push({array: selArray, index: selIndex})
          this.objectArray[selArray][selIndex].deleted = true
          this.objectArray[selArray][selIndex].show = false
          this.objectArray[selArray][selIndex].style.permission = {byRole:false,value_role: [], value_email: [] }
          if(this.selected_array == 'sectionbox') {
            this.order_permission.forEach(e => {
              e.choicesSet = false
            })
            $('#' +  this.objectArray[selArray][selIndex].name).css('z-index', 0)
            // this.getAllPermission()
          }
          this.selectPlain()
      } else if(this.selectedObjectGroup.length) {
        this.selectedObjectGroup.forEach(e => {
          this.deleteTempList.push({array:e.obj_array, index: e.obj_index})
          this.objectArray[e.obj_array][e.obj_index].deleted = true
          this.objectArray[e.obj_array][e.obj_index].show = false
        })
        this.selectPlain()
        this.selectedObjectGroup = []
      }
    },
    undoDelete() {
      if(this.deleteTempList.length) {
        var indx = this.deleteTempList[this.deleteTempList.length-1].index
        var arr = this.deleteTempList[this.deleteTempList.length-1].array
        this.objectArray[arr][indx].deleted = false
        if(arr == 'sectionbox' && this.objectArray[arr][indx].page == this.currentPage) {
           $('#' + this.objectArray[arr][indx]).css('z-index', '6')
        }
        if(this.currentPage ==  this.objectArray[arr][indx].page) {
          this.objectArray[arr][indx].show = true
        }
        this.deleteTempList.pop()
      }
    },
    setLogicString(logicString) {
      if(this.cellHideSetting) {
        this.dataTableObjectArray[this.selectedCell].style.hideOption = logicString
      } else {
        this.objectArray[this.selected_array][this.selected_object].style.hideOption = logicString
      }
    },
    openConfirmSave() {
      EventBus.$emit('openConfirmSave')
    },
    openBack() {
      EventBus.$emit('backFromCreate', this.textLang.alert.create_eform)
    },
    openHideSetting(dataCell) {
      this.cellHideSetting = false
      var settingOption = {
        hideOption: this.objectArray[this.selected_array][this.selected_object].style.hideOption,
        objectName: this.objectArray[this.selected_array][this.selected_object].object_name
      }
      if(dataCell && this.dataTableObjectArray[dataCell]) {
        settingOption = {
          hideOption: this.dataTableObjectArray[dataCell].style.hideOption,
          objectName: this.dataTableObjectArray[dataCell].object_name
        }
        this.cellHideSetting = true
      }
      EventBus.$emit('openHideSetting',settingOption)
    },
    setDateFormatBE (date,sub) {
      var thaiDate = ""
      if(date){
        var curDate = date.split('-')
        if(sub == 'be') {
          thaiDate = String(curDate[2]) + ' ' + this.getThaiMonth(curDate[1]) + ' พ.ศ.' + String(Number(curDate[0]) + 543)
        } else if(sub == 'cbe') {
          thaiDate = String(curDate[2]) + ' ' + this.getSubThaiMonth(curDate[1]) + String(Number(curDate[0]) + 543).slice(-2)
        }
      }
      return date ? thaiDate : ''
    },
    showAllMobile() {
      this.mobileInputOrder.forEach(e => {
        if(e.objType != "datatable") {
          this.objectArray[e.objType][e.objIndex].style.showMobile = true
        } else {
          this.dataTableObjectArray[e.objIndex].style.showMobile = true
        }
      })
      var tempMob = this.mobileInputOrder
      this.mobileInputOrder = []
      this.mobileInputOrder = tempMob
    },
    disableAllMobile() {
      this.mobileInputOrder.forEach(e => {
        if(e.objType != "datatable") {
          this.objectArray[e.objType][e.objIndex].style.showMobile = false
        } else {
          this.dataTableObjectArray[e.objIndex].style.showMobile = false
        }
      })
      var tempMob = this.mobileInputOrder
      this.mobileInputOrder = []
      this.mobileInputOrder = tempMob
    },
    addBlockEmail(order, value) {
      var indx = this.order_permission.indexOf(order)
      if(typeof this.order_permission[indx] !== 'undefined' && value) {
        if(!this.order_permission[indx].blockEmail.includes(value)) {
          this.order_permission[indx].blockEmail.push(value)
        }
      }
      this.order_permission[indx].selectedBlockemail = ""
    },
    deleteBlockEmail(order, value) {
      var indx = this.order_permission.indexOf(order)
      if(typeof this.order_permission[indx] !== 'undefined' && value) {
        if(this.order_permission[indx].blockEmail.includes(value)) {
          var mailIndx = this.order_permission[indx].blockEmail.indexOf(value)
          this.order_permission[indx].blockEmail.splice(mailIndx, 1)
        }
      }
    },
    setDateFormatCE (date) {
      var curDate = date.split('-')
      var thaiDate = String(curDate[2]) + ' ' + this.getEngMonth(curDate[1]) + ' ' + String(Number(curDate[0]))
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
      engMon = 'อื่นๆ'
      return engMon
    },
    toOpenLinkData(obj) {
      var data_table = obj
      EventBus.$emit('openLinkData',data_table)
    },
    toOpenSumif() {
      EventBus.$emit('openSumifTool')
      // var input = "($inputbox1+$inputbox2==$inputbox3+$inputbox4)||($inputbox5.length>10)||$inputbox88314==$inputbox88315";
      // var input = "sumif(datatable6_RXC1:datatable6_RXC2!='Bronze Pack. (vCPU 1 , vRAM 2 , Disk 50)'||datatable6_RXC2!='Silver Pack. (vCPU 1 , vRAM 4 , Disk 150)'||datatable6_RXC2!='Gold Pack. (vCPU 2 , vRAM 4 , Disk 300)'||datatable6_RXC2!='Platinum Pack. (vCPU 4 , vRAM 8 , Disk 500)')"
      // let regexCondition = /(["'])(?:(?=(\\?))\2.)*?\1|(sumif)|[&\/\\#, +()$~%'":*?<>!{}|=|]/g
      // let pattern = /([A-Za-z0-9])\w+/g
      // var res = input.split("$")
      // var nameObject = []
      // var otherValue = []
      // var name = []
      // var ress = []
      // for(var i=0; i<res.length; i++){
      //   if(res[i].match(regexCondition)){
      //     otherValue.push(res[i].match(regexCondition))
      //     nameObject.push(res[i].replace(regexCondition,' '))
      //   }
      //   else nameObject.push(res[i])
      // }
      // name = JSON.stringify(nameObject).match(pattern)
      // console.log(name)
      // console.log(otherValue)
    },
    openObjectRole() {
      try {
        this.objectTypeInput.forEach(e => {
          this.objectArray[e].forEach(e2 => {
            e2.style.temp_role_id = e2.style.role_id
            e2.style.temp_email_report = e2.style.email_report
          })
        })
        this.datatableRoleCell = []
        for(let k=0; k<this.objectArray['datatable'].length-1; k++) {
          for(let i=1; i <= this.objectArray['datatable'][k].style.table.crow; i++) {
            for(let j=1; j <= this.objectArray['datatable'][k].style.table.ccol; j++) {
              if(!this.objectArray['datatable'][k].deleted) {
                var objName = this.objectArray['datatable'][k].object_name + '_R' + i + "C" + j
                if(!this.dataTableObjectArray[objName].style.noCellData && !this.dataTableObjectArray[objName].style.isCellTextField) {
                  this.dataTableObjectArray[objName].style.temp_role_id = this.dataTableObjectArray[objName].style.role_id
                  this.dataTableObjectArray[objName].style.temp_email_report = this.dataTableObjectArray[objName].style.email_report
                  this.datatableRoleCell.push(objName)
                }
              }
            }
          }
        }
        this.dialogObjectRole = true
      } catch(err) {
        console.log(err + ":Fail to openObjectRole")
      }
    },
    closeObjectRole() {
      this.objectTypeInput.forEach(e => {
        this.objectArray[e].forEach(e2 => {
          e2.style.role_id = e2.style.temp_role_id
          e2.style.email_report = e2.style.temp_email_report
        })
      })

      this.datatableRoleCell.forEach(e => {
        this.dataTableObjectArray[e]
        this.dataTableObjectArray[e].style.role_id = this.dataTableObjectArray[e].style.temp_role_id
        this.dataTableObjectArray[e].style.email_report = this.dataTableObjectArray[e].style.temp_email_report
      })
      this.dialogObjectRole = false
    },
    clearObjectRole() {
      this.objectTypeInput.forEach(e => {
        this.objectArray[e].forEach(e2 => {
          e2.style.role_id = []
          e2.style.email_report = []
        })
      })

      this.datatableRoleCell.forEach(e => {
        this.dataTableObjectArray[e]
        this.dataTableObjectArray[e].style.role_id = []
        this.dataTableObjectArray[e].style.email_report = []
      })
    },
    openDocCondition() {
      var docCond = []
      var checkStep = this.step_api_send
      if(typeof this.docOption['condition'] !== 'undefined') {
        docCond = this.docOption['condition']
      }
      EventBus.$emit('openDocCondition',docCond, checkStep)
    },
    openFlowCondition() {
      var flowCond = []
      if(typeof this.docOption['flowCondition'] !== 'undefined') {
        flowCond = this.docOption['flowCondition']
      }
      EventBus.$emit('openFlowCondition',flowCond)
    },
    saveDocCondition(docCont) {
      this.docOption['condition'] = docCont
    },
    saveFlowCondition(flowCont) {
      this.docOption['flowCondition'] = flowCont
    },
    getDataTable(returnData) {
      this.objectArray[this.selected_array][this.selected_object].value = returnData
    },
    changeZindex(order) {
      if(order == 'forward') {
        if(this.objectArray[this.selected_array][this.selected_object].style.zIndex < 10) {
          this.objectArray[this.selected_array][this.selected_object].style.zIndex += 1
        } else {
          this.objectArray[this.selected_array][this.selected_object].style.zIndex = 10
        }
      } else if(order == 'front') {
        this.objectArray[this.selected_array][this.selected_object].style.zIndex = 10
      } else if(order == 'backward') {
        if(this.objectArray[this.selected_array][this.selected_object].style.zIndex > 1) {
          this.objectArray[this.selected_array][this.selected_object].style.zIndex -= 1
        } else {
          this.objectArray[this.selected_array][this.selected_object].style.zIndex = 1
        }
      } else if(order == 'back') {
        this.objectArray[this.selected_array][this.selected_object].style.zIndex = 1
      }
      $('#' + this.objectArray[this.selected_array][this.selected_object].name).css("z-index", this.objectArray[this.selected_array][this.selected_object].style.zIndex)
    },
    deleteAccesstRoleList(item) {
      var indx = this.accessRole.indexOf(item)
      this.accessRole.splice(indx, 1)
    },
    openCreateDropdownDataset() {
      var alterChoicesSet = []
      if(this.selected_array == 'datatable') {
        alterChoicesSet = this.dataTableObjectArray[this.selectedCell].style.alterChoices
      } else {
        alterChoicesSet = this.objectArray[this.selected_array][this.selected_object].style.alterChoices 
      }
      EventBus.$emit('openCreateDropdownDataset' ,alterChoicesSet)
    },
    getDropDownChoiceSet(choiceDict) {
      if(this.selected_array == 'datatable') {
        this.dataTableObjectArray[this.selectedCell].style.alterChoices = choiceDict
      } else {
        this.objectArray[this.selected_array][this.selected_object].style.alterChoices = choiceDict
      }
    },
    openUploadImage(obj, row) {
      if(obj.object_name == this.objectArray[this.selected_array][this.selected_object].object_name) {
        if(parseFloat(obj.width) > parseFloat(obj.height)) {
          this.objectArray[this.selected_array][this.selected_object].style.image_width = "auto"
          this.objectArray[this.selected_array][this.selected_object].style.image_height = obj.height + "px"
        } else {
          this.objectArray[this.selected_array][this.selected_object].style.image_width = obj.width + "px"
          this.objectArray[this.selected_array][this.selected_object].style.image_height = "auto"
        }
        this.dialogImageUpload = true
      } else if(obj.object_name.startsWith('datatable')) {
        var cellHeight = this.objectArray[this.selected_array][this.selected_object].style.table.rowsize[Number(row) - 1].size
        this.dataTableObjectArray[obj.object_name].style.image_width = "auto"
        this.dataTableObjectArray[obj.object_name].style.image_height = String(cellHeight) + "px"
        this.dialogImageUpload = true
      }
    },
    async imageUpload() {
      let formData = new FormData()
      formData.append('imagefile', this.uploadImage)
      this.dialogImageUpload = false
      this.notReady = true
      try {
        var { data } = await this.axios.post(this.$eform_api + '/upload_image',
        formData)
        this.notReady = false
        if(data.messageER != 'ER') {
          if(this.selectedCell) {
            this.dataTableObjectArray[this.selectedCell].value = data.url[0].url
          } else {
            this.objectArray[this.selected_array][this.selected_object].value = data.url[0].url
          }
          this.uploadImage = []
        }
      } catch (error) {
        this.notReady = false
        console.log(error.message)
      }
    },
    async deleteUploadImage(obj) {
      if(obj.object_name.startsWith('datatable')) {
        this.dataTableObjectArray[obj.object_name].value = ''
      } else {
        this.selectObject(obj, 'inputimagebox')
        this.objectArray[this.selected_array][this.selected_object].value = ''
      }
    },
    genHtmlFontsize(value, html) {
      html += "font-size: " + value + "px;"
      return html
    },
    genHtmlFontstyle(value, html) {
      var font_style = value
        font_style.forEach( s => {
          if(s == "b") {
            html += "font-weight: bold; "
          }
          else if(s == 'i') {
            html += "font-style: italic; " 
          } else if(s == "u") {
            html += "text-decoration: underline; " 
          }
        })
      return html
    },
    genHtmlFontcolor(value, html) {
      var color = value.substring(1,7)
      html += "color:" + color + ";"
      return html
    },
    genHtmlBordersize(value, html) {
      html += "border:" + value + "px solid;"
      return html
    },
    genHtmlBorderscolor(value, html) {
      var color = value.substring(1,7)
      html += "border-color:" + value + ";"
      return html
    },
    genHtmlBorderradias(value, html) {
      if(value) {
        html += "border-radius: 15px;"
      } else {
        html += "border-radius: 0px;"
      }
      return html
    },
    genHtmlBackgroundcolor(value, html) {
      var color = value.substring(1,7)
      html += "background-color:" + value + " !important;"
      return html
    },
    addEmailCenter() {
      if(!this.paperless_data.email_center.includes(this.selectedEmailCenter)) {
        this.paperless_data.email_center.push(this.selectedEmailCenter)
      }
      this.selectedEmailCenter = ""
    },
    deleteEmailCenter(email) {
      if(this.paperless_data.email_center.includes(email)) {
        var indx = this.paperless_data.email_center.indexOf(email)
        this.paperless_data.email_center.splice(indx, 1)
      }
    },
    async preGen() {
      this.template_html_array = [{}]
      var work_paper = document.getElementById('workpaper')
      var paper_rect = work_paper.getBoundingClientRect()
      var html = ""
      for(var p=1; p<= this.pages.length; p++ ) {
        var pWidth = this.paper_size[this.paperSizeIndex].width
        var pHeight = this.paper_size[this.paperSizeIndex].height
        if(this.pages[p-1].template_side == "LANDSCAPE") {
          pWidth = this.paper_size[this.paperSizeIndex].height
          pHeight = this.paper_size[this.paperSizeIndex].width-70
        }
        if(p){
          html = "<head><link href='https://fonts.googleapis.com/css?family=Sarabun&subset=thai' rel='stylesheet' type='text/css'><meta charset='utf-8'></head><body>"
          html += "<div style='word-wrap: break-word; position:relative;" + "width:" + pWidth  + "px; height:" + pHeight +"px;'>"
          html += '</div>'
          this.res_saveArray.forEach(e => {
            if(e.page == p && e.object_type != 'dataTableObjectArray') {
              if(e.object_type == "textareabox") {
                html += "<div style='white-space: pre-wrap; text-overflow: clip; text-align:"
                html += e.style.font_align
                html += "; position:absolute; height:"
              } else if(e.object_type == "datatable") {
                html += "<div style='word-break: break-word; white-space: pre-wrap; text-overflow: clip;"
                html += "; position:absolute; height:"
              }else {
                html += "<div style=' white-space: pre-wrap; text-overflow: clip; text-align:"
                html += e.style.font_align
                html += "; position:absolute; height:"
              }

              if(e.object_type == "rectangle") {
                html += String(e.position.height-(parseInt(e.style.border_size)*2)) + "px; width:"
              } else {
                html += String(e.position.height) + "px; width:"
              }
              
              if(e.object_type != "rectangle" && e.object_type != "table" && e.object_type != "datatable" && e.object_type != "line"  && e.object_type != "textareabox") {
                if(e.object_type == "textfield" || e.object_type == "inputbox" || e.object_type == "datepickerbox" || e.object_type == "timebox") {
                  html += String(e.position.width) + "px; opacity:1; display:table-cell; left:"
                  //  html += "auto; opacity:1; display:table-cell; left:"
                } else if(e.object_type == "checkbox" ) {
                  html += String(e.position.width+30) + "px; opacity:1; display:table-cell; left:"
                } else {
                  html += "auto; opacity:1; display:table-cell; left:"
                }
                html += String(e.position.left) + "px; top:"
                html += String(e.position.top) + "px; "
                html += "z-index:" + String(e.style.zIndex) +";"
                html = this.genHtmlFontsize(e.style.font_size, html)
                html = this.genHtmlFontstyle(e.style.font_style, html)
                html = this.genHtmlFontcolor(e.style.font_color, html)
              } else if(e.object_type == "textareabox") {
                html += String(e.position.width) + "px; opacity:1; display:table-cell; left:"
                html += String(e.position.left) + "px; top:"
                html += String(e.position.top) + "px; "
                html += "z-index:" + String(e.style.zIndex) +";"
                html = this.genHtmlFontsize(e.style.font_size, html)
                html = this.genHtmlFontstyle(e.style.font_style, html)
                html = this.genHtmlFontcolor(e.style.font_color, html)
              } else if(e.object_type == "rectangle") {
                html += String(e.position.width-(parseInt(e.style.border_size)*2)) + "px; opacity:1; display:table-cell; left:"
                html += String(e.position.left) + "px; top:"
                html += String(e.position.top) + "px; "
                html += "z-index:" + String(e.style.zIndex) +";"
                html = this.genHtmlBordersize(e.style.border_size, html)
                html = this.genHtmlBorderscolor(e.style.border_color, html)
                html = this.genHtmlBackgroundcolor(e.style.background_color, html)
                html = this.genHtmlBorderradias(e.style.border_radias, html)
              } else if(e.object_type == "table" || e.object_type == "datatable") {
                if(!e.position.width) {
                  html +=  "auto" + "; opacity:1; left:"
                } else {
                  html += String(e.position.width) + "px" + "; opacity:1; left:"
                }
                html += String(e.position.left) + "px; top:"
                html += String(e.position.top) + "px; "
                html += "z-index:" + String(e.style.zIndex) +";"
              } else if(e.object_type == "line") {
                html += String(e.position.width) + "px; opacity:1; left:"
                html += String(e.position.left) + "px; top:"
                html += String(e.position.top) + "px; "
                html += "z-index:" + String(e.style.zIndex) +";"
              }
              html += 'font-family: "Sarabun", sans-serif;'
              html += "'>"
              if(e.object_type == 'checkbox') {
                if(e.value) {
                  html += "<img  width='" + e.style.font_size + "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_84c82695-0eff-4e1f-9e42-f07d49104a84.png'>"
                } else {
                  html += "<img  width='" + e.style.font_size + "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png'>"
                } 
                html += "<span style='margin-left:3px;'>" + e.text + "</span></div>"
              } else if(e.object_type == 'imagebox') {
                  html += "<img  width='" + e.position.width + "' height='" + e.position.height +"' src='" + e.value + "'></div>"
              } else if(e.object_type == 'inputimagebox' && e.value != '' && e.value != null) {
                  html += "<img  width='" + e.position.width + "' height='" + e.position.height +"' src='" + e.value + "'></div>"
              } else if(e.object_type == 'datepickerbox') {
                html += e.show_value + "</div>"
              } else if(e.object_type == 'table') {
                html += "<table style='border-collapse:collapse; border:"
                html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
                for(var i=0; i < e.style.table.rowsize.length; i++) {
                  html += "<tr style='height:" + e.style.table.rowsize[i].size + "px; border-collapse:collapse; border:"
                  html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
                  for(var j=0; j < e.style.table.colsize.length; j++) {
                    html += "<td style='width:" + String(parseFloat(e.style.table.colsize[j].size) - 3) + "px; border-collapse:collapse; border:"
                    html += e.style.border_size + "px solid " + e.style.border_color + ";'></td>"
                  }
                  html += "</tr>"
                }
                html += "</table></div>"
              } else if(e.object_type == 'datatable') {
                html += "<table style='border-collapse:collapse; border:"
                html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
                for(var i=0; i < e.style.table.rowsize.length; i++) {
                  html += "<tr style='height:" + String(Number(e.style.table.rowsize[i].size)+1) + "px; border-collapse:collapse; border:"
                  html += e.style.border_size + "px solid " + e.style.border_color + ";'>"
                  for(var j=0; j < e.style.table.colsize.length; j++) {
                    html += "<td style='width:" + String(Number(e.style.table.colsize[j].size)-3) + "px; border-collapse:collapse; border:"
                    html += e.style.border_size + "px solid " + e.style.border_color + "; background-color:" + this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].style.background_color +";"
                    html += "text-align:" + this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].style.font_align +";"
                    html = this.genHtmlFontsize(this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].style.font_size, html)
                    html = this.genHtmlFontstyle(this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].style.font_style, html)
                    html = this.genHtmlFontcolor(this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].style.font_color, html)
                    html += "'>"
                    if(this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].object_type == 'checkbox') {
                      if(this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].show_value) {
                        html += "<img  width='" + this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].style.font_size + "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_84c82695-0eff-4e1f-9e42-f07d49104a84.png'>"
                      } else {
                        html += "<img  width='" + this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].style.font_size + "px' src='https://eform.one.th/eform_api/api/v1/view_image?file_name=50214806880_3fc2cb62-99be-43b3-bfbb-7274606298c3.png'>"
                      } 
                      html += "<span style='margin-left:3px;'>" + this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].text + "</span></div>"
                    } else {
                      html += this.dataTableObjectArray[e.object_name + '_' + 'R' + String(i+1) + 'C' + String(j+1)].show_value
                    }
                    html +="</td>"
                  }
                  html += "</tr>"
                }
                html += "</table></div>"
              } else if(e.object_type == 'line') {
                html += "<table style='border-collapse:collapse; width:100%; height:100%;'>"
                if(e.style.line_set == 'l') {
                  html += "<tr style='height:50%; border-bottom:" + e.style.border_size + 'px ' + e.style.line_style +' ' + e.style.border_color +"; border-collapse:collapse;'>"
                  html += "<td style='width:100%;'></td></tr>"
                  html += "<tr style='height:50%; border-top:" + e.style.border_size + 'px ' + e.style.line_style +' ' + e.style.border_color + "; border-collapse:collapse;'>"
                  html += "<td style='width:100%;'></td></tr>"
                } else if(e.style.line_set == 'p') {
                  html += "<tr style='height:100%;'>"
                  html += "<td style='width:50%; border-right:" + e.style.border_size + 'px '+ e.style.line_style + ' ' + e.style.border_color + "; border-collapse:collapse;'>"
                  html += "</td><td style='width:50%'></td></tr>"     
                }      
                html += "</table></div>"
              }
              else {
                if(e.value || e.object_type == 'calculatebox') {
                  if(e.value || e.style.isZero) {
                    if(e.object_type == "textareabox") {
                      html += String(e.value) + "</div>"
                    } else if(e.object_type == "calculatebox"){
                      html += String(e.value) + "</div>"
                    } else if(e.object_type == "inputbox" && e.style.isComma){
                      html += String(e.value) + "</div>"
                    }  else {
                      html += String(e.value) + "</div>"
                    }
                  } else {
                    html += "</div>"
                  }
                } else{
                  html += "</div>"
                }
              }
            }
          })
          if(p != this.pages.length) {
            html += '<div style="page-break-before: always;"></div>'
          }
          html += '</body>'
          this.template_html_array[0][p] = html
          html = ""
        }
      }
    },
    async getFlowData(){
        try {
          this.step_choices = [{text: this.textLang.property_type.sender_flow, value: ""}]
          if(this.selected_ppltemplate){
            var tax_id = JSON.parse(sessionStorage.getItem('selected_business')).id_card_num
            var url = `/flowdata/api/v1/get1/?_id=${this.selected_ppltemplate}&tax_id=${tax_id}`
            var {data} = await this.axios.get(this.$api_url + url)
            this.currentSelectedFlow = data.data
            if(data.status){
              data.data.flow_data.forEach(e => {
                if(e.action == "Fill") {
                  this.step_choices.push({
                    text: this.textLang.property_type.step_flow + (e.index + 1),
                    value: e.index + 1
                  })
                }
                
              })
            }
          }
        } catch (error) {
          console.log(error);
        }
    }
  }
}
</script>

<style>
.display-set-object-cell{
  display: inline-block;
  white-space: pre-line;
  height: auto !important;
  /* width: 85%; */
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}

.question-card {
  /* margin-left: 7%;
  margin-right: 7%; */
  border-color: #4CAF50 !important;
}

/* .create-page {
  margin-top: 52px;
  width: 100%;
} */

.create-menu-bar {
  border-bottom: solid 1px #E0E0E0 !important;
}

.name-page {
  font-family: 'Sarabun', sans-serif;
  width: 20%;
}

.create-menu {
  padding-bottom: 50px;
}

.create-each-menu {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  text-transform: capitalize;
}

.create-short-form-menu {
  font-family: 'Sarabun', sans-serif;
  font-size: 15px;
  text-transform: capitalize;
}

/* .theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active).disable-create-menu {
  color: #9c9a9a !important;
} */

.create-preview-btn {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
}

.save-create-btn {
  font-family: 'Sarabun', sans-serif;
  text-transform: capitalize;
  font-size: 14px;
  margin-left: 1%;
}

.create-form-row {
  width: 100%;
  margin: 0% !important;
}

.page-select-block {
  background-color: white;
  height: calc(100vh - 112px);
  overflow: auto;
  padding-top: 3%;
  border-right: solid 1px #E0E0E0;
}

.num-page-block {
  padding: 0%;
  margin-left: 8%;
}

.num-page {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  margin-left: 15%;
}

.page-mini-block {
  padding-top: 0%;
  padding-left: 3%;
}

.page-mini {
  width: 119px;
  height: 163px;
  border: solid 1px #E0E0E0;
}

.paper-menu-bar .v-toolbar__content {
  padding-left: 0%;
  padding-right: 0%;
}

.open-page-select-btn {
  height: 100% !important;
  font-family: 'Sarabun', sans-serif;
  text-transform: capitalize;
}

.zoom-percent {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
}

.add-page-btn {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px !important;
  text-transform: capitalize;
}

.add-page-icon {
  margin-right: 5%;
}

.main-paper-block {
  position: relative;
  margin-left: 1%;
  margin-top: 1%;
  overflow: auto;
  height: calc(100vh - 176px);
  padding: 1%;
  z-index: 1;
}

.main-paper {
  padding-left: 24px;
  padding-right: 24px;
  margin-left: auto;
  margin-right: auto;
}

.property-block2 {
  background-color: white;
  border-left: solid 1px #E0E0E0;
  overflow: auto;
  height: calc(100vh - 113px);
  padding-top: 2%;
  padding-right: 0%;
  padding-left: 0%;
}

.header-property {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  text-decoration: underline;
  margin-left: 4%;
  display: inline-block;
}

.sub-title-property {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: #4CAF50;
  margin-left: 7%;
  display: inline-block;
}

.row-prop {
  width: 100%;
  /* margin-left: 0%; */
  margin: 0%;
  padding-left: 3%;
}

.title-prop-block {
  padding-right: 0%;
  padding-left: 4%;
}

.title-prop {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: black;
}

.title-force-date-prop {
  font-family: 'Sarabun', sans-serif;
  font-size: 12px;
  color: black;
}

.prop-input {
  font-family: 'Sarabun', sans-serif;
  font-size: 13px;
}

.create-prop-line-height.v-text-field input {
  line-height: 24px !important;
}

.create-prop-dropdown-icon .theme--light.v-icon {
  color: rgba(0, 0, 0, 0.54) !important;
}

.group-form-box.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
  padding-left: 1% !important;
  padding-right: 0% !important;
}

.group-form-box .v-select__selections {
  line-height: 24px !important;
}

.form-force-date-box.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
  padding-left: 3% !important;
  padding-right: 0% !important;
}

.divider-prop {
  margin-left: 6%;
  margin-right: 3%;
}

.template-type-block {
  margin-left: 4%;
  padding-bottom: 2%;
}

.example-doc-num {
  font-family: 'Sarabun', sans-serif;
  font-size: 13px;
  color: lightgray;
  margin-left: 7%;
}

.prefix-color {
  color: #80D8FF !important;
}

.date-num-doc-color {
  color: #E1BEE7 !important;
}

.doc-num-color {
  color: #AED581 !important;
}

.num-doc-length-title {
  font-size: 13px !important;
}

.check-grid-block {
  margin-left: 4%;
}

.check-paper-grid-block {
  padding-left: 4% !important;
}

.grid-size-box.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
  padding-left: 2% !important;
  padding-right: 4% !important;
}

.form-permission-box.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
  padding-left: 2% !important;
  padding-right: 0% !important;
}

.next-temp-box.v-text-field--outlined > .v-input__control > .v-input__slot {
  height: unset !important;
}

.next-temp-chip {
  font-family: 'Sarabun', sans-serif;
  /* display: inline-block;
  max-width: 100px; */
}

.flat-expan .v-expansion-panel::before {
  box-shadow: none !important;
}

.flat-expan .v-expansion-panel::after {
  border: none !important;
}

.all-object-block {
  margin-top: 0%;
  padding-bottom: 10%;
  padding-left: 4%;
}

.section-object-header {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: #4CAF50;
  padding-left: 3%;
  padding-bottom: 4%;
  padding-top: 8%;
}

.object-type-header {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: #4CAF50;
  padding-left: 3%;
  padding-bottom: 4%;
  padding-top: 13%;
}

.line-expan-object {
  border: solid 1px #4CAF50;
  margin-right: 6%;
  margin-left: 3%;
}

.obj-expand-content .v-expansion-panel-content__wrap {
  padding-left: 0% !important;
  padding-right: 6% !important;
}

.obj-group {
  width: 100%;
  margin: 0%;
  margin-top: 3%;
}

.img-of-obj {
  width: 100%;
  /* padding-left: 7%; */
}

.img-of-obj:hover {
  opacity: 0.7;
  cursor: pointer;
}

.line-block {
  padding: 0%;
  text-align: center;
}

.line-block-row {
  width: 100%;
  height: 100%;
  margin: 0%;
}

.line-block-row:hover{
  cursor: pointer;
}

.block-to-line {
  height: 100%;
}

.obj-line {
  border-right: 2px solid black;
}

.object-image {
  border-radius: 8px;
  width: 70% !important;
  margin-left: 17%;
}

.object-image:hover {
  opacity: 0.7;
  cursor: pointer;
}

.object-sign-img {
  width: 75%;
}

.object-sign-img:hover {
  opacity: 0.7;
  cursor: pointer;
}

.arrange-obj-btn:hover {
  color: #4CAF50;
  border-color: #4CAF50;
}

.divider-obj {
  margin-left: 7%;
  margin-right: 5%;
}

.tips-btn {
  font-family: 'Sarabun', sans-serif;
}

.tips2 {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: gray;
}

.permission-data-btn {
  font-family: 'Sarabun', sans-serif;
  text-transform: capitalize;
  margin-left: 6%;
}

.row-table-prop {
  width: 100%;
  margin-top: 3%;
  margin: 0%;
}

.table-prop {
  width: 100%;
}

.property-title-header {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px !important;
  color: black !important;
  padding-left: 8% !important;
  padding-right: 0% !important;
  width: 40%;
}

.property-header {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px !important;
  color: black !important;
}

.no-border {
  border: none !important;
}

.font-in-property {
  font-family: 'Sarabun', sans-serif;
  font-size: 13px !important;
}

.property-title {
  padding-left: 8% !important;
  padding-right: 0% !important;
}

.table-color-striped > tr:nth-child(odd) {
  background-color: #EEEEEE;
}

.input-color {
  padding-top: 0%;
}

.property-check {
  margin-top: 0% !important;
  margin-bottom: 2%;
}

.column-property-header {
  padding-left: 8%;
}

.column-property-content > .v-expansion-panel-content__wrap {
  padding-left: 0%;
  padding-right: 0%;
  padding-bottom: 0%;
}

.table-row-property-header {
  background-color: #EEEEEE !important;
}

.setting-table-row-color-striped > tr:nth-child(even) {
  background-color: #EEEEEE !important;
}

.align-prop-block {
  display: block !important;
}

.object-line-type-block {
  margin-top: 1% !important;
  margin-bottom: 2%;
}

.line-style-active {
  border-bottom: 3px solid #4CAF50 !important;
}

.solid-line-property2 {
  width: 30px;
  transform: rotate(-50deg);
  border-top: 1px solid black;
}

.dashed-line-property2 {
  width: 30px;
  transform: rotate(-50deg);
  border-top: 2px dashed black;
}

.dotted-line-property2 {
  width: 30px;
  transform: rotate(-50deg);
  border-top: 4px dotted black;
}

.date-default-prop .v-select__selection--comma {
  white-space: normal !important;
}

.v-textarea.v-text-field--enclosed.calc-function-prop-create .v-text-field__slot textarea {
  margin-top: 0px;
  padding-right: 0%;
  line-height: 23px;
}

.v-text-field--outlined.textarea-prop-auto-row > .v-input__control > .v-input__slot {
  height: 100px !important;
}

.v-text-field--outlined.textarea-default-value-prop-auto-row > .v-input__control > .v-input__slot {
  height: 75px !important;
}

.set-hiding-obj-btn {
  display: inline-block;
  white-space: pre-line;
  height: auto !important;
}

.v-input.condition-title-label .v-label {
  line-height: 30px;
  height: 30px;
  top: 6px !important;
}

.v-input.condition-start-value-label .v-label {
  line-height: 25px !important;
}

.divider-permission {
  margin-left: 7%;
  margin-right: 3%;
}

.role-name {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  margin-left: 35%;
}

.help-msg {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: gray;
}

.delete-object-row {
  width: 100%;
  margin: 0%;
}

.delete-object-btn {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  text-transform: capitalize;
}

.step-see-height-box.v-text-field--outlined > .v-input__control > .v-input__slot {
  height: unset !important;
}

.no-step-row {
  width: 100%;
  margin-left: 0%;
}

.no-step-word {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: #ff8f00;
  text-align: center;
  width: 100%;
}

.no-step-icon {
  margin-right: 1%;
  margin-bottom: 1%;
}

.note-step {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: #ff8f00;
}

.forbiden-email-chip {
  font-family: 'Sarabun', sans-serif;
  font-size: 13px !important;
}

.v-text-field--outlined.note-row2 > .v-input__control > .v-input__slot {
  height: 120px !important;
}

.section-define {
  color: lightgray;
  font-size: 20px;
}


.theme--light.v-btn.v-btn--disabled.button-drag:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: #C2EB81 !important;
  min-width: 32px;
}

.section-name {
  border: dashed 1px #67C25D;
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  width: 20%;
  text-align: center;
  background-color: #C2EB81;
  opacity: 0.4;
}

.section-box {
  border: dashed 3px #1b9900;
  width: 500px;
  height: 250px;
}

.editor-box-title {
  font-family: 'Sarabun', sans-serif;
  font-size: 12px;
  color: lightgray;
  text-align: left;
  position: absolute;
  top: -17px;
}

.editor-box-raw {
  border: 1px solid lightgray;
  border-radius: 4px;
  color: lightgray;
  width: 100%;
  height: 100%;
}

.insert-img-modal-row {
  width: 100%;
  margin: 0%;
}

.inert-img-modal-header {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
}

.insert-img-modal-btn {
  font-family: 'Sarabun', sans-serif;
  text-transform: capitalize;
}

.input-box {
  border: 1px solid lightgray;
  /* color: black; */
  border-radius: 5px;
  width: 100%;
}

.rectangle {
  border: 2px solid black;
  width: 300px;
  height: 150px;
}

.property-row {
  width: 100%;
  margin: 0%;
}

.template-status {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: black;
}

.v-text-field--outlined.note-row > .v-input__control > .v-input__slot {
  height: 90px !important;
}

.tips {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: gray;
}

.all-create-workflow-block {
  margin-left: 7%;
  overflow: auto;
  max-height: calc(100vh - 445px);
}

.workflow-step-row {
  width: 100%;
  margin: 0%;
}

.each-step-workflow {
  min-height: 30px !important;
}

.each-step-workflow-icon {
  align-self: center;
}

.each-step-workflow-mail {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
}

.alert-onechat-block {
  min-width: 21px !important;
  align-self: center;
}

.v-text-field--outlined.condition-auto-row > .v-input__control > .v-input__slot {
  height: 100px !important;
}

.v-text-field--outlined.textarea-default-value-row > .v-input__control > .v-input__slot {
  height: 75px !important;
}

.v-text-field.input-cell-name input {
  line-height: 22px !important;
}

.suggest-checkbox-setting-step {
  padding-left: 7%;
  font-family: 'Sarabun', sans-serif;
  font-size: 13px !important;
  height: unset;
}

/* .v-text-field--outlined > .v-input__control > .v-input__slot  {
  height: 30px !important;
  padding: 0px !important;
} */

.permission-data-all-title {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  color: black;
  text-align: right;
}

.apply-all-btn {
  font-family: 'Sarabun', sans-serif;
  text-transform: capitalize;
}

.permission-object-type {
  font-family: 'Sarabun', sans-serif;
  font-size: 16px;
  color: #2ACA9F;
}

.line-expan-permission {
  border: solid 1px #2ACA9F;
  margin-left: 1%;
}

.object-content-permission .v-expansion-panel-content__wrap {
  padding-left: 1% !important;
  padding-right: 0% !important;
}

.permission-title {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px !important;
  color: #2ACA9F !important;
  background-color: #97E2E7 !important;
  border: 1px solid white;
  text-align: center !important;
}

.permission-table-striped > tr:nth-child(even) {
  background-color: #EEEEEE;
}

.permission-table-data {
  border: 1px solid #e0e0e0;
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
}

.permission-box.v-text-field--outlined > .v-input__control > .v-input__slot {
  height: unset !important;
}

.role-chip {
  font-family: 'Sarabun', sans-serif;
  font-size: 12px !important;
  color: #2ACA9F !important;
}

.row-email-permission {
  width: 100%;
  margin-left: 0%;
}

.divider-end-permission-modal {
  margin-left: 2%;
  margin-right: 1%;
}
</style>

<style>

.v-text-field--outlined.date-input > .v-input__control > .v-input__slot  {
    font-size: 20px;
    height: 25px !important;
    min-height: 20px; 
    padding: 0 0 0 0;
}

.rectangle {
  border: 2px solid black;
  width: 300px;
  height: 150px;
}

.textareabox {
  color: lightgray;
  border: 1px solid lightgray;
  border-radius: 5px;
  width: 100%;
  height: 100%;
}

.v-text-field--outlined.small-dropdown > .v-input__control > .v-input__slot  {
  font-size: 16px;
  min-height: 16px;
  max-height: 22px;
  padding: 2px 2px 2px 2px;
}

.v-text-field.v-text-field--enclosed.dropdown-icon-block .v-input__append-inner {
  margin-top: 0% !important;
}

.dropdown-icon .v-input__icon {
  max-height: 22px;
}

.object-table {
  border:1px solid black;
  border-collapse:collapse;
}

.page {
  background-color: rgb(206, 206, 206);
  padding-top: 1%;
  padding-bottom: 2%;
  padding-left: 7px;
  padding-right: 7px;
}

.paper {
  font-family: "Sarabun", sans-serif !important;
  padding-left: 24px;
  padding-right: 24px;
}

.inside-expire-day-box .v-text-field__suffix {
  padding-left: 0% !important;
  padding-right: 4%;
}

.email-last-alert {
  font-family: "Sarabun", sans-serif;
}

.setting-hiding{
  text-transform: capitalize;
}

.btn-label-mobile {
  font-family: "Sarabun", sans-serif;
  font-size: 12px !important;
  display: -webkit-inline-box;
  width: 100%;
  white-space: normal;
  /* margin-left: 4%; */
  text-align: center;
  text-transform: capitalize;
  height: auto !important;
}

.v-textarea.v-text-field--enclosed.question-form-box .v-text-field__slot textarea {
  line-height: 23px;
}

.icon-eye-inputbox{
  position: absolute !important;
  left: 0%;
  top: -65%;
}

.icon-eye-textareabox{
  position: absolute !important;
  left: 0%;
  top: -25%;
}

.icon-eye-checkbox{
  position: absolute !important;
  left: 0%;
  top: -20px;
}

.icon-eye-autofillbox{
  position: absolute !important;
  left: 0%;
  top: -60%;
}

.table-icon-eye{
  position: relative;
}

.icon-eye-datatable{
  position: absolute !important;
  right: 0%;
}

.validate-doc-btn {
  font-family: "Sarabun", sans-serif;
  text-transform: capitalize;
}

.filling-obj-label {
  font-family: "Sarabun", sans-serif;
  color: black;
  font-size: 14px;
}

/*======== style from old file >> Create_Template(old version) ========*

.section-box {
  border: dashed 3px #7CB342;
  width: 500px;
  height: 250px;
}

.object-card {
  height: 92vh;
  /* padding-left: 4%;
  padding-top: 3%;
  } 
*/

.text-feild {
  border: 1px dashed lightgray;
  /* color: black; */
  width: 100%;
}

.rectangle {
  border: 2px solid black;
  width: 300px;
  height: 150px;
}

.v-text-field--outlined.note-row > .v-input__control > .v-input__slot {
  height: 90px !important;
}

.tips {
  font-family: 'Sarabun', sans-serif;
  font-size: 14px;
  color: gray;
}

.v-text-field--outlined.condition-auto-row > .v-input__control > .v-input__slot {
  height: 100px !important;
}

.v-text-field--outlined.textarea-default-value-row > .v-input__control > .v-input__slot {
  height: 75px !important;
}

.v-text-field.input-cell-name input {
  line-height: 22px !important;
}

/* .v-text-field--outlined > .v-input__control > .v-input__slot  {
  height: 30px !important;
  padding: 0px !important;
} */

.v-text-field--outlined.date-input > .v-input__control > .v-input__slot  {
  font-size: 20px;
  height: 25px !important;
  min-height: 20px; 
  padding: 0 0 0 0;
}

.textareabox {
  color: lightgray;
  border: 1px solid lightgray;
  border-radius: 5px;
  width: 100%;
  height: 100%;
}

.v-text-field--outlined.small-dropdown > .v-input__control > .v-input__slot  {
  font-size: 16px;
  min-height: 16px;
  max-height: 22px;
  padding: 2px 2px 2px 2px;
}

.dropdown-icon .v-input__icon {
  max-height: 22px;
}

.page {
  background-color: rgb(206, 206, 206);
  padding-top: 1%;
  padding-bottom: 2%;
  padding-left: 7px;
  padding-right: 7px;
}

.paper {
  font-family: "Sarabun", sans-serif !important;
  padding-left: 24px;
  padding-right: 24px;
}
/*=====================================================================*/

/*======== style from old file >> Edit_Template(old version) ========*/

.theme--light.v-btn.v-btn--disabled .v-btn__loading .icon-drag {
  color: #1b9900 !important;
}

.data-chip-roleList{
  font-family: 'Sarabun', sans-serif;
  font-size: 12px !important;
  white-space: inherit;
  height: auto !important;
  padding-top: 3%;
  padding-bottom: 3%;
}

/*=====================================================================*/
</style>
