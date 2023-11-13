<template>
<div class="ed-container init no-imp">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      DICE DEBE DECIR
    </strong>
    <span class="hint--right hint--bounce hint--warning" aria-label="No olvide que solo se puede acceder a las facultades que previamente hayan sido cerradas">
      <i class="fas fa-exclamation-circle" style="color: red"></i>
    </span>
  </h2>

  <div class="ed-item sep-5 ed-container sep-5">
    <div v-if="facultades" class="ed-item m-30 to-center sep-5 form-group">
      <select :disabled="modalidad == ''" v-model="facultadSelect" @change="getDocentesAsigDoc" class="form-control">
        <option :value="0">SELECCIONE UNA FACULTAD</option>
        <option :disabled="facultad.cestado == 0" v-for="(facultad, index) in facultades" :key="index" :value="facultad.id_facultad">
          {{facultad.nombre}}
        </option>
      </select>
    </div>

    <div v-if="docentes" class="ed-item m-30 to-center sep-5 sep-5 form-group">
      <input v-model="filtroDocente" type="text" class="form-control" placeholder="Filtrar Docente">
    </div>

    <div class="ed-item m-30 to-center sep-5 form-group">
      <label>
        Presencial
        <input v-model="modalidad" value="1" type="radio">
      </label>
      <label>
        Semipresencial
        <input v-model="modalidad" value="2" type="radio">
      </label>
    </div>
  </div>

  <div v-if="docentes" class="ed-item m-80 l-60 to-center sep-10 table-content" style="max-height: 450px;">
    <table class="table table-responsive table-striped table-bordered table-hover table-own">
      <thead class="table-head">
        <tr>
          <th></th>
          <th>DNI</th>
          <th>Docente</th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(docente, index) in docentesFilter" :key="index">
          <th class="w-10">
            <i @click="selectDocente(docente)" class="fas fa-mouse-pointer pointer action"></i>
            <a v-if="modalidad == 1 && docente.dice_debe_decir == 1" target="_blank" :href="`${URLPDF}api/src/reportes/dice_debe_decir/dice_debe_decir_p.php?id_docente=${docente.id_docente}&id_facultad=${facultadSelect}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&token=${token}`">
              <i class="fas fa-file-pdf" style="font-size: 1.5em"></i>
            </a>
            <a v-else-if="modalidad == 2 && docente.dice_debe_decir == 1" target="_blank" :href="`${URLPDF}api/src/reportes/dice_debe_decir/dice_debe_decir_sp.php?id_docente=${docente.id_docente}&id_facultad=${facultadSelect}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&token=${token}`">
              <i class="fas fa-file-pdf" style="font-size: 1.5em"></i>
            </a>
          </th>
          <td class="w-50">{{docente.id_docente}}</td>
          <td>{{docente.nombre}}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="modals.cambio_dice" class="modal">
    <cambio-dice :id_docente="selDocente.id_docente" :id_facultad="facultadSelect" :id_modalidad="modalidad" @close="closeCambioDice" />
  </div>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
/**
 * MIXINGS
 */
import mixingInit from '../../mixing/mixing_init.js'

import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'

import cambioDice from './modal/cambio_dice.vue'

import swal from 'sweetalert'

export default {
  mixins: [
    mixingInit
  ],
  // Evita la entrada por url directa
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
    loading,
    loader,
    cambioDice
  },

  data: function () {
    return {
      modals: {
        cambio_dice: false
      },
      facultades: null,
      facultadSelect: 0,
      docentes: null,
      docentesFilter: [],
      filtroDocente: '',
      modalidad: '',

      selDocente: {}
    }
  },

  computed: {

  },

  watch: {
    filtroDocente: function (n) {
      this.filtroDocente = n.toUpperCase()
      if (n == '') {
        this.docentesFilter = this.docentes
      } else {
        this.filterDocente(n)
      }
    },

    modalidad: function (n) {
      this.facultadSelect = 0
      this.docentes = null
      this.docentesFilter = []
      this.filtroDocente = ''
    }
  },

  methods: {
    init() {
      this.getFacultades()
    },


    /**
     * Obtiene todas las facultades 
     * y las asigna al array 'facultades'
     */
    getFacultades: async function () {
      this.ajaxLoad = true
      try {
        const res = await this.axios.get(`${this.URL}js-facultad`)

        if(res.status !== 200) return 

        this.facultades = res.data.data
      } catch (err) {
        this.$hlp.errors(err)
      }
      
      this.ajaxLoad = false
    },

    /**
     * Ajax para obtener la informacion de carga lectiva
     * de una determinada facultad, junto con el nombre
     * del docente relacionado
     */
    getDocentesAsigDoc: async function () {
      let id_facultad = this.facultadSelect
      let version = this.entorno.version_ingreso
      this.ajaxLoad = true
      try {
        // const res = await this.axios.get(`${this.URL}js-gx-asigdoc-facultad-docente/${id_facultad}/${version}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.modalidad}`)
        const res = await this.axios.get(`${this.URL_}v2/diceDebeDecir/getCarga/${id_facultad}/${version}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.modalidad}`)

        if(res.status !== 200) return 

        this.docentes = res.data.data
        this.docentesFilter = this.docentes

      } catch (err) {
        this.facultadSelect = 0
        this.docentes = null
        this.$hlp.errors(err)
      }
      
      this.ajaxLoad = false
    },

    /**
     * Filtra docente segun un 
     * criterio ingresado
     */
    filterDocente: function (n) {
      this.docentesFilter = this.docentes.filter(d => d.nombre.toUpperCase().includes(n.toUpperCase()) || d.id_docente.toUpperCase().includes(n.toUpperCase()))
    },

    closeCambioDice: function () {
      this.getDocentesAsigDoc()
      this.cerraModal('cambio_dice')
    },

    /**
     * Selccionar docente
     */
    selectDocente: function (d_) {
      this.selDocente = d_
      this.abrirModal('cambio_dice')
    },

    abrirModal: function (modal) {
      this.modals[modal] = true
    },

    cerraModal: function (modal) {
      this.modals[modal] = false
    }
  },
}
</script>

<style lang="scss" scoped>
option:disabled {
    background: rgb(122, 122, 122);
}
</style>

