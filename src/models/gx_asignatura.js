'use strict';

export default class GxAsignatura {
  constructor(
    id_asignatura = '',
    cod_asignatura = '',
    nombre = '',
    horas_teoricas = '',
    horas_practicas = '',
    creditos = '',
    ciclo = '',
    id_plan_estudio = '',
    id_area_formacion = '',
    idtipocurso = '',
    cod_asignatura_general = '', //
    id_asignatura_general = '',//
    sp_phorasteoricas = '',
    sp_phoraspracticas = '',
    sp_vhorasteoricas = '',
    sp_vhoraspracticas = '',
    ctipocurso = '' //
  ) {
    this.id_asignatura = id_asignatura
    this.cod_asignatura = cod_asignatura
    this.nombre = nombre
    this.horas_teoricas = horas_teoricas
    this.horas_practicas = horas_practicas
    this.creditos = creditos
    this.ciclo = ciclo
    this.id_plan_estudio = id_plan_estudio
    this.id_area_formacion = id_area_formacion
    this.idtipocurso = idtipocurso
    this.cod_asignatura_general = cod_asignatura_general
    this.id_asignatura_general = id_asignatura_general
    this.sp_phorasteoricas = sp_phorasteoricas
    this.sp_phoraspracticas = sp_phoraspracticas
    this.sp_vhorasteoricas = sp_vhorasteoricas
    this.sp_vhoraspracticas = sp_vhoraspracticas
    this.ctipocurso = ctipocurso
  }

 }