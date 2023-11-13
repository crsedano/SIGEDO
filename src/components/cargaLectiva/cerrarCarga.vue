<template>
<div class="ed-container init">
  <h3 class="ed-item  gr-center">
    <strong>CERRAR CARGA</strong>
  </h3>
  <transition enter-active-class="animated zoomInDown" leave-active-class="animated zoomOutLeft">
    <div v-if="load" class="ed-item gr-center">
      <loading />
    </div>

    <div v-else class="ed-item m-95 l-90 to-center ed-container table-content" id="carga-lectiva">
      <table class="table table-responsive table-striped table-bordered table-hover table-own table-carga">
        <thead class="table-head">
          <tr>
            <th>#</th>
            <th>FACULTAD</th>
            <th>PERIODO</th>
            <th>SEMESTRE</th>
            <th>ESTADO</th>
            <th>ACCION</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(user, index) in estadoFacultad" :key="index">
            <td class="w-10">{{index + 1}}</td>
            <td>{{user.nombre}}</td>
            <td>{{user.id_periodo}}</td>
            <td>{{user.id_semestre}}</td>
            <td>{{user.cestado == 0 ? 'Abierto' : 'Cerrado'}}</td>
            <td class="w-10">
              <i title="DESACTIVAR" v-if="user.cestado == 0" @click="desactivarEstadoFacultad(user)" class="fas fa-check action pointer"></i>
              <i title="ACTIVAR" v-else class="fas fa-ban action pointer red"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </transition>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>
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
    pagination,
    loading,
    loader,
    asigEsp,
    asigGen,
    asigDocentesEsp,
    salones
  },

  data() {
    return {
      estadoFacultad: null,
      load: false,


      ajaxLoad: false,
    }
  },

  computed: {

  },

  methods: {
    init() {
      this.getEstadoFacultad()
    },

    getEstadoFacultad: function () {
      this.load = true
      this.axios.get(`${this.URL}js-estado-facultad`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.load = false
            this.estadoFacultad = res.data.data

          }
        })
        .catch(err => {
          console.dir(err)
        })
    },
    //*************************************1 cerrado************************************************
    desactivarEstadoFacultad: function (user) {
      this.axios.put(`${this.URL}desactivar-estada-facultad/${user.id_facultad}`, {}, this.autho)
        .then(res => {
          this.getEstadoFacultad()
          this.procedEstadoFacultada(user)
        })
        .catch(err => {
          console.dir(err)
        })
    },
    procedEstadoFacultada: function (user) {
      this.axios.put(`${this.URL}procd-estado-facultad/${user.id_facultad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, {}, this.autho)
        .then(res => {
          // ;
        })
        .catch(err => {
          console.dir(err)
        })
    },
    //*************************************************************************************

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

.active {
  & a {
    background: rgb(242, 242, 242) !important;
    color: #0f6ecd !important;
  }
}
</style>
