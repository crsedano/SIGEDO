<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>DOCENTES</strong>
  </h1>

  <div class="ed-item sep-5 gr-center">
    <button @click="resetDocente" class="btn btn-danger btn-rounded">
      Nuevo Docente
    </button>
    <a :href="`${URLPDF}api/src/reportes/Plantilla_Docente.pdf`" download>
      <i class="far fa-file-pdf  pointer action"></i>
    </a>
    <el-button @click="finalizarDocente" type="primary" size="small">Marcar Finalizado</el-button>
  </div>

  <div class="ed-item sep-5 gr-center">
    <p v-if="dataDocente">
      <strong>Editando: {{ dataDocente.nombre }}</strong>
    </p>
    <p v-else>
      <strong>Creando nuevo docente...</strong>
    </p>
  </div>

  <div class="ed-item gr-center sep-5">
    <router-link :to="{name: 'Personal'}" class="btn btn-info btn-rounded btn-xs">
      DATOS PERSONALES
    </router-link>
    <router-link :to="{name: 'Residencia'}" class="btn btn-info btn-rounded btn-xs">
      DATOS RESIDENCIA
    </router-link>
    <router-link :to="{name: 'Datos Contacto'}" class="btn btn-info btn-rounded btn-xs">
      DATOS DE CONTACTO
    </router-link>
    <router-link :to="{name: 'Grado Academico'}" class="btn btn-info btn-rounded btn-xs">
      GRADO ACADEMICO
    </router-link>
    <router-link :to="{name: 'Titulo'}" class="btn btn-info btn-rounded btn-xs">
      TITULOS
    </router-link>
    <router-link :to="{name: 'Experiencia Docente'}" class="btn btn-info btn-rounded btn-xs">
      EXPERIENCIA EN DOCENCIA UNIVERSITARIA
    </router-link>
    <router-link :to="{name: 'Experiencia Profesional'}" class="btn btn-info btn-rounded btn-xs">
      EXPERIENCIA PROFESIONAL
    </router-link>
  </div>

  <router-view></router-view>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
/**
 * MIXING
 */
import MixinInit from '../../mixing/mixing_init.js'

/**
 * Componentes
 */
import loader from '../templates/loader.vue'

import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex'

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
    loader
  },

  data() {
    return {
      dataDocente: null
    }
  },

  watch: {
    dni(n) {
      if (!n) {
        this.$router.push('/docentes/')
        this.dataDocente = null
      } else {
        this.getDataDocente(this.dni)
      }
    },

  },

  computed: {
    ...mapState({
      dni: state => state.docente.dni
    })
  },

  methods: {
    async init() {
      this.getDataDocente(this.dni)
    },

    ...mapMutations({
      updateDni: 'docente/DNI_UPDATE'
    }),

    resetDocente() {
      this.updateDni(null)
    },

    async getDataDocente(dni) {
      if (!dni) return

      try {
        const res = await this.$http.get(`${this.URL}js-docente/${dni}`, this.autho)

        if (res.status === 200) {
          this.dataDocente = res.data.data
        }
      } catch (err) {
        this.dataDocente = null
        this.$hlp.errors(err)
      }
    },

    async finalizarDocente () {
      try {
        const res = await this.axios.post(`${this.URL}finalizar-docente/${this.dni}/1`, {})
        if(res.status === 201) {
          this.swAlert(`CV docente marcado como finalizado`, 'success')
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  background: rgb(103, 182, 194);
  color: #000;
  font-weight: bold;
}
</style>
