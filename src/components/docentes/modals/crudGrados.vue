<template>
<div class="ed-container init no-imp w-modal">
  <i v-if="path!='/aministrarDenominaciones'" @click="close" class="fa fa-window-close action red iclose"></i>
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      GRADOS ACADÉMICOS Y TÍTULOS
    </strong>
  </h2>

  <div v-if="tipoGrado != 0 && path!='/aministrarDenominaciones'">
    <span class="hint--top hint--bounce" aria-label="Crear nuevo grado / título">
      <i v-if="tipoGrado != 0" @click="createGrado" class="fas fa-plus-square action pointer"></i>
      <h4><i v-if="tipoGrado != 0 && path=='/aministrarDenominaciones'" @click="createGrado" class="fas fa-plus-square action pointer"></i></h4>
    </span>
  </div>
  <div v-else class="ed-item sep-10 gr-center">
    <span class="hint--top hint--bounce" aria-label="Crear nuevo grado / título">
      <h4><i v-if="tipoGrado != 0" @click="createGrado" class="fas fa-plus-square action pointer"></i></h4>
    </span>
  </div>

  

  <div class="ed-item ed-container">
    <div class="ed-item m-50 l-25 to-center sep-5 form-group">
      <label>Tipo</label>
      <select v-model="tipoGrado" class="form-control">
        <option :value="0">Seleccionar</option>
        <option :value="1">Bachiller</option>
        <option :value="2">Maestria</option>
        <option :value="3">Doctorado</option>
        <option :value="4">Post Doctorado</option>
        <option :value="5">Título</option>
      </select>
    </div>
  </div>

  <div class="ed-item gr-center m-60 l-40">
    <el-input v-model="filtro" v-if="grados" placeholder="Filtar" size="mini"></el-input>
  </div>

  <div class="ed-item sep-10">
    <el-table
      border
      stripe
      fit
      :data="gradosFilter"
      height="350"
      highlight-current-row
      :row-class-name="tableRowClassName"
      v-loading="ajaxGrados"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando grados académicos..."
    >
      <el-table-column type="index" fixed min-width="50" align="center" header-align="center"></el-table-column>
      <el-table-column label="Denominación" min-width="300" align="left" header-align="center">
        <template slot-scope="scope">
          {{"En "+scope.row.nombre}}
        </template>
      </el-table-column>
      <el-table-column label="*" min-width="50" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip effect="dark" content="Editar grado académico / tìtulo" placement="top">
            <i class="fas fa-edit action pointer" @click="editGrado(reg.row)"></i>
          </el-tooltip>
          <el-tooltip v-if="path=='/aministrarDenominaciones'" effect="dark" content="Eliminar grado académico / tìtulo" placement="top">
            <i class="fas fa-trash-alt action pointer" @click="eliminarDenominacion(reg.row.id_titulo)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

</div>
</template>

<script>
// Mixins
import mixingInit from '../../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

import GxDate from '../../../helpers/date'

