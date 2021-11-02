import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import * as Cookies from 'js-cookie'

Vue.use(Vuex);
var text_lang = {
  en: require('@/components/lauguage/lang_en.json'),
  th: require('@/components/lauguage/lang_th.json')
}
export default new Vuex.Store({
  state: {
    currentLanguage: sessionStorage.getItem('page_lang') || 'th',
    uploadedFile: [],
    pplDocumentTypes: [],
    pplDocumentTemplates: [],
    storedDocumentTemplates: [],
    objectTemplate: [],
    allEmployeeInfo: []
  },
  plugins: [
    createPersistedState({
      getState: (key) => Cookies.get(key),
      setState: (key, state) => Cookies.set(key, state, { expires: 1, secure: true })
    })
  ],
  getters: {
    textLang: state => text_lang[state.currentLanguage],
    uploadedFile: state => state.uploadedFile
  },
  mutations: {
    changeLanguage(state,payload){
      state.currentLanguage = payload
    },
    setUploadedFile(state,payload){
      state.uploadedFile = payload
    },
    setPplDocumentTypes(state,payload){
      state.pplDocumentTypes = payload
    },
    setPplDocumentTemplates(state,payload){
      state.pplDocumentTemplates = payload
    },
    setStoredDocumentTemplates(state,payload){
      state.storedDocumentTemplates = payload
    },
    setObjectTemplate(state,payload){
      state.objectTemplate = payload
    },
    setAllEmployeeInfo(state,payload){
      state.allEmployeeInfo = payload
    }
  },
  actions: {

  }
});
