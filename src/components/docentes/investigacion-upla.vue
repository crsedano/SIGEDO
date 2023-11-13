<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      REGISTRO DE INVESTIGACION UPLA
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
    </button> -->
    <!-- <button @click="modal_docente = true" class="btn btn-info btn-rounded">
      BUSCAR DOCENTE
    </button> -->
  </div>

  <div class="ed-item ed-container">
    <div class="ed-item sep-5 m-20 to-center form-group">
      <label>DNI</label>
      <el-input
        placeholder="DNI"
        v-model="gxInvestigacionUpla.id_docente"
        type="number"
        @keyup.native.enter="getDocente()"
        size="mini">
      </el-input>
    </div>

    <div class="ed-item sep-5 m-80 to-center form-group">
      <label>NOMBRES</label>
      <el-input
        placeholder="Docente..."
        v-model="nombre"
        size="mini"
        disabled>
      </el-input>
    </div>

    <div class="ed-item sep-5 m-20 to-center form-group">
      <label>FECHA INICIO</label>
      <el-input
        v-model="gxInvestigacionUpla.finicio"
        size="mini"
        type="date"
        >
      </el-input>
    </div>

    <div class="ed-item sep-5 m-20 to-center form-group">
      <label>FECHA FIN</label>
      <el-input
        v-model="gxInvestigacionUpla.ffin"
        size="mini"
        type="date"
        >
      </el-input>
    </div>

    <div class="ed-item sep-5 m-60 to-center form-group">
      <label>RESOLUCION</label>
      <el-input
        placeholder="Resolución"
        v-model="gxInvestigacionUpla.cresolucion"
        size="mini"
        >
      </el-input>
    </div>

    <div class="ed-item sep-5 m-40 to-center form-group">
      <label>TITULO</label>
      <el-input
        placeholder="Título"
        v-model="gxInvestigacionUpla.ctitulo"
        size="mini"
        >
      </el-input>
    </div>

    <div v-if="ready" class="ed-item gr-center">
        <el-button type="primary" round icon="el-icon-check" size="small" v-if="isEdit" @click="editInvestigacionUpla">
          GUARDAR
        </el-button>
        <el-button type="primary" round icon="el-icon-plus" size="small" v-else @click="insertInvestigacionUpla">
          AGREGAR
        </el-button>

<!-- 
      <button v-if="isEdit" @click="editInvestigacionUpla" class="btn btn-info btn-rounded">
        EDITAR
      </button> -->
      <!-- <button v-else @click="insertInvestigacionUpla" class="btn btn-info btn-rounded">
        AGREGAR
      </button> -->
    </div>
  </div>

  <div v-if="arrInvestigacionUpla && arrInvestigacionUpla.every(es => es.idreg != null)" class="ed-item sep-10 table-content mh">
    <el-table border stripe fit :data="arrInvestigacionUpla" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando investigaciones...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Docente" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="cresolucion" label="Resolución" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="ctitulo" label="Título" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            <el-tooltip content="Editar" placement="left">
              <i @click="editInvestigacion(reg.row)" class="fas fa-edit pointer action"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Adjuntar" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <div v-if="reg.row.idreg != '' && reg.row.idreg">
              <el-button @click="clickFile(reg.row)" icon="el-icon-picture" circle></el-button>
              <input @change="saveFotoGrado($event,reg.row.idreg)" v-bind:id="'imgEntradaGrado' + reg.row.idreg" type="file"
                class="file-hide form-control ed-item sep-5 m-30 to-center">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Adjunto" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <a v-if="reg.row.img != null && reg.row.img != ''" target="_blank" download :href="`${URLIMAGE}uploads/investigacion_upla/${reg.row.img}`">Descargar</a>
          </template>
        </el-table-column>
    </el-table>
    
    <!-- <table class="table table-responsive table-striped table-bordered table-hover table-own">
      <thead class="table-head">
        <tr>
          <th>Docente</th>
          <th>Resolucion</th>
          <th>Titulo</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(estudio, index) in arrInvestigacionUpla" :key="index">
          <template v-if="estudio.idreg">
            <td class="w-10">{{ estudio.nombre }}</td>
            <td>{{ estudio.cresolucion }}</td>
            <td class="w-30">{{ estudio.ctitulo }}</td>
            <td class="w-10">
              <button @click="editInvestigacion(estudio)" class="btn btn-xs btn-dark btn-rounded">Editar</button>
            </td>
          </template>
        </tr>
      </tbody> 
    </table>-->
  </div>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>

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
import GxInvestigacionUpla from '../../models/gx_investigacion_upla'
import GxVariables from '../../models/gx_variables'

