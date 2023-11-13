const updateArrFacultad = (state, payload) => {
  state.arrFacultades = payload
}

const UPDATE_ARRFACULTADUSER = (state, payload) => {
  state.arrFacultadUser = payload
}

export default {
  updateArrFacultad,
  UPDATE_ARRFACULTADUSER
}