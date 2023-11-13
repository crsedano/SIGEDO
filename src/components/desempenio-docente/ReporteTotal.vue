<template>
  <div class="ed-container init">
    
    <el-form class="ed-item ed-container" size="mini" label-position="top" label-width="120px">
      <el-form-item class="ed-item" label="Facultad">
        <el-select v-model="idFacultad">
          <el-option label="TODOS" :value="0"></el-option>
          <el-option v-for="(item, key) in facultades"
            :key="key"
            :label="item.nombre"
            :value="item.id_facultad">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="escuelas" class="ed-item" label="Escuela">
        <el-select v-model="idEscuela">
          <el-option label="TODOS" :value="0"></el-option>
          <el-option v-for="(item, key) in escuelas"
            :key="key"
            :label="item.nombre"
            :value="item.id_escuela">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="ed-item" label=" Filial">
        <el-select v-model="idFilial" placeholder="">
          <el-option label="TODOS" :value="0"></el-option>
          <el-option v-for="(item, key) in filiales"
            :key="key"
            :label="item.nombre_filial"
            :value="item.id_filial">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-divider content-position="center">Puntajes Totales</el-divider>

    <div class="ed-item txt-center">
      <el-button size="mini" type="primary" @click="reportTotal" >Excel</el-button>
      <a class="el-button el-button--primary el-button--mini" rel="noopener noreferrer" target="_blank" :href="`${URLPDF}api/src/Reports/desempenio-docente/PuntajeTotalDocentes.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=0&id=${identity.id_usuario}&facultad=${idFacultad}&filial=${idFilial}&escuela=${idEscuela}`">
        PDF
      </a>
    </div>

    <el-divider content-position="center">Encuesta Estudiantil</el-divider>

    <!-- <div class="ed-item txt-center">
      <el-button size="mini" type="primary" @click="reporteEspecificoEncuesta" >Excel</el-button>
      <a 
        class="el-button el-button--primary el-button--mini" 
        rel="noopener noreferrer" 
        target="_blank" 
        :href="`${URLPDF}api/src/Reports/desempenio-docente/EspecificoEncuesta.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=0&id=${identity.id_usuario}&facultad=${idFacultad}&filial=${idFilial}&escuela=${idEscuela}`">
        PDF
      </a>
    </div> -->

    <div class="ed-item txt-center sep-5">
      <el-button size="mini" type="primary" @click="reporteTotal" >Resultado Total</el-button>
    </div>

    <div class="ed-item txt-center sep-5">
      <el-button size="mini" type="primary" @click="reporteDimension" >Resultado Dimensiones</el-button>
    </div>

    <div class="ed-item txt-center sep-5">
      <el-button size="mini" type="primary" @click="reporteSubdimension" >Resultado Subdimensiones</el-button>
    </div>

    <div class="ed-item txt-center sep-5">
      <el-button size="mini" type="primary" @click="reportePorPregunta" >Resultado Por Pregunta</el-button>
    </div>

    <el-divider content-position="center">Ejecución Carpeta Académica</el-divider>

    <div class="ed-item txt-center">
      <el-button size="mini" type="primary" @click="reporteEspecificoCarpeta" >Excel</el-button>
      <a 
        class="el-button el-button--primary el-button--mini" 
        rel="noopener noreferrer" 
        target="_blank" 
        :href="`${URLPDF}api/src/Reports/desempenio-docente/EspecificoCarpeta.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=0&id=${identity.id_usuario}&facultad=${idFacultad}&filial=${idFilial}&escuela=${idEscuela}`">
        PDF
      </a>
    </div>

    <el-divider content-position="center">Desempeño Cuantitativo</el-divider>

    <div class="ed-item txt-center">
      <el-button size="mini" type="primary" @click="reporteCuantitativoDesempenio" >Excel</el-button>
      <a 
        class="el-button el-button--primary el-button--mini" 
        rel="noopener noreferrer" 
        target="_blank" 
        :href="`${URLPDF}api/src/Reports/desempenio-docente/CuantitativoDesempenio.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=0&id=${identity.id_usuario}&facultad=${idFacultad}&filial=${idFilial}&escuela=${idEscuela}`">
        PDF
      </a>
    </div>

    <el-divider content-position="center">Desempeño Cualitativo</el-divider>

    <div class="ed-item txt-center">
      <el-button size="mini" type="primary" @click="reporteCualitativoDesempenio" >Excel</el-button>
      <a 
        class="el-button el-button--primary el-button--mini" 
        rel="noopener noreferrer" 
        target="_blank" 
        :href="`${URLPDF}api/src/Reports/desempenio-docente/CualitativoDesempenio.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=0&id=${identity.id_usuario}&facultad=${idFacultad}&filial=${idFilial}&escuela=${idEscuela}`">
        PDF
      </a>
    </div>

    <el-divider content-position="center">Docente con Felicitación</el-divider>

    <div class="ed-item txt-center">
      <el-button size="mini" type="primary" @click="reporteFelicitacionDocente" >Excel</el-button>
      <a 
        class="el-button el-button--primary el-button--mini" 
        rel="noopener noreferrer" 
        target="_blank" 
        :href="`${URLPDF}api/src/Reports/desempenio-docente/FelicitacionDocente.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=0&id=${identity.id_usuario}&facultad=${idFacultad}&filial=${idFilial}&escuela=${idEscuela}`">
        PDF
      </a>
    </div>

    <el-divider content-position="center">Docentes con plan de mejora</el-divider>

    <div class="ed-item txt-center">
      <el-button size="mini" type="primary" @click="reportePlanMejora" >Excel</el-button>
      <a 
        class="el-button el-button--primary el-button--mini" 
        rel="noopener noreferrer" 
        target="_blank" 
        :href="`${URLPDF}api/src/Reports/desempenio-docente/PlanMejora.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=0&id=${identity.id_usuario}&facultad=${idFacultad}&filial=${idFilial}&escuela=${idEscuela}`">
        PDF
      </a>
    </div>

    <el-divider content-position="center">Docentes no aptos</el-divider>

    <div class="ed-item txt-center">
      <el-button size="mini" type="primary" @click="reporteNoApto" >Excel</el-button>
      <a 
        class="el-button el-button--primary el-button--mini" 
        rel="noopener noreferrer" 
        target="_blank" 
        :href="`${URLPDF}api/src/Reports/desempenio-docente/NoApto.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=0&id=${identity.id_usuario}&facultad=${idFacultad}&filial=${idFilial}&escuela=${idEscuela}`">
        PDF
      </a>
    </div>
  </div>
