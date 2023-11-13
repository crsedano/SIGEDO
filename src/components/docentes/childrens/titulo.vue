<template>
<div class="ed-container init">
  <!-- <div class="ed-item m-50 l-40 to-center">
    <el-alert
      v-if="!existC9"
      title="Mayor grado no asignado!"
      center
      :closable="false"
      show-icon
      type="error">
    </el-alert>
  </div> -->

  <div class="ed-item s-95 to-center">
    <el-form class="ed-item ed-container" label-position="top" size="medium" ref="form" :model="gx_grado_academico" label-width="120px">

      <!-- <el-form-item
        class="ed-item sep-5 m-50 l-30 to-center" 
        label="Tipo"
        prop="tipo_grado"
        :rules="[
          { required: true, message: 'El tipo es obligatoria', trigger: 'blur' }
        ]">
        <el-select v-model="tipo_grado">
          <el-option label="Seleccionar" :value="0"></el-option>
          <el-option label="Bachiller" :value="1"></el-option>
          <el-option label="Maestria" :value="2"></el-option>
          <el-option label="Doctorado" :value="3"></el-option>
          <el-option label="Post Doctorado" :value="4"></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item
        class="ed-item sep-5 m-50 l-30 to-center" 
        label="Titulo"
        prop="id_titulo"
        :rules="[
          { required: true, message: 'El titulo es obligatoria', trigger: 'blur' }
        ]">
        <el-select v-model="gx_grado_academico.id_titulo" filterable>
          <el-option v-for="(grado, index) in grados" :key="index" :label="grado.nombre" :value="grado.id_titulo">
          </el-option>
        </el-select>
        <span v-if="entorno && entorno.modal == 'S'" @click="crud_grados = true" class="hint--top hint--bounce" aria-label="Administrar Titulos">
          <i class="fas fa-graduation-cap pointer action"></i>
        </span>
      </el-form-item>

      <el-form-item
        class="ed-item sep-5 m-50 l-30 to-center" 
        label="Universidad"
        prop="id_universidad"
        :rules="[
          { required: true, message: 'La universidad es obligatoria', trigger: 'blur' }
        ]">
        <el-select v-model="gx_grado_academico.id_universidad" filterable>
          <el-option v-for="universidad in universidades" :key="universidad.index" :label="universidad.cuniversidad"
            :value="universidad.idreg">
          </el-option>
        </el-select>
        <span v-if="entorno && entorno.modal == 'S'" @click="abrirModalUni" class="hint--top hint--bounce" aria-label="Administrar Universidades">
          <i class="fas fa-university pointer action"></i>
        </span>
      </el-form-item>

      <el-form-item
        class="ed-item sep-5 m-50 l-30 to-center" 
        label="País"
        prop="id_pais"
        :rules="[
          { required: true, message: 'El pais es obligatorio', trigger: 'blur' }
        ]">
        <el-select v-model="gx_grado_academico.id_pais" filterable>
          <el-option v-for="pais in paisesActivos" :key="pais.index" :label="pais.cpais" :value="pais.id_pais">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        class="ed-item sep-5 m-50 l-30 to-center" 
        label="Fecha Obtención de Título">
        <el-input type="date" v-model="gx_grado_academico.fgrado"></el-input>
      </el-form-item>

      <div class="ed-item gr-center">
        <el-button :disabled="!gradoValido" @click="agregarGrado" type="primary" plain>
          Agregar
        </el-button>
      </div>
    </el-form>

    <div class="ed-item sep-10">
      <el-table
        border
        stripe
        fit
        :data="gradosAcemicos"
        height="350"
        highlight-current-row
        :row-class-name="tableRowClassName"
        v-loading="ajaxGrados"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando grados académicos..."
        @cell-click="setPrincipal"
      >
        <el-table-column prop="ctitulo" label="Titulo" min-width="300" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cuniversidad" label="Universidad" min-width="250" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cpais" label="País" min-width="100" align="left" header-align="center"></el-table-column>
        <el-table-column prop="fgrado" label="Obtencion Título" min-width="200" align="left" header-align="center"></el-table-column>
    
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            <i @click="quitarGrado(reg.row)" class="fas fa-trash-alt action red"></i>
          </template>
        </el-table-column>
        <el-table-column label="Adjuntar" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <div v-if="reg.row.id_grado!='' && reg.row.id_grado!=null">
              <el-button @click="clickFile(reg.row)" icon="el-icon-picture" circle></el-button>
              <input @change="saveFotoGrado($event,reg.row.id_grado)" v-bind:id="'imgEntradaGrado'+reg.row.id_grado" type="file"
                class="file-hide form-control ed-item sep-5 m-30 to-center">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Adjunto" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <a v-if="reg.row.img != ''" target="_blank" download="" :href="`${URLIMAGE}uploads/grados/${reg.row.img}`">Descargar</a>
            <!-- <el-button v-if="reg.row.img != ''" @click="showImage(reg.row)" icon="el-icon-picture-outline" circle></el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <div v-if="crud_grados" class="modal">
    <crud-grados @close="closeCrudGrados" />
  </div>

  <transition enter-active-class="animated rotateIn" leave-active-class="animated flipOutX">
    <div v-if="modalUni" class="modal">
      <universidades @close="cerrarModalUni" />
    </div>
  </transition>
