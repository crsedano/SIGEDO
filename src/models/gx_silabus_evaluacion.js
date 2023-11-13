'use strict';

export default class GxSilabusEvaluacion {
    constructor(
        id_silabus_evaluacion = '',
        cdetalle = '',
        ctipo = '',
        canio = '',
        cperiodo = '',
        id_asignatura = '',
        id_docente = '',
        fecha_insert = '',
        id_usuario_insert = '',
        id_periodo = '',
        id_semestre = '',
        id_modalidad = '',
        id_filial = '',
    ) {
        this.id_silabus_evaluacion = id_silabus_evaluacion
        this.cdetalle = cdetalle
        this.ctipo = ctipo
        this.canio = canio
        this.cperiodo = cperiodo
        this.id_asignatura = id_asignatura
        this.id_docente = id_docente
        this.fecha_insert = fecha_insert
        this.id_usuario_insert = id_usuario_insert
        this.id_periodo = id_periodo
        this.id_semestre = id_semestre
        this.id_modalidad = id_modalidad
        this.id_filial = id_filial
    }

}
