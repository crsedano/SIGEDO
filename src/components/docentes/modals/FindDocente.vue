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
</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

import GxDate from '../../../helpers/date'

export default {
  mixins: [
    mixingInit,
  ],

  mounted() {
    const criterio = document.getElementById('criterio')
    criterio.focus()
  },

  components: {
    
  },

  data: function () {
    return {
      criterio: '',
      docentes: null
    }
  },

  methods: {
    async buscar () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL}js-docente-search/${this.criterio}`)

        if(res.status !== 200) return

        this.docentes = res.data.data
      } catch (err) {
        this.docentes = null
        this.$hlp.errors(err)
      }
      loading.close()
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

