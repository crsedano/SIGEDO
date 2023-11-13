<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item sep-10 ed-container gr-center">
    <h2 class="ed-item gr-center sep-10">
      CAMBIAR EL PERIODO ACADÉMICO
    </h2>
  </div>
  <div class="ed-item ed-container">
    <div class="ed-item m-60 l-50 to-center form-group table-content">
      <table class="table table-responsive table-striped bordered table-hover table-own">
        <thead class="table-head">
          <tr>
            <th>PERIODO</th>
            <th>SEMESTRE</th>
            <th>ACTIVO</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(per, index) in periodos" :key="index">
            <td>{{per.id_periodo}}</td>
            <td>{{per.id_semestre}}</td>
            <td v-if="per.estado == 1">
              <i class="fas fa-check green"></i>
            </td>
            <td v-else>
              <i class="fas fa-times red"></i>
            </td>
            <td>
              <button @click="clickCambiarPeriodo" @dblclick="cambiarPeriodo(per)" v-if="per.id_periodo != periodo.id_periodo || per.id_semestre != periodo.id_semestre"
                class="btn btn-danger btn-rounded btn-hov btn-xs">
                VER
              </button>
              <span v-else>En uso</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

import loading from '../../templates/loading'

export default {
  mixins: [
    MixinInit
  ],

  props: [

  ],

  components: {
    loading
  },

  mounted() {
    this.init()
  },

  data: () => ({
    periodos: null,
    load: false
  }),

  computed: {

  },

  watch: {

  },

  methods: {
    init() {
      this.teclasRapidas()
      this.getPeriodos()
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })
    },

    async getPeriodos() {
      try {
        const res = await this.axios.get(`${this.URL}js-periodo`, this.autho)

        if (res.status === 200) {
          this.periodos = res.data.data
        }
      } catch (err) {
        this.periodos = null
        this.$hlp.errors(err)
      }
    },

    async cambiarPeriodo(periodo) {
      this.$session.remove('periodo')

      this.$session.set('periodo', periodo)
      window.location.reload()
    },

    // Un solo click en cambiar periodo
    clickCambiarPeriodo() {
      this.$notify.warning({
        title: 'Precaución',
        message: 'Doble Click para cambiar el Periodo'
      })
    },

    close() {
      this.$emit('close')
    },
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
</style>


