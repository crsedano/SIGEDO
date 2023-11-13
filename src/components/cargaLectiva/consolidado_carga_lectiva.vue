<template>
  <!-- Usar la clase 'no-imp' en caso exista impresión de ticket, para evitar que la IU se imprima -->
  <div class="ed-container init no-imp">
    <h2 class="ed-item sep-10 gr-center">
      <strong>REPORTE CONSOLIDADO CARGA LECTIVA</strong>
    </h2>

    <div class="ed-item m-80 l-60 to-center sep-40 ed-container">
      <!-- <div class="ed-item sep-10 m-50 form-group">
                <label>Modalidad</label>
                <select v-model="id_modalidad" class="form-control">
                    <option value="T">SELECCIONAR</option>
                    <option v-for="(modalidad, index) in modalidades" :key="index" :value="modalidad.id_modalidad">
                        {{modalidad.nombre}}
                    </option>
                </select>
      </div>-->
      <div class="ed-item sep-10 m-50 form-group">
        <label>Filial</label>
        <select v-model="id_filial" class="form-control">
          <option value="T">SELECCIONAR</option>
          <option
            v-for="(filial, index) in filiales"
            :key="index"
            :value="filial.id_filial"
          >{{filial.nombre_filial}}</option>
        </select>
      </div>
      <div class="ed-item sep-10 m-50 form-group">
        <label>Facultad</label>
        <select v-model="id_facultad" class="form-control">
          <option value="T">SELECCIONAR</option>
          <option
            v-for="(facultad, index) in facultades"
            :key="index"
            :value="facultad.id_facultad"
          >{{facultad.nombre}}</option>
        </select>
      </div>
      <div v-if="id_facultad != 'T'" class="ed-item sep-10 m-50 form-group">
        <label>Escuela</label>
        <select v-model="id_escuela" class="form-control">
          <option value="T">SELECCIONAR</option>
          <option
            v-for="(escuela, index) in escuelas"
            :key="index"
            :value="escuela.id_escuela"
          >{{escuela.nombre}}</option>
        </select>
      </div>
      <div class="ed-item sep-10 m-50 form-group">
        <label>Docente</label>
        <input type="text" class="form-control" v-model="id_docente" />
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
    </div>

    <div class="ed-item m-60 to-center ed-container">
      <div class="ed-item m-30 to-center gr-center">
        <button @click="getData" class="btn btn-info btn-rounded">Actualizar</button>
      </div>
      <div v-if="dataDoc.length > 0" class="ed-item m-30 to-center gr-center">
        <a
          v-if="entorno!=null"
          class="btn btn-dark btn-rounded"
          target="_blank"
          :href="`${URLPDF}api/src/reportes/carga_lectiva/consolidado.php?ae_bcd=${token}&version=${entorno.version_ingreso}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&id_filial=${id_filial}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&dedicacion=${dedicacion}&id_usuario=${identity.id_usuario}`"
        >
          <i class="fas fa-file-pdf"></i>
          Imprimir
        </a>
      </div>
      <div class="ed-imte m-30 to-center gr-center">
        <button @click="exportExcel" class="btn btn-dark btn-rounded">Excel</button>
      </div>
    </div>

    <div
      v-if="dataDoc && dataDoc.length > 0"
      class="ed-item sep-10 table-content"
      style="height: 500px"
    >
      <table id="table" class="main-table">
        <thead class="table-head">
          <tr>
            <th class="center" colspan="25">UNIVERSIDAD PERUANA LOS ANDES</th>
          </tr>
          <tr v-if="id_filial != 'T'">
            <th class="center" colspan="25">FILIAL {{filial}}</th>
          </tr>
          <tr v-if="id_facultad != 'T'">
            <th class="center" colspan="25">FACULTAD DE {{facultad}}</th>
          </tr>
          <tr v-if="id_escuela != 'T'">
            <th class="center" colspan="25">ESCUELA DE {{escuela}}</th>
          </tr>
          <tr>
            <th
              class="center"
              colspan="25"
            >CONSOLIDADO DE LA EXTENSION HORARIA DE DOCENTES CONTRATADOS</th>
          </tr>
          <tr>
            <th
              v-if="entorno != null"
              class="center"
              colspan="25"
            >SEMESTRE ACADÉMICO {{periodo.id_periodo}} - {{periodo.id_semestre}}</th>
          </tr>

          <tr class="headers">
            <th>N°</th>
            <th>TITULO PROFESIONAL</th>
            <th>DOCENTE</th>
            <th>CARRERA PROFESIONAL</th>
            <th>SEDE</th>
            <th>FACULTAD</th>
            <th>HORAS PRESENCIAL</th>
            <th>HORAS SEMIPRESENCIAL</th>
            <th>HORAS FACULTAD</th>
            <th>TOTAL HORAS</th>
            <th>SUB TOTAL DE HORAS ADMINISTRATIVAS (NO LECTIVAS)</th>
            <th>DEDICACION</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <template v-for="(data, index) in dataDoc">
            <tr :key="index">
              <td :rowspan="data.cursos.length">{{index + 1}}</td>
              <td :rowspan="data.cursos.length">{{data.titulo}}</td>
              <td :rowspan="data.cursos.length">{{data.nombre}} ({{data.cargo}})</td>
              <td>{{data.cursos[0].carrera}}</td>
              <td>{{data.cursos[0].nombre_filial}}</td>
              <td>{{data.cursos[0].facultad}}</td>
              <td>{{data.cursos[0].horas_p}}</td>
              <td>{{data.cursos[0].horas_sp}}</td>
              <td>{{data.cursos[0].horas_fac}}</td>
              <!-- <td :rowspan="data.cursos.length">{{data.horas_total_upla}}</td> -->
              <td :rowspan="data.cursos.length">{{calcularDatosLectiva(data).totalHoras}}</td>
              <!-- <td :rowspan="data.cursos.length">{{data.cursos[0].hadmin_upla}}</td> -->
              <td :rowspan="data.cursos.length">{{calcularDatosLectiva(data).hAdmi}}</td>
              <!-- <td :rowspan="data.cursos.length">{{data.cursos[0].dedicacion_upla}}</td> -->
              <td :rowspan="data.cursos.length">{{calcularDatosLectiva(data).dedicacion}}</td>
            </tr>
            <tr v-if="ind != 0" v-for="(d, ind) in data.cursos" :key="ind * 100000 + index">
              <td>{{d.carrera}}</td>
              <td>{{d.nombre_filial}}</td>
              <td>{{d.facultad}}</td>
              <td>{{d.horas_p}}</td>
              <td>{{d.horas_sp}}</td>
              <td>{{d.horas_fac}}</td>
            </tr>
          </template>
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
/**
 * MIXING
 */
