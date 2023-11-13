<template>
<div class="ed-container init">
  <div class="ed-item s-95 to-center">
    <h2 v-if="curso_.tipo_asignatura == 'G'" style="text-align: center">
      <strong>VIII. RECURSOS Y MATERIALES</strong>
    </h2>
    <h2 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'" style="text-align: center">
      <strong>IX. RECURSOS Y MATERIALES</strong>
    </h2>
  </div>
  <div class="ed-item sep-5 s-95 to-center">
    <h3 v-if="curso_.tipo_asignatura == 'G'"><strong>8.1 MEDIOS Y MATERIALES EDUCATIVOS</strong></h3>
    <h3 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'"><strong>9.1 MEDIOS Y MATERIALES
        EDUCATIVOS</strong></h3>
    <ul>
      <li>Visuales: pizarra, computadora.</li>
      <li>Auditivos: discurso oral, escucha activa.</li>
      <li>De enseñanza: diapositivas, plumones y mota.</li>
      <li>Módulos de aprendizaje.</li>
    </ul>
  </div>
  <div class="ed-item sep-5 s-95 to-center">
    <h3 v-if="curso_.tipo_asignatura == 'G'"><strong>8.2 INFRAESTRUCTURA</strong></h3>
    <h3 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'"><strong>9.2 INFRAESTRUCTURA</strong></h3>
    <ul>
      <li>Aulas de la facultad.</li>
      <li>Laboratorios.</li>
    </ul>
  </div>
</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

export default {
  mixins: [
    mixingInit
  ],

  props: ['curso_'],

  mounted() {

  },

  data() {
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
p, ul {
  margin: 0;
}

h3 {
  margin: 0;
}
</style>


