'use strict'

import axios from 'axios'

export default class GxFacultad {
  constructor(
    url = '',
    id_escuela = '',
    cod_escuela = '',
    nombre = '',
    id_facultad = '',
  ) {
    this.url = url
    this.id_escuela = id_escuela
    this.cod_escuela = cod_escuela
    this.nombre = nombre
    this.id_facultad = id_facultad
  }

  async getByFacultad(autho) {
    try {
      const res = await axios.get(`${this.url}js-escuela/${this.id_facultad}`, autho)
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

  async getAll(autho) {
    try {
      const res = await axios.get(`${this.url}js-get-all`, autho)
      
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