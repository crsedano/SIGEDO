<template>
    <div class="ed-container init">
        <h3 class="ed-item  gr-center">
            <strong>CARGA LECTIVA</strong>
        </h3>

        <ul class="nav nav-tabs">
            <li :class="cargaLectivaTab ? 'active' : ''">
                <a @click.prevent="abrirCargaLectiva" href="#">Escuelas</a>
            </li>
            <li :class="[facultadesTab ? 'active' : '']">
                <a @click.prevent="abrirFacultades" href="#">Facultades</a>
            </li>
            <li :class="[cursoGeneralesTab ? 'active' : '', 'disabled']">
                <a>Cursos Generales</a>
            </li>
            <li :class="[cursoEspecificoTab ? 'active' : '', 'disabled']">
                <a>Cursos Especificos</a>
            </li>
        </ul>

        <transition enter-active-class="animated zoomInDown" leave-active-class="animated zoomOutLeft">
            <div class="ed-item ed-container" v-if="cargaLectivaTab">
                <div v-if="load" class="ed-item gr-center">
                    <loading />
                </div>

                <div v-else class="ed-item m-95 l-90 to-center ed-container table-content" id="carga-lectiva">
                    <table class="table table-responsive table-striped table-bordered table-hover table-own table-carga">
                        <thead class="table-head">
                            <tr>
                                <th>#</th>
                                <th>FILIAL</th>
                                <th>FACULTAD</th>
                                <th>ESCUELA</th>
                                <th>MODALIDAD</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody class="table-body">
                            <tr v-for="(user, index) in userEscuela" :key="index">
                                <td class="w-10">{{index + 1}}</td>
                                <td>{{user.filial}}</td>
                                <td>{{user.facultad}}</td>
                                <td>{{user.escuela}}</td>
                                <td>{{user.modalidad}}</td>
                                <td class="w-10">
                                    <span class="hint--left hint--bounce hint--success" :aria-label="`Ver cursos de ${user.escuela}`">
                                        <i @click="abrirCursosEspecificos(user)" class="fas fa-chalkboard-teacher pointer action"></i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </transition>

        <transition enter-active-class="animated zoomInDown" leave-active-class="animated zoomOutLeft">
            <div class="ed-item ed-container" v-if="cursoEspecificoTab">
                <asig-esp 
                    id="cursoEspecificoTab" 
                    :user="userEsp" 
                    @asig="abrirAsigDocentesEsp" 
                    @salones="abrirModalSalones" 
                    @loader="ajaxLoad = true"
                />
            </div>
        </transition>

        <transition enter-active-class="animated zoomInDown" leave-active-class="animated zoomOutLeft">
            <div class="ed-item ed-container" v-if="facultadesTab">
                <div class="ed-item m-95 l-90 to-center ed-container table-content" id="facultadesTab">
                    <table class="table table-responsive table-striped table-bordered table-hover table-own table-carga">
                        <thead class="table-head">
                            <tr>
                                <th>#</th>
                                <th>FILIAL</th>
                                <th>FACULTAD</th>
                                <th>MODALIDAD</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody class="table-body">
                            <tr v-for="(user, index) in facultades" :key="index">
                                <td class="w-10">{{index + 1}}</td>
                                <td>{{user.filial}}</td>
                                <td>{{user.facultad}}</td>
                                <td>{{user.modalidad}}</td>
                                <td class="w-10">
                                    <span>
                                        <i @click="abrirCursosGenerales(user)" class="fas fa-chalkboard-teacher pointer action"></i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </transition>

        <transition enter-active-class="animated zoomInDown" leave-active-class="animated zoomOutLeft">
            <div class="ed-item ed-container" v-if="cursoGeneralesTab">
                <asig-gen 
                    id="cursoGeneralesTab" 
                    :user="userGen"
                    @asig="abrirAsigDocentesEsp" 
                    @salones="abrirModalSalones" 
                    @loader="ajaxLoad = true"
                />
            </div>
        </transition>

        <transition enter-active-class="animated slideInDown" leave-active-class="animated pulse">
            <div v-if="asigDocentesEsp" class="modal">
                <asig-docentes-esp 
                    id="asig-docente" 
                    :curso="cursoDocenteEsp" 
                    :teorico="teoricoDocenteEsp" 
                    :practico="practicoDocenteEsp"
                    :spteorico="spteoricoDocenteEsp" 
                    :sppractico="sppracticoDocenteEsp" 
                    :svteorico="svteoricoDocenteEsp" 
                    :svpractico="svpracticoDocenteEsp"
                    :facultad="facultadDocenteEsp" 
                    @close="cerrarAsigDocentesEsp" 
                />
            </div>
        </transition>

        <transition enter-active-class="animated slideInDown" leave-active-class="animated hinge">
            <div v-if="modalSalones" class="modal">
                <salones 
                    id="modal-salones" 
                    :teorico="salonesTeorico" 
                    :practico="salonesPractico" 
                    :spteorico="spsalonesTeorico" 
                    :sppractico="spsalonesPractico"
                    :svteorico="svsalonesTeorico" 
                    :svpractico="svsalonesPractico" 
                    :curso="salonesCurso" 
                    :facultad="salonesFacultad"
                    :is-fac="isFacu"
                    @close="cerrarModalSalones" 
                />
            </div>
        </transition>
        <div v-if="ajaxLoad" class="modal f-row f-center">
            <loader />
        </div>
    </div>
