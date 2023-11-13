<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item sep-10 ed-container gr-center">
    <h3 class="ed-item gr-center sep-10">
      <strong>ADMINISTRAR VERBOS</strong>
    </h3>
  </div>

  <el-form size="mini" class="ed-item ed-container">
    <el-form-item class="ed-item m-40 to-center" label="Verbo">
      <el-input v-model="gxVerbo.cverbo" placeholder="Verbo"></el-input>
    </el-form-item>
    <el-form-item class="ed-item m-40 to-center" label="Grupo">
      <el-input v-model="gxVerbo.cgrupo" placeholder="Grupo"></el-input>
    </el-form-item>
  </el-form>

  <div class="ed-item gr-center">
    <el-button :disabled="!ready" v-if="!edit" @click="createVerbo" type="primary" plain size="mini">Crear</el-button>
    <el-button :disabled="!ready" v-if="edit" @click="editVerbo" type="primary" plain size="mini">Editar</el-button>
    <el-button v-if="edit" @click="cancelEdit" type="danger" size="mini">Cancelar</el-button>
  </div>

  <div class="ed-item m-50 l-40 to-center">
    <el-input v-model="q" placeholder="Buscar" size="small"></el-input>
  </div>

  <div class="ed-item sep-5">
    <el-table
        border
        stripe
        fit
        :data="arrFilter"
        height="350"
        highlight-current-row
        :row-class-name="tableRowClassName"
        v-loading="load"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando Verbos..."
      >
        <el-table-column type="index" min-width="80" align="center" header-align="center"></el-table-column>
        <el-table-column prop="cverbo" label="Verbo" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column :filters="arrGrupos" :filter-method="filterHandler" prop="cgrupo" label="Grupo" min-width="150" align="left" header-align="center"></el-table-column>
        <el-table-column min-width="80" label="*" align="center" header-align="center">
          <template slot-scope="reg">
            <el-button type="warning" @click="setEdit(reg.row)" size="mini">Editar</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>  
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

export default {
  mixins: [
    MixinInit
  ],

  props: [

  ],

  components: {

  },

  mounted() {
    this.init()
  },

  data() {
    return {
      load: false,
      arrVerbos: null,
      arrFilter: null,
      gxVerbo: {idreg: '', cverbo: '', cgrupo: ''},
      edit: false,
      arrGrupos: null,
      q: ''
    }
  },

  computed: {
    ready () {
      return (
        this.gxVerbo.cverbo != '' &&
        this.gxVerbo.cgrupo != ''
      )
    }
  },

  watch: {
    q (n) {
      if(n == '') {
        this.arrFilter = this.arrVerbos
      } else {
        this.arrFilter = this.arrVerbos.filter(a => a.cverbo.toLowerCase().includes(n.toLowerCase()))
      }
    }
  },

  methods: {
    async init() {
      await this.getVerbos()
    },

    close: function () {
      this.$emit('close')
    },

    async getVerbos () {
      this.load = true
      try {
        const res = await this.axios.get(`${this.URL}v1/verbos/getVerbos`)

        if(res.status !== 200) return

        this.arrVerbos = res.data.data
        this.arrFilter = this.arrVerbos

        let arr = []
        this.arrVerbos.map(el => {
          let obj = {
            text: el.cgrupo,
            value: el.cgrupo
          }

          let exist = arr.some(a => a.text == obj.text)

          if(!exist) {
            arr.push(obj)
          }
        })

        this.arrGrupos = arr
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.load = false
    },

    async createVerbo () {
      this.load = true
      try {
        const res = await this.axios.post(`${this.URL}/v1/verbos/create`, this.gxVerbo)

        if(res.status !== 201) return

        this.cancelEdit()
        await this.getVerbos()
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.load = false
    },

    setEdit ({idreg, cverbo, cgrupo}) {
      this.gxVerbo.idreg = idreg
      this.gxVerbo.cverbo = cverbo
      this.gxVerbo.cgrupo = cgrupo
      this.edit = true
    },

    async editVerbo () {
      this.load = true
      try {
        const res = await this.axios.post(`${this.URL}/v1/verbos/edit`, this.gxVerbo)

        if(res.status !== 201) return

        this.cancelEdit()
        await this.getVerbos()
      } catch (err) {
        this.$hlp.errors(err)
      }
      this.load = false
    },

    cancelEdit () {
      this.gxVerbo.idreg = ''
      this.gxVerbo.cverbo = ''
      this.gxVerbo.cgrupo = ''
      this.edit = false
    }
  }

}
</script>

<style lang="scss" scoped>

</style>


