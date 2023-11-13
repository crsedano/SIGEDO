<template>
<div class="ed-container init">
  <div class="ed-item s-95 to-center">
    <h2 v-if="curso_.tipo_asignatura == 'G'" style="text-align: center">
      <strong>VII. ESTRATEGIAS METODOLÓGICAS</strong>
    </h2>
    <h2 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'" style="text-align: center">
      <strong>VIII. ESTRATEGIAS METODOLÓGICAS</strong>
    </h2>
  </div>

  <div class="ed-item s-95 to-center ed-container">
    <ul class="ed-item">
      <li class="list-estrategia">Aprendizaje basado en el servicio</li>
      <p>Los estudiantes aprenden participando activamente en el proceso de enseñanza – aprendizaje.</p>
      <li class="list-estrategia">Aprendizaje basado en problemas (ABP)</li>
      <p>Se parte de un problema para generar determinados aprendizajes en los estudiantes como protagonista.</p>
      <li class="list-estrategia">Estudios de casos</li>
      <p>Se plantea una situación – problema para presentar propuestas contundentes en el análisis, discusión y
        solución.</p>
      <li class="list-estrategia">Investigación de tópicos</li>
      <p>Impulsar a la investigación haciendo uso del método investigativo.</p>
      <li class="list-estrategia">Exhibiciones educativas</li>
      <p>El estudiante aprende en espacios abiertos de aprendizajes (museos, viajes, ferias, fábricas, laboratorios y
        otros).</p>
      <li class="list-estrategia">Simulaciones</li>
      <p>Se realizan simulaciones de casos relacionados al tema tratado.</p>
      <li class="list-estrategia">Talleres</li>
      <p>Se realizan simulaciones de casos relacionados al tema tratado.</p>
      <li class="list-estrategia">Aprendizaje cooperativos</li>
      <p>Trabajo en equipo colaborativo para lograr el aprendizaje de todos</p>
    </ul>
    <div class="ed-item sep-5">
      <h3 v-if="curso_.tipo_asignatura == 'G'"><strong>7.1 TÉCNICA</strong></h3>
      <h3 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'"><strong>8.1 TÉCNICA</strong></h3>
      <ul>
        <li>Lluvia de ideas</li>
        <li>Discusión guiada</li>
        <li>Panel, foro, mesa redonda, debate y otros</li>
        <li>Observación</li>
        <li>Exposición</li>
        <li>Dramatizaciones</li>
      </ul>
    </div>
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

.list-estrategia {
  font-weight: bold;
}
</style>


