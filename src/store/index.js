import Vue from 'vue';
import Vuex from 'vuex';

import facultad from './modules/facultad/facultad'
import escuela from './modules/escuela/escuela'
import planes_estudio from './modules/planes_estudio/planes_estudio'
import filial from './modules/filial/filial'
import area_formacion from './modules/area_formacion/area_formacion'

import docente from './modules/docente/docente'

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    identity: null,
    token   : null,
    periodo : null,
    entorno : null,
    permisos: null,
    isAlumno: false
  },

  mutations: {
    IDENTITY_UPDATE: (state, payload) => {
      state.identity = payload
    },

    TOKEN_UPDATE: (state, payload) => {
      state.token = payload
    },

    PERIODO_UPDATE: (state, payload) => {
      state.periodo = payload
    },

    ENTORNO_UPDATE: (state, payload) => {
      state.entorno = payload
    },

    PERMISOS_UPDATE: (state, payload) => {
      state.permisos = payload
    },

    ISALUMNO_UPDATE: (state, payload) => {
      state.isAlumno = payload
    }
  },

  actions: {
    getIdentity: ({
      commit,
      state
    }) => {

      if (state.identity) return

      let identity = store._vm.$session.get('identity')

      commit('IDENTITY_UPDATE', identity)
    },

    getToken: ({
      commit,
      state
    }) => {
      if (state.token) return

      let token = store._vm.$session.get('token')

      commit('TOKEN_UPDATE', token)
    },

    getPeriodo: ({
      commit,
      state
    }) => {
      if (state.periodo) return

      let periodo = store._vm.$session.get('periodo')

      commit('PERIODO_UPDATE', periodo)
    },

    getEntorno: ({
      commit,
      state
    }) => {
      if (state.entorno) return

      let entorno = store._vm.$session.get('entorno')

      commit('ENTORNO_UPDATE', entorno)
    },

    getIsAlumno: ({
      commit
    }) => {
      let isAlumno = store._vm.$session.get('isAlumno')
      commit('ISALUMNO_UPDATE', isAlumno)
    }
  },

  modules: {
    facultad,
    escuela,
    planes_estudio,
    filial,
    docente,
    area_formacion
  }
})

export default store