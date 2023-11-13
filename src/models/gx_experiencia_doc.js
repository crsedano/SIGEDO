'use strict';

export default class GxExperienciaDoc {
    constructor(
        id_exp_doc = '',
        id_docente = '',
        cnombreasig = '',
        id_universidad = '',
        cuniversidad = '',
        cfacultad = '',
        cescuela = '',
        finicio = '',
        ffin = '',
        fhreg = '',
        ccodusua = '',
    ) {
        this.id_exp_doc = id_exp_doc
        this.id_docente = id_docente
        this.cnombreasig = cnombreasig
        this.id_universidad = id_universidad
        this.cuniversidad = cuniversidad
        this.cfacultad = cfacultad
        this.cescuela = cescuela
        this.finicio = finicio
        this.ffin = ffin
        this.fhreg = fhreg
        this.ccodusua = ccodusua
    }

}
