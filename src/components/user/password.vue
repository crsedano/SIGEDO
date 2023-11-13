<template>
<div class="ed-container init no-imp">
  <h2 v-if="identity" class="ed-item sep-10 gr-center">
    <strong>
      CAMBIAR CONTRASEÑA - {{identity.apellido_paterno}} {{identity.apellido_materno}} {{identity.nombres}}
    </strong>
  </h2>


  <div class="ed-item m-50 l-40 to-center ed-container sep-10">
    <div class="ed-item sep-10 form-group">
      <input-validate v-model="gx_user.anterior" placeholder="Contraseña Actual" type="password" required :upper-case="false" />
    </div>

    <div class="ed-item sep-10 form-group">
      <input-validate v-model="gx_user.contrasena" placeholder="Contraseña Nueva (Mínimo 7 caracteres)" type="password"
        required :upper-case="false" />
    </div>

    <div @click="cambiarPass" class="ed-item gr-center sep-10">
      <button :disabled="!valid" class="btn btn-info btn-rounded">
        Cambiar Contraseña
      </button>
    </div>
  </div>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

import GxDate from '../../helpers/date'

import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import inputValidate from './modals/inputValidate.vue'

import GxUser from '../../models/gx_user';

export default {
  mixins: [
    MixinInit
  ],
  // Evita la entrada por url directa
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
    })
  },

  mounted() {
    this.getIdentity()
  },

  components: {
    loading,
    loader,
    inputValidate
  },

  data: function () {
    return {
      gx_user: new GxUser()
    }
  },

  computed: {
    'valid': function () {
      return (
        this.gx_user.anterior != '' &&
        this.gx_user.contrasena.length >= 7
      )
    }
  },

  watch: {

  },

  methods: {
    async cambiarPass() {
      try {
        const res = await this.axios.post(`${this.URL}js-change-pass/${this.identity.id_usuario}/${this.identity.dni}`, this.gx_user, this.autho)

        if (res.status === 201) {
          this.$notify.success({
            title: 'Éxito',
            message: res.data.message
          })
          this.gx_user = new GxUser()
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

