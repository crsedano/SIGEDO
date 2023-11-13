<template>
<div class="ed-container init w-modal">
  <i @click="close" class="fa fa-window-close action red iclose"></i>

  
  <!-- <div class="ed-item ed-container init"> -->
    <div class="ed-item sep-10">
      <el-table border stripe fit :data="arrData" height="310" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="id_silabus_obj" label="ID" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="tipo_obj" label="Tipo" min-width="30" align="center" header-align="center"></el-table-column>
        <el-table-column prop="objetivo" label="Objetivo" min-width="150" align="center" header-align="center"></el-table-column>
        <el-table-column prop="orden" label="Orden" min-width="20" align="center" header-align="center"></el-table-column>
        <el-table-column prop="*" min-width="70" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button size="mini" @click="goEdit(reg.row)" plain type="primary">Ir a Edición</el-button>
            <el-button size="mini" @click="deleteObj(reg.row)" plain type="danger">Eliminar</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  <!-- </div> -->

  <div v-if="objetivo" class="ed-item">
    <el-input v-model="objetivo.objetivo" :rows="5" type="textarea"></el-input>
    <el-button @click="editarObj" type="danger" size="mini" plain>Editar</el-button>
  </div>


</div>
</template>

<script>
// mixing
import mixingInit from '../../../mixing/mixing_init.js'

export default {
  mixins: [
    mixingInit
  ],
  
  props: [
    'id_asignatura'
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
    
  },

  data: function () {
    return {
      arrData: null,
      objetivo: null
    }
  },

  computed: {

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
      
      await this.getObjetivos()

      loading.close()
    },

    async getObjetivos () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL_}v2/sumillaObjetivos/byAsignatura/${this.id_asignatura}/${id_periodo}/${id_semestre}`)
        if(res.status !== 200) return
        this.arrData = res.data.data
      } catch (err) {
        this.arrData = null
        this.$hlp.errors(err)
      }
    },

    async goEdit (obj) {
      this.objetivo = obj
    },

    async editarObj () {
      try {
        const res = await this.axios.put(`${this.URL_}v2/sumillaObjetivos/edit/${this.objetivo.id_silabus_obj}`, this.objetivo)
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.objetivo = null
    },

    async deleteObj (obj) {
      try {
        const res = await this.axios.delete(`${this.URL_}v2/sumillaObjetivos/delete/${obj.id_silabus_obj}`)

        if(res.status !== 201) return

        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    close () {
      this.$emit('close')
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

