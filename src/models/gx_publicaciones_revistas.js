'use strict'

import axios from 'axios'

export default class {
  constructor(
    url = '',
    idreg = '',
    id_docente = '',
    fpublicacion = '',
    id_revista = '',
    crevista = '',
    ctitulo = '',
    ccodusua = ''
  ) {
    this.url = url
    this.idreg = idreg
    this.id_docente = id_docente
    this.fpublicacion = fpublicacion
    this.id_revista = id_revista
    this.crevista = crevista
    this.ctitulo = ctitulo
    this.ccodusua = ccodusua
  }

  async create(autho) {
    try {
      const res = await axios.post(`${this.url}js-create-publicaciones-revistas`, this, autho)

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

  async update(autho) {
    try {
      const res = await axios.post(`${this.url}js-update-publicaciones-revistas/${this.idreg}`, this, autho)

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

  async getByDocente(autho) {
    try {
      const res = await axios.get(`${this.url}js-get-publicaciones-revistas/${this.id_docente}`, autho)

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

  async reportes(autho, id_periodo, id_semestre, id_filial, id_modalidad, id_facultad, id_escuela) {
    try {
      const res = await axios.get(`${this.url}js-reportes-publicaciones-revistas/${id_periodo}/${id_semestre}/${id_filial}/${id_modalidad}/${id_facultad}/${id_escuela}`, autho)

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