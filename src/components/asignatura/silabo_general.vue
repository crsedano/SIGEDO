<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>REGISTRO SILABO</strong>
  </h1>
  <div class="ed-item sep-5">
    <router-link :to="{name: fromm, params: {filters: filterss}}" class="el-button el-button--info el-button--medium">
      VOLVER A LISTA DE CURSOS
    </router-link>
    <el-button @click="cerrarSilabo" type="danger" size="medium">CERRAR SILABO</el-button>
  </div>

  <div class="ed-item ed-container sep-20">
    <p class="ed-item m-30 to-center">
      <strong>
        Código: {{ curso_.cod_asignatura }}
      </strong>
    </p>
    <p class="ed-item m-30 to-center">
      <strong>
        Asignatura: {{ curso_.asignatura }}
      </strong>
    </p>
    <p class="ed-item m-30 to-center">
      <strong>
        {{ curso_.escuela }}
      </strong>
    </p>
  </div>

  <div class="ed-item gr-center">
    <router-link :to="{name: 'General', params: {curso_: curso_}}" class="el-button el-button--primary el-button--mini btn-sep">
      DATOS GENERALES
    </router-link>
    <router-link :to="{name: 'Sumilla Objetivos', params: {curso_: curso_}}" class="el-button el-button--primary el-button--mini btn-sep">
      SUMILLA Y OBJETIVOS
    </router-link>
    <router-link v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'" :to="{name: 'Rasgo Perfil', params: {curso_: curso_}}"
      class="el-button el-button--primary el-button--mini btn-sep">
      RASGOS PERFIL GRADUADO
    </router-link>
    <router-link v-if="curso_.tipo_asignatura == 'T'" :to="{name: 'Competencia', params: {curso_: curso_}}" class="el-button el-button--primary el-button--mini btn-sep">
      COMPETENCIA
    </router-link>
    <router-link v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'G'" :to="{name: 'Investigaciones', params: {curso_: curso_}}"
      class="el-button el-button--primary el-button--mini btn-sep">
      INVESTIGACION
    </router-link>
    <router-link v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'G'" :to="{name: 'Cronograma', params: {curso_: curso_}}"
      class="el-button el-button--primary el-button--mini btn-sep">
      CRONOGRAMA
    </router-link>
    <router-link v-if="curso_.tipo_asignatura == 'T'" :to="{name: 'Programa', params: {curso_: curso_}}" class="el-button el-button--primary el-button--mini btn-sep">
      PROGRAMA
    </router-link>
    <router-link :to="{name: 'Estrategias', params: {curso_: curso_}}" class="el-button el-button--primary el-button--mini btn-sep">
      ESTRATEGIAS
    </router-link>
    <router-link :to="{name: 'Recursos Materiales', params: {curso_: curso_}}" class="el-button el-button--primary el-button--mini btn-sep">
      RECURSOS Y MATERIALES
    </router-link>
    <router-link :to="{name: 'Evaluacion', params: {curso_: curso_}}" class="el-button el-button--primary el-button--mini btn-sep">
      EVALUACION
    </router-link>
    <router-link :to="{name: 'Bibliografia', params: {curso_: curso_}}" class="el-button el-button--primary el-button--mini btn-sep">
      BIBLIOGRAFIA
    </router-link>
    <router-link :to="{name: 'Vinculos', params: {curso_: curso_}}" class="el-button el-button--primary el-button--mini btn-sep">
      VINCULOS
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
import mixingInit from '../../mixing/mixing_init.js'

/**
 * Componentes
 */
import loader from '../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if(!vm.permisos) next('/')
      // let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      // if(!s) {
      //   next('/')
      // }
    })
  },

  props: ['curso_', 'from', 'filters'],

  mounted() {
    this.curso = this.curso_
    this.fromm = this.from
    this.filterss = this.filters
  },

  components: {
    loader
  },

  data() {
    return {
      curso: this.curso_,
      fromm: null,
      filterss: null
    }
  },

  computed: {

  },

  methods: {
    async cerrarSilabo() {

      let {
        id_curso,
        id_filial,
        id_modalidad
      } = this.curso

      let {
        id_periodo,
        id_semestre
      } = this.periodo

      try {
        const res = await this.axios.post(`${this.URL}js-capturar-silabo-asigdoc/${id_curso}/${id_filial}/${id_modalidad}/${id_periodo}/${id_semestre}`, {}, this.autho)

        if (res.status === 201) {
          this.$router.push({
            name: this.fromm,
params: {filters: this.filterss}
          })
        }
      } catch (err) {
        console.dir(err)
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

a {
  text-decoration: none;
}

.btn-sep {
  margin: 10px auto;
}
</style>

