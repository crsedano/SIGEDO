<template>
  <div class="ed-container Asignaturas">
    <div class="ed-item">
      <el-button size="mini" type="danger" @click="logout">Salir</el-button>
    </div>

    <div class="ed-item sep-10">
      <el-table border stripe fit :data="asignaturas" height="350" :row-class-name="tableRowClassName">
        <el-table-column fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="asigdoc.curso.nombre" label="Asignatura" min-width="300" align="center" header-align="center"></el-table-column>
        <el-table-column prop="asigdoc.filial.nombre_filial" label="Filial" min-width="150" align="center" header-align="center"></el-table-column>
        <el-table-column prop="asigdoc.docente.nombre" label="Docente" min-width="250" align="center" header-align="center"></el-table-column>
        <el-table-column prop="asigdoc.seccion" label="Sección" min-width="80" align="center" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="120" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button size="mini" type="danger" @click="goEncuesta(reg.row)">Encuesta</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="modal.encuesta"
      :fullscreen="true">
      <encuesta v-if="modal.encuesta" :idDocente="idDocente" :idAsignatura="idAsignatura" @close="modal.encuesta = false" />
    </el-dialog>
    
  </div>
</template>

<script>
import Encuesta from './Encuesta.vue'
import mixing_init from '../../mixing/mixing_init'

export default {
  components: { Encuesta },

  name: 'alumnos-asignaturas',

  mixins: [mixing_init],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.isAlumno__) {
        next('/')
      }
      
      if (!vm.$session.exists()) {
        next('/login-alumno')
      }
    })
  },

  mounted () {
    this.getAsignaturas()
  },

  data () {
    return {
      asignaturas : null,
      idDocente   : null,
      idAsignatura: null,
      modal       : {
        encuesta: false
      }
    }
  },

  methods: {
    logout() {
      this.$router.push({
        name: 'Login Alumno'
      })
      this.$session.destroy()
      window.location.reload()
    },

    async getAsignaturas () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando asignaturas...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/encuestas/alumno-asignaturas/${this.idPeriodo__}/${this.idSemestre__}`)

        let { status, data } = res

        if (status === 200) {
          this.asignaturas = data.asignaturas
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    goEncuesta (data) {
      this.idAsignatura   = data.asigdoc.id_asigdoc
      this.idDocente      = data.asigdoc.id_docente
      this.modal.encuesta = true
    }
  }
}
</script>

<style lang="scss" scoped>
.Asignaturas {
  margin-top: 1em;
}
</style>
