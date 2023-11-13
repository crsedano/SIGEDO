<template>
  <div class="ed-container init">
    <div  v-for="(pregunta, key) in preguntas" :key="key" class="ed-item sep-5">
      <el-card>
        <div slot="header">
          <strong>{{ pregunta.componente }}</strong>
        </div>
        
        <el-card shadow="hover" v-for="(indicador, key) in pregunta.indicadores" :key="key">
          <div style="font-size: 0.8em" slot="header">
            <strong>{{ indicador.id }}. {{ indicador.indicador }}</strong>
          </div>
          
          <div>
            <el-radio-group v-model="indicador.punto_id" size="small">
              <el-radio :label="1" border>NO TIENE EL COMPONENTE</el-radio>
              <el-radio :label="2" border>EL COMPONENTE PRESENTA DEFICIENCIAS</el-radio>
              <el-radio :label="3" border>EL COMPONENTE ES   ADECUADO</el-radio>
            </el-radio-group>
          </div>
        </el-card>
        
      </el-card>
    </div>

    <div class="ed-item txt-center">
      <el-button size="mini" type="primary" @click="saveRespuesta">REGISTRAR</el-button>      
    </div>
    
  </div>
</template>

<script>

import Init from '../../../mixing/mixing_init'

export default {
  mixins: [ Init ],

  mounted () {
    this.loadPreguntas()
  },

  data () {
    return {
      preguntas: []
    }
  },

  computed: {
    respuestas () {
      let array = []

      if (!this.preguntas) return array

      this.preguntas.forEach(p => {
        array = [...array, ...p.indicadores]
      })

      return array
    }
  },

  methods: {
    async loadPreguntas () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status, data } = await this.axios.get(`${ this.URL_ }2/estructura-curriculo/encuesta`)

        if ( status === 200 ) {
          this.preguntas = data.encuesta.map(e => {
            e.indicadores.forEach(ee => {
                this.$set(ee, 'escuela_id', 16)
                this.$set(ee, 'plan_id', 2)
                this.$set(ee, 'indicador_id', ee.id)
                this.$set(ee, 'punto_id', 1)
                this.$set(ee, 'periodo', this.idPeriodo__)
                this.$set(ee, 'semestre', this.idSemestre__)
              // return {
              //   indicador:
              // }
            })
            return e
          })
        }
      } catch (error) {
        this.$hlp.errors(error)
      }
      loading.close()
    },

    async saveRespuesta () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { status, data } = await this.axios.post(`${ this.URL_ }2/estructura-curriculo/save-respuesta`, {respuestas: this.respuestas})

        if ( status === 200 ) {
          this.$emit('close')
        }
      } catch (error) {
        this.$hlp.errors(error)
      }
      loading.close()
    }
  }
}
</script>