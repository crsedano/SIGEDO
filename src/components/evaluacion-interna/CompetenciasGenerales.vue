<template>
  <div class="init ed-container">
    <div class="ed-item">
      <h2 class="txt-center">
        <strong>
          COMPETENCIAS GENERALES
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

    <div class="ed-item sep-10">
      <h4 class="txt-center">COMPETENCIAS GENERALES</h4>
      <el-table border stripe fit :data="competeciasGenerales" height="500" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="plan.anio" label="PLAN" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela.nombre" label="ESCUELA" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="competencia" label="COMPETENCIA" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column label="REDACCION" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button @click="setRedaccion(reg.row)" v-if="!reg.row.is_redaccion" type="primary" size="mini">Marcar</el-button>
            <span v-else>SI</span>
          </template>
        </el-table-column>
        <el-table-column label="ALFA" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button @click="setAlfa(reg.row)" v-if="!reg.row.has_alfa" type="primary" size="mini">Marcar</el-button>
            <span v-else>SI</span>
          </template>
        </el-table-column>
        <el-table-column label="BETA" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button @click="setBeta(reg.row)" v-if="!reg.row.has_beta" type="primary" size="mini">Marcar</el-button>
            <span v-else>SI</span>
          </template>
        </el-table-column>
        <el-table-column label="GAMA" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button @click="setGama(reg.row)" v-if="!reg.row.has_gama" type="primary" size="mini">Marcar</el-button>
            <span v-else>SI</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import Init from '../../mixing/mixing_init'

export default {
  name: 'CompetenciasGenerales',

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
      
      competeciasGenerales: null,
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

    async loadCompetenciasGenerales () {
      try {
        const { status, data } = await this.axios.get(`${this.URL_}2/evaluacion-interna/competencias-generales/${this.planId}/${this.escuelaId}`)

        if (status === 200) {
          this.competeciasGenerales = data.competencias_generales
        }
      } catch (err) {
        this.competeciasGenerales = []
        this.$hlp.errors(err)
      }
    },

    async loadData () {
      await this.loadCompetenciasGenerales()
    },

    async setRedaccion ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status } = await this.axios.post(`${this.URL_}2/evaluacion-interna/redaccion-general/${id}`)

        if (status === 200) {
          await this.loadData()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async setAlfa ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status } = await this.axios.post(`${this.URL_}2/evaluacion-interna/alfa-general/${id}`)

        if (status === 200) {
          await this.loadData()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async setBeta ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status } = await this.axios.post(`${this.URL_}2/evaluacion-interna/beta-general/${id}`)

        if (status === 200) {
          await this.loadData()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async setGama ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status } = await this.axios.post(`${this.URL_}2/evaluacion-interna/gama-general/${id}`)

        if (status === 200) {
          await this.loadData()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },
  }
}
</script>