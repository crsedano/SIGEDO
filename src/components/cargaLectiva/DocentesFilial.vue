<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>REPORTE DOCENTES FILIALES</strong>
  </h1>

  <div class="ed-item gr-center sep-10">
    <el-button @click="getData" type="primary" plain size="mini">Actualizar</el-button>
    <a v-if="arrData" target="_blank" class="el-button el-button--mini el-button--info is-plain" :href="`${URLPDF}api/src/reportes/docentes_filial/DocentesFilial.php?ae_bcd=${token}&id_usuario=${identity.id_usuario}&id_periodo=${this.periodo.id_periodo}&id_semestre=${this.periodo.id_semestre}`">Imprimir PDF</a>
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="arrData" height="450" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="load" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando datos...">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="id_docente" label="DNI" min-width="80" align="center" header-align="center"></el-table-column>
      <el-table-column prop="nombre" label="Docente" min-width="250" align="center" header-align="center"></el-table-column>
      <el-table-column prop="filiales" label="Cód Filiales" min-width="150" align="center" header-align="center"></el-table-column>
      <el-table-column prop="filiales_nombre" label="Filiales" min-width="250" align="center" header-align="center"></el-table-column>
      <el-table-column sortable prop="cantidad_filiales" label="Num. Filial" min-width="120" align="center" header-align="center"></el-table-column>
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
    }
  },

  watch: {
    
  },

  computed: {
    
  },

  methods: {
    async init () {
      await this.getData()
    },

    async getData () {
      this.load = true
      try {
        let {id_periodo, id_semestre} = this.periodo
        const res = await this.axios.get(`${this.URL}v1/docenteFilial/all/${id_periodo}/${id_semestre}`)
        if(res.status !== 200) return

        this.arrData = res.data.data

        
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.load = false
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
