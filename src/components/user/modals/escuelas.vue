<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item sep-10 ed-container gr-center">
    <h2 class="ed-item gr-center sep-10">
      ESCUELAS
    </h2>
  </div>

  <div class="ed-item m-50 l-30 to-center ed-container buttons-top">
    <template v-if="!addEscuela">
      <el-tooltip v-if="buscar" class="item" effect="dark" content="Cancelar" placement="top">
        <i v-if="buscar" @click="buscar = !buscar" class="fas fa-ban action pointer red"></i>
      </el-tooltip>
      <el-tooltip v-else class="item" effect="dark" content="Buscar" placement="top">
        <i @click="buscar = !buscar" class="fas fa-filter action pointer"></i>
      </el-tooltip>
    </template>

    <el-tooltip v-if="addEscuela" class="item" effect="dark" content="Cancelar" placement="top">
      <i  @click="addEscuela = !addEscuela" class="fas fa-ban action pointer red"></i>
    </el-tooltip>
    <el-tooltip v-else class="item" effect="dark" content="Añadir Escuela" placement="top">
      <i  @click="addEscuela = !addEscuela" class="fas fa-chalkboard action pointer"></i>
    </el-tooltip>
  </div>

  <template v-if="addEscuela">
    <add-escuela :id-usuario="user.id_usuario" @added="userEscuelaAgregado" :list-escuela="userEscuela" />
  </template>

  <template v-else>
    <div v-if="buscar" class="ed-item m-50 l-30 to-center form-group">
      <label>Buscar Escuela:</label>
      <input v-model="escuelaSearch" type="text" class="form-control input-focus" placeholder="Escuela">
    </div>

    <div v-if="load" class="ed-item gr-center">
      <loading />
    </div>

    <div v-else class="ed-item sep-10 m-95 l-90 to-center ed-container">
      <table class="table table-responsive table-striped table-bordered hover table-own">
        <thead class="table-head">
          <tr>
            <th>#</th>
            <th>Filial</th>
            <th>Escuela</th>
            <th>Modalidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(user, index) in userEscuelaFilter" :key="index">
            <td class="w-10">{{index + 1}}</td>
            <td>{{user.filial}}</td>
            <td>{{user.escuela}}</td>
            <td>{{user.modalidad}}</td>
            <td class="w-10">
              <el-tooltip class="item" effect="dark" content="Eliminar" placement="top">
                <i @click="eliminarUserEscuela(user.id_reg)" class="fas fa-trash-alt action pointer red"></i>
              </el-tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

import GXUser from '../../../models/gx_user'

import addEscuela from './addEscuela.vue'

export default {
  mixins: [
    MixinInit
  ],

  props: ['user'],

  components: {
    loading,
    addEscuela
  },

  mounted() {
    this.init()
  },

  data: () => ({
    userEscuela: null,
    buscar: false,
    escuelaSearch: '',

    addEscuela: false,

    load: false,

    page: 1
  }),

  computed: {
    userEscuelaFilter: function () {
      if (this.userEscuela != null) {
        return (
          this.userEscuela.filter(u => u.escuela.toLowerCase().includes(this.escuelaSearch.toLowerCase()))
        )
      } else {
        return null
      }
    }
  },

  watch: {
    buscar: function (n) {
      if (!n) {
        this.escuelaSearch = ''
        this.getUsuarioEscuela()
      }
    }
  },

  methods: {
    init() {
      this.teclasRapidas()
      this.getUsuarioEscuela()
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })
    },

    async getUsuarioEscuela() {
      this.load = true
      try {
        const res = await this.axios.get(`${this.URL}js-user-escuela/${this.user.id_usuario}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)

        if (res.status === 200) {
          this.userEscuela = res.data.data
        }
      } catch (err) {
        this.$hlp.errors(err)
        this.userEscuela = null
      }
      this.load = false
    },

    close: function () {
      this.$emit('close')
    },

    async eliminarUserEscuela(idReg) {
      try {
        const res = await this.axios.delete(`${this.URL}js-del-userescuela/${idReg}`, this.autho)

        if (res.status === 201) {
          this.getUsuarioEscuela()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    userEscuelaAgregado: function () {
      this.addEscuela = false
      this.getUsuarioEscuela()
    }
  }

}
</script>

<style lang="scss" scoped>
.buttons-top {
  top: 85px;
  position: absolute;
  left: 160px;
}
</style>


