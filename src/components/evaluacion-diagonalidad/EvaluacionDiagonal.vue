<template>
  <div class="init ed-container">
    <div class="ed-item">
      <h2 class="txt-center">
        <strong>
          EVALUACIÓN DIAGONAL
        </strong>
      </h2>
    </div>

    <div class="ed-item txt-center">
      <el-select size="mini" v-model="escuelaId" filterable placeholder="Seleccionar escuela">
        <el-option
          v-for="(escuela, key) in escuelas"
          :key="key"
          :label="escuela.nombre"
          :value="escuela.id_escuela">
        </el-option>
      </el-select>
    </div>

    <div class="ed-item txt-center sep-10">
      <el-radio-group v-model="planSelected" size="mini">
        <el-radio-button v-for="(plan, key) in planes" :key="key" :label="plan.plan.anio"></el-radio-button>
      </el-radio-group>
    </div>

    <div v-if="escuelaId && planSelected" class="ed-item txt-center sep-10">
      <el-button type="primary" size="mini" @click="loadDiagonalidad">Evaluación digonalidad</el-button>
      <el-button type="primary" size="mini" @click="loadCreditos">Créditos por ciclo y áreas de formación</el-button>
      <a style="margin: 5px" class="el-button el-button--info el-button--mini" rel="noopener noreferrer" target="_blank" :href="`${URLPDF}api/src/Reports/curriculo-diagonalidad/CurriculoDiagonalidad.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&id=${identity.id_usuario}&plan=${planId}&escuela=${escuelaId}`">
        Reporte PDF
      </a>
    </div>
  </div>
</template>

<script>

import Init from '../../mixing/mixing_init'

export default {
  name: 'EvaluacionDiagonal',

  mixins: [ Init ],

  mounted () {
    this.loadEscuelas()
  },

  data () {
    return {
      escuelas: [],
      escuelaId: null,
      planes: [],
      planSelected: null,
    }
  },

  computed: {
    planId () {
      if (!this.planSelected) return null

      return this.planes.find(p => p.plan.anio == this.planSelected).plan.id_plan_estudio
    }
  },

  watch: {
    escuelaId (n) {
      this.planSelected = null

      if (!n) return

      this.loadPlanesEstudio()
    }
  },

  methods: {
    async loadEscuelas () {
      try {
        const { status, data } = await this.$api.get(`3/escuela`)

        if ( status === 200 ) {
          this.escuelas = data.escuelas
        }
      } catch (error) {
        this.escuelas = []
      }
    },

    async loadPlanesEstudio () {
      try {
        const { status, data } = await this.$api.get(`3/escuela/plan/${ this.escuelaId }`)

        if ( status === 200 ) {
          this.planes = data.planes
        }
      } catch (error) {
        this.planes = []
      }
    },

    async loadCreditos () {
      try {
        const { status, data } = await this.$api.get(`2/curriculo-diagonalidad/creditos-excel/${ this.escuelaId }/${ this.planId }`)

        if ( status === 200 ) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (error) {
        
      }
    },

    async loadDiagonalidad () {
      try {
        const { status, data } = await this.$api.get(`2/curriculo-diagonalidad/asignaturas-ciclo-excel/${ this.escuelaId }/${ this.planId }`)

        if ( status === 200 ) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (error) {
        
      }
    }
  }
}
</script>