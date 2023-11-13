import GxAreaFormacion from '../../../models/gx_area_formacion'

const getArea = async (context) => {
  console.log('getareararar')
  if (context.state.arrArea) return

  let token = context.rootState.token
  if(!token) return

  const autho = {
    headers: {
      Authorization: token,
    }
  }

  const gxAreaFormacion = new GxAreaFormacion(process.env.VUE_APP_URL)
  const res = await gxAreaFormacion.getAll(autho)

  if (res.success) {
    let area = res.data

    area.unshift({
      id_area_formacion: 2,
      nombre: 'AREA FORMACION'
    })

    area.unshift({
      id_area_formacion: 1,
      nombre: 'CICLO'
    })

    area.unshift({
      id_area_formacion: 0,
      nombre: 'SELECCIONAR'
    })

    context.commit('ARRAREA_UPDATE', area)
  } else {
    context.commit('ARRAREA_UPDATE', null)
  }
}

export default {
  getArea
}