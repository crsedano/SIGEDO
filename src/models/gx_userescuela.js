'use strict';

import axios from 'axios'

export default class GxUserEscuela {
    constructor(
        url = '',
        id_reg = '',
        id_usuario = '',
        id_filial = '',
        id_facultad = '',
        id_escuela = '',
        id_modalidad = '',
    ) {
        this.url = url
        this.id_reg = id_reg
        this.id_usuario = id_usuario
        this.id_filial = id_filial
        this.id_facultad = id_facultad
        this.id_escuela = id_escuela
        this.id_modalidad = id_modalidad
    }

    async getFacultadByUser(autho) {
        try {
            const res = await axios.get(`${this.url}js-user-facultad-id/${this.id_usuario}`, autho)

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
