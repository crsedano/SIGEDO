<template>
<div class="ed-container init">
  <div class="ed-item txt-center">
    <h1>
      <strong>Administrar Cargos</strong>
    </h1>
  </div>

  <div class="ed-item ed-container">
    <div class="ed-item sep-5">
      <label>Cargo</label>
      <el-input size="mini" v-model="gxCargo.nombre"></el-input>
    </div>
    <div class="ed-item sep-5">
      <label>Nivel</label>
      <el-input-number size="mini" v-model="gxCargo.nivel" :min="0" :max="1"></el-input-number>
    </div>
  </div>

  <div class="ed-item gr-center">
    <el-button v-if="isEdit" @click="updateCargo" size="mini" type="primary">Editar</el-button>
    <el-button v-else size="mini" @click="storeCargo" type="primary">Crear</el-button>
    <el-button v-if="isEdit" @click="cancelEdit" size="mini" type="danger">Cancelar</el-button>
  </div>
  
  <div class="ed-item sep-10">
    <el-table border stripe fit :data="arrData" height="310" highlight-current-row :row-class-name="tableRowClassName">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="id_cargo" label="ID" min-width="20" align="center" header-align="center"></el-table-column>
      <el-table-column prop="nombre" label="Cargo" min-width="200" align="center" header-align="center"></el-table-column>
      <el-table-column label="Activo" min-width="20" align="center" header-align="center">
        <template slot-scope="reg">
          {{reg.row.active == 1 ? 'SI' : 'NO'}}
        </template>
      </el-table-column>
      <el-table-column label="*" min-width="70" align="center" header-align="center">
        <template slot-scope="reg">
          <el-button size="mini" @click="goEdit(reg.row)" plain type="primary">Ir a Edición</el-button>
          <el-button v-if="reg.row.active == 1" size="mini" @click="deleteObj(reg.row)" plain type="danger">Desactivar</el-button>
          <el-button v-else size="mini" @click="activeCargo(reg.row)" plain type="info">Activar</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- <div v-if="objetivo" class="ed-item">
    <el-input v-model="objetivo.objetivo" :rows="5" type="textarea"></el-input>
    <el-button @click="editarObj" type="danger" size="mini" plain>Editar</el-button>
  </div> -->


</div>
</template>

<script>
// mixing
import mixingInit from '../../mixing/mixing_init.js'

export default {
  mixins: [
    mixingInit
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
      gxCargo: {
        id_cargo: '',
        nombre: '',
        nivel: 0,
        active: 1
      },
      isEdit: false
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
      
      this.isEdit = false
      this.gxCargo = {
        id_cargo: '',
        nombre: '',
        nivel: 0,
        active: 1
      }
      await this.getCargos()

      loading.close()
    },

    async getCargos () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/cargos/admin`)
        if(res.status !== 200) return
        this.arrData = res.data.cargos
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    goEdit (cargo) {
      this.gxCargo = cargo
      this.isEdit = true
    },

    async deleteObj (cargo) {
      try {
        const res = await this.axios.delete(`${this.URL_}v2/cargos/admin/${cargo.id_cargo}`)
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async activeCargo (cargo) {
      try {
        const res = await this.axios.put(`${this.URL_}v2/cargos/active/${cargo.id_cargo}`)
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async updateCargo() {
      try {
        const res = await this.axios.put(`${this.URL_}v2/cargos/admin/${this.gxCargo.id_cargo}`, this.gxCargo)
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async storeCargo () {
      try {
        const res = await this.axios.post(`${this.URL_}v2/cargos/admin`, this.gxCargo)
        if(res.status !== 201) return
        this.init()
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    cancelEdit () {
      this.gxCargo = {
        id_cargo: '',
        nombre: '',
        nivel: 0,
        active: 1
      }
      this.isEdit = false
    }


  
  },
}
</script>

<style lang="scss" scoped>

</style>

