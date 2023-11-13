<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item ed-container title-bar gr-center">
    <h3 class="ed-item gr-center sep-10">
      REGITRO USUARIOS
    </h3>
  </div>
  <div class="ed-item ed-container m-80 to-center">
    <div class="ed-item ed-container sep-5">
      <div class="form-group ed-item m-50">
        <label>DNI</label>
        <input :disabled="isEdit" @keyup.enter="getDataByDni" v-model="usuario.dni" type="number" maxlength="8" minlength="8" :class="['form-control', dniIncorrect]">
      </div>
      <div class="form-group ed-item m-50 sep-2">
        <label>Nombres</label>
        <input v-model="usuario.nombres" type="text" class="form-control">
      </div>
    </div>
    <div class="ed-item ed-container sep-5">
      <div class="form-group ed-item m-50 sep-2">
        <label>Apellido Paterno</label>
        <input v-model="usuario.apellido_paterno" type="text" class="form-control">
      </div>
      <div class="form-group ed-item m-50">
        <label>Apellido Materno</label>
        <input v-model="usuario.apellido_materno" type="text" class="form-control">
      </div>
    </div>
    <div class="ed-item ed-container sep-5">
      <div v-if="!isEdit" class="form-group ed-item m-50 sep-2">
        <label>Contraseña</label>
        <input v-model="usuario.contrasena" type="password" :class="['form-control', contrasenaIncorrect]">
      </div>
      <div class="form-group ed-item m-50 sep-2">
        <label>Correo Electrónico</label>
        <input v-model="usuario.correo_electronico" type="email" class="form-control">
      </div>
    </div>
    <div class="ed-item ed-container sep-5">
      <div class="form-group ed-item m-50 sep-2">
        <label>Observaciones</label>
        <textarea v-model="usuario.observaciones" class="form-control" cols="30" rows="2"></textarea>
      </div>
    </div>
    <div class="ed-item ed-container sep-5">
      <div class="form-group ed-item m-15 sep-2">
        <label>Administrador: </label>
        <input v-model="usuario.ctipo" type="checkbox" class="form-control">
      </div>
    </div>

    <div class="form-group ed-item sep-15">
      <button :disabled="!valid" v-if="!isEdit" @click="crearUsuario" class="btn btn-info btn-centered btn-hov">
        <i class="fas fa-user-check"></i>
        Crear
      </button>
      <button @click="editUsuario" v-else class="btn btn-info btn-centered btn-hov">
        <i class="fas fa-user-tag"></i>
        Editar
      </button>
    </div>
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import GXUser from '../../../models/gx_user';

export default {

  mixins: [
    MixinInit
  ],

  props: ['user', 'isEdit'],

  computed: {
    usuario: function () {
      return this.user
    },

    valid: function () {
      return (
        this.user.apellido_materno != '' &&
        this.user.apellido_paterno != '' &&
        this.user.nombres != '' &&
        this.user.dni.length == 8 &&
        this.user.contrasena.length >= 7
      )
    }
  },

  mounted() {
    this.init()
  },

  data: () => ({
    dniIncorrect: '',
    contrasenaIncorrect: ''

  }),

  watch: {
    'user.dni': function (n) {
      if (n.length > 0 && n.length != 8) {
        this.dniIncorrect = 'input-incorrect'
      } else {
        this.dniIncorrect = ''
      }
    },

    'user.contrasena': function (n) {
      if (n.length > 0 && n.length < 7) {
        this.contrasenaIncorrect = 'input-incorrect'
      } else {
        this.contrasenaIncorrect = ''
      }
    }
  },

  methods: {
    init() {
      this.teclasRapidas()
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })
    },

    async crearUsuario() {
      try {
        const res = await this.axios.post(`${this.URL}js-ins-usuario`, this.usuario, this.autho)

        if (res.status === 201) {
          this.$notify.success({
            title: 'Éxito',
            message: 'Usuario creado con éxito'
          })
          this.close()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async getDataByDni () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/docentes/by_dni/${this.user.dni}`)
        if(res.status !== 200) return
        let docente = res.data.docente
        let { dni, cpaterno, cmaterno, cnombres, email } = docente
        this.usuario.dni = dni
        this.usuario.nombres = cnombres
        this.usuario.apellido_paterno = cpaterno
        this.usuario.apellido_materno = cmaterno
        this.usuario.correo_electronico = email
      } catch (err) {
        this.usuario.nombres = ''
        this.usuario.apellido_paterno = ''
        this.usuario.apellido_materno = ''
        this.usuario.correo_electronico = ''
        this.$hlp.errors(err)
      }
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
.sub-main {
  color: #000;
  background: white;
  border-radius: 25px;

  & .iclose {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 2em;
  }

  & input {
    text-align: center;
  }
}
</style>


