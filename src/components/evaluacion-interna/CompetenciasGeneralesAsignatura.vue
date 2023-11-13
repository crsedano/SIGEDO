<template>
  <div class="init ed-container">
    <div class="ed-item">
      <h2 class="txt-center">
        <strong>
          COMPETENCIAS GENERALES POR ASIGNATURA
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
              <th>Asignatura</th>
              <th>Ciclo</th>
              <th v-for="(competencia, i) in competenciasGenerales" :key="`${i}d`">{{ competencia.competencia }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(asignatura, i) in asignaturas" :key="`${i}h`">
              <td>{{ i + 1 }}</td>
              <td>{{ asignatura.nombre }}</td>
              <td>{{ asignatura.ciclo }}</td>
              <template v-for="(competencia, ii) in competenciasGenerales">
                <td :key="`${i}-${ii}`">
                  <el-button @click="registerGeneralAsignatura(competencia.id, asignatura.id_asignatura)" v-if="!getCompetenciaAsignatura(asignatura.id_asignatura, competencia.id)" type="primary" size="mini">Marcar</el-button>
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
  name: 'CompetenciasGeneralesAsignatura',

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
      
      competenciasGeneralesAsignaturas: null,
      asignaturas: null,
      competenciasGenerales: null
    }
  },

  computed: {
    planId () {
      if (!this.planSelected) return null

      return this.planes.find(p => p.plan.anio == this.planSelected).plan.id_plan_estudio
    },
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

    async loadCompetenciasAsignaturasGeneral () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status, data } = await this.axios.get(`${this.URL_}2/evaluacion-interna/competencias-generales-asignaturas/${this.planId}/${this.escuelaId}`)

        if (status === 200) {
          this.competenciasGeneralesAsignaturas = data.competencias_general_asignaturas
          this.asignaturas = data.asignaturas
        }
      } catch (err) {
        this.competenciasGeneralesAsignaturas = []
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async loadCompetenciasGeneral () {
      try {
        const { status, data } = await this.axios.get(`${this.URL_}2/evaluacion-interna/competencias-generales/${this.planId}/${this.escuelaId}`)

        if (status === 200) {
          this.competenciasGenerales = data.competencias_generales
        }
      } catch (err) {
        this.competenciasGenerales = []
        this.$hlp.errors(err)
      }
    },

    async loadData () {
      await this.loadCompetenciasGeneral()
      await this.loadCompetenciasAsignaturasGeneral()
    },

    getCompetenciaAsignatura (asignatura_id, competencia_id) {
      let competenciaArea = this.competenciasGeneralesAsignaturas.find(h => h.asignatura_id == asignatura_id && h.competencia_id == competencia_id)

      return !!competenciaArea
    },

    async registerGeneralAsignatura (competenciaId, asignaturaId) {
      try {
        const { status, data } = await this.axios.post(`${this.URL_}2/evaluacion-interna/register-general-asignatura/${ competenciaId }/${ asignaturaId }`)

        if (status === 200) {
          await this.loadCompetenciasAsignaturasGeneral()
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
