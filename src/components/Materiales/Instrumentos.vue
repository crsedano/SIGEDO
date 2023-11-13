<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>REGISTRO INSTRUMENTOS DE EVALUACIÓN</strong>
  </h1>

  <div class="ed-item ed-container sep-5">
    <el-card v-for="(hora, index) in arrHoras" :key="index" shadow="hover" class="ed-item sep-5 box-card">
      <div slot="header" class="clearfix">
        <div><strong>Semana:</strong> {{ hora.semana }}</div>
        <el-button @click="create(hora)" v-if="isEdit(hora)" plain size="mini" style="float: right" type="primary">Activar</el-button>
        <el-button @click="clickFile(hora)" v-if="!isEdit(hora)" plain size="mini" style="float: right" type="info">Subir Material</el-button>
        <input @change="saveMaterial($event, hora.id, hora.title)" :id="'material-' + hora.id" type="file" class="file-hide">
        <a class="el-button el-button--primary el-button--mini" v-if="hora.img && hora.img != ''" target="_blank" :download="hora.title + '.pdf'" style="float: right" :href="`${URLIMAGE}uploads/instrumentos/${hora.img}`">Descargar Instrumento de Evaluación</a>
      </div>
      <div class="text-item">
        <el-input v-model="hora.title" v-if="!isEdit(hora)" size="mini" placeholder="Título"></el-input>
      </div>  
    </el-card>
  </div>
</div>
</template>

<script>
/**
 * MIXING
 */
import MixinInit from '../../mixing/mixing_init.js'

import Materiales from '../../models/materiales.js'

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
      await this.getPorcentajes()
      await this.getNoLectivas()
      this.arrHoras = this.createInfo(this.horas, this.porcentajes)
      loading.close()
    },

    async getPorcentajes () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/porcentajes/all`)

        if(res.status !== 200) {
          this.porcentajes = null
          return
        }

        this.porcentajes = res.data.porcentajes
      } catch (err) {
        this.porcentajes = null
        this.$hlp.errors(err)
      }
    },

    async getNoLectivas () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        let idAsignatura = this.$route.params.idAsignatura
        const res = await this.axios.get(`${this.URL_}v2/instrumentos/by_asignatura/${id_periodo}/${id_semestre}/${idAsignatura}`)
        
        if(res.status !== 200) {
          this.horas = null
          return
        }

        this.horas = res.data.data
      } catch (err) {
        this.horas = null
        this.$hlp.errors(err)
      }
    },

    createInfo ($horas, $porcentajes) {
      if(!$porcentajes) return

      let arrHoras = []

      $porcentajes.forEach($porcentaje => {
        let { id_periodo, id_semestre } = this.periodo
        let { id_porcentaje_avanze, porcentaje, unidad } = $porcentaje
        let materiales = new Materiales()

        materiales.id_docente = this.identity.dni
        materiales.semana = id_porcentaje_avanze
        materiales.porcentaje = porcentaje
        materiales.id_asignatura = this.$route.params.idAsignatura
        materiales.id_periodo = id_periodo
        materiales.id_semestre = id_semestre
        materiales.img = ''
        materiales.title = ''

        if($horas) {
          let $exist = $horas.find(h => h.semana == id_porcentaje_avanze)

          if($exist) {
            materiales.id = $exist.id
            materiales.id_docente = $exist.id_docente
            materiales.semana = $exist.semana
            materiales.porcentaje = $exist.porcentaje
            materiales.id_asignatura = $exist.id_asignatura
            materiales.created_at = $exist.created_at
            materiales.updated_at = $exist.updated_at
            materiales.id_periodo = $exist.id_periodo
            materiales.id_semestre = $exist.id_semestre
            materiales.img = $exist.img
            materiales.title = $exist.title
          }
        }

        arrHoras.push(materiales)
      })

      return arrHoras
    },

    isEdit ($hora) {
      return !$hora.id
    },

    async create ($hora) {
      try {
        const res = await this.axios.post(`${this.URL_}v2/instrumentos/store`, $hora)
        if(res.status !== 201) return
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.init()
    },

    clickFile({
      id
    }) {
      const btnFile = document.getElementById(`material-${id}`)
      btnFile.click()
    },

    async saveMaterial (event, id, title) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const file = event.target.files[0]

      if (file == undefined) {
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


      var data = new FormData()
      data.append('img', file)
      data.append('title', title)

      try {
        const res = await this.axios.post(`${this.URL}instrumentos-pdf/${id}`, data, this.autho)
        
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

    pdferr(errurl) {
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
