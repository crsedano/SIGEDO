<template>
  <div v-loading.fullscreen.lock="loading__" class="ed-container">
    <div class="ed-item ed-container">
      <div v-for="(pregunta, index) in preguntas" :key="index" class="ed-item sep-10 ed-container">
        <p class="ed-item sep-5 Question">
          <strong>
            {{ pregunta.pregunta.number }}. {{ pregunta.pregunta.pregunta }}
          </strong>
        </p>

        <div class="Center ed-item ed-container sep-5 text-center">
          <el-radio class="sep-5" v-for="(o, index) in respuestas" :key="index" v-model="pregunta.id_puntaje" :label="o.id">
            {{ o[`criterio_${pregunta.pregunta.criterio}`] }}
          </el-radio>
        </div>
      </div>
    </div>

    <div class="ed-item">
      <el-button type="danger" @click="registerAnswers">Completar</el-button>
    </div>
  </div>
</template>

<script>

class EncuestaTotalPuntajes {
  constructor ({id, id_docente, id_asignatura, id_encuesta, id_pregunta, id_puntaje, id_alumno} = {id: '', id_docente: '', id_asignatura: '', id_encuesta: '', id_pregunta: '', id_puntaje: '', id_alumno: ''}) {
    this.id            = id
    this.id_docente    = id_docente
    this.id_asignatura = id_asignatura
    this.id_encuesta   = id_encuesta
    this.id_pregunta   = id_pregunta
    this.id_puntaje    = id_puntaje
    this.id_alumno     = id_alumno
  }
}

import mixing_init from '../../mixing/mixing_init'

export default {
  name: 'encuesta',

  mixins: [mixing_init],

  mounted () {
    this.getPreguntas()
  },

  props: {
    idDocente: {
      required: true
    },

    idAsignatura: {
      required: true
    }
  },

  data () {
    return {
      preguntas : null,
      respuestas: null,
      opcion    : '',
      loading__ : false
    }
  },

  methods: {
    async getPreguntas () {
      this.loading__ = true
      try {
        const res = await this.axios.get(`${this.URL_}v2/encuestas/resultado-encuesta/${this.idDocente}/${this.idAsignatura}/${this.idPeriodo__}/${this.idSemestre__}`)
        let { status, data } = res

        if (status === 200) {
          this.preguntas  = data.preguntas
          this.respuestas = data.respuestas

          let e = this.preguntas.every(p => p.id_puntaje == 0)

          if (!e) {
            this.$alert('¡Esta encuesta ya fue realizada!', 'SIGEDO', {
              confirmButtonText: 'OK',
            })
            this.close()
          }
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.loading__ = false
    },

    async registerAnswers () {
      this.loading__ = true
      let answers = this.preguntas.map(p =>{
        return new EncuestaTotalPuntajes(p)
      })

      if (!answers.every(a => a.id_puntaje != 0)) {
        this.$msgbox({
          title            : '¡Alerta!',
          message          : 'Tiene que completar toda la encuesta para poder guardarla',
          confirmButtonText: 'OK',
        })
        this.loading__ = false
        return
      }
      
      try {
        const res = await this.axios.post(`${this.URL_}v2/encuestas/store-answer`, {answers})
        
        let { status, data } = res

        if (status === 200) {
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.loading__ = false
    },

    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.Center {
  display        : flex;
  justify-content: center;
  align-items    : center;
}

.Question {
  font-size: 1.2em;
}
</style>
