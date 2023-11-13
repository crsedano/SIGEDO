<template>
<div class="ed-container init">
  <div class="ed-item sep-2">
    <label>DNI Docente</label>
    <el-input v-model="id_docente" size="small"></el-input>
  </div>
  <div class="ed-item sep-5 gr-center">
    <el-button size="small" type="primary" plain @click="getDocenteData">Actualizar</el-button>
    <el-button size="small" type="primary" plain @click="toggleBuscarDocente">Buscar Docente</el-button>
  </div>
  <div v-if="dataDocente" class="ed-item sep-5">
    <strong>DNI:</strong> {{ dataDocente.id_docente }}
  </div>
  <div v-if="dataDocente" class="ed-item sep-5">
    <strong>Nombre:</strong> {{ dataDocente.nombre }}
  </div>
  <div v-if="dataDocente" class="ed-item gr-center">
    <a target="_blank" class="el-button el-button--primary el-button--small is-plain" :href="`${URLPDF}api/src/reportes/docente_cronograma/DocenteCronograma.php?ae_bcd=${token}&id_usuario=${identity.id_usuario}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&nombre=${dataDocente.nombre}`">Imprimir
      PDF
    </a>
  </div>

  <div v-if="modalBuscar" class="modal">
    <find-docente @close="toggleBuscarDocente" @sel="selectDocente" />
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
  },

  components: {
    findDocente
  },

  data() {
    return {
      id_docente: '',
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
        const res = await this.axios.get(`${this.URL}js-docente/${this.id_docente}`)

        if (res.status !== 200) return

        this.dataDocente = res.data.data
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    toggleBuscarDocente() {
      this.modalBuscar = !this.modalBuscar
    },

    selectDocente(id_docente) {
      this.id_docente = id_docente
      this.toggleBuscarDocente()
      this.getDocenteData()
    }
  }
}
</script>

