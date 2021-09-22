import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import * as Cookies from 'js-cookie'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
    uploadedFile: state => {return state.uploadedFile}
  },
  mutations: {
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
