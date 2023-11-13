'use strict';

export default class GXUser {
    constructor(
        url = '',
        id_usuario = '',
        nombres = '',
        apellido_paterno = '',
        apellido_materno = '',
        dni = '',
        correo_electronico = '',
        contrasena = '',
        observaciones = '',
        id_facultad = '',
        id_escuela = '',
        id_tipo_user = '',
        id_modalidad = '',
        id_tipoacceso = 0,
        usuario = '',
        ctipo = 0,
        anterior = '',

    ) {
        this.url = url
        this.id_usuario = id_usuario
        this.nombres = nombres
        this.apellido_paterno = apellido_paterno
        this.apellido_materno = apellido_materno
        this.dni = dni
        this.correo_electronico = correo_electronico
        this.contrasena = contrasena
        this.observaciones = observaciones
        this.id_facultad = id_facultad
        this.id_escuela = id_escuela
        this.id_tipo_user = id_tipo_user
        this.id_modalidad = id_modalidad
        this.id_tipoacceso = id_tipoacceso
        this.usuario = usuario
        this.ctipo = ctipo
        this.anterior = anterior
    }

}
