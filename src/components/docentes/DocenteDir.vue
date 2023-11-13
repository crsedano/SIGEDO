<template>
  <div class="ed-container init">
    <div class="ed-item txt-center">
      <h1>
        <strong>LISTA DE DOCENTES / DIRECCIONES</strong>
      </h1>
    </div>

    <el-form size="mini" class="ed-item sep-5 ed-container" label-width="120px">
      <el-form-item class="ed-item m-50" label="Facultad">
        <el-select filterable v-model="idFacultad">
          <el-option
            v-for="(facultad, index) in facultades"
            :key="index"
            :label="facultad.nombre"
            :value="facultad.id_facultad"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="ed-item m-50" label="Docente">
        <el-input v-model="idDocente"></el-input>
      </el-form-item>
      <el-form-item
        class="ed-item"
        label="Mostrar solo docentes sin direcciones"
      >
        <el-switch v-model="w"></el-switch>
      </el-form-item>
      <el-form-item class="ed-item txt-center">
        <el-button type="primary" @click="getDocentes">Actualizar</el-button>
        <a
          v-if="arrDocentes"
          :href="apiURL"
          class="el-button el-button--info el-button--mini"
          rel="noopener noreferrer"
          >Imprimir</a
        >
      </el-form-item>
    </el-form>

    <div class="ed-item sep-10">
      <el-table
        border
        stripe
        fit
        :data="arrDocentes"
        height="350"
        highlight-current-row
        :row-class-name="tableRowClassName"
        v-loading="ajaxLoad"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando..."
      >
        <el-table-column
          :index="indexMethod"
          fixed
          type="index"
          min-width="40"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="dni"
          label="DNI"
          min-width="80"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="nombre"
          label="Docente"
          min-width="220"
          align="left"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="facultad"
          label="Facultad"
          min-width="250"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="cdireccion"
          label="Dirección"
          min-width="180"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="cdist"
          label="Distrito"
          min-width="180"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="cprov"
          label="Provincia"
          min-width="180"
          align="center"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="cdepa"
          label="Departamento"
          min-width="180"
          align="center"
          header-align="center"
        ></el-table-column>
      </el-table>
    </div>

    <div class="ed-item gr-center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[100, 200, 300]"
        :page-size.sync="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total.sync="total"
      >
      </el-pagination>
    </div>
  </div>
</template>


<script>
// Mixin
import mixingInit from '../../mixing/mixing_init.js'

export default {
  mixins: [mixingInit],

  beforeRouteEnter: (to, from, next) => {
    next((vm) => {
      if (!vm.identity) {
        next('/')
      }
      if (!vm.permisos) {
        next('/')
        return
      }
      let s = vm.permisos.find(
        (p) => p.urlv.substr(2, p.urlv.length) == to.path
      )
      if (!s) {
        next('/')
      }
    })
  },

  mounted() {
    this.init()
  },

  components: {},

  data() {
    return {
      facultades: null,
      idFacultad: 0,
      arrDocentes: null,
      idDocente: null,
      limit: 100,
      total: 0,
      page: 1,
      w: false,
    }
  },

  watch: {
    idFacultad(n) {
      this.arrDocentes = null
      this.page = 1
    },

    idDocente() {
      this.arrDocentes = null
      this.page = 1
    },
  },

  computed: {
    apiURL() {
      let $query = ''
      if (this.idDocente && this.idDocente != '') {
        $query = `/${this.idDocente}`
      }
      return `${this.URL_}v2/docentes/with-direccion-export/0/${this.idFacultad}/${this.w}${$query}?token=${this.token}`
    },
  },

  filters: {
    break($value) {
      if (!$value) return ''
      if ($value.length <= 30) {
        return $value
      } else {
        return `${$value.substr(0, 30)}...`
      }
    },
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      await this.getFacultadesUser()

      loading.close()
    },

    async getFacultadesUser() {
      try {
        const res = await this.axios.get(`${this.URL_}v2/user_data/facultades`)
        if (res.status !== 200) return
        this.facultades = res.data.facultades
        this.facultades.unshift({
          id_facultad: 0,
          nombre: 'TODAS / SELECCIONAR',
        })
        this.facultades.push({
          id_facultad: 'N',
          nombre: 'SIN FACULTAD',
        })
      } catch (err) {
        this.facultades = null
        this.$hlp.errors(err)
      }
    },

    async getDocentes() {
      this.ajaxLoad = true
      let $query = ''
      if (this.idDocente && this.idDocente != '') {
        $query = `/${this.idDocente}`
      }
      try {
        const res = await this.axios.get(
          `${this.URL_}v2/docentes/with_direccion/${this.limit}/${this.idFacultad}/${this.w}${$query}?page=${this.page}`
        )
        if (res.status !== 200) {
          this.ajaxLoad = false
          return
        }
        this.arrDocentes = res.data.data.data
        this.setTotal(res.data.data.total)
      } catch (err) {
        this.arrDocentes = null
        this.$hlp.errors(err)
      }
      this.ajaxLoad = false
    },

    setTotal($total) {
      this.total = $total
    },

    indexMethod(index) {
      return index + 1 + this.limit * (this.page - 1)
    },

    handleSizeChange(val) {
      this.page = 1
      this.getDocentes()
    },

    handleCurrentChange(val) {
      this.getDocentes()
    },
  },
}
</script>

<style lang="scss" scoped>
p,
h6 {
  margin: 0;
}

.inv {
  margin-bottom: 3px;
  border-bottom: 1px solid #ccc;
}
</style>

