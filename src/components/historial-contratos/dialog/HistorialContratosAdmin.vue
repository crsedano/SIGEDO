<template>
  <div class="ed-container">
    <el-form class="ed-item ed-container" label-width="120px">
      <el-form-item class="ed-item" label="Periodo">
        <el-input v-model="idPeriodo"></el-input>
      </el-form-item>
      <el-form-item class="ed-item" label="Semestre">
        <el-input v-model="idSemestre"></el-input>
      </el-form-item>
      <el-form-item class="ed-item text-center">
        <el-button :disabled="idPeriodo == '' || idSemestre == ''" @click="clickFile" size="mini" type="primary">
          Subir Documento <i class="el-icon-upload el-icon-right"></i>
        </el-button>
        <input style="display: none" @change="storeFile($event)" type="file" name="historial" id="historial">
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import MixingInit from '../../../mixing/mixing_init'
export default {
  name: 'historial-contrato-admin',

  mixins: [ MixingInit ],

  props: {
    idDocente: {
      required: true
    }
  },

  data () {
    return {
      idPeriodo : '',
      idSemestre: ''
    }
  },

  methods: {
    async storeFile (event) {

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const m = document.getElementById('historial')

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


      var data = new FormData();
      
      data.append('file', file);
      data.append('periodo', this.idPeriodo);
      data.append('semestre', this.idSemestre);
      data.append('docente_id', this.idDocente);

      try {
        const res = await this.axios.post(`${this.URL_}v2/historial-contrato/store-historial`, data)

        let { status } = res
        
        if(status == 200) {
          this.swAlert(`Historial registrado`, 'success')
          this.update(res.data.historial)
          this.close()
        }
      } catch (err) {
        m.value = ''
        loading.close()
        this.$hlp.errors(err)
      }
      loading.close()
      
      var reader = new FileReader();
      m.value = ''

      reader.readAsDataURL(file);
    },

    clickFile () {
      const m = document.getElementById('historial')
      m.click()
    },

    close () {
      this.$emit('close')
    },

    update (historial) {
      this.$emit('update', historial)
    }
  }
}
</script>