<template>
<div class="ed-container init">
  <div class="ed-item ed-container">
    <div v-if="isEdit" class="ed-item ed-container gr-center">
      <div class="ed-item">
        <img v-if="gx_docente.img && isEdit" :src="`${this.URLIMAGE}uploads/docentes/${gx_docente.img}`" class="imgSalida">
      </div>
      <input style="display: none" @change="saveFoto" id="imgEntrada" type="file">
      <div class="ed-item sep-5">
        <el-button @click="cargarFoto" icon="el-icon-picture" type="primary">Cargar Foto</el-button>
      </div>
    </div>

    <el-form label-position="top" size="mini" class="ed-item ed-container" ref="form" :model="gx_docente" label-width="120px">
      <div class="ed-item ed-container sep-5 l-30 to-center form-group">
        <el-form-item class="ed-item" label="DNI" prop="dni" :rules="[
            { required: true, message: 'El DNI es obligatorio', trigger: 'blur' },
            { min: 8, max: 8, message: 'El DNI debe ser de 8 caracteres', trigger: ['blur', 'change']}
          ]">
          <el-input :disabled="isEdit" @blur="verficarDNI(gx_docente)" v-model="gx_docente.dni"></el-input>
        </el-form-item>
        <el-form-item class="ed-item gr-center" label="Sexo" prop="sexo" :rules="[
            { required: true, message: 'El sexo es obligatorio', trigger: 'blur' }
          ]">
          <el-radio-group v-model="gx_docente.sexo">
            <el-radio label="Masculino"></el-radio>
            <el-radio label="Femenino"></el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="APELLIDO PATERNO" prop="cpaterno" :rules="[
          { required: true, message: 'El apellido paterno es obligatorio', trigger: 'blur' }
        ]">
        <el-input v-model="gx_docente.cpaterno"></el-input>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="APELLIDO MATERNO" prop="cmaterno" :rules="[
          { required: true, message: 'El apellido materno es obligatorio', trigger: 'blur' }
        ]">
        <el-input v-model="gx_docente.cmaterno"></el-input>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="NOMBRE" prop="cnombres" :rules="[
          { required: true, message: 'Los nombres son obligatorios', trigger: 'blur' }
        ]">
        <el-input v-model="gx_docente.cnombres"></el-input>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="FECHA NACIMIENTO" prop="fechanacimiento" :rules="[
          { required: true, message: 'Fecha de nacimiento obligatoria', trigger: 'blur' }
        ]">
        <el-input type="date" v-model="gx_docente.fechanacimiento"></el-input>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="LUGAR NACIMIENTO" prop="id_pais_nac" :rules="[
          { required: true, message: 'Lugar de nacimiento obligatoria', trigger: 'blur' }
        ]">
        <el-select filterable v-model="gx_docente.id_pais_nac" placeholder="Seleccione un país">
          <el-option :label="pais.cpais" v-for="(pais, index) in paisesActivos" :key="index" :value="pais.id_pais"></el-option>
        </el-select>
        <span v-if="entorno && entorno.modal == 'S'" @click="openModalPais" class="hint--top hint--bounce" aria-label="Administrar Países">
          <i class="el-icon-location action pointer"></i>
        </span>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="TELEFONO">
        <el-input v-model="gx_docente.telefono"></el-input>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="CELULAR">
        <el-input v-model="gx_docente.celular"></el-input>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="EMAIL INSTITUCIONAL">
        <el-input v-model="gx_docente.email"></el-input>
      </el-form-item>

      <el-form-item class="ed-item sep-5 m-30 to-center" label="FECHA DE INGRESO COMO DOCENTE UPLA" prop="f_ingreso"
        :rules="[
          { required: true, message: 'Fecha de ingreso a la universidad obligatorio', trigger: 'blur' }
        ]">
        <el-input type="date" v-model="gx_docente.f_ingreso"></el-input>
      </el-form-item>

      <el-form-item class="ed-item gr-center sep-5 m-50 to-center">
        <el-checkbox label="DOCENTE UNIV. A LA ENTRADA EN VIGENCIA DE LA LEY 30220" v-model="ley_30220"></el-checkbox>
        <el-checkbox label="DOCENTE INVESTIGADOR" v-model="investigador" name="type"></el-checkbox>
        <el-checkbox label="DOCENTE REGISTRADO EN DINA" v-model="dina" name="type"></el-checkbox>
        <el-checkbox label="DOCENTE REGISTRADO EN REGINA" v-model="regina" name="type"></el-checkbox>
        <el-checkbox label="CARPETA" v-model="carpeta" name="type"></el-checkbox>
        <el-checkbox label="JEFE DE PRÁCTICA" v-model="is_jp" name="type"></el-checkbox>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="CARGO" prop="id_cargo" :rules="[
          { required: true, message: 'Cargo es obligatorio', trigger: 'blur' }
        ]">
        <el-select filterable v-model="gx_docente.id_cargo" placeholder="Seleccione un cargo">
          <el-option  :label="cargo.nombre" v-for="(cargo, index) in cargosDocente" :key="index" :value="cargo.id_cargo"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="DIDACTICA SUPERIOR">
        <el-select v-model="gx_docente.didactica_superior" placeholder="Seleccione un item">
          <el-option label="Estudio" value="ESTUDIO"></el-option>
          <el-option label="Concluido" value="CONCLUIDO"></el-option>
          <el-option label="Título" value="TITULO"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="ESPECIALIZACIÓN">
        <el-input v-model="gx_docente.especializacion"></el-input>
      </el-form-item>

      <el-form-item class="ed-item sep-5 m-90 to-center" label="OBSERVACIONES">
        <el-input type="textarea" v-model="gx_docente.observaciones"></el-input>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="FACULTAD ADSCRITA" prop="id_facultad_adscrito" :rules="[
          { required: true, message: 'Fecultad adsrita obligatorio', trigger: 'blur' }
        ]">
        <el-select v-model="gx_docente.id_facultad_adscrito" placeholder="Seleccione un facultad">
          <el-option :label="facultad.nombre" v-for="(facultad, index) in arrFacultades" :key="index" :value="facultad.id_facultad"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="CATEGORIA DOCENTE" prop="categoria" :rules="[
          { required: true, message: 'Categoria docente obligatoria', trigger: 'blur' }
        ]">
        <el-select v-model.number="gx_docente.categoria" placeholder="Seleccione una categoria">
          <el-option :label="categoria.ccategoria" v-for="(categoria, index) in categoriaDocente" :key="index" :value="categoria.ccategoria"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="CONDICION DOCENTE" prop="condicion" :rules="[
          { required: true, message: 'Condicion docente obligatorio', trigger: 'blur' }
        ]">
        <el-select v-model.number="gx_docente.condicion" placeholder="Seleccione una condicion">
          <el-option :label="condicion.ccondiciondoc" v-for="(condicion, index) in condicionDocente" :key="index"
            :value="condicion.ccondiciondoc"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="ed-item sep-5 l-30 to-center" label="DEDICACION" prop="dedicacion">
        {{gx_docente.dedicacion == 'DE' ? 'Docente asignado a DEDICACIÓN EXCLUSIVA ': 'Docente NO asignado a DEDICACIÓN EXCLUSIVA'}}
        <el-button @click="gx_docente.dedicacion = ''" v-if="gx_docente.dedicacion == 'DE'" type="danger" size="mini">Quitar Docente de DEDICACIÓN EXCLUSIVA</el-button>
        <el-button @click="gx_docente.dedicacion = 'DE'" v-else type="primary" size="mini">Asignar Docente a DEDICACIÓN EXCLUSIVA</el-button>
      </el-form-item>

      <div class="ed-item sep-5 l-30 gr-center">
      </div>

    </el-form>

    <div class="ed-item gr-center">
      <el-button size="medium" :disabled="!valid" @click="editDocente" v-if="isEdit" type="primary" plain>Editar</el-button>
      <el-button size="medium" :disabled="!valid" @click="saveDocente" v-else type="primary" plain>Registrar</el-button>
      <el-button size="medium" v-if="!dni" @click="reset" type="danger" plain>Limpiar</el-button>
    </div>
  </div>

  <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div v-if="modalPais" class="modal">
      <paises @close="closeModalPais" />
    </div>
  </transition>

  <div v-if="ajaxLoad" class="modal f-row f-center">
    <loader />
  </div>

