<template>
<div class="ed-container init w-modal">
  <i @click="close" class="fas fa-window-close action red iclose"></i>

  <h1 class="ed-item sep-10 gr-center">
    <strong>{{idCurso.asignatura}}</strong>
  </h1>

  <div class="ed-item sep-20 ed-container">
    <div class="ed-item form-group ">
      <label>SUMILLA</label>

      <textarea cols="30" rows="5" class="form-control" v-model="gx_sumilla.sumilla">
                </textarea>
    </div>
    <div class="ed-item sep-10 gr-center">
      <button @click="editSumilla" v-if="isEdit" class="btn btn-info btn-rounded">
        EDITAR
      </button>
      <button @click="saveSumilla" v-else class="btn btn-info btn-rounded">
        CREAR
      </button>
    </div>
  </div>

  <!-- Pantalla de carga general -->
  <div v-if="loadAjax" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

import loader from '../../templates/loader.vue'

import GxSumilla from '../../../models/gx_sumilla.js'

import moment from 'moment'

export default {
  mixins: [
    MixinInit
  ],

  props: [
    'idCurso'
  ],

  components: {
    loader
  },

  mounted() {
    this.init()
  },

  data: () => ({
    moment: moment,

    loadAjax: false,
    gx_sumilla: new GxSumilla(),

    isEdit: false

  }),

  watch: {

  },

  computed: {

  },

  methods: {
    init: async function () {
      this.getSumilla(this.idCurso)
    },

    async getSumilla (id) {
      this.loadAjax = true
      try {
        const res = await this.axios.get(`${this.URL}js-sumilla/${id.id_asignatura}`)

        if (res.status !== 200) return

        this.gx_sumilla = res.data.data
        this.isEdit = true

      } catch (err) {
        this.gx_sumilla = new GxSumilla()
        this.gx_sumilla.id_asignatura = this.idCurso.id_asignatura
        this.gx_sumilla.cod_asignatura = this.idCurso.cod_asignatura
        this.isEdit = false
        console.dir(err)
      }
      
      this.loadAjax = false
    },

    async saveSumilla () {
      try {
        const res = await this.axios.post(`${this.URL}js-ins-sumilla`, this.gx_sumilla, this.autho)

        if(res.status !== 201) return

        this.close()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async editSumilla () {
      try {
        const res = await this.axios.post(`${this.URL}js-upd-sumilla`, this.gx_sumilla, this.autho)

        if(res.status !== 201) return

        this.close()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    close() {
      this.$emit('close')
    },

  }

}
</script>

<style lang="scss" scoped>

</style>


