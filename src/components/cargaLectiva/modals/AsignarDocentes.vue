<template>
<div class="ed-container init sub-main">
  <i @click="close" class="fa fa-window-close action red iclose"></i>
  <div class="ed-item ed-container gr-center">
    <h3 class="ed-item gr-center sep-10">
      <strong>
        MODIFICAR
      </strong>
    </h3>
  </div>

  <div v-if="type === 'E'" class="ed-item txt-center">
    <el-button :disabled="!allDocente || !resp" @click="cursoModal = true" type="danger" size="mini">
      Fusionar
    </el-button>
    <el-button @click="fusionModal = true" type="info" size="mini">
      Ver Fusiones
    </el-button>
  </div>

  <div v-if="fusionado" class="ed-item ed-container to-center" >
    <div class="ed-item m-40 l-30 gr-center txt-center">
      <el-alert
        title="Asignatura fusionada"
        type="info">
      </el-alert>
    </div>
  </div>

  <div class="ed-item s-90 m-50 l-40 to-center ed-container">
    <table class='table table-bordered table-responsive table-hover table-striped table-own'>
      <thead class='table-head'>
        <tr>
          <th>Docente</th>
          <th>Responsable Silabus</th>
        </tr>
      </thead>
      <tbody class='table-body'>
        <tr v-for="(doc, index) in docentes" :key="index">
          <template v-if="doc.id_docente != ''">
            <td>{{doc.nombre_docente}}</td>
            <td @click="responsableSilabo(docentes, doc)">
              <span class="hint--left hint--info" :aria-label="doc.responsable_silabus == 1 ? '' : doc.id_docente == '' ? '' : 'Hacer Responsable de Silabo'">
                <i v-if="doc.responsable_silabus == 1" class="fas fa-paperclip action"></i>
                <i v-else class="fas fa-paperclip action red"></i>
              </span>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="load" class="ed-item gr-center">
    <loading />
  </div>

  <div v-if="detailAsignatura != null" class="ed-item s-80 m-80 l-70 to-center sep-20 ed-container">

    <div class="ed-item to-center sep-10">
      <div class="ed-item m-50 to-center ed-container form-group">
        <label>NOMBRE CURSO</label>
        <input disabled class="form-control dis-esp" type="text" v-model="detailAsignatura.nombre">
      </div>
    </div>

    <table class="ed-item sep-10 table table-responsive table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th>Matriculados</th>
          <th>H. Teóricas</th>
          <th>H. Práctica</th>
          <th>S.P.P. Teóricas</th>
          <th>S.P.P. Práctica</th>
          <th>S.P.V. Teóricas</th>
          <th>S.P.V. Práctica</th>
          <th>Alumnos(HT)</th>
          <th>Alumnos(HP)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{curso.numero_matriculadosf}}</td>
          <td>{{detailAsignatura.horas_teoricas}}</td>
          <td>{{detailAsignatura.horas_practicas}}</td>
          <td>{{detailAsignatura.sp_phorasteoricas}}</td>
          <td>{{detailAsignatura.sp_phoraspracticas}}</td>
          <td>{{detailAsignatura.sp_vhorasteoricas}}</td>
          <td>{{detailAsignatura.sp_vhoraspracticas}}</td>
          <td>{{detailAsignatura.aforo_ht}}</td>
          <td>{{detailAsignatura.aforo_hp}}</td>
        </tr>
      </tbody>
    </table>

  </div>

  <div class="ed-item s-90 m-70 sep-10 to-center ed-container">
    <div class="ed-item sep-10 m-40 to-center ed-container">
      <div class="ed-item ed-container form-group">
        <label>Docente:</label>
        <input autocomplete="off" @input="buscarDocente(dataBuscarDocente)" @keyup.enter="buscarDocente(dataBuscarDocente)" v-model="dataBuscarDocente" type="text" class="form-control resaltado"
          id="docente">
      </div>
    </div>

    <div v-if="docentesBusqueda != null" class="ed-item s-95 m-70 to-center ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <thead class="table-head">
          <tr>
            <th>DNI</th>
            <th>Docente</th>
            <th>Horas</th>
            <th>JP</th>
            <th>Seleccionar</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr @click="seleccionarDocente(docente)" v-for="(docente, index) in docentesBusqueda" :key="index">
            <td>{{ docente.id_docente }}</td>
            <td>{{docente.nombre}}</td>
            <td>{{docente.horas}}</td>
            <td>{{docente.is_jp == 1 ? 'SI' : 'NO'}}</td>
            <td>
              <i v-if="docenteSelect == docente" class="fas fa-hand-pointer action pointer"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="ed-item sep-10 s-95 m-95 to-center ed-container">
    <div v-if="teorico != null" class="ed-item m-45 to-center sep-10 ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS TEORICAS</caption>
        <thead class="table-head">
          <tr>
            <th>Docente</th>
            <th>Grupo</th>
            <th>Seccion</th>
            <th></th>
            <th>Orden</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(t, index) in teorico" :key="index">
            <td>
              {{t.nombre_docente}}
            </td>
            <td>{{t.numero_alumnos_seccion}}</td>
            <td>
              <input :disabled="t.id_docente != ''" class="form-control w-90" type="text" v-model="t.seccion">
            </td>
            <td v-if="t.id_docente == '' || t.id_docente == null">
              <button @click="asignarDocente(t, 'ht', index)" :disabled="t.seccion == ''" class="btn btn-success btn-xs btn-hov hint--top"
                :aria-label="t.seccion == '' ? 'Ingrese Sección' : ''">
                Asignar
              </button>
            </td>
            <td v-else>
              <button @click="desasignarDocente(t)" class="btn btn-danger btn-xs btn-hov">
                Desasignar
              </button>
            </td>
            <td style="display: flex">
              <el-button :disabled="index == 0" @click="changeNum(t, 1)" size="mini">Subir</el-button>
              <el-button :disabled="index == (teorico.length - 1)" @click="changeNum(t, 2)" size="mini">Bajar</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="practico != null" class="ed-item m-45 to-center sep-10 ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS PRACTICAS</caption>
        <thead class="table-head">
          <tr>
            <th>Docente</th>
            <th>Grupo</th>
            <th>Seccion</th>
            <th></th>
            <th>Orden</th>
            <!-- <th>Silabo</th> -->
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(p, index) in practico" :key="index">
            <td>
              {{p.nombre_docente}}
            </td>
            <td>{{p.numero_alumnos_seccion}}</td>
            <td class="gr-center">
              <input :disabled="p.id_docente != ''" class="form-control h-50 w-90" type="text" v-model="p.seccion">
            </td>
            <td v-if="p.id_docente == '' || p.id_docente == null">
              <button @click="asignarDocente(p, 'hp', index)" :disabled="p.seccion == ''" class="btn btn-success btn-xs btn-hov hint--top"
                :aria-label="p.seccion == '' ? 'Ingrese Sección' : ''">
                Asignar
              </button>
            </td>
            <td v-else>
              <button @click="desasignarDocente(p)" class="btn btn-danger btn-xs btn-hov">
                Desasignar
              </button>
            </td>
            <td style="display: flex">
              <el-button :disabled="index == 0" @click="changeNum(p, 1)" size="mini">Subir</el-button>
              <el-button :disabled="index == (practico.length - 1)" @click="changeNum(p, 2)" size="mini">Bajar</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="ed-item sep-10 s-95 m-95 to-center ed-container">
    <div v-if="spteorico != null" class="ed-item m-45 to-center sep-10 ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS SEMI PRESENCIAL PRESENCIAL TEORICAS</caption>
        <thead class="table-head">
          <tr>
            <th>Docente</th>
            <th>Grupo</th>
            <th>Seccion</th>
            <th></th>
            <th>Orden</th>
            <!-- <th>Silabo</th> -->
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(t, index) in spteorico" :key="index">
            <td>
              {{t.nombre_docente}}
            </td>
            <td>{{t.numero_alumnos_seccion}}</td>
            <td>
              <input :disabled="t.id_docente != ''" class="form-control w-90" type="text" v-model="t.seccion">
            </td>
            <td v-if="t.id_docente == '' || t.id_docente == null">
              <button @click="asignarDocente(t, 'spht', index)" :disabled="t.seccion == ''" class="btn btn-success btn-xs btn-hov hint--top"
                :aria-label="t.seccion == '' ? 'Ingrese Sección' : ''">
                Asignar
              </button>
            </td>
            <td v-else>
              <button @click="desasignarDocente(t)" class="btn btn-danger btn-xs btn-hov">
                Desasignar
              </button>
            </td>
            <td style="display: flex">
              <el-button :disabled="index == 0" @click="changeNum(t, 1)" size="mini">Subir</el-button>
              <el-button :disabled="index == (spteorico.length - 1)" @click="changeNum(t, 2)" size="mini">Bajar</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="sppractico != null" class="ed-item m-45 to-center sep-10 ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS SEMIPRESENCIAL PRESENCIAL PRACTICAS</caption>
        <thead class="table-head">
          <tr>
            <th>Docente</th>
            <th>Grupo</th>
            <th>Seccion</th>
            <th></th>
            <th>Orden</th>
            <!-- <th>Silabo</th> -->
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(p, index) in sppractico" :key="index">
            <td>
              {{p.nombre_docente}}
            </td>
            <td>{{p.numero_alumnos_seccion}}</td>
            <td class="gr-center">
              <input :disabled="p.id_docente != ''" class="form-control h-50 w-90" type="text" v-model="p.seccion">
            </td>
            <td v-if="p.id_docente == '' || p.id_docente == null">
              <button @click="asignarDocente(p, 'sphp', index)" :disabled="p.seccion == ''" class="btn btn-success btn-xs btn-hov hint--top"
                :aria-label="p.seccion == '' ? 'Ingrese Sección' : ''">
                Asignar
              </button>
            </td>
            <td v-else>
              <button @click="desasignarDocente(p)" class="btn btn-danger btn-xs btn-hov">
                Desasignar
              </button>
            </td>
            <td style="display: flex">
              <el-button :disabled="index == 0" @click="changeNum(p, 1)" size="mini">Subir</el-button>
              <el-button :disabled="index == (sppractico.length - 1)" @click="changeNum(p, 2)" size="mini">Bajar</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="ed-item sep-10 s-95 m-95 to-center ed-container">
    <div v-if="svteorico != null" class="ed-item m-45 to-center sep-10 ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS SEMIPRESENCIAL VIRTUAL TEORICAS</caption>
        <thead class="table-head">
          <tr>
            <th>Docente</th>
            <th>Grupo</th>
            <th>Seccion</th>
            <th></th>
            <th>Orden</th>
            <!-- <th>Silabo</th> -->
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(t, index) in svteorico" :key="index">
            <td>
              {{t.nombre_docente}}
            </td>
            <td>{{t.numero_alumnos_seccion}}</td>
            <td>
              <input :disabled="t.id_docente != ''" class="form-control w-90" type="text" v-model="t.seccion">
            </td>
            <td v-if="t.id_docente == '' || t.id_docente == null">
              <button @click="asignarDocente(t, 'svht', index)" :disabled="t.seccion == ''" class="btn btn-success btn-xs btn-hov hint--top"
                :aria-label="t.seccion == '' ? 'Ingrese Sección' : ''">
                Asignar
              </button>
            </td>
            <td v-else>
              <button @click="desasignarDocente(t)" class="btn btn-danger btn-xs btn-hov">
                Desasignar
              </button>
            </td>
            <td style="display: flex">
              <el-button :disabled="index == 0" @click="changeNum(t, 1)" size="mini">Subir</el-button>
              <el-button :disabled="index == (svteorico.length - 1)" @click="changeNum(t, 2)" size="mini">Bajar</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="svpractico != null" class="ed-item m-45 to-center sep-10 ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <caption>HORAS SEMIPRESENCIAL VIRTUAL PRACTICAS</caption>
        <thead class="table-head">
          <tr>
            <th>Docente</th>
            <th>Grupo</th>
            <th>Seccion</th>
            <th></th>
            <th>Orden</th>
            <!-- <th>Silabo</th> -->
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(p, index) in svpractico" :key="index">
            <td>
              {{p.nombre_docente}}
            </td>
            <td>{{p.numero_alumnos_seccion}}</td>
            <td class="gr-center">
              <input :disabled="p.id_docente != ''" class="form-control h-50 w-90" type="text" v-model="p.seccion">
            </td>
            <td v-if="p.id_docente == '' || p.id_docente == null">
              <button @click="asignarDocente(p, 'svhp', index)" :disabled="p.seccion == ''" class="btn btn-success btn-xs btn-hov hint--top"
                :aria-label="p.seccion == '' ? 'Ingrese Sección' : ''">
                Asignar
              </button>
            </td>
            <td v-else>
              <button @click="desasignarDocente(p)" class="btn btn-danger btn-xs btn-hov">
                Desasignar
              </button>
            </td>
            <td style="display: flex">
              <el-button :disabled="index == 0" @click="changeNum(p, 1)" size="mini">Subir</el-button>
              <el-button :disabled="index == (svpractico.length - 1)" @click="changeNum(p, 2)" size="mini">Bajar</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="cursoModal" class="modal">
    <buscar-curso @close="cursoModal = false" :id_facultad="facultad.id_facultad" :tmp_id_fusion="curso.id_asignatura"
      :id_filial="curso.id_filial" :id_modalidad="curso.id_modalidad" :docentes="docentes"/>
  </div>
  <div v-if="fusionModal" class="modal">
    <lista-fusionados @close="fusionModal = false" :curso="this.curso" />
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

