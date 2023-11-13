import silaboGeneral from '../components/asignatura/silabo_general.vue'
import datosGenerales from '../components/asignatura/childrens/datos_generales.vue'
import sumillaObjetivos from '../components/asignatura/childrens/sumilla_objetivos.vue'
import investigaciones from '../components/asignatura/childrens/investigaciones.vue'
import cronograma from '../components/asignatura/childrens/cronograma.vue'
import estrategias from '../components/asignatura/childrens/estrategias.vue'
import recursosMateriales from '../components/asignatura/childrens/recursos_materiales.vue'
import evaluacion from '../components/asignatura/childrens/evaluacion.vue'
import bibliografia from '../components/asignatura/childrens/bibliografia.vue'
import vinculos from '../components/asignatura/childrens/vinculos.vue'
import competencia from '../components/asignatura/childrens/competencia.vue'
import rasgoPerfil from '../components/asignatura/childrens/rasgo_perfil.vue'
import programa from '../components/asignatura/childrens/programa.vue'

const routesSilabos = [{
  name: 'Silabo General',
  path: '/registro-silabo',
  component: silaboGeneral,
  meta: {
    title: 'SIGEDO | Silabo General'
  },
  props: true,
  children: [{
      name: 'General',
      path: 'general',
      component: datosGenerales,
      props: true,
      meta: {
        title: 'SIGEDO | Datos Generales'
      },
    },

    {
      name: 'Sumilla Objetivos',
      path: 'sumilla-objetivos',
      component: sumillaObjetivos,
      props: true,
      meta: {
        title: 'SIGEDO | Sumilla - Objetivos'
      },
    },

    {
      name: 'Investigaciones',
      path: 'investigaciones',
      component: investigaciones,
      props: true,
      meta: {
        title: 'SIGEDO | Investigaciones'
      },
    },

    {
      name: 'Cronograma',
      path: 'cronograma',
      component: cronograma,
      props: true,
      meta: {
        title: 'SIGEDO | Cronograma'
      },
    },

    {
      name: 'Estrategias',
      path: 'estrategias',
      component: estrategias,
      props: true,
      meta: {
        title: 'SIGEDO | Estrategias'
      },
    },

    {
      name: 'Recursos Materiales',
      path: 'recursos-materiales',
      component: recursosMateriales,
      props: true,
      meta: {
        title: 'SIGEDO | Recursos Materiales'
      },
    },

    {
      name: 'Evaluacion',
      path: 'evaluacion',
      component: evaluacion,
      props: true,
      meta: {
        title: 'SIGEDO | Evaluación'
      },
    },

    {
      name: 'Bibliografia',
      path: 'bibliografia',
      component: bibliografia,
      props: true,
      meta: {
        title: 'SIGEDO | Bibliografía'
      },
    },

    {
      name: 'Vinculos',
      path: 'vinculos',
      component: vinculos,
      props: true,
      meta: {
        title: 'SIGEDO | Vínculos'
      },
    },

    {
      name: 'Competencia',
      path: 'competencia',
      component: competencia,
      props: true,
      meta: {
        title: 'SIGEDO | Competencia'
      },
    },

    {
      name: 'Rasgo Perfil',
      path: 'rasgo-perfil',
      component: rasgoPerfil,
      props: true,
      meta: {
        title: 'SIGEDO | Rasgos Perfil'
      },
    },

    {
      name: 'Programa',
      path: 'programa',
      component: programa,
      props: true,
      meta: {
        title: 'SIGEDO | Programa'
      },
    },
  ]
}]

export default routesSilabos