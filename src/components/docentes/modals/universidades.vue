<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item sep-10 ed-container gr-center">
    <h3 class="ed-item gr-center sep-10">
      <strong>ADMINISTRAR UNIVERSIDADES</strong>
      <i v-if="create || isEdit" @click="reset" class="fas fa-window-close action pointer red"></i>
      <i v-else @click="create = true" class="fas fa-plus-circle action pointer"></i>
    </h3>
  </div>

  <transition name="univer-transition" enter-active-class="animated bounceInLeft" leave-active-class="animated slideOutRight">
    <div v-if="isEdit || create" class="ed-item m-95 to-center sep-15 to-center ed-container">
      <div class="ed-item l-30 to-center form-group">
        <label>Universidad</label>
        <input v-model="universidad.cuniversidad" type="text" class="form-control">
      </div>
      <div class="ed-item gr-center">
        <button :disabled="!valid" @click="editarUniversidad" v-if="isEdit" class="btn btn-info btn-hov">
          Editar
        </button>
        <button :disabled="!valid" @click="crearUniversidad" v-else class="btn btn-info btn-hov hint--bottom hint--error"
          aria-label="Ingrese nombre de Universidad">
          Crear
        </button>
      </div>
    </div>
  </transition>


  <div v-if="load" class="gr-center ed-item">
    <loading />
  </div>

  <div v-else class="ed-item m-60 l-40 to-center ed-container sep-10 table-content">
    <table class='table table-bordered table-responsive table-hover table-striped table-own'>
      <thead class='table-head'>
        <tr>
          <th>#</th>
          <th>Universidad</th>
          <th></th>
        </tr>
      </thead>
      <tbody class='table-body'>
        <tr v-for="(univ, index) in universidades" :key="index">
          <td class="w-10">{{univ.idreg}}</td>
          <td>{{univ.cuniversidad}}</td>
          <td class="w-10" @click="goEditUniversidad(univ)">
            <i class="fas fa-edit action pointer"></i>
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

import GxUniversidad from '../../../models/gx_universidad.js'

export default {
  mixins: [
    MixinInit
  ],

  props: [

  ],

  components: {
    loading,
  },

  mounted() {
    this.init()
  },

  data: () => ({
    load: false,

    universidades: null,

    universidad: new GxUniversidad(),

    create: false,
    isEdit: false,
  }),

  computed: {
    valid: function () {
      return this.universidad.cuniversidad != ''
    }
  },

  watch: {
    'universidad.cuniversidad': function (n) {
      this.universidad.cuniversidad = n.toUpperCase()
    }
  },

  methods: {
    init() {
      this.teclasRapidas()
      this.getUniversidades()
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })
    },

    getUniversidades: async function () {
      this.load = true
      await this.axios.get(`${this.URL}js-universidad`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.universidades = res.data.data
          } else {
            this.universidades = null
          }
        })
        .catch(err => {
          console.dir(err)
        })

      this.load = false
    },

    crearUniversidad: function () {
      this.axios.post(`${this.URL}js-ins-universidad`, this.universidad, this.autho)
        .then(res => {
          this.reset()
        })
        .catch(err => {
          console.dir(err)
        })
    },

    goEditUniversidad: function (univ) {
      this.universidad = univ
      this.isEdit = true
    },

    editarUniversidad: function () {
      this.axios.post(`${this.URL}js-upd-universidad/${this.universidad.idreg}`, this.universidad, this.autho)
        .then(res => {
          this.reset()
        })
        .catch(err => {
          console.dir(err)
        })
    },

    reset: function () {
      this.getUniversidades()
      this.universidad = new GxUniversidad()
      this.isEdit = false
      this.create = false
    },

    close: function () {
      this.$emit('close')
    },
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


