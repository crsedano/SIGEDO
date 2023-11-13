<template>
  <div class="ed-container init">
    <el-form label-position="top" size="mini" class="ed-item ed-container" ref="form" :model="gx_experiencia_laboral" label-width="120px">
      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="CENTRO LABORAL"
        prop="crazonsocial"
        :rules="[
          { required: true, message: 'El centro laboral es obligatorio', trigger: 'blur' },
          { max: 255, message: 'Maximo 255 caracteres', trigger: ['blur', 'change'] }
        ]">
        <el-input v-model="gx_experiencia_laboral.crazonsocial"></el-input>
      </el-form-item>
      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="RUC"
        prop="cruccentro"
        :rules="[
          { min: 11, max: 11, message: 'El RUC debe ser de 11 caracteres', trigger: ['blur', 'change']}
        ]">
        <el-input v-model="gx_experiencia_laboral.cruccentro"></el-input>
      </el-form-item>
      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="CARGO"
        prop="ccargo"
        :rules="[
          { required: true, message: 'El cargo es obligatorio', trigger: 'blur' },
          { max: 255, message: 'Maximo 255 caracteres', trigger: ['blur', 'change'] }
        ]">
        <el-input v-model="gx_experiencia_laboral.ccargo"></el-input>
      </el-form-item>
      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="FECHA INICIO"
        prop="finicio"
        :rules="[
          { required: true, message: 'La fecha de inicio es obligatorio', trigger: 'blur' }
        ]">
        <el-input type="date" v-model="gx_experiencia_laboral.finicio"></el-input>
      </el-form-item>
      <el-form-item 
        class="ed-item sep-5 l-30 to-center" 
        label="FECHA FIN"
        prop="ffin"
        :rules="[
          { required: true, message: 'La fecha de fin es obligatorio', trigger: 'blur' }
        ]">
        <el-input type="date" v-model="gx_experiencia_laboral.ffin"></el-input>
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
        :data="experienciaLaboral"
        height="200"
        highlight-current-row
        :row-class-name="tableRowClassName"
        v-loading="ajaxExperiencia"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando experiencia laboral..."
      >
        <el-table-column prop="crazonsocial" label="Centro Laboral" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cruccentro" label="RUC" min-width="200" align="left" header-align="center"></el-table-column>
        <el-table-column prop="ccargo" label="Cargo" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column prop="finicio" label="Inicio" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column prop="ffin" label="Fin" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            <i @click="deleteExperiencia(reg.row)" class="fas fa-trash-alt action red"></i>
          </template>
        </el-table-column>
        <el-table-column label="Adjuntar" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <input style="display: none" type="file" @change="saveEsperienciaImg($event, reg.row)" :id="`img-entrada-exp-${reg.row.id_exp_lab}`">
            <el-button @click="clickFile(reg.row)" icon="el-icon-picture" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="Adjunto" min-width="80" align="center" header-align="center">
          <template slot-scope="reg">
            <a v-if="reg.row.img != ''" target="_blank" download="" :href="`${URLIMAGE}uploads/experiencia_laboral/${reg.row.img}`">Descargar</a>
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
import GxExperienciaLaboral from '../../../models/gx_experiencia_laboral.js'

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
          message: 'Seleccione o cree un docente para poder acceder a la experiencia profesional',
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
      gx_experiencia_laboral: new GxExperienciaLaboral(),
      experienciaLaboral: [],
      ajaxExperiencia: false,


      modalImg: false,
      imageToShow: ''
    }
  },

  watch: {
    'gx_experiencia_laboral.crazonsocial': function (n) {
      this.gx_experiencia_laboral.crazonsocial = n.toUpperCase()
    },

    'gx_experiencia_laboral.ccargo': function (n) {
      this.gx_experiencia_laboral.ccargo = n.toUpperCase()
    },
  },

  computed: {
    ...mapState({
      dni: state => state.docente.dni
    }),

    validExp: function () {
      return (
        this.gx_experiencia_laboral.crazonsocial != '' &&
        this.gx_experiencia_laboral.ccargo != '' &&
        this.gx_experiencia_laboral.crazonsocial.length <=255 &&
        this.gx_experiencia_laboral.ccargo.length <=255 &&
        this.gx_experiencia_laboral.finicio != '' &&
        this.gx_experiencia_laboral.ffin != ''
      )
    },
  },

  methods: {
    init() {
      this.gx_experiencia_laboral = new GxExperienciaLaboral()
      this.gx_experiencia_laboral.id_docente = this.dni
      this.gx_experiencia_laboral.ccodusua = this.identity.id_usuario
      this.getExperienciaDoc(this.dni)
    },

    async getExperienciaDoc(id_docente) {
      this.ajaxExperiencia = true

      try {
        const res = await this.axios.get(`${this.URL}js-experiencia-laboral/${id_docente}`, this.autho)

        if(res.status === 200) {
          this.experienciaLaboral = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.experienciaLaboral = []
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
        const res = await this.axios.post(`${this.URL}js-experiencia-laboral`, this.gx_experiencia_laboral, this.autho)

        if(res.status === 201) {
          await this.calificarDocente(this.gx_experiencia_laboral.id_docente)
          this.init()
        }
      } catch (err) {
        console.dir(err)
        this.swAlert(`Ha ocurrido un error al registrar la experiencia, intente nuevamente`, 'error')
      }

      loading.close()
    },

    async deleteExperiencia({
      id_exp_lab
    }) {
      const loading = this.$loading({
        lock: true,
        text: 'Eliminando experiencia...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.delete(`${this.URL}js-experiencia-laboral-del/${id_exp_lab}`, this.autho)

        if(res.status === 201) {
          await this.calificarDocente(this.gx_experiencia_laboral.id_docente)
          this.getExperienciaDoc(this.dni)
        }
      } catch (err) {
        console.dir(err)
      }

      loading.close()
    },

    saveEsperienciaImg: function (event, {
      id_exp_lab
    }) {

      const loading = this.$loading({
        lock: true,
        text: 'Cargando imagen...',
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

        this.axios.post(`${this.URL}/imagenes-laboral/${id_exp_lab}`, data, this.autho)
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

    clickFile({
      id_exp_lab
    }) {
      const btnFile = document.getElementById(`img-entrada-exp-${id_exp_lab}`)
      btnFile.click()
    }
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
.popperDate{
  width: 340px;
}
</style>
