<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item sep-10 ed-container gr-center">
    <h3 class="ed-item gr-center sep-10">
      <strong>LISTA DE DOCENTES</strong>
    </h3>
  </div>


  <div class="ed-item sep-10 m-80 l-30 to-center form-group">
    <label>
      Filtrar
    </label>
    <input @keypress.enter="buscarDocentes" v-model="docenteFiltro" type="text" class="form-control">
  </div>

  <div v-if="load" class="ed-item gr-center">
    <loading />
  </div>

  <div v-else class="ed-item sep-20 m-95 to-center ed-container table-content">
    <pagination class="ed-item" @anterior:pagina="anteriorPagina" @siguiente:pagina="siguientePagina" :page="page"
      :totalPag="totalPag"></pagination>
    <table class="table table-bordered table-responsive table-hover table-striped table-own">
      <thead class="table-head">
        <tr>
          <th>Nombre</th>
          <th>A. Paterno</th>
          <th>A. Materno</th>
          <th>DNI</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr @click="editarDocente(docente)" v-for="(docente, index) in docentes" :key="index">
          <td>{{docente.cnombres}}</td>
          <td>{{docente.cpaterno}}</td>
          <td>{{docente.cmaterno}}</td>
          <td>{{docente.dni}}</td>
          <td class="w-10" aria-label="Editar Docente">
            <i class="fas fa-user-edit pointer action"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>


</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

import pagination from '../../templates/pagination.vue'

export default {
  mixins: [
    MixinInit
  ],

  props: [

  ],

  components: {
    loading,
    pagination
  },

  mounted() {
    this.init()
  },

  data: () => ({
    docentes: null,
    docentesFilter: null,

    docenteFiltro: '',

    load: false,

    /* Paginacion proveedores */
    page: 1,
    per_page: 0,
    totalPag: 0,
  }),

  computed: {

  },

  watch: {
    docenteFiltro: function (n) {
      if (n.length <= 0) {
        this.getDocentes()
      }
    }
  },

  methods: {
    init() {
      this.teclasRapidas()
      this.getDocentes()
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })
    },

    getDocentes: function () {
      this.load = true
      this.axios.get(`${this.URL}js-docentes/${this.page}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.docentes = res.data.data
            this.totalPag = res.data.totalPage
            this.per_page = res.data.perPage
            this.load = false
          }
        })
        .catch(err => {
          console.dir(err)
        })
        .then(() => {

        })
    },

    buscarDocentes: function () {
      if (this.docenteFiltro.length >= 3) {
        this.load = true
        this.axios.get(`${this.URL}js-docente-search/${this.docenteFiltro}`, this.autho)
          .then(res => {
            if (res.data.success) {
              this.docentes = res.data.data
              this.load = false
            }
          })
          .catch(err => {
            console.dir(err)
          })
          .then(() => {

          })
      }
    },

    editarDocente: function (docente) {
      this.$emit('edit-docente', docente)
    },

    close: function () {
      this.$emit('close')
    },

    /* Métodos para la paginación */
    siguientePagina() {
      if (this.page < this.totalPag) {
        this.page++
      }
      this.getDocentes()
    },

    anteriorPagina() {
      if (this.page > 1) {
        this.page--
      }
      this.getDocentes()
    },
    /* Fin de los métodos para la paginación */
  }

}
</script>

<style lang="scss" scoped>
    td {
        & i {
            font-size: 1.4em;
        }
    }

    .table {
        max-height: 500px;
    }

</style>


