'use strict';

import axios from 'axios'

export default class GxPlanEstudio {
  constructor(
    url = '',
    id_plan_estudio = '',
    anio = ''
  ) {
    this.url = url
    this.id_plan_estudio = id_plan_estudio
    this.anio = anio
  }

  async getAll(autho) {
    try {
      const res = await axios.get(`${this.url}js-get-all-plan-estudio`, autho)

      if (res.status === 200) {
        return {
          success: true,
          data: res.data.data
        }
      }

    } catch (err) {
      console.dir(err)
    }

    return {
      success: false
    }
  }

  /**
   * Obtiene el detalle del plan de estudio
   * cursos, horas, creditos
   */
  async getDetallePlan(autho, id_facultad, id_escuela) {
    try {
      const res = await axios.get(`${this.url}js-get-plan-estudio/${this.id_plan_estudio}/${id_facultad}/${id_escuela}`, autho)

      if (res.status === 200) {
        return {
          success: true,
          data: res.data.data
        }
      }

    } catch (err) {
      console.dir(err)
    }

    return {
      success: false
    }
  }

  async getSilabosPlan(autho, id_facultad, id_escuela, id_periodo, id_semestre) {
    try {
      const res = await axios.get(`${this.url}js-get-silabo-estudio/${this.id_plan_estudio}/${id_facultad}/${id_escuela}/${id_periodo}/${id_semestre}`, autho)

      if (res.status === 200) {
        return {
          success: true,
          data: res.data.data
        }
      }

    } catch (err) {
      console.dir(err)
    }

    return {
      success: false
    }
  }

  
    /**
   * Obtiene el detalle del area de formacion
   * cursos
   */
  async getDetalleArea(autho, id_facultad, id_escuela) {
    try {
      const res = await axios.get(`${this.url}js-get-area-formacion/${this.id_plan_estudio}/${id_facultad}/${id_escuela}`, autho)

      if (res.status === 200) {
        return {
          success: true,
          data: res.data.data
        }
      }

    } catch (err) {
      console.dir(err)
    }

    return {
      success: false
    }
  }

     /**
   * Obtiene el detalle de la carga electiva reporte por ciclo
   */
  async getDetalleReporteCiclo(autho,id_periodo, id_semestre, id_version, id_escuela,) {
    try {
      const res = await axios.get(`${this.url}js-all-reporte-carga-ciclo/${this.id_plan_estudio}/${id_periodo}/${id_semestre}/${id_version}/${id_escuela}`, autho)

      if (res.status === 200) {
        return {
          success: true,
          data: res.data.data
        }
      }

    } catch (err) {
      console.dir(err)
    }

    return {
      success: false
    }
  }


}