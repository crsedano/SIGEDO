<template>
  <div v-loading.fullscreen.lock="loading__" class="ed-container">
    <el-form @submit.native.prevent size="mini" class="ed-item" label-position="top" label-width="80px">
      <el-form-item label="Encuesta">
        <el-input v-model="name" placeholder="Encuesta"></el-input>
      </el-form-item>
      <el-form-item class="txt-center">
        <el-button type="primary" @click="createEncueta">Crear</el-button>
      </el-form-item>
    </el-form>
    

    <div class="ed-item">
      <el-table :data="encuestas__" border stripe>
        <el-table-column type="index" min-width="40"></el-table-column>
        <el-table-column prop="name" label="Encuesta" header-align="center" min-width="150"></el-table-column>
        <el-table-column prop="id_periodo" label="Periodo" header-align="center" min-width="60"></el-table-column>
        <el-table-column prop="id_semestre" label="Semestre" header-align="center" min-width="60"></el-table-column>
        <el-table-column label="*" header-align="center" align="center" min-width="40">
          <template slot-scope="reg">
            <el-tag v-if="reg.row.active" type="danger" >Activo</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import mixing_init from '../../mixing/mixing_init'

export default {
  name: 'admin-encuesta',

  mixins: [mixing_init],

  props: {
    encuestas: {
      type    : Array,
      required: true
    }
  },

  mounted() {
    this.init()
  },

  data () {
    return {
      name       : '',
      encuestas__: null,
      loading__  : false
    }
  },

  methods: {
    init () {
      this.encuestas__ = this.encuestas
    },

    createEncueta() {
      this.$confirm('Al crear una nueva encuesta todas las anteriores quedarán inactivas, ¿Continuar?', '¡PRECAUCIÓN!', {
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
        type: 'warning',
      }).then(async () => {
        await this.storeEncuesta()
      }).catch(() => {
        this.name = ''
      })
    },

    async storeEncuesta () {
      this.loading__ = true
      try {
        const res = await this.axios.post(`${this.URL_}v2/encuestas/store`, {name: this.name, id_periodo: this.idPeriodo__, id_semestre: this.idSemestre__})
        
        let { status, data } = res

        if (status === 201) {
          this.name = ''
          let encuestas = this.encuestas__.map(e => {
            e.active = false
            return e
          })
          this.encuestas__ = [...encuestas, data.encuesta]

          this.updateEncuestas(this.encuestas__)
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.loading__ = false
    },

    updateEncuestas(encuestas) {
      this.$emit('update-encuestas', encuestas)
    },

    close () {
      this.$emit('close')
    }
  }
}
</script>

