<template>
  <div class="init ed-container">
    <div class="ed-item">
      <h2 class="txt-center">
        <strong>
          NIVEL DEL LOGRO ALINEADAS AL PERFIL
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
      <el-radio-group @change="loadAsignaturas" v-model="planSelected" size="mini">
        <el-radio-button v-for="(plan, key) in planes" :key="key" :label="plan.plan.anio"></el-radio-button>
      </el-radio-group>
      <a v-if="asignaturas && asignaturas.length > 0" style="margin: 5px" class="el-button el-button--info el-button--mini" rel="noopener noreferrer" target="_blank" :href="`${URLPDF}api/src/Reports/nivel-logro/NivelLogro.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&id=${identity.id_usuario}&plan=${planId}&escuela=${escuelaId}`">
        Reporte PDF
      </a>
    </div>

    <div v-if="asignaturas.length > 0" class="ed-item">
      <el-table border stripe fit :data="asignaturas" height="450" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="cod_asignatura" label="Código" min-width="80" align="center" header-align="center"></el-table-column>
        <el-table-column prop="ciclo" label="Ciclo" min-width="80" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Asignatura" min-width="400" align="center" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="60" align="center" header-align="center" style="display: flex">
          <template slot-scope="reg">
            <el-tooltip class="item" effect="dark" content="Evaluar" placement="left-start">
              <el-button @click="openEvaluacion(reg.row)" plain size="mini" type="primary" icon="el-icon-document" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>      
    </div>

    <el-dialog
      title=""
      :visible.sync="dialog.evaluacionLogro.show"
      fullscreen
    >
      <evaluacion-logro
        v-if="dialog.evaluacionLogro.show"
        :asignaturaId="dialog.evaluacionLogro.asignaturaId"
        :planId="planId"
        :escuelaId="escuelaId"
      />
    </el-dialog>
    
  </div>
</template>

<script>

import Init from '../../mixing/mixing_init'

import EvaluacionLogro from './dialog/EvaluacionLogro'

export default {
  name: 'EvaluacionDiagonal',

  mixins: [ Init ],

  components: { EvaluacionLogro },

  mounted () {
    this.loadEscuelas()
  },

  data () {
    return {
      escuelas: [],
      escuelaId: null,
      planes: [],
      planSelected: null,
      asignaturas: [],

      dialog: {
        evaluacionLogro: {
          show: false,
          asignaturaId: null
        }
      }
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

    async loadAsignaturas () {
      try {
        const { status, data } = await this.$api.get(`v2/asignaturas/planEscuela/${this.escuelaId}/${this.planId}`)

        if ( status === 200 ) {
          this.asignaturas = data.data
        }
      } catch (error) {
        this.asignaturas = []
      }
    },

    openEvaluacion ({id_asignatura: asignaturaId}) {
      this.dialog.evaluacionLogro.asignaturaId = asignaturaId
      this.dialog.evaluacionLogro.show = true
    }
  }
}
</script>