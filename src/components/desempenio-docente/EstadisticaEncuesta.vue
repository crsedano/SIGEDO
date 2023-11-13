<template>
  <div class="ed-container init">
    <h2 class="ed-item txt-center hidden-print">
      <strong>ESTADÍSTICA ENCUESTA ESTUDIANTIL</strong>
    </h2>
    
    <div class="ed-item txt-center hidden-print sep-10">
      <el-button
        @click="modal.searchDocente = true"
        size="mini"
        type="info"
      >
        Buscar Docente
      </el-button>
    </div>

    <el-form class="ed-item ed-container text-center hidden-print" size="mini" label-position="top" label-width="120px" style="justify-content: center">
      <el-form-item class="ed-item s-100 m-30" label="Facultad">
        <el-select v-model="facultadId">
          <el-option label="TODOS" :value="0"></el-option>
          <el-option v-for="(item, key) in facultades"
           :key="key"
           :label="item.nombre"
           :value="item.id_facultad"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="escuelas && escuelas.length > 0" class="ed-item s-100 m-30" label="Escuela">
        <el-select v-model="escuelaId">
          <el-option label="TODOS" :value="0"></el-option>
          <el-option v-for="(item, key) in escuelas"
           :key="key"
           :label="item.nombre"
           :value="item.id_escuela"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="dimensiones && dimensiones.length > 0" class="ed-item s-100 m-30" label="Dimensión">
        <el-select v-model="dimensionId">
          <el-option label="SELECCIONAR" :value="0"></el-option>
          <el-option v-for="(item, key) in dimensiones"
             :key="key"
             :label="item.dimension"
             :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item class="ed-item s-100 m-30" label="DNI Docente">
        <el-input v-model="docenteId" />
      </el-form-item>
    </el-form>
    
    <div class="ed-item txt-center hidden-print sep-10">
      <el-button
        v-if="dimensionId !== 0"
        @click="loadDataEstadistica"
        size="mini"
        type="primary"
      >
        Actualizar
      </el-button>
      <el-button
        v-if="data"
        @click="printPDF"
        size="mini"
        type="info"
      >
        Imprimir
      </el-button>
      <el-button
        v-if="data"
        @click="printJustChart"
        size="mini"
        type="info"
      >
        Imprimir Gráfico
      </el-button>
      <el-button
        v-if="data"
        @click="exportDataEstadistica"
        size="mini"
        type="info"
      >
        Imprimir Excel
      </el-button>
      <el-button
        @click="exportDataAllDimensiones"
        size="mini"
        type="info"
      >
        Imprimir Excel con todas las dimensiones
      </el-button>
    </div>
    
    <div class="ed-item ed-container">
      <div class="ed-item s-30 visible-print">
        <img
          style="max-width: 200px"
          src="../../assets/img/111.png"
         alt="logo"/>
      </div>
      
      <div v-if="data" class="ed-item s-70 txt-center sep-10">
        <h3>RESULTADO ESTADÍSTICO DIMENSIÓN {{ titleDimension }}</h3>
      </div>
    </div>

    <div v-if="facultad && data" class="ed-item txt-center sep-10">
      <h4>FACULTAD: {{ facultad.nombre }}</h4>
    </div>

    <div v-if="escuela && data" class="ed-item txt-center sep-10">
      <h4>ESCUELA: {{ escuela.nombre }}</h4>
    </div>

    <div v-if="docente && data" class="ed-item txt-center sep-10">
      <h4>DOCENTE: {{ docente.nombre }}</h4>
    </div>

    <template v-if="dimension && data">
      <div class="ed-item ed-container sep-10" v-if="!noChart" v-for="(sub, index) in dimension.subdimensiones" :key="index">
        <h5 class="ed-item sep-10">
          <strong>
            Sub Dimension {{ sub.sub_dimension }}:
          </strong>
        </h5>
        <br>
        <h5 class="ed-item sep-10">
          <strong>Indicadores:</strong>
        </h5>
        <p class="ed-item sep-10" v-for="(indicador, key) in sub.indicadores" :key="`${key}${index}ii`">
          {{ indicador.indicador }}
        </p>
        <br>
        <h5 class="ed-item sep-10">
          <strong>Preguntas:</strong>
        </h5>
        <p class="ed-item sep-10" v-for="(pregunta, key) in sub.preguntas" :key="`${key}${index}pp`">{{ pregunta.number }}. {{ pregunta.pregunta }}</p>
        <br/>
      </div>
    </template>

    <div v-if="data" class="ed-item to-center" style="max-width: 500px; justify-content: center; margin: auto; break-before: page;">
      <Bar :chartdata="chardata" :title="titleDimension" />
    </div>

    <el-dialog
      title="BUSCAR DOCENTE"
      :visible.sync="modal.searchDocente"
      v-if="modal.searchDocente"
      width="60%"
      top="5vh">
      <search-docente @select="getDocenteFromSearch" @close="closeSearchDocente" />
    </el-dialog>
  </div>
</template>

<script>
import MixingInit from '../../mixing/mixing_init'
import Bar from './charts/Bar'
import SearchDocente from '../../Modal/docente/SearchDocente'

