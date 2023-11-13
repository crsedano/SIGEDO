<template>
  <div class="ed-container init">
    <div class="ed-item">
      <h1 class="text-center">
        <strong>HISTORIAL MONITOREO DOCENTE</strong>
      </h1>
    </div>

    <div class="ed-item text-center">
      <el-button @click="dialog.findDocente = true" size="mini" type="primary"
        >Buscar Docente</el-button
      >
      <el-button
        v-if="docente"
        @click="dialog.historialMonitoreoAdmin = true"
        size="mini"
        type="primary"
        >Registrar Monitoreo</el-button
      >
    </div>

    <div v-if="docente" class="ed-item sep-10">
      <el-alert
        title="Docente Seleccionado"
        :description="`${docente.nombre}`"
        :closable="false"
        center
        type="info"
      >
      </el-alert>
    </div>

    <div v-if="docente" class="ed-item sep-10">
      <el-table
        border
        stripe
        fit
        :data="historial"
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
          prop="periodo"
          label="Periodo"
          min-width="40"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="semestre"
          label="Semestre"
          min-width="40"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          label="Documento"
          min-width="40"
          align="center"
          header-align="center"
        >
          <template slot-scope="reg">
            <el-button
              @click="downloadDoc(reg.row.file)"
              v-if="reg.row.file"
              size="mini"
              type="primary"
              icon="el-icon-download"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="*"
          min-width="50"
          align="center"
          header-align="center"
        >
          <template slot-scope="reg">
            <el-tooltip content="Eliminar" placement="left">
              <i
                @click="removeHistorial(reg.row)"
                class="fas fa-trash-alt pointer action red"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="Buscar Docente"
      :visible.sync="dialog.findDocente"
      width="70%"
    >
      <find-docente
        v-if="dialog.findDocente"
        @close="dialog.findDocente = false"
        @selected:docente="selectDocente"
      />
    </el-dialog>

    <el-dialog
      title="Registro Historial"
      :visible.sync="dialog.historialMonitoreoAdmin"
      width="70%"
    >
      <historial-monitoreo-admin
        :idDocente="docente.id_docente"
        v-if="dialog.historialMonitoreoAdmin && docente"
        @close="dialog.historialMonitoreoAdmin = false"
        @update="updateHistorial"
      />
    </el-dialog>
  </div>
</template>

<script>
import HistorialMonitoreoAdmin from "./dialog/HistorialMonitoreoAdmin";
import FindDocente from "../docente/modal/FindDocente.vue";

import MixingInit from "../../mixing/mixing_init";

export default {
  name: "HistorialMonitoreo",

  components: { FindDocente, HistorialMonitoreoAdmin },

  mixins: [MixingInit],

  data() {
    return {
      historial: [],

      dialog: {
        findDocente: false,
        historialMonitoreoAdmin: false,
      },

      docente: null,
    };
  },

  methods: {
    selectDocente(docente) {
      this.docente = docente;
      this.historial = docente.monitoreos;
    },

    downloadDoc(file) {
      let arr = file.split("/");

      let name = arr[arr.length - 1];

      this.$hlp.downloadFile(file, name);
    },

    updateHistorial(historial) {
      let e = this.historial.some((h) => h.id == historial.id);

      if (!e) {
        this.historial = [...this.historial, historial];
        return;
      }

      this.historial = this.historial.filter((h) => h.id != historial.id);
      this.historial = [...this.historial, historial];
    },

    async removeHistorial({ id }) {
      try {
        const { status } = await this.axios.post(
          `${this.URL_}v1/historial-monitoreo/delete/${id}`
        );

        if (status == 200) {
          this.swAlert(`Historial eliminado`, "success");
          this.historial = this.historial.filter((h) => h.id != id);
        }
      } catch (err) {
        this.$hlp.errors(err);
      }
    },
  },
};
</script>