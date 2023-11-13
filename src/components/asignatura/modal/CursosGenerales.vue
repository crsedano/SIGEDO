<template>
<div class="sub-main" style="display: flex; align-items: center">
  <i @click="close" class="fa fa-window-close action red iclose"></i>

  <div class="ed-item ed-container init">
    <div class="ed-item txt-center">
      <h1>
        <strong>
          ASIGNATURAS GENERALES RELACIONADAS
        </strong>
      </h1>
    </div>
    <div class="ed-item sep-10">
      <el-table border stripe fit :data="arrCursos" height="250" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="planLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column fixed type="index" min-width="30" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Asignatura" min-width="350" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela" label="Escuela" min-width="350" align="center" header-align="center"></el-table-column>
        <el-table-column label="PRINCIPAL" align="center" header-align="center">
          <template slot-scope="reg">
            {{reg.row.id_asignatura == id ? 'SI' : ''}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>


</div>
</template>

<script>
// mixing
import mixingInit from '../../../mixing/mixing_init.js'

export default {
  mixins: [
    mixingInit
  ],
  
  props: [
    'id'
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

  data: function () {
    return {
      arrCursos: null,
      planLoad: false
    }
  },

  computed: {
  
  },

  watch: {
  
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
     
     await this.getGenerales()

      loading.close()
    },

    async getGenerales () {
      try {
        const res = await this.axios.get(`${this.URL}v1/planesEstudio/getGenerales/${this.id}`)

        if(res.status !== 200) return

        this.arrCursos = res.data.data
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    close () {
      this.$emit('close')
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

