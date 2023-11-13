<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      REGISTRO DE FELICITACIONES Y RECLAMOS
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
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>DNI</label>
      <el-input
        placeholder="DNI"
        v-model="gxFelicitacionesReclamos.id_docente"
        type="number"
        @keyup.enter="getDocente()"
        size="mini">
      </el-input>
    </div>

    <div class="ed-item sep-5 m-70 to-center form-group">
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
      <input type="number" v-model="gxFelicitacionesReclamos.id_docente" class="form-control" @keyup.enter="getDocente()">
    </div>

    <div class="ed-item sep-5 m-60 to-center form-group">
      <label>NOMBRES</label>
      <input type="text" class="form-control" v-model="nombre" disabled>
    </div> -->
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>CODIGO</label>
      <el-input
        placeholder="Codigo Alumno"
        v-model="gxFelicitacionesReclamos.ccodalumno"
        size="mini"
        >
      </el-input>
    </div>
    <div class="ed-item sep-5 m-70 to-center form-group">
      <label>ALUMNO</label>
      <el-input
        placeholder="Nombres Alumno"
        v-model="gxFelicitacionesReclamos.calumno"
        size="mini"
        >
      </el-input>
    </div>    
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>TIPO </label>
      <select v-model="tipoEstudio" class="form-control" size="small">
        <option v-for="(tipo, index) in arrTiposEstudio" :key="index" :value="tipo">
          {{tipo.cnombre}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-5 m-70 to-center form-group">
      <label>DESCRIPCION</label>
      <el-input
        placeholder="Descripcion"
        v-model="gxFelicitacionesReclamos.cdescripcion"
        size="mini"
        >
      </el-input>
    </div> 

    <!-- <div class="ed-item sep-5 m-40 to-center form-group">
      <label>CODIGO</label>
      <input type="text" v-model="gxFelicitacionesReclamos.ccodalumno" class="form-control">
    </div>

    <div class="ed-item sep-5 m-40 to-center form-group">
      <label>ALUMNO</label>
      <input type="text" v-model="gxFelicitacionesReclamos.calumno" class="form-control">
    </div> -->
<!-- 
    <div class="ed-item sep-5 m-40 to-center form-group">
      <label>DESCRIPCION</label>
      <input type="text" v-model="gxFelicitacionesReclamos.cdescripcion" class="form-control">
    </div> -->

    <div v-if="ready" class="ed-item gr-center">
      <el-button type="primary" round icon="el-icon-check" size="small" v-if="isEdit" @click="editFelicitacionesReclamos">GUARDAR</el-button>
      <el-button type="primary" round icon="el-icon-plus" size="small" v-else @click="insertfelicitacionReclamos">AGREGAR</el-button>
      <!-- <button v-if="isEdit" @click="editFelicitacionesReclamos" class="btn btn-info btn-rounded">
        EDITAR
      </button>
      <button v-else @click="insertfelicitacionReclamos" class="btn btn-info btn-rounded">
        AGREGAR
      </button> -->
    </div>
  </div>

  <div v-if="arrFelicitacionesReclamos && arrFelicitacionesReclamos.every(es => es.idreg != null)" class="ed-item sep-10 table-content mh">
    <el-table border stripe fit :data="arrFelicitacionesReclamos" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando Publicaciones...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Docente" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="ctipo" label="Tipo" min-width="60" align="center" header-align="center"></el-table-column>
        <el-table-column prop="ccodalumno" label="Codigo Alumno" min-width="70" align="center" header-align="center"></el-table-column>
        <el-table-column prop="calumno" label="Alumno" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="cdescripcion" label="Descripcion" min-width="170" align="center" header-align="center"></el-table-column>        
        <el-table-column label="*" min-width="30" align="center" header-align="center">
          <template slot-scope="reg">
            <el-tooltip content="Editar" placement="left">
              <i @click="editfelic(reg.row)" class="fas fa-edit pointer action"></i>
            </el-tooltip>
          </template>
        </el-table-column>
    </el-table>

    <!-- <table class="table table-responsive table-striped table-bordered table-hover table-own">
      <thead class="table-head">
        <tr>
          <th>Docente</th>
          <th>Tipo</th>
          <th>Codigo Alumno</th>
          <th>Alumno</th>
          <th>Descripcion</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(estudio, index) in arrFelicitacionesReclamos" :key="index">
          <template v-if="estudio.idreg">
            <td class="w-10">{{ estudio.nombre }}</td>
            <td>{{ estudio.ctipo }}</td>
            <td class="w-30">{{ estudio.ccodalumno }}</td>
            <td class="w-30">{{estudio.calumno}}</td>
            <td class="w-30">{{estudio.cdescripcion}}</td>
            <td class="w-10">
              <button @click="editfelic(estudio)" class="btn btn-xs btn-dark btn-rounded">Editar</button>
            </td>
          </template>
        </tr>
      </tbody>
    </table> -->
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
import GxFelicitacionesReclamos from '../../models/gx_felicitaciones_reclamos'
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

            gxFelicitacionesReclamos: new GxFelicitacionesReclamos(),

            arrTiposEstudio: null,
            tipoEstudio: {},


            dni: '',
            nombre: '',

            arrFelicitacionesReclamos: null,

            isEdit: false,

            modal_docente: false
        }
    },

    computed: {
        ready: function() {
            return (
                this.nombre != '' &&
                this.gxFelicitacionesReclamos.id_docente != '' &&
                this.gxFelicitacionesReclamos.id_docente.length == 8 &&
                this.gxFelicitacionesReclamos.ctipo != '' &&
                this.gxFelicitacionesReclamos.cdescripcion != '' &&
                this.gxFelicitacionesReclamos.ccodalumno != '' &&
                this.gxFelicitacionesReclamos.calumno != '' &&
                this.gxFelicitacionesReclamos.idvar != '' &&
                this.tipoEstudio.idvar != 0
            )
        }
    },

    watch: {
          tipoEstudio: function(n) {
              if(n.idvar == 0) return

              this.gxFelicitacionesReclamos.idtipo = n.idvar
              this.gxFelicitacionesReclamos.ctipo = n.cnombre
          },
        'gxFelicitacionesReclamos.ccodalumno':function(n){
          this.gxFelicitacionesReclamos.ccodalumno =n.toUpperCase()
        },

        'gxFelicitacionesReclamos.calumno': function(n) {
            this.gxFelicitacionesReclamos.calumno = n.toUpperCase()
        },
        'gxFelicitacionesReclamos.cdescripcion':function(n){
          this.gxFelicitacionesReclamos.cdescripcion = n.toUpperCase()
        },

    },

    methods: {
        init() {
            this.getTiposEstudos()
            this.gxFelicitacionesReclamos.ccodusua = this.identity.id_usuario
            this.gxFelicitacionesReclamos.id_periodo = this.periodo.id_periodo
            this.gxFelicitacionesReclamos.id_semestre = this.periodo.id_semestre
        },
        /**
         * Obtiene los tipos de estudios
         */
        getTiposEstudos: async function() {
            const gxVariables = new GxVariables(this.URL)
            gxVariables.ctipo = 4

            const res = await gxVariables.getVariables(this.autho)

            if(res.success) {
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

        getDocente: async function (id_docente) {

            if(this.gxFelicitacionesReclamos.id_docente.length != 8) return

            this.ajaxLoad = true

            this.gxFelicitacionesReclamos.url = this.URL
            const res = await this.gxFelicitacionesReclamos.getByDocente(this.autho)

            if(res.success) {
                const data = res.data
                this.nombre = data[0].nombre
                this.arrFelicitacionesReclamos = data
            } else {
                this.swAlert(`No existen coincidencias al dni ingresado`, 'error')
                this.reNew()
            }

            this.ajaxLoad = false
        },

        /**
         * Inserta
         * nuevo
         */
        insertfelicitacionReclamos: async function() {
            this.gxFelicitacionesReclamos.url = this.URL
            const res = await this.gxFelicitacionesReclamos.create(this.autho)

            let id = this.gxFelicitacionesReclamos.id_docente


            if(res.success) {
                this.getDocente()
                this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == 0)
                this.gxFelicitacionesReclamos = new GxFelicitacionesReclamos()
                this.gxFelicitacionesReclamos.id_docente = id
            } else {
            }
        },

        /**
         * Inserta
         * nuevo
         */
        editFelicitacionesReclamos: async function() {
            this.gxFelicitacionesReclamos.url = this.URL

            const res = await this.gxFelicitacionesReclamos.update(this.autho)

            let id = this.gxFelicitacionesReclamos.id_docente

            if(res.success) {
                this.getDocente()
                this.gxFelicitacionesReclamos = new GxFelicitacionesReclamos()
                this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == 0)
                this.gxFelicitacionesReclamos.id_docente = id
            } else {
                this.gxFelicitacionesReclamos = new GxFelicitacionesReclamos()
                this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == 0)
                this.gxFelicitacionesReclamos.id_docente = id
            }
            this.isEdit=false
        },

        reNew: function() {
            this.gxFelicitacionesReclamos = new GxFelicitacionesReclamos()
            this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.idvar == 0)
            this.arrFelicitacionesReclamos = null
            this.nombre = ''
            this.isEdit = false
        },

        editfelic: function(otro) {
            this.isEdit = true

            this.gxFelicitacionesReclamos = new GxFelicitacionesReclamos(this.URL, otro.idreg,otro.id_docente, otro.id_periodo, otro.id_semestre, otro.idtipo, otro.ctipo, otro.cdescripcion, otro.ccodalumno,otro.calumno,otro.fhreg,otro.ccodusua)


            this.gxFelicitacionesReclamos.ccodusua = this.identity.id_usuario
            this.tipoEstudio = this.arrTiposEstudio.find(tipo => tipo.cnombre == otro.ctipo)
        },

        closeBuscarDocente: function() {
            this.modal_docente = false
        },

        selDocenteBusqueda: function(id_docente) {
            this.gxFelicitacionesReclamos.id_docente = id_docente
            this.getDocente()
            this.closeBuscarDocente()
        },

    },
}
</script>

<style lang="scss" scoped>

</style>
