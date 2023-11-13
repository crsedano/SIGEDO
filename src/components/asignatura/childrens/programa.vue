<template>
  <div class="ed-container init">
    <div class="ed-item gr-center">
      <h2 style="text-align: center">
        <strong>VII. PROGRAMACIÓN - MODULO FORMATIVO</strong>
      </h2>
    </div>

    <div class="ed-item sep-5 gr-center">
      <el-button size="mini" type="info" @click="modal_conocimientos = true" >Editar Conocimientos</el-button>
    </div>

    <div class="ed-item sep-10 table-content">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <thead class="table-head">
          <tr>
            <th rowspan="3">Semana</th>
            <th rowspan="3">% Avance</th>
            <th colspan="5">ÁREAS DE DOMINIO</th>
            <th rowspan="3">METAS APRENDIZAJE</th>
          </tr>
          <tr>
            <th rowspan="2">Actividades</th>
            <th>Habilidades</th>
            <th colspan="3">Conocimientos</th>
          </tr>
          <tr>
            <th>Operaciones</th>
            <th>{{ headerPrograma.title_one }}</th>
            <th>{{ headerPrograma.title_two }}</th>
            <th>{{ headerPrograma.title_three }}</th>
          </tr>
        </thead>
        <tbody class="table-body">
            <tr v-for="(p, index) in arrPrograma" :key="index">
              <template v-if="index % 2 != 0">
                <td :rowspan="p.semana == 8 ? '2' : ''" class="w-10">{{ p.semana }}</td>
                <td :rowspan="p.semana == 8 ? '2' : ''" class="w-10">{{ p.porcentaje }}%</td>
                <td>
                  <textarea  rows="8" type="text" class="form-control" v-model="p.actividades"></textarea>
                </td>
                <td>
                  <textarea  rows="8" type="text" class="form-control" v-model="p.operaciones"></textarea>
                </td>
                <td>
                  <textarea  rows="8" type="text" class="form-control" v-model="p.tecnicos1"></textarea>
                </td>
                <td>
                  <textarea  rows="8" type="text" class="form-control" v-model="p.tecnicos2"></textarea>
                </td>
                <td>
                  <textarea  rows="8" type="text" class="form-control" v-model="p.tecnicos3"></textarea>
                </td>
                <td>
                  <textarea  rows="8" type="text" class="form-control" v-model="p.metas_aprendizaje"></textarea>
                </td>
                <td class="w-10">
                  <button v-if="p.idgx_silabus_cronograma != ''" class="btn btn-xs btn-danger btn-rounded" @click="editPrograma(p)">Editar</button>
                  <button v-else class="btn btn-xs btn-dark btn-rounded" @click="savePrograma(p)">Guardar</button>
                </td>
              </template>
            </tr>
            <tr>
              <td colspan="6">EVALUACIÓN PRÁCTICA</td>
              <td></td>
            </tr>
        </tbody>
      </table>
    </div>

    <el-dialog
      @close="getHeaderPrograma"
      title="Editar Conocimientos"
      :visible.sync="modal_conocimientos"
      width="30%"
      center>
      <div class="ed-container" v-if="modal_conocimientos">
        <div class="ed-item">
          <label>Título 1</label>
          <el-input size="mini" clearable v-model="headerPrograma.title_one"></el-input>
        </div>
        <div class="ed-item">
          <label>Título 2</label>
          <el-input size="mini" clearable v-model="headerPrograma.title_two"></el-input>
        </div>
        <div class="ed-item">
          <label>Título 3</label>
          <el-input size="mini" clearable v-model="headerPrograma.title_three"></el-input>
        </div>
        <div class="ed-item gr-center" style="margin-top: 7px">
          <el-button @click="adminHeader" size="mini" type="primary">Aceptar</el-button>
        </div>
      </div>
      <!-- <span>It should be noted that the content will not be aligned in center by default</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">Confirm</el-button>
      </span> -->
    </el-dialog>

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
 * Models
 */
import GxSilabusCronogramaT from '../../../models/gx_silabus_cronograma_t'

/**
 * Componentes
 */
