<template>
<div class="ed-item ed-container full Main Login">
  <div class="ed-item to-center ed-container Main-login">
    <div class="ed-item ed-container gr-center">
      <h4>
        <strong>SISTEMA DE GESTIÓN DOCENTE</strong>
      </h4>
      <img class="img-50" src="../../assets/img/111.png" alt="UPLA">
    </div>

    <h3 class="ed-item gr-center Sigedo">
      <strong>SIGEDO</strong>
    </h3>

    <div class="ed-item sep-10 ed-container">
      <form @submit.prevent="loginLaravel" class="ed-item s-80 to-center Main-login--form">
        <div v-if="msgError" class="alert alert-danger text-center">{{msgError}}</div>
        <div class="form-group">
          <label>Usuario</label>
          <input v-model="user.usuario" class="form-control" type="text" autocomplete="off">
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="user.password" class="form-control" type="password">
        </div>

        <button :disabled="!validLogin" class="btn btn-info to-center gr-center auto" type="submit">
          <i class="fas fa-sign-in-alt"></i>
          Acceder
        </button>
      </form>
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

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (vm.identity) {
        next('/inicio')
      }
    })
  },

  mounted() {
    
  },

  data: () => ({
    user: {
      usuario : '',
      password: ''
    },
    msgError: false,
    loading : false,
  }),

  computed: {
    validLogin: function () {
      return (
        this.user.usuario.length > 0 &&
        this.user.password.length > 0
      )
    }
  },

  methods: {
    async loginLaravel () {
      const loading = this.$loading({
        lock      : true,
        text      : 'Verificando datos...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL_}auth/login`, this.user)
        
        if(res.status === 200) {
          let token = res.data.token
          let identity = res.data.user
          this.ingresarSistema(token, identity)
        }

      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async getVariablesEntorno () {
      try {
        const res = await this.axios.get(`${this.URL}js-entorno`)
        
        if(res.status === 200) {
          this.$session.set('entorno', res.data.data)
          this.$store.commit('ENTORNO_UPDATE', res.data.data)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async getPeriodos() {
      try {
        const res = await this.axios.get(`${this.URL}js-periodo`)
        
        if (res.status === 200) {
          res.data.data.forEach(e => {
            if (e.estado == 1) {
              this.$session.set('periodo', e)
              this.$store.commit('PERIODO_UPDATE', e)
            }
          })
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async ingresarSistema (token, identity, tokenLaravel) {
      this.$session.start()
      this.$session.set('identity', identity)
      this.$session.set('token', token)
      this.$store.commit('TOKEN_UPDATE', token)
      this.$store.commit('IDENTITY_UPDATE', identity)
      await this.getVariablesEntorno()
      await this.getPeriodos()

      this.$router.push({
        name: 'Bienvenido'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Login {
    background-image     : url('../../assets/img/bg_login.jpeg');
    background-position  : center;
    background-repeat    : no-repeat;
    background-attachment: fixed;
    background-size      : cover;
    display              : table-cell;
    vertical-align       : inherit;
    height               : 100vh
}

.Login h3 {
    text-align: center;
    font-size : 30px;
    color     : #fff;
    background: url('../../assets/img/fondo_sigedo.png');
    padding   : 10px;
}

.Main {
  overflow-x     : hidden;
  overflow-y     : hidden;
  display        : flex;
  align-items    : center;
  justify-content: center;

  &-login {
    background   : #FFF;
    max-width    : 320px;
    box-shadow   : 14px 13px 15px -2px rgba(0, 0, 0, .75);
    height       : 85%;
    padding      : 25px;
    border-radius: 15px;

    &--form {
      display: block;
      margin : auto;
    }
  }
}

.auto {
  margin: auto
}

.img-50 {
  max-width: 30%;
}

.Sigedo {
  margin       : auto 20px;
  border-radius: 10px;
}
</style>


