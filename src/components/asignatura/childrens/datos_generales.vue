<template>
  <div class="ed-container init">
    <div class="ed-item">
      <h2 style="text-align: center">
        <strong>I. DATOS GENERALES</strong>
      </h2>
    </div>

    <div v-if="curso" class="ed-item ed-container m-60 l-50 to-center">
      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.1. Asignatura</strong>
        </div>
        <div class="ed-item s-50">: {{ curso.asignatura }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.2. Código</strong>
        </div>
        <div class="ed-item s-50">: {{ curso.cod_asignatura }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.3. Ciclo Académico</strong>
        </div>
        <div class="ed-item s-50">: {{ curso.ciclo | romano }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.4. Créditos</strong>
        </div>
        <div class="ed-item s-50">: {{ curso.creditos | wZero }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.5. Carácter</strong>
        </div>
        <div class="ed-item s-50">: {{ caracterCurso }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.6. Área de Formación Profesional</strong>
        </div>
        <div class="ed-item s-50">: {{ curso.area_formacion }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.7. Prelación</strong>
        </div>
        <div class="ed-item s-50">: </div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.8. Plan de Estudios</strong>
        </div>
        <div class="ed-item s-50">: {{ curso.plan_estudio }}</div>
      </div>

      <div v-if="semestre" class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.9. Semestre Académico</strong>
        </div>
        <div class="ed-item s-50">: {{ semestre.id_periodo }} - {{ semestre.id_semestre | romano }}</div>
      </div>

      <div v-if="semestre" class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.10. Duración</strong>
        </div>
        <div class="ed-item s-50">: 18 Semanas</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.11. Número de horas semanales </strong>
        </div>
        <div class="ed-item s-50">: {{ parseInt(curso.horas_teoricas) + parseInt(curso.horas_practicas) | wZero}}</div>
      </div>

      <div style="margin-left: 1.5em" class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.11.1. Teoría</strong>
        </div>
        <div style="margin-left: -.8em" class="ed-item s-50">: {{ curso.horas_teoricas | wZero }}</div>
      </div>

      <div style="margin-left: 1.5em" class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.11.2. Práctica</strong>
        </div>
        <div style="margin-left: -.8em" class="ed-item s-50">: {{ curso.horas_practicas | wZero }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.12. Inicio de clases</strong>
        </div>
        <div v-if="cronograma" class="ed-item s-50">: {{ moment(cronograma[0].finicio).locale('es').format('D [de] MMMM YYYY') }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.13. Finalizacion de clases</strong>
        </div>
        <div v-if="cronograma" class="ed-item s-50">: {{ moment(cronograma[1].finicio).locale('es').format('D [de] MMMM YYYY') }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.14. Lugar de clases </strong>
        </div>
        <div class="ed-item s-50"></div>
      </div>

      <div style="margin-left: 1.5em" class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.14.1. Teoría</strong>
        </div>
        <div style="margin-left: -.8em" class="ed-item s-50">: {{ curso.filial }}</div>
      </div>

      <div style="margin-left: 1.5em" class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.14.2. Práctica</strong>
        </div>
        <div style="margin-left: -.8em" class="ed-item s-50">: {{ curso.filial }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.15. Docente(s) responsable(s) </strong>
        </div>
        <div class="ed-item s-50"></div>
      </div>

      <div style="margin-left: 1.5em" v-for="(doc, index) in datosDocente" :key="index" class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.15.{{index + 1}} {{ doc.nombre }}</strong>
        </div>
        <div style="margin-left: -.8em" class="ed-item s-50">: {{ doc.email }}</div>
      </div>

      <div class="ed-item ed-container sep-3">
        <div class="ed-item s-50">
          <strong>1.16. Jefe de Práctica</strong>
        </div>
        <div class="ed-item s-50">: {{ jefePractica }}</div>
      </div>

    </div>

    <div v-if="ajaxLoad" class="modal f-row f-center">
      <loader />
    </div>
  </div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

/**
 * Helpers
 */
import moment from 'moment'

/**
 * Componentes
 */
import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  props: ['curso_'],

  components: {
    loader
  },

  mounted() {
    this.init()
  },

  filters: {
    romano (value) {
      if (!value) return

      switch (parseInt(value)) {
        case 1:
          return 'I'
          break
        case 2:
          return 'II'
          break
        case 3:
          return 'III'
          break
        case 4:
          return 'IV'
          break
        case 5:
          return 'V'
          break
        case 6:
          return 'VI'
          break
        case 7:
          return 'VII'
          break
        case 8:
          return 'VIII'
          break
        case 9:
          return 'IX'
          break
        case 10:
          return 'X'
          break
      
        default:
          return 0
          break
      }
    },

    wZero (value) {
      if(!value) return

      let v = parseInt(value)

      if(v < 10) {
        return `0${v}`
      }

      return v
    }
  },

  data() {
    return {
      moment: moment,
      caracterCurso: null,
      cronograma: null,
      datosDocente: null,
      jefePractica: null,
      curso: null,
      semestre: null
    }
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando datos...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getDataCurso(this.curso_)
      await this.getCronograma(this.periodo, this.curso_)
      // await this.getCaracterCurso()
      await this.getDocentesReponsables(this.curso_, this.periodo)
      await this.getSemestreDuracion()
      await this.getSumillaCurso(this.curso_)
      loading.close()
    },

    async getSumillaCurso({
      id_curso
    }) {
      try {
        const res = await this.axios.get(`${this.URL}js-sumilla/${id_curso}`, this.autho)

        if (res.status === 200) {
          let sumilla = res.data.data
          let caracter = sumilla.sumilla_obj.split('carácter')
          
          let temp = caracter[1].trim().split(';')

          this.caracterCurso = temp[0].toUpperCase()
        }
      } catch (err) {
        console.dir(err)
      }
    },

    /**
     * Obtiene los datos del curso
     */
    async getDataCurso({
      id_curso,
      id_filial,
      id_modalidad
    }) {
      try {
        const res = await this.axios.get(`${this.URL}js-curso-datos/${id_curso}/2/${id_modalidad}`, this.autho)

        if (res.status === 200) {
          this.curso = res.data.data
          this.curso.filial = this.curso_.filial
        }
      } catch (err) {
        console.dir(err)
        this.curso = null
      }
    },

    /**
     * Obtiene los tipos de hora relacionados al curso
     */
    // async getTipoHora({
    //   id_curso,
    //   id_filial
    // }, {
    //   id_periodo,
    //   id_semestre
    // }) {
    //   try {
    //     const res = await this.axios.get(`${this.URL}js-tipo-hora/${id_curso}/${id_periodo}/${id_semestre}/${id_filial}`, this.autho)

    //     if (res.status === 200) {
    //       this.caracterCurso = this.getCaracterCurso(res.data.data)
    //     }
    //   } catch (err) {
    //     console.dir(err)
    //     this.caracterCurso = null
    //   }
    // },

    /**
     * Crear el caracter del curso (teorico, practico)
     */
    // getCaracterCurso() {
    //   let caracter = ''

    //   if(this.curso_.horas_teoricas > 0) {
    //     caracter = 'Teórico'
    //   }

    //   if(this.curso_.horas_practicas > 0) {
    //     if (caracter == '') {
    //       caracter = 'Práctico'
    //     } else {
    //       caracter += '-Práctico'
    //     }
    //   }
    //   // arr.forEach(el => {
    //   //   if (el.tipo_hora == 'ht') {
    //   //     caracter = 'Teórico'
    //   //   }

    //   //   if (el.tipo_hora == 'hp') {
    //   //     if (caracter == '') {
    //   //       caracter = 'Práctico'
    //   //     } else {
    //   //       caracter += '-Práctico'
    //   //     }
    //   //   }
    //   // })
    //   this.caracterCurso = caracter
    // },

    /**
     * Obtiene las fechas de inicio y fin de clases
     */
    async getCronograma({
      id_periodo,
      id_semestre
    }, {moda}) {
      try {
        const res = await this.axios.get(`${this.URL}js-cronograma-sigedo/${id_periodo}/${id_semestre}/${moda}`, this.autho)

        if (res.status === 200) {
          this.cronograma = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.cronograma = null
      }
    },

    /**
     * Obtiene duracion y semestre activo
     */
    async getSemestreDuracion() {
      try {
        const res = await this.axios.get(`${this.URL}js-silabo-duracion`, this.autho)

        if (res.status === 200) {
          this.semestre = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.semestre = null
      }
    },

    /**
     * Obtiene todos los docentes responsables
     * del curso
     */
    async getDocentesReponsables({
      id_curso,
      id_filial,
      moda
    }, {id_periodo, id_semestre}) {

      try {
        const res = await this.axios.get(`${this.URL}js-docente-responsable/${id_curso}/${id_filial}/${moda}/${id_periodo}/${id_semestre}`, this.autho)

        if (res.status === 200) {
          this.datosDocente = res.data.data

          // let jefe = this.datosDocente.find(d => d.id_cargo == 144)
          let jefe = this.datosDocente.find(d => d.is_jp == 1)

          if (jefe) {
            this.jefePractica = jefe.nombre
          } else {
            this.jefePractica = null
          }
        }
      } catch (err) {
        this.datosDocente = null
        console.dir(err)
        this.$notify.error({
          duration: 0,
          title: 'Precaución',
          message: 'No se han encontrado docentes responsables, es probable que no exista carga lectiva para la asignatura en la filial selccionada'
        })
      }
    },
  }
}
</script>

