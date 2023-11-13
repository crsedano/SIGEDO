'use strict'

import axios from 'axios'

export default class GxFacultad {
  constructor(
    url = '',
    id_facultad = '',
    cod_facultad = '',
    nombre = '',
    siglas = '',
    activo = ''
  ) {
    this.url = url
    this.id_facultad = id_facultad
    this.cod_facultad = cod_facultad
    this.nombre = nombre
    this.siglas = siglas
    this.activo = activo
  }

  async getAll(autho) {
    try {
      const res = await axios.get(`${this.url}js-all-facultad`, autho)
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