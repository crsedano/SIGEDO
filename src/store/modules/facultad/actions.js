import GxFacultad from '../../../models/gx_facultad'
import GxUserEscuela from '../../../models/gx_userescuela'

const getFacultades = async (context) => {
  if (context.state.arrFacultades) return

  let token = context.rootState.token
  if(!token) return

  const autho = {
    headers: {
      Authorization: token,
    }
  }

  const gxFacultad = new GxFacultad(process.env.VUE_APP_URL)
  const res = await gxFacultad.getAll(autho)

  if (res.success) {
    let facs = res.data

    facs.unshift({
      id_facultad: 0,
      nombre: 'SELECCIONAR'
    })

    context.commit('updateArrFacultad', facs)
    context.dispatch('escuela/getEscuela', null, {
      root: true
    })
  } else {
    context.commit('updateArrFacultad', null)
  }
}

const getFacultadByUser = async (context) => {
  if (context.state.arrFacultadUser) return

  let token = context.rootState.token
  if(!token) return

  let identity = context.rootState.identity
  if(!identity) return

  let { id_usuario } = identity

  const autho = {
    headers: {
      Authorization: token,
    }
  }

  const gxUserEscuela = new GxUserEscuela(process.env.VUE_APP_URL)
  gxUserEscuela.id_usuario = id_usuario
  const res = await gxUserEscuela.getFacultadByUser(autho)

  if (res.success) {
    let facs = res.data

    facs.unshift({
      id_facultad: 0,
      nombre: 'SELECCIONAR'
    })

    context.commit('UPDATE_ARRFACULTADUSER', facs)
    context.dispatch('escuela/getEscuela', null, {
      root: true
    })
  } else {
    context.commit('UPDATE_ARRFACULTADUSER', null)
  }
}

export default {
  getFacultades,
  getFacultadByUser
}