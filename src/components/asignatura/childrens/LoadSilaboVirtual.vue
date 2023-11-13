<template>
  <div class="ed-container">
    <el-form class="ed-item ed-container" label-width="120px">
      <el-form-item class="ed-item" label="Archivo">
        <el-input
          placeholder="Nombre Archivo"
          size="medium"
          v-model="fileName"
        ></el-input>
      </el-form-item>
      <el-form-item class="ed-item text-center">
        <el-button @click="clickFile" size="mini" type="primary">
          Subir Documento <i class="el-icon-upload el-icon-right"></i>
        </el-button>
        <input
          style="display: none"
          @change="storeFile($event)"
          type="file"
          name="file"
          id="file"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Init from '../../../mixing/mixing_init'

export default {
  name: 'historial-contrato-admin',

  mixins: [Init],

  props: {
    idDocente: {
      required: true
    },
    idCurso: {
      required: true
    },
    idModalidad: {
      required: true
    },
    idFilial: {
      required: true
    }
  },

  data() {
    return {
      fileName: ''
    }
  },

  methods: {
    async storeFile(event) {
      if (this.fileName === '') {
        this.swAlert(`Ingrese un nombre de archivo`, 'warning')
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const m = document.getElementById('file')

      const file = event.target.files[0]

      if (file == undefined) {
        m.value = ''
        return
      }

      const imageType = /(.pdf)$/i

      if (!file.type.match(imageType)) {
        this.swAlert(`Solo se admiten archivos de tipo PDF`, 'warning')
        m.value = ''
        loading.close()
        return
      }

      var data = new FormData()

      data.append('file', file)
      data.append('idPeriodo', this.idPeriodo__)
      data.append('idSemestre', this.idSemestre__)
      data.append('idDocente', this.idDocente)
      data.append('idCurso', this.idCurso)
      data.append('idModalidad', this.idModalidad)
      data.append('idFilial', this.idFilial)
      data.append('fileName', this.fileName)

      try {
        const res = await this.axios.post(
          `${this.URL_}v1/silabus-virtual/store`,
          data
        )

        let { status } = res

        if (status == 200) {
          this.swAlert(`Silabo registrado`, 'success')
          this.update()
          this.close()
        }
      } catch (err) {
        m.value = ''
        loading.close()
        this.$hlp.errors(err)
      }
      loading.close()

      var reader = new FileReader()
      m.value = ''

      reader.readAsDataURL(file)
    },

    clickFile() {
      const m = document.getElementById('file')
      m.click()
    },

    close() {
      this.$emit('close')
    },

    update() {
      this.$emit('update')
    }
  }
}
</script>
