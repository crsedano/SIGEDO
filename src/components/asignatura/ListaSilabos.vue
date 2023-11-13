<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      REGISTRO SILABOS
    </strong>
  </h2>

  <el-form size="mini" class="ed-item ed-container" label-position="top">
    <el-form-item label="Filial de Impresión" class="ed-item sep-5 l-30 to-center gr-center">
      <el-select v-model="id_filial" placeholder="Filial Impresión">
        <el-option v-for="(fil, index) in arrFilial" :key="index" :value="fil.id_filial" :label="fil.nombre_filial">
        </el-option>
      </el-select>
    </el-form-item>

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
      <el-button size="small" plain @click="getDataReporte" type="primary">Actualizar</el-button>
    </div>

    <div v-if="arrData" class="ed-item txt-center-sep-5">
      <el-input v-model="filter" size="small" placeholder="Filtrar"></el-input>
    </div>
  </el-form>

  <div id="table" v-if="arrData" class="ed-item sep-10 table-content mh">
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
            <th>Tipo</th>
            <th colspan="2">Registrar</th>
            <!-- <th>Semi Presencial</th> -->
            <th colspan="2">Imprimir</th>
            <!-- <th>Imprimir</th> -->
            <!-- <th>Imprimir Semi Pre.</th> -->
            <th>Registrado</th>
            <!-- <th>Registro Semi Pre.</th> -->
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(data, index) in arrFilter" :key="index">
            <template v-if="c.id == data.ciclo">
              <td style="text-align: left">{{ data.nombre }}</td>
              <td class="w-10" style="text-align: center">{{ data.ctipocurso }}</td>
              <td class="w-10" style="text-align: center">
                <el-tooltip content="Registrar Silabo(Presencial)" placement="left">
                  <i @click="selectCurso(data, 1)" class="fas fa-clipboard-list action pointer"></i>
                </el-tooltip>
              </td>
              <td class="w-10" style="text-align: center">
                <el-tooltip content="Registrar Silabo(Semipresencial)" placement="left">
                  <i @click="selectCurso(data, 2)" class="fas fa-clipboard-list action pointer"></i>
                </el-tooltip>
              </td>
              <td class="w-10" style="text-align: center">
                <el-tooltip content="Imprimir Silabo(Presencial)" placement="left">
                  <a v-if="data.e_pres == 1" target="_blank" :href="`${URLPDF}api/src/reportes/silabo/silabo_pdf.php?ae_bcd=${token}&id_usuario=${identity.id_usuario}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_filial=${id_filial}&id_modalidad=1&dni=${identity.dni}&id_asignatura=${data.curso}&tipo=${data.ctipocurso}&filial=${filial}&id_asig=${data.id_asignatura}&moda=1`">
                    <i class="fas fa-file-pdf action pointer"></i>
                  </a>
                 </el-tooltip>
              </td>
              <td class="w-10" style="text-align: center">
                <el-tooltip content="Imprimir Silabo(Semipresencial)" placement="left">
                  <a v-if="data.e_pres == 1" target="_blank" :href="`${URLPDF}api/src/reportes/silabo/silabo_pdf.php?ae_bcd=${token}&id_usuario=${identity.id_usuario}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_filial=${id_filial}&id_modalidad=1&dni=${identity.dni}&id_asignatura=${data.curso}&tipo=${data.ctipocurso}&filial=${filial}&id_asig=${data.id_asignatura}&moda=2`">
                    <i class="fas fa-file-pdf action pointer"></i>
                  </a>
                 </el-tooltip>
              </td>

              <td @click="verDocentes(data)">
                <el-tooltip content="Ver docentes" placement="left">
                  <span>
                    {{data.e_pres == 1 ? 'SI' : 'NO'}}
                  </span>
                </el-tooltip>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </template>
  </div>

  <div v-if="modalDocentes" class="modal f-row f-center">
    <docentes-encargados 
      :id_curso="cursoSel" 
      @close="modalDocentes = false" 
      :completo="completado"
      :curso="cursoSelec"
      :escuela="escuela"
      :facultad="facultad"/>
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

import docentesEncargados from './modal/DocentesEncargados.vue'

import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex'

