<template>
<div class="ed-container init">

  <div class="ed-item">
    <h1 class="ed-item txt-center sep-10">
      <strong>CARPETA ACADÉMICA</strong>
    </h1>
  </div>

  <el-table :data="info" max-height="350px" border stripe>
    <el-table-column width="40px" label="#" header-align="center" align="center" prop="number" ></el-table-column>
    <el-table-column label="Título" header-align="center" prop="title" ></el-table-column>
    <el-table-column label="*" align="center" header-align="center" prop="title" >
      <template slot-scope="props">
        <el-button size="mini" type="primary" @click="props.row.fun()">Imprimir</el-button>
      </template>
    </el-table-column>
  </el-table>
  
</div>
</template>

<script>
/**
 * MIXING
 */
import MixinInit from '../../mixing/mixing_init.js'

import Materiales from '../../models/materiales.js'

export default {
  name: 'imprimir-carpeta',

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
    })
  },

  mounted() {
    this.init()
  },

  // props: ['idFilial','filial', 'tipo', 'moda'],

  components: {
    
  },

  data() {
    return {
      instrumentos: null,
      materiales  : null,
      planes      : null,
      separadores : {
        url: '',
        name: ''
      },
      info: [
        {
          number: 1,
          title : 'Datos de la Asignatura',
          fun   : this.printDataAsignatura

        },
        {
          number: 2,
          title : 'Sílabo',
          fun   : this.printSilabo

        },
        {
          number: 3,
          title : 'Sesiones de Aprendizaje',
          fun   : this.printSesiones

        },
        {
          number: 4,
          title : 'Planes de Evaluación',
          fun   : this.printInstrumentos

        },
        {
          number: 5,
          title : 'Materiales de Asignatura',
          fun   : this.printMateriales

        },
        {
          number: 6,
          title : 'Separadores',
          fun   : this.printSeparadores
        }
      ]
    }
  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.getInstrumentos()
      await this.getMateriales()
      await this.getPlanesClase()
      await this.getSeparadores()
      loading.close()
    },


    async getInstrumentos () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        let idAsignatura = this.$route.params.idAsignatura
        const res = await this.axios.get(`${this.URL_}v2/instrumentos/by_asignatura/${id_periodo}/${id_semestre}/${idAsignatura}`)
        
        if(res.status === 200) {
          this.instrumentos = res.data.data
        }

      } catch (err) {
        this.instrumentos = null
        this.$hlp.errors(err)
      }
    },

    async getMateriales () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        let idAsignatura = this.$route.params.idAsignatura
        const res = await this.axios.get(`${this.URL_}v2/materiales_asignatura/by_asignatura/${id_periodo}/${id_semestre}/${idAsignatura}`)
        
        if(res.status === 200) {
          this.materiales = res.data.data
        }

      } catch (err) {
        this.materiales = null
        this.$hlp.errors(err)
      }
    },

    async getPlanesClase () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        let idAsignatura = this.$route.params.idAsignatura
        const res = await this.axios.get(`${this.URL_}v2/planes_curso/by_asignatura/${id_periodo}/${id_semestre}/${idAsignatura}`)
        
        if(res.status === 200) {
          this.planes = res.data.data
        }

      } catch (err) {
        this.planes = null
        this.$hlp.errors(err)
      }
    },

    async getSeparadores () {
      try {
        const res = await this.axios.get(`${this.URL_}v2/files/get-separador`)

        let { status, data } = res

        if (status === 200) {
          this.separadores.name = data.name
          this.separadores.url  = data.url
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    printSesiones () {
      this.planes.forEach(el => {
        let a = document.createElement('a')
        a.href = `${this.URLIMAGE}uploads/planes_clases/${el.img}`
        a.download = el.title + '.pdf'
        a.click()
      })
    },

    printInstrumentos () {
      this.instrumentos.forEach(el => {
        let a = document.createElement('a')
        a.href = `${this.URLIMAGE}uploads/instrumentos/${el.img}`
        a.download = el.title + '.pdf'
        a.click()
      })
    },

    printMateriales() {
      this.materiales.forEach(el => {
        let a = document.createElement('a')
        a.href = `${this.URLIMAGE}uploads/materiales/${el.img}`
        a.download = el.title + '.pdf'
        a.click()
      })
    },

    printSilabo () {
      let { idAsignatura, idFilial, filial, tipo, moda } = this.$route.params
      let a = document.createElement('a')
      a.href = `${this.URLPDF}api/src/reportes/silabo/silabo_pdf.php?ae_bcd=${this.token}&id_usuario=${this.identity.id_usuario}&id_periodo=${this.periodo.id_periodo}&id_semestre=${this.periodo.id_semestre}&id_filial=${idFilial}&id_modalidad=1&dni=${this.identity.dni}&id_asignatura=${idAsignatura}&tipo=${tipo}&filial=${filial}&id_asig=${idAsignatura}&moda=${moda}`
      a.target = '_blank'
      a.click()
    },

    printDataAsignatura () {
      let { idAsignatura, idEscuela, idFacultad } = this.$route.params
      let a = document.createElement('a')
      a.href = `${this.URLPDF}api/src/reportes/CarpetaAcademica/DatoAsignatura.php?ae_bcd=${this.token}&idFacultad=${idFacultad}&idEscuela=${idEscuela}&idDocente=${this.identity.dni}&idUsuario=${this.identity.id_usuario}&idAsignatura=${idAsignatura}`
      a.target = '_blank'
      a.click()
    },

    printSeparadores () {
      this.$hlp.downloadFile(this.separadores.url, this.separadores.name)
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
