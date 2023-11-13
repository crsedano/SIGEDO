<template>
<div class="main">
  <div v-if="identity && token">

    <div v-if="!isAlumno__" class="Sidebar">
      <nave @seccion:open="openMenu"></nave>
    </div>

    <div id="content" class="Content">
      <header_t v-if="!isAlumno__"></header_t>
      <div v-if="!isAlumno__" @click="openMenu" class="menu-button pointer">
        <div class="ham"></div>
        <div class="ham"></div>
        <div class="ham"></div>
      </div>

      <router-view></router-view>
    </div>

  </div>

  <div class="ed-container full" v-else>
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import nave from './components/templates/nav.vue'
import header_t from './components/templates/header.vue'

import MixinInit from './mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  components: {
    nave,
    header_t,
  },

  mounted () {
    document.addEventListener('click', e => {
      if (!e.target.offsetParent) return 

      if (!e.target.offsetParent.classList.contains('Sidebar')) {
        let contenido = document.querySelector('.Sidebar')
        if (!contenido) return
        contenido.classList.remove('Open')
      }
    })
  },

  data() {
    return {
      show: false,
    }
  },

  methods: {
    openMenu () {
      let contenido = document.querySelector('.Sidebar')
      if (!contenido) return
      contenido.classList.toggle('Open')
    }
  }
}
</script>

<style lang="scss">
.main {
  min-height: 100vh;
  margin    : 0;
  padding   : 0;
}

.menu-button {
  position  : fixed;
  top       : 0;
  z-index   : 900;
  left      : 25px;
  margin-top: 7px;
  transition: 2s;

  & .ham {
    width           : 30px;
    height          : 3px;
    background-color: black;
    margin          : 6px 0;
  }

  &:hover {
    transform: rotate(360deg);
  }
}

.close-button {
  transition: .5s;

  &:hover {
    background   : rgb(199, 73, 73);
    border-radius: 25%;
    transform    : translateY(-3px);
  }
}

@media print {
  .no-imp {
    display: none;
  }
}

.Sidebar {
	position        : fixed;
	width           : 270px;
	height          : 100vh;
	max-height      : 100vh;
	overflow-y      : auto;
	z-index         : 999;
	background-color: #355C7D;
	color           : #a6a6a6;
	transform       : translateX(-270px);
	transition      : all 0.4s;
}

.Content {
	width   : 100%;
	height  : 100%;
	position: absolute;
}

.Open {
	transform: translateX(0);
}
</style>