</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

import GxDocente from '../../../models/gx_docente.js'
import GxUserEscuela from '../../../models/gx_userescuela'
import GxDocenteFacultadH from '../../../models/gx_docente_facultad_h'

/** Componentes */
import paises from './../modals/paises.vue'
import loader from '../../templates/loader.vue'

import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex'

export default {
  mixins: [
    mixingInit
  ],

  mounted() {
    this.init()
  },

  components: {
    paises,
    loader
  },

  data() {
    return {
      gx_docente: new GxDocente(),
      paisesActivos: null,
      isEdit: false,
      modalPais: false,

      ley_30220: false,
      investigador: false,
      dina: false,
      carpeta: false,
      regina: false,

      cargosDocente: null,
      arrFacultades: null,
      categoriaDocente: null,
      condicionDocente: null,

      is_jp: false
    }
  },

  watch: {
    dni(n) {
      if (!n) {
        this.reset()
      }
    },

    'gx_docente.dni': function (n) {
      this.gx_docente.id_docente = n
    },

    'gx_docente.id_pais_nac': function (n) {
      if (this.paisesActivos.find(p => p.id_pais == n)) {
        this.gx_docente.luganacimiento = this.paisesActivos.find(p => p.id_pais == n).cpais
        this.gx_docente.nacionalidad = this.paisesActivos.find(p => p.id_pais == n).nacionalidad
      } else {
        this.gx_docente.luganacimiento = ''
        this.gx_docente.nacionalidad = ''
      }
    },

    'gx_docente.id_cargo': function (n) {
      if (this.cargosDocente.find(c => c.id_cargo == n)) {
        this.gx_docente.cargo = this.cargosDocente.find(c => c.id_cargo == n).nombre
      }
    },

    dina: function (n) {
      this.gx_docente.dina = n ? 1 : 0
    },

    regina: function (n) {
      this.gx_docente.regina = n ? 1 : 0
    },

    investigador: function (n) {
      this.gx_docente.ninvestigador = n ? 1 : 0
    },

    ley_30220: function (n) {
      this.gx_docente.ley_30220 = n ? 1 : 0
    },

    carpeta: function (n) {
      this.gx_docente.carpeta = n ? 1 : 0
    },

    is_jp (n) {
      this.gx_docente.is_jp = n ? 1 : 0
    },
  },

  computed: {
    ...mapState({
      dni: state => state.docente.dni
    }),

    label_dni() {
      if (this.gx_docente.dni.length != 8 && this.gx_docente.dni.length > 0) {
        return 'hint--always'
      } else {
        return ''
      }
    },

    valid() {
      return (
        this.gx_docente.dni.length == 8 &&
        this.gx_docente.sexo != '' &&
        this.gx_docente.cpaterno != '' &&
        this.gx_docente.cmaterno != '' &&
        this.gx_docente.cnombres != '' &&
        this.gx_docente.fechanacimiento != '' &&
        this.gx_docente.id_pais_nac != '' &&
        this.gx_docente.id_cargo != '' &&
        this.gx_docente.categoria != '' &&
        this.gx_docente.id_facultad_adscrito != '' &&
        this.gx_docente.condicion != ''
      )
    },

  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando modulo...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      await this.getPaises()
      await this.getCargosDocentes()
      await this.getFacultadUser()
      await this.getCategoriaDocente()
      await this.getCondicionDocente()

      if (this.dni) {
        this.verficarDNI({
          dni: this.dni
        })
      }

      loading.close()
    },

    ...mapMutations({
      updateDni: 'docente/DNI_UPDATE'
    }),

    openModalPais() {
      this.modalPais = true
    },

    closeModalPais() {
      this.modalPais = false
    },

    async saveDocente() {
      const loading = this.$loading({
        lock: true,
        text: 'Creando docente...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.gx_docente.id_usuario_insert = this.identity.id_usuario
      this.gx_docente.nombre = `${this.gx_docente.cpaterno} ${this.gx_docente.cmaterno} ${this.gx_docente.cnombres}`

      this.gx_docente.cpaterno = this.toNomProp(this.gx_docente.cpaterno)
      this.gx_docente.cmaterno = this.toNomProp(this.gx_docente.cmaterno)
      this.gx_docente.cnombres = this.toNomProp(this.gx_docente.cnombres)
      this.gx_docente.nombre = this.toNomProp(this.gx_docente.nombre)
      this.gx_docente.observaciones = this.toNomProp(this.gx_docente.observaciones)

      try {
        const res = await this.axios.post(`${this.URL}js-docentes`, this.gx_docente, this.autho)

        if (res.status === 201) {
          this.saveHistorial()
          this.verficarDNI(this.gx_docente)
          await this.calificarDocente(this.gx_docente.dni)
        }
      } catch (err) {
        console.dir(err)
        this.$hlp.errors(err)
      }

      loading.close()
    },

    async verficarDNI({
      dni
    }) {
      if (dni == '88888888') {
        this.swAlert(`El dni 88888888 esta reservado para la PLAZA DESIERTA y no puede ser usado`, 'info')
        this.gx_docente.dni = ''
        return
      }

      if (dni.length != 8 || dni == '88888888') return

      try {
        const res = await this.axios.get(`${this.URL}js-docente-verificar/${dni}`, this.autho)

        if (res.status === 200) {
          const reg = res.data.data.reg

          if (reg > 0) {
            this.updateDni(dni)
            this.getDatosDocente(dni)
          }
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    /** Obtiene datos del docente segun su id */
    async getDatosDocente(id_docente) {
      const loading = this.$loading({
        lock: true,
        text: 'Obteniendo datos docente...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL}js-docente/${id_docente}`, this.autho)

        if (res.status === 200) {
          this.gx_docente = res.data.data
          this.dina = this.gx_docente.dina == 1
          this.regina = this.gx_docente.regina == 1
          this.investigador = this.gx_docente.ninvestigador == 1
          this.ley_30220 = this.gx_docente.ley_30220 == 1
          this.carpeta = this.gx_docente.carpeta == 1
          this.is_jp = this.gx_docente.is_jp == 1
          this.idFacultadAdscrito = this.gx_docente.id_facultad_adscrito

          this.isEdit = true
        }
      } catch (err) {
        this.gx_docente = new GxDocente()
        this.$hlp.errors(err)
      }

      loading.close()
    },

    /**
     * Obtiene todos los paises
     */
    async getPaises() {
      try {
        const res = await this.axios.get(`${this.URL}js-pais`, this.autho)

        if (res.status === 200) {
          this.paises = res.data.data
          this.filterPaisesActivos(this.paises)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    /** Obtiene los cargos docente */
    async getCargosDocentes() {
      try {
        const res = await this.axios.get(`${this.URL}js-cargo`, this.autho)

        if (res.status === 200) {
          this.cargosDocente = res.data.data
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    /** Obtiene las facultades accesibles al usuario */
    async getFacultadUser() {
      const gxUserEscuela = new GxUserEscuela(this.URL)
      gxUserEscuela.id_usuario = this.identity.id_usuario

      const res = await gxUserEscuela.getFacultadByUser(this.autho)

      if (res.success) {
        this.arrFacultades = res.data
      } else {
        this.arrFacultades = null
      }

    },

    /** Obtiene las categorias docente */
    async getCategoriaDocente() {
      try {
        const res = await this.axios.get(`${this.URL}js-categoria-docente`, this.autho)

        if (res.status === 200) {
          this.categoriaDocente = res.data.data
        }
      } catch (err) {
        this.categoriaDocente = null
        this.$hlp.errors(err)
      }
    },

    /** Obtiene las condiciones docente */
    async getCondicionDocente() {
      try {
        const res = await this.axios.get(`${this.URL}js-condicion-docente`, this.autho)

        if (res.status === 200) {
          this.condicionDocente = res.data.data
        }
      } catch (err) {
        this.condicionDocente = null
        this.$hlp.errors(err)
      }
    },

    /**
     * Filtra solo los paises activos
     */
    filterPaisesActivos(arrPaises) {
      this.paisesActivos = arrPaises.filter(p => p.cactivo == 1)
    },

    saveFoto: function (event) {
      const file = event.target.files[0]

      if (file == undefined) {
        return
      }

      const imageType = /(.jpg|.jpeg|.png)$/i

      const fileSize = file.size

      if (!file.type.match(imageType)) {
        // $('#imgSalida').attr('src', '')
        document.querySelector('#imgEntrada').value = ''
        this.swAlert(`Archivos válidos: .jpg; .jpeg; .png'`, 'warning')
        return
      }
      if (fileSize > 2000000) {
        // $('#imgSalida').attr('src', '')
        document.querySelector('#imgEntrada').value = ''
        this.swAlert(`Archivo demasiado grande: máx 0.5MB`)
        return
      }

      if (this.isEdit) {
        var data = new FormData();
        data.append('img', file);

        this.ajaxLoad = true
        this.axios.post(`${this.URL}/imagenes/${this.gx_docente.id_docente}`, data, this.autho)
          .then(res => {
            if (res.data.success) {
              // $('#imgSalida').attr('src', '')
              document.querySelector('#imgEntrada').value = ''
              this.verficarDNI(this.gx_docente)
              this.ajaxLoad = false
            }
          })
          .catch(err => {
            console.dir(err)
          })
      }

      var reader = new FileReader();

      reader.onload = ev => {
        const result = ev.target.result
        // $('#imgSalida').attr("src", result);
      }

      reader.readAsDataURL(file);
    },

    /**
     * Almacena el historial del 
     * las fatcutlades adscritas de un docente
     */
    async saveHistorial() {
      const gxDocenteFacultadH = new GxDocenteFacultadH(this.URL)

      gxDocenteFacultadH.id_docente = this.gx_docente.id_docente
      gxDocenteFacultadH.id_facultad = this.gx_docente.id_facultad_adscrito
      gxDocenteFacultadH.id_usuario = this.identity.id_usuario

      const res = await gxDocenteFacultadH.insert(this.autho)
    },

    async editDocente() {
      const loading = this.$loading({
        lock: true,
        text: 'Editando docente...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.gx_docente.nombre = `${this.gx_docente.cpaterno} ${this.gx_docente.cmaterno} ${this.gx_docente.cnombres}`
      this.gx_docente.id_usuario_update = this.identity.id_usuario

      this.gx_docente.cpaterno = this.toNomProp(this.gx_docente.cpaterno)
      this.gx_docente.cmaterno = this.toNomProp(this.gx_docente.cmaterno)
      this.gx_docente.cnombres = this.toNomProp(this.gx_docente.cnombres)
      this.gx_docente.nombre = this.toNomProp(this.gx_docente.nombre)
      this.gx_docente.observaciones = this.toNomProp(this.gx_docente.observaciones)

      try {
        const res = await this.axios.post(`${this.URL}js-docentes-upd/${this.gx_docente.id_docente}`, this.gx_docente, this.autho)

        if (res.status === 201) {
          this.idFacultadAdscrito != this.gx_docente.id_facultad_adscrito ? this.saveHistorial() : ''
          this.verficarDNI(this.gx_docente)
          await this.calificarDocente(this.gx_docente.id_docente)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }

      loading.close()
    },

    reset() {
      this.gx_docente = new GxDocente()
      this.dina = false
      this.regina = false
      this.investigador = false
      this.ley_30220 = false
      this.carpeta = false
      this.is_jp = false
      this.isEdit = false
    },

    cargarFoto() {
      const inputImg = document.getElementById('imgEntrada')

      if (inputImg) {
        inputImg.click()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.imgSalida {
  max-width: 170px;
  border-radius: 50%;
}
</style>

