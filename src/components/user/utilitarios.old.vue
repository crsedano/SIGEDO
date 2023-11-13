<template>
<div class="ed-container init">
  <h3 class="ed-item sep-10 gr-center">
    USUARIOS
  </h3>
  <div v-if="load" class="ed-item gr-center">
    <loading />
  </div>
  <div v-else class="ed-item ed-container">
    <div class="ed-item ed-container">
      <div class="ed-item gr-center form-group" style="margin-bottom: 0">
        <button @click="abrirCrudUser" class="btn btn-info btn-rounded btn-hov">
          <i class="fas fa-user-plus"></i>
          Crear Usuario
        </button>
      </div>
      <div class="ed-item ed-container">
        <div class="ed-item ed-container table-content">

          <table id="table-usuarios" class="table table-bordered table-responsive table-hover table-striped table-own">
            <thead class="table-head">
              <tr>
                <th>#</th>
                <th>DNI</th>
                <th>Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody class="table-body">
              <tr v-for="(usuario, index) in usuarios" :key="index">
                <td class="w-20">{{usuarios.indexOf(usuario) + 1 + per_page*(page-1)}}</td>
                <td class="w-40">{{usuario.dni}}</td>
                <td class="w-10">{{usuario.usuario}}</td>
                <td class="w-20">
                  <el-tooltip class="item" effect="dark" content="Asignacion Escuelas" placement="top">
                    <i @click="abrirModalEscuelas(usuario)" class="fas fa-chalkboard-teacher action pointer"></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="Accesos Sistema" placement="top">
                    <i @click="abrirModalAccesos(usuario)" class="fas fa-key action pointer"></i>
                  </el-tooltip>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Fin Tabla de Usuarios -->
        </div>
      </div>
    </div>
    <pagination class="ed-item" @anterior:pagina="anteriorPagina" @siguiente:pagina="siguientePagina" :page="page"
      :totalPag="totalPag"></pagination>
  </div>

  <div v-if="modalCrudUser" class="modal" id="modal-crudUser">
    <crud-user @creado="cerrarCreado" @close="cerrarCrudUser" :user="usuario" :is-edit="isEditUsuario"></crud-user>
  </div>

  <div v-if="modalAccesos" class="modal" id="modal-accesos">
    <accesos :user="usuario" @close="cerrarModalAccesos" />
  </div>

  <div v-if="modalEscuelas" class="modal" id="modal-escuelas">
    <escuelas :user="usuario" @close="cerrarModalEscuelas" />
  </div>

</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

import Animate from '../../helpers/animate'

import pagination from '../templates/pagination.vue'
import loading from '../templates/loading.vue'

import GxUsuario from '../../models/gx_user.js'

import crudUser from './modals/crudUser.vue'
import accesos from './modals/accesos.vue'
import escuelas from './modals/escuelas.vue'

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
    this.initUtilitarios()
  },

  components: {
    pagination,
    loading,
    crudUser,
    accesos,
    escuelas
  },

  data() {
    return {
      usuario: new GxUsuario(),
      usuarios: null,
      isEditUsuario: false,

      modalCrudUser: false,
      modalAccesos: false,
      modalEscuelas: false,

      load: false,

      page: 1,
      per_page: 0,
      totalPag: 0,
    }
  },

  computed: {

  },

  methods: {
    initUtilitarios() {
      this.getUsuarios()
    },

    async getUsuarios() {
      this.load = true
      try {
        const res = await this.axios.get(`${this.URL}js-usuarios/${this.page}`)

        if (res.status === 200) {
          this.usuarios = res.data.data
          this.totalPag = res.data.totalPage
          this.per_page = res.data.perPage
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.load = false
    },

    /* Métodos para la paginación */
    siguientePagina() {
      if (this.page < this.totalPag) {
        this.page++
      }
      this.getUsuarios()
    },

    anteriorPagina() {
      if (this.page > 1) {
        this.page--
      }
      this.getUsuarios()
    },
    /* Fin de los métodos para la paginación */

    abrirEditarUsuario(usuario) {
      this.isEditUsuario = true
      this.usuario = usuario
      this.abrirCrudUser()
    },

    abrirCrudUser: function () {
      this.modalCrudUser = true
      Animate.entrada('#modal-crudUser')
    },

    cerrarCrudUser: function () {
      Animate.salida('#modal-crudUser')

      setTimeout(() => {
        this.usuario = new GxUsuario()
        this.isEditUsuario = false
        this.modalCrudUser = false
      }, 1000);
    },

    cerrarCreado: function () {
      // this.page = 1
      this.cerrarCrudUser()
      this.getUsuarios()
    },

    abrirModalAccesos: function (user) {
      this.usuario = user
      this.modalAccesos = true
      Animate.entrada('#modal-accesos')
    },

    cerrarModalAccesos: function () {
      Animate.salida('#modal-accesos')
      setTimeout(() => {
        this.modalAccesos = false
      }, 1000);

      this.usuario = new GxUsuario()
    },

    abrirModalEscuelas: function (user) {
      this.usuario = user
      this.modalEscuelas = true
      Animate.entrada('#modal-escuelas')
    },

    cerrarModalEscuelas: function () {
      Animate.salida('#modal-escuelas')
      setTimeout(() => {
        this.modalEscuelas = false
      }, 1000);

      this.usuario = new GxUsuario()
    }
  }
}
</script>

<style lang="scss" scoped>
    .loading {
        text-align: center;
    }
</style>

