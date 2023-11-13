<template>
  <div class="ed-container init">
    <h2 class="ed-item gr-center">
      <strong>CURSOS A CARGO</strong>
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
      >
        <el-table-column
          fixed
          type="index"
          min-width="40"
          align="center"
          header-align="center"
        ></el-table-column>

        <el-table-column
          prop="curso.nombre"
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
              reg.row.curso.id_asignatura_general == '0'
                ? reg.row.curso.escuela.nombre
                : reg.row.curso.escuela.facultad.nombre
            }}
          </template>
        </el-table-column>

        <el-table-column
          prop="filial.nombre_filial"
          label="Filial"
          min-width="150"
          align="left"
          header-align="center"
        >
        </el-table-column>

        <el-table-column
          label="Modalidad"
          min-width="150"
          align="left"
          header-align="center"
        >
          <template slot-scope="reg">
            {{ reg.row.id_modalidad == 1 ? 'PRESENCIAL' : 'VIRTUAL' }}
          </template>
        </el-table-column>

        <el-table-column
          label="Doc"
          min-width="80"
          align="center"
          header-align="center"
        >
          <template slot-scope="reg">
            <el-button
              @click="downloadDoc(reg.row.silaboVirtualURL)"
              v-if="reg.row.silaboVirtualURL"
              size="mini"
              type="primary"
              icon="el-icon-download"
            ></el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="*"
          min-width="80"
          align="center"
          header-align="center"
        >
          <template slot-scope="reg">
            <el-button
              @click="openLoadFile(reg.row)"
              type="primary"
              size="mini"
            >
              Cargar
            </el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <strong>No cuenta con cursos asignados</strong>
        </template>
      </el-table>
    </div>

    <el-dialog
      title="Carga Silabo Virtual"
      :visible.sync="dialog.loadSilaboVirtual.show"
      width="70%"
    >
      <load-silabo-virtual
        :idDocente="this.identity.dni"
        :idCurso="dialog.loadSilaboVirtual.reg.id_curso"
        :idModalidad="dialog.loadSilaboVirtual.reg.id_modalidad"
        :idFilial="dialog.loadSilaboVirtual.reg.id_filial"
        v-if="dialog.loadSilaboVirtual.show && dialog.loadSilaboVirtual.reg"
        @close="dialog.loadSilaboVirtual.show = false"
        @update="getCursosAsignados"
      />
    </el-dialog>
  </div>
</template>

<script>
import Init from '../../mixing/mixing_init.js'
import LoadSilaboVirtual from './childrens/LoadSilaboVirtual'

export default {
  mixins: [Init],

  components: {
    LoadSilaboVirtual
  },

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if (!vm.permisos) {
        next('/')
        return
      }
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if (!s) {
        next('/')
      }
    })
  },

  mounted() {
    this.init()
  },

  data() {
    return {
      cursosAsignados: null,

      dialog: {
        loadSilaboVirtual: {
          show: false,
          reg: null
        }
      }
    }
  },

  computed: {},

  methods: {
    init() {
      this.getCursosAsignados()
    },

    async getCursosAsignados() {
      try {
        const res = await this.$api.get(
          `v1/silabus-virtual/cursos-cargo/${this.identity.dni}/${
            this.idPeriodo__
          }/${this.idSemestre__}`
        )

        if (res.status === 200) {
          this.cursosAsignados = res.data.cursos
        }
      } catch (err) {
        this.cursosAsignados = null
      }
    },

    downloadDoc(file) {
      let arr = file.split('/')

      let name = arr[arr.length - 1]

      this.$hlp.downloadFile(file, name)
    },

    tableRowClassName({ row }) {
      return 'clase'
    },

    openLoadFile(row) {
      this.dialog.loadSilaboVirtual.show = true
      this.dialog.loadSilaboVirtual.reg = row
    }
  }
}
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
