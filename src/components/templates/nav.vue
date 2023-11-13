<template>
<div>
  <a href="/#/">
    <img class="logo" src="../../assets/img/logo_cabecera.png" alt="Logo-Upla">
  </a>

  <ul class="main-nav">
    <li v-for="(mod, index) in modulos" :key="index" class="nav-parent pointer">
      {{mod.main_menu}}
      <ul class="sub-list hide">
        <router-link @click.native="closeNav" tag="li" v-for="(sub, isub) in mod.sub" :key="isub" :to="{path: sub.urlv.substr(2, sub.urlv.length)}">
          <a>{{sub.sub_menu}}</a>
        </router-link>
      </ul>
    </li>
  </ul>
</div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  mounted() {
    this.init()
  },

  data() {
    return {
      modulo: '',
      refresh: '',
      refreshActual: '',
      modulos: []
    }
  },

  methods: {
    init() {
      this.getPermisos()
      this.openMenu()
    },

    async getPermisos() {
      try {
        const res = await this.axios.get(`${this.URL}permisos/${this.identity.id_usuario}`, this.autho)

        if(res.status === 200) {
          let permisos = res.data.data

            this.$store.commit('PERMISOS_UPDATE', permisos)

            this.modulos = []

            this.permisos.map(p => {
              if(!this.modulos.some(m => m.id_tipomodulo == p.id_tipomodulo)) {
                this.$set(p, 'sub', [])
                this.modulos.push(p)
              }
            })

            this.modulos.forEach(m => {
              this.permisos.forEach(p => {
                if(m.id_tipomodulo == p.id_tipomodulo) {
                  m.sub.push(p)
                }
              })
            })
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    openSection(e) {
      if (e.target.classList.contains('click-open')) {
        this.$emit('seccion:open')
      }
    },

    closeNav() {
      this.$emit('seccion:open')
    },

    openMenu() {
      const mainNav = document.querySelector('.main-nav')

      if(mainNav) {
        mainNav.addEventListener('click', ev => {
          const elem = ev.target

          if(elem.classList.contains('nav-parent')) {
            const subList = elem.querySelector('.sub-list')

            const navParents = mainNav.querySelectorAll('.nav-parent')

            elem.classList.toggle('open')

            if(subList) {
              subList.classList.toggle('hide')
            }

            Array.from(navParents).forEach(parent => {

              if(parent.classList.contains('open') && elem !== parent) {
                parent.classList.remove('open')
              }

              const sl = parent.querySelector('.sub-list')
              if(subList !== sl) {
                sl.classList.add('hide')
              }
            })
          }

        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-nav {
  text-decoration: none;
  list-style: none;
  padding: 0 1em;

  & .nav-parent {
    font-weight: bold;
    color: #ccc;
    font-size: 1.1em;
    margin: .8em auto;
    padding: 10px;
    transition: 1s;
    max-width: 250px;

    &.open {
      background: rgba(0, 0, 0, 0.719);
      border-radius: 10px;
    }

    & span {
      font-size: 1.1em;
    }

    & .sub-list {
      padding: .5em;
      list-style: none;
      font-size: .9em;
      font-weight: normal;
      transition: 3s;
      display: block;

      &.hide {
        display: none;
      }

      & li {
        padding: 4px;
        transition: .5s;

        & a {
          text-decoration: none;
          color: #ccc;
        }

        &:hover {
          background: rgb(0, 0, 0);
          border-radius: 10px;
          text-align: center;

          & a {
            font-weight: bold;
          }
        }
      }
    }
  }
}

.logo {
  display: block;
  margin: 3px auto;
}

.router-link-exact-active {
  background: rgb(0, 0, 0);
  border-radius: 10px;
  font-weight: bold;
  text-align: center;
}
</style>


