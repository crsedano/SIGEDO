<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      REPORTE PLANES ESTUDIOS
    </strong>
  </h2>
  
  <el-form size="mini" class="ed-item ed-container" label-position="top">
     <el-form-item label="Modalidad" class="ed-item sep-5 l-30 to-center">
         <el-select v-model="idModalidad" placeholder="opcion" >
            <el-option label="SELECCIONAR" :value="0"></el-option>
            <el-option label="PRESENCIAL" :value="1"></el-option>
            <el-option label="SEMI PRESENCIAL" :value="2"></el-option>
          </el-select>
      </el-form-item>

     <el-form-item label="Opciones" class="ed-item sep-5 l-30 to-center">
         <el-select v-model="idSeleccion" placeholder="opcion" >
            <el-option v-for="(opc, index) in options" :key="index" :label="opc.label" :value="opc.value">
            </el-option>
          </el-select>
      </el-form-item>

    <el-form-item label="Planes Estudio" class="ed-item sep-5 l-30 to-center ">
      <el-select v-model="id_plan" placeholder="Plan">
        <el-option v-for="(plan, index) in arrPlanes" :key="index" :label="plan.anio" :value="plan.id_plan_estudio">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="Facultad" class="ed-item sep-5 l-30 to-center ">
      <el-select v-model="id_facultad" placeholder="Facultad">
        <el-option v-for="(facultad, index) in arrFacultades" :key="index" :label="facultad.nombre" :value="facultad.id_facultad">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if="arrEscuelas" label="Escuelas" class="ed-item sep-5 l-30 to-center ">
      <el-select filterable v-model="id_escuela" placeholder="Escuela">
        <el-option v-for="(escuela, index) in arrEscuelas" :key="index" :label="escuela.nombre" :value="escuela.id_escuela">
        </el-option>
      </el-select>
    </el-form-item>

    <div v-if="ready" class="ed-item txt-center sep-5">
      <el-button @click="getDataReporte" type="primary" size="mini">Actualizar</el-button>
      <!-- <button @click="getDataReporte" class="btn btn-info btn-rounded">Actualizar</button> -->
    </div>
  </el-form>

  <div v-if="arrData && ready" class="ed-item txt-center">
    <a v-if="entorno && idSeleccion == 1" target="_blank" :href="`${URLPDF}api/src/reportes/asignatura/reporte_plan_estudio.php?ae_bcd=${token}&id_plan_estudio=${id_plan}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&id_usuario=${this.identity.id_usuario}&plan=${plan}&moda=${idModalidad}`"
      class="el-button el-button--info el-button--mini">Imprimir PDF</a>
    <a v-if="entorno && idSeleccion == 2" target="_blank" :href="`${URLPDF}api/src/reportes/asignatura/PlanEstudioAF.php?ae_bcd=${token}&id_plan_estudio=${id_plan}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&id_usuario=${this.identity.id_usuario}&plan=${plan}&moda=${idModalidad}`"
      class="el-button el-button--info el-button--mini">Imprimir PDF</a>
    <el-button size="mini" @click="exportToExcel" type="info">Exportar a Excel</el-button>
    <!-- <button @click="exportToExcel" class="btn btn-dark btn-rounded">
      Exportar a Excel
    </button> -->
  </div>

  <div v-if="ready" class="ed-item text-center">
    <el-button v-if="idModalidad == 1" size="mini" @click="exportMatriz" type="info">Exportar Matriz</el-button>
    <el-button v-if="idModalidad == 2" size="mini" @click="exportMatrizSemi" type="info">Exportar Matriz Semipresencial</el-button>
  </div>

  <div id="table" v-if="arrData && idSeleccion == 1 "   class="ed-item sep-10 table-content mh">
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
            <th v-if="idModalidad == 1">HT</th>
            <th v-if="idModalidad == 1">HP</th>
            <th v-if="idModalidad == 2">HT Presencial</th>
            <th v-if="idModalidad == 2">HT Virtual</th>
            <th v-if="idModalidad == 2">HP Presencial</th>
            <th v-if="idModalidad == 2">HP Virtual</th>
            <th>Creditos</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(data, index) in arrData" :key="index">
                <template v-if="c.id == data.ciclo && data.idtipocurso!=2">
              <td style="text-align: left">{{ data.nombre }}</td>
              <td class="w-10" v-if="idModalidad == 1" style="text-align: center">{{ data.horas_teoricas }}</td>
              <td class="w-10" v-if="idModalidad == 1" style="text-align: center">{{ data.horas_practicas }}</td>
              <td class="w-10" v-if="idModalidad == 2" style="text-align: center">{{ data.sp_phorasteoricas }}</td>
              <td class="w-10" v-if="idModalidad == 2" style="text-align: center">{{ data.sp_vhorasteoricas }}</td>
              <td class="w-10" v-if="idModalidad == 2" style="text-align: center">{{ data.sp_phoraspracticas }}</td>
              <td class="w-10" v-if="idModalidad == 2" style="text-align: center">{{ data.sp_vhoraspracticas }}</td>
              <td class="w-10" style="text-align: center">{{ data.creditos }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </template>
    <template>
      <h3 style="text-align: center">
        <strong>ELECTIVOS</strong>
      </h3>
        <table class="table table-responsive table-striped table-bordered table-hover table-own">
          <thead class="table-head">
            <tr style="background: #638ec3 !important;">
              <th>Ciclo</th>
              <th>Asignatura</th>
              <th v-if="idModalidad == 1">HT</th>
              <th v-if="idModalidad == 1">HP</th>
              <th v-if="idModalidad == 2">HT Presencial</th>
              <th v-if="idModalidad == 2">HT Virtual</th>
              <th v-if="idModalidad == 2">HP Presencial</th>
              <th v-if="idModalidad == 2">HP Virtual</th>
              <th>Creditos</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr v-for="(op, index) in arrOptativos" :key="index">
                <template>
                  <td class="w-10" style="text-align: center">{{ op.ciclo }}</td>
                  <td style="text-align: left">{{ op.nombre }}</td>
                  <td v-if="idModalidad == 1" class="w-10" style="text-align: center">{{ op.horas_teoricas }}</td>
                  <td v-if="idModalidad == 1" class="w-10" style="text-align: center">{{ op.horas_practicas }}</td>
                  <td v-if="idModalidad == 2" class="w-10" style="text-align: center">{{ op.sp_phorasteoricas }}</td>
                  <td v-if="idModalidad == 2" class="w-10" style="text-align: center">{{ op.sp_vhorasteoricas }}</td>
                  <td v-if="idModalidad == 2" class="w-10" style="text-align: center">{{ op.sp_phoraspracticas }}</td>
                  <td v-if="idModalidad == 2" class="w-10" style="text-align: center">{{ op.sp_vhoraspracticas }}</td>
                  <td class="w-10" style="text-align: center">{{ op.creditos }}</td>
                </template>
            </tr>
          </tbody>
        </table>
      </template>
  </div>

  <div id="table" v-if="arrDataArea && idSeleccion == 2" class="ed-item sep-10 table-content mh">
    <template v-for="(c) in arrAreaForma">
      <h3 style="text-align: center" :key="c.nombre_area">
        <strong>{{ c.nombre_area }}</strong>
      </h3>
      <table :key="c.id" class="table table-responsive table-striped table-bordered table-hover table-own">
        <thead class="table-head">
          <tr id="nombre_area" style="display: none">
            <th colspan="4">{{c.nombre_area}}</th>
          </tr>
          <tr style="background: #638ec3 !important;">
            <th>Asignatura</th>
            <th v-if="idModalidad == 1">HT</th>
            <th v-if="idModalidad == 1">HP</th>
            <th v-if="idModalidad == 2">HT Presencial</th>
            <th v-if="idModalidad == 2">HT Virtual</th>
            <th v-if="idModalidad == 2">HP Presencial</th>
            <th v-if="idModalidad == 2">HP Virtual</th>
            <th>Creditos</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(data, index) in arrDataArea" :key="index">
            <template v-if="c.id == data.nombre_area">
              <td style="text-align: left">{{ data.nombre }} {{ data.idtipocurso == 2 ? '(ELECTIVO)' : '' }}</td>
              <td v-if="idModalidad == 1" class="w-10" style="text-align: center">{{ data.horas_teoricas }}</td>
              <td v-if="idModalidad == 1" class="w-10" style="text-align: center">{{ data.horas_practicas }}</td>
              <td v-if="idModalidad == 2" class="w-10" style="text-align: center">{{ data.sp_phorasteoricas }}</td>
              <td v-if="idModalidad == 2" class="w-10" style="text-align: center">{{ data.sp_vhorasteoricas }}</td>
              <td v-if="idModalidad == 2" class="w-10" style="text-align: center">{{ data.sp_phoraspracticas }}</td>
              <td v-if="idModalidad == 2" class="w-10" style="text-align: center">{{ data.sp_vhoraspracticas }}</td>
              <td class="w-10" style="text-align: center">{{ data.creditos }}</td>
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

import loader from '../templates/loader.vue'

/**
 * Models
 */
import GxPlanEstudio from '../../models/gx_plan_estudio'

import {
  mapState,
  mapActions,
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
    loader,
  },

  data: function () {
    return {
      modals: {

      },
        options: [{
          value: 0,
          label: 'SELECCIONAR'
        }, {
          value: 1,
          label: 'CICLO'
        }, {
          value: 2,
          label: 'AREA FORMACION'
        }],

      id_facultad: 0,

      id_escuela: 0,

      id_plan: 0,

      id_area_formacion: 0,

      idSeleccion: 0,

      idModalidad: 0,

      arrData: null,
      arrDataArea: null,
      arrCiclo: null,
      arrAreaForma: null,
      arrOptativos:[]
    }
  },

  computed: {
    ready: function () {
      return (
        this.id_facultad != 0 &&
        this.id_escuela != 0 &&
        this.id_plan != 0 &&
        this.idSeleccion != 0 &&
        this.idModalidad != 0
      )
    },

    arrEscuelas() {
      return this.$store.getters['escuela/escuelaByFacultad'](this.id_facultad)
    },

    ...mapState({
      arrFacultades: state => state.facultad.arrFacultades,
      arrPlanes: state => state.planes_estudio.arrPlanes,
      arrArea: state => state.area_formacion.arrArea,
    }),

    plan () {
      if (this.id_plan == 0) return null
      return this.arrPlanes.find(p => p.id_plan_estudio == this.id_plan).anio
    }
  },

  watch: {
    id_facultad: function () {
      this.arrData = null
      this.arrDataArea = null
      this.id_escuela = 0
    },

    id_escuela: function () {
      this.arrData = null
      this.arrDataArea = null
    }
  },

  methods: {
    init() {
      this.getFacultades()
      this.getPlanes()
      this.getFilialesUser()
      this.getArea()
    },

    ...mapActions({
      getFacultades: 'facultad/getFacultades',
      getPlanes: 'planes_estudio/getPlanes',
      getFilialesUser: 'filial/getFilialesByUser',
      getArea: 'area_formacion/getArea',
    }),

    getDataReporte: async function () {
      this.ajaxLoad = true
             if (this.idSeleccion !== 0) {
                    if (this.idSeleccion === 1) {
                      const gxPlanEstudio = new GxPlanEstudio(this.URL)
                      gxPlanEstudio.id_plan_estudio = this.id_plan

                      const res = await gxPlanEstudio.getDetallePlan(this.autho, this.id_facultad, this.id_escuela)
                      if (res.success) {
                        this.arrData = res.data
                        this.createPlan(this.arrData)
                        this.getOptativos(this.arrData)
                      } else {
                        this.arrData = null
                      }
                      this.ajaxLoad = false
                    } else if (this.idSeleccion === 2) {
                        this.getDataArea()
                    }
                }
    },
    getOptativos: function(arrDatos){
      var temp=[]
      this.arrCiclo.forEach(function(ac){
        arrDatos.forEach(function(ad){
          if(ac.id==ad.ciclo && ad.idtipocurso==2){
            temp.push(ad)
          }
        });
      })      
    this.arrOptativos=temp
    },

    getDataArea: async function () {
      this.ajaxLoad = true
      const gxPlanEstudio = new GxPlanEstudio(this.URL)
      gxPlanEstudio.id_plan_estudio = this.id_plan

      const res = await gxPlanEstudio.getDetalleArea(this.autho, this.id_facultad, this.id_escuela)
      if (res.success) {
        this.arrDataArea = res.data
        this.createAreaFormacion(this.arrDataArea)
      } else {
        this.arrDataArea = null
      }

      this.ajaxLoad = false
    },

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

    createAreaFormacion(arr) {
      let areas = []
      let id = 0

      arr.map(el => {
        if (el.nombre_area != id) {
          const obj = {
            id: el.nombre_area,
            nombre_area: el.nombre_area,
            cursos: []
          }

          areas.push(obj)
        }
        id = el.nombre_area
      })

      areas.map(el => {
        arr.map(elem => {
          if (elem.nombre_area == el.id) {
            el.cursos.push(elem)
          }
        })
      })

      this.arrAreaForma = areas
    },

    async exportToExcel () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}3/planes-estudio/asignaturas/${this.id_plan}/${this.id_escuela}`)

        let { status, data } = res

          if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async exportMatriz () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}3/planes-estudio/matriz/${this.id_plan}/${this.id_escuela}`)

        let { status, data } = res

          if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async exportMatrizSemi () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}3/planes-estudio/matriz-semi/${this.id_plan}/${this.id_escuela}`)

        let { status, data } = res

          if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

  },
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>