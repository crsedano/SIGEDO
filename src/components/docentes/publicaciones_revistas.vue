<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      REGISTRO PUBLICACIONES REVISTAS
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
<div class="ed-item sep-5 m-20 to-center form-group">
      <label>DNI</label>
      <el-input
        placeholder="DNI"
        v-model="gxPublicacionesRevistas.id_docente"
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
    <!-- <div class="ed-item sep-5 m-40 to-center form-group">
      <label>DNI</label>
      <input type="number" v-model="gxPublicacionesRevistas.id_docente" class="form-control" @keyup.enter="getDocente()">
    </div>

    <div class="ed-item sep-5 m-60 to-center form-group">
      <label>NOMBRES</label>
      <input type="text" class="form-control" v-model="nombre" disabled>
    </div> -->
    <div class="ed-item sep-5 m-20 to-center form-group">
      <label>FECHA PUBLICACION</label>
      <el-input
        v-model="gxPublicacionesRevistas.fpublicacion"
        size="mini"
        type="date"
        >
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>REVISTA</label>
      <span @click="modal_revista = true" class="hint--top hint--bounce" aria-label="Administrar Revisats">
        <i class="fas fa-book pointer action"></i>
      </span>
      <select v-model="revista" class="form-control" size="small">
        <option v-for="(tipo, index) in arrRevistas" :key="index" :value="tipo">
          {{tipo.cnombre}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-5 m-50 to-center form-group">
      <label>TITULO INVESTIGACION</label>
      <el-input
        placeholder="Titulo..."
        v-model="gxPublicacionesRevistas.ctitulo"
        size="mini"
        >
      </el-input>
    </div>

    <div v-if="ready" class="ed-item gr-center">
      <el-button type="primary" round icon="el-icon-check" size="small" v-if="isEdit" @click="editPublicacion">GUARDAR</el-button>
      <el-button type="primary" round icon="el-icon-plus" size="small" v-else @click="insertPublicacion">AGREGAR</el-button>
    </div>
  </div>

  <div v-if="arrPublicaciones && arrPublicaciones.every(es => es.idreg != null)" class="ed-item sep-10 table-content mh">
    <el-table border stripe fit :data="arrPublicaciones" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Publicaciones...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="crevista" label="Revista" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="ctitulo" label="Titulo" min-width="160" align="center" header-align="center"></el-table-column>
        <el-table-column prop="fpublicacion" label="Publicacion" min-width="80" align="center" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="30" align="center" header-align="center">
          <template slot-scope="reg">
            <el-tooltip content="Editar" placement="left">
              <i @click="editPubli(reg.row)" class="fas fa-edit pointer action"></i>
            </el-tooltip>
          </template>
        </el-table-column>
    </el-table>
    <!-- <table class="table table-responsive table-striped table-bordered table-hover table-own">
      <thead class="table-head">
        <tr>
          <th>Revista</th>
          <th>Titulo</th>
          <th>Publicacion</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(publi, index) in arrPublicaciones" :key="index">
          <template v-if="publi.idreg">
            <td class="w-30">{{ publi.crevista }}</td>
            <td>{{ publi.ctitulo }}</td>
            <td class="w-10">{{ publi.fpublicacion }}</td>
            <td class="w-10">
              <button @click="editPubli(publi)" class="btn btn-xs btn-dark btn-rounded">Editar</button>
            </td>
          </template>
        </tr>
      </tbody>
    </table> -->
  </div>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>

  <transition enter-active-class="animated rotateIn" leave-active-class="animated flipOutX">
    <div v-if="modal_revista" class="modal">
      <revistas @close="closeModalRevista" />
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

import alertify from 'alertifyjs'

import GxDate from '../../helpers/date'

import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import XLSX from 'xlsx'

/**
 * Models
 */
import GxPublicacionesRevistas from '../../models/gx_publicaciones_revistas'
import GxVariables from '../../models/gx_variables'
import GxUniversidad from '../../models/gx_universidad.js';
import GxPais from '../../models/gx_pais.js';

/**
 * Componentes
 */
import revistas from './modals/revistas.vue'
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
        revistas,
        buscarDocente
    },

    data: function () {
        return {
            modals: {

            },

            gxPublicacionesRevistas: new GxPublicacionesRevistas(),

            arrRevistas: null,
            revista: {},

            arrUniversidades: null,

            arrPais: null,

            modalPais: false,
            modalUni: false,
            paisSel: {},
            universidadSel: {},

            dni: '',
            nombre: '',

            arrPublicaciones: null,

            isEdit: false,

            modal_docente: false,
            modal_revista: false
        }
    },

    computed: {
        ready: function() {
            return (
                this.nombre != '' &&
                this.gxPublicacionesRevistas.id_docente != '' &&
                this.gxPublicacionesRevistas.id_docente.length == 8 &&
                this.revista.idvar != 0 &&
                this.gxPublicacionesRevistas.fpublicacion != '' && 
                this.gxPublicacionesRevistas.ctitulo != ''
            )
        }
    },

    watch: {
        revista: function(n) {
            this.gxPublicacionesRevistas.id_revista = n.idvar
            this.gxPublicacionesRevistas.crevista = n.cnombre
        },

        'gxPublicacionesRevistas.ctitulo': function(n) {
            this.gxPublicacionesRevistas.ctitulo = n.toUpperCase()
        }
    },

    methods: {
        init() {
            this.getTipoRevistas()
            this.gxPublicacionesRevistas.ccodusua = this.identity.id_usuario
        },

        /**
         * Obtiene los tipos de estudios
         */
        getTipoRevistas: async function() {
            const gxVariables = new GxVariables(this.URL)
            gxVariables.ctipo = 3

            const res = await gxVariables.getVariables(this.autho)

            if(res.success) {
                this.arrRevistas = res.data
                this.arrRevistas.unshift({
                    idvar: 0,
                    cnombre: 'SELECCIONAR'
                })

                this.revista = this.arrRevistas.find(tipo => tipo.idvar == 0)
            } else {
                this.arrRevistas = null
            }
        },

        getDocente: async function () {

            if(this.gxPublicacionesRevistas.id_docente.length != 8) return

            this.ajaxLoad = true

            this.gxPublicacionesRevistas.url = this.URL
            const res = await this.gxPublicacionesRevistas.getByDocente(this.autho)

            if(res.success) {
                const data = res.data
                this.nombre = data[0].nombre
                this.arrPublicaciones = data
            } else {
                this.swAlert(`No existen coincidencias al dni ingresado`, 'error')
                this.reNew()
            }

            this.ajaxLoad = false
        },

        /**
         * Inserta nuvea publicacion
         */
        insertPublicacion: async function() {
            this.gxPublicacionesRevistas.url = this.URL
            this.gxPublicacionesRevistas.ctitulo = this.toNomProp(this.gxPublicacionesRevistas.ctitulo)
            this.gxPublicacionesRevistas.crevista = this.toNomProp(this.gxPublicacionesRevistas.crevista)
            const res = await this.gxPublicacionesRevistas.create(this.autho)

            let id = this.gxPublicacionesRevistas.id_docente

            if(res.success) {
                this.getDocente()
                this.gxPublicacionesRevistas = new GxPublicacionesRevistas()
                this.revista = this.arrRevistas.find(tipo => tipo.idvar == 0)
                this.gxPublicacionesRevistas.id_docente = id
                this.gxPublicacionesRevistas.ccodusua = this.identity.id_usuario
            } else {
                // 
            }
        },

        /**
         * Editar una publicacion
         */
        editPublicacion: async function() {
            this.gxPublicacionesRevistas.url = this.URL
            this.gxPublicacionesRevistas.ctitulo = this.toNomProp(this.gxPublicacionesRevistas.ctitulo)
            this.gxPublicacionesRevistas.crevista = this.toNomProp(this.gxPublicacionesRevistas.crevista)
            const res = await this.gxPublicacionesRevistas.update(this.autho)

            let id = this.gxPublicacionesRevistas.id_docente

            if(res.success) {
                this.getDocente()
                this.gxPublicacionesRevistas = new GxPublicacionesRevistas()
                this.revista = this.arrRevistas.find(tipo => tipo.idvar == 0)
                this.gxPublicacionesRevistas.id_docente = id
                this.gxPublicacionesRevistas.ccodusua = this.identity.id_usuario
                this.isEdit = false
            } else {
                this.gxPublicacionesRevistas = new GxPublicacionesRevistas()
                this.revista = this.arrRevistas.find(tipo => tipo.idvar == 0)
                this.gxPublicacionesRevistas.id_docente = id
                this.gxPublicacionesRevistas.ccodusua = this.identity.id_usuario
                this.isEdit = false
            }
            this.isEdit=false
        },

        reNew: function() {
            this.gxPublicacionesRevistas = new GxPublicacionesRevistas()
            this.revista = this.arrRevistas.find(tipo => tipo.idvar == 0)
            this.arrPublicaciones = null
            this.gxPublicacionesRevistas.ccodusua = this.identity.id_usuario
            this.nombre = ''
            this.isEdit = false
        },

        editPubli: function(otro) {
            this.isEdit = true

            this.gxPublicacionesRevistas = new GxPublicacionesRevistas(this.URL, otro.idreg, otro.id_docente, otro.fpublicacion, otro.id_revista, otro.crevista, otro.ctitulo, otro.ccodusua)

            this.gxPublicacionesRevistas.ccodusua = this.identity.id_usuario

            this.revista = this.arrRevistas.find(tipo => tipo.idvar == otro.id_revista)
        },

        closeBuscarDocente: function() {
            this.modal_docente = false
        },

        selDocenteBusqueda: function(id_docente) {
            this.gxPublicacionesRevistas.id_docente = id_docente
            this.getDocente()
            this.closeBuscarDocente()
        },

        closeModalRevista: function() {
            this.modal_revista = false
            this.getTipoRevistas()
        }

    },
}
</script>

<style lang="scss" scoped>

</style>