</template>

<script>
import MixinInit from '../../mixing/mixing_init.js'

import Animate from '../../helpers/animate'

import pagination from '../templates/pagination.vue'
import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import asigEsp from './tables/asigEsp.vue'
import asigGen from './tables/asigGen.vue'

import asigDocentesEsp from './modals/asigDocentesEsp.vue'
import salones from './modals/salones.vue'

export default {
  mixins: [
    MixinInit
  ],
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if(!vm.permisos) {
        next('/')
        return
      } 
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if(!s) {
        next('/')
      }
    })
  },

  mounted() {
    this.init()
  },

  components: {
    pagination,
    loading,
    loader,
    asigEsp,
    asigGen,
    asigDocentesEsp,
    salones
  },

  data() {
    return {
      userEscuela: null,
      facultades: null,

      userEsp: null,
      // tabCurEsp: false,

      userGen: null,

      load: false,

      cargaLectivaTab: true,
      cursoEspecificoTab: false,
      facultadesTab: false,
      cursoGeneralesTab: false,

      asigDocentesEsp: false,
      cursoDocenteEsp: null,
      teoricoDocenteEsp: null,
      practicoDocenteEsp: null,
      facultadDocenteEsp: null,

      spteoricoDocenteEsp: null,
      sppracticoDocenteEsp: null,

      svteoricoDocenteEsp: null,
      svpracticoDocenteEsp: null,

      modalSalones: false,
      salonesTeorico: null,
      salonesPractico: null,
      salonesCurso: null,
      salonesFacultad: null,

      spsalonesTeorico: null,
      spsalonesPractico: null,

      svsalonesTeorico: null,
      svsalonesPractico: null,

      isFacu: false,

      ajaxLoad: false,
    }
  },

  computed: {

  },

  methods: {
    init() {
      this.getFacultadesUsuario()
      this.getUsuarioEscuela()
    },

    async getUsuarioEscuela() {
      this.load = true
      try {
        const res = await this.axios.get(`${this.URL}js-user-escuela/${this.identity.id_usuario}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)

        if (res.status === 200) {
          this.userEscuela = res.data.data

          this.facultades = []
          this.userEscuela.forEach(u => {
            if (!this.facultades.some(f => f.id_facultad == u.id_facultad && f.id_modalidad == u.id_modalidad && f.id_filial == u.id_filial)) {
              this.facultades.push(u)
            }
          })
        }
      } catch (err) {
        this.userEscuela = null
        this.$hlp.errors(err)
      }
      this.load = false
    },

    getFacultadesUsuario: function () {
      this.axios.get(`${this.URL}/js-facultad-userescuela/${this.identity.id_usuario}`, this.autho)
        .then(res => {})
        .catch(err => {
          console.dir(err)
        })
    },

    abrirCargaLectiva: function () {
      this.cargaLectivaTab = true
      this.cursoEspecificoTab = false
      this.facultadesTab = false
      this.cursoGeneralesTab = false
    },

    abrirFacultades: function () {
      this.cursoEspecificoTab = false
      this.cargaLectivaTab = false
      this.cursoGeneralesTab = false
      this.facultadesTab = true
    },

    abrirCursosEspecificos: function (user) {
      this.userEsp = user
      this.cargaLectivaTab = false
      this.facultadesTab = false
      this.cursoGeneralesTab = false
      this.cursoEspecificoTab = true
    },

    abrirCursosGenerales: function (user) {
      this.userGen = user
      this.cursoEspecificoTab = false
      this.cargaLectivaTab = false
      this.facultadesTab = false
      this.cursoGeneralesTab = true
    },

    abrirAsigDocentesEsp: function (curso) {
      this.cursoDocenteEsp = curso.curso
      this.teoricoDocenteEsp = curso.teorico
      this.practicoDocenteEsp = curso.practico
      this.spteoricoDocenteEsp = curso.spteorico
      this.sppracticoDocenteEsp = curso.sppractico
      this.svteoricoDocenteEsp = curso.svteorico
      this.svpracticoDocenteEsp = curso.svpractico
      this.facultadDocenteEsp = curso.facultad

      this.asigDocentesEsp = true
      this.ajaxLoad = false
    },

    cerrarAsigDocentesEsp: function () {
      this.asigDocentesEsp = false
    },

    abrirModalSalones: function (salones) {
      // this.ajaxLoad = true
      this.salonesTeorico = salones.teorico
      this.salonesPractico = salones.practico
      this.salonesCurso = salones.curso
      this.spsalonesTeorico = salones.spteorico
      this.spsalonesPractico = salones.sppractico
      this.svsalonesTeorico = salones.svteorico
      this.svsalonesPractico = salones.svpractico
      this.salonesFacultad = salones.facultad
      this.isFacu = salones.isFacu
      this.modalSalones = true
      // setTimeout(() => {
      this.ajaxLoad = false
      // }, 800);
    },

    cerrarModalSalones: function () {
      this.modalSalones = false
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  color: #000;
}

.loading {
  text-align: center;
}

.table-carga {
  max-height: 70vh;
}

.active {
  & a {
    background: rgb(242, 242, 242) !important;
    color: #0f6ecd !important;
  }
}

</style>