export default {
  name: 'EstadisticaEncuesta',
  
  components: {SearchDocente, Bar},

  mixins: [MixingInit],

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

  data() {
    return {
      facultadId: 0,
      escuelaId: 0,
      docenteId: null,

      facultades: [],
      escuelas: [],
      dimensiones: [],
      dimensionId: 0,

      chardata: {},
      data: null,
      
      facultad: null,
      escuela: null,
      docente: null,
      dimension: null,
      
      modal: {
        searchDocente: false
      },
      
      noChart: false
    }
  },
  
  watch: {
    facultadId (newId) {
      if (newId === 0 || !newId) return
      this.loadEscuelas()
    }
  },
  
  computed: {
    titleDimension () {
      if (this.dimensionId === 0) return ''
      if (!this.dimensiones || this.dimensiones.length <= 0) return
      let dimension = this.dimensiones.find(d => d.id === this.dimensionId)
      return dimension.dimension
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      await this.loadFacultades()
      await this.loadDimensiones()
    },

    getDocenteFromSearch (docente) {
      this.docenteId   = docente.id_docente
    },

    openSearchDocente () {
      this.modal.searchDocente = true
    },

    closeSearchDocente () {
      this.modal.searchDocente = false
    },

    downloadFile (url, name) {
      const link = document.createElement('a')
      link.href = url
      link.download = url
      link.target = name
      link.click()
    },

    async loadFacultades () {
      try {
        const res = await this.$api.get(`v2/user_data/facultades`)

        let { status, data } = res

        if (status === 200) {
          this.facultades = data.facultades
        }
      } catch (err) {
        this.facultades = null
      }
    },

    async loadEscuelas () {
      try {
        const res = await this.$api.get(`v2/user_data/escuelas/${this.facultadId}`)

        let { status, data } = res

        if (status === 200) {
          this.escuelas = data.escuelas
        }
      } catch (err) {
        this.escuelas = null
      }
    },
    
    async loadDimensiones () {
      try {
        const { status, data } = await this.$api.get(`3/dimensiones-estudiantes`)
        
        if (status === 200) {
          this.dimensiones = data.dimensiones
        }
      } catch (e) {
        this.dimensiones = []
      }
    },
    
    async loadDataEstadistica () {
      this.data = null
      
      if (this.dimensionId === 0) {
        return
      }
      if (!this.docenteId || this.docenteId === '') this.docenteId = null
      if (!this.escuelaId || this.escuelaId === '' || this.escuelaId === 0) this.escuelaId = null
      if (!this.facultadId || this.facultadId === '' || this.facultadId === 0) this.facultadId = null
      try {
        const { status, data } = await this.$api.get(`3/encuesta-estadistico/data/${this.dimensionId}`, {
          params: {
            periodo_id: this.idPeriodo__,
            semestre_id: this.idSemestre__,
            docente_id: this.docenteId,
            escuela_id: this.escuelaId,
            facultad_id: this.facultadId
          }
        })
        
        if (status === 200) {
          this.createCharData(data.data)
          this.data = data.data
          this.facultad = data.facultad
          this.escuela = data.escuela
          this.docente = data.docente
          this.dimension = data.dimension
        }
      } catch (e) {
        this.data = null
        this.facultad = null
        this.escuela = null
        this.docente = null
        this.dimension = null
      }
    },

    async exportDataEstadistica () {
      if (this.dimensionId === 0) {
        return
      }
      if (!this.docenteId || this.docenteId === '') this.docenteId = null
      if (!this.escuelaId || this.escuelaId === '' || this.escuelaId === 0) this.escuelaId = null
      if (!this.facultadId || this.facultadId === '' || this.facultadId === 0) this.facultadId = null
      try {
        const { status, data } = await this.$api.get(`3/encuesta-estadistico/export-data/${this.dimensionId}`, {
          params: {
            periodo_id: this.idPeriodo__,
            semestre_id: this.idSemestre__,
            docente_id: this.docenteId,
            escuela_id: this.escuelaId,
            facultad_id: this.facultadId
          }
        })

        if (status === 200) {
          this.downloadFile(data.url, data.name)
        }
      } catch (e) {
        alert('Error al generar excel')
      }
    },

    async exportDataAllDimensiones () {
      if (!this.docenteId || this.docenteId === '') this.docenteId = null
      if (!this.escuelaId || this.escuelaId === '' || this.escuelaId === 0) this.escuelaId = null
      if (!this.facultadId || this.facultadId === '' || this.facultadId === 0) this.facultadId = null
      try {
        const { status, data } = await this.$api.get(`3/encuesta-estadistico/data-all-dimensiones`, {
          params: {
            periodo_id: this.idPeriodo__,
            semestre_id: this.idSemestre__,
            docente_id: this.docenteId,
            escuela_id: this.escuelaId,
            facultad_id: this.facultadId
          }
        })

        if (status === 200) {
          this.downloadFile(data.url, data.name)
        }
      } catch (e) {
        alert('Error al generar excel')
      }
    },

    createCharData (data) {
      this.chardata.labels = data.map(d => d.nombre_escala)
      this.chardata.datasets = [
        {
          label: 'Porcentaje',
          backgroundColor: '#77AFF3',
          data: data.map(d => d.porcentaje_escala)
        }
      ]
    },

    printPDF () {
      this.noChart = false
      setTimeout(() => {
        window.print()
      }, 1000)
    },
    
    printJustChart () {
      this.noChart = true
      setTimeout(() => {
        window.print()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>

<style>
  @page
  {
    size:  auto;   /* auto es el valor inicial */
    margin: 2cm;  /* afecta el margen en la configuración de impresión */
    /*margin: 0mm;  !* afecta el margen en la configuración de impresión *!*/
  }

  /*.just-chart {*/
  /*  display: none;*/
  /*}*/

  @media print {

    body {
      margin: 0;
      color: #000;
      background-color: #fff;
    }
    
    .just-chart {
      display: none !important;
    }
  }
</style>
