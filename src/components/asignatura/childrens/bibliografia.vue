<template>
<div class="ed-item sep-20 ed-container group">
  <div class="ed-item">
    <h2 v-if="curso_.tipo_asignatura == 'G'" style="text-align: center">
      <strong>X. FUENTES DE INFORMACIÓN O BIBLIOGRAFÍA</strong>
    </h2>
    <h2 v-if="curso_.tipo_asignatura == 'E' || curso_.tipo_asignatura == 'T'" style="text-align: center">
      <strong>XI. FUENTES DE INFORMACIÓN O BIBLIOGRAFÍA</strong>
    </h2>
  </div>
  <div class="ed-item ed-container">
    <div class="ed-item m-50">
      <div class="ed-item m-95 to-center sep-5 ">
        <!-- <label>Autor</label> -->
        <el-input v-model="gx_silabus_bibliografia.autor" placeholder="Autor"></el-input>
        <!-- <input v-model="gx_silabus_bibliografia.autor" type="text" class="form-control"> -->
      </div>
      <div class="ed-item m-95 to-center sep-5 ">
        <el-input v-model="gx_silabus_bibliografia.anio_public" placeholder="Año publicación" type="number"></el-input>
        <!-- <label>Año publicación</label>
                <input v-model="gx_silabus_bibliografia.anio_public" type="number" class="form-control"> -->
      </div>
      <div class="ed-item m-95 to-center sep-5 ">
        <el-input v-model="gx_silabus_bibliografia.titulo" placeholder="Titulo"></el-input>
        <!-- <label>Título</label>
                <input v-model="gx_silabus_bibliografia.titulo" type="text" class="form-control"> -->
      </div>
    </div>
    <div class="ed-item m-50">
      <div class="ed-item m-95 to-center sep-5 ">
        <el-input v-model="gx_silabus_bibliografia.lugar_public" placeholder="Lugar Publicación"></el-input>
        <!-- <label>Lugar de publicación</label>
                  <input v-model="gx_silabus_bibliografia.lugar_public" type="text" class="form-control"> -->
      </div>
      <div class="ed-item m-95 to-center sep-5 ">
        <el-input v-model="gx_silabus_bibliografia.editorial" placeholder="Editorial"></el-input>
        <!-- <label>Editorial</label>
                  <input v-model="gx_silabus_bibliografia.editorial" type="text" class="form-control"> -->
      </div>

    </div>
  </div>
  <div class="ed-item ed-container group">
    <div class="ed-item m-95 to-center sep-5 ">
      <!-- <label>Descripción</label> -->
      <el-input type="textarea" v-model="gx_silabus_bibliografia.descripcion" placeholder="Descripción"></el-input>
      <!-- <textarea v-model="gx_silabus_bibliografia.descripcion" class="form-control" cols="30" rows="3"></textarea> -->
    </div>
  </div>
  <div class="ed-item sep-5 gr-center">
    <el-button plain v-if="!edit" :disabled="!bibliografiaValid" @click="agregarBibliografia" type="primary" size="small">Agregar</el-button>
    <el-button plain v-if="edit" :disabled="!bibliografiaValid" @click="editBiblio" type="primary" size="small">Editar</el-button>
    <el-button plain v-if="edit" @click="cancelEdit" type="danger" size="small">Cancelar</el-button>
    <!-- <button :disabled="!bibliografiaValid" @click="agregarBibliografia" :class="['btn btn-info btn-rounded btn-hov', !bibliografiaValid ? 'hint--right hint--bounce hint--error':'']"
            aria-label="Complete todos los campos">Agregar</button> -->
  </div>

  <div class="ed-item sep-10">
    <el-table border stripe fit :data="silabusBibliografia" height="300" highlight-current-row :row-class-name="tableRowClassName"
      v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="Cargando bibliografia...">
      <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
      <el-table-column prop="autor" label="Autor" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column prop="anio_public" label="Año" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column prop="titulo" label="Título" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column prop="lugar_public" label="Lugar" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column prop="editorial" label="Editorial" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column prop="descripcion" label="Descripción" min-width="120" align="center" header-align="center"></el-table-column>
      <el-table-column label="*" min-width="50" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Eliminar" placement="left">
            <i @click="removerBibliografia(reg.row)" class="fas fa-trash-alt pointer action red"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="*" min-width="50" align="center" header-align="center">
        <template slot-scope="reg">
          <el-tooltip content="Editar" placement="left">
            <i @click="setEdit(reg.row)" class="fas fa-edit pointer action"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- <div v-if="silabusBibliografia && silabusBibliografia.length > 0" class="ed-item sep-2  table-content">
          <table class='table table-bordered table-responsive table-hover table-striped table-own'>
            <thead class='table-head'>
              <tr>
                <th>N°</th>
                <th>Autor</th>
                <th>Año de Publicación</th>
                <th>Título</th>
                <th>Lugar de Publicación</th>
                <th>Editorial</th>
                <th>Descripción</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody class='table-body' v-for="(biblio, index) of silabusBibliografia" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{biblio.autor}}</td>
                <td>{{biblio.anio_public}}</td>
                <td>{{biblio.titulo}}</td>
                <td>{{biblio.lugar_public}}</td>
                <td>{{biblio.editorial}}</td>
                <td>{{biblio.descripcion}}</td>
                <td @click="removerBibliografia(index, biblio.id_silabus_biblio)">
                  <i class="fas fa-trash-alt pointer action red"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div> -->
  <!-- <div v-if="ajaxLoad" class="modal f-row f-center">
          <loader/>
        </div> -->
