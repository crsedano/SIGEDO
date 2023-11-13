<template>
<div class="ed-container init">

  <el-form class="ed-item ed-container" size="mini">
    <el-form-item class="ed-item m-50 l-30 to-center" label="Plan">
      <el-select filterable v-model="id_plan" placeholder="Seleccionar plan">
        <el-option label="SELECCIONAR" :value="0"></el-option>
        <el-option v-for="(plan, index) in arrPlanes" :key="index" :label="plan.anio" :value="plan.id_plan_estudio"></el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item class="ed-item" label="Filial">
      <el-select filterable v-model="id_filial" placeholder="Seleccionar plan">
          <el-option v-for="(f, index) in filiales" :key="index" :label="f.nombre_filial" :value="f.id_filial"></el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item class="ed-item m-50 l-30 to-center" label="Facultad">
      <el-select filterable v-model="id_facultad" placeholder="Seleccionar plan">
          <el-option v-for="(f, index) in facultades" :key="index" :label="f.nombre" :value="f.id_facultad"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="escuelas" class="ed-item m-50 l-30 to-center" label="Escuelas">
      <el-select filterable v-model="id_escuela" placeholder="Seleccionar plan">
          <el-option v-for="(e, index) in escuelas" :key="index" :label="e.nombre" :value="e.id_escuela"></el-option>
      </el-select>
    </el-form-item>
    <div class="ed-item txt-center">
      <el-button @click="getAsignaturas" size="mini" type="primary" plain>Actualizar</el-button>
    </div>
  </el-form>

  <div class="ed-item sep-10">
    <div v-if="arrFilter != null" class="ed-item">
      <el-button @click="goCreate" size="mini" type="info" plain>Nueva Asignatura</el-button>
    </div>
    <!--  -->
    <div v-if="arrAsignaturas" class="ed-item sep-5">
      <el-input size="small" placeholder="Buscar" v-model="q"></el-input>
    </div>
    <el-table border stripe fit :data="arrFilter" height="450" highlight-current-row :row-class-name="tableRowClassName" v-loading="asigLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column :filters="[{text: '1', value: 1}, {text: '2', value: 2}, {text: '3', value: 3}, {text: '4', value: 4}, {text: '5', value: 5}, {text: '6', value: 6}, {text: '7', value: 7}, {text: '8', value: 8}, {text: '9', value: 9}, {text: '10', value: 10}, {text: '11', value: 11}, {text: '12', value: 12}, {text: '13', value: 13}, {text: '14', value: 14}]" :filter-method="filterHandler" prop="ciclo" label="Ciclo" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cod_asignatura" label="Código" min-width="80" align="center" header-align="center"></el-table-column>
      <el-table-column prop="nombre" label="Asignatura" min-width="400" align="center" header-align="center"></el-table-column>
      <el-table-column prop="horas_teoricas" label="HT" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column prop="horas_practicas" label="HP" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column prop="sp_phorasteoricas" label="SPHT" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column prop="sp_phoraspracticas" label="SPHP" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column prop="sp_vhorasteoricas" label="SVHT" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column prop="sp_vhoraspracticas" label="SVHP" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column prop="creditos" label="Créditos" min-width="80" align="center" header-align="center"></el-table-column>
      <el-table-column prop="area.nombre" label="Área Formación" min-width="250" align="center" header-align="center"></el-table-column>
      <el-table-column :filters="[{text: 'ELECTIVO', value: 'ELECTIVO'}, {text: 'NORMAL', value: ''}]" :filter-method="filterHandler" prop="tipo" label="Electivo" min-width="90" align="center" header-align="center"></el-table-column>
      <el-table-column :filters="[{text: 'ESPECÍFICO', value: 'E'}, {text: 'GENERAL', value: 'G'}, {text: 'TALLER', value: 'T'}]" :filter-method="filterHandler" prop="ctipocurso" label="Tipo" min-width="70" align="center" header-align="center"></el-table-column>
      <el-table-column fixed label="*" min-width="60" align="center" header-align="center" style="display: flex">
        <template slot-scope="reg">
          <el-tooltip class="item" effect="dark" content="Editar Asignatura" placement="left-start">
            <el-button @click="goEdit(reg.row)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="*" min-width="60" align="center" header-align="center" style="display: flex">
        <template slot-scope="reg">
          <el-tooltip v-if="reg.row.ctipocurso == 'G'" class="item" effect="dark" content="Ver asignatura general" placement="left-start">
            <el-button @click="openGen(reg.row)" plain size="mini" type="primary" icon="el-icon-document" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div v-if="modalCrud" class="modal f-row f-center">
    <crud-asignatura :asignatura="asigSel" :id_facultad="id_facultad" :id_escuela="id_escuela" :id_plan_estudio="id_plan" @close="closeCrud"/>
  </div>
  <div v-if="modalGen" class="modal f-row f-center">
    <cursos-generales :id="idGeneral" @close="closeGen"/>
  </div>