/**
 * Componentes
 */
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
    buscarDocente
  },

  data: function () {
    return {
      modals: {

      },

      gxInvestigacionUpla: new GxInvestigacionUpla(),

      arrTiposEstudio: null,
      tipoEstudio: {},

      dni: '',
      nombre: '',

      arrInvestigacionUpla: null,

      isEdit: false,

      modal_docente: false
    }
  },

  computed: {
    ready: function () {
      return (
        this.nombre != '' &&
        this.gxInvestigacionUpla.id_docente != '' &&
        this.gxInvestigacionUpla.id_docente.length == 8 &&
        this.gxInvestigacionUpla.finicio != '' &&
        this.gxInvestigacionUpla.ffin != '' &&
        this.gxInvestigacionUpla.cresolucion != '' &&
        this.gxInvestigacionUpla.ctitulo != ''
      )
    }
  },

  watch: {
    'gxInvestigacionUpla.cresolucion': function (n) {
      this.gxInvestigacionUpla.cresolucion = n.toUpperCase()
    },

    'gxInvestigacionUpla.ctitulo': function (n) {
      this.gxInvestigacionUpla.ctitulo = n.toUpperCase()
    },

  },

  methods: {
    init() {
      this.getTiposEstudos()
      this.gxInvestigacionUpla.id_usuario = this.identity.id_usuario
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
          cnombre: 'SELECCIONAR'
        })

      } else {
        this.arrTiposEstudio = null
      }
    },

    getDocente: async function (id_docente) {

      if (this.gxInvestigacionUpla.id_docente.length != 8) return

      this.ajaxLoad = true

      this.gxInvestigacionUpla.url = this.URL
      const res = await this.gxInvestigacionUpla.getByDocente(this.autho)

      if (res.success) {
        const data = res.data
        this.nombre = data[0].nombre
        this.arrInvestigacionUpla = data
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
    insertInvestigacionUpla: async function () {
      this.gxInvestigacionUpla.url = this.URL
      this.gxInvestigacionUpla.ctitulo = this.toNomProp(this.gxInvestigacionUpla.ctitulo)
      const res = await this.gxInvestigacionUpla.create(this.autho)

      let id = this.gxInvestigacionUpla.id_docente

      if (res.success) {
        this.getDocente()
        this.gxInvestigacionUpla = new GxInvestigacionUpla()
        this.gxInvestigacionUpla.id_docente = id
        this.gxInvestigacionUpla.id_usuario = this.identity.id_usuario
      } else {
      }
    },

    /**
     * Inserta una investigacion upla
     * nuevo
     */
    editInvestigacionUpla: async function () {
      this.gxInvestigacionUpla.url = this.URL
      this.gxInvestigacionUpla.ctitulo = this.toNomProp(this.gxInvestigacionUpla.ctitulo)

      const res = await this.gxInvestigacionUpla.update(this.autho)

      let id = this.gxInvestigacionUpla.id_docente

      if (res.success) {
        this.getDocente()
        this.gxInvestigacionUpla = new GxInvestigacionUpla()
        this.gxInvestigacionUpla.id_docente = id
        this.gxInvestigacionUpla.id_usuario = this.identity.id_usuario
      } else {
        this.gxInvestigacionUpla = new GxInvestigacionUpla()
        this.gxInvestigacionUpla.id_docente = id
        this.gxInvestigacionUpla.id_usuario = this.identity.id_usuario
      }
      this.isEdit=false
    },

    reNew: function () {
      this.gxInvestigacionUpla = new GxInvestigacionUpla()
      this.arrInvestigacionUpla = null
      this.gxInvestigacionUpla.id_usuario = this.identity.id_usuario
      this.nombre = ''
      this.isEdit = false
    },

    editInvestigacion: function (otro) {
      this.isEdit = true

      this.gxInvestigacionUpla = new GxInvestigacionUpla(this.URL, otro.idreg, otro.id_docente, otro.cresolucion, otro.ctitulo, otro.finicio, otro.ffin, otro.fhreg, otro.id_usuario)

      this.gxInvestigacionUpla.id_usuario = this.identity.id_usuario
    },

    closeBuscarDocente: function () {
      this.modal_docente = false
    },

    selDocenteBusqueda: function (id_docente) {
      this.gxInvestigacionUpla.id_docente = id_docente
      this.getDocente()
      this.closeBuscarDocente()
    },

    clickFile({
      idreg
    }) {
      const btnFile = document.getElementById(`imgEntradaGrado${idreg}`)
      btnFile.click()
    },

    async saveFotoGrado (event, idreg) {
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
        const res = await this.axios.post(`${this.URL}imagen_investigacion/${idreg}`, data, this.autho)
        
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

<style lang="scss" scoped>
.file-hide {
  visibility: hidden;
  width: 0;
  height: 0;
  position: absolute;
}
</style>
