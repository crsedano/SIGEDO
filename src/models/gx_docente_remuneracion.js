'use strict';

import axios from 'axios'

export default class {
  constructor(
    url = '',
    id_docente = '',
    id_periodo = '',
    id_semestre = '',
    id_facultad = '',
    nremuneracion_p = '',
    nremuneracion_sp = ''
  ) {
    this.url = url
    this.id_docente = id_docente
    this.id_periodo = id_periodo
    this.id_semestre = id_semestre
    this.id_facultad = id_facultad
    this.nremuneracion_p = nremuneracion_p
    this.nremuneracion_sp = nremuneracion_sp
  }

  async getByFacultad(autho) {
    try {
      const res = await axios.get(`${this.url}js-get-docente-remuneracion/${this.id_periodo}/${this.id_semestre}/${this.id_facultad}`, autho)
      
      if(res.status === 200) {
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

  async create(autho) {
    try {
      const res = await axios.post(`${this.url}js-create-docente-remuneracion`, this, autho)
      
      if(res.status === 201) {
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


}