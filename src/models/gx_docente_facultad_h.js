'use strict'

import axios from 'axios'

export default class GxFilial {
    constructor(
        url = '',
        idreg = '',
        id_docente = '',
        id_facultad = '',
        id_usuario = '',
        fhreg = ''
    ) {
        this.url = url
        this.idreg = idreg
        this.id_docente = id_docente
        this.id_facultad = id_facultad
        this.id_usuario = id_usuario
        this.fhreg = fhreg
    }

    async insert(autho) {
        try {
            const res = await axios.post(`${this.url}js-insert-docente-facultad-h`, this, autho)

        } catch (err) {
            console.dir(err)
        }   
    }
}