import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  components: {
    loader
  },

  props: ['curso_'],

  mounted() {
    this.init()
  },

  data() {
    return {
      unidadesCurso: null,
      porcentajes: null,
      arrPrograma: [],
      cronograma: null,

      programas: null,

      headerPrograma: {
        id: null,
        title_one: '',
        title_two: '',
        title_three: '',
        id_periodo: '',
        id_semestre: '',
        id_asignatura: ''
      },

      modal_conocimientos: false
    }
  },

  methods: {
    async init() {
      this.ajaxLoad = true
      await this.getPrograma(this.curso_)
      await this.getPorcentajes()
      await this.getUnidadesSilabo(this.curso_)
      await this.getHeaderPrograma()
      this.ajaxLoad = false
    },

    async getUnidadesSilabo({
      id_curso
    }) {

      try {
        const res = await this.axios.get(`${this.URL}js-unidades-silabo/${id_curso}`, this.autho)

        if (res.status === 200) {
          this.unidadesCurso = res.data.data

          this.arrPrograma = []

          this.unidadesCurso.forEach((unid, index) => {


            for (let i = 1; i <= unid.nro_semanas; i++) {
              let programa = new GxSilabusCronogramaT()
              let sem = i + (index * 4)

              programa.semana = sem / 2

              let programRegister = undefined

              if (this.programas) {
                programRegister = this.programas.find(p => p.semana == programa.semana)
              }

              if (programRegister) {
                this.arrPrograma.push(programRegister)
              } else {
                programa.id_asignatura = this.curso_.id_curso
                programa.id_usuario_insert = this.identity.id_usuario
                programa.id_docente = this.identity.dni
                programa.id_periodo = this.periodo.id_periodo
                programa.id_semestre = this.periodo.id_semestre
                programa.id_modalidad = this.curso_.id_modalidad
                programa.id_filial = 2

                programa.id_silabus_unidades = unid.id_silabus_unidades

                let objPorc = this.porcentajes.filter(por => por.id_porcentaje_avanze == sem)[0]

                if (objPorc) {
                  programa.porcentaje = parseInt(objPorc.porcentaje * 100)
                  this.arrPrograma.push(programa)
                }
              }


            }

          })
        }
      } catch (err) {
        console.dir(err)
        this.unidadesCurso = null
      }
    },

    async getPorcentajes() {
      try {
        const res = await this.axios.get(`${this.URL}js-porcentaje-silabo`, this.autho)

        if (res.status === 200) {
          this.porcentajes = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.porcentajes = null
      }
    },

    async getPrograma({
      id_curso,
      id_modalidad
    }) {
      try {
        const res = await this.axios.get(`${this.URL}js-get-silabus-cronograma-t/${id_curso}/${id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)

        if (res.status === 200) {
          this.programas = res.data.data
        }

      } catch (err) {
        console.dir(err)
        this.programas = null
      }
    },

    async getHeaderPrograma () {
      let { id_periodo, id_semestre } = this.periodo
      let idAsignatura = this.curso_.curso
      try {

        const res = await this.axios.get(`${this.URL_}v2/silabosPrograma/header/${id_periodo}/${id_semestre}/${idAsignatura}`)
        if(res.status !== 200) return

        this.headerPrograma = res.data.header_programa

      } catch (err) {
        console.dir(err)
        
        this.headerPrograma = {
          id: null,
          title_one: 'Sin título',
          title_two: 'Sin título',
          title_three: 'Sin título',
          id_periodo,
          id_semestre,
          id_asignatura: idAsignatura
        }
      }
    },

    // Verifica si los titulos deben crearse o actualizarse
    async adminHeader () {
      let { id } = this.headerPrograma

      if(!id) {
        this.saveHeader ()
      } else {
        this.updateHeader ()
      }
    },

    async saveHeader () {
      try {
        const res = await this.axios.post(`${this.URL_}v2/silabosPrograma/save_header`, this.headerPrograma)
        if(res.status !== 201) return
        this.modal_conocimientos = false
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async updateHeader () {
      try {
        const res = await this.axios.put(`${this.URL_}v2/silabosPrograma/update_header/${this.headerPrograma.id}`, this.headerPrograma)
        if(res.status !== 201) return
        this.modal_conocimientos = false
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    /**
     * Almacena un registro de programa
     */
    async savePrograma(programa) {
      // programa.actividades = programa.actividades.toUpperCase()
      // programa.operaciones = programa.operaciones.toUpperCase()
      // programa.tecnicos1 = programa.tecnicos1.toUpperCase()
      // programa.tecnicos2 = programa.tecnicos2.toUpperCase()
      // programa.tecnicos3 = programa.tecnicos3.toUpperCase()
      // programa.metas_aprendizaje = programa.metas_aprendizaje.toUpperCase()
      try {
        const res = await this.axios.post(`${this.URL}js-ins-silabus-cronograma-t`, programa, this.autho)
        if (res.status === 201) {
          // programa.idgx_silabus_cronograma = res.data.info.id
          this.init()
        }
      } catch (err) {
        console.dir(err)
      }
    },

    async deletePrograma({
      idgx_silabus_cronograma
    }) {
      try {
        const res = await this.axios.delete(`${this.URL}js-delete-silabus-cronograma-t/${idgx_silabus_cronograma}`, this.autho)
        if (res.status === 201) {
          this.init()
        }
      } catch (err) {
        console.dir(err)
      }
    },

    async editPrograma(p) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.put(`${this.URL_}v2/silabosPrograma/edit/${p.idgx_silabus_cronograma}`, p)
        if(res.status !== 201) {
          loading.close()
          return
        }
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    }
  }
}
</script>

