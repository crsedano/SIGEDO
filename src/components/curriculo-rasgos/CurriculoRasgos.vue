<template>
  <div class="init ed-container">
    <div class="ed-item">
      <h2 class="txt-center">
        <strong>
          RASGOS
        </strong>
      </h2>
    </div>

    <div class="ed-item txt-center">
      <el-select size="mini" v-model="escuelaId" filterable placeholder="Seleccionar escuela">
        <el-option
          v-for="(escuela, key) in escuelas"
          :key="key"
          :label="escuela.nombre"
          :value="escuela.id_escuela">
        </el-option>
      </el-select>
    </div>

    <div class="ed-item txt-center sep-10">
      <el-radio-group @change="loadData" v-model="planSelected" size="mini">
        <el-radio-button v-for="(plan, key) in planes" :key="key" :label="plan.plan.anio"></el-radio-button>
      </el-radio-group>
      <a v-if="rasgos && rasgos.length > 0" style="margin: 5px" class="el-button el-button--info el-button--mini" rel="noopener noreferrer" target="_blank" :href="`${URLPDF}api/src/Reports/curriculo-rasgos/Rasgos.php?periodo=${idPeriodo__}&semestre=${idSemestre__}&id=${identity.id_usuario}&plan=${planId}&escuela=${escuelaId}`">
        Reporte PDF
      </a>
      <el-button v-if="rasgos && rasgos.length > 0" type="primary" size="mini" @click="printRasgos">Imprimir</el-button>
    </div>

    <div class="ed-item sep-10">
      <el-table border stripe fit :data="rasgos" height="500" highlight-current-row :row-class-name="tableRowClassName">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="plan.anio" label="PLAN" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela.nombre" label="ESCUELA" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="rasgos" label="RASGO" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column label="BETA HACER" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-input @keyup.enter.native="setBetaHacer(reg.row)" v-model="reg.row.has_beta_hacer" placeholder="Beta Hacer"></el-input>            
            <!-- <el-button @click="setBetaHacer(reg.row)" v-if="!reg.row.has_beta_hacer" type="primary" size="mini">Marcar</el-button> -->
            <!-- <el-button type="danger" @click="setBetaHacer(reg.row)" v-else size="mini">SI</el-button> -->
          </template>
        </el-table-column>
        <el-table-column label="GAMA CONOCER" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-input @keyup.enter.native="setGamaConocer(reg.row)" v-model="reg.row.has_gama_conocer" placeholder="Gama conocer"></el-input>            
            <!-- <el-button @click="setGamaConocer(reg.row)" v-if="!reg.row.has_gama_conocer" type="primary" size="mini">Marcar</el-button> -->
            <!-- <el-button type="danger" @click="setGamaConocer(reg.row)" v-else size="mini">SI</el-button> -->
          </template>
        </el-table-column>
        <el-table-column label="ALFA SER" min-width="40" align="center" header-align="center">
          <template slot-scope="reg">
            <el-input @keyup.enter.native="setAlfaSer(reg.row)" v-model="reg.row.has_alfa_ser" placeholder="Alfa ser"></el-input>            
            <!-- <el-button @click="setAlfaSer(reg.row)" v-if="!reg.row.has_alfa_ser" type="primary" size="mini">Marcar</el-button> -->
            <!-- <el-button type="danger" @click="setAlfaSer(reg.row)" v-else size="mini">SI</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import Init from '../../mixing/mixing_init'

export default {
  name: 'CurriculoRasgos',

  mixins: [ Init ],

  mounted () {
    this.loadEscuelas()
  },

  data () {
    return {
      escuelas: [],
      escuelaId: null,
      planes: [],
      planSelected: null,
      
      rasgos: null,
    }
  },

  computed: {
    planId () {
      if (!this.planSelected) return null

      return this.planes.find(p => p.plan.anio == this.planSelected).plan.id_plan_estudio
    }
  },

  watch: {
    escuelaId (n) {
      this.planSelected = null

      if (!n) return

      this.loadPlanesEstudio()
    }
  },

  methods: {
    async loadEscuelas () {
      try {
        const { status, data } = await this.$api.get(`3/escuela`)

        if ( status === 200 ) {
          this.escuelas = data.escuelas
        }
      } catch (error) {
        this.escuelas = []
      }
    },

    async loadPlanesEstudio () {
      try {
        const { status, data } = await this.$api.get(`3/escuela/plan/${ this.escuelaId }`)

        if ( status === 200 ) {
          this.planes = data.planes
        }
      } catch (error) {
        this.planes = []
      }
    },

    async loadRasgos () {
      try {
        const { status, data } = await this.$api.get(`2/curriculo-rasgos/rasgos/${this.planId}/${this.escuelaId}`)

        if (status === 200) {
          this.rasgos = data.rasgos
        }
      } catch (err) {
        this.rasgos = []
      }
    },

    async loadData () {
      await this.loadRasgos()
    },

    async setBetaHacer ({ id, has_beta_hacer }) {
      try {
        const { status } = await this.axios.post(`${this.URL_}2/curriculo-rasgos/beta-hacer/${id}`, { has_beta_hacer })

        if (status === 200) {
          await this.loadRasgos()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async setGamaConocer ({ id, has_gama_conocer }) {
      try {
        const { status } = await this.axios.post(`${this.URL_}2/curriculo-rasgos/gama-conocer/${id}`, { has_gama_conocer })

        if (status === 200) {
          await this.loadRasgos()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async setAlfaSer ({ id, has_alfa_ser }) {
      try {
        const { status } = await this.axios.post(`${this.URL_}2/curriculo-rasgos/alfa-ser/${id}`, { has_alfa_ser })

        if (status === 200) {
          await this.loadRasgos()
        }
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async printRasgos () {
      try {
        const { status, data } = await this.$api.get(`2/curriculo-rasgos/report-rasgos/${this.planId}/${this.escuelaId}`)

        if (status === 200) {
          this.$hlp.downloadFile(data.url, data.name)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>