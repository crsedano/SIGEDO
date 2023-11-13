<template>
  <div class="ed-container init">
    <h1>REPORTE DOCENTES</h1>

    <div class="ed-item">
      <el-input size="mini" v-model="q" placeholder="Buscar por DNI o nombre"></el-input>
      <el-radio v-model="jp" label="N">TODOS</el-radio>
      <el-radio v-model="jp" label="T">Solo jefe de práctica</el-radio>
      <el-radio v-model="jp" label="F">Solo docentes</el-radio>
      <el-button type="primary" @click="loadDocentes" size="mini">Actualizar</el-button>
      
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.loadDocentes()
  },

  data () {
    return {
      q: '',
      jp: '',
      docentes: []
    }
  },

  methods: {
    async loadDocentes () {
      let query = this.q === '' ? null : this.q
      let jp = this.jp === '' || this.jp === 'N' ? null : this.jp

      try {
        const { status, data } = await this.$api.get(`3/docente/paginate/2`, {
          params: {
            page: 1,
            q: query,
            jp: jp
          }
        })

        if (status === 200) {
          this.docentes = data.docentes
        }
      } catch (error) {
        this.docentes = []
      }
    }
  }
}
</script>