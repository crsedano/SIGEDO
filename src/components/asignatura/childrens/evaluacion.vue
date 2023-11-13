<template>
<div class="ed-container init">
  <div class="ed-item s-95 to-center">
    <h2 v-if="curso_.tipo_asignatura == 'G'" style="text-align: center">
      <strong>IX. EVALUACIÓN</strong>
    </h2>
    <h2 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'" style="text-align: center">
      <strong>X. EVALUACIÓN</strong>
    </h2>
  </div>

  <template v-if="curso_.tipo_asignatura == 'T'">
    <div class="ed-item sep-5 s-95 to-center">
      <h3><strong>10.1 REQUISITOS DE APROBACION</strong></h3>
      <ul>
        <li>Asistencia obligatoria al 100%</li>
        <li>Aprobar las evaluaciones prácticas.</li>
        <li>Cumplir con lo estipulado en el reglamento del área de talleres técnicos, artículo Nº 38 del sistema de evaluación.</li>
        <li>La evaluación es permanente y está en función de cada actividad ejecutada.</li>
        <li>La nota considerada en los criterios de evaluación debe ser centesimal y el promedio vigesimal, artículo N° 48 del reglamento del área de talleres técnicos.</li>
      </ul>
    </div>
  </template>

  <template v-else>
    <div class="ed-item sep-5 s-95 to-center">
      <h3 v-if="curso_.tipo_asignatura == 'G'"><strong>9.1 REQUISITOS DE APROBACION</strong></h3>
      <h3 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'"><strong>10.1 REQUISITOS DE APROBACION</strong></h3>
      <ul>
        <li>Asistencia obligatoria a clases teóricas y prácticas en un mínimo del 70%.</li>
        <li>Obtener nota final 10.5.</li>
      </ul>
    </div>
    <div class="ed-item sep-5 s-95 to-center">
      <h3 v-if="curso_.tipo_asignatura == 'G'"><strong>9.2 Examen Parcial: del {{ parcial }}</strong></h3>
      <h3 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'"><strong>10.2 Examen Parcial: del {{
          parcial }}</strong></h3>
      <p>Tarea Académica 1 (T.A.1)</p>
      <ul>
        <li>Prácticas calificadas (según cronograma).</li>
        <li>Prácticas dirigidas (opcional).</li>
        <li>Trabajo de investigación.</li>
      </ul>
    </div>
    <div class="ed-item sep-5 s-95 to-center">
      <h3 v-if="curso_.tipo_asignatura == 'G'"><strong>9.3 Examen Final: del {{ final }}</strong></h3>
      <h3 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'"><strong>10.3 Examen Final: del {{ final
          }}</strong></h3>
      <p>Tarea Académica 2 (T.A.2)</p>
      <ul>
        <li>Prácticas calificadas (según cronograma).</li>
        <li>Prácticas dirigidas (opcional).</li>
        <li>Trabajo de investigación.</li>
      </ul>
    </div>
  </template>

  
</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

/**
 * Componentes
 */
import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  props: ['curso_'],

  mounted() {
    this.init()
  },

  components: {
    loader
  },

  data() {
    return {
      examenes: null
    }
  },

  computed: {
    parcial() {
      if (!this.examenes) return ''
      return `${this.examenes[0].finicio} al ${this.examenes[0].ffin}`
    },

    final() {
      if (!this.examenes) return ''
      return `${this.examenes[1].finicio} al ${this.examenes[1].ffin}`
    }
  },

  methods: {
    async init() {
      this.getFechaExamenes(this.periodo, this.curso_)
    },

    async getFechaExamenes({
      id_periodo,
      id_semestre
    }, {moda}) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando Fechas...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL}js-cronograma-sigedo-examen/${id_periodo}/${id_semestre}/${moda}`, this.autho)

        if (res.status === 200) {
          this.examenes = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.examenes = null
      }
      loading.close()
    }
  }
}
</script>

<style lang="scss" scoped>
p, ul {
  margin: 0;
}

h3 {
  margin: 0;
}
</style>


