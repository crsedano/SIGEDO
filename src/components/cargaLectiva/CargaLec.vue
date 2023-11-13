<template>
<div class="ed-container init">
  <ul class="nav nav-tabs">
    <router-link tag="li" :to="{name: 'ListaEscuelas'}">
      <a>Escuelas</a>
    </router-link>
    <router-link tag="li" :to="{name: 'ListaFacultades'}">
      <a>Facultades</a>
    </router-link>
    <router-link v-if="$route.name == 'CursosEspecificos'" tag="li" :to="{name: 'CursosEspecificos'}">
      <a>Cursos Específicos</a>
    </router-link>
    <router-link v-if="$route.name == 'CursosGenerales'" tag="li" :to="{name: 'CursosGenerales'}">
      <a>Cursos Generales</a>
    </router-link>
  </ul>

  <div v-if="$route.name == 'CargaLectiva'" class="ed-item m-60 l-50 to-center gr-center">
    <el-alert
      title="Seleccione Escuelas o Facultades"
      type="warning"
      :closable="false">
    </el-alert>
  </div>

  <router-view></router-view>
</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

import Animate from '../../helpers/animate'

import pagination from '../templates/pagination.vue'
import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import asigEsp from './tables/asigEsp.vue'
import asigGen from './tables/asigGen.vue'

import asigDocentesEsp from './modals/asigDocentesEsp.vue'
import salones from './modals/salones.vue'

export default {
  mixins: [
    MixinInit
  ],
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if(!vm.permisos) {
        next('/')
        return
      } 
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if(!s) {
        next('/')
      }
    })
  },

  mounted() {
    this.init()
  },

  components: {

  },

  data() {
    return {
    
    }
  },

  computed: {

  },

  methods: {
    init() {
      
    },

    
  }
}
</script>

<style lang="scss" scoped>
* {
  color: #000;
}

.loading {
  text-align: center;
}

.table-carga {
  max-height: 70vh;
}

.router-link-exact-active {
  & a {
    background: rgb(242, 242, 242) !important;
    color: #0f6ecd !important;
  }
}

</style>

