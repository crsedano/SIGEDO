<template>
<div class="ed-container init w-modal">
  <i @click="close" class="fas fa-window-close action red iclose"></i>

  <h1 class="ed-item sep-10 gr-center">
    <strong>{{ sumilla.asignatura.nombre }}</strong>
  </h1>

  <div class="ed-item sep-20 ed-container">
    <div class="ed-item">
      <label>SUMILLA</label>
      <el-input :rows="5" type="textarea" v-model="sumilla.sumilla_obj"></el-input>
    </div>
    <div class="ed-item sep-10 gr-center">
      <el-button @click="editSumilla" v-if="isEdit" type="primary" plain size="mini">Editar</el-button>
      <el-button @click="saveSumilla" v-else type="primary" plain size="mini">Crear</el-button>
    </div>
  </div>
</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  props: {
    idSumilla: {
      default: 0
    }
  },

  components: {
    
  },

  mounted() {
    this.init()
  },

  data () {
    return {
      sumilla: {
        asignatura: {
          nombre: ''
        },
        sumilla: ''
      },
      isEdit: false
    }
  },

  watch: {

  },

  computed: {

  },

  methods: {
    async init () {
      this.checkEdit()
    },

    async checkEdit () {
      if(this.idSumilla == 0) {
        this.isEdit = false
        return
      }
      this.isEdit = true
      await this.getSumilla()
    },

    async getSumilla () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/sumillas/show/${this.idSumilla}`)
        
        let { status, data } = res

        if(status === 200)

        this.sumilla = data.sumilla
        
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async saveSumilla () {
      try {
        const res = await this.axios.post(`${this.URL_}v2/sumillas/create`, this.sumilla)

        if(res.status !== 201) return

        this.getSumilla()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async editSumilla () {
      try {
        const res = await this.axios.put(`${this.URL_}v2/sumillas/update/${this.sumilla.id_sumilla}`, this.sumilla)
        
        if(res.status !== 201) return

        this.getSumilla()
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


