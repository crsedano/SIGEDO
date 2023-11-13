<template>
<div class="ed-container init">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      
    </strong>
  </h2>

  <div class="ed-item gr-center">
    <el-button type="primary" round icon="el-icon-search" @click="modals.modal_docente = true" size="small">
      BUSCAR DOCENTE
    </el-button>
  </div>
  <div v-if="gx_docente.id_docente && filialSele!='SELECCIONE' && valid" class="ed-item gr-center" style="padding-top:20px;">
    <el-tooltip content="Imprimir PDF" placement="left">
        <a class="el-button el-button--primary el-button--mini" target="_blank" v-if="gx_docente.dedicacion_upla=='TP'" :href="`${URLPDF}api/src/reportes/contrato_docente/TiempoParcial.php?&id_docente=${gx_docente.id_docente}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&filial=${filialSele}&fecha=${fechaAct}&ae_bcd=${token}`">
            <i  class="fas fa-file-pdf"></i>
            IMPRIMIR
        </a>
        <a class="el-button el-button--primary el-button--mini" target="_blank" v-else :href="`${URLPDF}api/src/reportes/contrato_docente/TiempoCompleto.php?&id_docente=${gx_docente.id_docente}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&filial=${filialSele}&fecha=${fechaAct}&ae_bcd=${token}`">
            <i  class="fas fa-file-pdf"></i>
            IMPRIMIR
        </a>
    </el-tooltip>
  </div>
  <div v-if="gx_docente.id_docente" class="ed-item ed-container">
    <div class="ed-item m-25 to-center sep-5 form-group">
      <label>FILIAL</label>
      <select v-model="filialSele" class="form-control" size="small">
        <option v-for="(filial, index) in filiales" :key="index" :value="filial.nombre_filial">
          {{filial.nombre_filial}}
        </option>
      </select>
    </div>
  </div>
  <div class="ed-item ed-container">
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>DNI</label>
      <el-input
        placeholder="DNI"
        v-model="gx_docente.id_docente"
        type="number"
        @keyup.enter="getDocente()"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>NOMBRES</label>
      <el-input
        placeholder="Docente..."
        v-model="gx_docente.nombre"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>DIRECCIÓN</label>
      <el-input
        placeholder="Direccion..."
        v-model="gx_docente.cdireccion"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>DEPARTAMENTO</label>
      <el-input
        v-model="gx_docente.cdepa"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>PROVINCIA</label>
      <el-input
        v-model="gx_docente.cprov"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>DISTRITO</label>
      <el-input
        v-model="gx_docente.cdist"
        size="mini"
        disabled>
      </el-input>
    </div>    
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>FACULTAD ADSCRITA</label>
      <el-input
        v-model="gx_docente.facultad_ads"
        size="mini"
        disabled>
      </el-input>
    </div>    
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>MAYOR GRADO</label>
      <el-input
        v-model="gx_docente.mayor_grado_academico"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>DENOMINACION GRADO</label>
      <el-input
        v-model="gx_docente.mencion_mayor_grado_academico"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>CARGO</label>
      <el-input
        v-model="gx_docente.cargo"
        size="mini"
        disabled>
      </el-input>
    </div>    
    <!-- <div class="ed-item sep-5 m-30 to-center form-group">
      <label>DEDICACION SP</label>
      <el-input
        v-model="gx_docente.dedicacion_sp"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>HORAS ADMINISTRATIVAS SP</label>
      <el-input
        v-model="gx_docente.horas_administrativas_sp"
        size="mini"
        disabled>
      </el-input>
    </div> -->
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>DEDICACION</label>
      <el-input
        v-model="gx_docente.dedicacion"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>HORAS ADMINISTRATIVAS</label>
      <el-input
        v-model="gx_docente.horas_administrativas_upla"
        size="mini"
        disabled>
      </el-input>
    </div>
    <div class="ed-item sep-5 m-30 to-center form-group">
      <label>HORAS LECTIVAS</label>
      <el-input
        v-model="gx_docente.tot_hlectivas"
        size="mini"
        disabled>
      </el-input>
    </div>
  </div>
  <div v-if="modals.modal_docente" class="modal">
    <buscar-docente @close='closeBuscarDocente' @sel="selDocenteBusqueda" />
  </div>
</div>
</template>


<script>
  /**
 * MIXING
 */
import mixingInit from '../../mixing/mixing_init.js'
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
      this.getFiliales()
      this.getFechaAct()
    },

    components: {
        buscarDocente
    },

    data: function () {
        return {
          modals:{
            modal_docente:false
          },
          gx_docente:{},
          filialSele:'SELECCIONE',
          filiales:[{"id_filial":"0","nombre_filial":"SELECCIONE"}],
          fechaAct:'',
          asignaturas:{}
        }
    },
    computed: {
      valid: function () {
        var doc=this.gx_docente
        var asig=this.asignaturas
        return (
          doc.cdepa!=null && doc.cdireccion!=null && doc.cdist!=null && doc.cprov!=null
          && doc.dedicacion!=null && doc.dedicacion_upla!=null && doc.horas_administrativas_upla!=null
          && doc.facultad_ads!=null && doc.grado_academico!=null && doc.mayor_grado_academico!=null
          && doc.nombre!=null && doc.tot_hlectivas!=null && doc.cargo!=null &&doc.tot_hlectivas>0
          && (doc.dedicacion=="TC" || asig.asignaturas!=null)
        )
      }
    },
    methods:{
      closeBuscarDocente(){
        this.modals.modal_docente=false
      },
      async selDocenteBusqueda(id_docente){
          this.gx_docente.id_docente = id_docente
          this.getDatosContratoDocente()
          this.closeBuscarDocente()
      },
      async getDatosContratoDocente(){
        this.axios.get(`${this.URL}js-contrato/${this.gx_docente.id_docente}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`,this.autho)
        .then((res) => {
          if(res.data.success){
            this.gx_docente=res.data.data
            if(this.gx_docente.cargo!="JEFE DE PRACTICAS"){
              this.gx_docente.cargo="DOCENTE"
            }
            if(this.gx_docente.mayor_grado_academico=="Bachiller" && this.gx_docente.grado_academico!=null){
              this.gx_docente.mayor_grado_academico=this.gx_docente.grado_academico
              this.gx_docente.mencion_mayor_grado_academico=this.gx_docente.mencion_grado
            }
            this.getAsignaturasDocente()
          }
        }).catch((err) => {
        });
      },
      async getAsignaturasDocente(){
        await this.axios.get(`${this.URL}contrato-asig-docente/${this.gx_docente.id_docente}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`,this.autho)
        .then((res) => {
          if(res.data.success){
            this.asignaturas=res.data.data
          }
        }).catch((err) => {
        });
      },
      async getFiliales(){
        await this.axios.get(`${this.URL}js-filial`,this.autho)
        .then((res) => {
          if(res.data.success){

            this.filiales=this.filiales.concat(res.data.data)
          }
        }).catch((err) => {
        });
      },
      getFechaAct(){
        var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
        var f=new Date();
        this.fechaAct=diasSemana[f.getDay()] + " " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
      }
    }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>

