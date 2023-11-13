import CurriculoRasgos from '../components/curriculo-rasgos/CurriculoRasgos.vue'
import EvaluacionDiagonal from '../components/evaluacion-diagonalidad/EvaluacionDiagonal'
import NivelLogro from '../components/nivel-logro/NivelLogro'
import PertinenciaAsignatura from '../components/pertinencia-asignatura/PertinenciaAsignatura.vue'

const CurriculoRastosRoutes = [
  {
    name     : 'CurriculoRasgos',
    path     : '/curriculo-rasgos',
    component: CurriculoRasgos,
    meta     : {
      title: 'SIGEDO | Rasgos'
    }
  },
  {
    name     : 'EvaluacionDiagonal',
    path     : '/curriculo-diagonalidad',
    component: EvaluacionDiagonal,
    meta     : {
      title: 'SIGEDO | Evaluacion Diagonalidad'
    }
  },
  {
    name     : 'NivelLogro',
    path     : '/nivel-logro-asignaturas',
    component: NivelLogro,
    meta     : {
      title: 'SIGEDO | Nivel Logro'
    }
  },
  {
    name     : 'PertinenciaAsignatura',
    path     : '/pertinencia-asignaturas',
    component: PertinenciaAsignatura,
    meta     : {
      title: 'SIGEDO | Pertinencia Asignaturas'
    }
  },
]

export default CurriculoRastosRoutes