'use strict'

export default class Materiales {
  constructor(
    id = null,
    id_docente = null,
    id_periodo = null,
    id_semestre = null,
    id_asignatura = null,
    img = null,
    created_at = null,
    updated_at = null,
    semana = null,
    porcentaje = null,
    title = null
  ) {
    this.id = id
    this.id_docente = id_docente
    this.id_periodo = id_periodo
    this.id_semestre = id_semestre
    this.id_asignatura = id_asignatura
    this.img = img
    this.created_at = created_at
    this.updated_at = updated_at
    this.semana = semana
    this.porcentaje = porcentaje
    this.title = title
  }

}