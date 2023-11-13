<template>
<div class="ed-container init">
  <div class="ed-item txt-center">
    <h1>
      <strong>Administrar Periodos</strong>
    </h1>
  </div>

  <div class="ed-item m-60 l-40 to-center">
    <el-alert
      :closable="false"
      title="NOTA"
      description="Al crear un nuevo Periodo, este será activado y los periodos restantes desactivados"
      type="info">
    </el-alert>
  </div>

  <div class="ed-item">
    <el-form class="ed-item m-50 l-40 to-center" size="mini">
      <el-form-item label="Periodo">
        <el-input v-model="periodo"></el-input>
      </el-form-item>
      <el-form-item label="Semestre">
        <el-input v-model="semestre"></el-input>
      </el-form-item>
    </el-form>
  </div>

  <div class="ed-item txt-center">
    <el-button @click="createPeriodo" :disabled="!ready" type="danger" size="small" plain>Crear</el-button>
  </div>

  <div class="ed-item sep-5">
    <el-table border stripe fit :data="arrPeriodos" height="350" highlight-current-row :row-class-name="tableRowClassName">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="id_periodo" label="Periodo" min-width="130" align="center" header-align="center"></el-table-column>
      <el-table-column prop="id_semestre" label="Semestre" min-width="220" align="center" header-align="center"></el-table-column>
      <el-table-column prop="estado" label="Activo" min-width="300" align="center" header-align="center">
        <template slot-scope="reg">
          {{reg.row.estado == 1 ? 'SI' : 'NO'}}
        </template>
      </el-table-column>
    </el-table>
  </div> 
</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

import swal from 'sweetalert'

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

  data() {
    return {
      arrPeriodos: null,
      periodo: '',
      semestre: '',
    }
  },

  computed: {
    ready() {
      if(!this.arrPeriodos) return false
      
      let p = this.arrPeriodos.some(per => per.id_periodo == this.periodo && per.id_semestre == this.semestre)

      return (
        this.periodo != '' &&
        this.semestre != '' &&
        !p
      )
    }
  },

  methods: {
    async init () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      await this.getPeriodos()

      loading.close()
    },

    async getPeriodos () {
      try {
        const res = await this.axios.get(`${this.URL}v1/administrarPeriodos/getPeriodos`)

        if(res.status !== 200) return

        let { data } = res.data

        this.arrPeriodos = data
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async createPeriodo () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        let o = {
          idPeriodo: this.periodo,
          idSemestre: this.semestre
        }

        const res = await this.axios.post(`${this.URL}v1/administrarPeriodos/create`, o)

        if(res.status !== 201) return

        swal({
          title: 'UPLA',
          text: `El nuevo periodo se ha creado, la sesión de todos los usuarios serán cerrado`,
          icon: 'info',
        }).then(() => {
          // this.refreshFirebase()
        })
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    // refreshFirebase: function () {
    //   db.ref('upla/changes').set(`${this.periodo}-${this.semestre}`)
    // },
  }
}
</script>

<style lang="scss" scoped>

</style>


