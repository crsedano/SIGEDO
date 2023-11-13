<template>
  <div class="ed-container init">
    <h1 class="txt-center ed-item">
      <strong>
        PREGUNTAS ENCUESTA ACTIVA
      </strong>
    </h1>
    <h3 class="ed-item txt-center" v-if="encuestaActive">
      Encuesta activa: "{{ encuestaActive.name }}"
    </h3>

    <div class="ed-item sep-5 m-60 l-30 to-center">
      <el-select size="mini" v-model="type">
        <el-option label="Activos" :value="0"></el-option>
        <el-option label="Todos" :value="1"></el-option>
        <el-option label="Inactivos" :value="2"></el-option>
      </el-select>
    </div>

    <div class="ed-item sep-5 txt-center">
      <el-button size="mini" type="primary" @click="loadPreguntas">Actualizar</el-button>
      <el-button size="mini" type="primary" @click="openAdminPregunta(null)">Crear Pregunta</el-button>
      <el-button size="mini" type="primary" @click="openAdminEncuesta">Administrar Encuestas</el-button>
    </div>

    <el-card class="ed-item sep-5" v-for="(pregunta, index) in preguntas" :key="index">
      <div slot="header">
        <span>
          <el-tag class="Tag" v-if="pregunta.deleted_at" type="danger" plain>INACTIVO</el-tag>
          <el-tag class="Tag" :type="pregunta.deleted_at ? 'danger' : 'primary'" plain>NÚMERO: {{ pregunta.number }}</el-tag>
          <el-tag class="Tag" :type="pregunta.deleted_at ? 'danger' : 'primary'" plain>SUBDIMENSION: {{ pregunta.subdimension.sub_dimension }}</el-tag>
        </span>
      </div>
      
      <p>{{ pregunta.pregunta }}</p>

      <div class="txt-center">
        <el-button @click="openAdminPregunta(pregunta)" size="mini" type="primary">Editar</el-button>
        <el-button v-if="pregunta.deleted_at" @click="retorePregunta(pregunta)" size="mini" type="danger">Restaurar</el-button>
        <el-button v-else @click="deletePregunta(pregunta)" size="mini" type="danger">Eliminar</el-button>
      </div>
    </el-card>

    <el-dialog
      :visible.sync="modal.adminPregunta.show"
      width="60%">
      <admin-preguntas v-if="modal.adminPregunta.show" :subdimensiones="subdimensiones" :pregunta="modal.adminPregunta.pregunta" @close="closeAdminPregunta" @update="updatePreguntas" />
    </el-dialog>

    <el-dialog
      :visible.sync="modal.adminEncuesta"
      width="60%">
      <admin-encuesta v-if="modal.adminEncuesta" :encuestas="encuestas" @close="closeAdminEncuesta" @update-encuestas="updateEncuestas" />
    </el-dialog>
    
    
  </div>
</template>

<script>
import AdminPreguntas from './AdminPreguntas.vue'
import AdminEncuesta from './AdminEncuesta.vue'
import mixing_init from '../../mixing/mixing_init'

export default {
  name: 'preguntas-encuesta',

  mixins: [mixing_init],

  components: { AdminPreguntas, AdminEncuesta },

  data () {
    return {
      preguntas     : null,
      subdimensiones: null,
      type          : 0,
      encuestas     : null,
      modal         : {
        adminPregunta: {
          show: false,
          pregunta: null
        },
        adminEncuesta: false
      }
    }
  },

  computed : {
    encuestaActive () {
      if (!this.encuestas) return null
      return this.encuestas.find(e => e.active == 1)
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      await this.loadPreguntas()
      await this.loadSubdimensiones()
      await this.loadEncuestas()
    },

    async loadPreguntas () {
      const loading = this.$loading({
        lock      : true,
        text      : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL_}v2/encuestas/preguntas/${this.type}`)

        let { status, data } = res

        if (status === 200) {
          this.preguntas = data.preguntas
        }
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    async loadSubdimensiones () {
      const loading = this.$loading({
        lock      : true,
        text      : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL_}v2/encuestas/subdimensiones`)

        let { status, data } = res

        if (status === 200) {
          this.subdimensiones = data.subdimensiones
        }
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    async deletePregunta({ id }) {
      const loading = this.$loading({
        lock      : true,
        text      : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.delete(`${this.URL_}v2/encuestas/preguntas-delete/${id}`)

        let { status, data } = res

        if (status === 200) {
          this.updatePreguntas({
            pregunta: data.pregunta,
            from: this.type == 1 ? 2 : 3
          })
        }
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    async retorePregunta({ id }) {
      const loading = this.$loading({
        lock      : true,
        text      : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.put(`${this.URL_}v2/encuestas/preguntas-restore/${id}`)

        let { status, data } = res

        if (status === 200) {
          this.updatePreguntas({
            pregunta: data.pregunta,
            from: this.type == 1 ? 2 : 3
          })
        }
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    async loadEncuestas () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL_}v2/encuestas/all`)

        let { status, data } = res

        if (status === 200) {
          this.encuestas = data.encuestas
        }
      } catch (err) {
        this.encuestas = null
        this.$hlp.errors(err)
      }

      loading.close()
    },

    openAdminPregunta (pregunta) {
      this.modal.adminPregunta.pregunta = pregunta
      this.modal.adminPregunta.show     = true
    },

    closeAdminPregunta () {
      this.modal.adminPregunta.show = false
    },

    updatePreguntas(payload) {
      let { pregunta, from } = payload

      // Añadir una pregunta
      if (from == 1) {
        this.preguntas.push(pregunta)
      }

      // Actualizar pregunta
      if (from == 2) {
        this.preguntas = this.preguntas.map(p => {
          if (p.id == pregunta.id) {
            p = pregunta
          }
          return p
        })
      }

      // Eliminar pregunta
      if (from == 3) {
        this.preguntas = this.preguntas.filter(p => p.id != pregunta.id)
      }

      const compare = ( a, b ) => {
        if ( a.number < b.number ){
          return -1;
        }
        if ( a.number > b.number ){
          return 1;
        }
        return 0;
      }

      this.preguntas.sort(compare)
    },

    openAdminEncuesta() {
      this.modal.adminEncuesta = true
    },

    closeAdminEncuesta() {
      this.modal.adminEncuesta = false
    },

    updateEncuestas (encuestas) {
      this.encuestas = [...encuestas]
    }
  }
}
</script>

<style lang="scss" scoped>
.Tag {
  margin: 0 5px;
}
</style>
