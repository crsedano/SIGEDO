'use strict';

import axios from 'axios'

export default class GxInvestigacionUpla {
    constructor(
        url = '',
        idreg = '',
        id_docente = '',
        cresolucion = '',
        ctitulo = '',
        finicio = '',
        ffin = '',
        fhreg = '',
        id_usuario = ''
    ) {
        this.url = url
        this.idreg = idreg
        this.id_docente = id_docente
        this.cresolucion = cresolucion
        this.ctitulo = ctitulo
        this.finicio = finicio
        this.ffin = ffin
        this.fhreg = fhreg
        this.id_usuario = id_usuario
    }


    async create(autho) {
        try {
            const res = await axios.post(`${this.url}js-create-investigacion-upla`, this, autho)

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

    async update(autho) {
        try {
            const res = await axios.post(`${this.url}js-update-investigacion-upla/${this.idreg}`, this, autho)
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

    async getByDocente(autho) {
        try {
            const res = await axios.get(`${this.url}js-get-investigacion-upla/${this.id_docente}`, autho)

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

    async reportesinvestigacion(autho, id_periodo, id_semestre, id_filial, id_modalidad, id_facultad, id_escuela) {
        try {
            const res = await axios.get(`${this.url}js-reportes-investigacion-upla/${id_periodo}/${id_semestre}/${id_filial}/${id_modalidad}/${id_facultad}/${id_escuela}`, autho)

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