export default {
  mixins: [
    mixingInit
  ],
  
  props: {
    filters: {
      default: function () {
        return { }
      }
    }
  },

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
    docentesEncargados
  },

  data: function () {
    return {
      modals: {

      },

      id_facultad: 0,

      id_escuela: 0,

      id_plan: 0,

      arrData: null,
      arrFilter: null,
      arrCiclo: null,

      id_filial: 0,
      filter: '',

      modalDocentes: false,
      cursoSel: '',
      cursoSelec: '',
      completado: ''
    }
  },

  computed: {
    ready: function () {
      return (
        this.id_facultad != 0 &&
        this.id_escuela != 0 &&
        this.id_plan != 0 &&
        this.id_filial != 0
      )
    },

    arrEscuelas() {
      return this.$store.getters['escuela/escuelaByFacultad'](this.id_facultad)
    },

    ...mapState({
      arrFacultades: state => state.facultad.arrFacultades,
      arrPlanes: state => state.planes_estudio.arrPlanes,
      arrFilial: state => state.filial.arrFilialUser,
    }),

    filial () {
      if (!this.arrFilial) return ''
      let f = this.arrFilial.find(f => f.id_filial == this.id_filial)
      return f.nombre_filial
    },

    facultad () {
      if (!this.arrFacultades) return ''
      let f = this.arrFacultades.find(f => f.id_facultad == this.id_facultad)
      return f.nombre
    },

    escuela() {
      if (!this.arrEscuelas) return ''
      let f = this.arrEscuelas.find(f => f.id_escuela == this.id_escuela)
      return f.nombre
    }
  },

  watch: {
    id_facultad () {
      this.arrData = null
      this.id_escuela = 0
    },

    id_escuela () {
      this.arrData = null
    },
    
    filter (n) {
      if(n == '') {
        this.arrFilter = this.arrData
      } else {
        this.arrFilter = this.arrData.filter(d => d.nombre.toLowerCase().includes(n.toLowerCase()))
      }
      this.createPlan(this.arrFilter)
    }
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando modulo...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getFacultades()
      await this.getPlanes()
      await this.getFilialesUser()

      if(Object.keys(this.filters).length > 0) {
        this.id_facultad = this.filters.id_facultad
        this.id_filial = this.filters.id_filial
        this.id_plan = this.filters.id_plan
        this.id_escuela = this.filters.id_escuela
      }

      loading.close()
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

      const res = await gxPlanEstudio.getSilabosPlan(this.autho, this.id_facultad, this.id_escuela, this.periodo.id_periodo, this.periodo.id_semestre)
      if (res.success) {
        this.arrData = res.data
        this.arrFilter = this.arrData
        this.createPlan(this.arrFilter)
      } else {
        this.arrData = null
        this.arrFilter = null
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

    exportToExcel: function () {
      const table = document.getElementById('table'),
        ciclo = document.getElementById('ciclo')

      ciclo.style.display = 'table-row'

      let wb = XLSX.utils.table_to_book(table, {
        raw: true
      })

      XLSX.writeFile(wb, 'reporte_plan_estudio.xlsx')

      ciclo.style.display = 'none'
    },

    selectCurso(curso, modalidad) {
      this.$set(curso, 'moda', modalidad)
      this.$set(curso, 'id_modalidad', 1)
      this.$set(curso, 'id_filial', this.id_filial)

      let f = this.arrFilial.find(f => f.id_filial == this.id_filial)

      this.$set(curso, 'filial', f.nombre_filial)
      this.$set(curso, 'asignatura', curso.nombre)
      this.$set(curso, 'escuela', this.escuela)
      
      if (curso.ctipocurso == 'G') {
        this.$set(curso, 'id_curso', curso.id_asignatura_general)
      } else {
        this.$set(curso, 'id_curso', curso.id_asignatura)
      }
      this.$set(curso, 'tipo_asignatura', curso.ctipocurso)
      if (curso.silabus == 1) {
        this.swAlert(`El sílabo de este curso ya ha sido registrado`, 'info')
        return
      }
      this.$router.push({
        name: 'Silabo General',
        params: {
          curso_: curso,
          from: this.$route.name,
          filters: {
            id_facultad: this.id_facultad,
            id_filial: this.id_filial,
            id_plan: this.id_plan,
            id_escuela: this.id_escuela
          }
        }
      })
    },

    verDocentes ({ id_asignatura, e_pres, nombre }) {
      this.cursoSel = id_asignatura
      this.completado = e_pres
      this.cursoSelec = nombre
      this.modalDocentes = true
    },

    closeModal () {
      this.cursoSel = ''
      this.completado = ''
      this.modalDocentes = false
    }

  },
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>

