const escuelaByFacultad = state => id_facultad => {
  if(id_facultad == 0) return null

  return state.arrEscuelas.filter(escuela => escuela.id_facultad == id_facultad || escuela.id_escuela == 0)
}

const getTest = state => {
  if(!state.arrEscuelas) return null
  return state.arrEscuelas[0]
}

export default {
  escuelaByFacultad,
  getTest
}