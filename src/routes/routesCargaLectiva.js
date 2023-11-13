import CargaLec from '../components/cargaLectiva/CargaLec.vue'
import ListaEscuelas from '../components/cargaLectiva/children_CargaLectiva/ListaEscuelas.vue'
import ListaFacultades from '../components/cargaLectiva/children_CargaLectiva/ListaFacultades.vue'
import CursosEspecificos from '../components/cargaLectiva/children_CargaLectiva/CursosEspecificos.vue'
import CursosGenerales from '../components/cargaLectiva/children_CargaLectiva/CursosGenerales.vue'
import DocentesFilial from '../components/cargaLectiva/DocentesFilial.vue'
import ReporteCiclo from '../components/cargaLectiva/Reporte_Ciclo.vue'

const routesCargaLectiva = [{
  name: 'CargaLectiva',
  path: '/carga-lectiva',
  component: CargaLec,
  meta: {
    title: 'SIGEDO | Carga Lectiva'
  },
  children: [{
      name: 'ListaEscuelas',
      path: 'escuelas',
      component: ListaEscuelas,
      meta: {
        title: 'SIGEDO | Lista Escuelas'
      },
    },

    {
      name: 'ListaFacultades',
      path: 'facultades',
      component: ListaFacultades,
      meta: {
        title: 'SIGEDO | Lista Facultades'
      },
    },

    {
      name: 'CursosEspecificos',
      path: 'cursos-especificos',
      component: CursosEspecificos,
      props: true,
      meta: {
        title: 'SIGEDO | Cursos Específicos'
      },
    },

    {
      name: 'CursosGenerales',
      path: 'cursos-generales',
      component: CursosGenerales,
      props: true,
      meta: {
        title: 'SIGEDO | Cursos Generales'
      },
    }
  ]
},
{
  name: 'Docentes Filial',
  path: '/docentes-filial',
  component: DocentesFilial,
  meta: {
    title: 'SIGEDO | Docentes Filial'
  }
},
{
  name: 'Reporte Ciclo',
  path: '/reporte-ciclo',
  component: ReporteCiclo,
  meta: {
    title: 'SIGEDO | Reporte Ciclo'
  }
},]

export default routesCargaLectiva