</div>
</template>

<script>
// mixing
import mixingInit from '../../mixing/mixing_init.js'

// models
import GxPlanEstudio from '../../models/gx_plan_estudio'

import crudAsignatura from './modal/CrudAsignatura.vue'
import cursosGenerales from './modal/CursosGenerales.vue'

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
    crudAsignatura,
    cursosGenerales
  },

  data: function () {
    return {
      gxPlanEstudio: new GxPlanEstudio(),
      arrPlanes: null,
      planLoad: false,
      modalEscuelas: false,
      planSel: null,
      id_plan: 0,
      id_filial: 0,
      id_facultad: 0,
      id_escuela: 0,
      arrAsignaturas: null,
      asigLoad: false,
      modalCrud: false,
      asigSel: null,
      q: '',
      arrFilter: null,
      modalGen: false,
      idGeneral: null
    }
  },

  computed: {
    ...mapState({
      facultades: state => state.facultad.arrFacultadUser,
      filiales: state => state.filial.arrFilialUser
    }),

    escuelas () {
      return this.$store.getters['escuela/escuelaByFacultad'](this.id_facultad)
    },

    ready () {
      return (
        this.gxPlanEstudio.anio != '' &&
        this.gxPlanEstudio.anio.length == 4
      )
    }
  },

  watch: {
    id_plan (n) {
      this.arrAsignaturas = null
      this.q = ''
    },
    id_facultad (n) {
      this.arrAsignaturas = null
      this.id_escuela = 0
      this.q = ''
    },
    id_escuela (n) {
      this.arrAsignaturas = null
      this.q = ''
    },

    q (n) {
      if (n == '') {
        this.arrFilter = this.arrAsignaturas
        return
      }

      this.arrFilter = this.arrAsignaturas.filter(a => a.nombre.toLowerCase().includes(n.toLowerCase()))
    }
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getPlanes()
      await this.getFiliales()
      await this.getFacultades()
      loading.close()
    },

    ...mapActions({
      getFacultades: 'facultad/getFacultadByUser',
      getFiliales: 'filial/getFilialesByUser',
    }),

    async getPlanes () {
      this.planLoad = true
      try {
        const res = await this.axios.get(`${this.URL}v1/planesEstudio/getPlanes`)

        if(res.status !== 200) return

        this.arrPlanes = res.data.data
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.planLoad = false
    },

    async getAsignaturas () {
      this.asigLoad = true
      try {
        // const res = await this.axios.get(`${this.URL}v1/planesEstudio/getAsignaturas/${this.id_plan}/${this.id_escuela}`)
        const res = await this.axios.get(`${this.URL_}v2/asignaturas/planEscuela/${this.id_escuela}/${this.id_plan}`)
        if(res.status !== 200) return
        let arr = res.data.data
        this.arrAsignaturas = arr.map(a => {
          a.ciclo = parseInt(a.ciclo)
          a.id_area_formacion = parseInt(a.id_area_formacion)
          return a
        })

        if (this.q == '') {
          this.arrFilter = this.arrAsignaturas
        } else {
          this.arrFilter = this.arrAsignaturas.filter(a => a.nombre.toLowerCase().includes(this.q.toLowerCase()))
        }

      } catch (err) {
        this.$hlp.errors(err)
      }
      this.asigLoad = false
    },

    goEdit (reg) {
      this.asigSel = reg
      this.modalCrud = true
    },

    goCreate() {
      this.asigSel = null
      this.modalCrud = true
    },

    closeCrud () {
      this.asigSel = null
      this.modalCrud = false
      this.getAsignaturas()
    },

    openGen (reg) {
      this.idGeneral = reg.id_asignatura_general
      this.modalGen = true
    },

    closeGen () {
      this.modalGen = false
      this.idGeneral = null
    },

    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },

  },
}
</script>

<style lang="scss" scoped>

</style>

