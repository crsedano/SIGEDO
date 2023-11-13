<template>
<div class="ed-container init">

  <div class="ed-item ed-container sep-5" v-for="(unidad, index) in unidadesCurso" :key="index">
    <div class="ed-item txt-center">
      <h3>
        <strong>UNIDAD {{ unidad.orden }}</strong>
      </h3>
    </div>
    <div class="ed-item m-70 to-center">
      <label>Unidad</label>
      <el-input type="textarea" :rows="3" size="small" :disabled="!unidad.edit" placeholder="Unidad" v-model="unidad.unidad"></el-input>
    </div>
    <div class="ed-item m-20 to-center" style="display: flex; align-items:center;">
      <el-button :disabled="unidad.unidad == ''" v-if="unidad.edit" size="mini" type="primary" @click="updateNameUnid(unidad)">Editar</el-button>
      <el-button v-if="unidad.edit" size="mini" type="danger" @click="unidad.edit = false">Cancelar</el-button>
      <el-button v-if="!unidad.edit" size="mini" type="danger" @click="unidad.edit = true">Habilitar Edición</el-button>
    </div>
    <template v-if="silabusCronograma.some(s => s.id_silabus_unidades == unidad.id_silabus_unidades && s.idgx_silabus_cronograma != '')">
      <div class="ed-item sep-10 m-70 to-center">
        <label>Metas de Aprendizaje</label>
        <el-input :disabled="!unidad.edit_meta" type="textarea" :rows="5" v-model="unidad.meta"></el-input>
      </div>
      <div class="ed-item sep-10 m-20 to-center" style="display: flex; align-items:center;">
        <el-button :disabled="unidad.meta == ''" v-if="unidad.edit_meta" size="mini" type="primary" @click="editMeta(unidad.meta, unidad.id_silabus_unidades)">Editar</el-button>
        <el-button v-if="unidad.edit_meta" size="mini" type="danger" @click="unidad.edit_meta = false">Cancelar</el-button>
        <el-button v-if="!unidad.edit_meta" size="mini" type="danger" @click="unidad.edit_meta = true">Habilitar Edición</el-button>
      </div>
    </template>
    <template v-else>
      <div class="ed-item sep-2 m-50 l-40 to-center">
        <el-alert
          :closable="false"
          :center="true"
          description="Para poder asignar metas de aprendizaje debe registra el contenido de al menos una semana"
          type="warning">
        </el-alert>
      </div>
    </template>
    
    <div class="ed-item ed-container" v-for="(crono, index) in silabusCronograma" :key="index">
      <div class="ed-item ed-container sep-5" v-if="crono.id_silabus_unidades == unidad.id_silabus_unidades">
        <div class="ed-item to-center">
          <label>Semana {{ crono.semana >= 9 ? parseInt(crono.semana) + 1 : crono.semana }}</label>
          ({{crono.porcentaje}} {{crono.porcentaje != '' ? '%' : ''}})
        </div>
        <div class="ed-item m-70 to-center">
          <el-input :disabled="!crono.edit" type="textarea" :rows="8" v-model="crono.contenido"></el-input>
        </div>
        <div class="ed-item m-20 to-center" style="display: flex; align-items:center;">
          <el-button :disabled="crono.contenido == ''" v-if="crono.idgx_silabus_cronograma == ''" size="mini" type="primary" @click="insertarCronograma(crono)">Guardar</el-button>
          <el-button :disabled="crono.contenido == ''" v-if="crono.idgx_silabus_cronograma != '' && crono.edit" size="mini" type="primary" @click="editCronograma(crono)">Editar</el-button>
          <el-button v-if="crono.idgx_silabus_cronograma != '' && crono.edit" size="mini" type="danger" @click="crono.edit = false">Cancelar</el-button>
          <el-button v-if="!crono.edit" size="mini" type="danger" @click="crono.edit = true">Habilitar Edición</el-button>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="ed-item gr-center">
    <el-button @click="deleteCronograma(curso_)" v-if="cronograma" type="danger" size="medium">RESTEAR CRONOGRAMA</el-button>
    <el-button :disabled="ready" @click="insertarTodosCronogramas" v-else type="primary" size="medium">INSERTAR</el-button>
  </div> -->

</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

/**
 * MODELS
 */
import GxSilabusCronograma from '../../../models/gx_silabus_cronograma'

/**
 * Components
 */
