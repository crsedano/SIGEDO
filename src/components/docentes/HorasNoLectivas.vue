<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>REGISTRO ACTIVIDADES NO LECTIVAS</strong>
  </h1>

  <div class="ed-item ed-container sep-5">
    <el-card v-for="(hora, index) in arrHoras" :key="index" shadow="hover" class="ed-item sep-5 box-card">
      <div slot="header" class="clearfix">
        <div><strong>Semana:</strong> {{ hora.semana }}</div>
        <div><strong>Unidad:</strong> {{ hora.unidad }}</div>
        <!-- <div>Porcentaje Avance: {{ hora.porcentaje * 100 | roundTwo}}%</div> -->
        <el-button @click="create(hora)" :disabled="!isReady(hora) || isClose" v-if="isEdit(hora)" plain size="mini" style="float: right" type="primary">Guardar</el-button>
        <el-button @click="cancelOperation" :disabled="!isReady(hora) || isClose" v-if="!isEdit(hora)" plain size="mini" style="float: right" type="info">Cancelar</el-button>
        <el-button @click="edit(hora)" :disabled="!isReady(hora) || isClose" v-if="!isEdit(hora)" plain size="mini" style="float: right" type="danger">Editar</el-button>
      </div>

      <div class="text item">
        <el-input :disabled="isClose" type="textarea" :rows="4" v-model="hora.contenido"></el-input>
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

    createInfo ($horas, $porcentajes) {
      if(!$porcentajes) return

      let arrHoras = []

      $porcentajes.forEach($porcentaje => {
        let { id_periodo, id_semestre } = this.periodo
        let { id_porcentaje_avanze, porcentaje, unidad } = $porcentaje
        let horaNoLectivas = new HorasNoLectivas()

        horaNoLectivas.id_docente = this.identity.dni
        horaNoLectivas.semana = id_porcentaje_avanze
        horaNoLectivas.porcentaje = porcentaje
        horaNoLectivas.contenido = ''
        horaNoLectivas.id_periodo = id_periodo
        horaNoLectivas.id_semestre = id_semestre
        horaNoLectivas.done = 0
        horaNoLectivas.unidad = unidad

        if($horas) {
          let $exist = $horas.find(h => h.semana == id_porcentaje_avanze && h.unidad == unidad)

          if($exist) {
            horaNoLectivas.id = $exist.id
            horaNoLectivas.id_docente = $exist.id_docente
            horaNoLectivas.semana = $exist.semana
            horaNoLectivas.porcentaje = $exist.porcentaje
            horaNoLectivas.contenido = $exist.contenido
            horaNoLectivas.created_at = $exist.created_at
            horaNoLectivas.updated_at = $exist.updated_at
            horaNoLectivas.id_periodo = $exist.id_periodo
            horaNoLectivas.id_semestre = $exist.id_semestre
            horaNoLectivas.done = $exist.done
            horaNoLectivas.unidad = $exist.unidad
          }
        }

        arrHoras.push(horaNoLectivas)
      })

      return arrHoras
    },

    isEdit ($hora) {
      return !$hora.id
    },

    isReady ($hora) {
      return $hora.contenido.trim() != ''
    },

    cancelOperation () {
      this.init()
    },

    async edit ($hora) {
      try {
        const res = await this.axios.put(`${this.URL_}v2/no_lectivas/admin/${$hora.id}`, $hora)
        if(res.status !== 201) return
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.init()
    },

    async create ($hora) {
      try {
        const res = await this.axios.post(`${this.URL_}v2/no_lectivas/admin`, $hora)
        if(res.status !== 201) return
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.init()
    }
  }
}
</script>