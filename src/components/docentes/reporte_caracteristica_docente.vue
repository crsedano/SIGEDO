<template>
<div class="ed-container init no-imp">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      REPORTE DOCENTE CICLO
    </strong>
  </h2>

  <div class="ed-item m-80 l-60 to-center sep-40 ed-container">
    <div class="ed-item sep-10 m-50 form-group">
      <label>SEDES</label>
      <select v-model="id_filial" class="form-control">
        <option value="0">SELECCIONAR</option>
        <option v-for="(filial, index) in arrFiliales" :key="index" :value="filial.id_filial">
          {{filial.nombre_filial}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-10 m-50 form-group">
      <label>Facultad</label>
      <select v-model="id_facultad" class="form-control">
        <option value="0">TODOS</option>
        <option v-for="(facultad, index) in facultades" :key="index" :value="facultad.id_facultad">
          {{facultad.nombre}}
        </option>
      </select>
    </div>
    <div v-if="id_facultad != 0" class="ed-item sep-10 m-50 form-group">
      <label>Escuela</label>
      <select v-model="id_escuela" class="form-control">
        <option value="0">TODOS</option>
        <option v-for="(escuela, index) in escuelas" :key="index" :value="escuela.id_escuela">
          {{escuela.nombre}}
        </option>
      </select>
    </div>

    <div class="ed-item sep-10 m-50 form-group">
      <label>Ciclo</label>
      <select v-model="id_ciclo" class="form-control">
        <option value="0">TODOS</option>
        <option v-for="(ciclo, index) in ciclo" :key="index" :value="ciclo.cvalor">
          {{ciclo.cnombre}}
        </option>
      </select>
    </div>
  </div>

  <div class="ed-item m-60 to-center ed-container">
    <div class="ed-item m-50 to-center gr-center">
      <el-button v-if="id_filial != 0" @click="getData" type="primary">Actualizar</el-button>
    </div>
    <div v-if="dataGeneral != null" class="ed-item m-50 to-center gr-center">
      <a v-if="entorno !=null" target="_blank" :href="`${URLPDF}api/src/reportes/docentes/reporte_caracter_docente.php?ae_bcd=${token}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&id_ciclo=${id_ciclo}&id_filial=${id_filial}&id_usuario=${this.identity.id_usuario}`"
        class="el-button el-button--info">Imprimir PDF</a>
      <el-button @click="exportToExcel" type="info">Exportar a Excel</el-button>
    </div>
  </div>

  <div class="ed-item sep-10">
    <el-table id="table" border stripe fit :data="dataGeneral" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Docente...">
      <el-table-column type="index" min-width="50" fixed="" align="left" header-align="center"></el-table-column>
      <el-table-column prop="docente" label="Docente" min-width="150" align="left" header-align="center"></el-table-column>
      <el-table-column prop="dedicacion" label="Dedicación" min-width="150" align="left" header-align="center"></el-table-column>
      <el-table-column prop="condicion" label="Condición" min-width="150" align="left" header-align="center"></el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>

import MixinInit from '../../mixing/mixing_init.js'

import GxDate from '../../helpers/date'

import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import GxFilial from '../../models/gx_filial';

import XLSX from 'xlsx'



export default {
  mixins: [
    MixinInit
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
      dataGeneral: null,

      facultades: null,
      ciclo: null,
      escuelas: null,
      arrFiliales: null,
      id_filial: 0,

      id_facultad: 0,
      id_escuela: 0,
      id_ciclo: 0,

      facultad: '',
      escuela: '',
    }
  },

  computed: {

  },

  watch: {

    id_filial: function () {
      this.dataGeneral = null
    },

    id_facultad: function () {
      this.dataGeneral = null
      this.id_escuela = 0
      this.getEscuelas()
    },

    id_escuela: function () {
      this.dataGeneral = null
    },

    id_ciclo: function () {
      this.dataGeneral = null
    },

  },

  methods: {
    init() {
      this.getFacultades()
      this.getCiclos()
      this.getFilialesUser()
    },

    getFilialesUser: async function () {
      const gxFilial = new GxFilial(this.URL)

      const res = await gxFilial.getByUser(this.identity.id_usuario, this.autho)

      if (res.success) {
        this.arrFiliales = res.data
      } else {
        this.arrFiliales = null
      }
    },

    getFacultades: function () {
      this.axios.get(`${this.URL}js-facultad`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.facultades = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    async getEscuelas() {
      try {
        const res = await this.axios.get(`${this.URL}js-escuela/${this.id_facultad}`, this.autho)

        if (res.status === 200) {
          this.escuelas = res.data.data
        }
      } catch (err) {
        this.escuelas = null
        this.$hlp.errors(err)
      }
    },

    getCiclos: function () {
      this.axios.get(`${this.URL}js-tipo-ciclo/2`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.ciclo = res.data.data
          }
        })
        .catch(err => {
          console.dir(err);
        })
    },


    getData: function () {
      this.ajaxLoad = true
      this.axios.get(`${this.URL}/js-reporte-caracteris-docent/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.id_ciclo}/${this.id_facultad}/${this.id_escuela}/${this.id_filial}`)
        .then(res => {
          if (res.data.success) {
            this.dataGeneral = res.data.data
            this.ajaxLoad = false
          } else {
            this.dataGeneral = null
            this.ajaxLoad = false
            alertify.alert('Error 20129x2131: No existen coincidencias ')
          }
        })
        .catch(err => {
          this.dataGeneral = null
          console.dir(err)
        })
    },

    abrirModal: function (modal) {
      this.modals[modal] = true
    },

    cerraModal: function (modal) {
      this.modals[modal] = false
    },

    exportToExcel: function (isFixed = true) {
      let c = isFixed ? ".el-table__fixed" : ".el-table";
      let wb = {};
      const tbl = document.getElementById("table");
      if (tbl) {
        const tb = tbl.querySelector(c);
        wb = XLSX.utils.table_to_book(tb);
        XLSX.writeFile(
          wb,
          "reporte_caracteristicas.xlsx", {
            compression: true
          }
        );
      }
    },

    tableRowClassName: function ({
      row
    }) {
      return 'creado'
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

      & tr,
      th {
        border: solid 1px black;
        text-align: center;
      }
    }
  }

  & tbody {

    & tr,
    td {
      border: solid 1px black;
      min-width: none;
      text-align: center;
    }
  }
}
</style>
