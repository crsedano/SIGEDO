<template>
<div class="ed-container init">
  <div class="ed-item txt-center">
    <h1>
      <strong>REPORTE DOCENTES ORDINARIOS</strong>
    </h1>
  </div>

  <el-form size="mini" class="ed-item sep-5 ed-container" label-width="120px">
    <el-form-item class="ed-item txt-center">
      <el-button type="info" @click="exportExcel">Descargar Excel</el-button>
    </el-form-item>
  </el-form>
</div>
</template>


<script>

// Mixin
import mixingInit from '../../mixing/mixing_init.js'

export default {
  mixins: [mixingInit],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if (!vm.permisos) {
        next('/')
        return
      }
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if (!s) {
        next('/')
      }
    })
  },

  mounted () {
    this.init()
  },

  components: {
  },

  data () {
    return {

    }
  },

  watch: {
    
  },

  computed: {

  },

  filters: {
    
  },

  methods: {
    async init() {
    },

    async exportExcel () {
      const loading = this.$loading({
        lock: true,
        text: 'Exportando datos...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      let { id_periodo, id_semestre } = this.periodo

      try {
        const res = await this.axios.get(`${this.URL_}v2/docentes_categoria/export`)

        this.downloadFile(res)

      } catch (err) {
        console.dir(err)
      }
      loading.close()
    },

    downloadFile(response) {
      const link = document.createElement('a')
      link.href = response.data.url
      link.download = response.data.name
      link.target = '_blank'
      link.click()
    },
  }
}
</script>

<style lang="scss" scoped>
p, h6 {
  margin: 0;
}
</style>