</div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

/**
 * MODELS
 */
import GxSilabusBibliografia from '../../../models/gx_silabus_bibliografia'

/**
 * Componentes
 */
import loader from '../../templates/loader.vue'

export default {
  mixins: [
    mixingInit
  ],

  props: ['curso_'],

  mounted() {
    this.init()
  },

  components: {
    loader
  },

  data() {
    return {
      gx_silabus_bibliografia: new GxSilabusBibliografia(),
      silabusBibliografia: [],
      edit: false
    }
  },

  methods: {
    init() {
      this.getBibliografia(this.curso_, this.periodo)
    },
    
    async getBibliografia({
      id_curso,
      id_filial,
      id_modalidad
    }, {
      id_periodo,
      id_semestre
    }) {
      this.ajaxLoad = true
      try {
        const res = await this.axios.get(`${this.URL}js-silabus-bibliografia/${id_curso}/2/${id_modalidad}/${id_periodo}/${id_semestre}`, this.autho)
        if (res.status === 200) {
          this.silabusBibliografia = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.silabusBibliografia = null
      }
      this.ajaxLoad = false
    },

    async insertarSilabusBibliografia () {
      this.loadAjax = true
      await this.axios.post(`${this.URL}js-ins-silabus-bibliografia`, this.gx_silabus_bibliografia, this.autho)
        .then(res => {

          if (res.data.success) {
            this.gx_silabus_bibliografia.id_silabus_biblio = res.data.id
            this.gx_silabus_bibliografia = new GxSilabusBibliografia()
            this.getBibliografia(this.curso_, this.periodo)
          }
        })
        .catch(err => {
          console.dir(err)
        })
      this.loadAjax = false
    },

    async agregarBibliografia () {
      this.gx_silabus_bibliografia.id_asignatura = this.curso_.id_curso
      this.gx_silabus_bibliografia.id_usuario_insert = this.identity.id_usuario
      this.gx_silabus_bibliografia.id_docente = this.identity.dni
      this.gx_silabus_bibliografia.id_periodo = this.periodo.id_periodo
      this.gx_silabus_bibliografia.id_semestre = this.periodo.id_semestre
      this.gx_silabus_bibliografia.id_modalidad = this.curso_.id_modalidad
      this.gx_silabus_bibliografia.id_filial = 2

      await this.insertarSilabusBibliografia()
    },

    async removerBibliografia ({
      id_silabus_biblio
    }) {
      this.loadAjax = true
      await this.axios.delete(`${this.URL}js-del-silabus-bibliografia/${id_silabus_biblio}`, this.autho)
        .then(res => {
          if (res.data.success) {
            this.silabusBibliografia = this.silabusBibliografia.filter(inv => this.silabusBibliografia.id_silabus_biblio != id_silabus_biblio)
            this.getBibliografia(this.curso_, this.periodo)
          }
        })
        .catch(err => {
          console.dir(err)
        })
      this.loadAjax = true
    },

    setEdit (bibliografia) {
      this.gx_silabus_bibliografia = bibliografia
      this.edit = true
    },

    async editBiblio () {
      this.loadAjax = true
      try {
        const res = await this.axios.post(`${this.URL}js-edit-silabus-bibliografia`, this.gx_silabus_bibliografia)

        if(res.status !== 201) return

        this.gx_silabus_bibliografia = new GxSilabusBibliografia()
        this.getBibliografia(this.curso_, this.periodo)
        this.edit = false
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.loadAjax = false
    },

    cancelEdit() {
      this.edit = false
      this.gx_silabus_bibliografia = new GxSilabusBibliografia()
    }
  },

  computed: {
    bibliografiaValid: function () {
      return (
        this.gx_silabus_bibliografia.autor != '' &&
        this.gx_silabus_bibliografia.anio_public != '' &&
        this.gx_silabus_bibliografia.titulo != '' &&
        this.gx_silabus_bibliografia.lugar_public != ''
      )
    },
  },

}
</script>

