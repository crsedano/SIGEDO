<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>REPORTE CUMPLIMIENTO DE ENTREGA DE EXAMENES</strong>
  </h1>

  <el-form size="mini" class="ed-item sep-5 ed-container" label-width="120px">
    <el-form-item class="ed-item m-50" label="Modalidad">
      <el-select filterable v-model="idModalidad">
        <el-option label="TODOS/SELECCIONAR" :value="0"></el-option>
        <el-option label="PRESENCIAL" :value="1"></el-option>
        <el-option label="SEMI PRESENCIAL" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="ed-item m-50" label="Filial">
      <el-select filterable v-model="idFilial">
        <el-option v-for="(filial, index) in filiales" :key="index" :label="filial.nombre_filial" :value="filial.id_filial"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="ed-item m-50" label="Facultad">
      <el-select filterable v-model="idFacultad">
        <el-option v-for="(facultad, index) in facultades" :key="index" :label="facultad.nombre" :value="facultad.id_facultad"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="ed-item m-50" v-if="facultadSelected" label="Escuela">
      <el-select filterable v-model="idEscuela">
        <el-option v-for="(escuela, index) in escuelas" :key="index" :label="escuela.nombre" :value="escuela.id_escuela"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="ed-item m-60 gr-center" label="DNI Docente">
      <el-input v-model="idDocente"></el-input>
    </el-form-item>
    <el-form-item class="ed-item txt-center">
      <el-button type="primary" @click="getDataReport">Actualizar</el-button>
      <!-- <el-button type="info" icon="el-icon-document" @click="getDataReport">Imprimir</el-button> -->
      <a :href="`${URLPDF}api/src/reportes/entrega_examen?ae_bcd=${token}&idUsuario=${identity.id_usuario}&idPeriodo=${periodo.id_periodo}&idSemestre=${periodo.id_semestre}&idFilial=${idFilial}&idFacultad=${idFacultad}&idEscuela=${idEscuela}&idModalidad=${idModalidad}&idDocente=${idDocente}`" target="_blank" class="el-button el-button--info el-button--mini" rel="noopener noreferrer">Imprimir</a>
    </el-form-item>
  </el-form>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="dataReport" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando cursos a cargo...">
      <el-table-column fixed type="index" :index="indexMethod" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="id_docente" label="DNI" min-width="80" align="center" header-align="center"></el-table-column>
      <el-table-column prop="nombre" label="Docente" min-width="220" align="left" header-align="center"></el-table-column>
      <el-table-column prop="asignatura" label="Asignatura" min-width="180" align="center" header-align="center"></el-table-column>
      <el-table-column prop="anio" label="Plan" min-width="60" align="center" header-align="center"></el-table-column>
      <el-table-column prop="facultad" label="Facultad" min-width="180" align="center" header-align="center"></el-table-column>
      <el-table-column prop="escuela" label="Escuela" min-width="180" align="center" header-align="center"></el-table-column>
      <el-table-column prop="parcial" label="Entrega Parcial" min-width="140" align="center" header-align="center"></el-table-column>
      <el-table-column prop="final" label="Entrega Final" min-width="140" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>

  <div class="ed-item gr-center">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page"
      :page-sizes="[100, 200, 300]" :page-size.sync="limit" layout="total, sizes, prev, pager, next, jumper"
      :total.sync="total">
    </el-pagination>
  </div>

</div>
</template>

<script>
/**
 * MIXING
 */
import MixinInit from '../../mixing/mixing_init.js'

import HorasNoLectivas from '../../models/horas_no_lectivas.js'

export default {
  mixins: [
    MixinInit
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

  },

  data() {
    return {
      idFilial: 0,
      idFacultad: 0,
      idEscuela: 0,
      idModalidad: 0,
      idDocente: null,

      filiales: null,
      facultades: null,
      escuelas: null,

      dataReport: null,

      page: 1,
      total: 0,
      limit: 100
    }
  },

  watch: {
    idFacultad (n) {
      this.dataReport = null
      this.page = 1
      this.idEscuela = 0
      this.getEscuelasUser(n)
    },
    idFilial() {
      this.dataReport = null
      this.page = 1
    },
    idEscuela() {
      this.dataReport = null
      this.page = 1
    },
    idModalidad() {
      this.dataReport = null
      this.page = 1
    },
    idDocente() {
      this.dataReport = null
      this.page = 1
    }
  },

  computed: {
    facultadSelected () {
      return this.idFacultad != 0
    }
  },

  filters: {
    
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      await this.getFilialesUser()
      await this.getFacultadesUser()
      
      loading.close()
    },

    handleSizeChange(val) {
      this.getDataReport()
    },

    handleCurrentChange(val) {
      this.getDataReport()
    },

    async getFilialesUser () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/user_data/filiales`)
        if (res.status !== 200) return
        this.filiales = res.data.filiales
        this.filiales.unshift({
          id_filial: 0,
          nombre_filial: 'TODAS / SELECCIONAR'
        })
      } catch (err) {
        this.filiales = null
        this.$hlp.errors(err)
      }
    },

    async getFacultadesUser () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/user_data/facultades`)
        if (res.status !== 200) return
        this.facultades = res.data.facultades
        this.facultades.unshift({
          id_facultad: 0,
          nombre: 'TODAS / SELECCIONAR'
        })
      } catch (err) {
        this.facultades = null
        this.$hlp.errors(err)
      }
    },

    async getEscuelasUser ($idFacultad) {
      if($idFacultad == 0) return
      try {
        const res = await this.axios.get(`${this.URL_}v2/user_data/escuelas/${$idFacultad}`)
        if (res.status !== 200) return
        this.escuelas = res.data.escuelas
        this.escuelas.unshift({
          id_escuela: 0,
          nombre: 'TODAS / SELECCIONAR'
        })
      } catch (err) {
        this.escuelas = null
        this.$hlp.errors(err)
      }
    },

    async getDataReport () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if(!this.idDocente || this.idDocente == '') {
        await this.getWoDocente()
      } else {
        if (this.idDocente.length != 8) {
          this.swAlert(`El DNI del docente debe ser de 8 caracteres`)
          loading.close()
          return
        }
        await this.getIncDocente()
      }
      loading.close()
    },

    async getIncDocente () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL_}v2/entrega_examen/reporte/${this.page}/${this.limit}/${id_periodo}/${id_semestre}/${this.idFilial}/${this.idFacultad}/${this.idEscuela}/${this.idModalidad}/${this.idDocente}`)
        if(res.status !== 200) return
        this.dataReport = res.data.data
        this.dataReport = this.dataReport.map(d => {
          d.porcentaje = parseFloat(d.porcentaje) * 100
          return d
        })
        this.setTotal(res.data.total)
      } catch (err) {
        this.dataReport = null
        this.$hlp.errors(err)
      }
    },

    async getWoDocente () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL_}v2/entrega_examen/reporte/${this.page}/${this.limit}/${id_periodo}/${id_semestre}/${this.idFilial}/${this.idFacultad}/${this.idEscuela}/${this.idModalidad}`)
        if(res.status !== 200) return
        this.dataReport = res.data.data
        this.dataReport = this.dataReport.map(d => {
          d.porcentaje = parseFloat(d.porcentaje) * 100
          return d
        })
        this.setTotal(res.data.total)
      } catch (err) {
        this.dataReport = null
        this.$hlp.errors(err)
      }
    },

    setTotal($total) {
      this.total = $total
    },

    indexMethod(index) {
      return index + 1 + this.limit * (this.page - 1)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
