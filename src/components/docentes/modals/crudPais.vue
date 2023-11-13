<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item sep-10 ed-container gr-center">
    <h2 class="ed-item gr-center sep-10">
      PAIS: {{pais.cpais}}
    </h2>
  </div>

  <div class="ed-item m-95 to-center sep-15 to-center ed-container table-content">
    <div class="ed-item l-30 to-center form-group">
      <label>Pais</label>
      <input type="text" class="form-control" v-model="pais.cpais">
    </div>
    <div class="ed-item l-30 to-center form-group">
      <label>Nacionalidad</label>
      <input type="text" class="form-control" v-model="pais.nacionalidad">
    </div>
    <div class="ed-item l-30 checkbox">
      <label>
        <input v-model="activePais" type="checkbox"> {{ pais.cactivo == 1 ? 'Activo' : 'Inactivo' }}
      </label>
    </div>
  </div>

  <div class="ed-item gr-center">
    <button v-if="edit" @click="editarPais" class="btn btn-info btn-hov">
      Editar
    </button>
    <button @click="crearPais" :disabled="!valid" v-else class="btn btn-info btn-hov">
      Crear
    </button>
  </div>

</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

export default {

  mixins: [
    MixinInit
  ],

  props: [
    'pais',
    'edit'
  ],

  components: {
    loading
  },

  mounted() {
    this.init()
  },

  data: () => ({
    activePais: false,

    load: false
  }),

  computed: {
    valid: function () {
      return (
        this.pais.cpais != ''
      )
    }
  },

  watch: {
    activePais: function (n) {
      this.pais.cactivo = n ? 1 : 0
    }
  },

  methods: {
    init() {
      this.activePais = this.pais.cactivo == 1
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

    editarPais: function () {
      this.axios.put(`${this.URL}js-pais/${this.pais.id_pais}`, this.pais, this.autho)
        .then(res => {
          this.close()
        })
        .catch(err => {
          console.dir(err)
        })
    },

    crearPais: function () {
      this.axios.post(`${this.URL}js-pais`, this.pais, this.autho)
        .then(res => {
          this.close()
        })
        .catch(err => {
          console.dir(err)
        })
    }
  }

}
</script>

<style lang="scss" scoped>
 
</style>


