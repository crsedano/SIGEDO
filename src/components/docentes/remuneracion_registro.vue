<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      REGISTRO REMUNERACIÓN DOCENTE
    </strong>
  </h2>

  <div class="ed-item ed-container">
    <div class="ed-item sep-5 l-30 to-center form-group">
      <label>FACULTAD</label>
      <select v-model="id_facultad" class="form-control">
        <option value="0">SELECCIONAR</option>
        <option v-for="(facultad, index) in arrFacultades" :key="index" :value="facultad.id_facultad">
          {{facultad.nombre}}
        </option>
      </select>
    </div>
  </div>

  <div v-if="arrData" class="ed-item m-80 to-center ed-container">
    <label>Buscar Docente</label>
    <input v-model="filterData" type="text" class="form-control">
  </div>

  <div v-if="arrData && docenteSeleccionado.id_docente" class="ed-item m-80 to-center ed-container sep-10">
    <div class="ed-item">
      <strong>
        Docente Seleccionado: {{ docenteSeleccionado.id_docente }} - {{ docenteSeleccionado.docente }}
      </strong>
    </div>
    <div class="ed-item m-50 to-center">
      <label>Presencial</label>
      <input v-model="docenteSeleccionado.nremuneracion_p" type="number" class="form-control">
    </div>
    <div class="ed-item m-50 to-center">
      <label>Semi Presencial</label>
      <input v-model="docenteSeleccionado.nremuneracion_sp" type="number" class="form-control">
    </div>
    <div class="ed-item gr-center sep-5">
      <button v-if="ready" @click="createEditDocente" class="btn btn-info btn-rounded">Crear / Editar</button>
    </div>
  </div>

  <div v-if="arrData" class="ed-item sep-10 table-content mh">
    <table class="table table-responsive table-striped table-bordered table-hover table-own">
      <thead class="table-head">
        <tr>
          <th></th>
          <th>DNI</th>
          <th>Docente</th>
          <th>S/. presencial</th>
          <th>S/. semi-presencial</th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(data, index) in arrFilter" :key="index">
          <td class="w-10">
            <button v-if="docenteSeleccionado.id_docente == data.id_docente" @click="docenteSeleccionado = {}" class="btn btn-xs btn-danger btn-rounded">Cancelar</button>
            <button v-else @click="goEdit(data)" class="btn btn-xs btn-dark btn-rounded">Editar</button>
          </td>
          <td class="w-10">{{ data.id_docente }}</td>
          <td style="text-align: left">{{ data.docente }}</td>
          <td class="w-10">{{ data.nremuneracion_p }}</td>
          <td class="w-10">{{ data.nremuneracion_sp }}</td>
        </tr>
      </tbody>
    </table>
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
import mixingInit from '../../mixing/mixing_init.js'

import GxDate from '../../helpers/date'

import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

/**
 * Models
 */
import GxFacultad from '../../models/gx_facultad'
import GxDocenteRemuneracion from '../../models/gx_docente_remuneracion'

export default {
  mixins: [
    mixingInit
  ],

  // beforeRouteEnter: (to, from, next) => {
  //   next(vm => {
  //     if (!vm.identity) {
  //       next('/')
  //     }
  //     if(!vm.permisos) {
  //       next('/')
  //       return
  //     } 
  //     let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
  //     if(!s) {
  //       next('/')
  //     }
  //   })
  // },

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

      arrFacultades: null,
      id_facultad: 0,

      arrData: null,
      arrFilter: null,
      filterData: '',

      docenteSeleccionado: {}
    }
  },

  computed: {
    ready: function () {
      return (
        parseFloat(this.docenteSeleccionado.nremuneracion_p) > 0 ||
        parseFloat(this.docenteSeleccionado.nremuneracion_sp) > 0
      )
    }
  },

  watch: {
    id_facultad: function (n) {
      this.getDataDocentesRemuneracion()
    },

    filterData: function (n) {
      if (n == '') return

      this.arrFilter = this.arrData
        .filter(data => data.docente.toUpperCase().includes(n.toUpperCase()) || data.id_docente.toUpperCase().includes(n.toUpperCase()))
    }
  },

  methods: {
    init: function () {
      this.getFacultades()
    },

    /**
     * Obtiene todas las facultades
     */
    getFacultades: async function () {
      const gxFacultad = new GxFacultad(this.URL)
      const res = await gxFacultad.getAll(this.autho)

      if (res.success) {
        this.arrFacultades = res.data
      } else {

      }
    },

    getDataDocentesRemuneracion: async function () {
      this.ajaxLoad = true

      let id_periodo = this.periodo.id_periodo,
        id_semestre = this.periodo.id_semestre

      const gxDocenteRemuneracion = new GxDocenteRemuneracion(this.URL)
      gxDocenteRemuneracion.id_periodo = id_periodo
      gxDocenteRemuneracion.id_semestre = id_semestre
      gxDocenteRemuneracion.id_facultad = this.id_facultad

      const res = await gxDocenteRemuneracion.getByFacultad(this.autho)

      if (res.success) {
        this.arrData = res.data
        this.arrFilter = this.arrData
      } else {
        this.arrData = null
      }

      this.ajaxLoad = false
    },

    /**
     * Colocar datos para la edicion
     */
    goEdit: function (data) {
      this.docenteSeleccionado = new GxDocenteRemuneracion(this.URL)
      this.docenteSeleccionado.id_docente = data.id_docente
      this.docenteSeleccionado.id_periodo = this.periodo.id_periodo
      this.docenteSeleccionado.id_semestre = this.periodo.id_semestre
      this.docenteSeleccionado.id_facultad = data.id_facultad
      this.docenteSeleccionado.nremuneracion_p = data.nremuneracion_p
      this.docenteSeleccionado.nremuneracion_sp = data.nremuneracion_sp
      this.$set(this.docenteSeleccionado, 'docente', data.docente)
    },

    /**
     * Editar o crear un registro
     * de remuneraciones
     */
    createEditDocente: async function () {
      this.ajaxLoad = true
      const res = await this.docenteSeleccionado.create(this.autho)

      if (res.success) {
        this.getDataDocentesRemuneracion()
        this.docenteSeleccionado = {}
      } else {
        this.swAlert(`Error al crear / editar registro, intente nuevamente por favor`, 'error')
      }

      this.ajaxLoad = false
    }

  },
}
</script>

<style lang="scss" scoped>

</style>

