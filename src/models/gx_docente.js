'use strict';

import axios from 'axios'

export default class GxDocente {
    constructor(
        url = '',
        id_docente = '',
        nombre = '',
        nacionalidad = '',
        luganacimiento = '',
        fechanacimiento = '',
        sexo = '',
        residencia = '',
        direccion = '',
        email = '',
        telefono = '',
        celular = '',
        bachiller = '',
        titulo = '',
        maestria = '',
        doctorado = '',
        especializacion = '',
        segunda = '',
        laborupla = '',
        laborotro = '',
        experienciaotro = '',
        experiencia = '',
        horas_administrativas = '',
        id_filial = '',
        f_ingreso = '',
        f_i_contra = '',
        f_t_contra = '',
        dedicacion = '',
        cargo = '',
        categoria = '',
        condicion = '',
        doctorado_ = '',
        id_facultad = '',
        dni = '',
        carpeta = 0,
        ley_30220 = 0,
        maestria_ = '',
        modalidad = '',
        id_cargo = '',
        id_usuario_insert = '',
        fecha_hora_insert = '',
        id_usuario_update = '',
        fecha_hora_update = '',
        cpaterno = '',
        cmaterno = '',
        cnombres = '',
        cdepanac = '',
        cprovnac = '',
        cdistnac = '',
        cubigeonac = '',
        ninvestigador = 0,
        didactica_superior = '',
        id_pais_nac = '',
        ffecnacimiento = '',
        id_modalidad = '',
        grado = '',
        id_cargotmp = '',
        dina = 0,
        observaciones = '',
        mayor_grado_academico = '',
        mencion_mayor_grado_academico = '',
        universidad_mayor_grado_academico = '',
        pais_mayor_grado_academico = '',
        tmp_delete = '',
        dicta_clases_pregrado = '',
        dicta_clases_maestria = '',
        dicta_clases_doctorado = '',
        thorasmaestria = '',
        codigosunedufilial = '',
        cmaestria = '',
        cdoctorado = '',
        id_facultad_adscrito = '',
        regina = 0,
        is_jp = 0
    ) {
        this.url = url
        this.id_docente = id_docente
        this.nombre = nombre
        this.nacionalidad = nacionalidad
        this.luganacimiento = luganacimiento
        this.fechanacimiento = fechanacimiento
        this.sexo = sexo
        this.residencia = residencia
        this.direccion = direccion
        this.email = email
        this.telefono = telefono
        this.celular = celular
        this.bachiller = bachiller
        this.titulo = titulo
        this.maestria = maestria
        this.doctorado = doctorado
        this.especializacion = especializacion
        this.segunda = segunda
        this.laborupla = laborupla
        this.laborotro = laborotro
        this.experienciaotro = experienciaotro
        this.experiencia = experiencia
        this.horas_administrativas = horas_administrativas
        this.id_filial = id_filial
        this.f_ingreso = f_ingreso
        this.f_i_contra = f_i_contra
        this.f_t_contra = f_t_contra
        this.dedicacion = dedicacion
        this.cargo = cargo
        this.categoria = categoria
        this.condicion = condicion
        this.doctorado_ = doctorado_
        this.id_facultad = id_facultad
        this.dni = dni
        this.carpeta = carpeta
        this.ley_30220 = ley_30220
        this.maestria_ = maestria_
        this.modalidad = modalidad
        this.id_cargo = id_cargo
        this.id_usuario_insert = id_usuario_insert
        this.fecha_hora_insert = fecha_hora_insert
        this.id_usuario_update = id_usuario_update
        this.fecha_hora_update = fecha_hora_update
        this.cpaterno = cpaterno
        this.cmaterno = cmaterno
        this.cnombres = cnombres
        this.cdepanac = cdepanac
        this.cprovnac = cprovnac
        this.cdistnac = cdistnac
        this.cubigeonac = cubigeonac
        this.ninvestigador = ninvestigador
        this.didactica_superior = didactica_superior
        this.id_pais_nac = id_pais_nac
        this.ffecnacimiento = ffecnacimiento
        this.id_modalidad = id_modalidad
        this.grado = grado
        this.id_cargotmp = id_cargotmp
        this.dina = dina
        this.observaciones = observaciones
        this.mayor_grado_academico = mayor_grado_academico
        this.mencion_mayor_grado_academico = mencion_mayor_grado_academico
        this.universidad_mayor_grado_academico = universidad_mayor_grado_academico
        this.pais_mayor_grado_academico = pais_mayor_grado_academico
        this.tmp_delete = tmp_delete
        this.dicta_clases_pregrado = dicta_clases_pregrado
        this.dicta_clases_maestria = dicta_clases_maestria
        this.dicta_clases_doctorado = dicta_clases_doctorado
        this.thorasmaestria = thorasmaestria
        this.codigosunedufilial = codigosunedufilial
        this.cmaestria = cmaestria
        this.cdoctorado = cdoctorado
        this.id_facultad_adscrito = id_facultad_adscrito
        this.regina = regina
        this.is_jp = is_jp
    }

    async getDocentesDina(autho, id_periodo, id_semestre, id_filial, id_modalidad, id_facultad, id_escuela) {
        try {
            const res = await axios.get(`${this.url}js-docente-dina/${id_periodo}/${id_semestre}/${id_filial}/${id_modalidad}/${id_facultad}/${id_escuela}`, autho)

            if(res.status === 200) {
                return {
                    success: true,
                    data: res.data.data
                }
            }
        } catch (err) {
            console.dir(err)
        }

        return {
            success: false
        }
    }

    async getDocentesRegina(autho, id_periodo, id_semestre, id_filial, id_modalidad, id_facultad, id_escuela) {
        try {
            const res = await axios.get(`${this.url}js-docente-regina/${id_periodo}/${id_semestre}/${id_filial}/${id_modalidad}/${id_facultad}/${id_escuela}`, autho)

            if(res.status === 200) {
                return {
                    success: true,
                    data: res.data.data
                }
            }
        } catch (err) {
            console.dir(err)
        }

        return {
            success: false
        }
    }

   
      

}
