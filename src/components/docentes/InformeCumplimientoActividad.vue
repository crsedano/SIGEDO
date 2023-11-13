<template>
<div class="ed-container init">
  <div class="ed-item sep-2">
    <label>Ingrese Numeracion</label>
    <el-input v-model="id_numeracion" size="small"></el-input>
  </div>

  <div v-if="id_numeracion != '' & getDocenteData != null " class="ed-item gr-center">
    <a target="_blank" class="el-button el-button--primary el-button--small is-plain" :href="`${URLPDF}api/src/reportes/docente_cumplimiento_actividad/InformeCumplimientoActividad.php?ae_bcd=${token}&id_usuario=${identity.id_usuario}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${identity.dni}&num=${this.id_numeracion}&nombres=${this.dataDocente.nombre}&grado=${dataDocente.grado}&cargo=${dataDocente.cargo}&paterno=${dataDocente.cpaterno}&materno=${dataDocente.cmaterno}&nombr=${dataDocente.cnombres}&condicion=${dataDocente.condicion}&adscrito=${dataDocente.adscrito}`">Imprimir
      PDF
    </a>
  </div>

</div>
</template>

<script>
import mixingInit from '../../mixing/mixing_init.js'

import findDocente from './modals/FindDocente.vue'

export default {
  mixins: [
    mixingInit
  ],

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

  props: ['curso_'],

  mounted() {
    this.init()
    this.getDocenteData()
  },

  components: {
    findDocente
  },

  data() {
    return {
      id_numeracion: '',
      dataDocente: null,
      modalBuscar: false
    }
  },

  computed: {

  },

  methods: {
    async init() {
    
    },

    async getDocenteData() {
      try {
        const res = await this.axios.get(`${this.URL}js-docente-cargo/${this.identity.dni}`)

        if (res.status !== 200) return

        this.dataDocente = res.data.data
      } catch (err) {
        this.$hlp.errors(err)
      }
    },


  }
}
</script>

