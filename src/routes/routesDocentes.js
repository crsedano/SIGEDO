import docentes from '../components/docentes/docentes_new.vue'
import datoPersonal from '../components/docentes/childrens/dato_personal.vue'
import datoResidencia from '../components/docentes/childrens/dato_residencia.vue'
import datosContacto from '../components/docentes/childrens/datos_contacto.vue'
import gradoAcademico from '../components/docentes/childrens/grado_academico.vue'
import experienciaDocente from '../components/docentes/childrens/experiencia_docencia.vue'
import experienciaProfesional from '../components/docentes/childrens/experiencia_profesional.vue'
import titulo from '../components/docentes/childrens/titulo.vue'
import CronogramaLectivo from '../components/docentes/CronogramaLectivo.vue'
import HorasNoLectivas from '../components/docentes/HorasNoLectivas.vue'
import SeguimientoHorasNoLectivas from '../components/docentes/SeguimientoHorasNoLectivas.vue'
import AvanceSilabo from '../components/docentes/AvanceSilabo.vue'

import Cronograma from '../components/docentes/AvanceSilabo/Cronograma.vue'
import Programa from '../components/docentes/AvanceSilabo/Programa.vue'
import EntregaExamen from '../components/docentes/EntregaExamen/EntregaExamen.vue'

import ReporteCronogramaNoLectivo from '../components/docentes/ReporteCronogramaNoLectivo.vue'
import ReporteAvanceSilabo from '../components/docentes/ReporteAvanceSilabo.vue'
import ReporteEntregaExamen from '../components/docentes/ReporteEntregaExamen.vue'

import InformeCumplimientoActividad from '../components/docentes/InformeCumplimientoActividad.vue'

import DocenteFacultadAdscrita from '../components/docentes/DocenteFacultadAdscrita.vue'

import RepActNoLectivasFac from '../components/docentes/RepActNoLectivasFac.vue'

import DocenteDir from '../components/docentes/DocenteDir.vue'

import DocentesCargos from '../components/docentes/DocentesCargos.vue'
import DocentesCondicion from '../components/docentes/DocentesCondicion.vue'

const routesDocentes = [{
    path: '/docentes',
    component: docentes,
    meta: {
      title: 'SIGEDO | Docente New'
    },
    props: true,
    children: [{
        name: 'Personal',
        path: '/',
        component: datoPersonal,
        props: true,
        meta: {
          title: 'SIGEDO | Datos Personales'
        },
      },

      {
        name: 'Residencia',
        path: 'residencia',
        component: datoResidencia,
        props: true,
        meta: {
          title: 'SIGEDO | Datos Residencia'
        },
      },

      {
        name: 'Datos Contacto',
        path: 'contacto',
        component: datosContacto,
        props: true,
        meta: {
          title: 'SIGEDO | Datos Contacto'
        },
      },

      {
        name: 'Grado Academico',
        path: 'gradoAcademico',
        component: gradoAcademico,
        props: true,
        meta: {
          title: 'SIGEDO | Grados Académicos'
        },
      },

      {
        name: 'Experiencia Docente',
        path: 'experienciaDocente',
        component: experienciaDocente,
        props: true,
        meta: {
          title: 'SIGEDO | Experiencia Docente'
        },
      },

      {
        name: 'Experiencia Profesional',
        path: 'ExperienciaProfesional',
        component: experienciaProfesional,
        props: true,
        meta: {
          title: 'SIGEDO | Experiencia Profesional'
        },
      },

      {
        name: 'Titulo',
        path: 'titulo',
        component: titulo,
        props: true,
        meta: {
          title: 'SIGEDO | Títulos'
        },
      },

    ]
  },

  {
    name: 'CronogramaLectivo',
    path: '/cronograma-lectivo',
    component: CronogramaLectivo,
    props: true,
    meta: {
      title: 'SIGEDO | Cronograma Lectivo'
    },
  },

  {
    name: 'HorasNoLectivas',
    path: '/cronograma-no-lectivo',
    component: HorasNoLectivas,
    props: true,
    meta: {
      title: 'SIGEDO | Cronograma No Lectivo'
    },
  },

  {
    name: 'SeguimientoHorasNoLectivas',
    path: '/seguimiento-no-lectivo',
    component: SeguimientoHorasNoLectivas,
    props: true,
    meta: {
      title: 'SIGEDO | Seguimiento No Lectivo'
    },
  },

  {
    name: 'AvanceSilabo',
    path: '/avance-silabo',
    component: AvanceSilabo,
    props: true,
    meta: {
      title: 'SIGEDO | Seguimiento Asignaturas'
    },
  },

  {
    name: 'CronogramaAvanceSilabo',
    path: '/cronograma-avance',
    component: Cronograma,
    props: true,
    meta: {
      title: 'SIGEDO | Cronograma Avance'
    },
  },

  {
    name: 'ProgramaAvanceSilabo',
    path: '/programa-avance',
    component: Programa,
    props: true,
    meta: {
      title: 'SIGEDO | Programa Avance'
    },
  },

  {
    name: 'EntregaExamen',
    path: '/entrega-examen',
    component: EntregaExamen,
    props: true,
    meta: {
      title: 'SIGEDO | Entrega Examen'
    },
  },

  {
    name: 'ReporteCronogramaNoLectivo',
    path: '/reporte-no-lectivo',
    component: ReporteCronogramaNoLectivo,
    props: true,
    meta: {
      title: 'SIGEDO | Reporte Cronograma No Lectivo'
    },
  },

  {
    name: 'ReporteAvanceSilabo',
    path: '/reporte-avance-silabo',
    component: ReporteAvanceSilabo,
    props: true,
    meta: {
      title: 'SIGEDO | Reporte Avance Silabo'
    },
  },

  {
    name: 'ReporteEntregaExamen',
    path: '/reporte-entrega-examen',
    component: ReporteEntregaExamen,
    props: true,
    meta: {
      title: 'SIGEDO | Reporte Entrega Examen'
    },
  },

  {
    name: 'InformeCumplimientoActividad',
    path: '/informe-cumplimiento-actividades',
    component: InformeCumplimientoActividad,
    props: true,
    meta: {
      title: 'SIGEDO | Informe Cumplimiento Actividad no Academico'
    },
  },

  {
    name: 'DocenteFacultadAdscrita',
    path: '/docentes-facultad-adscrita',
    component: DocenteFacultadAdscrita,
    props: true,
    meta: {
      title: 'SIGEDO | Docente Por Facultad Adscrita'
    },
  },

  {
    name: 'DocenteDir',
    path: '/docentes-direccion',
    component: DocenteDir,
    props: true,
    meta: {
      title: 'SIGEDO | Docente Direccion'
    },
  },

  {
    name: 'RepActNoLectivasFac',
    path: '/reporte-no-lectivas-facultad',
    component: RepActNoLectivasFac,
    props: true,
    meta: {
      title: 'SIGEDO | Reporte No Lectivas Facultad'
    },
  },

  {
    name: 'Docentes Cargos',
    path: '/docentes-cargos',
    component: DocentesCargos,
    meta: {
      title: 'SIGEDO | Docentes Cargos'
    },
  },

  {
    name: 'Docentes Condicion',
    path: '/docentes-condicion',
    component: DocentesCondicion,
    meta: {
      title: 'SIGEDO | Docentes Condicion'
    },
  },

]

export default routesDocentes