<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      REPORTE CARGA LECTIVA CICLO
    </strong>
  </h2>
  
  <el-form size="mini" class="ed-item ed-container" label-position="top">

    <el-form-item label="Planes Estudio" class="ed-item sep-5 l-30 to-center gr-center">
      <el-select v-model="id_plan" placeholder="Plan">
        <el-option v-for="(plan, index) in arrPlanes" :key="index" :label="plan.anio" :value="plan.id_plan_estudio">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Facultad" class="ed-item sep-5 l-30 to-center gr-center">
      <el-select v-model="id_facultad" placeholder="Facultad">
        <el-option v-for="(facultad, index) in arrFacultades" :key="index" :label="facultad.nombre" :value="facultad.id_facultad">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if="arrEscuelas" label="Escuelas" class="ed-item sep-5 l-30 to-center gr-center">
      <el-select filterable v-model="id_escuela" placeholder="Escuela">
        <el-option v-for="(escuela, index) in arrEscuelas" :key="index" :label="escuela.nombre" :value="escuela.id_escuela">
        </el-option>
      </el-select>
    </el-form-item>

    <div v-if="ready" class="ed-item txt-center sep-5">
      <el-button @click="getDataReporte" type="primary" size="mini">Actualizar</el-button>
    </div>
  </el-form>

  <div v-if="arrData && ready" class="ed-item txt-center">
    <a  target="_blank" :href="`${URLPDF}api/src/reportes/asignatura/reporte_carga_elect_ciclo.php?ae_bcd=${token}&id_plan_estudio=${id_plan}&id_periodo=${this.periodo.id_periodo}&id_semestre=${this.periodo.id_semestre}&id_version=${this.entorno.version_final}&id_escuela=${id_escuela}&id_usuario=${this.identity.id_usuario}`"
      class="el-button el-button--info el-button--mini">Imprimir PDF</a>
  </div>

  <div id="table" v-if="arrData"   class="ed-item sep-10 table-content mh">
    <template v-for="(c) in arrCiclo">
      <h3 style="text-align: center" :key="c.ciclo">
        <strong>{{ c.ciclo }}</strong>
      </h3>
      <table :key="c.id" class="table table-responsive table-striped table-bordered table-hover table-own">
        <thead class="table-head">
          <tr id="ciclo" style="display: none">
            <th colspan="4">{{c.ciclo}}</th>
          </tr>
          <tr style="background: #638ec3 !important;">
            <th>Asignatura</th>
            <th>HT</th>
            <th>HP</th>
            <th>TH</th>
            <th>Creditos</th>
            <th>Teoria Docentes</th>
            <th>Practica Docentes</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(data, index) in arrData" :key="index">
            <template v-if="c.id == data.ciclo && data.idtipocurso!=2">
              <td style="text-align: left">{{ data.asignatura }}</td>
              <td class="w-10" style="text-align: center">{{ data.horas_teoricas }}</td>
              <td class="w-10" style="text-align: center">{{ data.horas_practicas }}</td>
              <td class="w-10" style="text-align: center">{{ data.TH }}</td>
              <td class="w-10" style="text-align: center">{{ data.creditos }}</td>
              <td class="w-10" style="text-align: center">{{ data.doc_teo }}</td>
              <td class="w-10" style="text-align: center">{{ data.doc_prac }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </template>
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

import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import XLSX from 'xlsx'

/**
 * Models
 */
import GxPlanEstudio from '../../models/gx_plan_estudio'

import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex'

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

      id_facultad: 0,

      id_escuela: 0,

      id_plan: 0,

      arrData: null,
      arrCiclo: null,
      arrOptativos:[]
    }
  },

  computed: {
    ready: function () {
      return (
        this.id_facultad != 0 &&
        this.id_escuela != 0 &&
        this.id_plan != 0 
      )
    },

    arrEscuelas() {
      return this.$store.getters['escuela/escuelaByFacultad'](this.id_facultad)
    },

    ...mapState({
      arrFacultades: state => state.facultad.arrFacultades,
      arrPlanes: state => state.planes_estudio.arrPlanes,
    }),
  },

  watch: {
    id_facultad: function () {
      this.arrData = null
      this.id_escuela = 0
    },

    id_escuela: function () {
      this.arrData = null
    }
  },

  methods: {
    init() {
      this.getFacultades()
      this.getPlanes()
      this.getFilialesUser()
    },

    ...mapActions({
      getFacultades: 'facultad/getFacultades',
      getPlanes: 'planes_estudio/getPlanes',
      getFilialesUser: 'filial/getFilialesByUser',
    }),

    getDataReporte: async function () {
      this.ajaxLoad = true
                      const gxPlanEstudio = new GxPlanEstudio(this.URL)
                      gxPlanEstudio.id_plan_estudio = this.id_plan

                      const res = await gxPlanEstudio.getDetalleReporteCiclo(this.autho, this.periodo.id_periodo,this.periodo.id_semestre, this.entorno.version_final,this.id_escuela)
                      if (res.success) {
                        this.arrData = res.data
                        this.createPlan(this.arrData)
                        // this.getOptativos(this.arrData)
                      } else {
                        this.arrData = null
                      }
                      this.ajaxLoad = false
    },

    // getOptativos: function(arrDatos){
    //   var temp=[]
    //   this.arrCiclo.forEach(function(ac){
    //     arrDatos.forEach(function(ad){
    //       if(ac.id==ad.ciclo && ad.idtipocurso==2){
    //         temp.push(ad)
    //       }
    //     });
    //   })      
    // this.arrOptativos=temp
    // },


    createPlan(arr) {
      let ciclos = []
      let id = 0

      arr.map(el => {
        if (el.ciclo != id) {
          const obj = {
            id: el.ciclo,
            ciclo: `CICLO ${el.ciclo}`,
            cursos: []
          }

          ciclos.push(obj)
        }
        id = el.ciclo
      })

      ciclos.map(el => {
        arr.map(elem => {
          if (elem.ciclo == el.id) {
            el.cursos.push(elem)
          }
        })
      })

      this.arrCiclo = ciclos
    },

  },
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>