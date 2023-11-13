<template>
  <div class="ed-container" v-loading.fullscreen.lock="searching">
    <div class="ed-item">
      <el-input
        size="mini"
        @keyup.enter.native="findDocente"
        v-model="q"
        placeholder="Buscar Docente"
      ></el-input>
    </div>

    <div class="ed-item sep-10">
      <el-table
        @row-click="selectDocente"
        border
        stripe
        fit
        :data="docentes"
        height="350"
        highlight-current-row
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          type="index"
          min-width="40"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="id_docente"
          label="DNI"
          min-width="40"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="nombre"
          label="Docente"
          min-width="40"
          align="left"
          header-align="center"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import MixingInit from "../../../mixing/mixing_init";

export default {
  name: "find-docente",

  mixins: [MixingInit],

  data() {
    return {
      q: "",
      docentes: [],
      searching: false,
    };
  },

  methods: {
    async findDocente() {
      this.searching = true;
      try {
        const res = await this.axios.get(
          `${this.URL_}v2/docentes/search_docente/${this.q}/${this.idPeriodo__}/${this.idSemestre__}/0`
        );

        let { status, data } = res;

        if (status === 200) {
          this.docentes = data.docentes;
        }
      } catch (err) {
        this.$hlp.errors(err);
      }
      this.searching = false;
    },

    selectDocente(row) {
      this.emitDocente(row);
      this.close();
    },

    emitDocente(docente) {
      this.$emit("selected:docente", docente);
    },

    close() {
      this.$emit("close");
    },
  },
};
</script>