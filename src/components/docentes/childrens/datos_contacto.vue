<template>
  <div class="ed-container init">
    
    <el-form label-position="top" size="mini" class="ed-item ed-container" ref="form" :model="gx_contacto_docente" label-width="120px">
      <el-form-item
        v-if="tipoContactos"
        class="ed-item sep-5 l-50 to-center gr-center" 
        label="TIPO CONTACTO"
        prop="id_tipo_contacto"
        :rules="[
          { required: true, message: 'El tipo de contacto es obligatorio', trigger: 'blur' }
        ]">
        <el-select filterable  v-model="gx_contacto_docente.id_tipo_contacto" placeholder="Seleccione un tipo">
          <el-option :label="tipo.ctipocontacto" v-for="(tipo, index) in tipoContactos" :key="index" :value="tipo.id_tipo_contacto"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item 
        class="ed-item sep-5 l-50 to-center" 
        label="CONTACTO"
        prop="cvalor"
        :rules="[
          { required: true, message: 'El contacto es obligatorio', trigger: 'blur' },
          { max: 200, message: 'Maximo 200 caracteres', trigger: ['blur', 'change'] }
        ]">
        <el-input v-model="gx_contacto_docente.cvalor"></el-input>
      </el-form-item>

      <div class="ed-item gr-center sep-15">
        <el-button size="medium" :disabled="!contactoValido" @click="saveContacto" type="primary" plain>Registrar</el-button>
      </div>
    </el-form>

    <div class="ed-item sep-10">
      <el-table
        border
        stripe
        fit
        :data="contactos"
        height="200"
        highlight-current-row
        :row-class-name="tableRowClassName"
        v-loading="ajaxContacto"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando Contactos..."
      >
        <el-table-column prop="ctipo" label="Tipo Contacto" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cvalor" label="Contacto" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            <i @click="deleteContacto(reg.row)" class="fas fa-trash-alt action red"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

    
  </div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

import GxContactoDocente from '../../../models/gx_contacto_docente.js'

import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex'

export default {
  mixins: [
    mixingInit
  ],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }

      if(!vm.dni) {
        vm.$notify.warning({
          title: 'PRECAUCIÓN',
          message: 'Seleccione o cree un docente para poder acceder a los datos de contacto',
          duration: 0
        })
        next('/docentes')
      }
    })
  },

  mounted () {
    this.init()
  },

  components:{
  },

  data() {
    return {
      gx_contacto_docente: new GxContactoDocente(),
      contactos: [],
      tipoContactos: null,
      ajaxContacto: false
    }
  },

  watch: {
    'gx_contacto_docente.id_tipo_contacto': function (n) {
      if (this.tipoContactos.find(t => t.id_tipo_contacto == n)) {
        this.gx_contacto_docente.ctipo = this.tipoContactos.find(t => t.id_tipo_contacto == n).ctipocontacto
      }
    },  
  },

  computed: {
    ...mapState({
      dni: state => state.docente.dni
    }),

    contactoValido: function () {
      return (
        this.gx_contacto_docente.id_tipo_contacto != '' &&
        this.gx_contacto_docente.cvalor.length<=200 &&
        this.gx_contacto_docente.cvalor != ''
      )
    },
  },

  methods: {
    init() {
      this.gx_contacto_docente.ccodusua = this.identity.id_usuario
      this.gx_contacto_docente.id_docente = this.dni
      this.getTipoContacto()
      this.getContactos(this.dni)
    },

    async getTipoContacto() {
      try {
        const res = await this.axios.get(`${this.URL}js-tipo-contacto`, this.autho)

        if(res.status === 200) {
          this.tipoContactos = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.tipoContactos = null
      }
    },

    async getContactos(id_docente) {
      this.ajaxContacto = true
      try {
        const res = await this.axios.get(`${this.URL}js-contacto-docente/${id_docente}`, this.autho)

        if(res.status === 200) {
          this.contactos = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.contactos = []
      }
      this.ajaxContacto = false
    },
    
    async saveContacto() {
      const loading = this.$loading({
        lock: true,
        text: 'Guardando contacto...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await await this.axios.post(`${this.URL}js-contacto-docente-save`, this.gx_contacto_docente, this.autho)

        if(res.status === 201) {
          this.init()
        }
      } catch (err) {
        console.dir(err)
        this.swAlert(`Ha ocurrido un error al registrar el contacto, intente nuevamente`, 'error')
      }      
      loading.close()
    },

    async deleteContacto({idreg}) {
      const loading = this.$loading({
        lock: true,
        text: 'Eliminando contacto...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      try {
        const res = await this.axios.delete(`${this.URL}js-contacto-docente-del/${idreg}`, this.autho)

        if(res.status === 201) {
          this.gx_contacto_docente = new GxContactoDocente()
          this.gx_contacto_docente.id_docente = this.dni
          this.getContactos(this.dni)
        }
      } catch (err) {
        console.dir(err)
      }
      loading.close()
    },

    tableRowClassName({
      row
    }) {
      return 'clase'
    },

  }
}
</script>

<style lang="scss">
.el-table {
  .clase {
    cursor: pointer;
    padding: 0;
    font-size: .8em;
  }
  td, th {
    padding: 5px 0 !important;
    color: #000 !important;
  }
}
</style>
