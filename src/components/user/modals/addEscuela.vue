<template>
<div class="ed-container init sub-main">
  <div class="ed-item m-80 l-60 to-center sep-40 ed-container">
    <div class="ed-item sep-10 m-50 form-group">
      <label>Modalidad</label>
      <select v-model="userEscuela.id_modalidad" class="form-control">
        <option :value="0">SELECCIONAR</option>
        <option v-for="(modalidad, index) in modalidades" :key="index" :value="modalidad.id_modalidad">
          {{modalidad.nombre}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-10 m-50 form-group">
      <label>Filial</label>
      <select v-model="userEscuela.id_filial" class="form-control">
        <option :value="0">SELECCIONAR</option>
        <option v-for="(filial, index) in filiales" :key="index" :value="filial.id_filial">
          {{filial.nombre_filial}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-10 m-50 form-group">
      <label>Facultad</label>
      <select v-model="userEscuela.id_facultad" class="form-control">
        <option :value="0">SELECCIONAR</option>
        <option v-for="(facultad, index) in facultades" :key="index" :value="facultad.id_facultad">
          {{facultad.nombre}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-10 m-50 form-group">
      <label>Escuela</label>
      <select v-model="userEscuela.id_escuela" class="form-control">
        <option :value="0">SELECCIONAR</option>
        <option :disabled="listEscuela == null ? false : listEscuela.some(e => e.id_escuela == escuela.id_escuela && e.id_modalidad == userEscuela.id_modalidad && e.id_filial == userEscuela.id_filial)"
          v-for="(escuela, index) in escuelas" :key="index" :value="escuela.id_escuela">
          {{escuela.nombre}}
        </option>
      </select>
    </div>
    <div class="ed-item gr-center">
      <button v-show="validUserEscuela" @click="addNuevoUserEscuela" class="btn btn-info btn-rounded btn-hov animated swing">
        <i class="fas fa-save"></i>
        Guardar
      </button>
    </div>
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

import GXUser from '../../../models/gx_user';
import GxUserEscuela from '../../../models/gx_userescuela';

export default {
  mixins: [
    MixinInit
  ],

  props: ['idUsuario', 'listEscuela'],

  components: {
    loading
  },

  mounted() {
    this.init()
  },

  data: () => ({
    filiales: null,
    facultades: null,
    modalidades: null,
    escuelas: null,

    id_facultad: 0,

    load: false,

    userEscuela: new GxUserEscuela('', '', '0', '0', '0', '0', '0')

  }),

  computed: {
    validUserEscuela: function () {
      return (
        this.userEscuela.id_escuela != 0 &&
        this.userEscuela.id_facultad != 0 &&
        this.userEscuela.id_filial != 0 &&
        this.userEscuela.id_modalidad != 0
      )
    }
  },

  watch: {
    'userEscuela.id_facultad': function (n) {
      this.userEscuela.id_escuela = 0
      if (n != 0) {
        this.getEscuelas()
      }
    }
  },

  methods: {
    init() {
      this.getFiliales()
      this.getFacultades()
      this.getModalidades()
      this.userEscuela.id_usuario = this.idUsuario
    },

    async getFiliales() {
      try {
        const res = await this.axios.get(`${this.URL}js-filial`, this.autho)

        if (res.status === 200) {
          this.filiales = res.data.data
        }
      } catch (err) {
        this.filiales = null
        this.$hlp.errors(err)
      }
    },

    async getFacultades() {
      try {
        const res = await this.axios.get(`${this.URL}js-facultad`, this.autho)

        if (res.status === 200) {
          this.facultades = res.data.data
        }
      } catch (err) {
        this.facultades = null
        this.$hlp.errors(err)
      }
    },

    async getModalidades() {
      try {
        const res = await this.axios.get(`${this.URL}js-modalidad`, this.autho)

        if (res.status === 200) {
          this.modalidades = res.data.data
        }
      } catch (err) {
        this.modalidades = null
        this.$hlp.errors(err)
      }
    },

    async getEscuelas() {
      try {
        const res = await this.axios.get(`${this.URL}js-escuela/${this.userEscuela.id_facultad}`, this.autho)

        if (res.status === 200) {
          this.escuelas = res.data.data
        }
      } catch (err) {
        this.escuelas = null
        this.$hlp.errors(err)
      }
    },

    async addNuevoUserEscuela() {
      try {
        const res = await this.axios.post(`${this.URL}js-ins-userescuela`, this.userEscuela, this.autho)

        if (res.status === 201) {
          this.$emit('added')
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    }

  }

}
</script>

<style lang="scss" scoped>
option:disabled {
  background: rgb(214, 214, 214);
}
</style>


