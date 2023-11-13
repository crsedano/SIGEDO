'use strict';

export default class GxSilabusPerfilG {
  constructor(
    id_silabus_perfil='',
    id_asignatura = '',
    fecha_insert = '',
    id_periodo = '',
    id_semestre = '',
    id_usuario_insert = '',
    cdetalle='',
  ) {
    this.id_silabus_perfil=id_silabus_perfil
    this.cdetalle = cdetalle;
    this.id_asignatura = id_asignatura
    this.id_usuario_insert = id_usuario_insert
    this.fecha_insert = fecha_insert
    this.id_periodo = id_periodo
    this.id_semestre = id_semestre
  }

}