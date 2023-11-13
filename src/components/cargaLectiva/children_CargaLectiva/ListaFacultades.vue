<template>
<div class="ed-container init">
  <div class="ed-item">
    <el-table border stripe fit :data="facultades" height="460" highlight-current-row :row-class-name="tableRowClassName">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="filial" label="Filial" min-width="130" align="center" header-align="center"></el-table-column>
      <el-table-column prop="facultad" label="Facultad" min-width="220" align="center" header-align="center"></el-table-column>
      <el-table-column prop="modalidad" label="Modalidad" min-width="130" align="center" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="60" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Ver Cursos" placement="left">
            <i @click="abrirCursosGenerales(reg.row)" class="fas fa-chalkboard-teacher pointer action"></i>
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
      facultades: null
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
          let userEscuela = res.data.data

          this.facultades = []
          userEscuela.forEach(u => {
            if (!this.facultades.some(f => f.id_facultad == u.id_facultad && f.id_modalidad == u.id_modalidad && f.id_filial == u.id_filial)) {
              this.facultades.push(u)
            }
          })
        }
      } catch (err) {
        this.facultades = null
        this.$hlp.errors(err)
      }
      loading.close()
    },

    abrirCursosGenerales (curso) {
      this.$router.push({
        name: 'CursosGenerales',
        params: {
          user: curso
        }
      })
    }
  }
}
</script>

