<template>
  <div class="init ed-container">
    <div class="ed-item">
      <h2 class="txt-center">
        <strong>
          PERTINENCIA ASIGNATURAS ALINEADAS A LAS ÁREAS
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
      <el-radio-group @change="loadData" v-model="planSelected" size="mini">
        <el-radio-button v-for="(plan, key) in planes" :key="key" :label="plan.plan.anio"></el-radio-button>
      </el-radio-group>
      <a v-if="areas.length > 0" style="margin: 5px" class="el-button el-button--info el-button--mini" rel="noopener noreferrer" target="_blank" :href="`${URLPDF}api/src/Reports/pertinencia-asignatura/PertinenciaAsignatura.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&id=${identity.id_usuario}&plan=${planId}&escuela=${escuelaId}`">
        Reporte PDF
      </a>
    </div>

    <div v-if="areas.length > 0" class="ed-item">
      <table class="Horario--Table">
        <thead>
          <tr>
            <th>AREA FORMACION</th>
            <th>CAPACIDADES</th>
            <th>ASIGNATURAS</th>
            <th>DIMENSION</th>
            <th>EVALUACION</th>
            <th>ACTUALIZAR</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(area, key) in areas">
            <tr :key="key">
              <td :rowspan="area.asignaturas.length + 1">{{ area.nombre }}</td>
            </tr>
            <tr v-for="(asignatura, k) in area.asignaturas" :key="`${key}${k}a`">
              <td>
                <el-select size="mini" v-model="asignatura.escuela_capacidad_id" filterable placeholder="Seleccionar capacidad">
                  <el-option
                    v-for="(capacidad, c) in capacidades"
                    :key="`${c}${k}${key}`"
                    :label="capacidad.capacidad"
                    :value="capacidad.id">
                  </el-option>
                </el-select>
              </td>
              <td>{{ asignatura.nombre }}</td>
              <td>
                <el-select size="mini" v-model="asignatura.dimension" filterable placeholder="Seleccionar dimensión">
                  <el-option
                    label="CIENTÍFICO"
                    value="CIENTÍFICO">
                  </el-option>
                  <el-option
                    label="TECNOLÓGICO"
                    value="TECNOLÓGICO">
                  </el-option>
                  <el-option
                    label="HUMANISTICO"
                    value="HUMANISTICO">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input-number v-model="asignatura.evaluacion" :min="0" :max="3" label="EVALUACION" size="mini"></el-input-number>                
              </td>
              <td>
                <el-button type="primary" @click="update(asignatura)" size="mini">ACTUALIZAR</el-button>                
              </td>
            </tr>
          </template>
        </tbody>
      </table>
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

      areas: [],
      capacidades: []
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

    async loadData () {
      try {
        const { status, data } = await this.$api.get(`2/pertinencia-asignatura/load-data/${this.escuelaId}/${this.planId}`)

        if ( status === 200 ) {
          this.areas = data.areas
          this.capacidades = data.capacidades
        }
      } catch (error) {
        this.areas = []
        this.capacidades = []
      }
    },

    async update (asignatura) {
      try {
        const { status, data } = await this.$api.post(`2/pertinencia-asignatura/update/${asignatura.id_asignatura}`, asignatura)

        if ( status === 200 ) {
          await this.loadData()
        }
      } catch (error) {
        
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Horario {
  margin    : 10px;
  max-height: 550px;
  overflow-x: auto;
  overflow-y: auto;
    &--Table {
      thead {
        tr {
          th {
            padding   : 5px;
            height    : 30px;
            min-width : 110px;
            text-align: center;
            border    : 1px solid black;
            font-size : 0.7em;
            background: rgb(30,72,132);
            color     : #fff;
          }
        }
      }

      tbody {
        tr {
          td {
            padding   : 5px;
            height    : 40px;
            min-width : 110px;
            text-align: center;
            border    : 1px solid black;
            font-size : 0.7em;
          }
        }
      }
    }
}
</style>