// import GxDocente from '../../../models/gx_docente'

import buscarCurso from './buscarCurso.vue'
import listaFusionados from './ListaFusionados.vue'

export default {
  mixins: [
    MixinInit
  ],

  props: [
    'curso',
    'type',
    'facultad'
  ],

  components: {
    loading,
    buscarCurso,
    listaFusionados
  },

  mounted() {
    this.init()
  },

  data: () => ({
    load: false,

    detailAsignatura: null,

    dataBuscarDocente: '',
    docentesBusqueda: null,

    docenteSelect: null,

    docentes: [],

    cursoModal: false,
    fusionModal: false,

    teorico: null,
    practico: null,
    spteorico: null,
    sppractico: null,
    svteorico: null,
    svpractico: null,
  }),

  watch: {
    dataBuscarDocente (n) {
      this.dataBuscarDocente = n.toUpperCase()
    }
  },

  computed: {
    fusionTeorico () {
      if(!this.teorico) return true

      return this.teorico.every(t => t.tmp_id_fusion == 1)
    },

    fusionPractico () {
      if(!this.practico) return true

      return this.practico.every(t => t.tmp_id_fusion == 1)
    },

    fusionSpTeorico () {
      if(!this.spteorico) return true

      return this.spteorico.every(t => t.tmp_id_fusion == 1)
    },

    fusionSpPractico () {
      if(!this.sppractico) return true

      return this.sppractico.every(t => t.tmp_id_fusion == 1)
    },

    fusionSvTeorico () {
      if(!this.svteorico) return true

      return this.svteorico.every(t => t.tmp_id_fusion == 1)
    },

    fusionSvPractico () {
      if(!this.svpractico) return true

      return this.svpractico.every(t => t.tmp_id_fusion == 1)
    },

    fusionado() {
      return (
        this.fusionTeorico && this.fusionPractico &&
        this.fusionSpTeorico && this.fusionSpPractico &&
        this.fusionSvTeorico && this.fusionSvPractico
      )
    },

    docenteTeorico () {
      if(!this.teorico) return true

      return this.teorico.every(t => t.id_docente != '')
    },

    docentePractico () {
      if(!this.practico) return true

      return this.practico.every(t => t.id_docente != '')
    },

    docenteSpTeorico () {
      if(!this.spteorico) return true

      return this.spteorico.every(t => t.id_docente != '')
    },

    docenteSpPractico () {
      if(!this.sppractico) return true

      return this.sppractico.every(t => t.id_docente != '')
    },

    docenteSvTeorico () {
      if(!this.svteorico) return true

      return this.svteorico.every(t => t.id_docente != '')
    },

    docenteSvPractico () {
      if(!this.svpractico) return true

      return this.svpractico.every(t => t.id_docente != '')
    },

    allDocente () {
      return (
        this.docenteTeorico && this.docentePractico &&
        this.docenteSpTeorico && this.docenteSpPractico &&
        this.docenteSvTeorico && this.docenteSvPractico
      )
    },

    resp () {
      return this.docentes.some(d => d.responsable_silabus == 1)
    }


  },

  methods: {
    async init() {
      const loading = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      await this.teclasRapidas()
      await this.getDetalleAsignatura()

      this.teorico = await this.getSalonesAsignados(this.curso, 'ht')
      this.practico = await this.getSalonesAsignados(this.curso, 'hp')

      this.spteorico = await this.getSalonesAsignados(this.curso, 'spht')
      this.sppractico = await this.getSalonesAsignados(this.curso, 'sphp')

      this.svteorico = await this.getSalonesAsignados(this.curso, 'svht')
      this.svpractico = await this.getSalonesAsignados(this.curso, 'svhp')

      await this.allDocentes()

      loading.close()
    },

    getSalonesAsignados: async function (curso, tipo_hora) {
      try {
        const res = await this.axios.get(`${this.URL}js-salonesesp-asigdoc/${this.entorno.version_final}/${this.periodo.id_periodo}/${this.periodo.id_semestre}/${curso.id_asignatura}/${curso.id_filial}/${curso.id_modalidad}/${tipo_hora}`, this.autho)

        if(res.status !== 200) return null
        
        return res.data.data

      } catch (err) {
        console.dir(err)
        return null
      }
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })

      document.getElementById('docente').focus()
    },

    allDocentes: function () {
      this.docentes = []
      this.docentesEncargados(this.teorico)
      this.docentesEncargados(this.practico)
      this.docentesEncargados(this.spteorico)
      this.docentesEncargados(this.sppractico)
      this.docentesEncargados(this.svteorico)
      this.docentesEncargados(this.svpractico)
    },

    docentesEncargados: function (arr) {
      if (arr != null) {
        arr.forEach(el => {
          if (!this.docentes.some(d => d.id_docente == el.id_docente)) {
            this.docentes.push(el)
          }
        })
      }
    },

    async getDetalleAsignatura () {
      try {
        const res = await this.axios.get(`${this.URL}js-det-asignatura/${this.entorno.version_final}/${this.curso.id_asignatura}/${this.curso.id_filial}/${this.curso.id_modalidad}`)

        if(res.status !== 200) return

        this.detailAsignatura = res.data.data
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async getDetalleDocente (param) {
      if(param.id_docente == '') return

      try {
        const res = await this.axios.get(`${this.URL}js-docente/${param.id_docente}`)

        if(res.status !== 200) return 

        param.nombre_docente = res.data.data.nombre
      } catch (err) {
        this.$hlp.errors(err)
      }      
    },

    async colocarNombreDocente (arr) {
      if(!arr) return
      
      arr = arr.map(a => {
        this.getDetalleDocente(a)
        return a
      })
    },

    close () {
      this.$emit('close')
    },

    verificar () {
      this.colocarNombreDocente(this.teorico)
      this.colocarNombreDocente(this.practico)
    },

    async buscarDocente (dataBuscarDocente, re = false) {
      if(this.dataBuscarDocente.length < 3) {
        this.docentesBusqueda = null
        return
      }
      const loading = this.$loading({
        lock: true,
        ext: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await this.axios.get(`${this.URL_}v2/docentes/search_docente/${dataBuscarDocente}/${this.idPeriodo__}/${this.idSemestre__}/0`)

        let { status, data } = res

        if (status === 200) {
          this.docentesBusqueda = data.docentes
          if (re) {
            this.docenteSelect = this.docentesBusqueda.find(d => d.id_docente == this.docenteSelect.id_docente)
          }
        }
      } catch (err) {
        // this.$hlp.errors(err)
        console.dir(err)
      }
      loading.close()

      // try {
      //   const res = await this.axios.get(`${this.URL}js-docente-horas/${this.entorno.version_ingreso}/${dataBuscarDocente}`)

      //   if(res.status !== 200) return

      //   this.docentesBusqueda = res.data.data

      //   if (re) {
      //     this.docenteSelect = this.docentesBusqueda.filter(d => d.id_docente == this.docenteSelect.id_docente)[0]
      //   } else if(this.docentesBusqueda.length == 1) {
      //     this.docenteSelect = this.docentesBusqueda[0]
      //   }
      // } catch (err) {
      //   console.dir(err)
      // }
    },

    seleccionarDocente (docente) {
      this.docenteSelect = docente
    },

    alertHoras () {
      this.$alert('Horas docente superadas', '¡Atención!', {
        confirmButtonText: 'OK',
        type: 'error'
      })
    },

    async asignarDocente (asigdoc, tipo_hora, index) {
      asigdoc.id_docente = this.docenteSelect.id_docente
      asigdoc.nombre_docente = this.docenteSelect.nombre
      asigdoc.responsable_silabus = 0

      if (tipo_hora == 'hp') {

        let sumaHoras = parseInt(this.docenteSelect.horas) + parseInt(this.curso.horas_practicas)

        if (sumaHoras > 40 && this.docenteSelect.id_docente != '88888888') {
          this.alertHoras()
          asigdoc.id_docente = ''
          asigdoc.nombre_docente = ''
          return
        }

        asigdoc.horas_academicas_asignadas = this.curso.horas_practicas

        if (this.detailAsignatura.horas_practicas == this.detailAsignatura.horas_teoricas) {
          if (this.teorico != null && this.teorico[index] != undefined) {
            if (this.teorico[index].nombre_docente == '' || this.teorico[index].nombre_docente == null) {
              this.teorico[index].id_docente = this.docenteSelect.id_docente
              this.teorico[index].nombre_docente = this.docenteSelect.nombre
              this.teorico[index].seccion = this.practico[index].seccion
              this.teorico[index].responsable_silabus = 0

              await this.axios.put(`${this.URL}js-upt-docente/${this.teorico[index].id_asigdoc}`, this.teorico[index], this.autho)
                .then(res => {
                  this.correrPA(this.teorico[index].id_docente)
                  this.buscarDocente(this.dataBuscarDocente, true)
                  this.allDocentes()
                })
                .catch(err => {
                  console.dir(err)
                })
            }
          }
        }
      }

      if (tipo_hora == 'ht') {

        let sumaHoras = parseInt(this.docenteSelect.horas) + parseInt(this.curso.horas_teoricas)

        if (sumaHoras > 40 && this.docenteSelect.id_docente != '88888888') {
          this.alertHoras()
          asigdoc.id_docente = ''
          asigdoc.nombre_docente = ''
          return
        }

        asigdoc.horas_academicas_asignadas = this.curso.horas_teoricas
        if (this.detailAsignatura.horas_practicas == this.detailAsignatura.horas_teoricas) {
          if (this.practico != null && this.practico[index] != undefined) {
            if (this.practico[index].nombre_docente == '' || this.practico[index].nombre_docente == null) {
              this.practico[index].id_docente = this.docenteSelect.id_docente
              this.practico[index].nombre_docente = this.docenteSelect.nombre
              this.practico[index].seccion = this.teorico[index].seccion
              this.practico[index].responsable_silabus = 0

              await this.axios.put(`${this.URL}js-upt-docente/${this.practico[index].id_asigdoc}`, this.practico[index], this.autho)
                .then(res => {
                  this.correrPA(this.practico[index].id_docente)
                  this.buscarDocente(this.dataBuscarDocente, true)
                  this.allDocentes()
                })
                .catch(err => {
                  console.dir(err)
                })
            }
          }
        }
      }

      if (tipo_hora == 'spht' && this.docenteSelect.id_docente != '88888888') {

        let sumaHoras = parseInt(this.docenteSelect.horas) + parseInt(this.curso.sp_phorasteoricas)

        if (sumaHoras > 40) {
          this.alertHoras()
          asigdoc.id_docente = ''
          asigdoc.nombre_docente = ''
          return
        }

        asigdoc.horas_academicas_asignadas = this.curso.sp_phorasteoricas

        if (this.detailAsignatura.sp_phoraspracticas == this.detailAsignatura.sp_phorasteoricas) {
          if (this.sppractico != null && this.sppractico[index] != undefined) {
            if (this.sppractico[index].nombre_docente == '' || this.sppractico[index].nombre_docente == null) {
              this.sppractico[index].id_docente = this.docenteSelect.id_docente
              this.sppractico[index].nombre_docente = this.docenteSelect.nombre
              this.sppractico[index].seccion = this.spteorico[index].seccion
              this.sppractico[index].responsable_silabus = 0

              await this.axios.put(`${this.URL}js-upt-docente/${this.sppractico[index].id_asigdoc}`, this.sppractico[index], this.autho)
                .then(res => {
                  this.correrPA(this.sppractico[index].id_docente)
                  this.buscarDocente(this.dataBuscarDocente, true)
                  this.allDocentes()
                })
                .catch(err => {
                  console.dir(err)
                })
            }
          }
        }
      }

      if (tipo_hora == 'sphp' && this.docenteSelect.id_docente != '88888888') {

        let sumaHoras = parseInt(this.docenteSelect.horas) + parseInt(this.curso.sp_phoraspracticas)

        if (sumaHoras > 40) {
          this.alertHoras()
          asigdoc.id_docente = ''
          asigdoc.nombre_docente = ''
          return
        }

        asigdoc.horas_academicas_asignadas = this.curso.sp_phoraspracticas

        if (this.detailAsignatura.sp_phoraspracticas == this.detailAsignatura.sp_phorasteoricas) {
          if (this.spteorico != null && this.spteorico[index] != undefined) {
            if (this.spteorico[index].nombre_docente == '' || this.spteorico[index].nombre_docente == null) {
              this.spteorico[index].id_docente = this.docenteSelect.id_docente
              this.spteorico[index].nombre_docente = this.docenteSelect.nombre
              this.spteorico[index].seccion = this.sppractico[index].seccion
              this.spteorico[index].responsable_silabus = 0

              await this.axios.put(`${this.URL}js-upt-docente/${this.spteorico[index].id_asigdoc}`, this.spteorico[index], this.autho)
                .then(res => {
                  this.correrPA(this.spteorico[index].id_docente)
                  this.buscarDocente(this.dataBuscarDocente, true)
                  this.allDocentes()
                })
                .catch(err => {
                  console.dir(err)
                })
            }
          }
        }
      }

      if (tipo_hora == 'svhp') {

        let sumaHoras = this.docenteSelect.carga_presencial + Math.ceil((this.docenteSelect.svht_suma +  this.curso.sp_vhoraspracticas) / 2)

        if (sumaHoras > 40 && this.docenteSelect.id_docente != '88888888') {
          this.alertHoras()
          asigdoc.id_docente = ''
          asigdoc.nombre_docente = ''
          return
        }

        asigdoc.horas_academicas_asignadas = this.curso.sp_vhoraspracticas

        if (this.detailAsignatura.sp_vhoraspracticas == this.detailAsignatura.sp_vhorasteoricas) {
          if (this.svteorico != null && this.svteorico[index] != undefined) {
            if (this.svteorico[index].nombre_docente == '' || this.svteorico[index].nombre_docente == null) {
              this.svteorico[index].id_docente = this.docenteSelect.id_docente
              this.svteorico[index].nombre_docente = this.docenteSelect.nombre
              this.svteorico[index].seccion = this.svpractico[index].seccion
              this.svteorico[index].responsable_silabus = 0

              await this.axios.put(`${this.URL}js-upt-docente/${this.svteorico[index].id_asigdoc}`, this.svteorico[index], this.autho)
                .then(res => {
                  this.correrPA(this.svteorico[index].id_docente)
                  this.buscarDocente(this.dataBuscarDocente, true)
                  this.allDocentes()
                })
                .catch(err => {
                  console.dir(err)
                })
            }
          }
        }
      }

      if (tipo_hora == 'svht') {

        let sumaHoras = this.docenteSelect.carga_presencial + Math.ceil((this.docenteSelect.svhp_suma +  this.curso.sp_vhorasteoricas) / 2)

        if (sumaHoras > 40 && this.docenteSelect.id_docente != '88888888') {
          this.alertHoras()
          asigdoc.id_docente = ''
          asigdoc.nombre_docente = ''
          return
        }

        asigdoc.horas_academicas_asignadas = this.curso.sp_vhorasteoricas

        if (this.detailAsignatura.sp_vhoraspracticas == this.detailAsignatura.sp_vhorasteoricas) {
          if (this.svpractico != null && this.svpractico[index] != undefined) {
            if (this.svpractico[index].nombre_docente == '' || this.svpractico[index].nombre_docente == null) {
              this.svpractico[index].id_docente = this.docenteSelect.id_docente
              this.svpractico[index].nombre_docente = this.docenteSelect.nombre
              this.svpractico[index].seccion = this.svteorico[index].seccion
              this.svpractico[index].responsable_silabus = 0

              await this.axios.put(`${this.URL}js-upt-docente/${this.svpractico[index].id_asigdoc}`, this.svpractico[index], this.autho)
                .then(res => {
                  this.correrPA(this.svpractico[index].id_docente)
                  this.buscarDocente(this.dataBuscarDocente, true)
                  this.allDocentes()
                })
                .catch(err => {
                  console.dir(err)
                })
            }
          }
        }
      }

      await this.axios.put(`${this.URL}js-upt-docente/${asigdoc.id_asigdoc}`, asigdoc, this.autho)
        .then(res => {
          this.buscarDocente(this.dataBuscarDocente, true)
          this.allDocentes()
          this.correrPA(asigdoc.id_docente)
        })
        .catch(err => {
          console.dir(err)
        })
      // this.verificarHoras()
      this.verficarResponsableSilabo()
    },

    async desasignarDocente (asigdoc) {
      

      this.$confirm('Esta operación borrara todas las asignaturas fusionadas que pueda existir, ¿Desea continuar?', 'SIGEDO', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        const loading = this.$loading({
          lock: true,
          text: 'Cargando...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        this.docentesBusqueda = null
      
        let id_docente = asigdoc.id_docente
        asigdoc.id_docente = ''
        asigdoc.nombre_docente = ''
        asigdoc.seccion = ''
        asigdoc.responsable_silabus = 0
        asigdoc.horas_academicas_asignadas = 0


        try {
          const res = await this.axios.put(`${this.URL}js-upt-docente/${asigdoc.id_asigdoc}`, asigdoc)

          if(res.status !== 201) return
          
          this.allDocentes()
          this.deleteFusiones()
          this.updatePadre()

          this.correrPA(id_docente)
          

        } catch (err) {
          this.allDocentes()
          console.dir(err)
        }
        loading.close()
      }).catch(() => {
        
      })

      
    },

    async deleteFusiones () {
      try {
        let { id_periodo, id_semestre } = this.periodo
        let { id_asignatura, id_filial, id_modalidad } = this.curso

        const res = await this.axios.delete(`${this.URL}delete-fusion/${id_periodo}/${id_semestre}/${id_asignatura}/${id_filial}/${id_modalidad}`)

        if(res.status !== 201) return
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    async updatePadre () {
      try {
        let obj = {
          id_curso: this.curso.id_asignatura,
          id_periodo: this.periodo.id_periodo,
          id_semestre: this.periodo.id_semestre,
          id_filial: this.curso.id_filial,
          id_modalidad: this.curso.id_modalidad
        }

        const res = await this.axios.put(`${this.URL}update-fusion-padre/0`, obj)

        console.log('update padre', res)
      } catch (err) {
        this.$hlp.errors(err)
      }
    },

    verificarHoras () {
      setTimeout(() => {

        if (this.docenteSelect.total_horas >= 21) {
          let horas_admi = 40 - parseInt(this.docenteSelect.total_horas)
          this.actualizarHorasAdmni(this.docenteSelect.id_docente, horas_admi)
        } else if (this.docenteSelect.horas_administrativas > 0) {
          this.actualizarHorasAdmni(this.docenteSelect.id_docente, 0)
        }

      }, 1000);
    },

    async actualizarHorasAdmni (id_docente, horas) {
      try {
        const res = await this.axios.put(`${this.URL}js-docente-ha/${id_docente}/${horas}`, {}, this.autho)

        console.log('actualizar horas', res)
      } catch (err) {
        console.dir(err)
      }
    },

    async correrPA (id_docente) {
      try {
        const res = await this.axios.post(`${this.URL}js-docente-calc-horas/${id_docente}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, {}, this.autho)

        console.log('procedimiento', res)
      } catch (err) {
        console.dir(err)
      }
    },

    async actualizarResponsableSilabo (curso) {
      try {
        const res = await this.axios.post(`${this.URL}js-silabo-asigdoc`, curso, this.autho)

        console.log('actualizacion de silabo', res)

      } catch (err) {
        console.dir(err)
      }
    },

    async verficarResponsableSilabo () {
      let teorico = false,
        practico = false,
        spteorico = false,
        sppractico = false,
        svteorico = false,
        svpractico = false

      if (this.teorico != null) {
        teorico = this.teorico.some(t => t.nombre_docente == '')
      }

      if (this.practico != null) {
        practico = this.practico.some(t => t.nombre_docente == '')
      }

      if (this.spteorico != null) {
        spteorico = this.spteorico.some(t => t.nombre_docente == '')
      }

      if (this.sppractico != null) {
        sppractico = this.sppractico.some(t => t.nombre_docente == '')
      }

      if (this.svteorico != null) {
        svteorico = this.svteorico.some(t => t.nombre_docente == '')
      }

      if (this.svpractico != null) {
        svpractico = this.svpractico.some(t => t.nombre_docente == '')
      }

      // 
      // 
      // 
      // 
      // 
      // 

      if (!teorico && !practico && !spteorico && !sppractico && !svteorico && !svpractico) {
        if (this.docentes.length === 1) {
          this.docentes.map(d => {
            d.responsable_silabus = 1
            this.actualizarResponsableSilabo(d)
          })
        }
      }

    },

    async responsableSilabo (arr, curso) {
      if (curso.id_docente != '') {
        // let idDocente = curso.id_docente
        arr.map(el => {
          if (el.id_docente == curso.id_docente) {
            el.responsable_silabus = 1
          } else {
            el.responsable_silabus = 0
          }
          this.actualizarResponsableSilabo(el)
        })
      }

    },

    async changeNum (reg, type) {
      let seccionNueva
      if (type == 1) {
        seccionNueva = parseInt(reg.numero_seccion) - 1
      }

      if (type == 2) {
        seccionNueva = parseInt(reg.numero_seccion) + 1
      }

      this.$set(reg, 'seccion_nueva', seccionNueva)

      await this.changeSeccion(reg)
    },

    async changeSeccion (reg) {
      try {
        const res = await this.axios.post(`${this.URL}changeSeccion`, reg)


        if(res.status !== 201) return

        this.init()

      } catch (err) {
        console.dir(err)
      }
    }


  }

}
</script>

<style lang="scss" scoped>
.resaltado {
  box-shadow: 10px 10px 5px 0px rgba(41, 12, 12, 0.672);
  border: 1.5px solid rgb(71, 162, 247);
}
</style>


