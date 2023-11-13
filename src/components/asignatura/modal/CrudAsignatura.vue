<template>
<div class="sub-main" style="display: flex; align-items: center">
  <i @click="close" class="fa fa-window-close action red iclose"></i>

  
  <div class="ed-item ed-container init">
    <div class="ed-item m-40 to-center">
      <el-alert
      v-if="!readyGeneral"
      title="Atención"
      type="error"
      description="Necesita asignar un curso principal (Asignatura General)"
      show-icon></el-alert>
    </div>

    <el-form size="mini" class="ed-container ed-item to-center">
      <el-form-item class="ed-item m-30" label="Código">
        <el-input placeholder="Código" v-model="gxAsignatura.cod_asignatura"></el-input>
      </el-form-item>
      <el-form-item class="ed-item m-70" label="Nombre">
        <el-input placeholder="Nombre" v-model="gxAsignatura.nombre"></el-input>
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Horas Teóricas Presencial" style="display: flex; align-items: center;">
        <el-input-number size="mini" controls-position="right" v-model="gxAsignatura.horas_teoricas" :min="0"></el-input-number>
        <!-- <el-input placeholder="Horas Teóricas Presencial" v-model="gxAsignatura.horas_teoricas" type="number" min="1"></el-input> -->
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Horas Prácticas Presencial" style="display: flex; align-items: center;">
        <el-input-number size="mini" controls-position="right" v-model="gxAsignatura.horas_practicas" :min="0"></el-input-number>
        <!-- <el-input placeholder="Horas Prácticas Presencial" v-model="gxAsignatura.horas_practicas"></el-input> -->
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Horas Teóricas SP Presencial" style="display: flex; align-items: center;">
        <el-input-number size="mini" controls-position="right" v-model="gxAsignatura.sp_phorasteoricas" :min="0"></el-input-number>
        <!-- <el-input placeholder="Horas Prácticas SPT" v-model="gxAsignatura.sp_phorasteoricas"></el-input> -->
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Horas Prácticas SP Presencial" style="display: flex; align-items: center;">
        <el-input-number size="mini" controls-position="right" v-model="gxAsignatura.sp_phoraspracticas" :min="0"></el-input-number>
        <!-- <el-input placeholder="Horas Prácticas SPP" v-model="gxAsignatura.sp_phoraspracticas"></el-input> -->
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Horas Teóricas SP Virtual" style="display: flex; align-items: center;">
        <el-input-number size="mini" controls-position="right" v-model="gxAsignatura.sp_vhorasteoricas" :min="0"></el-input-number>
        <!-- <el-input placeholder="Horas Prácticas SVT" v-model="gxAsignatura.sp_vhorasteoricas"></el-input> -->
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Horas Prácticas SP Virtual" style="display: flex; align-items: center;">
        <el-input-number size="mini" controls-position="right" v-model="gxAsignatura.sp_vhoraspracticas" :min="0"></el-input-number>
        <!-- <el-input placeholder="Horas Prácticas SVP" v-model="gxAsignatura.sp_vhoraspracticas"></el-input> -->
      </el-form-item>
      <el-form-item v-if="id_facultad == 2" class="ed-item m-50 l-30" style="display: flex; align-items: center;">
        <label style="color: red">Factor Teoría</label>
        <el-input-number size="mini" controls-position="right" v-model="gxAsignatura.factor_teoria" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item v-if="id_facultad == 2" class="ed-item m-50 l-30" style="display: flex; align-items: center;">
        <label style="color: red">Factor Práctica</label>
        <el-input-number size="mini" controls-position="right" v-model="gxAsignatura.factor_practica" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Créditos" style="display: flex; align-items: center;">
        <el-input-number size="mini" controls-position="right" v-model="gxAsignatura.creditos" :min="1"></el-input-number>
        <!-- <el-input placeholder="Créditos" v-model="gxAsignatura.creditos"></el-input> -->
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Área Formación">
        <el-select filterable v-model="gxAsignatura.id_area_formacion" placeholder="Seleccionar Área">
          <!-- <el-option label="SELECCIONAR" :value="0"></el-option> -->
          <el-option v-for="(a, index) in areasF" :key="index" :label="a.nombre" :value="a.id_area_formacion"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Ciclo">
        <el-select filterable v-model="gxAsignatura.ciclo" placeholder="Seleccionar Ciclo">
          <el-option label="1" :value="1"></el-option>
          <el-option label="2" :value="2"></el-option>
          <el-option label="3" :value="3"></el-option>
          <el-option label="4" :value="4"></el-option>
          <el-option label="5" :value="5"></el-option>
          <el-option label="6" :value="6"></el-option>
          <el-option label="7" :value="7"></el-option>
          <el-option label="8" :value="8"></el-option>
          <el-option label="9" :value="9"></el-option>
          <el-option label="10" :value="10"></el-option>
          <el-option label="11" :value="11"></el-option>
          <el-option label="12" :value="12"></el-option>
          <el-option label="13" :value="13"></el-option>
          <el-option label="14" :value="14"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Tipo">
        <el-select filterable v-model="gxAsignatura.ctipocurso" placeholder="Seleccionar Tipo">
          <el-option label="Específico" value="E"></el-option>
          <el-option label="General" value="G"></el-option>
          <el-option label="Taller Técnico" value="T"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="ed-item m-50 l-30" label="Curso">
        <el-select filterable v-model="gxAsignatura.idtipocurso" placeholder="Seleccionar">
          <el-option label="Normal" :value="1"></el-option>
          <el-option label="Electivo" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- <div class="ed-item m-50 l-30">
        <el-button type="info" size="mini" plain>Asignar Asignatura General</el-button>
      </div> -->
    </el-form>

    <div class="ed-item txt-center">
      <el-button v-if="isEdit" :disabled="!readyGeneral" @click="editAsignatura" type="warning" plain size="small">Editar</el-button>
      <el-button v-if="!isEdit" :disabled="!readyGeneral" @click="createAsignatura" type="primary" plain size="small">Crear</el-button>
      <el-button @click="modalGeneral = true" v-if="gxAsignatura.ctipocurso == 'G'" type="primary" plain size="small">Seleccionar General</el-button>
      <el-button @click="modalPreRequisito = true" type="primary" plain size="small">Seleccionar Pre Requisitos</el-button>
    </div>
  </div>

  <div v-if="modalGeneral" class="modal">
    <asignaturas-generales @general="selectGeneral" @close="closeModalGeneral" :asignatura="gxAsignatura"/>
  </div>

  <div v-if="modalPreRequisito" class="modal">
    <asignaturasPreRequisito @general="selectPreRequisito" @close="closeModalPreRequisito" :asignatura="gxAsignatura"/>
  </div>


  <!-- <div class="ed-item sep-10">
    <el-table border stripe fit :data="arrPlanes" height="250" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="planLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column fixed type="index" min-width="30" align="center" header-align="center"></el-table-column>
      <el-table-column prop="anio" label="Plan" min-width="100" align="center" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="60" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip class="item" effect="dark" content="Editar Color" placement="left-start">
            <el-button plain @click="showEscuelas(reg.row)" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div> -->
