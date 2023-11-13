<template>
<div class="ed-container init">
  <h3 class="ed-item  gr-center">
    <strong>C9 POR FACULTAD</strong>
  </h3>

  <!-- <div class="ed-item m-50 to-center gr-center form-group"> -->
  <div class="ed-item m-80 l-60 to-center sep-40 ed-container">
    <div class="ed-item sep-10 m-50 form-group">
      <label>
        <span style="color: red !important, font-weight: bold">*</span>
        Modalidad
      </label>
      <select v-model="id_modalidad" class="form-control">
        <option value="T">SELECCIONAR</option>
        <option v-for="(modalidad, index) in modalidades" :key="index" :value="modalidad.id_modalidad">
          {{modalidad.nombre}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-10 m-50 form-group">
      <label>Filial</label>
      <select v-model="id_filial" class="form-control">
        <option value=0>TODOS</option>
        <option v-for="(filial, index) in filiales" :key="index" :value="filial.id_filial">
          {{filial.nombre_filial}}
        </option>
      </select>
    </div>
    <div class="ed-item sep-10 m-50 form-group ">
      <label>Facultad</label>
      <select v-model="id_facultad" class="form-control">
        <option value=0>TODOS</option>
        <option v-for="(facultad, index) in facultades" :key="index" :value="facultad.id_facultad">
          {{facultad.nombre}}
        </option>
      </select>
    </div>
    <!-- <div v-if="id_facultad != 'T'" class="ed-item sep-10 m-50 form-group">
      <label>Escuela</label>
      <select v-model="id_escuela" class="form-control">
        <option value="T">SELECCIONAR</option>
        <option v-for="(escuela, index) in escuelas" :key="index" :value="escuela.id_escuela">
          {{escuela.nombre}}
        </option>
      </select>
    </div> -->

<div v-if="arrEscuelas" class="ed-item sep-5 l-50 to-center form-group">
      <label>Escuelas</label>
      <select v-model="id_escuela" class="form-control">
        <option value="0">TODOS</option>
        <option v-for="(escuela, index) in arrEscuelas" :key="index" :value="escuela.id_escuela">
          {{escuela.nombre}}
        </option>
      </select>
    </div>

    <div class="ed-item sep-10 m-50 form-group">
      <label>Dedicación</label>
      <select v-model="dedicacion" class="form-control">
        <option value="T">TODOS</option>
        <option value="TC">TC</option>
        <option value="TP">TP</option>
        <option value="DE">DE</option>
      </select>
    </div>

     <div class="ed-item sep-10 m-50 form-group">
      <label>Docente</label>
      <input type="text" class="form-control" v-model="id_docente">
      <label>
        Jefe Prácticas
        <input v-model="estadojefepract" type="checkbox">
      </label>
    </div>

  </div>
  <div v-if="load" class="ed-item gr-center">
    <loading />
  </div>
  <div v-if="id_modalidad != 'T'" class="ed-item m-50 to-center gr-center">
      <button @click="getData" class="btn btn-info btn-rounded">
        Actualizar
      </button>
   </div>
  <div v-if="estadoFacultad" id="customers" class="ed-item sep-10 table-content" style="height: 500px">
    
    <button @click="exportExcel" class="btn btn-dark btn-rounded">
      Excel
    </button>
    <a v-if="entorno" class="btn btn-dark btn-rounded" target="_blank" :href="`${URLPDF}api/src/reportes/c9/c9.php?id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_facultad=${id_facultad}&id_cargo=${estadojefepract}&token=${token}&id_usuario=${identity.id_usuario}`">
      <i class="fas fa-file-pdf"></i>
      Imprimir
    </a>
    <table class="main-table">
      <thead class="table-head">
        <tr class="headers">
          <th>#</th>
          <th>APELLIDO PATERNO</th>
          <th>APELLIDO MATERNO</th>
          <th>NOMBRES</th>
          <th>NACIONALIDAD/PAIS</th>
          <th>DNI/CARNET DE EXTRANJERIA</th>
          <th>FECHA DE INGRESO COMO DOCENTE EN LA UNIVERSIDAD </th>
          <th>ERA DOCENTE UNIVERSITARIO A LA ENTRADA DE VIGENCIA DE LA LEY 30220,LU? SI/NO</th>
          <th>EL DOCENTE FUE INCORPORADO DESPUES DE LA OBTENCION DE LA LICENCIA DE FUNCIONAMIENTO INSTITUCIONAL</th>
          <th>MAYOR GRADO ACADEMICO DEL DOCENTE</th>
          <th>MENCION DEL MAYOR GRADO DOCENTE</th>
          <th>UNIVERSIDAD QUE OTORGO EL MAYOR GRADO DOCENTE</th>
          <th>PAIS/UNIVERSIDAD QUE OTORGO EL MAYOR GRADO DEL DOCENTE</th>
          <th>PREGRADO SI/NO</th>
          <th>MAESTRIA SI/NO</th>
          <th>DOCTORADO SI/NO</th>
          <th>CODIGO DE SEDE Y FILIALES EN LAS QUE DICTA CLASES</th>
          <th>CATEGORIA DOCENTE</th>
          <th>REGIMEN DE DEDICACION</th>
          <th>CLASES</th>
          <th>OTRAS ACTIVIDADES</th>
          <th>TOTAL HORAS SEMANALES</th>
          <th>DOCENTE REALIZA INVESTIGACION SI/NO </th>
          <th>DOCENTE REGISTRADO EN DINA SI/NO</th>
          <th>PERIODO ACADEMICO</th>
          <th>COMENTARIO</th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="(user, index) in estadoFacultad" :key="index">
          <td class="w-10">{{index + 1}}</td>
          <td class="w-30">{{user.cpaterno | toFormatNombre}}</td>
          <td class="w-30">{{user.cmaterno | toFormatNombre}}</td>
          <td class="w-30">{{user.cnombres | toFormatFromArray}}</td>
          <td class="w-30">{{user.nacionalidad}}</td>
          <td class="w-30">{{user.cdni}}</td>
          <td class="w-70">{{user.f_ingreso}}</td>
          <td class="w-30">{{user.ley_30220}}</td>
          <td class="w-30">__</td>
          <td class="w-30">{{user.mayor_grado}}</td>
          <td class="w-300">{{user.mension}}</td>
          <td class="w-150">{{user.cuniversidad}}</td>
          <td class="w-30">{{user.cpais}}</td>
          <td class="w-30">{{user.cpregrado}}</td>
          <td class="w-30">{{user.cmaestria}}</td>
          <td class="w-30">{{user.cdoctorado}}</td>
          <td class="w-30">{{user.cod_filiales}}</td>
          <td class="w-30">{{user.categoria}}</td>
          <td class="w-30">{{user.dedicacion}}</td>
          <td class="w-30">{{user.clases}}</td>
          <td class="w-30">{{user.otras_actividades}}</td>
          <td class="w-30">{{user.total_horas_sem}}</td>
          <td class="w-30">{{user.investigador}}</td>
          <td class="w-30">{{user.dina}}</td>
          <td class="w-30">{{user.periodo}}</td>
          <td class="w-200">{{user.observaciones}}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
import loading from '../templates/loading.vue'
import loader from '../templates/loader.vue'
import XLSX from 'xlsx'

import GxEscuela from '../../models/gx_escuela'

/**
 * MIXING
 */
import MixinInit from '../../mixing/mixing_init.js'

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

  filters: {
    toFormatNombre: function (value) {
      if (!value) return
      let n = value.toLowerCase()
      n = n.charAt(0).toUpperCase() + n.slice(1)

      return n
    },

    toFormatFromArray: function (arr) {
      if (arr.length <= 0) return

      let arr_ = arr.split(' ')

      arr_ = arr_.map(a => {
        let n = a.toLowerCase()
        n = n.charAt(0).toUpperCase() + n.slice(1)
        return n
      })

      arr_ = arr_.join(' ')

      return arr_
    }
  },

  watch: {
    estadojefepract: function (n) {
      this.getEstadoFacultad()
    },
     id_facultad: function () {
      this.estadoFacultad = null
      this.id_escuela = 0
      this.getEscuelas()
    },

    id_escuela: function () {
      this.estadoFacultad = null
    },

    // id_facultad: function (n) {
    //   this.getEstadoFacultad()
    // },

    'id_modalidad': function (n) {
      this.estadoFacultad = null
      if (n != 'T') {
        this.modalidad = this.modalidades.filter(f => f.id_modalidad == n)[0].nombre
      } else {
        this.modalidad = ''
      }
    },
    'id_filial': function (n) {
      this.estadoFacultad = null
      if (n != 0) {
        this.filial = this.filiales.filter(f => f.id_filial == n)[0].nombre_filial
      } else {
        this.filial = ''
      }
    },
    'id_docente': function (n) {
      if (n != 'T') {
        this.id_filial = 0
        this.id_facultad = 0
        this.id_escuela = 0
        this.dedicacion = 'T'
      }
      // this.id_modalidad = 'T'
    },
    'dedicacion': function (n) {
      this.estadoFacultad = null
    },
  },

  components: {
    loading,
    loader
  },

  data() {
    return {
      facultades: null,
      estadojefepract: false,
      id_facultad: 0,

      id_modalidad: 'T',
      id_filial: 0,
      
      id_docente: '',
      dedicacion: 'T',
      modalidades: null,
      filiales: null,

      estadoFacultad: null,

      arrEscuelas: null,
      id_escuela: 0,

      load: false,
    }
  },

  computed: {

  },

  methods: {
    init() {
      this.getFacultades()
      this.getFiliales()
      this.getModalidades()
    // ||this.getEscuela()
    },

   getData() {
      if (this.id_docente == '') {
        this.id_docente = 'T'
      }
      if (this.id_modalidad == 1) {
        this.getEstadoFacultad()
      } else if (this.id_modalidad == 2) {
        this.getEstadoFacultadSemiPresencial()
      }
    },
    

    getEstadoFacultad: async function () {
      this.ajaxLoad = true

      try {
        const res = await this.axios.get(`${this.URL}js-c9-facultad/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.id_facultad}/${this.estadojefepract}/${this.id_filial}/${this.id_escuela}/${this.id_docente}/${this.dedicacion}`, this.autho)
        if (res.status === 200) {
          this.estadoFacultad = res.data.data
        }
        
      } catch (err) {
        this.id_facultad = 0
        this.estadoFacultad = null
        this.$hlp.errors(err)
      }

      this.ajaxLoad = false
    },

     getEstadoFacultadSemiPresencial: async function () {
      this.ajaxLoad = true

      try {
        const res = await this.axios.get(`${this.URL}js-c9-facultad-semiprese/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.id_facultad}/${this.estadojefepract}/${this.id_filial}/${this.id_escuela}/${this.id_docente}/${this.dedicacion}`, this.autho)
        if (res.status === 200) {
          this.estadoFacultad = res.data.data
        }
        
      } catch (err) {
        this.id_facultad = 0
        this.estadoFacultad = null
        this.$hlp.errors(err)
      }

      this.ajaxLoad = false
    },

    async getFacultades() {
      this.ajaxLoad = true
      try {
        const res = await this.axios.get(`${this.URL}js-facultad`, this.autho)
        if (res.status === 200) {
          this.facultades = res.data.data
        }
      } catch (err) {
        this.facultades = null
        this.$hlp.errors(err)
      }
      this.ajaxLoad = false
    },

/**
     * Obtiene las escuelas segun la facultad seleccionada
     */
     getEscuelas: async function () {
      const gxEscuela = new GxEscuela(this.URL)
      gxEscuela.id_facultad = this.id_facultad

      const res = await gxEscuela.getByFacultad(this.autho)

      if (res.success) {
        this.arrEscuelas = res.data
      } else {
        this.arrEscuelas = null
      }
    },

    async getModalidades () {
          try {
            const res = await this.axios.get(`${this.URL}js-modalidad`, this.autho)

            if(res.status === 200) {
              this.modalidades = res.data.data
            }
          } catch (err) {
            this.modalidades = null
            this.$hlp.errors(err)
        },

     async getFiliales() {
      this.ajaxLoad = true
      try {
        const res = await this.axios.get(`${this.URL}js-filial`, this.autho)
        if (res.status === 200) {
          this.filiales = res.data.data
        }
      } catch (err) {
        this.filiales = null
        this.$hlp.errors(err)
      }
      this.ajaxLoad = false
    },

    exportExcel() {
      const table = document.getElementById('customers');

      var wb = XLSX.utils.table_to_book(table, {
        raw: true
      });
      XLSX.writeFile(wb, 'C9.xlsx');
    },

  }
}
</script>

<style lang="scss" scoped>
.main-table {
  font-size: 0.65em;

  & * {
    padding: 2px;
    margin: 0;
    min-width: none !important;
  }

  & thead {
    font-weight: bold;

    & .headers {
      background: #638ec3 !important;
      color: #FFF;
      border: solid 1px black !important;

      & tr,
      th {
        border: solid 1px black;
        text-align: center;
      }
    }
  }

  & tbody {

    & tr,
    td {
      border: solid 1px black !important;
      min-width: none;
      text-align: center;
    }
  }
}
</style>
