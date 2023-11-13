<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      SUMILLAS
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
    </el-form>

    <div class="ed-item">
        <el-table border stripe fit :data="sumillas" height="460" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela" label="Escuela" min-width="300" align="center" header-align="center"></el-table-column>
        <el-table-column prop="avance" label="Avance" min-width="130" align="center" header-align="center">
          <template slot-scope="reg">
            {{ reg.row.avance}}%
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
        <loader/>
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

import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex'

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
    id_facultad: 0,
    id_escuela: 0,
    id_plan: 0,
    arrFacultades:[],
    arrPlanes:[],
    sumillas:[]
    }
  },

  computed: {

  },

  watch: {
    id_facultad: function(val){
      if(this.id_facultad!=0 && this.id_plan!=0){
        this.getSumillaEscuela()
      }else{
        this.sumillas=[]
      }
    },
    id_plan: function(val){
      if(this.id_facultad!=0 && this.id_plan!=0){
        this.getSumillaEscuela()
      }else{
        this.sumillas=[]
      }
    }
  },

  methods: {
    init() {
      this.getPlanesEstudio()
      this.getFacultades()
    },

    async getPlanesEstudio() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const res=await this.axios.get(`${this.URL_}v2/planesEstudio/getAll`,this.autho);
      if(res.status!=200){
      }
      this.arrPlanes=[{"anio":"SELECCIONE","id_plan_estudio":0}].concat(res.data.data);
      loading.close();
    },

    async getFacultades() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const res=await this.axios.get(`${this.URL_}v2/facultades/getAll`,this.autho);
      if(res.status!=200){
      }
      this.arrFacultades=[{"id_facultad":0,"cod_facultad":"000","nombre":"SELECCIONE","siglas":"","activo":null}].concat(res.data.data);
      loading.close();
    },

    async getSumillaEscuela(){
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL}js-sumilla-facultad-plan/${this.id_facultad}/${this.id_plan}`)
        
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
              this.$set(ff, 'avance', (parseInt(f.cantidad) / parseInt(f.total) * 100).toFixed(2))
            }
          })
        })
        this.sumillas = fac
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    // async getEscuelas() {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: 'Cargando...',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    //   const res=await this.axios.get(`${this.URL_}v2/escuelas/getEscuelaByFacultad/${this.id_facultad}`,this.autho);
    //   if(res.status!=200){
    //       
    //   }
    //   ;
    //   this.arrEscuelas=[{"id_escuela":0,"cod_escuela":"0","nombre":"SELECCIONE","id_facultad":2}].concat(res.data.data);
    //   loading.close();
    // },

    verCursos: function (fac) {
      this.facSel = fac
      this.abrirModal('fac_sel')
    },

    printReport: function(fac){
      // 
      window.open(`${this.URLPDF}api/src/reportes/asignatura/sumillaEscuela2.php?ae_bcd=${this.token}&id_facultad=${fac.id_facultad}&id_escuela=${fac.id_escuela}&id_usuario=${this.identity.id_usuario}&id_plan=${this.id_plan}`, '_blank');
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