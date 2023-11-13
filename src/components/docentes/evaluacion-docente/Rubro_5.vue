<template>
<div class="ed-container">
    <div v-if="rubro" class="ed-item txt-center">
      <h1>
        <strong>{{ rubro.nombre }}</strong>
      </h1>
      <el-alert
        :title="`Puntaje Máximo Permitido: ${rubro.max}`"
        type="error"
        effect="dark"
        center
        :closable="false">
      </el-alert>
    </div>

    <div class="ed-item sep-10">
      <el-table border stripe fit :data="info" height="250" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="didactica_superior" label="Didactica Superior" min-width="80" align="center" header-align="center"></el-table-column>
        <!-- <el-table-column prop="cuniversidad" label="Universidad" min-width="80" align="center" header-align="center"></el-table-column> -->
        <el-table-column prop="puntaje" label="Puntaje" min-width="80" align="center" header-align="center"></el-table-column>
      </el-table>
    </div>

    <div v-if="total" class="ed-item">
      <el-alert
        :title="`Puntaje Total: ${total}`"
        type="info"
        effect="dark"
        center
        :closable="false">
      </el-alert>
    </div>
  
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

export default {

  mixins: [MixinInit],

  props: {
    idDocente : {
      required: true
    }
  },

  computed: {

  },

  mounted() {
    this.init()
  },

  data () {
    return {
      rubro: null,
      info: null,
      total: null
    }
  },

  watch: {

  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getData()
      loading.close() 
    },

    async getData () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/evaluacion_docente/rubro_5/${this.idDocente}`)
        if (res.status === 200) {
          this.rubro = res.data.rubro
          this.info = res.data.puntajes
          this.calcTotal(this.info)
        }
        
      } catch (err) {
        this.$hlp.errors(err)
        this.close()
      }
    },

    calcTotal (arr) {
      let total = 0
      arr.forEach(element => {
        total += parseFloat(element.puntaje)
      })

      this.total = total
    },

 
    close: function () {
      this.$emit('close')
    },
  }

}
</script>

<style lang="scss" scoped>

</style>


