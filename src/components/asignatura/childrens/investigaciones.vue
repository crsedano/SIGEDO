<template>
<div class="ed-container init">
  <div class="ed-item s-95 to-center">
    <h2 v-if="curso_.tipo_asignatura == 'G'" style="text-align: center">
      <strong>V. INVESTIGACION FORMATIVA</strong>
    </h2>
    <h2 v-if="curso_.tipo_asignatura == 'E'" style="text-align: center">
      <strong>VI. INVESTIGACION FORMATIVA</strong>
    </h2>
  </div>

  <div class="ed-item ed-container">
    <div class="ed-item m-70 form-group sep-5">
      <!-- <label>Acciones de Investigación</label>
            <textarea v-model="gx_silabus_investig.acciones_invest" class="form-control"></textarea> -->
      <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="Acciones de Investigación" v-model="gx_silabus_investig.acciones_invest">
      </el-input>
    </div>
    <div class="ed-item m-30 form-group sep-5">
      <el-input placeholder="Nivel de logro" v-model="gx_silabus_investig.nivel_logro"></el-input>
      <!-- <label>Nivel de Logro</label>
            <input v-model="gx_silabus_investig.nivel_logro" type="text" class="form-control"> -->
    </div>
  </div>
  <div class="ed-item sep-5 gr-center">
    <el-button :disabled="!investigacionValid" @click="agregarInv" type="primary" size="medium">Agregar</el-button>
    <!-- <button :disabled="!investigacionValid" @click="agregarInv" :class="['btn btn-info btn-rounded btn-hov', !investigacionValid ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Complete todos los campos">Agregar</button> -->
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="silabusInvestig" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando investigaciones...">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="acciones_invest" label="Acciones" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column prop="nivel_logro" label="Logro" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="50" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Eliminar" placement="left">
            <i @click="removerInv(reg.row)" class="fas fa-trash-alt pointer action red"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- <div v-if="silabusInvestig.length > 0" class="ed-item sep-5 table-content">
          <table class='table table-bordered table-responsive table-hover table-striped table-own'>
            <thead class='table-head'>
              <tr>
                <th>N°</th>
                <th>Descripción</th>
                <th>Tipo Objetivo</th>
                <th></th>
              </tr>
            </thead>
            <tbody class='table-body' v-for="(inv, index) in silabusInvestig" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{inv.acciones_invest}}</td>
                <td>{{inv.nivel_logro}}</td>
                <td @click="removerInv(index, inv.id_silabus_investig)">
                  <i class="fas fa-trash-alt pointer action red"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div> -->
  <!-- <div v-if="ajaxLoad" class="modal f-row f-center">
          <loader />
        </div> -->
</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

import GxSilabusInvestig from '../../../models/gx_silabus_investig'

import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  props: ['curso_'],



  mounted() {
    this.init()
  },

  components: {
    loader
  },

  data() {
    return {

      gx_silabus_investig: new GxSilabusInvestig(),
      silabusInvestig: [],

    }
  },
  computed: {
    investigacionValid: function () {
      return (
        this.gx_silabus_investig.acciones_invest != '' &&
        this.gx_silabus_investig.nivel_logro != ''
      )
    },
  },

  methods: {
    async init() {
      await this.getInvestigacionSilabus(this.curso_, this.periodo)
    },

    agregarInv: async function () {
      this.ajaxLoad = true
      this.gx_silabus_investig.id_asignatura = this.curso_.id_curso
      this.gx_silabus_investig.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_investig.id_docente = this.identity.dni
      this.gx_silabus_investig.id_periodo = this.periodo.id_periodo
      this.gx_silabus_investig.id_semestre = this.periodo.id_semestre
      this.gx_silabus_investig.id_modalidad = this.curso_.id_modalidad
      this.gx_silabus_investig.id_filial = 2

      await this.insertarSilabusInvestigacion()
      this.ajaxLoad = false
    },

    insertarSilabusInvestigacion: async function () {
      this.ajaxLoad = true
      await this.axios.post(`${this.URL}js-ins-silabus-investig`, this.gx_silabus_investig, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_investig.id_silabus_investig = res.data.id
            this.getInvestigacionSilabus(this.curso_, this.periodo)
            this.gx_silabus_investig = new GxSilabusInvestig()
          }
        })
        .catch(err => {
          console.dir(err)
        })
      this.ajaxLoad = false
    },

    async getInvestigacionSilabus({
      id_curso,
      id_filial,
      id_modalidad
    }, {
      id_periodo,
      id_semestre
    }) {
      this.ajaxLoad = true
      try {
        const res = await this.axios.get(`${this.URL}js-silabus-investig/${id_curso}/${2}/${id_modalidad}/${id_periodo}/${id_semestre}`, this.autho)

        if (res.status === 200) {
          this.silabusInvestig = res.data.data

        }
      } catch (err) {
        this.silabusInvestig = null
        console.dir(err)
      }
      this.ajaxLoad = false
    },


    // getInvestigacionSilabus: function () {
    //   this.ajaxLoad = true
    //   this.silabusInvestig = []
    //
    //   this.axios.get(`${this.URL}js-silabus-investig/${this.curso_.id_curso}/${this.curso_.id_filial}/${this.curso_.id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
    //     .then(res => {
    //       if (res.data.success) {
    //         this.silabusInvestig = res.data.data
    //       }
    //     })
    //     .catch(err => {
    //       console.dir(err)
    //       this.ajaxLoad = false
    //     })
    //
    //
    // },

    removerInv: function ({
      id_silabus_investig
    }) {
      this.ajaxLoad = true
      this.axios.delete(`${this.URL}js-del-silabus-investig/${id_silabus_investig}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusInvestig = this.silabusInvestig.filter(inv => this.silabusInvestig.id_silabus_investig != id_silabus_investig)
            this.getInvestigacionSilabus(this.curso_, this.periodo)
          }
        })
        .catch(err => {
          console.dir(err)
        })
      this.ajaxLoad = false

    },

  }
}
</script>
