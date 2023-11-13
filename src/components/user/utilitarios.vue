<template>
<div class="ed-container init">
  <div class="ed-item gr-center sep-5">
    <el-button @click="abrirCrudUser" size="mini" type="primary">Crear Usuario</el-button>
  </div>
  <el-form size="mini" class="ed-item sep-5 ed-container" label-width="120px">
    <el-form-item class="ed-item m-50" label="Buscar Docente">
      <el-input v-model="idDocente"></el-input>
    </el-form-item>
    <el-form-item class="ed-item txt-center">
      <el-button type="primary" @click="getUsuarios">Buscar</el-button>
    </el-form-item>
  </el-form>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="usuarios" height="450" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando...">
      <el-table-column :index="indexMethod" fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="dni" label="DNI" min-width="80" align="center" header-align="center"></el-table-column>
      <el-table-column prop="nombres" label="Docente" min-width="220" align="left" header-align="center">
        <template slot-scope="reg">
          {{ `${reg.row.apellido_paterno} ${reg.row.apellido_materno} ${reg.row.nombres}` }}
        </template>
      </el-table-column>
      <el-table-column label="*" min-width="200" align="center" header-align="center">
        <template slot-scope="reg">
          <el-button @click="abrirModalEscuelas(reg.row)" size="mini" type="primary">Escuelas</el-button>
          <el-button @click="abrirModalAccesos(reg.row)" size="mini" type="danger">Accesos</el-button>
          <el-button @click="abrirEditarUsuario(reg.row)" size="mini" type="danger">Editar</el-button>
          <el-button @click="resetPassword(reg.row)" size="mini" type="warning">Contraseña</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="ed-item gr-center">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page"
      :page-sizes="[100, 200, 300]" :page-size.sync="limit" layout="total, sizes, prev, pager, next, jumper"
      :total.sync="total">
    </el-pagination>
  </div>

  <!-- <div v-if="modalCrudUser" class="modal">
    <crud-user @creado="cerrarCreado" @close="cerrarCrudUser" :user="usuario" :is-edit="isEditUsuario"></crud-user>
  </div> -->

  <div v-if="modalAccesos" class="modal">
    <accesos :user="usuario" @close="cerrarModalAccesos" />
  </div>

  <div v-if="modalEscuelas" class="modal">
    <escuelas :user="usuario" @close="cerrarModalEscuelas" />
  </div>

  <el-dialog
    @close="cerrarCrudUser"
    :visible.sync="modalCrudUser"
    width="80%"
    center>
    <crud-user :idUsuario="idUsuario" v-if="modalCrudUser" @creado="cerrarCreado" @close="cerrarCrudUser"></crud-user>
  </el-dialog>

</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

import GxUsuario from '../../models/gx_user.js'

import crudUser from './modals/CrudUsuarios.vue'
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
    this.init()
  },

  components: {
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

      idDocente: null,
      idUsuario: null,

      limit: 100,
      total: 0,
      page: 1
    }
  },

  computed: {

  },

  methods: {
    init() {
      this.getUsuarios()
    },

    async getUsuarios() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let $query = ''
      if(this.idDocente && this.idDocente != '') {
        $query = `/${this.idDocente}`
      }
      try {
        const res = await this.axios.get(`${this.URL_}v2/usuarios/all/${this.limit}${$query}?page=${this.page}`)
        if (res.status !== 200) {
          loading.close()
          return
        }
        this.usuarios = res.data.data.data
        this.setTotal(res.data.data.total)
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async resetPassword ({ id_usuario }) {
      try {
        const res = await this.axios.put(`${this.URL_}v2/usuarios/reset_password/${id_usuario}`)
        if(res.status === 201) {
          this.swAlert('Contraseña reseteada', 'success')
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    abrirEditarUsuario({ id_usuario }) {
      this.isEditUsuario = true
      this.idUsuario = id_usuario
      this.abrirCrudUser()
    },

    abrirCrudUser: function () {
      this.modalCrudUser = true
    },

    cerrarCrudUser: function () {
      this.usuario = new GxUsuario()
      this.isEditUsuario = false
      this.modalCrudUser = false
    },

    cerrarCreado: function () {
      // this.page = 1
      this.cerrarCrudUser()
      this.getUsuarios()
    },

    abrirModalAccesos: function (user) {
      this.usuario = user
      this.modalAccesos = true
    },

    cerrarModalAccesos: function () {
      this.modalAccesos = false
      this.usuario = new GxUsuario()
    },

    abrirModalEscuelas: function (user) {
      this.usuario = user
      this.modalEscuelas = true
    },

    cerrarModalEscuelas: function () {
      this.modalEscuelas = false
      this.usuario = new GxUsuario()
    },

    setTotal ($total) {
      this.total = $total
    },

    indexMethod (index) {
      return index + 1 + this.limit * (this.page - 1)
    },

    handleSizeChange (val) {
      this.page = 1
      this.getUsuarios()
    },

    handleCurrentChange (val) {
      this.getUsuarios()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>

