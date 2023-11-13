<template>
  <div class="init ed-container">
    <div class="ed-item">
      <h2 class="txt-center">
        <strong>
          GLOSAS
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
      <h4 class="txt-center">GLOSAS</h4>
      <el-table border stripe fit :data="glosas" height="500" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="plan.anio" label="PLAN" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela.nombre" label="ESCUELA" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="glosa" label="GLOSA" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column label="CAPACIDADES" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button @click="setCapacidadRedaccion(reg.row)" v-if="!reg.row.has_capacidad" type="primary" size="mini">Marcar</el-button>
            <span v-else>SI</span>
          </template>
        </el-table-column>
        <el-table-column label="HABILIDADES" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button @click="setHabilidadesRedaccion(reg.row)" v-if="!reg.row.has_habilidades" type="primary" size="mini">Marcar</el-button>
            <span v-else>SI</span>
          </template>
        </el-table-column>
        <el-table-column label="DESTREZAS" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button @click="setDestrezasRedaccion(reg.row)" v-if="!reg.row.has_destrezas" type="primary" size="mini">Marcar</el-button>
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
  name: 'Glosas',

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
      
      glosas: null,
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

    async loadGlosas () {
      try {
        const { status, data } = await this.axios.get(`${this.URL_}2/evaluacion-interna/glosas/${this.planId}/${this.escuelaId}`)

        if (status === 200) {
          this.glosas = data.glosas
        }
      } catch (err) {
        this.glosas = []
        this.$hlp.errors(err)
      }
    },

    async loadData () {
      await this.loadGlosas()
    },

    async setCapacidadRedaccion ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status } = await this.axios.post(`${this.URL_}2/evaluacion-interna/capacidad-redaccion/${id}`)

        if (status === 200) {
          await this.loadGlosas()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async setHabilidadesRedaccion ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status } = await this.axios.post(`${this.URL_}2/evaluacion-interna/habilidades-redaccion/${id}`)

        if (status === 200) {
          await this.loadGlosas()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async setDestrezasRedaccion ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status } = await this.axios.post(`${this.URL_}2/evaluacion-interna/destrezas-redaccion/${id}`)

        if (status === 200) {
          await this.loadGlosas()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },
  }
}
</script>