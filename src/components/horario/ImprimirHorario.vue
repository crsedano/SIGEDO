<template>
  <div class="ed-container init">
    <div class="ed-item txt-center">
      <el-button size="mini" type="info" @click="horarioExcel">Imprimir Excel</el-button>
      <el-button size="mini" type="primary" @click="dialog.findDocente = true">Buscar Docente</el-button>
    </div>

    <div class="ed-item sep-5">
      <el-select size="mini" v-model="grupoId" placeholder="Seleccionar Grupo" filterable>
        <el-option v-for="(a, i) in grupos"
          :key="i"
          :label="a.name"
          :value="a.id">
        </el-option>
      </el-select>
    </div>

    <div v-if="docente"  class="ed-item sep-10 txt-center">
      <h1>DOCENTE: 
        <strong>{{ docente.nombre }}</strong>
      </h1>
    </div>

    <div class="ed-item" style="display: flex; justify-content: center; align-items: center;">
      <div class="Horario">
        <table class="Horario--Table" v-if="horario">
          <thead>
            <tr>
              <th>INICIO</th>
              <th>FIN</th>
              <th v-for="(dia, i) in dias" :key="`${i}d`">{{ dia.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(hora, i) in horas" :key="`${i}h`">
              <td>{{ hora.inicio }}</td>
              <td>{{ hora.fin }}</td>
              <template v-for="(dia, ii) in dias">
                <td :key="`${i}-${ii}`">
                  <el-tag
                    v-if="getCurso(dia.number, hora.number)"
                    closable
                    :disable-transitions="false"
                    @close="deleteHorario(dia.number, hora.number)"
                    effect="plain"
                  >
                    {{ getCurso(dia.number, hora.number) ? `${getCurso(dia.number, hora.number).asigdoc.curso.nombre} (${getCurso(dia.number, hora.number).asigdoc.tipo_hora})` : '' }}
                    <br>
                    {{ getCurso(dia.number, hora.number) ? `AULA: ${getCurso(dia.number, hora.number).aula.codigo}` : '' }}
                    <br>
                    {{ getCurso(dia.number, hora.number) ? `SECCIÓN: ${getCurso(dia.number, hora.number).asigdoc.seccion}` : '' }}
                  </el-tag>
                  <button v-else @click="registerHorario(dia, hora)"></button>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <el-dialog
      title="BUSCAR DOCENTE"
      :visible.sync="dialog.findDocente"
      width="30%"
    >
      <find-docente 
        v-if="dialog.findDocente" 
        @close="dialog.findDocente = false" 
        @selected:docente="selectDocente"
      />
    </el-dialog>

    <el-dialog
      title="REGISTRAR HORARIO"
      :visible.sync="dialog.horarioRegister.show"
      width="30%"
      fullscreen
    >
      <horario-register 
        v-if="dialog.horarioRegister.show" 
        :dia="dialog.horarioRegister.dia" 
        :hora="dialog.horarioRegister.hora"
        :aulas="aulas"
        :cursos="cursos"
        @close="dialog.horarioRegister.show = false"
        @update="addHorario"
      />
    </el-dialog>
    
  </div>
</template>

<script>
import FindDocente from '../docente/modal/FindDocente.vue'
import HorarioRegister from './dialog/HorarioRegister.vue'
import MixingInit from '../../mixing/mixing_init'

export default {
  components: { FindDocente, HorarioRegister },

  name: 'horario',

  mixins: [ MixingInit ],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if(!vm.permisos) {
        next('/')
        return
      } 
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if(!s) {
        next('/')
      }
    })
  },

  mounted() {
    this.init()
  },

  data() {
    return {
      dias   : [],
      horas  : [],
      horario: [],
      cursos : [],
      aulas  : [],
      docente: null,

      dialog: {
        findDocente: false,
        horarioRegister: {
          show: false,
          dia : null,
          hora: null
        }
      },

      grupos: [],
      grupoId: 1,

      dni: null
    }
  },

  watch: {
    grupoId (n) {
      this.loadHorarios()
    }
  },


  methods: {
    init () {
      this.loadGrupos()
    },

    async loadGrupos () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}2/hora-grupo`)
        console.log(res)
        let { status, data } = res

        if (status === 200) {
          this.grupos = data.hora_grupos
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async loadHorarios (dni) {
      const loading = this.$loading({
        lock      : true,
        text      : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}2/horario/per-docente/${this.idPeriodo__}/${this.idSemestre__}/${this.grupoId}/${this.dni}`)

        let { status, data } = res

        if (status === 200) {
          let { horario, cursos, dias, horas, aulas, docente } = data

          this.horario = horario
          this.cursos  = cursos
          this.dias    = dias
          this.horas   = horas
          this.aulas   = aulas
          this.docente = docente
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    getCurso (dia, hora) {
      let curso = this.horario.find(h => h.dia.number == dia && h.hora.number == hora)

      return curso
    },

    async horarioExcel () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}2/horario/export-horario/${this.idPeriodo__}/${this.idSemestre__}/${this.grupoId}/${this.dni}`)

        let { status, data } = res

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async deleteHorario(dia, hora) {
      let { id } = this.getCurso(dia, hora)
      
      const loading = this.$loading({
        lock      : true,
        text      : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.delete(`${this.URL_}2/horario/${id}`)

        let { status, data } = res

        if (status === 200) {
          let { id } = data.horario

          this.horario = this.horario.filter(h => h.id !== id)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    addHorario (horario) {
      this.horario = [...this.horario, horario]
    },

    registerHorario (dia, hora) {
      this.dialog.horarioRegister.hora = hora
      this.dialog.horarioRegister.dia = dia
      this.dialog.horarioRegister.show = true
    },

    selectDocente ({ id_docente }) {
      this.dni = id_docente
      this.loadHorarios()
    }
  }
}
</script>

<style lang="scss" scoped>
.Horario {
  margin    : 10px;
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
            color: #fff;
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