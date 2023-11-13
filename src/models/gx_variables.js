'use strict';

import axios from 'axios'

export default class GXUser {
    constructor(
        url = '',
        idvar = '',
        cnombre = '',
        cvalor = '',
        ctipo = ''
    ) {
        this.url = url
        this.idvar = idvar
        this.cnombre = cnombre
        this.cvalor = cvalor
        this.ctipo = ctipo
    }

    async getVariables(autho) {
        try {
            const res = await axios.get(`${this.url}js-all-variables/${this.ctipo}`, autho)
            
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
            const res = await axios.post(`${this.url}js-create-variable/${this.ctipo}/${this.cnombre}`, {}, autho)
            
            if(res.status === 201) {
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

    async update(autho) {
        try {
            const res = await axios.post(`${this.url}js-edit-variable/${this.ctipo}/${this.cnombre}/${this.idvar}`, {}, autho)
            
            if(res.status === 201) {
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
