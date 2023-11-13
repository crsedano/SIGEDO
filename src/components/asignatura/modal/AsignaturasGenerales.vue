<template>
  <div class="ed-container init sub-main">
    <i @click="close" class="fa fa-window-close action red iclose"></i>
    <div class="ed-item sep-10 txt-center">
      <h1>Asociar Asignatura General</h1>
    </div>

    <div class="ed-item ed-container">
      <div class="ed-item m-40 to-center">
        <el-alert
        v-if="asigGeneral"
        title="Asignatura asociada actualmente"
        type="info"
        :description="`${asigGeneral.nombre}(${asigGeneral.plan.anio}) de la escuela de ${asigGeneral.escuela.nombre} de la facultad de ${asigGeneral.escuela.facultad.nombre}`"
        show-icon></el-alert>
      </div>
    </div>

    <div class="ed-item m-40 to-center">
      <label>Buscar Asignatura</label>
      <el-input size="mini" @keyup.enter.native="searchAsignatura" v-model="q"></el-input>
    </div>

    <div class="ed-item gr-center">
      <el-button @click="selectSelf" type="danger" size="mini">Asignar asi mismo</el-button>
    </div>

    <div class="ed-item">
      <el-table @row-click="selectAsig" border stripe fit :data="arr" height="250" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando competencias...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Asignatura" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela.nombre" label="Escuela" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            {{ reg.row.id_asignatura == asigGeneral.id_asignatura ? 'PRINCIPAL' : ''}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import mixingInit from '../../../mixing/mixing_init.js'

export default {
  mixins: [
    mixingInit
  ],
  
  props: ['asignatura'],

  mounted () {
    this.init()
  },

  data ()  {
    return {
      asigGeneral: null,
      q: '',
      arr: null
    }
  },

  methods: {
    init () {
      this.getAsignaturaGeneral()
    },

    async getAsignaturaGeneral () {
      let { id_asignatura_general } = this.asignatura
      if(id_asignatura_general == '' || id_asignatura_general == 0 || !id_asignatura_general) return

      try {
        const res = await this.axios.get(`${this.URL_}v2/asignaturas/show/${id_asignatura_general}`)
        
        if(res.status !== 200) return 

        this.asigGeneral = res.data.asignatura
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async searchAsignatura () {
      if(this.q == '') return
      try {
        const res = await this.axios.get(`${this.URL_}v2/asignaturas/showGeneralByFacultad/${this.asignatura.id_facultad}/${this.q}/${this.asignatura.id_plan_estudio}`)

        if(res.status !== 200) return

        this.arr = res.data.asignaturas
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    selectAsig (row) {
      this.$emit('general', {
        id_asignatura_general: row.id_asignatura,
        cod_asignatura_general: row.cod_asignatura
      })
    },

    selectSelf() {
      this.$emit('general', {
        id_asignatura_general: 111,
        cod_asignatura_general: 111
      })
    },

    close () {
      this.$emit('close')
    }
  }
}
</script>

