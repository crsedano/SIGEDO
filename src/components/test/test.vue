<template>
  <div style="margin-left: 50px">
    
    <el-button @click="getFormGo">
      fjaslkdfjlkasdf
    </el-button>


    <pre>
      {{res}}
    </pre>
  </div>
</template>

<script>
/**
 * MIXING
 */
// import mixingInit from '../../mixing/mixing_init.js'

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      id_facultad: '0',
      id_escuela: '0',
      res: null,

      products: [
        {
          name: 'producto 1',
          id: 1
        },
        {
          name: 'producto 2',
          id: 2
        },
        {
          name: 'producto 3',
          id: 3
        },
        {
          name: 'producto 4',
          id: 4
        },
        {
          name: 'producto 5',
          id: 5
        },
        {
          name: 'producto 6',
          id: 6
        },
      ],

      productsCarrito: [
        {
          name: 'producto 3',
          id: 3
        },
        {
          name: 'producto 6',
          id: 6
        }
      ]
    }
  },

  mounted () {
    this.getFacultades()
  },

  watch: {
    id_facultad(n) {
      this.id_escuela = '0'
    }
  },

  computed: {
    arrEscuelas() {
      return this.$store.getters['escuela/escuelaByFacultad'](this.id_facultad)
    },

    ...mapState({
      arrFacultades: state => state.facultad.arrFacultades
    }),

    ...mapGetters({
      test: 'escuela/getTest'
    })
  },

  methods: {
    ...mapActions({
      getFacultades: 'facultad/getFacultades',
    }),

    verficarCarrito({id}) {
      let producto = this.productsCarrito.find(p => p.id === id)

      return producto ? true : false
    },

    getFormGo() {
      this.axios.get('http://192.168.1.241:9090/')
      .then(res => {
        this.res = res
      })
      .catch(err => {
        console.dir(err)
      })
    }
  }
}
</script>

