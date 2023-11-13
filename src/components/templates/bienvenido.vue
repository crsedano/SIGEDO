<template>
<div>
  <div class="ed-container init">
    <div class="welcome ed-item f-column f-center gr-center">
      <img src="../../assets/img/logo.png">
      <h2>Bienvenido</h2>
      <div class="ed-item gr-center">
        <el-tooltip effect="dark" content="Descargar Manual de Usuario">
          <el-button @click="getManual" type="primary" plain circle icon="el-icon-document"></el-button>
        </el-tooltip>
        <el-button v-if="identity.id_usuario == 47" @click="clickFile" size="mini" type="danger" plain>Subir Manual</el-button>
      </div>
      <h4 v-if="identity">
        {{identity.apellido_paterno}} {{identity.apellido_materno}} {{identity.nombres}}
        <br> {{identity.dni}}
      </h4>
      <h5>
        Consultas: Oficina de Informatica y Sistemas
      </h5>
      <h5>
        UPLA 2022
      </h5>
    </div>
    <div class="ed-item">
      <input style="display: none" @change="storeManual($event)" type="file" name="manual" id="manual">
    </div>
  </div>
</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  components: {},

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (vm.isAlumno__) {
        next('/mis-asignaturas')
      }
      if (!vm.identity) {
        next('/')
      }
    })
  },

  methods: {
    async getManual () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/files/get_manual`)
        this.downloadFile(res, 'customFilename')
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    downloadFile(response, filename) {
      const link = document.createElement('a')
      link.href = response.data.manual_url
      link.download = 'manual_sigedo' + '.pdf'
      link.target = '_blank'
      link.click()
    },

    async storeManual (event) {

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const m = document.getElementById('manual')

      const file = event.target.files[0]

      if (file == undefined) {
        m.value = ''
        return
      }

      const imageType = /(.pdf)$/i

      const fileSize = file.size

      if (!file.type.match(imageType)) {
        this.swAlert(`Solo se admiten archivos de tipo PDF`,'warning')
        m.value = ''
        loading.close()
        return
      }

      if (fileSize > 15000000) {
        this.swAlert(`Archivo demasiado grande: máx 15MB`,'warning')
        m.value = ''
        loading.close()
        return
      }


      var data = new FormData();
      data.append('manual', file);

      try {
        const res = await this.axios.post(`${this.URL_}v2/files/store_manual`, data)
        
        if(res.status == 200) {
          this.swAlert(`Manual cargado exitosamente`, 'success')
        }
      } catch (err) {
        loading.close()
        this.$hlp.errors(err)
      }
      loading.close()
      
      var reader = new FileReader();
      m.value = ''

      reader.readAsDataURL(file);
    },

    clickFile () {
      const m = document.getElementById('manual')
      m.click()
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  color: #000;
}

h5 {
  margin: 0;
}

.welcome {
  height: 80vh;
}
</style>

