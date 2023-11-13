<template>
  <div class="ed-container init sub-main">
    <i @click="close" class="fa fa-window-close action red iclose"></i>
    <div class="ed-item sep-10 txt-center">
      <h1>Asignatura Pre Requisito</h1>
    </div>

    <div class="ed-item m-40 to-center">
      <label>Buscar Asignatura</label>
      <el-input size="mini" @keyup.enter.native="searchAsignatura" v-model="q"></el-input>
    </div>

    <div class="ed-item">
      <el-table @row-click="selectAsig" border stripe fit :data="arr" height="200" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando competencias...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Asignatura" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela.nombre" label="Escuela" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            {{ reg.row.id_asignatura == asigGeneral.id_asignatura ? 'PRINCIPAL' : ''}}
          </template>
        </el-table-column>
      </el-table>
    </div>


    
    <div class="ed-item">
        <div class="ed-item sep-10 txt-center">
           <h3>Asignatura Pre Requisito Registrados</h3>
        </div>
      <el-table border stripe fit :data="arrPreRequisito" height="250" highlight-current-row :row-class-name="tableRowClassName"
        v-loading="ajaxLoad" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
        element-loading-text="Cargando competencias...">
        <el-table-column type="index" min-width="40" align="center" header-align="center"></el-table-column>
        <el-table-column prop="nombre" label="Asignatura" min-width="120" align="center" header-align="center"></el-table-column>
        <el-table-column prop="escuela" label="Escuela" min-width="120" align="center" header-align="center"></el-table-column>
       <el-table-column label="*" min-width="50" align="center" header-align="center">
          <template slot-scope="reg">
            <el-tooltip content="Eliminar" placement="left">
              <i @click="removerPreRequisit(reg.row.id_prerequisitos)" class="fas fa-trash-alt pointer action red"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import mixingInit from '../../../mixing/mixing_init.js'

import alertify from 'alertifyjs'

export default {
  mixins: [
    mixingInit
  ],
  
  props: ['asignatura'],

  mounted () {
    this.init()
  },

  data ()  {
    return {
      asigGeneral: null,
      q: '',
      arr: null,
      arrPreRequisito: null,

        preRequisitoNew: {
          id_asignatura_principal: '',
          id_asignatura_requisito: ''
        },

    }
     
  },

  methods: {
    init () {
      this.getAsignaturaGeneral()
      this.allPreRequisito()
    },

    async getAsignaturaGeneral () {
      let { id_asignatura } = this.asignatura
      if(id_asignatura == '' || id_asignatura == 0 || !id_asignatura) return

      try {
        const res = await this.axios.get(`${this.URL_}v2/asignaturas/show/${id_asignatura}`)
        
        if(res.status !== 200) return 
        
        this.asigGeneral = res.data.asignatura
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async searchAsignatura () {
      if(this.q == '') return
      try {
        const res = await this.axios.get(`${this.URL_}v2/asignaturas/showPreRequisitoByFacultad/${this.asignatura.id_facultad}/${this.q}/${this.asignatura.id_plan_estudio}`)

        if(res.status !== 200) return

        this.arr = res.data.asignaturas
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async allPreRequisito() {
        try {
        const res = await this.axios.get(`${this.URL}js-allAsignatura-requisito/${this.asignatura.id_asignatura}`)
                if(res.data.success) {
                  this.arrPreRequisito = res.data.data
                }
        // this.arrPreRequisito = res.data.asignaturas
          } catch (err) {
            this.arrPreRequisito = null
            this.$hlp.errors(err)
          }

        },

    selectAsig (row) {
      this.createPreRequisito(row)
    },

    async createPreRequisito(row) {

      try {
        this.preRequisitoNew.id_asignatura_principal = this.asignatura.id_asignatura,
        this.preRequisitoNew.id_asignatura_requisito = row.id_asignatura 

        const res = await this.axios.post(`${this.URL}create_requisito`, this.preRequisitoNew, this.autho)
        if(res.data.success) {
          this.allPreRequisito()
        }
      } catch (err) {
        console.dir(err)
        this.swAlert(`Error al registrar requisito, intente nuevamente`, 'error')
      }
    },

    removerPreRequisit: function(id) {
            this.axios.delete(`${this.URL}js-delete-pre-requisito/${id}`, this.autho)
            .then(res => {
                if(res.data.success){
                this.allPreRequisito()
               }
            })
            .catch(err => {
               console.dir(err)
            })
        },


    close () {
      this.$emit('close')
    }
  }
}
</script>

