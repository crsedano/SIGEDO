<template>
<div class="ed-container init">
  <div class="ed-item s-95 to-center">
    <h2 style="text-align: center">
      <strong>VI. COMPETENCIAS</strong>
    </h2>
  </div>
  <div class="ed-item ed-container">
    <div class="ed-item m-70 form-group sep-5">
      <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="Detalles Competencia" v-model="gx_silabus_competencia.cdetalle"></el-input>
      <!-- <label>Detalle</label>
              <textarea v-model="gx_silabus_competencia.cdetalle" class="form-control"></textarea> -->
    </div>
  </div>
  <div class="ed-item sep-5 gr-center">
    <el-button :disabled="!CompetenciaValid" @click="agregarCompet" type="primary" size="medium">Agregar</el-button>
    <!-- <button :disabled="!CompetenciaValid" @click="agregarCompet" :class="['btn btn-info btn-rounded btn-hov', !CompetenciaValid ? 'hint--right hint--bounce hint--error':'']"
              aria-label="Complete todos los campos">Agregar</button> -->
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="silabusCompetencia" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando competencias...">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cdetalle" label="Detalle" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="50" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Eliminar" placement="left">
            <i @click="removerCom(reg.row)" class="fas fa-trash-alt pointer action red"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- <div v-if="silabusCompetencia.length > 0" class="ed-item sep-5 table-content">
            <table class='table table-bordered table-responsive table-hover table-striped table-own'>
              <thead class='table-head'>
                <tr>
                  <th>N°</th>
                  <th>Detalle</th>
                  <th></th>
                </tr>
              </thead>
              <tbody class='table-body' v-for="(comp, index) in silabusCompetencia" :key="index">
                <tr>
                  <td>{{index + 1}}</td>
                  <td>{{comp.cdetalle}}</td>
                  <td @click="removerCom(index, comp.idreg)">
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

import GxSilabusCompetencia from '../../../models/gx_silabus_competencia'

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
      gx_silabus_competencia: new GxSilabusCompetencia(),
      silabusCompetencia: [],
    }
  },

  computed: {
    CompetenciaValid: function () {
      return (
        this.gx_silabus_competencia.cdetalle != ''
      )
    },
  },

  methods: {
    async init() {

      await this.getSilabusCompetencia(this.curso_, this.periodo)
    },

    agregarCompet: async function () {
      this.gx_silabus_competencia.id_asignatura = this.curso_.id_curso
      this.gx_silabus_competencia.id_modalidad = this.curso_.id_modalidad
      this.gx_silabus_competencia.ccodusua = this.identity.id_usuario
      this.gx_silabus_competencia.id_periodo = this.periodo.id_periodo
      this.gx_silabus_competencia.id_semestre = this.periodo.id_semestre

      await this.insertarSilabusCompetencia()
    },

    insertarSilabusCompetencia: async function () {
      this.ajaxLoad = true
      await this.axios.post(`${this.URL}js-ins-silabus-competencia`, this.gx_silabus_competencia, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_competencia.idreg = res.data.id
            this.gx_silabus_competencia = new GxSilabusCompetencia()
            this.getSilabusCompetencia(this.curso_, this.periodo)
          }
        })
        .catch(err => {
          console.dir(err)
        })
      this.ajaxLoad = false
    },

    async getSilabusCompetencia({
      id_curso,
      id_modalidad
    }, {
      id_periodo,
      id_semestre
    }) {
      this.ajaxLoad = true
      try {
        const res = await this.axios.get(`${this.URL}js-silabus-competencia/${id_curso}/${id_periodo}/${id_semestre}/${id_modalidad}`, this.autho)

        if (res.status === 200) {
          this.silabusCompetencia = res.data.data

        }
      } catch (err) {
        console.dir(err)
        this.silabusCompetencia = null
      }
      this.ajaxLoad = false
    },

    removerCom: async function ({
      idreg
    }) {
      this.ajaxLoad = true
      await this.axios.delete(`${this.URL}js-del-silabus-compotencia/${idreg}`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.silabusCompetencia = this.silabusCompetencia.filter(comp => this.silabusCompetencia.idreg != idreg)
            this.getSilabusCompetencia(this.curso_, this.periodo)
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
