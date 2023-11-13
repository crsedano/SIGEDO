<template>
  <div class="ed-container init">
    <h2 class="ed-item txt-center">
      <strong>DESEMPEÑO DOCENTE</strong>
    </h2>

    <h4 v-if="infoDocente" class="ed-item txt-center sep-5">
      <strong>Docente: {{ infoDocente.nombre }}</strong>
    </h4>

    <div class="ed-item sep-2 txt-center">
      <el-button style="margin: 5px" type="primary" size="mini" @click="openSearchDocente">Buscar Docente</el-button>
      <el-button style="margin: 5px" type="primary" size="mini" @click="reportTotal">Reporte Completo</el-button>
      <el-button style="margin: 5px" v-if="idDocente" type="info" size="mini" @click="reporteIndividualDocente">
        Reporte Individual de Resultados Desempeño Docente Excel
      </el-button>
      <el-button style="margin: 5px" v-if="idDocente" type="info" size="mini" @click="reporteIndicadoresDocente">
        Reporte Indicadores de Desempeño Docente Excel
      </el-button>
      <a style="margin: 5px" v-if="idDocente" class="el-button el-button--info el-button--mini" rel="noopener noreferrer" target="_blank" :href="`${URLPDF}api/src/Reports/desempenio-docente/ResultadoIndividualDocente.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=${idDocente}&id=${identity.id_usuario}`">
        Reporte Individual de Resultados Desempeño Docente PDF
      </a>
      <a style="margin: 5px" v-if="idDocente" class="el-button el-button--info el-button--mini" rel="noopener noreferrer" target="_blank" :href="`${URLPDF}api/src/Reports/desempenio-docente/IndicadoresDesempenio.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=${idDocente}&id=${identity.id_usuario}`">
        Reporte Indicadores de Desempeño Docente PDF
      </a>
    </div>

    <div v-if="infoDocente" class="ed-item sep-3">
      <el-tag type="primary" effect="plain">
        <strong>PUNTAJE TOTAL: {{ infoDocente.puntaje_total }}</strong>
      </el-tag>
    </div>

    <div v-if="infoDocente" class="ed-item m-50 sep-5 ed-container">
      <div class="ed-item ed-container sep-3">
        <div class="ed-item sep-1">
          <h4>
            <strong>Entrega Sílabo</strong>
          </h4>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Puntaje: {{ infoDocente.entrega_silabo.puntaje }}</el-tag>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Observación: {{ infoDocente.entrega_silabo.item }}</el-tag>
        </div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item sep-1">
          <h4>
            <strong>Ejecución Sílabo</strong>
          </h4>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Puntaje: {{ infoDocente.ejecucion_silabo.puntaje }}</el-tag>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Observación: {{ infoDocente.ejecucion_silabo.item }} ({{ infoDocente.ejecucion_silabo.porcentaje | percent }})</el-tag>
        </div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item sep-1">
          <h4>
            <strong>Entrega Carpeta Académica</strong>
          </h4>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Puntaje: {{ infoDocente.entrega_carpeta.puntaje }}</el-tag>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Observación: {{ infoDocente.entrega_carpeta.item }}</el-tag>
        </div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item sep-1">
          <h4>
            <strong>Ejecución Carpeta Académica</strong>
          </h4>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Puntaje: {{ infoDocente.ejecución_carpeta_académica }}</el-tag>
        </div>
        <div class="ed-item sep-1">
          <el-button type="primary" @click="openEjecucionCarpeta" size="mini">Detalles</el-button>
          <el-button type="info" @click="reporteEjecucionCarpeta" size="mini">Reporte Excel</el-button>
          <a 
            class="el-button el-button--info el-button--mini"
            rel="noopener noreferrer"
            target="_blank"
            :href="`${URLPDF}api/src/Reports/desempenio-docente/EspecificoEvaluacionCarpetas.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=${idDocente}&id=${identity.id_usuario}`"
          >
            Reporte PDF
          </a>
        </div>
      </div>
    </div>

    <div v-if="infoDocente" class="ed-item m-50 sep-5 ed-container">
      <div class="ed-item ed-container sep-3">
        <div class="ed-item sep-1">
          <h4>
            <strong>Aula Virtual</strong>
          </h4>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Puntaje: {{ infoDocente.aula_virtual.puntaje }}</el-tag>
        </div>
        <div class="ed-item sep-1">
          <el-button type="primary" size="mini" @click="openAulaVirtual">Observación: {{ infoDocente.aula_virtual.item }}</el-button>
        </div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item sep-1">
          <h4>
            <strong>Evaluaciones e informes</strong>
          </h4>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Puntaje: {{ infoDocente.evaluaciones_informes.puntaje }}</el-tag>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Observación: {{ infoDocente.evaluaciones_informes.item }}</el-tag>
        </div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item sep-1">
          <h4>
            <strong>Carga Lectiva</strong>
          </h4>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Puntaje: {{ infoDocente.carga_lectiva.puntaje }}</el-tag>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Observación: {{ infoDocente.carga_lectiva.item }} ({{ infoDocente.carga_lectiva.porcentaje | percent }})</el-tag>
        </div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item sep-1">
          <h4>
            <strong>Carga No Lectiva</strong>
          </h4>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Puntaje: {{ infoDocente.carga_no_lectiva.puntaje }}</el-tag>
        </div>
        <div class="ed-item sep-1">
          <el-tag type="info" effect="plain">Observación: {{ infoDocente.carga_no_lectiva.item }}</el-tag>
        </div>
      </div>

    </div>

    <el-divider v-if="infoDocente" content-position="left">Encuesta Estudiantil</el-divider>
    
    <div v-if="infoDocente" class="ed-item ed-container sep-3">
      <div class="ed-item sep-1">
        <h4>
          <strong>Encuesta</strong>
        </h4>
      </div>
      <div class="ed-item sep-1">
        <el-tag type="info" effect="plain">Puntaje: {{ infoDocente.encuesta }}</el-tag>
      </div>
      <div class="ed-item sep-1">
        <el-tag type="info" effect="plain">Resultado: {{ infoDocente.tercio }}</el-tag>
      </div>
      <div class="ed-item sep-1">
        <a class="el-button el-button--primary el-button--mini" rel="noopener noreferrer" target="_blank" :href="`${URLPDF}api/src/Reports/desempenio-docente/ResumenEncuestaDocente.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=${idDocente}&id=${identity.id_usuario}`">
          Resumen Resultados Encuesta
        </a>
      </div>
    </div>

    <el-dialog
      title="BUSCAR DOCENTE"
      :visible.sync="modal.searchDocente"
      v-if="modal.searchDocente"
      width="60%"
      top="5vh">
      <search-docente @select="getDocenteFromSearch" @close="closeSearchDocente" />
    </el-dialog>

    <el-dialog
      :visible.sync="modal.aulaVirtual"
      v-if="modal.aulaVirtual"
      width="60%"
      top="5vh">
      <aula-virtual :id-docente="infoDocente.id_docente" :nombre="infoDocente.nombre"  :aula-virtual="infoDocente.aula_virtual" @close="closeAulaVirtual" @update="refresh"/>
    </el-dialog>

    <el-dialog
      v-if="modal.ejecucionCarpeta"
      :visible.sync="modal.ejecucionCarpeta"
      :fullscreen="true"
      top="5vh">
      <ejecucion-carpeta :id-docente="infoDocente.id_docente" :nombre="infoDocente.nombre" :asignaturas="asignaturas" @update="refresh" @close="closeEjecucionCarpetal"/>
    </el-dialog>

    <el-dialog
      v-if="modal.reporteTotal"
      :visible.sync="modal.reporteTotal"
      fullscreen
      top="5vh">
      <reporte-total :facultades="facultades" :filiales="filiales" @close="modal.reporteTotal = false"/>
    </el-dialog>
    
  </div>
