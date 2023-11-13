import GxFilial from '../../../models/gx_filial'

const getFiliales = async (context) => {
  if (context.state.arrFilial) return

  let token = context.rootState.token
  if(!token) return

  const autho = {
    headers: {
      Authorization: token,
    }
  }

  const gxFilial = new GxFilial(process.env.VUE_APP_URL)
  const res = await gxFilial.getAll(autho)

  if (res.success) {
    let fils = res.data

    fils.unshift({
      id_filial: 0,
      nombre_filial: 'SELECCIONAR'
    })

    context.commit('ARRFILIAL_UPDATE', fils)
  } else {
    context.commit('ARRFILIAL_UPDATE', null)
  }
}

const getFilialesByUser = async ({state, commit, rootState}) => {
  if (state.arrFilialUser) return

  const identity = rootState.identity

  if(!identity) return

  let token = rootState.token
  if(!token) return
  
  const autho = {
    headers: {
      Authorization: token,
    }
  }

  const gxFilial = new GxFilial(process.env.VUE_APP_URL)
  const res = await gxFilial.getByUser(identity.id_usuario, autho)

  if(res.success) {
    let fils = res.data

    fils.unshift({
      id_filial: 0,
      nombre_filial: 'SELECCIONAR'
    })

    commit('ARR_FILIAL_USER_UPDATE', fils)
  } else {
    commit('ARR_FILIAL_USER_UPDATE', null)
  }
}

export default {
  getFiliales,
  getFilialesByUser
}