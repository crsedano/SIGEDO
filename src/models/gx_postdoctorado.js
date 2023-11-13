'use strict'

import axios from 'axios'

export default class GxPostDoctorado {
  constructor(
    url = '',
    id_titulo = '',
    nombre = ''
  ) {
    this.url = url
    this.id_titulo = id_titulo
    this.nombre = nombre
  }

  async reportePostDoctorado(autho, id_periodo, id_semestre, id_filial, id_modalidad, id_facultad, id_escuela, d) {
    try {
      const res = await axios.get(`${this.url}js-reporte-post-doctorado/${id_periodo}/${id_semestre}/${id_filial}/${id_modalidad}/${id_facultad}/${id_escuela}/${d}`, autho)

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

  async edit(autho) {
    try {
      const res = await axios.post(`${this.url}js-edit-postdoctorado/${this.nombre}/${this.id_titulo}`, {}, autho)

      if (res.status === 201) {
        return {
          success: true
        }
      }
    } catch (err) {
      console.dir(err)
    }

    return {
      success: false
    }
  }

  async create(autho) {
    try {
      const res = await axios.post(`${this.url}js-insert-postdoctorado/${this.nombre}`, {}, autho)
      if (res.status === 201) {
        return {
          success: true
        }
      }
    } catch (err) {
      console.dir(err)
    }

    return {
      success: false
    }
  }

  async getAll(autho) {
    try {
      const res = await axios.get(`${this.url}js-postdoctorado`, autho)
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
