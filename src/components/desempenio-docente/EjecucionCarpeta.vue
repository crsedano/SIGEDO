<template>
  <div class="ed-container init">
    <h4 class="ed-item sep-3 text-center">
      <strong>EVALUACIÓN EJECUCIÓN CARPETA ACADÉMICA DOCENTE: {{ nombre.toUpperCase() }}</strong>
    </h4>

    <div class="ed-item txt-center" v-if="idAsignatura != 0">
      <el-button type="info" @click="reporteEjecucionCarpeta" size="mini">Reporte Excel</el-button>
      <a 
        class="el-button el-button--primary el-button--mini"
        rel="noopener noreferrer"
        target="_blank"
        :href="`${URLPDF}api/src/Reports/desempenio-docente/EspecificoEvaluacionCarpeta.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&dni=${idDocente}&idAsigdoc=${idAsigdoc}&id=${identity.id_usuario}`"
      >
        Reporte PDF
      </a>
    </div>

    <div class="ed-item m-80 l-60 to-center sep-5">
      <el-select size="mini" v-model="idAsignatura" placeholder="">
        <el-option label="SELECCIONAR ASIGNATURA" :value="0"></el-option>
        <el-option v-for="a in asignaturas"
          :key="a.id_curso"
          :label="a.curso.nombre"
          :value="a.id_curso">
        </el-option>
      </el-select>
      
    </div>

    <div v-for="(c, i) in criterios" :key="i" class="ed-item card">
      <h6>
        <strong>{{ c.item }}</strong>
      </h6>

      <div class="ed-item sep-5 ed-container">
        <el-radio-group v-for="(o, index) in puntajes" :key="index" v-model="c.criterio.id_puntaje" size="small">
          <el-radio border :label="o.id">
            {{ o.item }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="ed-item sep-15 text-center" v-if="criterios">
      <el-button size="mini" type="primary" @click="saveEvaluacion">Aceptar</el-button>
    </div>
  </div>
</template>

<script>
import mixing_init from '../../mixing/mixing_init'

class CarpetaPuntaje {
  constructor ({ id, id_periodo, id_semestre, id_docente, id_asignatura, id_criterio, id_puntaje }) {
    this.id            = id
    this.id_periodo    = id_periodo
    this.id_semestre   = id_semestre
    this.id_docente    = id_docente
    this.id_asignatura = id_asignatura
    this.id_criterio   = id_criterio
    this.id_puntaje    = id_puntaje
  }
}

export default {
  name: 'ejecucion-carpeta',

  mixins: [mixing_init],

  mounted () {
    this.init()
  },

  props: {
    idDocente: {
      required: true
    },

    nombre: {
      required: true
    },

    asignaturas: {
      required: true
    }
  },

  watch: {
    idAsignatura(n) {
      this.criterios = null

      if (n == 0) return

      this.getDataEvaluacion()
    }
  },

  computed: {
    idAsigdoc () {
      let a = this.asignaturas.find(a => a.id_curso == this.idAsignatura)
      if (!a) return null
      return a.id_asigdoc
    }
  },

  data () {
    return {
      criterios   : null,
      puntajes    : null,
      idAsignatura: 0,
    }
  },

  methods: {
    init () {
      
    },

    async getDataEvaluacion () {
      const loading = this.$loading({
        lock      : true,
        text      : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/data_eval_ejecucion_carpeta/${ this.idPeriodo__ }/${ this.idSemestre__ }/${ this.idDocente }/${ this.idAsignatura }`)

        let { status, data } = res

        if (status === 200) {
          let { criterios, puntajes } = data

          this.criterios = criterios
          this.puntajes  = puntajes
        }
      } catch (err) {
        this.dataEvaluacion = null
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async saveEvaluacion () {
      const loading = this.$loading({
        lock      : true,
        text       : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      let criterios = this.criterios.map(cri => {
        let puntaje = new CarpetaPuntaje(cri.criterio)
        return puntaje
      })

      try {
        const res = await this.axios.post(`${this.URL_}v2/desempenio_docente/calificar_ejecucion_carpeta`, { puntajes: criterios })
        
        let { status } = res

        if (status === 200) {
          this.update()
          this.close()
        }
        
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    async reporteEjecucionCarpeta () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/desempenio_docente/ejecucion-carpeta-asignatura/${this.idPeriodo__}/${this.idSemestre__}/${this.idDocente}/${this.idAsigdoc}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    close () {
      this.$emit('close')
    },

    update () {
      this.$emit('update')
    }
  }
}
</script>

<style lang="scss" scoped>
h6 {
  margin: 0;
}

.card {
  box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  margin-top: 20px;
  padding   : 10px;
}
</style>


