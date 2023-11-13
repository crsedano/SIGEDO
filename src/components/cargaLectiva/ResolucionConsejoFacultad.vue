<template>
  <div class="ed-container init no-imp">
    <h2 class="ed-item sep-10 gr-center">
      <strong>RESOLUCIÓN CONSEJO FACULTAD</strong>
    </h2>

    <div class="ed-item gr-center">
      <button @click="openBuscarDocente" class="btn btn-info btn-rounded">Buscar Docente</button>
    </div>

    <div class="ed-item m-80 l-60 to-center sep-40 ed-container">
      <div class="ed-item sep-10 m-50 form-group">
        <label>
          <span style="color: red !important, font-weight: bold">*</span>
          Modalidad
        </label>
        <select v-model="id_modalidad" class="form-control">
          <option value="T">SELECCIONAR</option>
          <option
            v-for="(modalidad, index) in modalidades"
            :key="index"
            :value="modalidad.id_modalidad"
          >{{modalidad.nombre}}</option>
        </select>
      </div>
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
        <label>
          Plaza Desierta
          <input v-model="plazaDesierta" type="checkbox" />
        </label>
        <label>
          Jefe Prácticas
          <input v-model="cargo" type="checkbox" />
        </label>
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
        <label>Asignatura</label>
        <select v-model="curso" class="form-control">
          <option value="0">TODOS</option>
          <option value="E">ESPECIFICO</option>
          <option value="G">GENERAL</option>
        </select>
      </div>
    </div>

    <div class="ed-item sep-10 m-50 to-center">
      <input v-model="resolucion" type="text" class="form-control" placeholder="RESOLUCION" />
    </div>

    <div class="ed-item m-60 to-center ed-container">
      <div v-if="id_modalidad != 'T'" class="ed-item m-50 to-center gr-center">
        <button @click="getData" class="btn btn-info btn-rounded">Actualizar</button>
      </div>
      <div v-if="dataDocentePresencial.length > 0" class="ed-item m-50 to-center gr-center">
        <!-- <a v-if="entorno!=null && id_modalidad == 1 && !plazaDesierta" class="btn btn-dark btn-rounded" target="_blank"
        :href="`${URLPDF}api/src/reportes/carga_lectiva/presencial.php?ae_bcd=${token}&version=${entorno.version_ingreso}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&id_filial=${id_filial}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&dedicacion=${dedicacion}&cargo=${cargo}&id_usuario=${identity.id_usuario}&curso=${curso}`">
        <i class="fas fa-file-pdf"></i>
        Imprimir
      </a>
      <a v-if="entorno!=null && id_modalidad == 1 && plazaDesierta" class="btn btn-dark btn-rounded" target="_blank"
        :href="`${URLPDF}api/src/reportes/carga_lectiva.php?version=${entorno.version_ingreso}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&id_filial=${id_filial}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&dedicacion=${dedicacion}&cargo=${cargo}`">
        <i class="fas fa-file-pdf"></i>
        Imprimir-->
        <!-- </a> -->
        <a
          v-if="entorno!=null && id_modalidad == 1 && resolucion != '' && !plazaDesierta"
          class="btn btn-dark btn-rounded"
          target="_blank"
          :href="`${URLPDF}api/src/reportes/carga_lectiva/resolucion_presencial_cf.php?ae_bcd=${token}&version=${entorno.version_ingreso}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&id_filial=${id_filial}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&dedicacion=${dedicacion}&resolucion=${resolucion}&cargo=${cargo}&id_usuario=${identity.id_usuario}&curso=${curso}`"
        >
          <i class="fas fa-file-pdf"></i>
          Imprimir Resolucion
        </a>
        <a
          v-if="entorno!=null && id_modalidad == 1 && resolucion != '' && plazaDesierta"
          class="btn btn-dark btn-rounded"
          target="_blank"
          :href="`${URLPDF}api/src/reportes/resolucion/carga_lectiva_v.php?ae_bcd=${token}&version=${entorno.version_ingreso}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&id_filial=${id_filial}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&dedicacion=${dedicacion}&resolucion=${resolucion}&cargo=${cargo}&id_usuario=${identity.id_usuario}&curso=${curso}`"
        >
          <i class="fas fa-file-pdf"></i>
          Imprimir Resolucion
        </a>
        <!-- <a v-if="entorno!=null && id_modalidad == 2 && !plazaDesierta" class="btn btn-dark btn-rounded" target="_blank"
        :href="`${URLPDF}api/src/reportes/carga_lectiva/semipresencial.php?ae_bcd=${token}&version=${entorno.version_ingreso}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&id_filial=${id_filial}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&dedicacion=${dedicacion}&cargo=${cargo}&id_usuario=${identity.id_usuario}&curso=${curso}`">
        <i class="fas fa-file-pdf"></i>
        Imprimir
      </a>
      <a v-if="entorno!=null && id_modalidad == 2 && plazaDesierta" class="btn btn-dark btn-rounded" target="_blank"
        :href="`${URLPDF}api/src/reportes/carga_lectiva_sp.php?version=${entorno.version_ingreso}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&id_filial=${id_filial}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&dedicacion=${dedicacion}&cargo=${cargo}`">
        <i class="fas fa-file-pdf"></i>
        Imprimir
        </a>-->
        <a
          v-if="entorno!=null && id_modalidad == 2 && resolucion != '' && !plazaDesierta"
          class="btn btn-dark btn-rounded"
          target="_blank"
          :href="`${URLPDF}api/src/reportes/carga_lectiva/resolucion_semipresencial_cf.php?ae_bcd=${token}&version=${entorno.version_ingreso}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&id_filial=${id_filial}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&dedicacion=${dedicacion}&resolucion=${resolucion}&cargo=${cargo}&id_usuario=${identity.id_usuario}&curso=${curso}`"
        >
          <i class="fas fa-file-pdf"></i>
          Imprimir Resolucion
        </a>
        <a
          v-if="entorno!=null && id_modalidad == 2 && resolucion != '' && plazaDesierta"
          class="btn btn-dark btn-rounded"
          target="_blank"
          :href="`${URLPDF}api/src/reportes/resolucion/carga_lectiva_sp_v.php?ae_bcd=${token}&version=${entorno.version_ingreso}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_docente=${id_docente}&id_filial=${id_filial}&id_facultad=${id_facultad}&id_escuela=${id_escuela}&dedicacion=${dedicacion}&resolucion=${resolucion}&cargo=${cargo}&id_usuario=${identity.id_usuario}&curso=${curso}`"
        >
          <i class="fas fa-file-pdf"></i>
          Imprimir Resolucion
        </a>
        <!-- <div class="ed-imte m-50 to-center gr-center"> -->
        <button @click="exportExcel" class="btn btn-dark btn-rounded">Excel</button>
        <!-- </div> -->
      </div>
    </div>

    <div
      id="customers"
      v-if="dataDocentePresencial.length > 0 && id_modalidad == 1"
      class="ed-item sep-10 table-content"
      style="height: 500px"
    >
      <table class="main-table">
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
            <th class="center" colspan="25">RESOLUCIÓN CONSEJO UNIVERSITARIO</th>
          </tr>
          <tr>
            <th
              class="center"
              colspan="25"
            >SEMESTRE ACADÉMICO {{periodo.id_periodo}} - {{periodo.id_semestre}}</th>
          </tr>

          <tr class="headers">
            <th rowspan="2">N°</th>
            <th colspan="2">GRADO ACADEMICO</th>
            <th colspan="2">DIDACTICA SUPERIOR</th>
            <th rowspan="2">ESPECIALIZACION</th>
            <th colspan="2">CARPETA ACADEMICA</th>
            <th rowspan="2">TITULO PROFESIONAL</th>
            <th rowspan="2">DOCENTE</th>
            <th rowspan="2">CARRERA PROFESIONAL</th>
            <th rowspan="2">PLAN DE ESTUDIOS(AÑO)</th>
            <th rowspan="2">ASIGNATURAS</th>
            <th rowspan="2">CICLO</th>
            <th rowspan="2">N° MATRICULADOS</th>
            <th rowspan="2">SECCIONES</th>
            <th rowspan="2">ESTUDIANTES POR AULA</th>
            <th rowspan="2">ESTUDIANTES POR GRUPO</th>
            <th colspan="6">EXTENSION HORARIA</th>
            <th rowspan="2">TOTAL HORAS</th>
            <th rowspan="2">DEDICACION</th>
          </tr>
          <tr class="headers">
            <th>Mg.</th>
            <th>Dr.</th>
            <th>Estudio</th>
            <th>Título</th>
            <th>SI</th>
            <th>NO</th>
            <th>HT/Grupo</th>
            <th>HP/Grupo</th>
            <th>Sub Total Horas</th>
            <th>Total Horas Lectivas</th>
            <th>Horas Investigación</th>
            <th>Total Horas Administrativas</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <template v-for="(data, index) in dataDocentePresencial">
            <tr :key="index">
              <td class="-10" :rowspan="data.cursos.length">{{index + 1}}</td>
              <td class="-10" :rowspan="data.cursos.length">{{data.cmaestria}}</td>
              <td class="-10" :rowspan="data.cursos.length">{{data.cdoctorado}}</td>
              <td class="-50" :rowspan="data.cursos.length">{{data.didactica_est}}</td>
              <td class="-50" :rowspan="data.cursos.length">{{data.didactica_tit}}</td>
              <td :rowspan="data.cursos.length">{{data.especializacion}}</td>
              <td class="-30" :rowspan="data.cursos.length">{{data.carpetasi}}</td>
              <td class="-30" :rowspan="data.cursos.length">{{data.carpetano}}</td>
              <td class="-200" :rowspan="data.cursos.length">{{data.titulo}}</td>
              <td class="-200" :rowspan="data.cursos.length">
                {{data.cpaterno}} {{data.cmaterno}} {{data.cnombres}}
                ({{data.cargo}})
              </td>
              <td class="-200">{{data.cursos[0].carrera}}</td>
              <td class="-50">{{data.cursos[0].plan}}</td>
              <td class="-200">{{data.cursos[0].asignatura}}</td>
              <td class="-20">{{data.cursos[0].ciclo}}</td>
              <td class="-20">{{data.cursos[0].numero_matriculadosf}}</td>
              <td class="-50">{{data.cursos[0].secciones}}</td>
              <td class="-50">{{data.cursos[0].alumnos_ht}}</td>
              <td class="-50">{{data.cursos[0].alumnos_hp}}</td>
              <td class="-50">{{data.cursos[0].horas_teoricas}} x {{data.cursos[0].grupo_ht}}</td>
              <td class="-50">{{data.cursos[0].horas_practicas}} x {{data.cursos[0].grupo_hp}}</td>
              <td class="-80">{{data.cursos[0].sub_tot_lectivas}}</td>
              <td class="-100" :rowspan="data.cursos.length">{{data.suma_sub_total}}</td>
              <td class="-100" :rowspan="data.cursos.length">{{calcularDatosLectiva(data).hInv}}</td>
              <td class="-100" :rowspan="data.cursos.length">{{calcularDatosLectiva(data).hAdmi}}</td>
              <td
                class="-100"
                :rowspan="data.cursos.length"
              >{{calcularDatosLectiva(data).totalHoras}}</td>
              <td
                class="-100"
                :rowspan="data.cursos.length"
              >{{calcularDatosLectiva(data).dedicacion}}</td>
              <!-- <td class="-100" :rowspan="data.cursos.length">{{data.horas_administrativas}}</td>
            <td class="-100" :rowspan="data.cursos.length">{{data.suma_sub_total + parseInt(data.horas_administrativas)}}</td>
              <td class="-100" :rowspan="data.cursos.length">{{data.dedicacion}}</td>-->
            </tr>
            <tr v-if="ind != 0" v-for="(d, ind) in data.cursos" :key="ind * 100000 + index">
              <td class="-200">{{d.carrera}}</td>
              <td class="-50">{{d.plan}}</td>
              <td class="-200">{{d.asignatura}}</td>
              <td class="-20">{{d.ciclo}}</td>
              <td class="-20">{{d.numero_matriculadosf}}</td>
              <td class="-50">{{d.secciones}}</td>
              <td class="-50">{{d.alumnos_ht}}</td>
              <td class="-50">{{d.alumnos_hp}}</td>
              <td class="-50">{{d.horas_teoricas}} x {{d.grupo_ht}}</td>
              <td class="-50">{{d.horas_practicas}} x {{d.grupo_hp}}</td>
              <td class="-80">{{d.sub_tot_lectivas}}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      id="customers"
      v-if="dataDocentePresencial.length > 0 && id_modalidad == 2"
      class="ed-item sep-10 table-content"
      style="height: 500px"
    >
      <table class="main-table">
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
            <th class="center" colspan="25">RESOLUCIÓN CONSEJO UNIVERSITARIO</th>
          </tr>
          <tr>
            <th
              class="center"
              colspan="25"
            >SEMESTRE ACADÉMICO {{periodo.id_periodo}} - {{periodo.id_semestre}}</th>
          </tr>
          <tr class="headers">
            <th rowspan="3">N°</th>
            <th colspan="2">GRADO ACADEMICO</th>
            <th colspan="2">DIDACTICA SUPERIOR</th>
            <th rowspan="3">ESPECIALIZACION</th>
            <th colspan="2">CARPETA ACADEMICA</th>
            <th rowspan="3">TITULO PROFESIONAL</th>
            <th rowspan="3">DOCENTE</th>
            <th rowspan="3">CARRERA PROFESIONAL</th>
            <th rowspan="3">PLAN DE ESTUDIOS(AÑO)</th>
            <th rowspan="3">ASIGNATURAS</th>
            <th rowspan="3">CICLO</th>
            <th rowspan="3">N° MATRICULADOS</th>
            <th rowspan="3">SECCIONES</th>
            <th rowspan="3">ESTUDIANTES POR AULA</th>
            <th rowspan="3">ESTUDIANTES POR GRUPO</th>
            <th colspan="4">PLAN DE ESTUDIOS (CARÁCTERES Y CRÉDITOS)</th>
            <th colspan="6">EXTENSION HORARIA</th>
            <th rowspan="3">HORAS INVESTIGACIÓN</th>
            <th rowspan="3">SUB TOTAL DE HORAS ADMINISTRATIVAS (NO LECTIVAS)</th>
            <th rowspan="3">TOTAL DE HORAS CONTRATA</th>
            <th rowspan="3">DEDICACION</th>
          </tr>
          <tr class="headers">
            <th rowspan="2">Mg.</th>
            <th rowspan="2">Dr.</th>
            <th rowspan="2">Estudio</th>
            <th rowspan="2">Título</th>
            <th rowspan="2">SI</th>
            <th rowspan="2">NO</th>
            <th rowspan="2">HT</th>
            <th rowspan="2">HP</th>
            <th rowspan="2">TH</th>
            <th rowspan="2">CRÉD</th>
            <th colspan="2">HORAS PRESENCIALES</th>
            <th rowspan="2">TOTAL HORAS PRESENCIALES</th>
            <th colspan="2">HORAS VIRTUALES</th>
            <th rowspan="2">TOTAL HORAS VIRTUALES</th>
          </tr>
          <tr class="headers">
            <th>HT</th>
            <th>HP</th>
            <th>HT</th>
            <th>HP</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <template v-for="(data, index) in dataDocentePresencial">
            <tr :key="index">
              <td class :rowspan="data.cursos.length">{{index + 1}}</td>
              <td class :rowspan="data.cursos.length">{{data.cmaestria}}</td>
              <td class :rowspan="data.cursos.length">{{data.cdoctorado}}</td>
              <td class :rowspan="data.cursos.length">{{data.didactica_est}}</td>
              <td class :rowspan="data.cursos.length">{{data.didactica_tit}}</td>
              <td :rowspan="data.cursos.length">{{data.especializacion}}</td>
              <td class :rowspan="data.cursos.length">{{data.carpetasi}}</td>
              <td class :rowspan="data.cursos.length">{{data.carpetano}}</td>
              <td class="0" :rowspan="data.cursos.length">{{data.titulo}}</td>
              <td
                class="0"
                :rowspan="data.cursos.length"
              >{{data.cpaterno}} {{data.cmaterno}} {{data.cnombres}}({{data.cargo}})</td>
              <td class="0">{{data.cursos[0].carrera}}</td>
              <td class>{{data.cursos[0].plan}}</td>
              <td class="0">{{data.cursos[0].asignatura}}</td>
              <td class>{{data.cursos[0].ciclo}}</td>
              <td class>{{data.cursos[0].numero_matriculadosf}}</td>
              <td class>{{data.cursos[0].secciones}}</td>
              <td class>{{data.cursos[0].alumnos_ht}}</td>
              <td class>{{data.cursos[0].alumnos_hp}}</td>
              <td>{{data.cursos[0].horas_teoricas}}</td>
              <td>{{data.cursos[0].horas_practicas}}</td>
              <td>{{parseInt(data.cursos[0].horas_teoricas) + parseInt(data.cursos[0].horas_practicas)}}</td>
              <td>{{data.cursos[0].creditos}}</td>
              <td>{{data.cursos[0].sp_phorasteoricas}}x{{data.cursos[0].grupo_pht}}</td>
              <td>{{data.cursos[0].sp_phoraspracticas}}x{{data.cursos[0].grupo_php}}</td>
              <td :rowspan="data.cursos.length">{{data.suma_sp}}</td>
              <td class="0">{{data.cursos[0].sp_vhorasteoricas}}x{{data.cursos[0].grupo_vht}}</td>
              <td class="0">{{data.cursos[0].sp_vhoraspracticas}}x{{data.cursos[0].grupo_vhp}}</td>
              <td :rowspan="data.cursos.length">{{data.suma_sv}}</td>
              <!-- <td :rowspan="data.cursos.length">{{data.horas_administrativas}}</td> -->
              <td :rowspan="data.cursos.length">{{calcularDatosLectivaSP(data).hInv}}</td>
              <td :rowspan="data.cursos.length">{{calcularDatosLectivaSP(data).hAdmi}}</td>
              <td :rowspan="data.cursos.length">{{parseInt(data.suma_sp) + parseInt(data.suma_sv)}}</td>
              <!-- <td :rowspan="data.cursos.length">{{data.dedicacion}}</td> -->
              <td :rowspan="data.cursos.length">{{calcularDatosLectivaSP(data).dedicacion}}</td>
            </tr>
            <tr v-if="ind != 0" v-for="(d, ind) in data.cursos" :key="ind * 100000 + index">
              <td class="00">{{d.carrera}}</td>
              <td class="0">{{d.plan}}</td>
              <td class="00">{{d.asignatura}}</td>
              <td class="0">{{d.ciclo}}</td>
              <td class="0">{{d.numero_matriculadosf}}</td>
              <td class="0">{{d.secciones}}</td>
              <td class="0">{{d.alumnos_ht}}</td>
              <td class="0">{{d.alumnos_hp}}</td>
              <td>{{d.horas_teoricas}}</td>
              <td>{{d.horas_practicas}}</td>
              <td>{{parseInt(d.horas_teoricas) + parseInt(d.horas_practicas)}}</td>
              <td>{{d.creditos}}</td>
              <td>{{d.sp_phorasteoricas}}x{{d.grupo_pht}}</td>
              <td>{{d.sp_phoraspracticas}}x{{d.grupo_php}}</td>
              <td class="0">{{d.sp_vhorasteoricas}}x{{d.grupo_vht}}</td>
              <td class="0">{{d.sp_vhoraspracticas}}x{{d.grupo_vhp}}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="modal_docente" class="modal">
      <buscar-docente @close="closeBuscarDocente" @sel="seleccionarDocenteBusqueda" />
    </div>

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

