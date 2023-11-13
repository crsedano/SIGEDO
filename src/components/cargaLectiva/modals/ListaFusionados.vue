<template>
  <div class="ed-container init sub-main">
    <i @click="close" class="fa fa-window-close action red iclose"></i>

    <div class="ed-item txt-center">
      <h2>
        <strong>
          CURSOS FUSIONADOS
        </strong>
      </h2>
    </div>

    <div class="ed-item sep-10">
      <el-table border stripe fit :data="arrFusiones" height="350" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="load" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Buscando Asignaturas...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="anio" label="Plan" min-width="60" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Asignatura" min-width="220" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela" label="Escuela" min-width="220" align="center" header-align="center"></el-table-column>
        <el-table-column prop="facultad" label="Facultad" min-width="220" align="center" header-align="center"></el-table-column>
        <el-table-column min-width="60" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button @click="deleteFusion(reg.row)" size="mini" type="danger" plain>Eliminar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  props: ['curso'],

  data () {
    return {
      load: false,
      arrFusiones: null
    }
  },

  mounted () {
    this.getData()
  },

  methods: {
    
    async getData () {
      this.load = true
      try {
        let { id_filial, id_modalidad, id_asignatura } = this.curso
        let { id_periodo, id_semestre } = this.periodo

        const res = await this.axios.get(`${this.URL}cursos-fusionados/${id_filial}/1/${id_modalidad}/${id_periodo}/${id_semestre}/${id_asignatura}`)

        if(res.status !== 200) return

        this.arrFusiones = res.data.data
      } catch (err) {
        this.arrFusiones = null
        this.$hlp.errors(err)
      }
      this.load = false
    },

    async deleteFusion ({ id_asigdoc }) {
      this.load = true
    
      try {
        const res = await this.axios.delete(`${this.URL}delete-fusion/${id_asigdoc}`)

        if(res.status !== 201) return

        await this.getData()
        await this.getData()
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.load = false
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>

