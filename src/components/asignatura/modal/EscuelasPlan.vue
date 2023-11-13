<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>

  <div class="ed-item ed-container init">
    <div class="ed-item txt-center">
      <h1>
        <strong>ESCUELAS CON ASIGNATURAS REGISTRADAS EN EL PLAN {{ plan.anio }}</strong>
      </h1>
    </div>

    <div class="ed-item">
      <el-table border stripe fit :data="arrEscuelas" height="350" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando Escuelas...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela" label="Escuela" min-width="250" align="center" header-align="center"></el-table-column>
        <el-table-column prop="facultad" label="Facultad" min-width="250" align="center" header-align="center"></el-table-column>
        <!-- 
        <el-table-column prop="nombre" label="Docente" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="modalidad" label="Modalidad" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="filial" label="Filial" min-width="120" align="center" header-align="center"></el-table-column> -->
      </el-table>
    </div>
  </div>
 
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  props: [
    'plan'
  ],

  components: {

  },

  mounted () {
    this.init()
  },

  data () {
    return {
      arrEscuelas: null
    }
  },

  watch: {

  },

  computed: {
 
  },

  methods: {
    async init () {
      await this.getEscuelas()
    },

    async getEscuelas () {
      this.ajaxLoad = true
      try {
        const res = await this.axios.get(`${this.URL}v1/planesEstudio/getEscuelas/${this.plan.id_plan_estudio}`)
        if(res.status !== 200) return

        this.arrEscuelas = res.data.data
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.ajaxLoad = false
    },

    close () {
      this.$emit('close')
    }
  }

}
</script>

<style lang="scss" scoped>
p {
  margin: 0 auto;
  padding: 0;
}
</style>


