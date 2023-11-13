import EvaluarDocente from '../components/docentes/EvaluarDocente.vue'
import DesempenioDocente from '../components/desempenio-docente/DesempenioDocente.vue'

const routesDesempenio = [
  {
    name: 'Evaluar Docente',
    path: '/evaluacion-docente',
    component: EvaluarDocente,
    meta: {
      title: 'SIGEDO | Evaluación Docente'
    }
  },

  {
    name: 'Desempeño Docente',
    path: '/desempeño-docente',
    component: DesempenioDocente,
    meta: {
      title: 'SIGEDO | Desempeño Docente'
    }
  }
]

export default routesDesempenio