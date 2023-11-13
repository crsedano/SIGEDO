<template>
  <div class="ed-container init">
    <div class="ed-item">
      <h2 class="txt-center">
        <strong>
          EVALUACIÓN CURRICULAR
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
    
    <el-collapse-transition>
      <div v-if="planSelected" class="ed-item txt-center sep-10">
        <el-button-group>
          <el-button @click="loadResultadosEstructura" size="mini" type="primary">ESTRUCTURA DEL CURRICULO</el-button>
          <el-button size="mini" disabled type="primary">EVALUACION DE FUNCIONALIDAD</el-button>
          <el-button size="mini" disabled type="primary">EVALUACION DE IMPACTO</el-button>
        </el-button-group>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-if="showButtonsEstructura" class="ed-item txt-center sep-10">
        <el-button disabled v-if="this.resultadoEstructuras" size="mini" type="info">EVALUADO</el-button>
        <el-button @click="dialog.estructura = true" v-else size="mini" type="primary">EVALUAR</el-button>
      </div>
    </el-collapse-transition>

    <el-dialog
      :visible.sync="dialog.estructura"
      fullscreen
    >
      <estructura @close="dialog.estructura = false" v-if="dialog.estructura" />
    </el-dialog>
    
  </div>
</template>

<script>

import Init from '../../mixing/mixing_init'

import Estructura from './dialog/Estructura'

export default {
  mixins: [ Init ],

  components: { Estructura },

  mounted () {
    this.loadEscuelas()
  },

  data() {
    return {
      escuelas: [],
      escuelaId: null,
      planes: [],
      planSelected: null,
      resultadoEstructuras: [],
      showButtonsEstructura: false,

      dialog: {
        estructura: false
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
      this.showButtonsEstructura = false

      if (!n) return

      this.loadPlanesEstudio()
    },

    planSelected () {
      this.showButtonsEstructura = false
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

    async loadResultadosEstructura () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status, data } = await this.axios.get(`${ this.URL_ }2/estructura-curriculo/by-escuela-plan/${ this.escuelaId }/${ this.planId }/${ this.idPeriodo__ }/${ this.idSemestre__ }`)

        if ( status === 200 ) {
          this.resultadoEstructuras = data.resultados_estructura
        }
      } catch (error) {
        this.resultadoEstructuras = null
        this.$hlp.errors(error)
      }
      this.showButtonsEstructura = true
      loading.close()
    }
  },
}
</script>