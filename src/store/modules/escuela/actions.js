import GxEscuela from '../../../models/gx_escuela'

const getEscuela = async (ctx) => {
  if(ctx.state.arrEscuelas) return

  let token = ctx.rootState.token
  if(!token) return

  const autho = {
    headers: {
      Authorization: token,
    }
  }

  const gxEscuela = new GxEscuela(process.env.VUE_APP_URL)
  const res = await gxEscuela.getAll(autho)

  if(res.success) {
    let escuelas = res.data

    escuelas.unshift({
      id_escuela: 0,
      nombre: 'SELECCIONAR'
    })

    ctx.commit('ARRESCUELAS_UPDATE', escuelas)
  } else {
    ctx.commit('ARRESCUELAS_UPDATE', null)
  }
}

export default {
  getEscuela
}