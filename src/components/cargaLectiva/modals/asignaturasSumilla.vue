<template>
<div class="ed-container init w-modal">
  <i @click="close" class="fas fa-window-close action red iclose"></i>

  <h1 class="ed-item sep-10 gr-center">
    <strong>{{facultad.escuela}}</strong>
  </h1>

  <div class="ed-item sep-5 s-90 m-60 l-30 to-center form-group ed-container">
    <select v-model="planSel" class="form-control">
      <option value="0">Todos los planes</option>
      <option v-for="(plan, index) in planes" :key="index">
        {{plan}}
      </option>
    </select>
    <select v-if="ciclos.length > 0" v-model="cicloSel" class="form-control">
      <option value="0">Todos los ciclos</option>
      <option v-for="(ciclo, index) in ciclos" :key="index">
        {{ciclo}}
      </option>
    </select>
    <input v-model="filterCurso" type="text" class="form-control" placeholder="Buscar Asignatura">
  </div>

  <p class="ed-item gr-center" style="color: #e54c4cd4">
    Si la columna 'sumilla' está marcada de rojo; indica que la sumilla cargada a esa asignatura tiene menos de 200
    caracteres de longitud
  </p>

  <div class="ed-item">
    <el-table border stripe fit :data="cursosFilter" height="460" highlight-current-row :row-class-name="tableRowClassName">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="anio" label="Plan" min-width="60" align="center" header-align="center"></el-table-column>
      <el-table-column prop="ciclo" label="Ciclo" min-width="60" align="center" header-align="center"></el-table-column>
      <el-table-column prop="asignatura" label="Asignatura" min-width="300" align="center" header-align="center"></el-table-column>
      <el-table-column sortable prop="len_sumilla" label="Sumilla" min-width="80" align="center" header-align="center">
        <template slot-scope="reg">
          <p :style="reg.row.len_sumilla < 200 ? 'background: #e54c4cd4' : ''">
            {{ reg.row.len_sumilla }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="*" min-width="60" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Editar Sumilla" placement="left">
            <i @click="getSumilla(reg.row)" class="fas fa-chalkboard-teacher pointer action"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="PDF" min-width="60" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Imprimir reporte" placement="left">
            <i @click="printReport(reg.row)" class="fas fa-file-pdf pointer action"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div v-if="detSumilla" class="modal">
    <detalle-sumilla :id-curso="idCursoSumilla" @close="closeDetSumilla" />
  </div>

  <!-- Pantalla de carga general -->
  <div v-if="loadAjax" class="modal f-row f-center">
    <loader />
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

import loader from '../../templates/loader.vue'

import moment from 'moment'

import detalleSumilla from './detalleSumilla.vue'

export default {

  mixins: [
    MixinInit
  ],

  props: [
    'facultad'
  ],

  components: {
    loader,
    detalleSumilla
  },

  mounted() {
    this.init()
  },

  data: () => ({
    moment: moment,

    loadAjax: false,
    cursosFilter: null,
    cursos: null,
    planes: null,
    planSel: '0',
    planes: [],
    cicloSel: '0',
    ciclos: [],
    filterCurso: '',

    idCursoSumilla: '',
    detSumilla: false
  }),

  watch: {
    filterCurso: function (n) {
      this.filterCurso = n.toUpperCase()
      if (n == '') {
        if (this.planSel == '0') {
          this.cursosFilter = this.cursos
        } else {
          if (this.cicloSel == 0) {
            this.cursosFilter = this.cursos.filter(curso => curso.anio == this.planSel)
          } else {
            this.cursosFilter = this.cursos.filter(curso => curso.anio == this.planSel && curso.ciclo == this.cicloSel)
          }
        }
      } else {
        if (this.planSel == '0') {
          this.cursosFilter = this.cursos.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()))
        } else {
          if (this.cicloSel == 0) {
            this.cursosFilter = this.cursos.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()) && curso.anio == this.planSel)
          } else {
            this.cursosFilter = this.cursos.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()) && curso.anio == this.planSel && curso.ciclo == this.cicloSel)
          }
        }
        // this.cursosFilter = this.cursos.filter(curso => curso.asignatura.toLowerCase().includes(n.toLowerCase()))
      }
    },

    planSel: function (n) {
      if (n == 0) {
        this.ciclos = []
        this.cursosFilter = this.cursos
      } else {
        this.cicloSel = '0'
        this.ciclos = []
        this.cursos.map(cur => {
          if (cur.anio == n) {
            if (!this.ciclos.some(c => c == cur.ciclo)) {
              this.ciclos.push(cur.ciclo)
            }
          }
        })

        this.cursosFilter = this.cursos.filter(curso => curso.anio == n)
      }
    },

    cicloSel: function (n) {
      if (n == 0) {
        this.cursosFilter = this.cursos.filter(curso => curso.anio == this.planSel)
      } else {
        this.cursosFilter = this.cursos.filter(curso => curso.anio == this.planSel && curso.ciclo == n)
      }
    }
  },

  computed: {

  },

  methods: {
    init: async function () {
      this.teclasRapidas()
      this.getAsignaturas()
    },

    async getAsignaturas () {
      this.loadAjax = true
      try {
        const res = await this.axios.get(`${this.URL}js-all-asignatura-sumilla/${this.facultad.id_escuela}`, this.autho)

        if(res.status !== 200) return

        this.cursos = res.data.data

        this.cursosFilter = this.cursos
        this.load = false

        this.planes = []
        this.cursos.map(cur => {
          if (!this.planes.some(p => p == cur.anio)) {
            this.planes.push(cur.anio)
          }
        })
      } catch (err) {
        this.$hlp.errors(err)
      }

      this.loadAjax = false
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })

      document.addEventListener('click', ev => {
        if (ev.target.classList.contains('modal')) {
          this.close()
        }
      })
    },

    getSumilla: function (id) {
      this.idCursoSumilla = id
      this.detSumilla = true
    },
    printReport: function(curso){
      window.open(`${this.URLPDF}api/src/reportes/asignatura/sumillaCurso.php?ae_bcd=${this.token}&id_asignatura=${curso.id_asignatura}&id_usuario=${this.identity.id_usuario}`, '_blank');
    },

    async closeDetSumilla () {
      //await this.getAsignaturas()
      this.detSumilla = false
    },

    close() {
      this.$emit('close')
    },

  }

}
</script>

<style lang="scss" scoped>
p {
  margin: 0 auto;
  padding: 0
}
</style>


