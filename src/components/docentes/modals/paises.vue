<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item sep-10 ed-container gr-center">
    <h3 class="ed-item gr-center sep-10">
      <strong>ADMINISTRAR PAÍSES</strong>
      <i @click="goCrearPais" class="fas fa-plus-circle action pointer"></i>
    </h3>
  </div>

  <div v-if="load" class="gr-center">
    <loading />
  </div>

  <div v-else class="ed-item sep-20 m-50 to-center ed-container table-content">
    <table class="table table-bordered table-responsive table-hover table-striped table-own">
      <thead class="table-head">
        <tr>
          <th>Pais</th>
          <th>Nacionalidad</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(pais, index) in paises" :key="index">
          <td>{{pais.cpais}}</td>
          <td>
            {{pais.nacionalidad}}
          </td>
          <td :style="pais.cactivo != 1 ? 'color: red' : ''">
            {{pais.cactivo == 1 ? 'Activo' : 'Inactivo'}}
          </td>
          <td @click="goEditPais(pais)" class="hint--left hint--bounce" :aria-label="`Editar País: ${pais.cpais}`">
            <i class="fas fa-edit action pointer"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <transition enter-active-class="animated flipInY" leave-active-class="animated flipOutY">
    <div v-if="modalCrudPais" class="modal">
      <crud-pais :pais="paisEditar" :edit="editPais" @close="cerrarCrudPais" />
    </div>
  </transition>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

import crudPais from './crudPais.vue'

export default {
  mixins: [
    MixinInit
  ],

  props: [

  ],

  components: {
    loading,
    crudPais
  },

  mounted() {
    this.init()
  },

  data: () => ({
    paises: null,

    load: false,

    modalCrudPais: false,
    paisEditar: {},
    editPais: false
  }),

  computed: {

  },

  watch: {

  },

  methods: {
    init() {
      this.teclasRapidas()
      this.getPaises()
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })
    },

    close: function () {
      this.$emit('close')
    },

    getPaises: function () {
      this.load = true
      this.axios.get(`${this.URL}js-pais`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.paises = res.data.data
          } else {
            this.paises = null
          }
        })
        .catch(err => {
          console.dir(err)
        })
        .then(res => {
          this.load = false
        })
    },

    goCrearPais: function () {
      this.editPais = false
      this.paisEditar.cactivo = 0
      this.abrirCrudPais()
    },

    goEditPais: function (pais) {
      this.editPais = true
      this.paisEditar = pais
      this.abrirCrudPais()
    },

    abrirCrudPais: function () {
      this.modalCrudPais = true
    },

    cerrarCrudPais: function () {
      this.modalCrudPais = false
      this.paisEditar = {}
      this.getPaises()
    }
  }

}
</script>

<style lang="scss" scoped>
.green {
  color: rgb(30, 194, 109);
}

td {
  & i {
    font-size: 1.4em;
  }
}

.table {
  max-height: 500px;
}
</style>


