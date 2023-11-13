<template>
  <el-form v-if="pregunta__" v-loading.fullscreen.lock="loading__" size="mini" label-position="top" label-width="120px">
    <el-form-item label="Subdimension">
      <el-select v-model="pregunta__.id_subdimension" placeholder="Seleccionar Subdimension">
        <el-option v-for="(sub, index) in subdimensiones"
          :key="index"
          :label="sub.sub_dimension"
          :value="sub.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Número">
      <el-input-number v-model="pregunta__.number"></el-input-number>
    </el-form-item>

    <el-form-item label="Pregunta">
      <el-input type="textarea" v-model="pregunta__.pregunta"></el-input>
    </el-form-item>

    <el-form-item label="Criterio">
      <el-select v-model="pregunta__.criterio" placeholder="Seleccionar Criterio">
        <el-option label="Criterio 1: Siempre, casi siempre, algunas veces, rara vez, nunca"
          :value="1">
        </el-option>
        <el-option label="Criterio 2: Excelente, muy bueno, bueno, deficiente, muy deficiente"
          :value="2">
        </el-option>
      </el-select>
      
    </el-form-item>

    <el-form-item class="txt-center">
      <el-button v-if="isEdit" type="primary" @click="editPreguntas">Editar</el-button>
      <el-button v-else type="primary" @click="createPreguntas">Crear</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import mixing_init from '../../mixing/mixing_init'

class Pregunta {
  constructor(id = 0, id_subdimension = '', number = '', pregunta = '', criterio = '') {
    this.id              = id
    this.id_subdimension = id_subdimension
    this.number          = number
    this.pregunta        = pregunta
    this.criterio        = criterio
  }
}

export default {
  name: 'admin-preguntas',

  mixins: [mixing_init],

  mounted () {
    this.init()
  },

  props: {
    pregunta: {
      default() {
        return null
      }
    },

    subdimensiones: {
      type: Array
    }
  },

  data () {
    return {
      pregunta__    : null,
      loading__     : false
    }
  },

  computed: {
    isEdit () {
      return this.pregunta ? true : false
    }
  },

  methods: {
    init () {
      if (!this.pregunta) {
        this.pregunta__ = new Pregunta()
      } else {
        this.pregunta__                 = new Pregunta()
        this.pregunta__.id              = this.pregunta.id
        this.pregunta__.id_subdimension = this.pregunta.id_subdimension
        this.pregunta__.number          = this.pregunta.number
        this.pregunta__.pregunta        = this.pregunta.pregunta
        this.pregunta__.criterio        = this.pregunta.criterio
      }
    },

    async editPreguntas () {
      if (this.pregunta__.id == 0) return

      this.loading__ = true

      try {
        const res = await this.axios.put(`${this.URL_}v2/encuestas/preguntas-update/${this.pregunta__.id}`, this.pregunta__)

        let { status, data } = res

        if (status === 200) {
          this.update(data.pregunta, 2)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }

      this.loading__ = false
    },

    async createPreguntas () {
      this.loading__ = true

      try {
        const res = await this.axios.post(`${this.URL_}v2/encuestas/preguntas-store`, this.pregunta__)

        let { status, data } = res

        if (status === 201) {
          this.update(data.pregunta, 1)
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }

      this.loading__ = false
    },

    close () {
      this.$emit('close')
    },

    update (pregunta, from) {
      this.$emit('update', {
        pregunta,
        from
      })
    }

  },
}
</script>

