import GxPlanEstudio from '../../../models/gx_plan_estudio'

const getPlanes = async (context) => {
  if (context.state.arrPlanes) return

  let token = context.rootState.token
  if(!token) return

  const autho = {
    headers: {
      Authorization: token,
    }
  }

  const gxPlanEstudio = new GxPlanEstudio(process.env.VUE_APP_URL)
  const res = await gxPlanEstudio.getAll(autho)

  if (res.success) {
    let planes = res.data

    planes.unshift({
      id_plan_estudio: 0,
      anio: 'SELECCIONAR'
    })

    context.commit('ARRPLANES_UPDATE', planes)
  } else {
    context.commit('ARRPLANES_UPDATE', null)
  }
}

export default {
  getPlanes
}