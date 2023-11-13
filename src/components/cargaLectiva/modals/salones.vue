<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item ed-container">
    <h3 class="ed-item gr-center sep-10">
      <!-- <h2 class="gr-center"> -->
      <strong class="gr-center">Curso: {{curso.asignatura}}</strong>
      <!-- </h2> -->
    </h3>
    <h5 class="ed-item m-50 gr-center">
      Facultad: {{facultad.facultad}}
    </h5>
    <h5 v-if="!isFac" class="ed-item m-50 gr-center">
      Escuela: {{facultad.escuela}}
    </h5>
    <h5 class="ed-item m-50 gr-center">
      Filial: {{facultad.filial}}
    </h5>
    <h5 class="ed-item m-50 gr-center">
      Modalidad: {{facultad.modalidad}}
    </h5>
    <h5 class="ed-item gr-center">
      {{curso.ciclo}} Ciclo
    </h5>
    <h5 class="ed-item gr-center">
      {{curso.numero_matriculadosf}} Alumnos Matriculados
    </h5>
    <h5 v-if="detailAsignatura!=null" class="ed-item gr-center">
      Aforo Teoría: {{detailAsignatura.aforo_ht}}
    </h5>
    <h5 v-if="detailAsignatura!=null" class="ed-item gr-center">
      Aforo Práctica: {{detailAsignatura.aforo_hp}}
    </h5>
  </div>

  <div class="ed-item s-95 m-95 l-90 to-center sep-20 ed-container">
    <div v-if="teorico != null" class="ed-item m-50 to-center ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS TEORICAS</caption>
        <thead class="table-head">
          <tr>
            <th>N°</th>
            <th>SECCION</th>
            <th>ALUMNOS</th>
            <th>DOCENTE</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(p, index) in teorico" :key="index">
            <td>{{p.numero_seccion}}</td>
            <td>{{p.seccion}}</td>
            <td>{{p.numero_alumnos_seccion}}</td>
            <td>{{p.nombre_docente}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="practico != null" class="ed-item m-50 to-center ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS PRACTICAS</caption>
        <thead class="table-head">
          <tr>
            <th>N°</th>
            <th>SECCION</th>
            <th>ALUMNOS</th>
            <th>DOCENTE</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(p, index) in practico" :key="index">
            <td>{{p.numero_seccion}}</td>
            <td>{{p.seccion}}</td>
            <td>{{p.numero_alumnos_seccion}}</td>
            <td>{{p.nombre_docente}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>


  <div class="ed-item s-95 m-95 l-90 to-center sep-20 ed-container">
    <div v-if="spteorico != null" class="ed-item m-50 to-center ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS SEMI PRESENCIAL PRESENCIAL TEORICAS</caption>
        <thead class="table-head">
          <tr>
            <th>N°</th>
            <th>SECCION</th>
            <th>ALUMNOS</th>
            <th>DOCENTE</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(p, index) in spteorico" :key="index">
            <td>{{p.numero_seccion}}</td>
            <td>{{p.seccion}}</td>
            <td>{{p.numero_alumnos_seccion}}</td>
            <td>{{p.nombre_docente}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="sppractico != null" class="ed-item m-50 to-center ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS SEMIPRESENCIAL PRESENCIAL PRACTICAS</caption>
        <thead class="table-head">
          <tr>
            <th>N°</th>
            <th>SECCION</th>
            <th>ALUMNOS</th>
            <th>DOCENTE</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(p, index) in sppractico" :key="index">
            <td>{{p.numero_seccion}}</td>
            <td>{{p.seccion}}</td>
            <td>{{p.numero_alumnos_seccion}}</td>
            <td>{{p.nombre_docente}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="ed-item s-95 m-95 l-90 to-center sep-20 ed-container">
    <div v-if="svteorico != null" class="ed-item m-50 to-center ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS SEMIPRESENCIAL VIRTUAL TEORICAS</caption>
        <thead class="table-head">
          <tr>
            <th>N°</th>
            <th>SECCION</th>
            <th>ALUMNOS</th>
            <th>DOCENTE</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(p, index) in svteorico" :key="index">
            <td>{{p.numero_seccion}}</td>
            <td>{{p.seccion}}</td>
            <td>{{p.numero_alumnos_seccion}}</td>
            <td>{{p.nombre_docente}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="svpractico != null" class="ed-item m-50 to-center ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS SEMIPRESENCIAL VIRTUAL PRACTICAS</caption>
        <thead class="table-head">
          <tr>
            <th>N°</th>
            <th>SECCION</th>
            <th>ALUMNOS</th>
            <th>DOCENTE</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(p, index) in svpractico" :key="index">
            <td>{{p.numero_seccion}}</td>
            <td>{{p.seccion}}</td>
            <td>{{p.numero_alumnos_seccion}}</td>
            <td>{{p.nombre_docente}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

export default {
  mixins: [
    MixinInit
  ],

  props: [
    'curso',
    'teorico',
    'practico',
    'spteorico',
    'sppractico',
    'svteorico',
    'svpractico',
    'facultad',
    'isFac'
  ],

  components: {
    loading
  },

  mounted() {
    this.init()
  },

  data: () => ({
    detailAsignatura: null
  }),

  watch: {

  },

  methods: {
    init() {
      this.teclasRapidas()
      this.getDetalleAsignatura()
    },

    getDetalleAsignatura: function () {
      this.axios.get(`${this.URL}js-det-asignatura/${this.entorno.version_final}/${this.curso.id_asignatura}/${this.curso.id_filial}/${this.curso.id_modalidad}`)
        .then(res => {
          if (res.data.success) {
            this.detailAsignatura = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })
    },

    close: function () {
      this.$emit('close')
    },
  }

}
</script>

<style lang="scss" scoped>
    
</style>


