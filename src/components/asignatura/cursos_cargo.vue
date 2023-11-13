<template>
  <div class="ed-container init">
    <h2 class="ed-item gr-center">
      <strong>LISTA DE SILABOS A CARGO</strong>
    </h2>

    <div class="ed-item sep-10">
      <el-table
        border
        stripe
        fit
        :data="cursosAsignados"
        height="500"
        highlight-current-row
        :row-class-name="tableRowClassName"
        v-loading="ajaxLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando cursos a cargo..."
      >
        <el-table-column
          fixed
          type="index"
          min-width="40"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="asignatura"
          label="Asignatura"
          min-width="300"
          align="left"
          header-align="center"
        ></el-table-column>
        <el-table-column
          label="Escuela / Facultad"
          min-width="300"
          align="left"
          header-align="center"
        >
          <template slot-scope="reg">
            {{
              reg.row.tipo_asignatura == "G"
                ? reg.row.facultad
                : reg.row.escuela
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="filial"
          label="Filial"
          min-width="150"
          align="left"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="modalidad"
          label="Modalidad"
          min-width="150"
          align="left"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="tipo_asignatura"
          label="Tipo"
          min-width="60"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          label="Responsable"
          min-width="120"
          align="center"
          header-align="center"
        >
          <template slot-scope="reg">
            <el-tooltip
              v-if="reg.row.responsable_silabus == 1"
              content="Registrar Silabo"
              placement="left"
            >
              <i @click="selectCurso(reg.row)" class="fas fa-check action"></i>
            </el-tooltip>
            <i v-else class="fas fa-times action red"></i>
          </template>
        </el-table-column>
        <el-table-column
          label="*"
          min-width="80"
          align="center"
          header-align="center"
        >
          <template slot-scope="reg">
            <el-tooltip content="Imprimir PDF" placement="left">
              <a
                v-if="reg.row.pres == 1"
                target="_blank"
                :href="`${URLPDF}api/src/reportes/silabo/silabo_pdf.php?ae_bcd=${token}&id_usuario=${identity.id_usuario}&id_periodo=${periodo.id_periodo}&id_semestre=${periodo.id_semestre}&id_filial=${reg.row.id_filial}&id_modalidad=1&dni=${identity.dni}&id_asignatura=${reg.row.id_curso}&tipo=${reg.row.tipo_asignatura}&filial=${reg.row.filial}&id_asig=${reg.row.curso}&moda=${reg.row.id_modalidad}`"
              >
                <i class="fas fa-file-pdf action pointer"></i>
              </a>
            </el-tooltip>
          </template>
        </el-table-column>
        <template slot="empty">
          <strong>No cuenta con cursos asignados</strong>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import alertify from "alertifyjs";

import loading from "../templates/loading.vue";
import loader from "../templates/loader.vue";

/**
 * MIXING
 */
import mixingInit from "../../mixing/mixing_init.js";

export default {
  mixins: [mixingInit],

  beforeRouteEnter: (to, from, next) => {
    next((vm) => {
      if (!vm.identity) {
        next("/");
      }
      if (!vm.permisos) {
        next("/");
        return;
      }
      let s = vm.permisos.find(
        (p) => p.urlv.substr(2, p.urlv.length) == to.path
      );
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
  },

  data() {
    return {
      cursosAsignados: null,
    };
  },

  computed: {},

  methods: {
    init() {
      this.getCursosAsignados();
    },

    async getCursosAsignados() {
      this.ajaxLoad = true;
      try {
        const res = await this.axios.get(
          `${this.URL}js-cursos-asignados/${this.identity.dni}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`,
          this.autho
        );

        if (res.status === 200) {
          this.cursosAsignados = res.data.data;
        }
      } catch (err) {
        console.dir(err);
        this.cursosAsignados = null;
      }
      this.ajaxLoad = false;
    },

    selectCurso(curso) {
      curso.id_modalidad = 1;
      if (curso.silabus == 1) {
        this.swAlert(`El silabus de este curso ya ha sido registrado`, "info");
        return;
      }
      this.$router.push({
        name: "Silabo General",
        params: {
          curso_: curso,
          from: this.$route.name,
        },
      });
    },

    tableRowClassName({ row }) {
      return "clase";
    },
  },
};
</script>

<style lang="scss">
.el-table {
  .clase {
    cursor: pointer;
    padding: 0;
    font-size: 0.8em;
  }
  td,
  th {
    padding: 5px 0 !important;
    color: #000 !important;
  }
}
</style>
