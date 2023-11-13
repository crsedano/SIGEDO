<template>
  <div class="ed-container init">
    <el-form label-position="top" size="mini" class="ed-item ed-container" ref="form" :model="gx_experiencia_doc" label-width="120px">
      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="ASIGNATURA"
        prop="cnombreasig"
        :rules="[
          { required: true, message: 'La asignatura es obligatoria', trigger: 'blur'},
          { max: 255, message: 'Maximo 255 caracteres', trigger: ['change', 'blur'] }
        ]">
        <el-input v-model="gx_experiencia_doc.cnombreasig"></el-input>
      </el-form-item>

      <el-form-item
        v-if="universidades"
        class="ed-item sep-5 l-30 to-center gr-center" 
        label="UNIVERSIDAD"
        prop="id_universidad"
        :rules="[
          { required: true, message: 'El universidad es obligatoria', trigger: 'blur' }
        ]">
        <el-select filterable v-model="gx_experiencia_doc.id_universidad" placeholder="Seleccionar">
          <el-option :label="universidad.cuniversidad" v-for="(universidad, index) in universidades" :key="index" :value="universidad.idreg"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="FACULTAD"
        prop="cfacultad"
        :rules="[
          { required: true, message: 'La facultad es obligatoria', trigger: 'blur' },
          { max: 255, message: 'Maximo 255 caracteres', trigger: ['change', 'blur'] }
        ]">
        <el-input v-model="gx_experiencia_doc.cfacultad"></el-input>
      </el-form-item>

      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="ESCUELA"
        prop="cescuela"
        :rules="[
          { max: 255, message: 'Maximo 255 caracteres', trigger: ['change', 'blur'] } 
        ]"
        >
        <el-input v-model="gx_experiencia_doc.cescuela"></el-input>
      </el-form-item>

      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="FECHA INICIO"
        prop="finicio"
        :rules="[
          { required: true, message: 'La fecha de inicio es obligatoria', trigger: 'blur' }
        ]">
        <el-input type="date" v-model="gx_experiencia_doc.finicio"></el-input>
      </el-form-item>

      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="FECHA FIN"
        prop="ffin"
        :rules="[
          { required: true, message: 'La fecha de fin es obligatoria', trigger: 'blur' }
        ]">
        <el-input type="date" v-model="gx_experiencia_doc.ffin"></el-input>
      </el-form-item>

      <div class="ed-item gr-center sep-15">
        <el-button size="medium" :disabled="!validExp" @click="saveExperiencia" type="primary" plain>Registrar</el-button>
      </div>

    </el-form>

    <div class="ed-item sep-10">
      <el-table
        border
        stripe
        fit
        :data="experienciaDoc"
        height="200"
        highlight-current-row
        :row-class-name="tableRowClassName"
        v-loading="ajaxExperiencia"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando experiencia docente..."
      >
        <el-table-column prop="cnombreasig" label="Asignatura" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cuniversidad" label="Universidad" min-width="200" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cfacultad" label="Facultad" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cescuela" label="Escuela" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column prop="finicio" label="Inicio" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column prop="ffin" label="Fin" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            <i @click="deleteExperiencia(reg.row)" class="fas fa-trash-alt action red"></i>
          </template>
        </el-table-column>
        <el-table-column label="Adjuntar" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <input style="display: none" type="file" @change="saveEsperienciaImg($event, reg.row)" :id="`img-entrada-exp-${reg.row.id_exp_doc}`">
            <el-button @click="clickFile(reg.row)" icon="el-icon-picture" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="Adjunto" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <a v-if="reg.row.img != ''" target="_blank" download="" :href="`${URLIMAGE}uploads/experiencia_docente/${reg.row.img}`">Descargar</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="modalImg"
      :fullscreen="true"
      center>
      <img class="img-modal" :src="imageToShow" alt="">
    </el-dialog>

  </div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'
