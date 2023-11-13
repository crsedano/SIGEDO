<template>
<div class="ed-container init no-imp">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      CV DOCENTES
    </strong>
  </h2>

  <div class="ed-item gr-center">
    <el-button type="primary" @click="openBuscarDocente">
      Buscar Docente
    </el-button>
    
    <a v-if="allDocente" target="_blank" :href="`${URLPDF}api/src/reportes/docentes/docente_cv.php?ae_bcd=${token}&dni=${id_docente}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_usuario=${identity.id_usuario}&dedicacion=${dedicacionDocente}`"
      class="el-button info">
      Imprimir cv
    </a>
  </div>

  <div class="ed-item sep-10 m-50">
    <el-input disabled="" placeholder="Docente" v-model="id_docente"></el-input>
  </div>

  <div class="ed-item sep-10">
    <h2>
      <strong>DATOS BASICOS</strong>
    </h2>
    <el-table border stripe fit :data="allDocente" height="100" highlight-current-row :row-class-name="tableRowClassName"
      element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-text="Cargando Datos">
      <el-table-column prop="cpaterno" label="Apellido Paterno" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cmaterno" label="Apellido Materno" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cnombres" label="Nombres" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="dni" label="DNI" min-width="50" align="center" header-align="center"></el-table-column>
      <el-table-column prop="residencia" label="Lugar de Residencia" min-width="150" align="center" header-align="center"></el-table-column>
      <el-table-column prop="direccion" label="Direccion" min-width="60" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>


  <div class="ed-item sep-10">
    <h2>
      <strong>DATOS NACIMIENTO</strong>
    </h2>
    <el-table border stripe fit :data="allDocente" height="80" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxallDocente" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Datos">
      <el-table-column prop="fechanacimiento" label="Fecha Nacimiento" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="nacionalidad" label="Nacionalidad" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cdepanac" label="Departamento" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cprovnac" label="Provincia" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cdistnac" label="Distrito" min-width="90" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

  <div class="ed-item sep-10">
    <h2>
      <strong>DATOS CONTACTO</strong>
    </h2>
    <el-table border stripe fit :data="allContactoDocente" height="200" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxContactoDocente" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Datos">
      <el-table-column prop="ctipo" label="Tipo" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cvalor" label="Detalle" min-width="90" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

  <div class="ed-item sep-10">
    <h2>
      <strong>GRADO ACADEMICO</strong>
    </h2>
    <el-table border stripe fit :data="allGradoAcademico" height="200" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxGradoAcademico" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Datos">
      <el-table-column prop="ctipo" label="Grado" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="ctitulo" label="Denominacion" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cmension" label="Mencion" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cuniversidad" label="Universidad" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cpais" label="Pais" min-width="90" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

  <div class="ed-item sep-10">
    <h2>
      <strong>TITULOS</strong>
    </h2>
    <el-table border stripe fit :data="allTitulos" height="200" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxTitulos" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Datos">
      <el-table-column prop="ctitulo" label="Titulo" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cuniversidad" label="Universidad" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cpais" label="Pais" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="fgrado" label="Fecha Obtencion Grado" min-width="90" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

  <div class="ed-item sep-10">
    <h2>
      <strong>LABOR DOCENTE</strong>
    </h2>
    <el-table border stripe fit :data="allExperienciaDoc" height="200" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxExperienciaDoc" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Datos">
      <el-table-column prop="cnombreasig" label="Asignatura" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cuniversidad" label="Universidad" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="finicio" label="Fecha Inicio" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="ffin" label="Fecha Fin" min-width="90" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

  <div class="ed-item sep-10">
    <h2>
      <strong>EXPERIENCIA INVESTIGADOR</strong>
    </h2>
    <el-table border stripe fit :data="allExperienciaInvestigador" height="200" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxExperienciaInvestig" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Datos">
      <el-table-column prop="tipo" label="Tipo" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="ctitulo" label="Nombre" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="finicio" label="Fecha" min-width="90" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

  <div class="ed-item sep-10">
    <h2>
      <strong>EXPERIENCIA LABORAL</strong>
    </h2>
    <el-table border stripe fit :data="allExperienciaLab" height="200" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxExperienciaLab" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Datos">
      <el-table-column prop="crazonsocial" label="Centro Laboral" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="ccargo" label="Cargo" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="finicio" label="Fecha Inicio" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column prop="ffin" label="Fecha Fin" min-width="90" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

  

  <div v-if="modal_docente" class="modal">
    <buscar-docente @close='closeBuscarDocente' @sel="seleccionarDocenteBusqueda" />
  </div>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

import GxDate from '../../helpers/date'

import loader from '../templates/loader.vue'

import XLSX from 'xlsx'

import buscarDocente from './modals/buscarDocente.vue'

