'use strict';

export default class GxContactoDocente {
    constructor(
        idreg = '',
        id_tipo_contacto = '',
        ctipo = '',
        cvalor = '',
        id_docente = '',
        fhreg = '',
        ccodusua = '',
        c9 = '',
    ) {
        this.idreg = idreg
        this.id_tipo_contacto = id_tipo_contacto
        this.ctipo = ctipo
        this.cvalor = cvalor
        this.id_docente = id_docente
        this.fhreg = fhreg
        this.ccodusua = ccodusua
        this.c9 = c9
    }

}