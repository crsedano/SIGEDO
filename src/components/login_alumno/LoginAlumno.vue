<template>
<div class="LoginContainer">
  <div class="LoginContainer--main">
    <el-form @submit.native.prevent="logIn" class="LoginContainer--main--form" size="mini" label-position="top" label-width="80px">
      <el-form-item label="Código">
        <el-input v-model="alumno.codigo" placeholder="Código"></el-input>
      </el-form-item>
      <el-form-item label="Contraseña">
        <el-input v-model="alumno.password" type="password" placeholder="Contraseña"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="logIn" class="LoginContainer--main--form-button" type="primary">Ingresar</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
class Alumno {
  constructor ({codigo, password} = {codigo: '', password: ''}) {
    this.codigo   = codigo
    this.password = password
  }
}
import mixing_init from '@/mixing/mixing_init'

export default {
  name: 'login-alumno',

  mixins: [mixing_init],

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$session.exists()) {
        next('/mis-asignaturas')
      }
    })
  },

  data() {
    return {
      alumno: new Alumno(),
    }
  },

  methods: {
    async logIn () {
      const loading = this.$loading({
        lock: true,
        text: 'Verificando credenciales...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL_}auth/login-alumno`, this.alumno)
        
        let { status, data } = res

        if (status === 200) {
          let { token, user } = data
          this.ingresarSistema(token, user)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
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
      this.$session.set('isAlumno', true)
      this.$store.commit('ISALUMNO_UPDATE', true)
      await this.getPeriodos()

      this.$router.push({
        name: 'Bienvenido'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.LoginContainer {
  background-image     : url('../../assets/img/bg_login.jpeg');
  background-position  : center;
  background-repeat    : no-repeat;
  background-attachment: fixed;
  background-size      : cover;
  width                : 100vw;
  height               : 100vh;
  display              : flex;
  justify-content        : center;
  align-items          : center;

  &--main {
    max-width    : 290px;
    min-width    : 290px;
    background   : #ffffff9e;
    border-radius: 10px;
    padding: 15px;

    &--form {
      max-width: 75%;
      margin: auto;

      &-button {
        display: block;
        margin : auto;
      }
    }
  }
}
</style>