import loading from '../../templates/loading.vue'
import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  // Evita la entrada por url directa
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if (!vm.permisos) {
        next('/')
        return
      }
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if (!s) {
        next('/')
      }
    })
    
  },

  mounted() {
    this.init()
    this.path=this.$route.fullPath
  },

  components: {
    loading,
    loader,
  },

  data: function () {
    return {
      modals: {

      },
      path:'',
      tipoGrado: 0,
      grados: null,
      gradosFilter: null,
      filtro: '',
      ajaxGrados: false
    }
  },

  computed: {

  },

  watch: {
    tipoGrado: function (n) {
      switch (n) {
        case 0:
          this.grados = null
          this.gradosFilter = null
          break
        case 1:
          this.getBachiller()
          break
        case 2:
          this.getMagister()
          break
        case 3:
          this.getDoctorado()
          break
        case 4:
          this.getPostDoctorado()
          break
        case 5:
          this.getTitulos()
          break

      }
    },

    filtro (n) {
      if(n == '') {
        this.gradosFilter = this.grados
      } else {
        this.gradosFilter = this.grados.filter(g => g.nombre.toUpperCase().includes(n.toUpperCase()))
      }
    }

  },

  methods: {
    init() {

    },

    editGrado: function (grado) {
      const vm = this

      alertify.prompt('SIGEDO', `Actualizar denominación '${grado.nombre}'`, grado.nombre, (evt, value) => {
        let nomb = this.toNomProp(value)
        vm.editDenominacion(nomb, grado.id_titulo)
      }, function () {

      })
    },

    editDenominacion: async function (nombre, id) {
      switch (this.tipoGrado) {
        case 1:
          await this.editBachiller(nombre, id)
          break;
        case 2:
          await this.editMagister(nombre, id)
          break;
        case 3:
          await this.editDoctorado(nombre, id)
          break;
        case 4:
          await this.editPostDoctorado(nombre, id)
          break;
        case 5:
          await this.editTitulo(nombre, id)
          break;
      }
    },
    eliminarDenominacion: async function (id) {
      const loading=this.$loading({
          lock: true,
          text: 'Eliminando...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      switch (this.tipoGrado) {
        case 1:
          await this.eliminarBachiller(id)
          break;
        case 2:
          await this.eliminarMagister(id)
          break;
        case 3:
          await this.eliminarDoctorado(id)
          break;
        case 4:
          await this.eliminarPostDoctorado(id)
          break;
        case 5:
          await this.eliminarTitulo(id)
          break;
      }
      loading.close()
    },

    createGrado: function () {
      const vm = this
      alertify.prompt('SIGEDO', `Nueva denominación(Escribir solo el nombre) `, '', (evt, value) => { 
        let nomb = this.toNomProp(value)
        vm.createDenominacion(nomb)
      }, function () {
      })
      
    },

    createDenominacion: function (nombre) {
      switch (this.tipoGrado) {
        case 1:
          this.createBachiller(nombre)
          break;
        case 2:
          this.createMagister(nombre)
          break;
        case 3:
          this.createDoctorado(nombre)
          break;
        case 4:
          this.createPostDoctorado(nombre)
          break;
        case 5:
          this.createTitulo(nombre)
          break;
      }
    },

    close: function () {
      this.$emit('close')
    },

    async getBachiller() {
      this.ajaxGrados = true
      try {
        const res = await this.axios.get(`${this.URL}js-bachiller`, this.autho)

        if (res.status === 200) {
          this.grados = res.data.data
          this.gradosFilter = res.data.data
        }
      } catch (err) {
        this.grados = null
        this.gradosFilter = null
        this.$hlp.errors(err)
      }
      this.ajaxGrados = false
    },

    async getTitulos() {
      this.ajaxGrados = true
      try {
        const res = await this.axios.get(`${this.URL}js-titulo`, this.autho)

        if (res.status === 200) {
          this.grados = res.data.data
          this.gradosFilter = res.data.data
        }
      } catch (err) {
        this.grados = null
        this.gradosFilter = null
        this.$hlp.errors(err)
      }
      this.ajaxGrados = false
    },

    async getMagister () {
      this.ajaxGrados = true
      try {
        const res = await this.axios.get(`${this.URL}js-magister`, this.autho)

        if(res.status === 200 ){
          this.grados = res.data.data
          this.gradosFilter = res.data.data
        }
      } catch (err) {
        this.grados = null
        this.gradosFilter = null
        this.$hlp.errors(err)
      }
      this.ajaxGrados = false
    },

    async getDoctorado() {
      this.ajaxGrados = true
      try {
        const res = await this.axios.get(`${this.URL}js-doctorado`, this.autho)

        if (res.status === 200) {
          this.grados = res.data.data
          this.gradosFilter = res.data.data
        }
      } catch (err) {
        this.grados = null
        this.gradosFilter = null
        this.$hlp.errors(err)
      }
      this.ajaxGrados = false
    },

    async getPostDoctorado() {
      this.ajaxGrados = true
      try {
        const res = await this.axios.get(`${this.URL}js-postdoctorado`, this.autho)

        if (res.status === 200) {
          this.grados = res.data.data
          this.gradosFilter = res.data.data
        }
      } catch (err) {
        this.grados = null
        this.gradosFilter = null
        this.$hlp.errors(err)
      }
      this.ajaxGrados = false
    },

    async editMagister(nombre, id) {
      try {
        const res = await this.axios.post(`${this.URL}js-edit-magister/${nombre}/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getMagister()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async editTitulo(nombre, id) {
      try {
        const res = await this.axios.post(`${this.URL}js-edit-titulo/${nombre}/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getTitulos()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async editBachiller(nombre, id) {
      try {
        const res = await this.axios.post(`${this.URL}js-edit-bachiller/${nombre}/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getBachiller()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async editDoctorado(nombre, id) {
      try {
        const res = await this.axios.post(`${this.URL}js-edit-doctorado/${nombre}/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getDoctorado()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async editPostDoctorado(nombre, id) {

      try {
        const res = await this.axios.post(`${this.URL}js-edit-postdoctorado/${nombre}/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getPostDoctorado()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async eliminarTitulo(id) {
      try {
        const res = await this.axios.post(`${this.URL}js-eliminar-titulo/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getTitulos()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async eliminarBachiller(id) {
      try {
        const res = await this.axios.post(`${this.URL}js-eliminar-bachiller/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getBachiller()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async eliminarMagister(id) {
      try {
        const res = await this.axios.post(`${this.URL}js-eliminar-magister/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getBachiller()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },
    async eliminarDoctorado(id) {
      try {
        const res = await this.axios.post(`${this.URL}js-eliminar-doctorado/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getDoctorado()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async eliminarPostDoctorado(id) {

      try {
        const res = await this.axios.post(`${this.URL}js-eliminar-postdoctorado/${id}`, {}, this.autho)

        if (res.status === 201) {
          this.getPostDoctorado()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async createTitulo(nombre) {
      try {
        const res = await this.axios.post(`${this.URL}js-insert-titulo/${nombre}`, {}, this.autho)

        if (res.status === 201) {
          this.getTitulos()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async createBachiller(nombre) {
      try {
        const res = await this.axios.post(`${this.URL}js-insert-bachiller/${nombre}`, {}, this.autho)

        if (res.status === 201) {
          this.getBachiller()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },


    async createMagister(nombre) {
      try {
        const res = await this.axios.post(`${this.URL}js-insert-magister/${nombre}`, {}, this.autho)

        if (res.status === 201) {
          this.getMagister()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async createDoctorado(nombre) {
      try {
        const res = await this.axios.post(`${this.URL}js-insert-doctorado/${nombre}`, {}, this.autho)

        if (res.status === 201) {
          this.getDoctorado()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async createPostDoctorado(nombre) {
      try {
        const res = await this.axios.post(`${this.URL}js-insert-postdoctorado/${nombre}`, {}, this.autho)

        if (res.status === 201) {
          this.getPostDoctorado()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

