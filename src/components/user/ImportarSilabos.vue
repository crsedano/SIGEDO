<template>
<div class="ed-container init">
  <div class="ed-item txt-center">
    <h1>
      <strong>Importar Silabos</strong>
    </h1>
  </div>
  <div class="ed-item m-60 l-40 to-center">
    <el-alert
      :closable="false"
      title="NOTA"
      description="Importar los silabos cargados el Periodo y semestre anterior al periodo y semestre en curso"
      type="info">
    </el-alert>
  </div>

  <div class="ed-item m-60 l-40 to-center">
    <el-select v-model="old" placeholder="Seleccione Periodo">
      <el-option
        v-for="(p, index) in arrPeriodos"
        :key="index"
        :label="`${p.id_periodo}-${p.id_semestre}`"
        :value="index">
      </el-option>
    </el-select>
  </div>

  <div class="ed-item txt-center sep-5">
    <el-button @click="importarSilabos" v-if="ready" :disabled="importado" type="danger" size="small" plain>Importar</el-button>
  </div>
</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

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
      idSemestre: '',
      idPeriodo: '',
      estado: '',
      silabosImport: '',

      arrPeriodos: null,
      old: '',

      importado: true
    }
  },

  computed: {
    ready () {
      return (
        String(this.old) != '' &&
        this.idPeriodoOld &&
        this.idSemestreOld
      )
    },

    idPeriodoOld () {
      if(String(this.old) == '') return null

      return this.arrPeriodos.find((per, index)=> index == this.old).id_periodo
    },

    idSemestreOld () {
      if(String(this.old) == '') return null

      return this.arrPeriodos.find((per, index)=> index == this.old).id_semestre
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

      this.idSemestre = this.periodo.id_semestre
      this.idPeriodo = this.periodo.id_periodo
      this.estado = this.periodo.estado
      this.silabosImport = this.periodo.silabos_import

      await this.getPeriodos()
      await this.verificarSilabos()

      loading.close()
    },

    async getPeriodos () {
      try {
        const res = await this.axios.get(`${this.URL}v1/importarSilabos/getPeriodos`)

        if(res.status !== 200) return

        let { data } = res.data

        this.arrPeriodos = data.filter(d => d.estado != '1')
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async verificarSilabos () {
      try {
        const res = await this.axios.get(`${this.URL}v1/importarSilabos/verificarSilabus/${this.idPeriodo}/${this.idSemestre}`)

        if(res.status !== 200) return

        let { data } = res.data

        this.importado = data.cantidad > 0

      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async importarSilabos () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        let o = {
          id_periodo_actual: this.idPeriodo,
          id_semestre_actual: this.idSemestre,
          id_periodo_antiguo: this.idPeriodoOld,
          id_semestre_antiguo: this.idSemestreOld,
          id_usuario: this.identity.id_usuario
        }
        const res = await this.axios.post(`${this.URL}v1/importarSilabos/importar`, o)
        if(res.status !== 200) return
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


