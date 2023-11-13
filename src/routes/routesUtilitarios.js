import adminDenominaciones from '../components/docentes/modals/crudGrados.vue'
import utilitarios from '../components/user/utilitarios.vue'
import password from '../components/user/password.vue'
import administrarPais from '../components/user/administrar_pais.vue'
import administrarUniver from '../components/user/administrar_universidades.vue'
import activeModal from '../components/user/activeModal.vue'
import ImportarSilabos from '../components/user/ImportarSilabos.vue'
import AdministrarPeriodos from '../components/user/AdministrarPeriodos.vue'
import AdminCargo from '../components/user/AdminCargo.vue'
import AdminCronograma from '../components/user/AdminCronograma.vue'

const routesUtilitarios = [
  {
    name: 'Administrar Pais',
    path: '/administrar-pais',
    component: administrarPais,
    meta: {
      title: 'SIGEDO | Administrar Pais'
    }
  },

  {
    name: 'Administrar Universidades',
    path: '/administrar-universidades',
    component: administrarUniver,
    meta: {
      title: 'SIGEDO | Administrar Universidades'
    }
  },

  {
    name: 'aministrarDenominaciones',
    path: '/aministrarDenominaciones',
    component: adminDenominaciones,
    meta: {
      title: 'SIGEDO | Administrar Denominaciones '
    }
  },

  {
    name: 'Utilitarios',
    path: '/utilitarios',
    component: utilitarios,
    meta: {
      title: 'SIGEDO | Utilitarios'
    }
  },

  {
    name: 'Password',
    path: '/password',
    component: password,
    meta: {
      title: 'SIGEDO | Contraseña'
    }
  },

  {
    name: 'ActiveModal',
    path: '/active-modal',
    component: activeModal,
    meta: {
      title: 'SIGEDO | Configurar Modal'
    }
  },

  {
    name: 'ImportarSilabos',
    path: '/importar-silabos',
    component: ImportarSilabos,
    meta: {
      title: 'Importar Silabos'
    }
  },

  {
    name: 'AdministrarPeriodos',
    path: '/administrar-periodos',
    component: AdministrarPeriodos,
    meta: {
      title: 'Administrar Periodos'
    }
  },

  {
    name: 'AdminCargo',
    path: '/administrar-cargos',
    component: AdminCargo,
    meta: {
      title: 'Administrar Cargos'
    }
  },

  {
    name: 'AdminCronograma',
    path: '/administrar-cronograma',
    component: AdminCronograma,
    meta: {
      title: 'Administrar Cronograma'
    }
  },
]

export default routesUtilitarios