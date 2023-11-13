<template>
    <div class="ed-container init">
        <h2 class="ed-item sep-10 gr-center">
            <strong>
                REPORTE RESIDENCIAS
            </strong>
        </h2>

        <div class="ed-item ed-container">
            <div class="ed-item sep-5 l-30 to-center form-group">
                <label>SEDES</label>
                <select v-model="id_filial" class="form-control">
                    <option value="0">SELECCIONAR</option>
                    <option v-for="(filial, index) in arrFiliales" :key="index" :value="filial.id_filial">
                        {{filial.nombre_filial}}
                    </option>
                </select>
            </div>

            <div class="ed-item sep-5 l-30 to-center form-group">
                <label>MODALIDAD</label>
                <select v-model="id_modalidad" class="form-control">
                    <option value="0">TODOS</option>
                    <option value="1">PRESENCIAL</option>
                    <option value="2">SEMIPRESENCIAL</option>
                </select>
            </div>

            <div class="ed-item sep-5 l-30 to-center form-group">
                <label>FACULTAD</label>
                <select v-model="id_facultad" class="form-control">
                    <option value="0">TODOS</option>
                    <option v-for="(facultad, index) in arrFacultades" :key="index" :value="facultad.id_facultad">
                        {{facultad.nombre}}
                    </option>
                </select>
            </div>

            <div v-if="arrEscuelas" class="ed-item sep-5 l-30 to-center form-group">
                <label>ESCUELAS</label>
                <select v-model="id_escuela" class="form-control">
                    <option value="0">TODOS</option>
                    <option v-for="(escuela, index) in arrEscuelas" :key="index" :value="escuela.id_escuela">
                        {{escuela.nombre}}
                    </option>
                </select>
            </div>

            <div v-if="ready" class="ed-item txt-center">
                <button @click="getDataReporte" class="btn btn-info btn-rounded">Actualizar</button>
            </div>
        </div>

        <div v-if="arrData" class="ed-item txt-center">
            <a v-if="entorno" target="_blank" :href="`${URLPDF}api/src/reportes/docentes/reporte_segunda_especialidad.php?ae_bcd=${token}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_filial=${id_filial}&id_modalidad=${id_modalidad}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&id_usuario=${this.identity.id_usuario}`" class="btn btn-dark btn-rounded">Imprimir PDF</a>
            <button @click="exportToExcel" class="btn btn-dark btn-rounded">
                Exportar a Excel
            </button>
        </div>

        <div v-if="arrData" class="ed-item sep-10 table-content mh">
            <table id="table" class="table table-responsive table-striped table-bordered table-hover table-own">
                <thead class="table-head">
                    <tr>
                        <th>DNI</th>
                        <th>Docente</th>
                        <th>2da Especialidad</th>
                    </tr>
                </thead>
                <tbody class="table-body">
                    <tr v-for="(data, index) in arrData" :key="index">
                        <td>{{ data.id_docente }}</td>
                        <td style="text-align: left">{{ data.docente }}</td>
                        <td style="text-align: left">{{ data.nombre_titulo }}</td>
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

import alertify from 'alertifyjs'

import GxDate from '../../helpers/date'

import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import XLSX from 'xlsx'

/**
 * Models
 */
import GxFacultad from '../../models/gx_facultad'
import GxTitulo from '../../models/gx_titulo'
import GxEscuela from '../../models/gx_escuela'
import GxFilial from '../../models/gx_filial'
import GxOtrosEstudios from '../../models/gx_otros_estudios.js';

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

            arrFiliales: null,
            id_filial: 0,

            id_modalidad: 0,

            arrFacultades: null,
            id_facultad: 0,

            arrEscuelas: null,
            id_escuela: 0,

            arrData: null,

            arrBachiller: [],
            id_titulo: 0
        }
    },

    computed: {
        ready: function() {
            return this.id_filial != 0
        }
    },

    watch: {
        id_filial: function() {
            this.arrData = null
        },

        id_modalidad: function() {
            this.arrData = null
        },


        id_facultad: function() {
            this.arrData = null
            this.id_escuela = 0
            this.getEscuelas()
        },

        id_escuela: function() {
            this.arrData = null
        }
    },

    methods: {
        init() {
            this.getFacultades()
            this.getFilialesUser()
        },

        getFilialesUser: async function() {
            const gxFilial = new GxFilial(this.URL)

            const res = await gxFilial.getByUser(this.identity.id_usuario, this.autho)

            if(res.success) {
                this.arrFiliales = res.data
            } else {
                this.arrFiliales = null
            }
        },

        /**
         * Obtiene todas las facultades
         */
        getFacultades: async function() {
            const gxFacultad = new GxFacultad(this.URL)

            const res = await gxFacultad.getAll(this.autho)

            if(res.success) {
                this.arrFacultades = res.data
            } else {

            }
        },

        /**
         * Obtiene las escuelas segun la facultad seleccionada
         */
        getEscuelas: async function() {
            const gxEscuela = new GxEscuela(this.URL)
            gxEscuela.id_facultad = this.id_facultad
            
            const res = await gxEscuela.getByFacultad(this.autho)

            if(res.success) {
                this.arrEscuelas = res.data
            } else {
                this.arrEscuelas = null
            }
        },

        getDataReporte: async function() {
            this.ajaxLoad = true

            let gxOtrosEstudios = new GxOtrosEstudios(this.URL)

            let id_periodo = this.periodo.id_periodo,
                id_semestre = this.periodo.id_semestre,
                id_filial = this.id_filial,
                id_modalidad = this.id_modalidad,
                id_facultad = this.id_facultad,
                id_escuela = this.id_escuela


            const res = await gxOtrosEstudios.reportes(this.autho, id_periodo, id_semestre, id_filial, id_modalidad, id_facultad, id_escuela, 1)

            if(res.success) {
                this.arrData = res.data
            } else {
                this.arrData = null
                this.swAlert(`No existen coincidencias`, 'warning')
            }

            this.ajaxLoad = false
        },

        exportToExcel: function() {
            const table = document.getElementById('table');
            
            let wb = XLSX.utils.table_to_book(table, { raw: true});
            XLSX.writeFile(wb, 'reporte residencia.xlsx');
        },
    },
}
</script>

<style lang="scss" scoped>

</style>

