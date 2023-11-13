<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>SEGUIMIENTO ACTIVIDADES NO LECTIVAS</strong>
  </h1>

  <div class="ed-item ed-container sep-5">
    <template v-if="isClose">
      <el-card v-for="(hora, index) in horas" :key="index" shadow="hover" class="ed-item sep-5 box-card">
        <div slot="header" class="clearfix">
          <div><strong>Semana:</strong> {{ hora.semana }}</div>
          <div><strong>Unidad:</strong> {{ hora.unidad }}</div>
          <div v-if="isDone(hora)"><strong>Porcentaje Avance:</strong> {{ hora.porcentaje * 100 | roundTwo}}%</div>
          <div v-if="hora.done == 0">
            <el-tag type="danger">NO REALIZADO</el-tag>
          </div>
          <div v-if="isDone(hora)">
            <el-tag type="success">REALIZADO</el-tag>
          </div>
          <el-button :disabled="!beforeIsDone(hora)" @click="setDone(hora)" v-if="hasDoc(hora) && !isDone(hora)" plain size="mini" style="float: right" type="primary">Marcar Realizado</el-button>
          <a v-if="hasDoc(hora)" download  class="el-button el-button--info el-button--mini is-plain" style="float: right" target="_blank" :href="`${URLIMAGE}uploads/no_lectivas/${hora.img}`">Descargar Documento</a>
          <el-button v-if="!isDone(hora)" @click="clickFile(hora)" style="float: right" icon="el-icon-document" size="mini" circle></el-button>
          <input @change="saveDoc($event, hora)" :id="getId(hora)" type="file" class="file-hide">
        </div>

        <div class="text item">
          <el-input disabled type="textarea" :rows="4" v-model="hora.contenido"></el-input>
        </div>
        
      </el-card>
    </template>
    <div v-else class="ed-item m-40 to-center">
      <el-alert
        title="Atención"
        type="error"
        show-icon
        description="Primero registre su cronograma de horas no lectivas por completo">
      </el-alert>
      <router-link :to="{name: 'HorasNoLectivas'}">Ir al módulo registro cronograma de horas no lectivas</router-link>
    </div>
  </div>


</div>
</template>

<script>
/**
 * MIXING
 */
import MixinInit from '../../mixing/mixing_init.js'

import HorasNoLectivas from '../../models/horas_no_lectivas.js'

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

  components: {

  },

  data() {
    return {
      porcentajes: null,
      horas: null,
      arrHoras: null
    }
  },

  watch: {
    
  },

  computed: {
    lenHoras () {
      if(!this.horas) return 0
      return this.horas.length
    },

    isClose () {
      return this.lenHoras == 16
    }
  },

  filters: {
    roundTwo(value) {
      if(!value) return
      return parseFloat(value).toFixed(2)
    }
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getNoLectivas()
      loading.close()
    },

    async getNoLectivas () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL_}v2/no_lectivas/by_docente/${id_periodo}/${id_semestre}`)
        
        if(res.status !== 200) {
          this.horas = null
          return
        }

        this.horas = res.data.horas
      } catch (err) {
        this.horas = null
        this.$hlp.errors(err)
      }
    },

    hasDoc($hora) {
      return $hora.img
    },

    getId ($hora) {
      return 'img-' + $hora.id
    },

    isDone($hora) {
      return $hora.done == 1
    },

    beforeIsDone({ semana }) {
      if(!this.horas) return false
      if(semana == 1) return true
      let done = this.horas.find(h => h.semana == semana - 1).done
      return done == 1
    },

    clickFile({ id }) {
      const btnFile = document.getElementById(`img-${id}`)
      btnFile.click()
    },

    async saveDoc (event, { id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const file = event.target.files[0]

      if (!file) {
        return
      }

      const imageType = /(.pdf)$/i

      const fileSize = file.size

      if (!file.type.match(imageType)) {
        this.swAlert(`Solo se admiten archivos de tipo PDF`,'warning')
        loading.close()
        return
      }

      if (fileSize > 5000000) {
        this.swAlert(`Archivo demasiado grande: máx 5MB`,'warning')
        loading.close()
        return
      }


      var data = new FormData();
      data.append('img', file);

      try {
        const res = await this.axios.post(`${this.URL}pdf_no_lectivo/${id}`, data, this.autho)
        
        if(res.data.success) {
          this.init()
        } else {
          let message = res.data.message
          this.$notify.error({
            title: 'Precaución',
            message: message
          })
        }
        loading.close()
      } catch (err) {
        loading.close()
        this.$hlp.errors(err)
      }
      
      var reader = new FileReader();

      reader.readAsDataURL(file);
    },

    async setDone({ id }) {
      try {
        const res = await this.axios.put(`${this.URL_}v2/no_lectivas/set_done/${id}`)
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    cancelOperation () {
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.file-hide {
  visibility: hidden;
  width: 0;
  height: 0;
  position: absolute;
}
</style>
