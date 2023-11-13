import RegistroPlanes from '../components/asignatura/RegistroPlanes.vue'
import RegistroAsignaturas from '../components/asignatura/RegistroAsignaturas.vue'

const routesPlanes = [
  {
    name: 'Registro Planes',
    path: '/registro-planes',
    component: RegistroPlanes,
    meta: {
      title: 'SIGEDO | Registro Planes'
    }
  },

  {
    name: 'Registro Asignaturas',
    path: '/registro-asignatura',
    component: RegistroAsignaturas,
    meta: {
      title: 'SIGEDO | Registro Asignaturas'
    }
  },
]

export default routesPlanes