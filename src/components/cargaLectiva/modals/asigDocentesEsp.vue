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

  <div class="ed-item txt-center">
    <el-button @click="cursoModal = true" type="danger" size="mini">
      Fusionar
    </el-button>
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
        <input @input="buscarDocente(dataBuscarDocente)" v-model="dataBuscarDocente" type="text" class="form-control resaltado"
          id="docente">
      </div>
    </div>

    <div v-if="docentesBusqueda != null" class="ed-item s-95 m-70 to-center ed-container table-content mh">
      <table class="table table-responsive table-striped table-bordered table-hover table-own">
        <thead class="table-head">
          <tr>
            <th>Docente</th>
            <th>Horas Asignadas</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr @click="seleccionarDocente(docente)" v-for="(docente, index) in docentesBusqueda" :key="index">
            <td>{{docente.nombre}}</td>
            <td>{{docente.total_horas}}</td>
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
            <!-- <th>Silabo</th> -->
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="(t, index) in teorico" :key="index">
            <td>
              {{t.nombre_docente}}
            </td>
            <td>{{t.numero_alumnos_seccion}}</td>
            <td>
              <input class="form-control w-90" type="text" v-model="t.seccion">
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
            <!-- <td @click="responsableSilabo(teorico, t)">
                                    <i v-if="t.responsable_silabus == 1" class="fas fa-paperclip action"></i>
                                </td> -->
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
              <input class="form-control h-50 w-90" type="text" v-model="p.seccion">
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
            <!-- <td @click="responsableSilabo(practico, p)" class="hint--left hint--info" :aria-label="p.responsable_silabus == 1 ? '':p.id_docente == '' ? 'Asignar Docente Primero' : 'Hacer Responsable de Silabo'">
                                    <i v-if="p.responsable_silabus == 1" class="fas fa-paperclip action"></i>
                                </td> -->
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
              <input class="form-control w-90" type="text" v-model="t.seccion">
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
            <!-- <td @click="responsableSilabo(teorico, t)">
                                    <i v-if="t.responsable_silabus == 1" class="fas fa-paperclip action"></i>
                                </td> -->
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
              <input class="form-control h-50 w-90" type="text" v-model="p.seccion">
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
            <!-- <td @click="responsableSilabo(practico, p)" class="hint--left hint--info" :aria-label="p.responsable_silabus == 1 ? '':p.id_docente == '' ? 'Asignar Docente Primero' : 'Hacer Responsable de Silabo'">
                                    <i v-if="p.responsable_silabus == 1" class="fas fa-paperclip action"></i>
                                </td> -->
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
              <input class="form-control w-90" type="text" v-model="t.seccion">
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
            <!-- <td @click="responsableSilabo(teorico, t)">
                                    <i v-if="t.responsable_silabus == 1" class="fas fa-paperclip action"></i>
                                </td> -->
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
              <input class="form-control h-50 w-90" type="text" v-model="p.seccion">
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
            <!-- <td @click="responsableSilabo(practico, p)" class="hint--left hint--info" :aria-label="p.responsable_silabus == 1 ? '':p.id_docente == '' ? 'Asignar Docente Primero' : 'Hacer Responsable de Silabo'">
                                    <i v-if="p.responsable_silabus == 1" class="fas fa-paperclip action"></i>
                                </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="cursoModal" class="modal">
    <buscar-curso 
      @close="cursoModal = false" 
      :id_facultad="facultad.id_facultad" 
      :tmp_id_fusion="curso.id_asignatura" 
      :id_asigdoc="teorico[0].id_asigdoc"
      :id_filial="curso.id_filial"
      :id_modalidad="curso.id_modalidad"/>
  </div>
</div>
</template>

<script>
import MixinInit from '../../../mixing/mixing_init.js'

import loading from '../../templates/loading'

import GxDocente from '../../../models/gx_docente'

import buscarCurso from './buscarCurso.vue'

