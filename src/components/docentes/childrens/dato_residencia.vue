<template>
  <div class="ed-container init">
    <div class="ed-item m-50 l-40 to-center">
      <el-alert
        v-if="!existC9"
        title="¡Dirección principal no asignada!"
        center
        :closable="false"
        show-icon
        type="error">
      </el-alert>
    </div>

    <el-form label-position="top" size="mini" class="ed-item ed-container" ref="form" :model="gx_direcciones" label-width="120px">
      <el-form-item 
        class="ed-item sep-5 l-50 to-center" 
        label="DIRECCION"
        prop="cdireccion"
        :rules="[
          { required: true, message: 'La direccion es obligatoria', trigger: 'blur' },
          { max: 200, message: 'Maximo 200 caracteres', trigger: ['blur', 'change'] }
        ]">
        <el-input v-model="gx_direcciones.cdireccion"></el-input>
      </el-form-item>

      <el-form-item 
        class="ed-item sep-5 l-50 to-center gr-center" 
        label="DEPARTAMENTO"
        prop="cdepa"
        :rules="[
          { required: true, message: 'El departamento es obligatorio', trigger: 'blur' }
        ]">
        <el-select filterable v-model="gx_direcciones.cdepa" placeholder="Seleccione un depatarmento">
          <el-option :label="dep.cdepartamento" v-for="(dep, index) in departamentos" :key="index" :value="dep.cdepartamento"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="provincias"
        class="ed-item sep-5 l-50 to-center gr-center" 
        label="PROVINCIA"
        prop="cprov"
        :rules="[
          { required: true, message: 'La provincia es obligatoria', trigger: 'blur' }
        ]">
        <el-select filterable  v-model="gx_direcciones.cprov" placeholder="Seleccione un depatarmento">
          <el-option :label="prov.cprovincia" v-for="(prov, index) in provincias" :key="index" :value="prov.cprovincia"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="distritos"
        class="ed-item sep-5 l-50 to-center gr-center" 
        label="DISTRITO"
        prop="cdist"
        :rules="[
          { required: true, message: 'La provincia es obligatoria', trigger: 'blur' }
        ]">
        <el-select filterable v-model="gx_direcciones.cdist" placeholder="Seleccione un distrito">
          <el-option :label="dist.cdistrito" v-for="(dist, index) in distritos" :key="index" :value="dist.cdistrito"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="ed-item sep-5 m-90 to-center" label="REFERENCIA">
        <el-input type="textarea" v-model="gx_direcciones.cref"></el-input>
      </el-form-item>

      <div class="ed-item gr-center">
        <el-button size="medium" :disabled="!direccionValida" @click="saveDireccion" type="primary" plain>Registrar</el-button>
      </div>

    </el-form>
      
    <div class="ed-item sep-10">
      <el-table
        border
        stripe
        fit
        :data="direcciones"
        height="200"
        highlight-current-row
        :row-class-name="tableRowClassName"
        v-loading="ajaxDirecciones"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando Datos"
        @cell-click="setPrincipal"
      >
        <el-table-column prop="cdireccion" label="Dirección" min-width="200" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cdepa" label="Departamento" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cprov" label="Provincia" min-width="90" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cdist" label="Distrito" min-width="90" align="left" header-align="center"></el-table-column>
        <el-table-column prop="cref" label="Referencia" min-width="200" align="left" header-align="center"></el-table-column>
        <el-table-column prop="c9" label="Principal" min-width="90" align="center" header-align="center">
          <template slot-scope="reg">
            <i v-if="reg.row.c9 == 1" class="far fa-check-circle action"></i>
          </template>
        </el-table-column>
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            <i @click="deleteDireccion(reg.row)" class="fas fa-trash-alt action red"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
/**
 * MIXING
 */
import mixingInit from '../../../mixing/mixing_init.js'

