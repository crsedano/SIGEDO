<template>
<div class="ed-container init">
  <h1 class="ed-item  gr-center">
    <strong>SEGUIMIENTO DE CURSOS ASIGNADOS</strong>
  </h1>

  <div class="ed-item sep-10">
    <input type="file" name="image" @change="getImage">
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="cursosAsignados" height="500" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando cursos a cargo...">
      <el-table-column fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="asignatura" label="Asignatura" min-width="300" align="left" header-align="center"></el-table-column>
      <el-table-column prop="escuela" label="Escuela" min-width="300" align="left" header-align="center"></el-table-column>
      <el-table-column prop="filial" label="Filial" min-width="150" align="left" header-align="center"></el-table-column>
      <el-table-column prop="modalidad" label="Modalidad" min-width="150" align="left" header-align="center"></el-table-column>
      <el-table-column prop="seccion" label="Sección" min-width="80" align="center" header-align="center"></el-table-column>

      <el-table-column label="Tipo Hora" min-width="100" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip class="item" effect="dark" :content="getTipoCurso(reg.row).full" placement="left-start">
            <span>{{ getTipoCurso(reg.row).hora }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Avance Silabo" min-width="120" align="center" header-align="center">
        <template slot-scope="reg">
          <el-button @click="goCronograma(reg.row)" size="mini" type="danger">Registrar</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Entrega Silabo" min-width="120" align="center" header-align="center">
        <template slot-scope="reg">
          <el-button v-if="!reg.row.entrega_silabo" @click="updateFile(reg.row.id_asigdoc)" size="mini" type="danger">Marcar</el-button>
          <el-tag @click.native="downloadFile(reg.row.entrega_silabo)" v-else type="info" plain>Entregado</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Exámenes" min-width="120" align="center" header-align="center">
        <template slot-scope="reg">
          <el-button @click="registerExamen(reg.row)" size="mini" type="danger">Registrar</el-button>
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
/**
 * MIXING
 */
import MixinInit from '../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }
      if(!vm.permisos) {
        next('/')
        return
      } 
      let s = vm.permisos.find(p => p.urlv.substr(2, p.urlv.length) == to.path)
      if(!s) {
        next('/')
      }
    })
  },

  mounted() {
    this.init()
  },

  components: {

  },

  data() {
    return {
      cursosAsignados: null,
      imagen: null
    }
  },

  watch: {
    
  },

  computed: {

  },

  filters: {

  },

  methods: {
    getImage(event){
      this.imagen = event.target.files[0]
    },

    async updateFile(idAsigdoc){
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const imageType = /(.pdf)$/i

      const fileSize = this.imagen.size

      if (!this.imagen.type.match(imageType)) {
        this.$msgbox({
          title: '¡Alerta!',
          message: 'Solo se admiten archivos PDF',
          confirmButtonText: 'OK',
        })
        loading.close()
        return
      }

      if (fileSize > 5000000) {
        this.$msgbox({
          title: '¡Alerta!',
          message: 'Archivo demasiado grande: máx 5MB',
          confirmButtonText: 'OK',
        })
        loading.close()
        return
      }

      let data = new  FormData()
      data.append('documento', this.imagen)
      // data.append('_method', 'PUT')
      
      try {
        const res = await this.axios.post(`${this.URL_}v2/avance_silabo/image/${idAsigdoc}`, data)
        
        let { status } = res

        if (status === 200) {
          await this.getCursosAsignados()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async init() {
      const loading = this.$loading({
        lock      : true,
        text      : 'Cargando...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getCursosAsignados()
      loading.close()
    },

    async getCursosAsignados() {
      try {
        let { id_periodo, id_semestre } = this.periodo
        const res = await this.axios.get(`${this.URL_}v2/avance_silabo/cursos_cargo/${id_periodo}/${id_semestre}`)

        if (res.status !== 200) return
        this.cursosAsignados = res.data.cursos
        
      } catch (err) {
        this.cursosAsignados = null
        this.$hlp.errors(err)
      }
    },

    goCronograma (reg) {
      let { tipo_asignatura, curso, porcentaje, id_asigdoc } = reg

      if(tipo_asignatura == 'E' || tipo_asignatura == 'G') {
        this.$router.push({
          name  : 'CronogramaAvanceSilabo',
          params: {
            idCurso  : curso,
            idAsigdoc: id_asigdoc
          }
        })
      } else {
        this.$router.push({
          name  : 'ProgramaAvanceSilabo',
          params: {
            idCurso  : curso,
            idAsigdoc: id_asigdoc
          }
        })
      }
    },

    registerExamen (reg) {
      let { curso, porcentaje, id_asigdoc, id_modalidad } = reg
      this.$router.push({
          name  : 'EntregaExamen',
          params: {
            idCurso    : curso,
            idAsigdoc  : id_asigdoc,
            idModalidad: id_modalidad
          }
        })
    },

    getTipoCurso ({ tipo_hora }) {
      switch (tipo_hora) {
        case 'ht':
          return {
            hora: 'P. Teoría',
            full: 'Presencial Teoría'
          }
          break;
        case 'hp':
          return {
            hora: 'P. Práctica',
            full: 'Presencial Práctica'
          }
          break;
        case 'sphp':
          return {
            hora: 'SP. Práctica',
            full: 'Semi Presencial Presencial Práctica'
          }
          break;
        case 'spht':
          return {
            hora: 'SP. Teoría',
            full: 'Semi Presencial Presencial Teoría'
          }
          break;
        case 'svhp':
          return {
            hora: 'SV. Práctica',
            full: 'Semi Presencial Virtual Práctica'
          }
          break;
        case 'svht':
          return {
            hora: 'SV. Teoría',
            full: 'Semi Presencial Virtual Teoría'
          }
          break;
      }
    },

    async marcarSilaboEntregado ({ id_asigdoc }) {
      try {
        const res = await this.axios.post(`${this.URL_}v2/avance_silabo/entrega_silabo/${id_asigdoc}`)

        let { status, data } = res

        if (status === 200) {
          this.init()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    downloadFile (url) {
      const link = document.createElement('a')
      link.href = `${this.URLPDFLARAVEL}${url}`
      link.download = url
      link.target = '_blank'
      link.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.file-hide {
  visibility: hidden;
  width: 0;
  height: 0;
  position: absolute;
}
</style>
