<template>
<div class="ed-container init">
  <div class="ed-item txt-center">
    <h1>
      <strong>EVALUACIÓN DOCENTE</strong>
    </h1>
  </div>

  <el-form size="mini" class="ed-item sep-5 ed-container" label-width="120px">
    <el-form-item class="ed-item m-50" label="Facultad">
      <el-select filterable v-model="idFacultad">
        <el-option v-for="(facultad, index) in facultades" :key="index" :label="facultad.nombre" :value="facultad.id_facultad"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="ed-item m-50" label="Docente">
      <el-input v-model="idDocente"></el-input>
    </el-form-item>
    <el-form-item class="ed-item txt-center">
      <el-button type="primary" @click="getData">Actualizar</el-button>
    </el-form-item>
    <el-form-item class="ed-item txt-center">
      <el-button type="danger" @click="calcPuntajes">Calcular Puntajes</el-button>
    </el-form-item>
    <el-form-item class="ed-item txt-center">
      <el-button type="info" @click="exportExcel">Descargar Excel</el-button>
    </el-form-item>
  </el-form>

  <div v-if="rubros" class="ed-item sep-10">
    <el-table @cell-click="cellClick" border stripe fit :data="arrDocentes" height="350" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando...">
      <el-table-column :index="indexMethod" fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>

      <el-table-column prop="dni" label="DNI" min-width="80" align="center" header-align="center"></el-table-column>

      <el-table-column prop="nombre" label="Docente" min-width="220" align="left" header-align="center"></el-table-column>

      <el-table-column sortable prop="puntaje.total" label="Total" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.total}}
        </template>
      </el-table-column>

      <el-table-column prop="puntaje.rubro_1" :label="rubros[0].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_1 ?  reg.row.puntaje.rubro_1 : 0 }}
        </template>
      </el-table-column>

      <el-table-column prop="puntaje.rubro_2" :label="rubros[1].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_2 ?  reg.row.puntaje.rubro_2 : 0 }}
        </template>
      </el-table-column>
      
      <el-table-column prop="puntaje.rubro_3" :label="rubros[2].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_3 ?  reg.row.puntaje.rubro_3 : 0 }}
        </template>
      </el-table-column>

      <el-table-column prop="puntaje.rubro_4" :label="rubros[3].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_4 ?  reg.row.puntaje.rubro_4 : 0 }}
        </template>
      </el-table-column>

      <el-table-column prop="puntaje.rubro_5" :label="rubros[4].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_5 ?  reg.row.puntaje.rubro_5 : 0 }}
        </template>
      </el-table-column>

      <el-table-column prop="puntaje.rubro_6" :label="rubros[5].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_6 ?  reg.row.puntaje.rubro_6 : 0 }}
        </template>
      </el-table-column>

      <el-table-column prop="puntaje.rubro_7" :label="rubros[6].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_7 ?  reg.row.puntaje.rubro_7 : 0 }}
        </template>
      </el-table-column>

      <el-table-column prop="puntaje.rubro_8" :label="rubros[7].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_8 ?  reg.row.puntaje.rubro_8 : 0 }}
        </template>
      </el-table-column>

      <el-table-column prop="puntaje.rubro_9" :label="rubros[8].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_9 ?  reg.row.puntaje.rubro_9 : 0 }}
        </template>
      </el-table-column>

      <el-table-column prop="puntaje.rubro_10" :label="rubros[9].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_10 ?  reg.row.puntaje.rubro_10 : 0 }}
        </template>
      </el-table-column>
      
      <el-table-column prop="puntaje.rubro_11" :label="rubros[10].nombre" min-width="250" align="center" header-align="center">
        <template slot-scope="reg">
          {{ reg.row.puntaje.rubro_11 ?  reg.row.puntaje.rubro_11 : 0 }}
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="ed-item gr-center">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page"
      :page-sizes="[100, 200, 300]" :page-size.sync="limit" layout="total, sizes, prev, pager, next, jumper"
      :total.sync="total">
    </el-pagination>
  </div>

  <el-dialog
    @close="modal.rubro_1 = false"
    :visible.sync="modal.rubro_1"
    width="80%"
    center>
    <rubro1 :id-docente="idDocente_" v-if="modal.rubro_1" @close="modal.rubro_1 = false"/>
  </el-dialog>

  <el-dialog
    @close="modal.rubro_2 = false"
    :visible.sync="modal.rubro_2"
    width="80%"
    center>
    <rubro2 :id-docente="idDocente_" v-if="modal.rubro_2" @close="modal.rubro_2 = false"/>
  </el-dialog>

  <el-dialog
    @close="modal.rubro_3 = false"
    :visible.sync="modal.rubro_3"
    width="80%"
    center>
    <rubro3 :id-docente="idDocente_" v-if="modal.rubro_3" @close="modal.rubro_3 = false"/>
  </el-dialog>

  <el-dialog
    @close="modal.rubro_4 = false"
    :visible.sync="modal.rubro_4"
    width="80%"
    center>
    <rubro4 :id-docente="idDocente_" v-if="modal.rubro_4" @close="modal.rubro_4 = false"/>
  </el-dialog>

  <el-dialog
    @close="modal.rubro_5 = false"
    :visible.sync="modal.rubro_5"
    width="80%"
    center>
    <rubro5 :id-docente="idDocente_" v-if="modal.rubro_5" @close="modal.rubro_5 = false"/>
  </el-dialog>

  <el-dialog
    @close="modal.rubro_6 = false"
    :visible.sync="modal.rubro_6"
    width="80%"
    center>
    <rubro6 :id-docente="idDocente_" v-if="modal.rubro_6" @close="modal.rubro_6 = false"/>
  </el-dialog>

  <el-dialog
    @close="modal.rubro_7 = false"
    :visible.sync="modal.rubro_7"
    width="80%"
    center>
    <rubro7 :id-docente="idDocente_" v-if="modal.rubro_7" @close="modal.rubro_7 = false"/>
  </el-dialog>