import GxExperienciaDoc from '../../../models/gx_experiencia_doc.js'

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
          message: 'Seleccione o cree un docente para poder acceder a la experiencias docente',
          duration: 0
        })
        next('/docentes')
      }
    })
  },

  mounted() {
    this.init()
  },

  components: {},

  data() {
    return {
      gx_experiencia_doc: new GxExperienciaDoc(),
      experienciaDoc: [],
      universidades: null,
      ajaxExperiencia: false,

      modalImg: false,
      imageToShow: ''
    }
  },

  watch: {
    'gx_experiencia_doc.cnombreasig': function (n) {
      this.gx_experiencia_doc.cnombreasig = n.toUpperCase()
    },

    'gx_experiencia_doc.cfacultad': function (n) {
      this.gx_experiencia_doc.cfacultad = n.toUpperCase()
    },

    'gx_experiencia_doc.cescuela': function (n) {
      this.gx_experiencia_doc.cescuela = n.toUpperCase()
    },

    'gx_experiencia_doc.id_universidad': function (n) {
      if (this.universidades.filter(c => c.idreg == n).length > 0) {
        this.gx_experiencia_doc.cuniversidad = this.universidades.filter(c => c.idreg == n)[0].cuniversidad
      }
    },
  },

  computed: {
    ...mapState({
      dni: state => state.docente.dni
    }),

    validExp: function () {
      return (
        this.gx_experiencia_doc.cnombreasig != '' &&
        this.gx_experiencia_doc.cnombreasig.length <=255 &&
        this.gx_experiencia_doc.cuniversidad != '' &&
        this.gx_experiencia_doc.cfacultad != '' &&
        this.gx_experiencia_doc.cfacultad.length <=255 &&
        this.gx_experiencia_doc.cescuela.length <=255 &&
        this.gx_experiencia_doc.finicio != '' &&
        this.gx_experiencia_doc.ffin != ''
      )
    },
  },

  methods: {
    init() {
      this.gx_experiencia_doc = new GxExperienciaDoc()
      this.gx_experiencia_doc.id_docente = this.dni
      this.gx_experiencia_doc.ccodusua = this.identity.id_usuario
      this.getUniversidades()
      this.getExperienciaDoc(this.dni)
    },

    async getUniversidades() {
      try {
        const res = await this.axios.get(`${this.URL}js-universidad`, this.autho)
        if(res.status === 200) {
          this.universidades = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.universidades = null
      }
    },

    async getExperienciaDoc(id_docente) {
      this.ajaxExperiencia = true
      try {
        const res = await  this.axios.get(`${this.URL}js-experiencia-doc/${id_docente}`, this.autho)
        if(res.status === 200) {
          this.experienciaDoc = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.experienciaDoc = []
      }
      this.ajaxExperiencia = false
    },

    async saveExperiencia() {
      const loading = this.$loading({
        lock: true,
        text: 'Insertando experiencia...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.post(`${this.URL}js-experiencia-doc`, this.gx_experiencia_doc, this.autho)

        if(res.status === 201) {
          await this.calificarDocente(this.gx_experiencia_doc.id_docente)
          this.init()
        }
      } catch (err) {
        console.dir(err)
        this.swAlert(`Error al insertar experiencia docente, intente nuevamente`, 'error')
      }

      loading.close()
    },

    async deleteExperiencia({id_exp_doc}) {
      const loading = this.$loading({
        lock: true,
        text: 'Eliminando experiencia...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.delete(`${this.URL}js-experiencia-doc-del/${id_exp_doc}`, this.autho)

        if(res.status === 201) {
          await this.calificarDocente(this.gx_experiencia_doc.id_docente)
          this.gx_experiencia_doc = new GxExperienciaDoc()
          this.gx_experiencia_doc.id_docente = this.dni
          this.getExperienciaDoc(this.dni)
        }
      } catch (err) {
        console.dir(err)
      }

      loading.close()
    },

    saveEsperienciaImg: function (event, {
      id_exp_doc
    }) {

      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
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
      if (this.dni) {

        var data = new FormData();
        data.append('img', file);

        this.axios.post(`${this.URL}/imagenes-exp/${id_exp_doc}`, data, this.autho)
          .then(res => {
            if (res.data.success) {
              this.getExperienciaDoc(this.dni)
            } else {
              let message = res.data.message
              this.$notify.error({
                title: 'Precaución',
                message: message
              })
            }
            loading.close()
          })
          .catch(err => {
            loading.close()
            this.$hlp.errors(err)
          })
      }

      var reader = new FileReader();

      reader.readAsDataURL(file);
    },

    clickFile({ id_exp_doc }) {
      const btnFile = document.getElementById(`img-entrada-exp-${id_exp_doc}`)
      btnFile.click()
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
  td, th {
    padding: 5px 0 !important;
    color: #000 !important;
  }
}
.img-modal {
  display: block;
  margin: auto;
}
</style>
