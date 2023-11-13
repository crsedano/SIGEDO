<template>
<div class="ed-container init">
  <div class="ed-item txt-center">
    <h1>
      <strong>Administrar Cronograma</strong>
    </h1>
  </div>

  <div class="ed-item ed-container sep-5">
    <h2 class="ed-item txt-center">Cronograma Presencial</h2>
    <el-card v-for="(cronograma, index) in cronogramaPresencial" :key="index" shadow="hover" class="ed-item l-50 sep-5 box-card">
      <div slot="header" class="clearfix">
        <div><strong>Actividad:</strong> {{cronograma.actividad.nombre_actividad}}</div>
        <el-button @click="store(cronograma)" size="mini" style="float: right" type="primary">Guardar</el-button>
      </div>

      <div class="text item">
        <template v-if="isExamen(cronograma)">
          <label>Fecha Inicio</label>
          <el-input type="date" size="mini" v-model="cronograma.finicio" placeholder="Fecha Inicio"></el-input>
          <label>Fecha Fin</label>
          <el-input type="date" size="mini" v-model="cronograma.ffin" placeholder="Fecha Fin"></el-input>
        </template>
        <template v-else>
          <label>Fecha</label>
          <el-input type="date" size="mini" v-model="cronograma.finicio" placeholder="Fecha"></el-input>
        </template>
      </div>
      
    </el-card>
  </div>

  <div class="ed-item ed-container sep-5">
    <h2 class="ed-item txt-center">Cronograma Semi Presencial</h2>
    <el-card v-for="(cronograma, index) in cronogramaSemiPresencial" :key="index" shadow="hover" class="ed-item l-50 sep-5 box-card">
      <div slot="header" class="clearfix">
        <div><strong>Actividad:</strong> {{cronograma.actividad.nombre_actividad}}</div>
        <el-button @click="store(cronograma)" size="mini" style="float: right" type="primary">Guardar</el-button>
      </div>

      <div class="text item">
        <template v-if="isExamen(cronograma)">
          <label>Fecha Inicio</label>
          <el-input type="date" size="mini" v-model="cronograma.finicio" placeholder="Fecha Inicio"></el-input>
          <label>Fecha Fin</label>
          <el-input type="date" size="mini" v-model="cronograma.ffin" placeholder="Fecha Fin"></el-input>
        </template>
        <template v-else>
          <label>Fecha</label>
          <el-input type="date" size="mini" v-model="cronograma.finicio" placeholder="Fecha"></el-input>
        </template>
      </div>
      
    </el-card>
  </div>



  <!-- <div class="ed-item ed-container">
    <div class="ed-item sep-5">
      <label>Cargo</label>
      <el-input size="mini" v-model="gxCargo.nombre"></el-input>
    </div>
    <div class="ed-item sep-5">
      <label>Nivel</label>
      <el-input-number size="mini" v-model="gxCargo.nivel" :min="0" :max="1"></el-input-number>
    </div>
  </div>

  <div class="ed-item gr-center">
    <el-button v-if="isEdit" @click="updateCargo" size="mini" type="primary">Editar</el-button>
    <el-button v-else size="mini" @click="storeCargo" type="primary">Crear</el-button>
    <el-button v-if="isEdit" @click="cancelEdit" size="mini" type="danger">Cancelar</el-button>
  </div> -->
  
  <!-- <div class="ed-item sep-10">
    <el-table border stripe fit :data="arrData" height="310" highlight-current-row :row-class-name="tableRowClassName">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="id_cargo" label="ID" min-width="20" align="center" header-align="center"></el-table-column>
      <el-table-column prop="nombre" label="Cargo" min-width="200" align="center" header-align="center"></el-table-column>
      <el-table-column label="Activo" min-width="20" align="center" header-align="center">
        <template slot-scope="reg">
          {{reg.row.active == 1 ? 'SI' : 'NO'}}
        </template>
      </el-table-column>
      <el-table-column label="*" min-width="70" align="center" header-align="center">
        <template slot-scope="reg">
          <el-button size="mini" @click="goEdit(reg.row)" plain type="primary">Ir a Edición</el-button>
          <el-button v-if="reg.row.active == 1" size="mini" @click="deleteObj(reg.row)" plain type="danger">Desactivar</el-button>
          <el-button v-else size="mini" @click="activeCargo(reg.row)" plain type="info">Activar</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div> -->

  <!-- <div v-if="objetivo" class="ed-item">
    <el-input v-model="objetivo.objetivo" :rows="5" type="textarea"></el-input>
    <el-button @click="editarObj" type="danger" size="mini" plain>Editar</el-button>
  </div> -->


