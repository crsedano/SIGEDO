<template>
  <div class="ed-container init">
    <el-form size="mini" label-width="80px">
      <el-form-item label="Día">
        <el-input v-model="dia.name"></el-input>
      </el-form-item>
      <el-form-item label="Número">
        <el-input-number v-model="dia.number" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="store" type="primary">Crear</el-button>
      </el-form-item>
    </el-form>

    <div class="ed-item">
      <el-table border stripe fit :data="dias" height="350" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column prop="number" label="Número" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="name" label="Día" min-width="40" align="left" header-align="center"></el-table-column>
        <el-table-column label="*">
          <template slot-scope="reg">
            <el-button size="mini" type="danger" @click="deleteDia(reg.row)">Eliminar</el-button>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
    
  </div>
</template>

<script>
import MixingInit from '../../mixing/mixing_init'

class Dia {
  constructor (id, name, number) {
    this.id = id
    this.name   = name
    this.number = number
  }
}

export default {
  name: 'dia',

  mixins: [ MixingInit ],

  data () {
    return {
      dia: new Dia(),
      dias: []
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init () {
      this.loadDias()
    },

    async loadDias () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}2/dia`)

        let { status, data } = res

        if (status === 200) {
          this.dias = data.dias
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
        const res = await this.axios.post(`${this.URL_}2/dia`, this.dia)

        let { status, data } = res

        if (status === 201) {
          console.log('data')
          await this.loadDias()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async deleteDia ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.delete(`${this.URL_}2/dia/${id}`)

        let { status, data } = res

        if (status === 200) {
          console.log('data')
          await this.loadDias()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    }
  }
}
</script>