export default {
  mixins: [
    MixinInit
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

  components: {
    loader,
    buscarDocente
  },

  data: function () {
    return {
      allDocente: null,
      allContactoDocente: null,
      allGradoAcademico: null,
      allExperienciaDoc: null,
      allExperienciaInvestigador: null,
      allExperienciaLab: null,
      allTitulos: null,
      modal_docente: false,
      id_docente: '',
      nombre: '',

      ajaxLoad: false,
      ajaxContactoDocente: false,
      ajaxallDocente: false,
      ajaxGradoAcademico: false,
      ajaxExperienciaDoc: false,
      ajaxExperienciaInvestig: false,
      ajaxExperienciaLab: false,
      ajaxTitulos: false,

      dedicacionDocente: ''
    }
  },

  computed: {

  },

  watch: {

  },

  methods: {
    async getDataDocente() {
      this.ajaxallDocente = true
      try {
        const res = await this.axios.get(`${this.URL}js-docente-arr/${this.id_docente}`, this.autho)

        if (res.status === 200) {
          this.allDocente = res.data.data
          this.getContactoDocente()
          this.getGradoAcademico()
          this.getExperienciaDoc()
          this.getExperienciaInvestigador()
          this.getExperienciaLaboral()
          this.getTitulos()
          this.getDedicacion()
        }
      } catch (err) {
        this.allDocente = null
        this.$hlp.errors(err)
      }

      this.ajaxallDocente = false
    },

    async getContactoDocente() {
      this.ajaxContactoDocente = true

      try {
        const res = await this.axios.get(`${this.URL}js-contacto-docente/${this.id_docente}`, this.autho)

        if (res.status === 200) {
          this.allContactoDocente = res.data.data
        }
      } catch (err) {
        this.allContactoDocente = null
        this.$hlp.errors(err)
      }

      this.ajaxContactoDocente = false
    },

    async getGradoAcademico() {
      this.ajaxGradoAcademico = true

      try {
        const res = await this.axios.get(`${this.URL}js-grado-academico/${this.id_docente}`, this.autho)

        if (res.status === 200) {
          this.allGradoAcademico = res.data.data
        }
      } catch (err) {
        this.allGradoAcademico = null
        this.$hlp.errors(err)
      }

      this.ajaxGradoAcademico = false
    },

    async getExperienciaDoc() {
      this.ajaxExperienciaDoc = true

      try {
        const res = await this.axios.get(`${this.URL}js-experiencia-docente/${this.id_docente}`, this.autho)
        if (res.status === 200) {
          this.allExperienciaDoc = res.data.data
        }
      } catch (err) {
        this.allExperienciaDoc = null
        this.$hlp.errors(err)
      }

      this.ajaxExperienciaDoc = false
    },

    async getExperienciaInvestigador() {
      this.ajaxExperienciaInvestig = true

      try {
        const res = await this.axios.get(`${this.URL}js-investigacion-publicacion-docente/${this.id_docente}`, this.autho)
        if (res.status === 200) {
          this.allExperienciaInvestigador = res.data.data
        }
      } catch (err) {
        this.allExperienciaInvestigador = null
        this.$hlp.errors(err)
      }

      this.ajaxExperienciaInvestig = false
    },

    async getExperienciaLaboral() {
      this.ajaxExperienciaLab = true

      try {
        const res = await this.axios.get(`${this.URL}js-experiencia-laboral/${this.id_docente}`, this.autho)
        if (res.status === 200) {
          this.allExperienciaLab = res.data.data
        }
      } catch (err) {
        this.allExperienciaLab = null
        this.$hlp.errors(err)
      }

      this.ajaxExperienciaLab = false
    },

     async getTitulos() {
      this.ajaxTitulos = true

      try {
        const res = await this.axios.get(`${this.URL}js-grado-academico-titulo/${this.id_docente}`, this.autho)
        if (res.status === 200) {
          this.allTitulos = res.data.data
        }
      } catch (err) {
        this.allTitulos = null
        this.$hlp.errors(err)
      }

      this.ajaxTitulos = false
    },

    async getDedicacion () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL_}v2/cargaLectiva/byDocente/${this.id_docente}/${id_periodo}/${id_semestre}`)

        let { status, data } = res

        if(status !== 200) return

        this.dedicacionDocente = data.docente.dedicacion_upla
        
      } catch (err) {
        this.dedicacionDocente = ''
        console.dir(err)
      }
    },

    tableRowClassName({
      row
    }) {
      return 'clase'
    },

    openBuscarDocente: function () {
      this.modal_docente = true
    },

    closeBuscarDocente: function () {
      this.modal_docente = false
    },

    seleccionarDocenteBusqueda: function (id_docente) {
      this.id_docente = id_docente
      this.closeBuscarDocente()
      this.getDataDocente()
    }
  },
}
</script>


<style lang="scss" >
.el-table {
  .clase {
    cursor: pointer;
    padding: 0;
    font-size: .8em;
  }

  td,
  th {
    padding: 5px 0 !important;
    color: #000 !important;
  }
}
</style>

