import AsignaturaMateriales from '../components/Materiales/AsignaturaMateriales.vue'
import RegistroMateriales from '../components/Materiales/RegistroMateriales.vue'

import AsignaturaPlanes from '../components/Materiales/AsignaturaPlanes.vue'
import PlanesClase from '../components/Materiales/PlanesClase.vue'

import AsignaturaInstrumentos from '../components/Materiales/AsignaturaInstrumentos.vue'
import Instrumentos from '../components/Materiales/Instrumentos.vue'

import CarpetaAcademica from '../components/Materiales/CarpetaAcademica.vue'
import ImprimirCarpeta from '../components/Materiales/ImprimirCarpeta.vue'

const routesMateriales = [{
    name: 'AsignaturaMateriales',
    path: '/asignaturas-materiales',
    component: AsignaturaMateriales,
    meta: {
      title: 'SIGEDO | Asignaturas Materiales'
    }
  },
  {
    name: 'RegistroMateriales',
    path: '/registro-materiales/:idAsignatura',
    component: RegistroMateriales,
    props: true,
    meta: {
      title: 'SIGEDO | Registro Materiales'
    },
  },
  {
    name: 'AsignaturaPlanes',
    path: '/asignaturas-planes',
    component: AsignaturaPlanes,
    meta: {
      title: 'SIGEDO | Asignatura Planes'
    }
  },
  {
    name: 'PlanesClase',
    path: '/planes-clase/:idAsignatura',
    component: PlanesClase,
    props: true,
    meta: {
      title: 'SIGEDO | Planes Clase'
    },
  },
  {
    name: 'AsignaturaInstrumentos',
    path: '/instrumentos-evalucion',
    component: AsignaturaInstrumentos,
    meta: {
      title: 'SIGEDO | Instrumentos de Evaluación'
    }
  },
  {
    name: 'Instrumentos',
    path: '/instrumentos/:idAsignatura',
    component: Instrumentos,
    props: true,
    meta: {
      title: 'SIGEDO | Instrumentos de Evalución'
    },
  },
  {
    name: 'CarpetaAcademica',
    path: '/carpeta-academica',
    component: CarpetaAcademica,
    props: true,
    meta: {
      title: 'SIGEDO | Carpeta Académica'
    },
  },
  {
    name: 'ImprimirCarpeta',
    path: '/imprimir-carpeta/:idAsignatura/:idFilial/:filial/:tipo/:moda/:idEscuela/:idFacultad',
    component: ImprimirCarpeta,
    props: true,
    meta: {
      title: 'SIGEDO | Imprimir Carpeta'
    },
  },
]

export default routesMateriales