</div>
</template>

<script>
// mixing
import mixingInit from '../../../mixing/mixing_init.js'

// models
import GxAsignatura from '../../../models/gx_asignatura.js'

import asignaturasGenerales from './AsignaturasGenerales.vue'

import asignaturasPreRequisito from './AsignaturaPreRequisito.vue'

export default {
  mixins: [
    mixingInit
  ],
  
  props: [
    'asignatura',
    'id_facultad',
    'id_escuela',
    'id_plan_estudio'
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
    asignaturasGenerales,
    asignaturasPreRequisito
  },

  data: function () {
    return {
      gxAsignatura: new GxAsignatura(),
      areasF: null,
      id_area_formacion: 0,
      modalGeneral: false,
      modalPreRequisito: false
    }
  },

  computed: {
    isEdit() {
      return this.asignatura ? true : false
    },

    readyGeneral () {
      if(this.gxAsignatura.ctipocurso != 'G') return true
      return (
        this.gxAsignatura.id_asignatura_general != '' &&
        this.gxAsignatura.id_asignatura_general != 0 &&
        this.gxAsignatura.cod_asignatura_general != '' &&
        this.gxAsignatura.id_asignatura_general &&
        this.gxAsignatura.cod_asignatura_general
      )
    }
  },

  watch: {
  
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      this.$set(this.gxAsignatura, 'id_facultad', this.id_facultad)
      this.gxAsignatura.id_escuela = this.id_escuela
      this.gxAsignatura.id_plan_estudio = this.id_plan_estudio
      if(this.asignatura) {
        this.gxAsignatura.cod_asignatura = this.asignatura.cod_asignatura
        this.gxAsignatura.nombre = this.asignatura.nombre
        this.gxAsignatura.horas_teoricas = this.asignatura.horas_teoricas
        this.gxAsignatura.horas_practicas = this.asignatura.horas_practicas
        this.gxAsignatura.sp_phorasteoricas = this.asignatura.sp_phorasteoricas
        this.gxAsignatura.sp_phoraspracticas = this.asignatura.sp_phoraspracticas
        this.gxAsignatura.sp_vhorasteoricas = this.asignatura.sp_vhorasteoricas
        this.gxAsignatura.sp_vhoraspracticas = this.asignatura.sp_vhoraspracticas
        this.gxAsignatura.creditos = this.asignatura.creditos
        this.gxAsignatura.id_area_formacion = this.asignatura.id_area_formacion
        this.gxAsignatura.ciclo = this.asignatura.ciclo
        this.gxAsignatura.ctipocurso = this.asignatura.ctipocurso
        this.gxAsignatura.idtipocurso = this.asignatura.idtipocurso
        this.gxAsignatura.id_plan_estudio = this.asignatura.id_plan_estudio
        this.gxAsignatura.id_asignatura_general = this.asignatura.id_asignatura_general
        this.gxAsignatura.id_asignatura = this.asignatura.id_asignatura
        this.gxAsignatura.cod_asignatura_general = this.asignatura.cod_asignatura_general
        this.gxAsignatura.id_escuela = this.asignatura.id_escuela
        this.gxAsignatura.factor_teoria = this.asignatura.factor_teoria
        this.gxAsignatura.factor_practica = this.asignatura.factor_practica
      }

      await this.getAreasForm()

      loading.close()
    },

    async getAreasForm () {
      try {

        const res = await this.axios.get(`${this.URL}js-get-area-form`)

        if (res.status !== 200) return

        this.areasF = res.data.data.map(a => {
          a.id_area_formacion = parseInt(a.id_area_formacion)
          return a
        })

      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async editAsignatura () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        // const res = await this.axios.post(`${this.URL}v1/planesEstudio/updateAsignatura`, this.gxAsignatura)
        const res = await this.axios.put(`${this.URL_}v2/asignaturas/edit/${this.gxAsignatura.id_asignatura}`, this.gxAsignatura)
        if(res.status !== 201) {
          loading.close()
          return
        }

        this.close()
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async createAsignatura () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL_}v2/asignaturas/create`, this.gxAsignatura)

        if(res.status !== 201) {
          loading.close()
          return
        }
        this.close()
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    selectGeneral(payload) {
      this.gxAsignatura.id_asignatura_general = payload.id_asignatura_general
      this.gxAsignatura.cod_asignatura_general = payload.cod_asignatura_general
      this.closeModalGeneral()
    },

     selectPreRequisito(payload) {
      this.gxAsignatura.id_asignatura_general = payload.id_asignatura_general
      this.gxAsignatura.cod_asignatura_general = payload.cod_asignatura_general
      this.closeModalPreRequisito()
    },

    closeModalGeneral () {
      this.modalGeneral = false
    },

    closeModalPreRequisito () {
      this.modalPreRequisito = false
    },

    close () {
      this.$emit('close')
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

