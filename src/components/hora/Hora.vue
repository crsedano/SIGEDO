<template>
  <div class="ed-container init">
    <div class="ed-item ed-container sep-10">
      <div class="ed-item">
        <el-select size="mini" v-model="grupoId" placeholder="Seleccionar Grupo" filterable>
          <el-option v-for="(a, i) in grupos"
            :key="i"
            :label="a.name"
            :value="a.id">
          </el-option>
        </el-select>
      </div>
      <div class="ed-item sep-10">
        <el-input v-model="grupo.name" size="mini" placeholder="Grupo"></el-input>
        <el-button @click="storeHora" size=min type="primary">Crear</el-button>
      </div>
    </div>

<div v-if="grupoId" class="ed-item">
    <el-form size="mini" label-width="80px">
      <el-form-item label="Inicio">
        <el-input type="time" v-model="hora.inicio"></el-input>
      </el-form-item>
      <el-form-item label="Fin">
        <el-input type="time" v-model="hora.fin"></el-input>
      </el-form-item>
      <el-form-item label="Número">
        <el-input-number v-model="hora.number" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="store" type="primary">Crear</el-button>
      </el-form-item>
    </el-form>

    <div class="ed-item">
      <el-table border stripe fit :data="horas" height="350" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column prop="number" label="Número" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="inicio" label="Inicio" min-width="40" align="left" header-align="center"></el-table-column>
        <el-table-column prop="fin" label="Fin" min-width="40" align="left" header-align="center"></el-table-column>
        <el-table-column label="*">
          <template slot-scope="reg">
            <el-button size="mini" type="danger" @click="deleteHora(reg.row)">Eliminar</el-button>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
</div>
    
  </div>
</template>

<script>
import MixingInit from '@/mixing/mixing_init'

class Hora {
  constructor (id, number, inicio, fin, grupoId) {
    this.id     = id
    this.number = number
    this.inicio = inicio
    this.fin    = fin
    this.hora_grupo_id = grupoId
  }
}

export default {
  name: 'hora',

  mixins: [ MixingInit ],

  data () {
    return {
      hora: new Hora(),
      horas: [],
      grupos: [],
      grupoId: null,

      grupo: {
        name: ''
      }
    }
  },

  watch: {
    grupoId (n) {
      if (!n) return

      this.loadHoras()
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init () {
      this.loadGrupos()
    },

    async loadGrupos () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}2/hora-grupo`)
        console.log(res)
        let { status, data } = res

        if (status === 200) {
          this.grupos = data.hora_grupos
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async loadHoras () {
      if (!this.grupoId) return
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}2/hora/by-grupo/${this.grupoId}`)

        let { status, data } = res

        if (status === 200) {
          this.horas = data.horas
        }
      } catch (err) {
        this.$hlp.errors(err)
        this.horas = []
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
      this.hora.hora_grupo_id = this.grupoId
      try {
        const res = await this.axios.post(`${this.URL_}2/hora`, this.hora)

        let { status, data } = res

        if (status === 201) {
          console.log('data')
          await this.loadHoras()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async deleteHora ({ id }) {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.delete(`${this.URL_}2/hora/${id}`)

        let { status, data } = res

        if (status === 200) {
          console.log('data')
          await this.loadHoras()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    },

    async storeHora () {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.post(`${this.URL_}2/hora-grupo`, this.grupo)

        let { status, data } = res

        if (status === 200) {
          this.grupo.name = ''
          this.loadGrupos()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      loading.close()
    }
  }
}
</script>