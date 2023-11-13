<template>
<div class="ed-container init">
  <div class="ed-item txt-center">
    <h2>
      <strong>CURSOS ASIGNADOS</strong>
    </h2>
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="arrCursos" height="500" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando cursos a cargo...">
      <el-table-column fixed type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="asignatura" label="Asignatura" min-width="300" align="left" header-align="center"></el-table-column>
      <el-table-column prop="plan_estudio" label="Plan" min-width="80" align="left" header-align="center"></el-table-column>
      <el-table-column prop="escuela" label="Escuela" min-width="300" align="left" header-align="center"></el-table-column>
      <el-table-column prop="facultad" label="Facultad" min-width="250" align="left" header-align="center"></el-table-column>
      <el-table-column prop="filial" label="Filial" min-width="120" align="left" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="120" align="center" header-align="center">
        <template slot-scope="reg">
          <el-button @click="goRegisterMateriales(reg.row)" size="mini" type="primary">Ver Carpeta</el-button>
        </template>
      </el-table-column>

      <template slot="empty">
        <strong>No cuenta con cursos asignados</strong>
      </template>
    </el-table>
  </div>

  <div class="ed-item">
    <!-- <el-button v-if="identity.id_usuario == 47" @click="clickFile" size="mini" type="danger" plain>Subir Manual</el-button> -->
    <el-button v-if="identity.id_usuario == 47" @click="clickFile" size="mini" type="primary">
      Subir Manual <i class="el-icon-upload el-icon-right"></i>
    </el-button>
    <input style="display: none" @change="storeFile($event)" type="file" name="separador" id="separador">
  </div>
</div>
</template>

<script>
// Mixing
import mixingInit from '../../mixing/mixing_init.js'

export default {
  mixins: [
    mixingInit
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
      arrCursos: null,
    }
  },

  computed: {

  },

  methods: {
    async init () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getCursosAsignados()
      loading.close()
    },

    async getCursosAsignados() {
      let { id_periodo, id_semestre } = this.periodo
      try {
        const res = await this.axios.get(`${this.URL_}v2/planes_curso/asignaturas_docente/${id_periodo}/${id_semestre}`)

        if (res.status !== 200) return
        
        this.arrCursos = res.data.data
      } catch (err) {
        this.arrCursos = null
        this.$hlp.errors(err)
      }
    },

    goRegisterMateriales ({ id_curso, id_filial, filial, ctipocurso, id_modalidad, id_facultad, id_escuela }) {
      this.$router.push({
        name: 'ImprimirCarpeta',
        params: {
          idAsignatura: id_curso,
          idFilial: id_filial,
          filial: filial,
          tipo: ctipocurso,
          moda: id_modalidad,
          idEscuela: id_escuela,
          idFacultad: id_facultad
        }
      })
    },

    async storeFile (event) {

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const m = document.getElementById('separador')

      const file = event.target.files[0]

      if (file == undefined) {
        m.value = ''
        return
      }

      const imageType = /(.pdf)$/i

      const fileSize = file.size

      if (!file.type.match(imageType)) {
        this.swAlert(`Solo se admiten archivos de tipo PDF`,'warning')
        m.value = ''
        loading.close()
        return
      }


      var data = new FormData();
      console.log(file);
      
      data.append('separador', file);

      try {
        const res = await this.axios.post(`${this.URL_}v2/files/store-separador`, data)
        
        if(res.status == 200) {
          this.swAlert(`Separadores cargado exitosamente`, 'success')
        }
      } catch (err) {
        m.value = ''
        loading.close()
        this.$hlp.errors(err)
      }
      loading.close()
      
      var reader = new FileReader();
      m.value = ''

      reader.readAsDataURL(file);
    },

    clickFile () {
      const m = document.getElementById('separador')
      m.click()
    }

  }
}
</script>

<style lang="scss">

</style>
