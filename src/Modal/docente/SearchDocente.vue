<template>
  <div class="ed-container init">
    <div class="ed-item ed-container">
      <div class="ed-item">
        <el-input @keyup.native.enter="searchDocente" size="mini" v-model="q" placeholder="Buscar Docente"></el-input>
      </div>
      <div class="ed-item sep-2 txt-center">
        <el-button size="mini" type="primary" @click="searchDocente">Buscar</el-button>
      </div>
    </div>

      <div class="ed-item sep-5">
        <el-table border stripe fit :data="arrDocentes" height="300" @current-change="selectOne" highlight-current-row :row-class-name="tableRowClassName">
          <el-table-column fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>
          <el-table-column prop="id_docente" label="DNI" min-width="80" align="center" header-align="center"></el-table-column>
          <el-table-column prop="nombre" label="Docente" min-width="220" align="left" header-align="center"></el-table-column>
          <el-table-column prop="facultad.nombre" label="Facultad" min-width="180" align="center" header-align="center"></el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
import mixing_init from '../../mixing/mixing_init'

export default {
  mixins: [mixing_init],

  data () {
    return {
      q          : '',
      arrDocentes: null
    }
  },

  methods: {
    async searchDocente() {
      const loading = this.$loading({
        lock      : true,
        ext       : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getDocentes(this.q)
      loading.close()
    },

    async getDocentes (q_) {
      let { id_periodo, id_semestre } = this.periodo
      try {
        const res = await this.axios.get(`${this.URL_}v2/docentes/search_docente/${q_}/${ id_periodo }/${ id_semestre }`)

        let { status, data } = res

        if (status === 200) {
          this.arrDocentes = data.docentes
        }
      } catch (err) {
        this.arrDocentes = null

        this.$hlp.errors(err)
      }
    },

    selectOne (row) {
      this.selectDocente(row)
      this.close()
    },

    selectDocente (docente) {
      this.$emit('select', docente)
    },

    close () {
      this.$emit('close')
    }
  }
}
</script>

