<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>

  <div class="ed-item ed-container init">
    <div v-if="com" class="ed-item txt-center">
      <h1>
        <strong>DOCENTE ENCARGADOS</strong>
      </h1>
    </div>
    <div v-else class="ed-item txt-center">
      <h1>
        <strong>DOCENTES QUE A LA FECHA NO CARGARON SILABOS</strong>
      </h1>
    </div>

    <div class="ed-item txt-center">
      <p>CURSO: {{ curso }}</p>
      <p>ESCUELA: {{ escuela }}</p>
      <p>FACULTAD: {{ facultad }}</p>
    </div>

    <div class="ed-item">
      <el-table border stripe fit :data="arrDocentes" height="350" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando docentes...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="id_docente" label="DNI" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Docente" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="modalidad" label="Modalidad" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="filial" label="Filial" min-width="120" align="center" header-align="center"></el-table-column>
      </el-table>
    </div>

     <div v-if="!com" class="ed-item sep-5 gr-center">
      <a target="_blank" :href="`${URLPDF}api/src/reportes/silabos_registro/silabo_registro.php?ae_bcd=${token}&id_usuario=${identity.id_usuario}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_curso=${id_curso}&escuela=${escuela}&facultad=${facultad}&curso=${curso}`" class="el-button el-button--primary el-button--small">Imprimir</a>
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
    'id_curso',
    'completo',
    'curso',
    'facultad',
    'escuela'
  ],

  components: {

  },

  mounted () {
    this.init()
  },

  data () {
    return {
      arrDocentes: null
    }
  },

  watch: {

  },

  computed: {
    com () {
      return this.completo == 1
    }
  },

  methods: {
    async init () {
      await this.getDocente()
    },

    async getDocente () {
      this.ajaxLoad = true
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL}v1/registroSilabos/getDocentes/${id_periodo}/${id_semestre}/${this.id_curso}`)
        if(res.status !== 200) return

        this.arrDocentes = res.data.data
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