</div>
</template>


<script>

// Mixin
import mixingInit from '../../mixing/mixing_init.js'

import rubro1 from './evaluacion-docente/Rubro_1.vue'
import rubro2 from './evaluacion-docente/Rubro_2.vue'
import rubro3 from './evaluacion-docente/Rubro_3.vue'
import rubro4 from './evaluacion-docente/Rubro_4.vue'
import rubro5 from './evaluacion-docente/Rubro_5.vue'
import rubro6 from './evaluacion-docente/Rubro_6.vue'
import rubro7 from './evaluacion-docente/Rubro_7.vue'

export default {
  mixins: [mixingInit],

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

  mounted () {
    this.init()
  },

  components: {
    rubro1,
    rubro2,
    rubro3,
    rubro4,
    rubro5,
    rubro6,
    rubro7,
  },

  data () {
    return {
      facultades: null,
      idFacultad: 0,
      arrDocentes: null,
      idDocente: null,
      limit: 100,
      total: 0,
      page: 1,
      w: false,
      rubros: null,

      modal: {
        rubro_1: false,
        rubro_2: false,
        rubro_3: false,
        rubro_4: false,
        rubro_5: false,
        rubro_6: false,
        rubro_7: false,
      },

      idDocente_: null
    }
  },

  watch: {
    
  },

  computed: {

  },

  filters: {
    
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      await this.getRubros()
      await this.getFacultadesUser()
      
      loading.close()
    },

    async getRubros () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/evaluacion_docente/all_rubros`)
        if (res.status === 200) {
          this.rubros = res.data.rubros
        }
      } catch (err) {
        this.rubros = null
        console.dir(err)
      }
    },

    async getFacultadesUser () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/user_data/facultades`)
        if (res.status !== 200) return
        this.facultades = res.data.facultades
        this.facultades.unshift({
          id_facultad: 0,
          nombre: 'TODAS / SELECCIONAR'
        })
        this.facultades.push({
          id_facultad: 'N',
          nombre: 'SIN FACULTAD'
        })
      } catch (err) {
        this.facultades = null
        this.$hlp.errors(err)
      }
    },

    async getData () {
      this.ajaxLoad = true
      let $query = ''
      if(this.idDocente && this.idDocente != '') {
        $query = `/${this.idDocente}`
      }
      try {
        const res = await this.axios.get(`${this.URL_}v2/evaluacion_docente/all/${this.limit}/${this.idFacultad}${$query}?page=${this.page}`)

        if(res.status !== 200) {
          this.ajaxLoad = false
          return
        }
        this.arrDocentes = res.data.puntajes.data
        this.arrDocentes = this.arrDocentes.map(a => {
          a.puntaje.rubro_1 = parseFloat(a.puntaje.rubro_1) || 0
          a.puntaje.rubro_2 = parseFloat(a.puntaje.rubro_2) || 0
          a.puntaje.rubro_3 = parseFloat(a.puntaje.rubro_3) || 0
          a.puntaje.rubro_4 = parseFloat(a.puntaje.rubro_4) || 0
          a.puntaje.rubro_5 = parseFloat(a.puntaje.rubro_5) || 0
          a.puntaje.rubro_6 = parseFloat(a.puntaje.rubro_6) || 0
          a.puntaje.rubro_7 = parseFloat(a.puntaje.rubro_7) || 0
          a.puntaje.rubro_8 = parseFloat(a.puntaje.rubro_8) || 0
          a.puntaje.rubro_9 = parseFloat(a.puntaje.rubro_9) || 0
          a.puntaje.rubro_10 = parseFloat(a.puntaje.rubro_10) || 0
          a.puntaje.rubro_11 = parseFloat(a.puntaje.rubro_11) || 0

          this.$set(a.puntaje, 'total', a.puntaje.rubro_1 + a.puntaje.rubro_2 + a.puntaje.rubro_3 + a.puntaje.rubro_4 + a.puntaje.rubro_5 + a.puntaje.rubro_6 + a.puntaje.rubro_7 + a.puntaje.rubro_8 + a.puntaje.rubro_9 + a.puntaje.rubro_10 - a.puntaje.rubro_11)

          return a
        })
        this.setTotal(res.data.puntajes.total)
      } catch (err) {
        this.arrDocentes = null
        this.$hlp.errors(err)
      }
      this.ajaxLoad = false
    },

    calcularTotalPuntaje (a) {
      a.puntaje.rubro_1 = parseFloat(a.puntaje.rubro_1) || 0
      a.puntaje.rubro_2 = parseFloat(a.puntaje.rubro_2) || 0
      a.puntaje.rubro_3 = parseFloat(a.puntaje.rubro_3) || 0
      a.puntaje.rubro_4 = parseFloat(a.puntaje.rubro_4) || 0
      a.puntaje.rubro_5 = parseFloat(a.puntaje.rubro_5) || 0
      a.puntaje.rubro_6 = parseFloat(a.puntaje.rubro_6) || 0
      a.puntaje.rubro_7 = parseFloat(a.puntaje.rubro_7) || 0
      a.puntaje.rubro_8 = parseFloat(a.puntaje.rubro_8) || 0
      a.puntaje.rubro_9 = parseFloat(a.puntaje.rubro_9) || 0
      a.puntaje.rubro_10 = parseFloat(a.puntaje.rubro_10) || 0
      a.puntaje.rubro_11 = parseFloat(a.puntaje.rubro_11) || 0
      a.total =  a.puntaje.rubro_1 + a.puntaje.rubro_2 + a.puntaje.rubro_3 + a.puntaje.rubro_4 + a.puntaje.rubro_5 + a.puntaje.rubro_6 + a.puntaje.rubro_7 + a.puntaje.rubro_8 + a.puntaje.rubro_9 + a.puntaje.rubro_10 - a.puntaje.rubro_11 
    },

    setTotal($total) {
      this.total = $total
    },

    indexMethod(index) {
      return index + 1 + this.limit * (this.page - 1)
    },

    handleSizeChange(val) {
      this.page = 1
      this.getData()
    },

    handleCurrentChange(val) {
      this.getData()
    },

    cellClick (row, column, cell, event) {
      let { property, label } = column
      let { puntaje } = row
      property = property.slice(8)

      if (property != 'rubro_8' && property != 'rubro_9' && property != 'rubro_10' && property != 'rubro_11') {
        this.openDetail(property, puntaje.id_docente)
        return
      }
      
      this.$prompt(`Ingrese el puntaje para: ${label}`, 'Evaluación docente', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPattern: /^-?\d+\.?\d*$/,
        inputErrorMessage: 'Inválido'
      }).then( async ({ value }) => {
        let obj_ = {
          rubro: value
        }

        await this.updatePuntaje(puntaje.id_docente, property, obj_)

      }).catch(() => {

      })
    },

    async updatePuntaje (idDocente, rubro, obj) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.put(`${this.URL_}v2/evaluacion_docente/update_puntaje_docente/${idDocente}/${rubro}`, obj)

        let { status } = res

        if (status === 200) {
          await this.getData()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async calcPuntajes () {
      const loading = this.$loading({
        lock: true,
        text: 'Calculando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.recalificarDocente()
      loading.close()
    },

    openDetail (rubro, id) {
      this.modal[rubro] = true
      this.idDocente_ = id
    },

    async exportExcel () {
      const loading = this.$loading({
        lock: true,
        text: 'Exportando datos...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let $query = ''
      if(this.idDocente && this.idDocente != '') {
        $query = `/${this.idDocente}`
      }
      try {
        const res = await this.axios.get(`${this.URL_}v2/evaluacion_docente/export_puntajes/${this.idFacultad}${$query}`)
				console.log("TCL: exportExcel -> res", res)
        this.downloadFile(res)

      } catch (err) {
        console.dir(err)
      }
      loading.close()
    },

    downloadFile(response) {
      const link = document.createElement('a')
      link.href = response.data.url
      link.download = response.data.name
      link.target = '_blank'
      link.click()
    },
  }
}
</script>

<style lang="scss" scoped>
p, h6 {
  margin: 0;
}
</style>

