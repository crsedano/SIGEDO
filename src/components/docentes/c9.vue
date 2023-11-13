<template>
  <div class="ed-container init">
    <h3 class="ed-item gr-center">
      <strong>C9 POR FACULTAD</strong>
    </h3>

    <div class="ed-item to-center ed-container">
      <div class="ed-item sep-10 m-50 l-30 to-center">
        <label>Modalidad</label>
        <el-select filterable size="mini" v-model="id_modalidad">
          <el-option :value="0" label="TODOS"></el-option>
          <el-option :value="1" label="PRESENCIAL"></el-option>
          <el-option :value="2" label="SEMIPRESENCIAL"></el-option>
        </el-select>
      </div>

      <div class="ed-item sep-10 m-50 l-30 to-center">
        <label>Filial</label>
        <el-select filterable size="mini" v-model="id_filial">
          <el-option :value="0" label="TODOS"></el-option>
          <el-option
            v-for="(f, index) in arrFiliales"
            :key="index"
            :value="f.id_filial"
            :label="f.nombre_filial"
          ></el-option>
        </el-select>
      </div>

      <div class="ed-item sep-10 m-50 l-30 to-center">
        <label>Facultad</label>
        <el-select filterable size="mini" v-model="id_facultad">
          <el-option
            v-for="(facultad, index) in arrFacultades"
            :key="index"
            :value="facultad.id_facultad"
            :label="facultad.nombre"
          ></el-option>
        </el-select>
      </div>

      <div v-if="arrEscuelas" class="ed-item sep-10 m-50 l-30 to-center">
        <label>Escuela</label>
        <el-select filterable size="mini" v-model="id_escuela">
          <el-option
            v-for="(e, index) in arrEscuelas"
            :key="index"
            :value="e.id_escuela"
            :label="e.nombre"
          ></el-option>
        </el-select>
      </div>

      <div class="ed-item sep-10 m-50 l-30 to-center">
        <label>Dedicación</label>
        <el-select filterable size="mini" v-model="dedicacion">
          <el-option :value="0" label="TODOS"></el-option>
          <el-option value="TC" label="TIEMPO COMPLETO"></el-option>
          <el-option value="TP" label="TIEMPO PARCIAL"></el-option>
          <el-option value="DE" label="DEDICACIÓN EXCLUSIVA"></el-option>
        </el-select>
      </div>

      <div class="ed-item sep-10 m-50 to-center">
        <label>DOCENTE (DNI)</label>
        <el-input v-model="id_docente" size="mini"></el-input>
        <label>
          Jefe Prácticas
          <input v-model="estadojefepract" type="checkbox" />
        </label>
      </div>
    </div>

    <div v-if="load" class="ed-item gr-center">
      <loading />
    </div>

    <div class="ed-item txt-center">
      <el-button @click="getEstadoFacultad" type="primary" size="mini" plain>Actualizar</el-button>
    </div>

    <div v-if="estadoFacultad" class="ed-item txt-center">
      <button @click="exportExcel" class="btn btn-dark btn-rounded">Excel</button>
      <a
        v-if="entorno"
        class="btn btn-dark btn-rounded"
        target="_blank"
        :href="`${URLPDF}api/src/reportes/c9/c9.php?id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_facultad=${id_facultad}&id_cargo=${estadojefepract}&token=${token}&id_usuario=${identity.id_usuario}&id_modalidad=${this.id_modalidad}&id_filial=${this.id_filial}&id_docente=${this.id_docente}&id_escuela=${this.id_escuela}&dedicacion=${this.dedicacion}`"
      >
        <i class="fas fa-file-pdf"></i>
        Imprimir
      </a>
    </div>

    <div
      v-if="estadoFacultad"
      id="customers"
      class="ed-item sep-10 table-content"
      style="height: 500px"
    >
      <table class="main-table">
        <thead class="table-head">
          <tr class="headers">
            <th>#</th>
            <th>APELLIDO PATERNO</th>
            <th>APELLIDO MATERNO</th>
            <th>NOMBRES</th>
            <th>NACIONALIDAD/PAIS</th>
            <th>DNI/CARNET DE EXTRANJERIA</th>
            <th>FECHA DE INGRESO COMO DOCENTE EN LA UNIVERSIDAD</th>
            <th>ERA DOCENTE UNIVERSITARIO A LA ENTRADA DE VIGENCIA DE LA LEY 30220, SI/NO</th>
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
            <th>DOCENTE REALIZA INVESTIGACION SI/NO</th>
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
            <td class="w-300">{{ user.mension.slice(3) }}</td>
            <td class="w-150">{{user.cuniversidad}}</td>
            <td class="w-30">{{user.cpais}}</td>
            <td class="w-30">SI</td>
            <td class="w-30">NO</td>
            <td class="w-30">NO</td>
            <td class="w-30">{{user.cod_filiales}}</td>
            <td class="w-30">{{user.categoria}}</td>
            <!-- <td class="w-30">{{user.dedicacion}}</td> -->
            <td class="w-30">{{ calcularDatosLectiva(user).dedicacion }}</td>
            <td class="w-30">{{user.clases}}</td>
            <!-- <td class="w-30">{{user.otras_actividades}}</td> -->
            <td class="w-30">{{ calcularDatosLectiva(user).hAdmi }}</td>
            <!-- <td class="w-30">{{user.total_horas_sem}}</td> -->
            <td class="w-30">{{ calcularDatosLectiva(user).totalHoras }}</td>
            <td class="w-30">{{user.investigador}}</td>
            <td class="w-30">{{user.dina}}</td>
            <td class="w-30">{{user.periodo}}</td>
            <td class="w-200">{{user.observaciones}}</td>
            <!-- <td class="w-200">{{ calcularDatosLectiva(user) }}</td> -->
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
import loading from "../templates/loading.vue";
import loader from "../templates/loader.vue";
import XLSX from "xlsx";

