<template src="./_area_formacion/area_formacion.pug" lang="pug">
</template>


<script>
/**
 * MIXING
 */
import mixingInit from '../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

import GxDate from '../../helpers/date'

import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import XLSX from 'xlsx'


export default {
  mixins: [
    mixingInit
  ],

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
      facultades: null,
      filiales: null,
      areasF: null,

      modalidad: 0,
      facultad: 0,
      filial: 0,
      areaF: 0,

      arrReport: null
    }
  },

  computed: {
    searhValid: function () {
      return (
        this.modalidad != 0 &&
        this.facultad != 0 &&
        this.filial != 0 &&
        this.areaF != 0
      )
    }
  },

  watch: {
    modalidad: function (n) {
      this.arrReport = null
    },

    facultad: function (n) {
      this.arrReport = null
    },

    filial: function (n) {
      this.arrReport = null
    },

    areaF: function (n) {
      this.arrReport = null
    },

  },

  methods: {
    init() {
      this.getFacultades()
      this.getFiliales()
      this.getAreasForm()
    },

    /**
     * Ajax para obtener facultades
     */
    getFacultades_: function () {
      return this.axios.get(`${this.URL}js-facultad`, this.autho)
    },

    /**
     * Obtiene todas las facultades 
     * y las asigna al array 'facultades'
     */
    getFacultades: async function () {
      this.ajaxLoad = true
      await this.getFacultades_()
        .then(res => {
          if (res.data.success) {
            this.facultades = res.data.data
          }
        })
        .catch(err => {
          this.$hlp.errors(err)
        })
      this.ajaxLoad = false
    },

    /**
     * Ajax para
     * obtener filiales
     */
    getFiliales_: function () {
      return this.axios.get(`${this.URL}js-filial`, this.autho)
    },

    /**
     * Obtiene todas las filiales
     */
    getFiliales: async function () {
      this.ajaxLoad = true
      await this.getFiliales_()
        .then(res => {
          if (res.data.success) {
            this.filiales = res.data.data
          }
        })
        .catch(err => {
          this.$hlp.errors(err)
        })
      this.ajaxLoad = false
    },

    /**
     * Ajax para obtener 
     * areas de formacion
     */
    getAreasForm_: function () {
      return this.axios.get(`${this.URL}js-get-area-form`, this.autho)
    },

    /**
     * Obtiene areas de formacion
     */
    getAreasForm: async function () {
      this.ajaxLoad = true

      try {

        const res = await this.getAreasForm_()

        if (res.status === 200) {
          this.areasF = res.data.data
        }

      } catch (err) {
        this.$hlp.errors(err)
      }

      this.ajaxLoad = false
    },

    /**
     * Ajax para obtener reporte
     * de area de formacion
     */
    getReport_: function (id_periodo, id_semestre, id_modalidad, version, id_filial, id_area_formacion, id_facultad) {
      return this.axios.get(`${this.URL}js-get-repor-area-form/${id_periodo}/${id_semestre}/${id_modalidad}/${version}/${id_filial}/${id_area_formacion}/${id_facultad}`, this.autho)
    },

    /**
     * Obtiene el reporte 
     * segun area de formacion
     */
    getReport: async function () {
      this.ajaxLoad = true

      try {

        const res = await this.getReport_(this.periodo.id_periodo, this.periodo.id_semestre, this.modalidad, this.entorno.version_ingreso, this.filial, this.areaF, this.facultad)

        if (res.status === 200) {
          this.arrReport = res.data.data
        }
      } catch (err) {
        this.arrReport = null
        this.$hlp.errors(err)
      }
      this.ajaxLoad = false
    },

    /**
     * Exportar datos a
     * excel
     */
    exportExcel: function () {
      const table = document.getElementById('table')

      let area = this.areasF.filter(a => a.id_area_formacion == this.areaF)[0].nombre
      let fac = this.facultades.filter(a => a.id_facultad == this.facultad)[0].nombre
      let fil = this.filiales.filter(a => a.id_filial == this.filial)[0].nombre_filial
      let moda = this.modalidad == 1 ? 'PRESENCIAL' : 'SEMI'

      var wb = XLSX.utils.table_to_book(table, {
        raw: true
      })
      XLSX.writeFile(wb, `${area}_${fac}_${fil}_${moda}.xlsx`)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>


