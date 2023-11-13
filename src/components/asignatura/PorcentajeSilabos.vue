<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>PROCENTAJE AVANCE REGISTRO SILABO</strong>
  </h1>

  <div class="ed-item gr-center sep-10">
    <el-button @click="getByEscuelas" type="primary" plain size="mini">Por Escuelas</el-button>
    <el-button @click="getByFacultades" type="primary" plain size="mini">Por Facultad</el-button>
  </div>

   <div  v-if="isEscuela == true" class="ed-item sep-5 gr-center">
      <a target="_blank" :href="`${URLPDF}api/src/reportes/silabos_porcentaje/silabo_porcentaje.php?ae_bcd=${token}&id_usuario=${identity.id_usuario}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}`" class="el-button el-button--primary el-button--small">Imprimir</a>
    </div>

    <div  v-if="isEscuela == false && arrData" class="ed-item sep-5 gr-center">
      <a target="_blank" :href="`${URLPDF}api/src/reportes/silabos_porcentaje/silabo_porcentaje_facultad.php?ae_bcd=${token}&id_usuario=${identity.id_usuario}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}`" class="el-button el-button--primary el-button--small">Imprimir</a>
    </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="arrData" height="450" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="load" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando avance...">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column :filters="planFilter" :filter-method="filterHandler" sortable prop="anio" label="Plan" min-width="60" align="center" header-align="center"></el-table-column>
      <el-table-column v-if="isEscuela" sortable prop="escuela" label="Escuela" min-width="300" align="center" header-align="center"></el-table-column>
      <el-table-column :filters="facultadFilter" :filter-method="filterHandler" sortable prop="facultad" label="Facultad" min-width="250" align="center" header-align="center"></el-table-column>
      <el-table-column sortable prop="porcentaje" label="%Avance" min-width="90" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

</div>
</template>

<script>

import MixinInit from '../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if(!vm.permisos) {
        next('/')
        return
      } 
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if(!s) {
        next('/')
      }
    })
  },

  mounted() {
    this.init()
  },

  components: {

  },

  data() {
    return {
      load: false,
      arrData: null,
      isEscuela: false,
      planFilter: [],
      facultadFilter: []
    }
  },

  watch: {
    
  },

  computed: {
    
  },

  methods: {
    async init () {

    },

    async getByEscuelas () {
      this.load = true
      try {
        const res = await this.axios.get(`${this.URL}v1/avanceSilabo/byEscuelas`)
        
        if(res.status !== 200) return

        this.isEscuela = true

        this.arrData = res.data.data.map(a => {
          a.porcentaje = parseFloat(a.porcentaje)
          a.anio = parseInt(a.anio)
          return a
        })
        this.createFilterPlan(this.arrData)
        this.createFilterFacultad(this.arrData)
        
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.load = false
    },

    async getByFacultades () {
      this.load = true
      try {
        const res = await this.axios.get(`${this.URL}v1/avanceSilabo/byFacultad`)
        
        if(res.status !== 200) return

        this.isEscuela = false
        
        this.arrData = res.data.data.map(a => {
          a.porcentaje = parseFloat(a.porcentaje)
          a.anio = parseInt(a.anio)
          return a
        })

        this.createFilterPlan(this.arrData)
        this.createFilterFacultad(this.arrData)
        
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.load = false
    },

    createFilterPlan (arr) {
      arr.map(a => {
        let plan = {
          text: a.anio,
          value: a.anio
        }

        let exist = this.planFilter.some(b => b.text == a.anio)

        if(!exist) {
          this.planFilter.push(plan)
        }
      })
    },

    createFilterFacultad (arr) {
      arr.map(a => {
        let fac = {
          text: a.facultad,
          value: a.facultad
        }

        let exist = this.facultadFilter.some(b => b.text == a.facultad)

        if(!exist) {
          this.facultadFilter.push(fac)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
