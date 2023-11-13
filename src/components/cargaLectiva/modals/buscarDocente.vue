<template>
<div class="ed-container init w-modal">
  <i @click="close" class="fa fa-window-close action red iclose"></i>

  <h2 class="ed-item sep-10 gr-center">
    <strong>
      BUSCAR DOCENTE
    </strong>
  </h2>

  <div class="ed-item m-50 to-center form-group">
    <label>Criterio de Búsqueda</label>
    <input id="criterio" @keyup.enter="buscar" v-model="criterio" type="text" class="form-control">
  </div>

  <div v-if="docentes" class="ed-item m-80 l-60 to-center sep-10 table-content mh">
    <table class="table table-responsive table-striped table-bordered table-hover table-own">
      <thead class="table-head">
        <tr>
          <th>DNI</th>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr @click="seleccionar(d_)" class="pointer" v-for="(d_, index) in docentes" :key="index">
          <td>{{d_.id_docente}}</td>
          <td>{{d_.nombre}}</td>
        </tr>
      </tbody>
    </table>
  </div>


  <!-- Pantalla de carga general -->
  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

import GxDate from '../../../helpers/date'

import loading from '../../templates/loading.vue'
import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit,
  ],

  mounted() {
    const criterio = document.getElementById('criterio')
    criterio.focus()
  },

  components: {
    loading,
    loader
  },

  data: function () {
    return {
      criterio: '',
      docentes: null
    }
  },

  methods: {
    buscar: function () {
      this.axios.get(`${this.URL}js-docente-search/${this.criterio}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.docentes = res.data.data
          } else {
            this.docentes = null
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    seleccionar: function (docente) {
      this.$emit('sel', docente.id_docente)
    },

    close: function () {
      this.$emit('close')
    }
  }
}
</script>