</template>

<script>
import mixing_init from '../../mixing/mixing_init'

export default {
  name: 'reporte-total',

  mixins: [mixing_init],

  props: {
    facultades: {
      required: true
    },

    filiales: {
      required: true
    },


  },

  mounted () {
    this.init()
  },

  data () {
    return {
      escuelas: null,

      idFacultad: 0,
      idEscuela : 0,
      idFilial  : 0
    }
  },

  watch: {
    idFacultad (n) {
      if (n == 0) {
        this.idEscuela = 0
        this.escuelas  = null
        return
      }
      this.loadEscuelas()
    }
  },

  methods: {
    init() {
      
    },

    async loadEscuelas () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/user_data/escuelas/${this.idFacultad}`)

        let { status, data } = res

        if (status === 200) {
          this.escuelas = data.escuelas
        }
      } catch (err) {
        this.escuelas = null
        this.$hlp.errors(err)
      }
    },

    async reportTotal () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/desempenio-docentes/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reporteEspecificoEncuesta () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/especifico-encuestas/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reporteTotal () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}5/encuesta/puntaje-total/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reporteDimension () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}5/encuesta/puntaje-dimension/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reporteSubdimension () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}5/encuesta/puntaje-subdimension/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reportePorPregunta () {
      try {
        const res = await this.$api.get(`5/encuesta/encuesta-pregunta/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        
      }
    },

    async reporteEspecificoCarpeta () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/especifico-carpeta/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reporteCuantitativoDesempenio () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/cuantitativo-desempenio/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reporteCualitativoDesempenio () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/cualitativo-desempenio/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reporteFelicitacionDocente () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/felicitacion-docente/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reportePlanMejora () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/plan-mejora-docente/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async reporteNoApto () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/no-apto-docente/${this.idPeriodo__}/${this.idSemestre__}/${this.idFacultad}/${this.idFilial}/0/${this.idEscuela}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    update() {
      this.$emit('update')
    },

    close() {
      this.$emit('close')
    }
  },

}
</script>