import GxDirecciones from '../../../models/gx_direcciones.js'

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
          message: 'Seleccione o cree un docente para poder acceder a los datos de residencia',
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

  },

  data() {
    return {
      gx_direcciones: new GxDirecciones(),
      direcciones: [],
      departamentos: null,
      provincias: null,
      distritos: null,
      ajaxDirecciones: false
    }
  },

  watch: {
    async 'gx_direcciones.cdepa'(n) {
      this.distritos = null
      this.gx_direcciones.cdist = ''
      this.gx_direcciones.cprov = ''

      let idDep = ''
      if (this.departamentos.find(dir => dir.cdepartamento == n)) {
        idDep = this.departamentos.find(dir => dir.cdepartamento == n).iddepartamento

        try {
          const res = await this.axios.get(`${this.URL}js-provincia/${idDep}`, this.autho)

          if(res.status === 200) {
            this.provincias = res.data.data
          }
        } catch (err) {
          console.dir(err)
        }
      }

    },

    async 'gx_direcciones.cprov'(n) {
      if (n != null && n != '') {
        let idProv = ''
        if (this.provincias.find(prov => prov.cprovincia == n)) {
          idProv = this.provincias.find(prov => prov.cprovincia == n).idprovincia

          try {
            const res = await this.axios.get(`${this.URL}js-distrito/${idProv}`, this.autho)

            if(res.status === 200) {
              this.distritos = res.data.data
            }
          } catch (err) {
            console.dir(err)
          }
        }

      }
    },
  },

  computed: {
    ...mapState({
      dni: state => state.docente.dni
    }),

    existC9() {
      return this.direcciones.some(d => d.c9 == 1)
    },

    direccionValida: function () {
      return (
        this.gx_direcciones.cdireccion != '' &&
        this.gx_direcciones.cdireccion.length<=200 &&
        this.gx_direcciones.cdepa != '' &&
        this.gx_direcciones.cdist != '' &&
        this.gx_direcciones.cprov != ''
      )
    },
  },

  methods: {
    init() {
      this.getDepartamentos()

      if (this.dni) {
        this.getDirecciones(this.dni)
      }

      this.gx_direcciones.id_docente = this.dni
    },

    async getDepartamentos() {
      try {
        const res = await this.axios.get(`${this.URL}js-departamento`, this.autho)

        if(res.status === 200) {
          this.departamentos = res.data.data
        }
      } catch (err) {
        console.dir(err)
      }
    },

    async getDirecciones(id_docente) {
      this.ajaxDirecciones = true

      try {
        const res = await this.axios.get(`${this.URL}js-direcciones/${id_docente}`, this.autho)

        if(res.status === 200) {
          this.direcciones = res.data.data
        }
      } catch (err) {
        console.dir(err)
        this.direcciones = []
      }

      this.ajaxDirecciones = false
    },

    async saveDireccion() {
      const loading = this.$loading({
        lock: true,
        text: 'Insertando dirección...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.gx_direcciones.ccodusua = this.identity.id_usuario
      try {
        const res = await this.axios.post(`${this.URL}js-direcciones`, this.gx_direcciones, this.autho)
        if(res.status === 201) {
          this.gx_direcciones = new GxDirecciones('', this.dni)
          this.provincias = null
          this.distritos = null
          this.getDirecciones(this.dni)
        }
      } catch (err) {
        console.dir(err)
        this.swAlert(`Error al registrar dirección, intente nuevamente`, 'error')
      }
      loading.close()
    },

    async deleteDireccion({idreg}) {
      const loading = this.$loading({
        lock: true,
        text: 'Eliminando dirección...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.delete(`${this.URL}js-direcciones-del/${idreg}`, this.autho)
        if(res.status === 201) {
          this.gx_direcciones = new GxDirecciones('', this.dni)
          this.provincias = null
          this.distritos = null
          this.getDirecciones(this.dni)
        }
      } catch (err) {
        console.dir(err)
        this.swAlert(`Error al eliminar dirección, intente nuevamente`, 'error')
      }
      loading.close()
    },

    tableRowClassName({
      row
    }) {
      return 'clase'
    },

    setPrincipal(row, { property }) {
      if(property != 'c9') return
      this.asignarC9(row)
    },

    /** Actualiza direccion principal (c9) */
    async asignarC9({idreg, id_docente, cdepa, cprov, cdist, cdireccion}) {
      const loading = this.$loading({
        lock: true,
        text: 'Modificando dirección principal...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.delete(`${this.URL}js-direcciones-upd-c9/${idreg}/${id_docente}`, this.autho)

        if(res.status === 201) {
          this.gx_direcciones = new GxDirecciones('', this.dni)
          this.provincias = null
          this.distritos = null
          this.getDirecciones(this.dni)

          let direccion = cdireccion
          let residencia = `${cdepa}-${cprov}-${cdist}`

          this.updateResidenciaDocente(residencia, direccion, cdepa, cprov, cdist, id_docente)
        }
      } catch (err) {
        console.dir(err)
      }
      loading.close()
    },

    /** Actualiza registro de docente en gx_docente, con los datos de residencia */
    async updateResidenciaDocente(residencia, direccion, cdepanac, cprovnac, cdistnac, id_docente) {
      try {
        const res = await this.axios.post(`${this.URL}js-docentes-upd-residencia/${id_docente}`, {residencia, direccion, cdepanac, cprovnac, cdistnac}, this.autho)

        if(res.status === 201) {
   
        }
      } catch (err) {
        console.dir(err)
        this.$notify.error({
          title: `${id_docente}`,
          message: `Error al actualizar datos de residencias del docente`
        });
      }
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
</style>