</template>

<script>
import ReporteTotal from './ReporteTotal.vue'
import EjecucionCarpeta from './EjecucionCarpeta.vue'
import AulaVirtual from './AulaVirtual.vue'
import SearchDocente from '../../Modal/docente/SearchDocente.vue'
import MixingInit from '../../mixing/mixing_init';

export default {
  name: 'desempenio-docente',

  mixins: [MixingInit],

  components: { SearchDocente, AulaVirtual, EjecucionCarpeta, ReporteTotal },

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
      infoDocente: null,
      idDocente  : null,
      asignaturas: null,
      modal      : {
        searchDocente   : false,
        aulaVirtual     : false,
        ejecucionCarpeta: false,
        reporteTotal    : false
      },

      filiales: null,
      facultades: null,
    }
  },

  filters: {
    percent (value) {
      if (!value) return ''

      return `${parseFloat(value).toFixed(2)}%`
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      await this.loadFacultades()
      await this.loadFiliales()
    },

    getDocenteFromSearch (docente) {
      this.idDocente   = docente.id_docente
      this.asignaturas = docente.cursos

      this.calicarDocente(this.idDocente)
    },

    async calicarDocente (id_docente) {
      const loading = this.$loading({
        lock      : true,
        ext       : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL_}v2/desempenio_docente/calificar_docente/${ this.idPeriodo__ }/${ this.idSemestre__ }/${ id_docente }`)

        let { status, data } = res

        if (status === 200) {
          this.infoDocente = data
        }

      } catch (err) {
        this.infoDocente = null

        this.$hlp.errors(err)
      }
      loading.close()
    },

    openSearchDocente () {
      this.modal.searchDocente = true
    },

    closeSearchDocente () {
      this.modal.searchDocente = false
    },

    openAulaVirtual () {
      this.modal.aulaVirtual = true
    },

    closeAulaVirtual () {
      this.modal.aulaVirtual = false
    },

    openEjecucionCarpeta () {
      this.modal.ejecucionCarpeta = true
    },

    closeEjecucionCarpetal () {
      this.modal.ejecucionCarpeta = false
    },

    refresh () {
      this.calicarDocente(this.idDocente)
    },

    async reporteIndividualDocente () {
      if (!this.idDocente) {
        this.$msgbox({
          title: '¡Precaución!',
          message: 'Debe seleccionar un docente para poder generar el reporte',
          confirmButtonText: 'OK',
        })
        return
      }

      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/individual-resultado/${this.idPeriodo__}/${this.idSemestre__}/${this.idDocente}`)

        let { status, data } = res

        if (status === 200) {
          this.downloadFile(data.url, data.name)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    async reporteIndicadoresDocente () {
      if (!this.idDocente) {
        this.$msgbox({
          title: '¡Precaución!',
          message: 'Debe seleccionar un docente para poder generar el reporte',
          confirmButtonText: 'OK',
        })
        return
      }

      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/indicadores-resultado/${this.idPeriodo__}/${this.idSemestre__}/${this.idDocente}`)

        let { status, data } = res

        if (status === 200) {
          this.downloadFile(data.url, data.name)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },
    
    async reportTotal () {
      if (!this.facultades || !this.filiales) return
    
      this.modal.reporteTotal = true
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
        const res = await this.axios.get(`${this.URL_}v2/user_data/facultades`)

        let { status, data } = res

        if (status === 200) {
          this.facultades = data.facultades
        }
      } catch (err) {
        this.facultades = null
        this.$hlp.errors(err)
      }
    },

    async loadFiliales () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/user_data/filiales`)

        let { status, data } = res

        if (status === 200) {
          this.filiales = data.filiales
        }
      } catch (err) {
        this.filiales = null
        this.$hlp.errors(err)
      }
    },

    async reporteEjecucionCarpeta () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/ejecucion-carpeta-asignaturas/${this.idPeriodo__}/${this.idSemestre__}/${this.idDocente}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    }
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>