/**
 * MIXING
 */
import MixinInit from "../../mixing/mixing_init.js";

import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [MixinInit],

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

  filters: {
    toFormatNombre: function(value) {
      if (!value) return;
      let n = value.toLowerCase();
      n = n.charAt(0).toUpperCase() + n.slice(1);

      return n;
    },

    toFormatFromArray: function(arr) {
      if (arr.length <= 0) return;

      let arr_ = arr.split(" ");

      arr_ = arr_.map(a => {
        let n = a.toLowerCase();
        n = n.charAt(0).toUpperCase() + n.slice(1);
        return n;
      });

      arr_ = arr_.join(" ");

      return arr_;
    }
  },

  watch: {
    estadojefepract: function(n) {
      this.getEstadoFacultad();
    },

    id_facultad(n) {
      this.id_escuela = 0;
    }
  },

  components: {
    loading,
    loader
  },

  data() {
    return {
      estadojefepract: false,

      estadoFacultad: null,
      arrFiliales: null,
      load: false,

      id_docente: 0,
      id_facultad: 0,
      id_escuela: 0,
      id_modalidad: 0,
      id_filial: 0,
      dedicacion: 0
    };
  },

  computed: {
    arrEscuelas() {
      return this.$store.getters["escuela/escuelaByFacultad"](this.id_facultad);
    },

    ...mapState({
      arrFacultades: state => state.facultad.arrFacultades
    })
  },

  methods: {
    init() {
      this.getEstadoFacultad();
      this.getFiliales();
      this.getFacultades();
    },

    ...mapActions({
      getFacultades: "facultad/getFacultades"
    }),

    getEstadoFacultad: async function() {
      this.ajaxLoad = true;

      if (this.id_docente == "") this.id_docente = 0;

      try {
        const res = await this.axios.get(
          `${this.URL}js-c9-facultad/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.id_facultad}/${this.estadojefepract}/${this.id_modalidad}/${this.id_filial}/${this.id_docente}/${this.id_escuela}/${this.dedicacion}`
        );

        if (res.status === 200) {
          this.estadoFacultad = res.data.data;
        }
      } catch (err) {
        this.estadoFacultad = null;
        this.$hlp.errors(err);
      }

      this.ajaxLoad = false;
    },

    getFiliales: async function() {
      this.ajaxLoad = true;
      try {
        const res = await this.axios.get(`${this.URL}js-filial`);

        if (res.status !== 200) return;
        this.arrFiliales = res.data.data;
      } catch (err) {
        this.$hlp.errors(err);
      }
      this.ajaxLoad = false;
    },

    exportExcel() {
      const table = document.getElementById("customers");

      var wb = XLSX.utils.table_to_book(table, {
        raw: true
      });
      XLSX.writeFile(wb, "C9.xlsx");
    },

    calcularDatosLectiva(payload) {
      let { dedi, clases, nivel_cargo } = payload;

      let hAdmi = 0,
        totalHoras = 0,
        dedicacion = "";

      if (dedi == "DE") {
        dedicacion = "DE";
      } else {
        if (nivel_cargo == 1) {
          dedicacion = "TC";
        } else {
          // NOTE calculo para tiempo completo
          // dedicacion = clases > 20 ? 'TC' : 'TP'
          dedicacion = clases > 23 ? "TC" : "TP";
        }
      }

      if (dedicacion == "TP") {
        totalHoras = clases;
      } else {
        if (clases > 40) {
          hAdmi = 0;
          totalHoras = 40;
        } else {
          totalHoras = 40;
          hAdmi = totalHoras - clases;
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
      color: #fff;
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
