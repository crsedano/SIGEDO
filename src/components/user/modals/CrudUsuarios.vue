<template>
<div class="ed-container">
  
  <el-form size="mini" class="ed-item sep-5 ed-container" label-position="top" label-width="120px">
    <el-form-item class="ed-item m-50" label="DNI">
      <el-input :disabled="isEdit" @keypress.enter.native="getDataByDni" v-model="user.dni"></el-input>
    </el-form-item>
    <el-form-item class="ed-item m-50" label="Nombres">
      <el-input v-model="user.nombres"></el-input>
    </el-form-item>
    <el-form-item class="ed-item m-50" label="Apellido Paterno">
      <el-input v-model="user.apellido_paterno"></el-input>
    </el-form-item>
    <el-form-item class="ed-item m-50" label="Apellido Materno">
      <el-input v-model="user.apellido_materno"></el-input>
    </el-form-item>
    <el-form-item class="ed-item m-50" label="Correo Electrónico">
      <el-input v-model="user.correo_electronico"></el-input>
    </el-form-item>
    <el-form-item class="ed-item m-50" label="Administrador">
      <el-checkbox v-model="isAdmin">Es Administrador</el-checkbox>
    </el-form-item>
    <el-form-item class="ed-item" label="Observaciones">
      <el-input v-model="user.observaciones" type="textarea"></el-input>
    </el-form-item>
    <el-form-item class="ed-item txt-center">
      <el-button :disabled="!valid" @click="editUsuario" v-if="isEdit" type="primary">Editar</el-button>
      <el-button :disabled="!valid" @click.once="create" v-else type="primary">Guardar</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import GxUser from '../../../models/gx_user';

export default {

  mixins: [MixinInit],

  props: {
    idUsuario: {
      default () {
        return null
      }
    }
  },

  computed: {
    valid: function () {
      return (
        this.user.apellido_materno != '' &&
        this.user.apellido_paterno != '' &&
        this.user.nombres != '' &&
        this.user.dni.length == 8
      )
    },

    isAdmin: {
      get () {
        return this.user.ctipo == 1
      },

      set ($val) {
        if($val) {
          this.user.ctipo = 1
        } else {
          this.user.ctipo = 0
        }
      }
    },

    isEdit () {
      return (this.user.id_usuario !== '' && this.user.id_usuario != null)
    }
  },

  mounted() {
    this.init()
  },

  data () {
    return {
      user: new GxUser(),
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
      await this.getUserData()
      loading.close() 
    },

    async getUserData () {
      if(!this.idUsuario) return
      
      try {
        const res = await this.axios.get(`${this.URL_}v2/usuarios/by_id/${this.idUsuario}`)
        if(res.status === 200) {
          let usuario = res.data.user
          this.user.apellido_materno = usuario.apellido_materno
          this.user.apellido_paterno = usuario.apellido_paterno
          this.user.correo_electronico = usuario.correo_electronico
          this.user.dni = usuario.dni
          this.user.ctipo = usuario.ctipo
          this.user.id_usuario = usuario.id_usuario
          this.user.nombres = usuario.nombres
          this.user.observaciones = usuario.observaciones
        }
      } catch (err) {
        await this.getDataDocente()
        this.$hlp.errors(err)
      }
    },

    async create() {
      try {
        const res = await this.axios.post(`${this.URL_}v2/usuarios/create`, this.user)

        if (res.status === 201) {
          this.$notify.success({
            title: 'Éxito',
            message: 'Usuario creado con éxito'
          })
          this.$emit('creado')
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async getDatauser () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/usuarios/show/${this.user.dni}`)
        
        if(res.status === 200) {
          let usuario = res.data.user
          
          this.user.apellido_materno = usuario.apellido_materno
          this.user.apellido_paterno = usuario.apellido_paterno
          this.user.correo_electronico = usuario.correo_electronico
          this.user.dni = usuario.dni
          this.user.ctipo = usuario.ctipo
          this.user.id_usuario = usuario.id_usuario
          this.user.nombres = usuario.nombres
          this.user.observaciones = usuario.observaciones
        }
      } catch (err) {
        await this.getDataDocente()
      }
    },

    async getDataDocente () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/docentes/by_dni/${this.user.dni}`)
        
        if(res.status === 200) {
          let docente = res.data.docente
          let { dni, cpaterno, cmaterno, cnombres, email } = docente
          this.user.dni = dni
          this.user.nombres = cnombres
          this.user.apellido_paterno = cpaterno
          this.user.apellido_materno = cmaterno
          this.user.correo_electronico = email
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async getDataByDni () {
      const loading = this.$loading({
        lock: true,
        text: 'Obteniendo datos...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getDatauser()
      loading.close()
    },

    async editUsuario () {
      try {
        const res = await this.axios.put(`${this.URL_}v2/usuarios/update_user/${this.user.id_usuario}`, this.user)
        if(res.status === 201) {
          this.$emit('creado')
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    close: function () {
      this.$emit('close')
    },
  }

}
</script>

<style lang="scss" scoped>

</style>


