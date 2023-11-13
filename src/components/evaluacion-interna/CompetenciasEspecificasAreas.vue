<template>
  <div class="init ed-container">
    <div class="ed-item">
      <h2 class="txt-center">
        <strong>
          COMPETENCIAS ESPECIFICAS POR AREA DE FORMACION
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
    </div>

    <div class="ed-item" style="display: flex; justify-content: center; align-items: center;">
      <div class="Horario">
        <table class="Horario--Table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Competencia</th>
              <th v-for="(area, i) in areas" :key="`${i}d`">{{ area.descripcion }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(competencia, i) in competenciasEspecificas" :key="`${i}h`">
              <td>{{ i + 1 }}</td>
              <td>{{ competencia.competencia }}</td>
              <template v-for="(area, ii) in areas">
                <td :key="`${i}-${ii}`">
                  <el-button @click="registerEspecificoArea(competencia.id, area.id_area_formacion)" v-if="!getCompetenciaArea(area.id_area_formacion, competencia.id)" type="primary" size="mini">Marcar</el-button>
                  <span v-else>SI</span>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

import Init from '../../mixing/mixing_init'

export default {
  name: 'CompetenciasGeneralesAreas',

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
      
      competenciasEspecificasAreas: null,
      areasFormacion: null,
      competenciasEspecificas: null
    }
  },

  computed: {
    planId () {
      if (!this.planSelected) return null

      return this.planes.find(p => p.plan.anio == this.planSelected).plan.id_plan_estudio
    },
    
    areas () {
      if (!this.areasFormacion || this.areasFormacion.length <= 0) {
        return []
      }

      return this.areasFormacion.filter(a => a.id_area_formacion != 9)
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
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status, data } = await this.axios.get(`${ this.URL_ }3/escuela`)

        if ( status === 200 ) {
          this.escuelas = data.escuelas
        }
      } catch (error) {
        this.$hlp.errors(error)
      }
      loading.close()
    },

    async loadPlanesEstudio () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status, data } = await this.axios.get(`${ this.URL_ }3/escuela/plan/${ this.escuelaId }`)

        if ( status === 200 ) {
          this.planes = data.planes
        }
      } catch (error) {
        this.$hlp.errors(error)
      }
      loading.close()
    },

    async loadCompetenciasAreasEspecificas () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status, data } = await this.axios.get(`${this.URL_}2/evaluacion-interna/competencias-especificos-areas/${this.planId}/${this.escuelaId}`)

        if (status === 200) {
          this.competenciasEspecificasAreas = data.competencias_especificas_areas
          this.areasFormacion = data.areas
        }
      } catch (err) {
        this.competenciasEspecificasAreas = []
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async loadCompetenciasEspecifcas () {
      try {
        const { status, data } = await this.axios.get(`${this.URL_}2/evaluacion-interna/competencias-especificas/${this.planId}/${this.escuelaId}`)

        if (status === 200) {
          this.competenciasEspecificas = data.competencias_especificas
        }
      } catch (err) {
        this.competenciasEspecificas = []
        this.$hlp.errors(err)
      }
    },

    async loadData () {
      await this.loadCompetenciasEspecifcas()
      await this.loadCompetenciasAreasEspecificas()
    },

    getCompetenciaArea (area_id, competencia_id) {
      let competenciaArea = this.competenciasEspecificasAreas.find(h => h.area_id == area_id && h.competencia_id == competencia_id)

      return !!competenciaArea
    },

    async registerEspecificoArea (competenciaId, areaId) {
      try {
        const { status, data } = await this.axios.post(`${this.URL_}2/evaluacion-interna/register-especifico-area/${ competenciaId }/${ areaId }`)

        if (status === 200) {
          await this.loadCompetenciasAreasEspecificas()
        }
      } catch (error) {
        this.$hlp.errors(error)
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
