<template>
<div class="ed-container init">
  <div class="ed-item txt-center">
    <h1>
      <strong>Administración de Modales de Creación</strong>
    </h1>
  </div>
  <div class="ed-item m-60 l-40 to-center">
    <el-alert
      :closable="false"
      title="NOTA"
      description="Al activar la opción de permitir creación de modales, los usuarios con acceso al modulo 210. Registro Docente podrán crear: Denominaciones de grados, países y universidades. PARA PODER VISUALIZAR LOS CAMBIOS DESPUES DE UNA ACTUALIZACIÓN LOS USUARIOS DEBERAN CERRAR SESIÓN Y VOLVER A INGRESAR"
      type="info">
    </el-alert>
  </div>

  <div class="ed-item gr-center sep-10">
    <el-switch
      @change="update"
      v-model="value"
      active-text="Permitir"
      inactive-text="Restringir">
    </el-switch>
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
    if(this.entorno.modal == 'S') {
      this.value = true
    } else {
      this.value = false
    }
  },

  data() {
    return {
      value: false
    }
  },

  computed: {
    
  },

  methods: {
    async update (valor) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        let modal = valor ? 'S' : 'N'
        let {id_periodo, id_semestre} = this.periodo
        const res = await this.axios.post(`${this.URL}update-admin-modal/${modal}/${id_periodo}/${id_semestre}`)
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


