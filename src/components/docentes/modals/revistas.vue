<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item sep-10 ed-container gr-center">
    <h3 class="ed-item gr-center sep-10">
      <strong>ADMINISTRAR REVISTAS</strong>
      <i @click="goCreateRevista" class="fas fa-plus-circle action pointer"></i>
    </h3>
  </div>

  <div v-if="load" class="gr-center">
    <loading />
  </div>

  <div v-else class="ed-item sep-20 m-50 to-center ed-container table-content">
    <table class="table table-bordered table-responsive table-hover table-striped table-own">
      <thead class="table-head">
        <tr>
          <th>N°</th>
          <th>Revista</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(revista, index) in arrRevistas" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            {{revista.cnombre}}
          </td>
          <td @click="goEditRevista(revista)" class="hint--left hint--bounce" :aria-label="`Editar Revista`">
            <i class="fas fa-edit action pointer"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import alertify from 'alertifyjs'

import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

/**
 * Models
 */
import GxVariables from '../../../models/gx_variables'

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
    arrRevistas: null,

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
      this.getRevistas()
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

    getRevistas: async function () {
      this.load = true
      const gxVariables = new GxVariables(this.URL)
      gxVariables.ctipo = 3

      const res = await gxVariables.getVariables(this.autho)

      if (res.success) {
        this.arrRevistas = res.data
      } else {
        this.arrRevistas = null
      }
      this.load = false
    },

    goCreateRevista: async function () {
      const vm = this

      alertify.prompt('SIGEDO', 'Nueva Revista', '', async function (evt, value) {
          if (value != '') {
            const gxVariables = new GxVariables(vm.URL)
            gxVariables.cnombre = value.toUpperCase()
            gxVariables.ctipo = 3

            const res = await gxVariables.create(vm.autho)

            if (res.success) {
              vm.getRevistas()
            }
          }

        },
        function () {

        })
    },

    goEditRevista: function (revista) {
      const vm = this

      alertify.prompt('SIGEDO', 'Editar Revista', revista.cnombre, async function (evt, value) {
          if (value != '') {
            const gxVariables = new GxVariables(vm.URL)
            gxVariables.cnombre = value.toUpperCase()
            gxVariables.ctipo = 3
            gxVariables.idvar = revista.idvar

            const res = await gxVariables.update(vm.autho)

            if (res.success) {
              vm.getRevistas()
            }
          }

        },
        function () {

        })
    }
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


