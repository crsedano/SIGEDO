const state = {
  arrFilial: null,
  arrFilialUser: null
}

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}