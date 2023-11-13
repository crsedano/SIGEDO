'use strict';

import axios from 'axios'

export default class GxPais {
    constructor(
        url = '',
        id_pais = '',
        cpais = '',
        cactivo ='',
        nacionalidad = ''
    ) {
        this.url = url
        this.id_pais = id_pais
        this.cpais = cpais
        this.cactivo = cactivo
        this.nacionalidad = nacionalidad
    }

    async getAll(autho) {
        try {
            const res = await axios.get(`${this.url}js-pais`, autho)
            
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
