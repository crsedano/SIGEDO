<template>
<div class="ed-container init">
  <div class="ed-item">
    <el-table border stripe fit :data="userEscuela" height="460" highlight-current-row :row-class-name="tableRowClassName">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="filial" label="Filial" min-width="130" align="center" header-align="center"></el-table-column>
      <el-table-column prop="facultad" label="Facultad" min-width="220" align="center" header-align="center"></el-table-column>
      <el-table-column prop="escuela" label="Escuela" min-width="300" align="center" header-align="center"></el-table-column>
      <el-table-column prop="modalidad" label="Modalidad" min-width="130" align="center" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="60" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Ver Cursos" placement="left">
            <i @click="abrirCursosEspecificos(reg.row)" class="fas fa-chalkboard-teacher pointer action"></i>
          </el-tooltip>
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

  data () {
    return {
      userEscuela: null
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getUsuarioEscuela()
    },

    async getUsuarioEscuela() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL}js-user-escuela/${this.identity.id_usuario}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)

        if (res.status === 200) {
          this.userEscuela = res.data.data
        }
      } catch (err) {
        this.userEscuela = null
        this.$hlp.errors(err)
      }
      loading.close()
    },

    abrirCursosEspecificos (curso) {
      this.$router.push({
        name: 'CursosEspecificos',
        params: {
          user: curso
        }
      })
    }
  }
}
</script>

