'use strict';

export default class GxSilabusBibliografia {
    constructor(
        id_silabus_biblio = '',
        id_asignatura = '',
        autor ='',
        anio_public = '',
        titulo = '',
        lugar_public = '',
        editorial = '',
        descripcion = '',
        canio = '',
        cperiodo = '',
        id_usuario_insert = '',
        fecha_insert = '',
        id_docente = '',
        id_periodo = '',
        id_semestre = '',
        id_modalidad = '',
        id_filial = '',
    ) {
        this.id_silabus_biblio = id_silabus_biblio
        this.id_asignatura = id_asignatura
        this.autor = autor
        this.anio_public = anio_public
        this.titulo = titulo
        this.lugar_public = lugar_public
        this.editorial = editorial
        this.descripcion = descripcion
        this.canio = canio
        this.cperiodo = cperiodo
        this.id_usuario_insert = id_usuario_insert
        this.fecha_insert = fecha_insert
        this.id_docente = id_docente
        this.id_periodo = id_periodo
        this.id_semestre = id_semestre
        this.id_modalidad = id_modalidad
        this.id_filial = id_filial
    }

}
