'use strict';

import axios from 'axios'

export default class GxOtrosEstudios {
    constructor(
        url = '',
        id_estudio = '',
        ctipo = '',
        cdenominacion = '',
        id_universidad = '',
        cuniversidad = '',
        id_pais = '',
        cpais = '',
        fgrado = '',
        fhreg = '',
        ccodusua = '',
        idvar = '',
        id_docente = '',
        img=''
    ) {
        this.url = url
        this.id_estudio = id_estudio
        this.ctipo = ctipo
        this.cdenominacion = cdenominacion
        this.id_universidad = id_universidad
        this.cuniversidad = cuniversidad
        this.id_pais = id_pais
        this.cpais = cpais
        this.fgrado = fgrado
        this.fhreg = fhreg
        this.ccodusua = ccodusua
        this.idvar = idvar
        this.id_docente = id_docente
        this.img=img
    }

    async create(autho) {
        try {
            const res = await axios.post(`${this.url}js-create-otros-estudios`, this, autho)

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
            const res = await axios.post(`${this.url}js-update-otros-estudios/${this.id_estudio}`, this, autho)
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
            const res = await axios.get(`${this.url}js-get-otros-estudios/${this.id_docente}`, autho)

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

    async reportes(autho, id_periodo, id_semestre, id_filial, id_modalidad, id_facultad, id_escuela, idvar) {
        try {
            const res = await axios.get(`${this.url}js-reportes-otros/${id_periodo}/${id_semestre}/${id_filial}/${id_modalidad}/${id_facultad}/${id_escuela}/${idvar}`, autho)
            
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
