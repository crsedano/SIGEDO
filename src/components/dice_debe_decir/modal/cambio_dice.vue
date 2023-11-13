<template>
<div class="ed-container w-modal init no-imp">
  <i @click="close" class="fas fa-window-close action red iclose"></i>

  <div class="ed-item gr-center">
    <a v-if="id_modalidad == 1 && arrDebe" class="btn btn-dark btn-rounded" target="_blank" :href="`${URLPDF}api/src/reportes/dice_debe_decir/dice_debe_decir_p.php?id_docente=${id_docente}&id_facultad=${id_facultad}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&token=${token}`">
      <i class="fas fa-file-pdf"></i>
      Imprimir
    </a>
    <a v-else-if="id_modalidad == 2 && arrDebe" class="btn btn-dark btn-rounded" target="_blank" :href="`${URLPDF}api/src/reportes/dice_debe_decir/dice_debe_decir_sp.php?id_docente=${id_docente}&id_facultad=${id_facultad}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&token=${token}`">
      <i class="fas fa-file-pdf"></i>
      Imprimir
    </a>
  </div>
  <div v-if="id_modalidad == 1" class="ed-item ed-container">
    <h4>
      <strong>Dice:</strong>
    </h4>
    <div v-if="arrDice" class="ed-item table-content">
      <table class="main-table ">
        <thead class="table-head">
          <tr class="headers">
            <th>TITULO PROFESIONAL</th>
            <th>DOCENTE</th>
            <th>CARRERA PROFESIONAL</th>
            <th>PLAN</th>
            <th>ASIGNATURAS</th>
            <th>CICLO</th>
            <th>N° MATRICULADOS</th>
            <th>SECCIONES</th>
            <th>HT/Grupo</th>
            <th>HP/Grupo</th>
            <th>Sub Total Horas</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(d_, index) in arrDice" :key="index">
            <td>{{d_.carrera}}</td>
            <td>{{d_.nombre}}</td>
            <td>{{d_.nombre_escuela}}</td>
            <td>{{d_.plan}}</td>
            <td>{{d_.asignatura}}</td>
            <td>{{d_.ciclo}}</td>
            <td>{{d_.numero_matriculadosf}}</td>
            <td>{{d_.secciones}}</td>

            <td>{{d_.horas_teoricas}} x {{d_.grupo_ht}}</td>
            <td>{{d_.horas_practicas}} x {{d_.grupo_hp}}</td>
            <td>{{d_.sub_tot_lectivas}}</td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else class="ed-item ed-container">
    <h4>
      <strong>Dice:</strong>
    </h4>
    <div v-if="arrDice" class="ed-item table-content">
      <table class="main-table ">
        <thead class="table-head">
          <tr class="headers">
            <th>TITULO PROFESIONAL</th>
            <th>DOCENTE</th>
            <th>CARRERA PROFESIONAL</th>
            <th>PLAN</th>
            <th>ASIGNATURAS</th>
            <th>CICLO</th>
            <th>N° MATRICULADOS</th>
            <th>SECCIONES</th>
            <th>HT/Grupo</th>
            <th>HP/Grupo</th>
            <th>HT</th>
            <th>HP</th>
            <th>TH</th>
            <th>CRED</th>
            <th>HT-P</th>
            <th>HP-P</th>
            <th>TOT P</th>
            <th>HT-V</th>
            <th>HP-V</th>
            <th>TOT V</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(d_, index) in arrDice" :key="index">
            <td>{{d_.titulo}}</td>
            <td>{{d_.nombre}}</td>
            <td>{{d_.carrera}}</td>
            <td>{{d_.plan}}</td>
            <td>{{d_.asignatura}}</td>
            <td>{{d_.ciclo}}</td>
            <td>{{d_.numero_matriculadosf}}</td>
            <td>{{d_.secciones}}</td>
            <td>{{d_.alumnos_ht}}</td>
            <td>{{d_.alumnos_hp}}</td>
            <td>{{d_.horas_teoricas}}</td>
            <td>{{d_.horas_practicas}}</td>
            <td>{{parseInt(d_.horas_teoricas) + parseInt(d_.horas_practicas)}}</td>
            <td>{{d_.creditos}}</td>
            <td>{{d_.sp_phorasteoricas}}x{{d_.grupo_pht}}</td>
            <td>{{d_.sp_phoraspracticas}}x{{d_.grupo_php}}</td>
            <td>{{d_.sub_tot_lectivas_sp}}</td>
            <td>{{d_.sp_vhorasteoricas}}x{{d_.grupo_vht}}</td>
            <td>{{d_.sp_vhoraspracticas}}x{{d_.grupo_vhp}}</td>
            <td>{{d_.sub_tot_lectivas_sv}}</td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="id_modalidad == 1" class="ed-item ed-container">
    <h4>
      <strong>Debe Decir:</strong>
    </h4>
    <!-- v-for="(debe, idebe) in arrDebe" :key="idebe" -->
    <div v-if="arrDebe" class="ed-item sep-5 table-content">
      <table class="main-table ">
        <thead class="table-head">
          <tr class="headers">
            <th></th>
            <th>TITULO PROFESIONAL</th>
            <th>DOCENTE</th>
            <th>CARRERA PROFESIONAL</th>
            <th>PLAN</th>
            <th>ASIGNATURAS</th>
            <th>CICLO</th>
            <th>N° MATRICULADOS</th>
            <th>SECCIONES</th>
            <th>HT/Grupo</th>
            <th>HP/Grupo</th>
            <th>Sub Total Horas</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(d_, index) in arrDebe" :key="index">
            <th @click="updateDocente(d_.id_asigdoc)">
              <i class="fas fa-chalkboard-teacher action pointer"></i>
            </th>
            <td>{{d_.carrera}}</td>
            <td>{{d_.nombre}}</td>
            <td>{{d_.nombre_escuela}}</td>
            <td>{{d_.plan}}</td>
            <td>{{d_.asignatura}}</td>
            <td>{{d_.ciclo}}</td>
            <td>{{d_.numero_matriculadosf}}</td>
            <td>{{d_.secciones}}</td>

            <td>{{d_.horas_teoricas}} x {{d_.grupo_ht}}</td>
            <td>{{d_.horas_practicas}} x {{d_.grupo_hp}}</td>
            <td>{{d_.sub_tot_lectivas}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else class="ed-item ed-container">
    <h4>
      <strong>Debe Decir:</strong>
    </h4>
    <div v-if="arrDebe" class="ed-item sep-5 table-content">
      <table class="main-table ">
        <thead class="table-head">
          <tr class="headers">
            <th></th>
            <th>TITULO PROFESIONAL</th>
            <th>DOCENTE</th>
            <th>CARRERA PROFESIONAL</th>
            <th>PLAN</th>
            <th>ASIGNATURAS</th>
            <th>CICLO</th>
            <th>N° MATRICULADOS</th>
            <th>SECCIONES</th>
            <th>HT/Grupo</th>
            <th>HP/Grupo</th>
            <th>HT</th>
            <th>HP</th>
            <th>TH</th>
            <th>CRED</th>
            <th>HT-P</th>
            <th>HP-P</th>
            <th>TOT P</th>
            <th>HT-V</th>
            <th>HP-V</th>
            <th>TOT V</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(d_, index) in arrDebe" :key="index">
            <th @click="updateDocente(d_.id_asigdoc)">
              <i class="fas fa-chalkboard-teacher action pointer"></i>
            </th>
            <td>{{d_.titulo}}</td>
            <td>{{d_.nombre}}</td>
            <td>{{d_.carrera}}</td>
            <td>{{d_.plan}}</td>
            <td>{{d_.asignatura}}</td>
            <td>{{d_.ciclo}}</td>
            <td>{{d_.numero_matriculadosf}}</td>
            <td>{{d_.secciones}}</td>
            <td>{{d_.alumnos_ht}}</td>
            <td>{{d_.alumnos_hp}}</td>
            <td>{{d_.horas_teoricas}}</td>
            <td>{{d_.horas_practicas}}</td>
            <td>{{parseInt(d_.horas_teoricas) + parseInt(d_.horas_practicas)}}</td>
            <td>{{d_.creditos}}</td>
            <td>{{d_.sp_phorasteoricas}}x{{d_.grupo_pht}}</td>
            <td>{{d_.sp_phoraspracticas}}x{{d_.grupo_php}}</td>
            <td>{{d_.sub_tot_lectivas_sp}}</td>
            <td>{{d_.sp_vhorasteoricas}}x{{d_.grupo_vht}}</td>
            <td>{{d_.sp_vhoraspracticas}}x{{d_.grupo_vhp}}</td>
            <td>{{d_.sub_tot_lectivas_sv}}</td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>

  <div class="ed-item s-90 m-70 sep-10 to-center ed-container">
    <div class="ed-item sep-10 m-40 to-center ed-container">
      <div class="ed-item ed-container form-group">
        <label>Docente:</label>
        <input @input="buscarDocente(dataBuscarDocente)" v-model="dataBuscarDocente" type="text" class="form-control resaltado"
          id="docente">
      </div>
    </div>

    <div v-if="docentesBusqueda != null" class="ed-item s-95 m-70 to-center ed-container table-content" style="max-height: 300px">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <thead class="table-head">
          <tr>
            <th>Docente</th>
            <!-- <th>Horas Asignadas</th> -->
            <th></th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr @click="seleccionarDocente(docente)" v-for="(docente, index) in docentesBusqueda" :key="index">
            <td class="left">{{docente.nombre}}</td>
            <!-- <td>{{docente.total_horas}}</td> -->
            <td>
              <i v-if="docenteSelect == docente" class="fas fa-hand-pointer action pointer"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>


</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

import GxDate from '../../../helpers/date'

import loading from '../../templates/loading.vue'
import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  props: [
    'id_docente',
    'id_facultad',
    'id_modalidad'
  ],

  // Evita la entrada por url directa
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

  components: {
    loading,
    loader,
  },

  data: function () {
    return {
      modals: {

      },

      arrDice: null,
      arrDebe: [],

      dataBuscarDocente: '',
      docentesBusqueda: null,
      docenteSelect: {}
    }
  },

  computed: {

  },

  watch: {

  },

  methods: {
    init: async function () {
      this.ajaxLoad = true
      await this.getAsigDoc(this.id_docente, this.entorno.version_ingreso)

      await this.getDocDebeDecir(this.id_docente)
      this.ajaxLoad = false
    },

    /**
     * Ajax para obtener
     * carga lectiva
     */
    getAsigDoc_: function (id_facultad, id_docente, version) {
      if (this.id_modalidad == 1) {
        return this.axios.get(`${this.URL}js-dice-debe-presencial/${version}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${id_facultad}/${id_docente}`, this.autho)
      } else {
        return this.axios.get(`${this.URL}js-dice-debe-sp/${version}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${id_facultad}/${id_docente}`, this.autho)
      }
    },

    /**
     * Obtener carga lectiva de docente 
     * seleccionado
     */
    getAsigDoc: async function (id_docente, version) {
      this.ajaxLoad = true
      await this.getAsigDoc_(this.id_facultad, id_docente, version)
        .then(res => {
          if (res.data.success) {
            this.arrDice = res.data.data
          } else {
            this.arrDice = null
            swal({
              title: 'SIGEDO',
              text: `Ha ocurrido un error, no se han encontrado datos para la el docente seleccionado`,
              icon: 'error',
            })
          }
        })
        .catch(err => {
          console.dir(err)
          swal({
            title: 'SIGEDO',
            text: `Ha ocurrido un error, no se han encontrado datos para la el docente seleccionado`,
            icon: 'error',
          })
        })
      this.ajaxLoad = false
    },

    /**
     * Ajax para obtener carga de docentes
     * debe decir
     */
    getDocDebeDecir_: function (id_facultad, id_docente) {
      if (this.id_modalidad == 1) {
        return this.axios
          .get(
            `${this.URL}js-dice-debe-presencial-dice/2/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${id_facultad}/${id_docente}/0`,
            this.autho
          )
      } else {
        return this.axios
          .get(
            `${this.URL}js-dice-debe-sp-dice/2/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${id_facultad}/${id_docente}/0`,
            this.autho
          )
      }
    },

    /**
     * Obtiene los docentes debe decir
     */
    getDocDebeDecir: async function (id_docente) {
      this.ajaxLoad = true
      await this.getDocDebeDecir_(this.id_facultad, id_docente)
        .then(res => {
          if (res.data.success) {
            this.arrDebe = res.data.data
          } else {
            this.arrDebe = null
          }
        })
        .catch(err => {
          console.dir(err)
          swal({
            title: 'SIGEDO',
            text: `Ha ocurrido un error, no se han encontrado datos para la el docente seleccionado`,
            icon: 'error',
          })
        })
      this.ajaxLoad = false
    },

    /**
     * Buscar Docente
     */
    buscarDocente: async function (dataBuscarDocente, re = false) {
      if (this.dataBuscarDocente.length >= 3) {
        await this.axios.get(`${this.URL}js-docente-horas/${this.entorno.version_ingreso}/${dataBuscarDocente}`, this.autho)
          .then(res => {
            if (res.data.success) {
              this.docentesBusqueda = res.data.data

              if (re) {
                this.docenteSelect = this.docentesBusqueda.filter(d => d.id_docente == this.docenteSelect.id_docente)[0]
              } else if (this.docentesBusqueda.length == 1) {
                this.docenteSelect = this.docentesBusqueda[0]
              }

            } else {
              this.docentesBusqueda = null
            }
          })
          .catch(err => {
            console.dir(err)
          })
      } else {
        this.docentesBusqueda = null
      }

    },

    /**
     * Seleccionar docente
     * para asignar
     */
    seleccionarDocente: function (docente) {
      this.docenteSelect = docente
    },

    /**
     * Ajax para actualizar 
     * docente
     */
    updateDocente_: function (id_docente, id_asigdoc) {
      return this.axios.post(`${this.URL}js-actualizar-dice-debe/${id_docente}/${id_asigdoc}`, {}, this.autho)
    },

    /**
     * Actualizar docente en
     * nueva carga lectiva(debe decir)
     */
    updateDocente: async function (id_asigdoc) {
      this.ajaxLoad = true
      await this.updateDocente_(this.docenteSelect.id_docente, id_asigdoc)
        .then(res => {
          if (res.data.success) {
            this.updateDocenteDBD(this.id_docente)
            this.updateDocenteDBD(this.docenteSelect.id_docente)
            this.getDocDebeDecir(this.id_docente)

          } else {
            swal({
              title: 'SIGEDO',
              text: `Ha ocurrido un error, recargue la pagina e intente de nuevo por favor`,
              icon: 'error',
            })
          }
        })
        .catch(err => {
          console.dir(err)
          swal({
            title: 'SIGEDO',
            text: `Ha ocurrido un error, recargue la pagina e intente de nuevo por favor`,
            icon: 'error',
          })
        })
      this.ajaxLoad = false
    },

    /**
     * Ajax para actualizar
     * docente con modificaciones
     * en dice debe decir
     */
    updateDocenteDBD_: function (id_docente, id_modalidad) {
      return this.axios.post(`${this.URL}js-actualizar-docente-dice-debe/${id_docente}/${id_modalidad}`, {}, this.autho)
    },

    /**
     * Actualiza los campos del docente
     * con modificaciones en dice debe decir
     */
    updateDocenteDBD: async function (id_docente) {
      await this.updateDocenteDBD_(id_docente, this.id_modalidad)
        .then(res => {
          if (res.data.success) {

          } else {
            swal({
              title: 'SIGEDO',
              text: `Ha ocurrido un error, recargue la pagina e intente de nuevo por favor`,
              icon: 'error',
            })
          }
        })
        .catch(err => {
          console.dir(err)
          swal({
            title: 'SIGEDO',
            text: `Ha ocurrido un error, recargue la pagina e intente de nuevo por favor`,
            icon: 'error',
          })
        })
    },

    abrirModal: function (modal) {
      this.modals[modal] = true
    },

    cerraModal: function (modal) {
      this.modals[modal] = false
    },

    close: function () {
      this.$emit('close')
    }
  },
}
</script>

<style lang="scss" scoped>
.main-table {
    font-size: 0.65em;
    & * {
        padding: 2px;
        margin: 0;
        min-width: none !important;
    }
    & thead {
        font-weight: bold;
        & .headers {
            background: #638ec3 !important;
            color: #FFF;
            border: solid 1px black;
            & tr, th {
                border: solid 1px black;
                text-align: center;
            }
        }
    }
    & tbody {
        & tr, td {
            border: solid 1px black;
            min-width: none;
            text-align: center;
        }
    }
}
</style>

