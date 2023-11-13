<template>
  <div class="ed-container init">
    <h4 class="ed-item txt-center">
      <strong>
        ¿EN QUE ESTADO SE ENCUENTA EL AULA VIRTUAL DEL DOCENTE {{ nombre.toUpperCase() }}?
      </strong>
    </h4>

    <div class="ed-item ed-container">
      <el-radio class="ed-item sep-5" v-for="(o, index) in evAulaVirtual" :key="index" v-model="opcion" :label="o.id">{{ o.item }}</el-radio>
    </div>

    <div class="ed-item txt-center">
      <el-button type="primary" size="mini" @click="evaluarAulaVirtual">Evaluar</el-button>
      
    </div>
  </div>
</template>

<script>
import mixing_init from '../../mixing/mixing_init'

export default {
  name: 'aula-virtual',

  mixins: [mixing_init],

  props: {
    idDocente: {
      required: true
    },

    nombre: {
      required: true
    },

    aulaVirtual: {
      required: true
    }
  },

  mounted () {
    this.init()
  },

  data () {
    return {
      evAulaVirtual: null,
      opcion: ''
    }
  },

  methods: {
    init() {
      this.getEvAulaVirtual()

      this.opcion = this.aulaVirtual.id
    },

    async getEvAulaVirtual () {
      const loading = this.$loading({
        lock: true,
        ext: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/all_aula_virtual`)

        let { status, data } = res

        if (status === 200) {
          this.evAulaVirtual = data.aulas
        }
      } catch (err) {
        this.evAulaVirtual = null
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async evaluarAulaVirtual () {
      const loading = this.$loading({
        lock: true,
        ext: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL_}v2/desempenio_docente/calificar_aula/${ this.idPeriodo__ }/${ this.idSemestre__ }/${ this.idDocente }/${ this.opcion }`)

        let { status } = res

        if (status === 200) {
          this.update()
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    update() {
      this.$emit('update')
    },

    close() {
      this.$emit('close')
    }
  },

}
</script>

