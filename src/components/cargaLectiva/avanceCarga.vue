<template>
<div class="ed-container init no-imp">
  <h2 class="ed-item sep-10 gr-center">
    <strong>
      PORCENTAJE AVANCE DE CARGA LECTIVA
    </strong>
  </h2>

  <div class="ed-item ed-container sep-10">
    <div class="ed-item m-30 to-center form-group sep-5">
      <label>Filial</label>
      <select v-model="id_filial" class="form-control">
        <option v-for="(filial, index) in filiales" :key="index" :value="filial.id_filial">
          {{filial.nombre_filial}}
        </option>
      </select>
    </div>
    <div class="ed-item m-30 to-center form-group sep-5">
      <label>Modalidad</label>
      <select v-model="id_modalidad" class="form-control">
        <option v-for="(modalidad, index) in modalidades" :key="index" :value="modalidad.id_modalidad">
          {{modalidad.nombre}}
        </option>
      </select>
    </div>
    <div v-if="cargaTotal.length > 0" class="ed-item m-30 to-center form-group sep-5">
      <label>FACULTAD</label>
      <select v-model="filterFac" class="form-control">
        <option value="0">TODOS</option>
        <option v-for="(fac, index) in cargaTotal" :key="index" :value="fac.id_facultad">
          {{fac.facultad}} ({{parseFloat(fac.porcentaje).toFixed(2)}}%)
        </option>
      </select>
    </div>
  </div>

  <div class="ed-item sep-10 gr-center">
    <button @click="getAvanceCarga" class="btn btn-info btn-rounded btn-hov">
      Actualizar
    </button>
  </div>

  <div v-for="carga in cargaTotalFilter" :key="carga.id_facultad" class="ed-item sep-10 table-content">
    <table class="table table-responsive table-striped table-bordered table-hover table-own">
      <caption class="caption">{{carga.facultad}}
        <strong> ({{parseFloat(carga.porcentaje).toFixed(2)}}%) </strong>
      </caption>
      <thead class="table-head">
        <tr>
          <th>ESCUELA</th>
          <th>TOTAL</th>
          <th>REGISTRADO</th>
          <th>%AVANCE</th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(escuela, index) in carga.escuelas" :key="index">
          <td>{{escuela.escuela}}</td>
          <td>{{escuela.total}}</td>
          <td>{{escuela.registrado}}</td>
          <td>{{parseFloat(escuela.porcentaje).toFixed(2)}}%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pantalla de carga general -->
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
    loader
  },

  data: function () {
    return {
      ajaxLoad: false,

      modals: {

      },

      filiales: null,
      modalidades: null,

      id_filial: '',
      id_modalidad: '',

      cargaAvance: null,

      cargaTotal: [],
      cargaTotalFilter: [],

      filterFac: 0
    }
  },

  computed: {

  },

  watch: {
    filterFac: function (n) {
      if (n == 0) {
        this.cargaTotalFilter = this.cargaTotal
      } else {
        this.cargaTotalFilter = this.cargaTotal.filter(carga => carga.id_facultad == n)
      }
    }
  },

  methods: {
    // Funciones que se ejecutaran al montar el componente
    init() {
      this.getFiliales()
      this.getModalidades()
    },

    getFiliales: async function () {
      await this.axios.get(`${this.URL}js-filial`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.filiales = res.data.data
          } else {
            alertify.alert('Error 20129x2131: error filiales')
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    async getModalidades() {
      try {
        const res = await this.axios.get(`${this.URL}js-modalidad`, this.autho)

        if (res.status === 200) {
          this.modalidades = res.data.data
        }
      } catch (err) {
        this.modalidades = null
        this.$hlp.errors(err)
      }
    },

    getAvanceCarga: async function () {
      this.ajaxLoad = true
      await this.axios.get(`${this.URL}js-avance-lectiva/${this.id_filial}/${this.id_modalidad}/${this.entorno.version_final}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.cargaAvance = res.data.data
            this.cargaAvance.map(car => {
              if (!this.cargaTotal.some(carga => carga.id_facultad == car.id_facultad)) {
                let c = {
                  facultad: car.facultad,
                  id_facultad: car.id_facultad,
                  escuelas: [],
                  sumaAvance: 0,
                  porcentaje: 0
                }
                this.cargaTotal.push(c)
              }
            })

            this.cargaTotal.forEach(c => {
              this.cargaAvance.forEach(car => {
                if (car.id_facultad == c.id_facultad) {
                  c.sumaAvance += parseFloat(car.porcentaje)
                  c.escuelas.push(car)
                }
              })

              c.porcentaje = c.sumaAvance / c.escuelas.length
            })

            this.filterFac = 0
            this.cargaTotalFilter = this.cargaTotal
          } else {
            this.cargaAvance = null
          }
        })
        .catch(err => {
          console.dir(err)
          this.cargaAvance = null
          alertify.alert('Error 20129x2131: error traer avance carga')
        })
      this.ajaxLoad = false
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
.caption {
  text-align: center;
  color: #000;
  font-weight: bold;
  font-size: 1.5em;
}
</style>

