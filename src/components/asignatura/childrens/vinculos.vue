<template>
<div class="ed-container init">
  <div class="ed-item gr-center">
    <h2 v-if="curso_.tipo_asignatura == 'G'" style="text-align: center">
      <strong>10.1 VÍNCULOS A SITIOS DE INTERES</strong>
    </h2>
    <h2 v-if="curso_.tipo_asignatura == 'E'" style="text-align: center">
      <strong>11.1 VÍNCULOS A SITIOS DE INTERES</strong>
    </h2>
    <h2 v-if="curso_.tipo_asignatura == 'T'" style="text-align: center">
      <strong>XII. VÍNCULOS A SITIOS DE INTERES</strong>
    </h2>
  </div>
  <div class="ed-item sep-20 ed-container group">
    <div class="ed-item ed-container">
      <div class="ed-item m-50 to-center sep-5 form-gr">
        <el-input v-model="gx_silabus_refweb.autor" placeholder="Autor"></el-input>
        <!-- <label>Autor</label>
          <input v-model="gx_silabus_refweb.autor" type="text" class="form-control"> -->
      </div>
      <div class="ed-item m-50 to-center sep-5 form-gr">
        <el-input disabled v-model="gx_silabus_refweb.anio_public" placeholder="Año publicación"></el-input>
        <!-- <label>Año publicación</label>
          <input v-model="gx_silabus_refweb.anio_public" type="number" class="form-control"> -->
      </div>
      <div class="ed-item m-50 to-center sep-5 form-gr">
        <el-input v-model="gx_silabus_refweb.titulo" placeholder="Título"></el-input>
        <!-- <label>Título</label>
          <input v-model="gx_silabus_refweb.titulo" type="text" class="form-control"> -->
      </div>
      <div class="ed-item m-50 to-center sep-5 form-gr">
        <el-input v-model="gx_silabus_refweb.url" placeholder="URL"></el-input>
        <!-- <label>URL</label>
          <input v-model="gx_silabus_refweb.url" type="text" class="form-control"> -->
      </div>
      <div class="ed-item sep-5 form-gr">
        <el-input v-model="gx_silabus_refweb.descripcion" placeholder="Descripción"></el-input>
        <!-- <label>Descripción</label>
          <input v-model="gx_silabus_refweb.descripcion" type="text" class="form-control"> -->
      </div>
    </div>
    <div class="ed-item sep-5 gr-center">
      <el-button :disabled="!refwebValid" @click="agregarRefweb" type="primary" size="medium">Agregar</el-button>
      <!-- <button :disabled="!refwebValid" @click="agregarRefweb" :class="['btn btn-info btn-rounded btn-hov', !refwebValid ? 'hint--right hint--bounce hint--error':'']"
          aria-label="Complete todos los campos">Agregar</button> -->
    </div>

    <div class="ed-item sep-10">
      <el-table border stripe fit :data="silabusRefweb" height="300" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando bibliografia...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="autor" label="Autor" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="anio_public" label="Fecha" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="titulo" label="Título" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="url" label="URL" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="descripcion" label="Descripción" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            <el-tooltip content="Eliminar" placement="left">
              <i @click="removerRefweb(reg.row.id_silabus_refweb)" class="fas fa-trash-alt pointer action red"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!-- <div v-if="silabusRefweb.length > 0" class="ed-item sep-5 table-content">
        <table class='table table-bordered table-responsive table-hover table-striped table-own'>
          <thead class='table-head'>
            <tr>
              <th>N°</th>
              <th>Autor</th>
              <th>Año de Publicación</th>
              <th>Título</th>
              <th>URL</th>
              <th>Descripción</th>
              <th></th>
            </tr>
          </thead>
          <tbody class='table-body' v-for="(ref, index) in silabusRefweb" :key="index">
            <tr>
              <td>{{index + 1}}</td>
              <td>{{ref.autor}}</td>
              <td>{{ref.anio_public}}</td>
              <td>{{ref.titulo}}</td>
              <td>{{ref.url}}</td>
              <td>{{ref.descripcion}}</td>
              <td @click="removerRefweb(index, ref.id_silabus_refweb)">
                <i class="fas fa-trash-alt pointer action red"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->
  </div>
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

import GxSilabusRefweb from '../../../models/gx_silabus_refweb'

import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  props: ['curso_'],

  mounted() {
    this.gx_silabus_refweb.anio_public=this.getToday()
    this.init()
  },

  components: {
    loader
  },

  data() {
    return {
      gx_silabus_refweb: new GxSilabusRefweb(),
      silabusRefweb: [],

    }
  },

  computed: {
    refwebValid: function () {
      return (
        this.gx_silabus_refweb.titulo != '' &&
        this.gx_silabus_refweb.url != '' &&
        this.gx_silabus_refweb.descripcion != ''
      )
    },
  },

  methods: {

    async init() {

      await this.getRefwebSilabus(this.curso_, this.periodo)

    },

    getToday(){
    let hoy = new Date()
    let dd = hoy.getDate()
    let mm = hoy.getMonth() + 1
    let yyyy = hoy.getFullYear()

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    return `${yyyy}-${mm}-${dd}`
  },

    async getRefwebSilabus({
      id_curso,
      id_filial,
      id_modalidad
    }, {
      id_periodo,
      id_semestre
    }) {
      this.ajaxLoad = true
      try {
        const res = await this.axios.get(`${this.URL}js-silabus-refweb/${id_curso}/2/${id_modalidad}/${id_periodo}/${id_semestre}`, this.autho)

        if (res.status === 200) {
          this.silabusRefweb = res.data.data

        }
      } catch (err) {
        this.silabusRefweb = null
        console.dir(err)
      }
      this.ajaxLoad = false
    },


    insertarSilabusRefweb: async function () {
      this.loadAjax = true
      await this.axios.post(`${this.URL}js-ins-silabus-refweb`, this.gx_silabus_refweb, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_refweb.id_silabus_refweb = res.data.id
            this.gx_silabus_refweb = new GxSilabusRefweb()
            this.gx_silabus_refweb.anio_public=this.getToday()
            this.getRefwebSilabus(this.curso_, this.periodo)
          }
        })
        .catch(err => {
          console.dir(err)
        })
      this.loadAjax = false
    },

    agregarRefweb: async function () {
      this.gx_silabus_refweb.id_asignatura = this.curso_.id_curso
      this.gx_silabus_refweb.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_refweb.id_docente = this.identity.dni
      this.gx_silabus_refweb.id_periodo = this.periodo.id_periodo
      this.gx_silabus_refweb.id_semestre = this.periodo.id_semestre
      this.gx_silabus_refweb.id_modalidad = this.curso_.id_modalidad
      this.gx_silabus_refweb.id_filial = 2
      await this.insertarSilabusRefweb()
    },

    removerRefweb: async function (id_silabus_refweb) {
      this.loadAjax = true
      await this.axios.delete(`${this.URL}js-del-silabus-refweb/${id_silabus_refweb}`, this.autho)
        .then(res => {

          if (res.data.success) {
            this.silabusRefweb = this.silabusRefweb.filter(inv => this.silabusRefweb.id_silabus_refweb != id_silabus_refweb)
            this.getRefwebSilabus(this.curso_, this.periodo)
          }
        })
        .catch(err => {
          console.dir(err)
          this.silabusRefweb = null
        })
      this.loadAjax = false
    },
  }
}
</script>
