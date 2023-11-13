<template>
  <div class="ed-container init">
    <el-form size="mini" label-width="80px">
      <el-form-item label="Código">
        <el-input v-model="aula.codigo"></el-input>
      </el-form-item>
      <el-form-item label="Aforo">
        <el-input-number v-model="aula.aforo" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="Facultad">
        <el-select v-model="aula.facultad_id">
          <el-option v-for="(f, i) in facultades"
            :key="i"
            :label="f.nombre"
            :value="f.id_facultad">
          </el-option>
        </el-select>
        
      </el-form-item>
      <el-form-item label="Filial">
        <el-select v-model="aula.filial_id">
          <el-option v-for="(f, i) in filiales"
            :key="i"
            :label="f.nombre_filial"
            :value="f.id_filial">
          </el-option>
        </el-select>
        
      </el-form-item>
      
      <el-form-item>
        <el-button @click="store" type="primary">Crear</el-button>
      </el-form-item>
      
    </el-form>

    <div class="ed-item">
      <el-table border stripe fit :data="aulas" height="350" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column prop="codigo" label="Código" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="aforo" label="Aforo" min-width="40" align="left" header-align="center"></el-table-column>
        <el-table-column prop="facultad.nombre" label="Facultad" min-width="40" align="left" header-align="center"></el-table-column>
        <el-table-column prop="filial.nombre_filial" label="Filial" min-width="40" align="left" header-align="center"></el-table-column>
        <el-table-column label="*">
          <template slot-scope="reg">
            <el-button size="mini" type="danger" @click="deleteAula(reg.row)">Eliminar</el-button>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
    
  </div>
</template>

<script>
import MixingInit from '@/mixing/mixing_init'

class Aula {
  constructor (id, codigo, aforo, facultad_id, filial_id) {
    this.id          = id
    this.codigo      = codigo
    this.aforo       = aforo
    this.facultad_id = facultad_id
    this.filial_id   = filial_id
  }
}

export default {
  name: 'aula',

  mixins: [ MixingInit ],

  data () {
    return {
      aula      : new Aula(),
      aulas     : [],
      facultades: [],
      filiales  : []
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init () {
      await this.loadFacultades()
      await this.loadAulas()
      await this.loadFiliales()
    },

    async loadAulas () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}2/aula`)

        let { status, data } = res

        if (status === 200) {
          this.aulas = data.aulas
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async loadFacultades() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL_}v2/facultades/getAll`)
        console.log(res)
        let { status, data } = res
  
        if (status === 200) {
          this.facultades = data.data
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async loadFiliales() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const res = await this.axios.get(`${this.URL_}2/filial`)
        
        let { status, data } = res
  
        if (status === 200) {
          this.filiales = data.filiales
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    

    async store () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL_}2/aula`, this.aula)

        let { status, data } = res

        if (status === 201) {
          this.aula = new Aula()
          await this.loadAulas()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async deleteAula ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.delete(`${this.URL_}2/aula/${id}`)

        let { status, data } = res

        if (status === 200) {
          console.log('data')
          await this.loadAulas()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    }
  }
}
</script>