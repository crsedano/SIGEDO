<template>
<div class="ed-container init">
  <div class="ed-item txt-center">
    <h2>
      <strong>CURSOS ASIGNADOS</strong>
    </h2>
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="arrCursos" height="500" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando cursos a cargo...">
      <el-table-column fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="asignatura" label="Asignatura" min-width="300" align="left" header-align="center"></el-table-column>
      <el-table-column prop="plan_estudio" label="Plan" min-width="80" align="left" header-align="center"></el-table-column>
      <el-table-column prop="escuela" label="Escuela" min-width="300" align="left" header-align="center"></el-table-column>
      <el-table-column prop="facultad" label="Facultad" min-width="250" align="left" header-align="center"></el-table-column>
      <el-table-column prop="filial" label="Filial" min-width="120" align="left" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="120" align="center" header-align="center">
        <template slot-scope="reg">
          <el-button @click="goRegisterMateriales(reg.row)" size="mini" type="primary">Plan de clases</el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <strong>No cuenta con cursos asignados</strong>
      </template>
    </el-table>
  </div>
</div>
</template>

<script>
// Mixing
import mixingInit from '../../mixing/mixing_init.js'

export default {
  mixins: [
    mixingInit
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
      arrCursos: null,
    }
  },

  computed: {

  },

  methods: {
    async init () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getCursosAsignados()
      loading.close()
    },

    async getCursosAsignados() {
      let { id_periodo, id_semestre } = this.periodo
      try {
        const res = await this.axios.get(`${this.URL_}v2/planes_curso/asignaturas_docente/${id_periodo}/${id_semestre}`)

        if (res.status !== 200) return
        
        this.arrCursos = res.data.data
      } catch (err) {
        this.arrCursos = null
        this.$hlp.errors(err)
      }
    },

    goRegisterMateriales ({ id_curso }) {
      this.$router.push({
        name: 'PlanesClase',
        params: {
          idAsignatura: id_curso
        }
      })
    }

  }
}
</script>

<style lang="scss">

</style>
