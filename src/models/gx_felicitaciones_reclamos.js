'use strict';

import axios from 'axios'

export default class GxFelicitacionesReclamos {
    constructor(
        url = '',
        idreg = '',
        id_docente = '',
        id_periodo = '',
        id_semestre = '',
        idtipo = '',
        ctipo = '',
        cdescripcion = '',
        ccodalumno = '',
        calumno = '',
        fhreg = '',
        ccodusua = ''
    ) {
        this.url = url
        this.idreg = idreg
        this.id_docente = id_docente
        this.id_periodo = id_periodo
        this.id_semestre = id_semestre
        this.idtipo = idtipo
        this.ctipo = ctipo
        this.cdescripcion = cdescripcion
        this.ccodalumno = ccodalumno
        this.calumno = calumno
        this.fhreg = fhreg
        this.ccodusua = ccodusua
    }


    async create(autho) {
        try {
            const res = await axios.post(`${this.url}js-create-felicitaciones-reclamos`, this, autho)

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
            const res = await axios.post(`${this.url}js-update-felicitaciones-reclamos/${this.idreg}`, this, autho)
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
            const res = await axios.get(`${this.url}js-get-felicitaciones-reclamos/${this.id_docente}`, autho)

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

    async reportesdelicitacionreclamo(autho, id_periodo, id_semestre, id_filial, id_modalidad, id_facultad, id_escuela) {
        try {
            const res = await axios.get(`${this.url}js-reportes-felicitaciones-reclamos/${id_periodo}/${id_semestre}/${id_filial}/${id_modalidad}/${id_facultad}/${id_escuela}`, autho)

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
