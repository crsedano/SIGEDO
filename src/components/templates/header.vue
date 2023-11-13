<template>
<div class="layout-header">
  <div class="navbar navbar-default">

    <button class="navbar-toggler visible-xs-block collapsed" type="button" data-toggle="collapse" data-target="#navbar"
      style="position: fixed; right: 0; background: #355C7D">
      <span class="sr-only">Toggle navigation</span>
      <span class="arrow-up"></span>
      <span v-if="identity" class="ellipsis ellipsis-vertical">
        <img class="ellipsis-object" width="32" height="32" src="../../assets/img/perfil.jpg" :alt="identity.apellido_paterno + ' ' + identity.apellido_materno + ' ' + identity.nombres">
      </span>
    </button>

    <div class="navbar-toggleable" style="width: 100%">
      <nav id="navbar" class="navbar-collapse collapse">
        <ul v-if="identity" class="nav navbar-nav navbar-right" style="text-align: center">

          <template v-if="entorno && periodo">
            <li :class="['pointer', identity.ctipo == 1 ? 'cambiar-periodo' : '']" @click="abrirModalCambiarPeriodo"
              style="margin: 10px 25px;">
              <span class="badge">
                PERIODO ACTIVO:
                <strong>{{periodo.id_periodo}}</strong>
              </span>
            </li>
            <li style="margin: 10px 25px;">
              <span class="badge">
                SEMESTRE:
                <strong>{{periodo.id_semestre}}</strong>
              </span>
            </li>
          </template>

          <li class="dropdown hidden-xs">
            <button class="navbar-account-btn" data-toggle="dropdown" aria-haspopup="true">
              <img class="rounded" width="36" height="36" src="../../assets/img/perfil.jpg" :alt="identity.apellido_paterno + ' ' + identity.apellido_materno + ' ' + identity.nombres">
              {{identity.apellido_paterno}} {{identity.apellido_materno}}, {{identity.nombres}}
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
              <li class="divider"></li>
              <li>
                <router-link :to="{name: 'Password'}">
                  Cambio de Password
                </router-link>
              </li>
              <li>
                <a href="#" @click.prevent="logout">Cerrar Sesión</a>
              </li>
            </ul>
          </li>
          <li class="visible-xs-block" style="margin-top: 65px;">
            <a href="#" @click.prevent="logout">
              <span class="icon icon-power-off icon-lg icon-fw"></span>
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <div v-if="modalCambiarPeriodo" class="modal">
    <cambiar-periodo @close="cerrarModalCambiarPeriodo" />
  </div>
</div>
</template>

<script>
import cambiarPeriodo from './modals/cambiarPeriodo.vue'

import MixinInit from '../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  components: {
    cambiarPeriodo
  },

  data: () => ({
    modalCambiarPeriodo: false
  }),

  methods: {
    logout() {
      this.$router.push({
        name: 'Login'
      })
      this.$session.destroy()
      window.location.reload()
    },

    abrirModalCambiarPeriodo: function () {
      if (this.identity.ctipo == 1) {
        this.modalCambiarPeriodo = true
      }
    },

    cerrarModalCambiarPeriodo: function () {
      this.modalCambiarPeriodo = false
    },
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  max-height: 50px !important;
}

.layout-header {
  position: fixed;
  max-height: 50px !important;
}

.badge {
  background-color: #638ec3;
}

.navbar-toggleable {
  margin-left: 0;
}

.cambiar-periodo {
  & .badge {
    transition: 1s;
  }

  &:hover {
    animation: giro 2s 1;

    & .badge {
      transform: scale(1.1);
      background: rgb(252, 98, 98);
    }
  }
}

@keyframes giro {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-5deg);
  }

  50% {
    transform: rotate(0deg);
  }

  75% {
    transform: rotate(5deg);
  }

  100% {
    transform: rotate(0deg);
  }
}
</style>

