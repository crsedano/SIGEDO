<template>
  <div class="ed-container Horario">
    <div class="ed-item">
      <el-button type="primary" @click="print" size="mini">Imprimir</el-button>
      
    </div>
    <table class="Horario--Table">
      <thead>
        <tr>
          <th></th>
          <th class="contenido" v-for="(contenido, key) in asignaturaContenidos" :key="`${key}c`">{{ contenido.contenido }}</th>
          <th class="rasgo" v-for="(rasgo, key) in curriculoRasgos" :key="`${key}r`">{{ rasgo.rasgos }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(objetivo, key) in objetivos" :key="`${key}o`">
          <td>{{ objetivo.objetivo }}</td>
          <td @click="evaluarSumilla(contenido.id, objetivo.id_silabus_obj)" v-for="(contenido, key) in asignaturaContenidos" :key="`${key}cc`">
            {{ getNivelLogroSumilla(contenido.id, objetivo.id_silabus_obj) }}
          </td>
          <td @click="evaluarRasgo(rasgo.id, objetivo.id_silabus_obj)" v-for="(rasgo, key) in curriculoRasgos" :key="`${key}rr`">
            {{ getNivelLogroRasgo(rasgo.id, objetivo.id_silabus_obj) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Init from '../../../mixing/mixing_init'
import NivelLogroSumilla from '../model/NivelLogroSumilla'
import NivelLogroRasgo from '../model/NivelLogroRasgo'

export default {
  name: 'EvaluacionLogro',

  mixins: [ Init ],

  props: {
    asignaturaId: {
      required: true
    },

    escuelaId: {
      required: true
    },

    planId: {
      required: true
    },
  },

  data () {
    return {
      asignaturaContenidos: [],
      curriculoRasgos: [],
      objetivos: [],
      nivelLogroRasgos: [],
      nivelLogroSumillas: []
    }
  },

  mounted () {
    this.loadData()
  },

  methods: {
    async loadData () {
      try {
        const { status, data } = await this.$api.get(`2/nivel-logro/by-asignatura/${this.asignaturaId}/${ this.escuelaId }/${ this.planId }/${this.idPeriodo__}/${this.idSemestre__}`)

        if ( status === 200 ) {
          console.log(data)
          this.asignaturaContenidos = data.asignatura_contenidos
          this.curriculoRasgos = data.curriculo_rasgos
          this.objetivos = data.objetivos_especificos
          this.nivelLogroRasgos = data.nivel_logro_rasgos
          this.nivelLogroSumillas = data. nivel_logro_sumillas
        }
      } catch (error) {
        
      }
    },

    getNivelLogroRasgo (curriculoRasgoId, objetivoId) {
      let e = this.nivelLogroRasgos.find(n => n.id_curriculo_rasgo == curriculoRasgoId && n.id_objetivo_especifico == objetivoId)

      if (!e) return 0

      return e.puntaje
    },

    getNivelLogroSumilla (asignaturaContenidoId, objetivoId) {
      let e = this.nivelLogroSumillas.find(n => n.id_asignatura_contenido == asignaturaContenidoId && n.id_objetivo_especifico == objetivoId)

      if (!e) return 0

      return e.puntaje
    },

    evaluarRasgo (curriculoRasgoId, objetivoId) {
      this.$prompt('Ingrese el puntaje', 'SIGEDO', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(async ({ value }) => {
        if (value < 0 || value > 3) {
          return
        }
        
        let e = this.nivelLogroRasgos.find(n => n.id_curriculo_rasgo == curriculoRasgoId && n.id_objetivo_especifico == objetivoId)
  
        let nivelLogroRasgo
  
        if (e) {
          nivelLogroRasgo = NivelLogroRasgo.fromJson(e)
        } else {
          nivelLogroRasgo = new NivelLogroRasgo()
          nivelLogroRasgo.id_curriculo_rasgo = curriculoRasgoId
          nivelLogroRasgo.id_objetivo_especifico = objetivoId
          nivelLogroRasgo.asignatura_id = this.asignaturaId
        }

        nivelLogroRasgo.puntaje = value

        try {
          const { status, data } = await this.$api.post(`2/nivel-logro/store-nivel-logro-rasgo`, nivelLogroRasgo)

          if (status === 200) {
            this.loadData()
          }
        } catch (error) {
          
        }
  
      }).catch(() => {
        
      })
    },

    evaluarSumilla (asignaturaContenidoId, objetivoId) {
      this.$prompt('Ingrese el puntaje', 'SIGEDO', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }).then(async ({ value }) => {
        if (value < 0 || value > 3) {
          return
        }
        
        let e = this.nivelLogroSumillas.find(n => n.id_asignatura_contenido == asignaturaContenidoId && n.id_objetivo_especifico == objetivoId)
  
        let nivelLogroSumilla
  
        if (e) {
          nivelLogroSumilla = NivelLogroSumilla.fromJson(e)
        } else {
          nivelLogroSumilla = new NivelLogroSumilla()
          nivelLogroSumilla.id_asignatura_contenido = asignaturaContenidoId
          nivelLogroSumilla.id_objetivo_especifico = objetivoId
          nivelLogroSumilla.asignatura_id = this.asignaturaId
        }

        nivelLogroSumilla.puntaje = value

        try {
          const { status, data } = await this.$api.post(`2/nivel-logro/store-nivel-logro-sumilla`, nivelLogroSumilla)

          if (status === 200) {
            this.loadData()
          }
        } catch (error) {
          
        }
  
      }).catch(() => {
        
      })
    },

    async print () {
      try {
        const { status, data } = await this.$api.get(`2/nivel-logro/report-nivel-logro/${this.asignaturaId}/${ this.escuelaId }/${ this.planId }/${this.idPeriodo__}/${this.idSemestre__}`)

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (err) {
        console.log(err)
      }
    },

    close () {
      this.$emit('close')
    },
  }
}
</script>

<style lang="scss" scoped>
.Horario {
  margin    : 10px;
  max-height: 550px;
  overflow-x: auto;
  overflow-y: auto;
    &--Table {
      thead {
        tr {
          th {
            padding   : 5px;
            height    : 30px;
            min-width : 110px;
            text-align: center;
            border    : 1px solid black;
            font-size : 0.7em;
            background: rgb(30,72,132);
            color     : #fff;

            &.contenido {
              background: teal;
            }

            &.rasgo {
              background: brown;
            }
          }
        }
      }

      tbody {
        tr {
          td {
            padding   : 5px;
            height    : 40px;
            min-width : 110px;
            text-align: center;
            border    : 1px solid black;
            font-size : 0.7em;

            button {
              margin    : 0;
              width     : 100%;
              height    : 100%;
              background: none;
            }
          }
        }
      }
    }
}
</style>
