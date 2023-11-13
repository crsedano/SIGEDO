'use strict'

import axios from 'axios'

export default class GxMagister {
    constructor(
        url = '',
        id_titulo = '',
        nombre = ''
    ) {
        this.url = url
        this.id_titulo = id_titulo
        this.nombre = nombre
    }

    async reporteMaestria(autho, id_periodo, id_semestre, id_filial, id_modalidad, id_facultad, id_escuela, d) {
        try {
            const res = await axios.get(`${this.url}js-reporte-maestria/${id_periodo}/${id_semestre}/${id_filial}/${id_modalidad}/${id_facultad}/${id_escuela}/${d}`, autho)
            
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

}