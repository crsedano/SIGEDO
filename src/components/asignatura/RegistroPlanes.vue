<template>
<div class="ed-container init">
  <div class="ed-item m-60 l-40 to-center">
    <el-card class="box-card">
      <el-form size="small" :model="gxPlanEstudio" class="demo-form-inline">
        <el-form-item label="Plan">
          <el-input v-model="gxPlanEstudio.anio" placeholder="Plan"></el-input>
        </el-form-item>
        <el-form-item class="gr-center">
          <el-button :disabled="!ready" @click="insertPlan" plain type="primary">Crear</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="arrPlanes" height="250" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="planLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column fixed type="index" min-width="30" align="center" header-align="center"></el-table-column>
      <el-table-column prop="anio" label="Plan" min-width="100" align="center" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="60" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip class="item" effect="dark" content="Mostrar Escuela" placement="left-start">
            <el-button plain @click="showEscuelas(reg.row)" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div v-if="modalEscuelas" class="modal f-row f-center">
    <escuelas-plan 
      :plan="planSel" 
      @close="modalEscuelas = false" />
  </div>
</div>
</template>

<script>
// mixing
import mixingInit from '../../mixing/mixing_init.js'

// models
import GxPlanEstudio from '../../models/gx_plan_estudio'

import escuelasPlan from './modal/EscuelasPlan.vue'

export default {
  mixins: [
    mixingInit
  ],
  
  props: {
    
  },

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
    escuelasPlan
  },

  data: function () {
    return {
      gxPlanEstudio: new GxPlanEstudio(),
      arrPlanes: null,
      planLoad: false,
      modalEscuelas: false,
      planSel: null
    }
  },

  computed: {
    ready () {
      return (
        this.gxPlanEstudio.anio != '' &&
        this.gxPlanEstudio.anio.length == 4
      )
    }
  },

  watch: {
  
  },

  methods: {
    async init() {
      await this.getPlanes()
    },

    async getPlanes () {
      this.planLoad = true
      try {
        const res = await this.axios.get(`${this.URL}v1/planesEstudio/getPlanes`)

        if(res.status !== 200) return

        this.arrPlanes = res.data.data
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.planLoad = false
    },

    async insertPlan () {
      this.planLoad = true
      try {
        const res = await this.axios.post(`${this.URL}v1/planesEstudio/create`, this.gxPlanEstudio)

        if(res.status !== 201) return

        await this.getPlanes()
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.planLoad = false
    },

    showEscuelas (plan) {
      this.planSel = plan
      this.modalEscuelas = true
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