export default {
  mixins: [
    MixinInit
  ],

  props: [
    'curso',
    'teorico',
    'practico',
    'spteorico',
    'sppractico',
    'svteorico',
    'svpractico',
    'facultad'
  ],

  components: {
    loading,
    buscarCurso
  },

  beforeMount() {
    // this.colocarNombreDocente(this.teorico)
    // this.colocarNombreDocente(this.practico)
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

    cursoModal: false
  }),

  watch: {
    dataBuscarDocente: function (n) {
      this.dataBuscarDocente = n.toUpperCase()
    }
  },

  methods: {
    init() {
      this.teclasRapidas()
      this.getDetalleAsignatura()
      this.allDocentes()
    },

    teclasRapidas() {
      document.addEventListener('keyup', ev => {
        if (ev.key === 'Escape') {
          this.close()
        }
      })

      document.querySelector('#docente').focus()
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

    getDetalleAsignatura: function () {
      this.axios.get(`${this.URL}js-det-asignatura/${this.entorno.version_final}/${this.curso.id_asignatura}/${this.curso.id_filial}/${this.curso.id_modalidad}`)
        .then(res => {
          if (res.data.success) {
            this.detailAsignatura = res.data.data
          }
        })
        .catch(err => {
          console.dir(err)
        })
    },

    getDetalleDocente: async function (param) {
      if (param.id_docente != '') {

        await this.axios.get(`${this.URL}js-docente/${param.id_docente}`, this.autho)
          .then(res => {

            if (res.data.success) {
              param.nombre_docente = res.data.data.nombre
            }
          })
          .catch(err => {
            console.dir(err)
          })
      }
    },

    colocarNombreDocente: async function (arr) {
      if (arr != null) {
        arr = arr.map(a => {
          this.getDetalleDocente(a)
          return a
        })
      }
    },

    close: function () {
      this.$emit('close')
    },

    verificar: function () {
      this.colocarNombreDocente(this.teorico)
      this.colocarNombreDocente(this.practico)
    },

    buscarDocente: async function (dataBuscarDocente, re = false) {
      if (this.dataBuscarDocente.length >= 3) {
        await this.axios.get(`${this.URL}js-docente-horas/${this.entorno.version_ingreso}/${dataBuscarDocente}`, this.autho)
          .then(res => {
            if (res.data.success) {
              this.docentesBusqueda = res.data.data

              if (re) {
                this.docenteSelect = this.docentesBusqueda.filter(d => d.id_docente == this.docenteSelect.id_docente)[0]
              } else if (this.docentesBusqueda.length == 1) {
                this.docenteSelect = this.docentesBusqueda[0]
              }

            } else {
              this.docentesBusqueda = null
            }
          })
          .catch(err => {
            console.dir(err)
          })
      } else {
        this.docentesBusqueda = null
      }

    },

    seleccionarDocente: function (docente) {
      this.docenteSelect = docente
    },

    asignarDocente: async function (asigdoc, tipo_hora, index) {
      asigdoc.id_docente = this.docenteSelect.id_docente
      asigdoc.nombre_docente = this.docenteSelect.nombre
      asigdoc.responsable_silabus = 0

      if (tipo_hora == 'hp') {
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

      if (tipo_hora == 'spht') {
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

      if (tipo_hora == 'sphp') {
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
      this.verificarHoras()
      this.verficarResponsableSilabo()
    },

    desasignarDocente: async function (asigdoc) {
      this.docentesBusqueda = null
      this.dataBuscarDocente = asigdoc.nombre_docente
      asigdoc.id_docente = ''
      asigdoc.nombre_docente = ''
      asigdoc.seccion = ''
      asigdoc.responsable_silabus = 0
      asigdoc.horas_academicas_asignadas = 0

      await this.axios.put(`${this.URL}js-upt-docente/${asigdoc.id_asigdoc}`, asigdoc, this.autho)
        .then(res => {
          if (this.docentesBusqueda != null && this.docenteSelect != null) {
            this.buscarDocente(this.dataBuscarDocente, true)
            this.allDocentes()
            this.correrPA(asigdoc.id_docente)
          } else {
            this.buscarDocente(this.dataBuscarDocente, false)
            this.allDocentes()
          }
        })
        .catch(err => {
          console.dir(err)
        })
      this.verificarHoras()
    },

    verificarHoras: function () {
      setTimeout(() => {

        if (this.docenteSelect.total_horas >= 21) {
          let horas_admi = 40 - parseInt(this.docenteSelect.total_horas)
          this.actualizarHorasAdmni(this.docenteSelect.id_docente, horas_admi)
        } else if (this.docenteSelect.horas_administrativas > 0) {
          this.actualizarHorasAdmni(this.docenteSelect.id_docente, 0)
        }

      }, 1000);
    },

    actualizarHorasAdmni: function (id_docente, horas) {
      this.axios.put(`${this.URL}js-docente-ha/${id_docente}/${horas}`, {}, this.autho)
        .then(res => {

        })
        .catch(err => {
          console.dir(err)
        })
    },

    correrPA: async function (id_docente) {
      await this.axios.post(`${this.URL}js-docente-calc-horas/${id_docente}/${this.periodo.id_periodo}/${this.periodo.id_semestre}`, {}, this.autho)
        .then(res => {
        })
        .catch(err => {
          console.dir(err)
        })
    },

    actualizarResponsableSilabo: async function (curso) {
      await this.axios.post(`${this.URL}js-silabo-asigdoc`, curso, this.autho)
        .then(res => {
        })
        .catch(err => {
          console.dir(err)
        })
    },

    verficarResponsableSilabo: async function () {
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

    responsableSilabo: async function (arr, curso) {
      if (curso.id_docente != '') {
        let idDocente = curso.id_docente
        arr.map(el => {
          if (el.id_docente == curso.id_docente) {
            el.responsable_silabus = 1
          } else {
            el.responsable_silabus = 0
          }
          this.actualizarResponsableSilabo(el)
        })
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