</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'
import GxGradoAcademico from '../../../models/gx_grado_academico.js'
import GxPostDoctorado from '../../../models/gx_postdoctorado.js'

import alertify from 'alertifyjs'

import loader from '../../templates/loader.vue'

import crudGrados from '../modals/crudGrados.vue'
import paises from '../modals/paises.vue'
import universidades from '../modals/universidades.vue'

import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex'


export default {
  mixins: [
    mixingInit
  ],

  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.identity) {
        next('/')
      }

      if (!vm.dni) {
        vm.$notify.warning({
          title: 'PRECAUCIÓN',
          message: 'Seleccione o cree un docente para poder acceder a los grados academicos',
          duration: 0
        })
        next('/docentes')
      }
    })
  },

  mounted() {
    this.init()
  },

  components: {
    loader,
    crudGrados,
    paises,
    universidades,
  },

  data() {
    return {
      gx_grado_academico: new GxGradoAcademico(),
      gradosAcemicos: [],


      paises: null,
      paisesActivos: null,
      modalPais: false,
      modalUni: false,

      /* Grados academicos */
      tipo_grado: 0,
      grados: null,
      universidades: null,

      infoError: '',
      isEditDocente: false,

      loadAjax: false,

      crud_grados: false,

      arrFacultades: null,

      idFacultadAdscrito: '',
      cmaestria: '',
      cdoctorado: '',

      ajaxGrados: false,
      modalImg: false,
      imageToShow: ''
    }
  },

  computed: {
    ...mapState({
      dni: state => state.docente.dni
    }),

    // existC9() {
    //   return this.gradosAcemicos.some(d => d.c9 == 1)
    // },

    gradoValido: function () {
      return (
        this.gx_grado_academico.id_titulo != '' &&
        this.gx_grado_academico.id_universidad != '' &&
        this.gx_grado_academico.id_pais != '' &&
        this.gx_grado_academico.fgrado != ''
      )
    },


  },

  methods: {
    init() {
      this.gx_grado_academico = new GxGradoAcademico()
      this.gx_grado_academico.ccodusua = this.identity.id_usuario
      this.gx_grado_academico.id_docente = this.dni
      this.getTitulos()
      this.getPaises()
      this.getUniversidades()
      this.getGradoAcademico(this.dni)
    },

    async agregarGrado() {
      const loading = this.$loading({
        lock: true,
        text: 'Agregando Grado...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.gx_grado_academico.ctipo = 'Título'
      this.gx_grado_academico.ccodusua = this.identity.id_usuario
      this.gx_grado_academico.id_docente = this.dni
      await this.guardarGradoAcademico(this.gx_grado_academico)
      
      loading.close()
     },

    async guardarGradoAcademico (grado) {
      try {
        grado.ctitulo = this.toNomProp(grado.ctitulo)

        grado.cuniversidad = this.toNomProp(grado.cuniversidad)
        grado.cpais = this.toNomProp(grado.cpais)

        const res = await this.axios.post(`${this.URL}js-grado-academico`, grado, this.autho)

        if(res.status === 201) {
          this.getGradoAcademico(this.dni)
          await this.calificarDocente(grado.id_docente)
          this.gx_grado_academico = new GxGradoAcademico()
          this.gx_grado_academico.ccodusua = this.identity.id_usuario
          this.gx_grado_academico.id_docente = this.dni
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async getGradoAcademico (id_docente) {
      this.ajaxGrados = true
      try {
        const res = await this.axios.get(`${this.URL}js-grado-academico-titulo/${id_docente}`, this.autho)

        if(res.status === 200) {
          this.gradosAcemicos = res.data.data
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.ajaxGrados = false
    },

    async getPaises () {
      try {
        const res = await this.axios.get(`${this.URL}js-pais`, this.autho)

        if(res.status === 200) {
          this.paises = res.data.data
          this.paisesActivos = this.paises.filter(p => p.cactivo == 1)
        }
      } catch (err) {
        this.paises = null
        this.paisesActivos = null
        this.$hlp.errors(err)
      }
    },

    async getTitulos() {
      try {
        const res = await this.axios.get(`${this.URL}js-titulo`, this.autho)

        if (res.status === 200) {
          this.grados = res.data.data
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

 
    async getUniversidades () {
      try {
        const res = await this.axios.get(`${this.URL}js-universidad`, this.autho)

        if(res.status === 200) {
          this.universidades = res.data.data
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    abrirModalUni: function () {
      this.modalUni = true
    },

    cerrarModalUni: function () {
      this.modalUni = false
      this.getUniversidades()
    },

    async quitarGrado (grado) {
      const loading = this.$loading({
        lock: true,
        text: 'Eliminando Grado...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL}js-eliminar-grado-academico`, grado, this.autho)

        if(res.status === 201) {
          this.gradosAcemicos = this.gradosAcemicos.filter(g => g.id_grado != grado.id_grado)
          await this.calificarDocente(grado.id_docente)
          // this.actualizarMaestria()
          // this.actualizarDoctorado()

          if(grado.c9 == 1) {
            grado.ctipo = ''
            grado.ctitulo = ''
            grado.cmension = ''
            grado.cuniversidad = ''
            grado.cpais = ''

            this.updateMayorGradoDocente(grado)
          }
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    clickFile({
      id_grado
    }) {
      const btnFile = document.getElementById(`imgEntradaGrado${id_grado}`)
      btnFile.click()
    },

    async saveFotoGrado (event, id_grado) {
      const loading = this.$loading({
        lock: true,
        text: 'Agregando Archivo...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const file = event.target.files[0]

      if (file == undefined) {
        return
      }

      const imageType = /(.pdf)$/i

      const fileSize = file.size

      if (!file.type.match(imageType)) {
        this.swAlert(`Solo se admiten archivos de tipo PDF`,'warning')
        loading.close()
        return
      }

      if (fileSize > 5000000) {
        this.swAlert(`Archivo demasiado grande: máx 5MB`,'warning')
        loading.close()
        return
      }

      var data = new FormData();
      data.append('img', file);

      try {
        const res = await this.axios.post(`${this.URL}imagenGrado/${id_grado}/T`, data, this.autho)
        
        if(res.data.success) {
          this.getGradoAcademico(this.dni)
        } else {
          let message = res.data.message
          this.$notify.error({
            title: 'Precaución',
            message: message
          })
        }
        loading.close()
      } catch (err) {
        loading.close()
        this.$hlp.errors(err)
      }
      
      var reader = new FileReader();

      reader.readAsDataURL(file);
    },

    closeCrudGrados: function () {
      this.tipo_grado = 0
      this.crud_grados = false
    },

    setPrincipal(row, { property }) {
      if(property == 'c9') {
        let index = this.gradosAcemicos.findIndex(el => el.id_grado == row.id_grado)

        this.seleccionarMayorGrado(index, row)
      }
    },

    seleccionarMayorGrado (index, grado) {
      this.gradosAcemicos = this.gradosAcemicos.map(d => {
        if (this.gradosAcemicos.indexOf(d) == index) {
          d.c9 = 1
        } else {
          d.c9 = 0
        }

        this.updateMayorGrado(grado)
        this.updateMayorGradoDocente(grado)

        return d
      })
    },

    async updateMayorGradoDocente (grado) {
      this.$set(grado, 'mayor_grado', `${grado.ctipo} ${grado.ctitulo}`)
      
      try {
        const res = await this.axios.post(`${this.URL}js-grado-academico-update-mayor`, grado, this.autho)

        if(res.status === 201) {

        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },


    async updateMayorGrado (grado) {
      try {
        const res = await this.axios.post(`${this.URL}js-update-mayor-grado`, grado, this.autho)

        if(res.status === 201) {

        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    }
  },

  watch: {

    'gx_grado_academico.id_universidad': function (n) {
      if (this.universidades.filter(u => u.idreg == n).length > 0) {
        this.gx_grado_academico.cuniversidad = this.universidades.filter(u => u.idreg == n)[0].cuniversidad
      }
    },

    'gx_grado_academico.id_titulo': function (n) {
      if (this.grados.filter(g => g.id_titulo == n).length > 0) {
        this.gx_grado_academico.ctitulo = this.grados.filter(g => g.id_titulo == n)[0].nombre
      }
    },

    'gx_grado_academico.id_pais': function (n) {
      if (this.paises.filter(p => p.id_pais == n).length > 0) {
        this.gx_grado_academico.cpais = this.paises.filter(p => p.id_pais == n)[0].cpais
      }
    },

  }

}
</script>
<style lang="scss">
.el-table {
  .clase {
    cursor: pointer;
    padding: 0;
    font-size: .8em;
  }

  td,
  th {
    padding: 5px 0 !important;
    color: #000 !important;
  }
}

.file-hide {
  visibility: hidden;
  width: 0;
  height: 0;
  position: absolute;
}

.labelImg {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background-color: rgb(82, 81, 160);
  display: inline-block;
  transition: all .5s;
  cursor: pointer;
  padding: 10px 15px !important;
  text-transform: uppercase;
  width: fit-content;
  text-align: center;
}

</style>