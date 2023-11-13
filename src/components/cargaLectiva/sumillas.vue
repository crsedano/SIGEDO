<template>
<div class="ed-container init no-imp">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      SUMILLAS
    </strong>
  </h2>

  <div class="ed-item">
    <el-table border stripe fit :data="facultades" height="460" highlight-current-row :row-class-name="tableRowClassName">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="facultad" label="Facultad" min-width="220" align="center" header-align="center"></el-table-column>
      <el-table-column prop="escuela" label="Escuela" min-width="300" align="center" header-align="center"></el-table-column>
      <el-table-column prop="avance2007" label="Avance 2007" min-width="130" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.avance2007 }}%
        </template>
      </el-table-column>
      <el-table-column prop="avance2008" label="Avance 2008" min-width="130" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.avance2008 }}%
        </template>
      </el-table-column>
      <el-table-column prop="avance2011" label="Avance 2011" min-width="130" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.avance2011 }}%
        </template>
      </el-table-column>
      <el-table-column prop="avance2015" label="Avance 2015" min-width="130" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.avance2015 }}%
        </template>
      </el-table-column>
      <el-table-column prop="avance2017" label="Avance 2017" min-width="130" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.avance2017 }}%
        </template>
      </el-table-column>
      <el-table-column label="*" min-width="60" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Ver Cursos" placement="left">
            <i @click="verCursos(reg.row)" class="fas fa-chalkboard-teacher pointer action"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="PDF" min-width="60" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Imprimir Reporte" placement="left">
            <i @click="printReport(reg.row)" class="fas fa-file-pdf pointer action"></i>
          </el-tooltip>
        </template>
      </el-table-column>    
    </el-table>
  </div>

  <div v-if="modals.fac_sel" class="modal">
    <asignaturas-sumilla :facultad="facSel" @close="closeFacSel" />
  </div>

  <!-- Pantalla de carga general -->
  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

import GxDate from '../../helpers/date'

import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import asignaturasSumilla from './modals/asignaturasSumilla.vue'

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
    loading,
    loader,
    asignaturasSumilla
  },

  data: function () {
    return {
      ajaxLoad: false,

      modals: {
        fac_sel: false
      },

      facultades: null,

      facSel: null
    }
  },

  computed: {

  },

  watch: {

  },

  methods: {
    init() {
      this.getFacultades()
    },

    async getFacultades() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL}js-facultad-user-sumilla/${this.identity.id_usuario}`)
        
        if (res.status !== 200) return

        let arrFac = res.data.data

        const fac = []

        arrFac.map(ff => {
          if (!fac.some(f => f.id_escuela == ff.id_escuela && f.id_facultad == ff.id_facultad)) {
            fac.push({
              escuela: ff.escuela,
              facultad: ff.facultad,
              id_escuela: ff.id_escuela,
              id_facultad: ff.id_facultad
            })
          }
        })

        fac.map(ff => {
          arrFac.map(f => {
            if (ff.id_escuela == f.id_escuela && ff.id_facultad == f.id_facultad) {
              if (f.anio == '2015') {
                this.$set(ff, 'avance2015', (parseInt(f.cantidad) / parseInt(f.total) * 100).toFixed(2))
              } else if (f.anio == '2007') {
                this.$set(ff, 'avance2007', (parseInt(f.cantidad) / parseInt(f.total) * 100).toFixed(2))
              } else if (f.anio == '2008') {
                this.$set(ff, 'avance2008', (parseInt(f.cantidad) / parseInt(f.total) * 100).toFixed(2))
              } else if (f.anio == '2017') {
                this.$set(ff, 'avance2017', (parseInt(f.cantidad) / parseInt(f.total) * 100).toFixed(2))
              } else if (f.anio == '2011') {
                this.$set(ff, 'avance2011', (parseInt(f.cantidad) / parseInt(f.total) * 100).toFixed(2))
              }
            }
          })
        })
        this.facultades = fac
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    verCursos: function (fac) {
      this.facSel = fac
      this.abrirModal('fac_sel')
    },

    printReport: function(fac){
      // 
      window.open(`${this.URLPDF}api/src/reportes/asignatura/sumillaEscuela.php?ae_bcd=${this.token}&id_facultad=${fac.id_facultad}&id_escuela=${fac.id_escuela}&id_usuario=${this.identity.id_usuario}`, '_blank');
    },

    async closeFacSel () {
      await this.getFacultades()
      this.cerraModal('fac_sel')
    },

    abrirModal: function (modal) {
      this.modals[modal] = true
    },

    cerraModal: function (modal) {
      this.modals[modal] = false
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

