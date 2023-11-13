<template>
  <div class="ed-container init">
    <h1>PRUEBA</h1>

    <pre>
      {{
        arrFacultades
      }}
    </pre>
  </div>
</template>

<script>
/**
 * MIXING
 */
// import mixingInit from '../../mixing/mixing_init.js'

import { mapState, mapActions } from 'vuex'

export default {
  // mixins: [
  //   mixingInit
  // ],

  mounted () {
    this.getFacultades()
  },

  computed: {
    ...mapState({
      arrFacultades: state => state.facultad.arrFacultades
    })
    // ...mapState('facultad', {
    //   arrFacultades: 'arrFacultades'
    // }),

    // ...mapState('escuela', {
    //   arrEsculeas: 'arrEscuelas'
    // })
  },

  methods: {
    ...mapActions({
      getFacultades: 'facultad/getFacultades',
    })
  }
}
</script>