import alertify from "alertifyjs";

import GxDate from "../../helpers/date";

import loading from "../templates/loading.vue";
import loader from "../templates/loader.vue";

import XLSX from "xlsx";

import buscarDocente from "./modals/buscarDocente.vue";

import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixingInit],

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
    loader,
    buscarDocente
  },

  data: function() {
    return {
      modals: {},

      dataGeneral: null,
      dataDocentePresencial: [],
      dataCursos: [],

      modalidades: null,

      id_modalidad: "T",
      id_filial: "T",
      id_facultad: "T",
      id_escuela: "T",
      id_docente: "",
      dedicacion: "T",

      modalidad: "",
      filial: "",
      facultad: "",
      escuela: "",

      plazaDesierta: false,
      modal_docente: false,

      cargo: false,

      resolucion: "",

      curso: 0
    };
  },

  computed: {
    ...mapState({
      // facultades: state => state.facultad.arrFacultadUser,
      // filiales: state => state.filial.arrFilialUser
    }),

    ...mapGetters({
      facultades: "facultad/facultaUserdWoSelect",
      filiales: "filial/filialUserdWoSelect"
    }),

    arrEscuelas() {
      return this.$store.getters["escuela/escuelaByFacultad"](this.id_facultad);
    },

    escuelas() {
      return this.arrEscuelas.filter(e => e.id_escuela != 0);
    }
  },

  watch: {
    id_facultad: function(n) {
      this.dataGeneral = null;
      this.dataDocentePresencial = [];
      this.id_escuela = "T";
      if (n != "T") {
        // this.getEscuelas()
        this.facultad = this.facultades.filter(
          f => f.id_facultad == n
        )[0].nombre;
      } else {
        this.escuelas = null;
        this.facultad = "";
      }
    },
    id_modalidad: function(n) {
      this.dataGeneral = null;
      this.dataDocentePresencial = [];
      if (n != "T") {
        this.modalidad = this.modalidades.filter(
          f => f.id_modalidad == n
        )[0].nombre;
      } else {
        this.modalidad = "";
      }
    },
    id_filial: function(n) {
      this.dataGeneral = null;
      this.dataDocentePresencial = [];
      if (n != "T") {
        this.filial = this.filiales.filter(
          f => f.id_filial == n
        )[0].nombre_filial;
      } else {
        this.filial = "";
      }
    },
    id_escuela: function(n) {
      this.dataGeneral = null;
      this.dataDocentePresencial = [];
      if (n != "T") {
        this.escuela = this.escuelas.filter(f => f.id_escuela == n)[0].nombre;
      } else {
        this.escuela = "";
      }
    },
    id_docente: function(n) {
      if (n != "T") {
        this.id_filial = "T";
        this.id_facultad = "T";
        this.id_escuela = "T";
        this.dedicacion = "T";
      }
      // this.id_modalidad = 'T'
    },
    dedicacion: function(n) {
      this.dataGeneral = null;
      this.dataDocentePresencial = [];
    },

    curso() {
      this.dataGeneral = null;
      this.dataDocentePresencial = [];
    },

    plazaDesierta: function(n) {
      n ? (this.id_docente = "88888888") : (this.id_docente = "");
    }
  },

  methods: {
    init() {
      this.getFiliales();
      this.getFacultades();
      this.getModalidades();
    },

    ...mapActions({
      getFacultades: "facultad/getFacultadByUser",
      getFiliales: "filial/getFilialesByUser"
    }),

    async getModalidades() {
      try {
        const res = await this.axios.get(`${this.URL}js-modalidad`, this.autho);

        if (res.status === 200) {
          this.modalidades = res.data.data;
        }
      } catch (err) {
        this.modalidades = null;
        this.$hlp.errors(err);
      }
    },

    getData() {
      if (this.id_docente == "") {
        this.id_docente = "T";
      }
      if (this.id_modalidad == 1) {
        this.getDataPresencial();
      } else if (this.id_modalidad == 2) {
        this.getDataSemiPresencial();
      }
    },

    async getDataPresencial() {
      const loading = this.$loading({
        lock: true,
        text: "Creando datos modalidad presencial...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      try {
        const res = await this.axios.get(
          `${this.URL}js-carga-lectiva/${this.entorno.version_ingreso}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.id_docente}/${this.id_filial}/${this.id_facultad}/${this.id_escuela}/${this.dedicacion}/${this.cargo}/${this.curso}`
        );
        if (res.status === 200) {
          this.dataGeneral = res.data.data;
          this.dataDocentePresencial = [];
          this.dataGeneral.map(data => {
            if (
              !this.dataDocentePresencial.some(
                d => d.id_docente == data.id_docente
              )
            ) {
              this.dataDocentePresencial.push(data);
            }
          });

          this.dataDocentePresencial.forEach(d => {
            this.$set(d, "cursos", []);
            this.dataGeneral.forEach(data => {
              if (d.id_docente == data.id_docente) {
                d.cursos.push(data);
                //
              }
            });

            let suma = 0;
            d.cursos.forEach(dt => {
              suma += parseInt(dt.sub_tot_lectivas);
            });

            this.$set(d, "suma_sub_total", suma);
          });
        }
      } catch (err) {
        this.dataGeneral = null;
        this.dataDocentePresencial = [];
        this.$hlp.errors(err);
      }

      loading.close();
    },

    async getDataSemiPresencial() {
      const loading = this.$loading({
        lock: true,
        text: "Creando datos modalidad semipresencial...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      try {
        const res = await this.axios.get(
          `${this.URL}js-carga-lectiva-sp/${this.entorno.version_ingreso}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${this.id_docente}/${this.id_filial}/${this.id_facultad}/${this.id_escuela}/${this.dedicacion}/${this.cargo}/${this.curso}`
        );

        if (res.status === 200) {
          this.dataGeneral = res.data.data;
          this.dataDocentePresencial = [];
          this.dataGeneral.map(data => {
            if (
              !this.dataDocentePresencial.some(
                d => d.id_docente == data.id_docente
              )
            ) {
              this.dataDocentePresencial.push(data);
            }
          });

          this.dataDocentePresencial.forEach(d => {
            this.$set(d, "cursos", []);
            this.dataGeneral.forEach(data => {
              if (d.id_docente == data.id_docente) {
                d.cursos.push(data);
                //
              }
            });

            let suma = 0;
            let suma_sp = 0;
            let suma_sv = 0;
            d.cursos.forEach(dt => {
              suma += parseInt(dt.sub_tot_lectivas);
              suma_sp += parseInt(dt.sub_tot_lectivas_sp);
              suma_sv += parseInt(dt.sub_tot_lectivas_sv);
            });

            this.$set(d, "suma_sub_total", suma);
            this.$set(d, "suma_sp", suma_sp);
            this.$set(d, "suma_sv", Math.round(suma_sv / 2));
          });
        }
      } catch (err) {
        this.dataGeneral = null;
        this.dataDocentePresencial = [];
        this.$hlp.errors(err);
      }

      loading.close();
    },

    exportExcel() {
      const table = document.getElementById("customers");

      var wb = XLSX.utils.table_to_book(table, {
        raw: true
      });
      XLSX.writeFile(wb, "carga_lectiva.xlsx");
    },

    openBuscarDocente() {
      this.modal_docente = true;
    },

    closeBuscarDocente() {
      this.modal_docente = false;
    },

    seleccionarDocenteBusqueda(id_docente) {
      this.id_docente = id_docente;
      this.closeBuscarDocente();
    },

    // Funcion que hace el calculo de las horas de investigacion, administrativas, total horas y dedicacion de un docente
    // para la modalidad presencial
    calcularDatosLectiva(payload) {
      let { inv, dedi, suma_sub_total, nivel_cargo } = payload;

      let hInv = 0,
        hAdmi = 0,
        totalHoras = 0,
        dedicacion = "";

      if (inv == 1 && this.general) {
        hInv = 4;
      }

      if (dedi == "DE") {
        dedicacion = "DE";
      } else {
        if (nivel_cargo == 1) {
          dedicacion = "TC";
        } else {
          // NOTE calculo para tiempo completo
          // dedicacion = suma_sub_total > 20 ? 'TC' : 'TP'
          dedicacion = suma_sub_total > 23 ? "TC" : "TP";
        }
      }

      if (dedicacion == "TP") {
        totalHoras = suma_sub_total + hInv;
      } else {
        if (suma_sub_total + hInv > 40) {
          hAdmi = 0;
          totalHoras = suma_sub_total + hInv;
        } else {
          totalHoras = 40;
          hAdmi = totalHoras - suma_sub_total - hInv;
        }
      }

      return {
        hInv,
        hAdmi,
        totalHoras,
        dedicacion
      };
    },

    // Funcion que hace el calculo de las horas de investigacion, administrativas, total horas y dedicacion de un docente
    // para la modalidad semi presencial
    calcularDatosLectivaSP(payload) {
      let { inv, dedi, suma_sp, suma_sv, nivel_cargo } = payload;

      let suma_sub_total = suma_sp + suma_sv;

      let hInv = 0,
        hAdmi = 0,
        totalHoras = 0,
        dedicacion = "";

      if (inv == 1 && this.general) {
        hInv = 4;
      }

      if (dedi == "DE") {
        dedicacion = "DE";
      } else {
        if (nivel_cargo == 1) {
          dedicacion = "TC";
        } else {
          // NOTE calculo para tiempo completo
          // dedicacion = suma_sub_total > 20 ? 'TC' : 'TP'
          dedicacion = suma_sub_total > 23 ? "TC" : "TP";
        }
      }

      if (dedicacion == "TP") {
        totalHoras = suma_sub_total + hInv;
      } else {
        if (suma_sub_total + hInv > 40) {
          hAdmi = 0;
          totalHoras = suma_sub_total + hInv;
        } else {
          totalHoras = 40;
          hAdmi = totalHoras - suma_sub_total - hInv;
        }
      }

      return {
        hInv,
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

