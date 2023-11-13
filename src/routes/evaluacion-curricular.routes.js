import EvaluacionCurriculo from '../components/curriculo/EvaluacionCurriculo.vue'

import DatosGenerales from '../components/evaluacion-interna/DatosGenerales.vue'
import Glosas from '../components/evaluacion-interna/Glosas.vue'
import CompetenciasGenerales from '../components/evaluacion-interna/CompetenciasGenerales.vue'
import CompetenciasEspecificas from '../components/evaluacion-interna/CompetenciasEspecificas.vue'
import CompetenciasGeneralesAreas from '../components/evaluacion-interna/CompetenciasGeneralesAreas.vue'
import CompetenciasEspecificasAreas from '../components/evaluacion-interna/CompetenciasEspecificasAreas.vue'
import CompetenciasEspecificasAsignatura from '../components/evaluacion-interna/CompetenciasEspecificasAsignatura.vue'
import CompetenciasGeneralesAsignatura from '../components/evaluacion-interna/CompetenciasGeneralesAsignatura.vue'

const evaluacionCurriculo = [
  {
    name     : 'EvaluacionCurriculo',
    path     : '/evaluacion-curriculo',
    component: EvaluacionCurriculo,
    meta     : {
      title: 'SIGEDO | Evaluación Curriculo'
    }
  },
  {
    name     : 'DatosGenerales',
    path     : '/evaluacion-interna',
    component: DatosGenerales,
    meta     : {
      title: 'SIGEDO | Evaluación Interna'
    }
  },
  {
    name     : 'Glosas',
    path     : '/glosas',
    component: Glosas,
    meta     : {
      title: 'SIGEDO | Glosas'
    }
  },
  {
    name     : 'CompetenciasGenerales',
    path     : '/competencias-generales',
    component: CompetenciasGenerales,
    meta     : {
      title: 'SIGEDO | Competencias Generales'
    }
  },
  {
    name     : 'CompetenciasGeneralesAreas',
    path     : '/competencias-generales-areas',
    component: CompetenciasGeneralesAreas,
    meta     : {
      title: 'SIGEDO | Competencias Generales Areas'
    }
  },
  {
    name     : 'CompetenciasEspecificas',
    path     : '/competencias-especificas',
    component: CompetenciasEspecificas,
    meta     : {
      title: 'SIGEDO | Competencias Especificas'
    }
  },
  {
    name     : 'CompetenciasEspecificasAreas',
    path     : '/competencias-especificas-areas',
    component: CompetenciasEspecificasAreas,
    meta     : {
      title: 'SIGEDO | Competencias Especificas Areas'
    }
  },
  {
    name     : 'CompetenciasEspecificasAsignatura',
    path     : '/competencias-especificas-asignaturas',
    component: CompetenciasEspecificasAsignatura,
    meta     : {
      title: 'SIGEDO | Competencias Especificas Asignaturas'
    }
  },
  {
    name     : 'CompetenciasGeneralesAsignatura',
    path     : '/competencias-generales-asignaturas',
    component: CompetenciasGeneralesAsignatura,
    meta     : {
      title: 'SIGEDO | Competencias Generales Asignaturas'
    }
  },
]

export default evaluacionCurriculo