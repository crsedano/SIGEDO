'use strict';

import axios from 'axios'

export default class GxUniversidad {
    constructor(
        url = '',
        idreg = '',
        cuniversidad = '',
        ctipo =''
    ) {
        this.url = url
        this.idreg = idreg
        this.cuniversidad = cuniversidad
        this.ctipo = ctipo
    }

    async getAll(autho) {
        try {
            const res = await axios.get(`${this.url}js-universidad`, autho)
            
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