import mixingInit from "../../mixing/mixing_init.js";
import mixingFiliales from "../../mixing/mixing_filiales.js";
import mixingFacultades from "../../mixing/mixing_facultades.js";
import mixingModalidades from "../../mixing/mixing_modalidades.js";
import mixingEscuela from "../../mixing/mixing_escuela.js";

import alertify from "alertifyjs";

import GxDate from "../../helpers/date";

import loading from "../templates/loading.vue";
import loader from "../templates/loader.vue";

import XLSX from "xlsx";

export default {
  mixins: [
    mixingInit,
    mixingFiliales,
    mixingFacultades,
    mixingModalidades,
    mixingEscuela
  ],

  // Evita la entrada por url directa
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next("/");
      }
      if (!vm.permisos) {
        next("/");
        return;
      }
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path);
      if (!s) {
        next("/");
      }
    });
  },

  mounted() {
    this.init();
  },

  components: {
    loading,
    loader
  },

  data: function() {
    return {
      modals: {},

      dataGeneral: null,
      dataDoc: [],
      dataCursos: [],

      id_docente: "",
      dedicacion: "T",

      modalidad: "",
      filial: "",
      facultad: "",
      escuela: ""
    };
  },

  computed: {},

  watch: {
    id_facultad: function(n) {
      this.dataGeneral = null;
      this.dataDoc = [];
    },

    id_modalidad: function(n) {
      this.dataGeneral = null;
      this.dataDoc = [];
    },

    id_filial: function(n) {
      this.dataGeneral = [5];
      this.dataDoc = [];
    },

    id_escuela: function(n) {
      this.dataGeneral = null;
      this.dataDoc = [];
    },

    id_docente: function(n) {
      if (n != "T") {
        this.id_filial = "T";
        this.id_facultad = "T";
        this.id_escuela = "T";
        this.dedicacion = "T";
      }
    },

    dedicacion: function(n) {
      this.dataGeneral = null;
      this.dataDoc = [];
    }
  },

  methods: {
    init() {},

    async getData() {
      const loading = this.$loading({
        lock: true,
        text: "Cargando consolidado de carga lectiva...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      if (this.id_docente == "" || this.id_docente == "88888888") {
        this.id_docente = "T";
      }

      try {
        const res = await this.axios.get(
          `${this.URL}js-consolidado-lectiva/${this.entorno.version_ingreso}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.id_docente}/${this.id_filial}/${this.id_facultad}/${this.id_escuela}/${this.dedicacion}`
        );

        if (res.status === 200) {
          this.dataGeneral = res.data.data;
          this.dataDoc = [];
          this.dataGeneral.map(data => {
            if (!this.dataDoc.some(d => d.id_docente == data.id_docente)) {
              this.dataDoc.push(data);
            }
          });

          this.dataDoc.forEach(d => {
            this.$set(d, "cursos", []);
            this.dataGeneral.forEach(data => {
              if (d.id_docente == data.id_docente) {
                d.cursos.push(data);
              }
            });
          });
        }
      } catch (err) {
        this.dataGeneral = null;
        this.dataDoc = [];
        this.$hlp.errors(err);
      }

      loading.close();
    },

    exportExcel() {
      const table = document.getElementById("table");

      var wb = XLSX.utils.table_to_book(table, {
        raw: true
      });
      XLSX.writeFile(wb, "carga_lectiva.xlsx");
    },

    calcularDatosLectiva(payload) {
      let { dedi, horas_total_upla, nivel_cargo } = payload;

      let hAdmi = 0,
        totalHoras = horas_total_upla,
        dedicacion = "",
        h = 0;

      this.dataGeneral.forEach(el => {
        if (
          payload.id_docente == el.id_docente &&
          payload.id_facultad == el.id_facultad
        ) {
          h += parseInt(el.horas_fac);
        }
      });

      if (dedi == "DE") {
        dedicacion = "DE";
      } else {
        if (nivel_cargo == 1) {
          dedicacion = "TC";
        } else {
          // NOTE calculo para tiempo completo
          // dedicacion = totalHoras > 20 ? 'TC' : 'TP'
          dedicacion = totalHoras > 23 ? "TC" : "TP";
        }
      }

      if (dedicacion == "TP") {
        totalHoras = horas_total_upla;
      } else {
        if (totalHoras > 40) {
          hAdmi = 0;
          totalHoras = 40;
        } else {
          totalHoras = 40;
          hAdmi = totalHoras - horas_total_upla;
        }
      }

      return {
        hAdmi,
        totalHoras,
        dedicacion
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.main-table {
  font-size: 0.75em;

  & * {
    padding: 2px;
    margin: 0;
    min-width: none !important;
  }

  & thead {
    font-weight: bold;

    & .headers {
      background: #638ec3 !important;
      color: #fff;
      border: solid 1px black;

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
      border: solid 1px black;
      min-width: none;
      text-align: center;
    }
  }
}
</style>

