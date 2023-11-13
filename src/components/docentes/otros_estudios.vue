<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      REGISTRO DE OTROS ESTUDIOS
    </strong>
  </h2>

  <div class="ed-item gr-center">
    <el-button type="primary" round icon="el-icon-refresh" @click="reNew" size="small">
      NUEVO
    </el-button>
    <el-button type="primary" round icon="el-icon-search" @click="modal_docente = true" size="small">
      BUSCAR DOCENTE
    </el-button>
    <!-- <button @click="reNew" class="btn btn-info btn-rounded">
      NUEVO
    </button>
    <button @click="modal_docente = true" class="btn btn-info btn-rounded">
      BUSCAR DOCENTE
    </button> -->
  </div>

  <div class="ed-item ed-container">
    <div class="ed-item sep-5 m-50 to-center form-group">
      <label>DNI</label>
      <el-input
        placeholder="DNI"
        v-model="gxOtrosEstudios.id_docente"
        type="number"
        @keyup.native.enter="getDocente()"
        size="mini">
      </el-input>
      <!-- <input type="number" v-model="gxOtrosEstudios.id_docente" class="form-control" @keyup.enter="getDocente()"> -->
    </div>

    <div class="ed-item sep-5 m-50 to-center form-group">
      <label>NOMBRES</label>
      <el-input
        placeholder="Docente..."
        v-model="nombre"
        size="mini"
        disabled>
      </el-input>
      <!-- <input type="text" class="form-control" v-model="nombre" disabled> -->
    </div>

    <div class="ed-item sep-5 m-25 to-center form-group">
      <label>TIPO ESTUDIO</label>
      <select v-model="tipoEstudio" class="form-control" size="small">
        <option v-for="(tipo, index) in arrTiposEstudio" :key="index" :value="tipo">
          {{tipo.cnombre}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-5 m-25 to-center form-group">
      <label>FECHA OBTENCIÓN DE GRADO</label>
      <el-input
        v-model="gxOtrosEstudios.fgrado"
        size="mini"
        type="date"
        >
      </el-input>
      <!-- <input type="date" v-model="gxOtrosEstudios.fgrado" class="form-control"> -->
    </div>
    <div class="ed-item m-25 to-center sep-5 form-group">
      <label>PAÍS</label>
      <span v-if="entorno && entorno.modal == 'S'" @click="abrirModalPais" class="hint--top hint--bounce" aria-label="Administrar Países">
        <i class="fas fa-globe action pointer"></i>
      </span>
      <select v-model="paisSel" class="form-control" size="small">
        <option v-for="(pais, index) in paisesActivos" :key="index" :value="pais">
          {{pais.cpais}}
        </option>
      </select>
    </div>
    <div class="ed-item m-25 to-center sep-5 form-group">
      <label>UNIVERSIDAD</label>
      <span v-if="entorno && entorno.modal == 'S'" @click="abrirModalUni" class="hint--top hint--bounce" aria-label="Administrar Universidades">
        <i class="fas fa-university pointer action"></i>
      </span>
      <select v-model="universidadSel" class="form-control" size="small">
        <option v-for="(universidad, index) in arrUniversidades" :key="index" :value="universidad">
          {{universidad.cuniversidad}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-5 l-80 to-center form-group">
      <label>DENOMINACIÓN</label>
      <el-input
        placeholder="Denominación"
        v-model="gxOtrosEstudios.cdenominacion"
        size="mini"
        >
      </el-input>
      <!-- <input type="text" v-model="gxOtrosEstudios.cdenominacion" class="form-control"> -->
    </div>

    <div v-if="ready" class="ed-item gr-center">
        <el-button type="primary" round icon="el-icon-check" size="small" v-if="isEdit" @click="editOtroEstudio">
          GUARDAR
        </el-button>
        <el-button type="primary" round icon="el-icon-plus" size="small" v-else @click="insertOtroEstudio">
          AGREGAR
        </el-button>
      <!-- <button v-if="isEdit" @click="editOtroEstudio" class="btn btn-info btn-rounded">
        EDITAR
      </button>
      <button v-else @click="insertOtroEstudio" class="btn btn-info btn-rounded">
        AGREGAR
      </button> -->
    </div>
  </div>

  <div v-if="arrOtrosEstudios && arrOtrosEstudios.every(es => es.id_estudio != null)" class="ed-item sep-10 table-content mh">
    <el-table border stripe fit :data="arrOtrosEstudios" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando investigaciones...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            <el-tooltip content="Editar" placement="left">
              <i @click="editOtro(reg.row)" class="fas fa-edit pointer action"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="ctipo" label="Tipo" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="cdenominacion" label="Denominación" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="cuniversidad" label="Universidad" min-width="160" align="center" header-align="center"></el-table-column>
        <el-table-column prop="cpais" label="País" min-width="80" align="center" header-align="center"></el-table-column>
        <el-table-column label="Adjuntar" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <div v-if="reg.row.id_estudio!='' && reg.row.id_estudio!=null">
              <el-button @click="clickFile(reg.row)" icon="el-icon-picture" circle></el-button>
              <input @change="saveFotoGrado($event,reg.row.id_estudio)" v-bind:id="'imgEntradaEstudio'+reg.row.id_estudio" type="file"
                class="file-hide form-control ed-item sep-5 m-30 to-center">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Adjunto" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <a v-if="reg.row.img != '' && reg.row.img"  download="" :href="`${URLIMAGE}uploads/otros_estudios/${reg.row.img}`" target="_blank">Descargar</a>
          </template>
        </el-table-column>        
    </el-table>
    
    <!-- <table class="table table-responsive table-striped table-bordered table-hover table-own">
      <thead class="table-head">
        <tr>
          <th>Tipo</th>
          <th>Denominación</th>
          <th>Universidad</th>
          <th>País</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(estudio, index) in arrOtrosEstudios" :key="index">
          <template v-if="estudio.id_estudio">
            <td class="w-10">{{ estudio.ctipo }}</td>
            <td>{{ estudio.cdenominacion }}</td>
            <td class="w-30">{{ estudio.cuniversidad }}</td>
            <td class="w-10">{{ estudio.cpais }}</td>
            <td class="w-10">
              <button @click="editOtro(estudio)" class="btn btn-xs btn-dark btn-rounded">Editar</button>
            </td>
          </template>
        </tr>
      </tbody>
    </table> -->
  </div>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>

  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div v-if="modalPais" class="modal">
      <paises @close="cerrarModalPais" />
    </div>
  </transition>

  <transition enter-active-class="animated rotateIn" leave-active-class="animated flipOutX">
    <div v-if="modalUni" class="modal">
      <universidades @close="cerrarModalUni" />
    </div>
  </transition>

  <div v-if="modal_docente" class="modal">
    <buscar-docente @close='closeBuscarDocente' @sel="selDocenteBusqueda" />
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

import XLSX from 'xlsx'

/**
 * Models
 */
import GxOtrosEstudios from '../../models/gx_otros_estudios'
import GxVariables from '../../models/gx_variables'
import GxUniversidad from '../../models/gx_universidad.js';
import GxPais from '../../models/gx_pais.js';

/**
 * Componentes
 */
import paises from './modals/paises.vue'
import universidades from './modals/universidades.vue'
import buscarDocente from '../cargaLectiva/modals/buscarDocente.vue'

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
    paises,
    universidades,
    buscarDocente
  },

  data: function () {
    return {
      modals: {

      },

      gxOtrosEstudios: new GxOtrosEstudios(),

      arrTiposEstudio: null,
      tipoEstudio: {},

      arrUniversidades: null,

      arrPais: null,

      modalPais: false,
      modalUni: false,
      paisSel: {},
      universidadSel: {},

      dni: '',
      nombre: '',

      arrOtrosEstudios: null,

      isEdit: false,

      modal_docente: false,
      paisesActivos: null
    }
  },

  computed: {
    ready: function () {
      return (
        this.nombre != '' &&
        this.gxOtrosEstudios.id_docente != '' &&
        this.gxOtrosEstudios.id_docente.length == 8 &&
        this.gxOtrosEstudios.idvar != '' &&
        this.gxOtrosEstudios.id_universidad != '' &&
        this.gxOtrosEstudios.id_universidad &&
        this.gxOtrosEstudios.id_pais &&
        this.gxOtrosEstudios.fgrado != '' &&
        this.gxOtrosEstudios.id_pais != '' &&
        this.gxOtrosEstudios.cdenominacion != '' &&
        this.tipoEstudio.idvar != 0
      )
    }
  },

  watch: {
    tipoEstudio: function (n) {
      if (n.idvar == 0) return

      this.gxOtrosEstudios.idvar = n.idvar
      this.gxOtrosEstudios.ctipo = n.cvalor
    },

    // 'gxOtrosEstudios.cdenominacion': function (n) {
    //   this.gxOtrosEstudios.cdenominacion = n.toUpperCase()
    // },

    paisSel: function (n) {
      this.gxOtrosEstudios.cpais = n.cpais
      this.gxOtrosEstudios.id_pais = n.id_pais
    },

    universidadSel: function (n) {
      this.gxOtrosEstudios.cuniversidad = n.cuniversidad
      this.gxOtrosEstudios.id_universidad = n.idreg
    },

  },

  methods: {
    init() {
      this.getTiposEstudos()
      this.getUniversidades()
      this.getPaises()
      this.gxOtrosEstudios.ccodusua = this.identity.id_usuario
    },

    /**
     * Obtiene los tipos de estudios
     */
    getTiposEstudos: async function () {
      const gxVariables = new GxVariables(this.URL)
      gxVariables.ctipo = 1

      const res = await gxVariables.getVariables(this.autho)

      if (res.success) {
        this.arrTiposEstudio = res.data
        this.arrTiposEstudio.unshift({
          idvar: 0,
          cnombre: 'SELECCIONAR'
        })

        this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == 0)
      } else {
        this.arrTiposEstudio = null
      }
    },

    /**
     * Obtiene todas las universidad
     */
    getUniversidades: async function () {
      const gxUniversidad = new GxUniversidad(this.URL)

      const res = await gxUniversidad.getAll(this.autho)

      if (res.success) {
        this.arrUniversidades = res.data
      } else {
        this.arrUniversidades = null
      }
    },

    /**
     * Obtiene todos los paises
     */
    getPaises: async function () {
      const gxPais = new GxPais(this.URL)

      const res = await gxPais.getAll(this.autho)

      if (res.success) {
        this.arrPais = res.data
        this.filterPaisesActivos(this.arrPais)
      } else {
        this.arrPais = null
      }
    },

    filterPaisesActivos(arrPaises) {
      this.paisesActivos = arrPaises.filter(p => p.cactivo == 1)
    },

    abrirModalPais: function () {
      this.modalPais = true
    },

    cerrarModalPais: function () {
      this.modalPais = false
      this.getPaises()
    },

    abrirModalUni: function () {
      this.modalUni = true
    },

    cerrarModalUni: function () {
      this.modalUni = false
      this.getUniversidades()
    },

    getDocente: async function (id_docente) {

      if (this.gxOtrosEstudios.id_docente.length != 8) return

      this.ajaxLoad = true

      this.gxOtrosEstudios.url = this.URL
      const res = await this.gxOtrosEstudios.getByDocente(this.autho)

      if (res.success) {
        const data = res.data
        this.nombre = data[0].nombre
        this.arrOtrosEstudios = data
      } else {
        this.swAlert(`No existen coincidencias al dni ingresado`, 'error')
        this.reNew()
      }

      this.ajaxLoad = false
    },

    /**
     * Inserta un otro estudio
     * nuevo
     */
    insertOtroEstudio: async function () {
      this.gxOtrosEstudios.url = this.URL
      this.gxOtrosEstudios.ctipo = this.toNomProp(this.gxOtrosEstudios.ctipo)
      this.gxOtrosEstudios.cdenominacion = this.toNomProp(this.gxOtrosEstudios.cdenominacion)
      this.gxOtrosEstudios.cuniversidad = this.toNomProp(this.gxOtrosEstudios.cuniversidad)
      this.gxOtrosEstudios.cpais = this.toNomProp(this.gxOtrosEstudios.cpais)

      const res = await this.gxOtrosEstudios.create(this.autho)

      let id = this.gxOtrosEstudios.id_docente

      if (res.success) {
        await this.calificarDocente(this.gxOtrosEstudios.id_docente)
        this.getDocente()
        this.gxOtrosEstudios = new GxOtrosEstudios()
        this.gxOtrosEstudios.ccodusua = this.identity.id_usuario
        this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == 0)
        this.paisSel = {}
        this.universidadSel = {}
        this.gxOtrosEstudios.id_docente = id
      } else {
        this.swAlert('Error al insertar estudio', 'error')
      }
    },

    /**
     * Inserta un otro estudio
     * nuevo
     */
    editOtroEstudio: async function () {
      this.gxOtrosEstudios.url = this.URL
      this.gxOtrosEstudios.ctipo = this.toNomProp(this.gxOtrosEstudios.ctipo)
      this.gxOtrosEstudios.cdenominacion = this.toNomProp(this.gxOtrosEstudios.cdenominacion)
      this.gxOtrosEstudios.cuniversidad = this.toNomProp(this.gxOtrosEstudios.cuniversidad)
      this.gxOtrosEstudios.cpais = this.toNomProp(this.gxOtrosEstudios.cpais)

      const res = await this.gxOtrosEstudios.update(this.autho)

      let id = this.gxOtrosEstudios.id_docente

      if (res.success) {
				console.log("TCL: asdfa")
        await this.calificarDocente(this.gxOtrosEstudios.id_docente)
        this.getDocente()
        this.gxOtrosEstudios = new GxOtrosEstudios()
        this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == 0)
        this.paisSel = {}
        this.universidadSel = {}
        this.gxOtrosEstudios.ccodusua = this.identity.id_usuario
        this.gxOtrosEstudios.id_docente = id
        this.isEdit = false
      } else {
        this.gxOtrosEstudios = new GxOtrosEstudios()
        this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == 0)
        this.paisSel = {}
        this.universidadSel = {}
        this.gxOtrosEstudios.id_docente = id
        this.gxOtrosEstudios.ccodusua = this.identity.id_usuario
        this.isEdit = false
      }
    },

    reNew: function () {
      this.gxOtrosEstudios = new GxOtrosEstudios()
      this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == 0)
      this.paisSel = {}
      this.universidadSel = {}
      this.arrOtrosEstudios = null
      this.nombre = ''
      this.isEdit = false
    },

    editOtro: function (otro) {
      this.isEdit = true

      this.gxOtrosEstudios = new GxOtrosEstudios(this.URL, otro.id_estudio, otro.ctipo, otro.cdenominacion, otro.id_universidad, otro.cuniversidad, otro.id_pais, otro.cpais, otro.fgrado, otro.fhreg, otro.ccodusua, otro.idvar, otro.id_docente)

      this.gxOtrosEstudios.ccodusua = this.identity.id_usuario

      this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == otro.idvar)
      this.paisSel = this.arrPais.find(pais => pais.id_pais == otro.id_pais)
      this.universidadSel = this.arrUniversidades.find(univ => univ.idreg == otro.id_universidad)
    },

    closeBuscarDocente: function () {
      this.modal_docente = false
    },

    selDocenteBusqueda: function (id_docente) {
      this.gxOtrosEstudios.id_docente = id_docente
      this.getDocente()
      this.closeBuscarDocente()
    },
    clickFile({id_estudio}) {
      const btnFile = document.getElementById(`imgEntradaEstudio${id_estudio}`)
      btnFile.click()
    },
    async saveFotoGrado (event, id_estudio, tipo) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const file = event.target.files[0]

      if (file == undefined) {
        return
      }

      const imageType = /(.pdf)$/i

      const fileSize = file.size

      if (!file.type.match(imageType)) {
        this.swAlert(`Solo se admiten archivos de tipo PDF`,'warning')
        loading.close()
        return
      }

      if (fileSize > 5000000) {
        this.swAlert(`Archivo demasiado grande: máx 5MB`,'warning')
        loading.close()
        return
      }


      var data = new FormData();
      data.append('img', file);

      try {
        const res = await this.axios.post(`${this.URL}imagenOtroEstudio/${id_estudio}`, data, this.autho)
        
        if(res.data.success) {
          this.getDocente()
        } else {
          let message = res.data.message
          this.$notify.error({
            title: 'Precaución',
            message: message
          })
        }
        loading.close()
      } catch (err) {
        loading.close()
        this.$hlp.errors(err)
      }
      
      var reader = new FileReader();

      reader.readAsDataURL(file);
    },

  },
}
</script>

<style lang="scss">
.file-hide {
  visibility: hidden;
  width: 0;
  height: 0;
  position: absolute;
}

.labelImg {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background-color: rgb(82, 81, 160);
  display: inline-block;
  transition: all .5s;
  cursor: pointer;
  padding: 10px 15px !important;
  text-transform: uppercase;
  width: fit-content;
  text-align: center;
}

</style>
