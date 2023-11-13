<template>
<div class="ed-container init">
  <div class="ed-item gr-center">
    <h2 style="text-align: center">
      <strong>III. RASGOS DEL PERFIL DEL GRADUADO</strong>
    </h2>
  </div>
  <div class="ed-item ed-container">
    <div class="ed-item m-95 to-center sep-5 form-gr">
      <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="Detalle" v-model="gx_silabus_perfil.cdetalle">
      </el-input>
    </div>
    <div class="ed-item sep-5 gr-center">
      <el-button :disabled="!camposValidacion" @click="agregarPerfil" type="primary" size="medium">Agregar</el-button>
      <!-- <button :disabled="!camposValidacion" @click="agregarPerfil" :class="['btn btn-info btn-rounded btn-hov', !camposValidacion ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Completa el detalle">Agregar</button> -->
    </div>
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="silabusPerfil" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando rasgos de perfil graduado...">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="cdetalle" label="Detalle" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="50" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Eliminar" placement="left">
            <i @click="removerPerfil(reg.row)" class="fas fa-trash-alt pointer action red"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- <div v-if="silabusPerfil && silabusPerfil.length > 0" class="ed-item sep-2  table-content">
    <table class='table table-bordered table-responsive table-hover table-striped table-own'>
      <thead class='table-head'>
        <tr>
          <th>N°</th>
          <th>Asignatura</th>
          <th>Perdiodo</th>
          <th>Semestre</th>
          <th>Detalle</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody class='table-body' v-for="(perfil, index) of silabusPerfil" :key="index">
        <tr>
          <td>{{index + 1}}</td>
          <td>{{perfil.id_asignatura}}</td>
          <td>{{perfil.id_periodo}}</td>
          <td>{{perfil.id_semestre}}</td>
          <td>{{perfil.cdetalle}}</td>
          <td @click="removerPerfil(perfil)">
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

/**
 * MODELS
 */
import GxSilabusPerfilG from '../../../models/gx_silabus_perfilg.js'

/**
 * Componentes
 */
import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  props: ['curso_'],

  components: {
    loader
  },


  mounted() {
    this.init()
  },

  data() {
    return {
      gx_silabus_perfil: new GxSilabusPerfilG(),
      silabusPerfil: [],
    }
  },

  methods: {
    init() {
      this.getPerfil(this.curso_, this.periodo)
    },

    agregarPerfil: async function () {
      this.gx_silabus_perfil.id_asignatura = this.curso_.id_curso
      this.gx_silabus_perfil.id_modalidad = this.curso_.id_modalidad
      this.gx_silabus_perfil.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_perfil.id_periodo = this.periodo.id_periodo
      this.gx_silabus_perfil.id_semestre = this.periodo.id_semestre
      await this.insertarPerfil()
    },
    insertarPerfil: async function () {
      this.ajaxLoad = true

      await this.axios.post(`${this.URL}js-ins-silabus-perfilg`, this.gx_silabus_perfil, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_perfil.id_silabus_perfil = res.data.id
            this.silabusPerfil.push(this.gx_silabus_perfil)
            this.gx_silabus_perfil = new GxSilabusPerfilG()
          }
        })
        .catch(err => {
          console.dir(err)
        })

      this.ajaxLoad = false
    },

    async getPerfil({
      id_curso,
      id_modalidad
    }, {
      id_periodo,
      id_semestre
    }) {
      this.ajaxLoad = true
      try {
        const res = await this.axios.get(`${this.URL}js-silabus-perfilg/${id_curso}/${id_periodo}/${id_semestre}/${id_modalidad}`, this.autho)
        if (res.status === 200) {
          this.silabusPerfil = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.silabusPerfil = []
      }
      this.ajaxLoad = false
    },
    removerPerfil: function ({
      idreg
    }) {
      this.ajaxLoad = true
      this.axios.delete(`${this.URL}js-del-silabus-perfil/${idreg}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusPerfil = this.silabusPerfil.filter(inv => this.silabusPerfil.idreg != idreg)
            this.getPerfil(this.curso_, this.periodo)
          }
        })
        .catch(err => {
          console.dir(err)
        })
      this.ajaxLoad = false
    },

  },

  computed: {
    camposValidacion: function () {
      return (
        this.gx_silabus_perfil.cdetalle != ''
      )
    },
  },
}
</script>

