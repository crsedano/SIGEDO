'use strict';

export default class GxCronogramaSigedo {
  constructor(
    idreg = null,
    id_actividad = null,
    finicio = null,
    ffin = null,
    id_periodo = null,
    id_semestre = null,
    detalle = null,
    id_modalidad = null,
    created_at = null,
    updated_at = null
  ) {
    this.idreg = idreg
    this.id_actividad = id_actividad
    this.finicio = finicio
    this.ffin = ffin
    this.id_periodo = id_periodo
    this.id_semestre = id_semestre
    this.detalle = detalle
    this.id_modalidad = id_modalidad
    this.created_at = created_at
    this.updated_at = updated_at
  }
 }