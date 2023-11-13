<template>
  <div class="ed-container init sub-main">
    <i @click="close" class="fa fa-window-close action red iclose"></i>
    <div class="ed-item m-50 l-50 to-center sep-40">
      <el-input @keyup.enter.native.prevent="find" placeholder="Buscar Asignatura" v-model="buscar"></el-input>
    </div>

    <div class="ed-item sep-10">
      <el-table @row-click="selectAsignatura" border stripe fit :data="data" height="350" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="asignaturaLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Buscando Asignaturas...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Asignatura" min-width="220" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela" label="Escuela" min-width="220" align="center" header-align="center"></el-table-column>
        <el-table-column prop="plan" label="Plan" min-width="60" align="center" header-align="center"></el-table-column>
        <el-table-column prop="ciclo" label="Ciclo" min-width="60" align="center" header-align="center"></el-table-column>
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

  props: ['id_facultad', 'tmp_id_fusion', 'id_filial', 'id_modalidad', 'docentes'],

  data () {
    return {
      buscar: '',
      data: null,
      asignaturaLoad: false
    }
  },

  methods: {
    async find () {
      this.asignaturaLoad = true
      try {

        let {id_periodo, id_semestre} = this.periodo
        let {version_ingreso} = this.entorno

        const res = await this.axios.get(`${this.URL}buscar-asignatura-fusion/${this.buscar}/${this.id_facultad}/${this.id_filial}/${version_ingreso}/${this.id_modalidad}/${id_periodo}/${id_semestre}`)

        if(res.status === 200) {
          this.data = res.data.data
        }
      } catch (err) {
        this.data = null
        this.$hlp.errors(err)
      }
      this.asignaturaLoad = false
    },

    async selectAsignatura (row, event, column) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      

      if(row.id_asignatura == this.tmp_id_fusion) {
        this.swAlert(`No se puede fusionar con este curso`, 'warning')
        loading.close()
        return
      }

      this.docentes.map(d => {
        let obj = {
          id_curso: row.id_asignatura,
          reg_usuario: this.identity.id_usuario,
          tmp_id_fusion: this.tmp_id_fusion,
          id_periodo: this.periodo.id_periodo,
          id_semestre: this.periodo.id_semestre,
          id_filial: this.id_filial,
          id_modalidad: this.id_modalidad,
          id_docente: d.id_docente
        }
        
        this.registerFusion(obj)
      })      

      loading.close()
      this.close()
      
    },

    async registerFusion (obj) {
      try {
        const res = await this.axios.post(`${this.URL}register-fusion`, obj)

        if(res.status === 201) {
          this.updatePadre()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async updatePadre () {
      try {
        let obj = {
          id_curso: this.tmp_id_fusion,
          id_periodo: this.periodo.id_periodo,
          id_semestre: this.periodo.id_semestre,
          id_filial: this.id_filial,
          id_modalidad: this.id_modalidad
        }

        const res = await this.axios.put(`${this.URL}update-fusion-padre/1`, obj)

        if(res.status === 201) {

        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>

