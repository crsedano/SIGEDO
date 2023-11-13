'use strict'

import axios from 'axios'

export default class GxFilial {
  constructor(
    url = '',
    id_filial = '',
    nombre_filial = '',
    descripcion = '',
    codigosunedu = '',
    nombre_filial_impresion = '',
    num_fp = ''
  ) {
    this.url = url
    this.id_filial = id_filial
    this.nombre_filial = nombre_filial
    this.descripcion = descripcion
    this.codigosunedu = codigosunedu
    this.nombre_filial_impresion = nombre_filial_impresion
    this.num_fp = num_fp
  }

  async getByUser(id_user, autho) {
    try {
      const res = await axios.get(`${this.url}js-filial-user/${id_user}`, autho)

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
      const res = await axios.get(`${this.url}js-filial`, autho)

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