import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  props: ['curso_'],

  mounted() {
    this.init()
  },

  components: {
    loader
  },

  data() {
    return {
      unidadesCurso: null,
      porcentajes: null,
      silabusCronograma: [],
      cronograma: null
    }
  },

  computed: {
    metas() {
      let metas = 0

      this.silabusCronograma.map(crono => {
        if (crono.metas_aprendizaje != '') {
          metas += 1
        }
      })

      let met = metas != 4

      return met
    },

    ready() {
      let contenido = this.silabusCronograma.some(crono => crono.contenido == '')

      return contenido || this.metas
    }
  },

  methods: {
    async init() {
      this.ajaxLoad = true
      await this.getPorcentajes()
      await this.getCronograma(this.curso_)
      await this.getUnidadesSilabo(this.curso_)
      this.ajaxLoad = false
    },

    async getUnidadesSilabo({
      id_curso
    }) {

      try {
        const res = await this.axios.get(`${this.URL}js-unidades-silabo/${id_curso}`, this.autho)

        if (res.status === 200) {
          this.unidadesCurso = res.data.data

          this.unidadesCurso = this.unidadesCurso.map(u => {
            this.$set(u, 'edit', u.unidad == '')
            this.$set(u, 'edit_meta', false)
            this.$set(u, 'meta', '')
            return u
          })

          this.silabusCronograma = []

          let uid = 0
          this.unidadesCurso.forEach((unid, index) => {

            uid += 1

            for (let i = 1; i <= unid.nro_semanas; i++) {

              let sem = null
              let silCromograma
              if(this.cronograma) {
                sem = this.cronograma.find(c => c.semana == i + (index * 4) && c.id_silabus_unidades == unid.id_silabus_unidades)
              }

              if(sem) {
                silCromograma = sem
                unid.meta = sem.metas_aprendizaje
                this.$set(silCromograma, 'edit', false)
                this.silabusCronograma.push(silCromograma)
              } else {
                silCromograma = new GxSilabusCronograma()
  
                silCromograma.id_asignatura = this.curso_.id_curso
                silCromograma.id_usuario_insert = this.identity.id_usuario
                silCromograma.id_docente = this.identity.dni
                silCromograma.id_periodo = this.periodo.id_periodo
                silCromograma.id_semestre = this.periodo.id_semestre
                silCromograma.id_modalidad = this.curso_.id_modalidad
                silCromograma.id_filial = 2
  
                this.$set(silCromograma, 'uid', uid)
  
                i == 1 ? silCromograma.rowspan = true : ''
                silCromograma.id_silabus_unidades = unid.id_silabus_unidades
                silCromograma.semana = i + (index * 4)
  
                let objPorc = this.porcentajes.filter(por => por.id_porcentaje_avanze == silCromograma.semana)[0]
  
                if (objPorc) {
                  silCromograma.porcentaje = parseInt(objPorc.porcentaje * 100)
                  this.$set(silCromograma, 'edit', true)
                  this.silabusCronograma.push(silCromograma)
                }
              }



            }

          })
        }
      } catch (err) {
        console.dir(err)
        this.unidadesCurso = null
      }
    },

    async getPorcentajes() {
      try {
        const res = await this.axios.get(`${this.URL}js-porcentaje-silabo`, this.autho)

        if (res.status === 200) {
          this.porcentajes = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.porcentajes = null
      }
    },

    /**
     * Obtiene el cronograma de una asignatura
     */
    async getCronograma({
      id_curso,
      id_modalidad
    }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando cronograma...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL}js-get-silabus-cronograma/${id_curso}/${id_modalidad}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        if (res.status === 200) {
          this.cronograma = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.cronograma = null
      }
      loading.close()
    },

    /**
     * Elimina el cronograma de la asignatura
     */
    async deleteCronograma({
      id_curso
    }) {
      const loading = this.$loading({
        lock: true,
        text: 'Reseteando cronograma...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.delete(`${this.URL}js-delete-silabus-cronograma/${id_curso}`, this.autho)
        if (res.status === 201) {
          this.init()
        }
      } catch (err) {
        console.dir(err)
        this.cronograma = null
      }
      loading.close()
    },

    async updateNameUnid(unidad) {
      const loading = this.$loading({
        lock: true,
        text: 'Actualizando nombre unidad...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      unidad.unidad = unidad.unidad.toUpperCase()
      try {
        const res = await this.axios.post(`${this.URL}js-upd-silabus-unidades`, unidad, this.autho)
        if (res.status === 201) {
          await this.getUnidadesSilabo(this.curso_)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async insertarTodosCronogramas () {
      let metas = ''
      this.silabusCronograma.map(cronograma => {
        let uid = cronograma.uid

        cronograma.contenido = cronograma.contenido

        if (cronograma.metas_aprendizaje != '') {
          metas = cronograma.metas_aprendizaje
        }

        cronograma.metas_aprendizaje = metas

        this.insertarCronograma(cronograma)

      })

      this.init()
    },

    async insertarCronograma (cronograma) {
      const loading = this.$loading({
        lock: true,
        text: 'Insertando cronograma...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL}js-ins-silabus-cronograma`, cronograma, this.autho)
        
        if (res.status === 201) {
          let meta = this.unidadesCurso.find(u => u.id_silabus_unidades == cronograma.id_silabus_unidades).meta
          await this.editMeta(meta, cronograma.id_silabus_unidades)
          await this.init()
        }
      } catch (err) {
        console.dir(err)
      }
      loading.close()
    },

    async editCronograma (cronograma) {
      const loading = this.$loading({
        lock: true,
        text: 'Edtando cronograma...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL}js-edit-silabus-cronograma`, cronograma, this.autho)
        if (res.status === 201) {
          let meta = this.unidadesCurso.find(u => u.id_silabus_unidades == cronograma.id_silabus_unidades).meta
          await this.editMeta(meta, cronograma.id_silabus_unidades)
          await this.init()
        }
      } catch (err) {
        console.dir(err)
      }
      loading.close()
    },

    async editMeta (meta, id_silabus_unidades) {
      const loading = this.$loading({
        lock: true,
        text: 'Edtando cronograma...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      let data = {
        metas_aprendizaje: meta,
        id_silabus_unidades: id_silabus_unidades,
        id_asignatura: this.curso_.curso,
        id_periodo: this.periodo.id_periodo,
        id_semestre: this.periodo.id_semestre
      }

      try {
        const res = await this.axios.post(`${this.URL}js-edit-meta`, data)

        if (res.status === 201) {
          await this.init()
        }
      } catch (err) {
        console.dir(err)
      }
      loading.close()
    }
  }
}
</script>

