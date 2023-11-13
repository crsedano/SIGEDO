<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>SEGUIMIENTO AVANCE SILÁBICO</strong>
  </h1>

  <!-- <div class="ed-item">
    {{ idCurso }} {{ porcentaje }} {{ idAsigdoc }}
  </div> -->

  <div class="ed-item ed-container sep-5">
    <el-card v-for="(crono, index) in cronograma" :key="index" shadow="hover" class="ed-item sep-5 box-card">
      <div slot="header" class="clearfix">
        <div><strong>Semana:</strong> {{ crono.semana }}</div>
        <div v-if="isDone(crono)"><strong>Porcentaje Avance:</strong> {{ crono.porcentaje | roundTwo}}%</div>
        <div v-if="!isDone(crono)">
          <el-tag type="danger">NO REALIZADO</el-tag>
        </div>
        <div v-if="isDone(crono)">
          <el-tag type="success">REALIZADO</el-tag>
        </div>
        <el-button @click="setDone(crono)" :disabled="!beforeIsDone(crono)" v-if="!isDone(crono)" plain size="mini" style="float: right" type="primary">Marcar Realizado</el-button>
      </div>

      <div class="text item es-item">
        <textarea disabled  style="width: 100%; border: none" rows="5" v-model="crono.contenido"></textarea>
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

  props: ['idCurso', 'idAsigdoc'],

  data() {
    return {
      cronograma: null,
      porcentaje: null
    }
  },

  watch: {
    
  },

  computed: {

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
      
      await this.getPorcentajeAvance()
      await this.getCronograma()
      
      loading.close()
    },

    async getPorcentajeAvance() {
      try {
        const res = await this.axios.get(`${this.URL_}v2/avance_silabo/get_porcentaje/${this.idAsigdoc}`)

        if(res.status !== 200) return
        
        this.porcentaje = res.data.porcentaje
      } catch (err) {
        this.cronograma = null
        this.$hlp.errors(err)
      }
    },

    async getCronograma () {
      try {
        let { id_periodo, id_semestre } = this.periodo

        const res = await this.axios.get(`${this.URL_}v2/avance_silabo/cronograma/${id_periodo}/${id_semestre}/${this.idCurso}`)

        if(res.status !== 200) return
        
        let arr = res.data.cronograma
        this.cronograma = this.createCronograma(arr)
      } catch (err) {
        this.cronograma = null
        this.$hlp.errors(err)
      }
    },

    createCronograma (cronograma) {
      let arr = cronograma.map(crono => {
        let done = false
        if (crono.semana <= this.porcentaje) {
          done = true
        }
        this.$set(crono, 'done', done)
        return crono
      })

      return arr
    },

    async setDone({ semana }) {
      try {
        const res = await this.axios.put(`${this.URL_}v2/avance_silabo/set_porcentaje/${this.idAsigdoc}`, {porcentaje: semana})
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    isDone ({ done }) {
      return done
    },

    beforeIsDone({ semana }) {
      if(semana == 1) return true
      let done = this.cronograma.find(h => h.semana == semana - 1).done
      return done
    },

    cancelOperation () {
      this.init()
    },
  }
}
</script>

<style lang="scss" scoped>
textarea:disabled {
  background: none;
}
</style>