</div>
</template>

<script>
// mixing
import mixingInit from '../../mixing/mixing_init.js'

import GxCronogramaSigedo from '../../models/gx_cronograma_sigedo.js'

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
    this.init()
  },

  components: {
    
  },

  data: function () {
    return {
      actividades: null,
      cronogramaPresencial: null,
      cronogramaSemiPresencial: null
    }
  },

  computed: {

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

      await this.getCronograma()
      await this.getActividades()
      this.generatePresencial()
      this.generateSemiPresencial()

      loading.close()
    },

    async getCronograma () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL_}v2/cronograma_sigedo/by_periodo/${id_periodo}/${id_semestre}`)
        if(res.status !== 200) return
        this.cronogramaPresencial = res.data.cronograma_presencial
        this.cronogramaSemiPresencial = res.data.cronograma_semi_presencial
      } catch (err) {
        this.cronogramaPresencial = null
        this.cronogramaSemiPresencial = null
        this.$hlp.errors(err)
      }
    },

    async getActividades () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL_}v2/cronograma_sigedo/actividades_sigedo`)
        if(res.status !== 200) return
        this.actividades = res.data.actividades
      } catch (err) {
        this.actividades = null
        this.$hlp.errors(err)
      }
    },

    generatePresencial () {
      if(!this.actividades) return

      let { id_periodo, id_semestre } = this.periodo
      let arr = []

      this.actividades.forEach(actividad => {
        let cronograma = new GxCronogramaSigedo()
        cronograma.id_actividad = actividad.id_actividad
        cronograma.finicio = ''
        cronograma.ffin = ''
        cronograma.id_periodo = id_periodo
        cronograma.id_semestre = id_semestre
        cronograma.detalle = actividad.nombre_actividad
        cronograma.id_modalidad = 1
        cronograma.actividad = actividad

        if(this.cronogramaPresencial) {
          let cr = this.cronogramaPresencial.find(c => c.id_actividad == actividad.id_actividad)

          if(cr) {
            cronograma = cr
          }
        }

        arr.push(cronograma)
      })

      this.cronogramaPresencial = arr
    },

    generateSemiPresencial () {
      if(!this.actividades) return

      let { id_periodo, id_semestre } = this.periodo
      let arr = []

      this.actividades.forEach(actividad => {
        let cronograma = new GxCronogramaSigedo()
        cronograma.id_actividad = actividad.id_actividad
        cronograma.finicio = ''
        cronograma.ffin = ''
        cronograma.id_periodo = id_periodo
        cronograma.id_semestre = id_semestre
        cronograma.detalle = actividad.nombre_actividad
        cronograma.id_modalidad = 2
        cronograma.actividad = actividad

        if(this.cronogramaSemiPresencial) {
          let cr = this.cronogramaSemiPresencial.find(c => c.id_actividad == actividad.id_actividad)

          if(cr) {
            cronograma = cr
          }
        }

        arr.push(cronograma)
      })

      this.cronogramaSemiPresencial = arr
    },

    isExamen({ id_actividad }) {
      return id_actividad == 1 || id_actividad == 2
    },

    hasReg ({ idreg }) {
      return idreg
    },

    async store ($cronograma) {
      if(this.hasReg($cronograma)) {
        await this.updateCronograma($cronograma)
      } else {
        this.saveCronograma($cronograma)
      }
    },

    async saveCronograma ($cronograma) {
      try {
        const res = await this.axios.post(`${this.URL_}v2/cronograma_sigedo/admin`, $cronograma)
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async updateCronograma ($cronograma) {
      try {
        const res = await this.axios.put(`${this.URL_}v2/cronograma_sigedo/admin/${$cronograma.idreg}`, $cronograma)
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    }
  
  },
}
</script>

<style lang="scss" scoped>

</style>

