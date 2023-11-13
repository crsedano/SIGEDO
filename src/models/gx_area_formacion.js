'use strict';

import axios from 'axios'

export default class GxAreaFormacion {
  constructor(
    url = '',
    id_area_formacion = '',
    nombre = ''
  ) {
    this.url = url
    this.id_area_formacion = id_area_formacion
    this.nombre = nombre
  }

  // Obtiene todos los datos de area de formacion
  async getAll(autho) {
    console.log(this.url, 'jojojo')
    try {
      const res = await axios.get(`${this.url}js-get-all-area-formacion`, autho)

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