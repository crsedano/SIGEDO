'use strict';

export default class GxSilabusObjetivo {
  constructor(
    url = '',
    id_silabus_obj = '',
    id_asignatura = '',
    objetivo = '',
    tipo_obj = '',
    id_usuario_insert = '',
    fecha_insert = '',
    canio = '',
    cperiodo = '',
    id_docente = '',
    id_periodo = '',
    id_semestre = '',
    id_modalidad = '',
    id_filial = '',
  ) {
    this.url = url
    this.id_silabus_obj = id_silabus_obj
    this.id_asignatura = id_asignatura
    this.objetivo = objetivo
    this.tipo_obj = tipo_obj
    this.id_usuario_insert = id_usuario_insert
    this.fecha_insert = fecha_insert
    this.canio = canio
    this.cperiodo = cperiodo
    this.id_docente = id_docente
    this.id_periodo = id_periodo
    this.id_semestre = id_semestre
    this.id_modalidad = id_modalidad
    this.id_filial = id_filial
  }

}