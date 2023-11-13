<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>CV DOCENTES FINALIZADOS</strong>
  </h1>

  <div class="ed-item m-60 l-40 to-center sep-10">
    <label>Facultad</label>
    <el-select filterable size="small" v-model="id_facultad" placeholder="Facultad">
      <el-option v-for="(facultad, index) in arrFacultades" :key="index" :label="facultad.nombre" :value="facultad.id_facultad">
      </el-option>
    </el-select>  
  </div>

  <div v-if="arrData" class="ed-item gr-center">
    <a class="el-button" target="_blank" :href="`${URLPDF}api/src/reportes/docentes_finalizados/ReporteFinalizado.php?ae_bcd=${token}&id_facultad=${id_facultad}&id_usuario=${identity.id_usuario}&facultad=${facultad}`">Imprimir</a>
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="arrData" height="450" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="load" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando competencias...">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="id_docente" label="DNI" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column prop="nombre" label="Docente" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column prop="facultad" label="Facultad" min-width="120" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

</div>
</template>

<script>
/**
 * MIXING
 */
import MixinInit from '../../mixing/mixing_init.js'

/**
 * Componentes
 */
import loader from '../templates/loader.vue'

import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex'

export default {
  mixins: [
    MixinInit
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
    loader
  },

  data() {
    return {
      arrData: null,
      id_facultad: 0,
      load: false
    }
  },

  watch: {
    id_facultad (n) {
      this.getData()
    }
  },

  computed: {
    ...mapState({
      arrFacultades: state => state.facultad.arrFacultades
    }),

    facultad () {
      return this.arrFacultades.find(f => f.id_facultad == this.id_facultad).nombre
    }
  },

  methods: {
    ...mapActions({
      getFacultades: 'facultad/getFacultades'
    }),

    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getFacultades()
      await this.getData()
      loading.close()
    },

    async getData () {
      this.load = true
      try {
        const res = await this.$http.get(`${this.URL}finalizados-docente/${this.id_facultad}`)

        if (res.status === 200) {
          this.arrData = res.data.data
        }
      } catch (err) {
        this.arrData = null
        this.$hlp.errors(err)
      }
      this.load = false
    }
  }
}
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  background: rgb(103, 182, 194);
  color: #000;
  font-weight: bold;
}
</style>
