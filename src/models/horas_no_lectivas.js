'use strict'

export default class HorasNoLectivas {
  constructor(
    id = null,
    id_docente = null,
    semana = null,
    porcentaje = null,
    contenido = null,
    created_at = null,
    updated_at = null,
    id_periodo = null,
    id_semestre = null,
    done = null,
    unidad = null,
    img = null
  ) {
    this.id = id
    this.id_docente = id_docente
    this.semana = semana
    this.porcentaje = porcentaje
    this.contenido = contenido
    this.created_at = created_at
    this.updated_at = updated_at
    this.id_periodo = id_periodo
    this.id_semestre = id_semestre
    this.done = done
    this.unidad = unidad
    this.img = img
  }

}