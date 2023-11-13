<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>SEGUIMIENTO ENTREGA EXAMENES</strong>
  </h1>

  <!-- <div class="ed-item">
    {{ idCurso }} {{ porcentaje }} {{ idAsigdoc }}
  </div> -->

  <div class="ed-item ed-container sep-5">
    <el-card shadow="hover" class="ed-item sep-5 box-card">
      <div slot="header" class="clearfix">
        <!-- <div><strong>Semana:</strong> {{ crono.semana }}</div>
        <div v-if="isDone(crono)"><strong>Porcentaje Avance:</strong> {{ crono.porcentaje | roundTwo}}%</div>
        <div v-if="!isDone(crono)">
          <el-tag type="danger">NO REALIZADO</el-tag>
        </div>
        <div v-if="isDone(crono)">
          <el-tag type="success">REALIZADO</el-tag>
        </div> -->
        <el-button @click="updateEntregaParcial" plain size="mini" style="float: right" type="primary">Guardar</el-button>
      </div>

      <div class="text item ed-item">
        <label>Fecha de Entrega Examen Parcial</label>
        <el-input size="mini" type="date" v-model="fechaParcial"></el-input>
      </div>
      
    </el-card>
  </div>

  <div class="ed-item ed-container sep-5">
    <el-card shadow="hover" class="ed-item sep-5 box-card">
      <div slot="header" class="clearfix">
        <el-button @click="updateEntregaFinal" plain size="mini" style="float: right" type="primary">Guardar</el-button>
        <!-- <div><strong>Semana:</strong> {{ crono.semana }}</div>
        <div v-if="isDone(crono)"><strong>Porcentaje Avance:</strong> {{ crono.porcentaje | roundTwo}}%</div>
        <div v-if="!isDone(crono)">
          <el-tag type="danger">NO REALIZADO</el-tag>
        </div>
        <div v-if="isDone(crono)">
          <el-tag type="success">REALIZADO</el-tag>
        </div>
        <el-button @click="setDone(crono)" :disabled="!beforeIsDone(crono)" v-if="!isDone(crono)" plain size="mini" style="float: right" type="primary">Marcar Realizado</el-button> -->
      </div>

      <div class="text item ed-item">
        <label>Fecha de Entrega Examen Final</label>
        <el-input size="mini" type="date" v-model="fechaFinal"></el-input>
      </div>
      
    </el-card>
  </div>


</div>
</template>

<script>
/**
 * MIXING
 */
import MixinInit from '../../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
    })
  },

  mounted() {
    this.init()
  },

  components: {

  },

  props: ['idCurso', 'idAsigdoc', 'idModalidad'],

  data() {
    return {
      cronogramaPresencial: null,
      cronogramaSemiPresencial: null,
      fechaParcial: null,
      fechaFinal: null
    }
  },

  watch: {
    
  },

  computed: {
    limites () {
      if (!this.cronogramaPresencial) return null
      if (!this.cronogramaSemiPresencial) return null

      if (this.idModalidad == 1) {
        return this.cronogramaPresencial
      }

      if(this.idModalidad == 2) {
        return this.cronogramaSemiPresencial
      }
    },

    limitParcial () {
      if(!this.limites) return null
      let fecha = this.limites.find(l => l.id_actividad == 1)

      return {
        inicio: fecha.finicio,
        fin: fecha.ffin
      }

    },

    limitFinal () {
      if(!this.limites) return null

      let fecha = this.limites.find(l => l.id_actividad == 2)

      return {
        inicio: fecha.finicio,
        fin: fecha.ffin
      }
    }
  },

  filters: {
    roundTwo(value) {
      if(!value) return
      return parseFloat(value).toFixed(2)
    }
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      await this.getFechasExamen()
      await this.getCronograma()
      
      loading.close()
    },

    async getFechasExamen () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/entrega_examen/get_fechas_examen/${this.idAsigdoc}`)

        if(res.status !== 200) return
        this.fechaParcial = res.data.parcial
        this.fechaFinal = res.data.final
      } catch (err) {
        this.fechaParcial = null
        this.fechaFinal = null
        this.$hlp.errors(err)
      }
    },


    async getCronograma () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL_}v2/cronograma_sigedo/by_periodo/${id_periodo}/${id_semestre}`)
        if(res.status !== 200) return
        this.cronogramaPresencial = res.data.cronograma_presencial.filter(c => c.id_actividad == 1 || c.id_actividad == 2)
        this.cronogramaSemiPresencial = res.data.cronograma_semi_presencial.filter(c => c.id_actividad == 1 || c.id_actividad == 2)
      } catch (err) {
        this.cronogramaPresencial = null
        this.cronogramaSemiPresencial = null
        this.$hlp.errors(err)
      }
    },

    async updateEntregaParcial () {
      try {
        const res = await this.axios.put(`${this.URL_}v2/entrega_examen/update_entrega_parcial/${this.idAsigdoc}`, {parcial: this.fechaParcial})
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async updateEntregaFinal () {
      try {
        const res = await this.axios.put(`${this.URL_}v2/entrega_examen/update_entrega_final/${this.idAsigdoc}`, {final: this.fechaFinal})
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    cancelOperation () {
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
textarea:disabled {
  background: none;
}
</style>
